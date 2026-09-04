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
  try {
    // 1. Get latest ASJ ticket
    console.log("Fetching latest ASJ ticket...");
    const res = await jiraFetch(`/rest/api/3/search/jql`, {
      method: 'POST',
      body: JSON.stringify({
        jql: 'project = "ASJ" ORDER BY created DESC',
        maxResults: 1
      })
    });
    const data = await res.json();
    const issueKey = data.issues[0].key;
    console.log("Latest ASJ ticket:", issueKey);

    // 2. Get transitions for it
    const transRes = await jiraFetch(`/rest/api/3/issue/${issueKey}/transitions`);
    const transData = await transRes.json();
    console.log(`Transitions for ${issueKey}:`);
    console.log(JSON.stringify(transData.transitions, null, 2));

  } catch (e) {
    console.error(e);
  }
}

run();
