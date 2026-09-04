import dotenv from 'dotenv';
dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

function auth() {
  return `Basic ${Buffer.from(`${JIRA_USER}:${JIRA_TOKEN}`).toString("base64")}`;
}

async function run() {
  const issues = ['GP-13378', 'ASJ-17204'];
  
  for (const issue of issues) {
    console.log(`\n===== ${issue} =====`);
    
    // Get current status
    const statusRes = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issue}?fields=status`, {
      headers: { Authorization: auth(), Accept: "application/json" }
    });
    const statusData = await statusRes.json();
    console.log(`Current status: ${statusData.fields?.status?.name}`);
    
    // Get ALL transitions (including name expand)
    const transRes = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issue}/transitions?expand=transitions.fields`, {
      headers: { Authorization: auth(), Accept: "application/json" }
    });
    const transData = await transRes.json();
    console.log(`\nAll transitions available:`);
    for (const t of (transData.transitions || [])) {
      console.log(`  ID=${t.id}, name="${t.name}", to="${t.to.name}", statusCategory="${t.to.statusCategory?.key}"`);
    }
    
    // Now find and try to apply "Work in Progress"
    const wipTrans = transData.transitions?.find(t =>
      t.name === "Work in Progress" ||
      t.to.name === "Trabajo en progeso" ||
      t.to.name === "Work in progress" ||
      t.to.statusCategory?.key === "in-progress" ||
      t.to.statusCategory?.id === 4
    );
    
    if (wipTrans) {
      console.log(`\nFound WIP transition: ID=${wipTrans.id}, name="${wipTrans.name}"`);
      const applyRes = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issue}/transitions`, {
        method: "POST",
        headers: { Authorization: auth(), "Content-Type": "application/json" },
        body: JSON.stringify({ transition: { id: wipTrans.id } })
      });
      console.log(`Transition POST result: ${applyRes.status} ${applyRes.statusText}`);
      if (!applyRes.ok) console.log(await applyRes.text());
      else {
        // Check new status
        const newStatusRes = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issue}?fields=status`, {
          headers: { Authorization: auth(), Accept: "application/json" }
        });
        const newStatus = await newStatusRes.json();
        console.log(`New status: ${newStatus.fields?.status?.name}`);
      }
    } else {
      console.log("No WIP transition found!");
    }
  }
}

run();
