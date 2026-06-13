const fs = require('fs');
const path = require('path');
const Module = require('module');

const root = path.resolve(__dirname, '..');
const marker = 'data-ot4ml-expanded-chapters';
const tag = `<script src="/ot4ml-sidebar.js" defer ${marker}></script>`;

function injectScript(body) {
  const text = Buffer.isBuffer(body) ? body.toString('utf8') : body;
  if (typeof text !== 'string' || !text.includes('</body>') || text.includes(marker)) {
    return body;
  }
  return text.replace('</body>', `${tag}</body>`);
}

function serveSidebarScript(req, res) {
  const url = req.url.split('?')[0];
  if (url !== '/ot4ml-sidebar.js') return false;
  res.type('application/javascript');
  res.send(fs.readFileSync(path.join(root, 'ot4ml-sidebar.js'), 'utf8'));
  return true;
}

const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
  const loaded = originalLoad.apply(this, arguments);
  if (request !== 'express' || loaded.__ot4mlExpandedChaptersPatched) {
    return loaded;
  }

  function expressWithExpandedChapters(...args) {
    const app = loaded(...args);
    app.use((req, res, next) => {
      if (serveSidebarScript(req, res)) return;

      const send = res.send.bind(res);
      res.send = (body) => {
        const nextBody = injectScript(body);
        if (nextBody !== body) {
          res.removeHeader('content-length');
        }
        return send(nextBody);
      };
      next();
    });
    return app;
  }

  Object.setPrototypeOf(expressWithExpandedChapters, loaded);
  for (const key of Object.keys(loaded)) {
    expressWithExpandedChapters[key] = loaded[key];
  }
  expressWithExpandedChapters.__ot4mlExpandedChaptersPatched = true;
  return expressWithExpandedChapters;
};
