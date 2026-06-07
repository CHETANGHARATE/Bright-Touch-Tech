/* ============================================================
   BRIGHT TOUCH TECHNOLOGIES — APP.JS
   Dark Mode · Scroll Animations · Slider · Estimator · Form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     1. DARK MODE
  ────────────────────────────────────────────────────────── */
  const html    = document.documentElement;
  const toggle  = document.getElementById('themeToggle');
  const KEY     = 'btt-theme';

  const setTheme = t => {
    html.setAttribute('data-theme', t);
    localStorage.setItem(KEY, t);
  };

  const saved = localStorage.getItem(KEY);
  if (saved) { setTheme(saved); }
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) { setTheme('dark'); }

  toggle?.addEventListener('click', () => {
    setTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
  });


  /* ──────────────────────────────────────────────────────────
     2. STICKY HEADER + SCROLL SPY
  ────────────────────────────────────────────────────────── */
  const header   = document.getElementById('header');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 40);
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
  }, { passive: true });


  /* ──────────────────────────────────────────────────────────
     3. MOBILE MENU
  ────────────────────────────────────────────────────────── */
  const burger  = document.getElementById('mobileMenu');
  const navList = document.getElementById('navLinks');

  burger?.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    burger.classList.toggle('open', open);
  });
  navAnchors.forEach(a => a.addEventListener('click', () => {
    navList.classList.remove('open');
    burger?.classList.remove('open');
  }));
  document.addEventListener('click', e => {
    if (!header?.contains(e.target)) {
      navList?.classList.remove('open');
      burger?.classList.remove('open');
    }
  });


  /* ──────────────────────────────────────────────────────────
     4. SCROLL REVEAL
  ────────────────────────────────────────────────────────── */
  const revEls = document.querySelectorAll('.fade-up, .fade-left');
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
  }, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });
  revEls.forEach(el => ro.observe(el));


  /* ──────────────────────────────────────────────────────────
     5. NUMBER COUNTERS
  ────────────────────────────────────────────────────────── */
  const counters = document.querySelectorAll('.count[data-to]');
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.to, 10);
      const dur = 1800;
      const step = 16;
      const inc  = end / (dur / step);
      let cur = 0;
      const t = setInterval(() => {
        cur += inc;
        if (cur >= end) { el.textContent = end; clearInterval(t); }
        else { el.textContent = Math.floor(cur); }
      }, step);
      co.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => co.observe(el));


  /* ──────────────────────────────────────────────────────────
     6. LAPTOP SLIDE SHOW
  ────────────────────────────────────────────────────────── */
  const slides  = document.querySelectorAll('.lm-slide');
  const sdBtns  = document.querySelectorAll('.sd');
  let cur = 0, slTimer;

  function goSlide(i) {
    slides.forEach(s  => s.classList.remove('active'));
    sdBtns.forEach(b  => b.classList.remove('active'));
    cur = (i + slides.length) % slides.length;
    slides[cur]?.classList.add('active');
    sdBtns[cur]?.classList.add('active');
  }
  function startSlide() {
    clearInterval(slTimer);
    slTimer = setInterval(() => goSlide(cur + 1), 3500);
  }
  sdBtns.forEach(b => b.addEventListener('click', () => { goSlide(+b.dataset.i); startSlide(); }));
  if (slides.length) { goSlide(0); startSlide(); }


  /* ──────────────────────────────────────────────────────────
     7. TESTIMONIALS SLIDER
  ────────────────────────────────────────────────────────── */
  const tcards   = document.querySelectorAll('.testi-card');
  const tdots    = document.querySelectorAll('.tn-dot');
  const tPrev    = document.getElementById('tPrev');
  const tNext    = document.getElementById('tNext');
  let tCur = 0, tTimer;

  function goTesti(i) {
    tcards.forEach(c => c.classList.remove('active'));
    tdots.forEach(d  => d.classList.remove('active'));
    tCur = (i + tcards.length) % tcards.length;
    tcards[tCur]?.classList.add('active');
    tdots[tCur]?.classList.add('active');
  }
  function startTesti() { clearInterval(tTimer); tTimer = setInterval(() => goTesti(tCur + 1), 6000); }
  tPrev?.addEventListener('click', () => { goTesti(tCur - 1); startTesti(); });
  tNext?.addEventListener('click', () => { goTesti(tCur + 1); startTesti(); });
  tdots.forEach(d => d.addEventListener('click', () => { goTesti(+d.dataset.i); startTesti(); }));
  if (tcards.length) { goTesti(0); startTesti(); }


  /* ──────────────────────────────────────────────────────────
     8. ESTIMATOR
  ────────────────────────────────────────────────────────── */
  const cbs         = document.querySelectorAll('.est-cb');
  const durSlider   = document.getElementById('durSlider');
  const durLabel    = document.getElementById('durLabel');
  const durSection  = document.getElementById('durSection');
  const addPriority = document.getElementById('addPriority');
  const addAnalytics= document.getElementById('addAnalytics');
  const esItems     = document.getElementById('esItems');
  const esTotal     = document.getElementById('esTotal');
  const esBadge     = document.getElementById('esBadge');
  const waBtn       = document.getElementById('waBtn');

  const INR = n => '₹' + n.toLocaleString('en-IN');

  function calcEstimate() {
    const months   = parseInt(durSlider?.value || 1, 10);
    let hasMonthly = false;
    let total      = 0;
    const lines    = [];
    const names    = [];

    cbs.forEach(cb => {
      if (!cb.checked) return;
      const name  = cb.dataset.name;
      const type  = cb.dataset.type;
      const price = +cb.dataset.price;
      names.push(name);
      if (type === 'monthly') {
        hasMonthly = true;
        const cost = price * months;
        total += cost;
        lines.push({ label:`${name} (${months}mo)`, val:cost });
      } else {
        total += price;
        lines.push({ label:name, val:price });
      }
    });

    // Duration control visibility
    if (durSection) durSection.style.display = hasMonthly ? 'block' : 'none';
    if (durLabel) durLabel.textContent = `${months} Month${months > 1 ? 's' : ''}`;

    // Add-ons
    if (addPriority?.checked)  { total += 5000; lines.push({ label:'⚡ Priority Delivery', val:5000 }); }
    if (addAnalytics?.checked) { total += 3000; lines.push({ label:'📊 Analytics Setup',   val:3000 }); }

    // Discounts
    let disc = 0;
    if (hasMonthly && months >= 12) disc = Math.round(total * 0.20);
    else if (hasMonthly && months >= 6) disc = Math.round(total * 0.10);
    if (disc > 0) {
      const label = months >= 12 ? '🎉 20% Annual Discount' : '🎉 10% Six-Month Discount';
      total -= disc;
      lines.push({ label, val:-disc, disc:true });
    }

    // Render lines
    if (esItems) {
      if (!lines.length) {
        esItems.innerHTML = '<li class="es-placeholder">Choose services to build your plan</li>';
      } else {
        esItems.innerHTML = lines.map(l => `
          <li class="es-line ${l.disc ? 'disc' : ''}">
            <span>${l.label}</span>
            <span>${l.disc ? '−' + INR(Math.abs(l.val)) : INR(l.val)}</span>
          </li>`).join('');
      }
    }

    // Total
    if (esTotal) esTotal.textContent = INR(total);

    // Tier badge
    let badge = 'Select services →';
    if (total >= 100000)     badge = '🏆 Enterprise Scale';
    else if (total >= 60000) badge = '🚀 Elite Growth';
    else if (total >= 25000) badge = '📈 Growth Starter';
    else if (total > 0)      badge = '✨ Kickstarter';
    if (esBadge) esBadge.textContent = badge;

    // WhatsApp
    if (waBtn) {
      const svcList = names.length ? names.join(', ') : 'Business Growth Services';
      const msg = `Hi Bright Touch Technologies! 👋\n\nI'd like to enquire about your growth services.\n\n*Selected Services:* ${svcList}\n*Estimated Plan:* ${INR(total)} (${months} month${months > 1 ? 's' : ''})\n\nPlease send me a custom growth roadmap. Thank you!`;
      waBtn.href = `https://wa.me/917499323553?text=${encodeURIComponent(msg)}`;
    }
  }

  cbs.forEach(cb => cb.addEventListener('change', calcEstimate));
  durSlider?.addEventListener('input', calcEstimate);
  addPriority?.addEventListener('change', calcEstimate);
  addAnalytics?.addEventListener('change', calcEstimate);
  calcEstimate();


  /* ──────────────────────────────────────────────────────────
     9. CONTACT FORM
  ────────────────────────────────────────────────────────── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const reset   = document.getElementById('fsReset');
  const cfbMsg  = document.getElementById('cfbMsg');
  const nameEl  = document.getElementById('cName');
  const submitEl= document.getElementById('cSubmit');
  const fsMsg   = document.getElementById('fsMsg');

  nameEl?.addEventListener('input', () => {
    const n = nameEl.value.trim();
    if (cfbMsg) {
      cfbMsg.innerHTML = n
        ? `Hey <strong>${n}</strong>! 👋 Great to meet you. Tell us about your business goals and we'll create a custom growth plan within 2 hours.`
        : `Welcome! Tell us about your business and growth goals — we'll craft a custom roadmap for you.`;
    }
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name  = nameEl?.value.trim();
    const email = document.getElementById('cEmail')?.value.trim();
    if (!name || !email) return;

    if (submitEl) { submitEl.disabled = true; submitEl.textContent = 'Sending...'; }

    setTimeout(() => {
      // Build selected services from estimator
      const sel = [];
      cbs.forEach(cb => { if (cb.checked) sel.push(cb.dataset.name); });
      const svcStr = sel.length ? sel.join(', ') : 'your growth goals';

      if (fsMsg) {
        fsMsg.innerHTML = `Our senior strategist will reach out to <strong>${email}</strong> within 2 hours with a custom growth roadmap covering <strong>${svcStr}</strong>.`;
      }

      form.style.display = 'none';
      success?.classList.add('show');

      if (submitEl) {
        submitEl.disabled = false;
        submitEl.innerHTML = 'Submit & Get Your Roadmap <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      }
    }, 1600);
  });

  reset?.addEventListener('click', () => {
    form?.reset();
    form.style.display = 'block';
    success?.classList.remove('show');
    if (cfbMsg) cfbMsg.textContent = `Welcome! Tell us about your business and growth goals — we'll craft a custom roadmap for you.`;
  });


  /* ──────────────────────────────────────────────────────────
     10. SMOOTH SCROLL
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const hh = parseInt(getComputedStyle(html).getPropertyValue('--header-h'), 10) || 70;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - hh - 16, behavior:'smooth' });
    });
  });

});
