import { loadConfig } from '../../utils/load-config.js';
const config = await loadConfig();

// Mobile menu toggle
const menuButton = document.getElementById('menuButton');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');

menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Hide navbar when scrolling in hero section
let lastScroll = 0;
const heroSection = document.getElementById('home');
const contactSection = document.getElementById('contact');
const contactButton = document.getElementById('scrollToContact');

function updateVisibility() {
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const contactTop = contactSection.offsetTop;
    const contactBottom = contactTop + contactSection.offsetHeight;
    const currentScroll = window.pageYOffset;

    // In hero section
    if (currentScroll < heroBottom) {
        navbar.classList.remove('translate-y-0');
        navbar.classList.add('-translate-y-full');
        footer.classList.remove('translate-y-0');
        footer.classList.add('translate-y-full');
    } else {
        navbar.classList.remove('-translate-y-full');
        navbar.classList.add('translate-y-0');
        footer.classList.remove('translate-y-full');
        footer.classList.add('translate-y-0');
    }

    // In contact section
    if (currentScroll >= contactTop && currentScroll < contactBottom) {
        contactButton.classList.add('hidden');
    } else {
        contactButton.classList.remove('hidden');
    }

    lastScroll = currentScroll;
}

window.addEventListener('scroll', updateVisibility);
window.addEventListener('load', updateVisibility);
updateVisibility();

// Scroll to ... section
document.getElementById('scrollToAbout').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#about').scrollIntoView({
        behavior: 'smooth'
    });
});

document.getElementById('scrollToContact').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth'
    });
});

// Read all. Article Section
const mediumUsername = config.MEDIUM_USERNAME;
if (mediumUsername) {
    document.getElementById('article-read-all').href = `https://medium.com/@${mediumUsername}`;
}

// Dot navigation in mobile project section
let projectCardsObserver;

function initProjectDots() {
  const container = document.getElementById('project-list-data');
  const dotsContainer = document.getElementById('project-dots');

  if (!container || !dotsContainer) return;

  const cards = Array.from(container.children);

  if (projectCardsObserver) {
    projectCardsObserver.disconnect();
  }

  // reset dots
  dotsContainer.innerHTML = '';

  if (!cards.length) return;

  // create dots
  cards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'w-2 h-2 rounded-full bg-gray-400 transition-colors';
    dot.dataset.index = index;
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.children;

  // observer
  projectCardsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = cards.indexOf(entry.target);

          // update active dot
          Array.from(dots).forEach((dot, i) => {
            dot.classList.toggle('bg-black', i === index);
            dot.classList.toggle('dark:bg-white', i === index);

            dot.classList.toggle('bg-gray-400', i !== index);
          });
        }
      });
    },
    {
      root: container,
      threshold: 0.6
    }
  );

  // set first dot as active at start
  Array.from(dots).forEach((dot, i) => {
    dot.classList.toggle('bg-black', i === 0);
    dot.classList.toggle('dark:bg-white', i === 0);
    dot.classList.toggle('bg-gray-400', i !== 0);
  });

  // observe each card
  cards.forEach((card) => projectCardsObserver.observe(card));
}

initProjectDots();

// re-init when project data changes (e.g. after fetch or change language)
const projectListContainer = document.getElementById('project-list-data');
if (projectListContainer) {
  const projectListMutationObserver = new MutationObserver(() => {
    initProjectDots();
  });

  projectListMutationObserver.observe(projectListContainer, {
    childList: true
  });
}