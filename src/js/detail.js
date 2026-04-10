function openProjectShowModal(directProject = null) {
  const modal = document.getElementById("project-modal");
  const modalContent = modal.querySelector(".modal-content");
  modal.classList.remove("hidden");

  // Lock scroll
  document.body.style.overflow = "hidden";

  modalContent.classList.remove("modal-slide-out");
  modalContent.classList.add("modal-slide-in");

  document.getElementById("project-modal-content").innerHTML = "";
  document.getElementById("project-tags").innerHTML = "";

  document._projectEscHandler = (e) => {
    if (e.key === "Escape") projectModal.close();
  };
  document.addEventListener("keydown", document._projectEscHandler);

  setTimeout(() => {
    document.addEventListener("click", document._projectOutsideHandler);
  }, 0);

  fetchAndDisplayProjects(directProject ? () => projectModal.openDetail(directProject) : null);
}

function closeProjectShowModal() {
  const modal = document.getElementById("project-modal");
  const modalContent = modal.querySelector(".modal-content");

  modalContent.classList.remove("modal-slide-in");
  modalContent.classList.add("modal-slide-out");

  modalContent.addEventListener("animationend", () => {
    modal.classList.add("hidden");
    switchToList();
    document.body.style.overflow = "";
  }, { once: true });

  // Unlock scroll
  document.body.style.overflow = "";

  if (document._projectEscHandler) {
    document.removeEventListener("keydown", document._projectEscHandler);
    document._projectEscHandler = null;
  }

  if (document._projectOutsideHandler) {
    document.removeEventListener("click", document._projectOutsideHandler);
    document._projectOutsideHandler = null;
  }
}

function switchToList() {
  document.getElementById("modal-header-list").classList.remove("hidden");
  document.getElementById("modal-header-list").classList.add("flex");
  document.getElementById("modal-header-detail").classList.add("hidden");
  document.getElementById("modal-header-detail").classList.remove("flex");
  document.getElementById("modal-filter-bar").classList.remove("hidden");
  document.getElementById("modal-body-list").classList.remove("hidden");
  document.getElementById("modal-body-detail").classList.add("hidden");
}

function switchToDetail() {
  document.getElementById("modal-header-list").classList.add("hidden");
  document.getElementById("modal-header-list").classList.remove("flex");
  document.getElementById("modal-header-detail").classList.remove("hidden");
  document.getElementById("modal-header-detail").classList.add("flex");
  document.getElementById("modal-filter-bar").classList.add("hidden");
  document.getElementById("modal-body-list").classList.add("hidden");
  document.getElementById("modal-body-detail").classList.remove("hidden");
}

function openProjectDetail(project) {
  switchToDetail();

  const uiLang = window.__ENV__?.LANG === "en" ? "en" : "id";
  const descText =
    project.desc && typeof project.desc === "object" && "id" in project.desc
      ? project.desc[uiLang]
      : project.desc;

  document.getElementById("modal-detail-title").textContent = project.title;
  document.getElementById("detail-desc").textContent = descText;

  const img = document.getElementById("detail-img");
  img.src = `assets/img/projects/${project.img}`;
  img.alt = project.title;

  // Tags
  const tagsEl = document.getElementById("detail-tags");
  tagsEl.innerHTML = "";
  project.tag.forEach((tag) => {
    const span = document.createElement("span");
    span.className =
      "px-2.5 py-0.5 text-xs rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800";
    span.textContent = tag;
    tagsEl.appendChild(span);
  });

  // Links
  const linksEl = document.getElementById("detail-links");
  linksEl.innerHTML = "";

  const gitUrl = project.url?.git ?? project.url_git;
  if (gitUrl) {
    const a = document.createElement("a");
    a.href = gitUrl;
    a.target = "_blank";
    a.className =
      "text-xs px-3.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-500 transition-colors";
    a.innerHTML = '<i class="fab fa-github mr-1"></i>GitHub';
    linksEl.appendChild(a);
  }

  const appUrl = project.url?.app ?? project.url_app;
  if (appUrl) {
    const a = document.createElement("a");
    a.href = appUrl;
    a.target = "_blank";
    a.className =
      "text-xs px-3.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-500 transition-colors";
    a.innerHTML = '<i class="fas fa-external-link-alt mr-1"></i>Visit App';
    linksEl.appendChild(a);
  }
}

function fetchAndDisplayProjects(onReady) {
  fetch(`assets/data/project.json`)
    .then((r) => r.json())
    .then((projects) => {
      const allTags = new Set();
      projects.forEach((p) => p.tag.forEach((t) => allTags.add(t)));

      const tagsContainer = document.getElementById("project-tags");
      const sortedTags = Array.from(allTags).sort();

      const allBtn = document.createElement("button");
      allBtn.className =
        "px-3 py-1 text-xs rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 transition-colors flex-shrink-0";
      allBtn.textContent = "All";
      allBtn.dataset.active = "true";
      allBtn.onclick = () => {
        tagsContainer.querySelectorAll("button").forEach((b) => {
          b.dataset.active = "false";
          b.className =
            "px-3 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-500 transition-colors flex-shrink-0";
        });
        allBtn.dataset.active = "true";
        allBtn.className =
          "px-3 py-1 text-xs rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 transition-colors flex-shrink-0";
        filterProjects(projects, []);
      };
      tagsContainer.appendChild(allBtn);

      sortedTags.forEach((tag) => {
        const btn = document.createElement("button");
        btn.className =
          "px-3 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-500 transition-colors flex-shrink-0";
        btn.textContent = tag;
        btn.dataset.active = "false";
        btn.onclick = () => {
          btn.dataset.active = btn.dataset.active === "true" ? "false" : "true";

          const activeTags = Array.from(
            tagsContainer.querySelectorAll("button[data-active='true']"),
          )
            .map((b) => b.textContent)
            .filter((t) => t !== "All");

          // Sync style
          tagsContainer.querySelectorAll("button").forEach((b) => {
            if (b.textContent === "All") return;
            if (b.dataset.active === "true") {
              b.className =
                "px-3 py-1 text-xs rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 transition-colors flex-shrink-0";
            } else {
              b.className =
                "px-3 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-500 transition-colors flex-shrink-0";
            }
          });

          if (activeTags.length === 0) {
            allBtn.dataset.active = "true";
            allBtn.className =
              "px-3 py-1 text-xs rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 transition-colors flex-shrink-0";
          } else {
            allBtn.dataset.active = "false";
            allBtn.className =
              "px-3 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-500 transition-colors flex-shrink-0";
          }

          filterProjects(projects, activeTags);
        };
        tagsContainer.appendChild(btn);
      });

      displayProjects(projects);
      if (onReady) onReady(projects);
    })
    .catch((err) => console.error("Error fetching projects:", err));
}

function displayProjects(projects) {
  const container = document.getElementById("project-modal-content");
  container.innerHTML = "";
  const template = document.getElementById("project-card-template");

  const uiLang = window.__ENV__?.LANG === "en" ? "en" : "id";

  projects.forEach((project) => {
    const card = template.cloneNode(true);
    card.id = "";
    card.classList.remove("hidden");

    const img = card.querySelector("img");
    img.src = `assets/img/projects/${project.img}`;
    img.alt = project.title;

    card.querySelector("h3").textContent = project.title;

    const descText =
      project.desc && typeof project.desc === "object" && "id" in project.desc
        ? project.desc[uiLang]
        : project.desc;
    card.querySelector("p").textContent = descText;

    // Chips — max 3 visible, sisanya +N more
    const tagsEl = card.querySelector(".tags-container");
    const maxVisible = 3;
    project.tag.slice(0, maxVisible).forEach((tag) => {
      const span = document.createElement("span");
      span.className =
        "px-1.5 py-0.5 text-[10px] rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 flex-shrink-0";
      span.textContent = tag;
      tagsEl.appendChild(span);
    });

    if (project.tag.length > maxVisible) {
      const more = document.createElement("span");
      more.className =
        "text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0";
      more.textContent = `+${project.tag.length - maxVisible} more`;
      tagsEl.appendChild(more);
    }

    // Klik card → buka detail
    card.querySelector(".project-card").onclick = () =>
      openProjectDetail(project);

    container.appendChild(card);
  });
}

function filterProjects(projects, selectedTags) {
  const filtered =
    selectedTags.length > 0
      ? projects.filter((p) => selectedTags.every((t) => p.tag.includes(t)))
      : projects;
  displayProjects(filtered);
}

window.projectModal = {
  open: openProjectShowModal,
  close: closeProjectShowModal,
  closeDetail: switchToList,
  openDetail: openProjectShowModal
};