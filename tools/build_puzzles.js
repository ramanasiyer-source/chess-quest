// Build puzzles.js from the Lichess open puzzle database (CC0, https://database.lichess.org/#puzzles)
// Usage:  zstd -dc lichess_db_puzzle.csv.zst | node tools/build_puzzles.js
// CSV columns: PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
// FEN is the position BEFORE the opponent's move; Moves[0] is the opponent's move, the rest is the solution.
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Chess } = require('../assets/chess.min.js');
const OUT = path.join(__dirname, '..', 'puzzles.js');

// Lichess puzzle ratings run ~400-600 above over-the-board scholastic ratings, so bands are set accordingly.
const LEVELS = [
  { lvl: 1, min: 0,    max: 1000, want: 300, maxSolverMoves: 2, themes: ['mateIn1', 'hangingPiece', 'fork', 'pin', 'skewer', 'backRankMate', 'capturingDefender', 'trappedPiece'] },
  { lvl: 2, min: 1000, max: 1300, want: 300, maxSolverMoves: 3, themes: ['mateIn1', 'mateIn2', 'fork', 'hangingPiece', 'pin', 'skewer', 'backRankMate', 'discoveredAttack', 'trappedPiece', 'capturingDefender', 'endgame', 'pawnEndgame'] },
  { lvl: 3, min: 1300, max: 1600, want: 260, maxSolverMoves: 3, themes: ['mateIn2', 'fork', 'pin', 'skewer', 'discoveredAttack', 'deflection', 'attraction', 'capturingDefender', 'trappedPiece', 'rookEndgame', 'endgame', 'pawnEndgame', 'quietMove', 'advantage'] },
  { lvl: 4, min: 1600, max: 1950, want: 200, maxSolverMoves: 4, themes: ['mateIn2', 'mateIn3', 'fork', 'discoveredAttack', 'deflection', 'attraction', 'sacrifice', 'rookEndgame', 'endgame', 'pawnEndgame', 'quietMove', 'xRayAttack', 'advantage'] },
];
const CAP = 120; // reservoir size per (level, theme)
const buckets = {}; // `${lvl}|${theme}` -> {seen, items}
let rows = 0;

function consider(lvl, theme, rec) {
  const k = lvl + '|' + theme; const b = (buckets[k] = buckets[k] || { seen: 0, items: [] });
  b.seen++;
  if (b.items.length < CAP) b.items.push(rec); else { const j = Math.floor(Math.random() * b.seen); if (j < CAP) b.items[j] = rec; }
}

const rl = readline.createInterface({ input: process.stdin });
rl.on('line', line => {
  rows++;
  if (rows === 1) return; // header
  const c = line.split(',');
  if (c.length < 8) return;
  const rating = +c[3], dev = +c[4], pop = +c[5], plays = +c[6];
  if (dev > 90 || pop < 90 || plays < 300) return; // only well-tested, well-liked puzzles
  const L = LEVELS.find(l => rating >= l.min && rating < l.max); if (!L) return;
  const moves = c[2].split(' '); const solverMoves = Math.floor(moves.length / 2);
  if (solverMoves > L.maxSolverMoves) return;
  const themes = c[7].split(' ');
  const theme = L.themes.find(t => themes.includes(t)); if (!theme) return;
  consider(L.lvl, theme, { id: c[0], r: rating, t: [theme].concat(themes.filter(x => x !== theme && L.themes.includes(x)).slice(0, 2)), fen: c[1], moves });
});
rl.on('close', () => {
  console.log('rows read:', rows);
  const out = [];
  for (const L of LEVELS) {
    const per = L.themes.map(t => (buckets[L.lvl + '|' + t] || { items: [] }).items.slice().sort(() => Math.random() - 0.5));
    const picked = [];
    while (picked.length < L.want && per.some(a => a.length)) for (const a of per) if (a.length && picked.length < L.want) picked.push(a.pop());
    let ok = 0;
    for (const p of picked) {
      const ch = new Chess(p.fen); const first = p.moves[0];
      if (!ch.move({ from: first.slice(0, 2), to: first.slice(2, 4), promotion: first[4] })) continue;
      const fen = ch.fen(); const sol = p.moves.slice(1);
      const test = new Chess(fen); let valid = true;
      for (const u of sol) if (!test.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })) { valid = false; break; }
      if (!valid) continue;
      out.push({ id: p.id, l: L.lvl, r: p.r, t: p.t, f: fen, s: sol.join(' '), lm: first.slice(0, 4) }); ok++;
    }
    console.log('level', L.lvl, 'picked', picked.length, 'valid', ok, '|', L.themes.map((t, i) => t + ':' + picked.filter(x => x.t[0] === t).length).join(' '));
  }
  fs.writeFileSync(OUT, '// Auto-generated from the Lichess puzzle database (CC0). See tools/build_puzzles.js\nwindow.PUZZLES = ' + JSON.stringify(out) + ';\n');
  console.log('wrote', out.length, 'puzzles ->', OUT, (fs.statSync(OUT).size / 1024).toFixed(0) + 'KB');
});
