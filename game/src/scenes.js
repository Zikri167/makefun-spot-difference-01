// The three original scenes of Lantern Lane. Each scene painter draws one
// flat-illustration picture into a panel rectangle, in two variants: the
// left and right panels differ only at the seven listed difference spots.
// Every decorative speck (stars, sparks, pebbles) comes from the scene's
// fixed seed, so both panels and every load render identically.

import { makeSeededRandom, rangeBetween, wholeBetween } from './random.js';

export const PANEL_WIDTH = 612;
export const PANEL_HEIGHT = 570;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawFourPointStar(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x, y, x + size, y);
  ctx.quadraticCurveTo(x, y, x, y + size);
  ctx.quadraticCurveTo(x, y, x - size, y);
  ctx.quadraticCurveTo(x, y, x, y - size);
  ctx.fill();
}

function drawGull(ctx, x, y, scale, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.4 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11 * scale, y);
  ctx.quadraticCurveTo(x - 5 * scale, y - 8 * scale, x, y);
  ctx.quadraticCurveTo(x + 5 * scale, y - 8 * scale, x + 11 * scale, y);
  ctx.stroke();
}

function drawLantern(ctx, x, y, size, bodyColor) {
  ctx.strokeStyle = '#5b3a1e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - size - 6);
  ctx.lineTo(x, y - size);
  ctx.stroke();
  ctx.fillStyle = '#f7c948';
  ctx.fillRect(x - 5, y - size - 8, 10, 5);
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x, y, size * 0.72, size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, y - size * 0.45, size * 0.5, size * 0.8, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#f7c948';
  ctx.fillRect(x - 5, y + size - 2, 10, 5);
}

function drawFishShape(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, size, size * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - size * 0.8, y);
  ctx.lineTo(x - size * 1.5, y - size * 0.55);
  ctx.lineTo(x - size * 1.5, y + size * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1d2b36';
  ctx.beginPath();
  ctx.arc(x + size * 0.55, y - size * 0.08, size * 0.09, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------------------
// Scene 1 — The Lighthouse at Dusk
// ---------------------------------------------------------------------------

export const SCENE_LIGHTHOUSE = {
  id: 'lighthouse',
  name: 'The Lighthouse at Dusk',
  seed: 11,
  differences: [
    { id: 'gull', label: 'a gull vanishes', x: 430, y: 95, radius: 26 },
    { id: 'lamp-window', label: 'the lamp room goes dark', x: 140, y: 170, radius: 24 },
    { id: 'sail-lines', label: 'a seam appears on the sail', x: 430, y: 440, radius: 34 },
    { id: 'cottage-window', label: 'the cottage window goes dark', x: 74, y: 490, radius: 26 },
    { id: 'fence-post', label: 'a fence post goes missing', x: 360, y: 312, radius: 22 },
    { id: 'moon', label: 'the moon changes phase', x: 520, y: 70, radius: 30 },
    { id: 'clothesline', label: 'the washing line disappears', x: 230, y: 352, radius: 36 },
  ],
};

function paintLighthouse(ctx, panel, variant) {
  const rng = makeSeededRandom(SCENE_LIGHTHOUSE.seed);
  const px = panel.x;
  const py = panel.y;
  ctx.save();
  ctx.translate(px, py);

  // Dusk sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 380);
  sky.addColorStop(0, '#2b2350');
  sky.addColorStop(0.55, '#6b3a63');
  sky.addColorStop(1, '#e08a4c');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_WIDTH, 380);

  // Stars, fixed by the seed.
  for (let i = 0; i < 46; i++) {
    const sx = rangeBetween(rng, 12, PANEL_WIDTH - 12);
    const sy = rangeBetween(rng, 10, 240);
    const size = rangeBetween(rng, 1.2, 3.4);
    drawFourPointStar(ctx, sx, sy, size, 'rgba(255, 244, 200, 0.9)');
  }

  // Moon: crescent on the left panel, small full moon on the right.
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.arc(520, 70, 26, 0, Math.PI * 2);
  ctx.fill();
  if (variant === 0) {
    ctx.fillStyle = '#2b2350';
    ctx.beginPath();
    ctx.arc(530, 62, 22, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = 'rgba(255, 233, 168, 0.55)';
    ctx.beginPath();
    ctx.arc(520, 70, 33, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8c97e';
    ctx.beginPath();
    ctx.arc(512, 64, 4, 0, Math.PI * 2);
    ctx.arc(528, 76, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Gulls: three on the left, two on the right (the one at 430,95 is gone).
  drawGull(ctx, 300, 120, 1, '#f5ead6');
  drawGull(ctx, 350, 82, 0.85, '#f5ead6');
  if (variant === 0) drawGull(ctx, 430, 95, 1, '#f5ead6');

  // Sea.
  const sea = ctx.createLinearGradient(0, 380, 0, PANEL_HEIGHT);
  sea.addColorStop(0, '#274b63');
  sea.addColorStop(1, '#122c40');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 380, PANEL_WIDTH, PANEL_HEIGHT - 380);
  ctx.strokeStyle = 'rgba(255, 210, 140, 0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 7; i++) {
    const wy = 400 + i * 24;
    ctx.beginPath();
    for (let wx = 0; wx <= PANEL_WIDTH; wx += 24) {
      const wobble = Math.sin((wx + i * 40) * 0.03) * 3;
      if (wx === 0) ctx.moveTo(wx, wy + wobble);
      else ctx.lineTo(wx, wy + wobble);
    }
    ctx.stroke();
  }

  // Rocky cliff on the left.
  ctx.fillStyle = '#4a3b52';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.lineTo(120, 285);
  ctx.lineTo(210, 310);
  ctx.lineTo(260, 330);
  ctx.lineTo(280, 380);
  ctx.lineTo(0, 380);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5d4a63';
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.lineTo(90, 320);
  ctx.lineTo(170, 340);
  ctx.lineTo(0, 380);
  ctx.closePath();
  ctx.fill();
  // Grass tufts on the cliff.
  ctx.strokeStyle = '#7fae6a';
  ctx.lineWidth = 2;
  for (let i = 0; i < 9; i++) {
    const gx = rangeBetween(rng, 10, 250);
    const gy = rangeBetween(rng, 292, 322);
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx - 3, gy - 9);
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + 3, gy - 10);
    ctx.stroke();
  }

  // Lighthouse tower.
  ctx.fillStyle = '#f3ede0';
  ctx.beginPath();
  ctx.moveTo(118, 330);
  ctx.lineTo(126, 180);
  ctx.lineTo(154, 180);
  ctx.lineTo(162, 330);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c94f43';
  ctx.beginPath();
  ctx.moveTo(121, 290);
  ctx.lineTo(159, 290);
  ctx.lineTo(161, 250);
  ctx.lineTo(119, 250);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(124, 220);
  ctx.lineTo(156, 220);
  ctx.lineTo(157, 192);
  ctx.lineTo(123, 192);
  ctx.closePath();
  ctx.fill();
  // Lamp room and roof.
  ctx.fillStyle = '#2e2a3a';
  ctx.fillRect(120, 158, 40, 24);
  ctx.fillStyle = variant === 0 ? '#ffd76a' : '#3a3450';
  ctx.fillRect(126, 162, 28, 16);
  ctx.fillStyle = '#c94f43';
  ctx.beginPath();
  ctx.moveTo(116, 158);
  ctx.lineTo(140, 138);
  ctx.lineTo(164, 158);
  ctx.closePath();
  ctx.fill();
  // Light beams when the lamp is lit.
  if (variant === 0) {
    ctx.fillStyle = 'rgba(255, 215, 106, 0.18)';
    ctx.beginPath();
    ctx.moveTo(160, 170);
    ctx.lineTo(330, 120);
    ctx.lineTo(330, 190);
    ctx.lineTo(160, 178);
    ctx.closePath();
    ctx.fill();
  }

  // Cottage at the foot of the cliff.
  ctx.fillStyle = '#e8c98f';
  ctx.fillRect(52, 462, 110, 78);
  ctx.fillStyle = '#a34a3a';
  ctx.beginPath();
  ctx.moveTo(44, 464);
  ctx.lineTo(107, 424);
  ctx.lineTo(170, 464);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(96, 500, 22, 40);
  ctx.fillStyle = variant === 0 ? '#ffd76a' : '#3a3450';
  ctx.fillRect(62, 478, 24, 24);
  ctx.fillStyle = variant === 0 ? '#ffd76a' : '#3a3450';
  ctx.fillRect(128, 478, 24, 24);
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 2;
  ctx.strokeRect(62, 478, 24, 24);
  ctx.strokeRect(128, 478, 24, 24);
  // Chimney with smoke puffs.
  ctx.fillStyle = '#8a6a52';
  ctx.fillRect(138, 428, 14, 30);
  ctx.fillStyle = 'rgba(240, 235, 220, 0.7)';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(152 + i * 8, 418 - i * 12, 6 + i * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Wooden fence along the cliff top.
  ctx.fillStyle = '#7a5a38';
  ctx.fillRect(268, 318, 300, 6);
  const fencePosts = [280, 320, 360, 400, 440, 480, 520, 556];
  for (const fx of fencePosts) {
    if (variant === 1 && fx === 360) continue;
    ctx.fillRect(fx - 4, 296, 8, 34);
    ctx.beginPath();
    ctx.moveTo(fx - 5, 296);
    ctx.lineTo(fx, 288);
    ctx.lineTo(fx + 5, 296);
    ctx.closePath();
    ctx.fill();
  }

  // Clothesline between two poles on the cliff edge (absent on the right panel).
  if (variant === 0) {
    ctx.strokeStyle = '#8a6a52';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(205, 330);
    ctx.lineTo(205, 382);
    ctx.moveTo(255, 330);
    ctx.lineTo(255, 382);
    ctx.stroke();
    ctx.strokeStyle = '#d8c9a3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(205, 340);
    ctx.quadraticCurveTo(230, 350, 255, 340);
    ctx.stroke();
    const clothColors = ['#e86a6a', '#6aa8e8', '#f2d06b'];
    clothColors.forEach((color, i) => {
      const cx = 216 + i * 16;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx - 7, 342);
      ctx.lineTo(cx + 7, 342);
      ctx.lineTo(cx + 5, 366);
      ctx.lineTo(cx - 5, 366);
      ctx.closePath();
      ctx.fill();
    });
  }

  // Sailboat on the sea.
  ctx.fillStyle = '#5b3a2e';
  ctx.beginPath();
  ctx.moveTo(392, 452);
  ctx.lineTo(478, 452);
  ctx.lineTo(462, 470);
  ctx.lineTo(406, 470);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3a241c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(434, 452);
  ctx.lineTo(434, 372);
  ctx.stroke();
  ctx.fillStyle = '#f6ead2';
  ctx.beginPath();
  ctx.moveTo(438, 376);
  ctx.lineTo(438, 448);
  ctx.lineTo(486, 448);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#b98a5e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(444, 392);
  ctx.lineTo(468, 448);
  ctx.moveTo(444, 416);
  ctx.lineTo(458, 448);
  if (variant === 1) {
    ctx.moveTo(444, 438);
    ctx.lineTo(448, 448);
  }
  ctx.stroke();
  // Little flag on the mast.
  ctx.fillStyle = '#c94f43';
  ctx.beginPath();
  ctx.moveTo(434, 372);
  ctx.lineTo(452, 377);
  ctx.lineTo(434, 383);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Scene 2 — The Night Market
// ---------------------------------------------------------------------------

export const SCENE_MARKET = {
  id: 'market',
  name: 'The Night Market',
  seed: 22,
  differences: [
    { id: 'lantern-color', label: 'a lantern changes colour', x: 300, y: 120, radius: 26 },
    { id: 'cat', label: 'the cat disappears', x: 520, y: 480, radius: 28 },
    { id: 'awning-stripes', label: 'an awning gains a stripe', x: 110, y: 232, radius: 34 },
    { id: 'balloon', label: 'a balloon floats away', x: 95, y: 95, radius: 26 },
    { id: 'vendor-hat', label: 'the vendor hat changes colour', x: 350, y: 246, radius: 24 },
    { id: 'fish-count', label: 'a fish vanishes from the ice', x: 332, y: 321, radius: 36 },
    { id: 'sign-letter', label: 'a letter changes on the sign', x: 310, y: 150, radius: 30 },
  ],
};

function paintMarket(ctx, panel, variant) {
  const rng = makeSeededRandom(SCENE_MARKET.seed);
  ctx.save();
  ctx.translate(panel.x, panel.y);

  // Night sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#141a38');
  sky.addColorStop(1, '#2c2a55');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_WIDTH, 300);
  for (let i = 0; i < 34; i++) {
    const sx = rangeBetween(rng, 10, PANEL_WIDTH - 10);
    const sy = rangeBetween(rng, 8, 130);
    drawFourPointStar(ctx, sx, sy, rangeBetween(rng, 1, 2.6), 'rgba(255, 246, 210, 0.85)');
  }

  // Cobble ground.
  ctx.fillStyle = '#3a3348';
  ctx.fillRect(0, 430, PANEL_WIDTH, PANEL_HEIGHT - 430);
  ctx.fillStyle = '#453e58';
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 12; col++) {
      const cx = col * 52 + (row % 2) * 26;
      const cy = 442 + row * 32;
      roundRect(ctx, cx, cy, 44, 24, 8);
      ctx.fill();
    }
  }

  // String lights across the top.
  ctx.strokeStyle = '#1c1626';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.quadraticCurveTo(PANEL_WIDTH / 2, 90, PANEL_WIDTH, 40);
  ctx.stroke();
  const bulbColors = ['#ffd76a', '#ff8a7a', '#7ad0ff', '#9dff8a'];
  for (let i = 0; i < 13; i++) {
    const t = i / 12;
    const bx = t * PANEL_WIDTH;
    const by = 40 + Math.sin(t * Math.PI) * 42;
    ctx.fillStyle = bulbColors[i % bulbColors.length];
    ctx.beginPath();
    ctx.arc(bx, by + 8, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hanging lanterns (one changes colour between panels).
  const lanternSpots = [
    { x: 90, y: 118, c: '#ff7a5c' },
    { x: 190, y: 128, c: '#ffd76a' },
    { x: 300, y: 120, c: variant === 0 ? '#ff5c5c' : '#2ec4b6' },
    { x: 410, y: 128, c: '#ff9e5c' },
    { x: 510, y: 118, c: '#ffd76a' },
  ];
  for (const spot of lanternSpots) {
    ctx.strokeStyle = '#1c1626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(spot.x, 66);
    ctx.lineTo(spot.x, spot.y - 14);
    ctx.stroke();
    drawLantern(ctx, spot.x, spot.y, 15, spot.c);
  }

  // Balloons bunch (one balloon floats away on the right panel).
  const balloonColors = ['#ff6b6b', '#ffd93d', '#6bcBff'];
  balloonColors.forEach((color, i) => {
    if (variant === 1 && i === 0) return;
    const bx = 70 + i * 26;
    const by = 82 + (i % 2) * 16;
    ctx.strokeStyle = '#d8d2c0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx, by + 20);
    ctx.quadraticCurveTo(bx + 12, by + 60, 108, 190);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(bx, by, 15, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(bx - 5, by - 7, 4, 6, -0.4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Stall 1 (left): fruit stall with a striped awning.
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(24, 300, 180, 130);
  ctx.fillStyle = '#c98a4b';
  ctx.fillRect(24, 300, 180, 14);
  const stripeCount = variant === 0 ? 3 : 4;
  for (let i = 0; i < stripeCount; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#e86a6a' : '#f6ead2';
    const sw = 180 / stripeCount;
    ctx.fillRect(24 + i * sw, 210, sw, 46);
    ctx.beginPath();
    ctx.moveTo(24 + i * sw, 256);
    ctx.lineTo(24 + (i + 0.5) * sw, 272);
    ctx.lineTo(24 + (i + 1) * sw, 256);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#2e2a3a';
  ctx.fillRect(24, 196, 180, 14);
  // Fruit piles.
  const fruits = ['#ff6b6b', '#ffb347', '#9dff8a', '#ff8ad0'];
  fruits.forEach((color, i) => {
    ctx.fillStyle = color;
    for (let j = 0; j < 4; j++) {
      ctx.beginPath();
      ctx.arc(52 + i * 42 + j * 5, 292 - j * 2, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Stall 2 (middle): fish stall with signboard.
  ctx.fillStyle = '#274b63';
  ctx.fillRect(228, 300, 180, 130);
  ctx.fillStyle = '#3a6a8a';
  ctx.fillRect(228, 300, 180, 14);
  ctx.fillStyle = '#e8e2d2';
  roundRect(ctx, 248, 132, 140, 44, 8);
  ctx.fill();
  ctx.fillStyle = '#2e2a3a';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(variant === 0 ? 'IKAN' : 'IKIN', 318, 156);
  ctx.fillStyle = '#274b63';
  ctx.font = 'bold 13px Georgia, serif';
  ctx.fillText('SEGAR', 318, 172);
  // Awning.
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#2ec4b6' : '#f6ead2';
    ctx.fillRect(228 + i * 45, 210, 45, 46);
    ctx.beginPath();
    ctx.moveTo(228 + i * 45, 256);
    ctx.lineTo(228 + (i + 0.5) * 45, 272);
    ctx.lineTo(228 + (i + 1) * 45, 256);
    ctx.closePath();
    ctx.fill();
  }
  // Fish on ice: three on the left, two on the right.
  ctx.fillStyle = '#dfe9ee';
  roundRect(ctx, 240, 306, 156, 30, 6);
  ctx.fill();
  const fishSpots = [
    { x: 272, y: 321, c: '#8ab8d8' },
    { x: 312, y: 321, c: '#d8a08a' },
    { x: 352, y: 321, c: '#8ab8d8' },
  ];
  fishSpots.forEach((spot, i) => {
    if (variant === 1 && i === 2) return;
    drawFishShape(ctx, spot.x, spot.y, 15, spot.c);
  });

  // Vendor behind stall 2.
  ctx.fillStyle = '#f2c9a0';
  ctx.beginPath();
  ctx.arc(350, 268, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = variant === 0 ? '#c94f43' : '#3a7d4f';
  ctx.beginPath();
  ctx.moveTo(326, 264);
  ctx.quadraticCurveTo(350, 226, 374, 264);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(324, 260, 52, 6);
  ctx.fillStyle = '#e86a6a';
  ctx.beginPath();
  ctx.moveTo(330, 288);
  ctx.quadraticCurveTo(350, 276, 370, 288);
  ctx.lineTo(370, 306);
  ctx.lineTo(330, 306);
  ctx.closePath();
  ctx.fill();
  // Vendor arms resting on the counter.
  ctx.strokeStyle = '#f2c9a0';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(336, 300);
  ctx.lineTo(322, 306);
  ctx.moveTo(364, 300);
  ctx.lineTo(378, 306);
  ctx.stroke();

  // Stall 3 (right): cloth stall.
  ctx.fillStyle = '#5b3a63';
  ctx.fillRect(432, 300, 156, 130);
  ctx.fillStyle = '#7a5290';
  ctx.fillRect(432, 300, 156, 14);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#ffd76a' : '#f6ead2';
    ctx.fillRect(432 + i * 52, 210, 52, 46);
    ctx.beginPath();
    ctx.moveTo(432 + i * 52, 256);
    ctx.lineTo(432 + (i + 0.5) * 52, 272);
    ctx.lineTo(432 + (i + 1) * 52, 256);
    ctx.closePath();
    ctx.fill();
  }
  // Folded cloth stacks.
  const clothColors = ['#ff8ad0', '#6bcBff', '#9dff8a', '#ffd76a'];
  clothColors.forEach((color, i) => {
    ctx.fillStyle = color;
    roundRect(ctx, 446 + i * 36, 282 - (i % 2) * 8, 30, 18, 4);
    ctx.fill();
  });

  // The cat sitting by stall 3 (gone on the right panel).
  if (variant === 0) {
    ctx.fillStyle = '#3a3348';
    ctx.beginPath();
    ctx.ellipse(520, 492, 20, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(520, 456, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(508, 444);
    ctx.lineTo(512, 428);
    ctx.lineTo(518, 444);
    ctx.closePath();
    ctx.moveTo(524, 444);
    ctx.lineTo(530, 428);
    ctx.lineTo(534, 444);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd76a';
    ctx.beginPath();
    ctx.arc(514, 454, 2.5, 0, Math.PI * 2);
    ctx.arc(526, 454, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Tail curling up.
    ctx.strokeStyle = '#3a3348';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(538, 506);
    ctx.quadraticCurveTo(556, 496, 550, 476);
    ctx.stroke();
  }

  // Fireflies drifting over the market.
  for (let i = 0; i < 12; i++) {
    const fx = rangeBetween(rng, 20, PANEL_WIDTH - 20);
    const fy = rangeBetween(rng, 340, 420);
    ctx.fillStyle = 'rgba(255, 215, 106, 0.75)';
    ctx.beginPath();
    ctx.arc(fx, fy, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Scene 3 — The Greenhouse at Noon
// ---------------------------------------------------------------------------

export const SCENE_GREENHOUSE = {
  id: 'greenhouse',
  name: 'The Greenhouse at Noon',
  seed: 33,
  differences: [
    { id: 'watering-can', label: 'the watering can moves', x: 175, y: 460, radius: 46 },
    { id: 'butterfly-wing', label: 'the butterfly changes colour', x: 410, y: 150, radius: 28 },
    { id: 'pot-count', label: 'a pot goes missing', x: 330, y: 500, radius: 26 },
    { id: 'sunflower-face', label: 'the sunflower turns away', x: 500, y: 300, radius: 30 },
    { id: 'window-crack', label: 'a crack appears in the glass', x: 150, y: 200, radius: 28 },
    { id: 'hose-coil', label: 'the hose coil disappears', x: 480, y: 480, radius: 28 },
    { id: 'ladybug-spots', label: 'the ladybug gains a spot', x: 260, y: 350, radius: 24 },
  ],
};

function drawSunflower(ctx, x, y, size, facingLeft) {
  ctx.strokeStyle = '#3a7d4f';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x, y + 14);
  ctx.lineTo(x, y + 90);
  ctx.stroke();
  ctx.fillStyle = '#3a7d4f';
  ctx.beginPath();
  ctx.ellipse(x - 16, y + 52, 14, 6, -0.6, 0, Math.PI * 2);
  ctx.fill();
  const tilt = facingLeft ? -0.35 : 0.35;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.fillStyle = '#f2b705';
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(Math.cos(angle) * size * 0.85, Math.sin(angle) * size * 0.85, size * 0.42, size * 0.2, angle, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#6b4a2f';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a6a3a';
  for (let i = 0; i < 7; i++) {
    const sx = ((i * 37) % 20) - 10;
    const sy = ((i * 53) % 20) - 10;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawButterfly(ctx, x, y, size, wingColor) {
  ctx.fillStyle = wingColor;
  ctx.beginPath();
  ctx.ellipse(x - size * 0.7, y - size * 0.3, size * 0.75, size * 0.5, -0.5, 0, Math.PI * 2);
  ctx.ellipse(x + size * 0.7, y - size * 0.3, size * 0.75, size * 0.5, 0.5, 0, Math.PI * 2);
  ctx.ellipse(x - size * 0.6, y + size * 0.45, size * 0.55, size * 0.4, 0.4, 0, Math.PI * 2);
  ctx.ellipse(x + size * 0.6, y + size * 0.45, size * 0.55, size * 0.4, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.beginPath();
  ctx.arc(x - size * 0.7, y - size * 0.35, size * 0.18, 0, Math.PI * 2);
  ctx.arc(x + size * 0.7, y - size * 0.35, size * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2e2a3a';
  ctx.beginPath();
  ctx.ellipse(x, y, size * 0.16, size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawWateringCan(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#3a7d8a';
  ctx.beginPath();
  ctx.moveTo(-22, -18);
  ctx.lineTo(18, -18);
  ctx.lineTo(26, 14);
  ctx.lineTo(-30, 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2a5a66';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-22, -18);
  ctx.quadraticCurveTo(-34, -34, -12, -38);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(22, -8);
  ctx.lineTo(44, -26);
  ctx.stroke();
  ctx.fillStyle = '#2a5a66';
  ctx.beginPath();
  ctx.arc(48, -28, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintGreenhouse(ctx, panel, variant) {
  const rng = makeSeededRandom(SCENE_GREENHOUSE.seed);
  ctx.save();
  ctx.translate(panel.x, panel.y);

  // Noon sky and sun.
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#8fd0ff');
  sky.addColorStop(1, '#dff3ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_WIDTH, 300);
  ctx.fillStyle = '#fff3b0';
  ctx.beginPath();
  ctx.arc(80, 64, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 243, 176, 0.7)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(80 + Math.cos(angle) * 38, 64 + Math.sin(angle) * 38);
    ctx.lineTo(80 + Math.cos(angle) * 50, 64 + Math.sin(angle) * 50);
    ctx.stroke();
  }
  // Drifting clouds.
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (let i = 0; i < 3; i++) {
    const cx = 200 + i * 150;
    const cy = 50 + (i % 2) * 34;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 44, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 30, cy + 6, 32, 13, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Grass ground.
  ctx.fillStyle = '#7fb069';
  ctx.fillRect(0, 430, PANEL_WIDTH, PANEL_HEIGHT - 430);
  ctx.fillStyle = '#8fbf77';
  ctx.fillRect(0, 430, PANEL_WIDTH, 10);
  for (let i = 0; i < 22; i++) {
    const gx = rangeBetween(rng, 8, PANEL_WIDTH - 8);
    const gy = rangeBetween(rng, 446, 560);
    ctx.strokeStyle = '#5d8a4a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx - 2, gy - 8);
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + 3, gy - 9);
    ctx.stroke();
  }

  // Greenhouse frame: arched glass house.
  ctx.fillStyle = 'rgba(190, 225, 240, 0.5)';
  ctx.beginPath();
  ctx.moveTo(60, 440);
  ctx.lineTo(60, 220);
  ctx.quadraticCurveTo(306, 60, 552, 220);
  ctx.lineTo(552, 440);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4a6a7a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(60, 440);
  ctx.lineTo(60, 220);
  ctx.quadraticCurveTo(306, 60, 552, 220);
  ctx.lineTo(552, 440);
  ctx.stroke();
  // Glass pane divisions.
  ctx.strokeStyle = 'rgba(74, 106, 122, 0.55)';
  ctx.lineWidth = 3;
  for (let i = 1; i < 6; i++) {
    const gx = 60 + (i / 6) * 492;
    ctx.beginPath();
    ctx.moveTo(gx, 440);
    ctx.lineTo(gx, 190);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(60, 320);
  ctx.lineTo(552, 320);
  ctx.stroke();
  // Window on the left wall, with a crack on the right panel.
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.fillRect(120, 170, 62, 74);
  ctx.strokeStyle = '#4a6a7a';
  ctx.lineWidth = 3;
  ctx.strokeRect(120, 170, 62, 74);
  ctx.beginPath();
  ctx.moveTo(151, 170);
  ctx.lineTo(151, 244);
  ctx.moveTo(120, 207);
  ctx.lineTo(182, 207);
  ctx.stroke();
  if (variant === 1) {
    ctx.strokeStyle = '#2e2a3a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(128, 178);
    ctx.lineTo(142, 196);
    ctx.lineTo(136, 214);
    ctx.lineTo(152, 228);
    ctx.moveTo(142, 196);
    ctx.lineTo(158, 188);
    ctx.stroke();
  }

  // Hanging planters inside.
  const planterColors = ['#e86a6a', '#6bcBff', '#ffd76a'];
  planterColors.forEach((color, i) => {
    const hx = 210 + i * 90;
    ctx.strokeStyle = '#4a6a7a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(hx, 150);
    ctx.lineTo(hx, 196);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(hx - 22, 196);
    ctx.lineTo(hx + 22, 196);
    ctx.lineTo(hx + 15, 224);
    ctx.lineTo(hx - 15, 224);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#3a7d4f';
    for (let j = 0; j < 3; j++) {
      ctx.beginPath();
      ctx.ellipse(hx - 12 + j * 12, 190, 7, 12, (j - 1) * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Butterfly: orange on the left, blue on the right.
  drawButterfly(ctx, 410, 150, 16, variant === 0 ? '#ff9e3d' : '#3d9eff');

  // Sunflower, facing left on the left panel and right on the right.
  drawSunflower(ctx, 500, 300, 26, variant === 0);

  // Leaf with a ladybug: five spots on the left, six on the right.
  ctx.fillStyle = '#3a7d4f';
  ctx.beginPath();
  ctx.ellipse(260, 350, 46, 20, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2a5a38';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(218, 362);
  ctx.lineTo(300, 338);
  ctx.stroke();
  ctx.fillStyle = '#e83a3a';
  ctx.beginPath();
  ctx.arc(260, 344, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2e2a3a';
  const spotCount = variant === 0 ? 5 : 6;
  const spotSpots = [
    [254, 338], [266, 338], [260, 346], [253, 350], [267, 350], [260, 336],
  ];
  for (let i = 0; i < spotCount; i++) {
    ctx.beginPath();
    ctx.arc(spotSpots[i][0], spotSpots[i][1], 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(260, 333, 5, 0, Math.PI * 2);
  ctx.fill();

  // Row of pots along the bottom: five on the left, four on the right.
  const potXs = [90, 165, 240, 315, 390];
  potXs.forEach((potX, i) => {
    if (variant === 1 && i === 3) return;
    ctx.fillStyle = '#3a7d4f';
    ctx.beginPath();
    ctx.ellipse(potX, 486, 20, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(potX - 8, 472, 12, 14, -0.4, 0, Math.PI * 2);
    ctx.ellipse(potX + 8, 470, 12, 14, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c96a3a';
    ctx.beginPath();
    ctx.moveTo(potX - 24, 492);
    ctx.lineTo(potX + 24, 492);
    ctx.lineTo(potX + 17, 528);
    ctx.lineTo(potX - 17, 528);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#a34f2a';
    ctx.fillRect(potX - 27, 488, 54, 8);
  });

  // Watering can: left position on the left panel, shifted right on the right.
  drawWateringCan(ctx, variant === 0 ? 140 : 215, 462, 1);

  // Hose coil: present on the left, gone on the right.
  if (variant === 0) {
    ctx.strokeStyle = '#2a7d4f';
    ctx.lineWidth = 7;
    for (let r = 0; r < 3; r++) {
      ctx.beginPath();
      ctx.arc(480, 480, 26 - r * 7, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(480, 454);
    ctx.quadraticCurveTo(500, 430, 522, 436);
    ctx.stroke();
  }

  // Bees drifting.
  for (let i = 0; i < 4; i++) {
    const bx = rangeBetween(rng, 60, 560);
    const by = rangeBetween(rng, 250, 330);
    ctx.fillStyle = '#2e2a3a';
    ctx.beginPath();
    ctx.ellipse(bx, by, 5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd76a';
    ctx.fillRect(bx - 2, by - 3, 4, 6);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.ellipse(bx - 2, by - 5, 4, 2.5, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Scene registry
// ---------------------------------------------------------------------------

export const SCENES = [SCENE_LIGHTHOUSE, SCENE_MARKET, SCENE_GREENHOUSE];

export function paintScene(ctx, scene, panel, variant) {
  if (scene.id === 'lighthouse') paintLighthouse(ctx, panel, variant);
  else if (scene.id === 'market') paintMarket(ctx, panel, variant);
  else paintGreenhouse(ctx, panel, variant);
}
