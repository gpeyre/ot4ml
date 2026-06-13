const fs = require('fs');
const path = require('path');

const mystRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(mystRoot, '..');
const latexSections = path.join(repoRoot, 'latex', 'sections');
const mystChapters = path.join(mystRoot, 'chapters');
let knownLabels = new Set();

const files = {
  'matching.tex': 'matching.md',
  'monge.tex': 'monge.md',
  'kantorovich.tex': 'kantorovich.md',
  'dual.tex': 'dual.md',
  'semidiscr-w1.tex': 'semidiscrete-w1.md',
  'dual-norms.tex': 'dual-norms.md',
  'sinkhorn.tex': 'sinkhorn.md',
  'sinkhorn-advanced.tex': 'sinkhorn-advanced.md',
  'generalized-wasserstein.tex': 'generalized-wasserstein.md',
  'generalized-ot-problems.tex': 'generalized-ot-problems.md',
  'beyond-comparing-measures.tex': 'beyond-comparing-measures.md',
  'dynamic-ot.tex': 'dynamic-ot.md',
  'wasserstein-gradient-flows.tex': 'wasserstein-gradient-flows.md',
  'transportation-models.tex': 'transportation-models.md',
};

const sectionMap = {
  'dual-norms.tex': {
    'dual norms integral probability metrics': 'Dual Norms and Integral Probability Metrics',
    'dual rkhs norms and maximum mean discrepancies': 'Dual RKHS Norms and Maximum Mean Discrepancies',
    'gans via duality': 'GANs via Duality',
  },
  'sinkhorn.tex': {
    'path-space schrodinger problem': 'Path-Space Schrodinger Problem',
  },
  'semidiscr-w1.tex': {
    'semi-discrete': 'Semi-discrete',
  },
};

const admonitionTitleAliases = {
  'thm-gelbrich-projection': 'Gelbrich Projection',
};

function stripLatexComments(text) {
  return text
    .split('\n')
    .map((line) => {
      if (/^\s*%/.test(line)) return '';
      return line.replace(/(^|[^\\])%.*/, '$1');
    })
    .join('\n');
}

function normalize(text) {
  return (text || '')
    .replace(/\\['"`^~=.][{]?([A-Za-z])[}]?/g, '$1')
    .replace(/\\varepsilon|\\epsilon/g, 'epsilon')
    .replace(/\\Wass/g, 'wasserstein')
    .replace(/\\SW/g, 'sw')
    .replace(/\\operatorname\{([^}]+)\}/g, '$1')
    .replace(/\\mathbb\{([^}]+)\}/g, '$1')
    .replace(/\\mathcal\{([^}]+)\}/g, '$1')
    .replace(/\\mathrm\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\$|[{}]/g, '')
    .replace(/\\/g, '')
    .replace(/--/g, '-')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

function readBalanced(text, braceIndex) {
  let depth = 0;
  for (let i = braceIndex; i < text.length; i += 1) {
    const char = text[i];
    const escaped = i > 0 && text[i - 1] === '\\';
    if (char === '{' && !escaped) depth += 1;
    if (char === '}' && !escaped) depth -= 1;
    if (depth === 0) {
      return {
        body: text.slice(braceIndex + 1, i),
        end: i + 1,
      };
    }
  }
  throw new Error(`Unbalanced braces near: ${text.slice(braceIndex, braceIndex + 80)}`);
}

function replaceCommandArgument(text, command, replacer) {
  const needle = `\\${command}`;
  let out = '';
  let cursor = 0;
  while (true) {
    const index = text.indexOf(needle, cursor);
    if (index < 0) return out + text.slice(cursor);
    const braceIndex = index + needle.length;
    if (text[braceIndex] !== '{') {
      out += text.slice(cursor, index + needle.length);
      cursor = index + needle.length;
      continue;
    }
    const arg = readBalanced(text, braceIndex);
    out += text.slice(cursor, index) + replacer(arg.body);
    cursor = arg.end;
  }
}

function mathBlock(body) {
  const label = body.match(/\\label\{([^}]+)\}/)?.[1];
  const clean = body
    .replace(/\\label\{[^}]+\}/g, '')
    .split('\n')
    .map((line) => line.replace(/^\t+/, '').trimEnd())
    .join('\n')
    .trim();
  const labelLine = label ? `:label: ${label}\n\n` : '';
  return `\n\n\`\`\`{math}\n${labelLine}${clean}\n\`\`\`\n\n`;
}

function collectLabelsFromMarkdown(markdown) {
  const labels = new Set();
  let match;
  const directiveLabel = /^\s*:label:\s*([A-Za-z0-9_:\-]+)\s*$/gm;
  while ((match = directiveLabel.exec(markdown))) labels.add(match[1]);
  const targetLabel = /^\(([^)]+)\)=\s*$/gm;
  while ((match = targetLabel.exec(markdown))) labels.add(match[1]);
  const latexLabel = /\\label\{([^}]+)\}/g;
  while ((match = latexLabel.exec(markdown))) labels.add(match[1]);
  return labels;
}

function collectLatexLabels(text) {
  const labels = new Set();
  let match;
  const label = /\\label\{([^}]+)\}/g;
  while ((match = label.exec(text))) labels.add(match[1]);
  return labels;
}

function crossReference(role, label, fallback) {
  const resolved = resolveLabel(label);
  return resolved ? `{${role}}\`${resolved}\`` : fallback;
}

function equationReference(prefix, label) {
  const resolved = resolveLabel(label);
  const fallback = prefix ? `the corresponding ${prefix.toLowerCase()}` : 'the corresponding equation';
  return resolved ? `${prefix ? `${prefix} ` : ''}{eq}\`${resolved}\`` : fallback;
}

function typedReference(prefix, label) {
  const resolved = resolveLabel(label);
  const fallback = `the corresponding ${prefix.toLowerCase()}`;
  return resolved ? `${prefix} {ref}\`${resolved}\`` : fallback;
}

function resolveLabel(label) {
  const candidates = [
    label,
    label.replace(/:/g, '-'),
    `${label}-web`,
    `${label.replace(/:/g, '-')}-web`,
  ];
  return candidates.find((candidate) => knownLabels.has(candidate)) || null;
}

function replaceSimpleCommand(text, command, replacer) {
  const needle = `\\${command}{`;
  let out = '';
  let cursor = 0;
  while (true) {
    const index = text.indexOf(needle, cursor);
    if (index < 0) return out + text.slice(cursor);
    const arg = readBalanced(text, index + needle.length - 1);
    out += text.slice(cursor, index) + replacer(arg.body);
    cursor = arg.end;
  }
}

function latexToMyst(body) {
  let text = body;

  text = text.replace(/\\index\{(?:[^{}]|\{[^{}]*\})*\}/g, '');
  text = text.replace(/\\normalfont/g, '');
  text = text.replace(/\\algreturnskip/g, '');
  text = text.replace(/\\begin\{itemize\}/g, '');
  text = text.replace(/\\end\{itemize\}/g, '');
  text = text.replace(/^\s*\\item\s*/gm, '- ');

  text = replaceCommandArgument(text, 'eq', mathBlock);
  text = replaceCommandArgument(text, 'eql', mathBlock);

  text = text.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, (_, inner) => mathBlock(inner));
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => mathBlock(inner));

  text = text.replace(/~?\\cite\{([^}]+)\}/g, (_, keys) => ` {cite:p}\`${keys}\``);
  text = text.replace(/~?\\citep\{([^}]+)\}/g, (_, keys) => ` {cite:p}\`${keys}\``);

  text = text.replace(/([A-Za-z]+)~\\eqref\{([^}]+)\}/g, (_, prefix, label) => equationReference(prefix, label));
  text = text.replace(/~?\\eqref\{([^}]+)\}/g, (_, label) => ` ${equationReference('', label)}`);
  text = text.replace(
    /(Algorithm|Proposition|Theorem|Corollary|Section|Chapter|Figure|Definition|Example|Remark)~\\ref\{([^}]+)\}/g,
    (_, prefix, label) => typedReference(prefix, label),
  );
  text = text.replace(/~?\\ref\{([^}]+)\}/g, (_, label) => ` ${crossReference('ref', label, `reference labeled \`${label}\``)}`);

  text = replaceSimpleCommand(text, 'emph', (inner) => `*${inner}*`);
  text = replaceSimpleCommand(text, 'textbf', (inner) => `**${inner}**`);
  text = replaceSimpleCommand(text, 'texttt', (inner) => `\`${inner}\``);

  text = text.replace(/\\label\{[^}]+\}/g, '');
  text = text.replace(/``([^'`\n]+)''/g, '"$1"');
  text = text.replace(/\\'e/g, 'e');
  text = text.replace(/\\'E/g, 'E');
  text = text.replace(/\\\"o/g, 'o');
  text = text.replace(/\\\"O/g, 'O');
  text = text.replace(/\\qandq/g, '\\qquad\\text{and}\\qquad');
  text = text.replace(/\\qwhereq/g, '\\qquad\\text{where}\\qquad');
  text = text.replace(/~/g, ' ');

  text = text
    .split('\n')
    .map((line) => line.replace(/^\t+/, '').trimEnd())
    .join('\n');
  text = convertAlgBlocks(text);
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}

function convertAlgBlocks(text) {
  let depth = 0;
  const out = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (trimmed === '\\begin{algblock}') {
      depth += 1;
      out.push('');
      continue;
    }
    if (trimmed === '\\end{algblock}') {
      out.push('');
      depth = Math.max(0, depth - 1);
      continue;
    }
    if (depth > 0) {
      const prefix = '>'.repeat(depth);
      out.push(trimmed ? `${prefix} ${line}` : prefix);
    } else {
      out.push(line);
    }
  }
  return out.join('\n');
}

function kindForEnv(env) {
  if (env === 'alg') return 'Algorithm';
  if (env === 'rem') return 'Remark';
  if (env === 'example') return 'Example';
  throw new Error(`Unsupported environment: ${env}`);
}

function kindForTheoremEnv(env) {
  if (env === 'defn') return 'Definition';
  if (env === 'prop' || env === 'proposition') return 'Proposition';
  if (env === 'thm') return 'Theorem';
  if (env === 'cor') return 'Corollary';
  if (env === 'lem') return 'Lemma';
  throw new Error(`Unsupported theorem environment: ${env}`);
}

function classForKind(kind) {
  return `ot4ml-${kind.toLowerCase()}`;
}

function makeBlock(block) {
  const kind = kindForEnv(block.env);
  const body = latexToMyst(block.body);
  const label = block.label ? `(${block.label})=\n` : '';
  return `${label}:::{admonition} ${kind}: ${block.title}\n:class: ${classForKind(kind)}\n\n${body}\n:::\n\n`;
}

function extractBlocks(text) {
  const clean = stripLatexComments(text);
  const re = /\\begin\{(alg|rem|example)\}(?:\[([^\]]*)\])?/g;
  const blocks = [];
  let match;
  while ((match = re.exec(clean))) {
    const env = match[1];
    const title = match[2] || '';
    const bodyStart = re.lastIndex;
    const endNeedle = `\\end{${env}}`;
    const bodyEnd = clean.indexOf(endNeedle, bodyStart);
    if (bodyEnd < 0) throw new Error(`Missing end for ${env} ${title}`);
    const body = clean.slice(bodyStart, bodyEnd).trim();
    blocks.push({
      env,
      title,
      body,
      label: body.match(/^\s*\\label\{([^}]+)\}/)?.[1] || null,
      index: match.index,
      heading: headingBefore(clean, match.index),
    });
    re.lastIndex = bodyEnd + endNeedle.length;
  }
  return blocks;
}

function extractLabelledAdmonitions(text) {
  const clean = stripLatexComments(text);
  const re = /\\begin\{(defn|prop|proposition|thm|cor|lem)\}(?:\[([^\]]*)\])?/g;
  const blocks = [];
  let match;
  while ((match = re.exec(clean))) {
    const env = match[1];
    const title = match[2] || '';
    const bodyStart = re.lastIndex;
    const endNeedle = `\\end{${env}}`;
    const bodyEnd = clean.indexOf(endNeedle, bodyStart);
    if (bodyEnd < 0) throw new Error(`Missing end for ${env} ${title}`);
    const body = clean.slice(bodyStart, bodyEnd);
    const label = body.match(/\\label\{([^}]+)\}/)?.[1] || null;
    if (title && label) {
      blocks.push({
        kind: kindForTheoremEnv(env),
        title,
        label,
      });
    }
    re.lastIndex = bodyEnd + endNeedle.length;
  }
  return blocks;
}

function extractHeadingLabels(text, texFile) {
  const clean = stripLatexComments(text);
  const re = /\\(chapter|section|subsection|subsubsection)\*?(?:\[[^\]]*\])?\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
  const matches = [];
  let match;
  while ((match = re.exec(clean))) {
    matches.push({
      level: match[1],
      title: match[2],
      end: re.lastIndex,
    });
  }

  const labels = [];
  for (let i = 0; i < matches.length; i += 1) {
    const current = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].end : clean.length;
    const window = clean.slice(current.end, Math.min(nextStart, current.end + 500));
    const label = window.match(/^\s*\\label\{([^}]+)\}/m)?.[1] || null;
    if (!label) continue;
    labels.push({
      level: current.level,
      title: targetSection(texFile, current) || current.title,
      label,
    });
  }
  return labels;
}

function headingBefore(text, index) {
  const re = /\\(chapter|section|subsection|subsubsection)\*?(?:\[[^\]]*\])?\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
  let match;
  let last = null;
  while ((match = re.exec(text))) {
    if (match.index >= index) break;
    last = { level: match[1], title: match[2] };
  }
  return last;
}

function extractFigureLabels(text) {
  const clean = stripLatexComments(text);
  const re = /\\begin\{figure\}[\s\S]*?\\end\{figure\}/g;
  const figures = [];
  let match;
  while ((match = re.exec(clean))) {
    const body = match[0];
    const label = body.match(/\\label\{([^}]+)\}/)?.[1] || null;
    if (!label) continue;
    const figureName = body.match(/\\includegraphics(?:\[[^\]]*\])?\{figures\/([^/}]+)\//)?.[1] || label.replace(/^fig:/, '');
    figures.push({ label, figureName });
  }
  return figures;
}

function targetSection(texFile, latexHeading) {
  if (!latexHeading) return null;
  const normalized = normalize(latexHeading.title);
  return sectionMap[texFile]?.[normalized] || latexHeading.title.replace(/\\\"o/g, 'o').replace(/\\'e/g, 'e');
}

function existingAdmonitions(markdown) {
  const re = /^:{3,4}\{admonition\}\s*(?:(Remark|Example|Algorithm):\s*)?(.+)$/gm;
  const found = new Set();
  let match;
  while ((match = re.exec(markdown))) {
    const kind = match[1] || '';
    const title = normalize(match[2]);
    found.add(`|${title}`);
    if (kind) found.add(`${kind}|${title}`);
  }
  return found;
}

function hasBlock(markdown, block) {
  const kind = kindForEnv(block.env);
  const title = normalize(block.title);
  const found = existingAdmonitions(markdown);
  return found.has(`${kind}|${title}`) || found.has(`|${title}`);
}

function latexBlockQueues(blocks) {
  const queues = new Map();
  for (const block of blocks) {
    if (!block.title) continue;
    const key = normalize(block.title);
    if (!queues.has(key)) queues.set(key, []);
    queues.get(key).push(block);
  }
  return queues;
}

function replaceExistingLatexBlocks(markdown, blocks) {
  const queues = latexBlockQueues(blocks);
  const header = /^(:{3,4})\{admonition\}\s*(?:(Remark|Example|Algorithm):\s*)?(.+?)\s*$/gm;
  let out = '';
  let cursor = 0;
  let updated = 0;
  let match;

  while ((match = header.exec(markdown))) {
    const start = match.index;
    const fence = match[1];
    const title = normalize(match[3]);
    const candidates = queues.get(title);
    if (!candidates?.length) continue;

    const endFence = new RegExp(`^${fence}\\s*$`, 'gm');
    endFence.lastIndex = header.lastIndex;
    const end = endFence.exec(markdown);
    if (!end) continue;

    const labelPrefix = markdown.slice(0, start).match(/\n?\([^)]+\)=\s*\n$/);
    const replaceStart = labelPrefix ? start - labelPrefix[0].length : start;
    const replaceEnd = end.index + end[0].length;
    const replacement = makeBlock(candidates.shift());
    const current = markdown.slice(replaceStart, replaceEnd);
    out += markdown.slice(cursor, replaceStart);
    if (out && !out.endsWith('\n')) out += '\n\n';
    out += replacement;
    cursor = end.index + end[0].length;
    header.lastIndex = cursor;
    if (current.trim() !== replacement.trim()) updated += 1;
  }

  return {
    markdown: out + markdown.slice(cursor),
    updated,
  };
}

function findSectionEnd(markdown, headingTitle) {
  if (!headingTitle) return markdown.length;
  const normalizedTitle = normalize(headingTitle);
  const re = /^(#{2,4})\s+(.+)$/gm;
  let match;
  while ((match = re.exec(markdown))) {
    if (normalize(match[2]) !== normalizedTitle) continue;
    const level = match[1].length;
    const start = match.index;
    let next;
    while ((next = re.exec(markdown))) {
      if (next[1].length <= level) return next.index;
    }
    return markdown.length;
  }
  return null;
}

function insertBefore(text, index, addition) {
  const before = text.slice(0, index).replace(/\s*$/, '\n\n');
  const after = text.slice(index).replace(/^\s*/, '\n');
  return `${before}${addition.trim()}\n${after}`;
}

function insertLabelBefore(markdown, index, label) {
  if (collectLabelsFromMarkdown(markdown).has(label)) return { markdown, changed: false };
  const labelPrefix = markdown.slice(0, index).match(/\n?(?:\([^)]+\)=\s*\n)+$/);
  const insertAt = labelPrefix ? index - labelPrefix[0].length : index;
  return {
    markdown: `${markdown.slice(0, insertAt)}${markdown[insertAt - 1] === '\n' || insertAt === 0 ? '' : '\n'}(${label})=\n${markdown.slice(insertAt)}`,
    changed: true,
  };
}

function normalizeTargetSpacing(markdown) {
  const before = markdown;
  markdown = markdown
    .replace(/([^\s\n])(\([A-Za-z0-9_:.\-]+\)=\n:{3,4}\{admonition\})/g, '$1\n\n$2')
    .replace(/([^\n])\n(\([A-Za-z0-9_:.\-]+\)=\n:{3,4}\{admonition\})/g, '$1\n\n$2')
    .replace(/^(:{3,4})(\([A-Za-z0-9_:.\-]+\)=\n:{3,4}\{admonition\})/gm, '$1\n\n$2');
  return {
    markdown,
    changed: markdown !== before ? 1 : 0,
  };
}

function normalizeMarkdown(markdown) {
  return markdown.replace(/[ \t]+$/gm, '').replace(/\n*$/, '\n');
}

function frontmatterEnd(markdown) {
  if (!markdown.startsWith('---\n')) return 0;
  const index = markdown.indexOf('\n---', 4);
  return index < 0 ? 0 : index + '\n---'.length + (markdown[index + 4] === '\n' ? 1 : 0);
}

function addHeadingLabels(markdown, labels) {
  let changed = 0;
  for (const item of labels) {
    if (collectLabelsFromMarkdown(markdown).has(item.label)) continue;
    if (item.level === 'chapter') {
      const inserted = insertLabelBefore(markdown, frontmatterEnd(markdown), item.label);
      markdown = inserted.markdown;
      if (inserted.changed) changed += 1;
      continue;
    }

    const heading = /^(#{2,4})\s+(.+)$/gm;
    let match;
    while ((match = heading.exec(markdown))) {
      if (normalize(match[2]) !== normalize(item.title)) continue;
      const inserted = insertLabelBefore(markdown, match.index, item.label);
      markdown = inserted.markdown;
      if (inserted.changed) changed += 1;
      break;
    }
  }
  return { markdown, changed };
}

function addAdmonitionLabels(markdown, labels) {
  let changed = 0;
  for (const item of labels) {
    if (collectLabelsFromMarkdown(markdown).has(item.label)) continue;
    const header = /^(:{3,4})\{admonition\}\s*(?:(Definition|Proposition|Theorem|Corollary|Lemma):\s*)?(.+?)\s*$/gm;
    let match;
    while ((match = header.exec(markdown))) {
      const kind = match[2] || '';
      if (kind !== item.kind) continue;
      const title = admonitionTitleAliases[item.label] || item.title;
      if (normalize(match[3]) !== normalize(title)) continue;
      const inserted = insertLabelBefore(markdown, match.index, item.label);
      markdown = inserted.markdown;
      if (inserted.changed) changed += 1;
      break;
    }
  }
  return { markdown, changed };
}

function addFigureLabels(markdown, labels) {
  let changed = 0;
  const seenFigures = new Set();
  for (const item of labels) {
    const candidates = [...new Set([item.figureName, item.label.replace(/^fig:/, '')])];
    const found = candidates
      .map((slug) => ({ slug, markerIndex: markdown.indexOf(`show_book_figure("${slug}"`) }))
      .find(({ slug, markerIndex }) => markerIndex >= 0 && !seenFigures.has(slug));
    if (!found) continue;
    seenFigures.add(found.slug);
    if (collectLabelsFromMarkdown(markdown).has(item.label)) continue;
    const markerIndex = found.markerIndex;
    if (markerIndex < 0) continue;
    const divStart = markdown.lastIndexOf(':::{div}\n:class: ot4ml-book-figure', markerIndex);
    const index = divStart >= 0 ? divStart : markerIndex;
    const inserted = insertLabelBefore(markdown, index, item.label);
    markdown = inserted.markdown;
    if (inserted.changed) changed += 1;
  }
  return { markdown, changed };
}

function prepareFileLabels(texFile, mdFile) {
  const texPath = path.join(latexSections, texFile);
  const mdPath = path.join(mystChapters, mdFile);
  const tex = fs.readFileSync(texPath, 'utf8');
  let markdown = fs.readFileSync(mdPath, 'utf8');

  const headed = addHeadingLabels(markdown, extractHeadingLabels(tex, texFile));
  markdown = headed.markdown;
  const figured = addFigureLabels(markdown, extractFigureLabels(tex));
  markdown = figured.markdown;
  const labelled = addAdmonitionLabels(markdown, extractLabelledAdmonitions(tex));
  markdown = labelled.markdown;
  const normalized = normalizeTargetSpacing(markdown);
  markdown = normalized.markdown;
  const finalMarkdown = normalizeMarkdown(markdown);
  const formattingChanged = finalMarkdown !== markdown ? 1 : 0;
  markdown = finalMarkdown;

  const changed = headed.changed + figured.changed + labelled.changed + normalized.changed + formattingChanged;
  if (changed) fs.writeFileSync(mdPath, markdown);
  return changed;
}

function syncFile(texFile, mdFile) {
  const texPath = path.join(latexSections, texFile);
  const mdPath = path.join(mystChapters, mdFile);
  const blocks = extractBlocks(fs.readFileSync(texPath, 'utf8'));
  let markdown = fs.readFileSync(mdPath, 'utf8');
  const originalMarkdown = markdown;
  const refreshed = replaceExistingLatexBlocks(markdown, blocks);
  markdown = refreshed.markdown;
  const normalized = normalizeTargetSpacing(markdown);
  markdown = normalized.markdown;
  markdown = normalizeMarkdown(markdown);

  const pending = blocks.filter((block) => block.title && !hasBlock(markdown, block));
  if (!pending.length) {
    if (markdown !== originalMarkdown) fs.writeFileSync(mdPath, markdown);
    return { inserted: 0, updated: markdown !== originalMarkdown ? refreshed.updated + normalized.changed : 0 };
  }

  const groups = new Map();
  for (const block of pending) {
    const section = targetSection(texFile, block.heading);
    const key = section || '__append__';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(block);
  }

  for (const [section, sectionBlocks] of groups) {
    const rendered = sectionBlocks.map(makeBlock).join('\n');
    const index = section === '__append__' ? markdown.length : findSectionEnd(markdown, section);
    if (index == null) {
      throw new Error(`Could not find section "${section}" in ${mdFile}`);
    }
    markdown = insertBefore(markdown, index, rendered);
  }

  markdown = normalizeMarkdown(markdown);
  if (markdown !== originalMarkdown) fs.writeFileSync(mdPath, markdown);
  return {
    inserted: pending.length,
    updated: markdown !== originalMarkdown ? refreshed.updated + normalized.changed : 0,
  };
}

function collectKnownLabels() {
  const labels = new Set();

  for (const mdFile of Object.values(files)) {
    const mdPath = path.join(mystChapters, mdFile);
    if (!fs.existsSync(mdPath)) continue;
    for (const label of collectLabelsFromMarkdown(fs.readFileSync(mdPath, 'utf8'))) {
      labels.add(label);
    }
  }

  for (const texFile of Object.keys(files)) {
    const texPath = path.join(latexSections, texFile);
    if (!fs.existsSync(texPath)) continue;
    const blocks = extractBlocks(fs.readFileSync(texPath, 'utf8'));
    for (const block of blocks) {
      for (const label of collectLatexLabels(block.body)) labels.add(label);
    }
  }

  return labels;
}

let anchored = 0;
for (const [texFile, mdFile] of Object.entries(files)) {
  anchored += prepareFileLabels(texFile, mdFile);
}

knownLabels = collectKnownLabels();

let inserted = 0;
let updated = 0;
for (const [texFile, mdFile] of Object.entries(files)) {
  const count = syncFile(texFile, mdFile);
  if (count.updated || count.inserted) {
    console.log(`${mdFile}: updated ${count.updated}, inserted ${count.inserted} LaTeX boxes`);
  }
  inserted += count.inserted;
  updated += count.updated;
}
console.log(`Anchored ${anchored}, updated ${updated} and inserted ${inserted} LaTeX boxes.`);
