/* View metadata only. All interactive scores come from the original data.js. */
(() => {
  'use strict';
  const metadata = {
  "GPT-6 Astra": {
    "id": "astra-base",
    "model": "GPT-6 Astra",
    "harness": "Base",
    "kind": "agent"
  },
  "GPT-6 Astra + Codex": {
    "id": "astra-codex",
    "model": "GPT-6 Astra",
    "harness": "Codex",
    "kind": "agent"
  },
  "GPT-5.6 Sol": {
    "id": "sol-base",
    "model": "GPT-5.6 Sol",
    "harness": "Base",
    "kind": "agent"
  },
  "GPT-5.6 Sol + Codex": {
    "id": "sol-codex",
    "model": "GPT-5.6 Sol",
    "harness": "Codex",
    "kind": "agent"
  },
  "Opus 5.5 + Claude Code": {
    "id": "opus-claude",
    "model": "Opus 5.5",
    "harness": "Claude Code",
    "kind": "agent"
  },
  "Gemini-3.8-Flash": {
    "id": "gemini-base",
    "model": "Gemini-3.8-Flash",
    "harness": "Base",
    "kind": "agent"
  },
  "DeepSeek-V4.1-Flash": {
    "id": "deepseek-base",
    "model": "DeepSeek-V4.1-Flash",
    "harness": "Base",
    "kind": "agent"
  },
  "GLM-5.3-Flash": {
    "id": "glm-base",
    "model": "GLM-5.3-Flash",
    "harness": "Base",
    "kind": "agent"
  },
  "Qwen3.8-Max": {
    "id": "qwen-max-base",
    "model": "Qwen3.8-Max",
    "harness": "Base",
    "kind": "agent"
  },
  "Qwen3.8-27B": {
    "id": "qwen-27b-base",
    "model": "Qwen3.8-27B",
    "harness": "Base",
    "kind": "agent"
  },
  "Human (Avg.)": {
    "id": "human-average",
    "model": "Human (average)",
    "harness": "—",
    "kind": "human"
  },
  "Human (Best-of-3)": {
    "id": "human-best3",
    "model": "Human (best of 3)",
    "harness": "—",
    "kind": "human"
  }
};
  const columns = ['L0','L1-A','L1-M','L1-P','L1-V','L2'];
  const results = DATA.sr_rows.map(row => ({...metadata[row.name],values:columns.map(key => row.values[key])}));
  const stepResults = DATA.aas_rows.map(row => {
    const name = row.name.replace('Opus 5.5 (Claude Code)','Opus 5.5 + Claude Code');
    const info = name === 'Human' ? {id:'human-steps',model:'Human',harness:'—',kind:'human'} : metadata[name];
    return {...info,values:columns.map(key => row.values[key])};
  });
  window.ROBO_WEAVE_DATA = {results,stepResults,capabilities:{
  "A": {
    "name": "Active Information Acquisition",
    "category": "L1-A / EVIDENCE SEEKING",
    "title": "Find what you cannot yet see.",
    "description": "Change viewpoint and position to locate a magazine, then move it from the reading-area desk to the coffee table.",
    "demand": "Actively acquire the missing visual evidence needed for the next decision.",
    "label": "L1-A · Magazine retrieval",
    "alt": "Magazine retrieval episode with viewpoint changes, blocked navigation, picking, and placing",
    "width": 2200,
    "height": 2409,
    "image": "assets/explore.webp"
  },
  "M": {
    "name": "Memory",
    "category": "L1-M / ORIGINAL-ROLE TRACKING",
    "title": "Remember where things began.",
    "description": "Move milk cartons between a dining table and a counter while identifying them by their original locations.",
    "demand": "Keep task-relevant history available after the current scene has changed.",
    "label": "L1-M · Tracking milk cartons",
    "alt": "Milk-carton episode showing intermediate moves and the demand to remember original object locations",
    "width": 1853,
    "height": 3000,
    "image": "assets/memory.webp"
  },
  "P": {
    "name": "Physical Reasoning",
    "category": "L1-P / SUPPORT SELECTION",
    "title": "Choose a support that works.",
    "description": "Inspect the scene, pick up a soap dispenser, and place it on the selected support.",
    "demand": "Reason about physical conditions and the consequences of the proposed placement.",
    "label": "L1-P · Support selection",
    "alt": "Recorded soap-dispenser episode illustrating support selection and physical placement",
    "width": 2200,
    "height": 1641,
    "image": "assets/physics.webp"
  },
  "V": {
    "name": "Verification and Recovery",
    "category": "L1-V / OUTCOME INSPECTION",
    "title": "Check the outcome. Adapt.",
    "description": "Close a microwave door, inspect the state after an intervention reopens it, and close the door again.",
    "demand": "Verify the resulting state and recover instead of assuming an earlier action finished the task.",
    "label": "L1-V · Microwave recovery",
    "alt": "Microwave episode showing a closing action, an intervention reopening the door, and a second closing action",
    "width": 2200,
    "height": 872,
    "image": "assets/recovery.webp"
  }
}};
})();
