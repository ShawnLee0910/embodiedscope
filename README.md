# RoboWeave

Project website for **RoboWeave: Benchmarking the Interplay of Agentic Capabilities in Embodied Tasks**. Formerly published as EmbodiedScope.

Authors: Yuanshuai Li*, Yuping Yan*, Jiaqi Gu, Yujing Lou, Lubin Fan, and Yaochu Jin (corresponding).

Affiliations: Westlake University; Alibaba Token Hub, Alibaba Group.

*Equal contribution.

## Website

https://shawnlee0910.github.io/embodiedscope/

Static HTML, CSS and JavaScript; no build step or dependency installation is needed. GitHub Pages publishes the repository root on `main`. The repository name and public URL are retained.

## Research and release status

- Paper PDF: Coming soon
- Benchmark code: Coming soon
- Dataset: Coming soon

This repository contains the project website and research display assets, not the benchmark implementation or raw evaluation dataset. The unpublished manuscript PDF and private Sites configuration are not part of this public repository.

`data.js` is the single source for all interactive success-rate and action-step values. `content.js` only maps those original rows to the presentation; `assets/results.json` is the downloadable table export. All 138 source values were checked against the current manuscript for this update. Model backbone and harness are displayed separately.

Original action illustrations, the original four-panel manuscript figure and its vector PDF, and all three real-robot trajectory figures are retained. These individual examples are not aggregate real-robot benchmark results. The extended task gallery is linked as an access-required private preview; its sharing settings have not been changed.

## Local preview

Run `python -m http.server 8766 --bind 127.0.0.1` from this directory and open http://127.0.0.1:8766/.

The homepage supports theme selection, reduced motion, capability tabs, exact-value result tables for SR and AAS, sorting, and expandable research figures. Assets use relative paths so the site also works at the existing `/embodiedscope/` GitHub Pages path.
