function ot4mlDrawLaguerreWeights() {
  const canvas = document.getElementById('laguerre-weight-canvas');
  const slider = document.getElementById('laguerre-weight-slider');
  const label = document.getElementById('laguerre-weight-label');
  if (!canvas || !slider || !label) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.clientWidth || 720;
  const height = canvas.clientHeight || 320;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const sites = [
    [-0.70, -0.50], [0.05, -0.72], [0.78, -0.35],
    [-0.82, 0.28], [-0.10, 0.20], [0.58, 0.52]
  ];
  const colors = ['#c7372f', '#d86d3d', '#7c5bbd', '#f1a23b', '#226db4', '#4d93c8'];
  const baseWeights = [0.00, -0.03, 0.02, 0.01, 0.00, -0.02];
  const active = 4;

  function draw() {
    const delta = Number(slider.value);
    label.textContent = `weight shift = ${delta.toFixed(2)}`;
    const weights = baseWeights.slice();
    weights[active] += delta;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const pad = 22;
    const plot = Math.min(width - 2 * pad, height - 2 * pad);
    const x0 = (width - plot) / 2;
    const y0 = (height - plot) / 2;
    const N = 140;
    const cell = plot / N;
    const X = i => -1.15 + 2.3 * (i + 0.5) / N;
    const Y = j => -1.15 + 2.3 * (j + 0.5) / N;

    const counts = Array(sites.length).fill(0);
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const x = X(i), y = Y(j);
        let best = 0, bestVal = Infinity;
        for (let k = 0; k < sites.length; k++) {
          const dx = x - sites[k][0], dy = y - sites[k][1];
          const val = dx * dx + dy * dy - weights[k];
          if (val < bestVal) { bestVal = val; best = k; }
        }
        counts[best] += 1;
        const c = colors[best];
        ctx.globalAlpha = best === active ? 0.36 : 0.23;
        ctx.fillStyle = c;
        ctx.fillRect(x0 + i * cell, y0 + (N - 1 - j) * cell, cell + 0.4, cell + 0.4);
      }
    }
    ctx.globalAlpha = 1;

    // Draw approximate cell boundaries.
    ctx.fillStyle = '#273241';
    for (let j = 1; j < N - 1; j++) {
      for (let i = 1; i < N - 1; i++) {
        const x = X(i), y = Y(j);
        function owner(xx, yy) {
          let best = 0, bestVal = Infinity;
          for (let k = 0; k < sites.length; k++) {
            const dx = xx - sites[k][0], dy = yy - sites[k][1];
            const val = dx * dx + dy * dy - weights[k];
            if (val < bestVal) { bestVal = val; best = k; }
          }
          return best;
        }
        const o = owner(x, y);
        if (o !== owner(X(i + 1), y) || o !== owner(x, Y(j + 1))) {
          ctx.globalAlpha = 0.35;
          ctx.fillRect(x0 + i * cell, y0 + (N - 1 - j) * cell, Math.max(1, cell * 0.8), Math.max(1, cell * 0.8));
        }
      }
    }
    ctx.globalAlpha = 1;

    // Sites.
    for (let k = 0; k < sites.length; k++) {
      const px = x0 + (sites[k][0] + 1.15) / 2.3 * plot;
      const py = y0 + (1.15 - sites[k][1]) / 2.3 * plot;
      ctx.beginPath();
      ctx.arc(px, py, k === active ? 7.5 : 5.8, 0, 2 * Math.PI);
      ctx.fillStyle = colors[k];
      ctx.fill();
      ctx.lineWidth = k === active ? 2.3 : 1.2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }

    const mass = counts[active] / (N * N);
    ctx.fillStyle = '#5d6673';
    ctx.font = '13px sans-serif';
    ctx.fillText(`active cell area ~ ${mass.toFixed(2)}`, x0 + 12, y0 + plot - 14);
    ctx.strokeStyle = '#263241';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x0, y0, plot, plot);
  }

  slider.addEventListener('input', draw);
  window.addEventListener('resize', draw);
  draw();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ot4mlDrawLaguerreWeights);
} else {
  ot4mlDrawLaguerreWeights();
}
if (window.Reveal) {
  window.Reveal.on('slidechanged', ot4mlDrawLaguerreWeights);
}

function ot4mlDrawCTransformExponent() {
  const canvas = document.getElementById('c-transform-exponent-canvas');
  const slider = document.getElementById('c-transform-exponent-slider');
  const label = document.getElementById('c-transform-exponent-label');
  if (!canvas || !slider || !label) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.clientWidth || 720;
  const height = canvas.clientHeight || 260;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const xs = Array.from({ length: 220 }, (_, i) => -1.8 + 3.6 * i / 219);
  function f(x) {
    return 0.25 * Math.sin(3.2 * x) + 0.18 * Math.cos(6.1 * x) - 0.15 * x * x;
  }

  function transform(p) {
    return xs.map(y => {
      let best = Infinity;
      for (const x of xs) {
        const val = Math.pow(Math.abs(x - y), p) - f(x);
        if (val < best) best = val;
      }
      return best;
    });
  }

  function drawCurve(values, color, alpha, lw, X, Y) {
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = lw;
    ctx.beginPath();
    values.forEach((v, i) => {
      const xx = X(xs[i]), yy = Y(v);
      if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
    });
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function draw() {
    const p = Number(slider.value);
    label.textContent = `p = ${p.toFixed(2)}`;
    const fv = xs.map(f);
    const gv = transform(p);
    const all = fv.concat(gv);
    const ymin = Math.min(...all) - 0.15;
    const ymax = Math.max(...all) + 0.15;
    const pad = { left: 34, right: 18, top: 18, bottom: 28 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    const X = x => pad.left + (x + 1.8) / 3.6 * plotW;
    const Y = y => pad.top + plotH - (y - ymin) / (ymax - ymin) * plotH;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e3e8ef';
    for (let k = 0; k <= 4; k++) {
      const y = pad.top + k * plotH / 4;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(width - pad.right, y); ctx.stroke();
    }
    drawCurve(fv, '#c7372f', 0.85, 2.4, X, Y);
    drawCurve(gv, '#226db4', 0.95, 2.8, X, Y);
    ctx.fillStyle = '#6c7480';
    ctx.font = '12px sans-serif';
    ctx.fillText('source potential f', pad.left, pad.top + 12);
    ctx.fillText('c-transform f^c', pad.left + 145, pad.top + 12);
  }

  slider.addEventListener('input', draw);
  window.addEventListener('resize', draw);
  draw();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ot4mlDrawCTransformExponent);
} else {
  ot4mlDrawCTransformExponent();
}
if (window.Reveal) {
  window.Reveal.on('slidechanged', ot4mlDrawCTransformExponent);
}
