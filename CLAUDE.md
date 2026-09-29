# Project context for Claude

## Goal
Learning project. Build a master data reference model explorer as a Claude Artifact (single HTML page),
modeled on the architecture of a public example artifact. Built for education, not production.

## Live artifact
- Master Data Atlas: https://claude.ai/artifact/RQwdyLoD7o17zoTmM1Cx9n (private to owner until shared)
- Source: `reference-model/index.html`. Republish this file to the same URL when it changes
  (from another session, pass the URL to the Artifact tool as `url`).
- Capabilities declared: `sample` (Ask box), `downloads` (model JSON export).

## Rules we agreed on
- Do not copy the original third-party artifact. Rebuild patterns in our own code. See `docs/decisions.md`.
- All data is fictional example data (company: Alder Street Supply) until the owner supplies real data.
- Data lives in the `<script id="model">` JSON block. Views are generated from it. Stable IDs:
  domain `D01`, subject area `D01.01`, attribute `D01-A001`, system `S01`, process `P01`, control `C01`.
- Any Claude-powered feature must return IDs, and the page must drop IDs not found in the model.
- Keep all page code inside one IIFE (avoids global name clashes with the viewer's scripts).

## Where things are
- `docs/original-artifact-analysis.md`: how the reference artifact was built.
- `docs/roadmap.md`: planned views, in order, and status.
- `docs/decisions.md`: decisions and why.
- `CHANGELOG.md`: each version, with the artifact version it was published as.

## Owner preferences for replies
Direct, factual, no filler. Correct wrong premises. No em dashes.
