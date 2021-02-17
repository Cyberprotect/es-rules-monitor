require('dotenv').config();

const nodemailer = require("nodemailer");
const axios = require('axios')

const kibana_url = process.env.KIBANA_URL || 'http://localhost:5601';
const kibana_headers = { 'kbn-xsrf': 'es-rules-monitor' };
const schedule_second = parseInt(process.env.SCHEDULE_SECOND) || 600;
const mailer = nodemailer.createTransport({
    host: (process.env.MAILER_HOST).toString(),
    port: parseInt(process.env.MAILER_PORT),
    secure: Boolean(process.env.MAILER_SECURE),
    auth: {
        user: (process.env.MAILER_USER).toString(),
        pass: (process.env.MAILER_PASS).toString(),
    },
});

const main = async () => {
    while (true) {
        run();
        console.log('*** next execution scheduled in', schedule_second + 's ***')
        await new Promise(resolve => setTimeout(resolve, (schedule_second) * 1000));
    }
}

const run = async () => {

    let current_time = new Date();
    let monitor = {
        message: null,
        count_failed: 0
    };

    let response = await axios.get(kibana_url + '/api/detection_engine/rules/_find?page=1&per_page=2000&sort_field=enabled&sort_order=desc', { headers: kibana_headers })
        .catch(error => console.log('kibana response error', error.response))

    monitor.message = '<table><tr><th>ID</th><th>Name</th><th>Time</th><th>Error</th></tr>'

    if(!(response && response.data && response.data.data && response.data.data.length > 0)) {
        console.log('kibana response is empty');
        return;
    }

    for (let i in response.data.data) {
        let rule = response.data.data[i];
        if (new Date(rule.last_failure_at) >= new Date(current_time.getTime() - (schedule_second * 1000))) {
            monitor.count_failed++;
            monitor.message += `<tr><td>${rule.id}</td><td>${rule.name}</td><td>${rule.last_failure_at}</td><td>${rule.last_failure_message}</td></tr>`
        }
    }

    monitor.message += '</table>'

    console.log('found', monitor.count_failed, 'rule(s) with at least one failure');

    if (monitor.count_failed > 0) {


        let mail_sent = await mailer.sendMail({
            from: (process.env.MAILER_FROM).toString(),
            to: (process.env.MAILER_TO).toString(),
            subject: (process.env.MAILER_SUBJECT).toString() + ` - ${monitor.count_failed} have failed`, // Subject line
            html: monitor.message,
        })

        console.log("message sent: %s", mail_sent.messageId);
    }
}

main();
