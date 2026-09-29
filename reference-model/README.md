# Data model

Everything the page shows comes from the JSON block `<script id="model" type="application/json">` in `index.html`.
Records link to each other by ID. `npm test` fails if any reference points to an ID that does not exist.

| Key | ID pattern | Fields | Used by |
|---|---|---|---|
| `domains` | `D01` | name, owner, def | all tabs |
| `subjectAreas` | `D01.01` | domain, name, def | Network, Catalogue |
| `attributes` | `D01-A001` | sa, name, type, obl, role, sens, def | Catalogue, DQ, Regulation |
| `systems` | `S01` | name, hosting, def | Network, Current state |
| `processes` | `P01` | code, name, value, def | Network, Process |
| `controls` | `C01` | name, category, def | Network, DQ, Regulation |
| `relations` | none | f (from ID), r (type), t (to ID) | Network, Current state |
| `steps` | `P01.1` | p, n, lane, name, sys, reads[], writes[], ctl[], gate {q, no}, def, failure | Process, BPMN |
| `dq` | `DQ01` | dim, attrs[], ctl[], steps[], threshold, score, def, test | DQ rules |
| `regs` | `R01` | short, name, cat, juris, date, when, attrs[], ctl[], def | Regulation |
| `glossary` | `G01` | term, see[], def | Catalogue |
| `maturity` | none | levels[], dims[{id, name, def}], scores[{d, cur[], tgt[]}] | Maturity |
| `vds` | `V01` | name, steps[], doms[], measure, unit, volume, base, target, unitValue, labels, def | Value case |
| `waves` | `W1` | name, from, to (`YYYY-Qn`), refs[], vds[], def | Roadmap |

Relation types in `relations`: `masters`, `consumes`, `creates`, `references`, `governs`, plus process verbs
`creates`, `reads`, `updates`. Links for the other collections are built from their array fields.

Value per driver = volume × (base − target) × unitValue, with base and target divided by 100 when `unit` is `%`.

## Runtime capabilities

- `sample`: the Ask box. Claude answers in JSON with record IDs; the page removes any ID not in the model.
- `downloads`: saves the model JSON and `.bpmn` files. Outside the Claude viewer the page uses a normal browser download.

Maturity scores and value inputs a viewer edits are stored in that viewer's browser only.
