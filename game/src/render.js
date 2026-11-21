// All drawing of Lantern Lane's chrome: the HUD bar, the two picture panels,
// found-difference markers, wrong-click flashes, hint pulses and every
// screen card (title, level done, win, pause). Scene pictures themselves live
// in scenes.js. drawFrame is a pure function of (game, nowMs).

import { PANEL_WIDTH, PANEL_HEIGHT, paintScene } from './scenes.js';
import { LEVEL_TIME, currentScene, foundCount } from './state.js';

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

export const LAYOUT = {
  hudHeight: 64,
  leftPanel: { x: 16, y: 76, w: PANEL_WIDTH, h: PANEL_HEIGHT },
  rightPanel: { x: 652, y: 76, w: PANEL_WIDTH, h: PANEL_HEIGHT },
  statusBar: { x: 16, y: 656, w: 1248, h: 48 },
  hintButton: { x: 1090, y: 16, w: 80, h: 32 },
  muteButton: { x: 1180, y: 16, w: 84, h: 32 },
  startButton: { x: 520, y: 480, w: 240, h: 56 },
  continueButton: { x: 520, y: 500, w: 240, h: 56 },
  againButton: { x: 520, y: 520, w: 240, h: 56 },
};

const GOLD = '#f2c14e';
const CREAM = '#f6ead2';
const INK = '#2e2a3a';

function drawRoundedButton(ctx, rect, label, enabled) {
  ctx.fillStyle = enabled ? GOLD : '#5a5470';
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.w, rect.h, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = enabled ? INK : '#cfc9dd';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
}

function drawTimerBar(ctx, game) {
  const barX = 830;
  const barY = 20;
  const barW = 180;
  const barH = 16;
  const fraction = Math.max(0, game.timeLeft / LEVEL_TIME);
  ctx.fillStyle = '#3a3450';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 8);
  ctx.fill();
  ctx.fillStyle = game.timeLeft <= 30 ? '#e85d4a' : '#7fbf6a';
  if (fraction > 0) {
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * fraction, barH, 8);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 8);
  ctx.stroke();
  ctx.fillStyle = CREAM;
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${Math.ceil(game.timeLeft)}s`, barX + barW + 10, barY + barH / 2 + 1);
  ctx.fillStyle = '#b9b2cc';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('TIME', barX - 10, barY + barH / 2 + 1);
}

function drawHud(ctx, game) {
  ctx.fillStyle = '#232038';
  ctx.fillRect(0, 0, CANVAS_WIDTH, LAYOUT.hudHeight);
  ctx.fillStyle = GOLD;
  ctx.fillRect(0, LAYOUT.hudHeight - 3, CANVAS_WIDTH, 3);

  ctx.fillStyle = GOLD;
  ctx.font = 'bold 27px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('LANTERN LANE', 24, 26);
  ctx.fillStyle = '#b9b2cc';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText(`Level ${game.levelIndex + 1} — ${currentScene(game).name}`, 24, 50);

  const found = foundCount(game);
  const total = currentScene(game).differences.length;
  ctx.fillStyle = CREAM;
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Found ${found} / ${total}`, CANVAS_WIDTH / 2, 32);
  ctx.fillStyle = '#b9b2cc';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('differences', CANVAS_WIDTH / 2, 54);

  drawTimerBar(ctx, game);

  ctx.fillStyle = CREAM;
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Score ${game.score}`, 830, 56);

  const hintReady = game.hintCooldownLeft <= 0;
  const hintLabel = hintReady ? 'Hint (H)' : `Hint ${Math.ceil(game.hintCooldownLeft)}s`;
  drawRoundedButton(ctx, LAYOUT.hintButton, hintLabel, hintReady);
  drawRoundedButton(ctx, LAYOUT.muteButton, game.muted ? 'Muted' : 'Sound', true);
}

function drawPanelFrame(ctx, panel, label) {
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(panel.x - 2, panel.y - 2, panel.w + 4, panel.h + 4);
  ctx.fillStyle = 'rgba(35, 32, 56, 0.85)';
  ctx.beginPath();
  ctx.roundRect(panel.x + 10, panel.y + 10, 92, 26, 6);
  ctx.fill();
  ctx.fillStyle = CREAM;
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, panel.x + 22, panel.y + 24);
}

function drawFoundMarker(ctx, panel, diff, nowMs) {
  const cx = panel.x + diff.x;
  const cy = panel.y + diff.y;
  const ringRadius = diff.radius + 8;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(242, 193, 78, 0.45)';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(cx, cy, ringRadius + 5, 0, Math.PI * 2);
  ctx.stroke();
  // Check mark inside the ring.
  ctx.strokeStyle = '#fff3c4';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - ringRadius * 0.45, cy);
  ctx.lineTo(cx - ringRadius * 0.1, cy + ringRadius * 0.35);
  ctx.lineTo(cx + ringRadius * 0.5, cy - ringRadius * 0.35);
  ctx.stroke();
}

function drawSparkles(ctx, panel, sparkle, nowMs) {
  const age = sparkle.bornAt;
  const life = sparkle.life;
  const progress = Math.min(1, age / life);
  const cx = panel.x + sparkle.x;
  const cy = panel.y + sparkle.y;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + 0.4;
    const distance = 8 + progress * 30;
    const sx = cx + Math.cos(angle) * distance;
    const sy = cy + Math.sin(angle) * distance;
    const size = 5 * (1 - progress) + 1;
    ctx.fillStyle = `rgba(255, 243, 196, ${1 - progress})`;
    ctx.beginPath();
    ctx.moveTo(sx, sy - size);
    ctx.quadraticCurveTo(sx, sy, sx + size, sy);
    ctx.quadraticCurveTo(sx, sy, sx, sy + size);
    ctx.quadraticCurveTo(sx, sy, sx - size, sy);
    ctx.quadraticCurveTo(sx, sy, sx, sy - size);
    ctx.fill();
  }
}

function drawWrongFlash(ctx, panel, flash) {
  const progress = Math.min(1, flash.bornAt / flash.life);
  const alpha = 1 - progress;
  const cx = panel.x + flash.x;
  const cy = panel.y + flash.y;
  ctx.strokeStyle = `rgba(232, 93, 74, ${alpha})`;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy - 14);
  ctx.lineTo(cx + 14, cy + 14);
  ctx.moveTo(cx + 14, cy - 14);
  ctx.lineTo(cx - 14, cy + 14);
  ctx.stroke();
}

function drawHintPulse(ctx, panel, diff, nowMs) {
  const pulse = 0.5 + 0.5 * Math.sin(nowMs / 180);
  const radius = diff.radius + 10 + pulse * 8;
  ctx.strokeStyle = `rgba(242, 193, 78, ${0.55 + pulse * 0.45})`;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(panel.x + diff.x, panel.y + diff.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(242, 193, 78, 0.18)';
  ctx.beginPath();
  ctx.arc(panel.x + diff.x, panel.y + diff.y, radius - 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawPanels(ctx, game, nowMs) {
  const scene = currentScene(game);
  paintScene(ctx, scene, LAYOUT.leftPanel, 0);
  paintScene(ctx, scene, LAYOUT.rightPanel, 1);
  drawPanelFrame(ctx, LAYOUT.leftPanel, 'Panel A');
  drawPanelFrame(ctx, LAYOUT.rightPanel, 'Panel B');

  for (const diff of scene.differences) {
    if (!game.found.includes(diff.id)) continue;
    drawFoundMarker(ctx, LAYOUT.leftPanel, diff, nowMs);
    drawFoundMarker(ctx, LAYOUT.rightPanel, diff, nowMs);
  }
  for (const sparkle of game.sparkles) {
    drawSparkles(ctx, LAYOUT.leftPanel, sparkle, nowMs);
    drawSparkles(ctx, LAYOUT.rightPanel, sparkle, nowMs);
  }
  for (const flash of game.wrongFlashes) {
    const panel = flash.side === 1 ? LAYOUT.rightPanel : LAYOUT.leftPanel;
    drawWrongFlash(ctx, panel, flash);
  }
  if (game.hintTarget && game.hintTimeLeft > 0) {
    drawHintPulse(ctx, LAYOUT.leftPanel, game.hintTarget, nowMs);
    drawHintPulse(ctx, LAYOUT.rightPanel, game.hintTarget, nowMs);
  }
}

function drawStatusBar(ctx, game) {
  const bar = LAYOUT.statusBar;
  ctx.fillStyle = '#232038';
  ctx.beginPath();
  ctx.roundRect(bar.x, bar.y, bar.w, bar.h, 8);
  ctx.fill();
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Streak ${game.streak}  •  Best ${game.bestStreak}`, bar.x + 18, bar.y + bar.h / 2);
  ctx.fillStyle = CREAM;
  ctx.font = '15px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(game.lastMessage, bar.x + bar.w - 18, bar.y + bar.h / 2);
}

function drawDimOverlay(ctx, alpha) {
  ctx.fillStyle = `rgba(20, 18, 34, ${alpha})`;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawCard(ctx, x, y, w, h) {
  ctx.fillStyle = '#2b2742';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 16);
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawTitleScreen(ctx, game, nowMs) {
  drawDimOverlay(ctx, 0.55);
  drawCard(ctx, 340, 120, 600, 470);
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 54px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LANTERN LANE', CANVAS_WIDTH / 2, 180);
  ctx.fillStyle = CREAM;
  ctx.font = '21px Georgia, serif';
  ctx.fillText('Spot the Difference', CANVAS_WIDTH / 2, 226);
  ctx.fillStyle = '#cfc9dd';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText('Two pictures hang side by side. Seven small things', CANVAS_WIDTH / 2, 276);
  ctx.fillText('changed between them. Find all 7 before the lanterns', CANVAS_WIDTH / 2, 300);
  ctx.fillText('burn down — across 3 hand-drawn scenes.', CANVAS_WIDTH / 2, 324);
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.fillText('Click a difference  •  H hint  •  M sound  •  R retry  •  Esc pause', CANVAS_WIDTH / 2, 372);
  ctx.fillStyle = '#b9b2cc';
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText('Wrong click: −5 seconds.  Find: +200, streaks pay more.', CANVAS_WIDTH / 2, 404);
  ctx.fillText('150 seconds per scene.  7 differences per scene.', CANVAS_WIDTH / 2, 428);
  drawRoundedButton(ctx, LAYOUT.startButton, 'Start Playing', true);
  ctx.fillStyle = '#b9b2cc';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Press Enter to start', CANVAS_WIDTH / 2, 566);
}

function drawLevelDoneScreen(ctx, game) {
  drawDimOverlay(ctx, 0.55);
  drawCard(ctx, 380, 150, 520, 440);
  const timedOut = game.timeLeft <= 0 && game.found.length < currentScene(game).differences.length;
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(timedOut ? "Time's Up!" : 'Scene Complete!', CANVAS_WIDTH / 2, 205);
  ctx.fillStyle = CREAM;
  ctx.font = '19px system-ui, sans-serif';
  ctx.fillText(`${currentScene(game).name}`, CANVAS_WIDTH / 2, 252);
  ctx.font = '17px system-ui, sans-serif';
  ctx.fillText(`Found ${game.found.length} / ${currentScene(game).differences.length} differences`, CANVAS_WIDTH / 2, 288);
  ctx.fillText(`Accuracy ${Math.round(game.levelAccuracy * 100)}%`, CANVAS_WIDTH / 2, 318);
  if (game.levelBonus > 0) {
    ctx.fillStyle = GOLD;
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(`Bonus +${game.levelBonus}`, CANVAS_WIDTH / 2, 356);
  }
  ctx.fillStyle = CREAM;
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText(`Score ${game.score}`, CANVAS_WIDTH / 2, 396);
  const nextLabel = game.levelIndex + 1 >= 3 ? 'See Results' : 'Next Scene';
  drawRoundedButton(ctx, LAYOUT.continueButton, nextLabel, true);
  ctx.fillStyle = '#b9b2cc';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Press Enter to continue', CANVAS_WIDTH / 2, 578);
}

function drawWinScreen(ctx, game) {
  drawDimOverlay(ctx, 0.45);
  drawCard(ctx, 340, 110, 600, 500);
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 46px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('You Found Them All!', CANVAS_WIDTH / 2, 168);
  ctx.fillStyle = CREAM;
  ctx.font = '20px Georgia, serif';
  ctx.fillText('Every lantern lit, every difference found.', CANVAS_WIDTH / 2, 212);
  ctx.fillStyle = CREAM;
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillText(`Total Score  ${game.score}`, CANVAS_WIDTH / 2, 272);
  ctx.font = '19px system-ui, sans-serif';
  ctx.fillText(`Differences found  ${game.totalCorrect} / 21`, CANVAS_WIDTH / 2, 316);
  ctx.fillText(`Best streak  ${game.bestStreak}`, CANVAS_WIDTH / 2, 348);
  ctx.fillText(`Accuracy  ${Math.round(overallAccuracy(game) * 100)}%`, CANVAS_WIDTH / 2, 380);
  ctx.fillStyle = GOLD;
  ctx.font = '17px system-ui, sans-serif';
  ctx.fillText('Thanks for walking Lantern Lane.', CANVAS_WIDTH / 2, 428);
  drawRoundedButton(ctx, LAYOUT.againButton, 'Play Again', true);
  ctx.fillStyle = '#b9b2cc';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Press Enter to play again', CANVAS_WIDTH / 2, 596);
}

function drawPausedScreen(ctx, game) {
  drawDimOverlay(ctx, 0.6);
  ctx.fillStyle = CREAM;
  ctx.font = 'bold 44px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Paused', CANVAS_WIDTH / 2, 330);
  ctx.fillStyle = '#cfc9dd';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText('Press Esc to keep hunting', CANVAS_WIDTH / 2, 380);
}

export function drawFrame(ctx, game, nowMs) {
  ctx.fillStyle = '#1d2233';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawHud(ctx, game);
  drawPanels(ctx, game, nowMs);
  drawStatusBar(ctx, game);

  if (game.screen === 'title') drawTitleScreen(ctx, game, nowMs);
  else if (game.screen === 'levelDone') drawLevelDoneScreen(ctx, game);
  else if (game.screen === 'win') drawWinScreen(ctx, game);
  else if (game.screen === 'playing' && game.paused) drawPausedScreen(ctx, game);
}

export function overallAccuracy(game) {
  const total = game.totalCorrect + game.totalWrong;
  if (total === 0) return 1;
  return game.totalCorrect / total;
}
