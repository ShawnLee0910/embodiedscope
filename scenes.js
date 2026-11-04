/* Local scene footage, loaded when approached and paused when out of view. */
(() => {
  'use strict';
  const video = document.getElementById('scene-video');
  if (!video) return;
  const toggle = document.getElementById('scene-toggle');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let inView = false;
  let pausedByViewer = false;
  let automaticPause = false;
  let playAttempt = false;
  let wallVisible = true;
  const automaticPlaybackAllowed = () => !reducedMotion.matches && !connection?.saveData;

  function updateToggle() {
    const action = video.paused ? 'Play' : 'Pause';
    toggle.textContent = action;
    toggle.setAttribute('aria-label', `${action} scene showcase`);
  }

  function loadVideo() {
    if (video.getAttribute('src')) return;
    video.src = video.dataset.src;
    video.load();
  }

  function pauseVideo() {
    if (video.paused) return;
    automaticPause = true;
    video.pause();
  }

  function updatePlayback() {
    if (!wallVisible || !inView || document.hidden) {
      pauseVideo();
      return;
    }
    if (!pausedByViewer && automaticPlaybackAllowed() && video.paused && !playAttempt) {
      loadVideo();
      playAttempt = true;
      video.play().catch(updateToggle)
        .finally(() => { playAttempt = false; });
    }
  }

  video.addEventListener('pause', () => {
    if (automaticPause) automaticPause = false;
    else pausedByViewer = true;
    updateToggle();
  });
  video.addEventListener('play', () => { pausedByViewer = false; updateToggle(); });
  toggle.addEventListener('click', () => {
    if (video.paused) {
      pausedByViewer = false;
      loadVideo();
      video.play().catch(updateToggle);
    } else {
      pausedByViewer = true;
      automaticPause = false;
      video.pause();
    }
    updateToggle();
  });
  updateToggle();

  if ('IntersectionObserver' in window) {
    const loadObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      if (!connection?.saveData) loadVideo();
      observer.disconnect();
    }, {rootMargin: '240px 0px'});
    loadObserver.observe(video);
    const playbackObserver = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.15;
      updatePlayback();
    }, {threshold: [0, 0.15]});
    playbackObserver.observe(video);
  } else {
    // The play button is available without scroll-observer support.
    loadVideo();
  }

  document.addEventListener('visibilitychange', updatePlayback);
  document.addEventListener('sceneviewchange', (event) => {
    wallVisible = event.detail.wallVisible;
    updatePlayback();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) pauseVideo();
    else updatePlayback();
  });

  document.getElementById('scene-expand').addEventListener('click', async (event) => {
    if (!video.requestFullscreen && !video.webkitEnterFullscreen) return;
    event.preventDefault();
    loadVideo();
    try {
      if (video.requestFullscreen) await video.requestFullscreen();
      else video.webkitEnterFullscreen();
    } catch {
      // Keep the ordinary video link usable if fullscreen is unavailable.
      window.open(video.dataset.src, '_blank', 'noopener');
    }
  });
})();
