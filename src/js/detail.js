function openProjectShowModal() {
  const modal = document.getElementById("project-modal");
  // modal.style.display = 'block';
  modal.classList.remove("hidden");

  // Clear existing content
  const projectsContainer = document.getElementById("project-modal-content");
  const tagsContainer = document.getElementById("project-tags");
  if (projectsContainer) projectsContainer.innerHTML = "";
  if (tagsContainer) tagsContainer.innerHTML = "";

  fetchAndDisplayProjects();
}

function closeProjectShowModal() {
  const modal = document.getElementById("project-modal");
  // modal.style.display = 'hidden';
  modal.classList.add("hidden");
}

function fetchAndDisplayProjects() {
  fetch("assets/data/en/project.json")
    .then((response) => response.json())
    .then((projects) => {
      const projectsContainer = document.getElementById(
        "project-modal-content"
      );
      if (!projectsContainer) return;

      // Get all unique tags
      const allTags = new Set();
      projects.forEach((project) => {
        project.tag.forEach((tag) => {
          allTags.add(tag);
        });
      });

      // Display tags
      const tagsContainer = document.getElementById("project-tags");
      const sortedTags = Array.from(allTags).sort();
      
      // Add "All" tag
      const allTagButton = document.createElement("button");
      allTagButton.className = "px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors active dark:bg-blue-600 dark:hover:bg-blue-700";
      allTagButton.textContent = "All";
      allTagButton.onclick = () => {
        // Reset all tags to inactive
        document.querySelectorAll("#project-tags button").forEach(btn => {
          if (btn.textContent !== "All") {
            btn.classList.remove("active", "bg-blue-500", "text-white", "dark:bg-blue-600");
            btn.classList.add("bg-gray-200", "text-gray-700", "dark:bg-gray-700", "dark:text-gray-300");
          }
        });
        // Set "All" as active
        allTagButton.classList.add("active", "bg-blue-500", "text-white", "dark:bg-blue-600");
        filterProjects(projects, []);
      };
      tagsContainer.appendChild(allTagButton);

      // Add other tags
      sortedTags.forEach(tag => {
        const tagButton = document.createElement("button");
        tagButton.className = "px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600";
        tagButton.textContent = tag;
        tagButton.onclick = () => {
          // Toggle active state
          tagButton.classList.toggle("active");
          tagButton.classList.toggle("bg-blue-500");
          tagButton.classList.toggle("text-white");
          tagButton.classList.toggle("bg-gray-200");
          tagButton.classList.toggle("text-gray-700");
          tagButton.classList.toggle("dark:bg-blue-600");
          tagButton.classList.toggle("dark:bg-gray-700");
          tagButton.classList.toggle("dark:text-gray-300");

          // Get all active tags
          const activeTags = Array.from(document.querySelectorAll("#project-tags button.active"))
            .filter(btn => btn.textContent !== "All")
            .map(btn => btn.textContent);

          // If no tags are selected, show all projects
          if (activeTags.length === 0) {
            allTagButton.classList.add("active", "bg-blue-500", "text-white", "dark:bg-blue-600");
            filterProjects(projects, []);
          } else {
            allTagButton.classList.remove("active", "bg-blue-500", "text-white", "dark:bg-blue-600");
            allTagButton.classList.add("bg-gray-200", "text-gray-700", "dark:bg-gray-700", "dark:text-gray-300");
            filterProjects(projects, activeTags);
          }
        };
        tagsContainer.appendChild(tagButton);
      });

      // Initial display of all projects
      displayProjects(projects);
    })
    .catch((error) => {
      console.error("Error fetching projects:", error);
    });
}

function displayProjects(projects) {
  const projectsContainer = document.getElementById("project-modal-content");
  projectsContainer.innerHTML = "";

  const template = document.getElementById("project-card-template");

  projects.forEach((project) => {
    const card = template.cloneNode(true);

    // Set image
    const img = card.querySelector("img");
    img.src = `assets/img/projects/${project.img}`;
    img.alt = project.title;

    // Set title
    card.querySelector("h3").textContent = project.title;

    // Set description
    card.querySelector("p").textContent = project.desc;

    // Set tags
    const tagsContainer = card.querySelector(".tags-container");
    project.tag.forEach((tag) => {
      const tagSpan = document.createElement("span");
      tagSpan.className =
        "px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm";
      tagSpan.textContent = tag;
      tagsContainer.appendChild(tagSpan);
    });

    // Set links
    const githubLinkContainer = card.querySelector(".github-link");
    const appLinkContainer = card.querySelector(".app-link");

    if (project.url_git) {
      const gitLink = document.createElement("a");
      gitLink.href = project.url_git;
      gitLink.target = "_blank";
      gitLink.className = "text-gray-600 hover:text-gray-800";
      gitLink.innerHTML = '<i class="fab fa-github"></i> GitHub';
      githubLinkContainer.appendChild(gitLink);
    }

    if (project.url_app) {
      const appLink = document.createElement("a");
      appLink.href = project.url_app;
      appLink.target = "_blank";
      appLink.className = "text-blue-600 hover:text-blue-800";
      appLink.innerHTML = '<i class="fas fa-external-link-alt"></i> Visit App';
      appLinkContainer.appendChild(appLink);
    }

    projectsContainer.appendChild(card);
  });
}

function filterProjects(projects, selectedTags) {
  // Filter projects
  const filteredProjects = selectedTags.length > 0
    ? projects.filter(project => selectedTags.every(tag => project.tag.includes(tag)))
    : projects;

  displayProjects(filteredProjects);
}

window.projectModal = {
  open: openProjectShowModal,
  close: closeProjectShowModal,
};
