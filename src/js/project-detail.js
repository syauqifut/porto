import { loadConfig } from '../../utils/load-config.js';
const config = await loadConfig();
let isProjectViewTransitioning = false;

function clearProjectViewAnimationClasses(el) {
  el.classList.remove(
    "modal-slide-left-out",
    "modal-slide-left-in",
    "modal-slide-right-out",
    "modal-slide-right-in",
  );
}

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

  document._projectOutsideHandler = (e) => {
    if (!modal.classList.contains("hidden") && !e.target.closest("#project-modal")) {
      projectModal.close();
    }
  };
  setTimeout(() => {
    document.addEventListener("click", document._projectOutsideHandler);
  }, 0);

  if (directProject) {
    openProjectDetail(directProject, { animate: false });
    fetchAndDisplayProjects();
    return;
  }

  switchToList(false);
  fetchAndDisplayProjects();
}

function closeProjectShowModal() {
  const modal = document.getElementById("project-modal");
  const modalContent = modal.querySelector(".modal-content");

  modalContent.classList.remove("modal-slide-in");
  modalContent.classList.add("modal-slide-out");

  modalContent.addEventListener("animationend", () => {
    modal.classList.add("hidden");
    switchToList(false);
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

function switchToList(animate = true) {
  const headerList = document.getElementById("modal-header-list");
  const headerDetail = document.getElementById("modal-header-detail");
  const filterBar = document.getElementById("modal-filter-bar");
  const bodyList = document.getElementById("modal-body-list");
  const bodyDetail = document.getElementById("modal-body-detail");

  if (!animate) {
    clearProjectViewAnimationClasses(bodyList);
    clearProjectViewAnimationClasses(bodyDetail);
    bodyList.classList.remove("hidden");
    bodyDetail.classList.add("hidden");
    headerList.classList.remove("hidden");
    headerList.classList.add("flex");
    headerDetail.classList.add("hidden");
    headerDetail.classList.remove("flex");
    filterBar.classList.remove("hidden");
    isProjectViewTransitioning = false;
    return;
  }

  if (isProjectViewTransitioning || bodyDetail.classList.contains("hidden")) return;
  isProjectViewTransitioning = true;

  clearProjectViewAnimationClasses(bodyList);
  clearProjectViewAnimationClasses(bodyDetail);

  bodyDetail.classList.remove("hidden");
  bodyDetail.classList.add("modal-slide-right-out");

  bodyDetail.addEventListener(
    "animationend",
    () => {
      clearProjectViewAnimationClasses(bodyDetail);
      bodyDetail.classList.add("hidden");

      headerDetail.classList.add("hidden");
      headerDetail.classList.remove("flex");
      headerList.classList.remove("hidden");
      headerList.classList.add("flex");
      filterBar.classList.remove("hidden");

      bodyList.classList.remove("hidden");
      bodyList.classList.add("modal-slide-right-in");

      bodyList.addEventListener(
        "animationend",
        () => {
          clearProjectViewAnimationClasses(bodyList);
          isProjectViewTransitioning = false;
        },
        { once: true },
      );
    },
    { once: true },
  );
}

function switchToDetail(animate = true) {
  const headerList = document.getElementById("modal-header-list");
  const headerDetail = document.getElementById("modal-header-detail");
  const filterBar = document.getElementById("modal-filter-bar");
  const bodyList = document.getElementById("modal-body-list");
  const bodyDetail = document.getElementById("modal-body-detail");

  if (!animate) {
    clearProjectViewAnimationClasses(bodyList);
    clearProjectViewAnimationClasses(bodyDetail);
    bodyList.classList.add("hidden");
    bodyDetail.classList.remove("hidden");
    headerList.classList.add("hidden");
    headerList.classList.remove("flex");
    headerDetail.classList.remove("hidden");
    headerDetail.classList.add("flex");
    filterBar.classList.add("hidden");
    isProjectViewTransitioning = false;
    return;
  }

  if (isProjectViewTransitioning || bodyList.classList.contains("hidden")) return;
  isProjectViewTransitioning = true;

  clearProjectViewAnimationClasses(bodyList);
  clearProjectViewAnimationClasses(bodyDetail);

  bodyList.classList.remove("hidden");
  bodyList.classList.add("modal-slide-left-out");

  bodyList.addEventListener(
    "animationend",
    () => {
      clearProjectViewAnimationClasses(bodyList);
      bodyList.classList.add("hidden");

      headerList.classList.add("hidden");
      headerList.classList.remove("flex");
      headerDetail.classList.remove("hidden");
      headerDetail.classList.add("flex");
      filterBar.classList.add("hidden");

      bodyDetail.classList.remove("hidden");
      bodyDetail.classList.add("modal-slide-left-in");

      bodyDetail.addEventListener(
        "animationend",
        () => {
          clearProjectViewAnimationClasses(bodyDetail);
          isProjectViewTransitioning = false;
        },
        { once: true },
      );
    },
    { once: true },
  );
}

function getLocalizedValue(value, uiLang) {
  if (value && typeof value === "object") {
    return value[uiLang] ?? value.id ?? value.en ?? "";
  }
  return value ?? "";
}

function openProjectDetail(project, options = {}) {
  if (options.animate === false) {
    switchToDetail(false);
  } else {
    if (isProjectViewTransitioning) return;
    switchToDetail(true);
  }

  const uiLang = config.LANG === "en" ? "en" : "id";
  const descText = getLocalizedValue(project.desc, uiLang);
  const yearText = getLocalizedValue(project.year, uiLang);
  const roleText = project.role ?? "";
  const statusText = getLocalizedValue(project.status, uiLang);

  const titleWithYear = yearText ? `${project.title} (${yearText})` : project.title;
  document.getElementById("modal-detail-title").textContent = titleWithYear;
  document.getElementById("detail-desc").textContent = descText;

  const img = document.getElementById("detail-img");
  img.src = `assets/img/projects/${project.img}`;
  img.alt = project.title;

  const detailMeta = document.getElementById("detail-meta");
  const roleEl = document.getElementById("detail-role");
  const statusEl = document.getElementById("detail-status");
  roleEl.textContent = roleText ? `Role: ${roleText}` : "";
  statusEl.textContent = statusText ? `Status: ${statusText}` : "";
  detailMeta.classList.toggle("hidden", !roleText && !statusText);

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

  const gitUrl = project.url?.git;
  if (gitUrl) {
    const a = document.createElement("a");
    a.href = gitUrl;
    a.target = "_blank";
    a.className =
      "text-xs px-3.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-500 transition-colors";
    a.innerHTML = '<i class="fab fa-github mr-1"></i>GitHub';
    linksEl.appendChild(a);
  }

  const appUrl = project.url?.app;
  if (appUrl) {
    const a = document.createElement("a");
    a.href = appUrl;
    a.target = "_blank";
    a.className =
      "text-xs px-3.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-500 transition-colors";
    a.innerHTML = '<i class="fas fa-external-link-alt mr-1"></i>Visit App';
    linksEl.appendChild(a);
  }

  const demoUrl = project.url?.demo;
  if (demoUrl) {
    const a = document.createElement("a");
    a.href = demoUrl;
    a.target = "_blank";
    a.className =
      "text-xs px-3.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-500 transition-colors";
    a.innerHTML = '<i class="fas fa-external-link-alt mr-1"></i>View Demo';
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

  const uiLang = config.LANG === "en" ? "en" : "id";

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

    // Chips - max 3 visible, sisanya +N more
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

    // Klik card -> buka detail
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
  closeDetail: () => switchToList(true),
  openDetail: openProjectDetail
};
