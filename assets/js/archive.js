let allPosts = [];

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

    const postListContainer = document.getElementById('post-list');
    const tagFiltersContainer = document.getElementById('tag-filters');

    const translations = {
        en: {
            pageTitle: "Scandium OS - Archive",
            navHome: "Home",
            navAbout: "About Us",
            navArchive: "Archive",
            navWiki: "Wiki",
            navDownload: "Download",
            socialGithub: "GitHub",
            socialTelegram: "Telegram",
            archiveTitle: "Archive",
            archiveSubheading: "All posts",
            tagAll: "Show All",
            tagTutorial: "Tutorial",
            tagSpecification: "Specification",
            tagDownload: "Download",
            footerCopyright: "ScandiumOS © 2025<br>Designed By ScandiumOS Team",
            noPosts: "No posts found.",
            readMore: "Read More"
        },
        id: {
            pageTitle: "Scandium OS - Arsip",
            navHome: "Beranda",
            navAbout: "Tentang Kami",
            navArchive: "Arsip",
            navWiki: "Wiki",
            navDownload: "Unduh",
            socialGithub: "GitHub",
            socialTelegram: "Telegram",
            archiveTitle: "Arsip",
            archiveSubheading: "Semua postingan",
            tagAll: "Tampilkan Semua",
            tagTutorial: "Tutorial",
            tagSpecification: "Spesifikasi",
            tagDownload: "Unduh",
            footerCopyright: "ScandiumOS © 2025<br>Didesain oleh Tim ScandiumOS",
            noPosts: "Tidak ada postingan ditemukan.",
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
            filterPosts(document.querySelector('#tag-filters button.bg-cyan-600\\/20').dataset.tag);
        });
    });
    languageDropdownMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedLang = event.target.getAttribute('data-lang');
            updateContent(selectedLang);
            languageDropdownMobile.classList.add('hidden');
            mobileMenuLinks.classList.add('hidden');
            filterPosts(document.querySelector('#tag-filters button.bg-cyan-600\\/20').dataset.tag);
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
    if (searchIconMobile) {
        searchIconMobile.addEventListener('click', openSearch);
    }
    searchCloseButton.addEventListener('click', closeSearch);

    const fetchAndLoadArchivePosts = async () => {
        postListContainer.innerHTML = '';
        const currentLang = localStorage.getItem('lang') || 'en';

        try {
            const response = await fetch('https://scandiumui.vercel.app/assets/json/info.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allPosts = await response.json();
            filterPosts('all');
        } catch (error) {
            console.error("Failed to fetch archive posts:", error);
            postListContainer.innerHTML = `<p class="text-red-500 text-center py-8">Failed to load archive posts. Please try again later.</p>`;
        }
    };

    const renderPosts = (posts) => {
        postListContainer.innerHTML = '';
        const currentLang = localStorage.getItem('lang') || 'en';

        if (posts.length === 0) {
            postListContainer.innerHTML = `<p class="text-gray-400 text-center py-8" data-i18n-key="noPosts">${translations[currentLang].noPosts}</p>`;
            return;
        }

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('timeline-item', 'relative', 'p-6', 'rounded-lg', 'bg-slate-800/40', 'shadow-lg', 'transition-all', 'duration-300', 'hover:bg-slate-700/50', 'hover:shadow-xl');
            
            let tagsHtml = post.tags.map(tag => `<span class="tag-chip">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`).join('');

            postElement.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-2xl font-bold text-white">${post.title}</h3>
                    <p class="text-sm text-slate-400">${post.date}</p>
                </div>
                <p class="text-slate-300 mb-4">${post.subtitle}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${tagsHtml}
                </div>
                <div class="flex justify-between items-center text-sm text-slate-400">
                    <span>${post.readTime || translations[currentLang].noReadTime}</span>
                    <a href="${post.url}" class="read-more-button" data-i18n-key="readMore">
                        ${translations[currentLang].readMore} <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            `;
            postListContainer.appendChild(postElement);
        });
    };

    const filterPosts = (tag) => {
        let filtered = [];
        if (tag === 'all') {
            filtered = allPosts;
        } else {
            filtered = allPosts.filter(post => post.tags && post.tags.includes(tag));
        }
        renderPosts(filtered);
        
        tagFiltersContainer.querySelectorAll('button').forEach(button => {
            if (button.dataset.tag === tag) {
                button.classList.remove('bg-slate-800/50', 'text-slate-300', 'border-slate-700/80', 'hover:bg-slate-700/60', 'hover:border-slate-600/90');
                button.classList.add('bg-cyan-600/20', 'text-cyan-200', 'border-cyan-400/50', 'hover:bg-cyan-500/30', 'hover:border-cyan-300/60');
            } else {
                button.classList.remove('bg-cyan-600/20', 'text-cyan-200', 'border-cyan-400/50', 'hover:bg-cyan-500/30', 'hover:border-cyan-300/60');
                button.classList.add('bg-slate-800/50', 'text-slate-300', 'border-slate-700/80', 'hover:bg-slate-700/60', 'hover:border-slate-600/90');
            }
        });
    };

    tagFiltersContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const tag = event.target.dataset.tag;
            filterPosts(tag);
        }
    });

    let originalUpdateContent = updateContent;
    updateContent = (lang) => {
        originalUpdateContent(lang);
        if (allPosts.length > 0) {
            filterPosts(document.querySelector('#tag-filters button.bg-cyan-600\\/20').dataset.tag);
        } else {
            fetchAndLoadArchivePosts();
        }
    };
    
    fetchAndLoadArchivePosts();

    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const searchResultsContainer = document.getElementById('search-results');
        searchResultsContainer.innerHTML = '';

        if (searchTerm.length > 2) {
            const filteredResults = allPosts.filter(post => 
                (post.title && post.title.toLowerCase().includes(searchTerm)) ||
                (post.subtitle && post.subtitle.toLowerCase().includes(searchTerm)) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );

            if (filteredResults.length > 0) {
                filteredResults.forEach(post => {
                    const resultLink = document.createElement('a');
                    resultLink.href = post.url;
                    resultLink.classList.add('block', 'p-4', 'mb-2', 'bg-slate-700/50', 'rounded-md', 'hover:bg-slate-600/60', 'transition-colors');
                    resultLink.innerHTML = `
                        <h4 class="text-xl font-semibold text-white">${post.title}</h4>
                        <p class="text-slate-300 text-sm">${post.subtitle}</p>
                    `;
                    searchResultsContainer.appendChild(resultLink);
                });
            } else {
                searchResultsContainer.innerHTML = `<p class="text-gray-400 text-center py-4">${translations[localStorage.getItem('lang') || 'en'].noPosts}</p>`;
            }
        }
    });
});
