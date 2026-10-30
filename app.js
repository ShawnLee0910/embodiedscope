/* Original RoboWeave homepage. No dependencies or analytics. */
(() => {
  'use strict';
  const data = window.ROBO_WEAVE_DATA;
  if (!data) return;
  const $ = (selector) => document.querySelector(selector);
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const readPreference = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Private browsing is supported. */ } };
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    const next = theme === 'dark' ? 'light' : 'dark';
    $('#theme-toggle').setAttribute('aria-label', `Switch to ${next} theme`);
    $('meta[name="theme-color"]').content = theme === 'dark' ? '#0b1018' : '#f8f9fc';
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

  // A light, original weave animation echoes the four capability strands.
  const canvas = $('#weave-canvas');
  const context = canvas.getContext('2d');
  let width = 0, height = 0, frame = 0, phase = 0;
  let paused = reducedMotion.matches || readPreference('roboweave-motion') === 'paused';
  const resize = () => { const dpr = Math.min(devicePixelRatio || 1,2); width = canvas.clientWidth; height = canvas.clientHeight; canvas.width = width*dpr; canvas.height = height*dpr; if (context) context.setTransform(dpr,0,0,dpr,0,0); draw(); };
  function draw() {
    if (!context) return;
    context.clearRect(0,0,width,height);
    const light = root.dataset.theme === 'light';
    const colors = light ? ['#2469a512','#a7602b12','#8055ae0c','#24745e0c'] : ['#79bdff14','#ffaf7212','#baadff0e','#8ed7bb0c'];
    for (let strand=0;strand<4;strand++) {
      context.beginPath();
      for (let x=width*.35;x<=width+8;x+=8) { const progress=x/width; const y=height*.51 + Math.sin(progress*8+phase+strand*1.2)*(45+strand*24)+Math.cos(progress*4+strand)*height*.13; x===width*.35 ? context.moveTo(x,y) : context.lineTo(x,y); }
      context.strokeStyle=colors[strand]; context.lineWidth=1; context.stroke();
    }
    for(let i=0;i<32;i++){const x=((i*137.5)%1000)/1000*width;const y=((i*83.7)%700)/700*height;context.fillStyle=light?'#4a699322':'#b2d7ff35';context.beginPath();context.arc(x,y,i%5===0?1:.55,0,Math.PI*2);context.fill();}
  }
  function animate() { frame=0; if (paused || document.hidden || !context) return; phase+=0.002;draw();frame=requestAnimationFrame(animate); }
  function syncMotion() { document.body.classList.toggle('motion-paused',paused);$('#motion-toggle').setAttribute('aria-pressed',String(paused));$('#motion-label').textContent=paused?'Resume motion':'Pause motion';$('#motion-symbol').textContent=paused?'▷':'Ⅱ';if(frame)cancelAnimationFrame(frame);frame=0;draw();if(!paused&&!document.hidden)frame=requestAnimationFrame(animate); }
  $('#motion-toggle').addEventListener('click',()=>{paused=!paused;savePreference('roboweave-motion',paused?'paused':'playing');syncMotion();});
  reducedMotion.addEventListener('change',()=>{paused=reducedMotion.matches;syncMotion();});
  document.addEventListener('visibilitychange',syncMotion);
  new MutationObserver(draw).observe(root,{attributes:true,attributeFilter:['data-theme']});
  addEventListener('resize',()=>{resize();updateProgress();});
  resize();syncMotion();
})();
