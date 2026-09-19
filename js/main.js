/* 泽仪律师事务所 — 官网交互脚本 */
(function () {
  'use strict';

  /* ---------- 导航 ---------- */
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const backtop = document.getElementById('backtop');

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (backtop) backtop.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      const open = mobileMenu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', open);
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  if (backtop) {
    backtop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 入场动画 ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 数字滚动 ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        const el = e.target;
        cio.unobserve(el);
        const target = parseFloat(el.getAttribute('data-count'));
        const dur = 1600;
        const t0 = performance.now();
        const isFloat = el.hasAttribute('data-float');
        function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = isFloat ? val.toFixed(1) : Math.round(val).toLocaleString('zh-CN');
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString('zh-CN');
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- 提示气泡 ---------- */
  window.showToast = function (msg) {
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 3200);
  };

  /* ---------- 留言表单 ---------- */
  const forms = document.querySelectorAll('form[data-consult]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('[name="name"]');
      const phone = form.querySelector('[name="phone"]');
      if (!name || !name.value.trim()) { window.showToast('请填写您的称呼'); name.focus(); return; }
      if (!phone || !/^1\d{10}$/.test(phone.value.trim())) { window.showToast('请填写正确的手机号码'); phone.focus(); return; }
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = '提交中…'; }
      setTimeout(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = btn.getAttribute('data-orig') || '提交咨询'; }
        window.showToast('提交成功！我们将尽快与您联系');
        form.reset();
      }, 900);
    });
  });

  /* ---------- 新闻筛选 ---------- */
  const filters = document.querySelectorAll('[data-news-filter]');
  if (filters.length) {
    filters.forEach(function (f) {
      f.addEventListener('click', function () {
        filters.forEach(function (x) { x.classList.remove('active'); });
        f.classList.add('active');
        const key = f.getAttribute('data-news-filter');
        document.querySelectorAll('[data-news-item]').forEach(function (item) {
          const show = key === 'all' || item.getAttribute('data-news-item') === key;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }
})();
