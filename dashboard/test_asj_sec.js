import dotenv from 'dotenv';
dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

function getBasicAuthHeader() {
  return `Basic ${Buffer.from(`${JIRA_USER}:${JIRA_TOKEN}`).toString("base64")}`;
}

async function run() {
    const res = await fetch(`${JIRA_BASE_URL}/rest/api/3/search/jql`, {
        method: "POST",
        headers: {
            Authorization: getBasicAuthHeader(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jql: 'project = "ASJ" AND "Account" = "ASJ | SEC | Abono" ORDER BY created DESC',
            maxResults: 1,
            fields: ['customfield_10051']
        })
    });
    
    if (res.ok) {
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } else {
        console.log(res.status, await res.text());
    }
}
run();
