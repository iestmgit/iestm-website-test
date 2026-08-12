// ========================================
// i18n.js - سیستم چندزبانه (فارسی/انگلیسی)
// ========================================

const I18N = {
  currentLang: 'fa', // 'fa' یا 'en'
  data: null,
  listeners: [],

  // بارگذاری دیتا از JSON
  async load() {
    try {
      const res = await fetch('/website-data.json');
      this.data = await res.json();
      this.currentLang = localStorage.getItem('iestm-lang') || 'fa';
      this.applyLanguage(this.currentLang);
      return this.data;
    } catch (e) {
      console.error('خطا در بارگذاری i18n:', e);
      return null;
    }
  },

  // تغییر زبان
  setLanguage(lang) {
    if (lang === this.currentLang) return;
    this.currentLang = lang;
    localStorage.setItem('iestm-lang', lang);
    this.applyLanguage(lang);
    // اطلاع‌رسانی به همه شنونده‌ها
    this.listeners.forEach(fn => fn(lang));
  },

  // اعمال زبان روی صفحه
  applyLanguage(lang) {
    // تغییر کلاس روی body
    document.body.classList.remove('lang-fa', 'lang-en');
    document.body.classList.add(`lang-${lang}`);

    // تغییر جهت
    if (lang === 'en') {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    } else {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'fa';
    }

    // بروزرسانی دکمه‌های زبان
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // بروزرسانی متون با data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const value = this.getText(key, lang);
      if (value) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = value;
        } else {
          el.textContent = value;
        }
      }
    });

    // بروزرسانی متون با data-i18n-html (برای HTML)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      const value = this.getText(key, lang);
      if (value) el.innerHTML = value;
    });

    // بروزرسانی منو (با داده‌های JSON)
    this.updateMenu(lang);
    this.updateFooter(lang);
  },

  // دریافت متن از دیتا
  getText(path, lang = null) {
    if (!this.data) return null;
    const l = lang || this.currentLang;
    const keys = path.split('.');
    let result = this.data;
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        return null;
      }
    }
    if (typeof result === 'object' && result[l] !== undefined) {
      return result[l];
    }
    return result;
  },

  // بروزرسانی منو
  updateMenu(lang) {
    const menuData = this.data?.menu?.[lang];
    if (!menuData) return;

    // منوی دسکتاپ
    const desktopNav = document.querySelector('.nav-desktop');
    if (desktopNav) {
      desktopNav.innerHTML = menuData.map(item =>
        `<a href="${item.link}" ${this.isActive(item.link) ? 'class="active"' : ''}>${item.title}</a>`
      ).join('');
    }

    // منوی موبایل
    const mobileNav = document.getElementById('navMobile');
    if (mobileNav) {
      mobileNav.innerHTML = menuData.map(item =>
        `<a href="${item.link}" ${this.isActive(item.link) ? 'class="active"' : ''}>${item.title}</a>`
      ).join('');
      // بازنشانی رویدادهای کلیک برای بستن منو
      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          const hamburger = document.getElementById('hamburger');
          if (hamburger) hamburger.classList.remove('active');
          mobileNav.classList.remove('open');
        });
      });
    }
  },

  // بروزرسانی فوتر
  updateFooter(lang) {
    const footerData = this.data?.footer?.[lang];
    if (!footerData) return;
    const brand = this.data?.brand;
    if (!brand) return;

    const footer = document.querySelector('.footer');
    if (!footer) return;

    const footerLinks = this.data?.menu?.[lang]?.map(item =>
      `<a href="${item.link}">${item.title}</a>`
    ).join('') || '';

    const socialIcons = Object.entries(brand.social || {}).map(([platform, url]) =>
      `<a href="${url}" target="_blank" rel="noopener" aria-label="${platform}">${platform === 'instagram' ? '📸' : platform === 'telegram' ? '✈️' : platform === 'github' ? '🐙' : '▶️'}</a>`
    ).join('');

    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>${brand.name}</h3>
            <p>${footerData.aboutShort || ''}</p>
          </div>
          <div class="footer-links">
            <h4>${lang === 'en' ? 'Quick Links' : 'دسترسی سریع'}</h4>
            ${footerLinks}
          </div>
          <div class="footer-social">
            <h4>${lang === 'en' ? 'Follow Us' : 'ما را دنبال کنید'}</h4>
            <div class="social-icons">${socialIcons}</div>
          </div>
        </div>
        <div class="footer-bottom">${footerData.copyright || ''}</div>
      </div>
    `;
  },

  isActive(link) {
    const path = window.location.pathname;
    if (link === '/') {
      return path === '/' || path.endsWith('index.html');
    }
    return path.endsWith(link) || path.includes(link);
  },

  // ثبت شنونده برای تغییر زبان
  onChange(fn) {
    this.listeners.push(fn);
  },

  // دریافت زبان فعلی
  getLanguage() {
    return this.currentLang;
  }
};

// صادر کردن برای استفاده در دیگر فایل‌ها
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18N;
}
