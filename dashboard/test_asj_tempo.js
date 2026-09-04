import dotenv from 'dotenv';
dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

function getBasicAuthHeader() {
  return `Basic ${Buffer.from(`${JIRA_USER}:${JIRA_TOKEN}`).toString("base64")}`;
}

async function jiraFetch(path, options = {}) {
  const res = await fetch(`${JIRA_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: getBasicAuthHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers
    },
  });
  return res;
}

async function run() {
  console.log("Fetching ASJ Account...");
  try {
    const res = await jiraFetch(`/rest/api/3/search/jql`, {
      method: 'POST',
      body: JSON.stringify({
        jql: 'project = "ASJ" AND "Account" IS NOT EMPTY ORDER BY created DESC',
        maxResults: 10,
        fields: ['customfield_10051']
      })
    });
    
    if (!res.ok) {
      console.log("Search failed:", res.status, await res.text());
    } else {
      const data = await res.json();
      for (const issue of (data.issues || [])) {
        console.log(`Issue ${issue.key}:`);
        console.log(`  Account:`, JSON.stringify(issue.fields['customfield_10051']));
      }
    }
  } catch (e) {
    console.error(e);
  }
}

run();
