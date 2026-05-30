/* Project data + abstract SVG diagrams. Colors via CSS vars so they adapt to theme. */
(function () {
  const A = "var(--accent)";
  const A2 = "var(--accent-2)";
  const L = "var(--accent-line)";
  const F = "var(--text-faint)";
  const G = "var(--grid-line)";

  // shared backdrop grid for diagrams
  const bg = `<rect width="600" height="320" fill="var(--bg-2)"/>
    <g stroke="${G}" stroke-width="1">
      ${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="320"/>`).join("")}
      ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="600" y2="${i * 50}"/>`).join("")}
    </g>`;

  const dot = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const node = (x, y, w, h, label) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="var(--surface)" stroke="${L}"/>
     <text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-family="Space Mono, monospace" font-size="12" fill="var(--text-dim)">${label}</text>`;
  const link = (x1, y1, x2, y2, c = L) => `<path d="M${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}" fill="none" stroke="${c}" stroke-width="1.5"/>`;

  function svg(inner) {
    return `<svg viewBox="0 0 600 320" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${bg}${inner}</svg>`;
  }

  // Real screenshots
  const imgCover = (src, alt) =>
    `<img src="${src}" alt="${alt}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top center;">`;
  const imgContain = (src, alt) =>
    `<img src="${src}" alt="${alt}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#eef1f4;padding:14px;">`;

  // 1. Image Classification Pipeline — distributed nodes converging
  const viz1 = svg(`
    ${[60, 120, 180, 240].map((y) => link(120, y, 300, 160, L)).join("")}
    ${link(300, 160, 470, 110, A)}${link(300, 160, 470, 210, A)}
    ${[60, 120, 180, 240].map((y, i) => node(50, y - 16, 130, 32, "img " + (i + 1))).join("")}
    <rect x="270" y="130" width="60" height="60" rx="14" fill="var(--surface)" stroke="${A}" stroke-width="1.5"/>
    <text x="300" y="164" text-anchor="middle" font-family="Space Grotesk" font-size="13" fill="${A}">EMR</text>
    ${node(420, 94, 120, 32, "PCA ↓60%")}
    ${node(420, 194, 120, 32, "TensorFlow")}
    ${dot(300, 160, 38, "none")}`);

  // 2. Water network optimization — topology + improvement curve
  const viz2 = svg(`
    <g stroke="${L}" stroke-width="1.5" fill="none">
      <path d="M70 240 L160 120 L260 200 L360 90 L470 170 L540 80"/>
    </g>
    ${[[70, 240], [160, 120], [260, 200], [360, 90], [470, 170], [540, 80]].map(([x, y]) => dot(x, y, 5, A)).join("")}
    <path d="M70 250 C 200 250, 240 150, 540 130" fill="none" stroke="${A2}" stroke-width="2" stroke-dasharray="4 5"/>
    <text x="80" y="60" font-family="Space Mono, monospace" font-size="12" fill="var(--text-dim)">water loss −25%</text>
    <text x="500" y="115" font-family="Space Mono, monospace" font-size="11" fill="${A2}">optimised</text>`);

  // 3. AeyeSafety4U — app + vision pipeline
  const viz3 = svg(`
    <rect x="60" y="70" width="120" height="190" rx="16" fill="var(--surface)" stroke="${L}"/>
    <rect x="76" y="92" width="88" height="54" rx="8" fill="${A}" opacity="0.18"/>
    <rect x="76" y="158" width="88" height="8" rx="4" fill="${L}"/>
    <rect x="76" y="174" width="60" height="8" rx="4" fill="${L}"/>
    <circle cx="120" cy="119" r="14" fill="none" stroke="${A}" stroke-width="1.5"/><path d="M114 119l4 4 8-9" stroke="${A}" stroke-width="2" fill="none"/>
    ${link(180, 130, 330, 110, A)}${link(180, 170, 330, 210, L)}
    ${node(330, 94, 150, 32, "Vision API")}
    ${node(330, 194, 150, 32, "LoRA / QLoRA")}
    ${link(480, 110, 540, 160, A)}${link(480, 210, 540, 160, A)}
    <rect x="500" y="140" width="80" height="40" rx="10" fill="var(--surface)" stroke="${A}" stroke-width="1.5"/>
    <text x="540" y="165" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" fill="${A}">&lt;3s</text>`);

  // 4. SpreadsheetAnalyzer — agent graph
  const viz4 = svg(`
    ${node(60, 144, 110, 32, "query")}
    ${link(170, 160, 250, 100, A)}${link(170, 160, 250, 220, A)}
    ${node(250, 84, 130, 32, "plan")}
    ${node(250, 204, 130, 32, "extract")}
    ${link(380, 100, 450, 160, A)}${link(380, 220, 450, 160, A)}
    <rect x="430" y="138" width="44" height="44" rx="11" fill="var(--surface)" stroke="${A}" stroke-width="1.5"/>
    <circle cx="452" cy="160" r="3" fill="${A}"/>
    ${link(474, 160, 540, 160, A2)}
    ${node(490, 144, 90, 32, "answer")}
    <path d="M315 116 C 360 140, 360 180, 315 204" fill="none" stroke="${L}" stroke-width="1.2" stroke-dasharray="3 4"/>
    <text x="318" y="166" text-anchor="middle" font-family="Space Mono, monospace" font-size="10" fill="${F}">loop</text>`);

  // 5. BeLeaf AI — feature constellation
  const viz5 = svg(`
    <circle cx="300" cy="160" r="44" fill="var(--surface)" stroke="${A}" stroke-width="1.5"/>
    <text x="300" y="165" text-anchor="middle" font-family="Space Grotesk" font-size="14" fill="${A}">BeLeaf</text>
    ${[[140, 80, "chatbot"], [470, 90, "voice"], [150, 250, "face ID"], [460, 250, "REST"]].map(([x, y, t]) =>
      `${link(300, 160, x, y, L)}${node(x - 55, y - 16, 110, 32, t)}`).join("")}
    <circle cx="300" cy="160" r="64" fill="none" stroke="${L}" stroke-width="1" stroke-dasharray="2 6"/>`);

  // 6. BisViews — data pipeline / countries
  const viz6 = svg(`
    ${node(50, 144, 110, 32, "free APIs")}
    ${link(160, 160, 240, 160, A)}
    ${node(240, 130, 120, 60, "clean +")}
    <text x="300" y="172" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" fill="${A}">geocode</text>
    ${link(360, 160, 440, 110, A)}${link(360, 160, 440, 160, A)}${link(360, 160, 440, 210, A)}
    ${[110, 160, 210].map((y, i) => `<rect x="440" y="${y - 14}" width="110" height="28" rx="6" fill="var(--surface)" stroke="${L}"/><rect x="448" y="${y - 4}" width="${[80, 60, 94][i]}" height="6" rx="3" fill="${A}" opacity="0.5"/>`).join("")}
    <text x="80" y="100" font-family="Space Mono, monospace" font-size="11" fill="var(--text-dim)">50,000+ records</text>`);

  window.PROJECTS = [
    {
      title: "Image Classification Pipeline",
      role: "DISTRIBUTED ML ON AWS",
      tech: ["AWS EMR", "PySpark", "TensorFlow", "PCA", "S3"],
      desc: "A distributed pipeline that ingests, reduces and classifies imagery at scale on managed Spark clusters.",
      long: "Built an end-to-end image classification system on AWS EMR, orchestrating PySpark jobs to preprocess and featurise over ten thousand images. Applied PCA for aggressive dimensionality reduction before training, cutting feature size by 60% while preserving accuracy — and tuned cluster sizing to bring compute spend down by 70%.",
      metrics: [{ v: "10,000+", l: "Images processed" }, { v: "60%", l: "Dimensionality cut" }, { v: "70%", l: "Cost saved" }],
      viz: viz1,
    },
    {
      title: "Resilient Water Network Optimization",
      role: "OPTIMIZATION FRAMEWORK",
      tech: ["Python", "WNTR", "EPANET"],
      desc: "A simulation-driven framework that stress-tests water distribution networks and optimises for resilience.",
      long: "Engineered an optimization framework on top of WNTR and EPANET to model municipal water networks under failure. Automated four disruption scenarios and searched configurations that reduced simulated water loss by more than 25%, turning a manual modelling chore into a repeatable, scriptable study.",
      metrics: [{ v: "25%+", l: "Water-loss reduction" }, { v: "4", l: "Scenarios automated" }, { v: "100%", l: "Reproducible runs" }],
      viz: imgContain("images/water-network.png", "EPANET hydraulic model of the campus water network — 45 pipes, 33 junctions across 5 pressure zones"),
    },
    {
      title: "AeyeSafety4U — AI Food Safety Assistant",
      role: "FULL-STACK AI APPLICATION",
      tech: ["React", "Flask", "Google Vision API", "LoRA", "QLoRA"],
      desc: "A full-stack assistant that reads food labels with computer vision and returns personalised safety guidance.",
      long: "Designed and shipped a full-stack AI app: a React front end talking to a Flask service that pairs Google Vision label extraction with a LoRA/QLoRA fine-tuned language model. Personalised recommendations return in under three seconds, and quantised adapters dropped inference cost by 40% versus full fine-tuning.",
      metrics: [{ v: "<3s", l: "Recommendation latency" }, { v: "40%", l: "Inference cost cut" }, { v: "2", l: "Models orchestrated" }],
      viz: imgCover("images/aeyesafety-home.jpg", "AEye4Safety — Scan Smarter, Eat Safer landing screen"),
      screens: [
        { src: "images/aeyesafety-home.jpg", alt: "AEye4Safety landing and upload screen" },
        { src: "images/aeyesafety-analysis.jpg", alt: "AEye4Safety analysis results with safety assessment and recommendations" },
        { src: "images/aeyesafety-profile.jpg", alt: "AEye4Safety personalised health profile" },
      ],
    },
    {
      title: "SpreadsheetAnalyzer AI Agent",
      role: "LLM AGENTIC SYSTEM",
      tech: ["React", "FastAPI", "LangGraph"],
      desc: "A conversational agent that plans, extracts and reasons over messy spreadsheets in multiple steps.",
      long: "Architected an agentic system with LangGraph where a planner decomposes a natural-language request, an extractor pulls structured data from spreadsheets, and a reasoning loop refines results until they satisfy the query. A FastAPI backend streams progress to a React chat interface for transparent, multi-step data extraction.",
      metrics: [{ v: "Multi-step", l: "Reasoning loops" }, { v: "NL→data", l: "Conversational input" }, { v: "Streaming", l: "Live agent trace" }],
      viz: imgCover("images/spreadsheet-agent.png", "Spreadsheet Analysis Agent — start a new analysis"),
      screens: [
        { src: "images/spreadsheet-agent.png", alt: "Spreadsheet Analysis Agent interface powered by LangGraph" },
      ],
    },
    {
      title: "BeLeaf AI",
      role: "PRODUCT + AI FEATURES",
      tech: ["TypeScript", "React", "Firebase", "Gemini", "REST"],
      desc: "An educational product with an ML chatbot, voice assistant and facial-recognition sign-in.",
      long: "Owned the product roadmap and built the AI feature set for BeLeaf — a Gemini-powered learning chatbot, a hands-free voice assistant, and facial-recognition entry — on a TypeScript/React/Firebase stack. The features lifted user-interaction efficiency by 40% and earned 100% positive approval across ten pilot classrooms.",
      metrics: [{ v: "40%", l: "Interaction efficiency" }, { v: "100%", l: "Classroom approval" }, { v: "10", l: "Pilot classrooms" }],
      viz: viz5,
    },
    {
      title: "BisViews Data Ingestion &amp; Quality",
      role: "DATA ENGINEERING AT SCALE",
      tech: ["Python", "Google Places API", "Nominatim", "SQL", "pandas"],
      desc: "A cost-optimized, multilayered ingestion engine that drains free sources before paid ones — with validation pipelines guarding quality.",
      long: "At BisViews I build the data-engineering backbone: a multilayered ingestion strategy that exhausts free sources like Nominatim and open data before ever calling a paid API such as Google Places, minimising cost per enriched record. On top of that sit automated data-quality validation pipelines that catch and repair issues in flight. The system has processed more than 50,000 records across 10+ European countries since February 2026.",
      metrics: [{ v: "50,000+", l: "Records processed" }, { v: "10+", l: "European countries" }, { v: "Free→paid", l: "Tiered ingestion" }],
      viz: viz6,
    },
  ];

  // Render cards into the grid (before app.js wires handlers)
  function render() {
    const grid = document.getElementById("proj-grid");
    if (!grid) return;
    grid.innerHTML = window.PROJECTS.map((p, i) => `
      <article class="proj-card reveal d${(i % 3) + 1}" data-idx="${i}" tabindex="0" role="button" aria-label="Open ${p.title} details">
        <div class="proj-viz">${p.viz}</div>
        <div class="proj-body">
          <div class="tech-row">${p.tech.slice(0, 4).map((t) => `<span class="tech">${t}</span>`).join("")}</div>
          <h3>${p.title}</h3>
          <div class="role">${p.role}</div>
          <p class="desc">${p.desc}</p>
          <div class="metrics">
            ${p.metrics.map((m) => `<div class="metric"><div class="mv">${m.v}</div><div class="ml">${m.l}</div></div>`).join("")}
          </div>
          <div class="proj-open">View case study
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17L17 7M9 7h8v8"/></svg>
          </div>
        </div>
      </article>`).join("");
  }
  if (document.getElementById("proj-grid")) render();
  else document.addEventListener("DOMContentLoaded", render);
})();
