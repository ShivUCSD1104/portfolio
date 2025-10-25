// Step 1.2: fetchJSON function for loading project data
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    
    // Check if the fetch request was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    
    // Parse the response into JSON format
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

// Step 1.4: renderProjects function to dynamically generate project content
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Clear existing content to avoid duplication
  containerElement.innerHTML = '';
  
  // Loop through each project and create an article element
  for (let project of projects) {
    // Create a new article element for each project
    const article = document.createElement('article');
    
    // Define the content dynamically using innerHTML
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.year}<br>${project.description}</p>
    `;
    
    // Append the article to the container
    containerElement.appendChild(article);
  }
}

// Step 3.2: fetchGitHubData function to fetch GitHub user data
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}

// Only execute this code if not imported as a module
if (typeof window !== 'undefined') {
  console.log("IT'S ALIVE!");

  function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }

// Step 2: Automatic current page link (commented out, now handled in Step 3.2)
// let navLinks = $$("nav a");
// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );
// currentLink?.classList.add('current');

// Step 3.1: Adding the navigation menu dynamically
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'profile/', title: 'Profile' },
  { url: 'https://github.com/ShivUCSD1104', title: 'GitHub' },
];

// Detect if we're running locally or on GitHub Pages
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";       // GitHub Pages repo name

// Create navigation element and add it to the page
let nav = document.createElement('nav');
document.body.prepend(nav);

// Step 3.2: Create links with current page highlighting and external link handling
for (let p of pages) {
  let url = p.url;
  let title = p.title;
  
  // Adjust URL for internal links
  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }
  
  // Create link element
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  
  // Add current class to current page link
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname,
  );
  
  // Add target="_blank" to external links
  if (a.host !== location.host) {
    a.target = "_blank";
  }
  
  nav.append(a);
}

// Step 4.2: Add color scheme switcher
const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light";
const colorSchemeHTML = `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light dark">Automatic (` + darkModePreference + `)</option>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	</label>`;
document.body.insertAdjacentHTML('afterbegin', colorSchemeHTML);

// Step 4.4 & 4.5: Make the color scheme switcher work and save preference
const select = document.querySelector('.color-scheme select');

// Function to set color scheme
function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  select.value = colorScheme;
}

// Step 4.5: Load saved preference on page load
if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

// Step 4.4: Add event listener to save and apply preference
select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  setColorScheme(event.target.value);
  localStorage.colorScheme = event.target.value;
});

// Step 5: Better contact form (Optional)
const form = document.querySelector('form');

form?.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission
  
  // Create FormData from the form
  let data = new FormData(form);
  
  // Build the mailto URL with proper encoding
  let url = form.action + "?";
  let params = [];
  
  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }
  
  url += params.join('&');
  
  // Open email client with the properly formatted URL
  location.href = url;
});
}

