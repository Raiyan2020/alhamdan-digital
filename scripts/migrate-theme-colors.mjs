import fs from "node:fs";
import path from "node:path";

const roots = ["components", "app"];
const skip = /[\\/](ui|node_modules)[\\/]/;
const replacements = [
  ["!focus-visible:!bg-[#012561]", "!focus-visible:!bg-brand"],
  ["focus-visible:!bg-[#012561]", "focus-visible:!bg-brand"],
  ["hover:!bg-[#012561]", "hover:!bg-brand"],
  ["!border-[#012561]", "!border-brand"],
  ["!bg-[#012561]", "!bg-brand"],
  ["!text-[#fbfbfb]", "!text-brand-on"],
  ["border-[#082557]/10", "border-brand-deep/10"],
  ["border-[#082557]/8", "border-brand-deep/8"],
  ["bg-[#082557]/8", "bg-brand-deep/8"],
  ["bg-[#082557]/12", "bg-brand-deep/12"],
  ["hover:bg-[#082557]/12", "hover:bg-brand-deep/12"],
  ["text-[#012561]/70", "text-brand/70"],
  ["from-[#012561]", "from-[var(--gradient-brand-from)]"],
  ["via-[#0b3d8f]", "via-[var(--gradient-brand-via)]"],
  ["to-[#1e5fbf]", "to-[var(--gradient-brand-to)]"],
  ["bg-[#fcfcfc]", "bg-page"],
  ["text-[#fcfcfc]", "text-page"],
  ["bg-[#012561]", "bg-brand"],
  ["text-[#012561]", "text-brand"],
  ["border-[#012561]", "border-brand"],
  ["bg-[#082557]", "bg-brand-deep"],
  ["text-[#082557]", "text-brand-deep"],
  ["text-[#0d0d0d]/85", "text-ink/85"],
  ["text-[#0d0d0d]/80", "text-ink/80"],
  ["text-[#0d0d0d]/50", "text-ink/50"],
  ["text-[#0d0d0d]", "text-ink"],
  ["text-[#fbfbfb]", "text-brand-on"],
  ["text-[#777]", "text-ink-muted"],
  ["text-[#4e4e4e]", "text-ink-secondary"],
  ["text-[#525252]", "text-ink-tertiary"],
  ["text-[#5b6577]", "text-ink-soft"],
  ["text-[#0a1020]", "text-ink-heading"],
  ["text-[#666]", "text-ink-neutral"],
  ["bg-[#f3f3f3]", "bg-card-muted"],
  ["bg-[#f2f6ff]", "bg-card-surface"],
  ["border-[#e8e8e8]", "border-border-soft"],
  ["border-[#d1d5db]", "border-border-muted"],
  ['fill="#012561"', 'fill="var(--brand)"'],
];

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.(tsx|ts)$/.test(ent.name)) files.push(p);
  }
  return files;
}

let count = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    if (skip.test(file)) continue;
    const src = fs.readFileSync(file, "utf8");
    let next = src;
    for (const [from, to] of replacements) {
      next = next.split(from).join(to);
    }
    if (next !== src) {
      fs.writeFileSync(file, next);
      count++;
    }
  }
}

console.log(`Updated ${count} files`);
