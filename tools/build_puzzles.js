// Build puzzles.js from the Lichess open puzzle database (CC0, https://database.lichess.org/#puzzles)
// Preserves all existing puzzle IDs so player history is never lost, and fills all 8 Minecraft Mastery tiers.
// Usage:  curl -sL https://database.lichess.org/lichess_db_puzzle.csv.zst | zstd -dc | head -n 500000 | node tools/build_puzzles.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Chess } = require('../assets/chess.min.js');
const OUT = path.join(__dirname, '..', 'puzzles.js');

const LEVELS = [
  { lvl: 1, min: 0,    max: 1050, want: 220, maxSolverMoves: 2, themes: ['mateIn1', 'hangingPiece', 'fork', 'pin', 'skewer', 'backRankMate', 'capturingDefender', 'trappedPiece'] },
  { lvl: 2, min: 1050, max: 1250, want: 220, maxSolverMoves: 3, themes: ['mateIn1', 'mateIn2', 'fork', 'hangingPiece', 'pin', 'skewer', 'backRankMate', 'discoveredAttack', 'trappedPiece', 'capturingDefender', 'endgame', 'pawnEndgame'] },
  { lvl: 3, min: 1250, max: 1450, want: 220, maxSolverMoves: 3, themes: ['mateIn2', 'fork', 'pin', 'skewer', 'discoveredAttack', 'deflection', 'attraction', 'capturingDefender', 'trappedPiece', 'rookEndgame', 'endgame', 'pawnEndgame', 'quietMove', 'advantage'] },
  { lvl: 4, min: 1450, max: 1625, want: 220, maxSolverMoves: 4, themes: ['mateIn2', 'mateIn3', 'fork', 'discoveredAttack', 'deflection', 'attraction', 'sacrifice', 'rookEndgame', 'endgame', 'pawnEndgame', 'quietMove', 'xRayAttack', 'advantage'] },
  { lvl: 5, min: 1625, max: 1775, want: 220, maxSolverMoves: 4, themes: ['mateIn2', 'mateIn3', 'fork', 'discoveredAttack', 'deflection', 'attraction', 'sacrifice', 'clearance', 'intermezzo', 'quietMove', 'rookEndgame', 'endgame', 'advantage', 'crushing'] },
  { lvl: 6, min: 1775, max: 1925, want: 200, maxSolverMoves: 4, themes: ['mateIn3', 'deflection', 'attraction', 'sacrifice', 'clearance', 'intermezzo', 'quietMove', 'zugzwang', 'rookEndgame', 'endgame', 'pawnEndgame', 'advantage', 'crushing'] },
  { lvl: 7, min: 1925, max: 2100, want: 180, maxSolverMoves: 5, themes: ['mateIn3', 'mateIn4', 'deflection', 'sacrifice', 'clearance', 'intermezzo', 'quietMove', 'zugzwang', 'endgame', 'rookEndgame', 'defensiveMove', 'advantage', 'crushing'] },
  { lvl: 8, min: 2100, max: 2500, want: 160, maxSolverMoves: 5, themes: ['mateIn3', 'mateIn4', 'sacrifice', 'clearance', 'intermezzo', 'quietMove', 'zugzwang', 'endgame', 'rookEndgame', 'defensiveMove', 'veryLong', 'advantage', 'crushing'] },
];

// Load existing puzzles so no solved puzzle ID is ever lost
global.window = {};
try { require(OUT); } catch {}
const existing = window.PUZZLES || [];
const existingById = new Map();
for (const p of existing) {
  const L = LEVELS.find(l => p.r >= l.min && p.r < l.max) || LEVELS[LEVELS.length - 1];
  p.l = L.lvl;
  existingById.set(p.id, p);
}

const CAP = 100;
const buckets = {};
let rows = 0;

function consider(lvl, theme, rec) {
  if (existingById.has(rec.id)) return;
  const k = lvl + '|' + theme; const b = (buckets[k] = buckets[k] || { seen: 0, items: [] });
  b.seen++;
  if (b.items.length < CAP) b.items.push(rec); else { const j = Math.floor(Math.random() * b.seen); if (j < CAP) b.items[j] = rec; }
}

const rl = readline.createInterface({ input: process.stdin });
rl.on('line', line => {
  rows++;
  if (rows === 1) return;
  const c = line.split(',');
  if (c.length < 8) return;
  const rating = +c[3], dev = +c[4], pop = +c[5], plays = +c[6];
  if (dev > 90 || pop < 88 || plays < 250) return;
  const L = LEVELS.find(l => rating >= l.min && rating < l.max); if (!L) return;
  const moves = c[2].split(' '); const solverMoves = Math.floor(moves.length / 2);
  if (solverMoves > L.maxSolverMoves) return;
  const themes = c[7].split(' ');
  const theme = L.themes.find(t => themes.includes(t)); if (!theme) return;
  consider(L.lvl, theme, { id: c[0], r: rating, t: [theme].concat(themes.filter(x => x !== theme && L.themes.includes(x)).slice(0, 2)), fen: c[1], moves });
});
rl.on('close', () => {
  console.log('rows read:', rows, 'existing kept:', existingById.size);
  const out = [...existingById.values()];
  for (const L of LEVELS) {
    const have = out.filter(x => x.l === L.lvl).length;
    const need = Math.max(0, L.want - have);
    const per = L.themes.map(t => (buckets[L.lvl + '|' + t] || { items: [] }).items.slice().sort(() => Math.random() - 0.5));
    const picked = [];
    while (picked.length < need && per.some(a => a.length)) for (const a of per) if (a.length && picked.length < need) picked.push(a.pop());
    let ok = 0;
    for (const p of picked) {
      if (existingById.has(p.id)) continue;
      const ch = new Chess(p.fen); const first = p.moves[0];
      if (!ch.move({ from: first.slice(0, 2), to: first.slice(2, 4), promotion: first[4] })) continue;
      const fen = ch.fen(); const sol = p.moves.slice(1);
      const test = new Chess(fen); let valid = true;
      for (const u of sol) if (!test.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })) { valid = false; break; }
      if (!valid) continue;
      out.push({ id: p.id, l: L.lvl, r: p.r, t: p.t, f: fen, s: sol.join(' '), lm: first.slice(0, 4) });
      existingById.set(p.id, true);
      ok++;
    }
    const totalLvl = out.filter(x => x.l === L.lvl).length;
    console.log(`level ${L.lvl} (${L.min}-${L.max}): kept ${have} + added ${ok} = ${totalLvl}`);
  }
  fs.writeFileSync(OUT, '// Auto-generated from the Lichess puzzle database (CC0). See tools/build_puzzles.js\nwindow.PUZZLES = ' + JSON.stringify(out) + ';\n');
  console.log('wrote', out.length, 'puzzles ->', OUT, (fs.statSync(OUT).size / 1024).toFixed(0) + 'KB');
});
