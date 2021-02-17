# Elastic SIEM - Rules monitoring

Get alerted by email when rules failed to execute.

## How it works

1. Fetch Elastic SIEM rules via the Kibana Api
2. For each rule, check if there is a failure since the last check
3. Group failures in a human readable table (HTML)
4. Send email
5. Repeat each XX seconds

## Usage

> No need of cron jobs, this script includes a scheduler.

### Docker

Edit `docker-compose.yml` and fill the environment variables with your settings.

```bash
docker-compose up --build
```

### NodeJS

Edit `.env` and fill the environment variables with your settings. Or directly pass the environment variable when you execute the script.

```
npm run start
```

OR

```
node index.js
```

## Configuration


| name | description | type | required | default |
| ---  | ---         | ---  | ---      | ---     |
| KIBANA_URL | URL of Kibana instance | String | No | http://localhost:5601 |
| SCHEDULE_SECOND | Time (in seconds) between each checks | Integer | No | 600 |
| MAILER_HOST | Mail server address | String | Yes | - |
| MAILER_PORT | Mail server port | Integer | Yes | - |
| MAILER_SECURE | Mail server secure communication | Boolean | No | false |
| MAILER_USER | Mail server username | String | Yes | - |
| MAILER_PASS | Mail server password | String | Yes | - |
| MAILER_FROM | Address used as "from" | String | Yes | - |
| MAILER_TO | Addresses that will receives alerts (separated by comma) | String | Yes | - |
| MAILER_SUBJECT | Mail subject | String | No | [Elastic SIEM] Rules monitoring |
