const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const mode = process.argv[2] || 'build';
const root = path.resolve(__dirname, '..');
const repoRoot = path.resolve(root, '..');
const htmlRoot = path.join(root, '_build', 'html');
const buildRoot = path.join(root, '_build');
const sidebarScriptFile = path.join(root, 'ot4ml-sidebar.js');
const faviconRoot = path.join(repoRoot, 'assets', 'favicon');
const faviconFiles = ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png'];
const marker = 'data-ot4ml-expanded-chapters';
const serverPatchMarker = 'ot4ml-expanded-chapters-server-patch';
const assetVersion = '?ot4ml-expanded-chapters=1';
const defaultBuildBaseUrl = '/ot4ml/myst/_build/html';
const defaultBuildPort = process.env.MYST_BUILD_PORT || process.env.PORT || '3000';

function hasEnv(name) {
  return Object.prototype.hasOwnProperty.call(process.env, name);
}

function normalizeBaseUrl(value) {
  if (!value) return '';
  let base = String(value).trim();
  if (!base || base === '/') return '';
  if (!base.startsWith('/')) base = `/${base}`;
  return base.replace(/\/+$/, '');
}

function buildEnv() {
  const env = { ...process.env };
  if (!hasEnv('BASE_URL')) env.BASE_URL = defaultBuildBaseUrl;
  if (!env.HOST || env.HOST === '0.0.0.0') env.HOST = '127.0.0.1';
  return env;
}

const effectiveBaseUrl = mode === 'build'
  ? normalizeBaseUrl(hasEnv('BASE_URL') ? process.env.BASE_URL : defaultBuildBaseUrl)
  : normalizeBaseUrl(process.env.BASE_URL);
const publicPath = (pathname) => `${effectiveBaseUrl}${pathname}`;
const tag = `<script src="${publicPath('/ot4ml-sidebar.js')}" defer ${marker}></script>`;

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

function bustMystAssetUrls(text) {
  return text.replace(
    /(\/myst_assets_folder\/[^"'`\s)]+?\.js)(?!\?)(?=["'`;),])/g,
    `$1${assetVersion}`,
  );
}

function patchSidebarTag(text) {
  const pattern = new RegExp(`<script[^>]*${marker}[^>]*></script>`, 'g');
  return text.replace(pattern, tag);
}

function patchHtml() {
  let changed = 0;
  for (const file of walk(htmlRoot, (full) => full.endsWith('.html'))) {
    const text = fs.readFileSync(file, 'utf8');
    let next = patchSidebarTag(bustMystAssetUrls(text));
    if (next.includes(marker)) {
      if (next !== text) {
        fs.writeFileSync(file, next);
        changed += 1;
      }
      continue;
    }

    if (next.includes('</body>')) {
      next = next.replace('</body>', `${tag}</body>`);
    } else {
      next = `${next}\n${tag}\n`;
    }

    fs.writeFileSync(file, next);
    changed += 1;
  }
  return changed;
}

function patchAssetImports() {
  let changed = 0;
  for (const file of walk(buildRoot, (full) => full.endsWith('.js'))) {
    const text = fs.readFileSync(file, 'utf8');
    const next = bustMystAssetUrls(text);
    if (next !== text) {
      fs.writeFileSync(file, next);
      changed += 1;
    }
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

function escapeHtmlAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function collectAdmonitionAnchors(node, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (node.type === 'admonition') {
    out.push(node.html_id || node.identifier || null);
  }
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const child of value) collectAdmonitionAnchors(child, out);
    } else if (value && typeof value === 'object') {
      collectAdmonitionAnchors(value, out);
    }
  }
  return out;
}

function htmlFileForPageJson(jsonFile, page) {
  const name = path.basename(jsonFile, '.json');
  if (name === 'index') return path.join(htmlRoot, 'index.html');
  const slug = page.slug || name;
  return path.join(htmlRoot, slug, 'index.html');
}

function patchAdmonitionAnchors() {
  let changed = 0;
  for (const jsonFile of walk(htmlRoot, (full, name) => name.endsWith('.json') && path.dirname(full) === htmlRoot)) {
    if (['config.json', 'myst.search.json', 'myst.xref.json'].includes(path.basename(jsonFile))) continue;

    let page;
    try {
      page = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    } catch {
      continue;
    }
    if (!page || !page.mdast) continue;

    const anchors = collectAdmonitionAnchors(page.mdast);
    if (!anchors.some(Boolean)) continue;

    const htmlFile = htmlFileForPageJson(jsonFile, page);
    if (!fs.existsSync(htmlFile)) continue;

    const text = fs.readFileSync(htmlFile, 'utf8');
    let index = 0;
    const next = text.replace(/<aside\b[^>]*\bmyst-admonition\b[^>]*>/g, (match) => {
      const anchor = anchors[index++];
      if (!anchor || /\bid=/.test(match)) return match;
      return match.replace('<aside', `<aside id="${escapeHtmlAttribute(anchor)}"`);
    });

    if (next !== text) {
      fs.writeFileSync(htmlFile, next);
      changed += 1;
    }
  }
  return changed;
}

function copySidebarScript() {
  if (!fs.existsSync(sidebarScriptFile)) return 0;

  let changed = 0;
  const destinations = [
    path.join(htmlRoot, 'ot4ml-sidebar.js'),
    path.join(buildRoot, 'templates', 'site', 'myst', 'book-theme', 'public', 'ot4ml-sidebar.js'),
    path.join(buildRoot, 'templates', 'site', 'myst', 'book-theme', 'book-theme-main', 'public', 'ot4ml-sidebar.js'),
  ];

  const source = fs.readFileSync(sidebarScriptFile, 'utf8');
  for (const destination of destinations) {
    const dir = path.dirname(destination);
    if (!fs.existsSync(dir)) continue;
    if (fs.existsSync(destination) && fs.readFileSync(destination, 'utf8') === source) continue;
    fs.writeFileSync(destination, source);
    changed += 1;
  }
  return changed;
}

function copyFaviconFiles() {
  let changed = 0;
  const destinations = [
    root,
    htmlRoot,
    path.join(buildRoot, 'templates', 'site', 'myst', 'book-theme', 'public'),
    path.join(buildRoot, 'templates', 'site', 'myst', 'book-theme', 'book-theme-main', 'public'),
  ];

  for (const name of faviconFiles) {
    const sourceFile = path.join(faviconRoot, name);
    if (!fs.existsSync(sourceFile)) continue;
    const source = fs.readFileSync(sourceFile);
    for (const destinationRoot of destinations) {
      if (!fs.existsSync(destinationRoot)) continue;
      const destination = path.join(destinationRoot, name);
      if (fs.existsSync(destination) && fs.readFileSync(destination).equals(source)) continue;
      fs.writeFileSync(destination, source);
      changed += 1;
    }
  }
  return changed;
}

function patchServerFiles() {
  let changed = 0;
const setupPatch = `// ${serverPatchMarker}:setup-start
const ot4mlSidebarMarker = '${marker}';
const ot4mlSidebarTag = \`<script src="${publicPath('/ot4ml-sidebar.js')}" defer \${ot4mlSidebarMarker}></script>\`;
const ot4mlSidebarFile = path.join(__dirname, 'public', 'ot4ml-sidebar.js');
const ot4mlAssetVersion = '${assetVersion}';
const ot4mlBustMystAssetUrls = (text) => text.replace(
  /(\\/myst_assets_folder\\/[^"'\\\`\\s)]+?\\.js)(?!\\?)(?=["'\\\`;),])/g,
  \`$1\${ot4mlAssetVersion}\`,
);

app.get('/ot4ml-sidebar.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(ot4mlSidebarFile);
});
// ${serverPatchMarker}:setup-end`;

  const htmlPatch = `// ${serverPatchMarker}:html-start
app.use((req, res, next) => {
  const chunks = [];
  const write = res.write.bind(res);
  const end = res.end.bind(res);
  const toBuffer = (chunk, encoding) => {
    if (!chunk) return Buffer.alloc(0);
    if (Buffer.isBuffer(chunk)) return chunk;
    return Buffer.from(chunk, typeof encoding === 'string' ? encoding : 'utf8');
  };

  res.write = (chunk, encoding, callback) => {
    if (typeof encoding === 'function') {
      callback = encoding;
      encoding = undefined;
    }
    chunks.push(toBuffer(chunk, encoding));
    if (typeof callback === 'function') callback();
    return true;
  };

  res.end = (chunk, encoding, callback) => {
    if (typeof encoding === 'function') {
      callback = encoding;
      encoding = undefined;
    }
    if (chunk) chunks.push(toBuffer(chunk, encoding));
    const body = Buffer.concat(chunks);
    const text = body.toString('utf8');
    let nextText = ot4mlBustMystAssetUrls(text);
    if (nextText.includes('</body>') && !nextText.includes(ot4mlSidebarMarker)) {
      nextText = nextText.replace('</body>', \`\${ot4mlSidebarTag}</body>\`);
    }
    if (nextText !== text) {
      res.removeHeader('content-length');
      return end(nextText, 'utf8', callback);
    }
    if (body.length) return end(body, encoding, callback);
    return end(chunk, encoding, callback);
  };
  next();
});
// ${serverPatchMarker}:html-end`;
  const serverFiles = [
    path.join(buildRoot, 'templates', 'site', 'myst', 'book-theme', 'server.js'),
    path.join(buildRoot, 'templates', 'site', 'myst', 'book-theme', 'book-theme-main', 'server.js'),
  ];

  for (const file of serverFiles) {
    if (!fs.existsSync(file)) continue;
    let text = fs.readFileSync(file, 'utf8');

    while (text.includes(`// ${serverPatchMarker}:`)) {
      const start = text.indexOf(`// ${serverPatchMarker}:`);
      const end = text.indexOf(`// ${serverPatchMarker}:`, start + serverPatchMarker.length + 5);
      const endOfLine = end < 0 ? -1 : text.indexOf('\n', end);
      if (endOfLine < 0) break;
      text = `${text.slice(0, start)}${text.slice(endOfLine + 1)}`;
    }

    if (text.includes(`// ${serverPatchMarker}`)) {
      const start = text.indexOf(`// ${serverPatchMarker}`);
      const end = text.indexOf('\n\napp.use(compression());', start);
      if (end >= 0) {
        text = `${text.slice(0, start)}${text.slice(end + 2)}`;
      }
    }

    const anchor = 'const app = express();';
    const morganAnchor = "app.use(morgan('tiny'));\n\napp.all(";
    if (!text.includes(anchor) || !text.includes(morganAnchor)) continue;
    const next = text
      .replace(anchor, `${anchor}\n\n${setupPatch}`)
      .replace(morganAnchor, `app.use(morgan('tiny'));\n\n${htmlPatch}\n\napp.all(`);

    if (next === fs.readFileSync(file, 'utf8')) continue;
    fs.writeFileSync(file, next);
    changed += 1;
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
    admonitionAnchors: patchAdmonitionAnchors(),
    bundles: patchThemeBundles(),
    assets: patchAssetImports(),
    sidebar: copySidebarScript(),
    favicons: copyFaviconFiles(),
    server: patchServerFiles(),
  };
  patchTemplateZip();
  return result;
}

function runMyst(args, env = process.env) {
  return spawn('myst', args, {
    cwd: root,
    env,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });
}

if (mode === 'build') {
  patchGeneratedSite();
  const child = runMyst(['build', '--html', '--execute', '--port', defaultBuildPort], buildEnv());
  child.on('exit', (code, signal) => {
    if (code === 0) patchGeneratedSite();
    if (signal) process.kill(process.pid, signal);
    process.exit(code || 0);
  });
} else if (mode === 'start') {
  patchGeneratedSite();
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
} else if (mode === 'patch') {
  const result = patchGeneratedSite();
  console.log(`Patched generated site: ${JSON.stringify(result)}`);
} else {
  console.error(`Unknown mode "${mode}". Use "build", "start" or "patch".`);
  process.exit(1);
}
