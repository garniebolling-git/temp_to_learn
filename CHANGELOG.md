# Changelog

Artifact: https://claude.ai/artifact/RQwdyLoD7o17zoTmM1Cx9n

## v4 (artifact version 1790701458-0b8f), 2026-09-29
- New tabs: Start here, DQ rules, Regulation, Current state, Maturity, Value case, Roadmap. Attributes tab renamed Catalogue.
- Start here: one card per tab with the question it answers and a live number. Opens by default.
- Catalogue: table, list by domain, and glossary (12 terms).
- DQ rules: 14 rules across 6 dimensions, each with test query, threshold, measured score and meter. 8 below threshold.
- Regulation: 7 laws and standards on a timeline with a today marker, linked to attributes and controls. Flags "No control yet".
- Current state: system by domain matrix (master, copy, creates outside master) and computed findings.
- Maturity: 6 domains by 6 dimensions, 1 to 5, with targets and gaps. Editable, saved in the viewer's browser only.
- Value case: 5 drivers, volume × (today − target) × unit value, €445,560 a year in the example. Editable, browser only.
- Roadmap: 4 waves on a quarterly Gantt with yearly value per wave, linked to domains, controls, rules, steps, regulations.
- Left-rail Domain filter highlights matching cards on every tab. All new records work in the inspector and in Ask.
- Web shop now also creates customers (new relation type `creates`), which Current state flags as a duplicate source.

## v3 (artifact version 1790700832-bdd1), 2026-09-29
- Process tab: Order to Cash, Procure to Pay, Record to Report, 17 example steps in total.
- Each process card: code, value at stake, tally, step strip showing domains written (solid) and read (dashed).
- BPMN 2.0 button: pool, lanes per team, tasks, exclusive gateways, start and end events, data objects per domain.
- Download .bpmn: BPMN 2.0 XML with diagram layout. Validated with bpmn-moddle, 0 warnings for all three.
- Left-rail Domain filter highlights the steps that use the chosen domain.
- Map tab renamed Network. Steps added to the inspector, to Ask and to the model JSON download.
- Downloads fall back to a normal browser download outside the Claude viewer (GitHub Pages).

## v2 (artifact version 1790699325-5551), 2026-09-29
- Page code wrapped in one scope. Script errors shown in a banner at the top of the page.

## v1 (artifact version 1790697930-34b2), 2026-09-29
- Master Data Atlas: map, attributes table with filters, inspector, Ask with ID verification,
  "How it's built" tab, model JSON download. Example data for Alder Street Supply.
