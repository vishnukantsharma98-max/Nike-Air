/**
 * canvasSequence.js
 * Canvas frame preloading and rendering logic for the Antigravity hero section.
 * Pure utility module — no React, no 'use client'.
 */

const loadedStatus = new Map();

/**
 * Preload a sequence of image frames for the canvas hero animation.
 *
 * @param {number} frameCount  Total number of frames to load (default 100).
 * @param {string} basePath    Path prefix for frame images (default '/frames/frame_').
 * @returns {Promise<HTMLImageElement[]>} Resolves with an array of Image elements.
 */
export function preloadImages(frameCount = 100, basePath = '/frames/frame_') {
  return new Promise((resolve) => {
    const images = new Array(frameCount);
    let settled = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const padded = String(i + 1).padStart(3, '0');
      img.src = `${basePath}${padded}.jpg`;

      img.onload = () => {
        loadedStatus.set(i, true);
        images[i] = img;
        settled++;
        if (settled === frameCount) resolve(images);
      };

      img.onerror = () => {
        loadedStatus.set(i, false);
        images[i] = img;
        settled++;
        if (settled === frameCount) resolve(images);
      };
    }
  });
}

/**
 * Draw a specific frame onto the canvas, falling back gracefully on failure.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement[]}       images
 * @param {number}                   frameIndex  0-based index.
 * @param {HTMLCanvasElement}        canvas
 */
export function renderFrame(ctx, images, frameIndex, canvas) {
  const idx = Math.max(0, Math.min(frameIndex, images.length - 1));

  if (!loadedStatus.get(idx)) {
    const progress = images.length > 1 ? idx / (images.length - 1) : 0;
    renderFallback(ctx, canvas, progress);
    return;
  }

  const img = images[idx];
  const cw = canvas.width;
  const ch = canvas.height;

  // object-fit: cover calculation
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = cw / ch;

  let drawW, drawH, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    drawW = cw;
    drawH = cw / imgRatio;
    offsetX = 0;
    offsetY = (ch - drawH) / 2;
  } else {
    drawH = ch;
    drawW = ch * imgRatio;
    offsetX = (cw - drawW) / 2;
    offsetY = 0;
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

/* ------------------------------------------------------------------ */
/*  Fallback renderer — premium animated gradient + geometric visuals  */
/* ------------------------------------------------------------------ */

/**
 * Render a beautiful animated fallback when image frames are unavailable.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement}        canvas
 * @param {number}                   progress  0-1 scroll progress.
 */
export function renderFallback(ctx, canvas, progress) {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const t = progress;

  ctx.clearRect(0, 0, w, h);

  // ── 1. Dark gradient background ──────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, w * 0.3, h);
  bg.addColorStop(0, '#05050a');
  bg.addColorStop(0.5, '#0a0a1a');
  bg.addColorStop(1, '#050510');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // ── 2. Rotating nebula blobs (cyan / purple) ─────────────────────
  drawNebula(ctx, cx, cy, w, h, t);

  // ── 3. Floating geometric wireframes ─────────────────────────────
  drawWireframeCube(ctx, cx - w * 0.25, cy - h * 0.15, Math.min(w, h) * 0.12, t);
  drawWireframeSphere(ctx, cx + w * 0.28, cy + h * 0.12, Math.min(w, h) * 0.09, t);
  drawWireframeCube(ctx, cx + w * 0.15, cy - h * 0.28, Math.min(w, h) * 0.06, t * 1.4);

  // ── 4. Shoe silhouette that explodes with progress ───────────────
  drawExplodingShoe(ctx, cx, cy, Math.min(w, h) * 0.38, t);
}

/* ---------- Nebula ---------- */

function drawNebula(ctx, cx, cy, w, h, t) {
  const blobs = [
    { color: 'rgba(0,255,255,', baseX: -0.15, baseY: -0.1, radius: 0.35 },
    { color: 'rgba(140,80,255,', baseX: 0.18, baseY: 0.14, radius: 0.30 },
    { color: 'rgba(0,200,255,', baseX: -0.05, baseY: 0.22, radius: 0.22 },
  ];

  const angle = t * Math.PI * 2;

  blobs.forEach((b, i) => {
    const phase = angle + (i * Math.PI * 2) / 3;
    const x = cx + b.baseX * w + Math.cos(phase) * w * 0.08;
    const y = cy + b.baseY * h + Math.sin(phase) * h * 0.06;
    const r = b.radius * Math.min(w, h);

    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, b.color + '0.12)');
    grad.addColorStop(0.5, b.color + '0.05)');
    grad.addColorStop(1, b.color + '0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w + cx, h + cy); // covers canvas from 0,0
  });
}

/* ---------- Wireframe Cube ---------- */

function drawWireframeCube(ctx, cx, cy, size, t) {
  const angle = t * Math.PI * 2;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const cosB = Math.cos(angle * 0.7);
  const sinB = Math.sin(angle * 0.7);

  const s = size / 2;
  // Unit cube vertices
  const verts = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1,  1], [1, -1,  1], [1, 1,  1], [-1, 1,  1],
  ];

  // Project with rotation around Y then X
  const projected = verts.map(([x, y, z]) => {
    // Rotate Y
    let x1 = x * cosA - z * sinA;
    let z1 = x * sinA + z * cosA;
    // Rotate X
    let y1 = y * cosB - z1 * sinB;
    // Simple orthographic scale
    return [cx + x1 * s, cy + y1 * s];
  });

  const edges = [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
  ];

  ctx.save();
  ctx.strokeStyle = 'rgba(0,255,255,0.25)';
  ctx.lineWidth = 1;
  ctx.shadowColor = 'rgba(0,255,255,0.4)';
  ctx.shadowBlur = 8;

  edges.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(projected[a][0], projected[a][1]);
    ctx.lineTo(projected[b][0], projected[b][1]);
    ctx.stroke();
  });

  ctx.restore();
}

/* ---------- Wireframe Sphere ---------- */

function drawWireframeSphere(ctx, cx, cy, radius, t) {
  const angle = t * Math.PI * 2;

  ctx.save();
  ctx.strokeStyle = 'rgba(140,80,255,0.2)';
  ctx.lineWidth = 0.8;
  ctx.shadowColor = 'rgba(140,80,255,0.35)';
  ctx.shadowBlur = 6;

  // Latitude rings
  const latCount = 6;
  for (let i = 1; i < latCount; i++) {
    const phi = (Math.PI * i) / latCount;
    const r = radius * Math.sin(phi);
    const yOff = radius * Math.cos(phi);

    ctx.beginPath();
    for (let j = 0; j <= 64; j++) {
      const theta = (Math.PI * 2 * j) / 64 + angle;
      const x = cx + r * Math.cos(theta);
      // Simple tilt projection
      const y = cy + yOff + r * Math.sin(theta) * 0.3;
      j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Longitude arcs
  const lonCount = 8;
  for (let i = 0; i < lonCount; i++) {
    const theta = (Math.PI * 2 * i) / lonCount + angle;
    ctx.beginPath();
    for (let j = 0; j <= 64; j++) {
      const phi = (Math.PI * j) / 64;
      const x = cx + radius * Math.sin(phi) * Math.cos(theta);
      const y = cy + radius * Math.cos(phi) + radius * Math.sin(phi) * Math.sin(theta) * 0.3;
      j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.restore();
}

/* ---------- Exploding Shoe Silhouette ---------- */

function drawExplodingShoe(ctx, cx, cy, size, t) {
  // Shoe silhouette is built from a set of polygon "shards".
  // As t increases each shard drifts outward, rotates, and fades.
  const shards = buildShoeShards();

  ctx.save();

  const explosion = Math.pow(t, 1.5); // ease-in explosion
  const opacity = 1 - t * 0.7;

  shards.forEach((shard, i) => {
    const burstAngle = shard.angle + (i % 2 === 0 ? 0.3 : -0.3) * t;
    const drift = explosion * size * shard.drift;
    const dx = Math.cos(burstAngle) * drift;
    const dy = Math.sin(burstAngle) * drift;
    const rot = explosion * shard.spin;

    ctx.save();
    ctx.translate(cx + dx, cy + dy);
    ctx.rotate(rot);
    ctx.scale(size, size);

    ctx.strokeStyle = `rgba(0,255,255,${(opacity * shard.alpha).toFixed(3)})`;
    ctx.lineWidth = 1.5 / size;
    ctx.shadowColor = `rgba(0,255,255,${(opacity * 0.5 * shard.alpha).toFixed(3)})`;
    ctx.shadowBlur = 4;

    ctx.beginPath();
    shard.points.forEach(([x, y], pi) => {
      pi === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  });

  ctx.restore();
}

/**
 * Build an array of polygon shards that together form a shoe silhouette.
 * Each shard has: points (normalised −0.5…0.5), angle, drift, spin, alpha.
 */
function buildShoeShards() {
  return [
    // ── Sole (bottom) ──
    {
      points: [[-0.35, 0.12], [-0.30, 0.18], [0.25, 0.18], [0.35, 0.14], [0.35, 0.10], [-0.35, 0.10]],
      angle: Math.PI * 0.5, drift: 0.6, spin: 0.8, alpha: 1,
    },
    // ── Sole front tip ──
    {
      points: [[0.25, 0.18], [0.38, 0.13], [0.42, 0.08], [0.38, 0.05], [0.30, 0.10]],
      angle: 0, drift: 0.9, spin: -1.2, alpha: 0.9,
    },
    // ── Heel stack ──
    {
      points: [[-0.35, 0.10], [-0.38, 0.05], [-0.35, -0.02], [-0.28, 0.00], [-0.30, 0.10]],
      angle: Math.PI, drift: 0.7, spin: 1.0, alpha: 0.95,
    },
    // ── Mid body lower ──
    {
      points: [[-0.28, 0.10], [-0.15, 0.00], [0.10, -0.02], [0.25, 0.02], [0.25, 0.10]],
      angle: -0.3, drift: 0.5, spin: -0.6, alpha: 0.85,
    },
    // ── Mid body upper ──
    {
      points: [[-0.15, 0.00], [-0.20, -0.08], [0.00, -0.12], [0.15, -0.10], [0.10, -0.02]],
      angle: -Math.PI * 0.4, drift: 0.55, spin: 0.9, alpha: 0.8,
    },
    // ── Collar / ankle ──
    {
      points: [[-0.20, -0.08], [-0.25, -0.18], [-0.15, -0.22], [-0.05, -0.18], [0.00, -0.12]],
      angle: -Math.PI * 0.65, drift: 0.65, spin: -1.1, alpha: 0.75,
    },
    // ── Tongue ──
    {
      points: [[-0.05, -0.18], [-0.02, -0.28], [0.06, -0.28], [0.08, -0.18], [0.00, -0.12]],
      angle: -Math.PI * 0.5, drift: 0.8, spin: 1.4, alpha: 0.7,
    },
    // ── Toe box upper ──
    {
      points: [[0.15, -0.10], [0.28, -0.08], [0.38, -0.02], [0.38, 0.05], [0.25, 0.02]],
      angle: 0.2, drift: 0.75, spin: -0.7, alpha: 0.85,
    },
    // ── Swoosh / stripe accent ──
    {
      points: [[-0.10, 0.02], [0.05, -0.04], [0.22, -0.02], [0.18, 0.02], [0.00, 0.00]],
      angle: 0.1, drift: 0.45, spin: 0.5, alpha: 0.6,
    },
    // ── Lace area detail 1 ──
    {
      points: [[-0.12, -0.10], [-0.08, -0.15], [0.00, -0.14], [0.02, -0.10], [-0.05, -0.08]],
      angle: -Math.PI * 0.3, drift: 0.85, spin: 1.8, alpha: 0.55,
    },
    // ── Lace area detail 2 ──
    {
      points: [[-0.04, -0.14], [0.00, -0.20], [0.06, -0.18], [0.06, -0.12], [0.02, -0.10]],
      angle: -Math.PI * 0.55, drift: 0.90, spin: -1.5, alpha: 0.5,
    },
    // ── Heel tab ──
    {
      points: [[-0.30, -0.04], [-0.33, -0.12], [-0.26, -0.14], [-0.22, -0.08], [-0.25, -0.02]],
      angle: Math.PI * 0.8, drift: 0.7, spin: 1.3, alpha: 0.65,
    },
  ];
}
