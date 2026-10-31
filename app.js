/* Original RoboWeave homepage. Research interactions. No analytics. */
(() => {
  'use strict';
  const data = window.ROBO_WEAVE_DATA;
  if (!data) return;
  const $ = (selector) => document.querySelector(selector);
  const root = document.documentElement;
  const readPreference = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Private browsing is supported. */ } };
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    const next = theme === 'dark' ? 'light' : 'dark';
    $('#theme-toggle').setAttribute('aria-label', `Switch to ${next} theme`);
    $('meta[name="theme-color"]').content = theme === 'dark' ? '#081116' : '#f2f6f7';
  };
  setTheme(readPreference('roboweave-theme') === 'light' ? 'light' : 'dark');
  $('#theme-toggle').addEventListener('click', () => { const theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; setTheme(theme); savePreference('roboweave-theme', theme); });

  const tabs = [...document.querySelectorAll('[data-cap]')];
  let currentCapability = 'A';
  const episodeImage = $('#episode-image');
  function selectCapability(key, focus = false) {
    const cap = data.capabilities[key];
    if (!cap) return;
    currentCapability = key;
    tabs.forEach((tab) => { const active = tab.dataset.cap === key; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; if (active && focus) tab.focus(); });
    $('#capability-panel').setAttribute('aria-labelledby', `tab-${key.toLowerCase()}`);
    $('#episode-category').textContent = cap.category;
    $('#episode-title').textContent = cap.title;
    $('#episode-description').textContent = cap.description;
    $('#episode-demand').textContent = cap.demand;
    $('#episode-media-label').textContent = cap.label;
    episodeImage.src = cap.image;
    episodeImage.alt = cap.alt;
    episodeImage.width = cap.width;
    episodeImage.height = cap.height;
    $('#episode-scroll').scrollTop = 0;
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCapability(tab.dataset.cap));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectCapability(tabs[next].dataset.cap, true); }
    });
  });
  const dialog = $('#episode-dialog');
  document.querySelectorAll('.episode-open').forEach((button) => button.addEventListener('click', () => {
    const cap = data.capabilities[currentCapability];
    $('#dialog-title').textContent = cap.name;
    $('#dialog-description').textContent = cap.description;
    const img = $('#dialog-image'); img.src = cap.image; img.alt = cap.alt; img.width = cap.width; img.height = cap.height;
    dialog.showModal(); dialog.scrollTop = 0; document.body.style.overflow = 'hidden';
  }));
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; });

  const select = $('#model-select');
  data.results.filter((row) => row.kind === 'agent').forEach((row) => { const option = document.createElement('option'); option.value = row.id; option.textContent = row.harness === 'Base' ? `${row.model} · Base` : `${row.model} + ${row.harness}`; select.append(option); });
  function updateChart(id) {
    const row = data.results.find((item) => item.id === id);
    if (!row) return;
    const label = row.harness === 'Base' ? `${row.model} · Base` : `${row.model} + ${row.harness}`;
    const l1 = row.values.slice(1,5).reduce((a,b) => a+b,0)/4;
    const values = {l0:row.values[0],l1,l2:row.values[5]};
    $('#chart-model-title').textContent = label;
    Object.entries(values).forEach(([key,value]) => { $(`#bar-${key}`).style.setProperty('--value', `${value}%`); $(`#value-${key}`).textContent = `${value.toFixed(1)}%`; });
    $('#stage-chart').setAttribute('aria-label', `${label}. Success rate: L0 ${values.l0.toFixed(1)}%, L1 mean ${l1.toFixed(1)}%, L2 ${values.l2.toFixed(1)}%.`);
    document.querySelectorAll('[data-result]').forEach((tr) => tr.classList.toggle('selected-result', tr.dataset.result === id));
  }
  select.value = 'astra-codex'; updateChart(select.value);
  select.addEventListener('change', () => updateChart(select.value));

  // Content stays visible if animation support or JavaScript initialization fails.
  if ('IntersectionObserver' in window) {
    root.classList.add('js');
    const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); } }), {threshold:0.08});
    document.querySelectorAll('.reveal').forEach((element) => reveal.observe(element));
    const navObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { document.querySelectorAll('.nav-links a').forEach((link) => { if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); }); } }), {rootMargin:'-15% 0px -55% 0px'});
    ['overview','benchmark','episodes','results','real-robot','resources'].forEach((id) => navObserver.observe(document.getElementById(id)));
  }
  let scrollPending = false;
  function updateProgress() { const total = root.scrollHeight - innerHeight; $('#reading-progress').style.transform = `scaleX(${total > 0 ? Math.min(1,scrollY/total) : 0})`; scrollPending = false; }
  addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateProgress); } }, {passive:true});
  updateProgress();

})();
