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
  const issues = ['GP-13373', 'ASJ-17201'];
  for (const issue of issues) {
    console.log(`\n--- Fetching transitions for ${issue} ---`);
    const transRes = await jiraFetch(`/rest/api/3/issue/${issue}/transitions`);
    const transData = await transRes.json();
    console.log(JSON.stringify(transData.transitions, null, 2));

    const inProgressTransition = transData.transitions?.find((t) => 
      t.to.statusCategory?.key === "in-progress" || 
      t.name.toLowerCase().includes("progress") || 
      t.name.toLowerCase().includes("progreso") ||
      t.name.toLowerCase().includes("trabajo") ||
      t.to.name.toLowerCase().includes("progress")
    );
    
    if (inProgressTransition) {
        console.log(`Found transition to in progress for ${issue}: ID ${inProgressTransition.id}`);
        // Let's try to execute it
        const postRes = await jiraFetch(`/rest/api/3/issue/${issue}/transitions`, {
            method: "POST",
            body: JSON.stringify({ transition: { id: inProgressTransition.id } })
        });
        console.log(`Transition POST status: ${postRes.status}`);
        if (!postRes.ok) {
            console.log(`Transition error: ${await postRes.text()}`);
        }
    }
  }
}

run();
