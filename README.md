# Data journey artifacts

Single-file HTML pages published as Claude Artifacts. Two projects share one engine (JSON model in the page,
generated tabs, inspector, BPMN 2.0 export, automated checks).

| Project | Purpose | Version | Artifact | Source |
|---|---|---|---|---|
| Tallgrass Data Journey | Matillion presales live demo: SQL Server EDW to Databricks, AI readiness, Maia (illustrative) | v1 | https://claude.ai/artifact/E9qAq2xH861z7dLuoeTGhv | [data-journey/](data-journey/) |
| Master Data Atlas | Learning project: master data reference model | v5 | https://claude.ai/artifact/RQwdyLoD7o17zoTmM1Cx9n | [reference-model/](reference-model/) |

Both artifacts are private to the owner until shared from the page's Share menu. All companies and figures are fictional.

GitHub Pages (Ask does not work outside the Claude viewer):
- https://garniebolling-git.github.io/temp_to_learn/data-journey/
- https://garniebolling-git.github.io/temp_to_learn/reference-model/

## Tallgrass Data Journey tabs
Start here (9-step talk track) · AI readiness · Network (Today / With Matillion, click for lineage) · Current state ·
Maia (illustrative) · Process (BPMN 2.0) · Data tests · Regulation · Catalogue · Roadmap · How it's built.
Details: [data-journey/README.md](data-journey/README.md).

## Master Data Atlas tabs
Start here · Network · Process (BPMN 2.0) · Catalogue · DQ rules · Regulation · Current state · Maturity ·
Value case (USD) · Roadmap · How it's built. Details: [reference-model/README.md](reference-model/README.md).

## Repository layout

```
data-journey/index.html      Tallgrass demo page (CSS, data and code in one file)
data-journey/README.md       demo flow, honesty rules, data model
reference-model/index.html   Master Data Atlas page
reference-model/README.md    atlas data model
tests/check.js               automated checks for any page (npm test runs both)
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

For each page: data cross-references resolve, the script parses, every tab (and talk-track step) renders at desktop
and phone width without errors, and each BPMN export is valid. Screenshots go to `tests/out/<page>/`.
