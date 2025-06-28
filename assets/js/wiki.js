document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuLinks = document.getElementById('mobile-menu-links');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchCloseButton = document.getElementById('search-close-button');
    const searchIconDesktop = document.getElementById('search-icon-desktop');
    const searchIconMobile = document.getElementById('search-icon-mobile');

    const languageToggle = document.getElementById('language-toggle');
    const languageDropdown = document.getElementById('language-dropdown');
    const currentLangSpan = document.getElementById('current-lang');

    const languageToggleMobile = document.getElementById('language-toggle-mobile');
    const languageDropdownMobile = document.getElementById('language-dropdown-mobile');
    const currentLangSpanMobile = document.getElementById('current-lang-mobile');

    const translations = {
        en: {
            pageTitle: "ScandiumOS | Wiki",
            navHome: "Home",
            navWiki: "Wiki",
            navDownload: "Download",
            navArchive: "Archive",
            navAbout: "About Us",
            socialGithub: "GitHub",
            socialTelegram: "Telegram",
            wikiTitle: "ScandiumOS Wiki",
            wikiSubheading: "Fast, Customization, & Improve Gaming!",
            latestArticlesTitle: "Latest Articles",
            footerCopyright: "ScandiumOS © 2025<br>Designed By ScandiumOS Team",
            noArticles: "No articles found.",
            readMore: "Read More"
        },
        id: {
            pageTitle: "ScandiumOS | Wiki",
            navHome: "Beranda",
            navWiki: "Wiki",
            navDownload: "Unduh",
            navArchive: "Arsip",
            navAbout: "Tentang Kami",
            socialGithub: "GitHub",
            socialTelegram: "Telegram",
            wikiTitle: "Wiki ScandiumOS",
            wikiSubheading: "Cepat, Kustomisasi, & Tingkatkan Gaming!",
            latestArticlesTitle: "Artikel Terbaru",
            footerCopyright: "ScandiumOS © 2025<br>Didesain oleh Tim ScandiumOS",
            noArticles: "Tidak ada artikel yang ditemukan.",
            readMore: "Baca Selengkapnya"
        }
    };

    let updateContent = (lang) => {
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            if (translations[lang] && translations[lang][key]) {
                if (key === 'footerCopyright') {
                    element.innerHTML = translations[lang][key];
                } else if (element.tagName === 'TITLE') {
                    element.textContent = translations[lang][key];
                }
                else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        currentLangSpan.textContent = lang.toUpperCase();
        currentLangSpanMobile.textContent = lang.toUpperCase();
        localStorage.setItem('lang', lang);

        const activeNavLink = document.querySelector('.nav-link.active');
        if (activeNavLink) {
            activeNavLink.classList.remove('border-teal-500');
            activeNavLink.classList.add('border-cyan-400');
        }
    };

    htmlElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');

    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        updateContent(savedLang);
    } else {
        updateContent('en');
    }

    if (mobileMenuButton && mobileMenuLinks) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenuLinks.classList.toggle('hidden');
      });
    }

    languageToggle.addEventListener('click', (event) => {
        languageDropdown.classList.toggle('hidden');
        event.stopPropagation();
    });
    languageToggleMobile.addEventListener('click', (event) => {
        languageDropdownMobile.classList.toggle('hidden');
        event.stopPropagation();
    });

    languageDropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedLang = event.target.getAttribute('data-lang');
            updateContent(selectedLang);
            languageDropdown.classList.add('hidden');
        });
    });
    languageDropdownMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedLang = event.target.getAttribute('data-lang');
            updateContent(selectedLang);
            languageDropdownMobile.classList.add('hidden');
            mobileMenuLinks.classList.add('hidden');
        });
    });

    document.addEventListener('click', (event) => {
        if (!languageToggle.contains(event.target) && !languageDropdown.contains(event.target)) {
            languageDropdown.classList.add('hidden');
        }
        if (!languageToggleMobile.contains(event.target) && !languageDropdownMobile.contains(event.target)) {
            languageDropdownMobile.classList.add('hidden');
        }
    });

    const openSearch = () => {
        searchOverlay.classList.remove('hidden');
        searchInput.focus();
    };
    const closeSearch = () => {
        searchOverlay.classList.add('hidden');
        searchInput.value = '';
        document.getElementById('search-results').innerHTML = '';
    };
    searchIconDesktop.addEventListener('click', openSearch);
    searchIconMobile.addEventListener('click', openSearch);
    searchCloseButton.addEventListener('click', closeSearch);

    const fetchAndLoadWikiArticles = async () => {
        const wikiArticlesContainer = document.getElementById('wiki-articles');
        wikiArticlesContainer.innerHTML = '';

        try {
            const response = await fetch('https://scandiumui.vercel.app/assets/json/info.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const articles = await response.json();
            const currentLang = localStorage.getItem('lang') || 'en';

            if (articles.length === 0) {
                const noArticlesMessage = document.createElement('p');
                noArticlesMessage.classList.add('text-gray-400', 'text-center', 'py-8');
                noArticlesMessage.setAttribute('data-i18n-key', 'noArticles');
                wikiArticlesContainer.appendChild(noArticlesMessage);
                updateContent(currentLang);
                return;
            }

            articles.forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.classList.add('wiki-card', 'block');

                const contentWrapper = document.createElement('div');
                contentWrapper.classList.add('mb-4');

                const articleTitle = document.createElement('h4');
                articleTitle.classList.add('text-xl', 'font-semibold', 'mb-2', 'text-white');
                articleTitle.textContent = article.title;

                const articleDescription = document.createElement('p');
                articleDescription.classList.add('text-gray-400', 'text-sm');
                articleDescription.textContent = article.subtitle;

                contentWrapper.appendChild(articleTitle);
                contentWrapper.appendChild(articleDescription);

                const readMoreLink = document.createElement('a');
                readMoreLink.href = article.url;
                readMoreLink.classList.add('read-more-button', 'ml-auto');
                readMoreLink.innerHTML = `<span data-i18n-key="readMore">${translations[currentLang].readMore}</span> <i class="fas fa-arrow-right"></i>`;

                articleCard.appendChild(contentWrapper);
                articleCard.appendChild(readMoreLink);
                wikiArticlesContainer.appendChild(articleCard);
            });
        } catch (error) {
            console.error("Gagal mengambil artikel wiki:", error);
            wikiArticlesContainer.innerHTML = `<p class="text-red-500 text-center py-8">Gagal memuat artikel. Silakan coba lagi nanti.</p>`;
        }
    };

    let originalUpdateContent = updateContent;
    updateContent = (lang) => {
        originalUpdateContent(lang);
        fetchAndLoadWikiArticles();
    };
    updateContent(localStorage.getItem('lang') || 'en');
});
