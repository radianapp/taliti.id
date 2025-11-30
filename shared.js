document.addEventListener('DOMContentLoaded', function() {

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

    // Load Header and Footer in parallel
    loadComponent('nav.html', 'header.container', () => {
        fixLinks('header.container', '.nav-link');
        initializeNavInteraction();
    });
    
    loadComponent('footer.html', 'footer.container', () => {
        fixLinks('footer.container', '.footer-link');
    });

    function initializeNavInteraction() {
        // --- Theme Toggler ---
        const desktopToggle = document.getElementById('theme-toggle');
        const mobileToggle = document.getElementById('mobile-theme-toggle');
        
        if (desktopToggle && mobileToggle) {
            const desktopIcon = desktopToggle.querySelector('i');
            const mobileIcon = mobileToggle.querySelector('i');

            const applyTheme = (theme) => {
                document.documentElement.setAttribute('data-theme', theme);
                const isDark = theme === 'dark';
                desktopIcon.classList.toggle('fa-sun', isDark);
                desktopIcon.classList.toggle('fa-moon', !isDark);
                mobileIcon.classList.toggle('fa-sun', isDark);
                mobileIcon.classList.toggle('fa-moon', !isDark);
            };

            const toggleTheme = () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                localStorage.setItem('theme', currentTheme);
                applyTheme(currentTheme);
            };

            applyTheme(localStorage.getItem('theme') || 'light');
            desktopToggle.addEventListener('click', toggleTheme);
            mobileToggle.addEventListener('click', toggleTheme);
        }

        // --- Hamburger Menu ---
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileNav = document.getElementById('mobile-nav-links');
        
        if (hamburgerBtn && mobileNav) {
            const navLinks = mobileNav.querySelectorAll('a, button');
            hamburgerBtn.addEventListener('click', () => mobileNav.classList.toggle('is-open'));
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mobileNav.classList.contains('is-open')) {
                        mobileNav.classList.remove('is-open');
                    }
                });
            });
        }
    }
});
