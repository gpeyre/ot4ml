function ot4mlDrawTransportFlow() {
  const canvas = document.getElementById('transport-flow-canvas');
  const slider = document.getElementById('transport-flow-slider');
  const label = document.getElementById('transport-flow-label');
  if (!canvas || !slider || !label) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.clientWidth || 720;
  const height = canvas.clientHeight || 310;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const N = 90;
  function randn(seed) {
    let x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    let u1 = x - Math.floor(x);
    x = Math.sin(seed * 269.5 + 183.3) * 43758.5453;
    let u2 = x - Math.floor(x);
    u1 = Math.max(u1, 1e-6);
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
  const pairs = Array.from({ length: N }, (_, i) => {
    const x0 = [-1.35 + 0.22 * randn(i + 1), 0.05 + 0.42 * randn(i + 200)];
    const branch = i % 3;
    const center = branch === 0 ? [0.85, 0.78] : branch === 1 ? [1.35, -0.28] : [0.48, -0.75];
    const y = [center[0] + 0.13 * randn(i + 500), center[1] + 0.13 * randn(i + 800)];
    return { x0, y, branch };
  });

  function X(z) { return width * (0.08 + 0.84 * (z + 1.85) / 3.65); }
  function Y(z) { return height * (0.86 - 0.72 * (z + 1.25) / 2.55); }
  function color(t) {
    const r = Math.round((1 - t) * 199 + t * 34);
    const g = Math.round((1 - t) * 55 + t * 109);
    const b = Math.round((1 - t) * 47 + t * 180);
    return `rgb(${r},${g},${b})`;
  }

  function drawDensityBlob(cx, cy, sx, sy, col, alpha) {
    const grad = ctx.createRadialGradient(X(cx), Y(cy), 2, X(cx), Y(cy), Math.max(sx * width * 0.25, sy * height * 0.25));
    grad.addColorStop(0, col.replace('rgb', 'rgba').replace(')', `,${alpha})`));
    grad.addColorStop(1, col.replace('rgb', 'rgba').replace(')', ',0)'));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(X(cx), Y(cy), sx * width * 0.18, sy * height * 0.26, 0, 0, 2 * Math.PI);
    ctx.fill();
  }

  function draw() {
    const t = Number(slider.value);
    label.textContent = `t = ${t.toFixed(2)}`;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    drawDensityBlob(-1.35, 0.05, 0.55, 0.80, 'rgb(199,55,47)', 0.20);
    drawDensityBlob(0.85, 0.78, 0.36, 0.36, 'rgb(34,109,180)', 0.16);
    drawDensityBlob(1.35, -0.28, 0.36, 0.36, 'rgb(34,109,180)', 0.16);
    drawDensityBlob(0.48, -0.75, 0.36, 0.36, 'rgb(34,109,180)', 0.16);

    ctx.lineWidth = 1.0;
    for (const p of pairs) {
      ctx.strokeStyle = 'rgba(124,91,189,0.18)';
      ctx.beginPath();
      for (let k = 0; k <= 20; k++) {
        const s = Math.min(t, k / 20);
        const bend = 0.20 * Math.sin(Math.PI * s) * (p.branch - 1);
        const xx = (1 - s) * p.x0[0] + s * p.y[0];
        const yy = (1 - s) * p.x0[1] + s * p.y[1] + bend;
        if (k === 0) ctx.moveTo(X(xx), Y(yy)); else ctx.lineTo(X(xx), Y(yy));
      }
      ctx.stroke();
    }

    ctx.fillStyle = color(t);
    for (const p of pairs) {
      const bend = 0.20 * Math.sin(Math.PI * t) * (p.branch - 1);
      const xx = (1 - t) * p.x0[0] + t * p.y[0];
      const yy = (1 - t) * p.x0[1] + t * p.y[1] + bend;
      ctx.beginPath();
      ctx.arc(X(xx), Y(yy), 3.1, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.fillStyle = '#5d6673';
    ctx.font = '13px sans-serif';
    ctx.fillText('source law', X(-1.78), Y(1.08));
    ctx.fillText('target law', X(0.88), Y(1.08));
    ctx.fillText('transport interpolation', X(-0.45), height - 16);
  }

  slider.addEventListener('input', draw);
  window.addEventListener('resize', draw);
  draw();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ot4mlDrawTransportFlow);
} else {
  ot4mlDrawTransportFlow();
}
if (window.Reveal) {
  window.Reveal.on('slidechanged', ot4mlDrawTransportFlow);
}

function ot4mlDrawLangevinNoise() {
  const canvas = document.getElementById('langevin-noise-canvas');
  const slider = document.getElementById('langevin-noise-slider');
  const label = document.getElementById('langevin-noise-label');
  if (!canvas || !slider || !label) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.clientWidth || 720;
  const height = canvas.clientHeight || 260;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  function rnd(seed) {
    const x = Math.sin(seed * 97.13 + 41.7) * 43758.5453;
    return x - Math.floor(x);
  }
  function randn(seed) {
    const u1 = Math.max(rnd(seed), 1e-6), u2 = rnd(seed + 19.31);
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
  function gradV(x, y) {
    const c1 = [-0.65, 0.30], c2 = [0.75, -0.25], s = 0.36;
    const w1 = Math.exp(-((x - c1[0]) ** 2 + (y - c1[1]) ** 2) / (2 * s * s));
    const w2 = Math.exp(-((x - c2[0]) ** 2 + (y - c2[1]) ** 2) / (2 * s * s));
    const z = Math.max(w1 + w2, 1e-8);
    const gx = ((x - c1[0]) * w1 + (x - c2[0]) * w2) / (s * s * z) + 0.08 * x;
    const gy = ((y - c1[1]) * w1 + (y - c2[1]) * w2) / (s * s * z) + 0.08 * y;
    return [gx, gy];
  }
  function X(x) { return width * (0.5 + x / 3.1); }
  function Y(y) { return height * (0.52 - y / 2.55); }

  function draw() {
    const noise = Number(slider.value);
    label.textContent = `noise = ${noise.toFixed(2)}`;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw two target wells.
    for (const [cx, cy] of [[-0.65, 0.30], [0.75, -0.25]]) {
      const grad = ctx.createRadialGradient(X(cx), Y(cy), 3, X(cx), Y(cy), 95);
      grad.addColorStop(0, 'rgba(34,109,180,0.24)');
      grad.addColorStop(1, 'rgba(34,109,180,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(X(cx), Y(cy), 100, 0, 2 * Math.PI);
      ctx.fill();
    }

    const n = 34, steps = 70, h = 0.035;
    for (let i = 0; i < n; i++) {
      let x = -1.15 + 0.18 * randn(i + 1);
      let y = -0.78 + 0.18 * randn(i + 100);
      ctx.beginPath();
      ctx.moveTo(X(x), Y(y));
      for (let k = 0; k < steps; k++) {
        const [gx, gy] = gradV(x, y);
        x += -h * gx + noise * Math.sqrt(2 * h) * 0.22 * randn(1000 + i * 113 + k);
        y += -h * gy + noise * Math.sqrt(2 * h) * 0.22 * randn(2000 + i * 131 + k);
        ctx.lineTo(X(x), Y(y));
      }
      ctx.strokeStyle = 'rgba(124,91,189,0.30)';
      ctx.lineWidth = 1.05;
      ctx.stroke();
      ctx.fillStyle = '#226db4';
      ctx.beginPath(); ctx.arc(X(x), Y(y), 3.0, 0, 2 * Math.PI); ctx.fill();
    }

    ctx.fillStyle = '#c7372f';
    ctx.beginPath(); ctx.arc(X(-1.15), Y(-0.78), 5, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = '#6c7480';
    ctx.font = '12px sans-serif';
    ctx.fillText('initial cloud', X(-1.48), Y(-1.04));
    ctx.fillText('target wells', X(-0.16), Y(0.88));
  }

  slider.addEventListener('input', draw);
  window.addEventListener('resize', draw);
  draw();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ot4mlDrawLangevinNoise);
} else {
  ot4mlDrawLangevinNoise();
}
if (window.Reveal) {
  window.Reveal.on('slidechanged', ot4mlDrawLangevinNoise);
}
