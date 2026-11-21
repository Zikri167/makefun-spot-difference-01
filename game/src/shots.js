// Staged screenshot states for Lantern Lane. With ?shot= in the URL the
// game builds a real game state (never a pasted picture), renders exactly one
// frame at a fixed moment, and stops — so every screenshot is deterministic
// and shows the genuine game.
//   start  — title card over scene 1, nothing found yet
//   play   — scene 1 mid-play, exactly 3 found with gold markers, 4 left,
//            timer about 96 seconds, score 1250
//   market — scene 2 mid-play, 5 of 7 found
//   end    — win screen after scene 3, totals shown

import { SCENES } from './scenes.js';
import {
  createFreshGame,
  currentScene,
} from './state.js';

export const SHOT_TIME_MS = 1200;

function markFound(game, count) {
  const scene = currentScene(game);
  game.found = scene.differences.slice(0, count).map((d) => d.id);
}

export function buildShotState(shot) {
  const game = createFreshGame();
  if (shot === 'start') {
    game.screen = 'title';
    game.levelIndex = 0;
    game.timeLeft = 150;
    return game;
  }
  if (shot === 'play') {
    game.screen = 'playing';
    game.levelIndex = 0;
    markFound(game, 3);
    game.score = 1250;
    game.streak = 3;
    game.bestStreak = 3;
    game.timeLeft = 96;
    game.totalCorrect = 3;
    game.lastMessage = 'Found it! the cottage window goes dark (+350)';
    return game;
  }
  if (shot === 'market') {
    game.screen = 'playing';
    game.levelIndex = 1;
    markFound(game, 5);
    game.score = 2400;
    game.streak = 5;
    game.bestStreak = 5;
    game.timeLeft = 74;
    game.totalCorrect = 5;
    game.lastMessage = 'Found it! a fish vanishes from the ice (+450)';
    return game;
  }
  if (shot === 'end') {
    game.screen = 'win';
    game.levelIndex = 2;
    markFound(game, 7);
    game.timeLeft = 42;
    game.score = 9850;
    game.streak = 4;
    game.bestStreak = 9;
    game.totalCorrect = 21;
    game.totalWrong = 3;
    game.lastMessage = 'Every lantern lit, every difference found.';
    return game;
  }
  return null;
}

export function shotFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('shot');
}

export function isShotMode() {
  return shotFromUrl() !== null;
}
