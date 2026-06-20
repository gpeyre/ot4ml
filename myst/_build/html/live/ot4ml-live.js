"use strict";

const controls = document.getElementById("controls");
const canvas = document.getElementById("canvas");
const status = document.getElementById("status");
const params = new URLSearchParams(window.location.search);
const knownKinds = [
  "linecost",
  "quantile",
  "histogram",
  "circle",
  "cost",
  "resolution",
  "regularization",
  "duplication",
  "hungarian",
  "mongecolor",
  "mongeshape",
  "mongequantile",
  "mongetriangular",
  "mongegaussian",
  "kantocouplings",
  "kantomatrix",
  "kantosplitting",
  "kantobarrier",
  "kantoplan",
  "kantogluing",
  "kantowow",
  "kantoclt",
  "dualdiscrete",
  "dualauction",
  "dualcontinuous",
  "dualenvelope",
  "dualalternate",
  "semilaguerre",
  "semilloyd",
  "w1graph",
  "dualnormipm",
  "dualnormphi",
  "sinkhornscaling",
  "sinkhornepsilon",
  "sinkhornsoftc",
  "sinkhornregularizers",
  "sinkhorndebias",
  "sinkhorncontinuous",
  "sinkhornadvancedconvergence",
  "sinkhornadvancedgaussian",
  "sinkhornadvancedsamples",
  "generalizedunbalanced",
  "generalizedsliced",
  "generalizedlinearot",
  "generalizedspectral",
  "otproblemsbarycenter",
  "otproblemsgaussianbarycenter",
  "otproblemsmetric",
  "otproblemsweak",
  "dynamicbb",
  "dynamicunbalanced",
  "gradflowjko",
  "gradflowdiffusion",
  "gradflowconstraint",
  "gradflowmultispecies",
  "gradflowmmd",
  "gradflowinteraction",
  "gradflowobjective",
  "gradflowfokker",
  "gradflowmlp",
  "generativeflow",
  "generativediffusion1d",
  "generativediffusion2d",
  "generativetrajectories",
  "generativeschedule",
  "generativedrifting",
  "generativegaussianclosure",
  "beyondvector",
  "beyondmatrix",
  "beyondgromov",
  "beyondgromovdistortion",
  "beyondfusedgromov",
];
const pathKind = knownKinds.find((name) => window.location.pathname.includes(name));
const kind = document.body.dataset.kind || params.get("kind") || pathKind || "quantile";
const imageAssets = new Map();

const RED = "#d73027";
const BLUE = "#2166ac";
const VIOLET = "#7b3294";
const MIXTURES = {
  one: { weights: [1.0], means: [0.0], stds: [0.58] },
  two: { weights: [0.58, 0.42], means: [-2.05, -0.15], stds: [0.32, 0.48] },
  wide_two: { weights: [0.42, 0.58], means: [-1.7, 1.25], stds: [0.62, 0.42] },
  three: { weights: [0.5, 0.31, 0.19], means: [-1.78, 0.1, 1.72], stds: [0.25, 0.56, 0.31] },
};
const SHAPES = ["disk", "annulus", "two_blobs", "three_blobs", "crescent"];
const WEIGHTS = ["uniform", "angular", "right_heavy"];

let currentRender = null;
let renderTimer = null;

window.addEventListener("error", (event) => {
  showError(event.error || event.message || "The interactive demo could not be initialized.");
});

function showError(error) {
  document.querySelector(".ot4ml-panel").classList.add("ot4ml-error");
  controls.innerHTML = "";
  const message = error && error.message ? error.message : String(error);
  status.textContent = `Interactive demo error: ${message}`;
}

function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function pretty(value) {
  return String(value).replaceAll("_", " ");
}

function formatNumber(value, step) {
  const text = String(step);
  const digits = text.includes(".") ? text.split(".")[1].length : 0;
  return Number(value).toFixed(Math.min(digits, 3));
}

function normalPdf(x, mean, std) {
  const z = (x - mean) / std;
  return Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI));
}

function erf(x) {
  const sign = x < 0 ? -1 : 1;
  const z = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * z);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z));
  return sign * y;
}

function erfinv(x) {
  const clipped = clamp(x, -0.999999, 0.999999);
  const a = 0.147;
  const sign = clipped < 0 ? -1 : 1;
  const lx = Math.log(1 - clipped * clipped);
  const first = 2 / (Math.PI * a) + lx / 2;
  return sign * Math.sqrt(Math.sqrt(first * first - lx / a) - first);
}

function normalCdf(x, mean, sigma) {
  return 0.5 * (1 + erf((x - mean) / (sigma * Math.SQRT2)));
}

function normalInv(u, mean, sigma) {
  return mean + sigma * Math.SQRT2 * erfinv(2 * u - 1);
}

function mixPdf(name, x) {
  const p = MIXTURES[name];
  let value = 0;
  for (let k = 0; k < p.weights.length; k += 1) {
    value += p.weights[k] * normalPdf(x, p.means[k], p.stds[k]);
  }
  return value;
}

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixColor(t, a = RED, b = BLUE, alpha = 1) {
  const ca = rgb(a);
  const cb = rgb(b);
  return `rgba(${Math.round(lerp(ca[0], cb[0], t))},${Math.round(lerp(ca[1], cb[1], t))},${Math.round(lerp(ca[2], cb[2], t))},${alpha})`;
}

function setStatus(text) {
  status.textContent = text || "";
}

function imageAsset(src) {
  if (imageAssets.has(src)) return imageAssets.get(src);
  const img = new Image();
  const record = { image: img, state: "loading" };
  img.onload = () => {
    record.state = "ready";
    scheduleRender();
  };
  img.onerror = () => {
    record.state = "error";
    scheduleRender();
  };
  img.src = src;
  imageAssets.set(src, record);
  return record;
}

function rasterSizeForDisplay(width, minSize, maxSize) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  return Math.round(clamp(Math.ceil(width * dpr), minSize, maxSize));
}

function imageDataFromAsset(record, size) {
  if (record.state !== "ready") return null;
  const tmp = document.createElement("canvas");
  tmp.width = size;
  tmp.height = size;
  const ictx = tmp.getContext("2d", { willReadFrequently: true });
  const side = Math.min(record.image.naturalWidth || size, record.image.naturalHeight || size);
  const sx = ((record.image.naturalWidth || side) - side) / 2;
  const sy = ((record.image.naturalHeight || side) - side) / 2;
  ictx.imageSmoothingEnabled = true;
  if ("imageSmoothingQuality" in ictx) ictx.imageSmoothingQuality = "high";
  ictx.drawImage(record.image, sx, sy, side, side, 0, 0, size, size);
  try {
    return ictx.getImageData(0, 0, size, size).data;
  } catch {
    record.state = "error";
    return null;
  }
}

function grayImageFromAsset(record, size) {
  const data = imageDataFromAsset(record, size);
  if (!data) return null;
  const out = new Array(size * size);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = (0.2126 * data[4 * i] + 0.7152 * data[4 * i + 1] + 0.0722 * data[4 * i + 2]) / 255;
  }
  return out;
}

function rgbImageFromAsset(record, size) {
  const data = imageDataFromAsset(record, size);
  if (!data) return null;
  const out = new Array(size * size);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = [data[4 * i], data[4 * i + 1], data[4 * i + 2]];
  }
  return out;
}

function resizeCanvas(height) {
  const rect = canvas.getBoundingClientRect();
  const fallbackWidth = canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760;
  const w = Math.round(Math.max(300, rect.width || fallbackWidth || 760));
  const controlsHeight = controls.getBoundingClientRect().height || 0;
  const statusHeight = status.getBoundingClientRect().height || 18;
  const availableHeight = window.innerHeight - controlsHeight - statusHeight - 46;
  const targetHeight = clamp(Math.min(height, availableHeight || height), 170, height);
  const dpr = window.devicePixelRatio || 1;
  canvas.style.height = `${targetHeight}px`;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(targetHeight * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, targetHeight);
  return { ctx, w, h: targetHeight };
}

function slider(id, label, value, min, max, step) {
  const formatted = formatNumber(value, step);
  return `<label class="ot4ml-control">${label} <span class="ot4ml-readout" data-for="${id}" data-step="${step}">${formatted}</span><span class="ot4ml-slider-row"><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><input class="ot4ml-number" id="${id}Number" type="number" min="${min}" max="${max}" step="${step}" value="${formatted}" data-sync-for="${id}" aria-label="${label} value"></span></label>`;
}

function select(id, label, options, value) {
  const optionMarkup = options
    .map((option) => `<option value="${option}"${option === value ? " selected" : ""}>${pretty(option)}</option>`)
    .join("");
  return `<label class="ot4ml-control">${label}<select id="${id}">${optionMarkup}</select></label>`;
}

function val(id) {
  const el = document.getElementById(id);
  return el.tagName === "SELECT" ? el.value : Number(el.value);
}

function applyNumberInput(el, finalize = false) {
  const range = document.getElementById(el.dataset.syncFor);
  const value = Number(el.value);
  if (!range || !Number.isFinite(value)) return false;
  range.value = String(clamp(value, Number(range.min), Number(range.max)));
  if (finalize) el.value = formatNumber(range.value, range.step);
  return true;
}

function numberInputFor(id) {
  return document.querySelector(`input[type="number"][data-sync-for="${id}"]`);
}

function syncReadouts(forceNumbers = false) {
  document.querySelectorAll(".ot4ml-readout").forEach((node) => {
    const el = document.getElementById(node.dataset.for);
    const formatted = formatNumber(el.value, node.dataset.step);
    node.textContent = formatted;
    const number = numberInputFor(el.id);
    if (number && (forceNumbers || document.activeElement !== number)) number.value = formatted;
  });
}

function scheduleRender() {
  window.clearTimeout(renderTimer);
  renderTimer = window.setTimeout(() => {
    if (currentRender) currentRender();
  }, 35);
}

function bind(render) {
  currentRender = render;
  controls.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", () => {
      if (el.type === "number" && el.dataset.syncFor && !applyNumberInput(el)) return;
      syncReadouts();
      scheduleRender();
    });
    el.addEventListener("change", () => {
      if (el.type === "number" && el.dataset.syncFor && !applyNumberInput(el, true)) {
        syncReadouts(true);
        return;
      }
      syncReadouts(true);
      render();
    });
  });
  syncReadouts();
  render();
}

function inverseCdfSamples(xs, pdf, n) {
  const cdf = new Array(pdf.length);
  let total = 0;
  for (let i = 0; i < pdf.length; i += 1) {
    total += pdf[i];
    cdf[i] = total;
  }
  for (let i = 0; i < cdf.length; i += 1) cdf[i] /= total;
  const out = [];
  for (let k = 0; k < n; k += 1) {
    const u = (k + 0.5) / n;
    let j = 1;
    while (j < cdf.length && cdf[j] < u) j += 1;
    const t = (u - cdf[j - 1]) / Math.max(cdf[j] - cdf[j - 1], 1e-12);
    out.push(lerp(xs[j - 1], xs[j], clamp(t, 0, 1)));
  }
  return out;
}

function drawQuantile() {
  const n = val("n");
  const source = val("source");
  const target = val("target");
  const { ctx, w, h } = resizeCanvas(344);
  const margin = { l: 34, r: 18, t: 20, b: 24 };
  const xMin = -3.3;
  const xMax = 3.3;
  const X = (x) => margin.l + ((x - xMin) / (xMax - xMin)) * (w - margin.l - margin.r);
  const Y = (y) => margin.t + (1 - y) * (h - margin.t - margin.b);
  const xs = Array.from({ length: 820 }, (_, i) => lerp(xMin, xMax, i / 819));
  const spdf = xs.map((x) => mixPdf(source, x));
  const tpdf = xs.map((x) => mixPdf(target, x));
  const maxPdf = Math.max(...spdf, ...tpdf);
  const scale = 0.27 / maxPdf;
  const sourceBase = 0.76;
  const targetBase = 0.24;

  ctx.lineWidth = 1;
  ctx.strokeStyle = "#e5e9ef";
  ctx.beginPath();
  ctx.moveTo(X(xMin), Y(sourceBase));
  ctx.lineTo(X(xMax), Y(sourceBase));
  ctx.moveTo(X(xMin), Y(targetBase));
  ctx.lineTo(X(xMax), Y(targetBase));
  ctx.stroke();

  function curve(pdf, base, sign, color) {
    ctx.beginPath();
    ctx.moveTo(X(xs[0]), Y(base));
    for (let i = 0; i < xs.length; i += 1) ctx.lineTo(X(xs[i]), Y(base + sign * scale * pdf[i]));
    ctx.lineTo(X(xs[xs.length - 1]), Y(base));
    ctx.closePath();
    ctx.fillStyle = color === RED ? "rgba(215,48,39,.14)" : "rgba(33,102,172,.14)";
    ctx.fill();
    ctx.beginPath();
    for (let i = 0; i < xs.length; i += 1) {
      const px = X(xs[i]);
      const py = Y(base + sign * scale * pdf[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }

  curve(spdf, sourceBase, 1, RED);
  curve(tpdf, targetBase, -1, BLUE);
  const sx = inverseCdfSamples(xs, spdf, n);
  const tx = inverseCdfSamples(xs, tpdf, n);

  ctx.lineWidth = 0.75;
  for (let k = 0; k < n; k += 1) {
    ctx.strokeStyle = mixColor((k + 0.5) / n, RED, BLUE, 0.43);
    ctx.beginPath();
    ctx.moveTo(X(sx[k]), Y(sourceBase));
    ctx.lineTo(X(tx[k]), Y(targetBase));
    ctx.stroke();
  }

  function points(arr, y, color) {
    ctx.fillStyle = color;
    for (const x of arr) {
      ctx.beginPath();
      ctx.arc(X(x), Y(y), 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  points(sx, sourceBase, RED);
  points(tx, targetBase, BLUE);
  ctx.fillStyle = RED;
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("source alpha", X(xMin) + 2, Y(sourceBase + 0.24));
  ctx.fillStyle = BLUE;
  ctx.fillText("target beta", X(xMin) + 2, Y(targetBase - 0.2));
  setStatus(`${n} monotone pairs`);
}

function lineAssignment(x, y, power) {
  const cost = x.map((xi) => y.map((yj) => Math.abs(xi - yj) ** power));
  return hungarian(cost);
}

function drawOneDimensionalPanel(ctx, box, source, target, assignment, power, title) {
  const all = source.concat(target);
  const xmin = Math.min(...all) - 0.28;
  const xmax = Math.max(...all) + 0.28;
  const X = (x) => box.x + ((x - xmin) / Math.max(xmax - xmin, 1e-9)) * box.w;
  const ySource = box.y + 0.30 * box.h;
  const yTarget = box.y + 0.74 * box.h;

  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#e5e9ef";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(box.x + 12, ySource);
  ctx.lineTo(box.x + box.w - 12, ySource);
  ctx.moveTo(box.x + 12, yTarget);
  ctx.lineTo(box.x + box.w - 12, yTarget);
  ctx.stroke();

  for (let i = 0; i < assignment.length; i += 1) {
    const j = assignment[i];
    ctx.strokeStyle = `rgba(123,50,148,${power < 1 ? 0.38 : 0.30})`;
    ctx.lineWidth = power < 1 ? 0.9 : 0.75;
    ctx.beginPath();
    ctx.moveTo(X(source[i]), ySource);
    ctx.lineTo(X(target[j]), yTarget);
    ctx.stroke();
  }

  ctx.fillStyle = RED;
  for (const x of source) {
    ctx.beginPath();
    ctx.arc(X(x), ySource, 3.1, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = BLUE;
  for (const y of target) {
    ctx.beginPath();
    ctx.arc(X(y), yTarget, 3.1, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.fillStyle = "#26333f";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${title}, p = ${power.toFixed(2)}`, box.x + box.w / 2, box.y + 18);
  ctx.textAlign = "left";
}

function drawLineCost() {
  setStatus("computing one-dimensional assignments...");
  const n = val("n1d");
  const sourceName = val("lineSource");
  const targetName = val("lineTarget");
  const pConvex = val("pConvex");
  const pConcave = val("pConcave");
  const xMin = -3.3;
  const xMax = 3.3;
  const xs = Array.from({ length: 900 }, (_, i) => lerp(xMin, xMax, i / 899));
  const spdf = xs.map((x) => mixPdf(sourceName, x));
  const tpdf = xs.map((x) => mixPdf(targetName, x));
  const source = inverseCdfSamples(xs, spdf, n);
  const target = inverseCdfSamples(xs, tpdf, n);
  const convex = lineAssignment(source, target, pConvex);
  const concave = lineAssignment(source, target, pConcave);
  const { ctx, w, h } = resizeCanvas(310);
  const gap = 18;
  const boxW = (w - 34 - gap) / 2;
  const boxH = h - 44;
  drawOneDimensionalPanel(ctx, { x: 12, y: 34, w: boxW, h: boxH }, source, target, convex, pConvex, "convex");
  drawOneDimensionalPanel(ctx, { x: 12 + boxW + gap, y: 34, w: boxW, h: boxH }, source, target, concave, pConcave, "concave");
  setStatus(`${n} points; convex costs are monotone, concave costs favor long exchanges`);
}

function syntheticImage(size) {
  const out = [];
  for (let iy = 0; iy < size; iy += 1) {
    const y = -1 + (2 * iy) / (size - 1);
    for (let ix = 0; ix < size; ix += 1) {
      const x = -1 + (2 * ix) / (size - 1);
      const base = 0.5 + 0.25 * x - 0.18 * y;
      const blob = 0.28 * Math.exp(-7 * ((x + 0.22) ** 2 + (y - 0.05) ** 2));
      const ridge = 0.18 * Math.exp(-24 * (y + 0.45 + 0.25 * Math.sin(4 * x)) ** 2);
      const texture = 0.035 * Math.sin(18 * x + 5 * y) * Math.sin(11 * y);
      out.push(clamp(base + blob - ridge + texture, 0, 1));
    }
  }
  return out;
}

function drawHistogram() {
  const mean = val("mean");
  const sigma = val("sigma");
  const t = val("interp");
  const { ctx, w } = resizeCanvas(342);
  const gap = 34;
  const leftW = Math.min(300, Math.max(132, Math.floor((w - gap - 46) * 0.44)));
  const imgX = 22;
  const imgY = 30;
  const imgW = leftW;
  const size = rasterSizeForDisplay(imgW, 150, 300);
  const cat = imageAsset("assets/cat.jpg");
  const base = grayImageFromAsset(cat, size) || syntheticImage(size);
  const pairs = base.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const mapped = new Array(base.length);
  const lo = normalCdf(0, mean, sigma);
  const hi = normalCdf(1, mean, sigma);
  for (let r = 0; r < pairs.length; r += 1) {
    const u = (r + 0.5) / pairs.length;
    mapped[pairs[r][1]] = clamp(normalInv(lo + u * (hi - lo), mean, sigma), 0, 1);
  }
  const img = base.map((v, i) => lerp(v, mapped[i], t));
  const tmp = document.createElement("canvas");
  tmp.width = size;
  tmp.height = size;
  const ictx = tmp.getContext("2d");
  const data = ictx.createImageData(size, size);
  for (let i = 0; i < img.length; i += 1) {
    const g = Math.round(255 * clamp(img[i], 0, 1));
    data.data[4 * i] = g;
    data.data[4 * i + 1] = g;
    data.data[4 * i + 2] = g;
    data.data[4 * i + 3] = 255;
  }
  ictx.putImageData(data, 0, 0);
  ctx.imageSmoothingEnabled = true;
  if ("imageSmoothingQuality" in ctx) ctx.imageSmoothingQuality = "high";
  ctx.drawImage(tmp, imgX, imgY, imgW, imgW);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(imgX, imgY, imgW, imgW);
  ctx.fillStyle = "#2f3b45";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText(`t = ${t.toFixed(2)}`, imgX, imgY + imgW + 22);

  const bins = 42;
  const hist = Array(bins).fill(0);
  for (const v of img) hist[Math.min(bins - 1, Math.floor(v * bins))] += 1;
  const dx = 1 / bins;
  for (let i = 0; i < bins; i += 1) hist[i] /= img.length * dx;
  const target = Array.from({ length: bins }, (_, i) => {
    const x = (i + 0.5) / bins;
    return normalPdf(x, mean, sigma) / Math.max(hi - lo, 1e-9);
  });
  const px = imgX + imgW + gap;
  const py = 30;
  const pw = Math.max(120, w - px - 22);
  const ph = imgW;
  const ymax = 1.12 * Math.max(...hist, ...target);
  const X = (x) => px + x * pw;
  const Y = (y) => py + ph - (y / ymax) * ph;
  ctx.strokeStyle = "#d8dee8";
  ctx.lineWidth = 1;
  ctx.strokeRect(px, py, pw, ph);
  ctx.fillStyle = mixColor(t, RED, BLUE, 0.24);
  for (let i = 0; i < bins; i += 1) {
    const x0 = X(i / bins);
    const x1 = X((i + 0.86) / bins);
    ctx.fillRect(x0, Y(hist[i]), Math.max(1, x1 - x0), py + ph - Y(hist[i]));
  }
  ctx.beginPath();
  for (let i = 0; i < bins; i += 1) {
    const x = X((i + 0.5) / bins);
    const y = Y(hist[i]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = mixColor(t, RED, BLUE, 0.95);
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i < bins; i += 1) {
    const x = X((i + 0.5) / bins);
    const y = Y(target[i]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = BLUE;
  ctx.lineWidth = 1.25;
  ctx.stroke();
  ctx.fillStyle = "#4a5563";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("gray level", px + pw - 62, py + ph + 20);
  ctx.fillStyle = BLUE;
  ctx.fillText("target law", px + pw - 78, py + 16);
  const imageSource = cat.state === "ready" ? `cat photograph, ${size}x${size}` : "synthetic fallback while the photograph loads";
  setStatus(`target mean ${mean.toFixed(2)}, sigma ${sigma.toFixed(3)}; ${imageSource}`);
}

function rng(seed) {
  let a = seed >>> 0;
  return function random() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randn(random) {
  const u = Math.max(random(), 1e-12);
  const v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function sampleCloud(shape, n, random) {
  const pts = [];
  for (let i = 0; i < n; i += 1) {
    if (shape === "disk") {
      const th = 2 * Math.PI * random();
      const rad = 0.52 * Math.sqrt(random());
      pts.push([rad * Math.cos(th), rad * Math.sin(th)]);
    } else if (shape === "annulus") {
      const th = 2 * Math.PI * random();
      const inner = 0.82;
      const outer = 1.04;
      const rad = Math.sqrt(inner * inner + random() * (outer * outer - inner * inner));
      pts.push([rad * Math.cos(th), rad * Math.sin(th)]);
    } else if (shape === "two_blobs") {
      const c = random() < 0.5 ? [-0.72, -0.18] : [0.72, 0.18];
      pts.push([c[0] + 0.22 * randn(random), c[1] + 0.18 * randn(random)]);
    } else if (shape === "three_blobs") {
      const centers = [[-0.78, -0.45], [0.78, -0.35], [0.0, 0.75]];
      const c = centers[Math.floor(3 * random())];
      pts.push([c[0] + 0.18 * randn(random), c[1] + 0.18 * randn(random)]);
    } else {
      const th = lerp(-0.92 * Math.PI, 0.92 * Math.PI, random());
      const rad = 0.82 + 0.13 * randn(random);
      pts.push([0.15 + rad * Math.cos(th), 0.72 * rad * Math.sin(th)]);
    }
  }
  return pts;
}

function circleDistance(a, b) {
  const d = Math.abs(a - b);
  return Math.min(d, 1 - d);
}

function sampleAngles(n, random, offset = 0) {
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const base = (i + 0.5 + 0.22 * Math.sin(1.7 * i + offset)) / n;
    out.push((base + 0.045 * (random() - 0.5) + 1) % 1);
  }
  out.sort((a, b) => a - b);
  return out;
}

function bestCircleShift(source, target, power) {
  let best = 0;
  let bestCost = Infinity;
  const n = source.length;
  for (let s = 0; s < n; s += 1) {
    let cost = 0;
    for (let k = 0; k < n; k += 1) {
      cost += circleDistance(source[k], target[(k + s) % n]) ** power;
    }
    if (cost < bestCost) {
      bestCost = cost;
      best = s;
    }
  }
  return [best, bestCost];
}

function liftedAngle(a, cut) {
  return a < cut ? a + 1 : a;
}

function drawCircle() {
  const n = val("circleN");
  const power = val("circleP");
  const seed = val("circleSeed");
  const mode = val("circleMode");
  const manual = Math.round(val("circleShift")) % n;
  const random = rng(seed);
  const source = sampleAngles(n, random, 0.2);
  const target = sampleAngles(n, random, 1.9);
  const [optimal, bestCost] = bestCircleShift(source, target, power);
  const shift = mode === "optimal" ? optimal : manual;
  const cut = (source[0] + 0.985) % 1;
  const { ctx, w, h } = resizeCanvas(354);
  const leftW = Math.min(0.42 * w, 310);
  const cx = 24 + leftW / 2;
  const cy = 42 + Math.min(leftW, h - 68) / 2;
  const radius = Math.min(leftW, h - 76) * 0.38;

  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(12, 24, leftW + 24, h - 44);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(12, 24, leftW + 24, h - 44);
  ctx.strokeStyle = "#2f3b45";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.stroke();

  const point = (angle, r) => {
    const th = 2 * Math.PI * angle - Math.PI / 2;
    return [cx + r * Math.cos(th), cy + r * Math.sin(th)];
  };
  for (let k = 0; k < n; k += 1) {
    const [x0, y0] = point(source[k], radius);
    const [x1, y1] = point(target[(k + shift) % n], radius * 0.76);
    ctx.strokeStyle = "rgba(123,50,148,.34)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  const [gx, gy] = point(cut, radius);
  ctx.strokeStyle = "#1b9e77";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(gx, gy);
  ctx.stroke();
  for (const a of source) {
    const [x, y] = point(a, radius);
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(x, y, 3.6, 0, 2 * Math.PI);
    ctx.fill();
  }
  for (const a of target) {
    const [x, y] = point(a, radius * 0.76);
    ctx.fillStyle = BLUE;
    ctx.beginPath();
    ctx.arc(x, y, 3.6, 0, 2 * Math.PI);
    ctx.fill();
  }

  const rx = leftW + 58;
  const rw = w - rx - 22;
  const top = 68;
  const redY = top + 74;
  const blueY = top + 176;
  const X = (a) => rx + ((a - cut) / 1) * rw;
  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(rx - 12, 24, rw + 24, h - 44);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(rx - 12, 24, rw + 24, h - 44);
  ctx.strokeStyle = "#e5e9ef";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(rx, redY);
  ctx.lineTo(rx + rw, redY);
  ctx.moveTo(rx, blueY);
  ctx.lineTo(rx + rw, blueY);
  ctx.stroke();
  ctx.strokeStyle = "#1b9e77";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(rx, top + 38);
  ctx.lineTo(rx, blueY + 42);
  ctx.moveTo(rx + rw, top + 38);
  ctx.lineTo(rx + rw, blueY + 42);
  ctx.stroke();
  for (let k = 0; k < n; k += 1) {
    const sx = liftedAngle(source[k], cut);
    const ty = liftedAngle(target[(k + shift) % n], cut);
    ctx.strokeStyle = "rgba(123,50,148,.38)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(X(sx), redY);
    ctx.lineTo(X(ty), blueY);
    ctx.stroke();
  }
  for (const a of source) {
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(X(liftedAngle(a, cut)), redY, 3.4, 0, 2 * Math.PI);
    ctx.fill();
  }
  for (const a of target) {
    ctx.fillStyle = BLUE;
    ctx.beginPath();
    ctx.arc(X(liftedAngle(a, cut)), blueY, 3.4, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = "#26333f";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("circular problem", cx, 42);
  ctx.fillText("unfolded interval", rx + rw / 2, 42);
  ctx.textAlign = "left";
  setStatus(`displayed shift ${shift}; optimal shift ${optimal}; cost ${bestCost.toFixed(4)}`);
}

function limits(points) {
  let xmin = Infinity;
  let xmax = -Infinity;
  let ymin = Infinity;
  let ymax = -Infinity;
  for (const p of points) {
    xmin = Math.min(xmin, p[0]);
    xmax = Math.max(xmax, p[0]);
    ymin = Math.min(ymin, p[1]);
    ymax = Math.max(ymax, p[1]);
  }
  const dx = Math.max(xmax - xmin, 1e-6);
  const dy = Math.max(ymax - ymin, 1e-6);
  return { xmin: xmin - 0.16 * dx, xmax: xmax + 0.16 * dx, ymin: ymin - 0.16 * dy, ymax: ymax + 0.16 * dy };
}

function costMatrix(x, y, p) {
  return x.map((xi) => y.map((yj) => Math.hypot(xi[0] - yj[0], xi[1] - yj[1]) ** p));
}

function hungarian(cost) {
  const n = cost.length;
  const m = cost[0].length;
  const u = Array(n + 1).fill(0);
  const v = Array(m + 1).fill(0);
  const p = Array(m + 1).fill(0);
  const way = Array(m + 1).fill(0);
  for (let i = 1; i <= n; i += 1) {
    p[0] = i;
    let j0 = 0;
    const minv = Array(m + 1).fill(Infinity);
    const used = Array(m + 1).fill(false);
    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = 0;
      for (let j = 1; j <= m; j += 1) {
        if (!used[j]) {
          const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }
          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
      }
      for (let j = 0; j <= m; j += 1) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0 !== 0);
  }
  const ans = Array(n).fill(-1);
  for (let j = 1; j <= m; j += 1) {
    if (p[j] > 0) ans[p[j] - 1] = j - 1;
  }
  return ans;
}

function targetWeights(y, mode, strength) {
  let weights = [];
  if (mode === "uniform") {
    weights = y.map(() => 1);
  } else if (mode === "angular") {
    weights = y.map((point) => 0.18 + (0.5 + 0.5 * Math.cos(Math.atan2(point[1], point[0]) - 0.65)) ** (1 + 2 * strength));
  } else {
    const xs = y.map((point) => point[0]);
    const mn = Math.min(...xs);
    const mx = Math.max(...xs);
    weights = y.map((point) => 0.15 + Math.exp(strength * (2 * (point[0] - mn) / Math.max(mx - mn, 1e-9) - 1)));
  }
  const total = weights.reduce((a, b) => a + b, 0);
  return weights.map((z) => z / total);
}

function medianPositive(mat) {
  const vals = [];
  for (const row of mat) {
    for (const z of row) {
      if (z > 1e-12) vals.push(z);
    }
  }
  vals.sort((a, b) => a - b);
  return vals[Math.floor(vals.length / 2)] || 1;
}

function greedyPlan(cost, a, b) {
  const n = cost.length;
  const m = cost[0].length;
  const supply = a.slice();
  const demand = b.slice();
  const plan = Array.from({ length: n }, () => Array(m).fill(0));
  const pairs = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < m; j += 1) pairs.push([cost[i][j], i, j]);
  }
  pairs.sort((x, y) => x[0] - y[0]);
  for (const [, i, j] of pairs) {
    const mass = Math.min(supply[i], demand[j]);
    if (mass > 1e-12) {
      plan[i][j] = mass;
      supply[i] -= mass;
      demand[j] -= mass;
    }
  }
  return plan;
}

function sinkhornPlan(cost, a, b, eps) {
  const n = cost.length;
  const m = cost[0].length;
  const scale = medianPositive(cost);
  const K = cost.map((row) => row.map((c) => Math.exp(-c / Math.max(scale * eps, 1e-8))));
  const u = Array(n).fill(1);
  const v = Array(m).fill(1);
  for (let it = 0; it < 90; it += 1) {
    for (let i = 0; i < n; i += 1) {
      let s = 0;
      for (let j = 0; j < m; j += 1) s += K[i][j] * v[j];
      u[i] = a[i] / Math.max(s, 1e-300);
    }
    for (let j = 0; j < m; j += 1) {
      let s = 0;
      for (let i = 0; i < n; i += 1) s += K[i][j] * u[i];
      v[j] = b[j] / Math.max(s, 1e-300);
    }
  }
  return K.map((row, i) => row.map((k, j) => u[i] * k * v[j]));
}

function edgesFromPlan(plan, maxEdges = 220) {
  const out = [];
  for (let i = 0; i < plan.length; i += 1) {
    for (let j = 0; j < plan[i].length; j += 1) {
      if (plan[i][j] > 1e-10) out.push([i, j, plan[i][j]]);
    }
  }
  out.sort((a, b) => b[2] - a[2]);
  return out.slice(0, maxEdges);
}

function drawTransport(ctx, x, y, edges, weights, title, box, lim) {
  const X = (p) => box.x + ((p[0] - lim.xmin) / (lim.xmax - lim.xmin)) * box.w;
  const Y = (p) => box.y + box.h - ((p[1] - lim.ymin) / (lim.ymax - lim.ymin)) * box.h;
  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  const maxMass = Math.max(...edges.map((edge) => edge[2]), 1e-12);
  for (const [i, j, mass] of edges) {
    const s = Math.sqrt(mass / maxMass);
    ctx.strokeStyle = `rgba(123,50,148,${0.12 + 0.58 * s})`;
    ctx.lineWidth = 0.25 + 1.55 * s;
    ctx.beginPath();
    ctx.moveTo(X(x[i]), Y(x[i]));
    ctx.lineTo(X(y[j]), Y(y[j]));
    ctx.stroke();
  }
  for (const point of x) {
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(X(point), Y(point), 3.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  for (let j = 0; j < y.length; j += 1) {
    const radius = 3.4 + 3 * Math.sqrt((weights?.[j] || 1 / y.length) * y.length);
    ctx.fillStyle = BLUE;
    ctx.beginPath();
    ctx.arc(X(y[j]), Y(y[j]), radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  ctx.fillStyle = "#26333f";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, box.x + box.w / 2, box.y - 8);
  ctx.textAlign = "left";
}

function drawCostSweep() {
  setStatus("computing assignments...");
  const n = val("n2");
  const source = val("source2");
  const target = val("target2");
  const seed = val("seed2");
  const powers = [val("p1"), val("p2"), val("p3")];
  const random = rng(seed);
  const x = sampleCloud(source, n, random);
  const y = sampleCloud(target, n, random);
  const lim = limits(x.concat(y));
  const { ctx, w, h } = resizeCanvas(372);
  const gap = 18;
  const top = 36;
  const bottom = 18;
  const bw = (w - 34 - 2 * gap) / 3;
  const bh = h - top - bottom;
  for (let k = 0; k < powers.length; k += 1) {
    const cost = costMatrix(x, y, powers[k]);
    const assign = hungarian(cost);
    const edges = assign.map((j, i) => [i, j, 1]);
    drawTransport(ctx, x, y, edges, null, `p = ${powers[k].toFixed(1)}`, { x: 12 + k * (bw + gap), y: top, w: bw, h: bh }, lim);
  }
  setStatus(`${n} by ${n} exact assignments`);
}

function drawRegularization() {
  setStatus("computing plans...");
  const ns = val("ns");
  const nt = val("nt");
  const seed = val("seedr");
  const mode = val("wmode");
  const strength = val("strength");
  const eps = [0, val("eps1"), val("eps2")];
  const random = rng(seed);
  const x = sampleCloud("disk", ns, random);
  const y = sampleCloud("annulus", nt, random);
  const b = targetWeights(y, mode, strength);
  const a = Array(ns).fill(1 / ns);
  const cost = costMatrix(x, y, 2);
  const lim = limits(x.concat(y));
  const { ctx, w, h } = resizeCanvas(372);
  const gap = 18;
  const top = 36;
  const bottom = 18;
  const bw = (w - 34 - 2 * gap) / 3;
  const bh = h - top - bottom;
  for (let k = 0; k < eps.length; k += 1) {
    const plan = eps[k] <= 0 ? greedyPlan(cost, a, b) : sinkhornPlan(cost, a, b, eps[k]);
    const title = eps[k] <= 0 ? "sparse plan" : `eps = ${eps[k].toFixed(3)}`;
    drawTransport(ctx, x, y, edgesFromPlan(plan, 260), b, title, { x: 12 + k * (bw + gap), y: top, w: bw, h: bh }, lim);
  }
  setStatus(`${ns} sources, ${nt} weighted targets`);
}

function multiplicities(n, maxMultiplicity, total, random) {
  const out = Array(n).fill(1);
  let extras = total - n;
  let guard = 0;
  while (extras > 0 && guard < 10000) {
    const i = Math.floor(random() * n);
    if (out[i] < maxMultiplicity) {
      out[i] += 1;
      extras -= 1;
    }
    guard += 1;
  }
  return out;
}

function expandedIndices(mult) {
  const out = [];
  for (let i = 0; i < mult.length; i += 1) {
    for (let k = 0; k < mult[i]; k += 1) out.push(i);
  }
  return out;
}

function collapsedDuplicatedAssignment(x, y, kmult, lmult) {
  const rows = expandedIndices(kmult);
  const cols = expandedIndices(lmult);
  const cost = rows.map((i) => cols.map((j) => Math.hypot(x[i][0] - y[j][0], x[i][1] - y[j][1]) ** 2));
  const assign = hungarian(cost);
  const counts = Array.from({ length: x.length }, () => Array(y.length).fill(0));
  for (let r = 0; r < assign.length; r += 1) {
    counts[rows[r]][cols[assign[r]]] += 1;
  }
  const total = rows.length;
  return counts.map((row) => row.map((z) => z / total));
}

function drawDuplicatedTransport(ctx, x, y, plan, sourceWeights, targetWeights, title, box, lim) {
  const X = (p) => box.x + ((p[0] - lim.xmin) / (lim.xmax - lim.xmin)) * box.w;
  const Y = (p) => box.y + box.h - ((p[1] - lim.ymin) / (lim.ymax - lim.ymin)) * box.h;
  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  const edges = edgesFromPlan(plan, 260);
  const maxMass = Math.max(...edges.map((edge) => edge[2]), 1e-12);
  for (const [i, j, mass] of edges) {
    const s = Math.sqrt(mass / maxMass);
    ctx.strokeStyle = `rgba(123,50,148,${0.14 + 0.58 * s})`;
    ctx.lineWidth = 0.35 + 1.65 * s;
    ctx.beginPath();
    ctx.moveTo(X(x[i]), Y(x[i]));
    ctx.lineTo(X(y[j]), Y(y[j]));
    ctx.stroke();
  }
  const sourceScale = sourceWeights.length * Math.max(...sourceWeights);
  const targetScale = targetWeights.length * Math.max(...targetWeights);
  for (let i = 0; i < x.length; i += 1) {
    const radius = 3.1 + 3.2 * Math.sqrt((sourceWeights[i] * x.length) / Math.max(sourceScale, 1e-9));
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(X(x[i]), Y(x[i]), radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  for (let j = 0; j < y.length; j += 1) {
    const radius = 3.1 + 3.2 * Math.sqrt((targetWeights[j] * y.length) / Math.max(targetScale, 1e-9));
    ctx.fillStyle = BLUE;
    ctx.beginPath();
    ctx.arc(X(y[j]), Y(y[j]), radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  ctx.fillStyle = "#26333f";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, box.x + box.w / 2, box.y - 8);
  ctx.textAlign = "left";
}

function drawDuplication() {
  setStatus("solving duplicated assignment...");
  const n = val("dupN");
  const maxMultiplicity = val("dupMax");
  const seed = val("dupSeed");
  const random = rng(seed);
  const x = sampleCloud("disk", n, random);
  const y = sampleCloud("annulus", n, random);
  const total = n + Math.round((maxMultiplicity - 1) * 0.55 * n);
  const kmult = multiplicities(n, maxMultiplicity, total, random);
  const lmult = multiplicities(n, maxMultiplicity, total, random);
  const plan = collapsedDuplicatedAssignment(x, y, kmult, lmult);
  const lim = limits(x.concat(y));
  const { ctx, w, h } = resizeCanvas(372);
  const sourceWeights = kmult.map((z) => z / total);
  const targetWeights = lmult.map((z) => z / total);
  drawDuplicatedTransport(
    ctx,
    x,
    y,
    plan,
    sourceWeights,
    targetWeights,
    `multiplicities in {1,...,${maxMultiplicity}}`,
    { x: 18, y: 42, w: w - 36, h: h - 66 },
    lim,
  );
  setStatus(`${total} duplicated particles collapsed onto ${n} source and ${n} target sites`);
}

function hungarianSnapshots(cost) {
  const n = cost.length;
  const m = cost[0].length;
  const u = Array(n + 1).fill(0);
  const v = Array(m + 1).fill(0);
  const p = Array(m + 1).fill(0);
  const way = Array(m + 1).fill(0);
  const snapshots = [Array(n).fill(-1)];
  for (let i = 1; i <= n; i += 1) {
    p[0] = i;
    let j0 = 0;
    const minv = Array(m + 1).fill(Infinity);
    const used = Array(m + 1).fill(false);
    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = 0;
      for (let j = 1; j <= m; j += 1) {
        if (!used[j]) {
          const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }
          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
      }
      for (let j = 0; j <= m; j += 1) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0 !== 0);
    const assign = Array(n).fill(-1);
    for (let j = 1; j <= m; j += 1) {
      if (p[j] > 0) assign[p[j] - 1] = j - 1;
    }
    snapshots.push(assign);
  }
  return snapshots;
}

function drawAssignmentMatrix(ctx, assignment, title, box) {
  const n = assignment.length;
  const cell = Math.min(box.w, box.h) / n;
  const ox = box.x + (box.w - n * cell) / 2;
  const oy = box.y + (box.h - n * cell) / 2;
  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      const value = assignment[i] < 0 ? 1 / n : assignment[i] === j ? 1 : 0;
      const gray = Math.round(255 * (1 - value));
      ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
      ctx.fillRect(ox + j * cell, oy + i * cell, Math.ceil(cell), Math.ceil(cell));
    }
  }
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 0.35;
  for (let k = 0; k <= n; k += 1) {
    ctx.beginPath();
    ctx.moveTo(ox, oy + k * cell);
    ctx.lineTo(ox + n * cell, oy + k * cell);
    ctx.moveTo(ox + k * cell, oy);
    ctx.lineTo(ox + k * cell, oy + n * cell);
    ctx.stroke();
  }
  ctx.fillStyle = "#26333f";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, box.x + box.w / 2, box.y - 7);
  ctx.textAlign = "left";
}

function drawHungarian() {
  const n = val("hungarianN");
  const spread = val("hungarianSpread");
  const seed = val("hungarianSeed");
  const random = rng(seed);
  const x = Array.from({ length: n }, (_, i) => (i + 0.5) / n);
  const y = Array.from({ length: n }, (_, i) => clamp((i + 0.5) / n + spread * 0.02 * randn(random), 0, 1));
  y.sort((a, b) => a - b);
  const cost = x.map((xi) => y.map((yj) => (xi - yj) ** 2));
  const snapshots = hungarianSnapshots(cost);
  const ids = [0, Math.ceil(n / 4), Math.ceil(n / 2), Math.ceil((3 * n) / 4), n];
  const { ctx, w, h } = resizeCanvas(310);
  const gap = 10;
  const boxW = (w - 24 - 4 * gap) / 5;
  const boxH = h - 50;
  for (let k = 0; k < ids.length; k += 1) {
    const step = ids[k];
    const title = step === 0 ? "initial" : step === n ? "final" : `${step} aug.`;
    drawAssignmentMatrix(ctx, snapshots[step], title, { x: 12 + k * (boxW + gap), y: 40, w: boxW, h: boxH });
  }
  setStatus(`${n} augmentations; flat rows are still unmatched`);
}

function colorCss(color, alpha = 1) {
  return `rgba(${Math.round(clamp(color[0], 0, 255))},${Math.round(clamp(color[1], 0, 255))},${Math.round(clamp(color[2], 0, 255))},${alpha})`;
}

function mixRgbArray(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function luminance(color) {
  return 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
}

function paletteColor(mode, u, v, contrast) {
  const wave = Math.sin(7 * u + 3 * v) * Math.sin(5 * v);
  if (mode === "beach") {
    const water = v < 0.55 ? 1 : clamp(1 - 3.2 * (v - 0.55), 0, 1);
    const sand = 1 - water;
    return [
      70 + contrast * (35 * sand + 15 * u + 7 * wave),
      120 + contrast * (55 * sand + 52 * water - 8 * v),
      145 + contrast * (80 * water - 35 * sand + 4 * wave),
    ];
  }
  if (mode === "forest") {
    const leaf = 0.5 + 0.5 * Math.sin(11 * u + 4 * v);
    return [
      38 + contrast * (34 * v + 32 * leaf),
      84 + contrast * (96 * (1 - 0.45 * v) + 25 * wave),
      52 + contrast * (34 * u + 20 * leaf),
    ];
  }
  if (mode === "orchid") {
    const petal = Math.exp(-9 * ((u - 0.52) ** 2 + (v - 0.48) ** 2));
    return [
      90 + contrast * (110 * petal + 54 * u),
      52 + contrast * (32 * (1 - v) + 18 * wave),
      112 + contrast * (92 * petal + 32 * v),
    ];
  }
  const petal = Math.exp(-11 * ((u - 0.48) ** 2 + (v - 0.42) ** 2));
  const leaf = Math.exp(-18 * ((u - 0.72) ** 2 + (v - 0.72) ** 2));
  return [
    100 + contrast * (112 * petal + 20 * wave),
    58 + contrast * (44 * leaf + 20 * v),
    68 + contrast * (78 * petal + 16 * u),
  ];
}

function makePaletteImage(size, mode, contrast) {
  const colors = [];
  for (let iy = 0; iy < size; iy += 1) {
    const v = iy / Math.max(size - 1, 1);
    for (let ix = 0; ix < size; ix += 1) {
      const u = ix / Math.max(size - 1, 1);
      colors.push(paletteColor(mode, u, v, contrast));
    }
  }
  return colors;
}

function transportedPalette(source, target, t) {
  const orderSource = source
    .map((color, index) => ({ index, key: luminance(color) + 0.012 * color[2] }))
    .sort((a, b) => a.key - b.key || a.index - b.index);
  const orderTarget = target
    .map((color, index) => ({ color, key: luminance(color) + 0.012 * color[2], index }))
    .sort((a, b) => a.key - b.key || a.index - b.index);
  const mapped = Array(source.length);
  for (let k = 0; k < orderSource.length; k += 1) mapped[orderSource[k].index] = orderTarget[k].color;
  return source.map((color, index) => mixRgbArray(color, mapped[index], t));
}

function drawColorImage(ctx, colors, size, x, y, width, title) {
  const tmp = document.createElement("canvas");
  tmp.width = size;
  tmp.height = size;
  const ictx = tmp.getContext("2d");
  const data = ictx.createImageData(size, size);
  for (let i = 0; i < colors.length; i += 1) {
    data.data[4 * i] = clamp(colors[i][0], 0, 255);
    data.data[4 * i + 1] = clamp(colors[i][1], 0, 255);
    data.data[4 * i + 2] = clamp(colors[i][2], 0, 255);
    data.data[4 * i + 3] = 255;
  }
  ictx.putImageData(data, 0, 0);
  const previousSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = true;
  if ("imageSmoothingQuality" in ctx) ctx.imageSmoothingQuality = "high";
  ctx.drawImage(tmp, x, y, width, width);
  ctx.imageSmoothingEnabled = previousSmoothing;
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(x, y, width, width);
  ctx.fillStyle = "#26333f";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, x + width / 2, y - 9);
  ctx.textAlign = "left";
}

function drawRgbCloud(ctx, colors, box, title) {
  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#edf0f5";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(box.x + 0.18 * box.w, box.y + 0.82 * box.h);
  ctx.lineTo(box.x + 0.84 * box.w, box.y + 0.82 * box.h);
  ctx.moveTo(box.x + 0.18 * box.w, box.y + 0.82 * box.h);
  ctx.lineTo(box.x + 0.18 * box.w, box.y + 0.18 * box.h);
  ctx.moveTo(box.x + 0.18 * box.w, box.y + 0.82 * box.h);
  ctx.lineTo(box.x + 0.52 * box.w, box.y + 0.52 * box.h);
  ctx.stroke();
  const stride = Math.max(1, Math.floor(colors.length / 420));
  for (let i = 0; i < colors.length; i += stride) {
    const c = colors[i];
    const r = c[0] / 255;
    const g = c[1] / 255;
    const b = c[2] / 255;
    const px = box.x + (0.50 + 0.38 * (r - g) + 0.13 * b) * box.w;
    const py = box.y + (0.84 - 0.52 * b - 0.18 * r - 0.08 * g) * box.h;
    ctx.fillStyle = colorCss(c, 0.72);
    ctx.beginPath();
    ctx.arc(px, py, 2.2, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = "#26333f";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, box.x + box.w / 2, box.y - 9);
  ctx.textAlign = "left";
}

function drawMongeColor() {
  const t = val("colorT");
  const requestedSize = val("colorSize");
  const targetMode = val("colorTarget");
  const contrast = val("colorContrast");
  const { ctx, w, h } = resizeCanvas(360);
  const pad = 18;
  const gap = 18;
  const imageW = Math.min((w - 2 * pad - 2 * gap) / 3, h * 0.44);
  const size = Math.round(clamp(Math.max(requestedSize, Math.ceil(imageW)), 96, 260));
  const beach = imageAsset("assets/beach.jpg");
  const flower = imageAsset("assets/flower.jpg");
  const source = rgbImageFromAsset(beach, size) || makePaletteImage(size, "beach", contrast);
  const target =
    targetMode === "flower" ? rgbImageFromAsset(flower, size) || makePaletteImage(size, "flower", contrast) : makePaletteImage(size, targetMode, contrast);
  const transported = transportedPalette(source, target, t);
  const topY = 38;
  const startX = (w - 3 * imageW - 2 * gap) / 2;
  drawColorImage(ctx, source, size, startX, topY, imageW, "source");
  drawColorImage(ctx, transported, size, startX + imageW + gap, topY, imageW, `t = ${t.toFixed(2)}`);
  drawColorImage(ctx, target, size, startX + 2 * (imageW + gap), topY, imageW, "target");
  const cloudY = topY + imageW + 48;
  const cloudH = h - cloudY - 18;
  const cloudW = (w - 2 * pad - 2 * gap) / 3;
  drawRgbCloud(ctx, source, { x: pad, y: cloudY, w: cloudW, h: cloudH }, "source RGB");
  drawRgbCloud(ctx, transported, { x: pad + cloudW + gap, y: cloudY, w: cloudW, h: cloudH }, "transported");
  drawRgbCloud(ctx, target, { x: pad + 2 * (cloudW + gap), y: cloudY, w: cloudW, h: cloudH }, "target RGB");
  const sourceLabel = beach.state === "ready" && (targetMode !== "flower" || flower.state === "ready") ? "photograph colors" : "palette fallback";
  setStatus(`ranked RGB map with ${size * size} colors; ${sourceLabel}; target ${pretty(targetMode)}`);
}

function sampleHeart(n, random) {
  const pts = [];
  for (let i = 0; i < n; i += 1) {
    const th = 2 * Math.PI * ((i + 0.5) / n + 0.035 * (random() - 0.5));
    const rad = Math.sqrt(random());
    const bx = (16 * Math.sin(th) ** 3) / 17;
    const by = (13 * Math.cos(th) - 5 * Math.cos(2 * th) - 2 * Math.cos(3 * th) - Math.cos(4 * th)) / 17;
    pts.push([0.78 * rad * bx, -0.08 + 0.78 * rad * (by - 0.16)]);
  }
  return pts;
}

function drawScatterPanel(ctx, points, box, lim, color, title, radius = 3.2) {
  const X = (p) => box.x + ((p[0] - lim.xmin) / (lim.xmax - lim.xmin)) * box.w;
  const Y = (p) => box.y + box.h - ((p[1] - lim.ymin) / (lim.ymax - lim.ymin)) * box.h;
  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  for (let i = 0; i < points.length; i += 1) {
    const fill = typeof color === "function" ? color(i) : color;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(X(points[i]), Y(points[i]), radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = "#26333f";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, box.x + box.w / 2, box.y - 8);
  ctx.textAlign = "left";
}

function drawPairedMapPanel(ctx, source, target, assignment, box, lim, title, alpha = 0.32) {
  const X = (p) => box.x + ((p[0] - lim.xmin) / (lim.xmax - lim.xmin)) * box.w;
  const Y = (p) => box.y + box.h - ((p[1] - lim.ymin) / (lim.ymax - lim.ymin)) * box.h;
  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  for (let i = 0; i < source.length; i += 1) {
    const j = assignment[i];
    ctx.strokeStyle = `rgba(123,50,148,${alpha})`;
    ctx.lineWidth = 0.55;
    ctx.beginPath();
    ctx.moveTo(X(source[i]), Y(source[i]));
    ctx.lineTo(X(target[j]), Y(target[j]));
    ctx.stroke();
  }
  for (const p of source) {
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 2.7, 0, 2 * Math.PI);
    ctx.fill();
  }
  for (const p of target) {
    ctx.fillStyle = BLUE;
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 2.7, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = "#26333f";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, box.x + box.w / 2, box.y - 8);
  ctx.textAlign = "left";
}

function exactShapeTransport(n, sourceName, seed) {
  const random = rng(seed);
  const source = sampleCloud(sourceName, n, random);
  const target = sampleHeart(n, random);
  const assignment = hungarian(costMatrix(source, target, 2));
  return { source, target, assignment };
}

function interpolateAssigned(source, target, assignment, t) {
  return source.map((p, i) => {
    const q = target[assignment[i]];
    return [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
  });
}

function drawMongeShape() {
  setStatus("solving a small quadratic assignment...");
  const n = val("shapeN");
  const sourceName = val("shapeSource");
  const seed = val("shapeSeed");
  const t = val("shapeT");
  const { source, target, assignment } = exactShapeTransport(n, sourceName, seed);
  const current = interpolateAssigned(source, target, assignment, t);
  const lim = limits(source.concat(target, current));
  const { ctx, w, h } = resizeCanvas(370);
  const pad = 18;
  const gap = 18;
  const bw = (w - 2 * pad - 2 * gap) / 3;
  const box = (k) => ({ x: pad + k * (bw + gap), y: 44, w: bw, h: h - 70 });
  drawPairedMapPanel(ctx, source, target, assignment, box(0), lim, "Monge map");
  drawScatterPanel(ctx, current, box(1), lim, (i) => mixColor(t, RED, BLUE, 0.86), `particles, t = ${t.toFixed(2)}`, 3.4);
  drawScatterPanel(ctx, source, box(2), lim, RED, "source", 2.5);
  const right = box(2);
  const X = (p) => right.x + ((p[0] - lim.xmin) / (lim.xmax - lim.xmin)) * right.w;
  const Y = (p) => right.y + right.h - ((p[1] - lim.ymin) / (lim.ymax - lim.ymin)) * right.h;
  for (const p of target) {
    ctx.fillStyle = BLUE;
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 2.5, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = BLUE;
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("target overlay", right.x + right.w / 2, right.y + 16);
  ctx.textAlign = "left";
  setStatus(`${n} transported particles; exact assignment used as a small Monge map`);
}

function triangularPairing(source, target) {
  const sOrder = source.map((p, i) => i).sort((i, j) => source[i][0] - source[j][0] || source[i][1] - source[j][1]);
  const tOrder = target.map((p, i) => i).sort((i, j) => target[i][0] - target[j][0] || target[i][1] - target[j][1]);
  const assigned = Array(source.length);
  const pivot = Array(source.length);
  for (let r = 0; r < source.length; r += 1) {
    const i = sOrder[r];
    const j = tOrder[r];
    assigned[i] = target[j];
    pivot[i] = [target[j][0], source[i][1]];
  }
  return { assigned, pivot };
}

function triangularPosition(source, assigned, pivot, progress) {
  const q = progress <= 0.5 ? progress * 2 : (progress - 0.5) * 2;
  return source.map((p, i) => {
    if (progress <= 0.5) return [lerp(p[0], pivot[i][0], q), p[1]];
    return [pivot[i][0], lerp(pivot[i][1], assigned[i][1], q)];
  });
}

function drawMongeTriangular() {
  const n = val("triN");
  const progress = val("triProgress");
  const seed = val("triSeed");
  const sourceName = val("triSource");
  const random = rng(seed);
  const source = sampleCloud(sourceName, n, random);
  const target = sampleHeart(n, random);
  const { assigned, pivot } = triangularPairing(source, target);
  const current = triangularPosition(source, assigned, pivot, progress);
  const lim = limits(source.concat(target, pivot, current));
  const { ctx, w, h } = resizeCanvas(360);
  const pad = 18;
  const gap = 18;
  const bw = (w - 2 * pad - 2 * gap) / 3;
  const box = (k) => ({ x: pad + k * (bw + gap), y: 44, w: bw, h: h - 70 });
  drawScatterPanel(ctx, source, box(0), lim, RED, "source", 3.1);
  drawScatterPanel(ctx, current, box(1), lim, (i) => mixColor(progress, RED, BLUE, 0.88), progress <= 0.5 ? "horizontal stage" : "vertical stage", 3.4);
  drawScatterPanel(ctx, target, box(2), lim, BLUE, "target", 3.1);

  const mid = box(1);
  const X = (p) => mid.x + ((p[0] - lim.xmin) / (lim.xmax - lim.xmin)) * mid.w;
  const Y = (p) => mid.y + mid.h - ((p[1] - lim.ymin) / (lim.ymax - lim.ymin)) * mid.h;
  const stride = Math.max(1, Math.floor(n / 42));
  ctx.lineWidth = 0.45;
  for (let i = 0; i < n; i += stride) {
    ctx.strokeStyle = "rgba(123,50,148,.24)";
    ctx.beginPath();
    ctx.moveTo(X(source[i]), Y(source[i]));
    ctx.lineTo(X(pivot[i]), Y(pivot[i]));
    ctx.lineTo(X(assigned[i]), Y(assigned[i]));
    ctx.stroke();
  }
  setStatus(`${n} particles; coordinate-wise rearrangement progress ${progress.toFixed(2)}`);
}

function cumulative(pdf) {
  const cdf = [];
  let total = 0;
  for (const v of pdf) total += v;
  let running = 0;
  for (const v of pdf) {
    running += v;
    cdf.push(running / Math.max(total, 1e-12));
  }
  return cdf;
}

function drawFrame(ctx, box, title) {
  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  ctx.fillStyle = "#26333f";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, box.x + box.w / 2, box.y - 8);
  ctx.textAlign = "left";
}

function drawCurve(ctx, xs, ys, box, xMin, xMax, yMin, yMax, color, width = 1.4) {
  const X = (x) => box.x + ((x - xMin) / (xMax - xMin)) * box.w;
  const Y = (y) => box.y + box.h - ((y - yMin) / Math.max(yMax - yMin, 1e-12)) * box.h;
  ctx.beginPath();
  for (let i = 0; i < xs.length; i += 1) {
    if (i === 0) ctx.moveTo(X(xs[i]), Y(ys[i]));
    else ctx.lineTo(X(xs[i]), Y(ys[i]));
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function histogramCurve(samples, xMin, xMax, bins) {
  const hist = Array(bins).fill(0);
  for (const x of samples) {
    const k = Math.floor(((x - xMin) / (xMax - xMin)) * bins);
    if (k >= 0 && k < bins) hist[k] += 1;
  }
  const dx = (xMax - xMin) / bins;
  const xs = [];
  const ys = [];
  for (let k = 0; k < bins; k += 1) {
    xs.push(xMin + (k + 0.5) * dx);
    ys.push(hist[k] / Math.max(samples.length * dx, 1e-12));
  }
  return { xs, ys };
}

function drawMongeQuantile() {
  const sourceName = val("mqSource");
  const targetName = val("mqTarget");
  const t = val("mqT");
  const qn = val("mqSamples");
  const xMin = -3.3;
  const xMax = 3.3;
  const xs = Array.from({ length: 760 }, (_, i) => lerp(xMin, xMax, i / 759));
  const spdf = xs.map((x) => mixPdf(sourceName, x));
  const tpdf = xs.map((x) => mixPdf(targetName, x));
  const scdf = cumulative(spdf);
  const tcdf = cumulative(tpdf);
  const qGrid = Array.from({ length: qn }, (_, i) => (i + 0.5) / qn);
  const sq = inverseCdfSamples(xs, spdf, qn);
  const tq = inverseCdfSamples(xs, tpdf, qn);
  const qInterp = sq.map((x, i) => lerp(x, tq[i], t));
  const currentHist = histogramCurve(qInterp, xMin, xMax, 90);
  const yMax = Math.max(...spdf, ...tpdf, ...currentHist.ys) * 1.08;
  const previewWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth : 760);
  const { ctx, w, h } = resizeCanvas(previewWidth < 720 ? 520 : 360);
  const cols = w < 720 ? 2 : 4;
  const rows = Math.ceil(4 / cols);
  const pad = 18;
  const gap = 20;
  const bw = (w - 2 * pad - (cols - 1) * gap) / cols;
  const bh = (h - 48 - (rows - 1) * gap) / rows;
  const box = (k) => ({
    x: pad + (k % cols) * (bw + gap),
    y: 38 + Math.floor(k / cols) * (bh + gap),
    w: bw,
    h: bh,
  });
  drawFrame(ctx, box(0), "densities");
  drawCurve(ctx, xs, spdf, box(0), xMin, xMax, 0, yMax, RED, 1.5);
  drawCurve(ctx, xs, tpdf, box(0), xMin, xMax, 0, yMax, BLUE, 1.5);
  drawFrame(ctx, box(1), "cumulative");
  drawCurve(ctx, xs, scdf, box(1), xMin, xMax, 0, 1, RED, 1.5);
  drawCurve(ctx, xs, tcdf, box(1), xMin, xMax, 0, 1, BLUE, 1.5);
  drawFrame(ctx, box(2), "quantiles");
  drawCurve(ctx, qGrid, sq, box(2), 0, 1, xMin, xMax, RED, 1.4);
  drawCurve(ctx, qGrid, tq, box(2), 0, 1, xMin, xMax, BLUE, 1.4);
  drawCurve(ctx, qGrid, qInterp, box(2), 0, 1, xMin, xMax, mixColor(t, RED, BLUE, 1), 2.2);
  drawFrame(ctx, box(3), `geodesic t = ${t.toFixed(2)}`);
  drawCurve(ctx, currentHist.xs, currentHist.ys, box(3), xMin, xMax, 0, yMax, mixColor(t, RED, BLUE, 1), 2.1);
  drawCurve(ctx, xs, spdf, box(3), xMin, xMax, 0, yMax, "rgba(215,48,39,.32)", 1);
  drawCurve(ctx, xs, tpdf, box(3), xMin, xMax, 0, yMax, "rgba(33,102,172,.32)", 1);
  setStatus(`${qn} quantile levels; Q_t = (1-t) Q_alpha + t Q_beta`);
}

function matMul2(A, B) {
  return [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
  ];
}

function matAdd2(A, B) {
  return [
    [A[0][0] + B[0][0], A[0][1] + B[0][1]],
    [A[1][0] + B[1][0], A[1][1] + B[1][1]],
  ];
}

function matScale2(A, s) {
  return [
    [s * A[0][0], s * A[0][1]],
    [s * A[1][0], s * A[1][1]],
  ];
}

function eigSym2(A) {
  const a = A[0][0];
  const b = A[0][1];
  const d = A[1][1];
  const tr = (a + d) / 2;
  const rad = Math.sqrt(((a - d) / 2) ** 2 + b * b);
  const l1 = Math.max(tr + rad, 1e-10);
  const l2 = Math.max(tr - rad, 1e-10);
  const angle = 0.5 * Math.atan2(2 * b, a - d);
  return { values: [l1, l2], angle };
}

function symFromEig(values, angle, transform) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const l1 = transform(values[0]);
  const l2 = transform(values[1]);
  return [
    [l1 * c * c + l2 * s * s, (l1 - l2) * c * s],
    [(l1 - l2) * c * s, l1 * s * s + l2 * c * c],
  ];
}

function sqrtSym2(A) {
  const eig = eigSym2(A);
  return symFromEig(eig.values, eig.angle, Math.sqrt);
}

function invSqrtSym2(A) {
  const eig = eigSym2(A);
  return symFromEig(eig.values, eig.angle, (x) => 1 / Math.sqrt(x));
}

function covarianceFromAxes(angleDeg, sx, sy) {
  const th = (angleDeg * Math.PI) / 180;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const a = sx * sx;
  const b = sy * sy;
  return [
    [a * c * c + b * s * s, (a - b) * c * s],
    [(a - b) * c * s, a * s * s + b * c * c],
  ];
}

function buresInterpolateCov(S0, S1, t) {
  const S0sqrt = sqrtSym2(S0);
  const S0invsqrt = invSqrtSym2(S0);
  const middle = matMul2(matMul2(S0sqrt, S1), S0sqrt);
  const A = matMul2(matMul2(S0invsqrt, sqrtSym2(middle)), S0invsqrt);
  const B = matAdd2(matScale2([[1, 0], [0, 1]], 1 - t), matScale2(A, t));
  return matMul2(matMul2(B, S0), B);
}

function drawCovEllipse(ctx, mean, cov, box, lim, color, width = 1.7, alpha = 1) {
  const eig = eigSym2(cov);
  const angle = eig.angle;
  const r1 = 2 * Math.sqrt(eig.values[0]);
  const r2 = 2 * Math.sqrt(eig.values[1]);
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const X = (p) => box.x + ((p[0] - lim.xmin) / (lim.xmax - lim.xmin)) * box.w;
  const Y = (p) => box.y + box.h - ((p[1] - lim.ymin) / (lim.ymax - lim.ymin)) * box.h;
  ctx.beginPath();
  for (let k = 0; k <= 120; k += 1) {
    const th = (2 * Math.PI * k) / 120;
    const x = mean[0] + r1 * Math.cos(th) * ca - r2 * Math.sin(th) * sa;
    const y = mean[1] + r1 * Math.cos(th) * sa + r2 * Math.sin(th) * ca;
    if (k === 0) ctx.moveTo(X([x, y]), Y([x, y]));
    else ctx.lineTo(X([x, y]), Y([x, y]));
  }
  ctx.strokeStyle = color.replace("1)", `${alpha})`);
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.fillStyle = color.replace("1)", `${Math.min(alpha, 0.18)})`);
  ctx.fill();
}

function drawGaussian1d(ctx, box, t, shape) {
  drawFrame(ctx, box, "one-dimensional geodesic");
  const xMin = -3.2;
  const xMax = 3.2;
  const xs = Array.from({ length: 520 }, (_, i) => lerp(xMin, xMax, i / 519));
  const m0 = -1.1;
  const m1 = 1.08;
  const s0 = 0.32 + 0.05 * shape;
  const s1 = 0.82 - 0.04 * shape;
  const mt = lerp(m0, m1, t);
  const st = lerp(s0, s1, t);
  const d0 = xs.map((x) => normalPdf(x, m0, s0));
  const d1 = xs.map((x) => normalPdf(x, m1, s1));
  const dt = xs.map((x) => normalPdf(x, mt, st));
  const yMax = Math.max(...d0, ...d1, ...dt) * 1.08;
  drawCurve(ctx, xs, d0, box, xMin, xMax, 0, yMax, "rgba(215,48,39,1)", 1.2);
  drawCurve(ctx, xs, d1, box, xMin, xMax, 0, yMax, "rgba(33,102,172,1)", 1.2);
  drawCurve(ctx, xs, dt, box, xMin, xMax, 0, yMax, mixColor(t, RED, BLUE, 1), 2.2);
}

function drawGaussian2d(ctx, box, mode, t, shape, angle) {
  drawFrame(ctx, box, pretty(mode));
  const anis = shape;
  const mean0 = mode === "rotated_anisotropies" ? [-0.78, -0.18] : [-0.85, -0.08];
  const mean1 = mode === "rotated_anisotropies" ? [0.78, 0.24] : [0.82, 0.14];
  const S0 = covarianceFromAxes(mode === "rotated_anisotropies" ? angle : -28, 0.22 * anis, 0.18);
  const S1 = mode === "rotated_anisotropies" ? covarianceFromAxes(-angle, 0.18 * anis, 0.14) : covarianceFromAxes(0, 0.34, 0.34);
  const St = buresInterpolateCov(S0, S1, t);
  const meant = [lerp(mean0[0], mean1[0], t), lerp(mean0[1], mean1[1], t)];
  const lim = { xmin: -1.85, xmax: 1.85, ymin: -1.35, ymax: 1.35 };
  ctx.strokeStyle = "#edf0f5";
  ctx.lineWidth = 1;
  for (let k = 1; k < 4; k += 1) {
    const x = box.x + (k * box.w) / 4;
    ctx.beginPath();
    ctx.moveTo(x, box.y);
    ctx.lineTo(x, box.y + box.h);
    ctx.stroke();
  }
  drawCovEllipse(ctx, mean0, S0, box, lim, "rgba(215,48,39,1)", 1.3, 0.42);
  drawCovEllipse(ctx, mean1, S1, box, lim, "rgba(33,102,172,1)", 1.3, 0.42);
  drawCovEllipse(ctx, meant, St, box, lim, mixColor(t, RED, BLUE, 1), 2.5, 0.92);
}

function drawMongeGaussian() {
  const mode = val("gaussMode");
  const t = val("gaussT");
  const shape = val("gaussShape");
  const angle = val("gaussAngle");
  const { ctx, w, h } = resizeCanvas(390);
  const pad = 18;
  const gap = 22;
  if (mode === "one_dimensional") {
    drawGaussian1d(ctx, { x: pad, y: 42, w: w - 2 * pad, h: h - 68 }, t, shape);
  } else {
    const bw = (w - 2 * pad - gap) / 2;
    drawGaussian2d(ctx, { x: pad, y: 42, w: bw, h: h - 68 }, mode, t, shape, angle);
    drawGaussian1d(ctx, { x: pad + bw + gap, y: 42, w: bw, h: h - 68 }, t, shape);
  }
  setStatus(`Gaussian geodesic at t = ${t.toFixed(2)}; covariance follows the Bures interpolation`);
}

function normalizeWeights(weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  return weights.map((z) => z / Math.max(total, 1e-12));
}

function mixtureWeights(name, n) {
  const xs = Array.from({ length: n }, (_, i) => lerp(-3.1, 3.1, (i + 0.5) / n));
  return normalizeWeights(xs.map((x) => mixPdf(name, x)));
}

function weightedSweepPlan(a, b) {
  const plan = Array.from({ length: a.length }, () => Array(b.length).fill(0));
  const r = a.slice();
  const s = b.slice();
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    const mass = Math.min(r[i], s[j]);
    plan[i][j] = mass;
    r[i] -= mass;
    s[j] -= mass;
    if (r[i] <= 1e-12) i += 1;
    if (s[j] <= 1e-12) j += 1;
  }
  return plan;
}

function productPlan(a, b) {
  return a.map((ai) => b.map((bj) => ai * bj));
}

function drawCouplingMatrix(ctx, plan, a, b, box, title, barycentric = false) {
  const n = plan.length;
  const m = plan[0].length;
  const strip = Math.min(42, Math.max(24, 0.16 * Math.min(box.w, box.h)));
  const mx = box.x + strip;
  const my = box.y + strip;
  const mw = box.w - strip - 6;
  const mh = box.h - strip - 6;
  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  const maxMass = Math.max(...plan.flat(), 1e-12);
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < m; j += 1) {
      const value = plan[i][j] / maxMass;
      const gray = Math.round(255 - 235 * Math.sqrt(value));
      ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
      ctx.fillRect(mx + (j * mw) / m, my + (i * mh) / n, Math.ceil(mw / m), Math.ceil(mh / n));
    }
  }
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 0.25;
  for (let i = 0; i <= n; i += Math.max(1, Math.ceil(n / 18))) {
    ctx.beginPath();
    ctx.moveTo(mx, my + (i * mh) / n);
    ctx.lineTo(mx + mw, my + (i * mh) / n);
    ctx.stroke();
  }
  for (let j = 0; j <= m; j += Math.max(1, Math.ceil(m / 18))) {
    ctx.beginPath();
    ctx.moveTo(mx + (j * mw) / m, my);
    ctx.lineTo(mx + (j * mw) / m, my + mh);
    ctx.stroke();
  }
  const maxA = Math.max(...a, 1e-12);
  const maxB = Math.max(...b, 1e-12);
  ctx.fillStyle = "rgba(215,48,39,.62)";
  for (let i = 0; i < n; i += 1) {
    const h = (a[i] / maxA) * (mh / n) * 0.86;
    ctx.fillRect(mx - 6 - (a[i] / maxA) * (strip - 12), my + (i * mh) / n, (a[i] / maxA) * (strip - 12), Math.max(1, h));
  }
  ctx.fillStyle = "rgba(33,102,172,.62)";
  for (let j = 0; j < m; j += 1) {
    const h = (b[j] / maxB) * (strip - 12);
    ctx.fillRect(mx + (j * mw) / m, my - 6 - h, Math.max(1, (mw / m) * 0.86), h);
  }
  if (barycentric) {
    ctx.strokeStyle = "#1b9e77";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i < n; i += 1) {
      let mean = 0;
      for (let j = 0; j < m; j += 1) mean += plan[i][j] * (j + 0.5);
      mean /= Math.max(a[i], 1e-12);
      const x = mx + (mean / m) * mw;
      const y = my + ((i + 0.5) / n) * mh;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.fillStyle = "#26333f";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, box.x + box.w / 2, box.y - 8);
  ctx.textAlign = "left";
}

function drawKantoCouplings() {
  const n = val("kcN");
  const mode = val("kcMode");
  const seed = val("kcSeed");
  const sourceShape = val("kcSource");
  const targetShape = val("kcTarget");
  const random = rng(seed);
  const x = sampleCloud(sourceShape, n, random);
  const y = sampleCloud(targetShape, n, random);
  const a = Array(n).fill(1 / n);
  const b = mode === "splitting" ? targetWeights(y, "angular", 1.8) : Array(n).fill(1 / n);
  const cost = costMatrix(x, y, 2);
  let plan;
  let title;
  if (mode === "graph") {
    const assign = hungarian(cost);
    plan = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i += 1) plan[i][assign[i]] = 1 / n;
    title = "deterministic graph";
  } else if (mode === "product") {
    plan = productPlan(a, b);
    title = "product coupling";
  } else if (mode === "entropic") {
    plan = sinkhornPlan(cost, a, b, 0.08);
    title = "entropic plan";
  } else {
    plan = greedyPlan(cost, a, b);
    title = "sparse splitting plan";
  }
  const lim = limits(x.concat(y));
  const { ctx, w, h } = resizeCanvas(370);
  drawTransport(ctx, x, y, edgesFromPlan(plan, 320), b, title, { x: 18, y: 42, w: w - 36, h: h - 68 }, lim);
  setStatus(`${n} sources, ${n} targets; ${edgesFromPlan(plan, 9999).length} positive displayed arcs`);
}

function drawKantoMatrix() {
  const bins = val("kmBins");
  const mode = val("kmMode");
  const source = val("kmSource");
  const target = val("kmTarget");
  const a = mixtureWeights(source, bins);
  const b = mixtureWeights(target, bins);
  const plan = mode === "product" ? productPlan(a, b) : weightedSweepPlan(a, b);
  const { ctx, w, h } = resizeCanvas(390);
  drawCouplingMatrix(ctx, plan, a, b, { x: 22, y: 52, w: w - 44, h: h - 78 }, `${mode} coupling, ${bins} bins`, mode !== "product");
  setStatus(`${mode === "product" ? bins * bins : edgesFromPlan(plan, 9999).length} positive entries`);
}

function drawKantoSplitting() {
  const n = val("ksN");
  const imbalance = val("ksImbalance");
  const seed = val("ksSeed");
  const random = rng(seed);
  const x = sampleCloud("disk", n, random);
  const y = sampleCloud("annulus", n, random);
  const a = Array(n).fill(1 / n);
  const raw = y.map((p) => 0.2 + Math.exp(imbalance * (p[0] + 0.25 * p[1])));
  const b = normalizeWeights(raw);
  const plan = greedyPlan(costMatrix(x, y, 2), a, b);
  const lim = limits(x.concat(y));
  const { ctx, w, h } = resizeCanvas(370);
  const gap = 22;
  const bw = (w - 44 - gap) / 2;
  const assign = hungarian(costMatrix(x, y, 2));
  drawTransport(ctx, x, y, assign.map((j, i) => [i, j, 1 / n]), null, "uniform permutation", { x: 18, y: 44, w: bw, h: h - 70 }, lim);
  drawTransport(ctx, x, y, edgesFromPlan(plan, 260), b, "nonuniform splitting", { x: 18 + bw + gap, y: 44, w: bw, h: h - 70 }, lim);
  setStatus(`target imbalance ${imbalance.toFixed(1)}; sparse plan has ${edgesFromPlan(plan, 9999).length} positive arcs`);
}

function barrierValueAt(x, y, angle, eps) {
  const v0 = [0.5, 0.08];
  const v1 = [0.08, 0.88];
  const v2 = [0.92, 0.88];
  const det = (v1[1] - v2[1]) * (v0[0] - v2[0]) + (v2[0] - v1[0]) * (v0[1] - v2[1]);
  const l0 = ((v1[1] - v2[1]) * (x - v2[0]) + (v2[0] - v1[0]) * (y - v2[1])) / det;
  const l1 = ((v2[1] - v0[1]) * (x - v2[0]) + (v0[0] - v2[0]) * (y - v2[1])) / det;
  const l2 = 1 - l0 - l1;
  if (l0 <= 0 || l1 <= 0 || l2 <= 0) return Infinity;
  const ell = [Math.cos((angle * Math.PI) / 180), Math.sin((angle * Math.PI) / 180)];
  return ell[0] * x + ell[1] * y - eps * (Math.log(l0) + Math.log(l1) + Math.log(l2));
}

function bestBarrierPoint(angle, eps, resolution = 70) {
  let best = [0.5, 0.5];
  let bestValue = Infinity;
  for (let iy = 0; iy <= resolution; iy += 1) {
    for (let ix = 0; ix <= resolution; ix += 1) {
      const x = ix / resolution;
      const y = iy / resolution;
      const z = barrierValueAt(x, y, angle, eps);
      if (z < bestValue) {
        bestValue = z;
        best = [x, y];
      }
    }
  }
  return best;
}

function drawKantoBarrier() {
  const eps = val("kbEps");
  const angle = val("kbAngle");
  const { ctx, w, h } = resizeCanvas(360);
  const box = { x: 28, y: 28, w: w - 56, h: h - 56 };
  const toX = (x) => box.x + x * box.w;
  const toY = (y) => box.y + y * box.h;
  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  const grid = 86;
  let minV = Infinity;
  let maxV = -Infinity;
  const values = [];
  for (let iy = 0; iy < grid; iy += 1) {
    for (let ix = 0; ix < grid; ix += 1) {
      const z = barrierValueAt((ix + 0.5) / grid, (iy + 0.5) / grid, angle, eps);
      values.push(z);
      if (Number.isFinite(z)) {
        minV = Math.min(minV, z);
        maxV = Math.max(maxV, z);
      }
    }
  }
  const cellW = box.w / grid;
  const cellH = box.h / grid;
  for (let iy = 0; iy < grid; iy += 1) {
    for (let ix = 0; ix < grid; ix += 1) {
      const z = values[iy * grid + ix];
      if (!Number.isFinite(z)) continue;
      const u = clamp((z - minV) / Math.max(maxV - minV, 1e-12), 0, 1);
      const gray = Math.round(250 - 120 * (1 - u));
      ctx.fillStyle = `rgb(${gray},${gray + 2},${Math.min(255, gray + 10)})`;
      ctx.fillRect(toX(ix / grid), toY(iy / grid), Math.ceil(cellW), Math.ceil(cellH));
    }
  }
  const verts = [[0.5, 0.08], [0.08, 0.88], [0.92, 0.88]];
  ctx.strokeStyle = "#2f3b45";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(toX(verts[0][0]), toY(verts[0][1]));
  ctx.lineTo(toX(verts[1][0]), toY(verts[1][1]));
  ctx.lineTo(toX(verts[2][0]), toY(verts[2][1]));
  ctx.closePath();
  ctx.stroke();
  const epsPath = [0.6, 0.32, 0.16, 0.08, 0.035, 0.015];
  ctx.strokeStyle = "#7b3294";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  epsPath.forEach((e, k) => {
    const p = bestBarrierPoint(angle, e, 64);
    if (k === 0) ctx.moveTo(toX(p[0]), toY(p[1]));
    else ctx.lineTo(toX(p[0]), toY(p[1]));
  });
  ctx.stroke();
  const point = bestBarrierPoint(angle, eps, 90);
  ctx.fillStyle = "#d73027";
  ctx.beginPath();
  ctx.arc(toX(point[0]), toY(point[1]), 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "#26333f";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText(`epsilon = ${eps.toFixed(3)}`, box.x + 8, box.y + 20);
  setStatus("grid-search view of a logarithmic-barrier central path");
}

function drawPlanInterpolationPanel(ctx, x, y, plan, t, box, lim, threshold) {
  const X = (p) => box.x + ((p[0] - lim.xmin) / (lim.xmax - lim.xmin)) * box.w;
  const Y = (p) => box.y + box.h - ((p[1] - lim.ymin) / (lim.ymax - lim.ymin)) * box.h;
  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  const edges = edgesFromPlan(plan, 380).filter((e) => e[2] >= threshold);
  const maxMass = Math.max(...edges.map((e) => e[2]), 1e-12);
  for (const [i, j, mass] of edges) {
    ctx.strokeStyle = `rgba(92,92,92,${0.12 + 0.30 * Math.sqrt(mass / maxMass)})`;
    ctx.lineWidth = 0.45 + 1.1 * Math.sqrt(mass / maxMass);
    ctx.beginPath();
    ctx.moveTo(X(x[i]), Y(x[i]));
    ctx.lineTo(X(y[j]), Y(y[j]));
    ctx.stroke();
  }
  for (const p of x) {
    ctx.fillStyle = "rgba(215,48,39,.18)";
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 4.2, 0, 2 * Math.PI);
    ctx.fill();
  }
  for (const p of y) {
    ctx.fillStyle = "rgba(33,102,172,.18)";
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 4.2, 0, 2 * Math.PI);
    ctx.fill();
  }
  for (const [i, j, mass] of edges) {
    const p = [lerp(x[i][0], y[j][0], t), lerp(x[i][1], y[j][1], t)];
    ctx.fillStyle = mixColor(t, RED, BLUE, 0.86);
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 3.2 + 7 * Math.sqrt(mass / maxMass), 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }
}

function drawKantoPlan() {
  const ns = val("kpSourceN");
  const nt = val("kpTargetN");
  const t = val("kpT");
  const eps = val("kpEps");
  const seed = val("kpSeed");
  const random = rng(seed);
  const x = sampleCloud("two_blobs", ns, random);
  const y = sampleCloud("three_blobs", nt, random);
  const a = Array(ns).fill(1 / ns);
  const b = targetWeights(y, "right_heavy", 1.2);
  const cost = costMatrix(x, y, 2);
  const plan = eps <= 0.002 ? greedyPlan(cost, a, b) : sinkhornPlan(cost, a, b, eps);
  const lim = limits(x.concat(y));
  const { ctx, w, h } = resizeCanvas(370);
  drawPlanInterpolationPanel(ctx, x, y, plan, t, { x: 18, y: 42, w: w - 36, h: h - 68 }, lim, 1e-4);
  setStatus(`${edgesFromPlan(plan, 9999).length} active pairs; t = ${t.toFixed(2)}, epsilon = ${eps.toFixed(3)}`);
}

function multiplyGlued(P, b, Q) {
  const n = P.length;
  const p = b.length;
  const m = Q[0].length;
  const R = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < p; j += 1) {
      if (b[j] <= 1e-12) continue;
      for (let k = 0; k < m; k += 1) R[i][k] += (P[i][j] * Q[j][k]) / b[j];
    }
  }
  return R;
}

function drawKantoGluing() {
  const n = val("kgBins");
  const mid = val("kgMid");
  const source = mixtureWeights("two", n);
  const middle = mixtureWeights("wide_two", mid);
  const target = mixtureWeights("three", n);
  const P = weightedSweepPlan(source, middle);
  const Q = weightedSweepPlan(middle, target);
  const R = multiplyGlued(P, middle, Q);
  const D = weightedSweepPlan(source, target);
  const { ctx, w, h } = resizeCanvas(420);
  const pad = 16;
  const gap = 18;
  const bw = (w - 2 * pad - gap) / 2;
  const bh = (h - 56 - gap) / 2;
  const boxes = [
    { x: pad, y: 42, w: bw, h: bh },
    { x: pad + bw + gap, y: 42, w: bw, h: bh },
    { x: pad, y: 42 + bh + gap, w: bw, h: bh },
    { x: pad + bw + gap, y: 42 + bh + gap, w: bw, h: bh },
  ];
  drawCouplingMatrix(ctx, P, source, middle, boxes[0], "P: alpha to beta", false);
  drawCouplingMatrix(ctx, Q, middle, target, boxes[1], "Q: beta to gamma", false);
  drawCouplingMatrix(ctx, R, source, target, boxes[2], "glued R", false);
  drawCouplingMatrix(ctx, D, source, target, boxes[3], "direct OT", false);
  setStatus(`glued matrix R = P diag(1/beta) Q with ${mid} intermediate bins`);
}

function gaussianMixtureDensity(components, x) {
  return components.reduce((s, c) => s + c.w * normalPdf(x, c.m, c.s), 0);
}

function drawKantoWow() {
  const t = val("kwT");
  const separation = val("kwSep");
  const mode = val("kwMode");
  const left = [
    { w: 0.36, m: -separation, s: 0.28 },
    { w: 0.34, m: -0.05, s: 0.36 },
    { w: 0.30, m: 1.42, s: 0.24 },
  ];
  const right = [
    { w: 0.30, m: -1.35, s: 0.38 },
    { w: 0.42, m: 0.32, s: 0.25 },
    { w: 0.28, m: separation, s: 0.48 },
  ];
  const componentPairs = mode === "crossed" ? [2, 1, 0] : [0, 1, 2];
  const componentInterp = left.map((c, i) => {
    const d = right[componentPairs[i]];
    return { w: lerp(c.w, d.w, t), m: lerp(c.m, d.m, t), s: lerp(c.s, d.s, t) };
  });
  const xMin = -3.2;
  const xMax = 3.2;
  const xs = Array.from({ length: 760 }, (_, i) => lerp(xMin, xMax, i / 759));
  const leftPdf = xs.map((x) => gaussianMixtureDensity(left, x));
  const rightPdf = xs.map((x) => gaussianMixtureDensity(right, x));
  const compPdf = xs.map((x) => gaussianMixtureDensity(componentInterp, x));
  const sq = inverseCdfSamples(xs, leftPdf, 260);
  const tq = inverseCdfSamples(xs, rightPdf, 260);
  const qt = sq.map((x, i) => lerp(x, tq[i], t));
  const hist = histogramCurve(qt, xMin, xMax, 100);
  const yMax = Math.max(...leftPdf, ...rightPdf, ...compPdf, ...hist.ys) * 1.08;
  const { ctx, w, h } = resizeCanvas(370);
  const gap = 22;
  const bw = (w - 42 - gap) / 2;
  const box0 = { x: 18, y: 46, w: bw, h: h - 72 };
  const box1 = { x: 18 + bw + gap, y: 46, w: bw, h: h - 72 };
  drawFrame(ctx, box0, "component law");
  drawCurve(ctx, xs, leftPdf, box0, xMin, xMax, 0, yMax, "rgba(215,48,39,.32)", 1);
  drawCurve(ctx, xs, rightPdf, box0, xMin, xMax, 0, yMax, "rgba(33,102,172,.32)", 1);
  drawCurve(ctx, xs, compPdf, box0, xMin, xMax, 0, yMax, mixColor(t, RED, BLUE, 1), 2.1);
  drawFrame(ctx, box1, "collapsed W2");
  drawCurve(ctx, xs, leftPdf, box1, xMin, xMax, 0, yMax, "rgba(215,48,39,.32)", 1);
  drawCurve(ctx, xs, rightPdf, box1, xMin, xMax, 0, yMax, "rgba(33,102,172,.32)", 1);
  drawCurve(ctx, hist.xs, hist.ys, box1, xMin, xMax, 0, yMax, mixColor(t, RED, BLUE, 1), 2.1);
  setStatus(`t = ${t.toFixed(2)}; component matching mode: ${pretty(mode)}`);
}

function binomialLaw(n, skew) {
  const p = clamp(0.5 + skew, 0.08, 0.92);
  const mean = 2 * p - 1;
  const variance = 4 * p * (1 - p);
  const xs = [];
  const ps = [];
  let prob = (1 - p) ** n;
  for (let k = 0; k <= n; k += 1) {
    const raw = (2 * k - n - n * mean) / Math.sqrt(Math.max(n * variance, 1e-12));
    xs.push(raw);
    ps.push(prob);
    if (k < n) prob *= ((n - k) / (k + 1)) * (p / (1 - p));
  }
  return { xs, ps: normalizeWeights(ps) };
}

function drawKantoClt() {
  const n = val("kcltN");
  const skew = val("kcltSkew");
  const law = binomialLaw(n, skew);
  const xMin = -4;
  const xMax = 4;
  const xs = Array.from({ length: 720 }, (_, i) => lerp(xMin, xMax, i / 719));
  const gaussian = xs.map((x) => normalPdf(x, 0, 1));
  const yMax = Math.max(...gaussian, ...law.ps.map((p) => p * Math.sqrt(n))) * 1.15;
  const { ctx, w, h } = resizeCanvas(350);
  const box = { x: 34, y: 34, w: w - 58, h: h - 64 };
  drawFrame(ctx, box, "normalized Bernoulli sum");
  const X = (x) => box.x + ((x - xMin) / (xMax - xMin)) * box.w;
  const Y = (y) => box.y + box.h - (y / yMax) * box.h;
  ctx.strokeStyle = "#d8dee8";
  ctx.beginPath();
  ctx.moveTo(box.x, Y(0));
  ctx.lineTo(box.x + box.w, Y(0));
  ctx.stroke();
  drawCurve(ctx, xs, gaussian, box, xMin, xMax, 0, yMax, "#4a5563", 1.8);
  const barW = Math.max(2, Math.min(16, box.w / Math.max(law.xs.length, 1) * 0.58));
  ctx.fillStyle = "rgba(123,50,148,.58)";
  for (let i = 0; i < law.xs.length; i += 1) {
    const height = law.ps[i] * Math.sqrt(n);
    ctx.fillRect(X(law.xs[i]) - barW / 2, Y(height), barW, Y(0) - Y(height));
  }
  setStatus(`n = ${n}; skew = ${skew.toFixed(2)}; bars converge weakly toward the Gaussian curve`);
}

const DUAL_TARGETS = {
  balanced: { weights: [0.5, 0.5], means: [-1.05, 1.08], stds: [0.42, 0.44] },
  shifted: { weights: [0.58, 0.42], means: [0.2, 1.86], stds: [0.34, 0.36] },
  three_mode: { weights: [0.43, 0.34, 0.23], means: [-1.65, 0.1, 1.72], stds: [0.26, 0.36, 0.3] },
};

function mixturePdfSpec(spec, x) {
  let out = 0;
  for (let k = 0; k < spec.weights.length; k += 1) out += spec.weights[k] * normalPdf(x, spec.means[k], spec.stds[k]);
  return out;
}

function normalizedDensity(xs, spec) {
  const density = xs.map((x) => mixturePdfSpec(spec, x));
  const dx = xs.length > 1 ? xs[1] - xs[0] : 1;
  const total = density.reduce((a, b) => a + b, 0) * dx;
  return density.map((z) => z / Math.max(total, 1e-12));
}

function discreteWeightsFromDensity(density) {
  const total = density.reduce((a, b) => a + b, 0);
  return density.map((z) => z / Math.max(total, 1e-12));
}

function inverseFromCdfGrid(xs, cdf, u) {
  const target = clamp(u, 0, 1);
  let j = 1;
  while (j < cdf.length && cdf[j] < target) j += 1;
  if (j >= cdf.length) return xs[xs.length - 1];
  const lo = cdf[j - 1] || 0;
  const hi = cdf[j];
  const t = (target - lo) / Math.max(hi - lo, 1e-12);
  return lerp(xs[j - 1], xs[j], clamp(t, 0, 1));
}

function supportPotentialsFromPlan(x, y, a, b, plan) {
  const n = x.length;
  const m = y.length;
  const f = Array(n).fill(null);
  const g = Array(m).fill(null);
  const edges = edgesFromPlan(plan, 99999).filter((edge) => edge[2] > 1e-12);
  const rowEdges = Array.from({ length: n }, () => []);
  for (const [i, j] of edges) rowEdges[i].push(j);
  function cost(i, j) {
    return (x[i] - y[j]) ** 2;
  }
  for (let start = 0; start < n; start += 1) {
    if (rowEdges[start].length === 0 || f[start] !== null) continue;
    f[start] = 0;
    let changed = true;
    while (changed) {
      changed = false;
      for (const [i, j] of edges) {
        if (f[i] !== null && g[j] === null) {
          g[j] = cost(i, j) - f[i];
          changed = true;
        }
        if (g[j] !== null && f[i] === null) {
          f[i] = cost(i, j) - g[j];
          changed = true;
        }
      }
    }
  }
  for (let i = 0; i < n; i += 1) if (f[i] === null) f[i] = 0;
  for (let j = 0; j < m; j += 1) if (g[j] === null) g[j] = Math.min(...x.map((xi, i) => (xi - y[j]) ** 2 - f[i]));
  const gauge = f.reduce((sum, z, i) => sum + z * a[i], 0);
  for (let i = 0; i < n; i += 1) f[i] -= gauge;
  for (let j = 0; j < m; j += 1) g[j] += gauge;
  return { f, g, edges };
}

function drawDensityStrips(ctx, box, xs, aDensity, bDensity, title) {
  drawFrame(ctx, box, title);
  const yMid = box.y + box.h / 2;
  const maxDensity = Math.max(...aDensity, ...bDensity, 1e-12);
  const X = (x) => box.x + ((x - xs[0]) / (xs[xs.length - 1] - xs[0])) * box.w;
  const H = (z) => (z / maxDensity) * (box.h * 0.38);
  ctx.strokeStyle = "#e5e9ef";
  ctx.beginPath();
  ctx.moveTo(box.x + 8, yMid);
  ctx.lineTo(box.x + box.w - 8, yMid);
  ctx.stroke();
  const dx = xs.length > 1 ? X(xs[1]) - X(xs[0]) : box.w;
  for (let i = 0; i < xs.length; i += 1) {
    const px = X(xs[i]) - dx * 0.46;
    ctx.fillStyle = "rgba(215,48,39,.32)";
    ctx.fillRect(px, yMid - H(aDensity[i]), Math.max(1, dx * 0.9), H(aDensity[i]));
    ctx.fillStyle = "rgba(33,102,172,.32)";
    ctx.fillRect(px, yMid, Math.max(1, dx * 0.9), H(bDensity[i]));
  }
  ctx.fillStyle = RED;
  ctx.font = "12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("alpha", box.x + 8, yMid - box.h * 0.34);
  ctx.fillStyle = BLUE;
  ctx.fillText("beta", box.x + 8, yMid + box.h * 0.38);
}

function drawDualDiscrete() {
  const bins = Math.round(val("ddBins"));
  const source = val("ddSource");
  const target = val("ddTarget");
  const xs = Array.from({ length: bins }, (_, i) => lerp(-3, 3, (i + 0.5) / bins));
  const sourceDensity = normalizedDensity(xs, MIXTURES[source]);
  const targetDensity = normalizedDensity(xs, DUAL_TARGETS[target]);
  const a = discreteWeightsFromDensity(sourceDensity);
  const b = discreteWeightsFromDensity(targetDensity);
  const plan = weightedSweepPlan(a, b);
  const { f, g, edges } = supportPotentialsFromPlan(xs, xs, a, b, plan);
  const { ctx, w, h } = resizeCanvas(390);
  const top = { x: 22, y: 34, w: w - 44, h: Math.max(130, h * 0.36) };
  const bottom = { x: 22, y: top.y + top.h + 48, w: w - 44, h: h - top.h - 86 };
  drawDensityStrips(ctx, top, xs, sourceDensity, targetDensity, "marginals and active support");
  const X = (x) => top.x + ((x - xs[0]) / (xs[xs.length - 1] - xs[0])) * top.w;
  const yA = top.y + top.h * 0.28;
  const yB = top.y + top.h * 0.72;
  const maxMass = Math.max(...edges.map((edge) => edge[2]), 1e-12);
  for (const [i, j, mass] of edges) {
    const s = Math.sqrt(mass / maxMass);
    ctx.strokeStyle = `rgba(123,50,148,${0.16 + 0.42 * s})`;
    ctx.lineWidth = 0.4 + 1.3 * s;
    ctx.beginPath();
    ctx.moveTo(X(xs[i]), yA);
    ctx.lineTo(X(xs[j]), yB);
    ctx.stroke();
  }
  drawFrame(ctx, bottom, "dual potentials");
  const yMin = Math.min(...f, ...g);
  const yMax = Math.max(...f, ...g);
  drawCurve(ctx, xs, f, bottom, xs[0], xs[xs.length - 1], yMin, yMax, RED, 1.9);
  drawCurve(ctx, xs, g, bottom, xs[0], xs[xs.length - 1], yMin, yMax, BLUE, 1.9);
  ctx.fillStyle = RED;
  ctx.fillText("f", bottom.x + bottom.w - 34, bottom.y + 18);
  ctx.fillStyle = BLUE;
  ctx.fillText("g", bottom.x + bottom.w - 22, bottom.y + 18);
  setStatus(`${bins} bins; ${pretty(target)} target; ${edges.length} tight equality entries; gauge <f,a> = 0`);
}

function auctionRun(n, epsilon, spread, seed) {
  const random = rng(seed);
  const x = Array.from({ length: n }, (_, i) => (i + 0.5) / n);
  const y = Array.from({ length: n }, (_, i) => clamp((i + 0.5) / n + spread * 0.018 * randn(random), 0, 1));
  y.sort((a, b) => a - b);
  const profit = x.map((xi) => y.map((yj) => -((xi - yj) ** 2)));
  const prices = Array(n).fill(0);
  const assignment = Array(n).fill(-1);
  const owner = Array(n).fill(-1);
  const snapshots = [{ assignment: assignment.slice(), prices: prices.slice(), bid: null }];
  let guard = 0;
  while (assignment.some((j) => j < 0) && guard < 5000) {
    const i = assignment.findIndex((j) => j < 0);
    const reduced = profit[i].map((z, j) => z - prices[j]);
    let best = 0;
    let second = -Infinity;
    for (let j = 1; j < n; j += 1) if (reduced[j] > reduced[best]) best = j;
    for (let j = 0; j < n; j += 1) if (j !== best) second = Math.max(second, reduced[j]);
    const increment = reduced[best] - second + epsilon;
    const previous = owner[best];
    if (previous >= 0) assignment[previous] = -1;
    owner[best] = i;
    assignment[i] = best;
    prices[best] += increment;
    snapshots.push({ assignment: assignment.slice(), prices: prices.slice(), bid: { i, j: best, increment } });
    guard += 1;
  }
  return snapshots;
}

function drawAuctionPrices(ctx, prices, box, title) {
  drawFrame(ctx, box, title);
  const maxPrice = Math.max(...prices, 1e-8);
  const barW = box.w / prices.length;
  for (let j = 0; j < prices.length; j += 1) {
    const bh = (prices[j] / maxPrice) * (box.h - 34);
    ctx.fillStyle = "rgba(33,102,172,.52)";
    ctx.fillRect(box.x + j * barW + 2, box.y + box.h - 14 - bh, Math.max(1, barW - 4), bh);
  }
  ctx.fillStyle = "#4a5563";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("target prices", box.x + 8, box.y + 18);
}

function drawDualAuction() {
  const n = Math.round(val("daN"));
  const epsilon = val("daEps");
  const progress = val("daProgress");
  const spread = val("daSpread");
  const snapshots = auctionRun(n, epsilon, spread, 2161);
  const index = Math.round(progress * (snapshots.length - 1));
  const snap = snapshots[index];
  const { ctx, w, h } = resizeCanvas(390);
  const gap = 24;
  const matrixW = Math.min(330, (w - 52 - gap) * 0.48);
  const matrixBox = { x: 22, y: 48, w: matrixW, h: h - 78 };
  const priceBox = { x: 22 + matrixW + gap, y: 48, w: w - matrixW - gap - 44, h: h - 78 };
  drawAssignmentMatrix(ctx, snap.assignment, `bid ${index} / ${snapshots.length - 1}`, matrixBox);
  drawAuctionPrices(ctx, snap.prices, priceBox, "dual prices");
  if (snap.bid) {
    ctx.fillStyle = VIOLET;
    ctx.font = "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    ctx.fillText(`last bid: source ${snap.bid.i + 1} -> target ${snap.bid.j + 1}`, priceBox.x + 8, priceBox.y + priceBox.h - 34);
    ctx.fillText(`price increment ${snap.bid.increment.toExponential(2)}`, priceBox.x + 8, priceBox.y + priceBox.h - 16);
  }
  setStatus(`bid ${index}/${snapshots.length - 1}; ${snap.assignment.filter((j) => j >= 0).length}/${n} assigned; epsilon = ${epsilon.toExponential(1)}`);
}

function continuousDualPotentials(sourceName, targetName, gridN) {
  const xs = Array.from({ length: gridN }, (_, i) => lerp(-3.2, 3.2, i / (gridN - 1)));
  const alpha = normalizedDensity(xs, MIXTURES[sourceName]);
  const beta = normalizedDensity(xs, DUAL_TARGETS[targetName]);
  const acdf = cumulative(alpha);
  const bcdf = cumulative(beta);
  const T = xs.map((x, i) => inverseFromCdfGrid(xs, bcdf, acdf[i]));
  const dx = xs[1] - xs[0];
  const fp = xs.map((x, i) => 2 * (x - T[i]));
  const f = Array(gridN).fill(0);
  for (let i = 1; i < gridN; i += 1) f[i] = f[i - 1] + 0.5 * (fp[i] + fp[i - 1]) * dx;
  const gauge = f.reduce((sum, z, i) => sum + z * alpha[i], 0) / Math.max(alpha.reduce((a, b) => a + b, 0), 1e-12);
  for (let i = 0; i < gridN; i += 1) f[i] -= gauge;
  const g = xs.map((y) => Math.min(...xs.map((x, i) => (x - y) ** 2 - f[i])));
  return { xs, alpha, beta, T, f, g };
}

function drawDualContinuous() {
  const source = val("dcSource");
  const target = val("dcTarget");
  const gridN = Math.round(val("dcGrid"));
  const data = continuousDualPotentials(source, target, gridN);
  const { xs, alpha, beta, T, f, g } = data;
  const { ctx, w, h } = resizeCanvas(392);
  const top = { x: 22, y: 34, w: w - 44, h: Math.max(126, h * 0.34) };
  const bottom = { x: 22, y: top.y + top.h + 48, w: w - 44, h: h - top.h - 86 };
  drawDensityStrips(ctx, top, xs, alpha, beta, "densities and monotone graph");
  const X = (x) => top.x + ((x - xs[0]) / (xs[xs.length - 1] - xs[0])) * top.w;
  const yA = top.y + top.h * 0.27;
  const yB = top.y + top.h * 0.73;
  ctx.strokeStyle = "rgba(123,50,148,.32)";
  ctx.lineWidth = 0.75;
  const stride = Math.max(1, Math.floor(gridN / 34));
  for (let i = 0; i < gridN; i += stride) {
    ctx.beginPath();
    ctx.moveTo(X(xs[i]), yA);
    ctx.lineTo(X(T[i]), yB);
    ctx.stroke();
  }
  drawFrame(ctx, bottom, "continuous dual potentials");
  const yMin = Math.min(...f, ...g);
  const yMax = Math.max(...f, ...g);
  drawCurve(ctx, xs, f, bottom, xs[0], xs[xs.length - 1], yMin, yMax, RED, 1.9);
  drawCurve(ctx, xs, g, bottom, xs[0], xs[xs.length - 1], yMin, yMax, BLUE, 1.9);
  ctx.fillStyle = RED;
  ctx.fillText("f", bottom.x + bottom.w - 34, bottom.y + 18);
  ctx.fillStyle = BLUE;
  ctx.fillText("g = f^c", bottom.x + bottom.w - 78, bottom.y + 36);
  setStatus(`${gridN} grid points; ${pretty(target)} target; f'(x) = 2(x - T(x)) from monotone quantiles`);
}

function dualEnvelopeAtoms(n, amplitude, seed) {
  const random = rng(seed);
  const atoms = Array.from({ length: n }, (_, i) => lerp(-2.5, 2.5, (i + 0.5) / n) + 0.1 * randn(random));
  atoms.sort((a, b) => a - b);
  const values = atoms.map((x, i) => amplitude * (0.55 * Math.sin(1.9 * x + 0.7) + 0.28 * Math.cos(3.3 * x - i) + 0.12 * randn(random)));
  return { atoms, values };
}

function drawDashedCurve(ctx, xs, ys, box, xMin, xMax, yMin, yMax, color, width = 1.4, dash = [5, 4]) {
  ctx.save();
  ctx.setLineDash(dash);
  drawCurve(ctx, xs, ys, box, xMin, xMax, yMin, yMax, color, width);
  ctx.restore();
}

function drawDualEnvelope() {
  const p = val("dePower");
  const n = Math.round(val("deAtoms"));
  const amplitude = val("deAmp");
  const { atoms, values } = dualEnvelopeAtoms(n, amplitude, 2309);
  const ys = Array.from({ length: 520 }, (_, i) => lerp(-3.15, 3.15, i / 519));
  const curves = atoms.map((x, i) => ys.map((y) => Math.abs(x - y) ** p - values[i]));
  const env = ys.map((_, k) => Math.min(...curves.map((curve) => curve[k])));
  const active = new Set(ys.map((_, k) => curves.reduce((best, curve, i) => (curve[k] < curves[best][k] ? i : best), 0)));
  const sampledCurves = curves.flatMap((curve) => curve.filter((_, i) => i % 12 === 0));
  const yMin = Math.min(...env, ...values) - 0.12;
  const yMax = Math.max(...sampledCurves, ...values) + 0.12;
  const { ctx, w, h } = resizeCanvas(370);
  const box = { x: 24, y: 42, w: w - 48, h: h - 74 };
  drawFrame(ctx, box, "lower envelope c-transform");
  for (const curve of curves) drawCurve(ctx, ys, curve, box, -3.15, 3.15, yMin, yMax, "rgba(95,102,112,.34)", 0.9);
  drawCurve(ctx, ys, env, box, -3.15, 3.15, yMin, yMax, VIOLET, 2.25);
  const X = (x) => box.x + ((x + 3.15) / 6.3) * box.w;
  const Y = (y) => box.y + box.h - ((y - yMin) / Math.max(yMax - yMin, 1e-12)) * box.h;
  ctx.fillStyle = RED;
  for (let i = 0; i < atoms.length; i += 1) {
    ctx.beginPath();
    ctx.arc(X(atoms[i]), Y(values[i]), 4.2, 0, 2 * Math.PI);
    ctx.fill();
  }
  setStatus(`${n} atoms; ${active.size} active envelope pieces; p = ${p.toFixed(2)}`);
}

function initialDualPotential(grid, roughness, phase) {
  return grid.map((x) => {
    const smooth = 0.34 * Math.cos(1.25 * x + phase) - 0.08 * x * x;
    const rough = roughness * (0.16 * Math.sin(5.2 * x - 0.8 * phase) + 0.08 * Math.sin(10.4 * x + phase));
    const bump = 0.18 * Math.exp(-8 * (x + 0.8 * Math.cos(phase)) ** 2);
    return smooth + rough + bump;
  });
}

function bilinearCTransform(values, fromGrid, toGrid) {
  return toGrid.map((y) => Math.min(...fromGrid.map((x, i) => -x * y - values[i])));
}

function drawDualAlternate() {
  const side = val("dalSide");
  const roughness = val("dalRough");
  const gridN = Math.round(val("dalGrid"));
  const grid = Array.from({ length: gridN }, (_, i) => lerp(-1.8, 1.8, i / (gridN - 1)));
  const phase = side === "source" ? 0.2 : 1.7;
  const initial = initialDualPotential(grid, roughness, phase);
  const oneSided = bilinearCTransform(initial, grid, grid);
  const closure = bilinearCTransform(oneSided, grid, grid);
  const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const responseShifted = oneSided.map((z) => z + mean(initial) - mean(oneSided));
  const all = initial.concat(responseShifted, closure);
  const yMin = Math.min(...all) - 0.08;
  const yMax = Math.max(...all) + 0.08;
  const { ctx, w, h } = resizeCanvas(370);
  const box = { x: 24, y: 42, w: w - 48, h: h - 74 };
  drawFrame(ctx, box, side === "source" ? "source-side hard transform" : "target-side hard transform");
  const accent = side === "source" ? RED : BLUE;
  drawCurve(ctx, grid, initial, box, grid[0], grid[grid.length - 1], yMin, yMax, mixColor(0.28, accent, "#ffffff", 0.95), 1.35);
  drawDashedCurve(ctx, grid, responseShifted, box, grid[0], grid[grid.length - 1], yMin, yMax, "rgba(95,102,112,.75)", 1.25, [6, 5]);
  drawCurve(ctx, grid, closure, box, grid[0], grid[grid.length - 1], yMin, yMax, accent, 2.35);
  ctx.fillStyle = "#4a5563";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("pale: initial", box.x + 10, box.y + 18);
  ctx.fillText("dashed: one-sided response", box.x + 10, box.y + 36);
  ctx.fillStyle = accent;
  ctx.fillText("dark: double-transform closure", box.x + 10, box.y + 54);
  setStatus(`${side} side; roughness ${roughness.toFixed(1)}; hard closure after one double transform`);
}

const SEMI_DOMAIN = { xmin: -1.8, xmax: 1.8, ymin: -1.25, ymax: 1.25 };

function hslRgb(h, s, l) {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const hp = ((h % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let rgbPrime = [0, 0, 0];
  if (hp < 1) rgbPrime = [c, x, 0];
  else if (hp < 2) rgbPrime = [x, c, 0];
  else if (hp < 3) rgbPrime = [0, c, x];
  else if (hp < 4) rgbPrime = [0, x, c];
  else if (hp < 5) rgbPrime = [x, 0, c];
  else rgbPrime = [c, 0, x];
  const m = light - c / 2;
  return rgbPrime.map((v) => Math.round(255 * (v + m)));
}

function semiRgb(i, n) {
  return hslRgb((28 + 137.508 * i) % 360, 58, n > 26 ? 58 : 62);
}

function semiDensity(x, y, mode) {
  const gaussian = (cx, cy, sx, sy, amp) => {
    const dx = (x - cx) / sx;
    const dy = (y - cy) / sy;
    return amp * Math.exp(-0.5 * (dx * dx + dy * dy));
  };
  if (mode === "right_blob") {
    return gaussian(0.62, 0.02, 0.48, 0.56, 1.0) + gaussian(1.15, 0.56, 0.26, 0.24, 0.42);
  }
  if (mode === "ring") {
    const r = Math.hypot(x - 0.5, 0.92 * y);
    return 0.92 * Math.exp(-0.5 * ((r - 0.62) / 0.13) ** 2) + gaussian(0.35, -0.05, 0.22, 0.24, 0.32);
  }
  return (
    gaussian(0.18, -0.38, 0.34, 0.24, 0.64) +
    gaussian(0.75, 0.38, 0.26, 0.3, 0.86) +
    gaussian(1.22, -0.05, 0.24, 0.42, 0.44)
  );
}

function makeSemiGrid(nx, ny, mode) {
  const points = [];
  let total = 0;
  let maxDensity = 0;
  for (let iy = 0; iy < ny; iy += 1) {
    const y = lerp(SEMI_DOMAIN.ymax, SEMI_DOMAIN.ymin, iy / (ny - 1));
    for (let ix = 0; ix < nx; ix += 1) {
      const x = lerp(SEMI_DOMAIN.xmin, SEMI_DOMAIN.xmax, ix / (nx - 1));
      const density = semiDensity(x, y, mode);
      maxDensity = Math.max(maxDensity, density);
      total += density;
      points.push({ x, y, density, w: density });
    }
  }
  for (const point of points) point.w /= Math.max(total, 1e-12);
  return { nx, ny, points, maxDensity };
}

function semiSites(m, seed) {
  const random = rng(seed);
  const sites = [];
  for (let j = 0; j < m; j += 1) {
    const stripe = (j + 0.5) / m;
    const x = clamp(-1.42 + 0.68 * random() + 0.1 * randn(random), -1.62, -0.35);
    const y = clamp(lerp(-0.98, 0.98, stripe) + 0.2 * randn(random), -1.08, 1.08);
    sites.push([x, y]);
  }
  sites.sort((a, b) => a[1] - b[1]);
  return sites;
}

function semiTargetWeights(sites, mode) {
  let weights;
  if (mode === "vertical") {
    weights = sites.map((p) => 0.18 + Math.exp(1.15 * p[1]));
  } else if (mode === "right_heavy") {
    weights = sites.map((p) => 0.18 + Math.exp(2.2 * (p[0] + 1.62)));
  } else {
    weights = sites.map(() => 1);
  }
  const total = weights.reduce((sum, z) => sum + z, 0);
  return weights.map((z) => z / Math.max(total, 1e-12));
}

function assignSemiCells(grid, sites, gamma = null) {
  const labels = new Array(grid.points.length);
  for (let p = 0; p < grid.points.length; p += 1) {
    const point = grid.points[p];
    let best = 0;
    let bestValue = Infinity;
    for (let j = 0; j < sites.length; j += 1) {
      const dx = point.x - sites[j][0];
      const dy = point.y - sites[j][1];
      const value = dx * dx + dy * dy - (gamma ? gamma[j] : 0);
      if (value < bestValue) {
        bestValue = value;
        best = j;
      }
    }
    labels[p] = best;
  }
  return labels;
}

function semiCellMasses(labels, grid, m) {
  const masses = Array(m).fill(0);
  for (let i = 0; i < labels.length; i += 1) masses[labels[i]] += grid.points[i].w;
  return masses;
}

function runSemiLaguerre(m, steps, targetMode, densityMode, seed) {
  const grid = makeSemiGrid(96, 68, densityMode);
  const sites = semiSites(m, seed);
  const target = semiTargetWeights(sites, targetMode);
  const gamma = Array(m).fill(0);
  let labels = assignSemiCells(grid, sites, gamma);
  let masses = semiCellMasses(labels, grid, m);
  for (let it = 0; it < steps; it += 1) {
    const gain = 0.92 / Math.sqrt(1 + 0.06 * it);
    for (let j = 0; j < m; j += 1) gamma[j] += gain * (target[j] - masses[j]);
    const mean = gamma.reduce((sum, z) => sum + z, 0) / m;
    for (let j = 0; j < m; j += 1) gamma[j] = clamp(gamma[j] - mean, -2.5, 2.5);
    labels = assignSemiCells(grid, sites, gamma);
    masses = semiCellMasses(labels, grid, m);
  }
  return { grid, sites, target, gamma, labels, masses };
}

function semiProjection(box) {
  return {
    X: (x) => box.x + ((x - SEMI_DOMAIN.xmin) / (SEMI_DOMAIN.xmax - SEMI_DOMAIN.xmin)) * box.w,
    Y: (y) => box.y + box.h - ((y - SEMI_DOMAIN.ymin) / (SEMI_DOMAIN.ymax - SEMI_DOMAIN.ymin)) * box.h,
  };
}

function drawSemiCells(ctx, box, grid, labels, sites, title, weights = null) {
  drawFrame(ctx, box, title);
  const tmp = document.createElement("canvas");
  tmp.width = grid.nx;
  tmp.height = grid.ny;
  const ictx = tmp.getContext("2d");
  const data = ictx.createImageData(grid.nx, grid.ny);
  for (let i = 0; i < grid.points.length; i += 1) {
    const color = semiRgb(labels[i], sites.length);
    const k = 4 * i;
    const densityShade = clamp(grid.points[i].density / Math.max(grid.maxDensity, 1e-12), 0, 1);
    data.data[k] = Math.round(lerp(248, color[0], 0.45 + 0.18 * densityShade));
    data.data[k + 1] = Math.round(lerp(250, color[1], 0.45 + 0.18 * densityShade));
    data.data[k + 2] = Math.round(lerp(253, color[2], 0.45 + 0.18 * densityShade));
    data.data[k + 3] = 255;
  }
  ictx.putImageData(data, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tmp, box.x, box.y, box.w, box.h);
  ctx.imageSmoothingEnabled = true;
  const { X, Y } = semiProjection(box);
  const densityStride = grid.points.length > 5000 ? 3 : 2;
  for (let i = 0; i < grid.points.length; i += densityStride) {
    const point = grid.points[i];
    const shade = clamp(point.density / Math.max(grid.maxDensity, 1e-12), 0, 1);
    if (shade < 0.08) continue;
    ctx.fillStyle = `rgba(215,48,39,${0.035 + 0.19 * shade})`;
    ctx.fillRect(X(point.x) - 0.8, Y(point.y) - 0.8, 1.6, 1.6);
  }
  ctx.strokeStyle = "#c7d0dc";
  ctx.lineWidth = 1;
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  for (let j = 0; j < sites.length; j += 1) {
    const color = semiRgb(j, sites.length);
    const radius = weights ? 3.2 + 18 * Math.sqrt(weights[j]) : 5.2;
    ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
    ctx.beginPath();
    ctx.arc(X(sites[j][0]), Y(sites[j][1]), radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.92)";
    ctx.lineWidth = 1.25;
    ctx.stroke();
    ctx.strokeStyle = "rgba(38,51,63,.35)";
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
}

function semiBoxes(w, h) {
  if (w < 620) {
    const boxH = (h - 92) / 2;
    return [
      { x: 22, y: 38, w: w - 44, h: boxH },
      { x: 22, y: 38 + boxH + 54, w: w - 44, h: boxH },
    ];
  }
  const gap = 24;
  const boxW = (w - 44 - gap) / 2;
  return [
    { x: 22, y: 44, w: boxW, h: h - 78 },
    { x: 22 + boxW + gap, y: 44, w: boxW, h: h - 78 },
  ];
}

function drawSemiLaguerre() {
  const m = Math.round(val("slSites"));
  const steps = Math.round(val("slSteps"));
  const targetMode = val("slMass");
  const densityMode = val("slDensity");
  const seed = Math.round(val("slSeed"));
  const data = runSemiLaguerre(m, steps, targetMode, densityMode, seed);
  const initialLabels = assignSemiCells(data.grid, data.sites, Array(m).fill(0));
  const { ctx, w, h } = resizeCanvas(398);
  const boxes = semiBoxes(w, h);
  drawSemiCells(ctx, boxes[0], data.grid, initialLabels, data.sites, "ordinary Voronoi cells", data.target);
  drawSemiCells(ctx, boxes[1], data.grid, data.labels, data.sites, "Laguerre cells after dual updates", data.target);
  const maxError = Math.max(...data.masses.map((mass, j) => Math.abs(mass - data.target[j])));
  setStatus(`${m} sites; ${steps} dual updates; max mass error ${maxError.toFixed(3)}; target ${pretty(targetMode)}`);
}

function runSemiLloyd(m, iterations, densityMode, seed) {
  const grid = makeSemiGrid(96, 68, densityMode);
  const initialSites = semiSites(m, seed);
  let sites = initialSites.map((p) => p.slice());
  let labels = assignSemiCells(grid, sites);
  let masses = semiCellMasses(labels, grid, m);
  for (let it = 0; it < iterations; it += 1) {
    const sx = Array(m).fill(0);
    const sy = Array(m).fill(0);
    masses = Array(m).fill(0);
    for (let i = 0; i < grid.points.length; i += 1) {
      const j = labels[i];
      const point = grid.points[i];
      masses[j] += point.w;
      sx[j] += point.w * point.x;
      sy[j] += point.w * point.y;
    }
    for (let j = 0; j < m; j += 1) {
      if (masses[j] > 1e-9) sites[j] = [sx[j] / masses[j], sy[j] / masses[j]];
    }
    labels = assignSemiCells(grid, sites);
  }
  masses = semiCellMasses(labels, grid, m);
  let objective = 0;
  for (let i = 0; i < grid.points.length; i += 1) {
    const point = grid.points[i];
    const site = sites[labels[i]];
    objective += point.w * ((point.x - site[0]) ** 2 + (point.y - site[1]) ** 2);
  }
  return { grid, initialSites, sites, labels, masses, objective };
}

function drawSemiLloyd() {
  const m = Math.round(val("llSites"));
  const iterations = Math.round(val("llIter"));
  const densityMode = val("llDensity");
  const seed = Math.round(val("llSeed"));
  const data = runSemiLloyd(m, iterations, densityMode, seed);
  const initialLabels = assignSemiCells(data.grid, data.initialSites);
  const { ctx, w, h } = resizeCanvas(398);
  const boxes = semiBoxes(w, h);
  drawSemiCells(ctx, boxes[0], data.grid, initialLabels, data.initialSites, "initial Voronoi cells");
  drawSemiCells(ctx, boxes[1], data.grid, data.labels, data.sites, `Lloyd iteration ${iterations}`);
  const nonempty = data.masses.filter((mass) => mass > 1e-4).length;
  setStatus(`${m} codepoints; ${iterations} centroid updates; ${nonempty}/${m} nonempty cells; objective ${data.objective.toFixed(3)}`);
}

function w1Points(side, seed) {
  const random = rng(seed);
  const pts = [];
  for (let row = 0; row < side; row += 1) {
    for (let col = 0; col < side; col += 1) {
      const x = lerp(-1, 1, col / (side - 1)) + 0.035 * randn(random);
      const y = lerp(-1, 1, row / (side - 1)) + 0.035 * randn(random);
      pts.push([clamp(x, -1.08, 1.08), clamp(y, -1.08, 1.08)]);
    }
  }
  return pts;
}

function w1EdgeKey(i, j) {
  return i < j ? `${i}:${j}` : `${j}:${i}`;
}

function w1Edges(points, side, mode) {
  const edges = [];
  function add(i, j) {
    const length = Math.hypot(points[i][0] - points[j][0], points[i][1] - points[j][1]);
    edges.push({ i: Math.min(i, j), j: Math.max(i, j), length, key: w1EdgeKey(i, j) });
  }
  for (let row = 0; row < side; row += 1) {
    for (let col = 0; col < side; col += 1) {
      const i = row * side + col;
      if (col + 1 < side) add(i, i + 1);
      if (row + 1 < side) add(i, i + side);
      if (mode === "diagonal" && row + 1 < side && col + 1 < side) {
        if ((row + col) % 2 === 0) add(i, i + side + 1);
        else add(i + 1, i + side);
      }
    }
  }
  return edges;
}

function w1Masses(points, mode, count) {
  const order = points.map((p, i) => ({ p, i }));
  let positive;
  let negative;
  if (mode === "corner_swap") {
    positive = order.slice().sort((a, b) => a.p[0] + a.p[1] - (b.p[0] + b.p[1])).slice(0, count).map((z) => z.i);
    negative = order.slice().sort((a, b) => b.p[0] + b.p[1] - (a.p[0] + a.p[1])).slice(0, count).map((z) => z.i);
  } else if (mode === "center_out") {
    positive = order.slice().sort((a, b) => Math.hypot(a.p[0], a.p[1]) - Math.hypot(b.p[0], b.p[1])).slice(0, count).map((z) => z.i);
    const used = new Set(positive);
    negative = order.slice()
      .filter((z) => !used.has(z.i))
      .sort((a, b) => Math.hypot(b.p[0], b.p[1]) - Math.hypot(a.p[0], a.p[1]))
      .slice(0, count)
      .map((z) => z.i);
  } else {
    positive = order.slice().sort((a, b) => a.p[0] - b.p[0]).slice(0, count).map((z) => z.i);
    const used = new Set(positive);
    negative = order.slice()
      .filter((z) => !used.has(z.i))
      .sort((a, b) => b.p[0] - a.p[0])
      .slice(0, count)
      .map((z) => z.i);
  }
  const masses = Array(points.length).fill(0);
  for (const i of positive) masses[i] += 1 / count;
  for (const i of negative) masses[i] -= 1 / count;
  return masses;
}

function w1Adjacency(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  const edgeMap = new Map();
  for (const edge of edges) {
    edgeMap.set(edge.key, edge);
    adj[edge.i].push({ to: edge.j, length: edge.length, key: edge.key });
    adj[edge.j].push({ to: edge.i, length: edge.length, key: edge.key });
  }
  return { adj, edgeMap };
}

function w1Dijkstra(source, adj) {
  const n = adj.length;
  const dist = Array(n).fill(Infinity);
  const prev = Array(n).fill(-1);
  const used = Array(n).fill(false);
  dist[source] = 0;
  for (let step = 0; step < n; step += 1) {
    let u = -1;
    for (let i = 0; i < n; i += 1) if (!used[i] && (u < 0 || dist[i] < dist[u])) u = i;
    if (u < 0 || !Number.isFinite(dist[u])) break;
    used[u] = true;
    for (const edge of adj[u]) {
      const nd = dist[u] + edge.length;
      if (nd < dist[edge.to]) {
        dist[edge.to] = nd;
        prev[edge.to] = u;
      }
    }
  }
  return { dist, prev };
}

function w1Path(prev, source, target) {
  const path = [target];
  let u = target;
  while (u !== source && prev[u] >= 0) {
    u = prev[u];
    path.push(u);
  }
  path.reverse();
  return path[0] === source ? path : [];
}

function routeW1Flow(points, edges, masses) {
  const { adj, edgeMap } = w1Adjacency(points.length, edges);
  const supply = masses.map((z, i) => ({ i, amount: Math.max(z, 0) })).filter((z) => z.amount > 1e-10);
  const demand = masses.map((z, i) => ({ i, amount: Math.max(-z, 0) })).filter((z) => z.amount > 1e-10);
  const flow = new Map(edges.map((edge) => [edge.key, 0]));
  let cost = 0;
  for (const source of supply) {
    while (source.amount > 1e-10 && demand.some((z) => z.amount > 1e-10)) {
      const tree = w1Dijkstra(source.i, adj);
      let best = -1;
      for (let k = 0; k < demand.length; k += 1) {
        if (demand[k].amount > 1e-10 && (best < 0 || tree.dist[demand[k].i] < tree.dist[demand[best].i])) best = k;
      }
      const target = demand[best];
      const amount = Math.min(source.amount, target.amount);
      const path = w1Path(tree.prev, source.i, target.i);
      for (let p = 0; p + 1 < path.length; p += 1) {
        const a = path[p];
        const b = path[p + 1];
        const key = w1EdgeKey(a, b);
        const edge = edgeMap.get(key);
        const sign = a === edge.i && b === edge.j ? 1 : -1;
        flow.set(key, flow.get(key) + sign * amount);
      }
      cost += amount * tree.dist[target.i];
      source.amount -= amount;
      target.amount -= amount;
    }
  }
  return { flow, cost };
}

function graphProjection(box) {
  return {
    X: (p) => box.x + ((p[0] + 1.16) / 2.32) * box.w,
    Y: (p) => box.y + box.h - ((p[1] + 1.16) / 2.32) * box.h,
  };
}

function drawW1Arrow(ctx, x0, y0, x1, y1, width, color) {
  const angle = Math.atan2(y1 - y0, x1 - x0);
  const trim = 8 + width;
  const sx = x0 + trim * Math.cos(angle);
  const sy = y0 + trim * Math.sin(angle);
  const ex = x1 - trim * Math.cos(angle);
  const ey = y1 - trim * Math.sin(angle);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  ctx.fillStyle = color;
  const head = 5.5 + width;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - head * Math.cos(angle - 0.45), ey - head * Math.sin(angle - 0.45));
  ctx.lineTo(ex - head * Math.cos(angle + 0.45), ey - head * Math.sin(angle + 0.45));
  ctx.closePath();
  ctx.fill();
  ctx.lineCap = "butt";
}

function drawW1GraphPanel(ctx, box, points, edges, masses, flow, title) {
  drawFrame(ctx, box, title);
  const { X, Y } = graphProjection(box);
  ctx.strokeStyle = "#d7dee8";
  ctx.lineWidth = 1;
  for (const edge of edges) {
    ctx.beginPath();
    ctx.moveTo(X(points[edge.i]), Y(points[edge.i]));
    ctx.lineTo(X(points[edge.j]), Y(points[edge.j]));
    ctx.stroke();
  }
  if (flow) {
    const maxFlow = Math.max(...Array.from(flow.values()).map((z) => Math.abs(z)), 1e-12);
    for (const edge of edges) {
      const amount = flow.get(edge.key) || 0;
      if (Math.abs(amount) < 1e-10) continue;
      const forward = amount > 0;
      const a = forward ? edge.i : edge.j;
      const b = forward ? edge.j : edge.i;
      const scale = Math.sqrt(Math.abs(amount) / maxFlow);
      drawW1Arrow(ctx, X(points[a]), Y(points[a]), X(points[b]), Y(points[b]), 1.3 + 3.4 * scale, `rgba(123,50,148,${0.34 + 0.5 * scale})`);
    }
  }
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#8c98a6";
  ctx.lineWidth = 0.8;
  for (const point of points) {
    ctx.beginPath();
    ctx.arc(X(point), Y(point), 2.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
  const maxMass = Math.max(...masses.map((z) => Math.abs(z)), 1e-12);
  for (let i = 0; i < points.length; i += 1) {
    const mass = masses[i];
    if (Math.abs(mass) < 1e-10) continue;
    const radius = 5.2 + 13 * Math.sqrt(Math.abs(mass) / maxMass);
    ctx.fillStyle = mass > 0 ? "rgba(215,48,39,.78)" : "rgba(33,102,172,.78)";
    ctx.beginPath();
    ctx.arc(X(points[i]), Y(points[i]), radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.9)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }
}

function drawW1Graph() {
  const side = Math.round(val("wgSide"));
  const mode = val("wgMode");
  const count = Math.round(val("wgCount"));
  const graphMode = val("wgGraph");
  const seed = Math.round(val("wgSeed"));
  const points = w1Points(side, seed);
  const edges = w1Edges(points, side, graphMode);
  const masses = w1Masses(points, mode, Math.min(count, Math.floor(points.length / 2)));
  const routed = routeW1Flow(points, edges, masses);
  const { ctx, w, h } = resizeCanvas(398);
  const boxes = semiBoxes(w, h);
  drawW1GraphPanel(ctx, boxes[0], points, edges, masses, null, "signed measure r");
  drawW1GraphPanel(ctx, boxes[1], points, edges, masses, routed.flow, "shortest-path flow");
  const activeEdges = Array.from(routed.flow.values()).filter((z) => Math.abs(z) > 1e-10).length;
  setStatus(`${side} x ${side} graph; ${count} sources and sinks; ${activeEdges} active edges; routed cost ${routed.cost.toFixed(3)}`);
}

function ipmDensity(x, separation, mode, side) {
  if (mode === "scale") {
    const mean = side === "source" ? -0.18 * separation : 0.18 * separation;
    const sigma = side === "source" ? 0.42 : 0.72;
    return normalPdf(x, mean, sigma);
  }
  if (mode === "three_mode") {
    if (side === "source") {
      return 0.56 * normalPdf(x, -0.92 - 0.25 * separation, 0.34) + 0.28 * normalPdf(x, 0.14, 0.28) + 0.16 * normalPdf(x, 1.34, 0.38);
    }
    return 0.42 * normalPdf(x, -1.12, 0.38) + 0.32 * normalPdf(x, 0.52 + 0.28 * separation, 0.31) + 0.26 * normalPdf(x, 1.62, 0.3);
  }
  const shift = side === "source" ? -0.5 * separation : 0.5 * separation;
  const secondary = side === "source" ? -1.22 : 1.22;
  return 0.72 * normalPdf(x, shift, 0.48) + 0.28 * normalPdf(x, secondary + 0.18 * shift, 0.32);
}

function normalizeGridDensity(values, dx) {
  const total = values.reduce((sum, z) => sum + z, 0) * dx;
  return values.map((z) => z / Math.max(total, 1e-12));
}

function centeredUnit(values) {
  const mean = values.reduce((sum, z) => sum + z, 0) / values.length;
  const centered = values.map((z) => z - mean);
  const maxAbs = Math.max(...centered.map((z) => Math.abs(z)), 1e-12);
  return centered.map((z) => z / maxAbs);
}

function ipmData(separation, kernelSigma, mode) {
  const xs = Array.from({ length: 520 }, (_, i) => lerp(-3.4, 3.4, i / 519));
  const dx = xs[1] - xs[0];
  const alpha = normalizeGridDensity(xs.map((x) => ipmDensity(x, separation, mode, "source")), dx);
  const beta = normalizeGridDensity(xs.map((x) => ipmDensity(x, separation, mode, "target")), dx);
  const signed = alpha.map((z, i) => z - beta[i]);
  const cumulativeDiff = [];
  let running = 0;
  for (let i = 0; i < xs.length; i += 1) {
    running += signed[i] * dx;
    cumulativeDiff.push(running);
  }
  const w1Derivative = cumulativeDiff.map((z) => -Math.sign(z));
  const w1Witness = Array(xs.length).fill(0);
  for (let i = 1; i < xs.length; i += 1) w1Witness[i] = w1Witness[i - 1] + 0.5 * (w1Derivative[i] + w1Derivative[i - 1]) * dx;
  const mmdWitness = xs.map((x) => {
    let sum = 0;
    for (let j = 0; j < xs.length; j += 3) {
      const d = (x - xs[j]) / kernelSigma;
      sum += signed[j] * Math.exp(-0.5 * d * d) * dx * 3;
    }
    return sum;
  });
  const tvWitness = signed.map((z) => Math.sign(z));
  const witnesses = {
    w1: centeredUnit(w1Witness),
    mmd: centeredUnit(mmdWitness),
    tv: tvWitness,
  };
  const w1 = cumulativeDiff.reduce((sum, z) => sum + Math.abs(z) * dx, 0);
  const tv = signed.reduce((sum, z) => sum + Math.abs(z) * dx, 0);
  const mmd = Math.sqrt(Math.max(0, signed.reduce((sum, z, i) => sum + z * mmdWitness[i] * dx, 0)));
  return { xs, alpha, beta, signed, witnesses, values: { w1, mmd, tv } };
}

function drawIpmWitnessPanel(ctx, box, data, witnessName, title) {
  drawFrame(ctx, box, title);
  const constraints = {
    w1: "constraint: Lip(f) <= 1",
    mmd: "constraint: ||f||_H <= 1",
    tv: "constraint: ||f||_inf <= 1",
  };
  const maxDensity = Math.max(...data.alpha, ...data.beta, 1e-12);
  const X = (x) => box.x + ((x - data.xs[0]) / (data.xs[data.xs.length - 1] - data.xs[0])) * box.w;
  const YDensity = (z) => box.y + box.h * 0.68 - (z / maxDensity) * box.h * 0.43;
  const YWitness = (z) => box.y + box.h * 0.55 - z * box.h * 0.3;
  const baseline = box.y + box.h * 0.68;
  ctx.strokeStyle = "#e5e9ef";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(box.x + 8, baseline);
  ctx.lineTo(box.x + box.w - 8, baseline);
  ctx.stroke();
  function densityFill(values, color) {
    ctx.beginPath();
    ctx.moveTo(X(data.xs[0]), baseline);
    for (let i = 0; i < data.xs.length; i += 1) ctx.lineTo(X(data.xs[i]), YDensity(values[i]));
    ctx.lineTo(X(data.xs[data.xs.length - 1]), baseline);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
  densityFill(data.alpha, "rgba(215,48,39,.16)");
  densityFill(data.beta, "rgba(33,102,172,.16)");
  drawCurve(ctx, data.xs, data.alpha, { x: box.x, y: box.y + box.h * 0.25, w: box.w, h: box.h * 0.43 }, data.xs[0], data.xs[data.xs.length - 1], 0, maxDensity, RED, 1.6);
  drawCurve(ctx, data.xs, data.beta, { x: box.x, y: box.y + box.h * 0.25, w: box.w, h: box.h * 0.43 }, data.xs[0], data.xs[data.xs.length - 1], 0, maxDensity, BLUE, 1.6);
  const witness = data.witnesses[witnessName];
  ctx.beginPath();
  for (let i = 0; i < data.xs.length; i += 1) {
    const px = X(data.xs[i]);
    const py = YWitness(witness[i]);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = VIOLET;
  ctx.lineWidth = 2.15;
  ctx.stroke();
  const compactLegend = box.h < 190;
  const legendY = compactLegend ? box.y + box.h - 11 : box.y + box.h - 35;
  ctx.fillStyle = "rgba(251,252,253,.88)";
  ctx.fillRect(box.x + 7, legendY - 15, 148, 18);
  ctx.fillStyle = "#4a5563";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("alpha", box.x + 10, legendY);
  ctx.fillStyle = BLUE;
  ctx.fillText("beta", box.x + 52, legendY);
  ctx.fillStyle = VIOLET;
  ctx.fillText("witness", box.x + 90, legendY);
  ctx.fillStyle = "#667085";
  ctx.font = "11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText(constraints[witnessName], box.x + 10, box.y + 18);
}

function drawDualNormIpm() {
  const separation = val("ipmSep");
  const kernelSigma = val("ipmSigma");
  const mode = val("ipmMode");
  const data = ipmData(separation, kernelSigma, mode);
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 760 ? 620 : 390);
  const pad = 22;
  const gap = w < 760 ? 28 : 18;
  const vertical = w < 760;
  const boxes = vertical
    ? [
        { x: pad, y: 38, w: w - 2 * pad, h: (h - 112) / 3 },
        { x: pad, y: 38 + (h - 112) / 3 + gap, w: w - 2 * pad, h: (h - 112) / 3 },
        { x: pad, y: 38 + 2 * ((h - 112) / 3 + gap), w: w - 2 * pad, h: (h - 112) / 3 },
      ]
    : [
        { x: pad, y: 44, w: (w - 2 * pad - 2 * gap) / 3, h: h - 80 },
        { x: pad + (w - 2 * pad - 2 * gap) / 3 + gap, y: 44, w: (w - 2 * pad - 2 * gap) / 3, h: h - 80 },
        { x: pad + 2 * ((w - 2 * pad - 2 * gap) / 3 + gap), y: 44, w: (w - 2 * pad - 2 * gap) / 3, h: h - 80 },
      ];
  drawIpmWitnessPanel(ctx, boxes[0], data, "w1", "Wasserstein-1 witness");
  drawIpmWitnessPanel(ctx, boxes[1], data, "mmd", "MMD witness");
  drawIpmWitnessPanel(ctx, boxes[2], data, "tv", "total variation witness");
  setStatus(`IPM values: W1 ${data.values.w1.toFixed(3)}; MMD ${data.values.mmd.toFixed(3)}; TV ${data.values.tv.toFixed(3)}; kernel sigma ${kernelSigma.toFixed(2)}`);
}

function phiValue(kind, s, gamma) {
  const z = Math.max(s, 1e-8);
  if (kind === "kl") return z * Math.log(z) - z + 1;
  if (kind === "reverse_kl") return -Math.log(z) + z - 1;
  if (kind === "hellinger") return (Math.sqrt(z) - 1) ** 2;
  if (kind === "tv") return Math.abs(z - 1);
  if (kind === "jensen_shannon") return z * Math.log(z) - (z + 1) * Math.log((z + 1) / 2);
  const g = Math.abs(gamma - 1) < 1e-4 ? 1.0001 : Math.abs(gamma) < 1e-4 ? 0.0001 : gamma;
  return (z ** g - g * z + g - 1) / (g * (g - 1));
}

function phiLabel(kind) {
  if (kind === "kl") return "KL";
  if (kind === "reverse_kl") return "reverse KL";
  if (kind === "hellinger") return "Hellinger";
  if (kind === "tv") return "total variation";
  if (kind === "jensen_shannon") return "Jensen-Shannon";
  return "power";
}

function phiDiscreteData(mismatch, zeros, kind, gamma) {
  const n = 18;
  const bRaw = Array.from({ length: n }, (_, i) => {
    const x = (i + 0.5) / n;
    return 0.15 + 0.7 * Math.exp(-26 * (x - 0.38) ** 2) + 0.45 * Math.exp(-36 * (x - 0.72) ** 2);
  });
  for (let i = 0; i < Math.round(zeros); i += 1) bRaw[n - 1 - i] *= 0.015;
  const aRaw = bRaw.map((z, i) => {
    const x = (i + 0.5) / n;
    return z * Math.exp(mismatch * (1.35 * Math.sin(2 * Math.PI * (x - 0.12)) + 0.45 * Math.cos(4 * Math.PI * x)));
  });
  const sumB = bRaw.reduce((a, b) => a + b, 0);
  const sumA = aRaw.reduce((a, b) => a + b, 0);
  const b = bRaw.map((z) => z / sumB);
  const a = aRaw.map((z) => z / sumA);
  const ratio = a.map((z, i) => z / Math.max(b[i], 1e-10));
  const contrib = ratio.map((r, i) => b[i] * phiValue(kind, r, gamma));
  const divergence = contrib.reduce((sum, z) => sum + z, 0);
  return { a, b, ratio, contrib, divergence };
}

function drawPhiGenerators(ctx, box, kind, gamma) {
  drawFrame(ctx, box, "generator functions");
  const ss = Array.from({ length: 420 }, (_, i) => lerp(0.04, 3.25, i / 419));
  const families = ["kl", "reverse_kl", "hellinger", "tv", "jensen_shannon", "power"];
  const yMax = Math.max(...ss.map((s) => Math.min(3.2, phiValue(kind, s, gamma))), 1.1);
  const X = (s) => box.x + ((s - ss[0]) / (ss[ss.length - 1] - ss[0])) * box.w;
  const Y = (z) => box.y + box.h - (z / yMax) * box.h;
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(X(1), box.y);
  ctx.lineTo(X(1), box.y + box.h);
  ctx.moveTo(box.x, Y(0));
  ctx.lineTo(box.x + box.w, Y(0));
  ctx.stroke();
  for (const family of families) {
    const active = family === kind;
    ctx.beginPath();
    for (let i = 0; i < ss.length; i += 1) {
      const y = Y(Math.min(yMax, phiValue(family, ss[i], gamma)));
      if (i === 0) ctx.moveTo(X(ss[i]), y);
      else ctx.lineTo(X(ss[i]), y);
    }
    ctx.strokeStyle = active ? VIOLET : "rgba(95,102,112,.28)";
    ctx.lineWidth = active ? 2.3 : 1;
    ctx.stroke();
  }
  ctx.fillStyle = "#4a5563";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("s = density ratio", box.x + box.w - 112, box.y + box.h - 8);
  ctx.fillStyle = VIOLET;
  ctx.fillText(phiLabel(kind), box.x + 10, box.y + 18);
  const note = box.w < 380 ? "normalized at s = 1" : "all generators normalized at s = 1";
  ctx.fillStyle = "rgba(251,252,253,.88)";
  ctx.fillRect(box.x + 7, box.y + box.h - 21, box.w < 380 ? 116 : 192, 16);
  ctx.fillStyle = "#667085";
  ctx.font = "11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText(note, box.x + 10, box.y + box.h - 8);
}

function drawPhiDiscrete(ctx, box, data) {
  drawFrame(ctx, box, "discrete ratio penalties");
  const n = data.a.length;
  const maxMass = Math.max(...data.a, ...data.b, 1e-12);
  const maxRatio = Math.max(...data.ratio, 1.2);
  const maxContrib = Math.max(...data.contrib, 1e-12);
  const barW = box.w / n;
  const massBase = box.y + box.h * 0.72;
  for (let i = 0; i < n; i += 1) {
    const x = box.x + (i + 0.5) * barW;
    const rb = 3.2 + 12 * Math.sqrt(data.b[i] / maxMass);
    const ra = 3.2 + 12 * Math.sqrt(data.a[i] / maxMass);
    ctx.fillStyle = "rgba(33,102,172,.22)";
    ctx.beginPath();
    ctx.arc(x - 3, massBase, rb, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "rgba(215,48,39,.72)";
    ctx.beginPath();
    ctx.arc(x + 3, massBase - 22, ra, 0, 2 * Math.PI);
    ctx.fill();
    const yRatio = box.y + box.h * 0.48 - (data.ratio[i] / maxRatio) * box.h * 0.32;
    ctx.fillStyle = VIOLET;
    ctx.beginPath();
    ctx.arc(x, yRatio, 2.5, 0, 2 * Math.PI);
    ctx.fill();
    const h = (data.contrib[i] / maxContrib) * box.h * 0.3;
    ctx.strokeStyle = "rgba(230,126,34,.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, box.y + box.h - 12);
    ctx.lineTo(x, box.y + box.h - 12 - h);
    ctx.stroke();
  }
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(box.x + 6, massBase);
  ctx.lineTo(box.x + box.w - 6, massBase);
  ctx.stroke();
  const compact = box.w < 380;
  const legendY = box.y + box.h - 10;
  ctx.fillStyle = "rgba(251,252,253,.88)";
  ctx.fillRect(box.x + 7, legendY - 15, compact ? 153 : 270, 18);
  ctx.fillStyle = RED;
  ctx.font = `${compact ? 10 : 12}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
  ctx.fillText(compact ? "a" : "alpha mass", box.x + 10, legendY);
  ctx.fillStyle = BLUE;
  ctx.fillText(compact ? "b" : "beta mass", box.x + (compact ? 33 : 78), legendY);
  ctx.fillStyle = VIOLET;
  ctx.fillText(compact ? "a/b" : "ratio", box.x + (compact ? 56 : 142), legendY);
  ctx.fillStyle = "#b25a16";
  ctx.fillText(compact ? "b phi" : "local penalty", box.x + (compact ? 94 : 184), legendY);
}

function drawDualNormPhi() {
  const kind = val("phiFamily");
  const gamma = val("phiGamma");
  const mismatch = val("phiMismatch");
  const zeros = val("phiZeros");
  const data = phiDiscreteData(mismatch, zeros, kind, gamma);
  const { ctx, w, h } = resizeCanvas(390);
  const gap = 24;
  const vertical = w < 680;
  const boxes = vertical
    ? [
        { x: 22, y: 38, w: w - 44, h: (h - 92) / 2 },
        { x: 22, y: 38 + (h - 92) / 2 + 54, w: w - 44, h: (h - 92) / 2 },
      ]
    : [
        { x: 22, y: 44, w: (w - 68) / 2, h: h - 80 },
        { x: 22 + (w - 68) / 2 + gap, y: 44, w: (w - 68) / 2, h: h - 80 },
      ];
  drawPhiGenerators(ctx, boxes[0], kind, gamma);
  drawPhiDiscrete(ctx, boxes[1], data);
  setStatus(`D_phi(a|b) for ${phiLabel(kind)}: ${data.divergence.toFixed(3)}; mismatch ${mismatch.toFixed(2)}; near-zero beta bins ${Math.round(zeros)}`);
}

function sinkhornSpec(name, shift = 0, spread = 1) {
  const base = MIXTURES[name] || MIXTURES.three;
  return {
    weights: base.weights.slice(),
    means: base.means.map((x) => x + shift),
    stds: base.stds.map((x) => x * spread),
  };
}

function sinkhornGrid(n, sourceName, targetName, sourceShift = 0, sourceSpread = 1) {
  const xs = Array.from({ length: n }, (_, i) => lerp(-3.15, 3.15, i / Math.max(n - 1, 1)));
  const sourceDensity = normalizedDensity(xs, sinkhornSpec(sourceName, sourceShift, sourceSpread));
  const targetDensity = normalizedDensity(xs, sinkhornSpec(targetName, 0, 1));
  const a = discreteWeightsFromDensity(sourceDensity);
  const b = discreteWeightsFromDensity(targetDensity);
  const cost = xs.map((x) => xs.map((y) => (x - y) ** 2));
  const scale = medianPositive(cost);
  const normalizedCost = cost.map((row) => row.map((z) => z / Math.max(scale, 1e-12)));
  return { xs, a, b, sourceDensity, targetDensity, cost: normalizedCost };
}

function sinkhornState(cost, a, b, epsilon, halfSteps) {
  const n = a.length;
  const m = b.length;
  const eps = Math.max(epsilon, 1e-4);
  const K = cost.map((row) => row.map((c) => Math.exp(-c / eps)));
  const u = Array(n).fill(1);
  const v = Array(m).fill(1);
  for (let step = 0; step < halfSteps; step += 1) {
    if (step % 2 === 0) {
      for (let i = 0; i < n; i += 1) {
        let s = 0;
        for (let j = 0; j < m; j += 1) s += K[i][j] * v[j];
        u[i] = a[i] / Math.max(s, 1e-300);
      }
    } else {
      for (let j = 0; j < m; j += 1) {
        let s = 0;
        for (let i = 0; i < n; i += 1) s += K[i][j] * u[i];
        v[j] = b[j] / Math.max(s, 1e-300);
      }
    }
  }
  let plan = K.map((row, i) => row.map((k, j) => u[i] * k * v[j]));
  if (halfSteps === 0) {
    const totalK = plan.flat().reduce((sum, z) => sum + z, 0);
    plan = plan.map((row) => row.map((z) => z / Math.max(totalK, 1e-300)));
  }
  const row = plan.map((r) => r.reduce((sum, z) => sum + z, 0));
  const col = Array(m).fill(0);
  for (let i = 0; i < n; i += 1) for (let j = 0; j < m; j += 1) col[j] += plan[i][j];
  const rowErr = row.reduce((sum, z, i) => sum + Math.abs(z - a[i]), 0);
  const colErr = col.reduce((sum, z, j) => sum + Math.abs(z - b[j]), 0);
  let transport = 0;
  let kl = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < m; j += 1) {
      const p = plan[i][j];
      transport += p * cost[i][j];
      if (p > 0) kl += p * Math.log(p / Math.max(a[i] * b[j], 1e-300));
    }
  }
  return { K, u, v, plan, row, col, error: 0.5 * (rowErr + colErr), value: transport + eps * kl, transport, kl };
}

function drawSinkhornMarginalPanel(ctx, box, xs, a, b, row, col) {
  drawFrame(ctx, box, "marginal constraints");
  const gap = 28;
  const top = { x: box.x + 10, y: box.y + 28, w: box.w - 20, h: (box.h - 62 - gap) / 2 };
  const bottom = { x: box.x + 10, y: box.y + 28 + (box.h - 62 - gap) / 2 + gap, w: box.w - 20, h: (box.h - 62 - gap) / 2 };
  const maxTop = Math.max(...a, ...row, 1e-12);
  const maxBottom = Math.max(...b, ...col, 1e-12);
  drawCurve(ctx, xs, a, top, xs[0], xs[xs.length - 1], 0, maxTop, RED, 1.7);
  drawCurve(ctx, xs, row, top, xs[0], xs[xs.length - 1], 0, maxTop, VIOLET, 2.0);
  drawCurve(ctx, xs, b, bottom, xs[0], xs[xs.length - 1], 0, maxBottom, BLUE, 1.7);
  drawCurve(ctx, xs, col, bottom, xs[0], xs[xs.length - 1], 0, maxBottom, VIOLET, 2.0);
  ctx.fillStyle = "rgba(251,252,253,.9)";
  ctx.fillRect(top.x + 6, top.y + 6, 168, 34);
  ctx.fillStyle = RED;
  ctx.fillText("source a", top.x + 10, top.y + 18);
  ctx.fillStyle = VIOLET;
  ctx.fillText("current row sums", top.x + 10, top.y + 34);
  ctx.fillStyle = "rgba(251,252,253,.9)";
  ctx.fillRect(bottom.x + 6, bottom.y + 6, 178, 34);
  ctx.fillStyle = BLUE;
  ctx.fillText("target b", bottom.x + 10, bottom.y + 18);
  ctx.fillStyle = VIOLET;
  ctx.fillText("current column sums", bottom.x + 10, bottom.y + 34);
}

function drawSinkhornScaling() {
  const n = Math.round(val("shBins"));
  const epsilon = val("shEps");
  const halfSteps = Math.round(val("shSteps"));
  const source = val("shSource");
  const target = val("shTarget");
  const data = sinkhornGrid(n, source, target);
  const state = sinkhornState(data.cost, data.a, data.b, epsilon, halfSteps);
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 720 ? 650 : 392);
  const vertical = w < 720;
  const gap = 28;
  const boxes = vertical
    ? [
        { x: 22, y: 40, w: w - 44, h: (h - 98) / 2 },
        { x: 22, y: 40 + (h - 98) / 2 + gap, w: w - 44, h: (h - 98) / 2 },
      ]
    : [
        { x: 22, y: 44, w: (w - 70) / 2, h: h - 82 },
        { x: 22 + (w - 70) / 2 + gap, y: 44, w: (w - 70) / 2, h: h - 82 },
      ];
  const title = halfSteps === 0 ? "normalized Gibbs kernel" : `after ${halfSteps} half-steps`;
  drawCouplingMatrix(ctx, state.plan, state.row, state.col, boxes[0], title);
  drawSinkhornMarginalPanel(ctx, boxes[1], data.xs, data.a, data.b, state.row, state.col);
  const phase = halfSteps === 0 ? "initial" : halfSteps % 2 === 1 ? "row-scaled" : "column-scaled";
  setStatus(`${phase}; epsilon ${epsilon.toFixed(3)}; marginal violation ${state.error.toExponential(2)}`);
}

function drawSinkhornPotentialsPanel(ctx, box, xs, a, b, state, epsilon) {
  drawFrame(ctx, box, "dual potentials and marginals");
  const f = state.u.map((z) => epsilon * Math.log(Math.max(z, 1e-300)));
  const g = state.v.map((z) => epsilon * Math.log(Math.max(z, 1e-300)));
  const fMean = f.reduce((sum, z, i) => sum + z * a[i], 0);
  const gMean = g.reduce((sum, z, i) => sum + z * b[i], 0);
  const fp = f.map((z) => z - fMean);
  const gp = g.map((z) => z - gMean);
  const potBox = { x: box.x + 10, y: box.y + 28, w: box.w - 20, h: box.h * 0.52 };
  const densBox = { x: box.x + 10, y: box.y + box.h * 0.67, w: box.w - 20, h: box.h * 0.24 };
  const yMin = Math.min(...fp, ...gp);
  const yMax = Math.max(...fp, ...gp);
  drawCurve(ctx, xs, fp, potBox, xs[0], xs[xs.length - 1], yMin, yMax, RED, 1.9);
  drawCurve(ctx, xs, gp, potBox, xs[0], xs[xs.length - 1], yMin, yMax, BLUE, 1.9);
  const dMax = Math.max(...a, ...b, 1e-12);
  drawCurve(ctx, xs, a, densBox, xs[0], xs[xs.length - 1], 0, dMax, "rgba(215,48,39,.72)", 1.4);
  drawCurve(ctx, xs, b, densBox, xs[0], xs[xs.length - 1], 0, dMax, "rgba(33,102,172,.72)", 1.4);
  ctx.fillStyle = "rgba(251,252,253,.9)";
  ctx.fillRect(box.x + 16, box.y + 34, 118, 35);
  ctx.fillStyle = RED;
  ctx.fillText("epsilon log u", box.x + 22, box.y + 48);
  ctx.fillStyle = BLUE;
  ctx.fillText("epsilon log v", box.x + 22, box.y + 64);
}

function drawSinkhornEpsilon() {
  const n = Math.round(val("seBins"));
  const epsilon = val("seEps");
  const source = val("seSource");
  const target = val("seTarget");
  const data = sinkhornGrid(n, source, target);
  const state = sinkhornState(data.cost, data.a, data.b, epsilon, 180);
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 720 ? 620 : 392);
  const vertical = w < 720;
  const gap = 28;
  const boxes = vertical
    ? [
        { x: 22, y: 40, w: w - 44, h: (h - 98) / 2 },
        { x: 22, y: 40 + (h - 98) / 2 + gap, w: w - 44, h: (h - 98) / 2 },
      ]
    : [
        { x: 22, y: 44, w: (w - 70) / 2, h: h - 82 },
        { x: 22 + (w - 70) / 2 + gap, y: 44, w: (w - 70) / 2, h: h - 82 },
      ];
  drawCouplingMatrix(ctx, state.plan, data.a, data.b, boxes[0], `coupling, epsilon = ${epsilon.toFixed(3)}`);
  drawSinkhornPotentialsPanel(ctx, boxes[1], data.xs, data.a, data.b, state, epsilon);
  setStatus(`epsilon ${epsilon.toFixed(3)}; transport ${state.transport.toFixed(3)}; KL ${state.kl.toFixed(3)}; marginal violation ${state.error.toExponential(1)}`);
}

function softCAtoms(count, roughness) {
  const ys = Array.from({ length: count }, (_, i) => lerp(-2.35, 2.35, (i + 0.5) / count));
  const g = ys.map((y, i) => roughness * (0.34 * Math.sin(1.8 * y + 0.55) + 0.16 * Math.cos(3.2 * y - 0.4 * i)));
  const b = Array(count).fill(1 / count);
  return { ys, g, b };
}

function drawSinkhornSoftC() {
  const epsilon = val("sscEps");
  const count = Math.round(val("sscAtoms"));
  const roughness = val("sscRough");
  const { ys, g, b } = softCAtoms(count, roughness);
  const xs = Array.from({ length: 560 }, (_, i) => lerp(-3.05, 3.05, i / 559));
  const shifted = ys.map((y, j) => xs.map((x) => 0.5 * (x - y) ** 2 - g[j]));
  const hard = xs.map((_, k) => Math.min(...shifted.map((curve) => curve[k])));
  const soft = xs.map((_, k) => {
    const h = shifted.map((curve) => curve[k]);
    const mn = Math.min(...h);
    let s = 0;
    for (let j = 0; j < h.length; j += 1) s += b[j] * Math.exp(-(h[j] - mn) / Math.max(epsilon, 1e-5));
    return mn - epsilon * Math.log(Math.max(s, 1e-300));
  });
  const all = shifted.flatMap((curve) => curve.filter((_, i) => i % 8 === 0)).concat(hard, soft);
  const yMin = Math.min(...all) - 0.08;
  const yMax = Math.max(...all) + 0.08;
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 640 ? 500 : 360);
  const box = { x: 24, y: 42, w: w - 48, h: h - 76 };
  drawFrame(ctx, box, "hard and soft c-transforms");
  for (const curve of shifted) drawCurve(ctx, xs, curve, box, xs[0], xs[xs.length - 1], yMin, yMax, "rgba(95,102,112,.25)", 0.9);
  drawCurve(ctx, xs, hard, box, xs[0], xs[xs.length - 1], yMin, yMax, "#4a5563", 1.4);
  drawCurve(ctx, xs, soft, box, xs[0], xs[xs.length - 1], yMin, yMax, VIOLET, 2.35);
  const X = (x) => box.x + ((x - xs[0]) / (xs[xs.length - 1] - xs[0])) * box.w;
  const Y = (y) => box.y + box.h - ((y - yMin) / Math.max(yMax - yMin, 1e-12)) * box.h;
  ctx.fillStyle = RED;
  for (let j = 0; j < ys.length; j += 1) {
    ctx.beginPath();
    ctx.arc(X(ys[j]), Y(-g[j]), 4, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(251,252,253,.9)";
  ctx.fillRect(box.x + 9, box.y + 8, 166, 52);
  ctx.fillStyle = "#4a5563";
  ctx.fillText("gray: hard envelope", box.x + 15, box.y + 24);
  ctx.fillStyle = VIOLET;
  ctx.fillText("violet: soft minimum", box.x + 15, box.y + 40);
  ctx.fillStyle = RED;
  ctx.fillText("red: shifted atoms", box.x + 15, box.y + 56);
  setStatus(`${count} atoms; epsilon ${epsilon.toFixed(3)}; soft minimum approaches the hard envelope as epsilon decreases`);
}

function regularizerLabel(kind) {
  if (kind === "burg") return "Burg barrier";
  if (kind === "quadratic") return "quadratic penalty";
  return "KL entropy";
}

function regularizerLaw(kind, s) {
  if (kind === "burg") return 1 / Math.max(1 - Math.min(s, 0.9995), 1e-6);
  if (kind === "quadratic") return Math.max(0, 1 + s);
  return Math.exp(clamp(s, -36, 36));
}

function solveRegularizedShift(kind, terms, weights, epsilon, target) {
  const evaluate = (shift) => {
    let sum = 0;
    for (let k = 0; k < terms.length; k += 1) {
      sum += weights[k] * regularizerLaw(kind, (shift + terms[k]) / epsilon);
    }
    return sum;
  };
  let low = Math.min(...terms.map((t) => -t)) - 10 * epsilon - 8;
  let high;
  if (kind === "burg") {
    high = Math.min(...terms.map((t) => epsilon - t)) - 1e-8;
  } else {
    high = Math.max(...terms.map((t) => -t)) + 10 * epsilon + 8;
    let guard = 0;
    while (evaluate(high) < target && guard < 20) {
      high += 6 * epsilon + 1;
      guard += 1;
    }
  }
  let guard = 0;
  while (evaluate(low) > target && guard < 20) {
    low -= 6 * epsilon + 1;
    guard += 1;
  }
  for (let it = 0; it < 34; it += 1) {
    const mid = 0.5 * (low + high);
    if (evaluate(mid) < target) low = mid;
    else high = mid;
  }
  return 0.5 * (low + high);
}

function regularizedPlanState(cost, a, b, epsilon, kind, iterations) {
  const n = a.length;
  const m = b.length;
  const eps = Math.max(epsilon, 1e-4);
  const f = Array(n).fill(0);
  const g = Array(m).fill(0);
  for (let it = 0; it < iterations; it += 1) {
    for (let i = 0; i < n; i += 1) {
      const terms = cost[i].map((c, j) => g[j] - c);
      f[i] = solveRegularizedShift(kind, terms, b, eps, 1);
    }
    for (let j = 0; j < m; j += 1) {
      const terms = cost.map((row, i) => f[i] - row[j]);
      g[j] = solveRegularizedShift(kind, terms, a, eps, 1);
    }
    const center = f.reduce((sum, z, i) => sum + z * a[i], 0);
    for (let i = 0; i < n; i += 1) f[i] -= center;
    for (let j = 0; j < m; j += 1) g[j] += center;
  }
  const plan = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < m; j += 1) {
      plan[i][j] = a[i] * b[j] * regularizerLaw(kind, (f[i] + g[j] - cost[i][j]) / eps);
    }
  }
  const row = plan.map((r) => r.reduce((sum, z) => sum + z, 0));
  const col = Array(m).fill(0);
  for (let i = 0; i < n; i += 1) for (let j = 0; j < m; j += 1) col[j] += plan[i][j];
  const rowErr = row.reduce((sum, z, i) => sum + Math.abs(z - a[i]), 0);
  const colErr = col.reduce((sum, z, j) => sum + Math.abs(z - b[j]), 0);
  return { plan, row, col, error: 0.5 * (rowErr + colErr), f, g };
}

function drawRegularizerLawPanel(ctx, box, kind) {
  drawFrame(ctx, box, "pointwise density law");
  const sMin = -3;
  const sMax = kind === "burg" ? 0.965 : 2.15;
  const xs = Array.from({ length: 500 }, (_, i) => lerp(sMin, sMax, i / 499));
  const ys = xs.map((s) => Math.min(regularizerLaw(kind, s), 7.5));
  const yMax = Math.max(...ys, 1.25);
  drawCurve(ctx, xs, ys, box, sMin, sMax, 0, yMax, VIOLET, 2.2);
  const X = (x) => box.x + ((x - sMin) / (sMax - sMin)) * box.w;
  const Y = (y) => box.y + box.h - (y / Math.max(yMax, 1e-12)) * box.h;
  ctx.strokeStyle = "rgba(38,51,63,.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(box.x, Y(1));
  ctx.lineTo(box.x + box.w, Y(1));
  ctx.moveTo(X(0), box.y);
  ctx.lineTo(X(0), box.y + box.h);
  if (kind === "quadratic") {
    ctx.moveTo(X(-1), box.y);
    ctx.lineTo(X(-1), box.y + box.h);
  }
  ctx.stroke();
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(box.x + 9, box.y + 8, 178, kind === "kl" ? 34 : 50);
  ctx.fillStyle = "#26333f";
  ctx.fillText(`r = h(s), ${regularizerLabel(kind)}`, box.x + 15, box.y + 24);
  if (kind === "quadratic") {
    ctx.fillStyle = RED;
    ctx.fillText("threshold at s = -1", box.x + 15, box.y + 40);
  } else if (kind === "burg") {
    ctx.fillStyle = RED;
    ctx.fillText("barrier as s approaches 1", box.x + 15, box.y + 40);
  }
}

function drawSinkhornRegularizers() {
  const n = Math.round(val("srBins"));
  const epsilon = val("srEps");
  const kind = val("srKind");
  const source = val("srSource");
  const target = val("srTarget");
  const data = sinkhornGrid(n, source, target);
  const iterations = kind === "burg" ? 120 : 72;
  const state = kind === "kl"
    ? sinkhornState(data.cost, data.a, data.b, epsilon, 160)
    : regularizedPlanState(data.cost, data.a, data.b, epsilon, kind, iterations);
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 720 ? 610 : 390);
  const vertical = w < 720;
  const gap = 30;
  const boxes = vertical
    ? [
        { x: 22, y: 40, w: w - 44, h: (h - 100) / 2 },
        { x: 22, y: 40 + (h - 100) / 2 + gap, w: w - 44, h: (h - 100) / 2 },
      ]
    : [
        { x: 22, y: 44, w: (w - 74) / 2, h: h - 82 },
        { x: 22 + (w - 74) / 2 + gap, y: 44, w: (w - 74) / 2, h: h - 82 },
      ];
  drawRegularizerLawPanel(ctx, boxes[0], kind);
  drawCouplingMatrix(ctx, state.plan, data.a, data.b, boxes[1], `${regularizerLabel(kind)} coupling`);
  const maxMass = Math.max(...state.plan.flat(), 1e-12);
  const positive = state.plan.flat().filter((z) => z > 1e-5 * maxMass).length;
  setStatus(`${regularizerLabel(kind)}; epsilon ${epsilon.toFixed(3)}; marginal violation ${state.error.toExponential(1)}; ${positive} visible cells`);
}

function sinkhornCostForWeights(xs, a, b, epsilon) {
  const cost = xs.map((x) => xs.map((y) => (x - y) ** 2));
  const scale = medianPositive(cost);
  const normalizedCost = cost.map((row) => row.map((z) => z / Math.max(scale, 1e-12)));
  return sinkhornState(normalizedCost, a, b, epsilon, 130).value;
}

function debiasWeights(n, shift, spread) {
  const xs = Array.from({ length: n }, (_, i) => lerp(-3.15, 3.15, i / Math.max(n - 1, 1)));
  const target = discreteWeightsFromDensity(normalizedDensity(xs, { weights: [0.5, 0.5], means: [-1.0, 1.0], stds: [0.34, 0.34] }));
  const model = discreteWeightsFromDensity(normalizedDensity(xs, { weights: [0.5, 0.5], means: [-1.0 + shift, 1.0 + shift], stds: [0.34 * spread, 0.34 * spread] }));
  return { xs, model, target };
}

function drawDebiasObjectivePanel(ctx, box, epsilon, spread, shift) {
  drawFrame(ctx, box, "raw and debiased objectives");
  const shifts = Array.from({ length: 29 }, (_, i) => lerp(-1.25, 1.25, i / 28));
  const raw = [];
  const debiased = [];
  for (const s of shifts) {
    const data = debiasWeights(24, s, spread);
    const cross = sinkhornCostForWeights(data.xs, data.model, data.target, epsilon);
    const selfModel = sinkhornCostForWeights(data.xs, data.model, data.model, epsilon);
    const selfTarget = sinkhornCostForWeights(data.xs, data.target, data.target, epsilon);
    raw.push(cross);
    debiased.push(cross - 0.5 * selfModel - 0.5 * selfTarget);
  }
  const yMin = Math.min(...debiased, 0);
  const yMax = Math.max(...raw, ...debiased, 1e-6);
  drawCurve(ctx, shifts, raw, box, shifts[0], shifts[shifts.length - 1], yMin, yMax, "rgba(95,102,112,.8)", 1.75);
  drawCurve(ctx, shifts, debiased, box, shifts[0], shifts[shifts.length - 1], yMin, yMax, VIOLET, 2.2);
  const X = (x) => box.x + ((x - shifts[0]) / (shifts[shifts.length - 1] - shifts[0])) * box.w;
  ctx.strokeStyle = "rgba(215,48,39,.7)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(X(shift), box.y);
  ctx.lineTo(X(shift), box.y + box.h);
  ctx.stroke();
  ctx.fillStyle = "rgba(251,252,253,.9)";
  ctx.fillRect(box.x + 8, box.y + 8, 170, 36);
  ctx.fillStyle = "#4a5563";
  ctx.fillText("gray: raw Sinkhorn", box.x + 14, box.y + 23);
  ctx.fillStyle = VIOLET;
  ctx.fillText("violet: debiased", box.x + 14, box.y + 39);
  return { raw, debiased, shifts };
}

function drawSinkhornDebias() {
  const epsilon = val("sdEps");
  const shift = val("sdShift");
  const spread = val("sdSpread");
  const data = debiasWeights(42, shift, spread);
  const cross = sinkhornCostForWeights(data.xs, data.model, data.target, epsilon);
  const selfModel = sinkhornCostForWeights(data.xs, data.model, data.model, epsilon);
  const selfTarget = sinkhornCostForWeights(data.xs, data.target, data.target, epsilon);
  const debiased = cross - 0.5 * selfModel - 0.5 * selfTarget;
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 700 ? 560 : 360);
  const vertical = w < 700;
  const gap = 30;
  const boxes = vertical
    ? [
        { x: 24, y: 40, w: w - 48, h: (h - 100) / 2 },
        { x: 24, y: 40 + (h - 100) / 2 + gap, w: w - 48, h: (h - 100) / 2 },
      ]
    : [
        { x: 24, y: 44, w: (w - 78) / 2, h: h - 84 },
        { x: 24 + (w - 78) / 2 + gap, y: 44, w: (w - 78) / 2, h: h - 84 },
      ];
  drawFrame(ctx, boxes[0], "target and model densities");
  const dMax = Math.max(...data.model, ...data.target);
  drawCurve(ctx, data.xs, data.target, boxes[0], data.xs[0], data.xs[data.xs.length - 1], 0, dMax, BLUE, 1.9);
  drawCurve(ctx, data.xs, data.model, boxes[0], data.xs[0], data.xs[data.xs.length - 1], 0, dMax, RED, 1.9);
  ctx.fillStyle = "rgba(251,252,253,.9)";
  ctx.fillRect(boxes[0].x + 9, boxes[0].y + 8, 112, 35);
  ctx.fillStyle = BLUE;
  ctx.fillText("target beta", boxes[0].x + 15, boxes[0].y + 23);
  ctx.fillStyle = RED;
  ctx.fillText("model alpha", boxes[0].x + 15, boxes[0].y + 39);
  drawDebiasObjectivePanel(ctx, boxes[1], epsilon, spread, shift);
  setStatus(`raw ${cross.toFixed(3)}; debiased ${debiased.toFixed(3)}; epsilon ${epsilon.toFixed(3)}; model shift ${shift.toFixed(2)}`);
}

function logSumExp(values) {
  const maxv = Math.max(...values);
  let total = 0;
  for (const v of values) total += Math.exp(v - maxv);
  return maxv + Math.log(Math.max(total, 1e-300));
}

function centeredPotential(values) {
  const mean = values.reduce((a, b) => a + b, 0) / Math.max(values.length, 1);
  return values.map((v) => v - mean);
}

function continuousSinkhornFlow(cost, a, b, epsilon, flowTime) {
  const n = a.length;
  const eps = Math.max(epsilon, 1e-4);
  let f = Array(n).fill(0);
  let g = Array(n).fill(0);
  const steps = Math.max(1, Math.round(30 + 46 * flowTime));
  const dt = Math.min(0.24, flowTime / steps + 0.035);
  for (let step = 0; step < steps; step += 1) {
    const targetF = Array(n);
    for (let i = 0; i < n; i += 1) {
      const row = Array(n);
      for (let j = 0; j < n; j += 1) row[j] = (g[j] - cost[i][j]) / eps;
      targetF[i] = eps * (Math.log(Math.max(a[i], 1e-300)) - logSumExp(row));
    }
    for (let i = 0; i < n; i += 1) f[i] += dt * (targetF[i] - f[i]);
    const targetG = Array(n);
    for (let j = 0; j < n; j += 1) {
      const col = Array(n);
      for (let i = 0; i < n; i += 1) col[i] = (f[i] - cost[i][j]) / eps;
      targetG[j] = eps * (Math.log(Math.max(b[j], 1e-300)) - logSumExp(col));
    }
    for (let j = 0; j < n; j += 1) g[j] += dt * (targetG[j] - g[j]);
    const shift = f.reduce((x, y) => x + y, 0) / n;
    for (let i = 0; i < n; i += 1) f[i] -= shift;
    for (let j = 0; j < n; j += 1) g[j] += shift;
  }
  const plan = cost.map((row, i) => row.map((c, j) => Math.exp((f[i] + g[j] - c) / eps)));
  const row = plan.map((r) => r.reduce((sum, z) => sum + z, 0));
  const col = Array(n).fill(0);
  for (let i = 0; i < n; i += 1) for (let j = 0; j < n; j += 1) col[j] += plan[i][j];
  const err = 0.5 * (
    row.reduce((sum, z, i) => sum + Math.abs(z - a[i]), 0) +
    col.reduce((sum, z, j) => sum + Math.abs(z - b[j]), 0)
  );
  return { f: centeredPotential(f), g: centeredPotential(g), row, col, error: err, steps };
}

function drawContinuousSinkhorn() {
  const epsilon = val("sceEps");
  const flowTime = val("sceTime");
  const n = Math.round(val("sceBins"));
  const source = val("sceSource");
  const target = val("sceTarget");
  const data = sinkhornGrid(n, source, target);
  const state = continuousSinkhornFlow(data.cost, data.a, data.b, epsilon, flowTime);
  const exact = sinkhornState(data.cost, data.a, data.b, epsilon, 260);
  const exactF = centeredPotential(exact.u.map((u) => epsilon * Math.log(Math.max(u, 1e-300))));
  const exactG = centeredPotential(exact.v.map((v) => epsilon * Math.log(Math.max(v, 1e-300))));
  const { ctx, w, h } = resizeCanvas(455);
  const gap = 24;
  const top = { x: 22, y: 38, w: w - 44, h: 126 };
  const bottom = { x: 22, y: 38 + top.h + gap, w: w - 44, h: h - 38 - top.h - gap - 38 };
  drawFrame(ctx, top, "marginals along the flow");
  drawFrame(ctx, bottom, "dual potentials");
  const densityMax = 1.08 * Math.max(...data.a, ...data.b, ...state.row, ...state.col);
  drawCurve(ctx, data.xs, data.a, top, data.xs[0], data.xs[data.xs.length - 1], 0, densityMax, RED, 1.7);
  drawCurve(ctx, data.xs, data.b, top, data.xs[0], data.xs[data.xs.length - 1], 0, densityMax, BLUE, 1.7);
  drawCurve(ctx, data.xs, state.row, top, data.xs[0], data.xs[data.xs.length - 1], 0, densityMax, mixColor(0.45, RED, BLUE, 0.95), 2.0);
  drawCurve(ctx, data.xs, state.col, top, data.xs[0], data.xs[data.xs.length - 1], 0, densityMax, mixColor(0.75, RED, BLUE, 0.95), 2.0);
  const pMin = Math.min(...state.f, ...state.g, ...exactF, ...exactG);
  const pMax = Math.max(...state.f, ...state.g, ...exactF, ...exactG);
  drawDashedCurve(ctx, data.xs, exactF, bottom, data.xs[0], data.xs[data.xs.length - 1], pMin, pMax, RED, 1.15, [4, 4]);
  drawDashedCurve(ctx, data.xs, exactG, bottom, data.xs[0], data.xs[data.xs.length - 1], pMin, pMax, BLUE, 1.15, [4, 4]);
  drawCurve(ctx, data.xs, state.f, bottom, data.xs[0], data.xs[data.xs.length - 1], pMin, pMax, RED, 2.2);
  drawCurve(ctx, data.xs, state.g, bottom, data.xs[0], data.xs[data.xs.length - 1], pMin, pMax, BLUE, 2.2);
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(bottom.x + 8, bottom.y + 8, 205, 50);
  ctx.fillStyle = RED;
  ctx.fillText("f(t), dashed = fixed point", bottom.x + 14, bottom.y + 25);
  ctx.fillStyle = BLUE;
  ctx.fillText("g(t), same gauge", bottom.x + 14, bottom.y + 43);
  setStatus(`continuous relaxation time ${flowTime.toFixed(2)}; epsilon ${epsilon.toFixed(3)}; marginal L1 error ${state.error.toExponential(2)}`);
}

function sinkhornTrace(cost, a, b, epsilon, maxHalfSteps) {
  const n = a.length;
  const m = b.length;
  const eps = Math.max(epsilon, 1e-4);
  const K = cost.map((row) => row.map((c) => Math.exp(-c / eps)));
  const u = Array(n).fill(1);
  const v = Array(m).fill(1);
  const trace = [];
  const measure = (step) => {
    const row = Array(n).fill(0);
    const col = Array(m).fill(0);
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < m; j += 1) {
        const p = u[i] * K[i][j] * v[j];
        row[i] += p;
        col[j] += p;
      }
    }
    const rowErr = row.reduce((sum, z, i) => sum + Math.abs(z - a[i]), 0);
    const colErr = col.reduce((sum, z, j) => sum + Math.abs(z - b[j]), 0);
    trace.push({ step, error: Math.max(0.5 * (rowErr + colErr), 1e-14) });
  };
  measure(0);
  for (let step = 0; step < maxHalfSteps; step += 1) {
    if (step % 2 === 0) {
      for (let i = 0; i < n; i += 1) {
        let s = 0;
        for (let j = 0; j < m; j += 1) s += K[i][j] * v[j];
        u[i] = a[i] / Math.max(s, 1e-300);
      }
    } else {
      for (let j = 0; j < m; j += 1) {
        let s = 0;
        for (let i = 0; i < n; i += 1) s += K[i][j] * u[i];
        v[j] = b[j] / Math.max(s, 1e-300);
      }
    }
    measure(step + 1);
  }
  return trace;
}

function drawAdvancedConvergence() {
  const n = Math.round(val("sacBins"));
  const epsilon = val("sacEps");
  const halfSteps = Math.round(val("sacSteps"));
  const source = val("sacSource");
  const target = val("sacTarget");
  const data = sinkhornGrid(n, source, target);
  const trace = sinkhornTrace(data.cost, data.a, data.b, epsilon, halfSteps);
  const steps = trace.map((z) => z.step);
  const errors = trace.map((z) => z.error);
  const costFlat = data.cost.flat();
  const range = Math.max(...costFlat) - Math.min(...costFlat);
  const lambda = Math.tanh(range / (2 * Math.max(epsilon, 1e-6)));
  const linear = steps.map((s) => Math.max(errors[0] * Math.max(lambda, 1e-8) ** s, 1e-14));
  const sublinear = steps.map((s) => Math.max(errors[0] / (s + 1), 1e-14));
  const yLog = errors.concat(linear, sublinear).map((z) => Math.log10(Math.max(z, 1e-14)));
  const yMin = Math.min(...yLog) - 0.15;
  const yMax = Math.max(...yLog) + 0.15;
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 720 ? 560 : 372);
  const box = { x: 36, y: 44, w: w - 72, h: h - 88 };
  drawFrame(ctx, box, "marginal residual and rate guides");
  drawCurve(ctx, steps, errors.map((z) => Math.log10(z)), box, 0, halfSteps, yMin, yMax, VIOLET, 2.2);
  drawDashedCurve(ctx, steps, sublinear.map((z) => Math.log10(z)), box, 0, halfSteps, yMin, yMax, "#5f6670", 1.4, [5, 4]);
  drawDashedCurve(ctx, steps, linear.map((z) => Math.log10(z)), box, 0, halfSteps, yMin, yMax, BLUE, 1.4, [3, 4]);
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(box.x + 10, box.y + 9, 228, 54);
  ctx.fillStyle = VIOLET;
  ctx.fillText("violet: actual Sinkhorn residual", box.x + 16, box.y + 25);
  ctx.fillStyle = "#5f6670";
  ctx.fillText("gray: O(1/k) guide", box.x + 16, box.y + 41);
  ctx.fillStyle = BLUE;
  ctx.fillText("blue: global Hilbert bound", box.x + 16, box.y + 57);
  const lambdaText = 1 - lambda < 1e-10 ? "near 1" : lambda > 0.99995 ? `1 - ${(1 - lambda).toExponential(1)}` : lambda.toFixed(4);
  setStatus(`epsilon ${epsilon.toFixed(3)}; global Hilbert bound ${lambdaText}; final residual ${errors[errors.length - 1].toExponential(2)}`);
}

function singularValues2(mat) {
  const a = mat[0][0];
  const b = mat[0][1];
  const c = mat[1][0];
  const d = mat[1][1];
  const s1 = a * a + b * b + c * c + d * d;
  const det = (a * d - b * c) ** 2;
  const disc = Math.sqrt(Math.max(0, s1 * s1 - 4 * det));
  return [Math.sqrt(Math.max(0, 0.5 * (s1 + disc))), Math.sqrt(Math.max(0, 0.5 * (s1 - disc)))];
}

function rotateCov2(l1, l2, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [
    [l1 * c * c + l2 * s * s, (l1 - l2) * c * s],
    [(l1 - l2) * c * s, l1 * s * s + l2 * c * c],
  ];
}

function tauGaussian(epsilon, r) {
  return (Math.sqrt(epsilon * epsilon + 16 * r * r) - epsilon) / Math.max(4 * r, 1e-12);
}

function psiGaussian(epsilon, r) {
  const t = tauGaussian(epsilon, r);
  return -2 * r * t - 0.5 * epsilon * Math.log(Math.max(1 - t * t, 1e-12));
}

function drawAdvancedGaussian() {
  const epsilon = val("sagEps");
  const anisotropy = val("sagAniso");
  const angle = (Math.PI / 180) * val("sagAngle");
  const Sigma = [[anisotropy, 0], [0, 1 / anisotropy]];
  const Lambda = rotateCov2(1 / anisotropy, anisotropy, angle);
  const SigmaSqrt = sqrtSym2(Sigma);
  const LambdaSqrt = sqrtSym2(Lambda);
  const singular = singularValues2(matMul2(SigmaSqrt, LambdaSqrt));
  const selfSigma = eigSym2(Sigma).values;
  const selfLambda = eigSym2(Lambda).values;
  const smoothBures = singular.reduce((sum, r) => sum + psiGaussian(epsilon, r), 0)
    - 0.5 * selfSigma.reduce((sum, r) => sum + psiGaussian(epsilon, r), 0)
    - 0.5 * selfLambda.reduce((sum, r) => sum + psiGaussian(epsilon, r), 0);
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 720 ? 580 : 382);
  const vertical = w < 720;
  const gap = 30;
  const boxes = vertical
    ? [
        { x: 30, y: 42, w: w - 60, h: (h - 104) / 2 },
        { x: 30, y: 42 + (h - 104) / 2 + gap, w: w - 60, h: (h - 104) / 2 },
      ]
    : [
        { x: 30, y: 46, w: (w - 90) / 2, h: h - 86 },
        { x: 30 + (w - 90) / 2 + gap, y: 46, w: (w - 90) / 2, h: h - 86 },
      ];
  drawFrame(ctx, boxes[0], "Gaussian covariance geometry");
  const lim = { xmin: -3.2, xmax: 3.2, ymin: -3.2, ymax: 3.2 };
  drawCovEllipse(ctx, [-0.55, 0], Sigma, boxes[0], lim, "rgba(215,48,39,1)", 2, 0.18);
  drawCovEllipse(ctx, [0.55, 0], Lambda, boxes[0], lim, "rgba(33,102,172,1)", 2, 0.18);
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(boxes[0].x + 10, boxes[0].y + 10, 150, 38);
  ctx.fillStyle = RED;
  ctx.fillText("source covariance", boxes[0].x + 16, boxes[0].y + 26);
  ctx.fillStyle = BLUE;
  ctx.fillText("target covariance", boxes[0].x + 16, boxes[0].y + 42);
  drawFrame(ctx, boxes[1], "singular-value shrinkage");
  const rs = Array.from({ length: 360 }, (_, i) => lerp(0.05, 3.2, i / 359));
  const taus = rs.map((r) => tauGaussian(epsilon, r));
  drawCurve(ctx, rs, taus, boxes[1], 0.05, 3.2, 0, 1.02, VIOLET, 2.2);
  const X = (x) => boxes[1].x + ((x - 0.05) / (3.2 - 0.05)) * boxes[1].w;
  const Y = (y) => boxes[1].y + boxes[1].h - (y / 1.02) * boxes[1].h;
  ctx.fillStyle = RED;
  for (const r of singular) {
    ctx.beginPath();
    ctx.arc(X(r), Y(tauGaussian(epsilon, r)), 4.5, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(boxes[1].x + 10, boxes[1].y + 9, 176, 38);
  ctx.fillStyle = "#26333f";
  ctx.fillText("curve: tau_epsilon(r)", boxes[1].x + 16, boxes[1].y + 25);
  ctx.fillStyle = RED;
  ctx.fillText("dots: covariance modes", boxes[1].x + 16, boxes[1].y + 41);
  setStatus(`epsilon ${epsilon.toFixed(3)}; modes ${singular.map((r) => r.toFixed(2)).join(", ")}; debiased covariance term ${smoothBures.toFixed(3)}`);
}

function drawAdvancedSamples() {
  const dimension = Math.round(val("sasDim"));
  const epsilon = val("sasEps");
  const nMax = Math.round(val("sasNmax"));
  const ns = Array.from({ length: 80 }, (_, i) => Math.round(Math.exp(lerp(Math.log(32), Math.log(nMax), i / 79))));
  const exact = ns.map((n) => Math.pow(n, -1 / Math.max(dimension, 1)));
  const mmd = ns.map((n) => 0.55 * Math.pow(n, -0.5));
  const sinkhorn = ns.map((n) => epsilon + 0.018 * Math.pow(0.18 / epsilon, dimension / 2) * Math.pow(n, -0.5));
  const all = exact.concat(mmd, sinkhorn).map((z) => Math.max(z, 1e-5));
  const yMin = Math.log10(Math.min(...all)) - 0.1;
  const yMax = Math.log10(Math.max(...all)) + 0.12;
  const xs = ns.map((n) => Math.log10(n));
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 650 ? 500 : 360);
  const box = { x: 42, y: 42, w: w - 84, h: h - 82 };
  drawFrame(ctx, box, "statistical scaling guides");
  drawCurve(ctx, xs, exact.map((z) => Math.log10(z)), box, xs[0], xs[xs.length - 1], yMin, yMax, RED, 2.1);
  drawCurve(ctx, xs, mmd.map((z) => Math.log10(z)), box, xs[0], xs[xs.length - 1], yMin, yMax, BLUE, 2.1);
  drawCurve(ctx, xs, sinkhorn.map((z) => Math.log10(z)), box, xs[0], xs[xs.length - 1], yMin, yMax, VIOLET, 2.35);
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(box.x + 10, box.y + 9, 220, 54);
  ctx.fillStyle = RED;
  ctx.fillText("red: exact OT n^{-1/d}", box.x + 16, box.y + 25);
  ctx.fillStyle = BLUE;
  ctx.fillText("blue: MMD n^{-1/2}", box.x + 16, box.y + 41);
  ctx.fillStyle = VIOLET;
  ctx.fillText("violet: Sinkhorn bias + variance", box.x + 16, box.y + 57);
  setStatus(`dimension ${dimension}; epsilon ${epsilon.toFixed(3)}; Sinkhorn guide is bias floor epsilon plus an epsilon-dependent parametric fluctuation`);
}

function unbalancedState(cost, a, b, epsilon, tau, iterations) {
  const n = a.length;
  const m = b.length;
  const eps = Math.max(epsilon, 1e-4);
  const relaxedTau = Math.max(tau, 1e-4);
  const rho = relaxedTau / (relaxedTau + eps);
  const K = cost.map((row, i) => row.map((c, j) => a[i] * b[j] * Math.exp(-c / eps)));
  const u = Array(n).fill(1);
  const v = Array(m).fill(1);
  for (let it = 0; it < iterations; it += 1) {
    for (let i = 0; i < n; i += 1) {
      let s = 0;
      for (let j = 0; j < m; j += 1) s += K[i][j] * v[j];
      u[i] = Math.max(a[i] / Math.max(s, 1e-300), 1e-300) ** rho;
    }
    for (let j = 0; j < m; j += 1) {
      let s = 0;
      for (let i = 0; i < n; i += 1) s += K[i][j] * u[i];
      v[j] = Math.max(b[j] / Math.max(s, 1e-300), 1e-300) ** rho;
    }
  }
  const plan = K.map((row, i) => row.map((k, j) => u[i] * k * v[j]));
  const row = plan.map((r) => r.reduce((sum, z) => sum + z, 0));
  const col = Array(m).fill(0);
  for (let i = 0; i < n; i += 1) for (let j = 0; j < m; j += 1) col[j] += plan[i][j];
  let transport = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < m; j += 1) transport += plan[i][j] * cost[i][j];
  }
  const mass = plan.flat().reduce((sum, z) => sum + z, 0);
  const destroyed = a.reduce((sum, z, i) => sum + Math.max(z - row[i], 0), 0);
  const created = b.reduce((sum, z, j) => sum + Math.max(z - col[j], 0), 0);
  const mismatch = 0.5 * (
    row.reduce((sum, z, i) => sum + Math.abs(z - a[i]), 0) +
    col.reduce((sum, z, j) => sum + Math.abs(z - b[j]), 0)
  );
  return { K, u, v, plan, row, col, mass, destroyed, created, mismatch, rho, transport };
}

function drawGeneralizedUnbalanced() {
  const n = Math.round(val("guBins"));
  const epsilon = val("guEps");
  const tau = val("guTau");
  const shift = val("guShift");
  const source = val("guSource");
  const target = val("guTarget");
  const data = sinkhornGrid(n, source, target, shift, 1);
  const state = unbalancedState(data.cost, data.a, data.b, epsilon, tau, 100);
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 720 ? 640 : 400);
  const vertical = w < 720;
  const gap = 30;
  const boxes = vertical
    ? [
        { x: 22, y: 40, w: w - 44, h: (h - 100) / 2 },
        { x: 22, y: 40 + (h - 100) / 2 + gap, w: w - 44, h: (h - 100) / 2 },
      ]
    : [
        { x: 22, y: 44, w: (w - 74) / 2, h: h - 84 },
        { x: 22 + (w - 74) / 2 + gap, y: 44, w: (w - 74) / 2, h: h - 84 },
  ];
  drawCouplingMatrix(ctx, state.plan, state.row, state.col, boxes[0], "relaxed coupling");
  drawSinkhornMarginalPanel(ctx, boxes[1], data.xs, data.a, data.b, state.row, state.col);
  setStatus(`tau ${tau.toFixed(3)}; rho ${state.rho.toFixed(3)}; transported ${state.mass.toFixed(3)}; destroyed ${state.destroyed.toFixed(3)}; created ${state.created.toFixed(3)}`);
}

function generalizedShape(name, n, random) {
  if (name === "heart") return sampleHeart(n, random);
  return sampleCloud(name, n, random);
}

function projectionAssignment(source, target, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  const ux = Math.cos(theta);
  const uy = Math.sin(theta);
  const sp = source.map((p, i) => ({ i, z: ux * p[0] + uy * p[1] })).sort((a, b) => a.z - b.z || a.i - b.i);
  const tp = target.map((p, i) => ({ i, z: ux * p[0] + uy * p[1] })).sort((a, b) => a.z - b.z || a.i - b.i);
  const assignment = Array(source.length);
  let projectedCost = 0;
  let liftedCost = 0;
  for (let r = 0; r < source.length; r += 1) {
    const i = sp[r].i;
    const j = tp[r].i;
    assignment[i] = j;
    projectedCost += (sp[r].z - tp[r].z) ** 2;
    liftedCost += (source[i][0] - target[j][0]) ** 2 + (source[i][1] - target[j][1]) ** 2;
  }
  return {
    assignment,
    angle: angleDeg,
    projectedCost: projectedCost / Math.max(source.length, 1),
    liftedCost: liftedCost / Math.max(source.length, 1),
  };
}

function bestProjectionAssignment(source, target, mode, manualAngle) {
  if (mode === "manual") return projectionAssignment(source, target, manualAngle);
  let best = null;
  for (let k = 0; k < 72; k += 1) {
    const candidate = projectionAssignment(source, target, (180 * k) / 72);
    const score = mode === "max_projected" ? -candidate.projectedCost : candidate.liftedCost;
    if (!best || score < best.score) best = { ...candidate, score };
  }
  return best;
}

function assignmentQuadraticCost(source, target, assignment) {
  let total = 0;
  for (let i = 0; i < source.length; i += 1) {
    const q = target[assignment[i]];
    total += (source[i][0] - q[0]) ** 2 + (source[i][1] - q[1]) ** 2;
  }
  return total / Math.max(source.length, 1);
}

function exactAssignment(source, target) {
  return hungarian(costMatrix(source, target, 2));
}

function drawDirectionAxis(ctx, box, lim, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  const r = 0.48 * Math.max(lim.xmax - lim.xmin, lim.ymax - lim.ymin);
  const p0 = [-r * Math.cos(theta), -r * Math.sin(theta)];
  const p1 = [r * Math.cos(theta), r * Math.sin(theta)];
  const X = (p) => box.x + ((p[0] - lim.xmin) / (lim.xmax - lim.xmin)) * box.w;
  const Y = (p) => box.y + box.h - ((p[1] - lim.ymin) / (lim.ymax - lim.ymin)) * box.h;
  ctx.strokeStyle = "rgba(27,158,119,.9)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(X(p0), Y(p0));
  ctx.lineTo(X(p1), Y(p1));
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawProjectedQuantilePanel(ctx, source, target, assignmentData, box) {
  drawFrame(ctx, box, "projected matching");
  const theta = (assignmentData.angle * Math.PI) / 180;
  const ux = Math.cos(theta);
  const uy = Math.sin(theta);
  const pairs = source.map((p, i) => ({
    s: ux * p[0] + uy * p[1],
    t: ux * target[assignmentData.assignment[i]][0] + uy * target[assignmentData.assignment[i]][1],
    i,
  })).sort((a, b) => a.s - b.s || a.i - b.i);
  const vals = pairs.flatMap((p) => [p.s, p.t]);
  const xMin = Math.min(...vals) - 0.08;
  const xMax = Math.max(...vals) + 0.08;
  const X = (x) => box.x + 14 + ((x - xMin) / Math.max(xMax - xMin, 1e-12)) * (box.w - 28);
  const y0 = box.y + 0.34 * box.h;
  const y1 = box.y + 0.72 * box.h;
  ctx.strokeStyle = "#e5e9ef";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(box.x + 14, y0);
  ctx.lineTo(box.x + box.w - 14, y0);
  ctx.moveTo(box.x + 14, y1);
  ctx.lineTo(box.x + box.w - 14, y1);
  ctx.stroke();
  for (let r = 0; r < pairs.length; r += 1) {
    ctx.strokeStyle = "rgba(123,50,148,.32)";
    ctx.lineWidth = 0.55;
    ctx.beginPath();
    ctx.moveTo(X(pairs[r].s), y0);
    ctx.lineTo(X(pairs[r].t), y1);
    ctx.stroke();
  }
  ctx.fillStyle = RED;
  for (const pair of pairs) {
    ctx.beginPath();
    ctx.arc(X(pair.s), y0, 2.4, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = BLUE;
  for (const pair of pairs) {
    ctx.beginPath();
    ctx.arc(X(pair.t), y1, 2.4, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(box.x + 10, box.y + 10, 128, 34);
  ctx.fillStyle = RED;
  ctx.fillText("source shadow", box.x + 16, box.y + 25);
  ctx.fillStyle = BLUE;
  ctx.fillText("target shadow", box.x + 16, box.y + 41);
}

function drawGeneralizedSliced() {
  const n = Math.round(val("gsPoints"));
  const angle = val("gsAngle");
  const mode = val("gsMode");
  const sourceName = val("gsSource");
  const targetName = val("gsTarget");
  const seed = Math.round(val("gsSeed"));
  const random = rng(seed);
  const source = generalizedShape(sourceName, n, random);
  const target = generalizedShape(targetName, n, random);
  const sliced = bestProjectionAssignment(source, target, mode, angle);
  const exact = exactAssignment(source, target);
  const exactCost = assignmentQuadraticCost(source, target, exact);
  const lim = limits(source.concat(target));
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 760 ? 720 : 410);
  const vertical = w < 760;
  const gap = 22;
  const boxes = vertical
    ? [
        { x: 22, y: 42, w: w - 44, h: (h - 118) / 3 },
        { x: 22, y: 42 + (h - 118) / 3 + gap, w: w - 44, h: (h - 118) / 3 },
        { x: 22, y: 42 + 2 * ((h - 118) / 3 + gap), w: w - 44, h: (h - 118) / 3 },
      ]
    : [
        { x: 18, y: 48, w: (w - 72) / 3, h: h - 84 },
        { x: 18 + (w - 72) / 3 + gap, y: 48, w: (w - 72) / 3, h: h - 84 },
        { x: 18 + 2 * ((w - 72) / 3 + gap), y: 48, w: (w - 72) / 3, h: h - 84 },
      ];
  drawPairedMapPanel(ctx, source, target, sliced.assignment, boxes[0], lim, `slice ${sliced.angle.toFixed(1)} deg`, 0.25);
  drawDirectionAxis(ctx, boxes[0], lim, sliced.angle);
  drawProjectedQuantilePanel(ctx, source, target, sliced, boxes[1]);
  drawPairedMapPanel(ctx, source, target, exact, boxes[2], lim, "quadratic W2 plan", 0.25);
  const ratio = sliced.liftedCost / Math.max(exactCost, 1e-12);
  setStatus(`angle ${sliced.angle.toFixed(1)} deg; projected cost ${sliced.projectedCost.toFixed(3)}; lifted cost ${sliced.liftedCost.toFixed(3)}; lifted/exact ${ratio.toFixed(2)}`);
}

function drawLinearOTMaps(ctx, box, qRef, qA, qB, qBar, t) {
  drawFrame(ctx, box, "maps from reference");
  const all = qRef.concat(qA, qB, qBar);
  const xMin = Math.min(...qRef) - 0.12;
  const xMax = Math.max(...qRef) + 0.12;
  const yMin = Math.min(...all) - 0.12;
  const yMax = Math.max(...all) + 0.12;
  const X = (x) => box.x + ((x - xMin) / Math.max(xMax - xMin, 1e-12)) * box.w;
  const Y = (y) => box.y + box.h - ((y - yMin) / Math.max(yMax - yMin, 1e-12)) * box.h;
  ctx.strokeStyle = "rgba(95,102,112,.28)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(X(xMin), Y(xMin));
  ctx.lineTo(X(xMax), Y(xMax));
  ctx.stroke();
  function curve(ys, color, width) {
    ctx.beginPath();
    for (let i = 0; i < qRef.length; i += 1) {
      const x = X(qRef[i]);
      const y = Y(ys[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }
  curve(qA, RED, 1.45);
  curve(qB, BLUE, 1.45);
  curve(qBar, mixColor(t, RED, BLUE, 1), 2.35);
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(box.x + 10, box.y + 10, 150, 52);
  ctx.fillStyle = RED;
  ctx.fillText("T_alpha", box.x + 16, box.y + 26);
  ctx.fillStyle = BLUE;
  ctx.fillText("T_beta", box.x + 16, box.y + 42);
  ctx.fillStyle = mixColor(t, RED, BLUE, 1);
  ctx.fillText("averaged map", box.x + 16, box.y + 58);
}

function drawLinearOTDensities(ctx, box, xs, refPdf, aPdf, bPdf) {
  drawFrame(ctx, box, "reference and targets");
  const yMax = Math.max(...refPdf, ...aPdf, ...bPdf) * 1.08;
  drawCurve(ctx, xs, refPdf, box, xs[0], xs[xs.length - 1], 0, yMax, "#5f6670", 1.5);
  drawCurve(ctx, xs, aPdf, box, xs[0], xs[xs.length - 1], 0, yMax, RED, 1.65);
  drawCurve(ctx, xs, bPdf, box, xs[0], xs[xs.length - 1], 0, yMax, BLUE, 1.65);
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(box.x + 10, box.y + 10, 126, 52);
  ctx.fillStyle = "#5f6670";
  ctx.fillText("rho", box.x + 16, box.y + 26);
  ctx.fillStyle = RED;
  ctx.fillText("alpha", box.x + 16, box.y + 42);
  ctx.fillStyle = BLUE;
  ctx.fillText("beta", box.x + 16, box.y + 58);
}

function drawLinearOTBarycenter(ctx, box, xs, aPdf, bPdf, qBar, t) {
  drawFrame(ctx, box, `linear barycenter t = ${t.toFixed(2)}`);
  const hist = histogramCurve(qBar, xs[0], xs[xs.length - 1], 90);
  const yMax = Math.max(...hist.ys, ...aPdf, ...bPdf) * 1.08;
  drawCurve(ctx, xs, aPdf, box, xs[0], xs[xs.length - 1], 0, yMax, "rgba(215,48,39,.35)", 1.1);
  drawCurve(ctx, xs, bPdf, box, xs[0], xs[xs.length - 1], 0, yMax, "rgba(33,102,172,.35)", 1.1);
  drawCurve(ctx, hist.xs, hist.ys, box, xs[0], xs[xs.length - 1], 0, yMax, mixColor(t, RED, BLUE, 1), 2.3);
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(box.x + 10, box.y + 10, 158, 36);
  ctx.fillStyle = mixColor(t, RED, BLUE, 1);
  ctx.fillText("pushforward of averaged map", box.x + 16, box.y + 27);
  ctx.fillStyle = "#5f6670";
  ctx.fillText("faint: endpoints", box.x + 16, box.y + 43);
}

function drawGeneralizedLinearOT() {
  const t = val("glotT");
  const levels = Math.round(val("glotLevels"));
  const refName = val("glotRef");
  const alphaName = val("glotAlpha");
  const betaName = val("glotBeta");
  const xMin = -3.35;
  const xMax = 3.35;
  const xs = Array.from({ length: 760 }, (_, i) => lerp(xMin, xMax, i / 759));
  const refPdf = xs.map((x) => mixPdf(refName, x));
  const aPdf = xs.map((x) => mixPdf(alphaName, x));
  const bPdf = xs.map((x) => mixPdf(betaName, x));
  const qRef = inverseCdfSamples(xs, refPdf, levels);
  const qA = inverseCdfSamples(xs, aPdf, levels);
  const qB = inverseCdfSamples(xs, bPdf, levels);
  const qBar = qA.map((x, i) => lerp(x, qB[i], t));
  const lot2 = qA.reduce((sum, x, i) => sum + (x - qB[i]) ** 2, 0) / Math.max(levels, 1);
  const baryMean = qBar.reduce((sum, x) => sum + x, 0) / Math.max(levels, 1);
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 760 ? 720 : 410);
  const vertical = w < 760;
  const gap = 22;
  const boxes = vertical
    ? [
        { x: 22, y: 42, w: w - 44, h: (h - 118) / 3 },
        { x: 22, y: 42 + (h - 118) / 3 + gap, w: w - 44, h: (h - 118) / 3 },
        { x: 22, y: 42 + 2 * ((h - 118) / 3 + gap), w: w - 44, h: (h - 118) / 3 },
      ]
    : [
        { x: 18, y: 48, w: (w - 72) / 3, h: h - 84 },
        { x: 18 + (w - 72) / 3 + gap, y: 48, w: (w - 72) / 3, h: h - 84 },
        { x: 18 + 2 * ((w - 72) / 3 + gap), y: 48, w: (w - 72) / 3, h: h - 84 },
      ];
  drawLinearOTDensities(ctx, boxes[0], xs, refPdf, aPdf, bPdf);
  drawLinearOTMaps(ctx, boxes[1], qRef, qA, qB, qBar, t);
  drawLinearOTBarycenter(ctx, boxes[2], xs, aPdf, bPdf, qBar, t);
  setStatus(`LOT distance ${Math.sqrt(lot2).toFixed(3)}; averaged map weight t = ${t.toFixed(2)}; barycenter mean ${baryMean.toFixed(3)}`);
}

function covarianceForAssignment(source, target, assignment) {
  const M = [[0, 0], [0, 0]];
  const displacements = [];
  for (let i = 0; i < source.length; i += 1) {
    const q = target[assignment[i]];
    const dx = source[i][0] - q[0];
    const dy = source[i][1] - q[1];
    displacements.push([dx, dy]);
    M[0][0] += dx * dx;
    M[0][1] += dx * dy;
    M[1][1] += dy * dy;
  }
  const inv = 1 / Math.max(source.length, 1);
  M[0][0] *= inv;
  M[0][1] *= inv;
  M[1][0] = M[0][1];
  M[1][1] *= inv;
  return { M, displacements };
}

function spectralGaugeValue(M, gauge, weight) {
  const eig = eigSym2(M);
  const l1 = eig.values[0];
  const l2 = eig.values[1];
  if (gauge === "lambda_max") return l1;
  if (gauge === "weighted") return l1 + weight * l2;
  return l1 + l2;
}

function spectralAssignment(source, target, gauge, weight, planMode, manualAngle) {
  if (planMode === "manual_slice") {
    const data = projectionAssignment(source, target, manualAngle);
    const cov = covarianceForAssignment(source, target, data.assignment);
    return { ...data, ...cov, value: spectralGaugeValue(cov.M, gauge, weight), label: "manual slice" };
  }
  if (gauge === "trace") {
    const assignment = exactAssignment(source, target);
    const cov = covarianceForAssignment(source, target, assignment);
    return {
      assignment,
      angle: null,
      projectedCost: 0,
      liftedCost: assignmentQuadraticCost(source, target, assignment),
      ...cov,
      value: spectralGaugeValue(cov.M, gauge, weight),
      label: "trace plan",
    };
  }
  let best = null;
  for (let k = 0; k < 90; k += 1) {
    const data = projectionAssignment(source, target, (180 * k) / 90);
    const cov = covarianceForAssignment(source, target, data.assignment);
    const value = spectralGaugeValue(cov.M, gauge, weight);
    if (!best || value < best.value) best = { ...data, ...cov, value, label: "spectral sweep" };
  }
  return best;
}

function drawCovarianceGaugePanel(ctx, box, M, gauge, weight) {
  drawFrame(ctx, box, "displacement covariance");
  const eig = eigSym2(M);
  const lim = { xmin: -1.4, xmax: 1.4, ymin: -1.4, ymax: 1.4 };
  drawCovEllipse(ctx, [0, 0], M, box, lim, "rgba(123,50,148,1)", 2.4, 0.88);
  const maxEig = Math.max(eig.values[0], eig.values[1], 1e-12);
  const barX = box.x + box.w - 82;
  const barY = box.y + 22;
  const barW = 22;
  const barH = Math.min(88, box.h - 58);
  ctx.fillStyle = "rgba(251,252,253,.94)";
  ctx.fillRect(barX - 12, barY - 12, 78, barH + 44);
  for (let k = 0; k < 2; k += 1) {
    const h = (eig.values[k] / maxEig) * barH;
    ctx.fillStyle = k === 0 ? VIOLET : "rgba(123,50,148,.42)";
    ctx.fillRect(barX + k * 30, barY + barH - h, barW, h);
    ctx.strokeStyle = "#d8dee8";
    ctx.strokeRect(barX + k * 30, barY, barW, barH);
  }
  ctx.fillStyle = "#26333f";
  ctx.fillText("lambda1", barX - 6, barY + barH + 17);
  ctx.fillText("lambda2", barX + 24, barY + barH + 33);
  const label = gauge === "weighted" ? `l1 + ${weight.toFixed(2)} l2` : pretty(gauge);
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(box.x + 10, box.y + 10, 146, 34);
  ctx.fillStyle = VIOLET;
  ctx.fillText(label, box.x + 16, box.y + 26);
  ctx.fillStyle = "#4a5563";
  ctx.fillText(`value ${spectralGaugeValue(M, gauge, weight).toFixed(3)}`, box.x + 16, box.y + 42);
}

function drawGeneralizedSpectral() {
  const n = Math.round(val("gwPoints"));
  const t = val("gwT");
  const angle = val("gwAngle");
  const gauge = val("gwGauge");
  const weight = val("gwWeight");
  const planMode = val("gwPlan");
  const seed = Math.round(val("gwSeed"));
  const random = rng(seed);
  const source = generalizedShape("two_blobs", n, random).map((p) => [p[0] - 0.22, p[1] + 0.06]);
  const target = generalizedShape("heart", n, random).map((p) => [p[0] + 0.24, p[1] - 0.03]);
  const plan = spectralAssignment(source, target, gauge, weight, planMode, angle);
  const current = interpolateAssigned(source, target, plan.assignment, t);
  const lim = limits(source.concat(target, current));
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 760 ? 720 : 410);
  const vertical = w < 760;
  const gap = 22;
  const boxes = vertical
    ? [
        { x: 22, y: 42, w: w - 44, h: (h - 118) / 3 },
        { x: 22, y: 42 + (h - 118) / 3 + gap, w: w - 44, h: (h - 118) / 3 },
        { x: 22, y: 42 + 2 * ((h - 118) / 3 + gap), w: w - 44, h: (h - 118) / 3 },
      ]
    : [
        { x: 18, y: 48, w: (w - 72) / 3, h: h - 84 },
        { x: 18 + (w - 72) / 3 + gap, y: 48, w: (w - 72) / 3, h: h - 84 },
        { x: 18 + 2 * ((w - 72) / 3 + gap), y: 48, w: (w - 72) / 3, h: h - 84 },
      ];
  drawPairedMapPanel(ctx, source, target, plan.assignment, boxes[0], lim, plan.label, 0.25);
  if (plan.angle !== null) drawDirectionAxis(ctx, boxes[0], lim, plan.angle);
  drawScatterPanel(ctx, current, boxes[1], lim, (i) => mixColor(t, RED, BLUE, 0.88), `interpolation t = ${t.toFixed(2)}`, 3.2);
  drawCovarianceGaugePanel(ctx, boxes[2], plan.M, gauge, weight);
  const eig = eigSym2(plan.M).values;
  const angleText = plan.angle === null ? "exact trace" : `${plan.angle.toFixed(1)} deg`;
  setStatus(`${pretty(gauge)} gauge ${plan.value.toFixed(3)}; eigenvalues ${eig[0].toFixed(3)}, ${eig[1].toFixed(3)}; plan ${angleText}`);
}

function barycenterWeights(u, v) {
  return [(1 - u) * (1 - v), u * (1 - v), (1 - u) * v, u * v];
}

function drawOtProblemsBarycenter() {
  const u = val("opbU");
  const v = val("opbV");
  const levels = Math.round(val("opbLevels"));
  const cornerNames = ["one", "two", "wide_two", "three"];
  const colors = ["#5f6670", RED, BLUE, VIOLET];
  const weights = barycenterWeights(u, v);
  const xMin = -3.35;
  const xMax = 3.35;
  const xs = Array.from({ length: 760 }, (_, i) => lerp(xMin, xMax, i / 759));
  const pdfs = cornerNames.map((name) => xs.map((x) => mixPdf(name, x)));
  const quantiles = pdfs.map((pdf) => inverseCdfSamples(xs, pdf, levels));
  const qGrid = Array.from({ length: levels }, (_, i) => (i + 0.5) / levels);
  const qBar = Array(levels).fill(0);
  for (let s = 0; s < quantiles.length; s += 1) {
    for (let i = 0; i < levels; i += 1) qBar[i] += weights[s] * quantiles[s][i];
  }
  const baryHist = histogramCurve(qBar, xMin, xMax, 96);
  const yMax = Math.max(...pdfs.flat(), ...baryHist.ys) * 1.08;
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 760 ? 720 : 410);
  const vertical = w < 760;
  const gap = 22;
  const boxes = vertical
    ? [
        { x: 22, y: 42, w: w - 44, h: (h - 118) / 3 },
        { x: 22, y: 42 + (h - 118) / 3 + gap, w: w - 44, h: (h - 118) / 3 },
        { x: 22, y: 42 + 2 * ((h - 118) / 3 + gap), w: w - 44, h: (h - 118) / 3 },
      ]
    : [
        { x: 18, y: 48, w: (w - 72) / 3, h: h - 84 },
        { x: 18 + (w - 72) / 3 + gap, y: 48, w: (w - 72) / 3, h: h - 84 },
        { x: 18 + 2 * ((w - 72) / 3 + gap), y: 48, w: (w - 72) / 3, h: h - 84 },
      ];
  drawFrame(ctx, boxes[0], "four input densities");
  for (let s = 0; s < pdfs.length; s += 1) drawCurve(ctx, xs, pdfs[s], boxes[0], xMin, xMax, 0, yMax, colors[s], 1.5);
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(boxes[0].x + 10, boxes[0].y + 10, 154, 68);
  for (let s = 0; s < cornerNames.length; s += 1) {
    ctx.fillStyle = colors[s];
    ctx.fillText(`${pretty(cornerNames[s])}: ${weights[s].toFixed(2)}`, boxes[0].x + 16, boxes[0].y + 26 + 16 * s);
  }

  drawFrame(ctx, boxes[1], "averaged quantiles");
  for (let s = 0; s < quantiles.length; s += 1) drawCurve(ctx, qGrid, quantiles[s], boxes[1], 0, 1, xMin, xMax, colors[s], 1.1);
  drawCurve(ctx, qGrid, qBar, boxes[1], 0, 1, xMin, xMax, mixColor(0.5 * (u + v), RED, BLUE, 1), 2.45);

  drawFrame(ctx, boxes[2], "barycenter density");
  const faint = ["rgba(95,102,112,.28)", "rgba(215,48,39,.24)", "rgba(33,102,172,.24)", "rgba(123,50,148,.24)"];
  for (let s = 0; s < pdfs.length; s += 1) drawCurve(ctx, xs, pdfs[s], boxes[2], xMin, xMax, 0, yMax, faint[s], 0.9);
  drawCurve(ctx, baryHist.xs, baryHist.ys, boxes[2], xMin, xMax, 0, yMax, mixColor(0.5 * (u + v), RED, BLUE, 1), 2.35);
  const mean = qBar.reduce((sum, z) => sum + z, 0) / Math.max(levels, 1);
  setStatus(`corner weights ${weights.map((z) => z.toFixed(2)).join(", ")}; quantile levels ${levels}; barycenter mean ${mean.toFixed(3)}`);
}

function weightedCovariance(covs, weights) {
  let out = [[0, 0], [0, 0]];
  for (let k = 0; k < covs.length; k += 1) out = matAdd2(out, matScale2(covs[k], weights[k]));
  return out;
}

function buresBarycenterCov(covs, weights) {
  let S = weightedCovariance(covs, weights);
  for (let it = 0; it < 42; it += 1) {
    const sqrtS = sqrtSym2(S);
    let next = [[0, 0], [0, 0]];
    for (let k = 0; k < covs.length; k += 1) {
      const middle = matMul2(matMul2(sqrtS, covs[k]), sqrtS);
      next = matAdd2(next, matScale2(sqrtSym2(middle), weights[k]));
    }
    S = next;
  }
  return S;
}

function gaussianBarycenterCorners(anisotropy, angle) {
  return [
    covarianceFromAxes(-angle, 0.34, 0.22),
    covarianceFromAxes(angle, 0.24 * anisotropy, 0.16),
    covarianceFromAxes(90 - angle, 0.2, 0.26 * anisotropy),
    covarianceFromAxes(35 + 0.35 * angle, 0.3 * anisotropy, 0.18),
  ];
}

function drawCovCollection(ctx, box, covs) {
  drawFrame(ctx, box, "corner covariances");
  const centers = [[-0.72, -0.52], [0.72, -0.52], [-0.72, 0.52], [0.72, 0.52]];
  const colors = ["rgba(95,102,112,1)", "rgba(215,48,39,1)", "rgba(33,102,172,1)", "rgba(123,50,148,1)"];
  const lim = { xmin: -1.45, xmax: 1.45, ymin: -1.15, ymax: 1.15 };
  for (let k = 0; k < covs.length; k += 1) drawCovEllipse(ctx, centers[k], covs[k], box, lim, colors[k], 1.6, 0.62);
}

function drawBaryCovPanel(ctx, box, cov, euc, title) {
  drawFrame(ctx, box, title);
  const lim = { xmin: -1.45, xmax: 1.45, ymin: -1.15, ymax: 1.15 };
  drawCovEllipse(ctx, [0, 0], euc, box, lim, "rgba(95,102,112,1)", 1.3, 0.32);
  drawCovEllipse(ctx, [0, 0], cov, box, lim, "rgba(123,50,148,1)", 2.5, 0.86);
  ctx.fillStyle = "rgba(251,252,253,.92)";
  ctx.fillRect(box.x + 10, box.y + 10, 174, 36);
  ctx.fillStyle = "#5f6670";
  ctx.fillText("gray: Euclidean average", box.x + 16, box.y + 26);
  ctx.fillStyle = VIOLET;
  ctx.fillText("violet: Bures barycenter", box.x + 16, box.y + 42);
}

function drawOtProblemsGaussianBarycenter() {
  const u = val("opgU");
  const v = val("opgV");
  const anisotropy = val("opgAniso");
  const angle = val("opgAngle");
  const weights = barycenterWeights(u, v);
  const covs = gaussianBarycenterCorners(anisotropy, angle);
  const euc = weightedCovariance(covs, weights);
  const bures = buresBarycenterCov(covs, weights);
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 760 ? 700 : 390);
  const vertical = w < 760;
  const gap = 24;
  const boxes = vertical
    ? [
        { x: 24, y: 40, w: w - 48, h: (h - 98) / 2 },
        { x: 24, y: 40 + (h - 98) / 2 + gap, w: w - 48, h: (h - 98) / 2 },
      ]
    : [
        { x: 22, y: 44, w: (w - 72) / 2, h: h - 82 },
        { x: 22 + (w - 72) / 2 + gap, y: 44, w: (w - 72) / 2, h: h - 82 },
      ];
  drawCovCollection(ctx, boxes[0], covs);
  drawBaryCovPanel(ctx, boxes[1], bures, euc, `weights u=${u.toFixed(2)}, v=${v.toFixed(2)}`);
  const eig = eigSym2(bures).values;
  setStatus(`corner weights ${weights.map((z) => z.toFixed(2)).join(", ")}; Bures eigenvalues ${eig[0].toFixed(3)}, ${eig[1].toFixed(3)}; anisotropy ${anisotropy.toFixed(2)}`);
}

function mahalanobisCostMatrix(source, target, angleDeg, anisotropy) {
  const th = (angleDeg * Math.PI) / 180;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const aniso = Math.max(anisotropy, 1e-4);
  return source.map((p) => target.map((q) => {
    const dx = p[0] - q[0];
    const dy = p[1] - q[1];
    const z1 = c * dx + s * dy;
    const z2 = -s * dx + c * dy;
    return (z1 * z1) / aniso + aniso * z2 * z2;
  }));
}

function drawMetricUnitBall(ctx, box, angleDeg, anisotropy) {
  const cx = box.x + box.w - 54;
  const cy = box.y + 54;
  const th = (angleDeg * Math.PI) / 180;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-th);
  ctx.beginPath();
  ctx.ellipse(0, 0, 28 * Math.sqrt(anisotropy), 28 / Math.sqrt(anisotropy), 0, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(95,102,112,.10)";
  ctx.fill();
  ctx.strokeStyle = "rgba(95,102,112,.8)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = "#5f6670";
  ctx.fillText("unit ball", cx - 26, cy + 44);
}

function drawOtProblemsMetric() {
  const n = Math.round(val("opmPoints"));
  const anisotropy = val("opmAniso");
  const angle = val("opmAngle");
  const seed = Math.round(val("opmSeed"));
  const random = rng(seed);
  const source = sampleCloud("two_blobs", n, random);
  const target = sampleCloud("three_blobs", n, random).map((p) => [p[0] + 0.18, p[1] - 0.05]);
  const euclidean = hungarian(costMatrix(source, target, 2));
  const metric = hungarian(mahalanobisCostMatrix(source, target, angle, anisotropy));
  const lim = limits(source.concat(target));
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 740 ? 660 : 380);
  const vertical = w < 740;
  const gap = 24;
  const boxes = vertical
    ? [
        { x: 24, y: 42, w: w - 48, h: (h - 98) / 2 },
        { x: 24, y: 42 + (h - 98) / 2 + gap, w: w - 48, h: (h - 98) / 2 },
      ]
    : [
        { x: 20, y: 48, w: (w - 68) / 2, h: h - 84 },
        { x: 20 + (w - 68) / 2 + gap, y: 48, w: (w - 68) / 2, h: h - 84 },
      ];
  drawTransport(ctx, source, target, euclidean.map((j, i) => [i, j, 1]), null, "Euclidean plan", boxes[0], lim);
  drawTransport(ctx, source, target, metric.map((j, i) => [i, j, 1]), null, "learned metric plan", boxes[1], lim);
  drawMetricUnitBall(ctx, boxes[1], angle, anisotropy);
  const changed = metric.reduce((sum, j, i) => sum + (j === euclidean[i] ? 0 : 1), 0);
  setStatus(`anisotropy ${anisotropy.toFixed(2)} at ${angle.toFixed(0)} deg; ${changed}/${n} assignments differ from Euclidean`);
}

function weakTransportData(n, split, spread, seed) {
  const random = rng(seed);
  const source = sampleCloud("disk", n, random).map((p) => [0.75 * p[0] - 0.12, 0.75 * p[1]]);
  const target = sampleCloud("annulus", Math.max(n * 2, split * 8), random).map((p) => [p[0] + 0.2, p[1]]);
  const conditionals = [];
  const bary = [];
  let fullCost = 0;
  let weakCost = 0;
  for (let i = 0; i < source.length; i += 1) {
    const ranked = target.map((q, j) => {
      const d = Math.hypot(source[i][0] - q[0], source[i][1] - q[1]);
      return { j, d };
    }).sort((a, b) => a.d - b.d).slice(0, split);
    const raw = ranked.map((r) => Math.exp(-(r.d * r.d) / Math.max(spread * spread, 1e-5)));
    const total = raw.reduce((sum, z) => sum + z, 0);
    let bx = 0;
    let by = 0;
    const edges = [];
    for (let k = 0; k < ranked.length; k += 1) {
      const weight = raw[k] / Math.max(total, 1e-12);
      const q = target[ranked[k].j];
      bx += weight * q[0];
      by += weight * q[1];
      fullCost += weight * ((source[i][0] - q[0]) ** 2 + (source[i][1] - q[1]) ** 2) / source.length;
      edges.push({ j: ranked[k].j, weight });
    }
    weakCost += ((source[i][0] - bx) ** 2 + (source[i][1] - by) ** 2) / source.length;
    conditionals.push(edges);
    bary.push([bx, by]);
  }
  return { source, target, conditionals, bary, fullCost, weakCost };
}

function drawWeakConditionalPanel(ctx, box, lim, data, mode) {
  drawFrame(ctx, box, mode === "full" ? "full conditional laws" : "barycentric projection");
  const X = (p) => box.x + ((p[0] - lim.xmin) / (lim.xmax - lim.xmin)) * box.w;
  const Y = (p) => box.y + box.h - ((p[1] - lim.ymin) / (lim.ymax - lim.ymin)) * box.h;
  if (mode === "full") {
    for (let i = 0; i < data.source.length; i += 1) {
      for (const edge of data.conditionals[i]) {
        const q = data.target[edge.j];
        ctx.strokeStyle = `rgba(123,50,148,${0.08 + 0.38 * edge.weight})`;
        ctx.lineWidth = 0.35 + 2.1 * edge.weight;
        ctx.beginPath();
        ctx.moveTo(X(data.source[i]), Y(data.source[i]));
        ctx.lineTo(X(q), Y(q));
        ctx.stroke();
      }
    }
  } else {
    for (let i = 0; i < data.source.length; i += 1) {
      ctx.strokeStyle = "rgba(123,50,148,.45)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(X(data.source[i]), Y(data.source[i]));
      ctx.lineTo(X(data.bary[i]), Y(data.bary[i]));
      ctx.stroke();
    }
    for (const p of data.bary) {
      ctx.fillStyle = VIOLET;
      ctx.beginPath();
      ctx.arc(X(p), Y(p), 3.1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
  }
  for (const p of data.target) {
    ctx.fillStyle = "rgba(33,102,172,.72)";
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 2.3, 0, 2 * Math.PI);
    ctx.fill();
  }
  for (const p of data.source) {
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 3.2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
}

function drawOtProblemsWeak() {
  const n = Math.round(val("opwSources"));
  const split = Math.round(val("opwSplit"));
  const spread = val("opwSpread");
  const seed = Math.round(val("opwSeed"));
  const data = weakTransportData(n, split, spread, seed);
  const lim = limits(data.source.concat(data.target, data.bary));
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 720 ? 650 : 380);
  const vertical = w < 720;
  const gap = 24;
  const boxes = vertical
    ? [
        { x: 24, y: 42, w: w - 48, h: (h - 98) / 2 },
        { x: 24, y: 42 + (h - 98) / 2 + gap, w: w - 48, h: (h - 98) / 2 },
      ]
    : [
        { x: 20, y: 48, w: (w - 68) / 2, h: h - 84 },
        { x: 20 + (w - 68) / 2 + gap, y: 48, w: (w - 68) / 2, h: h - 84 },
      ];
  drawWeakConditionalPanel(ctx, boxes[0], lim, data, "full");
  drawWeakConditionalPanel(ctx, boxes[1], lim, data, "bary");
  const hiddenVariance = Math.max(data.fullCost - data.weakCost, 0);
  setStatus(`split ${split}; full quadratic cost ${data.fullCost.toFixed(3)}; weak barycentric cost ${data.weakCost.toFixed(3)}; hidden conditional variance ${hiddenVariance.toFixed(3)}`);
}

function beyondBoxes(w, h, count, minWidth = 720) {
  const gap = 24;
  if (w < minWidth && count > 1) {
    const usable = h - 58 - gap * (count - 1);
    return Array.from({ length: count }, (_, i) => ({ x: 24, y: 42 + i * (usable / count + gap), w: w - 48, h: usable / count }));
  }
  return Array.from({ length: count }, (_, i) => ({ x: 20 + i * ((w - 40 - gap * (count - 1)) / count + gap), y: 44, w: (w - 40 - gap * (count - 1)) / count, h: h - 80 }));
}

function drawTinyArrow(ctx, x, y, dx, dy, color, width = 1.2) {
  const len = Math.hypot(dx, dy);
  if (len < 0.5) return;
  const ux = dx / len;
  const uy = dy / len;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + dx, y + dy);
  ctx.lineTo(x + dx - 4 * ux + 2.6 * uy, y + dy - 4 * uy - 2.6 * ux);
  ctx.lineTo(x + dx - 4 * ux - 2.6 * uy, y + dy - 4 * uy + 2.6 * ux);
  ctx.closePath();
  ctx.fill();
}

function vectorChannelField(x, t, coupling, separation) {
  const src = [-0.78 - 0.18 * separation, 0.18];
  const dst = [0.26, 0.82 + 0.16 * separation];
  const centers = src.map((s, k) => lerp(s, dst[k], t));
  const common = 0.5 * (centers[0] + centers[1]);
  centers[0] = lerp(centers[0], common, coupling);
  centers[1] = lerp(centers[1], common, coupling);
  const amp1 = [1.05, 0.38];
  const amp2 = [0.38, 0.98];
  let u1 = 0;
  let u2 = 0;
  for (let k = 0; k < 2; k += 1) {
    const g = Math.exp(-35 * (x - centers[k]) ** 2);
    u1 += amp1[k] * g;
    u2 += amp2[k] * g;
  }
  return [u1, u2];
}

function drawVectorPanel(ctx, box, coupling, separation, title) {
  drawFrame(ctx, box, title);
  const X = (x) => box.x + ((x + 1.25) / 2.5) * box.w;
  const Y = (t) => box.y + box.h - t * box.h;
  ctx.strokeStyle = "rgba(95,102,112,.18)";
  ctx.lineWidth = 1;
  for (let k = 0; k <= 4; k += 1) {
    const y = Y(k / 4);
    ctx.beginPath();
    ctx.moveTo(box.x, y);
    ctx.lineTo(box.x + box.w, y);
    ctx.stroke();
  }
  const times = Array.from({ length: 8 }, (_, i) => i / 7);
  const xs = Array.from({ length: 36 }, (_, i) => -1.18 + (2.36 * i) / 35);
  for (const t of times) {
    for (const x of xs) {
      const [u1, u2] = vectorChannelField(x, t, coupling, separation);
      const mag = Math.hypot(u1, u2);
      if (mag < 0.18) continue;
      const ratio = u2 / Math.max(u1 + u2, 1e-6);
      const color = mixColor(ratio, RED, BLUE, clamp(0.22 + 0.55 * mag, 0.18, 0.82));
      drawTinyArrow(ctx, X(x), Y(t), 13 * u1 / (1 + mag), -13 * u2 / (1 + mag), color, 0.9 + 0.6 * Math.min(mag, 1));
    }
  }
  ctx.fillStyle = RED;
  ctx.fillText("channel 1", box.x + 14, box.y + box.h - 14);
  ctx.fillStyle = BLUE;
  ctx.fillText("channel 2", box.x + box.w - 78, box.y + 20);
}

function drawBeyondVector() {
  const coupling = val("bvCoupling");
  const separation = val("bvSeparation");
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 720 ? 650 : 380);
  const boxes = beyondBoxes(w, h, 2, 720);
  drawVectorPanel(ctx, boxes[0], 0, separation, "diagonal mobility");
  drawVectorPanel(ctx, boxes[1], coupling, separation, `coupled mobility k=${coupling.toFixed(2)}`);
  setStatus(`coupling ${coupling.toFixed(2)} bends local fibers toward the common channel direction while preserving both channel masses`);
}

function drawScreenEllipse(ctx, x, y, rx, ry, angle, color, alpha = 0.75) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, 2 * Math.PI);
  ctx.fillStyle = color.replace("1)", `${alpha})`);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.25;
  ctx.stroke();
  ctx.restore();
}

function drawMatrixPanel(ctx, box, coupling, rotation, title) {
  drawFrame(ctx, box, title);
  const X = (x) => box.x + ((x + 1.15) / 2.3) * box.w;
  const Y = (t) => box.y + box.h - t * box.h;
  const src = [-0.72, 0.28];
  const dst = [0.2, 0.82];
  const times = Array.from({ length: 7 }, (_, i) => i / 6);
  for (const t of times) {
    const centers = src.map((s, k) => lerp(s, dst[k], t));
    const common = 0.5 * (centers[0] + centers[1]);
    for (let k = 0; k < 2; k += 1) {
      const cx = lerp(centers[k], common, coupling);
      const angle = (Math.PI / 180) * (k === 0 ? rotation * coupling * t : 90 - rotation * coupling * (1 - t));
      const stretch = 1 + 1.7 * coupling + 0.35 * k;
      const color = k === 0 ? "rgba(215,48,39,1)" : "rgba(33,102,172,1)";
      drawScreenEllipse(ctx, X(cx), Y(t), 15 * stretch, 7 + 2.2 * k, angle, color, 0.42 + 0.22 * (1 - Math.abs(t - 0.5)));
    }
  }
  ctx.fillStyle = "#5f6670";
  ctx.fillText("time", box.x + 14, box.y + 20);
  ctx.fillText("base space", box.x + box.w - 78, box.y + box.h - 14);
}

function drawBeyondMatrix() {
  const coupling = val("bmCoupling");
  const rotation = val("bmRotation");
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 720 ? 650 : 380);
  const boxes = beyondBoxes(w, h, 2, 720);
  drawMatrixPanel(ctx, boxes[0], 0, rotation, "commuting tensor channels");
  drawMatrixPanel(ctx, boxes[1], coupling, rotation, "coupled tensor fibers");
  setStatus(`coupling ${coupling.toFixed(2)} and rotation ${rotation.toFixed(0)} deg show how non-commuting eigendirections add orientation to transported mass`);
}

function gromovBaseShape(n) {
  return Array.from({ length: n }, (_, i) => {
    const th = (2 * Math.PI * i) / n;
    const r = 0.62 + 0.13 * Math.cos(3 * th) + 0.06 * Math.sin(5 * th);
    return [r * Math.cos(th), 0.82 * r * Math.sin(th)];
  });
}

function deformGromovShape(points, deformation, twist) {
  return points.map((p) => {
    const th = twist + deformation * 0.75 * p[1];
    const c = Math.cos(th);
    const s = Math.sin(th);
    const x = c * p[0] - s * p[1];
    const y = s * p[0] + c * p[1];
    return [0.78 * x + deformation * 0.32 * x * y + 0.34, 1.0 * y + deformation * 0.18 * Math.sin(3 * x)];
  });
}

function pairwiseDistances(points) {
  return points.map((p) => points.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1])));
}

function gromovResidual(source, target, assignment) {
  const Ds = pairwiseDistances(source);
  const Dt = pairwiseDistances(target);
  const n = source.length;
  const residual = Array.from({ length: n }, () => Array(n).fill(0));
  let sum = 0;
  let maxv = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      const v = Math.abs(Ds[i][j] - Dt[assignment[i]][assignment[j]]);
      residual[i][j] = v;
      sum += v;
      maxv = Math.max(maxv, v);
    }
  }
  return { residual, mean: sum / (n * n), maxv };
}

function drawGromovCorrespondence(ctx, box, source, target, assignment, title, tintResidual = null) {
  drawFrame(ctx, box, title);
  const lim = limits(source.concat(target));
  const X = (p) => box.x + ((p[0] - lim.xmin) / (lim.xmax - lim.xmin)) * box.w;
  const Y = (p) => box.y + box.h - ((p[1] - lim.ymin) / (lim.ymax - lim.ymin)) * box.h;
  for (let i = 0; i < source.length; i += 1) {
    const q = target[assignment[i]];
    const alpha = tintResidual ? clamp(0.14 + 0.58 * tintResidual[i], 0.16, 0.82) : 0.32;
    ctx.strokeStyle = `rgba(123,50,148,${alpha})`;
    ctx.lineWidth = 0.85 + 1.35 * alpha;
    ctx.beginPath();
    ctx.moveTo(X(source[i]), Y(source[i]));
    ctx.lineTo(X(q), Y(q));
    ctx.stroke();
  }
  for (const p of target) {
    ctx.fillStyle = BLUE;
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 3.2, 0, 2 * Math.PI);
    ctx.fill();
  }
  for (const p of source) {
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 3.4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
}

function drawBeyondGromov() {
  const n = Math.round(val("bgPoints"));
  const deformation = val("bgDeform");
  const twist = (Math.PI / 180) * val("bgTwist");
  const source = gromovBaseShape(n).map((p) => [p[0] - 0.28, p[1]]);
  const target = deformGromovShape(gromovBaseShape(n), deformation, twist);
  const assignment = Array.from({ length: n }, (_, i) => i);
  const stats = gromovResidual(source, target, assignment);
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 740 ? 620 : 360);
  const boxes = beyondBoxes(w, h, 2, 740);
  drawGromovCorrespondence(ctx, boxes[0], source, target, assignment, "structural correspondence");
  const rowResidual = stats.residual.map((row) => row.reduce((a, b) => a + b, 0) / Math.max(row.length, 1) / Math.max(stats.maxv, 1e-9));
  drawGromovCorrespondence(ctx, boxes[1], source, target, assignment, "segments colored by distortion", rowResidual);
  setStatus(`mean pairwise-distance residual ${stats.mean.toFixed(3)}; deformation ${deformation.toFixed(2)}; ${n} support points`);
}

function drawResidualMatrix(ctx, box, residual, maxv, title) {
  drawFrame(ctx, box, title);
  const n = residual.length;
  const size = Math.min(box.w, box.h) - 34;
  const x0 = box.x + 17 + (box.w - size - 34) / 2;
  const y0 = box.y + 28;
  const cell = size / n;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      const z = clamp(residual[i][j] / Math.max(maxv, 1e-9), 0, 1);
      const g = Math.round(255 * (1 - z));
      ctx.fillStyle = `rgb(${g},${g},${g})`;
      ctx.fillRect(x0 + j * cell, y0 + i * cell, Math.ceil(cell), Math.ceil(cell));
    }
  }
  ctx.strokeStyle = "#5f6670";
  ctx.strokeRect(x0, y0, size, size);
  ctx.fillStyle = "#5f6670";
  ctx.fillText("white: low", x0, y0 + size + 18);
  ctx.fillText("black: high", x0 + size - 74, y0 + size + 18);
}

function drawBeyondGromovDistortion() {
  const n = Math.round(val("bgdPoints"));
  const deformation = val("bgdDeform");
  const shift = Math.round(val("bgdShift"));
  const source = gromovBaseShape(n).map((p) => [p[0] - 0.3, p[1]]);
  const target = deformGromovShape(gromovBaseShape(n), deformation, 0.45);
  const assignment = Array.from({ length: n }, (_, i) => (i + shift + n) % n);
  const stats = gromovResidual(source, target, assignment);
  const rowResidual = stats.residual.map((row) => row.reduce((a, b) => a + b, 0) / Math.max(row.length, 1) / Math.max(stats.maxv, 1e-9));
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 760 ? 700 : 380);
  const boxes = beyondBoxes(w, h, 2, 760);
  drawGromovCorrespondence(ctx, boxes[0], source, target, assignment, `hard correspondence shift ${shift}`, rowResidual);
  drawResidualMatrix(ctx, boxes[1], stats.residual, stats.maxv, "|d_X - d_Y circ sigma|");
  setStatus(`mean residual ${stats.mean.toFixed(3)}; max residual ${stats.maxv.toFixed(3)}; cyclic shift ${shift}`);
}

function fusedFeaturePoints(n, conflict) {
  const source = [];
  const target = [];
  const sourceFeature = [];
  const targetFeature = [];
  for (let i = 0; i < n; i += 1) {
    const th = (2 * Math.PI * i) / n;
    const r = 0.72 + 0.08 * Math.sin(3 * th);
    source.push([-0.42 + r * Math.cos(th), 0.82 * r * Math.sin(th)]);
    target.push([0.42 + 0.72 * Math.cos(th + 0.22), 0.72 * Math.sin(th + 0.22)]);
    sourceFeature.push(i < n / 2 ? 0 : 1);
    const shifted = (i + Math.round(conflict * n / 2)) % n;
    targetFeature.push(shifted < n / 2 ? 0 : 1);
  }
  return { source, target, sourceFeature, targetFeature };
}

function circularIndexDistance(i, j, n) {
  const d = Math.abs(i - j);
  return Math.min(d, n - d) / Math.max(n / 2, 1);
}

function drawFusedGromovPanel(ctx, box, data, assignment, title) {
  drawFrame(ctx, box, title);
  const lim = limits(data.source.concat(data.target));
  const X = (p) => box.x + ((p[0] - lim.xmin) / (lim.xmax - lim.xmin)) * box.w;
  const Y = (p) => box.y + box.h - ((p[1] - lim.ymin) / (lim.ymax - lim.ymin)) * box.h;
  for (let i = 0; i < assignment.length; i += 1) {
    const j = assignment[i];
    ctx.strokeStyle = data.sourceFeature[i] === data.targetFeature[j] ? "rgba(123,50,148,.38)" : "rgba(95,102,112,.18)";
    ctx.lineWidth = data.sourceFeature[i] === data.targetFeature[j] ? 1.25 : 0.75;
    ctx.beginPath();
    ctx.moveTo(X(data.source[i]), Y(data.source[i]));
    ctx.lineTo(X(data.target[j]), Y(data.target[j]));
    ctx.stroke();
  }
  const drawPoint = (p, feature, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = feature === 0 ? "#ffffff" : "#26333f";
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 2.3, 0, 2 * Math.PI);
    ctx.fill();
  };
  for (let i = 0; i < data.target.length; i += 1) drawPoint(data.target[i], data.targetFeature[i], BLUE);
  for (let i = 0; i < data.source.length; i += 1) drawPoint(data.source[i], data.sourceFeature[i], RED);
}

function drawBeyondFusedGromov() {
  const n = Math.round(val("bfgPoints"));
  const lambda = val("bfgLambda");
  const conflict = val("bfgConflict");
  const data = fusedFeaturePoints(n, conflict);
  const cost = data.source.map((_, i) => data.target.map((__, j) => {
    const feature = data.sourceFeature[i] === data.targetFeature[j] ? 0 : 1;
    const geometry = circularIndexDistance(i, j, n) ** 2;
    return (1 - lambda) * feature + lambda * geometry;
  }));
  const assignment = hungarian(cost);
  const geometryAssignment = Array.from({ length: n }, (_, i) => i);
  const featureMismatches = assignment.reduce((sum, j, i) => sum + (data.sourceFeature[i] === data.targetFeature[j] ? 0 : 1), 0);
  const geometryChanges = assignment.reduce((sum, j, i) => sum + (j === geometryAssignment[i] ? 0 : 1), 0);
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 760 ? 650 : 360);
  const boxes = beyondBoxes(w, h, 2, 760);
  drawFusedGromovPanel(ctx, boxes[0], data, geometryAssignment, "pure geometry ordering");
  drawFusedGromovPanel(ctx, boxes[1], data, assignment, `fused lambda ${lambda.toFixed(2)}`);
  setStatus(`geometry weight ${lambda.toFixed(2)}; feature mismatches ${featureMismatches}/${n}; ${geometryChanges}/${n} links differ from pure geometry; feature conflict ${conflict.toFixed(2)}`);
}

function dynamicClouds(n, targetName, seed) {
  const randomSource = rng(seed);
  const randomTarget = rng(seed + 97);
  const source = sampleCloud("crescent", n, randomSource).map((p) => [0.82 * p[0] - 0.42, 0.84 * p[1] + 0.04]);
  const target = sampleCloud(targetName, n, randomTarget).map((p) => [0.82 * p[0] + 0.42, 0.84 * p[1] - 0.04]);
  return { source, target };
}

function dynamicProjection(box, lim) {
  return {
    X: (p) => box.x + ((p[0] - lim.xmin) / Math.max(lim.xmax - lim.xmin, 1e-9)) * box.w,
    Y: (p) => box.y + box.h - ((p[1] - lim.ymin) / Math.max(lim.ymax - lim.ymin, 1e-9)) * box.h,
  };
}

function drawDynamicGeodesicPanel(ctx, box, source, target, assignment, t, velocityScale, title, mode) {
  drawFrame(ctx, box, title);
  const pairedTarget = source.map((_, i) => target[assignment[i]]);
  const current = source.map((p, i) => [lerp(p[0], pairedTarget[i][0], t), lerp(p[1], pairedTarget[i][1], t)]);
  const lim = limits(source.concat(target, current));
  const { X, Y } = dynamicProjection(box, lim);
  const skip = Math.max(1, Math.ceil(source.length / 48));

  if (mode === "paths") {
    for (let i = 0; i < source.length; i += 1) {
      const q = pairedTarget[i];
      ctx.strokeStyle = "rgba(123,50,148,.20)";
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(X(source[i]), Y(source[i]));
      ctx.lineTo(X(q), Y(q));
      ctx.stroke();
    }
  } else {
    for (let i = 0; i < source.length; i += skip) {
      const p = current[i];
      const q = pairedTarget[i];
      const sx = X(source[i]);
      const sy = Y(source[i]);
      const tx = X(q);
      const ty = Y(q);
      const dx = velocityScale * 0.22 * (tx - sx);
      const dy = velocityScale * 0.22 * (ty - sy);
      drawTinyArrow(ctx, X(p) - 0.5 * dx, Y(p) - 0.5 * dy, dx, dy, "rgba(123,50,148,.66)", 1.1);
    }
  }

  for (const p of target) {
    ctx.fillStyle = "rgba(33,102,172,.24)";
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 2.8, 0, 2 * Math.PI);
    ctx.fill();
  }
  for (const p of source) {
    ctx.fillStyle = "rgba(215,48,39,.25)";
    ctx.beginPath();
    ctx.arc(X(p), Y(p), 2.8, 0, 2 * Math.PI);
    ctx.fill();
  }
  for (let i = 0; i < current.length; i += 1) {
    ctx.fillStyle = mixColor(t, RED, BLUE, 0.86);
    ctx.beginPath();
    ctx.arc(X(current[i]), Y(current[i]), mode === "paths" ? 3.1 : 3.35, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.fillStyle = RED;
  ctx.fillText("source", box.x + 12, box.y + box.h - 12);
  ctx.fillStyle = BLUE;
  ctx.fillText("target", box.x + box.w - 54, box.y + 18);
}

function drawDynamicBB() {
  const t = val("dbbT");
  const n = Math.round(val("dbbParticles"));
  const velocityScale = val("dbbVelocity");
  const targetName = val("dbbTarget");
  const seed = Math.round(val("dbbSeed"));
  const { source, target } = dynamicClouds(n, targetName, seed);
  const assignment = hungarian(costMatrix(source, target, 2));
  let action = 0;
  for (let i = 0; i < n; i += 1) {
    const q = target[assignment[i]];
    action += (source[i][0] - q[0]) ** 2 + (source[i][1] - q[1]) ** 2;
  }
  action /= Math.max(n, 1);
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 760 ? 650 : 380);
  const boxes = beyondBoxes(w, h, 2, 760);
  drawDynamicGeodesicPanel(ctx, boxes[0], source, target, assignment, t, velocityScale, `McCann interpolation, t=${t.toFixed(2)}`, "paths");
  drawDynamicGeodesicPanel(ctx, boxes[1], source, target, assignment, t, velocityScale, "Eulerian velocity samples", "velocity");
  setStatus(`t=${t.toFixed(2)}; ${n} matched characteristics; mean squared displacement ${action.toFixed(3)}; velocity scale ${velocityScale.toFixed(2)}`);
}

function dynamicMassCenters() {
  return [[-0.58, 0.42], [0.58, -0.42]];
}

function drawMassBlob(ctx, proj, point, mass, color, alpha, label) {
  if (mass <= 1e-4) return;
  const radius = 8 + 18 * Math.sqrt(mass / 2);
  const x = proj.X(point);
  const y = proj.Y(point);
  ctx.fillStyle = color.replace("1)", `${alpha})`);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  if (label) {
    ctx.fillStyle = "#26333f";
    ctx.font = "11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y + 3.5);
    ctx.textAlign = "left";
  }
}

function drawDynamicUnbalancedPanel(ctx, box, t, mismatch, reaction, title) {
  drawFrame(ctx, box, title);
  const centers = dynamicMassCenters();
  const lim = { xmin: -1.05, xmax: 1.05, ymin: -0.92, ymax: 0.92 };
  const proj = dynamicProjection(box, lim);
  const commonMass = Math.max(1 - mismatch, 0.05);
  const excess = 2 * mismatch;
  const transported = excess * (1 - reaction);
  const fading = excess * reaction * (1 - t);
  const growing = excess * reaction * t;
  const movingPoint = [lerp(centers[0][0], centers[1][0], t), lerp(centers[0][1], centers[1][1], t)];

  ctx.strokeStyle = "rgba(123,50,148,.20)";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(proj.X(centers[0]), proj.Y(centers[0]));
  ctx.lineTo(proj.X(centers[1]), proj.Y(centers[1]));
  ctx.stroke();
  if (transported > 0.01) {
    const sx = proj.X(centers[0]);
    const sy = proj.Y(centers[0]);
    const tx = proj.X(centers[1]);
    const ty = proj.Y(centers[1]);
    const dx = 0.16 * (tx - sx);
    const dy = 0.16 * (ty - sy);
    drawTinyArrow(ctx, proj.X(movingPoint) - 0.5 * dx, proj.Y(movingPoint) - 0.5 * dy, dx, dy, "rgba(123,50,148,.70)", 1.4 + 1.6 * transported);
  }

  drawMassBlob(ctx, proj, centers[0], commonMass + fading, "rgba(215,48,39,1)", 0.17 + 0.28 * (1 - t), "");
  drawMassBlob(ctx, proj, centers[1], commonMass + growing, "rgba(33,102,172,1)", 0.17 + 0.28 * t, "");
  drawMassBlob(ctx, proj, movingPoint, transported, "rgba(123,50,148,1)", 0.20 + 0.42 * (1 - Math.abs(t - 0.5)), transported > 0.2 ? "move" : "");

  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.arc(proj.X(centers[0]), proj.Y(centers[0]), 3.5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = BLUE;
  ctx.beginPath();
  ctx.arc(proj.X(centers[1]), proj.Y(centers[1]), 3.5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "#5f6670";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText(`transport ${transported.toFixed(2)}`, box.x + 12, box.y + box.h - 28);
  ctx.fillText(`reaction ${(excess * reaction).toFixed(2)}`, box.x + 12, box.y + box.h - 12);
}

function drawDynamicUnbalanced() {
  const t = val("dubT");
  const mismatch = val("dubMismatch");
  const reaction = val("dubReaction");
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 760 ? 660 : 390);
  const boxes = beyondBoxes(w, h, 2, 760);
  drawDynamicUnbalancedPanel(ctx, boxes[0], t, mismatch, 0, "balanced continuity equation");
  drawDynamicUnbalancedPanel(ctx, boxes[1], t, mismatch, reaction, "reaction-transport balance");
  const transported = 2 * mismatch * (1 - reaction);
  const reacted = 2 * mismatch * reaction;
  setStatus(`t=${t.toFixed(2)}; mismatch ${mismatch.toFixed(2)}; transported excess ${transported.toFixed(2)}; faded/recreated excess ${reacted.toFixed(2)}`);
}

function gfMap(box, lim) {
  return {
    X: (x) => box.x + ((x + lim) / (2 * lim)) * box.w,
    Y: (y) => box.y + box.h - ((y + lim) / (2 * lim)) * box.h,
  };
}

function gfQuantiles(xs, pdf, levels) {
  const cdf = [];
  let total = 0;
  for (const v of pdf) total += Math.max(v, 0);
  let running = 0;
  for (const v of pdf) {
    running += Math.max(v, 0);
    cdf.push(running / Math.max(total, 1e-12));
  }
  return levels.map((u) => {
    let j = 1;
    while (j < cdf.length && cdf[j] < u) j += 1;
    const lo = cdf[j - 1] || 0;
    const hi = cdf[j] || 1;
    const t = clamp((u - lo) / Math.max(hi - lo, 1e-12), 0, 1);
    return lerp(xs[Math.max(0, j - 1)], xs[Math.min(xs.length - 1, j)], t);
  });
}

function gfEntropyPdf(x, t, width) {
  const s1 = Math.sqrt(width * width + 2 * t);
  const s2 = Math.sqrt((0.72 * width) ** 2 + 2 * t);
  return 0.6 * normalPdf(x, -0.72, s1) + 0.4 * normalPdf(x, 0.66, s2);
}

function drawGradflowJKO() {
  const tau = val("gfjTau");
  const steps = Math.round(val("gfjSteps"));
  const width = val("gfjWidth");
  const { ctx, w, h } = resizeCanvas(410);
  const gap = 38;
  const boxW = (w - 48 - gap) / 2;
  const boxH = h - 62;
  const left = { x: 18, y: 42, w: boxW, h: boxH };
  const right = { x: 18 + boxW + gap, y: 42, w: boxW, h: boxH };
  drawFrame(ctx, left, "density iterates");
  drawFrame(ctx, right, "quantile motion");
  const xs = Array.from({ length: 520 }, (_, i) => lerp(-3.2, 3.2, i / 519));
  const times = Array.from({ length: steps + 1 }, (_, k) => k * tau);
  const pdfs = times.map((time) => xs.map((x) => gfEntropyPdf(x, time, width)));
  const yMax = 1.08 * Math.max(...pdfs.flat());
  ctx.strokeStyle = "#ecf0f5";
  ctx.lineWidth = 1;
  for (let k = 0; k <= 4; k += 1) {
    const y = left.y + (k / 4) * left.h;
    ctx.beginPath();
    ctx.moveTo(left.x, y);
    ctx.lineTo(left.x + left.w, y);
    ctx.stroke();
  }
  for (let k = 0; k < pdfs.length; k += 1) {
    drawCurve(ctx, xs, pdfs[k], left, -3.2, 3.2, 0, yMax, mixColor(k / Math.max(steps, 1)), k === pdfs.length - 1 ? 2.2 : 1.25);
  }

  const levels = [0.05, 0.12, 0.22, 0.34, 0.5, 0.66, 0.78, 0.88, 0.95];
  const q = pdfs.map((pdf) => gfQuantiles(xs, pdf, levels));
  const X = (time) => right.x + (time / Math.max(times[times.length - 1], 1e-9)) * right.w;
  const Y = (value) => right.y + right.h - ((value + 3.2) / 6.4) * right.h;
  ctx.strokeStyle = "#ecf0f5";
  ctx.lineWidth = 1;
  for (let k = 0; k <= 4; k += 1) {
    const y = right.y + (k / 4) * right.h;
    ctx.beginPath();
    ctx.moveTo(right.x, y);
    ctx.lineTo(right.x + right.w, y);
    ctx.stroke();
  }
  for (let j = 0; j < levels.length; j += 1) {
    ctx.beginPath();
    for (let k = 0; k < times.length; k += 1) {
      const px = X(times[k]);
      const py = Y(q[k][j]);
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = mixColor(levels[j], RED, BLUE, 0.82);
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.fillStyle = "#4a5563";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("x", left.x + left.w - 10, left.y + left.h + 19);
  ctx.fillText("time", right.x + right.w - 28, right.y + right.h + 19);
  setStatus(`${steps} JKO steps; tau=${tau.toFixed(2)}; final heat time ${(steps * tau).toFixed(2)}`);
}

function gfPorousPdf(xs, t, width, m) {
  const radius = width * (1.45 + 1.05 * Math.pow(t + 0.05, 1 / (m + 1)));
  const power = 1 / Math.max(m - 1, 0.08);
  const raw = xs.map((x) => {
    const z = 1 - (x / radius) ** 2;
    return z > 0 ? z ** power : 0;
  });
  const dx = (xs[xs.length - 1] - xs[0]) / (xs.length - 1);
  const mass = raw.reduce((a, b) => a + b, 0) * dx;
  return raw.map((v) => v / Math.max(mass, 1e-12));
}

function transparentColor(color, alpha) {
  const c = rgb(color);
  return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
}

function drawFilledCurve(ctx, xs, ys, box, xMin, xMax, yMin, yMax, color, alpha) {
  const X = (x) => box.x + ((x - xMin) / (xMax - xMin)) * box.w;
  const Y = (y) => box.y + box.h - ((y - yMin) / Math.max(yMax - yMin, 1e-12)) * box.h;
  ctx.beginPath();
  ctx.moveTo(X(xs[0]), Y(0));
  for (let i = 0; i < xs.length; i += 1) ctx.lineTo(X(xs[i]), Y(ys[i]));
  ctx.lineTo(X(xs[xs.length - 1]), Y(0));
  ctx.closePath();
  ctx.fillStyle = transparentColor(color, alpha);
  ctx.fill();
  drawCurve(ctx, xs, ys, box, xMin, xMax, yMin, yMax, color, 2);
}

function drawGradflowDiffusion() {
  const time = val("gfdTime");
  const m = val("gfdPower");
  const width = val("gfdWidth");
  const { ctx, w, h } = resizeCanvas(378);
  const gap = 20;
  const boxW = (w - 48 - 2 * gap) / 3;
  const boxes = [
    { x: 14, y: 44, w: boxW, h: h - 70 },
    { x: 14 + boxW + gap, y: 44, w: boxW, h: h - 70 },
    { x: 14 + 2 * (boxW + gap), y: 44, w: boxW, h: h - 70 },
  ];
  const xs = Array.from({ length: 520 }, (_, i) => lerp(-3.2, 3.2, i / 519));
  const heat = xs.map((x) => normalPdf(x, 0, Math.sqrt(width * width + 2 * time)));
  const porous = gfPorousPdf(xs, time, width, m);
  const porousStrong = gfPorousPdf(xs, time, width, Math.min(8, m + 3));
  const yMax = 1.12 * Math.max(...heat, ...porous, ...porousStrong);
  drawFrame(ctx, boxes[0], "heat equation");
  drawFrame(ctx, boxes[1], `porous m=${m.toFixed(1)}`);
  drawFrame(ctx, boxes[2], "comparison");
  drawFilledCurve(ctx, xs, heat, boxes[0], -3.2, 3.2, 0, yMax, BLUE, 0.18);
  drawFilledCurve(ctx, xs, porous, boxes[1], -3.2, 3.2, 0, yMax, RED, 0.18);
  drawCurve(ctx, xs, heat, boxes[2], -3.2, 3.2, 0, yMax, BLUE, 2);
  drawCurve(ctx, xs, porous, boxes[2], -3.2, 3.2, 0, yMax, RED, 2);
  drawCurve(ctx, xs, porousStrong, boxes[2], -3.2, 3.2, 0, yMax, VIOLET, 1.6);
  ctx.fillStyle = BLUE;
  ctx.fillText("heat", boxes[2].x + 10, boxes[2].y + 18);
  ctx.fillStyle = RED;
  ctx.fillText(`m=${m.toFixed(1)}`, boxes[2].x + 10, boxes[2].y + 36);
  ctx.fillStyle = VIOLET;
  ctx.fillText(`m=${Math.min(8, m + 3).toFixed(1)}`, boxes[2].x + 10, boxes[2].y + 54);
  setStatus(`time ${time.toFixed(2)}; porous exponent m=${m.toFixed(1)}; compact front radius grows slowly as m increases`);
}

function normalizePdfArray(values, xs) {
  const dx = xs.length > 1 ? xs[1] - xs[0] : 1;
  const mass = values.reduce((sum, z) => sum + Math.max(z, 0), 0) * dx;
  return values.map((z) => Math.max(z, 0) / Math.max(mass, 1e-12));
}

function capAndRedistributeDensity(values, xs, cap) {
  let density = normalizePdfArray(values, xs);
  const dx = xs.length > 1 ? xs[1] - xs[0] : 1;
  for (let iter = 0; iter < 14; iter += 1) {
    let excess = 0;
    let free = 0;
    for (let i = 0; i < density.length; i += 1) {
      if (density[i] > cap) {
        excess += (density[i] - cap) * dx;
        density[i] = cap;
      } else {
        free += Math.max(cap - density[i], 0) * dx;
      }
    }
    if (excess < 1e-8 || free < 1e-10) break;
    for (let i = 0; i < density.length; i += 1) {
      const room = Math.max(cap - density[i], 0);
      density[i] += (excess * room) / Math.max(free, 1e-12);
    }
  }
  return normalizePdfArray(density, xs);
}

function densityAtConstrainedTime(xs, time, cap, attraction) {
  const center = -1.25 + (1 - Math.exp(-attraction * time)) * 2.15;
  const sigma = Math.max(0.18, 0.65 * Math.exp(-0.7 * time));
  const raw = xs.map((x) => normalPdf(x, center, sigma));
  return capAndRedistributeDensity(raw, xs, cap);
}

function drawDensityRibbon(ctx, box, xs, density, xMin, xMax, yCenter, height, maxDensity, color) {
  const X = (x) => box.x + ((x - xMin) / (xMax - xMin)) * box.w;
  const Y = (z) => yCenter - (z / Math.max(maxDensity, 1e-12)) * height;
  ctx.beginPath();
  ctx.moveTo(X(xs[0]), yCenter);
  for (let i = 0; i < xs.length; i += 1) ctx.lineTo(X(xs[i]), Y(density[i]));
  ctx.lineTo(X(xs[xs.length - 1]), yCenter);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = color.replace(/, ?0\.[0-9]+\)$/, ",.95)");
  ctx.lineWidth = 1.1;
  ctx.stroke();
}

function drawGradflowConstraint() {
  const cap = val("gfcCap");
  const attraction = val("gfcAttraction");
  const finalTime = val("gfcTime");
  const { ctx, w, h } = resizeCanvas(420);
  const box = { x: 24, y: 42, w: w - 48, h: h - 74 };
  drawFrame(ctx, box, "density-constrained Wasserstein flow");
  const xs = Array.from({ length: 560 }, (_, i) => lerp(-3.1, 3.1, i / 559));
  const times = [0, 0.16, 0.34, 0.58, 0.82, 1].map((s) => s * finalTime);
  const densities = times.map((t) => densityAtConstrainedTime(xs, t, cap, attraction));
  const maxDensity = Math.max(cap, ...densities.flat()) * 1.05;
  const rowGap = box.h / (times.length + 0.35);
  ctx.strokeStyle = "rgba(95,102,112,.18)";
  ctx.lineWidth = 1;
  for (let k = 0; k < times.length; k += 1) {
    const y = box.y + rowGap * (k + 0.9);
    ctx.beginPath();
    ctx.moveTo(box.x, y);
    ctx.lineTo(box.x + box.w, y);
    ctx.stroke();
    drawDensityRibbon(ctx, box, xs, densities[k], -3.1, 3.1, y, rowGap * 0.72, maxDensity, mixColor(k / (times.length - 1), RED, BLUE, 0.42));
    ctx.fillStyle = "#5f6670";
    ctx.fillText(`t=${times[k].toFixed(2)}`, box.x + 8, y - rowGap * 0.52);
  }
  const capY = box.y + 11;
  ctx.strokeStyle = "rgba(123,50,148,.55)";
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(box.x + 12, capY);
  ctx.lineTo(box.x + box.w - 12, capY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = VIOLET;
  ctx.fillText(`cap kappa=${cap.toFixed(2)}`, box.x + 18, capY - 5);
  setStatus(`projected toy flow with density cap kappa=${cap.toFixed(2)}; attraction ${attraction.toFixed(2)}; final time ${finalTime.toFixed(2)}`);
}

function circularDistance01(x, c) {
  let d = Math.abs(x - c);
  d = Math.min(d, 1 - d);
  return d;
}

function speciesProfile(xs, species, time, diffusion) {
  const centers = [0.12, 0.33, 0.55, 0.73, 0.88];
  const width = 0.045 + diffusion * Math.sqrt(time + 0.015);
  const raw = [];
  for (let i = 0; i < species; i += 1) {
    raw.push(xs.map((x) => 0.08 + Math.exp(-(circularDistance01(x, centers[i]) ** 2) / (2 * width * width))));
  }
  const profiles = raw.map(() => Array(xs.length).fill(0));
  for (let k = 0; k < xs.length; k += 1) {
    const total = raw.reduce((sum, arr) => sum + arr[k], 0);
    for (let i = 0; i < species; i += 1) profiles[i][k] = raw[i][k] / Math.max(total, 1e-12);
  }
  return profiles;
}

function drawStackedSpecies(ctx, box, xs, profiles, yBase, rowHeight) {
  const X = (x) => box.x + x * box.w;
  const colors = [RED, VIOLET, BLUE, "#f46d43", "#3288bd"];
  let bottom = Array(xs.length).fill(yBase);
  for (let s = 0; s < profiles.length; s += 1) {
    const top = profiles[s].map((z, i) => bottom[i] - z * rowHeight);
    ctx.beginPath();
    ctx.moveTo(X(xs[0]), bottom[0]);
    for (let k = 0; k < xs.length; k += 1) ctx.lineTo(X(xs[k]), top[k]);
    for (let k = xs.length - 1; k >= 0; k -= 1) ctx.lineTo(X(xs[k]), bottom[k]);
    ctx.closePath();
    ctx.fillStyle = transparentColor(colors[s % colors.length], 0.55);
    ctx.fill();
    ctx.strokeStyle = transparentColor(colors[s % colors.length], 0.9);
    ctx.lineWidth = 0.75;
    ctx.stroke();
    bottom = top;
  }
}

function drawGradflowMultispecies() {
  const species = Math.round(val("gmsSpecies"));
  const diffusion = val("gmsDiffusion");
  const finalTime = val("gmsTime");
  const { ctx, w, h } = resizeCanvas(420);
  const box = { x: 24, y: 42, w: w - 48, h: h - 74 };
  drawFrame(ctx, box, "multi-species entropy flow with fixed total density");
  const xs = Array.from({ length: 360 }, (_, i) => i / 359);
  const times = [0, 0.18, 0.42, 0.7, 1].map((s) => s * finalTime);
  const rowGap = box.h / (times.length + 0.15);
  for (let r = 0; r < times.length; r += 1) {
    const yBase = box.y + rowGap * (r + 0.9);
    ctx.strokeStyle = "rgba(95,102,112,.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(box.x, yBase);
    ctx.lineTo(box.x + box.w, yBase);
    ctx.stroke();
    drawStackedSpecies(ctx, box, xs, speciesProfile(xs, species, times[r], diffusion), yBase, rowGap * 0.74);
    ctx.fillStyle = "#5f6670";
    ctx.fillText(`t=${times[r].toFixed(2)}`, box.x + 8, yBase - rowGap * 0.55);
  }
  setStatus(`${species} positive species; independent heat-like smoothing followed by the pointwise constraint sum_i rho_i=1`);
}

function gfInitialCloud(n, seed, cx = -1.15, cy = -0.72, spread = 0.18) {
  const random = rng(seed);
  const pts = [];
  for (let i = 0; i < n; i += 1) pts.push([cx + spread * randn(random), cy + spread * randn(random)]);
  return pts;
}

function gfTargetCenters(separation) {
  return [[-0.42 * separation, 0.42], [0.48 * separation, -0.36]];
}

function gfTeacherForce(p, centers, bandwidth) {
  let wx = 0;
  let wy = 0;
  let wt = 0;
  for (const c of centers) {
    const dx = c[0] - p[0];
    const dy = c[1] - p[1];
    const wgt = Math.exp(-(dx * dx + dy * dy) / (2 * bandwidth * bandwidth));
    wx += wgt * dx;
    wy += wgt * dy;
    wt += wgt;
  }
  return [wx / Math.max(wt, 1e-9), wy / Math.max(wt, 1e-9)];
}

function gfRepulsion(i, pts, scale, radius) {
  let fx = 0;
  let fy = 0;
  for (let j = 0; j < pts.length; j += 1) {
    if (i === j) continue;
    const dx = pts[i][0] - pts[j][0];
    const dy = pts[i][1] - pts[j][1];
    const r2 = dx * dx + dy * dy + 0.012;
    const wgt = Math.exp(-r2 / (2 * radius * radius));
    fx += scale * wgt * dx / r2;
    fy += scale * wgt * dy / r2;
  }
  return [fx / Math.max(pts.length, 1), fy / Math.max(pts.length, 1)];
}

function gfDrawTarget(ctx, box, lim, centers) {
  const { X, Y } = gfMap(box, lim);
  for (const c of centers) {
    ctx.strokeStyle = "rgba(33,102,172,.28)";
    ctx.lineWidth = 1.1;
    for (const r of [0.22, 0.38, 0.56]) {
      ctx.beginPath();
      ctx.ellipse(X(c[0]), Y(c[1]), (r / (2 * lim)) * box.w, (r / (2 * lim)) * box.h, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}

function gfDrawTrajectories(ctx, box, lim, trajectories, stride = 1) {
  const { X, Y } = gfMap(box, lim);
  for (let i = 0; i < trajectories.length; i += stride) {
    const path = trajectories[i];
    ctx.beginPath();
    for (let k = 0; k < path.length; k += 1) {
      const p = path[k];
      if (k === 0) ctx.moveTo(X(p[0]), Y(p[1]));
      else ctx.lineTo(X(p[0]), Y(p[1]));
    }
    ctx.strokeStyle = mixColor(i / Math.max(trajectories.length - 1, 1), RED, BLUE, 0.35);
    ctx.lineWidth = 1.05;
    ctx.stroke();
  }
}

function gfDrawPoints(ctx, box, lim, pts, color, radius, alpha = 0.95) {
  const { X, Y } = gfMap(box, lim);
  const [r, g, b] = rgb(color);
  ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
  for (const p of pts) {
    ctx.beginPath();
    ctx.arc(X(p[0]), Y(p[1]), radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawGradflowMMD() {
  const n = Math.round(val("gfmParticles"));
  const separation = val("gfmSeparation");
  const bandwidth = val("gfmBandwidth");
  const seed = Math.round(val("gfmSeed"));
  const centers = gfTargetCenters(separation);
  let pts = gfInitialCloud(n, seed);
  const initial = pts.map((p) => p.slice());
  const trajectories = pts.map((p) => [p.slice()]);
  const steps = 92;
  const dt = 0.055;
  for (let s = 0; s < steps; s += 1) {
    const next = pts.map((p, i) => {
      const a = gfTeacherForce(p, centers, bandwidth);
      const r = gfRepulsion(i, pts, 0.06, 0.34);
      return [p[0] + dt * (1.35 * a[0] + r[0]), p[1] + dt * (1.35 * a[1] + r[1])];
    });
    pts = next;
    if (s % 5 === 0 || s === steps - 1) {
      for (let i = 0; i < n; i += 1) trajectories[i].push(pts[i].slice());
    }
  }
  const { ctx, w, h } = resizeCanvas(404);
  const box = { x: 22, y: 34, w: w - 44, h: h - 62 };
  drawFrame(ctx, box, "deterministic MMD-type particle flow");
  const lim = 2.25;
  gfDrawTarget(ctx, box, lim, centers);
  gfDrawTrajectories(ctx, box, lim, trajectories, Math.max(1, Math.floor(n / 45)));
  gfDrawPoints(ctx, box, lim, initial.filter((_, i) => i % Math.max(1, Math.floor(n / 90)) === 0), RED, 2.2, 0.72);
  gfDrawPoints(ctx, box, lim, pts.filter((_, i) => i % Math.max(1, Math.floor(n / 130)) === 0), BLUE, 2.5, 0.9);
  let coverage = 0;
  for (const p of pts) coverage += Math.min(...centers.map((c) => Math.hypot(p[0] - c[0], p[1] - c[1])));
  coverage /= Math.max(pts.length, 1);
  setStatus(`${n} particles; kernel width ${bandwidth.toFixed(2)}; teacher separation ${separation.toFixed(2)}; mean distance to nearest mode ${coverage.toFixed(2)}`);
}

function drawGradflowInteraction() {
  const mode = val("gfiMode");
  const strength = val("gfiStrength");
  const n = Math.round(val("gfiParticles"));
  const seed = Math.round(val("gfiSeed"));
  const random = rng(seed);
  let pts = [];
  for (let i = 0; i < n; i += 1) {
    const a = (2 * Math.PI * i) / n + 0.32 * randn(random);
    const r = 0.65 + 0.16 * randn(random);
    pts.push([r * Math.cos(a), r * Math.sin(a)]);
  }
  const trajectories = pts.map((p) => [p.slice()]);
  const steps = 150;
  const dt = 0.035;
  for (let s = 0; s < steps; s += 1) {
    const next = pts.map((p, i) => {
      let fx = 0;
      let fy = 0;
      for (let j = 0; j < n; j += 1) {
        if (i === j) continue;
        const dx = p[0] - pts[j][0];
        const dy = p[1] - pts[j][1];
        const r2 = dx * dx + dy * dy + 0.01;
        const local = Math.exp(-r2 / 0.32);
        const sign = mode === "attractive" ? -1 : 1;
        fx += sign * strength * local * dx / Math.sqrt(r2);
        fy += sign * strength * local * dy / Math.sqrt(r2);
      }
      fx /= n;
      fy /= n;
      if (mode === "balanced") {
        fx += -0.38 * p[0];
        fy += -0.38 * p[1];
      }
      return [p[0] + dt * fx, p[1] + dt * fy];
    });
    pts = next;
    if (s % 6 === 0 || s === steps - 1) {
      for (let i = 0; i < n; i += 1) trajectories[i].push(pts[i].slice());
    }
  }
  const { ctx, w, h } = resizeCanvas(392);
  const box = { x: 22, y: 34, w: w - 44, h: h - 62 };
  drawFrame(ctx, box, `${pretty(mode)} kernel`);
  gfDrawTrajectories(ctx, box, 1.95, trajectories, 1);
  gfDrawPoints(ctx, box, 1.95, trajectories.map((p) => p[0]), RED, 2.1, 0.65);
  gfDrawPoints(ctx, box, 1.95, pts, BLUE, 2.7, 0.9);
  const radius = pts.reduce((sum, p) => sum + Math.hypot(p[0], p[1]), 0) / n;
  setStatus(`${pretty(mode)} interaction; strength ${strength.toFixed(2)}; mean final radius ${radius.toFixed(2)}`);
}

function gfSourceTargetClouds(n, seed) {
  const random = rng(seed);
  const source = [];
  const target = [];
  for (let i = 0; i < n; i += 1) {
    source.push([-1.1 + 0.22 * randn(random), -0.52 + 0.28 * randn(random)]);
    const c = i % 2 === 0 ? [-0.2, 0.72] : [1.05, -0.12];
    target.push([c[0] + 0.22 * randn(random), c[1] + 0.2 * randn(random)]);
  }
  return { source, target };
}

function drawGradflowObjective() {
  const geometry = val("gfoGeometry");
  const smooth = val("gfoSmooth");
  const n = Math.round(val("gfoParticles"));
  const seed = Math.round(val("gfoSeed"));
  const { source, target } = gfSourceTargetClouds(n, seed);
  const pts = source.map((p) => p.slice());
  const trajectories = pts.map((p) => [p.slice()]);
  const steps = geometry === "ot_rays" ? 1 : 80;
  for (let s = 0; s < steps; s += 1) {
    for (let i = 0; i < n; i += 1) {
      let vx = 0;
      let vy = 0;
      if (geometry === "ot_rays") {
        vx = target[i][0] - source[i][0];
        vy = target[i][1] - source[i][1];
        pts[i][0] = source[i][0] + vx;
        pts[i][1] = source[i][1] + vy;
      } else {
        let wx = 0;
        let wy = 0;
        let wt = 0;
        for (const q of target) {
          const dx = q[0] - pts[i][0];
          const dy = q[1] - pts[i][1];
          const wgt = Math.exp(-(dx * dx + dy * dy) / (2 * smooth * smooth));
          wx += wgt * dx;
          wy += wgt * dy;
          wt += wgt;
        }
        vx += wx / Math.max(wt, 1e-9);
        vy += wy / Math.max(wt, 1e-9);
        if (geometry === "mmd" || geometry === "drifting") {
          const r = gfRepulsion(i, pts, geometry === "drifting" ? 0.12 : 0.045, 0.42);
          vx += r[0];
          vy += r[1];
        }
        if (geometry === "drifting") {
          const len = Math.max(Math.hypot(vx, vy), 1e-5);
          vx /= len;
          vy /= len;
        }
        const rate = geometry === "sinkhorn" ? 0.075 : 0.052;
        pts[i][0] += rate * vx;
        pts[i][1] += rate * vy;
      }
    }
    if (s % 5 === 0 || s === steps - 1 || geometry === "ot_rays") {
      for (let i = 0; i < n; i += 1) trajectories[i].push(pts[i].slice());
    }
  }
  const { ctx, w, h } = resizeCanvas(394);
  const box = { x: 22, y: 34, w: w - 44, h: h - 62 };
  drawFrame(ctx, box, pretty(geometry));
  gfDrawTrajectories(ctx, box, 2.25, trajectories, 1);
  gfDrawPoints(ctx, box, 2.25, target, BLUE, 2.6, 0.72);
  gfDrawPoints(ctx, box, 2.25, source, RED, 2.5, 0.68);
  gfDrawPoints(ctx, box, 2.25, pts, VIOLET, 2.4, 0.78);
  setStatus(`${pretty(geometry)} geometry; smoothing ${smooth.toFixed(2)}; ${n} source particles`);
}

function drawSoftBlob(ctx, box, lim, center, radius, color, alpha) {
  const { X, Y } = gfMap(box, lim);
  const cx = X(center[0]);
  const cy = Y(center[1]);
  const rr = (radius / (2 * lim)) * Math.min(box.w, box.h);
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
  const [r, g, b] = rgb(color);
  grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, rr, 0, 2 * Math.PI);
  ctx.fill();
}

function drawGradflowFokker() {
  const time = val("gffTime");
  const sigma = val("gffSigma");
  const shift = val("gffShift");
  const seed = Math.round(val("gffSeed"));
  const { ctx, w, h } = resizeCanvas(468);
  const gap = 14;
  const boxH = (h - 66 - 2 * gap) / 3;
  const boxes = [
    { x: 22, y: 36, w: w - 44, h: boxH },
    { x: 22, y: 36 + boxH + gap, w: w - 44, h: boxH },
    { x: 22, y: 36 + 2 * (boxH + gap), w: w - 44, h: boxH },
  ];
  const centers = [[shift - 0.45, 0.34], [shift + 0.55, -0.28]];
  const labels = ["independent Langevin particles", "deterministic score particles", "grid Fokker-Planck density"];
  for (let b = 0; b < 3; b += 1) drawFrame(ctx, boxes[b], labels[b]);
  const lim = 2.3;
  const n = 80;
  const steps = Math.round(28 + 42 * time);
  for (let row = 0; row < 2; row += 1) {
    const random = rng(seed + 17 * row);
    let pts = gfInitialCloud(n, seed + 29 * row, -0.95, 0.0, 0.32);
    const trajectories = pts.map((p) => [p.slice()]);
    for (let s = 0; s < steps; s += 1) {
      pts = pts.map((p, i) => {
        const f = gfTeacherForce(p, centers, 0.72);
        let vx = 0.88 * f[0];
        let vy = 0.88 * f[1];
        if (row === 1) {
          const r = gfRepulsion(i, pts, 0.07 + 0.04 * sigma, 0.46);
          vx += r[0];
          vy += r[1];
        }
        const noise = row === 0 ? sigma * Math.sqrt(0.035) : 0;
        return [p[0] + 0.052 * vx + noise * randn(random), p[1] + 0.052 * vy + noise * randn(random)];
      });
      if (s % 8 === 0 || s === steps - 1) {
        for (let i = 0; i < n; i += 1) trajectories[i].push(pts[i].slice());
      }
    }
    gfDrawTarget(ctx, boxes[row], lim, centers);
    gfDrawTrajectories(ctx, boxes[row], lim, trajectories, 8);
    gfDrawPoints(ctx, boxes[row], lim, pts, row === 0 ? BLUE : VIOLET, 2.0, 0.65);
  }
  gfDrawTarget(ctx, boxes[2], lim, centers);
  const mix = clamp(time, 0, 1);
  drawSoftBlob(ctx, boxes[2], lim, [-0.95 * (1 - mix) + centers[0][0] * mix, centers[0][1] * mix], 0.72 + sigma, BLUE, 0.32);
  drawSoftBlob(ctx, boxes[2], lim, [-0.95 * (1 - mix) + centers[1][0] * mix, centers[1][1] * mix], 0.72 + sigma, BLUE, 0.28);
  drawSoftBlob(ctx, boxes[2], lim, [-0.95, 0], 0.55 + 0.35 * sigma, RED, 0.2 * (1 - mix));
  setStatus(`time ${time.toFixed(2)}; noise sigma ${sigma.toFixed(2)}; target shift ${shift.toFixed(2)}`);
}

function angleDiff(a, b) {
  return Math.atan2(Math.sin(b - a), Math.cos(b - a));
}

function drawGradflowMLP() {
  const n = Math.round(val("gflNeurons"));
  const angle = (Math.PI / 180) * val("gflAngle");
  const time = val("gflTime");
  const seed = Math.round(val("gflSeed"));
  const random = rng(seed);
  const teachers = [Math.PI / 2 - angle, Math.PI / 2 + angle];
  const pts = [];
  for (let i = 0; i < n; i += 1) {
    const a = 2 * Math.PI * random();
    const r = 0.22 + 0.24 * random();
    pts.push([r * Math.cos(a), r * Math.sin(a)]);
  }
  const trajectories = pts.map((p) => [p.slice()]);
  const steps = Math.round(30 + 90 * time);
  for (let s = 0; s < steps; s += 1) {
    for (let i = 0; i < n; i += 1) {
      const p = pts[i];
      let a = Math.atan2(p[1], p[0]);
      let r = Math.hypot(p[0], p[1]);
      const diffs = teachers.map((th) => angleDiff(a, th));
      const best = Math.abs(diffs[0]) < Math.abs(diffs[1]) ? diffs[0] : diffs[1];
      a += 0.045 * best;
      r += 0.025 * (1.25 - r) + 0.014 * Math.cos(best);
      pts[i][0] = r * Math.cos(a);
      pts[i][1] = r * Math.sin(a);
    }
    if (s % 7 === 0 || s === steps - 1) {
      for (let i = 0; i < n; i += 1) trajectories[i].push(pts[i].slice());
    }
  }
  const { ctx, w, h } = resizeCanvas(404);
  const gap = 34;
  const left = { x: 20, y: 42, w: (w - 54 - gap) * 0.55, h: h - 70 };
  const right = { x: left.x + left.w + gap, y: 42, w: (w - 54 - gap) * 0.45, h: h - 70 };
  drawFrame(ctx, left, "neuron trajectories");
  drawFrame(ctx, right, "angular concentration");
  const lim = 1.7;
  const { X, Y } = gfMap(left, lim);
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = "rgba(35,45,55,.55)";
  for (const th of teachers) {
    ctx.beginPath();
    ctx.moveTo(X(0), Y(0));
    ctx.lineTo(X(1.55 * Math.cos(th)), Y(1.55 * Math.sin(th)));
    ctx.stroke();
  }
  ctx.setLineDash([]);
  gfDrawTrajectories(ctx, left, lim, trajectories, Math.max(1, Math.floor(n / 70)));
  gfDrawPoints(ctx, left, lim, pts, BLUE, 2.1, 0.78);

  const bins = 36;
  const hist = Array(bins).fill(0);
  for (const p of pts) {
    const a = (Math.atan2(p[1], p[0]) + 2 * Math.PI) % (2 * Math.PI);
    const k = Math.min(bins - 1, Math.floor((a / (2 * Math.PI)) * bins));
    hist[k] += Math.hypot(p[0], p[1]) ** 2;
  }
  const maxH = Math.max(...hist, 1);
  for (let k = 0; k < bins; k += 1) {
    const x0 = right.x + (k / bins) * right.w;
    const x1 = right.x + ((k + 0.78) / bins) * right.w;
    const y = right.y + right.h - (hist[k] / maxH) * right.h;
    ctx.fillStyle = mixColor(k / (bins - 1), RED, BLUE, 0.58);
    ctx.fillRect(x0, y, Math.max(1, x1 - x0), right.y + right.h - y);
  }
  ctx.strokeStyle = "#d8dee8";
  ctx.strokeRect(right.x, right.y, right.w, right.h);
  setStatus(`${n} neurons; teacher rays at +/- ${val("gflAngle").toFixed(0)} degrees; displayed time ${time.toFixed(2)}`);
}

function gmAtoms(gap) {
  return [[0, 0.62 * gap], [-0.58 * gap, -0.42 * gap], [0.66 * gap, -0.34 * gap]];
}

function gmSourceTarget(n, seed, gap = 1) {
  const random = rng(seed);
  const atoms = gmAtoms(gap);
  const source = [];
  const target = [];
  for (let i = 0; i < n; i += 1) {
    const a = 2 * Math.PI * random();
    const r = 0.34 + 0.24 * random();
    source.push([-0.92 + r * Math.cos(a), 0.08 + 0.72 * r * Math.sin(a)]);
    const c = atoms[i % atoms.length];
    target.push([c[0] + 0.16 * randn(random), c[1] + 0.16 * randn(random)]);
  }
  return { source, target, atoms };
}

function gmPathPoint(p, q, t, curvature, side = 1) {
  const x = lerp(p[0], q[0], t);
  const y = lerp(p[1], q[1], t);
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  const len = Math.max(Math.hypot(dx, dy), 1e-8);
  const bump = curvature * Math.sin(Math.PI * t);
  return [x - side * bump * dy / len, y + side * bump * dx / len];
}

function drawGenerativeFlowPanel(ctx, box, source, target, assignment, time, curvature, title, curveMode) {
  drawFrame(ctx, box, title);
  const paired = source.map((_, i) => target[assignment[i]]);
  const lim = limits(source.concat(target).concat(paired));
  const range = Math.max(Math.abs(lim.xmin), Math.abs(lim.xmax), Math.abs(lim.ymin), Math.abs(lim.ymax), 1.4) + 0.22;
  const proj = gfMap(box, range);
  const stride = Math.max(1, Math.floor(source.length / 34));
  for (let i = 0; i < source.length; i += stride) {
    const side = i % 2 === 0 ? 1 : -1;
    ctx.beginPath();
    for (let k = 0; k <= 24; k += 1) {
      const t = k / 24;
      const z = curveMode ? gmPathPoint(source[i], paired[i], t, curvature, side) : gmPathPoint(source[i], paired[i], t, 0, side);
      if (k === 0) ctx.moveTo(proj.X(z[0]), proj.Y(z[1]));
      else ctx.lineTo(proj.X(z[0]), proj.Y(z[1]));
    }
    ctx.strokeStyle = curveMode ? "rgba(123,50,148,.28)" : "rgba(80,91,105,.22)";
    ctx.lineWidth = 1;
    ctx.stroke();
    if (i % (2 * stride) === 0) {
      const z0 = curveMode ? gmPathPoint(source[i], paired[i], time, curvature, side) : gmPathPoint(source[i], paired[i], time, 0, side);
      const z1 = curveMode ? gmPathPoint(source[i], paired[i], clamp(time + 0.05, 0, 1), curvature, side) : gmPathPoint(source[i], paired[i], clamp(time + 0.05, 0, 1), 0, side);
      drawTinyArrow(ctx, proj.X(z0[0]), proj.Y(z0[1]), proj.X(z1[0]) - proj.X(z0[0]), proj.Y(z1[1]) - proj.Y(z0[1]), "rgba(123,50,148,.65)", 1.1);
    }
  }
  gfDrawPoints(ctx, box, range, source, RED, 2.4, 0.55);
  gfDrawPoints(ctx, box, range, target, BLUE, 2.4, 0.55);
  const current = source.map((p, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    return curveMode ? gmPathPoint(p, paired[i], time, curvature, side) : gmPathPoint(p, paired[i], time, 0, side);
  });
  gfDrawPoints(ctx, box, range, current, VIOLET, 2.9, 0.9);
}

function drawGenerativeFlow() {
  const n = Math.round(val("gmfParticles"));
  const time = val("gmfTime");
  const curvature = val("gmfCurvature");
  const seed = Math.round(val("gmfSeed"));
  const { source, target } = gmSourceTarget(n, seed, 1.0);
  const product = source.map((_, i) => (7 * i + 3) % n);
  const assignment = hungarian(costMatrix(source, target, 2));
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 680 ? 650 : 390);
  const boxes = beyondBoxes(w, h, 3, 850);
  drawGenerativeFlowPanel(ctx, boxes[0], source, target, product, time, 0, "product pairing", false);
  drawGenerativeFlowPanel(ctx, boxes[1], source, target, assignment, time, 0, "OT pairing", false);
  drawGenerativeFlowPanel(ctx, boxes[2], source, target, assignment, time, curvature, "curved bridge", true);
  setStatus(`${n} paired particles; time ${time.toFixed(2)}; curved-bridge bend ${curvature.toFixed(2)}`);
}

function gen1dPdf(xs, time, separation, noise) {
  const weights = [0.42, 0.34, 0.24];
  const means = [-separation, 0.05, 0.82 * separation];
  const stds = [0.18, 0.26, 0.2];
  return xs.map((x) => {
    let y = 0;
    for (let k = 0; k < weights.length; k += 1) {
      const mean = (1 - time) * means[k];
      const std = Math.sqrt(((1 - time) * stds[k]) ** 2 + (time * noise) ** 2 + 0.004);
      y += weights[k] * normalPdf(x, mean, std);
    }
    return y;
  });
}

function drawGenerativeDiffusion1D() {
  const time = val("gmd1Time");
  const separation = val("gmd1Separation");
  const noise = val("gmd1Noise");
  const samples = Math.round(val("gmd1Samples"));
  const xs = Array.from({ length: 620 }, (_, i) => lerp(-3.2, 3.2, i / 619));
  const snapshots = [0, 0.33 * time, 0.66 * time, time, 1];
  const pdfs = snapshots.map((t) => gen1dPdf(xs, t, separation, noise));
  const yMax = 1.08 * Math.max(...pdfs.flat());
  const { ctx, w, h } = resizeCanvas(410);
  const gap = 34;
  const left = { x: 18, y: 38, w: (w - 52 - gap) * 0.52, h: h - 66 };
  const right = { x: left.x + left.w + gap, y: 38, w: (w - 52 - gap) * 0.48, h: h - 66 };
  drawFrame(ctx, left, "forward noising densities");
  drawFrame(ctx, right, "reverse probability-flow paths");
  for (let k = 0; k < pdfs.length; k += 1) {
    const color = mixColor(snapshots[k], RED, BLUE, k === pdfs.length - 1 ? 0.85 : 0.55);
    drawCurve(ctx, xs, pdfs[k], left, -3.2, 3.2, 0, yMax, color, k === 0 || k === pdfs.length - 1 ? 2 : 1.25);
  }
  const modes = [-separation, 0.05, 0.82 * separation];
  const X = (x) => right.x + ((x + 3.2) / 6.4) * right.w;
  const Y = (t) => right.y + right.h - t * right.h;
  for (let i = 0; i < samples; i += 1) {
    const u = (i + 0.5) / samples;
    const z0 = normalInv(u, 0, noise);
    const target = modes[Math.min(2, Math.floor(3 * u))];
    const bend = 0.26 * Math.sin(2 * Math.PI * u);
    ctx.beginPath();
    for (let k = 0; k <= 34; k += 1) {
      const s = k / 34;
      const x = lerp(z0, target, s) + bend * Math.sin(Math.PI * s) * (1 - 0.3 * time);
      if (k === 0) ctx.moveTo(X(x), Y(0));
      else ctx.lineTo(X(x), Y(s));
    }
    ctx.strokeStyle = mixColor(u, BLUE, RED, 0.32);
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }
  for (const m of modes) {
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(X(m), Y(1), 3, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = BLUE;
  ctx.fillText("noise", right.x + 10, right.y + right.h - 10);
  ctx.fillStyle = RED;
  ctx.fillText("data", right.x + 10, right.y + 16);
  setStatus(`time ${time.toFixed(2)}; mode separation ${separation.toFixed(2)}; endpoint noise ${noise.toFixed(2)}; ${samples} reverse paths`);
}

function gmSchedule(mode, t) {
  if (mode === "vp") return { a: Math.cos(0.5 * Math.PI * t), b: Math.sin(0.5 * Math.PI * t), bend: 0.26 };
  if (mode === "overshoot") return { a: (1 - t) * (1 - 2 * t), b: t, bend: 0.5 };
  return { a: 1 - t, b: t, bend: 0.08 };
}

function drawNoisingSnapshot(ctx, box, atoms, sigma, mode, title, highlight) {
  drawFrame(ctx, box, title);
  const lim = 2.2;
  const proj = gfMap(box, lim);
  const times = [0, 0.28, 0.56, 0.82, 1];
  for (const t of times) {
    const { a, b } = gmSchedule(mode, t);
    const alpha = t === 0 || t === 1 ? 0.32 : 0.18;
    for (const c of atoms) {
      const x = a * c[0];
      const y = a * c[1];
      const radius = Math.max(0.035, Math.abs(b) * sigma);
      ctx.strokeStyle = mixColor(t, RED, BLUE, alpha + 0.28 * (Math.abs(t - highlight) < 0.04));
      ctx.lineWidth = Math.abs(t - highlight) < 0.04 ? 2.1 : 1.1;
      ctx.beginPath();
      ctx.ellipse(proj.X(x), proj.Y(y), (radius / (2 * lim)) * box.w, (radius / (2 * lim)) * box.h, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = mixColor(t, RED, BLUE, 0.16);
      ctx.beginPath();
      ctx.arc(proj.X(x), proj.Y(y), 2.6, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  ctx.fillStyle = "#5f6670";
  ctx.fillText("t=0", box.x + 10, box.y + box.h - 10);
  ctx.fillText("t=1", box.x + box.w - 28, box.y + 16);
}

function drawGenerativeDiffusion2D() {
  const time = val("gmd2Time");
  const gap = val("gmd2Gap");
  const sigma = val("gmd2Sigma");
  const atoms = gmAtoms(gap);
  const { ctx, w, h } = resizeCanvas(420);
  const boxes = beyondBoxes(w, h, 2, 760);
  drawNoisingSnapshot(ctx, boxes[0], atoms, sigma, "linear", `linear bridge, t=${time.toFixed(2)}`, time);
  drawNoisingSnapshot(ctx, boxes[1], atoms, sigma, "vp", "OU / variance-preserving bridge", time);
  setStatus(`selected time ${time.toFixed(2)}; atom gap ${gap.toFixed(2)}; Gaussian endpoint sigma ${sigma.toFixed(2)}`);
}

function drawTrajectoryFamily(ctx, box, starts, atoms, mode, title, bendScale, straight = false) {
  drawFrame(ctx, box, title);
  const lim = 2.35;
  const proj = gfMap(box, lim);
  const assignment = starts.map((p, i) => {
    const angle = Math.atan2(p[1] + 0.05 * i, p[0] - 0.03 * i);
    const sector = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * atoms.length) % atoms.length;
    return atoms[(sector + atoms.length) % atoms.length];
  });
  for (let i = 0; i < starts.length; i += 1) {
    const p = starts[i];
    const q = assignment[i];
    const side = i % 2 === 0 ? 1 : -1;
    const localBend = straight ? 0 : bendScale * (0.45 + 0.55 * Math.sin((i + 1) * 1.7) ** 2);
    ctx.beginPath();
    for (let k = 0; k <= 36; k += 1) {
      const s = k / 36;
      const schedule = gmSchedule(mode, s);
      const z = gmPathPoint(p, q, s, localBend * schedule.bend, side);
      if (k === 0) ctx.moveTo(proj.X(z[0]), proj.Y(z[1]));
      else ctx.lineTo(proj.X(z[0]), proj.Y(z[1]));
    }
    ctx.strokeStyle = straight ? "rgba(80,91,105,.22)" : mixColor(i / Math.max(starts.length - 1, 1), RED, BLUE, 0.34);
    ctx.lineWidth = straight ? 0.8 : 1.05;
    ctx.stroke();
  }
  gfDrawPoints(ctx, box, lim, starts, RED, 2.1, 0.55);
  gfDrawPoints(ctx, box, lim, atoms, BLUE, 4.2, 0.86);
}

function drawGenerativeTrajectories() {
  const mode = val("gmtSchedule");
  const n = Math.round(val("gmtParticles"));
  const gap = val("gmtGap");
  const seed = Math.round(val("gmtSeed"));
  const random = rng(seed);
  const atoms = gmAtoms(gap);
  const starts = [];
  for (let i = 0; i < n; i += 1) starts.push([0.56 * randn(random), 0.56 * randn(random)]);
  const { ctx, w, h } = resizeCanvas(405);
  const boxes = beyondBoxes(w, h, 2, 760);
  const bend = mode === "linear" ? 0.15 : mode === "vp" ? 0.55 : 0.85;
  drawTrajectoryFamily(ctx, boxes[0], starts, atoms, mode, `${pretty(mode)} reverse flow`, bend, false);
  drawTrajectoryFamily(ctx, boxes[1], starts, atoms, mode, "quadratic OT rays", 0, true);
  setStatus(`${pretty(mode)} schedule; ${n} noise samples; atom gap ${gap.toFixed(2)}; compare curved reverse flow with straight OT rays`);
}

function drawGenerativeSchedule() {
  const n = Math.round(val("gmsParticles"));
  const gap = val("gmsGap");
  const seed = Math.round(val("gmsSeed"));
  const random = rng(seed);
  const atoms = gmAtoms(gap);
  const starts = [];
  for (let i = 0; i < n; i += 1) starts.push([0.56 * randn(random), 0.56 * randn(random)]);
  const frameWidth = canvas.getBoundingClientRect().width || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 760);
  const { ctx, w, h } = resizeCanvas(frameWidth < 680 ? 650 : 430);
  const boxes = beyondBoxes(w, h, 3, 880);
  drawTrajectoryFamily(ctx, boxes[0], starts, atoms, "linear", "linear bridge", 0.15, false);
  drawTrajectoryFamily(ctx, boxes[1], starts, atoms, "vp", "OU / VP bridge", 0.55, false);
  drawTrajectoryFamily(ctx, boxes[2], starts, atoms, "overshoot", "overshooting bridge", 0.85, false);
  setStatus(`${n} reverse paths; atom gap ${gap.toFixed(2)}; the three scalar schedules share endpoints but bend the flow differently`);
}

function gdSimulate(n, seed, centers, kernel, correction, steps) {
  let pts = gfInitialCloud(n, seed, -0.9, -0.15, 0.36);
  const trajectories = pts.map((p) => [p.slice()]);
  for (let s = 0; s < steps; s += 1) {
    pts = pts.map((p, i) => {
      const attract = gfTeacherForce(p, centers, kernel);
      const repel = gfRepulsion(i, pts, 0.19 * correction, 0.42 + 0.3 * kernel);
      const vx = 1.08 * attract[0] + repel[0] - 0.02 * p[0];
      const vy = 1.08 * attract[1] + repel[1] - 0.02 * p[1];
      return [p[0] + 0.05 * vx, p[1] + 0.05 * vy];
    });
    if (s % 6 === 0 || s === steps - 1) {
      for (let i = 0; i < n; i += 1) trajectories[i].push(pts[i].slice());
    }
  }
  return { pts, trajectories };
}

function drawGenerativeDrifting() {
  const correction = val("gmdriftCorrection");
  const kernel = val("gmdriftKernel");
  const steps = Math.round(val("gmdriftSteps"));
  const n = Math.round(val("gmdriftParticles"));
  const seed = Math.round(val("gmdriftSeed"));
  const centers = gfTargetCenters(2.1);
  const raw = gdSimulate(n, seed, centers, kernel, 0, steps);
  const fixed = gdSimulate(n, seed, centers, kernel, correction, steps);
  const { ctx, w, h } = resizeCanvas(400);
  const boxes = beyondBoxes(w, h, 2, 760);
  const sims = [raw, fixed];
  for (let idx = 0; idx < sims.length; idx += 1) {
    const sim = sims[idx];
    const box = boxes[idx];
    drawFrame(ctx, box, idx === 0 ? "raw kernel drift" : "self-corrected drift");
    gfDrawTarget(ctx, box, 2.25, centers);
    gfDrawTrajectories(ctx, box, 2.25, sim.trajectories, Math.max(1, Math.floor(n / 46)));
    gfDrawPoints(ctx, box, 2.25, sim.trajectories.map((p) => p[0]), RED, 2.2, 0.48);
    gfDrawPoints(ctx, box, 2.25, sim.pts, idx === 0 ? BLUE : VIOLET, 2.5, 0.85);
  }
  let coverage = 0;
  for (const p of fixed.pts) coverage += Math.min(...centers.map((c) => Math.hypot(p[0] - c[0], p[1] - c[1])));
  coverage /= Math.max(fixed.pts.length, 1);
  setStatus(`${n} particles; kernel width ${kernel.toFixed(2)}; self-correction ${correction.toFixed(2)}; final nearest-mode distance ${coverage.toFixed(2)}`);
}

function gaussianClosureCovarianceFromAxes(a, b, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const aa = a * a;
  const bb = b * b;
  return {
    xx: aa * c * c + bb * s * s,
    xy: (aa - bb) * c * s,
    yy: aa * s * s + bb * c * c,
  };
}

function drawGaussianClosureCovEllipse(ctx, box, lim, mean, cov, color, alpha, width = 1.25) {
  const proj = gfMap(box, lim);
  const tr = cov.xx + cov.yy;
  const det = cov.xx * cov.yy - cov.xy * cov.xy;
  const disc = Math.sqrt(Math.max(0, tr * tr - 4 * det));
  const l1 = Math.max(1e-5, 0.5 * (tr + disc));
  const l2 = Math.max(1e-5, 0.5 * (tr - disc));
  const angle = 0.5 * Math.atan2(2 * cov.xy, cov.xx - cov.yy);
  const sx = (2 * Math.sqrt(l1) / (2 * lim)) * box.w;
  const sy = (2 * Math.sqrt(l2) / (2 * lim)) * box.h;
  const [r, g, b] = rgb(color);
  ctx.save();
  ctx.translate(proj.X(mean[0]), proj.Y(mean[1]));
  ctx.rotate(-angle);
  ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.ellipse(0, 0, sx, sy, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();
}

function interpolateCov(c0, c1, t, inflate = 0) {
  return {
    xx: lerp(c0.xx, c1.xx, t) + inflate,
    xy: lerp(c0.xy, c1.xy, t),
    yy: lerp(c0.yy, c1.yy, t) + inflate,
  };
}

function drawClosurePanel(ctx, box, title, c0, c1, time, epsilon, bend) {
  drawFrame(ctx, box, title);
  const lim = 1.85;
  const m0 = [-0.86, -0.26];
  const m1 = [0.84, 0.3];
  for (let k = 0; k <= 8; k += 1) {
    const t = k / 8;
    let mean = [lerp(m0[0], m1[0], t), lerp(m0[1], m1[1], t)];
    let inflate = 0;
    if (title.includes("Sinkhorn")) inflate = epsilon * Math.sin(Math.PI * t);
    if (title.includes("drifting")) {
      mean = gmPathPoint(m0, m1, t, bend, 1);
      inflate = 0.04 * Math.sin(Math.PI * t);
    }
    const cov = interpolateCov(c0, c1, t, inflate);
    drawGaussianClosureCovEllipse(ctx, box, lim, mean, cov, mixColor(t, RED, BLUE), 0.34 + 0.38 * (Math.abs(t - time) < 0.07), Math.abs(t - time) < 0.07 ? 2.2 : 1.2);
  }
  gfDrawPoints(ctx, box, lim, [m0], RED, 3.1, 0.8);
  gfDrawPoints(ctx, box, lim, [m1], BLUE, 3.1, 0.8);
}

function drawGenerativeGaussianClosure() {
  const time = val("gmgcTime");
  const aniso = val("gmgcAniso");
  const angle = (Math.PI / 180) * val("gmgcAngle");
  const epsilon = val("gmgcEpsilon");
  const bend = val("gmgcBend");
  const c0 = gaussianClosureCovarianceFromAxes(0.42 * aniso, 0.32, angle);
  const c1 = gaussianClosureCovarianceFromAxes(0.36, 0.46 * aniso, -0.75 * angle);
  const { ctx, w, h } = resizeCanvas(400);
  const boxes = beyondBoxes(w, h, 3, 880);
  drawClosurePanel(ctx, boxes[0], "W2 geodesic closure", c0, c1, time, 0, 0);
  drawClosurePanel(ctx, boxes[1], "Sinkhorn closure", c0, c1, time, epsilon, 0);
  drawClosurePanel(ctx, boxes[2], "drifting closure", c0, c1, time, epsilon, bend);
  setStatus(`highlight time ${time.toFixed(2)}; anisotropy ${aniso.toFixed(2)}; Sinkhorn inflation ${epsilon.toFixed(2)}; drifting bend ${bend.toFixed(2)}`);
}

function init() {
  if (kind === "linecost") {
    controls.innerHTML = [
      slider("n1d", "points", 42, 8, 96, 2),
      select("lineSource", "source", Object.keys(MIXTURES), "two"),
      select("lineTarget", "target", Object.keys(MIXTURES), "three"),
      slider("pConvex", "convex p", 2, 1.1, 4, 0.1),
      slider("pConcave", "concave p", 0.5, 0.2, 0.95, 0.05),
    ].join("");
    bind(drawLineCost);
  } else if (kind === "quantile") {
    controls.innerHTML = [
      slider("n", "points", 52, 8, 140, 2),
      select("source", "source", Object.keys(MIXTURES), "two"),
      select("target", "target", Object.keys(MIXTURES), "three"),
    ].join("");
    bind(drawQuantile);
  } else if (kind === "histogram") {
    controls.innerHTML = [
      slider("mean", "mean", 0.18, 0.05, 0.85, 0.01),
      slider("sigma", "sigma", 0.105, 0.04, 0.28, 0.005),
      slider("interp", "t", 0.67, 0, 1, 0.01),
    ].join("");
    bind(drawHistogram);
  } else if (kind === "circle") {
    controls.innerHTML = [
      slider("circleN", "points", 18, 6, 30, 1),
      slider("circleP", "p", 2, 1.1, 5, 0.1),
      select("circleMode", "shift", ["optimal", "manual"], "optimal"),
      slider("circleShift", "manual", 0, 0, 29, 1),
      slider("circleSeed", "seed", 2026, 2000, 2100, 1),
    ].join("");
    bind(drawCircle);
  } else if (kind === "cost") {
    controls.innerHTML = [
      slider("n2", "points", 36, 8, 72, 2),
      select("source2", "source", SHAPES, "disk"),
      select("target2", "target", SHAPES, "annulus"),
      slider("seed2", "seed", 2074, 2000, 2100, 1),
      slider("p1", "p1", 1, 0.5, 8, 0.5),
      slider("p2", "p2", 2, 0.5, 8, 0.5),
      slider("p3", "p3", 6, 0.5, 8, 0.5),
    ].join("");
    bind(drawCostSweep);
  } else if (kind === "resolution" || kind === "regularization") {
    controls.innerHTML = [
      slider("ns", "source n", 36, 8, 72, 2),
      slider("nt", "target n", 18, 4, 60, 2),
      select("wmode", "weights", WEIGHTS, "angular"),
      slider("seedr", "seed", 2031, 2000, 2100, 1),
      slider("strength", "strength", 1.4, 0, 4, 0.2),
      slider("eps1", "eps 1", 0.03, 0.005, 0.2, 0.005),
      slider("eps2", "eps 2", 0.12, 0.005, 0.3, 0.005),
    ].join("");
    bind(drawRegularization);
  } else if (kind === "duplication") {
    controls.innerHTML = [
      slider("dupN", "sites", 10, 5, 18, 1),
      slider("dupMax", "max mult", 3, 1, 4, 1),
      slider("dupSeed", "seed", 2037, 2000, 2100, 1),
    ].join("");
    bind(drawDuplication);
  } else if (kind === "mongecolor") {
    controls.innerHTML = [
      slider("colorT", "t", 0.62, 0, 1, 0.01),
      slider("colorSize", "resolution", 160, 80, 240, 8),
      select("colorTarget", "target", ["flower", "orchid", "forest"], "flower"),
      slider("colorContrast", "contrast", 1, 0.55, 1.35, 0.05),
    ].join("");
    bind(drawMongeColor);
  } else if (kind === "mongeshape") {
    controls.innerHTML = [
      slider("shapeT", "t", 0.5, 0, 1, 0.01),
      slider("shapeN", "particles", 58, 18, 86, 2),
      select("shapeSource", "source", ["crescent", "disk", "two_blobs", "three_blobs"], "crescent"),
      slider("shapeSeed", "seed", 2044, 2000, 2100, 1),
    ].join("");
    bind(drawMongeShape);
  } else if (kind === "mongequantile") {
    controls.innerHTML = [
      slider("mqT", "t", 0.5, 0, 1, 0.01),
      select("mqSource", "source", Object.keys(MIXTURES), "wide_two"),
      select("mqTarget", "target", Object.keys(MIXTURES), "three"),
      slider("mqSamples", "levels", 180, 60, 360, 10),
    ].join("");
    bind(drawMongeQuantile);
  } else if (kind === "mongetriangular") {
    controls.innerHTML = [
      slider("triProgress", "progress", 0.58, 0, 1, 0.01),
      slider("triN", "particles", 120, 40, 220, 10),
      select("triSource", "source", ["crescent", "disk", "two_blobs", "three_blobs"], "crescent"),
      slider("triSeed", "seed", 2062, 2000, 2100, 1),
    ].join("");
    bind(drawMongeTriangular);
  } else if (kind === "mongegaussian") {
    controls.innerHTML = [
      slider("gaussT", "t", 0.5, 0, 1, 0.01),
      select("gaussMode", "mode", ["one_dimensional", "anisotropic_to_isotropic", "rotated_anisotropies"], "rotated_anisotropies"),
      slider("gaussShape", "shape", 2.5, 1.1, 4.6, 0.1),
      slider("gaussAngle", "angle", 52, 0, 82, 1),
    ].join("");
    bind(drawMongeGaussian);
  } else if (kind === "kantocouplings") {
    controls.innerHTML = [
      slider("kcN", "points", 24, 8, 54, 2),
      select("kcMode", "plan", ["graph", "product", "splitting", "entropic"], "splitting"),
      select("kcSource", "source", SHAPES, "disk"),
      select("kcTarget", "target", SHAPES, "annulus"),
      slider("kcSeed", "seed", 2077, 2000, 2100, 1),
    ].join("");
    bind(drawKantoCouplings);
  } else if (kind === "kantomatrix") {
    controls.innerHTML = [
      slider("kmBins", "bins", 48, 12, 120, 4),
      select("kmMode", "plan", ["optimal", "product"], "optimal"),
      select("kmSource", "source", Object.keys(MIXTURES), "two"),
      select("kmTarget", "target", Object.keys(MIXTURES), "three"),
    ].join("");
    bind(drawKantoMatrix);
  } else if (kind === "kantosplitting") {
    controls.innerHTML = [
      slider("ksN", "sites", 14, 6, 26, 1),
      slider("ksImbalance", "imbalance", 1.6, 0, 3.5, 0.1),
      slider("ksSeed", "seed", 2059, 2000, 2100, 1),
    ].join("");
    bind(drawKantoSplitting);
  } else if (kind === "kantobarrier") {
    controls.innerHTML = [
      slider("kbEps", "epsilon", 0.09, 0.01, 0.65, 0.01),
      slider("kbAngle", "objective", 232, 180, 305, 1),
    ].join("");
    bind(drawKantoBarrier);
  } else if (kind === "kantoplan") {
    controls.innerHTML = [
      slider("kpT", "t", 0.5, 0, 1, 0.01),
      slider("kpSourceN", "source n", 16, 6, 34, 2),
      slider("kpTargetN", "target n", 13, 5, 30, 1),
      slider("kpEps", "epsilon", 0.04, 0, 0.2, 0.005),
      slider("kpSeed", "seed", 2068, 2000, 2100, 1),
    ].join("");
    bind(drawKantoPlan);
  } else if (kind === "kantogluing") {
    controls.innerHTML = [
      slider("kgBins", "outer bins", 34, 12, 72, 2),
      slider("kgMid", "middle bins", 18, 6, 48, 2),
    ].join("");
    bind(drawKantoGluing);
  } else if (kind === "kantowow") {
    controls.innerHTML = [
      slider("kwT", "t", 0.5, 0, 1, 0.01),
      slider("kwSep", "separation", 1.55, 0.8, 2.4, 0.05),
      select("kwMode", "matching", ["aligned", "crossed"], "aligned"),
    ].join("");
    bind(drawKantoWow);
  } else if (kind === "kantoclt") {
    controls.innerHTML = [
      slider("kcltN", "n", 16, 1, 120, 1),
      slider("kcltSkew", "skew", 0, -0.35, 0.35, 0.01),
    ].join("");
    bind(drawKantoClt);
  } else if (kind === "dualdiscrete") {
    controls.innerHTML = [
      slider("ddBins", "bins", 42, 14, 100, 2),
      select("ddSource", "source", Object.keys(MIXTURES), "two"),
      select("ddTarget", "target", Object.keys(DUAL_TARGETS), "balanced"),
    ].join("");
    bind(drawDualDiscrete);
  } else if (kind === "dualauction") {
    controls.innerHTML = [
      slider("daN", "size", 9, 5, 15, 1),
      slider("daEps", "epsilon", 0.001, 0.0002, 0.006, 0.0002),
      slider("daProgress", "progress", 0.58, 0, 1, 0.01),
      slider("daSpread", "jitter", 0.8, 0, 2.4, 0.1),
    ].join("");
    bind(drawDualAuction);
  } else if (kind === "dualcontinuous") {
    controls.innerHTML = [
      slider("dcGrid", "grid", 220, 80, 420, 20),
      select("dcSource", "source", Object.keys(MIXTURES), "two"),
      select("dcTarget", "target", Object.keys(DUAL_TARGETS), "three_mode"),
    ].join("");
    bind(drawDualContinuous);
  } else if (kind === "dualenvelope") {
    controls.innerHTML = [
      slider("dePower", "p", 2, 1, 5, 0.1),
      slider("deAtoms", "atoms", 5, 3, 9, 1),
      slider("deAmp", "amplitude", 0.45, 0.05, 0.9, 0.05),
    ].join("");
    bind(drawDualEnvelope);
  } else if (kind === "dualalternate") {
    controls.innerHTML = [
      select("dalSide", "side", ["source", "target"], "source"),
      slider("dalRough", "roughness", 1, 0, 2.2, 0.1),
      slider("dalGrid", "grid", 180, 80, 320, 20),
    ].join("");
    bind(drawDualAlternate);
  } else if (kind === "semilaguerre") {
    controls.innerHTML = [
      slider("slSites", "sites", 21, 8, 36, 1),
      slider("slSteps", "updates", 64, 0, 180, 4),
      select("slMass", "target mass", ["uniform", "vertical", "right_heavy"], "uniform"),
      select("slDensity", "density", ["three_mode", "right_blob", "ring"], "three_mode"),
      slider("slSeed", "seed", 2113, 2060, 2160, 1),
    ].join("");
    bind(drawSemiLaguerre);
  } else if (kind === "semilloyd") {
    controls.innerHTML = [
      slider("llSites", "sites", 21, 8, 36, 1),
      slider("llIter", "iterations", 14, 0, 40, 1),
      select("llDensity", "density", ["three_mode", "right_blob", "ring"], "three_mode"),
      slider("llSeed", "seed", 2113, 2060, 2160, 1),
    ].join("");
    bind(drawSemiLloyd);
  } else if (kind === "w1graph") {
    controls.innerHTML = [
      slider("wgSide", "grid", 6, 5, 8, 1),
      slider("wgCount", "sites", 5, 3, 8, 1),
      select("wgMode", "measure", ["left_to_right", "corner_swap", "center_out"], "left_to_right"),
      select("wgGraph", "edges", ["grid", "diagonal"], "diagonal"),
      slider("wgSeed", "seed", 2141, 2100, 2180, 1),
    ].join("");
    bind(drawW1Graph);
  } else if (kind === "dualnormipm") {
    controls.innerHTML = [
      slider("ipmSep", "separation", 1.15, 0, 2.5, 0.05),
      slider("ipmSigma", "kernel sigma", 0.42, 0.14, 0.95, 0.01),
      select("ipmMode", "densities", ["shifted", "scale", "three_mode"], "three_mode"),
    ].join("");
    bind(drawDualNormIpm);
  } else if (kind === "dualnormphi") {
    controls.innerHTML = [
      select("phiFamily", "divergence", ["kl", "reverse_kl", "hellinger", "tv", "jensen_shannon", "power"], "kl"),
      slider("phiGamma", "power gamma", 1.6, -1.5, 3, 0.1),
      slider("phiMismatch", "mismatch", 0.8, 0, 2.2, 0.05),
      slider("phiZeros", "near-zero beta bins", 1, 0, 4, 1),
    ].join("");
    bind(drawDualNormPhi);
  } else if (kind === "sinkhornscaling") {
    controls.innerHTML = [
      slider("shBins", "bins", 34, 18, 60, 2),
      slider("shEps", "epsilon", 0.075, 0.018, 0.36, 0.002),
      slider("shSteps", "half-steps", 9, 0, 60, 1),
      select("shSource", "source", Object.keys(MIXTURES), "wide_two"),
      select("shTarget", "target", Object.keys(MIXTURES), "three"),
    ].join("");
    bind(drawSinkhornScaling);
  } else if (kind === "sinkhornepsilon") {
    controls.innerHTML = [
      slider("seBins", "bins", 42, 22, 70, 2),
      slider("seEps", "epsilon", 0.06, 0.012, 0.42, 0.002),
      select("seSource", "source", Object.keys(MIXTURES), "wide_two"),
      select("seTarget", "target", Object.keys(MIXTURES), "three"),
    ].join("");
    bind(drawSinkhornEpsilon);
  } else if (kind === "sinkhornsoftc") {
    controls.innerHTML = [
      slider("sscEps", "epsilon", 0.16, 0.015, 0.85, 0.005),
      slider("sscAtoms", "atoms", 6, 3, 10, 1),
      slider("sscRough", "roughness", 1, 0, 2.4, 0.1),
    ].join("");
    bind(drawSinkhornSoftC);
  } else if (kind === "sinkhornregularizers") {
    controls.innerHTML = [
      select("srKind", "regularizer", ["kl", "burg", "quadratic"], "kl"),
      slider("srEps", "epsilon", 0.24, 0.18, 0.55, 0.005),
      slider("srBins", "bins", 28, 18, 42, 2),
      select("srSource", "source", Object.keys(MIXTURES), "wide_two"),
      select("srTarget", "target", Object.keys(MIXTURES), "three"),
    ].join("");
    bind(drawSinkhornRegularizers);
  } else if (kind === "sinkhorndebias") {
    controls.innerHTML = [
      slider("sdEps", "epsilon", 0.24, 0.03, 0.85, 0.01),
      slider("sdShift", "model shift", 0.55, -1.2, 1.2, 0.05),
      slider("sdSpread", "model spread", 1, 0.65, 1.45, 0.05),
    ].join("");
    bind(drawSinkhornDebias);
  } else if (kind === "sinkhorncontinuous") {
    controls.innerHTML = [
      slider("sceEps", "epsilon", 0.18, 0.03, 0.55, 0.005),
      slider("sceTime", "flow time", 1.2, 0, 4, 0.02),
      slider("sceBins", "bins", 38, 18, 62, 2),
      select("sceSource", "source", Object.keys(MIXTURES), "wide_two"),
      select("sceTarget", "target", Object.keys(MIXTURES), "three"),
    ].join("");
    bind(drawContinuousSinkhorn);
  } else if (kind === "sinkhornadvancedconvergence") {
    controls.innerHTML = [
      slider("sacEps", "epsilon", 0.24, 0.03, 0.55, 0.005),
      slider("sacBins", "bins", 34, 18, 54, 2),
      slider("sacSteps", "half-steps", 60, 12, 120, 2),
      select("sacSource", "source", Object.keys(MIXTURES), "wide_two"),
      select("sacTarget", "target", Object.keys(MIXTURES), "three"),
    ].join("");
    bind(drawAdvancedConvergence);
  } else if (kind === "sinkhornadvancedgaussian") {
    controls.innerHTML = [
      slider("sagEps", "epsilon", 0.35, 0.02, 2.2, 0.01),
      slider("sagAniso", "anisotropy", 2.2, 1, 5, 0.05),
      slider("sagAngle", "angle", 42, 0, 90, 1),
    ].join("");
    bind(drawAdvancedGaussian);
  } else if (kind === "sinkhornadvancedsamples") {
    controls.innerHTML = [
      slider("sasDim", "dimension", 6, 2, 12, 1),
      slider("sasEps", "epsilon", 0.18, 0.04, 0.55, 0.005),
      slider("sasNmax", "max n", 8192, 512, 32768, 512),
    ].join("");
    bind(drawAdvancedSamples);
  } else if (kind === "generalizedunbalanced") {
    controls.innerHTML = [
      slider("guTau", "tau", 0.18, 0.015, 1.2, 0.005),
      slider("guEps", "epsilon", 0.13, 0.025, 0.55, 0.005),
      slider("guBins", "bins", 38, 18, 66, 2),
      slider("guShift", "source shift", -0.35, -1.2, 1.2, 0.05),
      select("guSource", "source", Object.keys(MIXTURES), "wide_two"),
      select("guTarget", "target", Object.keys(MIXTURES), "three"),
    ].join("");
    bind(drawGeneralizedUnbalanced);
  } else if (kind === "generalizedsliced") {
    controls.innerHTML = [
      slider("gsPoints", "points", 46, 14, 78, 2),
      slider("gsAngle", "angle", 34, 0, 180, 1),
      select("gsMode", "direction", ["manual", "min_lifted", "max_projected"], "manual"),
      select("gsSource", "source", SHAPES.concat(["heart"]), "two_blobs"),
      select("gsTarget", "target", SHAPES.concat(["heart"]), "heart"),
      slider("gsSeed", "seed", 2320, 2300, 2380, 1),
    ].join("");
    bind(drawGeneralizedSliced);
  } else if (kind === "generalizedlinearot") {
    controls.innerHTML = [
      slider("glotT", "weight", 0.5, 0, 1, 0.01),
      slider("glotLevels", "quantiles", 180, 60, 360, 10),
      select("glotRef", "reference", Object.keys(MIXTURES), "one"),
      select("glotAlpha", "alpha", Object.keys(MIXTURES), "two"),
      select("glotBeta", "beta", Object.keys(MIXTURES), "three"),
    ].join("");
    bind(drawGeneralizedLinearOT);
  } else if (kind === "generalizedspectral") {
    controls.innerHTML = [
      select("gwGauge", "gauge", ["trace", "lambda_max", "weighted"], "lambda_max"),
      select("gwPlan", "plan", ["optimized", "manual_slice"], "optimized"),
      slider("gwWeight", "second eig", 0.35, 0, 1, 0.05),
      slider("gwAngle", "angle", 42, 0, 180, 1),
      slider("gwT", "t", 0.5, 0, 1, 0.01),
      slider("gwPoints", "points", 42, 16, 72, 2),
      slider("gwSeed", "seed", 2420, 2400, 2480, 1),
    ].join("");
    bind(drawGeneralizedSpectral);
  } else if (kind === "otproblemsbarycenter") {
    controls.innerHTML = [
      slider("opbU", "u weight", 0.42, 0, 1, 0.01),
      slider("opbV", "v weight", 0.58, 0, 1, 0.01),
      slider("opbLevels", "quantiles", 180, 60, 360, 10),
    ].join("");
    bind(drawOtProblemsBarycenter);
  } else if (kind === "otproblemsgaussianbarycenter") {
    controls.innerHTML = [
      slider("opgU", "u weight", 0.55, 0, 1, 0.01),
      slider("opgV", "v weight", 0.45, 0, 1, 0.01),
      slider("opgAniso", "anisotropy", 2.6, 1, 5, 0.05),
      slider("opgAngle", "angle", 38, 0, 88, 1),
    ].join("");
    bind(drawOtProblemsGaussianBarycenter);
  } else if (kind === "otproblemsmetric") {
    controls.innerHTML = [
      slider("opmAniso", "anisotropy", 2.5, 1, 6, 0.05),
      slider("opmAngle", "angle", 35, 0, 180, 1),
      slider("opmPoints", "points", 36, 14, 64, 2),
      slider("opmSeed", "seed", 2508, 2500, 2580, 1),
    ].join("");
    bind(drawOtProblemsMetric);
  } else if (kind === "otproblemsweak") {
    controls.innerHTML = [
      slider("opwSources", "sources", 18, 8, 34, 1),
      slider("opwSplit", "split", 4, 1, 8, 1),
      slider("opwSpread", "spread", 0.58, 0.16, 1.3, 0.02),
      slider("opwSeed", "seed", 2604, 2600, 2680, 1),
    ].join("");
    bind(drawOtProblemsWeak);
  } else if (kind === "dynamicbb") {
    controls.innerHTML = [
      slider("dbbT", "time", 0.5, 0, 1, 0.01),
      slider("dbbParticles", "particles", 42, 14, 72, 2),
      slider("dbbVelocity", "velocity scale", 0.9, 0.25, 1.8, 0.05),
      select("dbbTarget", "target", ["two_blobs", "annulus", "three_blobs", "disk"], "two_blobs"),
      slider("dbbSeed", "seed", 2710, 2700, 2780, 1),
    ].join("");
    bind(drawDynamicBB);
  } else if (kind === "dynamicunbalanced") {
    controls.innerHTML = [
      slider("dubT", "time", 0.5, 0, 1, 0.01),
      slider("dubMismatch", "mass mismatch", 0.55, 0.05, 0.88, 0.01),
      slider("dubReaction", "reaction share", 0.68, 0, 1, 0.01),
    ].join("");
    bind(drawDynamicUnbalanced);
  } else if (kind === "gradflowjko") {
    controls.innerHTML = [
      slider("gfjTau", "step size", 0.16, 0.03, 0.35, 0.01),
      slider("gfjSteps", "steps", 7, 3, 12, 1),
      slider("gfjWidth", "initial width", 0.22, 0.12, 0.52, 0.01),
    ].join("");
    bind(drawGradflowJKO);
  } else if (kind === "gradflowdiffusion") {
    controls.innerHTML = [
      slider("gfdTime", "time", 0.72, 0.05, 1.8, 0.01),
      slider("gfdPower", "power m", 2.5, 1.2, 7, 0.1),
      slider("gfdWidth", "initial width", 0.62, 0.3, 1.1, 0.01),
    ].join("");
    bind(drawGradflowDiffusion);
  } else if (kind === "gradflowconstraint") {
    controls.innerHTML = [
      slider("gfcCap", "density cap", 0.62, 0.28, 1.6, 0.01),
      slider("gfcAttraction", "attraction", 1.25, 0.35, 2.4, 0.05),
      slider("gfcTime", "final time", 1.35, 0.25, 2.8, 0.01),
    ].join("");
    bind(drawGradflowConstraint);
  } else if (kind === "gradflowmultispecies") {
    controls.innerHTML = [
      slider("gmsSpecies", "species", 3, 2, 5, 1),
      slider("gmsDiffusion", "diffusion", 0.11, 0.04, 0.22, 0.005),
      slider("gmsTime", "final time", 1.4, 0.25, 3.2, 0.01),
    ].join("");
    bind(drawGradflowMultispecies);
  } else if (kind === "gradflowmmd") {
    controls.innerHTML = [
      slider("gfmParticles", "particles", 64, 10, 180, 2),
      slider("gfmSeparation", "mode gap", 2.1, 1.0, 3.2, 0.05),
      slider("gfmBandwidth", "kernel width", 0.62, 0.28, 1.25, 0.01),
      slider("gfmSeed", "seed", 3104, 3100, 3180, 1),
    ].join("");
    bind(drawGradflowMMD);
  } else if (kind === "gradflowinteraction") {
    controls.innerHTML = [
      select("gfiMode", "kernel", ["repulsive", "attractive", "balanced"], "balanced"),
      slider("gfiStrength", "strength", 0.9, 0.25, 1.8, 0.05),
      slider("gfiParticles", "particles", 28, 12, 52, 2),
      slider("gfiSeed", "seed", 3206, 3200, 3280, 1),
    ].join("");
    bind(drawGradflowInteraction);
  } else if (kind === "gradflowobjective") {
    controls.innerHTML = [
      select("gfoGeometry", "geometry", ["ot_rays", "mmd", "sinkhorn", "drifting"], "sinkhorn"),
      slider("gfoSmooth", "smoothing", 0.55, 0.18, 1.1, 0.01),
      slider("gfoParticles", "particles", 28, 10, 48, 2),
      slider("gfoSeed", "seed", 3302, 3300, 3380, 1),
    ].join("");
    bind(drawGradflowObjective);
  } else if (kind === "gradflowfokker") {
    controls.innerHTML = [
      slider("gffTime", "time", 0.64, 0, 1, 0.01),
      slider("gffSigma", "noise", 0.34, 0, 0.9, 0.01),
      slider("gffShift", "target shift", 0.62, 0.0, 1.4, 0.01),
      slider("gffSeed", "seed", 3408, 3400, 3480, 1),
    ].join("");
    bind(drawGradflowFokker);
  } else if (kind === "gradflowmlp") {
    controls.innerHTML = [
      slider("gflNeurons", "neurons", 90, 28, 160, 2),
      slider("gflAngle", "ray angle", 34, 12, 70, 1),
      slider("gflTime", "time", 0.72, 0, 1, 0.01),
      slider("gflSeed", "seed", 3506, 3500, 3580, 1),
    ].join("");
    bind(drawGradflowMLP);
  } else if (kind === "generativeflow") {
    controls.innerHTML = [
      slider("gmfParticles", "particles", 24, 9, 45, 3),
      slider("gmfTime", "time", 0.5, 0, 1, 0.01),
      slider("gmfCurvature", "curvature", 0.32, 0, 0.85, 0.01),
      slider("gmfSeed", "seed", 3606, 3600, 3680, 1),
    ].join("");
    bind(drawGenerativeFlow);
  } else if (kind === "generativediffusion1d") {
    controls.innerHTML = [
      slider("gmd1Time", "time", 0.62, 0.02, 0.98, 0.01),
      slider("gmd1Separation", "mode gap", 1.35, 0.65, 2.2, 0.01),
      slider("gmd1Noise", "noise", 1.05, 0.55, 1.65, 0.01),
      slider("gmd1Samples", "paths", 46, 16, 88, 2),
    ].join("");
    bind(drawGenerativeDiffusion1D);
  } else if (kind === "generativediffusion2d") {
    controls.innerHTML = [
      slider("gmd2Time", "time", 0.58, 0, 1, 0.01),
      slider("gmd2Gap", "atom gap", 1.15, 0.65, 1.75, 0.01),
      slider("gmd2Sigma", "noise", 0.54, 0.24, 0.95, 0.01),
    ].join("");
    bind(drawGenerativeDiffusion2D);
  } else if (kind === "generativetrajectories") {
    controls.innerHTML = [
      select("gmtSchedule", "schedule", ["vp", "linear", "overshoot"], "vp"),
      slider("gmtParticles", "particles", 60, 18, 110, 2),
      slider("gmtGap", "atom gap", 1.18, 0.7, 1.8, 0.01),
      slider("gmtSeed", "seed", 3704, 3700, 3780, 1),
    ].join("");
    bind(drawGenerativeTrajectories);
  } else if (kind === "generativeschedule") {
    controls.innerHTML = [
      slider("gmsParticles", "particles", 54, 18, 96, 2),
      slider("gmsGap", "atom gap", 1.18, 0.7, 1.8, 0.01),
      slider("gmsSeed", "seed", 3742, 3700, 3780, 1),
    ].join("");
    bind(drawGenerativeSchedule);
  } else if (kind === "generativedrifting") {
    controls.innerHTML = [
      slider("gmdriftCorrection", "self correction", 0.78, 0, 1.2, 0.01),
      slider("gmdriftKernel", "kernel width", 0.64, 0.28, 1.15, 0.01),
      slider("gmdriftSteps", "steps", 96, 24, 160, 2),
      slider("gmdriftParticles", "particles", 54, 18, 96, 2),
      slider("gmdriftSeed", "seed", 3808, 3800, 3880, 1),
    ].join("");
    bind(drawGenerativeDrifting);
  } else if (kind === "generativegaussianclosure") {
    controls.innerHTML = [
      slider("gmgcTime", "time", 0.5, 0, 1, 0.01),
      slider("gmgcAniso", "anisotropy", 1.9, 1, 3.4, 0.05),
      slider("gmgcAngle", "angle", 34, 0, 82, 1),
      slider("gmgcEpsilon", "regularization", 0.08, 0, 0.22, 0.01),
      slider("gmgcBend", "drift bend", 0.34, 0, 0.8, 0.01),
    ].join("");
    bind(drawGenerativeGaussianClosure);
  } else if (kind === "beyondvector") {
    controls.innerHTML = [
      slider("bvCoupling", "coupling", 0.72, 0, 1, 0.01),
      slider("bvSeparation", "separation", 0.55, 0, 1, 0.01),
    ].join("");
    bind(drawBeyondVector);
  } else if (kind === "beyondmatrix") {
    controls.innerHTML = [
      slider("bmCoupling", "coupling", 0.68, 0, 1, 0.01),
      slider("bmRotation", "rotation", 58, 0, 90, 1),
    ].join("");
    bind(drawBeyondMatrix);
  } else if (kind === "beyondgromov") {
    controls.innerHTML = [
      slider("bgDeform", "deformation", 0.42, 0, 1, 0.01),
      slider("bgTwist", "twist", 18, -40, 60, 1),
      slider("bgPoints", "points", 22, 12, 34, 2),
    ].join("");
    bind(drawBeyondGromov);
  } else if (kind === "beyondgromovdistortion") {
    controls.innerHTML = [
      slider("bgdDeform", "deformation", 0.52, 0, 1, 0.01),
      slider("bgdShift", "shift", 2, 0, 10, 1),
      slider("bgdPoints", "points", 18, 10, 26, 2),
    ].join("");
    bind(drawBeyondGromovDistortion);
  } else if (kind === "beyondfusedgromov") {
    controls.innerHTML = [
      slider("bfgLambda", "geometry weight", 0.5, 0, 1, 0.01),
      slider("bfgConflict", "feature conflict", 0.45, 0, 1, 0.01),
      slider("bfgPoints", "points", 20, 12, 32, 2),
    ].join("");
    bind(drawBeyondFusedGromov);
  } else {
    controls.innerHTML = [
      slider("hungarianN", "size", 8, 5, 14, 1),
      slider("hungarianSpread", "jitter", 0.8, 0, 2.5, 0.1),
      slider("hungarianSeed", "seed", 2055, 2000, 2100, 1),
    ].join("");
    bind(drawHungarian);
  }

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => scheduleRender());
    observer.observe(document.body);
  }
  window.addEventListener("resize", scheduleRender);
  window.setTimeout(scheduleRender, 50);
  window.setTimeout(scheduleRender, 300);
}

init();
