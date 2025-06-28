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
  const searchResultsContainer = document.getElementById('search-results');

  const translations = {
    en: {
      pageTitle: "Scandium OS - Archive",
      navHome: "Home",
      navAbout: "About Us",
      navArchive: "Archive",
      navWiki: "Wiki",
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
      readMore: "Read More",
      noPostsFound: "No posts found for this filter or search query."
    },
    id: {
      pageTitle: "Scandium OS - Arsip",
      navHome: "Beranda",
      navAbout: "Tentang Kami",
      navArchive: "Arsip",
      navWiki: "Wiki",
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
      readMore: "Baca Selengkapnya",
      noPostsFound: "Tidak ada postingan ditemukan untuk filter ini atau kueri pencarian."
    }
  };

  const updateContent = (lang) => {
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
      const key = element.getAttribute('data-i18n-key');
      if (translations[lang] && translations[lang][key]) {
        if (key === 'footerCopyright') {
          element.innerHTML = translations[lang][key];
        } else if (element.tagName === 'TITLE') {
          element.textContent = translations[lang][key];
        } else {
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

  const renderPosts = (posts) => {
    postListContainer.innerHTML = '';
    const currentLang = localStorage.getItem('lang') || 'en';

    if (posts.length === 0) {
      postListContainer.innerHTML = `<p class="text-gray-400 text-center py-8" data-i18n-key="noPosts">${translations[currentLang].noPostsFound}</p>`;
      return;
    }

    posts.forEach(post => {
      const tagsHtml = (post.tags || []).map(tag => `<span class="tag-chip">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`).join('');
      const cardHtml = `
        <div class="relative group">
          <div class="absolute left-[-22px] md:left-[-32px] top-2 w-5 h-5 rounded-full bg-cyan-500 ring-4 ring-slate-950 shadow-lg transition-transform group-hover:scale-125"></div>
          
          <div class="bg-slate-800/50 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-lg p-6 transition-all duration-300 md:ml-6 hover:border-cyan-400/60 hover:shadow-cyan-500/10 hover:-translate-y-1">
            <p class="text-sm text-slate-400 mb-1">${post.date}</p>
            <h2 class="text-2xl font-bold text-white">${post.title} ${post.codename ? `<span class="text-slate-400 font-normal">"${post.codename}"</span>` : ''}</h2>
            <p class="text-slate-400 mt-2">${post.subtitle || post.description || ''}</p>
            <div class="flex flex-wrap gap-2 mb-4 mt-4">
              ${tagsHtml}
            </div>
            <a href="${post.url || post.link}" class="inline-block mt-4 text-cyan-400 hover:text-cyan-300 font-semibold group">
              ${translations[currentLang].readMore}
              <span class="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&nbsp;&rarr;</span>
            </a>
          </div>
        </div>
      `;
      postListContainer.innerHTML += cardHtml;
    });
  };

  const filterAndSearchPosts = (tag, query) => {
    let filtered = allPosts.filter(post => {
      const matchesTag = tag === 'all' || (post.tags && post.tags.includes(tag));
      const matchesQuery = query === '' ||
        (post.title && post.title.toLowerCase().includes(query.toLowerCase())) ||
        (post.subtitle && post.subtitle.toLowerCase().includes(query.toLowerCase())) ||
        (post.codename && post.codename.toLowerCase().includes(query.toLowerCase())) ||
        (post.description && post.description.toLowerCase().includes(query.toLowerCase())) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(query.toLowerCase())));
      return matchesTag && matchesQuery;
    });
    renderPosts(filtered);
  };
  
  const fetchAndLoadArchivePosts = async () => {
    postListContainer.innerHTML = '';
    try {
      const response = await fetch('https://scandiumui.vercel.app/assets/json/source.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      allPosts = data.posts || [];
      const initialTag = tagFiltersContainer.querySelector('button.bg-cyan-600\\/20')?.dataset.tag || 'all';
      filterAndSearchPosts(initialTag, searchInput.value.trim());
    } catch (error) {
      console.error("Failed to fetch archive posts:", error);
      postListContainer.innerHTML = `<p class="text-red-500 text-center py-8">Failed to load archive posts. Please try again later.</p>`;
    }
  };

  if (mobileMenuButton && mobileMenuLinks) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenuLinks.classList.toggle('hidden');
    });
  }

  const setupLanguageToggle = (toggleBtn, dropdown, mobile = false) => {
    toggleBtn.addEventListener('click', (event) => {
      dropdown.classList.toggle('hidden');
      event.stopPropagation();
    });
    dropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const selectedLang = event.target.getAttribute('data-lang');
        updateContent(selectedLang);
        dropdown.classList.add('hidden');
        const activeTag = tagFiltersContainer.querySelector('button.bg-cyan-600\\/20')?.dataset.tag || 'all';
        filterAndSearchPosts(activeTag, searchInput.value.trim());
        if (mobile) mobileMenuLinks.classList.add('hidden');
      });
    });
  };
  setupLanguageToggle(languageToggle, languageDropdown);
  setupLanguageToggle(languageToggleMobile, languageDropdownMobile, true);

  document.addEventListener('click', (event) => {
    if (!languageToggle.contains(event.target) && !languageDropdown.contains(event.target)) {
      languageDropdown.classList.add('hidden');
    }
    if (languageToggleMobile && languageDropdownMobile && !languageToggleMobile.contains(event.target) && !languageDropdownMobile.contains(event.target)) {
      languageDropdownMobile.classList.add('hidden');
    }
  });

  const openSearch = () => {
    if (searchOverlay) {
      searchOverlay.classList.remove('hidden');
      searchInput.focus();
    }
  };
  const closeSearch = () => {
    if (searchOverlay) {
      searchOverlay.classList.add('hidden');
      searchInput.value = '';
      searchResultsContainer.innerHTML = '';
    }
  };
  if (searchIconDesktop) searchIconDesktop.addEventListener('click', openSearch);
  if (searchIconMobile) searchIconMobile.addEventListener('click', openSearch);
  if (searchCloseButton) searchCloseButton.addEventListener('click', closeSearch);

  searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    if (searchTerm.length >= 2 || searchTerm.length === 0) {
      const filteredResults = allPosts.filter(post =>
        (post.title && post.title.toLowerCase().includes(searchTerm)) ||
        (post.subtitle && post.subtitle.toLowerCase().includes(searchTerm)) ||
        (post.codename && post.codename.toLowerCase().includes(searchTerm)) ||
        (post.description && post.description.toLowerCase().includes(searchTerm)) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
      searchResultsContainer.innerHTML = '';
      const currentLang = localStorage.getItem('lang') || 'en';
      if (filteredResults.length > 0) {
        filteredResults.forEach(post => {
          const resultLink = document.createElement('a');
          resultLink.href = post.url || post.link;
          resultLink.classList.add('block', 'p-4', 'mb-2', 'bg-slate-700/50', 'rounded-md', 'hover:bg-slate-600/60', 'transition-colors');
          resultLink.innerHTML = `
            <h4 class="text-xl font-semibold text-white">${post.title}</h4>
            <p class="text-slate-300 text-sm">${post.subtitle || post.description || ''}</p>
          `;
          searchResultsContainer.appendChild(resultLink);
        });
      } else {
        searchResultsContainer.innerHTML = `<p class="text-gray-400 text-center py-4">${translations[currentLang].noPosts}</p>`;
      }
    } else {
      searchResultsContainer.innerHTML = '';
    }
  });

  if (tagFiltersContainer) {
    tagFiltersContainer.addEventListener('click', (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON') {
        tagFiltersContainer.querySelectorAll('button').forEach(btn => {
          btn.classList.remove('bg-cyan-600/20', 'text-cyan-200', 'border-cyan-400/50', 'hover:bg-cyan-500/30', 'hover:border-cyan-300/60');
          btn.classList.add('bg-slate-800/50', 'text-slate-300', 'border-slate-700/80', 'hover:bg-slate-700/60', 'hover:border-slate-600/90');
        });
        target.classList.remove('bg-slate-800/50', 'text-slate-300', 'border-slate-700/80', 'hover:bg-slate-700/60', 'hover:border-slate-600/90');
        target.classList.add('bg-cyan-600/20', 'text-cyan-200', 'border-cyan-400/50', 'hover:bg-cyan-500/30', 'hover:border-cyan-300/60');
        const tag = target.dataset.tag;
        filterAndSearchPosts(tag, '');
      }
    });
  }

  htmlElement.classList.add('dark');
  localStorage.setItem('theme', 'dark');

  const savedLang = localStorage.getItem('lang');
  if (savedLang) {
    updateContent(savedLang);
  } else {
    updateContent('en');
  }

  fetchAndLoadArchivePosts();
});
