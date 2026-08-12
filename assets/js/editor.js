// ========================================
// editor.js - ویرایشگر کد HTML
// ========================================

const Editor = {
  textarea: null,
  preview: null,
  runBtn: null,
  clearBtn: null,
  initialized: false,

  init() {
    this.textarea = document.getElementById('codeEditor');
    this.preview = document.getElementById('previewFrame');
    this.runBtn = document.getElementById('runCode');
    this.clearBtn = document.getElementById('clearCode');

    if (!this.textarea || !this.preview) return;

    // بارگذاری نمونه کد از JSON
    this.loadSample();

    // رویدادها
    if (this.runBtn) {
      this.runBtn.addEventListener('click', () => this.run());
    }
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clear());
    }

    // اجرای خودکار با Ctrl+Enter
    this.textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.run();
      }
    });

    // تغییر اندازه خودکار
    this.textarea.addEventListener('input', () => {
      this.textarea.style.height = 'auto';
      this.textarea.style.height = this.textarea.scrollHeight + 'px';
    });

    this.initialized = true;
  },

  async loadSample() {
    try {
      const res = await fetch('/website-data.json');
      const data = await res.json();
      const lang = document.body.classList.contains('lang-en') ? 'en' : 'fa';
      const placeholder = data?.editor?.[lang]?.placeholder || '<!-- Write your HTML here -->';
      if (this.textarea && !this.textarea.value) {
        this.textarea.value = placeholder;
        this.textarea.style.height = 'auto';
        this.textarea.style.height = this.textarea.scrollHeight + 'px';
      }
    } catch (e) {
      console.error('خطا در بارگذاری نمونه کد:', e);
    }
  },

  run() {
    const code = this.textarea.value;
    // تزریق کد به iframe
    const iframe = this.preview;
    if (iframe) {
      // پاک کردن محتوای قبلی
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(code);
      doc.close();
    }
  },

  clear() {
    if (this.textarea) {
      this.textarea.value = '';
      this.textarea.style.height = 'auto';
    }
    // پاک کردن iframe
    const iframe = this.preview;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write('<!-- نتیجه اجرای کد اینجا نمایش داده می‌شود -->');
      doc.close();
    }
  },

  setContent(html) {
    if (this.textarea) {
      this.textarea.value = html;
      this.textarea.style.height = 'auto';
      this.textarea.style.height = this.textarea.scrollHeight + 'px';
    }
  },

  getContent() {
    return this.textarea ? this.textarea.value : '';
  }
};

// راه‌اندازی خودکار
document.addEventListener('DOMContentLoaded', () => {
  Editor.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Editor;
}
