# Roadmap

Status: done, next, planned.

| # | View | Data it needs | Status |
|---|------|---------------|--------|
| 1 | Map (network graph) | domains, subject areas, systems, processes, controls, relations | done (v1) |
| 2 | Attributes table with filters | attributes | done (v1) |
| 3 | Ask with ID verification | whole model | done (v1), untested in viewer |
| 4 | How it's built | none | done (v1) |
| 5 | Process with BPMN 2.0 view and .bpmn export | `steps` linked to domains, systems, controls | done (v3) |
| 6 | DQ rules: how to test | DQ rules linked to attributes | next |
| 7 | Regulation with timeline | regulations linked to controls, attributes, dates | planned |
| 8 | Catalogue: glossary and list view | glossary terms | planned |
| 9 | Maturity self-assessment | questions, scores per domain, `db` capability | planned |
| 10 | Value case | value drivers linked to process steps | planned |
| 11 | Roadmap view | delivery waves | planned |

## Open questions
- Ask on GitHub Pages (parked 2026-09-29). Ask works only in the Claude viewer. Options: (a) visitor pastes own Anthropic API key, stored in their browser; (b) server proxy such as a Cloudflare Worker holding the owner's key, with rate limits. Never put a key in the HTML or in GitHub Secrets injected into the page.
- Replace fictional example data with a real subject? Owner to decide.
- Share the artifact publicly? Ask spends each viewer's own Claude usage.
