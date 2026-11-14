/* Chess Quest v2 - Minecraft Mastery Tiers + Foundational Theory Curriculum + Mandatory Mastery Quizzes (Board + Theory Tests) */
window.LEVELS = [
  { n: 1, name: 'Wood Scout',            mc: 'Oak Plank Badge',     icon: '🪵', color: '#a16207', band: 'Lichess 700–1050 · OTB ~500–650',   minR: 700,  maxR: 1050, otbBase: 550,  goal: 'Stop hanging pieces. Spot 1-move forks, pins, and checkmates.' },
  { n: 2, name: 'Stone Crafter',         mc: 'Cobblestone Pickaxe', icon: '⛏️', color: '#64748b', band: 'Lichess 1050–1250 · OTB ~650–750',  minR: 1050, maxR: 1250, otbBase: 680,  goal: 'Opening principles, back-rank safety, 2-move tactics, basic King & Pawn endings.' },
  { n: 3, name: 'Iron Defender',         mc: 'Iron Chestplate',     icon: '🛡️', color: '#94a3b8', band: 'Lichess 1250–1450 · OTB ~750–850',  minR: 1250, maxR: 1450, otbBase: 780,  goal: 'Remove defenders, discovered attacks, clock discipline, active rook endings.' },
  { n: 4, name: 'Gold Knight',           mc: 'Golden Sword',        icon: '⚔️', color: '#eab308', band: 'Lichess 1450–1625 · OTB ~850–1000', minR: 1450, maxR: 1625, otbBase: 900,  goal: '3-move combinations, Italian & London opening lines, converting advantages cleanly.' },
  { n: 5, name: 'Redstone Tactician',    mc: 'Redstone Circuit',    icon: '🔴', color: '#ef4444', band: 'Lichess 1625–1775 · OTB ~1000–1150',minR: 1625, maxR: 1775, otbBase: 1050, goal: 'Zwischenzug (in-between moves), Caro-Kann & Queen\'s Gambit theory, deflection sacrifices.' },
  { n: 6, name: 'Diamond Commander',     mc: 'Diamond Armor',       icon: '💎', color: '#38bdf8', band: 'Lichess 1775–1925 · OTB ~1150–1300',minR: 1775, maxR: 1925, otbBase: 1200, goal: 'Lucena & Philidor rook endgames, Greek Gift sacrifice, deep candidate calculation.' },
  { n: 7, name: 'Obsidian Master',       mc: 'Enchanting Portal',   icon: '🟪', color: '#a855f7', band: 'Lichess 1925–2100 · OTB ~1300–1500',minR: 1925, maxR: 2100, otbBase: 1375, goal: 'Prophylaxis, positional pawn breaks, Sicilian & French structures, unbreakable defense.' },
  { n: 8, name: 'Netherite Grandmaster', mc: 'Ender Dragon Slayer', icon: '🔥', color: '#f97316', band: 'Lichess 2100–2450+ · OTB ~1500+',   minR: 2100, maxR: 2450, otbBase: 1550, goal: 'Master-level 4–5 move calculation, quiet moves, zugzwang, championship tournament mastery.' },
];

const yt = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);

window.LESSONS = [
  // ================ LEVEL 1: WOOD SCOUT ================
  { id: 'l1-cct', l: 1, icon: '🛑', title: 'The Blunder-Check Habit (CCT)',
    why: 'Most losses come from one-move blunders and moving on impulse. CCT fixes both.',
    ideas: [
      'Before EVERY move ask: what are THEIR Checks, Captures, and Threats?',
      'Then ask the same for YOU: do I have a check, capture, or threat that wins material?',
      'Pause 3 seconds before touching a piece and ask: "What does this move leave undefended?"'
    ],
    drill: 'Solve 5 puzzles saying "Checks, Captures, Threats" before every first move.',
    videos: [['Checks Captures Threats thinking process', yt('chess checks captures threats thinking process')], ['How to stop blundering pieces', yt('chess how to stop blundering pieces beginner')]],
    quiz: [
      { type: 'board', fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4', side: 'w',
        prompt: 'Apply CCT (Checks first!): Find the 1-move checkmate for White (Scholar\'s Mate pattern).',
        moves: ['f3f7'], explain: 'Qxf7# is checkmate because the bishop on c4 defends the queen on f7!' },
      { type: 'mcq', q: 'In the CCT habit, which type of move must you ALWAYS calculate first?',
        opts: ['Quiet pawn moves', 'Checks (forcing the king to respond)', 'Random developing moves'], ans: 1,
        explain: 'Checks are the most forcing moves in chess — your opponent MUST respond to a check immediately.' },
      { type: 'mcq', q: 'Before you finalize your chosen move, what is the 3-second blunder check question?',
        opts: ['"Does this move leave any of my pieces undefended or walk into a check/capture?"', '"Can I play faster than 2 seconds?"', '"Did I move my queen enough times?"'], ans: 0,
        explain: 'Pausing 3 seconds to check if your destination square is safe prevents 90% of one-move blunders.' }
    ]
  },
  { id: 'l1-hang', l: 1, icon: '🎯', title: 'Hanging Pieces: Count Attackers vs Defenders',
    why: 'Free pieces decide games — both spotting theirs and protecting yours.',
    ideas: [
      'A piece is "hanging" when it is attacked and has zero defenders (or more attackers than defenders).',
      'Count attackers vs defenders BEFORE you capture.',
      'When you move a piece, check what it was previously defending!'
    ],
    drill: 'Solve 5 hanging-piece puzzles without a single fast wrong move.',
    videos: [['Hanging pieces explained', yt('chess hanging pieces beginner lesson')]],
    quiz: [
      { type: 'board', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/3nP3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 4', side: 'w',
        prompt: 'Black\'s knight just jumped to d4, leaving it undefended! Capture the hanging piece.',
        moves: ['f3d4'], explain: 'Nxd4 wins a full knight because Black had 0 defenders on d4.' },
      { type: 'mcq', q: 'Your bishop on c4 is attacked by a Black knight and a Black bishop (2 attackers), and defended only by your pawn on d3 (1 defender). Is your bishop safe?',
        opts: ['Yes, 1 defender is always enough', 'No! 2 attackers beat 1 defender — Black will win a piece', 'Only if it is a dark-squared bishop'], ans: 1,
        explain: 'When attackers outnumber defenders (2 vs 1), the defender loses material in the exchange.' },
      { type: 'mcq', q: 'When you move your Knight away from f3, what hidden danger must you check?',
        opts: ['What squares or pieces the f3-Knight was defending (like h4 or d4)', 'Whether knights can move diagonally', 'Nothing'], ans: 0,
        explain: 'Moving a defender away often leaves another piece or king square undefended!' }
    ]
  },
  { id: 'l1-fork', l: 1, icon: '🍴', title: 'Forks: Attack Two Targets at Once',
    why: 'Knights, pawns, and queens win huge material by attacking two pieces simultaneously.',
    ideas: [
      'A fork is one move that attacks two (or more) enemy targets at the same time.',
      'Royal Fork: attacking the King and Queen at once — the King MUST move, so the Queen falls.',
      'Pawn forks (like e4–e5 or d4–d5 hitting two knights/bishops) are deadly in the opening.'
    ],
    drill: 'Solve 5 fork puzzles and name both targets before moving.',
    videos: [['Chess forks & knight forks', yt('chess fork tactic beginner lesson knight fork')]],
    quiz: [
      { type: 'board', fen: 'r1bqk2r/pppp1ppp/2n2n2/4N3/1b2P3/8/PPPP1PPP/RNBQKB1R w KQkq - 1 5', side: 'w',
        prompt: 'Wait — look at this classic Royal Fork posisiion instead: White Knight on d5 can jump to c7! Play the fork on the board below.',
        fen: 'r1bqkbnr/ppp2ppp/2np4/3Np3/4P3/5N2/PPPP1PPP/R1BQKB1R w KQkq - 0 5',
        moves: ['d5c7'], explain: 'Nxc7+ forks the Black King on e8 and Rook on a8!' },
      { type: 'mcq', q: 'Why is a fork that includes a CHECK on the enemy king extra powerful?',
        opts: ['Because the opponent is forced to save their King and has no time to save the other attacked piece', 'Because checks give 2 extra moves', 'Because rooks cannot move after a check'], ans: 0,
        explain: 'A check removes the opponent\'s option to counter-attack or save their second piece.' },
      { type: 'mcq', q: 'If your opponent has a Knight near your King and Queen, how can you prevent a knight fork?',
        opts: ['Keep your King and Queen on different color squares (a Knight only attacks one color at a time!)', 'Put your King and Queen 2 squares apart on the same rank', 'Ignore the knight'], ans: 0,
        explain: 'Every knight fork hits squares of the SAME color! Putting your King and Queen on opposite colors makes a simultaneous knight fork impossible.' }
    ]
  },
  { id: 'l1-pin', l: 1, icon: '📌', title: 'Pins & Skewers Along Lines',
    why: 'Bishops, Rooks, and Queens control files, ranks, and diagonals to freeze and win pieces.',
    ideas: [
      'Absolute Pin: a piece is pinned to the King and legally CANNOT move.',
      'Relative Pin: moving the pinned piece would lose a Queen or Rook behind it.',
      'Skewer: the reverse of a pin — hit the King or Queen in front so it moves and exposes the piece behind!'
    ],
    drill: 'Solve 5 pin/skewer puzzles. Always look to "pile up" a pawn or second attacker on a pinned piece.',
    videos: [['Pins and skewers explained', yt('chess pin and skewer tactic explained')]],
    quiz: [
      { type: 'board', fen: '4k3/8/8/3n4/8/8/8/3R1K2 w - - 0 1', side: 'w',
        prompt: 'Black\'s knight on d5 is in front of the King on e8? Play the move that pins or skewers along the e-file: move the Rook to pin/check!',
        fen: '4k3/4n3/8/8/8/8/8/3R1K2 w - - 0 1',
        moves: ['d1e1'], explain: 'Re1 pins the Black knight on e7 directly to the Black king on e8 — it cannot legally move!' },
      { type: 'mcq', q: 'What is the golden rule when you have an enemy piece pinned (e.g., Bg5 pinning Nf6)?',
        opts: ['Capture it immediately even if it is an equal trade', 'Attack the pinned piece AGAIN (with a pawn or knight) because it cannot run away', 'Retreat your bishop'], ans: 1,
        explain: '"Put pressure on the pinned piece!" Since a pinned piece can\'t run, adding more attackers wins it.' },
      { type: 'mcq', q: 'What is the difference between a Pin and a Skewer?',
        opts: ['In a Pin the less valuable piece is in front; in a Skewer the MORE valuable piece (King/Queen) is in front and forced to move', 'They are identical', 'Knights do pins and pawns do skewers'], ans: 0,
        explain: 'A Skewer attacks the high-value piece first (like a laser through the King to win a Rook behind it).' }
    ]
  },
  { id: 'l1-kq', l: 1, icon: '♛', title: 'Checkmate with King + Queen vs King', drill_id: 'kqk',
    why: 'You must be able to convert K+Q vs K in under 15 moves with eyes closed — zero stalemates.',
    ideas: [
      'Knight-Distance Box: put your Queen a knight\'s move away from the enemy King to shrink its box.',
      'Once the enemy King is trapped on the edge rank/file, STOP shrinking with the Queen (to avoid stalemate!).',
      'Walk your King up until the two Kings face each other, then deliver checkmate.'
    ],
    drill: 'Open the Endgame Lab and win K+Q vs K in under 15 moves.',
    videos: [['How to checkmate with King and Queen', yt('chess how to checkmate with king and queen vs king box method')]],
    quiz: [
      { type: 'board', fen: '3k4/8/3K4/8/8/8/6Q1/8 w - - 0 1', side: 'w',
        prompt: 'White\'s King is in opposition on d6 and Black\'s King is trapped on d8. Deliver checkmate in 1 move!',
        moves: ['g2g7', 'g2a8', 'g2b7', 'g2c6'], explain: 'Qg7# (or Qa8# / Qb7#) is checkmate! The King on d6 guards c7, d7, e7.' },
      { type: 'mcq', q: 'When the lone enemy King is already trapped in the corner (say a8) and your Queen is on c7, what happens if you forget to check for legal moves?',
        opts: ['Stalemate (a draw!) because the enemy King is not in check and has 0 legal moves', 'Automatic win for White', 'You get an extra Queen'], ans: 0,
        explain: 'Never put the Queen a knight\'s move from a cornered King (like Qc7 vs Ka8) without leaving a breathing square!' },
      { type: 'mcq', q: 'In the Box Method, what relative position does the Queen keep from the enemy King while shrinking the box?',
        opts: ['A Knight\'s move away (L-shape)', 'Directly adjacent without King support', 'On the other side of the board'], ans: 0,
        explain: 'Keeping the Queen a knight\'s-move away shrinks the box every turn without ever giving the King a check to escape.' }
    ]
  },

  // ================ LEVEL 2: STONE CRAFTER ================
  { id: 'l2-open', l: 2, icon: '🏰', title: 'The 3 Golden Opening Principles',
    why: 'Strong openings come from 3 classical rules: Center, Development, King Safety.',
    ideas: [
      '1. Control the Center (e4, d4, e5, d5) with pawns and minor pieces.',
      '2. Develop Knights before Bishops, and don\'t move the same piece twice in the opening.',
      '3. Castle early (by move 7–8) to tuck your King away and activate your Rook!'
    ],
    drill: 'In your next rapid game, castle before move 8 and develop all 4 minor pieces before move 10.',
    videos: [['Opening principles for improving players', yt('chess opening principles develop castle center')]],
    quiz: [
      { type: 'board', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', side: 'w',
        prompt: 'White has developed Nf3 and Bc4 in the Italian Game. Play the best move that secures King safety AND activates the h1-Rook!',
        moves: ['e1g1'], explain: 'Castles (O-O / e1g1) puts the King in safety and brings the Rook toward the center!' },
      { type: 'mcq', q: 'Why is bringing your Queen out on move 2 or 3 usually a bad idea against good players?',
        opts: ['The opponent develops their Knights and Bishops with tempo by attacking your Queen!', 'Queens are not allowed to cross the 4th rank early', 'The Queen moves too slowly'], ans: 0,
        explain: 'Every time your Queen has to run away from a minor piece attack, your opponent gets a free developing move.' },
      { type: 'mcq', q: 'Which 4 squares form the "Center" of the chessboard?',
        opts: ['a1, a8, h1, h8', 'e4, d4, e5, d5', 'c3, f3, c6, f6'], ans: 1,
        explain: 'Pieces placed in or controlling e4, d4, e5, and d5 reach more squares and can switch to either flank fast.' }
    ]
  },
  { id: 'l2-back', l: 2, icon: '🧱', title: 'Back-Rank Mates & Making "Luft"',
    why: 'Hundreds of scholastic games are won and lost on the 1st and 8th ranks.',
    ideas: [
      'When f2, g2, h2 (or f7, g7, h7) pawns haven\'t moved, the castled King is trapped in a hallway.',
      'An enemy Rook or Queen landing on the back rank delivers instant checkmate if the rank isn\'t guarded.',
      'Make "Luft" (German for air/breathing room) with h3 or h6 when Rooks are on open files.'
    ],
    drill: 'Solve 5 back-rank mate puzzles.',
    videos: [['Back rank mate & Luft', yt('chess back rank mate how to avoid and use')]],
    quiz: [
      { type: 'board', fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', side: 'w',
        prompt: 'Black forgot to make luft! Deliver back-rank checkmate in 1 move.',
        moves: ['d1d8'], explain: 'Rd8# is checkmate because Black\'s own f7, g7, h7 pawns block the King\'s escape.' },
      { type: 'mcq', q: 'What does "making Luft" mean in chess?',
        opts: ['Pushing a pawn in front of your castled King (like h3 or g3) to give the King an escape square', 'Sacrificing both rooks', 'Moving the King to the center on move 4'], ans: 0,
        explain: 'Playing h3 (or h6 as Black) creates a safe flight square on h2/h7 so you never get back-rank mated.' },
      { type: 'mcq', q: 'Why is pushing h3 usually better than f3 for making Luft in front of a castled King?',
        opts: ['Moving the f-pawn weakens the deadly a7-g1 / h4-e1 king diagonals', 'The h-pawn is worth more points', 'f3 is illegal'], ans: 0,
        explain: '"Never play f3/f6 lightly!" Opening the f-pawn exposes the King along dangerous diagonals.' }
    ]
  },
  { id: 'l2-disc', l: 2, icon: '💥', title: 'Discovered Attacks & Double Check',
    why: 'Moving one piece to unleash a Rook, Bishop, or Queen behind it creates two threats at once.',
    ideas: [
      'A Discovered Attack happens when you move a blocker out of the line of your Queen, Rook, or Bishop.',
      'Make the moving piece create a threat (capture or check) so your opponent faces TWO attacks at once.',
      'Double Check (both the moving piece AND the revealed piece give check) forces the enemy King to move!'
    ],
    drill: 'Solve 5 discovered-attack puzzles.',
    videos: [['Discovered attacks & double checks', yt('chess discovered attack double check lesson')]],
    quiz: [
      { type: 'board', fen: 'r1bqkbnr/pppp1ppp/2n5/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3', side: 'w',
        prompt: 'Look at this Petrov trap position: White\'s Knight is on e5 in front of the White Queen on e2 facing Black\'s Queen on e7. Play the discovered attack that wins Black\'s Queen!',
        fen: 'rnb1kbnr/ppppqppp/8/4N3/4P3/8/PPPPQPPP/RNB1KB1R w KQkq - 2 4',
        moves: ['e5c6'], explain: 'Nc6! attacks Black\'s Queen AND unleashes the White Queen on e2 against e7 — Black loses the Queen!' },
      { type: 'mcq', q: 'When your opponent is hit with a DOUBLE CHECK (two pieces checking the King at once), what is their ONLY legal type of reply?',
        opts: ['They MUST move their King (you cannot block or capture two checking pieces at once!)', 'Capture one of the checking pieces', 'Block one of the checks'], ans: 0,
        explain: 'Double check is the ultimate tactical weapon because neither capture nor interposition can stop both checks.' },
      { type: 'mcq', q: 'How do you spot a potential discovered attack in your own position?',
        opts: ['Look for your Rook/Bishop/Queen lined up with an enemy King or Queen through one of your own pieces ("X-ray alignment")', 'Only move pawns on the edge', 'Count the pawns'], ans: 0,
        explain: 'X-ray alignment (two of your pieces on the same line as an enemy target) is the trigger for every discovered attack.' }
    ]
  },
  { id: 'l2-opp', l: 2, icon: '👑', title: 'King & Pawn Endgames: The Opposition',
    why: 'Understanding Opposition turns drawn pawn endings into wins (and saves lost ones!).',
    ideas: [
      'Direct Opposition: the two Kings stand on the same file/rank with 1 square between them.',
      'Whoever does NOT have to move ("has the opposition") forces the other King to step aside.',
      'Golden Rule of K+P vs K: Keep your King IN FRONT of your pawn!'
    ],
    drill: 'Practice King + Pawn vs King on Lichess Practice.',
    link: ['Lichess Practice: Pawn Endgames', 'https://lichess.org/practice'],
    videos: [['Opposition in King and Pawn Endgames', yt('chess opposition king and pawn endgame explained')]],
    quiz: [
      { type: 'board', fen: '4k3/8/3K4/4P3/8/8/8/8 w - - 0 1', side: 'w',
        prompt: 'White\'s King is on d5, Pawn on e4, Black King on e7: step your King IN FRONT of the pawn to seize the Direct Opposition!',
        fen: '4k3/8/8/3K4/4P3/8/8/8 w - - 0 1',
        moves: ['d5e6'], explain: 'Ke6! puts the White King in front of the pawn and takes direct opposition against Black\'s King on e8!' },
      { type: 'mcq', q: 'In King + Pawn vs King (not a rook pawn), if the attacking King is on the 6th rank IN FRONT of its pawn, what is the result?',
        opts: ['Always a WIN, no matter whose turn it is!', 'Always a draw', 'Only a win if you have two pawns'], ans: 0,
        explain: 'When your King reaches the 6th rank in front of the pawn (key squares d6/e6/f6 for an e-pawn), it wins regardless of whose move it is!' },
      { type: 'mcq', q: 'When the two Kings stand on e4 and e6 (1 square between them) and it is BLACK\'s turn to move, who "has the opposition"?',
        opts: ['White has the opposition because Black is forced to give way first', 'Black has the opposition', 'Neither player'], ans: 0,
        explain: 'The player who just moved into the facing square holds the opposition and forces the other King to step aside.' }
    ]
  },

  // ================ LEVEL 3: IRON DEFENDER ================
  { id: 'l3-italian', l: 3, icon: '🇮🇹', title: 'Opening Mastery: The Italian Game & Knight Attack',
    why: 'Mastering the Italian Game (1.e4 e5 2.Nf3 Nc6 3.Bc4) gives you sharp, logical plans targeting f7 and d4.',
    ideas: [
      'Moves: 1.e4 e5 2.Nf3 Nc6 3.Bc4 — White eyes the weakest square in Black\'s camp: f7 (defended only by the King).',
      'Against 3...Bc5 (Giuoco Piano): play c3 and d4 to build a massive pawn center!',
      'Against 3...Nf6 (Two Knights Defense): 4.Ng5 attacks f7 twice (or 4.d3/d4 for solid central play).'
    ],
    drill: 'Play the Italian setup and test both 3...Bc5 (4.c3) and 3...Nf6 responses.',
    videos: [['Italian Game complete guide', yt('italian game chess opening tutorial')]],
    quiz: [
      { type: 'board', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', side: 'w',
        prompt: 'Play move 3 of the Italian Game, developing the Bishop to target Black\'s weak f7 square!',
        moves: ['f1c4'], explain: '3.Bc4! enters the Italian Game, aiming directly at f7 and preparing quick kingside castling.' },
      { type: 'board', fen: 'r1bqk2r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 3 4', side: 'b',
        prompt: 'In the Two Knights Defense after 4.Ng5, White attacks f7 with both Knight and Bishop! Play the ONLY good move for Black that blocks the Bishop\'s diagonal.',
        moves: ['d7d5'], explain: '4...d5! is the essential theoretical move, blocking the c4-Bishop\'s attack on f7!' },
      { type: 'mcq', q: 'In the Giuoco Piano (1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5), why does White play 4.c3?',
        opts: ['To prepare the central pawn break 5.d4, taking over the center with tempo on the c5-Bishop', 'To put the King on c3', 'To trap White\'s own Knight'], ans: 0,
        explain: '4.c3 supports 5.d4 so when Black plays ...exd4, White recaptures cxd4 with a dream pawn center (d4 + e4).' }
    ]
  },
  { id: 'l3-def', l: 3, icon: '🪓', title: 'Removing the Guard & Deflection',
    why: 'When a target looks protected, destroy or distract the piece defending it!',
    ideas: [
      'Ask: "Which enemy piece is doing the defensive job?"',
      'Removing the Guard: capture or trade off that defender first.',
      'Deflection: force the defender to move away by giving it a threat it cannot ignore.'
    ],
    drill: 'Solve 5 removing-the-defender / deflection puzzles.',
    videos: [['Removing the defender & deflection', yt('chess removing the defender deflection tactic')]],
    quiz: [
      { type: 'board', fen: '3r2k1/5ppp/8/8/2B5/8/5PPP/3R2K1 w - - 0 1', side: 'w',
        prompt: 'Actually look at this position: Black\'s Rook on d8 is guarded by a Knight on f6, and White has a Bishop on g5 and Rook on d1. Remove the guard to win a piece!',
        fen: '3r2k1/5ppp/5n2/6B1/8/8/5PPP/3R2K1 w - - 0 1',
        moves: ['g5f6'], explain: 'Bxf6! removes the Knight defending d8 (and threatens Rxd8# if Black recaptures gxf6)!' },
      { type: 'mcq', q: 'An enemy Queen is trying to guard both a back-rank checkmate square AND a hanging Rook at the same time. What is this weakness called?',
        opts: ['An Overloaded Piece', 'A Passed Pawn', 'Fianchetto'], ans: 0,
        explain: 'An overloaded defender has two critical jobs — if you force it to do one job, the other collapses.' },
      { type: 'mcq', q: 'In what order do you execute "Removing the Guard"?',
        opts: ['Capture/deflect the defender FIRST, then capture the newly undefended prize', 'Capture the protected piece first and hope they miss the recapture', 'Castle'], ans: 0,
        explain: 'Eliminate the guard first with a forcing move (check or capture), then collect the undefended target.' }
    ]
  },
  { id: 'l3-pass', l: 3, icon: '🚀', title: 'Passed Pawns & The Rule of the Square',
    why: 'Knowing the Rule of the Square lets you calculate pawn races in 2 seconds without counting move-by-move.',
    ideas: [
      'A Passed Pawn has no enemy pawns in front of it on the same file or adjacent files.',
      'Rule of the Square: draw a diagonal from the pawn to the 8th rank to form a square.',
      'If the defending King can step INSIDE that square on its turn, it catches the pawn; if outside, the pawn queens!'
    ],
    drill: 'Practice using the Rule of the Square before trading pieces into a King & Pawn endgame.',
    videos: [['Rule of the square explained', yt('chess rule of the square passed pawn endgame')]],
    quiz: [
      { type: 'board', fen: '8/8/8/P7/8/5k2/8/6K1 w - - 0 1', side: 'w',
        prompt: 'White\'s pawn on a5 is outside the Black King\'s square (f3 is too far!). Push the passed pawn to victory!',
        moves: ['a5a6'], explain: 'a6! shrinks the square to a6-c6-c8-a8 — Black\'s King on f3 can never catch it!' },
      { type: 'mcq', q: 'Special Rule: When a pawn is still on its STARTING rank (2nd rank for White), how do you draw the Square?',
        opts: ['Draw the square from the 3rd rank instead, because the pawn can jump 2 squares on its first move!', 'Pawns on the 2nd rank cannot promote', 'Add 3 squares to the king'], ans: 0,
        explain: 'Because a pawn on the 2nd rank can leap 2 squares on move 1, its effective square is the 3rd-rank square!' },
      { type: 'mcq', q: 'Where does a Rook belong when supporting your passed pawn (or stopping the opponent\'s passed pawn)?',
        opts: ['Directly BEHIND the passed pawn (Tarrasch\'s Rule)', 'Directly in front of your own passed pawn', 'In the corner behind your King'], ans: 0,
        explain: '"Rooks belong behind passed pawns!" As the pawn advances, your Rook\'s scope grows (and an enemy Rook in front gets cramped).' }
    ]
  },

  // ================ LEVEL 4: GOLD KNIGHT ================
  { id: 'l4-london', l: 4, icon: '🇬🇧', title: 'Opening Mastery: The London System Structure',
    why: 'A rock-solid d4 system (d4, Bf4, e3, Nf3, c3, Bd3) with clear plans against almost any Black setup.',
    ideas: [
      'Develop the dark-squared Bishop to f4 BEFORE playing e3 so it isn\'t locked inside the pawn chain!',
      'Build the Pyramid of Pawns: c3 – d4 – e3, making d4 unbreakable.',
      'Key attacking outpost: plant your Knight on e5, backed up by f4 or Bd3/Nf3.'
    ],
    drill: 'Play the London System pyramid and watch out for early ...Qb6 attacks on b2.',
    videos: [['London System complete guide', yt('london system chess opening guide')]],
    quiz: [
      { type: 'board', fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2', side: 'w',
        prompt: 'After 1.d4 d5, play the signature move 2 of the London System that develops your dark-squared bishop outside the pawn chain!',
        moves: ['c1f4'], explain: '2.Bf4! brings the bishop to an active diagonal before playing e3.' },
      { type: 'mcq', q: 'Why must you play Bf4 BEFORE playing e3 in the London System?',
        opts: ['Because playing e3 first locks your c1-Bishop behind your own pawns!', 'Because e3 is illegal on move 2', 'Because Knights can\'t move after e3'], ans: 0,
        explain: 'Developing Bf4 (or Bg5) outside the e3-d4-c3 pawn triangle gives you all the solidity of e3 with an active bishop.' },
      { type: 'mcq', q: 'In the London System, which central square is the dream outpost for White\'s f3-Knight?',
        opts: ['The e5 square (supported by the d4-pawn and f4-Bishop)', 'The a1 square', 'The h2 square'], ans: 0,
        explain: 'Ne5 is the thematic London outpost, clamping down on f7, c6, and d7 while opening the Queen/Bishop for a kingside attack.' }
    ]
  },
  { id: 'l4-calc', l: 4, icon: '🧠', title: '3-Move Calculation: Candidate Moves & Move Order',
    why: 'Often you have the right tactical pieces, but only ONE move order works without letting the opponent escape.',
    ideas: [
      'List 2–3 Candidate Moves (Checks first, then Captures, then Threats).',
      'Compare move orders: if Move A then Move B allows a defense, test Move B FIRST then Move A!',
      'Always calculate your opponent\'s most stubborn reply before touching a piece.'
    ],
    drill: 'Solve 5 Level-4 puzzles by comparing two candidate move orders before moving.',
    videos: [['Candidate moves & move order', yt('chess calculation candidate moves move order')]],
    quiz: [
      { type: 'board', fen: 'r4rk1/ppp2ppp/8/8/2B5/8/PPP2PPP/3R1RK1 w - - 0 1', side: 'w',
        prompt: 'Check this classic Smothered/Back-rank sacrifice pattern: White has a Queen on c4 and Rook on d1 facing Black\'s Rook on d8 and King on g8. Win a Rook with the forcing move!',
        fen: '3r2k1/5ppp/8/8/2Q5/8/5PPP/3R2K1 w - - 0 1',
        moves: ['d1d8'], explain: 'Rxd8+! wins the Rook with check (and after Qf8, Rxf8# is mate!).' },
      { type: 'mcq', q: 'You see two good moves: Move A (a non-check capture) and Move B (a forcing check). How should you decide the move order?',
        opts: ['Calculate both orders (A then B vs B then A) and see which one gives your opponent ZERO counterplay', 'Always play whichever piece is closer to your hand', 'Guess'], ans: 0,
        explain: 'Reversing move order ("playing B before A") is the #1 secret to solving 3-move combinations.' },
      { type: 'mcq', q: 'When calculating a 3-move combination in your head, what error do most players make on Move 2?',
        opts: ['Assuming the opponent will make a cooperative move instead of their BEST defensive resource', 'Calculating too many checks', 'Looking at the whole board'], ans: 0,
        explain: 'Never play "hope chess" — always assume your opponent will find the strongest defense on every turn.' }
    ]
  },

  // ================ LEVEL 5: REDSTONE TACTICIAN ================
  { id: 'l5-caro', l: 5, icon: '🛡️', title: 'Opening Mastery: The Caro-Kann & Queen\'s Gambit',
    why: 'To crush 1000–1300 players, you need rock-solid opening theory against both 1.e4 and 1.d4.',
    ideas: [
      'Caro-Kann Defense (1.e4 c6 2.d4 d5): supports d5 with a flank pawn AND keeps the c8-Bishop\'s diagonal open!',
      'Against the Advance Variation (3.e5): play 3...Bf5! (develop the bishop outside the chain) followed by ...e6 and ...c5.',
      'Queen\'s Gambit (1.d4 d5 2.c4): White attacks Black\'s d5 center; Black replies 2...e6 (QGD) or 2...c6 (Slav) — never try to cling to the c4 pawn greedily after 2...dxc4!'
    ],
    drill: 'Practice the Caro-Kann Advance line (1.e4 c6 2.d4 d5 3.e5 Bf5) on the board.',
    videos: [['Caro-Kann in 10 minutes', yt('caro kann defense complete guide')], ['Queen\'s Gambit explained', yt('queens gambit opening guide')]],
    quiz: [
      { type: 'board', fen: 'rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3', side: 'b',
        prompt: 'Caro-Kann Advance Variation (1.e4 c6 2.d4 d5 3.e5): Play Black\'s best theoretical move developing the light-squared Bishop BEFORE playing ...e6!',
        moves: ['c8f5'], explain: '3...Bf5! is the whole point of the Caro-Kann over the French Defense — your light-squared bishop gets outside the pawn chain!' },
      { type: 'board', fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2', side: 'w',
        prompt: 'Now play Move 2 of the Queen\'s Gambit (1.d4 d5 2.___), striking at Black\'s d5 central pawn from the flank!',
        moves: ['c2c4'], explain: '2.c4! is the Queen\'s Gambit — offering a temporary wing pawn to destroy Black\'s central d5 post.' },
      { type: 'mcq', q: 'In the Queen\'s Gambit Accepted (1.d4 d5 2.c4 dxc4), why is it a huge mistake for Black to try to hold the c4 pawn with 3.e3 b5? 4.a4 c6? 5.axb5 cxb5??',
        opts: ['Because 6.Qf3! wins Black\'s undefended Rook on a8 along the long diagonal!', 'Because pawns cannot move to b5', 'Because White\'s King can jump to c4'], ans: 0,
        explain: 'The classic Queen\'s Gambit trap: 6.Qf3! hits the unprotected a8-Rook and wins a full piece/rook.' }
    ]
  },
  { id: 'l5-zwisch', l: 5, icon: '⚡', title: 'Zwischenzug: The In-Between Move',
    why: 'Redstone Tacticians don\'t just make automatic recaptures — they insert a devastating intermediate check or threat first!',
    ideas: [
      'Zwischenzug (German for "in-between move"): instead of making the expected recapture, insert a forcing check or threat first.',
      'After the opponent responds to your intermediate check, THEN make your recapture — now a full piece or tempo ahead!',
      'Watch out for YOUR opponent\'s zwischenzug when you calculate an exchange sequence.'
    ],
    drill: 'Solve 5 Level-5 tactical puzzles looking for in-between checks.',
    videos: [['Zwischenzug in-between moves', yt('chess zwischenzug intermediate move tactic')]],
    quiz: [
      { type: 'board', fen: 'r3k2r/ppp2ppp/8/3q4/3n4/8/PPP2PPP/R2Q1RK1 w kq - 0 1', side: 'w',
        prompt: 'Black just captured on d4 with the Knight, expecting Qxd4. Instead, play the winning in-between move (or pin/attack) — wait, look at this position: White can give an intermediate check on e1 or capture! Let\'s test the classic Rook intermediate check:',
        fen: '2r3k1/5ppp/8/3r4/3R4/8/5PPP/3R2K1 w - - 0 1',
        moves: ['d4d5'], explain: 'Rxd5! wins the Rook cleanly because if Black recaptures, Rd8# is back-rank mate!' },
      { type: 'mcq', q: 'What is a "Zwischenzug"?',
        opts: ['An unexpected intermediate (in-between) forcing move played before an obvious recapture', 'Moving two pieces on the same turn', 'Trading queens on move 1'], ans: 0,
        explain: 'Inserting a check or queen attack before recapturing throws off your opponent\'s entire calculation.' },
      { type: 'mcq', q: 'Whenever you calculate a trade like "I take their Knight, they take my Knight, I take their Bishop", what must you pause and check?',
        opts: ['"Does my opponent have an in-between CHECK or Queen threat after my first capture instead of recapturing right away?"', '"What color is the board?"', '"How many pawns are on the a-file?"'], ans: 0,
        explain: 'Checking for an opponent\'s Zwischenzug after your first capture prevents tactical disasters at 1500+ level.' }
    ]
  },

  // ================ LEVEL 6: DIAMOND COMMANDER ================
  { id: 'l6-lucena', l: 6, icon: '💎', title: 'Rook Endgame Mastery: Lucena & Philidor Positions',
    why: 'Every Diamond Commander knows the two most important theoretical endgame positions in chess history.',
    ideas: [
      'Lucena Position (Winning!): Your pawn is on the 7th rank with your King in front of it. Play "Building a Bridge" — put your Rook on the 4th rank so after 3 checks it blocks the enemy Rook\'s checks!',
      'Philidor Position (Drawing!): When defending against a King + Pawn, keep your Rook on the 6th rank (3rd rank) so the enemy King CANNOT step to the 6th rank; the moment they push the pawn to the 6th, drop your Rook to the 1st/8th rank and check from behind forever!'
    ],
    drill: 'Practice the Lucena "Building a Bridge" maneuver on the board.',
    link: ['Lichess Practice: Rook Endgames', 'https://lichess.org/practice'],
    videos: [['Lucena & Philidor Rook Endgames', yt('lucena and philidor position rook endgame explained')]],
    quiz: [
      { type: 'board', fen: '1K6/1P1k4/8/8/8/8/1r6/2R5 w - - 0 1', side: 'w',
        prompt: 'Lucena Position! White\'s King is on b8 in front of the b7 pawn. Play step 1 of "Building a Bridge" by moving your Rook to the 4th rank!',
        moves: ['c1c4'], explain: 'Rc4! ("Building a Bridge") prepares to bring the King out (Ka7–a6–b6) and shield it from checks with Rb4!' },
      { type: 'mcq', q: 'In the Lucena Position, why do we put our Rook on the 4th rank before stepping the King out from in front of the 7th-rank pawn?',
        opts: ['So that after the King zig-zags to the 5th rank, our Rook can slide over on the 4th rank to block ("build a bridge" against) the enemy Rook\'s checks!', 'To sacrifice the Rook for nothing', 'Because Rooks move faster on the 4th rank'], ans: 0,
        explain: 'The 4th-rank Rook acts as an umbrella/bridge on the 5th move so the enemy Rook runs out of checks.' },
      { type: 'mcq', q: 'In the Philidor defensive drawing technique, where do you place your Rook BEFORE the attacker pushes their pawn to the 6th rank?',
        opts: ['On the 3rd/6th rank ("3rd-rank defense") to cut off the enemy King from advancing to the 6th rank', 'In the corner doing nothing', 'Right next to their King'], ans: 0,
        explain: 'Cutting off the enemy King along the 6th rank forces them to push the pawn early, and then your Rook drops to the back rank to give infinite checks from behind!' }
    ]
  },
  { id: 'l6-greek', l: 6, icon: '🏛️', title: 'Classical Sacrifice: The Greek Gift (Bxh7+!)',
    why: 'Recognizing when Bxh7+! works lets you rip open the enemy King in seconds.',
    ideas: [
      '4 Conditions for the Greek Gift (Bxh7+ Kxh7 Ng5+):',
      '1. You have a Bishop eyeing h7, a Knight ready to jump to g5, and a Queen ready to reach h5.',
      '2. Black has NO Knight on f6 (or any piece guarding h7/h5).',
      '3. If Black retreats ...Kg8 after Ng5+, 3.Qh5 threatens Qh7# and forces winning material or mate!'
    ],
    drill: 'Calculate the full Greek Gift line (1.Bxh7+ Kxh7 2.Ng5+ Kg8 3.Qh5) before playing.',
    videos: [['Greek Gift sacrifice Bxh7+ guide', yt('greek gift sacrifice chess tutorial bxh7')]],
    quiz: [
      { type: 'board', fen: 'r1bq1rk1/ppp2ppp/2nb4/3p4/3P4/3B1N2/PPP2PPP/RNBQK2R w KQ - 0 7', side: 'w',
        prompt: 'All Greek Gift conditions are met (no Black Knight on f6, White has Bd3, Nf3, Qd1)! Launch the classical Greek Gift sacrifice!',
        moves: ['d3h7'], explain: '1.Bxh7+! Kxh7 2.Ng5+ followed by 3.Qh5 creates an unstoppable mating attack!' },
      { type: 'mcq', q: 'After 1.Bxh7+ Kxh7 2.Ng5+, what is White\'s critical 3rd move if Black retreats 2...Kg8?',
        opts: ['3.Qh5! threatening Qh7# (and Qxf7+)', '3.Nxh7 trading off the attacking knight', '3.a3'], ans: 0,
        explain: 'Never cash out with 3.Nxh7! Play 3.Qh5! to bring the Queen into the mating net.' },
      { type: 'mcq', q: 'Which single Black defensive piece almost always PREVENTS the Greek Gift sacrifice on h7 from working?',
        opts: ['A Black Knight on f6 (because it defends h7 and h5!)', 'A pawn on a6', 'A Rook on a8'], ans: 0,
        explain: 'When Black has a Knight on f6, h7 and h5 are covered — drive or trade away the f6-Knight first!' }
    ]
  },

  // ================ LEVEL 7: OBSIDIAN MASTER ================
  { id: 'l7-proph', l: 7, icon: '🟪', title: 'Prophylaxis & Stopping Counterplay',
    why: '1500+ players don\'t just make threats — they destroy the opponent\'s best idea before it even starts.',
    ideas: [
      'Prophylaxis (Karpov & Petrosian\'s secret weapon): before pursuing your own plan, ask "If my opponent had a free move right now, what would they play?"',
      'Stop their freeing pawn break or active piece jump FIRST.',
      'When you are winning, eliminating your opponent\'s counterplay wins the game 10x more reliably than chasing wild complications.'
    ],
    drill: 'In every puzzle and rapid game today, name the opponent\'s best threat before choosing your move.',
    videos: [['Prophylaxis in chess explained', yt('chess prophylaxis positional play tutorial')]],
    quiz: [
      { type: 'board', fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7', side: 'w',
        prompt: 'Black wants to pin your f3-Knight with ...Bg4. Play the classic prophylactic move that stops ...Bg4 (and prepares b4 if needed) — or on the kingside, play h3!',
        moves: ['h2h3'], explain: 'h3! is classic prophylaxis — preventing ...Bg4 from pinning the f3-Knight and giving the White King luft at the same time.' },
      { type: 'mcq', q: 'What is the core question of Prophylactic Thinking?',
        opts: ['"What would my opponent play if it were their turn right now — and how can I prevent it?"', '"How fast can I blitz out my next move?"', '"Can I sacrifice a piece for no reason?"'], ans: 0,
        explain: 'Passing the turn mentally in your head reveals your opponent\'s plan immediately.' },
      { type: 'mcq', q: 'Why is prophylaxis especially lethal when you are already up a pawn or piece?',
        opts: ['Because your opponent\'s only hope is chaotic counterplay; shutting down their active ideas forces an easy technical win', 'Because prophylaxis gives extra clock time', 'Because pawns become queens on the 5th rank'], ans: 0,
        explain: '"Do not hurry!" Killing counterplay when ahead leaves your opponent helpless.' }
    ]
  },

  // ================ LEVEL 8: NETHERITE GRANDMASTER ================
  { id: 'l8-quiet', l: 8, icon: '🔥', title: 'Netherite Mastery: Quiet Moves & Zugzwang',
    why: 'The hardest moves to see at 2000+ level are non-capturing, non-checking "quiet moves" in the middle of a combination.',
    ideas: [
      'Quiet Move in a Combination: after a sacrifice or check, playing a silent move that sets up an unstoppable mate net.',
      'Zugzwang: a position where ANY legal move your opponent makes worsens their position or loses material.',
      'Triangulation: taking 3 King moves where your opponent has 2 so you hand the move back to them in the exact same position!'
    ],
    drill: 'Solve 5 Level 7–8 puzzles focusing on quiet moves and zugzwang.',
    videos: [['Quiet moves & Zugzwang mastery', yt('chess quiet moves zugzwang triangulation endgame')]],
    quiz: [
      { type: 'board', fen: '7k/5K2/8/6Q1/8/8/8/8 w - - 0 1', side: 'w',
        prompt: 'Find the quiet move that puts Black in complete Zugzwang (or delivers mate in 1 on g7/h6): deliver checkmate!',
        moves: ['g5g7', 'g5h6'], explain: 'Qg7# / Qh6# finishes the net!' },
      { type: 'mcq', q: 'What does "Zugzwang" mean?',
        opts: ['Compulsion to move — a position where the side to move would prefer to pass because EVERY legal move loses', 'A double rook sacrifice', 'Castling queenside'], ans: 0,
        explain: 'In chess you are never allowed to pass your turn, making Zugzwang a decisive weapon in endgames.' },
      { type: 'mcq', q: 'In King & Pawn endgames, how does "Triangulation" work?',
        opts: ['Your King moves in a 3-step triangle while the enemy King only has 2 squares to shuffle between, transferring the move (and Zugzwang) to your opponent!', 'Moving 3 pawns at once', 'Trading all pieces by move 10'], ans: 0,
        explain: 'Losing a tempo via a 3-move King triangle reaches the identical position with your opponent to move!' }
    ]
  }
];

window.RECOMMENDED = [
  ['Daniel Naroditsky - Speedrun & Endgame Mastery (YouTube)', yt('Daniel Naroditsky speedrun endgame theory')],
  ['Saint Louis Chess Club - Kids & Scholastic Lectures (YouTube)', yt('Saint Louis Chess Club scholastic lectures opening theory')],
  ['Hanging Pawns - Opening Theory Series (YouTube)', yt('Hanging Pawns opening theory guide')],
  ['GothamChess - Middlegame & Tactics Masterclass', yt('GothamChess tactics middlegame masterclass')],
  ['Lichess Practice (Checkmates, Tactical Motifs & Endgames)', 'https://lichess.org/practice'],
  ['Lichess Study: Opening & Endgame Theory', 'https://lichess.org/study'],
];
