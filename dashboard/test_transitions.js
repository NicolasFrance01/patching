import dotenv from 'dotenv';
dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

function getBasicAuthHeader() {
  return `Basic ${Buffer.from(`${JIRA_USER}:${JIRA_TOKEN}`).toString("base64")}`;
}

async function jiraFetch(path) {
  return await fetch(`${JIRA_BASE_URL}${path}`, {
    headers: {
      Authorization: getBasicAuthHeader(),
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
}

async function run() {
  console.log("Fetching transitions for GP-13371...");
  try {
    const res = await jiraFetch(`/rest/api/3/issue/GP-13371/transitions`);
    
    if (!res.ok) {
      console.log("Failed:", res.status, await res.text());
    } else {
      const data = await res.json();
      console.log("Transitions:", JSON.stringify(data.transitions, null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}

run();
