# Decisions

## 2026-09-29: Tallgrass demo is a separate page, not an edit of the atlas
The focus moved from master data to a data integration journey. The data model changes (tables by layer, pipelines,
use cases), so a new page in `data-journey/` reuses the engine and leaves the atlas intact at v5.

## 2026-09-29: Maia content is illustrative and labeled
The owner had no Maia source material. Examples show the working pattern (engineer describes, Maia drafts, engineer
reviews) and carry an "Illustrative" badge, a tab note and a footer. Replace with real examples before customer use.

## 2026-09-29: Ask is not presented as Maia
Ask runs on Claude through the artifact viewer. Labeling it Maia would misrepresent what answers.

## 2026-09-29: Target view starts at the EDW; Network uses full width
Keeps the live demo on one screen without sideways scrolling. Systems feeding the EDW appear on the Today view.

## 2026-09-29: Rebuild, do not copy the reference artifact
Reason: authored outside the organization, no license, carries its author's branding and internal sales notes,
and 438K characters of minified script not reviewed line by line. We rebuild the architecture in our own code.

## 2026-09-29: Fictional example data
Owner had no data. Example company Alder Street Supply, labeled "Example data" on the page.

## 2026-09-29: Single HTML file, data in a JSON block
Matches the reference pattern. One file to publish, data editable without touching view code.

## 2026-09-29: No shared database in v1
Page is read-only for viewers. Add `db` when a view needs saved input (Maturity).

## 2026-09-29: Maturity and value edits stay in the viewer's browser
Editable scores and inputs use browser storage, not the shared `db` capability. Keeps the page working on GitHub Pages
and avoids a shared database for a learning project. Move to `db` if a team needs one shared assessment.

## 2026-09-29: Skipped "Cockpit", "By design" and report intake from the reference
Purpose unclear or out of scope. Recorded in the roadmap.

## 2026-09-29: Page code inside one IIFE, visible error banner
Owner reported a blank page after v1. Local render was clean. Isolated scope to rule out global name clashes
with viewer scripts, and added an on-page error banner for diagnosis.
