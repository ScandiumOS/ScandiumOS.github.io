let allDevices = [];
let maintainerMap = {};
let deviceInfoMap = {};

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0 || bytes === null || typeof bytes === 'undefined' || isNaN(bytes)) return 'N/A';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDate(timestamp) {
    if (timestamp === 0) return 'N/A';
    if (!timestamp || isNaN(timestamp)) return 'N/A';
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

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
    
    const mainDeviceListView = document.getElementById('main-device-list-view');
    const deviceDetailView = document.getElementById('device-detail-view');
    const deviceDetailContentContainer = document.getElementById('device-detail-content');
    const backToDevicesButton = document.getElementById('back-to-devices-button');

    const changelogOverlay = document.getElementById('changelog-overlay');
    const changelogContent = document.getElementById('changelog-content');
    const changelogError = document.getElementById('changelog-error');
    const closeChangelogModalButton = document.getElementById('close-changelog-modal');

    const translations = {
        en: {
            pageTitle: "ScandiumOS | Download",
            navHome: "Home",
            navAbout: "About Us",
            navDownload: "Download",
            navWiki: "Wiki",
            navArchive: "Archive",
            socialGithub: "GitHub",
            socialTelegram: "Telegram",
            downloadTitle: "Download ScandiumOS",
            downloadSubheading: "Get the latest builds for your device.",
            availableDevicesTitle: "Available Devices",
            footerCopyright: "ScandiumOS © 2025<br>Designed By ScandiumOS Team",
            noDevices: "No devices found for your search.",
            downloadButton: "Download",
            changelogButton: "Changelog",
            maintainer: "Maintainer",
            buildDate: "Build Date",
            buildType: "Build Type",
            fileSize: "File Size",
            md5: "MD5",
            fileName: "File Name",
            backToDevices: "Back to Devices",
            detailsButton: "Details"
        },
        id: {
            pageTitle: "ScandiumOS | Unduh",
            navHome: "Beranda",
            navAbout: "Tentang Kami",
            navDownload: "Unduh",
            navWiki: "Wiki",
            navArchive: "Arsip",
            socialGithub: "GitHub",
            socialTelegram: "Telegram",
            downloadTitle: "Unduh ScandiumOS",
            downloadSubheading: "Dapatkan build terbaru untuk perangkat Anda.",
            availableDevicesTitle: "Perangkat Tersedia",
            footerCopyright: "ScandiumOS © 2025<br>Didesain oleh Tim ScandiumOS",
            noDevices: "Tidak ada perangkat ditemukan untuk pencarian Anda.",
            downloadButton: "Unduh",
            changelogButton: "Daftar Perubahan",
            maintainer: "Pemelihara",
            buildDate: "Tanggal Build",
            buildType: "Tipe Build",
            fileSize: "Ukuran File",
            md5: "MD5",
            fileName: "Nama File",
            backToDevices: "Kembali ke Daftar Perangkat",
            detailsButton: "Detail"
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
              if (!deviceDetailView.classList.contains('hidden')) {
                  const detailCodenameElement = deviceDetailContentContainer.querySelector('p.text-xl');
                  if (detailCodenameElement) {
                      const currentCodename = detailCodenameElement.textContent.trim();
                      const currentDevice = allDevices.find(d => d.codename === currentCodename);
                      if (currentDevice) {
                          showDeviceDetail(currentDevice);
                      }
                  }
              } else {
                  renderDevices(allDevices);
              }
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
              if (!deviceDetailView.classList.contains('hidden')) {
                const detailCodenameElement = deviceDetailContentContainer.querySelector('p.text-xl');
                if (detailCodenameElement) {
                    const currentCodename = detailCodenameElement.textContent.trim();
                    const currentDevice = allDevices.find(d => d.codename === currentCodename);
                    if (currentDevice) {
                        showDeviceDetail(currentDevice);
                    }
                }
              } else {
                renderDevices(allDevices);
              }
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

    const openSearch = () => {
        searchOverlay.classList.remove('hidden');
        searchInput.focus();
    };
    const closeSearch = () => {
        searchOverlay.classList.add('hidden');
        searchInput.value = '';
        document.getElementById('search-results').innerHTML = '';
    };
    if (searchIconDesktop) {
      searchIconDesktop.addEventListener('click', openSearch);
    }
    if (searchIconMobile) {
        searchIconMobile.addEventListener('click', openSearch);
    }
    if (searchCloseButton) {
      searchCloseButton.addEventListener('click', closeSearch);
    }

    const deviceListContainer = document.getElementById('device-list');

    const openChangelogModal = async (changelogUrl) => {
        changelogContent.textContent = 'Loading changelog...';
        changelogError.classList.add('hidden');
        changelogOverlay.classList.remove('hidden');

        try {
            const response = await fetch(changelogUrl);
            if (!response.ok) {
                console.error(`Failed to load changelog from ${changelogUrl}: HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            changelogContent.textContent = text;
        } catch (error) {
            console.error("Failed to load changelog:", error);
            changelogContent.textContent = '';
            changelogError.classList.remove('hidden');
        }
    };

    closeChangelogModalButton.addEventListener('click', () => {
        changelogOverlay.classList.add('hidden');
        changelogContent.textContent = '';
        changelogError.classList.add('hidden');
    });

    const fetchAndLoadDevices = async () => {
        deviceListContainer.innerHTML = '';
        const currentLang = localStorage.getItem('lang') || 'en';

        try {
            const maintainerResponse = await fetch('https://raw.githubusercontent.com/ScandiumOS-14/scandium-maintainer/14/scandium.maintainer');
            if (!maintainerResponse.ok) throw new Error(`HTTP error! status: ${maintainerResponse.status} for maintainer data`);
            const maintainerText = await maintainerResponse.text();
            maintainerMap = maintainerText.split('\n').reduce((acc, line) => {
                const parts = line.split('=');
                if (parts.length === 2) {
                    acc[parts[0].trim()] = parts[1].trim();
                }
                return acc;
            }, {});

            const deviceInfoResponse = await fetch('https://raw.githubusercontent.com/KernelBuilding/ScandiumOS.github.io/scandium-dev/assets/json/devices.json');
            if (!deviceInfoResponse.ok) throw new Error(`HTTP error! status: ${deviceInfoResponse.status} for device info list`);
            let deviceInfoText = await deviceInfoResponse.text();
            deviceInfoText = deviceInfoText.replace(/,(\s*[\]}])/g, '$1'); 
            const deviceInfoList = JSON.parse(deviceInfoText);
            
            deviceInfoMap = deviceInfoList.reduce((acc, device) => {
                acc[device.codename] = {
                    deviceName: device.deviceName,
                    image: device.image
                };
                return acc;
            }, {});

            const devicesResponse = await fetch('https://raw.githubusercontent.com/ScandiumOS-14/scandium-maintainer/14/scandium.devices');
            if (!devicesResponse.ok) throw new Error(`HTTP error! status: ${devicesResponse.status} for device list`);
            const deviceCodenames = (await devicesResponse.text()).split('\n').map(c => c.trim()).filter(c => c.length > 0);

            const fetchedDevices = [];
            const fetchPromises = deviceCodenames.map(async (codename) => {
                try {
                    const buildResponse = await fetch(`https://raw.githubusercontent.com/ScandiumOS-14/ScandiumOTA/14/build/${codename}.json`);
                    if (!buildResponse.ok) {
                        console.warn(`Could not fetch build data for ${codename}: ${buildResponse.status}`);
                        return null;
                    }
                    const buildData = await buildResponse.json();

                    const nameFromMap = deviceInfoMap[codename] ? deviceInfoMap[codename].deviceName : codename.toUpperCase();
                    const imageFromMap = deviceInfoMap[codename] ? deviceInfoMap[codename].image : `https://placehold.co/200x150/1f2937/e2e8f0?text=${codename.toUpperCase()}`;

                    const builds = buildData.response.map(b => ({
                        maintainer: b.maintainer || maintainerMap[b.device] || 'Unknown',
                        version: (b.version || '').trim(),
                        date: formatDate(b.datetime),
                        type: b.buildtype || 'N/A',
                        fileSize: formatBytes(b.size),
                        md5: b.md5 || 'N/A',
                        filename: b.filename || 'N/A',
                        downloadUrl: b.download || '#',
                        changelogUrl: `https://raw.githubusercontent.com/ScandiumOS-14/ScandiumOTA/14/changelog/${codename}.txt`
                    }));

                    fetchedDevices.push({
                        deviceName: nameFromMap,
                        codename: codename,
                        image: imageFromMap,
                        builds: builds
                    });

                } catch (error) {
                    console.error(`Error processing device ${codename}:`, error);
                    return null;
                }
            });

            await Promise.all(fetchPromises);
            allDevices = fetchedDevices.filter(d => d !== null);
            renderDevices(allDevices);

        } catch (error) {
            console.error("Gagal mengambil data perangkat:", error);
            deviceListContainer.innerHTML = `<p class="text-red-500 text-center py-8 col-span-full">Gagal memuat perangkat. Silakan coba lagi nanti.</p>`;
        }
    };

    const showDeviceDetail = (device) => {
      const currentLang = localStorage.getItem('lang') || 'en';
      deviceDetailContentContainer.innerHTML = '';

      let buildsHtml = '';
      device.builds.forEach(build => {
        const versionDisplay = build.version && build.version.trim().length > 0 ? `(${build.version})` : '';

        buildsHtml += `
          <div class="build-section">
            <h4 class="text-lg font-semibold text-white mb-2">${device.deviceName} ${versionDisplay}</h4>
            <p class="text-sm text-slate-400"><strong data-i18n-key="maintainer">${translations[currentLang].maintainer}</strong>: ${build.maintainer}</p>
            <p class="text-sm text-slate-400"><strong data-i18n-key="buildDate">${translations[currentLang].buildDate}</strong>: ${build.date}</p>
            <p class="text-sm text-slate-400"><strong data-i18n-key="buildType">${translations[currentLang].buildType}</strong>: ${build.type}</p>
            <p class="text-sm text-slate-400"><strong data-i18n-key="fileSize">${translations[currentLang].fileSize}</strong>: ${build.fileSize}</p>
            <p class="text-sm text-slate-400"><strong data-i18n-key="md5">${translations[currentLang].md5}</strong>: ${build.md5 || 'N/A'}</p>
            <p class="text-sm text-slate-400"><strong data-i18n-key="fileName">${translations[currentLang].fileName}</strong>: ${build.filename || 'N/A'}</p>
            <div class="download-buttons-container">
              <a href="${build.downloadUrl}" class="download-button" target="_blank" rel="noopener noreferrer">
                <span data-i18n-key="downloadButton">${translations[currentLang].downloadButton}</span> <i class="fas fa-download"></i>
              </a>
              <button class="download-button !bg-slate-700 hover:!bg-slate-600 !text-white !shadow-none view-changelog-button" data-changelog-url="${build.changelogUrl}">
                <span data-i18n-key="changelogButton">${translations[currentLang].changelogButton}</span> <i class="fas fa-file-alt"></i>
              </button>
            </div>
          </div>
        `;
      });

      deviceDetailContentContainer.innerHTML = `
        <div class="device-info-header">
            ${device.image ? `<img src="${device.image}" alt="${device.deviceName}" class="h-64 object-contain mb-4 rounded-md">` : '<div class="w-full h-64 flex items-center justify-center bg-gray-700 rounded-md mb-4 text-gray-400">No Image</div>'}
            <h3 class="text-3xl font-bold text-cyan-400 mb-1">${device.deviceName}</h3>
            <p class="text-xl text-white font-medium">${device.codename}</p>
        </div>
        <div>
          ${buildsHtml}
        </div>
      `;

      deviceDetailContentContainer.querySelectorAll('.view-changelog-button').forEach(button => {
          button.addEventListener('click', (e) => {
              const changelogUrl = e.currentTarget.dataset.changelogUrl;
              if (changelogUrl) {
                  openChangelogModal(changelogUrl);
              }
          });
      });

      mainDeviceListView.classList.add('hidden');
      deviceDetailView.classList.remove('hidden');
    };

    const hideDeviceDetail = () => {
      deviceDetailView.classList.add('hidden');
      mainDeviceListView.classList.remove('hidden');
      searchInput.value = '';
      document.getElementById('search-results').innerHTML = '';
    };

    backToDevicesButton.addEventListener('click', hideDeviceDetail);

    const renderDevices = (devices) => {
      deviceListContainer.innerHTML = '';
      const currentLang = localStorage.getItem('lang') || 'en';

      if (devices.length === 0) {
        deviceListContainer.innerHTML = `<p class="text-gray-400 text-center py-8 col-span-full" data-i18n-key="noDevices">${translations[currentLang].noDevices}</p>`;
        return;
      }

      devices.forEach(device => {
        const deviceCard = document.createElement('div');
        deviceCard.classList.add('device-card');
        deviceCard.id = `device-${device.codename}`;
        deviceCard.setAttribute('data-device-codename', device.codename);

        const latestBuildDate = device.builds.length > 0 ? formatDate(device.builds[0].datetime) : 'N/A';
        
        deviceCard.innerHTML = `
          <div class="image-container relative w-full h-40">
            ${device.image ? `<img src="${device.image}" alt="${device.deviceName}" class="w-full h-full object-cover rounded-t-md">` : '<div class="w-full h-full flex items-center justify-center bg-gray-700 rounded-t-md text-gray-400">No Image</div>'}
            <div class="overlay-text">
              <h3 class="text-xl font-bold text-white leading-tight">${device.deviceName}</h3>
              <p class="text-md text-gray-200">${device.codename}</p>
            </div>
          </div>
          <div class="bottom-info-section">
            <span>Click here if you want to see full information</span>
            <button class="text-cyan-400 hover:text-blue-400 text-sm font-semibold flex items-center" data-device-codename="${device.codename}">
              <span data-i18n-key="detailsButton">${translations[currentLang].detailsButton}</span> <i class="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
        `;
        deviceListContainer.appendChild(deviceCard);

        const detailsButton = deviceCard.querySelector('.bottom-info-section button');
        if (detailsButton) {
          detailsButton.addEventListener('click', function() {
            const clickedCodename = this.getAttribute('data-device-codename');
            const selectedDevice = allDevices.find(d => d.codename === clickedCodename);
            if (selectedDevice) {
              showDeviceDetail(selectedDevice);
            }
          });
        }
        const imageOverlay = deviceCard.querySelector('.image-container .overlay-text');
        if (imageOverlay) {
          imageOverlay.addEventListener('click', function() {
            const clickedCodename = this.closest('.device-card').getAttribute('data-device-codename');
            const selectedDevice = allDevices.find(d => d.codename === clickedCodename);
            if (selectedDevice) {
              showDeviceDetail(selectedDevice);
            }
          });
        }
      });
    };

    fetchAndLoadDevices();

    searchInput.addEventListener('input', (event) => {
      const searchTerm = event.target.value.toLowerCase();
      const searchResultsContainer = document.getElementById('search-results');
      searchResultsContainer.innerHTML = '';

      if (searchTerm.length > 2) {
          const filteredResults = allDevices.filter(device => 
              (device.deviceName && device.deviceName.toLowerCase().includes(searchTerm)) ||
              (device.codename && device.codename.toLowerCase().includes(searchTerm)) ||
              (maintainerMap[device.codename] && maintainerMap[device.codename].toLowerCase().includes(searchTerm)) ||
              (device.builds && device.builds.some(build => build.version.toLowerCase().includes(searchTerm) || build.type.toLowerCase().includes(searchTerm)))
          );

          if (filteredResults.length > 0) {
              filteredResults.forEach(device => {
                  const resultLink = document.createElement('a');
                  resultLink.href = `#`;
                  resultLink.classList.add('block', 'p-4', 'mb-2', 'bg-slate-700/50', 'rounded-md', 'hover:bg-slate-600/60', 'transition-colors');
                  const searchResultMaintainer = maintainerMap[device.codename] || 'Unknown';

                  resultLink.innerHTML = `
                      <h4 class="text-xl font-semibold text-white">${device.deviceName} (${device.codename})</h4>
                      <p class="text-slate-300 text-sm">Maintainer: ${searchResultMaintainer}</p>
                  `;
                  
                  resultLink.addEventListener('click', (e) => {
                      e.preventDefault();
                      showDeviceDetail(device);
                      closeSearch();
                  });
                  searchResultsContainer.appendChild(resultLink);
              });
          } else {
              searchResultsContainer.innerHTML = `<p class="text-gray-400 text-center py-4">${translations[localStorage.getItem('lang') || 'en'].noDevices}</p>`;
          }
      } else if (searchTerm.length === 0 && searchResultsContainer.children.length > 0) {
          searchResultsContainer.innerHTML = '';
      }
    });

    let originalUpdateContent = updateContent;
    updateContent = (lang) => {
        originalUpdateContent(lang);
        if (!deviceDetailView.classList.contains('hidden')) {
            const detailCodenameElement = deviceDetailContentContainer.querySelector('p.text-xl');
            if (detailCodenameElement) {
                const currentCodename = detailCodenameElement.textContent.trim();
                const currentDevice = allDevices.find(d => d.codename === currentCodename);
                if (currentDevice) {
                    showDeviceDetail(currentDevice);
                }
            }
        } else {
            renderDevices(allDevices);
        }
    };
    updateContent(localStorage.getItem('lang') || 'en');
});
