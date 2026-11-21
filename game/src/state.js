// Pure game state and rules for Lantern Lane: screens, levels, scoring,
// timer, hints and clicks. This module draws nothing and touches no DOM, so
// the same logic drives both live play and the staged screenshot states.

import { SCENES } from './scenes.js';

export const LEVEL_TIME = 150;
export const HINT_COOLDOWN = 20;
export const HINT_PULSE_SECONDS = 3;
export const WRONG_CLICK_PENALTY = 5;
export const FIND_BASE_POINTS = 200;
export const FIND_STREAK_POINTS = 50;

export function createFreshGame() {
  return {
    screen: 'title',
    levelIndex: 0,
    found: [],
    score: 0,
    streak: 0,
    bestStreak: 0,
    timeLeft: LEVEL_TIME,
    totalCorrect: 0,
    totalWrong: 0,
    levelCorrect: 0,
    levelWrong: 0,
    hintCooldownLeft: 0,
    hintTarget: null,
    hintTimeLeft: 0,
    wrongFlashes: [],
    sparkles: [],
    lastMessage: 'Find 7 differences in each scene. Good luck!',
    levelBonus: 0,
    levelAccuracy: 1,
    muted: false,
    tickSecond: -1,
    paused: false,
  };
}

export function currentScene(game) {
  return SCENES[game.levelIndex];
}

export function foundCount(game) {
  return game.found.length;
}

export function differencesLeft(game) {
  return currentScene(game).differences.length - game.found.length;
}

export function overallAccuracy(game) {
  const total = game.totalCorrect + game.totalWrong;
  if (total === 0) return 1;
  return game.totalCorrect / total;
}

export function startGame(game) {
  game.screen = 'playing';
  game.levelIndex = 0;
  game.score = 0;
  game.streak = 0;
  game.bestStreak = 0;
  game.totalCorrect = 0;
  game.totalWrong = 0;
  beginLevel(game);
}

export function beginLevel(game) {
  game.found = [];
  game.timeLeft = LEVEL_TIME;
  game.levelCorrect = 0;
  game.levelWrong = 0;
  game.hintCooldownLeft = 0;
  game.hintTarget = null;
  game.hintTimeLeft = 0;
  game.wrongFlashes = [];
  game.sparkles = [];
  game.tickSecond = -1;
  game.screen = 'playing';
  game.paused = false;
  game.lastMessage = `Level ${game.levelIndex + 1}: ${currentScene(game).name} — find 7 differences!`;
}

export function findDifferenceAt(game, x, y) {
  const scene = currentScene(game);
  for (const diff of scene.differences) {
    if (game.found.includes(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.radius * diff.radius) return diff;
  }
  return null;
}

export function registerFound(game, diff) {
  game.found.push(diff.id);
  game.streak += 1;
  if (game.streak > game.bestStreak) game.bestStreak = game.streak;
  const points = FIND_BASE_POINTS + FIND_STREAK_POINTS * game.streak;
  game.score += points;
  game.totalCorrect += 1;
  game.levelCorrect += 1;
  game.sparkles.push({ x: diff.x, y: diff.y, bornAt: 0, life: 0.9 });
  game.lastMessage = `Found it! ${diff.label} (+${points})`;
  if (game.found.length >= currentScene(game).differences.length) {
    finishLevel(game);
  }
}

export function registerWrongClick(game, x, y, side) {
  game.timeLeft = Math.max(0, game.timeLeft - WRONG_CLICK_PENALTY);
  game.streak = 0;
  game.totalWrong += 1;
  game.levelWrong += 1;
  game.wrongFlashes.push({ x, y, side: side || 0, bornAt: 0, life: 0.7 });
  game.lastMessage = `Not a difference — minus ${WRONG_CLICK_PENALTY} seconds. Look closer!`;
}

export function finishLevel(game) {
  const total = game.levelCorrect + game.levelWrong;
  const accuracy = total === 0 ? 1 : game.levelCorrect / total;
  const timeBonus = Math.round(game.timeLeft) * 10;
  const accuracyBonus = Math.round(accuracy * 500);
  game.levelBonus = timeBonus + accuracyBonus;
  game.levelAccuracy = accuracy;
  game.score += game.levelBonus;
  game.screen = 'levelDone';
  game.lastMessage = `Level complete! Time bonus ${timeBonus} + accuracy bonus ${accuracyBonus}.`;
}

export function advanceLevel(game) {
  if (game.levelIndex + 1 >= SCENES.length) {
    game.screen = 'win';
    return;
  }
  game.levelIndex += 1;
  beginLevel(game);
}

export function useHint(game) {
  if (game.screen !== 'playing' || game.paused) return null;
  if (game.hintCooldownLeft > 0) return null;
  const remaining = currentScene(game).differences.filter((d) => !game.found.includes(d.id));
  if (remaining.length === 0) return null;
  const target = remaining[0];
  game.hintTarget = target;
  game.hintTimeLeft = HINT_PULSE_SECONDS;
  game.hintCooldownLeft = HINT_COOLDOWN;
  game.lastMessage = 'Hint: something is pulsing. Look there!';
  return target;
}

export function togglePause(game) {
  if (game.screen !== 'playing') return;
  game.paused = !game.paused;
  game.lastMessage = game.paused ? 'Paused — press Esc to resume.' : 'Back to the hunt!';
}

export function tickGame(game, deltaSeconds, sound) {
  if (game.screen !== 'playing' || game.paused) return;

  if (game.hintCooldownLeft > 0) {
    game.hintCooldownLeft = Math.max(0, game.hintCooldownLeft - deltaSeconds);
  }
  if (game.hintTimeLeft > 0) {
    game.hintTimeLeft = Math.max(0, game.hintTimeLeft - deltaSeconds);
    if (game.hintTimeLeft === 0) game.hintTarget = null;
  }

  game.timeLeft -= deltaSeconds;
  const wholeSecond = Math.ceil(game.timeLeft);
  if (game.timeLeft <= 10 && wholeSecond !== game.tickSecond && game.timeLeft > 0) {
    game.tickSecond = wholeSecond;
    if (sound) sound.playTick();
  }
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    game.screen = 'levelDone';
    game.levelBonus = 0;
    const total = game.levelCorrect + game.levelWrong;
    game.levelAccuracy = total === 0 ? 0 : game.levelCorrect / total;
    game.lastMessage = 'Time ran out! The level ends here — try again or move on.';
  }

  for (const flash of game.wrongFlashes) flash.bornAt += deltaSeconds;
  game.wrongFlashes = game.wrongFlashes.filter((f) => f.bornAt < f.life);
  for (const sparkle of game.sparkles) sparkle.bornAt += deltaSeconds;
  game.sparkles = game.sparkles.filter((s) => s.bornAt < s.life);
}
