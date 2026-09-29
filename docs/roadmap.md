# Roadmap

## Tallgrass Data Journey (active)
Built in v1: Start here talk track, AI readiness, Network with lineage, Current state, Maia (illustrative), Process with BPMN,
Data tests, Regulation, Catalogue, Roadmap.

Next candidates:
- Replace illustrative Maia examples with real ones from Matillion demos or documentation.
- Value case: engineering hours (backlog × hours per pipeline) and report latency, with Matillion-approved figures as inputs.
- Presenter mode: larger type and next/previous buttons for the talk track.
- Re-skin kit: a short checklist for swapping company, sources and use cases per prospect.

## Master Data Atlas (stable at v5)

Status: done, next, planned.

| # | View | Data it needs | Status |
|---|------|---------------|--------|
| 1 | Network (graph) | domains, subject areas, systems, processes, controls, relations | done (v1) |
| 2 | Catalogue: table with filters | attributes | done (v1) |
| 3 | Ask with ID verification | whole model | done (v1), untested in viewer |
| 4 | How it's built | none | done (v1) |
| 5 | Process with BPMN 2.0 view and .bpmn export | `steps` | done (v3) |
| 6 | Start here | computed from all collections | done (v4) |
| 7 | DQ rules with test queries and scores | `dq` | done (v4) |
| 8 | Regulation with timeline | `regs` | done (v4) |
| 9 | Catalogue: list by domain, glossary | `glossary` | done (v4) |
| 10 | Current state matrix and findings | computed from `relations` | done (v4) |
| 11 | Maturity heatmap, editable | `maturity` | done (v4), edits saved per browser only |
| 12 | Value case calculator, editable | `vds` | done (v4), edits saved per browser only |
| 13 | Roadmap waves (Gantt) | `waves` | done (v4) |

## Next candidates
- Shared maturity assessment: move edits from browser storage to the `db` capability so a team shares one assessment.
- Lineage view: system-to-report paths per attribute.
- Replace example data with a real subject.

## Not built from the reference artifact
- "Cockpit" and "By design" views: their purpose in the reference was not clear enough to rebuild without guessing.
- Annual report intake (reads a customer's report with Claude): needs file upload; out of scope so far.

## Open questions
- Ask on GitHub Pages (parked 2026-09-29). Ask works only in the Claude viewer. Options: (a) visitor pastes own Anthropic API key, stored in their browser; (b) server proxy such as a Cloudflare Worker holding the owner's key, with rate limits. Never put a key in the HTML or in GitHub Secrets injected into the page.
- Replace fictional example data with a real subject? Owner to decide.
- Share the artifact publicly? Ask spends each viewer's own Claude usage.
- Regulation dates are short summaries for learning. Verify against official texts before any real use.
