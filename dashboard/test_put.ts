import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

function getBasicAuthHeader() {
  return `Basic ${Buffer.from(`${JIRA_USER}:${JIRA_TOKEN}`).toString("base64")}`;
}

async function run() {
    const issueKey = "GP-13548"; // The one from the user's screenshot
    const res = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`, {
        method: "PUT",
        headers: {
            Authorization: getBasicAuthHeader(),
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            fields: {
                customfield_10051: 9999999 // Send a fake ID to see if it lists valid ones
            }
        })
    });
    const data = await res.json().catch(() => null) || await res.text();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    const res2 = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`, {
        method: "PUT",
        headers: {
            Authorization: getBasicAuthHeader(),
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            fields: {
                customfield_10051: { name: "GP | InO | Abono" }
            }
        })
    });
    const data2 = await res2.json().catch(() => null) || await res2.text();
    console.log("Status with name:", res2.status);
    console.log("Response with name:", JSON.stringify(data2, null, 2));
}

run().catch(console.error);
