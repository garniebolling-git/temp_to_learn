const { P, H1, H2, H3, B, N, table, gantt, save } = require('./doclib');
const c = [];
c.push(H1('1. Purpose and scope'));
c.push(P('This plan turns the Tallgrass demo into a working environment in 4 weeks. The demo story has 8 acts and 26 steps (see Tallgrass_Demo_Script.docx). Scope: Party (vendor and customer), Product, Reference 360 (CoA, block model, value lists), workflow, SAP and D365 publish, supplier portal, sanctions event, headless access from Claude and Slack, spend analytics.'));
c.push(P('**Out of scope:** production data, real sanctions provider contract, SSO integration beyond demo personas. **Acceptance source:** the seeded-issue and expected-match answer keys in data/answer_key.'));
c.push(P('**Effort basis:** estimates are planning assumptions for a team that already knows IDMC. Re-estimate after Task 1.1. Days are person-days.'));

c.push(H1('2. Phases, tasks and exit criteria'));
const T = [
 ['0.1', 'Confirm scope, personas, requirement list; resolve sheet conflicts', '2', 'Demo lead', '-', 'Signed scope and decisions log', 'All 5 sheet inconsistencies have an owner and a decision'],
 ['0.2', 'Provision demo org, SAP sandbox, D365 sandbox, Salesforce sandbox', '4', 'Platform admin', '0.1', 'Four environments reachable', 'Service accounts tested from MDM'],
 ['1.1', 'Configure Party model: roles, crosswalk, bank, hierarchy', '4', 'MDM architect', '0.2', 'Party model deployed', 'Hero trio loads as three source records'],
 ['1.2', 'Configure Product model: market extensions, UoM, GTIN, PPWR, ESG', '4', 'MDM architect', '0.2', 'Product model deployed', 'FG90001 loads as Under Creation'],
 ['1.3', 'Configure Reference 360: CoA, cost and profit centres, block model, terms', '3', 'MDM architect', '0.2', 'Reference model deployed', 'ref_block_model.csv loads; native values match'],
 ['1.4', 'Load CSVs in README order; reconcile row counts', '3', 'Data engineer', '1.1, 1.2, 1.3', 'Loaded data', 'Row counts equal CSV counts; no load errors'],
 ['2.1', 'Match rules and thresholds for party', '3', 'MDM architect', '1.4', 'Rule set', 'Every cluster in expected_matches.csv found; no extra clusters above threshold'],
 ['2.2', 'DQ rules: IBAN, ABA, GTIN, tax ID, GL length, UoM, PPWR, address, country', '5', 'Data engineer', '1.4', 'DQ rule set', 'Every issue in seeded_issues.csv is raised by the matching rule'],
 ['2.3', 'Workflows: vendor approval (parallel), material (parallel markets), CoA approval', '5', 'MDM architect', '1.4', 'Three workflows', 'Requester cannot approve own task; all paths tested'],
 ['2.4', 'Description naming rules', '1', 'MDM architect', '1.2', 'Rule set', 'FG90001 description equals expected string'],
 ['3.1', 'Publish to SAP: vendor, material, GL; write back crosswalk', '5', 'SAP consultant', '2.1, 2.3', 'SAP publish flow', 'V100001 and FG90001 visible in SAP with correct status'],
 ['3.2', 'Publish to D365: vendor, customer, GL; write back crosswalk', '5', 'D365 consultant', '2.1, 2.3', 'D365 publish flow', 'CUST-000001 shows both roles; TaxGroup failure reproducible'],
 ['3.3', 'Error queue and reprocess path', '2', 'Integration engineer', '3.2', 'Queue configured', 'Seeded failure appears with reason, owner and age'],
 ['3.4', 'Supplier portal with IBAN check and enrichment', '4', 'Integration engineer', '2.2', 'Portal flow', 'Bad IBAN rejected; corrected IBAN passes'],
 ['3.5', 'Sanctions event endpoint and block propagation', '3', 'Integration engineer', '3.1, 3.2', 'Event flow', 'GB-SANC set in MDM, SAP and D365 within 5 minutes'],
 ['4.1', 'MCP connection from Claude and Slack; personas and permissions', '4', 'Security lead', '2.3', 'Connected clients', 'Each persona sees only its permitted tools'],
 ['4.2', 'Rehearse B1 to B10; capture backup screenshots', '3', 'Presenter', '4.1, 3.3', 'Prompt pack verified', 'All 10 prompts return expected result twice in a row'],
 ['5.1', 'Spend analytics view on golden ID (Data 360 and Tableau)', '4', 'Analytics engineer', '1.4, 3.1, 3.2', 'Dashboard', 'Combined spend for G00002 equals spend_transactions.csv sum'],
 ['6.1', 'End-to-end dry run with timing; fix list', '3', 'Demo lead', 'All', 'Dry run report', 'Runs in 90 minutes; zero blocking defects'],
 ['6.2', 'Acceptance test against answer keys; sign-off', '2', 'QA lead', '6.1', 'Test report', 'Acceptance table in section 5 is all Pass'],
];
c.push(table(['ID', 'Task', 'Days', 'Owner', 'Depends on', 'Deliverable', 'Exit criteria'], T, [0.5, 3, 0.5, 1.2, 1, 1.5, 2.6]));
c.push(P(`Total planned effort: ${T.reduce((a, r) => a + +r[2], 0)} person-days.`));

c.push(H1('3. Timeline (4 weeks)'));
c.push(gantt(4, [['0 Mobilise and environments', 1, 1], ['1 Models and data load', 1, 2], ['2 Rules and workflows', 2, 3], ['3 Integrations (SAP, D365, portal, events)', 2, 3], ['4 Headless access and rehearsal of prompts', 3, 4], ['5 Analytics view', 3, 3], ['6 Dry run and acceptance', 4, 4]]));
c.push(H2('Milestones'));
c.push(table(['Milestone', 'Week', 'Criteria'], [
 ['M1 Environments ready', 'End of week 1', 'Tasks 0.1 and 0.2 complete'],
 ['M2 Data and rules live', 'End of week 2', 'Tasks 1.x and 2.1 complete; matches found'],
 ['M3 End-to-end flow', 'Mid week 3', 'Scenes 1.1 to 5.1 run without manual fixes'],
 ['M4 Prompts verified', 'End of week 3', 'Task 4.2 complete'],
 ['M5 Sign-off', 'End of week 4', 'Task 6.2 complete'],
], [3, 1.5, 5]));

c.push(H1('4. RACI'));
c.push(table(['Activity', 'Sponsor', 'Demo lead', 'MDM architect', 'ERP consultants', 'Integration', 'Security', 'QA'], [
 ['Scope and decisions', 'A', 'R', 'C', 'C', 'I', 'I', 'I'],
 ['Environments', 'I', 'A', 'C', 'R', 'R', 'C', 'I'],
 ['MDM models and rules', 'I', 'A', 'R', 'C', 'C', 'I', 'C'],
 ['ERP publish', 'I', 'A', 'C', 'R', 'R', 'I', 'C'],
 ['Headless and personas', 'I', 'A', 'C', 'I', 'R', 'R', 'C'],
 ['Test and acceptance', 'A', 'R', 'C', 'C', 'C', 'C', 'R'],
], [2.6, 1, 1, 1.2, 1.2, 1.1, 1, 0.8]));
c.push(P('R responsible, A accountable, C consulted, I informed.'));

c.push(H1('5. Test approach and acceptance criteria'));
c.push(B('**Answer keys are the tests.** Each row in seeded_issues.csv must be raised by the platform. Each cluster in expected_matches.csv must be found. expected_crosswalk.csv must match the crosswalk after load.'));
c.push(B('**Levels:** unit (single rule), flow (one scene), end to end (whole script), rehearsal (presenter with timing).'));
c.push(B('**Regression:** re-run the answer-key comparison after every rule or mapping change.'));
c.push(table(['Area', 'Source', 'Acceptance'], [
 ['Match and merge', 'answer_key/expected_matches.csv', '100% of clusters found; zero false clusters above threshold'],
 ['Crosswalk', 'answer_key/expected_crosswalk.csv', '100% of source keys linked to the expected golden ID'],
 ['Data quality', 'answer_key/seeded_issues.csv', '100% of seeded issues raised with the expected requirement ID'],
 ['Sheet conflicts', 'answer_key/customer_sheet_inconsistencies.csv', 'Each has a recorded decision'],
 ['Headless prompts', 'Demo script section 4', 'B1 to B10 pass twice in a row as the named persona'],
 ['Analytics', 'spend_transactions.csv', 'Combined spend for G00002 matches the CSV sum'],
], [1.6, 3, 4]));

c.push(H1('6. Environments'));
c.push(table(['Environment', 'Purpose', 'Owner', 'Notes'], [
 ['IDMC demo org', 'MDM, Reference 360, workflow, MCP', 'Platform admin', 'Separate from any customer org'],
 ['SAP S/4HANA sandbox', 'Vendor, material, GL targets', 'SAP consultant', 'Seeded with hero keys V100001 to V100004'],
 ['D365 F&O sandbox', 'Customer, vendor, GL targets', 'D365 consultant', 'TaxGroup mandatory set to allow seeded failure'],
 ['Salesforce sandbox', 'CRM accounts', 'Integration engineer', 'Loaded from party_crm.csv'],
 ['Slack workspace and Claude', 'Headless surfaces', 'Security lead', 'Personas mapped to demo users'],
 ['Tableau and Data 360', 'Spend analytics', 'Analytics engineer', 'Reads combined spend on golden ID'],
], [2, 3, 1.6, 3]));

c.push(H1('7. Risk log'));
c.push(table(['Risk', 'Likelihood', 'Impact', 'Mitigation', 'Owner'], [
 ['MCP or CLAIRE features still in preview; behaviour differs from demo', 'Medium', 'High', 'Confirm status with Informatica in week 1; keep screenshot fallback for every headless prompt', 'Demo lead'],
 ['Connector or mapping work for SAP and D365 exceeds estimate', 'Medium', 'High', 'Start tasks 3.1 and 3.2 in week 2; cut GL publish first if late', 'ERP consultants'],
 ['Live latency during demo', 'Medium', 'Medium', 'Backup screenshots; run prompts once before the session', 'Presenter'],
 ['Sanctions provider not available', 'High', 'Low', 'Use simulated API event; say so in the script', 'Integration'],
 ['Answer keys drift from loaded data', 'Low', 'Medium', 'Regenerate with gen_data.py (fixed seed); do not hand-edit CSVs', 'Data engineer'],
 ['Persona permissions leak tools', 'Low', 'High', 'Test each persona against a tool allow-list', 'Security lead'],
], [3.2, 1, 1, 3.6, 1.4]));

c.push(H1('8. Open decisions'));
c.push(table(['#', 'Decision', 'Options', 'Needed by'], [
 ['D1', 'GL length: 6 digits (FIN-01) or 8 digits (FIN-04)', 'Enforce 8, map 6-digit legacy to 8', 'Week 1'],
 ['D2', 'Bank validation scope: IBAN only (VEN-05) or IBAN and ABA', 'Validate both by country', 'Week 1'],
 ['D3', 'Block propagation SLA: minutes (demo) or 24 hours (XD-05)', 'Set target per block type', 'Week 1'],
 ['D4', 'SKU visibility before Active (MAT-03 vs MAT-08)', 'Define Under Creation as a visible status', 'Week 1'],
 ['D5', 'XD-03 and XD-08 overlap', 'Merge into one requirement', 'Week 1'],
 ['D6', 'Coverage gaps: CUS-01, CUS-05, CUS-06, FIN-02', 'Backup scenes, slides or written answers', 'Week 2'],
 ['D7', 'Claude and Slack MCP route in the demo org', 'Direct MCP, or via an agent registry', 'Week 1'],
], [0.5, 4, 3.6, 1.2]));

c.push(H1('9. Governance'));
c.push(B('Weekly steering meeting (30 minutes): sponsor, demo lead, MDM architect. Agenda: milestones, risks, decisions.'));
c.push(B('Daily stand-up (15 minutes) for the delivery team.'));
c.push(B('Change control: scope changes go through the demo lead; any change to a rule or mapping triggers the answer-key regression.'));
c.push(B('Data rule: simulated data only. No real credentials or customer data in any environment or prompt.'));
c.push(B('Source control: generator, CSVs, simulator and documents are kept in one repository; data changes only by editing gen_data.py.'));

c.push(H1('Appendix A. From demo to customer implementation waves'));
c.push(P('Indicative only. Durations need a real discovery. Each wave reuses the same platform, workflow engine and headless layer.'));
c.push(table(['Wave', 'Scope', 'Workstreams from this plan', 'Indicative duration', 'Exit criteria'], [
 ['Wave 0 Foundation', 'Platform, environments, security, reference data, block model', '0.x, 1.3, 4.1', '6 to 8 weeks', 'Reference 360 live; personas and audit in place'],
 ['Wave 1 Vendor and Finance', 'Party (vendor), bank validation, sanctions, SAP and D365 publish, CoA governance', '1.1, 2.1 to 2.3, 3.1 to 3.5', '10 to 14 weeks', 'Vendor create and change only through MDM; error queue staffed'],
 ['Wave 2 Material', 'Product model, market extensions, packaging sustainability, naming rules', '1.2, 2.4, 3.1, 3.2', '10 to 12 weeks', 'New SKUs created only through MDM'],
 ['Wave 3 Customer', 'Customer hierarchy, match and merge CRM, D365, e-commerce, consent, credit block', 'Gaps D6, 2.1', '10 to 12 weeks', 'Duplicate rate below agreed target'],
 ['Wave 4 Analytics and agents', 'Spend analytics, stewardship dashboard, agent access beyond the demo prompts', '4.2, 5.1', '6 to 8 weeks', 'Agents run under audited personas'],
], [1.4, 3, 2, 1.3, 2.6]));
save(__dirname + '/../Tallgrass_Build_Plan.docx', 'Build and Implementation Plan', 'Four-week plan to build the Tallgrass MDM demo, with an implementation wave appendix', c);
