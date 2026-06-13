const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const mode = process.argv[2] || 'build';
const root = path.resolve(__dirname, '..');
const htmlRoot = path.join(root, '_build', 'html');
const buildRoot = path.join(root, '_build');
const preloadFile = path.join(__dirname, 'myst-sidebar-preload.js');
const marker = 'data-ot4ml-expanded-chapters';
const tag = `<script src="/ot4ml-sidebar.js" defer ${marker}></script>`;

function walk(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, predicate, out);
    } else if (entry.isFile() && predicate(full, entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function patchHtml() {
  let changed = 0;
  for (const file of walk(htmlRoot, (full) => full.endsWith('.html'))) {
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

function patchThemeBundles() {
  let changed = 0;
  for (const file of walk(buildRoot, (full) => full.endsWith('.js'))) {
    const text = fs.readFileSync(file, 'utf8');
    if (!text.includes('Open Folder') || !text.includes('collapsible-content')) continue;

    let next = text;
    next = next.replace(
      'n=Yan([t],e,r).includes(t.id),i=',
      'n=Yan([t],e,r).includes(t.id)||t.title==="Chapters",i=',
    );
    next = next.replace(
      'r=c4([i],e,t).includes(i.id),n=',
      'r=c4([i],e,t).includes(i.id)||i.title==="Chapters",n=',
    );

    if (next !== text) {
      fs.writeFileSync(file, next);
      changed += 1;
    }
  }
  return changed;
}

function patchTemplateZip() {
  const templateDir = path.join(buildRoot, 'templates', 'site', 'myst', 'book-theme');
  const zipFile = path.join(templateDir, 'template.zip');
  const templateSource = path.join(templateDir, 'book-theme-main');
  if (!fs.existsSync(zipFile) || !fs.existsSync(templateSource)) return false;

  const result = spawnSync('zip', ['-qr', 'template.zip', 'book-theme-main'], {
    cwd: templateDir,
    stdio: 'ignore',
  });
  return result.status === 0;
}

function patchGeneratedSite() {
  const result = {
    html: patchHtml(),
    bundles: patchThemeBundles(),
  };
  patchTemplateZip();
  return result;
}

function withPreload(env) {
  const option = `--require=${preloadFile}`;
  const current = env.NODE_OPTIONS || '';
  return {
    ...env,
    NODE_OPTIONS: current.includes(preloadFile) ? current : `${option} ${current}`.trim(),
  };
}

function runMyst(args) {
  return spawn('myst', args, {
    cwd: root,
    env: withPreload(process.env),
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });
}

if (mode === 'build') {
  patchThemeBundles();
  const child = runMyst(['build', '--html', '--execute']);
  child.on('exit', (code, signal) => {
    if (code === 0) patchGeneratedSite();
    if (signal) process.kill(process.pid, signal);
    process.exit(code || 0);
  });
} else if (mode === 'start') {
  patchThemeBundles();
  const child = runMyst(['start', '--execute']);
  const timer = setInterval(patchGeneratedSite, 750);

  function stop(signal) {
    clearInterval(timer);
    if (!child.killed) child.kill(signal);
  }

  process.on('SIGINT', () => stop('SIGINT'));
  process.on('SIGTERM', () => stop('SIGTERM'));
  child.on('exit', (code, signal) => {
    clearInterval(timer);
    patchGeneratedSite();
    if (signal) process.kill(process.pid, signal);
    process.exit(code || 0);
  });
} else {
  console.error(`Unknown mode "${mode}". Use "build" or "start".`);
  process.exit(1);
}
