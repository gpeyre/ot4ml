function ot4mlDrawQuantileInterpolation() {
  const canvas = document.getElementById('quantile-interpolation-canvas');
  const slider = document.getElementById('quantile-interpolation-slider');
  const label = document.getElementById('quantile-interpolation-label');
  if (!canvas || !slider || !label) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.clientWidth || 720;
  const height = canvas.clientHeight || 260;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  function gaussian(x, mean, sigma) {
    const z = (x - mean) / sigma;
    return Math.exp(-0.5 * z * z) / sigma;
  }

  function density0(x) {
    return 0.55 * gaussian(x, -1.15, 0.34) + 0.45 * gaussian(x, 0.15, 0.22);
  }

  function density1(x) {
    return 0.40 * gaussian(x, -0.10, 0.20) + 0.35 * gaussian(x, 0.92, 0.26) + 0.25 * gaussian(x, 1.50, 0.18);
  }

  const xs = Array.from({length: 420}, (_, i) => -2.2 + 4.4 * i / 419);
  const dx = xs[1] - xs[0];
  function cdfFromDensity(fn) {
    const values = xs.map(fn);
    const total = values.reduce((a, b) => a + b, 0) * dx;
    let acc = 0;
    return values.map(v => {
      acc += v * dx / total;
      return acc;
    });
  }
  const cdf0 = cdfFromDensity(density0);
  const cdf1 = cdfFromDensity(density1);

  function quantile(cdf, u) {
    let lo = 0, hi = cdf.length - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (cdf[mid] < u) lo = mid + 1;
      else hi = mid;
    }
    return xs[Math.max(0, Math.min(xs.length - 1, lo))];
  }

  function draw() {
    const t = Number(slider.value);
    label.textContent = `t = ${t.toFixed(2)}`;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const pad = {left: 34, right: 20, top: 18, bottom: 30};
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    const xmin = -2.3, xmax = 2.3, ymax = 2.45;
    const X = x => pad.left + (x - xmin) / (xmax - xmin) * plotW;
    const Y = y => pad.top + plotH - y / ymax * plotH;

    ctx.strokeStyle = '#e4e8ee';
    ctx.lineWidth = 1;
    for (let k = 0; k <= 4; k++) {
      const y = Y(k * ymax / 4);
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(width - pad.right, y); ctx.stroke();
    }
    ctx.strokeStyle = '#28313d';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(pad.left, Y(0)); ctx.lineTo(width - pad.right, Y(0)); ctx.stroke();

    const samples = [];
    for (let i = 1; i < 360; i++) {
      const u = i / 360;
      samples.push((1 - t) * quantile(cdf0, u) + t * quantile(cdf1, u));
    }
    const bandwidth = 0.08 + 0.035 * Math.sin(Math.PI * t);
    const interpDensity = xs.map(x => {
      let s = 0;
      for (const z of samples) s += gaussian(x, z, bandwidth);
      return s / samples.length;
    });

    function drawCurve(values, color, alpha, widthLine) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = widthLine;
      ctx.beginPath();
      values.forEach((v, i) => {
        const x = X(xs[i]), y = Y(v);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    drawCurve(xs.map(density0), '#c7372f', 0.24, 2.0);
    drawCurve(xs.map(density1), '#226db4', 0.24, 2.0);
    const r = Math.round((1 - t) * 199 + t * 34);
    const g = Math.round((1 - t) * 55 + t * 109);
    const b = Math.round((1 - t) * 47 + t * 180);
    drawCurve(interpDensity, `rgb(${r},${g},${b})`, 0.96, 3.0);

    ctx.fillStyle = '#6c7480';
    ctx.font = '12px sans-serif';
    ctx.fillText('source', X(-2.05), Y(2.24));
    ctx.fillText('target', X(1.55), Y(2.24));
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillText('Monge interpolation', X(-0.44), Y(2.24));
  }

  slider.addEventListener('input', draw);
  window.addEventListener('resize', draw);
  draw();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ot4mlDrawQuantileInterpolation);
} else {
  ot4mlDrawQuantileInterpolation();
}
if (window.Reveal) {
  window.Reveal.on('slidechanged', ot4mlDrawQuantileInterpolation);
}

function ot4mlDrawGaussianGeodesic() {
  const canvas = document.getElementById('gaussian-geodesic-canvas');
  const slider = document.getElementById('gaussian-geodesic-slider');
  const label = document.getElementById('gaussian-geodesic-label');
  if (!canvas || !slider || !label) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.clientWidth || 720;
  const height = canvas.clientHeight || 260;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  function gaussian(x, mean, sigma) {
    const z = (x - mean) / sigma;
    return Math.exp(-0.5 * z * z) / sigma;
  }

  function draw() {
    const t = Number(slider.value);
    label.textContent = `t = ${t.toFixed(2)}`;
    const m0 = -1.05, s0 = 0.30, m1 = 1.10, s1 = 0.72;
    const mt = (1 - t) * m0 + t * m1;
    const st = (1 - t) * s0 + t * s1;
    const xs = Array.from({ length: 360 }, (_, i) => -2.3 + 4.6 * i / 359);
    const vals = xs.map(x => gaussian(x, mt, st));
    const maxV = Math.max(...vals);
    const pad = { left: 34, right: 22, top: 22, bottom: 34 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    const X = x => pad.left + (x + 2.3) / 4.6 * plotW;
    const Y = y => pad.top + plotH - y / maxV * plotH * 0.88;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e3e8ef';
    ctx.lineWidth = 1;
    for (let k = 0; k <= 4; k++) {
      const y = pad.top + k * plotH / 4;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(width - pad.right, y); ctx.stroke();
    }

    function curve(mean, sigma, color, alpha, lw) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = lw;
      ctx.beginPath();
      xs.forEach((x, i) => {
        const y = Y(gaussian(x, mean, sigma));
        if (i === 0) ctx.moveTo(X(x), y); else ctx.lineTo(X(x), y);
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    curve(m0, s0, '#c7372f', 0.28, 2);
    curve(m1, s1, '#226db4', 0.28, 2);
    const r = Math.round((1 - t) * 199 + t * 34);
    const g = Math.round((1 - t) * 55 + t * 109);
    const b = Math.round((1 - t) * 47 + t * 180);
    curve(mt, st, `rgb(${r},${g},${b})`, 0.95, 3.2);

    ctx.strokeStyle = '#273241';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(pad.left, pad.top + plotH); ctx.lineTo(width - pad.right, pad.top + plotH); ctx.stroke();
    ctx.fillStyle = '#6c7480';
    ctx.font = '12px sans-serif';
    ctx.fillText(`mean ${mt.toFixed(2)}, sigma ${st.toFixed(2)}`, pad.left, height - 10);
  }

  slider.addEventListener('input', draw);
  window.addEventListener('resize', draw);
  draw();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ot4mlDrawGaussianGeodesic);
} else {
  ot4mlDrawGaussianGeodesic();
}
if (window.Reveal) {
  window.Reveal.on('slidechanged', ot4mlDrawGaussianGeodesic);
}
