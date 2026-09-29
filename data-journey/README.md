# Tallgrass Data Journey

Live-demo scenario for Matillion presales. A fictional US outdoor retailer, Tallgrass Outfitters, needs AI-ready data.
Source: on-premise SQL Server 2016 EDW. Target: Databricks on Azure with Unity Catalog. Integration: Matillion with Maia.

- Artifact: https://claude.ai/artifact/E9qAq2xH861z7dLuoeTGhv (private until shared)
- Version: v1 (see `CHANGELOG.md` at the repository root)

## Honesty rules for this page
- Company, people and every number are fictional. The page says so in a badge and a footer.
- Maia prompts, drafts and reviews are illustrative, written for the scenario, not captured from the product.
  Each is badged "Illustrative". Replace them with real examples from Matillion demos or docs when available.
- The Ask box runs on Claude through the artifact viewer. It is labeled "Ask about this scenario", never "Ask Maia".
- Regulation dates are short summaries.

## Demo flow (Start here tab)
1. Open with their goal (AI readiness)
2. Where the data lives today (Network, Today, lineage of edw.FactSales)
3. Name the pain (Current state)
4. The journey with Matillion (Network, With Matillion, lineage of gold.demand_features)
5. How pipelines get built (Maia)
6. A run that protects itself (Process, BPMN of the hourly run)
7. The tests (Data tests)
8. Compliance (Regulation)
9. The plan (Roadmap)

## Data model
All content is in the `<script id="model">` JSON block.

| Key | ID | Notes |
|---|---|---|
| `meta` | none | Company facts shown on Start here |
| `systems` | `S01` | `stage`: source, edwsys, file, consumer, none |
| `datasets` | `T01` | `layer`: edw, bronze, silver, gold |
| `pipelines` | `PL01` | `from`, `to`, `tool` (SSIS, Excel, Matillion), `view` (today, target, both), `stage` (legacy, extract, ingest, transform, build) |
| `relations` | none | Extra network links: `f`, `r`, `t`, `v` (today, target, both) |
| `usecases` | `U01` | `today` and `target` scores follow the `readiness` list order |
| `findings`, `backlog` | `F01`, `B01` | Current state tab |
| `processes`, `steps` | `P01`, `P01.1` | BPMN; `maia: true` marks illustrative Maia steps |
| `dq` | `DQ01` | `today` describes current testing; `blocks` = stops publish |
| `regs` | `R01` | `refs` link to tables, tests, pipelines |
| `maia` | `MA01` | `prompt`, `output`, `review`, `produces` |
| `waves` | `W1` | `from`/`to` as `YYYY-Qn`, `refs`, `unblocks` |
| `glossary` | `G01` | Catalogue glossary |

## Re-skin for a prospect
Edit `meta`, then rename systems and tables. Keep IDs stable so links keep working. Run `npm test` from the repository root.
