#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const monorepoRoot = path.resolve(process.cwd(), 'el-hodh0d');
const webRoot = path.resolve(monorepoRoot, 'apps/web');
const pagesDir = path.join(webRoot, 'pages');
const appDir = path.join(webRoot, 'app');
const reportPath = path.join(webRoot, 'migration-report.txt');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function move(from, to) { ensureDir(path.dirname(to)); fs.renameSync(from, to); }
function copy(from, to) { ensureDir(path.dirname(to)); fs.copyFileSync(from, to); }

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, acc); else acc.push(p);
  }
  return acc;
}

function toAppPath(abs) {
  const rel = path.relative(webRoot, abs).replace(/\\/g, '/');
  if (!rel.startsWith('pages/')) return null;
  const relNoPrefix = rel.replace(/^pages\//, '');
  if (relNoPrefix.startsWith('api/')) return null; // skip API routes
  const dir = path.dirname(relNoPrefix);
  const base = path.basename(relNoPrefix);
  const ext = path.extname(base);
  const name = path.basename(base, ext);
  if (name === '_app' || name === '_document' || name === '_error') return null;
  if (name === 'index') return path.join('app', dir, `page${ext}`);
  return path.join('app', dir, name, `page${ext}`);
}

const changes = [];

// 1) Move pages/* to app/*
if (fs.existsSync(pagesDir)) {
  ensureDir(appDir);
  const files = walk(pagesDir);
  for (const abs of files) {
    const toRel = toAppPath(abs);
    if (!toRel) continue;
    const toAbs = path.join(webRoot, toRel);
    move(abs, toAbs);
    const fromRel = path.relative(webRoot, abs).replace(/\\/g, '/');
    changes.push(`MOVE ${fromRel} -> ${toRel}`);
  }
  // remove empty pages dir if empty
  try { fs.rmdirSync(pagesDir, { recursive: true }); } catch {}
}

// 2) Ensure app/layout.tsx exists
const layoutPath = path.join(appDir, 'layout.tsx');
if (!fs.existsSync(layoutPath)) {
  ensureDir(appDir);
  fs.writeFileSync(layoutPath, `import "./globals.css";\nexport default function RootLayout({ children }) {\n  return (<html lang=\"en\" className=\"dark\"><body className=\"bg-background text-foreground antialiased\">{children}</body></html>);\n}\n`);
  changes.push('ADD app/layout.tsx');
}

// 3) Merge Tailwind globals if found
const cssCandidates = [
  'styles/globals.css',
  'src/styles/globals.css',
  'styles/global.css',
  'src/styles/global.css',
];
const appGlobals = path.join(appDir, 'globals.css');
ensureDir(path.dirname(appGlobals));
if (!fs.existsSync(appGlobals)) fs.writeFileSync(appGlobals, '');
for (const rel of cssCandidates) {
  const p = path.join(webRoot, rel);
  if (fs.existsSync(p)) {
    fs.appendFileSync(appGlobals, `\n/* Migrated from ${rel} */\n`);
    fs.appendFileSync(appGlobals, fs.readFileSync(p));
    changes.push(`APPEND ${rel} -> app/globals.css`);
    break;
  }
}

// 4) Snapshot original Tailwind config
for (const fname of ['tailwind.config.ts','tailwind.config.js','tailwind.config.cjs']) {
  const p = path.join(webRoot, fname);
  if (fs.existsSync(p)) {
    const to = path.join(webRoot, `tailwind.config.hodhod.${fname.split('.').pop()}`);
    copy(p, to);
    changes.push(`COPY ${fname} -> ${path.basename(to)}`);
  }
}

// 5) Replace legacy env var name if present in code
const replaceVarIn = ['.tsx','.ts','.js','.jsx','.mjs','.cjs'];
function replaceInFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const out = src.replaceAll('NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_API_BASE_URL');
  if (out !== src) {
    fs.writeFileSync(file, out);
    changes.push(`EDIT ${path.relative(webRoot, file).replace(/\\/g,'/')}: NEXT_PUBLIC_API_URL->NEXT_PUBLIC_API_BASE_URL`);
  }
}
function scanAndReplace(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const st = fs.statSync(p);
    if (st.isDirectory()) scanAndReplace(p); else if (replaceVarIn.some(ext => p.endsWith(ext))) replaceInFile(p);
  }
}
scanAndReplace(webRoot);

fs.writeFileSync(reportPath, changes.join('\n'));
console.log('Migration complete. Report at', reportPath);


