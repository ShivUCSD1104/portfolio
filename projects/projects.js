// Step 1.3: Import required functions from global.js
import { fetchJSON, renderProjects } from '../global.js';

// Step 1.3: Fetch project data from JSON file
const projects = await fetchJSON('../lib/projects.json');

// Step 1.3: Select the projects container
const projectsContainer = document.querySelector('.projects');

// Step 1.6: Add project count functionality
const projectsTitle = document.querySelector('.projects-title');

// Step 4.1: Get search input
const searchInput = document.querySelector('#search-input');

// Step 5.2: Track selected wedge index
let selectedIndex = -1;

/* 
 * Step 5.4: THE FINAL PITFALL - Understanding the Bug
 * 
 * ISSUE: Users cannot combine search filtering AND pie chart year filtering at the same time.
 * 
 * WHY THIS HAPPENS:
 * 1. When searching (line 138-139), we reset selectedIndex to -1, clearing any pie selection
 * 2. When clicking a pie slice (line 108), we filter ONLY by year without considering search query
 * 
 * WHICH LINES TO CHANGE TO FIX:
 * 1. Line 139: Remove "selectedIndex = -1;" to preserve pie selection when searching
 * 2. Line 108: Change from:
 *    let filteredProjects = projects.filter(p => p.year === selectedYear);
 *    To:
 *    let filteredProjects = setQuery(searchInput.value).filter(p => p.year === selectedYear);
 *    This would apply BOTH the search filter AND the year filter
 * 3. Line 100: Already handles this correctly by calling setQuery(searchInput.value)
 * 
 * EXTRA CREDIT FIX: To properly fix this, we would need to:
 * - Keep track of both the search query and selected year
 * - Always apply both filters in combination when either changes
 * - Update the pie chart to show data for the search-filtered results
 */

// Step 4.2 & 4.3: Search functionality
function setQuery(query) {
  // Step 4.3: Make search case-insensitive and search across all metadata
  const lowerQuery = query.toLowerCase();
  
  if (!query || query.trim() === '') {
    // If no query, show all projects
    return projects;
  }
  
  // Filter projects based on the query
  return projects.filter(project => {
    // Search across all project metadata
    const searchableText = [
      project.title,
      project.description,
      project.year
    ].join(' ').toLowerCase();
    
    return searchableText.includes(lowerQuery);
  });
}

// Step 4.4 & Steps 1-3: Refactored renderPieChart function
function renderPieChart(projectsData) {
  let svg = d3.select('svg');
  
  // Step 1.5: Use d3.rollup to aggregate projects by year
  let rolledData = d3.rollup(
    projectsData,
    v => v.length,  // Count the number of projects
    d => d.year     // Group by year
  );
  
  // Convert the Map to an array of objects
  // Step 2.1: Include labels in the data
  let data = Array.from(rolledData, ([year, count]) => ({ label: year, count: count }));
  
  // Sort by year
  data.sort((a, b) => a.label - b.label);
  
  // Create a pie generator
  let sliceGenerator = d3.pie()
    .value(d => d.count);
  
  // Generate the arc data from our data
  let arcData = sliceGenerator(data);
  
  // Create an arc generator
  let arcShape = d3.arc()
    .innerRadius(0)
    .outerRadius(50);
  
  // Create a color scale
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  
  // Clear existing paths
  svg.selectAll('path').remove();
  
  // Draw each slice with click handler
  arcData.forEach((d, i) => {
    svg.append('path')
      .attr('d', arcShape(d))
      .attr('fill', colors(i))
      .attr('class', selectedIndex === i ? 'selected' : '')
      // Step 5.2 & 5.3: Add click handler for selecting/filtering
      .on('click', () => {
        // Toggle selection: if clicking same wedge, deselect; otherwise select new wedge
        selectedIndex = selectedIndex === i ? -1 : i;
        
        // Update classes on all paths
        svg.selectAll('path')
          .attr('class', (_, idx) => selectedIndex === idx ? 'selected' : '');
        
        // Update classes on legend items
        legend.selectAll('li')
          .attr('class', (_, idx) => selectedIndex === idx ? 'selected' : '');
        
        // Step 5.3: Filter projects by selected year
        if (selectedIndex === -1) {
          // No selection - show all projects (respecting search filter)
          let filteredProjects = setQuery(searchInput.value);
          renderProjects(filteredProjects, projectsContainer, 'h2');
          if (projectsTitle) {
            projectsTitle.textContent = `${filteredProjects.length} Projects`;
          }
        } else {
          // Filter by selected year
          let selectedYear = data[selectedIndex].label;
          let filteredProjects = projects.filter(p => p.year === selectedYear);
          renderProjects(filteredProjects, projectsContainer, 'h2');
          if (projectsTitle) {
            projectsTitle.textContent = `${filteredProjects.length} Projects`;
          }
        }
      });
  });
  
  // Step 2.2: Adding a legend
  let legend = d3.select('.legend');
  
  // Clear any existing legend items
  legend.selectAll('li').remove();
  
  // Add legend items
  data.forEach((d, i) => {
    let li = legend.append('li');
    li.style('--color', colors(i));
    li.attr('class', selectedIndex === i ? 'selected' : '');
    li.append('span')
      .attr('class', 'swatch')
      .style('background-color', colors(i));
    li.append('span')
      .text(`${d.label} (${d.count})`);
  });
}

// Step 4.2: Add event listener for search input
searchInput.addEventListener('input', (event) => {
  // Reset selection when searching
  selectedIndex = -1;
  
  let filteredProjects = setQuery(event.target.value);
  
  // Update projects display
  renderProjects(filteredProjects, projectsContainer, 'h2');
  
  // Update project count
  if (projectsTitle) {
    projectsTitle.textContent = `${filteredProjects.length} Projects`;
  }
  
  // Step 4.4: Update pie chart to show only visible projects
  renderPieChart(filteredProjects);
});

// Initial render
renderProjects(projects, projectsContainer, 'h2');
if (projectsTitle && projects) {
  projectsTitle.textContent = `${projects.length} Projects`;
}
renderPieChart(projects);
