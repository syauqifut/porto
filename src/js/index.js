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

window.addEventListener('scroll', () => {
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const contactTop = contactSection.offsetTop;
    const contactBottom = contactTop + contactSection.offsetHeight;
    const currentScroll = window.pageYOffset;

    // In hero section
    if (currentScroll < heroBottom) {
        // navbar.classList.remove('nav-visible');
        // navbar.classList.add('nav-hidden');

        navbar.classList.remove('translate-y-0');
        navbar.classList.add('-translate-y-full');
        footer.classList.remove('translate-y-0');
        footer.classList.add('translate-y-full');
    } else {
        // navbar.classList.remove('nav-hidden');
        // navbar.classList.add('nav-visible');

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
});

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