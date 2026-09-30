# Handoff: moving this project to a work account

Read this first in the first Claude Code session on the work copy of this repository.
It is written for both the owner and Claude.

## 1. What exists

| Project | Folder | State | What it is |
|---|---|---|---|
| Tallgrass Data Journey | `data-journey/` | v3, active | Matillion presales live demo. Fictional retailer, on-premise SQL Server EDW to Databricks on Azure, framed around AI readiness. 11 tabs, 9-step talk track. |
| Master Data Atlas | `reference-model/` | v5, stable | Original learning project. Master data reference model for a fictional distributor. 11 tabs. |

Both are single HTML files: CSS, a JSON data block (`<script id="model">`) and code in one IIFE.
Every tab is generated from the JSON block. Details: `README.md`, `data-journey/README.md`, `reference-model/README.md`.

Supporting files: `tests/check.js` (`npm test`), `CLAUDE.md` (project rules), `docs/roadmap.md`, `docs/decisions.md`,
`docs/original-artifact-analysis.md`, `CHANGELOG.md`.

## 2. What does not carry over
- The claude.ai artifacts. The links in `CLAUDE.md`, `README.md` and `CHANGELOG.md` belong to the owner's personal
  account (`https://claude.ai/artifact/E9qAq2xH861z7dLuoeTGhv` and `https://claude.ai/artifact/RQwdyLoD7o17zoTmM1Cx9n`).
  They cannot be moved. Republish from the work account (section 4).
- The original conversation. Everything decided in it is recorded in `CLAUDE.md` and `docs/decisions.md`.

## 3. Owner checklist (before the first session)
1. Confirm company policy allows this code and AI-assisted demo material in a work repository.
2. Import the repository into the work GitHub account: `https://github.com/new/import`, source
   `https://github.com/garniebolling-git/temp_to_learn`. Do not fork.
3. Set the new repository to private.
4. Rename the only branch, `claude/youthful-cerf-n09i8x`, to `main` and make it the default.
5. Connect the work GitHub account in the work claude.ai account and start a Claude Code session on the new repository.
6. After the move, keep real Matillion material, customer names and internal figures out of the personal repository.
   Consider making it private or deleting it.

## 4. First session tasks (for Claude)
1. Read `CLAUDE.md`, then this file.
2. Install and run checks: `npm install && npm test`. Both pages must pass.
3. Publish `data-journey/index.html` as a new artifact with capabilities `{"sample": {}, "downloads": true}`.
4. Publish `reference-model/index.html` the same way (optional; ask the owner).
5. Replace the old artifact links with the new ones in `CLAUDE.md`, `README.md`, `CHANGELOG.md` and `data-journey/README.md`.
6. Update the GitHub Pages URLs in `CLAUDE.md` and `README.md` to the new owner and repository name, or remove them if
   Pages is not enabled.
7. In `CLAUDE.md`, replace the "Working branch" line with the new branch setup, and remove the note about the personal
   account.
8. Add a `CHANGELOG.md` entry: "Moved to work account", with the new artifact version ids.
9. Commit and push. Then delete this section or mark it done.

## 5. Rules that must survive the move (presales honesty)
- Tallgrass Outfitters and every number on the demo page are fictional. The page says so in a badge and a footer.
- Maia examples are illustrative, written for the scenario, not captured from the product. They stay badged
  "Illustrative" until replaced with real examples from Matillion demos or documentation.
- The Ask box is Claude via the artifact viewer. Never label it as Maia.
- Do not state Matillion or Maia capabilities as fact without a source from the owner.
- No Matillion logos or brand styling unless the owner supplies approved assets.
- Regulation dates are short summaries, not verified legal dates.

## 6. How to work on the pages
1. Edit the page's `index.html`: data in the JSON block, code in the IIFE.
2. `npm test`. Fix failures. Look at `tests/out/<folder>/tab-*.png` and `beat-*.png`.
3. Republish to the same artifact URL.
4. Update `CHANGELOG.md` (with the artifact version id), `package.json` version, `README.md`, and `docs/` when relevant.
5. Commit and push.

To re-skin the demo for a prospect: edit `meta`, then rename systems and tables in the JSON block. Keep IDs stable.

## 7. Suggested next steps (from `docs/roadmap.md`)
1. Replace the 5 illustrative Maia examples with real ones.
2. Add a value case: engineering hours saved and report latency, with Matillion-approved figures as inputs.
3. Presenter mode: larger type and next/previous buttons for the talk track.
4. A re-skin checklist for each prospect.
5. Optional: approved Matillion branding.

## 8. Known limits
- Ask and downloads work only inside the Claude viewer. On GitHub Pages or a local file, Ask is disabled and downloads
  use a normal browser download.
- Ask and downloads were never tested inside the viewer from the original session. Test them once after republishing.
- Git tags could not be pushed from the original Claude sessions (HTTP 403). This may differ in the work setup.
