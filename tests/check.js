// Checks for a single-file artifact page. Run: npm test (checks every page), or node tests/check.js <page.html>
// 1. Model JSON parses and every cross-reference points to a real ID.
// 2. Page script passes a syntax check.
// 3. Every tab renders at desktop (light) and phone (dark) width with no script errors and no sideways scroll.
//    Talk-track buttons (data-beat), if any, run without errors.
// 4. Each process exports a .bpmn file that bpmn-moddle parses with zero warnings.
const fs = require("fs"), path = require("path"), vm = require("vm");
const {chromium} = require("playwright");
const moddle = require("bpmn-moddle"); const BpmnModdle = moddle.BpmnModdle || moddle.default || moddle;

const PAGE = path.resolve(process.argv[2] || path.join(__dirname, "..", "reference-model", "index.html"));
const NAME = path.basename(path.dirname(PAGE));
const OUT = path.join(__dirname, "out", NAME); fs.mkdirSync(OUT, {recursive: true});
const src = fs.readFileSync(PAGE, "utf8");
let failed = 0; const fail = m => { failed++; console.log("FAIL", m); }, ok = m => console.log("ok  ", m);
console.log(`\n== ${NAME} ==`);

// 1. model and references: any array field below must hold IDs; any scalar field below must be an ID.
const M = JSON.parse(src.match(/<script id="model" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const ids = new Set();
for (const v of Object.values(M)) if (Array.isArray(v)) v.forEach(r => r && r.id && ids.add(r.id));
const ARR = ["from","to","refs","datasets","reads","writes","ctl","produces","needs","unblocks","see","attrs","steps","doms","vds"];
const ONE = ["f","t","p","sys","pipeline","wave","sa","domain","d"];
const refs = [];
(function walk(o, key){
  if (Array.isArray(o)){ if (ARR.includes(key) && o.every(x => typeof x === "string")) refs.push(...o); else o.forEach(x => walk(x, null)); return; }
  if (o && typeof o === "object") for (const [k, v] of Object.entries(o)){
    if (ONE.includes(k) && typeof v === "string") refs.push(v); else walk(v, k);
  }
})(M, null);
const bad = refs.filter(r => !ids.has(r));
bad.length ? fail("unknown IDs referenced: " + [...new Set(bad)].join(", ")) : ok(`model: ${ids.size} records, ${refs.length} references, all resolve`);

// 2. syntax
const js = src.match(/<script>\n(\(\(\) => \{[\s\S]*?\}\)\(\);)\n<\/script>/)[1];
try { new vm.Script(js); ok("page script syntax"); } catch (e) { fail("syntax: " + e.message); }

(async () => {
  const html = '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>' + src + "</body></html>";
  const file = path.join(OUT, "page.html"); fs.writeFileSync(file, html);
  const exe = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
  const b = await chromium.launch(exe ? {executablePath: exe} : {});
  for (const [w, cs] of [[1440, "light"], [400, "dark"]]){
    const p = await b.newPage({viewport: {width: w, height: 1000}, colorScheme: cs, acceptDownloads: true});
    const errs = []; p.on("pageerror", e => errs.push(e.message));
    await p.goto("file://" + file); await p.waitForTimeout(300);
    const tabs = await p.$$eval("[data-tab]", x => x.map(e => e.dataset.tab));
    // 3. tabs
    for (const t of tabs){
      await p.click(`[data-tab="${t}"]`); await p.waitForTimeout(60);
      const sw = await p.evaluate(() => document.documentElement.scrollWidth);
      if (sw > w) errs.push(`tab ${t} scrolls sideways (${sw}px)`);
      if (w > 1000) await p.screenshot({path: path.join(OUT, `tab-${t}.png`), fullPage: true});
    }
    // talk track
    const beats = await p.$$eval("[data-beat]", x => x.length).catch(() => 0);
    for (let i = 0; i < beats; i++){
      await p.click(`[data-tab="${tabs[0]}"]`); await p.click(`[data-beat="${i}"]`); await p.waitForTimeout(60);
      if (w > 1000) await p.screenshot({path: path.join(OUT, `beat-${i + 1}.png`), fullPage: true});
    }
    errs.length ? fail(`${w}px ${cs}: ${errs.join("; ")}`) : ok(`${tabs.length} tabs${beats ? ` and ${beats} talk-track steps` : ""} render at ${w}px ${cs}`);
    // 4. BPMN export
    if (w > 1000 && tabs.includes("proc")){
      await p.click('[data-tab="proc"]');
      const pids = await p.$$eval("[data-bpmn]", x => x.map(e => e.dataset.bpmn));
      for (const pid of pids){
        if (await p.$(`[data-bpmnxml="${pid}"]`) === null) await p.click(`[data-bpmn="${pid}"]`);
        const [d] = await Promise.all([p.waitForEvent("download"), p.click(`[data-bpmnxml="${pid}"]`)]);
        const f = path.join(OUT, d.suggestedFilename()); await d.saveAs(f);
        const {warnings} = await new BpmnModdle().fromXML(fs.readFileSync(f, "utf8"));
        warnings.length ? fail(`${pid} BPMN: ${warnings.map(x => x.message).join("; ")}`) : ok(`${pid} exports valid BPMN 2.0 (${d.suggestedFilename()})`);
      }
    }
    await p.close();
  }
  await b.close();
  console.log(failed ? `${failed} check(s) failed` : `all checks passed. Screenshots in tests/out/${NAME}/`);
  process.exit(failed ? 1 : 0);
})();
