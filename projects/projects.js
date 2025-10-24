// Step 1.3: Import required functions from global.js
import { fetchJSON, renderProjects } from '../global.js';

// Step 1.3: Fetch project data from JSON file
const projects = await fetchJSON('../lib/projects.json');

// Step 1.3: Select the projects container
const projectsContainer = document.querySelector('.projects');

// Step 1.3: Render the projects with h2 heading level
renderProjects(projects, projectsContainer, 'h2');

// Step 1.6: Add project count functionality
const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle && projects) {
  projectsTitle.textContent = `Projects (${projects.length})`;
}
