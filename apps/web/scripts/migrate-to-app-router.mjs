#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');
const webRoot = path.resolve(process.cwd(), '..');
const projRoot = path.resolve(process.cwd(), '..');
const pagesDir = path.resolve(process.cwd(), '../pages');
const appDir = path.resolve(process.cwd(), '../app');
const reportPath = path.resolve(process.cwd(), '../migration-report.txt');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function move(from, to) {
  ensureDir(path.dirname(to));
  fs.renameSync(from, to);
}

function isPageRoute(file) {
  const base = path.basename(file);
  return base.match(/^(index|\[.*\])\.(tsx?|jsx?)$/);
}

function toAppPath(rel) {
  // pages/index.tsx -> app/page.tsx
  // pages/about.tsx -> app/about/page.tsx
  // pages/blog/[slug].tsx -> app/blog/[slug]/page.tsx
  const noPrefix = rel.replace(/^pages[\\/]/, '');
  const dir = path.dirname(noPrefix);
  const base = path.basename(noPrefix);
  if (base.startsWith('api/')) return null;
  if (base.startsWith('_app') || base.startsWith('_document') || base.startsWith('_error')) return null;
  if (base.startsWith('index.')) return path.join('app', dir, 'page' + path.extname(base));
  return path.join('app', dir, path.parse(base).name, 'page' + path.extname(base));
}

function walk(dir, acc=[]) {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const changes = [];
if (fs.existsSync(pagesDir)) {
  ensureDir(appDir);
  const files = walk(pagesDir);
  for (const abs of files) {
    const rel = path.relative(path.resolve(process.cwd(), '..'), abs).replace(/\\/g, '/');
    const toRel = toAppPath(rel);
    if (!toRel) continue;
    const toAbs = path.resolve(process.cwd(), '..', toRel);
    move(abs, toAbs);
    changes.push(`MOVE ${rel} -> ${toRel}`);
  }
}

// Create basic app/layout.tsx if not exists
const layoutPath = path.resolve(process.cwd(), '../app/layout.tsx');
if (!fs.existsSync(layoutPath)) {
  ensureDir(path.dirname(layoutPath));
  fs.writeFileSync(layoutPath, `import "./globals.css";\nexport default function RootLayout({ children }) {\n  return (<html lang=\"en\" className=\"dark\"><body className=\"bg-background text-foreground antialiased\">{children}</body></html>);\n}\n`);
  changes.push('ADD app/layout.tsx');
}

fs.writeFileSync(reportPath, changes.join('\n'));
console.log('Migration complete. Report at', reportPath);


