// Checks for reference-model/index.html. Run: npm install && npm test
// 1. Model JSON parses and every cross-reference points to a real ID.
// 2. Page script passes a syntax check.
// 3. Every tab renders at desktop (light) and phone (dark) width with no script errors and no sideways scroll.
// 4. Each process exports a .bpmn file that bpmn-moddle parses with zero warnings.
const fs = require("fs"), path = require("path"), vm = require("vm");
const {chromium} = require("playwright");
const moddle = require("bpmn-moddle"); const BpmnModdle = moddle.BpmnModdle || moddle.default || moddle;

const PAGE = path.join(__dirname, "..", "reference-model", "index.html");
const OUT = path.join(__dirname, "out"); fs.mkdirSync(OUT, {recursive: true});
const src = fs.readFileSync(PAGE, "utf8");
let failed = 0; const fail = m => { failed++; console.log("FAIL", m); }, ok = m => console.log("ok  ", m);

// 1. model and references
const M = JSON.parse(src.match(/<script id="model" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const ids = new Set(); for (const k of ["domains","subjectAreas","attributes","systems","processes","controls","steps","dq","regs","glossary","vds","waves"]) (M[k] || []).forEach(r => ids.add(r.id));
const refs = [];
M.relations.forEach(r => refs.push(r.f, r.t));
M.subjectAreas.forEach(s => refs.push(s.domain)); M.attributes.forEach(a => refs.push(a.sa));
(M.steps || []).forEach(s => refs.push(s.p, s.sys, ...s.writes, ...s.reads, ...s.ctl));
(M.dq || []).forEach(q => refs.push(...q.attrs, ...q.ctl, ...q.steps));
(M.regs || []).forEach(g => refs.push(...g.attrs, ...g.ctl));
(M.glossary || []).forEach(g => refs.push(...g.see));
(M.vds || []).forEach(v => refs.push(...v.steps, ...v.doms));
(M.waves || []).forEach(w => refs.push(...w.refs, ...w.vds));
(M.maturity?.scores || []).forEach(s => refs.push(s.d));
const bad = refs.filter(r => !ids.has(r));
bad.length ? fail("unknown IDs referenced: " + [...new Set(bad)].join(", ")) : ok(`model: ${ids.size} records, ${refs.length} references, all resolve`);

// 2. syntax
const js = src.match(/<script>\n(\(\(\) => \{[\s\S]*?\}\)\(\);)\n<\/script>/)[1];
try { new vm.Script(js); ok("page script syntax"); } catch (e) { fail("syntax: " + e.message); }

(async () => {
  // 3. render every tab
  const html = '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>' + src + "</body></html>";
  const file = path.join(OUT, "page.html"); fs.writeFileSync(file, html);
  const exe = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
  const b = await chromium.launch(exe ? {executablePath: exe} : {});
  const tabs = await (async () => { const p = await b.newPage(); await p.goto("file://" + file); const t = await p.$$eval("[data-tab]", x => x.map(e => e.dataset.tab)); await p.close(); return t; })();
  for (const [w, cs] of [[1440, "light"], [400, "dark"]]){
    const p = await b.newPage({viewport: {width: w, height: 1000}, colorScheme: cs, acceptDownloads: true});
    const errs = []; p.on("pageerror", e => errs.push(e.message));
    await p.goto("file://" + file); await p.waitForTimeout(300);
    for (const t of tabs){
      await p.click(`[data-tab="${t}"]`); await p.waitForTimeout(60);
      const sw = await p.evaluate(() => document.documentElement.scrollWidth);
      if (sw > w) errs.push(`tab ${t} scrolls sideways (${sw}px)`);
      if (w > 1000) await p.screenshot({path: path.join(OUT, `tab-${t}.png`), fullPage: true});
    }
    errs.length ? fail(`${w}px ${cs}: ${errs.join("; ")}`) : ok(`${tabs.length} tabs render at ${w}px ${cs}`);
    // 4. BPMN export
    if (w > 1000){
      await p.click('[data-tab="proc"]');
      for (const pid of [...new Set(M.steps.map(s => s.p))]){
        await p.click(`[data-bpmn="${pid}"]`);
        const [d] = await Promise.all([p.waitForEvent("download"), p.click(`[data-bpmnxml="${pid}"]`)]);
        const f = path.join(OUT, d.suggestedFilename()); await d.saveAs(f);
        const {warnings} = await new BpmnModdle().fromXML(fs.readFileSync(f, "utf8"));
        warnings.length ? fail(`${pid} BPMN: ${warnings.map(x => x.message).join("; ")}`) : ok(`${pid} exports valid BPMN 2.0 (${d.suggestedFilename()})`);
      }
    }
    await p.close();
  }
  await b.close();
  console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed. Screenshots in tests/out/");
  process.exit(failed ? 1 : 0);
})();
