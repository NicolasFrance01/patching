import dotenv from 'dotenv';
dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

function getBasicAuthHeader() {
  return `Basic ${Buffer.from(`${JIRA_USER}:${JIRA_TOKEN}`).toString("base64")}`;
}

async function run() {
    console.log("Checking Service Desk Transitions for ASJ-17201...");
    const res = await fetch(`${JIRA_BASE_URL}/rest/servicedeskapi/request/ASJ-17201/transition`, {
        headers: {
            Authorization: getBasicAuthHeader(),
            Accept: "application/json"
        }
    });
    console.log(res.status, await res.text());
}
run();
