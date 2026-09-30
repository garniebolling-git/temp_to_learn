const d = require('docx');
const fs = require('fs');
const GREEN = '1F5D3A', GOLD = 'D9A441', LIGHT = 'E7F1EA', GREY = 'F4F7F4';
const W = 12240 - 2 * 1080; // content width for Letter with 0.75in margins
const bd = { style: d.BorderStyle.SINGLE, size: 4, color: 'C9D6CD' };
const borders = { top: bd, bottom: bd, left: bd, right: bd };

const run = (t, o = {}) => new d.TextRun({ text: String(t), font: 'Arial', size: o.size || 20, bold: o.bold, italics: o.italics, color: o.color });
function rich(t, o = {}) { // **bold** inline
  return String(t).split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(s => s.startsWith('**') ? run(s.slice(2, -2), { ...o, bold: true }) : run(s, o));
}
const P = (t, o = {}) => new d.Paragraph({ children: rich(t, o), spacing: { after: o.after ?? 100 }, alignment: o.align });
const H1 = t => new d.Paragraph({ heading: d.HeadingLevel.HEADING_1, children: [run(t, { size: 32, bold: true, color: GREEN })], spacing: { before: 280, after: 120 } });
const H2 = t => new d.Paragraph({ heading: d.HeadingLevel.HEADING_2, children: [run(t, { size: 26, bold: true, color: GREEN })], spacing: { before: 220, after: 100 } });
const H3 = t => new d.Paragraph({ heading: d.HeadingLevel.HEADING_3, children: [run(t, { size: 22, bold: true })], spacing: { before: 160, after: 80 } });
const B = t => new d.Paragraph({ numbering: { reference: 'bul', level: 0 }, children: rich(t), spacing: { after: 60 } });
const N = t => new d.Paragraph({ numbering: { reference: 'num', level: 0 }, children: rich(t), spacing: { after: 60 } });
const PB = () => new d.Paragraph({ children: [new d.PageBreak()] });

function cell(text, w, o = {}) {
  const lines = Array.isArray(text) ? text : [text];
  return new d.TableCell({
    width: { size: w, type: d.WidthType.DXA }, borders,
    shading: o.fill ? { fill: o.fill, type: d.ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 50, bottom: 50, left: 80, right: 80 },
    children: lines.map(l => new d.Paragraph({ children: rich(l, { size: o.size || 17, bold: o.bold, color: o.color }), spacing: { after: 20 }, alignment: o.align })),
  });
}
// widths given as relative weights; scaled to content width
function table(headers, rows, weights, o = {}) {
  const tot = weights.reduce((a, b) => a + b, 0);
  let cw = weights.map(x => Math.floor(W * x / tot));
  cw[cw.length - 1] += W - cw.reduce((a, b) => a + b, 0);
  return new d.Table({
    width: { size: W, type: d.WidthType.DXA }, columnWidths: cw,
    rows: [
      new d.TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, cw[i], { fill: GREEN, bold: true, color: 'FFFFFF', size: 17 })) }),
      ...rows.map((r, ri) => new d.TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, cw[i], { fill: (o.fills && o.fills(r, i)) || (ri % 2 ? GREY : undefined) })) })),
    ],
  });
}
function gantt(weeks, tasks) { // tasks: [name, startWeek(1-based), endWeek]
  const nameW = 4200, wk = Math.floor((W - nameW) / weeks), cw = [nameW, ...Array(weeks).fill(wk)];
  cw[cw.length - 1] += W - cw.reduce((a, b) => a + b, 0);
  return new d.Table({
    width: { size: W, type: d.WidthType.DXA }, columnWidths: cw,
    rows: [
      new d.TableRow({ children: [cell('Workstream', cw[0], { fill: GREEN, bold: true, color: 'FFFFFF' }), ...Array.from({ length: weeks }, (_, i) => cell('Week ' + (i + 1), cw[i + 1], { fill: GREEN, bold: true, color: 'FFFFFF', align: d.AlignmentType.CENTER }))] }),
      ...tasks.map(([n, s, e]) => new d.TableRow({ children: [cell(n, cw[0]), ...Array.from({ length: weeks }, (_, i) => cell('', cw[i + 1], { fill: (i + 1 >= s && i + 1 <= e) ? GOLD : undefined }))] })),
    ],
  });
}
async function save(file, title, subtitle, children, landscape = false) {
  const doc = new d.Document({
    creator: 'Tallgrass demo team', title,
    styles: { default: { document: { run: { font: 'Arial', size: 20 } } } },
    numbering: { config: [
      { reference: 'bul', levels: [{ level: 0, format: d.LevelFormat.BULLET, text: '•', alignment: d.AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
      { reference: 'num', levels: [{ level: 0, format: d.LevelFormat.DECIMAL, text: '%1.', alignment: d.AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] } ] },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
      headers: { default: new d.Header({ children: [new d.Paragraph({ children: [run('Tallgrass Beverage Co. | ' + title, { size: 16, color: '5B6B62' })], border: { bottom: { style: d.BorderStyle.SINGLE, size: 6, color: GOLD, space: 4 } } })] }) },
      footers: { default: new d.Footer({ children: [new d.Paragraph({ alignment: d.AlignmentType.CENTER, children: [run('Simulated demo. Fictitious company and data. Page ', { size: 16, color: '5B6B62' }), new d.TextRun({ children: [d.PageNumber.CURRENT], font: 'Arial', size: 16, color: '5B6B62' })] })] }) },
      children: [
        new d.Paragraph({ children: [run(title, { size: 44, bold: true, color: GREEN })], spacing: { before: 200, after: 60 } }),
        new d.Paragraph({ children: [run(subtitle, { size: 22, color: '5B6B62' })], spacing: { after: 240 }, border: { bottom: { style: d.BorderStyle.SINGLE, size: 12, color: GOLD, space: 6 } } }),
        ...children],
    }],
  });
  fs.writeFileSync(file, await d.Packer.toBuffer(doc));
  console.log('wrote', file);
}
module.exports = { P, H1, H2, H3, B, N, PB, table, gantt, save, d };
