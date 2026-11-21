![best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)
![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rank/Zikri167.svg)
![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/reward/Zikri167.svg)

# Lantern Lane — Spot the Difference

A complete spot-the-difference game in plain HTML, CSS and canvas JavaScript —
no build step, no network, no external files. Two near-identical hand-drawn
scenes hang side by side; seven small things changed between them. Find them
all before the lanterns burn down, across three original scenes: a lighthouse
at dusk, a night market, and a greenhouse at noon.

Click a difference in either picture to ring it in gold. A wrong click costs
5 seconds. Hints pulse one unfound difference (20 s cooldown). Each find pays
200 points plus a streak bonus; finishing a scene pays a time bonus (10 per
second left) plus an accuracy bonus. Sounds are synthesized live with WebAudio
— chime, buzz, tick, fanfare — and every picture is drawn procedurally from a
fixed seed, so the game renders identically on every load.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Then serve `out/game` with any static server, or run `node serve.ts` and open
http://localhost:8080 to play.

## Play

- Click a difference in either panel to mark it in both.
- `H` hint, `M` sound on/off, `R` retry the scene, `Enter` start/continue,
  `Esc` pause.

Built for [make.fun](https://make.fun/?ref=63s6rw9w) — the best spot the
difference game bounty.
