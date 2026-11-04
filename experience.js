/* A shared set of real keyframes powers the overview and episode viewer. */
(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const stories = window.ROBO_WEAVE_STORIES;
  const metadata = window.ROBO_WEAVE_DATA?.capabilities;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let capability = 'A';
  let overviewIndex = 0;
  let episodeIndex = 0;
  let walkthroughTimer = 0;
  let playing = false;
  let overviewVisible = false;
  const overview = $('#weave-overview');
  const colors = {A:'var(--blue)', M:'var(--violet)', P:'var(--orange)', V:'var(--green)'};
  const digits = (value) => String(value).padStart(2, '0');

  function stepButtons(container, current, select) {
    container.replaceChildren(...stories[capability].steps.map((step, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Step ${index + 1}: ${step.title}`);
      if (index === current) button.setAttribute('aria-current', 'step');
      const number = document.createElement('span');
      const name = document.createElement('span');
      number.textContent = digits(index + 1);
      name.textContent = step.short;
      button.append(number, name);
      button.addEventListener('click', () => {
        const keepFocus = document.activeElement === button;
        select(index);
        if (keepFocus) container.children[index]?.focus();
      });
      button.addEventListener('keydown', (event) => {
        let next;
        const count = stories[capability].steps.length;
        if (event.key === 'ArrowRight') next = Math.min(count - 1, index + 1);
        if (event.key === 'ArrowLeft') next = Math.max(0, index - 1);
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = count - 1;
        if (next !== undefined) {
          event.preventDefault();
          select(next);
          container.children[next]?.focus();
        }
      });
      return button;
    }));
  }

  function showFrame(prefix, index) {
    const step = stories[capability].steps[index];
    const image = $(prefix === 'overview' ? '#overview-frame' : '#episode-keyframe');
    image.src = step.image;
    image.alt = `${metadata[capability].name}: ${step.title} Recorded observation ${step.frame}, event ${step.event}; left and right wrist views at left, head-camera view at right.`;
    $(`#${prefix}-step-title`).textContent = step.title;
    $(`#${prefix}-step-caption`).textContent = step.caption;
    $(`#${prefix}-action`).textContent = step.action;
    $(`#${prefix}-receipt`).textContent = step.receipt;
    if (prefix === 'overview') {
      stepButtons($('#overview-steps'), index, (next) => { stopWalkthrough(); renderOverview(next); });
    } else {
      $('#episode-frame-meta').textContent = `OBSERVATION ${String(step.frame).padStart(3, '0')} · ${step.kind === 'marker' ? 'TARGET SELECTION' : 'THREE CAMERA VIEWS'}`;
      $('#episode-step-count').textContent = `${digits(index + 1)} / ${digits(stories[capability].steps.length)}`;
      $('#episode-previous').disabled = index === 0;
      $('#episode-next').disabled = index === stories[capability].steps.length - 1;
      stepButtons($('#episode-steps'), index, renderEpisode);
    }
  }
  function renderOverview(index = 0) { overviewIndex = index; showFrame('overview', index); }
  function renderEpisode(index = 0) { episodeIndex = index; showFrame('episode', index); }
  function stopWalkthrough() {
    playing = false;
    clearTimeout(walkthroughTimer);
    $('#overview-play').textContent = 'Play example ▷';
    $('#overview-play').setAttribute('aria-label', 'Play the recorded keyframe walkthrough');
  }
  function advanceWalkthrough() {
    if (!playing || document.hidden || !overviewVisible) { stopWalkthrough(); return; }
    if (overviewIndex >= stories[capability].steps.length - 1) { stopWalkthrough(); return; }
    renderOverview(overviewIndex + 1);
    walkthroughTimer = setTimeout(advanceWalkthrough, 3200);
  }
  function selectCapability(key) {
    if (!stories[key]) return;
    stopWalkthrough();
    capability = key;
    overview.style.setProperty('--example-accent', colors[key]);
    $('#episode-player').style.setProperty('--example-accent', colors[key]);
    $('#overview-instruction').textContent = stories[key].instruction;
    $('#overview-example-label').textContent = `${key} / ${metadata[key].name.toUpperCase()}`;
    $$('[data-overview-cap]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.overviewCap === key)));
    renderOverview();
    renderEpisode();
  }
  if (stories && metadata) {
    $$('[data-overview-cap]').forEach(button => button.addEventListener('click', () => {
      // The existing gallery tabs own the common capability selection.
      $(`[data-cap="${button.dataset.overviewCap}"]`).click();
    }));
    document.addEventListener('capabilitychange', event => selectCapability(event.detail.capability));
    $('#episode-previous').addEventListener('click', () => renderEpisode(Math.max(0, episodeIndex - 1)));
    $('#episode-next').addEventListener('click', () => renderEpisode(Math.min(stories[capability].steps.length - 1, episodeIndex + 1)));
    $('#overview-play').addEventListener('click', () => {
      if (playing) { stopWalkthrough(); return; }
      if (overviewIndex === stories[capability].steps.length - 1) renderOverview();
      playing = true;
      $('#overview-play').textContent = 'Pause example Ⅱ';
      $('#overview-play').setAttribute('aria-label', 'Pause the recorded keyframe walkthrough');
      walkthroughTimer = setTimeout(advanceWalkthrough, 3200);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopWalkthrough(); });
    reduced.addEventListener('change', () => { if (reduced.matches) stopWalkthrough(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        overviewVisible = entries[0].isIntersecting;
        overview.classList.toggle('is-visible', overviewVisible);
        if (!overviewVisible) stopWalkthrough();
      }, {threshold:0.08}).observe(overview);
    } else overviewVisible = true;
    selectCapability('A');
  }

  const menuButton = $('#menu-toggle');
  const menu = $('#mobile-navigation');
  function closeMenu(returnFocus = false) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  // Close before the introduction's anchor handler measures the fixed header.
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); }, {capture:true});
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) closeMenu(true); });
  document.addEventListener('click', event => { if (!menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); }, {capture:true});
  matchMedia('(min-width: 1101px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const phone = matchMedia('(max-width: 700px)');
  let mobileSceneMode = 'detail';
  function setSceneMode(mode) {
    mobileSceneMode = mode;
    const detail = phone.matches && mode === 'detail';
    $('#scene-detail').hidden = !detail;
    $('#scene-wall').hidden = detail;
    $('.scene-mode').hidden = !phone.matches;
    $$('[data-scene-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.sceneMode === mode)));
    document.dispatchEvent(new CustomEvent('sceneviewchange', {detail:{wallVisible:!detail}}));
  }
  $$('[data-scene-mode]').forEach(button => button.addEventListener('click', () => setSceneMode(button.dataset.sceneMode)));
  phone.addEventListener('change', () => setSceneMode(mobileSceneMode));
  const sceneDetails = {
    room:['The room', 'Overhead view of the robot in a furnished household room'],
    table:['The dining table', 'Overhead close view of the dining table with plates and chairs'],
    counter:['Along the counter', 'Closer view of the household counter and appliances'],
    robot:['The embodied agent', 'Closer view of the robot in the household simulation']
  };
  $$('[data-scene-detail]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.sceneDetail;
    $('#scene-detail-image').src = `assets/scenes/detail-${key}.webp`;
    $('#scene-detail-image').alt = sceneDetails[key][1];
    $('#scene-detail-title').textContent = sceneDetails[key][0];
    $$('[data-scene-detail]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  setSceneMode(mobileSceneMode);
})();
