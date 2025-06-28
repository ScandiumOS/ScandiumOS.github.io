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
            pageTitle: "ScandiumOS",
            navbarBrand: "ScandiumOS",
            navHome: "Home",
            navDownload: "Download",
            navWiki: "Wiki",
            navArchive: "Archive",
            navAbout: "About Us",
            socialGithub: "GitHub",
            socialTelegram: "Telegram",
            heroLine1: "A new",
            heroLine2: "experience",
            heroLine3: "awaits",
            heroLine4: "you",
            heroLine5: ".",
            heroSub1: "Give a new life to your phone",
            heroSub2: "Faster and better-looking than ever",
            downloadNow: "Download now",
            builtToInspireTitle: "Built to inspire",
            builtToInspireLead: "ScandiumOS is an operating system based on the Android Open Source Project, built with a unique look and maintaining top-notch performance.",
            dailyUsageTitle: "Ready for daily usage",
            dailyUsageText: "We have refined every detail to make your experience effortless and enjoyable.",
            lightweightTitle: "Lightweight",
            lightweightText: "No clutter or bloatware, just the core essentials. You decide what stays on your device.",
            intuitiveTitle: "Intuitive",
            intuitiveText: "We built an interface that stands out from the rest. It’s completely new yet familiar.",
            scandiumUiTitle: "The new ScandiumUI experience",
            scandiumUiLead: "A completely new user interface, designed to be seamless.",
            controlCenterTitle: "Control Center",
            controlCenterText1: "Quick access to settings, music, and notifications all in one place.",
            controlCenterText2: "A monochromatic color palette combined with a dynamically blurred background gives you a focused panel experience.",
            mediaControlsTitle: "Media Controls",
            mediaControlsText: "A much more minimalistic volume panel with a new elegant look and an embedded quick music player allows you to interact seamlessly with your media.",
            scandiumLauncherTitle: "Scandium Launcher",
            scandiumLauncherText: "This is a lightweight system for your device very simple yet elegant. It helps you organize your apps and can be customized with widgets and icon packs.",
            footerCopyright: "ScandiumOS © 2025<br>Designed By ScandiumOS Team",
        },
        id: {
            pageTitle: "ScandiumOS",
            navbarBrand: "ScandiumOS",
            navHome: "Beranda",
            navDownload: "Unduh",
            navWiki: "Wiki",
            navArchive: "Arsip",
            navAbout: "Tentang Kami",
            socialGithub: "GitHub",
            socialTelegram: "Telegram",
            heroLine1: "Pengalaman",
            heroLine2: "baru",
            heroLine3: "menanti",
            heroLine4: "Anda",
            heroLine5: ".",
            heroSub1: "Berikan hidup baru untuk ponsel Anda",
            heroSub2: "Lebih cepat dan lebih indah dari sebelumnya",
            downloadNow: "Unduh sekarang",
            builtToInspireTitle: "Dibangun untuk menginspirasi",
            builtToInspireLead: "ScandiumOS adalah sistem operasi berbasis Android Open Source Project, dibangun dengan tampilan unik dan mempertahankan performa terbaik.",
            dailyUsageTitle: "Siap untuk penggunaan sehari-hari",
            dailyUsageText: "Kami telah menyempurnakan setiap detail untuk membuat pengalaman Anda mudah dan menyenangkan.",
            lightweightTitle: "Ringan",
            lightweightText: "Tidak ada kekacauan atau bloatware, hanya inti yang penting. Anda memutuskan apa yang tetap ada di perangkat Anda.",
            intuitiveTitle: "Intuitif",
            intuitiveText: "Kami membangun antarmuka yang menonjol dari yang lain. Ini benar-benar baru namun akrab.",
            scandiumUiTitle: "Pengalaman ScandiumUI yang baru",
            scandiumUiLead: "Antarmuka pengguna yang benar-benar baru, dirancang agar mulus.",
            controlCenterTitle: "Pusat Kontrol",
            controlCenterText1: "Akses cepat ke pengaturan, musik, dan notifikasi semuanya di satu tempat.",
            controlCenterText2: "Palet warna monokromatik yang dikombinasikan dengan latar belakang yang buram secara dinamis memberi Anda pengalaman panel yang fokus.",
            mediaControlsTitle: "Kontrol Media",
            mediaControlsText: "Panel volume yang jauh lebih minimalis dengan tampilan elegan baru dan pemutar musik cepat tertanam memungkinkan Anda berinteraksi dengan mulus dengan media Anda.",
            scandiumLauncherTitle: "Scandium Launcher",
            scandiumLauncherText: "Ini adalah sistem ringan untuk perangkat Anda yang sangat sederhana namun elegan. Ini membantu Anda mengatur aplikasi dan dapat disesuaikan dengan widget dan paket ikon.",
            footerCopyright: "ScandiumOS © 2025<br>Didesain oleh Tim ScandiumOS",
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
        if (currentLangSpan) {
            currentLangSpan.textContent = lang.toUpperCase();
        }
        if (currentLangSpanMobile) {
            currentLangSpanMobile.textContent = lang.toUpperCase();
        }
        localStorage.setItem('lang', lang);

        document.querySelectorAll('.navbar .nav-link').forEach(link => {
          link.classList.remove('active', 'font-semibold', 'border-b-2', 'border-cyan-400', 'pb-1', 'border-l-4', 'hover:bg-gray-600');
        });

        const currentPath = window.location.pathname.split('/').pop();
        if (currentPath === 'index.html' || currentPath === '') {
          const homeNavLinkDesktop = document.querySelector('.navbar .hidden.md\\:flex .nav-link[href="index.html"]');
          if (homeNavLinkDesktop) {
            homeNavLinkDesktop.classList.add('active', 'font-semibold', 'border-b-2', 'border-cyan-400', 'pb-1');
          }
          const homeNavLinkMobile = document.querySelector('#mobile-menu-links .nav-link[href="index.html"]');
          if (homeNavLinkMobile) {
            homeNavLinkMobile.classList.add('active', 'border-l-4', 'border-cyan-400', 'hover:bg-gray-600');
          }
        } else {
          const activeLinkDesktop = document.querySelector(`.navbar .hidden.md\\:flex .nav-link[href="${currentPath}"]`);
          if (activeLinkDesktop) {
              activeLinkDesktop.classList.add('active', 'font-semibold', 'border-b-2', 'border-cyan-400', 'pb-1');
          }
          const activeLinkMobile = document.querySelector(`#mobile-menu-links .nav-link[href="${currentPath}"]`);
          if (activeLinkMobile) {
              activeLinkMobile.classList.add('active', 'border-l-4', 'border-cyan-400', 'hover:bg-gray-600');
          }
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
        const isHidden = mobileMenuLinks.classList.toggle('hidden');
        mobileMenuButton.setAttribute('aria-expanded', !isHidden);
      });
    }

    if (languageToggle) {
      languageToggle.addEventListener('click', (event) => {
          if (languageDropdown) {
              languageDropdown.classList.toggle('hidden');
          }
          event.stopPropagation();
      });
    }
    if (languageToggleMobile) {
      languageToggleMobile.addEventListener('click', (event) => {
          if (languageDropdownMobile) {
              languageDropdownMobile.classList.toggle('hidden');
          }
          event.stopPropagation();
      });
    }

    if (languageDropdown) {
      languageDropdown.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', (event) => {
              event.preventDefault();
              const selectedLang = event.target.getAttribute('data-lang');
              updateContent(selectedLang);
              languageDropdown.classList.add('hidden');
          });
      });
    }
    if (languageDropdownMobile) {
      languageDropdownMobile.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', (event) => {
              event.preventDefault();
              const selectedLang = event.target.getAttribute('data-lang');
              updateContent(selectedLang);
              languageDropdownMobile.classList.add('hidden');
              mobileMenuLinks.classList.add('hidden');
          });
      });
    }

    document.addEventListener('click', (event) => {
        if (languageToggle && languageDropdown && !languageToggle.contains(event.target) && !languageDropdown.contains(event.target)) {
            languageDropdown.classList.add('hidden');
        }
        if (languageToggleMobile && languageDropdownMobile && !languageToggleMobile.contains(event.target) && !languageDropdownMobile.contains(event.target)) {
            languageDropdownMobile.classList.add('hidden');
        }
    });

    const volumeVideo = document.getElementById('volume-video');
    if (volumeVideo) {
        volumeVideo.play().catch(error => {
            console.log("Autoplay prevented:", error);
        });
    }
});
