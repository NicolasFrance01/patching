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
    // Let's check Jira project transitions directly using Jira API
    // Actually, Jira workflows can be complex. Let's just look at the available statuses for a project
    const res = await jiraFetch(`/rest/api/3/project/ASJ/statuses`);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

run();
