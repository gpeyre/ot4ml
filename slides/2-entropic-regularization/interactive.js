function ot4mlDrawSinkhornEpsilon() {
  const canvas = document.getElementById('sinkhorn-epsilon-canvas');
  const slider = document.getElementById('sinkhorn-epsilon-slider');
  const label = document.getElementById('sinkhorn-epsilon-label');
  if (!canvas || !slider || !label) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.clientWidth || 720;
  const height = canvas.clientHeight || 310;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const n = 42;
  const x = Array.from({ length: n }, (_, i) => -2.2 + 4.4 * i / (n - 1));
  function gaussian(z, m, s) {
    const r = (z - m) / s;
    return Math.exp(-0.5 * r * r) / s;
  }
  function normalize(v) {
    const s = v.reduce((a, b) => a + b, 0);
    return v.map(z => z / s);
  }
  const a = normalize(x.map(z => 0.58 * gaussian(z, -0.85, 0.30) + 0.42 * gaussian(z, 0.18, 0.22)));
  const b = normalize(x.map(z => 0.34 * gaussian(z, -0.28, 0.24) + 0.43 * gaussian(z, 0.74, 0.27) + 0.23 * gaussian(z, 1.45, 0.20)));
  const C = x.map(xi => x.map(yj => (xi - yj) * (xi - yj)));

  function sinkhorn(eps) {
    const K = C.map(row => row.map(c => Math.exp(-c / eps)));
    let u = Array(n).fill(1);
    let v = Array(n).fill(1);
    for (let it = 0; it < 250; it++) {
      const Kv = K.map(row => row.reduce((s, kij, j) => s + kij * v[j], 0));
      u = a.map((ai, i) => ai / Math.max(Kv[i], 1e-300));
      const Ktu = Array.from({ length: n }, (_, j) => K.reduce((s, row, i) => s + row[j] * u[i], 0));
      v = b.map((bj, j) => bj / Math.max(Ktu[j], 1e-300));
    }
    return K.map((row, i) => row.map((kij, j) => u[i] * kij * v[j]));
  }

  function draw() {
    const eps = Math.exp(Number(slider.value));
    label.textContent = `eps = ${eps.toFixed(3)}`;
    const P = sinkhorn(eps);
    const maxP = Math.max(...P.flat());
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const pad = 28;
    const matrixSize = Math.min(width * 0.60, height - 2 * pad);
    const x0 = pad + 22;
    const y0 = pad;
    const cell = matrixSize / n;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const t = Math.pow(P[i][j] / maxP, 0.55);
        const r = Math.round(255 * (1 - t) + 124 * t);
        const g = Math.round(255 * (1 - t) + 91 * t);
        const bb = Math.round(255 * (1 - t) + 189 * t);
        ctx.fillStyle = `rgb(${r},${g},${bb})`;
        ctx.fillRect(x0 + j * cell, y0 + i * cell, Math.ceil(cell) + 0.2, Math.ceil(cell) + 0.2);
      }
    }
    ctx.strokeStyle = '#263241';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x0, y0, matrixSize, matrixSize);

    const curveX0 = x0 + matrixSize + 52;
    const curveW = width - curveX0 - 25;
    const curveH = matrixSize * 0.44;
    const drawCurve = (values, yBase, color, title) => {
      const maxV = Math.max(...values);
      ctx.strokeStyle = '#e0e5eb';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(curveX0, yBase); ctx.lineTo(curveX0 + curveW, yBase); ctx.stroke();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      values.forEach((v, i) => {
        const xx = curveX0 + curveW * i / (n - 1);
        const yy = yBase - curveH * v / maxV;
        if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      });
      ctx.stroke();
      ctx.fillStyle = '#5d6673';
      ctx.font = '13px sans-serif';
      ctx.fillText(title, curveX0, yBase - curveH - 8);
    };
    drawCurve(a, y0 + curveH + 22, '#c7372f', 'source marginal');
    drawCurve(b, y0 + matrixSize - 5, '#226db4', 'target marginal');

    ctx.fillStyle = '#5d6673';
    ctx.font = '12px sans-serif';
    ctx.fillText('entropic coupling P_epsilon', x0, y0 + matrixSize + 20);
  }

  slider.addEventListener('input', draw);
  window.addEventListener('resize', draw);
  draw();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ot4mlDrawSinkhornEpsilon);
} else {
  ot4mlDrawSinkhornEpsilon();
}
if (window.Reveal) {
  window.Reveal.on('slidechanged', ot4mlDrawSinkhornEpsilon);
}

function ot4mlDrawEntropySpread() {
  const canvas = document.getElementById('entropy-spread-canvas');
  const slider = document.getElementById('entropy-spread-slider');
  const label = document.getElementById('entropy-spread-label');
  if (!canvas || !slider || !label) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.clientWidth || 720;
  const height = canvas.clientHeight || 260;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const n = 34;
  const x = Array.from({ length: n }, (_, i) => -2 + 4 * i / (n - 1));
  function normalize(v) {
    const s = v.reduce((a, b) => a + b, 0);
    return v.map(z => z / s);
  }
  function gaussian(z, m, s) {
    const r = (z - m) / s;
    return Math.exp(-0.5 * r * r) / s;
  }
  const a = normalize(x.map(z => gaussian(z, -0.75, 0.28) + 0.7 * gaussian(z, 0.3, 0.18)));
  const b = normalize(x.map(z => 0.8 * gaussian(z, -0.2, 0.22) + gaussian(z, 1.1, 0.35)));
  const C = x.map(xi => x.map(yj => (xi - yj) * (xi - yj)));

  function sinkhorn(eps) {
    const K = C.map(row => row.map(c => Math.exp(-c / eps)));
    let u = Array(n).fill(1), v = Array(n).fill(1);
    for (let it = 0; it < 180; it++) {
      const Kv = K.map(row => row.reduce((s, kij, j) => s + kij * v[j], 0));
      u = a.map((ai, i) => ai / Math.max(Kv[i], 1e-300));
      const Ktu = Array.from({ length: n }, (_, j) => K.reduce((s, row, i) => s + row[j] * u[i], 0));
      v = b.map((bj, j) => bj / Math.max(Ktu[j], 1e-300));
    }
    return K.map((row, i) => row.map((kij, j) => u[i] * kij * v[j]));
  }

  function draw() {
    const eps = Math.exp(Number(slider.value));
    label.textContent = `eps = ${eps.toFixed(3)}`;
    const P = sinkhorn(eps);
    const maxP = Math.max(...P.flat());
    const pad = 24;
    const size = Math.min(width - 2 * pad, height - 2 * pad);
    const x0 = (width - size) / 2;
    const y0 = (height - size) / 2;
    const cell = size / n;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const t = Math.pow(P[i][j] / maxP, 0.50);
        const r = Math.round(255 * (1 - t) + 124 * t);
        const g = Math.round(255 * (1 - t) + 91 * t);
        const bcol = Math.round(255 * (1 - t) + 189 * t);
        ctx.fillStyle = `rgb(${r},${g},${bcol})`;
        ctx.fillRect(x0 + j * cell, y0 + i * cell, cell + 0.25, cell + 0.25);
      }
    }
    ctx.strokeStyle = '#273241';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x0, y0, size, size);
    ctx.fillStyle = '#6c7480';
    ctx.font = '12px sans-serif';
    ctx.fillText('low entropy: thin plan', x0, y0 - 7);
    ctx.fillText('high entropy: diffuse plan', x0 + size - 150, y0 + size + 18);
  }

  slider.addEventListener('input', draw);
  window.addEventListener('resize', draw);
  draw();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ot4mlDrawEntropySpread);
} else {
  ot4mlDrawEntropySpread();
}
if (window.Reveal) {
  window.Reveal.on('slidechanged', ot4mlDrawEntropySpread);
}
