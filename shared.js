document.addEventListener('DOMContentLoaded', function () {

    const loadComponent = (url, placeholderSelector, onComplete) => {
        const placeholder = document.querySelector(placeholderSelector);
        if (!placeholder) {
            console.warn(`Placeholder '${placeholderSelector}' not found.`);
            return;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
                return response.text();
            })
            .then(data => {
                placeholder.innerHTML = data;
                if (onComplete) onComplete();
            })
            .catch(error => {
                console.error(`Error loading component from ${url}:`, error);
                placeholder.innerHTML = `<p style="color: red; text-align: center;">Gagal memuat komponen.</p>`;
            });
    };

    const fixLinks = (containerSelector, linkSelector) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage !== 'index.html') {
            const links = container.querySelectorAll(linkSelector);
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    link.setAttribute('href', `index.html${href}`);
                }
            });
        }
    };

    // Determine language
    const lang = document.documentElement.lang || 'id';
    const navFile = lang === 'en' ? 'nav-en.html' : 'nav.html';
    const footerFile = lang === 'en' ? 'footer-en.html' : 'footer.html';

    // Load Header and Footer in parallel
    loadComponent(navFile, 'header.container', () => {
        fixLinks('header.container', '.nav-link');
        initializeNavInteraction();
        initializeLanguageSwitcher();
    });

    loadComponent(footerFile, 'footer.container', () => {
        fixLinks('footer.container', '.footer-link');
    });

    function initializeLanguageSwitcher() {
        const toggleDesktop = document.getElementById('lang-toggle-desktop');
        const toggleMobile = document.getElementById('lang-toggle-mobile');

        const switchLanguage = () => {
            const currentPath = window.location.pathname;
            const filename = currentPath.split('/').pop() || 'index.html';
            let newFilename;

            if (lang === 'en') {
                // Determine counterpart ID page
                // index-en.html -> index.html
                // about-en.html -> about.html
                newFilename = filename.replace('-en.html', '.html');
            } else {
                // Determine counterpart EN page
                // index.html -> index-en.html
                // about.html -> about-en.html
                if (filename === 'index.html' || filename === '') {
                    newFilename = 'index-en.html';
                } else {
                    newFilename = filename.replace('.html', '-en.html');
                }
            }
            window.location.href = newFilename;
        };

        if (toggleDesktop) toggleDesktop.addEventListener('click', switchLanguage);
        if (toggleMobile) toggleMobile.addEventListener('click', switchLanguage);
    }

    function initializeNavInteraction() {
        // --- Theme Toggler ---
        const desktopToggle = document.getElementById('theme-toggle');
        const mobileToggle = document.getElementById('mobile-theme-toggle');

        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            const isDark = theme === 'dark';

            if (desktopToggle) {
                const desktopIcon = desktopToggle.querySelector('i');
                if (desktopIcon) {
                    desktopIcon.classList.toggle('fa-sun', isDark);
                    desktopIcon.classList.toggle('fa-moon', !isDark);
                }
            }

            if (mobileToggle) {
                const mobileIcon = mobileToggle.querySelector('i');
                if (mobileIcon) {
                    mobileIcon.classList.toggle('fa-sun', isDark);
                    mobileIcon.classList.toggle('fa-moon', !isDark);
                }
            }
        };

        const toggleTheme = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
        };

        applyTheme(localStorage.getItem('theme') || 'light');

        if (desktopToggle) desktopToggle.addEventListener('click', toggleTheme);
        if (mobileToggle) mobileToggle.addEventListener('click', toggleTheme);

        // --- Hamburger Menu ---
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileNav = document.getElementById('mobile-nav-links');

        if (hamburgerBtn && mobileNav) {
            const navLinks = mobileNav.querySelectorAll('a, button');
            hamburgerBtn.addEventListener('click', () => mobileNav.classList.toggle('is-open'));
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // Don't close if it's the theme toggle or lang toggle, usually we want them to stay open or close?
                    // Actually closing is fine.
                    if (mobileNav.classList.contains('is-open')) {
                        mobileNav.classList.remove('is-open');
                    }
                });
            });
        }
    }
});
