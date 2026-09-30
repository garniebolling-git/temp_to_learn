const { P, H1, H2, H3, B, N, PB, table, save } = require('./doclib');
const c = [];
c.push(P('**Audience:** Tallgrass evaluation panel (Procurement, Finance, Supply Chain, IT). **Duration:** about 90 minutes. **Landscape:** SAP S/4HANA, Dynamics 365 F&O, Salesforce CRM, e-commerce, supplier portal. **Companion files:** Tallgrass_MDM_Demo_Simulator.html, data CSVs, answer keys.'));
c.push(H1('1. How to use this script'));
c.push(B('The demo is one continuous story told in 8 acts, not a tour of domains. A trading partner is onboarded, a product is launched, finance rules are enforced, an exception is fixed, a sanctions event arrives, and finance asks a cross-ERP question.'));
c.push(B('Each scene lists the requirement IDs it covers, the persona and surface, the time, a step table, the headless moment and honesty notes.'));
c.push(B('Requirement IDs (VEN, CUS, MAT, FIN, XD) were invented for this test. Replace with the real sheet for a live customer.'));
c.push(B('Roadmap or preview items are marked **[PREVIEW]** or **[CONFIRM]**. Do not present them as generally available.'));

c.push(H1('2. Solution map and availability'));
c.push(P('Status below comes from public announcements found in this session (May 2026 Informatica World and Spring 2026 release material). Anything not stated publicly is marked CONFIRM. Verify every row with the Informatica team before a live demo.'));
c.push(table(['Capability', 'Used in scenes', 'Status', 'Note'], [
  ['Multidomain MDM SaaS: party, product, reference, match and merge, workflow, publish', '1.1 to 6.1', 'CONFIRM in your org', 'Core product. Confirm tenant edition and Business 360 apps licensed.'],
  ['Reference 360 (CoA, block model, value lists)', '3.1, 5.1', 'CONFIRM', 'Confirm crosswalk and ERP publish options.'],
  ['MCP servers for IDMC (MDM, data quality, metadata)', '0.1, 1.1, 1.3, 4.1, 7.1', 'Announced; MCP support in Spring 2026 release', 'Informatica states MCP servers on AWS Agent Registry are preview (US) and on Amazon Quick are GA (US). Claude and Slack routes: CONFIRM.'],
  ['CLAIRE agent skills as APIs', '6.1 (rule generation)', '[PREVIEW] per May 2026 announcement', 'Preview globally on AWS Agent Registry and Quick. Do not promise dates.'],
  ['Supplier portal self-service', '1.2', 'CONFIRM', 'Confirm whether demo uses Supplier 360 portal or a front end on APIs.'],
  ['Sanctions screening event via API', '5.1', 'CONFIRM', 'Third-party screening service is simulated by an API call in the demo org.'],
  ['ERP publish to SAP and D365 with cross-references', '1.4, 4.1', 'CONFIRM', 'Connector and mapping work is part of the build plan.'],
  ['Data 360 and Tableau spend analytics', '7.1', 'Salesforce product; CONFIRM integration path', 'Demo may use a pre-built Tableau view on the golden ID.'],
], [3.2, 1.4, 2, 3.4]));

c.push(H1('3. Acts and scenes'));
const scenes = [
 ['Act 0. Opening', [
  { id: '0.1', title: 'One model, many heads', reqs: 'XD-01, XD-03, CUS-02', goal: 'Show the architecture and the entity graph so the panel understands the rest of the demo.', persona: 'Presenter', surface: 'Simulator tabs: Architecture, IDMC MDM (Entity model)', time: '6 min',
    steps: [['Open Architecture tab', 'Every arrow into and out of MDM uses the same governed services: a screen, an ERP or an agent.', 'Sources on the left, MDM hub, consumers on the right, headless band on top'],
            ['Open Entity model', 'Your four tabs are one model here. Roles, not copies.', 'Party with two roles, product with market extensions, reference data']],
    headless: 'B1: "Show me Prairie Returnables and all its ERP IDs." Expected: golden record with SAP, D365 and CRM keys.', honesty: 'Architecture is a mockup. Confirm which services are exposed over MCP in your org.' }]],
 ['Act 1. Trading partner', [
  { id: '1.1', title: 'Do we already have this supplier?', reqs: 'VEN-02, VEN-08, CUS-02, CUS-04, XD-04, XD-08', goal: 'Prevent a duplicate, then merge a customer who is also a vendor into one party with two roles.', persona: 'Dana Ortiz, procurement buyer; Marcus Hale, data steward', surface: 'Slack or Claude via MCP; MDM match and golden record', time: '10 min',
    steps: [['Buyer types the question in Slack', 'The buyer never opens the MDM tool. The agent calls MDM\'s own match service.', 'Three candidates with scores 0.96 to 0.97; recommendation not to create a duplicate'],
            ['Open Match and merge', 'Same match rules whether called from Slack, the portal or a batch load.', 'SAP V100001, D365 CUST-000001, CRM 001TG00000001 clustered'],
            ['Open Golden record', 'One party, two roles. Both source keys stay linked.', 'Survivorship shown per attribute; crosswalk with three keys']],
    headless: 'B2: "Do we already have Prairie Returnables as a supplier?" B3: "Start a request to add the vendor role to the existing party."', honesty: 'Scores are seeded in the data. Survivorship rules shown are examples, not Tallgrass policy.' },
  { id: '1.2', title: 'Supplier self-service with validation at entry', reqs: 'VEN-03, VEN-05, VEN-06, VEN-07', goal: 'Show bad bank data stopped at entry and enrichment called by the platform.', persona: 'Nordvik Kartonage, external supplier', surface: 'Supplier portal', time: '6 min',
    steps: [['Enter IBAN with a wrong check digit', 'Validation happens at entry, not in a monthly clean-up.', 'Red field: IBAN checksum invalid (mod 97); submit blocked'],
            ['Correct the IBAN and submit', 'Enrichment is called by the platform, not rebuilt in the portal.', 'VAT verified, DUNS and address enriched, status Submitted for approval']],
    headless: 'None in this scene.', honesty: 'DUNS enrichment uses a simulated response. Confirm the enrichment provider and licence.' },
  { id: '1.3', title: 'Parallel approval, including from Slack', reqs: 'VEN-01, VEN-04, VEN-13, XD-08', goal: 'Show one rule-based workflow engine and approvals where people work.', persona: 'Sam Ruiz, compliance; Priya Nair, AP approver', surface: 'Task inbox; Slack via MCP', time: '8 min',
    steps: [['Compliance approves in Task inbox', 'This is the only workflow engine you will see today. Every domain uses it.', 'Compliance task closed, Finance task open'],
            ['AP approves in Slack', 'Approvers act where they work; segregation of duties is enforced by the platform.', 'Task complete; audit entry with channel = Slack/MCP']],
    headless: 'B4: "Show my open approvals." B5: "Approve."', honesty: 'Run as the named persona so permissions and audit entries are correct. Slack approvals route: CONFIRM.' },
  { id: '1.4', title: 'Publish once to both ERPs', reqs: 'VEN-12, XD-04', goal: 'Show one publish, two ERP dialects, cross-references written back.', persona: 'Platform (automatic)', surface: 'MDM Publish and sync; D365', time: '5 min',
    steps: [['Open Publish and sync', 'One record, two ERP dialects. The golden ID now knows both numbers.', 'SAP and D365 both Confirmed'],
            ['Switch to D365 tab', 'Update once: both roles, both ERPs.', 'One account with Customer and Vendor roles']],
    headless: 'None.', honesty: 'ERP connectors and mappings are built during the pilot. Show real screens only if the build is complete.' }]],
 ['Act 2. Shared SKU', [
  { id: '2.1', title: 'Launch a SKU across markets', reqs: 'MAT-01, MAT-02, MAT-03, MAT-04, MAT-05, MAT-07, MAT-08', goal: 'Show producing-market ownership, governed UoM and GTIN, rule-based descriptions, early publish and parallel market tasks.', persona: 'Elena Petrova (US producing market); CA and MX market owners', surface: 'MDM product workflow; SAP material master', time: '12 min',
    steps: [['US completes basic data', 'Core data, including units of measure, comes from the producing market.', 'GTIN check digit valid; case and pallet conversions set'],
            ['Show description rules', 'Different category, different rule. No code change.', 'TALLGRASS AMBER LAGER 12OZ CAN 6PK generated'],
            ['Switch to SAP material', 'The SKU exists in SAP early, so BOM and recipe work can start.', 'Material FG90001, status Under Creation'],
            ['Back to product workflow', 'Markets are derived from the SKU\'s extensions, not chosen by hand.', 'CA and MX tasks closed; status Active']],
    headless: 'None.', honesty: 'Customer sheet MAT-03 and MAT-08 conflict on pre-Active visibility. Say so and ask for a decision.' }]],
 ['Act 3. Finance', [
  { id: '3.1', title: 'Finance rules and global blocks on the same engine', reqs: 'FIN-01, FIN-04, FIN-05, XD-05', goal: 'Show rule enforcement on CoA and a global block model with native values.', persona: 'Lee Brandt, finance controller', surface: 'Reference 360', time: '8 min',
    steps: [['Enter GL 600100', 'Your length rules, enforced at entry. Same workflow engine you saw for vendors.', 'Rejected: account must be 8 digits'],
            ['Open Block model', 'Lists of values have their own governance and their own ERP sync.', 'GB-SANC maps to SAP blocks and D365 on hold = All']],
    headless: 'None.', honesty: 'FIN-01 says 6 digits, FIN-04 says D365 needs 8. The demo enforces 8 and flags the sheet conflict.' }]],
 ['Act 4. Exceptions', [
  { id: '4.1', title: 'A sync failure, explained and fixed', reqs: 'XD-02, VEN-12, VEN-13, XD-08', goal: 'Show the failure path: error queue, explanation, reprocess, audit.', persona: 'Marcus Hale, data steward', surface: 'MDM Publish and sync; Slack via MCP', time: '8 min',
    steps: [['Publish a bank change', 'This is the scenario that breaks most MDM programmes.', 'SAP Confirmed, D365 Rejected: TaxGroup mandatory'],
            ['Ask in Slack which records failed', 'The answer comes from the same error queue.', 'One failure for G00001 with owner and age'],
            ['Fix and reprocess', 'Overrides are allowed, but never silent.', 'Both ERPs reconciled; override logged']],
    headless: 'B6: "Which records failed to sync to D365 today and why?" B7 (optional): "Reprocess the failed D365 update for G00001."', honesty: 'The failure is seeded. Do not claim it is a typical error rate.' }]],
 ['Act 5. Blocks', [
  { id: '5.1', title: 'Sanctions event applies a global block', reqs: 'VEN-09, XD-05', goal: 'Show an event-driven control that reaches both ERPs without a screen.', persona: 'Platform event', surface: 'MDM; SAP; D365', time: '6 min',
    steps: [['Trigger the sanctions event', 'No one opened a screen. The event arrives; the platform acts.', 'Baltic Freight Sp. z o.o. set to GB-SANC'],
            ['Switch to SAP', 'One block model, native values in each ERP.', 'Posting, purchasing and payment blocks set'],
            ['Switch to D365', 'Within minutes, in both ERPs, with history.', 'Vendor on hold = All']],
    headless: 'None.', honesty: 'XD-05 says 24 hours. The demo shows minutes. The SLA needs a decision.' }]],
 ['Act 6. Steward', [
  { id: '6.1', title: 'One stewardship dashboard', reqs: 'XD-07, VEN-11, CUS-03, CUS-04, MAT-06, FIN-03', goal: 'Show open issues across domains and a generated rule.', persona: 'Marcus Hale, data steward', surface: 'MDM Stewardship', time: '6 min',
    steps: [['Open Stewardship', 'One dashboard, not four.', 'Counts by domain and seeded issues with requirement IDs']],
    headless: 'B8: "Create a rule that flags vendors with no transactions in 18 months." Expected: rule generated, hits listed.', honesty: 'Rule generation uses CLAIRE agent skills, [PREVIEW]. Have a screenshot ready.' }]],
 ['Act 7. Value', [
  { id: '7.1', title: 'Combined spend and terms alignment', reqs: 'XD-06, VEN-10, XD-08', goal: 'Show that analytics works because the vendor is one vendor.', persona: 'Jordan Wells, CFO', surface: 'Data 360 and Tableau; Claude via MCP', time: '8 min',
    steps: [['Open Data 360 and Tableau', 'Analytics works because the vendor is one vendor.', 'Spend by ERP on G00002 and combined total'],
            ['Ask in Claude about glass supplier spend', 'Governed answer from the same golden record.', 'Combined spend; SAP Net 60 vs D365 Net 30 flagged']],
    headless: 'B9: "What is our total spend with our glass bottle supplier across SAP and D365, and are payment terms aligned?" B10: "Which vendors buy in both ERPs with different payment terms? Rank them by spend."', honesty: 'Spend is simulated. Numbers come from spend_transactions.csv and will match the simulator.' }]],
];
for (const [act, list] of scenes) {
  c.push(H2(act));
  for (const s of list) {
    c.push(H3(`Scene ${s.id}. ${s.title}`));
    c.push(table(['Field', 'Detail'], [['Use-case IDs', s.reqs], ['Goal', s.goal], ['Persona and surface', `${s.persona}. ${s.surface}`], ['Time', s.time]], [1.2, 6]));
    c.push(P('', { after: 60 }));
    c.push(table(['Presenter does', 'Presenter says', 'Evaluator sees'], s.steps, [2.4, 3.6, 3.6]));
    c.push(P(`**Headless moment:** ${s.headless}`, { after: 40 }));
    c.push(P(`**Honesty notes:** ${s.honesty}`));
  }
}

c.push(H1('4. Live headless prompts'));
c.push(P('Run as the named persona. Keep wording exactly as rehearsed. Test every prompt in the demo org. Have a backup screenshot for each.'));
c.push(table(['#', 'Scene', 'Persona', 'Prompt', 'Expected result'], [
 ['B1', '0.1', 'Presenter', 'Show me Prairie Returnables and all its ERP IDs.', 'Golden record with SAP, D365 and CRM keys'],
 ['B2', '1.1', 'Procurement buyer', 'Do we already have Prairie Returnables as a supplier?', '3 match candidates with scores; do not create a duplicate'],
 ['B3', '1.1', 'Procurement buyer', 'Start a request to add the vendor role to the existing party.', 'Change request on G00001; workflow started'],
 ['B4', '1.3', 'AP approver', 'Show my open approvals.', 'Bank-detail task with before and after IBAN'],
 ['B5', '1.3', 'AP approver', 'Approve.', 'Task completed; audit entry channel = Slack/MCP'],
 ['B6', '4.1', 'Data steward', 'Which records failed to sync to D365 today and why?', '1 failure: G00001, TaxGroup mandatory'],
 ['B7', '4.1', 'Data steward', 'Reprocess the failed D365 update for G00001. (optional)', 'Reprocessed; status confirmed'],
 ['B8', '6.1', 'Data steward', 'Create a rule that flags vendors with no transactions in 18 months.', 'Rule generated; hits listed'],
 ['B9', '7.1', 'CFO', 'What is our total spend with our glass bottle supplier across SAP and D365, and are payment terms aligned?', 'Combined spend; NT60 vs NT30 flagged'],
 ['B10', '7.1', 'CFO', 'Which vendors buy in both ERPs with different payment terms? Rank them by spend.', 'Ranked harmonisation list'],
], [0.5, 0.6, 1.5, 4, 3]));

c.push(H1('5. Coverage checklist'));
const cov = { 'VEN-01': '1.3', 'VEN-02': '1.1', 'VEN-03': '1.2', 'VEN-04': '1.3', 'VEN-05': '1.2', 'VEN-06': '1.2', 'VEN-07': '1.2', 'VEN-08': '1.1', 'VEN-09': '5.1', 'VEN-10': '7.1', 'VEN-11': '6.1', 'VEN-12': '1.4, 4.1', 'VEN-13': '1.3, 4.1',
  'CUS-01': 'GAP', 'CUS-02': '0.1, 1.1', 'CUS-03': '6.1', 'CUS-04': '1.1, 6.1', 'CUS-05': 'GAP', 'CUS-06': 'GAP',
  'MAT-01': '2.1', 'MAT-02': '2.1', 'MAT-03': '2.1', 'MAT-04': '2.1', 'MAT-05': '2.1', 'MAT-06': '6.1', 'MAT-07': '2.1', 'MAT-08': '2.1',
  'FIN-01': '3.1', 'FIN-02': 'GAP', 'FIN-03': '6.1', 'FIN-04': '3.1', 'FIN-05': '3.1',
  'XD-01': '0.1', 'XD-02': '4.1', 'XD-03': '0.1', 'XD-04': '1.1, 1.4', 'XD-05': '3.1, 5.1', 'XD-06': '7.1', 'XD-07': '6.1', 'XD-08': '1.1, 1.3, 4.1, 7.1' };
const parseCsv = t => { const rows = []; let r = [], f = '', q = false; for (let i = 0; i < t.length; i++) { const ch = t[i]; if (q) { if (ch === '"' && t[i + 1] === '"') { f += '"'; i++; } else if (ch === '"') q = false; else f += ch; } else if (ch === '"') q = true; else if (ch === ',') { r.push(f); f = ''; } else if (ch === '\n') { r.push(f); rows.push(r); r = []; f = ''; } else if (ch !== '\r') f += ch; } if (f || r.length) { r.push(f); rows.push(r); } return rows; };
const reqs = parseCsv(require('fs').readFileSync(__dirname + '/../data/requirements.csv', 'utf8')).slice(1);
c.push(table(['ID', 'Requirement', 'Scene', 'Covered'], reqs.map(r => [r[0], r[2], cov[r[0]], cov[r[0]] === 'GAP' ? 'No' : 'Yes']), [0.8, 5, 1.5, 1], { fills: (r, i) => (r[3] === 'No' ? 'FCE8E6' : undefined) }));
c.push(P(''));
c.push(P('**Gaps:** CUS-01 (customer hierarchy), CUS-05 (credit block sync), CUS-06 (consent flags) and FIN-02 (cost centre hierarchy) have no scene. Options: a backup scene of 4 minutes each, a slide, or a written answer. Decide before rehearsal.'));

c.push(H1('6. Preparation checklist'));
['Load data/*.csv into the demo org in the order given in data/README.md', 'Verify the answer keys: expected_matches.csv, expected_crosswalk.csv, seeded_issues.csv', 'Create personas and permissions: buyer, AP approver, compliance, steward, CFO', 'Confirm MCP server connection from Claude and Slack to the demo org', 'Run B1 to B10 end to end; capture backup screenshots', 'Confirm sanctions event trigger and ERP publish connectors', 'Check the simulator opens offline and Play runs from step 1 to step 26', 'Agree the five customer-sheet inconsistencies with the customer before the session'].forEach(t => c.push(B(t)));

c.push(H1('7. Sources'));
c.push(P('Found in this session. Re-check before use; availability changes.'));
[
 'Informatica Announces Headless Data Management for AWS (Informatica news release, 20 May 2026): informatica.com/about-us/news/news-releases/2026/05/20260520-informatica-announces-headless-data-management-for-aws-to-power-trusted-enterprise-ready-agentic-workflows.html',
 'Same announcement on Salesforce newsroom: salesforce.com/news/press-releases/2026/05/20/informatica-announces-headless-data-management-aws/',
 'Activate Enterprise Data with Trusted Context, IDMC Spring 2026 release (Informatica blog): informatica.com/blogs/activate-enterprise-data-with-trusted-context-new-capabilities-in-idmcs-spring-2026-release.html',
 'Informatica from Salesforce: Trusted Context for Agents: informatica.com/salesforce.html',
 'IDMC release notes: docs.informatica.com/cloud-common-services/release-notes-for-idmc.html',
].forEach(t => c.push(B(t)));
save(__dirname + '/../Tallgrass_Demo_Script.docx', 'Demo Script', 'Informatica IDMC Multidomain MDM SaaS with Informatica Headless', c);
