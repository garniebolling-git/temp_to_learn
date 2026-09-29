# Analysis of the reference artifact

Source reviewed: https://claude.ai/artifact/8YvcgTiUEeeZgLUL3Crm6H ("Lodestar MDM Reference Model").
Authored outside our organization. Reviewed on 2026-09-29 as reference only. Not copied.

## Build
- One HTML file, 1.6 MB. No frameworks or chart libraries. Fonts from Google Fonts (IBM Plex).
- Inline CSS (62K characters) and four inline scripts (largest 438K characters).
- Data: `<script id="graphdata" type="application/json">`, 955 KB, parsed on load.

## Data collections (count)
l1 capabilities 33, l2 136, l3 315, domains 21, subject areas 153, attributes 768, edges 697,
processes 34, process steps 226, industries 11, regulations 67, DQ rules 178, value drivers 25,
countries 5, national ID formats 21.

## Rendering
- Graph: hand-written `<canvas>` renderer with pan, zoom, DPR scaling, colors from CSS variables.
- Other diagrams generated as inline SVG strings: BPMN workflows, lineage, legal calendar, map.

## Runtime capabilities used (`claude.use(...)`)
- `sample`: Ask box and annual report reader.
- `db`: collections `registry`, `accounts`, per-user prefs at `data/users/{id}/prefs`, live via `onSnapshot`.
- `user`: identity and permissions (`id()`, `canEdit()`, `can("data.write")`, `profiles()`).
- `downloads`: file export.
Every call wrapped in try/catch with a fallback message.

## Ask pattern (verification)
1. `askIndex(q)` picks relevant records.
2. `askPrompt` demands JSON: `navigate` (focus ID), `narrate` (answer with `[[ID]]`), `draw` (2 to 8 IDs).
3. `sample.json(prompt, {modelTier:"default"})`.
4. `askVerify` checks every ID against the model. Unknown IDs are stripped and counted.
Document intake uses the same idea: each extracted figure must carry an exact quote found in the source text.

## Views (tab label: question)
Start here · Network · Catalogue (table, list, glossary) · Process ("Where does bad data actually hurt?") ·
DQ rules ("How would we actually test it?") · Regulation ("What forces this, and by when?") ·
Maturity ("How good is it today?") · Value case ("What is it worth?") · Current state · Roadmap · Cockpit · By design.
