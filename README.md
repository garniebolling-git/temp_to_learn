# Master Data Atlas

A learning project: an interactive map of a company's master data, built as a single HTML page
and published as a Claude Artifact. All data describes a fictional wholesale distributor, Alder Street Supply.

Current version: **v5** (see [CHANGELOG.md](CHANGELOG.md)).

## Where to see it

| Where | Link | What works |
|---|---|---|
| Claude Artifact | https://claude.ai/artifact/RQwdyLoD7o17zoTmM1Cx9n | Everything, including Ask and downloads. Private to the owner until shared. |
| GitHub Pages | https://garniebolling-git.github.io/temp_to_learn/reference-model/ | Everything except Ask (needs the Claude viewer). Needs Pages set to this branch. |
| Source | [reference-model/index.html](reference-model/index.html) | The page itself. |

## Tabs

| Tab | Question it answers |
|---|---|
| Start here | Overview with a card per tab |
| Network | What data do we have, and where does it live? |
| Process | Where does bad data hurt? Includes BPMN 2.0 diagrams and `.bpmn` export |
| Catalogue | What exactly is each field? Table, list by domain, glossary |
| DQ rules | How would we actually test it? |
| Regulation | What forces this, and by when? |
| Current state | Who owns what today? |
| Maturity | How good is it today? |
| Value case | What is it worth? (USD) |
| Roadmap | In what order do we fix it? |
| How it's built | How the page works and how to extend it |

## Repository layout

```
reference-model/index.html   the page: CSS, data (JSON block) and code in one file
reference-model/README.md    data model reference
tests/check.js               automated checks (npm test)
docs/roadmap.md              what is built, what is next
docs/decisions.md            decisions and reasons
docs/original-artifact-analysis.md   how the reference artifact was built
CHANGELOG.md                 each version with its published artifact version
CLAUDE.md                    instructions Claude Code reads at the start of every session
```

## Run the checks

```
npm install
npm test
```

Checks that the data's cross-references resolve, the script parses, all tabs render at desktop and phone
width without errors, and each BPMN export is valid. Screenshots go to `tests/out/`.

## Open locally

Download `reference-model/index.html` and open it in a browser. Ask is disabled outside the Claude viewer.
