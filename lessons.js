/* Chess Quest v2.2 - Structured Chess School Curriculum (Yusupov / Steps Method / Saint Louis Chess Club GM Syllabus)
   Every Minecraft Level (1–8) has a balanced Triad of 3 Mandatory Modules:
   1) 🏛️ Opening Variation & Theory
   2) ⚔️ Middlegame Tactics & Strategy
   3) ♚ Endgame Technique & Conversion
   Every module links to Saint Louis Chess Club GM lectures and requires a 3/3 Board + Theory Mastery Exam. */

window.LEVELS = [
  { n: 1, name: 'Wood Scout',            mc: 'Oak Plank Badge',     icon: '🪵', color: '#a16207', band: 'Lichess 700–1050 · OTB ~500–650',    minR: 700,  maxR: 1050, otbBase: 550,  goal: 'Master 1.e4 e5 fundamentals, stop hanging pieces (CCT + Forks/Pins), and convert K+Q / K+R checkmates.' },
  { n: 2, name: 'Stone Crafter',         mc: 'Cobblestone Pickaxe', icon: '⛏️', color: '#64748b', band: 'Lichess 1050–1250 · OTB ~650–750',   minR: 1050, maxR: 1250, otbBase: 680,  goal: 'Master the Italian Giuoco Piano (c3+d4), Discovered Attacks & Back-Rank safety, and King & Pawn Opposition.' },
  { n: 3, name: 'Iron Defender',         mc: 'Iron Chestplate',     icon: '🛡️', color: '#94a3b8', band: 'Lichess 1250–1450 · OTB ~750–850',   minR: 1250, maxR: 1450, otbBase: 780,  goal: 'Master the Two Knights / Fried Liver battles, Deflection & Removing the Guard, and Passed Pawn Square Rule.' },
  { n: 4, name: 'Gold Knight',           mc: 'Golden Sword',        icon: '⚔️', color: '#eab308', band: 'Lichess 1450–1625 · OTB ~850–1000',  minR: 1450, maxR: 1625, otbBase: 900,  goal: 'Master the London System & Outposts, 3-Move Candidate Move Orders, and Active Rook Endings (Tarrasch Rule & 7th Rank).' },
  { n: 5, name: 'Redstone Tactician',    mc: 'Redstone Circuit',    icon: '🔴', color: '#ef4444', band: 'Lichess 1625–1775 · OTB ~1000–1150', minR: 1625, maxR: 1775, otbBase: 1050, goal: 'Master the Caro-Kann & Queen\'s Gambit, Zwischenzug (In-Between Moves) & IQP Middlegames, and Knight vs Bishop Endings.' },
  { n: 6, name: 'Diamond Commander',     mc: 'Diamond Armor',       icon: '💎', color: '#38bdf8', band: 'Lichess 1775–1925 · OTB ~1150–1300', minR: 1775, maxR: 1925, otbBase: 1200, goal: 'Master the Ruy Lopez & Scotch Game, Classical Greek Gift Sacrifices (Bxh7+!), and Lucena & Philidor Rook Endgames.' },
  { n: 7, name: 'Obsidian Master',       mc: 'Enchanting Portal',   icon: '🟪', color: '#a855f7', band: 'Lichess 1925–2100 · OTB ~1300–1500', minR: 1925, maxR: 2100, otbBase: 1375, goal: 'Master Sicilian (Dragon/Najdorf) & French Defenses, Prophylaxis & Minority Attacks, and Pawn Breakthrough Sacrifices.' },
  { n: 8, name: 'Netherite Grandmaster', mc: 'Ender Dragon Slayer', icon: '🔥', color: '#f97316', band: 'Lichess 2100–2450+ · OTB ~1500+',    minR: 2100, maxR: 2450, otbBase: 1550, goal: 'Master King\'s Indian & Nimzo-Indian Systems, Quiet Moves in 4-5 Move Combinations, and Zugzwang & Triangulation.' },
];

const stl = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent('Saint Louis Chess Club ' + q);
const yt = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);

window.LESSONS = [
  // ==================== LEVEL 1: WOOD SCOUT ====================
  { id: 'l1-open', l: 1, cat: 'Opening', icon: '🏛️', title: '1.e4 e5 Classical Center & Defeating Early Queen Traps',
    why: 'Scholastic players constantly try Scholar\'s Mate (Qh5/Bc4) or early tricks. Knowing exact move-by-move refutations gives you a winning position by move 5.',
    ideas: [
      'Variation: 1.e4 e5 2.Qh5?! — NEVER play 2...g6?? (loses the e5-pawn and rook to Qxe5+!). Defend e5 first with 2...Nc6! 3.Bc4 g6! 4.Qf3 Nf6! developing with tempo.',
      'Golden Opening Triad: (1) Pawn in the center (e4/d4), (2) Knights before Bishops, (3) Castle by move 7.',
      'Center Fork Trick: if Black plays 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nxe4?? (or if White allows ...Nxe4), know how Nxe4 d5 works!'
    ],
    drill: 'Set up 1.e4 e5 2.Qh5 Nc6 3.Bc4 g6 4.Qf3 Nf6 on the board and play it from memory.',
    videos: [['STLCC GM Lecture: Opening Principles & Traps', stl('opening principles beginner traps')], ['STLCC: Defending Scholar\'s Mate', stl('how to defend scholars mate wayward queen')]],
    quiz: [
      { type: 'board', fen: 'rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2', side: 'b',
        prompt: 'White just played 2.Qh5?! attacking your e5-pawn. Play the exact theoretical move that defends e5 and develops a piece!',
        moves: ['b8c6'], explain: '2...Nc6! defends the e5-pawn cleanly (whereas 2...g6?? blunders 3.Qxe5+ winning the h8-Rook!).' },
      { type: 'board', fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3', side: 'b',
        prompt: 'Now White plays 3.Bc4 threatening 4.Qxf7# (Scholar\'s Mate). Play Black\'s best move that blocks the Queen\'s attack on f7 with tempo!',
        moves: ['g7g6'], explain: '3...g6! (now that e5 is protected by Nc6!) kicks the Queen back to f3, and 4...Nf6 stops mate completely.' },
      { type: 'mcq', q: 'Why do Grandmasters at the Saint Louis Chess Club teach "Knights before Bishops" in the opening?',
        opts: ['Knights have only one best central square (f3/c3 or f6/c6), while Bishops control diagonals even from home and wait to see the opponent\'s setup', 'Bishops are not allowed to move before move 5', 'Knights move faster than Bishops'], ans: 0,
        explain: 'Developing Knights to f3/c3 (f6/c6) is almost always right, whereas choosing the best diagonal for a Bishop depends on how the opponent places their pawns.' }
    ]
  },
  { id: 'l1-mid', l: 1, cat: 'Middlegame', icon: '⚔️', title: 'The CCT Blunder-Check, Forks & Pins',
    why: '90% of games under 800 OTB are decided by hanging pieces, Knight forks, and pins along open lines.',
    ideas: [
      'Before EVERY move ask: What are THEIR Checks, Captures, and Threats? Then ask the same for YOU.',
      'Royal Fork: a Knight jumping to c7 or f7 (or central squares) attacking King + Queen/Rook at once.',
      'Absolute Pin: pinning a Knight or Bishop to the enemy King — then piling up a pawn or second attacker on the pinned piece!'
    ],
    drill: 'Solve 5 Level-1 puzzles saying "Checks, Captures, Threats" before touching a piece.',
    videos: [['STLCC GM Lecture: Tactics — Forks, Pins & Skewers', stl('basic tactics forks pins skewers')], ['STLCC: Checks Captures Threats', stl('checks captures threats calculation')]],
    quiz: [
      { type: 'board', fen: 'r1bqkbnr/ppp2ppp/2np4/3Np3/4P3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 0 5', side: 'w',
        prompt: 'Find the winning Knight Fork that attacks Black\'s King and Rook at the same time!',
        moves: ['d5c7'], explain: 'Nxc7+! is a Royal/Family Fork — Black must move the King and loses the a8-Rook.' },
      { type: 'board', fen: '4k3/4n3/8/8/8/8/8/3R1K2 w - - 0 1', side: 'w',
        prompt: 'Pin Black\'s Knight on e7 to the Black King on e8 so it cannot legally move!',
        moves: ['d1e1'], explain: 'Re1! creates an Absolute Pin along the e-file.' },
      { type: 'mcq', q: 'Once you have pinned an enemy Knight to their King, what is the classical rule for winning it?',
        opts: ['"Put pressure on the pinned piece" — attack it again with a pawn or another piece rather than trading immediately!', 'Trade your Bishop for the Knight right away', 'Retreat your pinning piece'], ans: 0,
        explain: 'A pinned piece cannot run away, so bringing a pawn (like d4–d5 or e4–e5) wins it for just a pawn!' }
    ]
  },
  { id: 'l1-end', l: 1, cat: 'Endgame', icon: '♚', title: 'Fundamental Mates: King + Queen Box & King + Rook Ladder', drill_id: 'kqk',
    why: 'You must never accidentally stalemate a won game. Mastering the Knight-Distance Box makes K+Q mate effortless.',
    ideas: [
      'Queen Box Method: place your Queen a Knight\'s move away from the enemy King to shrink its box every turn.',
      'DANGER ZONE: The moment the lone King reaches the edge rank/file, FREEZE your Queen so you leave it 2 squares to shuffle (no stalemate!) and walk your King up.',
      'Rook Box / Cutoff: use your Rook to slice the board along a rank/file, then march your King into opposition.'
    ],
    drill: 'Open the Endgame Lab and checkmate with K+Q in under 15 moves and K+R in under 30 moves.',
    videos: [['STLCC GM Lecture: Basic Checkmates (K+Q & K+R)', stl('basic checkmates king and queen rook')]],
    quiz: [
      { type: 'board', fen: '3k4/8/3K4/8/8/8/6Q1/8 w - - 0 1', side: 'w',
        prompt: 'White\'s King is in opposition on d6 and Black\'s King is trapped on d8. Deliver checkmate in 1 move!',
        moves: ['g2g7', 'g2a8', 'g2b7', 'g2c6'], explain: 'Qg7# (or Qa8# / Qb7#) is checkmate! Your King on d6 guards c7, d7, and e7.' },
      { type: 'mcq', q: 'Black\'s lone King is in the corner on a8. If you move your Queen to c7 (a knight\'s move away from a8), what happens?',
        opts: ['Instant STALEMATE (Draw!) because the a8-King is not in check and has zero legal moves', 'Checkmate for White', 'Black loses on time'], ans: 0,
        explain: 'Never shrink the box to a 1-square corner with the Queen! Stop when the King is on the edge file/rank and bring your King.' },
      { type: 'mcq', q: 'In King + Rook vs King, when does the Rook deliver the checkmate blow along the edge rank?',
        opts: ['When the two Kings stand in Direct Opposition (facing each other with 1 square between them) so the enemy King cannot escape forward', 'On move 1 from the center', 'Without using your King at all'], ans: 0,
        explain: 'Your King acts as a wall covering the 3 escape squares on the 7th rank while your Rook checks along the 8th rank.' }
    ]
  },

  // ==================== LEVEL 2: STONE CRAFTER ====================
  { id: 'l2-open', l: 2, cat: 'Opening', icon: '🏛️', title: 'The Italian Game: Giuoco Piano (c3 + d4 Center Blast)',
    why: 'The Italian Game (1.e4 e5 2.Nf3 Nc6 3.Bc4) is the #1 classical opening taught in every Russian and Saint Louis Chess Club school.',
    ideas: [
      'Main Line Giuoco Piano: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3! Nf6 5.d4! exd4 6.cxd4 Bb4+!',
      'Why 4.c3? It builds a launchpad for 5.d4 so when Black captures 5...exd4, White recaptures 6.cxd4 with two side-by-side center pawns (e4 + d4)!',
      'After 6...Bb4+, White can play 7.Bd2 Bxd2+ 8.Nbxd2 (solid center) or the sharp Greco Gambit 7.Nc3!?'
    ],
    drill: 'Play the first 7 moves of the Giuoco Piano (1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2) on the board.',
    videos: [['STLCC GM Lecture: The Italian Game & Giuoco Piano', stl('italian game giuoco piano lecture')], ['STLCC: Classical 1.e4 e5 Openings', stl('italian game c3 d4')]],
    quiz: [
      { type: 'board', fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', side: 'w',
        prompt: 'Giuoco Piano (1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5): Play White\'s classical 4th move preparing to blast open the center with d4!',
        moves: ['c2c3'], explain: '4.c3! prepares 5.d4 so White can recapture cxd4 and own the entire center.' },
      { type: 'board', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5', side: 'w',
        prompt: 'Black just developed 4...Nf6. Now strike in the center and attack Black\'s c5-Bishop!',
        moves: ['d2d4'], explain: '5.d4! challenges e5 AND attacks the c5-Bishop with tempo!' },
      { type: 'mcq', q: 'In the Giuoco Piano after 5.d4 exd4 6.cxd4, what if Black retreats 6...Bf8 instead of giving check with 6...Bb4+?',
        opts: ['Black falls badly behind in development while White\'s e4+d4 pawns dominate the center!', 'Black wins a Queen', 'It is an immediate draw'], ans: 0,
        explain: '6...Bb4+! is Black\'s only move to keep balance by developing/trading with check.' }
    ]
  },
  { id: 'l2-mid', l: 2, cat: 'Middlegame', icon: '⚔️', title: 'Discovered Attacks, Double Check & Back-Rank Luft',
    why: 'Two-move tactics start with X-ray alignments (discovered attacks) and back-rank weaknesses.',
    ideas: [
      'Discovered Attack: move a piece out of the line of your Rook/Bishop/Queen while the moving piece makes its own threat.',
      'Double Check: when both the moving piece AND the uncovered piece check the King — the enemy King is FORCED to move!',
      'Back-Rank Mate & Luft: if f7-g7-h7 (or f2-g2-h2) are unmoved, a Rook on the 8th/1st rank is mate. Play h3/h6 ("Luft") to create an escape window.'
    ],
    drill: 'Solve 5 discovered-attack and back-rank mate puzzles.',
    videos: [['STLCC GM Lecture: Discovered Attacks & Double Checks', stl('discovered attacks double check tactics')], ['STLCC: Back Rank Mates', stl('back rank mate tactics')]],
    quiz: [
      { type: 'board', fen: 'rnb1kbnr/ppppqppp/8/4N3/4P3/8/PPPPQPPP/RNB1KB1R w KQkq - 2 4', side: 'w',
        prompt: 'Petrov\'s Defense Trap! White\'s Knight on e5 blocks the White Queen on e2 from hitting Black\'s Queen on e7. Unleash the winning discovered attack!',
        moves: ['e5c6'], explain: 'Nc6! attacks Black\'s Queen on e7 with the Knight AND uncovers the e2-Queen — Black loses the Queen!' },
      { type: 'board', fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', side: 'w',
        prompt: 'Black forgot to make luft (h6). Deliver back-rank checkmate in 1 move!',
        moves: ['d1d8'], explain: 'Rd8# is back-rank checkmate!' },
      { type: 'mcq', q: 'Why is a Double Check even deadlier than an ordinary check?',
        opts: ['Because it is impossible to block two lines or capture two checking pieces at once — the enemy King MUST move!', 'Because it gives you 10 extra points', 'Because pawns can jump backward'], ans: 0,
        explain: 'Even if both checking pieces are undefended, the opponent cannot capture either one during a double check!' }
    ]
  },
  { id: 'l2-end', l: 2, cat: 'Endgame', icon: '♚', title: 'King & Pawn Endings: Direct Opposition & 6th-Rank Key Squares',
    why: 'Every pawn endgame comes down to two questions: Is the King in front of the pawn, and who has the Opposition?',
    ideas: [
      'Direct Opposition: Kings face each other on the same file/rank with 1 square between them. The side NOT to move holds the opposition!',
      '1st Golden Rule: Always lead with your KING IN FRONT of your passed pawn (never push the pawn first!).',
      '2nd Golden Rule: Once your King stands on the 6th rank in front of your pawn (not a rook-pawn), it is a 100% WIN no matter whose turn it is!'
    ],
    drill: 'Practice King + Pawn vs King on Lichess Practice until you win 3 times in a row.',
    link: ['Lichess Practice: Pawn Endgames', 'https://lichess.org/practice'],
    videos: [['STLCC GM Lecture: King and Pawn Endgames — Opposition & Key Squares', stl('king and pawn endgame opposition key squares')]],
    quiz: [
      { type: 'board', fen: '4k3/8/8/3K4/4P3/8/8/8 w - - 0 1', side: 'w',
        prompt: 'White has Kd5 and Pe4 vs Black Ke8. Step your King IN FRONT of your pawn onto the 6th rank to seize the Direct Opposition!',
        moves: ['d5e6'], explain: '1.Ke6! puts the White King on the 6th-rank key square in direct opposition to Ke8 — a guaranteed win!' },
      { type: 'board', fen: '4k3/8/4P3/4K3/8/8/8/8 b - - 0 1', side: 'b',
        prompt: 'Now you are defending as Black! White made the mistake of pushing the pawn to e6 ahead of the King. Step your King into the ONLY square that keeps the draw!',
        fen: '3k4/8/4P3/4K3/8/8/8/8 b - - 0 1',
        moves: ['d8e8'], explain: '1...Ke8! steps directly in front of the pawn, preparing to take opposition when White plays Kf6 or Kd6 (1...Ke8 2.Kd6 Kd8! = Draw)!' },
      { type: 'mcq', q: 'Why does a Rook Pawn (a-pawn or h-pawn) often draw even when you are a full pawn ahead?',
        opts: ['Because the defending King gets trapped in the a8/h8 corner where any attempt to force it out results in STALEMATE!', 'Because rook pawns can only promote to knights', 'Because kings cannot step on the a-file'], ans: 0,
        explain: 'With a rook pawn, the edge of the board cuts off the attacking King\'s flanking squares, allowing the defender to hide in the corner for stalemate.' }
    ]
  },

  // ==================== LEVEL 3: IRON DEFENDER ====================
  { id: 'l3-open', l: 3, cat: 'Opening', icon: '🏛️', title: 'Two Knights Defense: The Fried Liver & Polerio Counterattack (5...Na5!)',
    why: 'At 700–1200 level, 4.Ng5 in the Two Knights happens in nearly half of all 1.e4 e5 games. You must know both sides cold!',
    ideas: [
      'Moves: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 (attacking f7 with Knight + Bishop!).',
      'Black\'s ONLY good move is 4...d5! 5.exd5 — and now DO NOT play 5...Nxd5?? (which allows the Fried Liver Sacrifice 6.Nxf7! Kxf7 7.Qf3+ Ke6 8.Nc3!).',
      'Instead, Black plays 5...Na5! (Polerio Defense), attacking the c4-Bishop and taking over the initiative for the sacrificed pawn!'
    ],
    drill: 'Play out both 5...Nxd5?? 6.Nxf7! (Fried Liver) and the GM refutation 5...Na5! 6.Bb5+ c6 on the board.',
    videos: [['STLCC GM Lecture: Two Knights Defense & Fried Liver Attack', stl('two knights defense fried liver attack')]],
    quiz: [
      { type: 'board', fen: 'r1bqk2r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 3 4', side: 'b',
        prompt: 'White just played 4.Ng5 attacking f7 twice. Play the ONLY theoretical move that blocks the c4-Bishop\'s diagonal!',
        moves: ['d7d5'], explain: '4...d5! intercepts the Bishop\'s diagonal to f7.' },
      { type: 'board', fen: 'r1bqkb1r/ppp2ppp/2n2n2/3pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5', side: 'b',
        prompt: 'After 4...d5 5.exd5, avoid the Fried Liver trap (5...Nxd5?? 6.Nxf7!) by playing Polerio\'s Grandmaster move attacking the c4-Bishop!',
        moves: ['c6a5'], explain: '5...Na5! hits the c4-Bishop with tempo and avoids 5...Nxd5?? 6.Nxf7! completely.' },
      { type: 'mcq', q: 'What happens if Black carelessly plays 5...Nxd5?? allowing White\'s Fried Liver Attack (6.Nxf7! Kxf7 7.Qf3+)?',
        opts: ['Black\'s King is dragged out to e6 (the only square that keeps guarding the d5-Knight!) where White attacks it with 8.Nc3', 'Black easily wins a piece with no danger', 'White is forced to resign'], ans: 0,
        explain: 'After 6.Nxf7! Kxf7 7.Qf3+ Ke6 8.Nc3, Black\'s King on e6 is caught in a raging storm in the center of the board.' }
    ]
  },
  { id: 'l3-mid', l: 3, cat: 'Middlegame', icon: '⚔️', title: 'Removing the Guard, Deflection & Overloaded Defenders',
    why: 'To break past 1000, you must look past "is that piece defended?" and ask "can I destroy its defender?"',
    ideas: [
      'Removing the Guard: capture or trade off the key defensive piece first, then grab the undefended prize.',
      'Deflection: lure a defending Queen or Rook away from a vital square with a check or sacrifice.',
      'Overloaded Piece: one enemy piece trying to guard TWO critical points at once — attack one so the other falls!'
    ],
    drill: 'Solve 5 deflection and removing-the-defender puzzles.',
    videos: [['STLCC GM Lecture: Deflection, Decoy & Removing the Defender', stl('removing the defender deflection overloaded piece')]],
    quiz: [
      { type: 'board', fen: '3r2k1/5ppp/5n2/6B1/8/8/5PPP/3R2K1 w - - 0 1', side: 'w',
        prompt: 'Black\'s Rook on d8 is defended by the Knight on f6. Remove the guard to win a piece (or deliver back-rank mate)!',
        moves: ['g5f6'], explain: '1.Bxf6! removes the guard of d8 — if Black plays 1...gxf6, 2.Rxd8# is checkmate!' },
      { type: 'mcq', q: 'Black\'s Queen on e7 is the ONLY piece defending both a back-rank mate on d8 AND a Bishop on b4. What tactical motif does White have?',
        opts: ['Overloaded Defender — capturing on b4 or checking on d8 forces the Queen to abandon one of its two duties!', 'Zugzwang', 'Stalemate'], ans: 0,
        explain: 'When one defender has two full-time jobs, forcing it to fulfill one job leaves the second target undefended.' },
      { type: 'mcq', q: 'Why does "Deflection" almost always use a CHECK or a QUEEN ATTACK?',
        opts: ['Because the move must be FORCING so the defender has no time to ignore it', 'Because quiet pawn moves on the edge always deflect queens', 'Because knights cannot capture'], ans: 0,
        explain: 'A deflection only works if the target piece is compelled to respond.' }
    ]
  },
  { id: 'l3-end', l: 3, cat: 'Endgame', icon: '♚', title: 'Passed Pawns: The Rule of the Square & Outside Passed Pawn',
    why: 'Grandmasters don\'t count "he goes there, I go there" in pawn races — they use the Rule of the Square in 1 second.',
    ideas: [
      'Rule of the Square: imagine a diagonal from the passed pawn to the promotion rank; form a square from that side.',
      'If the defending King can step into (or touch the edge of) that square on its turn, it catches the pawn; otherwise the pawn queens untouched!',
      'Outside Passed Pawn: a passed pawn far away on the wing (like an a-pawn) acts as a decoy — while the enemy King runs over to stop it, your King feasts on their kingside pawns!'
    ],
    drill: 'Test the Rule of the Square on 5 endgame positions.',
    videos: [['STLCC GM Lecture: Rule of the Square & Outside Passed Pawns', stl('rule of the square outside passed pawn endgame')]],
    quiz: [
      { type: 'board', fen: '8/8/8/P7/8/5k2/8/6K1 w - - 0 1', side: 'w',
        prompt: 'Use the Rule of the Square: Black\'s King on f3 is outside the square of White\'s a5-pawn! Push the passed pawn to win!',
        moves: ['a5a6'], explain: '1.a6! shrinks the square to a6–c6–c8–a8 — Black\'s King on f3 is miles outside and cannot stop promotion!' },
      { type: 'mcq', q: 'Why is an "Outside Passed Pawn" (e.g., White has an a-pawn while both players have f/g/h pawns) almost always winning in a King & Pawn endgame?',
        opts: ['It decoys the enemy King all the way to the a-file, allowing your King to capture all of their kingside pawns!', 'Because a-pawns are worth 3 points', 'Because the enemy King isn\'t allowed to cross the d-file'], ans: 0,
        explain: 'You trade your outside passed pawn for the opponent\'s King\'s time, then win the kingside pawn race.' },
      { type: 'mcq', q: 'When you have Connected Passed Pawns (like b5 and c5 side by side), how should you advance them?',
        opts: ['Side-by-side step by step so whenever one advances, the other protects it!', 'Push one all the way to the 8th rank while leaving the other behind on the 2nd rank', 'Never move them'], ans: 0,
        explain: 'Connected passed pawns are a rolling bulldozer when kept abreast on the 5th/6th ranks.' }
    ]
  },

  // ==================== LEVEL 4: GOLD KNIGHT ====================
  { id: 'l4-open', l: 4, cat: 'Opening', icon: '🏛️', title: 'The London System (1.d4 d5 2.Bf4) & Central Outposts',
    why: 'Played by World Champion Ding Liren and Magnus Carlsen, the London gives White an unbreakable pyramid and fierce kingside attack.',
    ideas: [
      'Move Order: 1.d4 d5 2.Bf4! Nf6 3.e3 c5 4.c3 Nc6 5.Nd2 (or 5.Nf3) e6 6.Bd3 Bd6 7.Bg3!',
      'Why 7.Bg3 instead of trading 7.Bxd6? If Black trades ...Bxg3, White recaptures hxg3! opening the h-file for White\'s Rook while keeping the d4-pyramid!',
      'The Pillsbury / London Knight Outpost: plant your Knight on e5 (supported by d4 + Bf4), follow with f4 and Qf3/Qh5!'
    ],
    drill: 'Set up the London Pyramid (c3-d4-e3, Bf4, Bd3, Nf3, Nd2, Ne5) on the board.',
    videos: [['STLCC GM Lecture: Mastering the London System', stl('london system chess opening lecture')], ['STLCC: Pillsbury Attack & Ne5 Outpost', stl('london system ne5 attack')]],
    quiz: [
      { type: 'board', fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2', side: 'w',
        prompt: 'After 1.d4 d5, play the defining move of the London System developing the dark-squared Bishop BEFORE playing e3!',
        moves: ['c1f4'], explain: '2.Bf4! develops the bishop outside the pawn chain before 3.e3.' },
      { type: 'board', fen: 'r1bqk2r/pp2pppp/2n2n2/2pp4/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R w KQkq - 2 6', side: 'w',
        prompt: 'White has built the London Pyramid (c3-d4-e3) and developed Bf4, Nf3, Nd2. Develop your light-squared Bishop to its ideal attacking diagonal eyeing h7!',
        moves: ['f1d3'], explain: '6.Bd3! controls the e4/h7 diagonal and prepares the Ne5 outpost.' },
      { type: 'mcq', q: 'In the London System, when Black challenges your f4-Bishop with ...Bd6, why do Grandmasters often drop back with Bg3 instead of trading Bishops on d6?',
        opts: ['Because if Black captures ...Bxg3, White recaptures hxg3! — strengthening the center and opening the h1-Rook\'s file against Black\'s King!', 'Because trading Bishops is illegal', 'Because g3 is closer to a1'], ans: 0,
        explain: 'Recapturing TOWARD the center (hxg3) gives White a semi-open h-file for free.' }
    ]
  },
  { id: 'l4-mid', l: 4, cat: 'Middlegame', icon: '⚔️', title: '3-Move Combinations: Candidate Moves & Reversing Move Order',
    why: 'The jump from 900 to 1200 OTB happens when you stop playing the first good-looking move and compare two candidate move orders.',
    ideas: [
      'Kotov\'s Candidate Moves: list 2–3 forcing candidates (Checks, Captures, Threats) before calculating deep.',
      'Move-Order Reversal: if "Move A then Move B" lets the opponent escape, test "Move B FIRST, then Move A"!',
      'Eliminate "Hope Chess": always calculate your opponent\'s BEST defensive reply on Move 2.'
    ],
    drill: 'Solve 5 Level-4 puzzles by writing or naming 2 candidate moves before moving.',
    videos: [['STLCC GM Lecture: Candidate Moves & Calculation Technique', stl('candidate moves calculation technique')]],
    quiz: [
      { type: 'board', fen: '3r2k1/5ppp/8/8/2Q5/8/5PPP/3R2K1 w - - 0 1', side: 'w',
        prompt: 'White has Qc4 and Rd1 vs Black Rd8 and Kg8. Calculate the forcing check that wins the Rook cleanly!',
        moves: ['d1d8'], explain: '1.Rxd8+! Qf8 2.Rxf8# — forcing checks leave Black zero time to save the position.' },
      { type: 'mcq', q: 'You spot a nice fork on Move 2 after a preliminary exchange, but in your first move order your opponent has an escape check. What calculation trick should you immediately try?',
        opts: ['Reverse the move order (play the second move FIRST, or insert a check first) and see if it eliminates their defense!', 'Play it anyway and hope they miss the check', 'Give up on the tactic'], ans: 0,
        explain: 'In 80% of tactical combinations where Idea A fails to a narrow defense, reversing the move order makes the combination work!' },
      { type: 'mcq', q: 'What is "Hope Chess" (as defined by NM Dan Heisman and STLCC coaches)?',
        opts: ['Making a move without checking what you will do if your opponent plays their strongest threat/reply next turn', 'Hoping to win a tournament', 'Playing 1.e4'], ans: 0,
        explain: 'Real chess calculates the opponent\'s best reply BEFORE you touch your piece.' }
    ]
  },
  { id: 'l4-end', l: 4, cat: 'Endgame', icon: '♚', title: 'Active Rook Endgames: Tarrasch\'s Rule & Rooks on the 7th Rank',
    why: 'Over 50% of tournament endgames are Rook endgames. Activity beats an extra pawn in Rook endings!',
    ideas: [
      'Tarrasch\'s Rule: ALWAYS place your Rook BEHIND passed pawns — both yours (to push it forward) and your opponent\'s (to win it as it advances)!',
      'Rook on the 7th Rank ("Pigs on the 7th"): a Rook on the 7th rank gobbles unmoved pawns and traps the enemy King on the back rank.',
      'Never play passive Rook defense if you can activate your Rook with counterplay!'
    ],
    drill: 'Solve 5 rook-endgame puzzles focusing on active Rooks and the 7th rank.',
    videos: [['STLCC GM Lecture: Rook Endgame Principles & Tarrasch\'s Rule', stl('rook endgame principles tarrasch rule 7th rank')]],
    quiz: [
      { type: 'board', fen: '6k1/p4ppp/8/8/8/8/5PPP/2R3K1 w - - 0 1', side: 'w',
        prompt: 'Actually let\'s look at this open-file position: Black\'s King is on g7 with pawns on a7, f7, g6, h7 and White\'s Rook is on c1. Invade the 7th rank to trap the King and attack Black\'s pawns!',
        fen: '8/p4pkp/6p1/8/8/8/5PPP/2R3K1 w - - 0 1',
        moves: ['c1c7'], explain: '1.Rc7! invades the 7th rank ("Rook on the 7th"), attacking both a7 and f7!' },
      { type: 'mcq', q: 'What is "Tarrasch\'s Rule" in Rook endgames?',
        opts: ['Rooks belong BEHIND passed pawns — whether the passed pawn is yours or your opponent\'s!', 'Rooks belong in front of your own passed pawn', 'Always trade Rooks when down a pawn'], ans: 0,
        explain: 'Behind a passed pawn, a Rook\'s scope increases with every square the pawn advances.' },
      { type: 'mcq', q: 'What nickname do Grandmasters give to TWO connected Rooks on the 7th rank?',
        opts: ['"Blind Swine / Pigs on the 7th" — because they devour every pawn on the 7th rank and force perpetual check or mate!', '"Twin Towers on the 1st"', '"Sleeping Knights"'], ans: 0,
        explain: 'Two Rooks on the 7th rank are nearly unstoppable, often worth a full extra piece.' }
    ]
  },

  // ==================== LEVEL 5: REDSTONE TACTICIAN ====================
  { id: 'l5-open', l: 5, cat: 'Opening', icon: '🏛️', title: 'Caro-Kann Defense (1.e4 c6) & Queen\'s Gambit Declined (1.d4 d5 2.c4 e6)',
    why: 'To dominate 1000–1400 tournaments, you need rock-solid, GM-approved weapon systems as Black and White.',
    ideas: [
      'Caro-Kann (1.e4 c6 2.d4 d5): Black challenges e4 while keeping the c8-Bishop\'s diagonal open!',
      'Caro-Kann Advance Variation (3.e5 Bf5! 4.Nf3 e6 5.Be2 c5!): Black develops the light-squared Bishop to f5 BEFORE playing ...e6, then attacks White\'s d4 base with ...c5 and ...Nc6/Qb6!',
      'Queen\'s Gambit Declined (1.d4 d5 2.c4 e6 3.Nc3 Nf6): Black holds the d5 center firmly and prepares ...Be7, ...O-O, and the freeing breaks ...c5 or ...Nbd7.'
    ],
    drill: 'Play out the Caro-Kann Advance (1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 c5) on the board.',
    videos: [['STLCC GM Lecture: The Caro-Kann Defense Complete Guide', stl('caro kann defense lecture')], ['STLCC GM Lecture: Queen\'s Gambit Explained', stl('queens gambit declined lecture')]],
    quiz: [
      { type: 'board', fen: 'rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3', side: 'b',
        prompt: 'Caro-Kann Advance Variation (1.e4 c6 2.d4 d5 3.e5): Play Black\'s signature theoretical move developing the c8-Bishop outside the pawn chain!',
        moves: ['c8f5'], explain: '3...Bf5! gets the light-squared Bishop to an active diagonal before Black plays 4...e6.' },
      { type: 'board', fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2', side: 'w',
        prompt: 'After 1.d4 d5, play Move 2 of the Queen\'s Gambit challenging Black\'s central d5-pawn!',
        moves: ['c2c4'], explain: '2.c4! is the Queen\'s Gambit — pressuring d5 to fight for central control.' },
      { type: 'mcq', q: 'In the Caro-Kann Advance (1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6), which pawn break does Black use to attack the base of White\'s d4–e5 pawn chain?',
        opts: ['...c5! (followed by ...Nc6 and ...Qb6 pressuring d4 and b2)', '...h5', '...a5'], ans: 0,
        explain: 'Nimzowitsch\'s rule: "Attack a pawn chain at its base!" Since d4 is the base supporting e5, Black strikes d4 with ...c5!' }
    ]
  },
  { id: 'l5-mid', l: 5, cat: 'Middlegame', icon: '⚔️', title: 'Zwischenzug (In-Between Moves) & Isolated Queen\'s Pawn (IQP) Plans',
    why: 'Redstone Tacticians break automatic recapture sequences with lethal intermediate checks and understand central pawn structures.',
    ideas: [
      'Zwischenzug ("In-Between Move"): instead of making an automatic recapture, insert a forcing check or Queen threat first — then recapture a full tempo or piece ahead!',
      'Isolated Queen\'s Pawn (IQP on d4): gives dynamic open c/e files, an e5 Knight outpost, and a d4–d5 break in the middlegame, but becomes a weak target in the endgame.',
      'Rule of IQP: If you HAVE the IQP, keep pieces on the board and attack the King (or break d4–d5); if you play AGAINST the IQP, blockade d5 with a Knight and trade pieces into an endgame!'
    ],
    drill: 'Solve 5 intermediate-move (intermezzo) puzzles.',
    videos: [['STLCC GM Lecture: Zwischenzug & In-Between Moves', stl('zwischenzug intermediate moves')], ['STLCC GM Lecture: Isolated Queen\'s Pawn (IQP)', stl('isolated queens pawn iqp middlegame')]],
    quiz: [
      { type: 'board', fen: '2r3k1/5ppp/8/3r4/3R4/8/5PPP/3R2K1 w - - 0 1', side: 'w',
        prompt: 'White\'s doubled Rooks on the d-file face Black\'s Rook on d5. Win material exploiting the back-rank pin/intermediate threat!',
        moves: ['d4d5'], explain: '1.Rxd5! wins a full Rook because if Black recaptures 1...Rxd5??, 2.Rd8# is back-rank checkmate!' },
      { type: 'mcq', q: 'Your opponent has an Isolated Queen\'s Pawn (IQP) on d4 (no c-pawn or e-pawn beside it). What is the classic positional strategy against it?',
        opts: ['Blockade the square directly IN FRONT of it (put a Knight on d5!) so it cannot advance, then trade minor pieces and Queens to attack d4 in the endgame', 'Ignore the center and push your h-pawn', 'Let them push d4–d5 for free'], ans: 0,
        explain: 'A Knight on d5 cannot be driven away by pawns and paralyzes the IQP while you simplify into a winning endgame.' },
      { type: 'mcq', q: 'Why do strong players miss "Zwischenzug" in calculation?',
        opts: ['Because the human brain automatically assumes "if I capture their piece, they MUST recapture immediately" instead of checking for intermediate checks or Queen threats!', 'Because Zwischenzug is only allowed in blitz', 'Because pawns cannot give check'], ans: 0,
        explain: 'Always ask after every capture in your calculation: "What if they insert a check or threat BEFORE recapturing?"' }
    ]
  },
  { id: 'l5-end', l: 5, cat: 'Endgame', icon: '♚', title: 'Minor Piece Endgames: Good Knight vs Bad Bishop & Color Complexes',
    why: 'Knowing when a Bishop beats a Knight (and when a Knight dominates a "Bad Bishop") guides every middlegame trade.',
    ideas: [
      'When Bishops Are Better: open positions with pawns on BOTH sides of the board (long-range Bishops race from queenside to kingside in 1 move!).',
      'Bad Bishop: a Bishop trapped behind its OWN pawns fixed on the same color squares.',
      'Good Knight vs Bad Bishop: fix your opponent\'s central pawns on the color of their Bishop, then plant your Knight on an unassailable outpost on the opposite color!'
    ],
    drill: 'In your next game review, identify which player had the better minor piece entering the endgame.',
    videos: [['STLCC GM Lecture: Good Knight vs Bad Bishop Endgames', stl('good knight vs bad bishop endgame')]],
    quiz: [
      { type: 'board', fen: '8/8/3k4/2p1p3/2P1P3/3B4/3K4/8 w - - 0 1', side: 'w',
        prompt: 'Look at this endgame position where Black\'s King is on e7 and Knight on f6, and White has a Bishop on c4 and passed pawn on a5: wait — here White\'s King is on d2, Bishop on d3. Centralize your King to e3 to support your position!',
        moves: ['d2e3'], explain: '1.Ke3! centralizes the King actively in the minor-piece endgame.' },
      { type: 'mcq', q: 'What makes a Bishop a "Bad Bishop"?',
        opts: ['Its own central pawns are locked on the SAME color squares as the Bishop, blocking its diagonals!', 'It is on the queenside', 'It is a light-squared bishop'], ans: 0,
        explain: 'Capablanca\'s Rule: If you have a Bishop, put your pawns on the OPPOSITE color of your Bishop so its diagonals stay wide open!' },
      { type: 'mcq', q: 'Why are Opposite-Colored Bishop endgames (e.g., White has a light-squared Bishop, Black has a dark-squared Bishop) famous for being drawn even 1 or 2 pawns down?',
        opts: ['Because the defending Bishop can blockade the pawns on its color squares and the attacking Bishop can NEVER attack or challenge it!', 'Because Bishops cannot capture pawns', 'Because the 50-move rule starts at move 10'], ans: 0,
        explain: 'With opposite-colored Bishops, the defender builds an unbreakable fortress on the squares the attacker\'s Bishop cannot touch.' }
    ]
  },

  // ==================== LEVEL 6: DIAMOND COMMANDER ====================
  { id: 'l6-open', l: 6, cat: 'Opening', icon: '🏛️', title: 'The Ruy Lopez (Spanish Game: 3.Bb5) & Scotch Game (3.d4)',
    why: 'The Ruy Lopez is the cornerstone of World Championship chess — teaching deep strategic pressure and central control.',
    ideas: [
      'Ruy Lopez Main Line: 1.e4 e5 2.Nf3 Nc6 3.Bb5! a6 (Morphy Defense) 4.Ba4 Nf6 5.O-O Be7 6.Re1! b5 7.Bb3 d6 8.c3 O-O 9.h3!',
      'Why doesn\'t 4.Bxc6 dxc6 5.Nxe5 win a pawn right away? Because 5...Qd4! forks the e5-Knight and e4-pawn, regaining the pawn with the Bishop pair!',
      'Why 6.Re1? Once White defends e4 with Re1, White NOW threatens Bxc6 + Nxe5 for real — forcing Black to play 6...b5 7.Bb3!'
    ],
    drill: 'Play out the first 9 moves of the Closed Ruy Lopez (1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3).',
    videos: [['STLCC GM Lecture: Understanding the Ruy Lopez', stl('ruy lopez spanish game lecture')], ['STLCC GM Lecture: The Scotch Game', stl('scotch game opening lecture')]],
    quiz: [
      { type: 'board', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', side: 'w',
        prompt: 'Play Move 3 of the Ruy Lopez (Spanish Game), pressuring the c6-Knight that defends e5!',
        moves: ['f1b5'], explain: '3.Bb5! is the Ruy Lopez — putting long-term strategic pressure on Black\'s center.' },
      { type: 'board', fen: 'r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4', side: 'w',
        prompt: 'In the Exchange Trap after 3...a6 4.Bxc6 dxc6, if White greedily plays 5.Nxe5?!, what is Black\'s double-attack move that wins the pawn right back?',
        fen: 'r1bqkbnr/1pp2ppp/p1p5/4N3/4P3/8/PPPP1PPP/RNBQK2R b KQkq - 0 5', side: 'b',
        moves: ['d8d4'], explain: '5...Qd4! forks the e5-Knight and the e4-pawn, recovering the pawn with a great game for Black!' },
      { type: 'mcq', q: 'In the Closed Ruy Lopez (1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6), why does White play 8.c3 and 9.h3?',
        opts: ['8.c3 prepares the central break d2–d4 (and gives the b3-Bishop a retreat on c2), while 9.h3 stops ...Bg4 from pinning the f3-Knight that guards d4!', 'To stall for a draw', 'To move the King to a2'], ans: 0,
        explain: 'Every move in the Closed Ruy Lopez revolves around preparing the powerful central break d2–d4 without allowing ...Bg4.' }
    ]
  },
  { id: 'l6-mid', l: 6, cat: 'Middlegame', icon: '⚔️', title: 'Classical King Attacks: The Greek Gift Sacrifice (Bxh7+!)',
    why: 'Knowing the exact checklist for Bxh7+! lets you spot and execute a winning Bishop sacrifice in seconds.',
    ideas: [
      'The 4 Checklist Conditions for 1.Bxh7+! Kxh7 2.Ng5+:',
      '1. Your Bishop eyes h7, your Knight can jump to g5 with check, and your Queen can reach h5.',
      '2. Black has NO Knight on f6 (and no Bishop/Queen guarding h7 or h5).',
      '3. After 1.Bxh7+ Kxh7 2.Ng5+ Kg8, play 3.Qh5! threatening Qh7# (and if 2...Kg6, play 3.Qg4! or 3.h4!).'
    ],
    drill: 'Set up the Greek Gift and practice Black\'s three King retreats (...Kg8, ...Kg6, ...Kh6/Kh8).',
    videos: [['STLCC GM Lecture: The Greek Gift Sacrifice (Bxh7+)', stl('greek gift sacrifice bxh7 lecture')]],
    quiz: [
      { type: 'board', fen: 'r1bq1rk1/ppp2ppp/2nb4/3p4/3P4/3B1N2/PPP2PPP/RNBQK2R w KQ - 0 7', side: 'w',
        prompt: 'Black castled into the Greek Gift (no Knight on f6, White has Bd3 + Nf3 + Qd1)! Launch the classical Bishop sacrifice!',
        moves: ['d3h7'], explain: '1.Bxh7+! Kxh7 2.Ng5+ followed by 3.Qh5 rips open Black\'s castled King!' },
      { type: 'board', fen: 'r1bq1rk1/ppp2pp1/2nb4/3p2N1/3P4/8/PPP2PPP/RNBQK2R w KQ - 1 8', side: 'w',
        prompt: 'After 1.Bxh7+ Kxh7 2.Ng5+ Kg8, play White\'s essential 3rd move bringing the Queen into the mating net!',
        moves: ['d1h5'], explain: '3.Qh5! threatens 4.Qh7# and forces Black to give up decisive material (after 3...Re8 4.Qxf7+ Kh8 5.Qh5+ Kg8 6.Qh7+ Kf8 7.Qh8+).' },
      { type: 'mcq', q: 'Why do the French Defense, Caro-Kann, and London System produce so many Greek Gift (Bxh7+) sacrifices?',
        opts: ['Because a White pawn on e5 (or d4/e5 wedge) blocks Black\'s Knight from reaching f6 and blocks Black\'s pieces from defending the kingside!', 'Because Bishops get 2 moves per turn in the French Defense', 'Because h7 is worth 5 points'], ans: 0,
        explain: 'An e5-pawn acts as a wedge keeping Black\'s Knight out of f6 — depriving the Black King of its #1 defender.' }
    ]
  },
  { id: 'l6-end', l: 6, cat: 'Endgame', icon: '♚', title: 'Theoretical Rook Endings: Lucena ("Building a Bridge") & Philidor',
    why: 'Lucena (how to win) and Philidor (how to draw) are the two most famous endgame positions in all of chess theory.',
    ideas: [
      'Lucena Position (100% WIN): Your pawn is on the 7th rank with your King in front of it, and the enemy King is cut off. Step 1: Move your Rook to the 4th rank! Step 2: Walk your King out in a zig-zag until your Rook slides over on the 4th rank to block ("build a bridge" against) checks!',
      'Philidor Position (100% DRAW): When defending against King + Pawn, put your Rook on the 3rd/6th rank to prevent the enemy King from stepping to the 6th rank. The moment they push the pawn to the 6th rank, drop your Rook to the 1st/8th rank and check from behind forever!'
    ],
    drill: 'Practice both the Lucena Bridge and Philidor 3rd-Rank Defense on Lichess Practice.',
    link: ['Lichess Practice: Rook Endgames', 'https://lichess.org/practice'],
    videos: [['STLCC GM Lecture: Lucena & Philidor Rook Endgames', stl('lucena philidor rook endgame lecture')]],
    quiz: [
      { type: 'board', fen: '1K6/1P1k4/8/8/8/8/1r6/2R5 w - - 0 1', side: 'w',
        prompt: 'Lucena Position! White\'s King is trapped in front of the b7-pawn on b8. Play Step 1 of "Building a Bridge" by placing your Rook on the 4th rank!',
        moves: ['c1c4'], explain: '1.Rc4! ("Building a Bridge") prepares 2.Ka7 Rb1 3.Ka6 Rb2 4.Ka5 Rb1 5.Rb4! blocking the checks and queening the b7-pawn!' },
      { type: 'board', fen: '4k3/8/8/4KP2/8/8/8/R6r b - - 0 1', side: 'b',
        prompt: 'Philidor Defense! White has Ke5 + Pf5 and wants to step the King to e6/f6. Place Black\'s Rook on the 6th rank ("3rd-rank defense") to bar White\'s King from advancing!',
        moves: ['h1h6'], explain: '1...Rh6! (the Philidor 3rd-Rank Barrier) stops White\'s King from crossing to the 6th rank; as soon as White pushes 2.f6, Black drops 2...Rh1! checking from behind for an easy draw!' },
      { type: 'mcq', q: 'In the Philidor Position, what happens if the defender drops the Rook to the back rank TOO EARLY (before the attacker pushes their pawn to the 6th rank)?',
        opts: ['The attacking King steps onto the 6th rank in front of the pawn, shelters from checks, and turns the position into a winning Lucena!', 'It is still an easy draw', 'The Rook promotes'], ans: 0,
        explain: 'Wait on the 6th rank until the pawn advances to the 6th rank (stealing its own King\'s shelter square), THEN go to the back rank!' }
    ]
  },

  // ==================== LEVEL 7: OBSIDIAN MASTER ====================
  { id: 'l7-open', l: 7, cat: 'Opening', icon: '🏛️', title: 'The Open Sicilian (Dragon & Najdorf) & French Defense Structures',
    why: 'At 1400–1800 level, sharp asymmetrical battles like the Sicilian Defense (1.e4 c5) and French Defense (1.e4 e6) take center stage.',
    ideas: [
      'Open Sicilian: 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 — Black trades the c5 wing pawn for White\'s d4 center pawn, gaining a 2-vs-1 central pawn majority and the semi-open c-file!',
      'Sicilian Dragon (5...g6) vs Yugoslav Attack (6.Be3 Bg7 7.f3 O-O 8.Qd2 Nc6 9.Bc4 / O-O-O): opposite-side castling race where White plays Bh6 + h4–h5 and Black counterattacks down the c-file (...Rc8, ...Ne5–c4)!',
      'Sicilian Najdorf (5...a6): controls b5, prepares ...e5 (or ...e6) and ...b5 expansion.'
    ],
    drill: 'Play out the first 8 moves of the Sicilian Yugoslav Attack and Najdorf.',
    videos: [['STLCC GM Lecture: Mastering the Sicilian Defense (Dragon & Najdorf)', stl('sicilian defense dragon najdorf lecture')], ['STLCC GM Lecture: French Defense Guide', stl('french defense pawn structure lecture')]],
    quiz: [
      { type: 'board', fen: 'rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3', side: 'b',
        prompt: 'Open Sicilian (1.e4 c5 2.Nf3 d6 3.d4): Trade your wing c5-pawn for White\'s central d4-pawn!',
        moves: ['c5d4'], explain: '3...cxd4! 4.Nxd4 Nf6 5.Nc3 reaches the main tabiya of the Open Sicilian, giving Black the semi-open c-file.' },
      { type: 'board', fen: 'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5', side: 'b',
        prompt: 'After 4.Nxd4 Nf6 5.Nc3, play Move 5 of the famous Sicilian Najdorf Variation!',
        moves: ['a7a6'], explain: '5...a6! is the Sicilian Najdorf (Bobby Fischer & Garry Kasparov\'s favorite weapon), stopping Bb5/Nb5 and preparing ...e5 and ...b5.' },
      { type: 'mcq', q: 'In the Sicilian Dragon Yugoslav Attack (where White castles queenside O-O-O and Black castles kingside O-O), what is White\'s standard plan to remove Black\'s strong fianchettoed g7-Bishop?',
        opts: ['The battery Be3 + Qd2 followed by Bh6! forcing the trade of dark-squared Bishops while h4–h5 rips open the h-file', 'Trading Queens on move 6', 'Pushing a2–a4'], ans: 0,
        explain: 'Be3 + Qd2 + Bh6 trades off the Dragon Bishop (Black\'s best kingside defender) while h4–h5–hxg6 opens the h-file for White\'s Rook.' }
    ]
  },
  { id: 'l7-mid', l: 7, cat: 'Middlegame', icon: '⚔️', title: 'Prophylaxis (Karpov/Petrosian Method) & The Minority Attack',
    why: 'Obsidian Masters crush opponents before tactics even start by suffocating counterplay and creating permanent pawn weaknesses.',
    ideas: [
      'Prophylaxis: before pursuing your own plan, ask "If my opponent had a free move right now, what is their dream move?" — and stop it first!',
      'Carlsbad Structure Minority Attack: when White has a+b pawns vs Black\'s a+b+c queenside pawns (common in the QGD Exchange), White pushes b2–b4–b5! to trade off pawns and leave Black with a permanently weak backward/isolated c6-pawn!',
      'Positional Exchange Sacrifice: giving up a Rook for a dominant Knight/Bishop + pawn (like Petrosian & Kasparov\'s ...Rxc3! in the Sicilian) to shatter the opponent\'s pawn structure.'
    ],
    drill: 'In your next rapid game, write down the opponent\'s primary plan and one prophylactic move you played to stop it.',
    videos: [['STLCC GM Lecture: Prophylactic Thinking (Karpov & Petrosian)', stl('prophylaxis karpov petrosian positional play')], ['STLCC GM Lecture: The Minority Attack', stl('minority attack carlsbad structure')]],
    quiz: [
      { type: 'board', fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7', side: 'w',
        prompt: 'Black wants to play ...Bg4 pinning your f3-Knight to your Queen. Play the classic prophylactic move that prevents ...Bg4!',
        moves: ['h2h3'], explain: 'h3! stops ...Bg4 before it happens and gives the King luft.' },
      { type: 'mcq', q: 'What is the "Minority Attack" in the Queen\'s Gambit Declined Exchange (Carlsbad pawn structure)?',
        opts: ['Advancing your 2 queenside pawns (a+b via b4–b5!) against the opponent\'s 3 queenside pawns (a+b+c) to leave them with a chronic weak pawn on c6 or d5', 'Attacking the King with only 1 pawn', 'Sacrificing both Knights on move 5'], ans: 0,
        explain: 'By pushing b4–b5 and trading bxc6, Black\'s remaining c6-pawn sits on an open c-file where White\'s Rooks pile up on it.' },
      { type: 'mcq', q: 'When you are winning a game (up a clean piece or two pawns), why is Prophylaxis your #1 tool?',
        opts: ['Because your opponent can only come back via tactical chaos; shutting down their counterplay guarantees a clean technical win', 'Because prophylaxis doubles your clock time', 'Because pawns move sideways'], ans: 0,
        explain: 'When ahead, ask "What is my opponent\'s ONLY trick or counterplay?" and extinguish it.' }
    ]
  },
  { id: 'l7-end', l: 7, cat: 'Endgame', icon: '♚', title: 'Pawn Breakthrough Sacrifices & Distant Opposition',
    why: 'A seemingly locked 3-vs-3 pawn chain can produce a forced Queen in 3 moves with a pawn breakthrough sacrifice!',
    ideas: [
      '3-vs-3 Pawn Breakthrough (f5-g5-h5 vs f7-g7-h7): push the MIDDLE pawn first (1.g6!)',
      'If Black plays 1...fxg6, push the OPPOSITE pawn (2.h6! gxh6 3.f6!) and the f-pawn queens!',
      'If Black plays 1...hxg6, push 2.f6! gxf6 3.h6! and the h-pawn queens!'
    ],
    drill: 'Set up White pawns on f5, g5, h5 vs Black pawns on f7, g7, h7 and execute 1.g6! against both recaptures.',
    videos: [['STLCC GM Lecture: Pawn Breakthroughs & Distant Opposition', stl('pawn breakthrough endgame distant opposition')]],
    quiz: [
      { type: 'board', fen: '8/5ppp/8/5PPP/8/8/k7/7K w - - 0 1', side: 'w',
        prompt: 'Classic 3-vs-3 Pawn Breakthrough! White\'s pawns on f5, g5, h5 face Black\'s pawns on f7, g7, h7. Play the winning breakthrough sacrifice!',
        moves: ['g5g6'], explain: '1.g6!! wins on the spot! If 1...fxg6 2.h6! gxh6 3.f6! queens; if 1...hxg6 2.f6! gxf6 3.h6! queens!' },
      { type: 'board', fen: '8/6pp/6p1/5P1P/8/8/k7/7K w - - 0 2', side: 'w',
        prompt: 'Black captured 1...fxg6. Now play the second sacrifice on the OTHER wing so the f-pawn breaks through to queen!',
        moves: ['h5h6'], explain: '2.h6!! deflects the g7-pawn (2...gxh6 3.f6!) creating an unstoppable passed pawn!' },
      { type: 'mcq', q: 'What is "Distant Opposition" in King & Pawn endgames?',
        opts: ['When the two Kings stand on the same file or rank separated by an ODD number of squares (3 or 5 squares apart, same color squares) — acting as long-range opposition until they meet!', 'When Kings are on opposite corners of the board', 'When both players have Queens'], ans: 0,
        explain: 'Rule of Odd Squares: Same file/rank + 1, 3, or 5 squares between the Kings = Opposition!' }
    ]
  },

  // ==================== LEVEL 8: NETHERITE GRANDMASTER ====================
  { id: 'l8-open', l: 8, cat: 'Opening', icon: '🏛️', title: 'Indian Defenses: King\'s Indian (Mar del Plata) & Nimzo-Indian (3...Bb4)',
    why: 'World Champions Garry Kasparov, Bobby Fischer, and Mikhail Tal used the King\'s Indian and Nimzo-Indian to create legendary wins.',
    ideas: [
      'King\'s Indian Defense (1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5!): Black lets White build a big center, locks it with 7.O-O Nc6 8.d5 Ne7, and launches a blistering kingside pawn storm (...Ne8/Nd7, ...f5!, ...g5–g4, ...Rf6–h6)!',
      'Meanwhile White attacks on the queenside (c4–c5! targeting the d6 base of Black\'s pawn chain).',
      'Nimzo-Indian Defense (1.d4 Nf6 2.c4 e6 3.Nc3 Bb4!): pins the c3-Knight to prevent 4.e4 and fights for the e4 square with piece pressure.'
    ],
    drill: 'Play out the King\'s Indian Classical line through 8.d5 Ne7 and study both wings\' pawn breaks (White c5 vs Black ...f5).',
    videos: [['STLCC GM Lecture: The King\'s Indian Defense Masterclass', stl('kings indian defense lecture')], ['STLCC GM Lecture: The Nimzo-Indian Defense', stl('nimzo indian defense lecture')]],
    quiz: [
      { type: 'board', fen: 'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R b KQkq - 3 6', side: 'b',
        prompt: 'King\'s Indian Classical (1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2): Play Black\'s central strike challenging d4!',
        moves: ['e7e5'], explain: '6...e5! challenges White\'s d4 center; after 7.O-O Nc6 8.d5 Ne7, the famous Mar del Plata race begins!' },
      { type: 'board', fen: 'rnbqkbnr/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 2 3', side: 'b',
        prompt: 'Now after 1.d4 Nf6 2.c4 e6 3.Nc3, play Move 3 of Nimzowitsch\'s famous Nimzo-Indian Defense!',
        moves: ['f8b4'], explain: '3...Bb4! pins the c3-Knight, stopping White from playing 4.e4.' },
      { type: 'mcq', q: 'In the King\'s Indian Defense after the center locks with White\'s d4–d5 (White pawn chain c4-d5-e4 vs Black c7-d6-e5), where do the two sides attack?',
        opts: ['Attack in the direction your pawn chain points: White attacks on the QUEENSIDE (c4–c5!), while Black attacks on the KINGSIDE (...f5! and ...g5–g4!)', 'Both players only move their Kings', 'White attacks on the h-file and Black on the a-file'], ans: 0,
        explain: 'Pawn Chain Rule: Your pawn chain points toward the wing where you have more space — White\'s c4–d5 points queenside; Black\'s d6–e5 points kingside!' }
    ]
  },
  { id: 'l8-mid', l: 8, cat: 'Middlegame', icon: '⚔️', title: 'Netherite Calculation: Quiet Moves in Combinations & Clearance Sacrifices',
    why: 'At 2000+ level, the hardest moves to spot in a 4-move combination are non-checking, non-capturing "quiet moves" and square-clearance sacrifices.',
    ideas: [
      'Quiet Move in a Combination: after an initial sacrifice or check, playing a silent move (like sliding a Rook lift or stepping a King/Pawn) that creates an unstoppable mate threat.',
      'Clearance Sacrifice: sacrificing one of your OWN pieces simply because it is standing on a square or line that a stronger piece (Queen or Rook) needs to use!',
      'Visualize the final position clearly in your head before calculating side branches.'
    ],
    drill: 'Solve 5 Level-8 (2100+ Lichess) puzzles.',
    videos: [['STLCC GM Lecture: Quiet Moves in Tactical Combinations', stl('quiet moves combinations calculation')], ['STLCC GM Lecture: Clearance Sacrifices', stl('clearance sacrifice chess lecture')]],
    quiz: [
      { type: 'board', fen: '6k1/5ppp/8/8/8/5Q2/5PPP/4R1K1 w - - 0 1', side: 'w',
        prompt: 'Execute the forcing clearance/deflection strike on e8 to finish the game!',
        moves: ['e1e8'], explain: '1.Re8# is checkmate!' },
      { type: 'mcq', q: 'What is a "Clearance Sacrifice"?',
        opts: ['Sacrificing your own piece with tempo solely to vacate a critical square, file, or diagonal for another one of your pieces!', 'Trading all pawns', 'Moving your King to the back rank'], ans: 0,
        explain: 'Sometimes your own piece is blocking your winning checkmate square or diagonal — sacrificing it with check clears the path!' },
      { type: 'mcq', q: 'Why are "Quiet Moves" on move 2 or 3 of a combination the hardest moves for human players to see?',
        opts: ['Because our tactical radar naturally stops when checks and captures run out, missing silent moves that set up an unavoidable mate net on the next turn', 'Because quiet moves are against FIDE rules', 'Because knights cannot make quiet moves'], ans: 0,
        explain: 'When a forcing check sequence seems to stop one move short of mate, ask: "Is there a quiet move that leaves the opponent helpless?"' }
    ]
  },
  { id: 'l8-end', l: 8, cat: 'Endgame', icon: '♚', title: 'Grandmaster Endgame Technique: Zugzwang & Triangulation',
    why: 'The pinnacle of endgame mastery is forcing your opponent to destroy their own position because it is their turn to move.',
    ideas: [
      'Zugzwang ("Compulsion to Move"): a position where the player on move would gladly pass their turn because EVERY legal move loses material or allows promotion.',
      'Triangulation: when your King has 3 squares arranged in a triangle and the enemy King only has 2 squares to oscillate between, take 3 moves with your King so you reach the EXACT same position with your opponent to move!',
      'Corresponding Squares: map out which square your King must step to whenever the enemy King steps to its defensive square.'
    ],
    drill: 'Practice a King Triangulation position on the board until you can transfer the move to the opponent every time.',
    videos: [['STLCC GM Lecture: Zugzwang, Triangulation & Corresponding Squares', stl('zugzwang triangulation endgame lecture')]],
    quiz: [
      { type: 'board', fen: '7k/5K2/8/6Q1/8/8/8/8 w - - 0 1', side: 'w',
        prompt: 'Deliver the final blow in 1 move!',
        moves: ['g5g7', 'g5h6'], explain: 'Qg7# / Qh6# completes the net!' },
      { type: 'mcq', q: 'In a King & Pawn endgame, you reach the critical position when it is YOUR turn, and you realize that if it were your OPPONENT\'S turn in this exact same position, they would be in Zugzwang and lose. What technique do you use?',
        opts: ['Triangulation — maneuver your King in a 3-move triangle while the enemy King only has 2 squares to shuffle back and forth, handing the move back to them!', 'Resign immediately', 'Push all your pawns blindly'], ans: 0,
        explain: 'Because 3 (odd) vs 2 (even) changes the parity of whose turn it is, Triangulation transfers the move to your opponent!' },
      { type: 'mcq', q: 'Why is it impossible to Triangulate with a Knight?',
        opts: ['Because a Knight changes the color of its square on EVERY move — it can never take an odd number of moves (3) to return to the exact same square!', 'Because Knights are too slow', 'Because Knights can jump over pawns'], ans: 0,
        explain: 'Mathematical fact of the chessboard: a Knight always alternates light-dark-light-dark, so returning to the same square ALWAYS takes an even number of moves!' }
    ]
  },
];

window.RECOMMENDED = [
  ['🏛️ Saint Louis Chess Club - Official GM Lectures & Kids Class (YouTube)', 'https://www.youtube.com/@STLChessClub'],
  ['🏛️ STLCC: GM Yasser Seirawan — Opening, Middlegame & Endgame Lectures', stl('Yasser Seirawan lecture')],
  ['🏛️ STLCC: GM Ben Finegold — Scholastic & U1400 Class Series', stl('Ben Finegold kids class u1400')],
  ['🏛️ STLCC: IM Eric Rosen & GM Alejandro Ramirez — Openings & Tactics', stl('Eric Rosen opening traps endgame')],
  ['📚 Daniel Naroditsky - Speedrun & Endgame Theory Series', yt('Daniel Naroditsky speedrun endgame theory')],
  ['♟️ Lichess Practice (Interactive Checkmates, Tactics & Endgames)', 'https://lichess.org/practice'],
];
