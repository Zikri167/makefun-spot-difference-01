// Boot and animation loop for Lantern Lane. In normal play this starts the
// game on the title screen and runs the frame loop; with ?shot= in the URL
// it renders one staged frame at a fixed moment instead, for screenshots.

import { SoundSynth } from './audio.js';
import { attachInput } from './input.js';
import { drawFrame } from './render.js';
import { buildShotState, isShotMode, SHOT_TIME_MS } from './shots.js';
import { createFreshGame, tickGame } from './state.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const sound = new SoundSynth();

if (isShotMode()) {
  const params = new URLSearchParams(window.location.search);
  const game = buildShotState(params.get('shot'));
  if (game) {
    game.muted = true;
    drawFrame(ctx, game, SHOT_TIME_MS);
    document.title = `Lantern Lane — shot ${params.get('shot')}`;
  }
} else {
  const game = createFreshGame();
  attachInput(canvas, game, sound);
  let lastNow = performance.now();
  function frame(now) {
    const delta = Math.min(0.1, (now - lastNow) / 1000);
    lastNow = now;
    tickGame(game, delta, sound);
    drawFrame(ctx, game, now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
