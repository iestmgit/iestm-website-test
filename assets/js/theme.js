// ========================================
// theme.js - سیستم تم روشن/تیره
// ========================================

const Theme = {
  currentTheme: 'light', // 'light' یا 'dark'

  init() {
    this.currentTheme = localStorage.getItem('iestm-theme') || 'light';
    this.applyTheme(this.currentTheme);
    this.setupToggle();
  },

  applyTheme(theme) {
    this.currentTheme = theme;
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('iestm-theme', theme);

    // بروزرسانی آیکون دکمه
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  },

  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  },

  setupToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggle());
    }
  },

  getTheme() {
    return this.currentTheme;
  }
};

// راه‌اندازی خودکار
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Theme;
}
