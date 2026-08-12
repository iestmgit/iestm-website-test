// ========================================
// loader.js - بارگذاری هدر با پشتیبانی از i18n
// ========================================

async function loadHeader() {
  const container = document.getElementById('header-placeholder');
  if (!container) return;

  try {
    const res = await fetch('/website-data.json');
    const data = await res.json();
    const brand = data.brand;

    // تعیین زبان فعلی از localStorage
    const currentLang = localStorage.getItem('iestm-lang') || 'fa';
    const menuItems = data.menu?.[currentLang] || [];

    container.innerHTML = `
      <header class="header" id="main-header">
        <div class="container">
          <a href="/" class="logo">IESTM <span>| ایستم</span></a>

          <nav class="nav-desktop">
            ${menuItems.map(item =>
              `<a href="${item.link}" ${isActive(item.link) ? 'class="active"' : ''}>${item.title}</a>`
            ).join('')}
          </nav>

          <div class="header-widgets">
            <!-- دکمه‌های زبان شیشه‌ای -->
            <div class="lang-toggle">
              <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" aria-label="English">
                <span class="flag">🇬🇧</span>
              </button>
              <button class="lang-btn ${currentLang === 'fa' ? 'active' : ''}" data-lang="fa" aria-label="فارسی">
                <span class="flag">🇮🇷</span>
              </button>
            </div>

            <!-- دکمه تم -->
            <button class="theme-toggle" aria-label="Toggle theme">
              ${localStorage.getItem('iestm-theme') === 'dark' ? '☀️' : '🌙'}
            </button>

            <!-- همبرگر -->
            <button class="hamburger" id="hamburger" aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <nav class="nav-mobile" id="navMobile">
        ${menuItems.map(item =>
          `<a href="${item.link}" ${isActive(item.link) ? 'class="active"' : ''}>${item.title}</a>`
        ).join('')}
      </nav>
    `;

    // ===== رویدادهای دکمه‌های زبان =====
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (window.I18N) {
          window.I18N.setLanguage(lang);
          // بارگذاری مجدد هدر با زبان جدید
          loadHeader();
        }
      });
    });

    // ===== رویداد همبرگر =====
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('navMobile');
    if (hamburger && navMobile) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMobile.classList.toggle('open');
      });
      navMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMobile.classList.remove('open');
        });
      });
    }

  } catch (e) {
    console.error('خطا در بارگذاری هدر:', e);
  }
}

function isActive(link) {
  const path = window.location.pathname;
  if (link === '/') {
    return path === '/' || path.endsWith('index.html');
  }
  return path.endsWith(link) || path.includes(link);
}

// بارگذاری خودکار
document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
});
