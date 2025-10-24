// Step 2.1: Import required functions from global.js
import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// Step 2.1: Fetch and filter projects to get the first 3
const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);

// Step 2.1: Select the projects container
const projectsContainer = document.querySelector('.projects');

// Step 3.2: Fetch GitHub data for the specified user
const githubData = await fetchGitHubData('shivucsd1104');

// Step 3.2: Select the profile stats container
const profileStats = document.querySelector('#profile-stats');

// Step 3.2: Update the HTML with GitHub data
if (profileStats) {
  profileStats.innerHTML = `
        <dl>
          <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
          <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
          <dt>Followers:</dt><dd>${githubData.followers}</dd>
          <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
    `;
}

// Step 2.1: Render the latest projects with h2 heading level (AFTER GitHub data processing)
renderProjects(latestProjects, projectsContainer, 'h2');
