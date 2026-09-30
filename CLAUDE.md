# Project context for Claude

## Goal
Two single-page Claude Artifacts sharing one engine:
1. **Tallgrass Data Journey** (`data-journey/`): the owner's Matillion presales live demo. Fictional retailer moving
   from an on-premise SQL Server EDW to Databricks with Matillion, framed around AI readiness. This is the active project.
2. **Master Data Atlas** (`reference-model/`): the original learning project, master data reference model. Stable at v5.

## Current state
- Tallgrass Data Journey v3: 11 tabs (Start here with 9-step talk track, AI readiness, Network, Current state, Maia,
  Process, Data tests, Regulation, Catalogue, Roadmap, How it's built).
- Master Data Atlas v5: 11 tabs, currency USD.
- Working branch: `claude/youthful-cerf-n09i8x` (the only branch; GitHub's default). No `main` yet.
- Git tags cannot be pushed from Claude sessions (HTTP 403). Versions are tracked in `CHANGELOG.md` and `package.json`.

## Live artifacts (private to owner until shared)
- Tallgrass Data Journey: https://claude.ai/artifact/E9qAq2xH861z7dLuoeTGhv, source `data-journey/index.html`.
- Master Data Atlas: https://claude.ai/artifact/RQwdyLoD7o17zoTmM1Cx9n, source `reference-model/index.html`.
- Republish a file to its own URL when it changes (from another session, read the artifact first, then pass its `url`).
- Both declare `sample` (Ask box) and `downloads` (JSON and .bpmn export).
- GitHub Pages: `https://garniebolling-git.github.io/temp_to_learn/<folder>/` (Ask does not work there).

## Rules for the Tallgrass demo (presales honesty)
- Tallgrass Outfitters and every number are fictional; the page says so.
- Do not state Matillion or Maia capabilities as fact unless the owner supplies a source. Maia content stays badged
  "Illustrative" until replaced with real examples.
- Never label the Ask box as Maia. It is Claude via the artifact viewer.
- No Matillion logos or brand styling unless the owner supplies approved assets.

## Workflow for every change
1. Edit the page's `index.html` (data in the JSON block, code in the IIFE).
2. Run `npm test` (Playwright uses `/opt/pw-browsers/chromium` in Claude cloud sessions). Fix any failure.
3. Look at `tests/out/<folder>/tab-*.png` (and `beat-*.png` for the demo) for what you changed.
4. Republish the artifact to the same URL.
5. Add a `CHANGELOG.md` entry with the artifact version id from the publish result, bump `package.json` version,
   update `README.md` "Current version", `docs/roadmap.md` and `docs/decisions.md` when relevant.
6. Commit and push to the working branch.

## Rules we agreed on
- Do not copy the original third-party artifact. Rebuild patterns in our own code. See `docs/decisions.md`.
- All data is fictional example data (company: Alder Street Supply) until the owner supplies real data.
- Data lives in the `<script id="model">` JSON block. Views are generated from it. Stable IDs:
  domain `D01`, subject area `D01.01`, attribute `D01-A001`, system `S01`, process `P01`, control `C01`,
  process step `P01.1`, DQ rule `DQ01`, regulation `R01`, glossary `G01`, value driver `V01`, wave `W1`.
  Full field reference: `reference-model/README.md`.
- New entity types: add to `KINDS` (label, list key, color) and link them in the relations block after `STEPS`.
  They then work in the inspector, chips and Ask with no further code. Add the key to the ID list in `tests/check.js`.
- Tabs are listed in `TABS`; each has a `view-<key>` panel and a `render<Name>()` called from `renderAll()`.
- BPMN: one layout (`BG`, `bpmnModel`) feeds both the SVG and the exported XML. `npm test` validates exports.
- Any Claude-powered feature must return IDs, and the page must drop IDs not found in the model.
- Keep all page code inside one IIFE (avoids global name clashes with the viewer's scripts).
- Viewer edits (maturity scores, value inputs) live in browser storage only. Shared state would need the `db` capability.
- Regulation dates are learning summaries. Do not present them as verified legal dates.

## Where things are
- `HANDOFF.md`: how to move this project to a work account; first-session tasks there.
- `README.md`: overview, links, tabs, how to run checks.
- `data-journey/README.md`: demo flow, honesty rules, data model for the Tallgrass page.
- `reference-model/README.md`: data model fields and relation types.
- `tests/check.js`: automated checks.
- `docs/original-artifact-analysis.md`: how the reference artifact was built.
- `docs/roadmap.md`: what is built, next candidates, open questions.
- `docs/decisions.md`: decisions and why.
- `CHANGELOG.md`: each version, with the artifact version it was published as.

## Owner preferences for replies
Direct, factual, no filler. Correct wrong premises. No em dashes.
