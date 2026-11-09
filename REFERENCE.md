# EEGo Lab design reference

- Website: https://eego-unc.github.io/Lab/#home
- Repository: https://github.com/EEGo-UNC/Lab
- Inspected commit: `5ebe215c6bcb4a2cc4d4c6c2f91928c336fbedd8`
- Inspected on: October 22, 2026

The reference is a plain HTML/CSS/JavaScript site. This project implements its layout and interaction patterns as React components with Vite. The palette is customized to white, black, and grey, with a white background by default.

## Reference mapping

| Reference | React implementation |
| --- | --- |
| `css/styles.css` | Inter and IBM Plex Mono, header sizing, card borders, easing tokens, responsive layout; colors customized to monochrome |
| `js/main.js` | Hash-based pages; 0.2-second exit fade, 0.45-second entrance fade; shrinking header; sliding navigation indicator; theme toggle; Lenis with `lerp: 0.12` |
| `js/lib/motion.js` | 1-second character rise with 0.045-second stagger; 0.9-second block entrances; scroll reveals at 88%; cards at 82%; 1.2-second visual wipes |
| `js/pages/home.js` | EEG backdrop, parallax visual, and scroll-driven word highlighting |
| `js/waveform.js`, `js/lib/signal.js` | React canvas adaptation of seeded synthetic traces, including the seed-11 hero configuration |

The name backdrop uses the reference’s `rowPx: 26`, `inkAlpha: 0.32`, `bandAlpha: 0.55`, and 14 synthetic channels. The accent/ink/theta/alpha/beta tokens use grey values. Its math and seeded generator follow the inspected implementation. React owns its resize, visibility, and animation cleanup.

The homepage project button uses the EEGo Lab logo from the reference’s `assets/lab/eego-logo-dark.webp`, as requested. At the user's request, Publications also includes their two research entries and design award, with corresponding diagrams and award photography. Projects includes EEGo Lab, EEGProc, Neuroadaptive Tetris, the COMP 110 Course Website, and BullBull. The Tetris and honors-thesis illustrations were supplied by the owner; the course-site image is a screenshot of its public homepage. See [CONTENT_SOURCES.md](CONTENT_SOURCES.md) for content provenance. The optional biography and Opinions remain empty until supplied.

Credit for the reference design and waveform approach belongs to the EEGo Lab repository contributors. No upstream license file was present in the inspected repository; this project does not assign a new license to upstream-derived material.
