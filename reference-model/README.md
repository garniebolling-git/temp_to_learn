# Master Data Atlas

Template for a master data reference model page, published as a Claude Artifact:
https://claude.ai/artifact/RQwdyLoD7o17zoTmM1Cx9n

The page is one file, `index.html`. The data lives in the `<script id="model">` JSON block.
All data is example data for a fictional company, Alder Street Supply.

Entity types: domains, subject areas, attributes, systems, processes, controls.
Relations: `{"f": from-id, "r": type, "t": to-id}`.

Runtime capabilities: `sample` (Ask box, calls Claude, then drops any ID not in the model) and `downloads` (model JSON export).
