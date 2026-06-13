const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const mode = process.argv[2] || 'build';
const root = path.resolve(__dirname, '..');
const htmlRoot = path.join(root, '_build', 'html');
const marker = 'data-ot4ml-expanded-chapters';
const tag = `<script src="/ot4ml-sidebar.js" defer ${marker}></script>`;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function patchHtml() {
  let changed = 0;
  for (const file of walk(htmlRoot)) {
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes(marker)) continue;

    let next;
    if (text.includes('</body>')) {
      next = text.replace('</body>', `${tag}</body>`);
    } else {
      next = `${text}\n${tag}\n`;
    }

    fs.writeFileSync(file, next);
    changed += 1;
  }
  return changed;
}

function runMyst(args) {
  return spawn('myst', args, {
    cwd: root,
    env: process.env,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });
}

if (mode === 'build') {
  const child = runMyst(['build', '--html', '--execute']);
  child.on('exit', (code, signal) => {
    if (code === 0) patchHtml();
    if (signal) process.kill(process.pid, signal);
    process.exit(code || 0);
  });
} else if (mode === 'start') {
  const child = runMyst(['start', '--execute']);
  const timer = setInterval(patchHtml, 750);

  function stop(signal) {
    clearInterval(timer);
    if (!child.killed) child.kill(signal);
  }

  process.on('SIGINT', () => stop('SIGINT'));
  process.on('SIGTERM', () => stop('SIGTERM'));
  child.on('exit', (code, signal) => {
    clearInterval(timer);
    patchHtml();
    if (signal) process.kill(process.pid, signal);
    process.exit(code || 0);
  });
} else {
  console.error(`Unknown mode "${mode}". Use "build" or "start".`);
  process.exit(1);
}
