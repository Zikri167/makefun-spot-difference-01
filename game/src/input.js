// Mouse and keyboard input for Lantern Lane. Clicks inside a picture panel
// are hit-tested against the current scene's unfound differences; clicks on
// the HUD buttons and screen cards are routed to their actions. Coordinates
// are translated from page pixels into the canvas's own 1280x720 space.

import { LAYOUT } from './render.js';
import {
  advanceLevel,
  beginLevel,
  currentScene,
  findDifferenceAt,
  registerFound,
  registerWrongClick,
  startGame,
  togglePause,
  useHint,
} from './state.js';

function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function canvasPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width,
    y: ((clientY - rect.top) / rect.height) * canvas.height,
  };
}

function panelAt(x, y) {
  if (pointInRect(x, y, LAYOUT.leftPanel)) return { panel: LAYOUT.leftPanel, side: 0 };
  if (pointInRect(x, y, LAYOUT.rightPanel)) return { panel: LAYOUT.rightPanel, side: 1 };
  return null;
}

export function attachInput(canvas, game, sound) {
  function handlePanelClick(point) {
    const hit = panelAt(point.x, point.y);
    if (!hit) return false;
    if (game.screen !== 'playing' || game.paused) return true;
    const localX = point.x - hit.panel.x;
    const localY = point.y - hit.panel.y;
    const diff = findDifferenceAt(game, localX, localY);
    if (diff) {
      sound.playChime();
      registerFound(game, diff);
    } else {
      sound.playBuzz();
      registerWrongClick(game, localX, localY, hit.side);
    }
    return true;
  }

  function handleButtonClick(point) {
    if (game.screen === 'playing' && !game.paused) {
      if (pointInRect(point.x, point.y, LAYOUT.hintButton)) {
        const target = useHint(game);
        if (target) sound.playHint();
        return true;
      }
      if (pointInRect(point.x, point.y, LAYOUT.muteButton)) {
        game.muted = sound.toggleMuted();
        return true;
      }
    }
    if (game.screen === 'title' && pointInRect(point.x, point.y, LAYOUT.startButton)) {
      sound.ensureContext();
      startGame(game);
      return true;
    }
    if (game.screen === 'levelDone' && pointInRect(point.x, point.y, LAYOUT.continueButton)) {
      sound.ensureContext();
      advanceLevel(game);
      return true;
    }
    if (game.screen === 'win' && pointInRect(point.x, point.y, LAYOUT.againButton)) {
      sound.ensureContext();
      startGame(game);
      return true;
    }
    return false;
  }

  canvas.addEventListener('click', (event) => {
    sound.ensureContext();
    const point = canvasPoint(canvas, event.clientX, event.clientY);
    if (handleButtonClick(point)) return;
    handlePanelClick(point);
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'm') {
      game.muted = sound.toggleMuted();
      return;
    }
    if (key === 'enter') {
      sound.ensureContext();
      if (game.screen === 'title') startGame(game);
      else if (game.screen === 'levelDone') advanceLevel(game);
      else if (game.screen === 'win') startGame(game);
      return;
    }
    if (game.screen !== 'playing') return;
    if (key === 'h') {
      const target = useHint(game);
      if (target) sound.playHint();
    } else if (key === 'r') {
      beginLevel(game);
    } else if (key === 'escape') {
      togglePause(game);
    }
  });
}
