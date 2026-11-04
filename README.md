# RoboWeave

Project website for **RoboWeave: Benchmarking the Interplay of Agentic Capabilities in Embodied Tasks**. Formerly published as EmbodiedScope.

Authors: Yuanshuai Li*, Yuping Yan*, Jiaqi Gu, Yujing Lou, Lubin Fan, and Yaochu Jin (corresponding).

Affiliations: Westlake University; Alibaba Token Hub, Alibaba Group.

*Equal contribution.

## Website

https://shawnlee0910.github.io/embodiedscope/

Static HTML, CSS and JavaScript. GitHub Pages publishes the repository root on `main`; the checked-in files need no server build or runtime CDN. The repository name and public URL are retained.

The opening is a scroll-directed 3D introduction: the camera pulls back and orbits, two solid blue/orange ribbons form around the RoboWeave robot, four capability paths arrive, and the scene gives way to the title and authors. Scroll backward to reverse the sequence. Chapter controls, Skip intro, and Replay intro provide direct navigation. It animates only in response to scrolling, and stops rendering off screen. Reduced-motion and unavailable/lost WebGL contexts show the complete static title page instead.

The Scenes section follows the introduction and statistics. Its 40-second row-scrolling household showcase is a web-encoded copy of the author-provided video (1080p H.264, muted, with a static poster). The video has no native controls or timeline; a separate Play/Pause button and View larger link sit below the footage. View larger opens fullscreen or the video directly. The video loads near the section, plays while visible, and pauses off screen or in a background tab. Reduced-motion and data-saving preferences disable automatic playback. Manual pauses are preserved when scrolling away and back. The source recording is retained outside the repository.

`src/intro-scene.js` is the original scene source; `intro.js` is its bundled browser build with Three.js 0.187.0. See `THIRD_PARTY_LICENSES.txt`. The existing logo was recreated as procedural geometry for this introduction; no EmbodiedSWE animation frames or research media are redistributed.

Only when editing the 3D scene, run `npm ci` followed by `npm run build:intro`, and commit the updated source and bundled `intro.js` together. Ordinary HTML/CSS changes need no build.

## Research and release status

- Paper PDF: Coming soon
- Benchmark code: Coming soon
- Dataset: Coming soon

This repository contains the project website and research display assets, not the benchmark implementation or raw evaluation dataset. The unpublished manuscript PDF and private Sites configuration are not part of this public repository.

`data.js` is the single source for all interactive success-rate and action-step values. `content.js` only maps those original rows to the presentation; `assets/results.json` is the downloadable table export. All 138 source values were checked against the current manuscript for this update. Model backbone and harness are displayed separately.

Original action illustrations, the original four-panel manuscript figure and its vector PDF, and all three real-robot trajectory figures are retained. These individual examples are not aggregate real-robot benchmark results. The extended task gallery is linked as an access-required private preview; its sharing settings have not been changed.

## Local preview

Run `python -m http.server 8766 --bind 127.0.0.1` from this directory and open http://127.0.0.1:8766/.

The homepage supports theme selection, a reversible scroll introduction, reduced motion, capability tabs, exact-value result tables for SR and AAS, sorting, and expandable research figures. Assets use relative paths so the site also works at the existing `/embodiedscope/` GitHub Pages path.
