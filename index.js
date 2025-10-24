// Step 2.1: Import required functions from global.js
import { fetchJSON, renderProjects } from './global.js';

// Step 2.1: Fetch and filter projects to get the first 3
const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);

// Step 2.1: Select the projects container
const projectsContainer = document.querySelector('.projects');

// Step 2.1: Render the latest projects with h2 heading level
renderProjects(latestProjects, projectsContainer, 'h2');
