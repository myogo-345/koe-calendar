const fs = require('fs');
const path = require('path');

const geminiKey = process.env.GEMINI_KEY || '';
const clientId  = process.env.CLIENT_ID  || '';

if (!geminiKey) console.warn('[build] WARNING: GEMINI_KEY is not set');
if (!clientId)  console.warn('[build] WARNING: CLIENT_ID is not set');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

// index.html のプレースホルダーを置換して dist/ に出力
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
html = html.replace(/%%GEMINI_KEY%%/g, geminiKey);
html = html.replace(/%%CLIENT_ID%%/g,  clientId);
fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), html);

// 静的ファイルをそのままコピー
const staticFiles = ['apple-touch-icon.png'];
staticFiles.forEach(f => {
  const src = path.join(__dirname, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, f));
    console.log(`[build] copied: ${f}`);
  }
});

console.log(`[build] done — GEMINI_KEY: ${geminiKey ? '✓ set' : '✗ empty'}, CLIENT_ID: ${clientId ? '✓ set' : '✗ empty'}`);
