document.addEventListener('DOMContentLoaded', () => {
  const htmlElement = document.documentElement;
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenuLinks = document.getElementById('mobile-menu-links');

  const languageToggle = document.getElementById('language-toggle');
  const languageDropdown = document.getElementById('language-dropdown');
  const currentLangSpan = document.getElementById('current-lang');

  const languageToggleMobile = document.getElementById('language-toggle-mobile');
  const languageDropdownMobile = document.getElementById('language-dropdown-mobile');
  const currentLangSpanMobile = document.getElementById('current-lang-mobile');

  const translations = {
      en: {
          pageTitle: "ScandiumOS | About Us",
          navHome: "Home",
          navDownload: "Download",
          navWiki: "Wiki",
          navArchive: "Archive",
          navAbout: "About Us",
          socialGithub: "GitHub",
          socialTelegram: "Telegram",
          aboutTitlePart1: "About",
          aboutTitlePart2: "ScandiumOS",
          aboutDescription: "We are a passionate team of developers, designers, and open-source enthusiasts dedicated to creating a better computing experience for everyone. ScandiumOS is our vision for an operating system that is powerful yet simple, secure yet open.",
          teamTitle: "Meet Our Core Team",
          roleFounder: "Founder",
          roleLeadDev: "Co-founder & Lead Developer",
          roleUIDesigner: "UI/UX Designer",
          roleServerMgr: "Server Manager",
          roleUIDesigner2: "UI/UX Designer",
          roleDesignDev: "Design Manager & Developer",
          roleDesignDev2: "Design Manager & Developer",
          footerCopyright: "ScandiumOS © 2025<br>Designed By ScandiumOS Team"
      },
      id: {
          pageTitle: "ScandiumOS | Tentang Kami",
          navHome: "Beranda",
          navDownload: "Unduh",
          navWiki: "Wiki",
          navArchive: "Arsip",
          navAbout: "Tentang Kami",
          socialGithub: "GitHub",
          socialTelegram: "Telegram",
          aboutTitlePart1: "Tentang",
          aboutTitlePart2: "ScandiumOS",
          aboutDescription: "Kami adalah tim pengembang, desainer, dan penggemar open-source yang bersemangat, berdedikasi untuk menciptakan pengalaman komputasi yang lebih baik bagi semua orang. ScandiumOS adalah visi kami untuk sistem operasi yang kuat namun sederhana, aman namun terbuka.",
          teamTitle: "Temui Tim Inti Kami",
          roleFounder: "Pendiri",
          roleLeadDev: "Co-founder & Pengembang Utama",
          roleUIDesigner: "Desainer UI/UX",
          roleServerMgr: "Manajer Server",
          roleUIDesigner2: "Desainer UI/UX",
          roleDesignDev: "Manajer Desain & Pengembang",
          roleDesignDev2: "Manajer Desain & Pengembang",
          footerCopyright: "ScandiumOS © 2025<br>Didesain Oleh Tim ScandiumOS"
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

      const aboutDesc = document.querySelector('[data-i18n-key="aboutDescription"]');
      if (aboutDesc) {
          aboutDesc.classList.add('text-gray-300');
          aboutDesc.classList.remove('text-gray-700');
      }

      const footerText = document.querySelector('footer');
      if (footerText) {
          footerText.classList.add('text-gray-400');
          footerText.classList.remove('text-gray-600');
      }

      document.querySelectorAll('.navbar .fab').forEach(icon => {
          icon.classList.add('text-gray-300');
          icon.classList.remove('text-gray-700');
      });

      const aboutTitlePart2 = document.querySelector('[data-i18n-key="aboutTitlePart2"]');
      if (aboutTitlePart2) {
          aboutTitlePart2.classList.add('text-white');
          aboutTitlePart2.classList.remove('text-gray-900');
      }
      const teamTitle = document.querySelector('[data-i18n-key="teamTitle"]');
      if (teamTitle) {
          teamTitle.classList.add('text-white');
          teamTitle.classList.remove('text-gray-900');
      }
      document.querySelectorAll('.card-custom h3').forEach(h3 => {
          h3.classList.add('text-white');
          h3.classList.remove('text-gray-800');
      });
      document.querySelectorAll('.card-custom p').forEach(p => {
          if (p.getAttribute('data-i18n-key') && p.getAttribute('data-i18n-key').startsWith('role')) {
              p.classList.add('text-cyan-400');
              p.classList.remove('text-teal-500');
          }
      });
  };

  htmlElement.classList.add('dark');
  localStorage.setItem('theme', 'dark');

  const savedLang = localStorage.getItem('lang');
  if (savedLang) {
      updateContent(savedLang);
  } else {
      updateContent('en');
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

  if (mobileMenuButton && mobileMenuLinks) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenuLinks.classList.toggle('hidden');
    });
  }
});
