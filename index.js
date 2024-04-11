import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const owner = 'prathmeshbankar03';
const repo = 'issue-tracker';
const accessToken = process.env.ACCESS_TOKEN;

async function fetchIssues(state) {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=${state}`, {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(`Error fetching ${state} issues: Data is not an array`);
        }

        return data;
    } catch (error) {
        console.error(`Error fetching ${state} issues:`, error);
        throw error;
    }
}

function generateMarkdownTable(issues) {
    let markdownTable = `
| # | Issue | State |
|---|-------|-------|`;

    issues.forEach((issue, index) => {
        markdownTable += `
| ${index + 1} | [${issue.title}](${issue.html_url}) | ${issue.state} ${issue.state === "open" ? "🔓" : "🔒"} |`;
    });

    return markdownTable;
}

async function updateReadme() {
    try {
        const openIssues = await fetchIssues('open');
        const closedIssues = await fetchIssues('closed');

        const readmeContent = `
<h3 align="center">💪 Power Of CI/CD - GitHub Actions 🎬</h3>
<h4 align="center">📃 List of Issues of this Repo 🫢</h4>
### Open Issues
${generateMarkdownTable(openIssues)}

### Closed Issues
${generateMarkdownTable(closedIssues)}
`;

        fs.writeFileSync("README.md", readmeContent);
    } catch (error) {
        console.error('Error updating README:', error);
    }
}

updateReadme();
