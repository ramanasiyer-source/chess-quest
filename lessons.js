/* Chess Quest v3.1 - 5 Unified Minecraft Mastery Levels & 5 Deep Repertoire Packages (Roadmap Only — All Play & Testing on Lichess) */
window.LEVELS = [
  {
    "n": 1,
    "name": "Stone Crafter",
    "mc": "Stone Pickaxe",
    "icon": "⛏️",
    "color": "#94a3b8",
    "band": "OTB 700 · Classical 1300 · Rapid 1550 · Blitz 1250 · Puzzle 1650",
    "minR": 800,
    "maxR": 1350,
    "otbBase": 700,
    "targets": {
      "otb": 700,
      "classical": 1300,
      "rapid": 1550,
      "blitz": 1250,
      "puzzle": 1650
    },
    "clearBonus": 250,
    "reqPuzzles": 25,
    "reqEndgames": 3,
    "goal": "Foundation Package: Classical QG & English setups, Caro-Kann & Open Sicilian fundamentals, CCT discipline, and K+Q / K+R mates."
  },
  {
    "n": 2,
    "name": "Iron Defender",
    "mc": "Iron Armor",
    "icon": "🛡️",
    "color": "#38bdf8",
    "band": "OTB 775 · Classical 1400 · Rapid 1625 · Blitz 1325 · Puzzle 1750",
    "minR": 1350,
    "maxR": 1550,
    "otbBase": 775,
    "targets": {
      "otb": 775,
      "classical": 1400,
      "rapid": 1625,
      "blitz": 1325,
      "puzzle": 1750
    },
    "clearBonus": 400,
    "reqPuzzles": 50,
    "reqEndgames": 6,
    "goal": "Tactical Shield Package: QG vs Slav/Albin, Symmetrical English, Caro-Kann Advance, Anti-Sicilians (Alapin/Closed), and King+Pawn Opposition."
  },
  {
    "n": 3,
    "name": "Gold Knight",
    "mc": "Golden Sword",
    "icon": "⚔️",
    "color": "#eab308",
    "band": "OTB 850 · Classical 1500 · Rapid 1675 · Blitz 1400 · Puzzle 1850",
    "minR": 1550,
    "maxR": 1725,
    "otbBase": 850,
    "targets": {
      "otb": 850,
      "classical": 1500,
      "rapid": 1675,
      "blitz": 1400,
      "puzzle": 1850
    },
    "clearBonus": 600,
    "reqPuzzles": 80,
    "reqEndgames": 10,
    "goal": "Structure & Attack Package: Carlsbad Minority Attack, English vs KID, Caro-Kann Fantasy/Two Knights, Sicilian Grand Prix/Morra, and Rook Endgames."
  },
  {
    "n": 4,
    "name": "Diamond Commander",
    "mc": "Diamond Enchanted",
    "icon": "💎",
    "color": "#22d3ee",
    "band": "OTB 925 · Classical 1575 · Rapid 1725 · Blitz 1450 · Puzzle 1925",
    "minR": 1725,
    "maxR": 1900,
    "otbBase": 925,
    "targets": {
      "otb": 925,
      "classical": 1575,
      "rapid": 1725,
      "blitz": 1450,
      "puzzle": 1925
    },
    "clearBonus": 800,
    "reqPuzzles": 120,
    "reqEndgames": 15,
    "goal": "Tournament Weapon Package: Semi-Slav & Tarrasch, Catalan/Reti English, Caro-Kann Panov, Sicilian Dragon/Classical, and Lucena/Philidor mastery."
  },
  {
    "n": 5,
    "name": "Netherite Grandmaster",
    "mc": "Netherite Beacon",
    "icon": "🔥",
    "color": "#f43f5e",
    "band": "OTB 1000 · Classical 1650 · Rapid 1750 · Blitz 1500 · Puzzle 2000",
    "minR": 1900,
    "maxR": 2500,
    "otbBase": 1000,
    "targets": {
      "otb": 1000,
      "classical": 1650,
      "rapid": 1750,
      "blitz": 1500,
      "puzzle": 2000
    },
    "clearBonus": 1200,
    "reqPuzzles": 175,
    "reqEndgames": 20,
    "goal": "1000+ OTB Mastery Package: QG vs Indian Defenses, Maroczy/Hedgehog English, Tartakower/Karpov Caro-Kann, Sicilian Najdorf ...d5! break, and Endgame calculation."
  }
];

window.LESSONS = [
  {
    "id": "l1-qg",
    "l": 1,
    "cat": "White Core",
    "group": "core_white",
    "rep": "qg",
    "icon": "⚪",
    "title": "Queen's Gambit 1: QG Accepted & Orthodox Declined (1.d4 d5 2.c4)",
    "why": "Your #1 White weapon. 2.c4 attacks Black’s d5 center immediately—if Black takes (2...dxc4), you seize the full center with e3/e4 and recover the pawn with Bxc4.",
    "ideas": [
      "Against 2...dxc4 (QGA): play 3.Nf3 Nf6 4.e3 (or 3.e4!)—never panic about the c4 pawn; Bxc4 wins it right back with tempo.",
      "Warning Trap: If Black tries to cling to the c4 pawn with 3...b5?!, strike immediately with 4.a4 c6 5.axb5 cxb5 6.Qf3! winning a piece or rook!",
      "Against 2...e6 (QGD Orthodox): develop 3.Nc3 Nf6 4.Bg5 Be7 5.e3, putting pressure on d5 and pinning the f6 knight."
    ],
    "drill": "Play 4.a4! against Black’s greedy 3...b5 in the Queen’s Gambit Accepted.",
    "videos": [
      [
        "Saint Louis Chess Club: Queen’s Gambit Fundamentals",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+queens+gambit"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR_b_KQkq_-_0_2#explorer",
    "lichessLabel": "🌐 Practice QG in Lichess Explorer"
  },
  {
    "id": "l1-eng",
    "l": 1,
    "cat": "White Core",
    "group": "core_white",
    "rep": "eng",
    "icon": "⚪",
    "title": "English Opening 1: Reversed Sicilian & Botvinnik Setup (1.c4 e5)",
    "why": "Your #2 White weapon. 1.c4 controls d5 from the flank and steers the game into rich strategic waters where opponents lose their memorized lines.",
    "ideas": [
      "After 1.c4 e5 2.Nc3 Nf6 3.g3, fianchetto your bishop to g2—the g2 bishop and c4 pawn clamp down on the d5 square like a vise.",
      "Golden Square: Plant a knight on d5! Once your knight lands on d5, Black’s position is cramped.",
      "Botvinnik Triangle: c4 + d3 + e4 + g3 + Bg2 + Nge2 gives you a rock-solid center and a kingside f4 attack."
    ],
    "drill": "Fianchetto the king’s bishop to g2 and jump your knight into the d5 outpost.",
    "videos": [
      [
        "Saint Louis Chess Club: English Opening 1.c4",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+english+opening"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkbnr/pppp1ppp/8/4p3/2P5/2N5/PP1PPPPP/R1BQKBNR_b_KQkq_-_1_2#explorer",
    "lichessLabel": "🌐 Practice English 1.c4 on Lichess"
  },
  {
    "id": "l1-ck",
    "l": 1,
    "cat": "Black Core",
    "group": "core_black",
    "rep": "ck",
    "icon": "⚫",
    "title": "Caro-Kann 1: Classical & Exchange Variations (1.e4 c6 2.d4 d5)",
    "why": "Your #1 Black defense against 1.e4. 1...c6 prepares 2...d5 while keeping your light-squared c8-bishop completely free!",
    "ideas": [
      "Classical Variation (3.Nc3 dxe4 4.Nxe4): Always play 4...Bf5! (or 4...Nd7) to develop smoothly before playing ...e6.",
      "Warning Trap in Classical: After 4...Bf5 5.Ng3, ALWAYS drop the bishop back to 5...Bg6! so it stays safe on the h7-b1 diagonal.",
      "Exchange Variation (3.exd5 cxd5 4.Bd3): Develop 4...Nc6 5.c3 Nf6 6.Bf4 Bg4! neutralizing White’s bishops."
    ],
    "drill": "Play 4...Bf5! against 4.Nxe4 in the Classical Caro-Kann.",
    "videos": [
      [
        "Saint Louis Chess Club: Caro-Kann Defense",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+caro+kann"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR_w_KQkq_-_0_3?color=black#explorer",
    "lichessLabel": "🌐 Practice Caro-Kann on Lichess"
  },
  {
    "id": "l1-sic",
    "l": 1,
    "cat": "Black Core",
    "group": "core_black",
    "rep": "sic",
    "icon": "⚫",
    "title": "Sicilian 1: Open Sicilian Fundamentals & Trading c-Pawn for d-Pawn (1.e4 c5)",
    "why": "Your #2 Black weapon when you want to play for a dynamic win against 1.e4. 1...c5 trades a flank pawn for White’s central d4-pawn, giving Black two center pawns vs one!",
    "ideas": [
      "After 1.e4 c5 2.Nf3 d6 3.d4, ALWAYS capture 3...cxd4! 4.Nxd4 Nf6 5.Nc3—you now have the half-open c-file for your rooks and two center pawns (d+e vs e).",
      "Punishing early Bc4: If White plays an early Bc4, play ...e6 and ...a6/...b5 or ...d5 hitting the bishop with tempo!",
      "Never leave d5 unguarded without preparation—keep your pawns on d6/e6 (Scheveningen) or d6/g6 (Dragon)."
    ],
    "drill": "Trade your flank c5-pawn for White’s central d4-pawn and attack e4 with ...Nf6.",
    "videos": [
      [
        "Saint Louis Chess Club: Sicilian Defense Basics",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+sicilian+defense"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R_b_KQkq_-_0_3?color=black#explorer",
    "lichessLabel": "🌐 Practice Open Sicilian on Lichess"
  },
  {
    "id": "l1-cov",
    "l": 1,
    "cat": "Basic Coverage",
    "group": "basic",
    "icon": "🛡️",
    "title": "Basic Coverage 1: Crushing Early Queen Traps & defending 1.d4 as Black",
    "why": "In U900 tournaments, opponents try Scholar’s Mate (Qh5/Bc4) or early queen sorties. Refute them cleanly and play solid QGD (1.d4 d5 2.c4 e6) as Black!",
    "ideas": [
      "Against 1.e4 e5 2.Qh5: play 2...Nc6 3.Bc4 g6! 4.Qf3 Nf6—never play 2...g6?? (loses the rook to Qxe5+).",
      "In the Caro-Kann / Sicilian, Scholar’s Mate doesn’t even work because ...c6/...e6 or ...e6/...d6 blunts the c4-bishop!",
      "Against 1.d4 as Black: answer 1...d5 and 2...e6 (or 2...c6 Slav), keeping d5 supported by a pawn."
    ],
    "drill": "Shut down White’s 3.Bc4 Qh5 battery with 3...g6! and gain tempos on the exposed queen.",
    "videos": [
      [
        "Saint Louis Chess Club: Punishing Early Queen Attacks",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+scholars+mate"
      ]
    ],
    "lichessUrl": "https://lichess.org/training/opening",
    "lichessLabel": "🌐 Train Opening Traps on Lichess"
  },
  {
    "id": "l1-mid",
    "l": 1,
    "cat": "Middlegame",
    "group": "mid",
    "icon": "⚔️",
    "title": "Middlegame 1: The CCT Protocol, Double Attacks & Undefended Pieces",
    "why": "90% of games under 900 OTB are decided by hanging pieces and double attacks. Using Checks-Captures-Threats (CCT) on every turn eliminates 1-move blunders.",
    "ideas": [
      "Before touching a piece, scan opponent’s CCT first, then your own CCT.",
      "Loose Pieces Drop Off (LPDO): Circle every undefended enemy piece mentally—can a knight fork or queen double-attack hit two of them at once?",
      "Counting Defenders vs Attackers: Never capture unless Attackers > Defenders (or you win higher-value material)."
    ],
    "drill": "Spot the double attack on king and undefended piece.",
    "videos": [
      [
        "Saint Louis Chess Club: Undefended Pieces & Double Attacks",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+double+attacks+tactics"
      ]
    ],
    "lichessUrl": "https://lichess.org/training/fork",
    "lichessLabel": "🌐 Train Double Attacks & Forks on Lichess"
  },
  {
    "id": "l1-end",
    "l": 1,
    "cat": "Endgame",
    "group": "end",
    "icon": "♚",
    "drill_id": "kqk",
    "title": "Endgame 1: King + Queen & King + Rook Box Mates (Zero Stalemates)",
    "why": "Converting a won endgame cleanly in under 15 moves saves clock time and prevents tragic stalemates in tournament play.",
    "ideas": [
      "Queen Box Method: Place your Queen a knight’s move away from the enemy King to shrink his box to the edge.",
      "Freeze the Queen once the enemy King hits the edge (rank 8 or file a/h) with 2 squares left—walk your King up to deliver mate!",
      "Rook Box Method: Cut off the enemy King along a rank/file and use opposition to force him back rank by rank."
    ],
    "drill": "Deliver mate in 1 without stalemating.",
    "videos": [
      [
        "Saint Louis Chess Club: Basic Checkmates (K+Q & K+R)",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+basic+checkmates"
      ]
    ],
    "lichessUrl": "https://lichess.org/practice/checkmates/piece-checkmates-i/BJy6fEDf",
    "lichessLabel": "🌐 Practice K+Q & K+R Mates on Lichess"
  },
  {
    "id": "l2-qg",
    "l": 2,
    "cat": "White Core",
    "group": "core_white",
    "rep": "qg",
    "icon": "⚪",
    "title": "Queen's Gambit 2: Slav Defense (2...c6) & Refuting the Albin Countergambit",
    "why": "Many opponents play the Slav (2...c6) to support d5 without locking in their c8-bishop, or try the tricky Albin Countergambit (2...e5).",
    "ideas": [
      "Against the Slav (1.d4 d5 2.c4 c6): play 3.Nf3 Nf6 4.Nc3 dxc4 5.a4!—5.a4 stops ...b5 cold and guarantees you win back the c4 pawn with e4/Bxc4!",
      "Exchange Slav option: 3.cxd5 cxd5 4.Nc3 Nf6 5.Bf4 Nc6 6.e3 followed by Rc1 and Qb3 hitting b7.",
      "Against Albin Countergambit (1.d4 d5 2.c4 e5): take 3.dxe5 d4 4.Nf3! Nc6 5.g3 (or 5.Nbd2)—never play 4.e3? Bb4+ Bd2 dxe3! (Lasker Trap)."
    ],
    "drill": "Play 5.a4! in the Main Line Slav to prevent Black from holding the c4 pawn with ...b5.",
    "videos": [
      [
        "Saint Louis Chess Club: How to Play Against the Slav Defense",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+slav+defense"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkbnr/pp2pppp/2p5/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R_b_KQkq_-_1_3#explorer",
    "lichessLabel": "🌐 Practice QG vs Slav on Lichess"
  },
  {
    "id": "l2-eng",
    "l": 2,
    "cat": "White Core",
    "group": "core_white",
    "rep": "eng",
    "icon": "⚪",
    "title": "English Opening 2: Symmetrical English (1.c4 c5) & Early d4 Break",
    "why": "When Black copies you with 1...c5, knowing how to break the symmetry first gives White the initiative.",
    "ideas": [
      "After 1.c4 c5 2.Nf3 Nf6 3.Nc3 Nc6, strike in the center with 4.g3 d5 5.cxd5 Nxd5 6.Bg2!—your g2 bishop lasers the d5 knight and long diagonal.",
      "Rubinstein / Maroczy jump: If Black plays 6...Nc7, develop 7.O-O e5 8.d3 Be7 9.Nd2-c4! eyeing d6 and b6.",
      "Trap: If Black gets careless on the a8-h1 diagonal, Nxd5 followed by Qa4+ or Nxe5 wins material via discovered attack from Bg2!"
    ],
    "drill": "Use the Bg2 long-diagonal pin/discovery in the Symmetrical English.",
    "videos": [
      [
        "Saint Louis Chess Club: Symmetrical English Opening",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+symmetrical+english"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkbnr/pp1ppppp/8/2p5/2P5/2N5/PP1PPPPP/R1BQKBNR_b_KQkq_-_1_2#explorer",
    "lichessLabel": "🌐 Practice Symmetrical English on Lichess"
  },
  {
    "id": "l2-ck",
    "l": 2,
    "cat": "Black Core",
    "group": "core_black",
    "rep": "ck",
    "icon": "⚫",
    "title": "Caro-Kann 2: Advance Variation (3.e5 Bf5) & The ...c5 Counterstrike",
    "why": "The Advance Variation (1.e4 c6 2.d4 d5 3.e5) is White’s most popular try against the Caro-Kann. You crush it by developing ...Bf5 and undermining d4 with ...c5!",
    "ideas": [
      "Always play 3...Bf5! immediately so your light-squared bishop gets outside the pawn chain before 4...e6.",
      "After 4.Nf3 e6 5.Be2, strike at the base of White’s pawn chain with 5...c5! followed by ...Nc6 and ...Qb6 putting maximum pressure on d4 and b2.",
      "Short Trap Defense: If White plays the aggressive 4.Nc3 e6 5.g4, calmly drop back 5...Bg6 6.Nge2 c5! counterattacking the center while White’s kingside is weakened."
    ],
    "drill": "Strike at the base of White’s d4-e5 chain with ...c5! in the Advance Caro-Kann.",
    "videos": [
      [
        "Saint Louis Chess Club: Caro-Kann Advance Variation",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+caro+kann+advance"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR_b_KQkq_-_0_3?color=black#explorer",
    "lichessLabel": "🌐 Practice Caro-Kann Advance on Lichess"
  },
  {
    "id": "l2-sic",
    "l": 2,
    "cat": "Black Core",
    "group": "core_black",
    "rep": "sic",
    "icon": "⚫",
    "title": "Sicilian 2: Beating the Alapin (2.c3) & Closed Sicilian (2.Nc3)",
    "why": "Over half of scholastic players avoid the Open Sicilian with 2.c3 (Alapin) or 2.Nc3 (Closed). Knowing the exact antidote gives Black effortless equality or better!",
    "ideas": [
      "Against 2.c3 (Alapin): Strike back in the center immediately with 2...Nf6! 3.e5 Nd5 4.d4 cxd4 5.cxd4 d6 (or 2...d5! 3.exd5 Qxd5 4.d4 Nf6).",
      "Why 2...Nf6 works: White wanted to build a d4+e4 pawn center, and 2...Nf6 forces e4 forward to e5 where it becomes a target!",
      "Against 2.Nc3 (Closed Sicilian): Fianchetto with 2...Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 and expand on the queenside with ...Rb8 and ...b5-b4!"
    ],
    "drill": "Meet the Alapin Sicilian (1.e4 c5 2.c3) with 2...Nf6! or 2...d5! challenging the center immediately.",
    "videos": [
      [
        "Saint Louis Chess Club: Beating the Alapin Sicilian 2.c3",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+alapin+sicilian"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkbnr/pp1ppppp/8/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR_b_KQkq_-_0_2?color=black#explorer",
    "lichessLabel": "🌐 Practice Anti-Sicilian (Alapin) on Lichess"
  },
  {
    "id": "l2-cov",
    "l": 2,
    "cat": "Basic Coverage",
    "group": "basic",
    "icon": "🛡️",
    "title": "Basic Coverage 2: Neutralizing the London System & Fried Liver Trap",
    "why": "Two of the most common scholastic weapons you will face are the London System (1.d4 + 2.Bf4) and the Fried Liver (Ng5). Here is how to crush both.",
    "ideas": [
      "Against the London System (1.d4 d5 2.Bf4): Play 2...c5! 3.e3 Nc6 4.Nf3 Nf6 and ...Qb6! hitting the unprotected b2 pawn now that the c1-bishop left home!",
      "If you ever play 1...e5 and face the Fried Liver (4.Ng5): play 4...d5 5.exd5 Na5! (Polerio Defense), kicking the c4 bishop and taking over the initiative.",
      "Even better: your Caro-Kann (1...c6) and Sicilian (1...c5) completely prevent the Fried Liver from ever appearing on the board!"
    ],
    "drill": "Counterattack the London System with ...c5 and ...Qb6 hitting b2 and d4.",
    "videos": [
      [
        "Saint Louis Chess Club: Crushing the London System",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+beat+the+london+system"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R_b_KQkq_-_2_3?color=black#explorer",
    "lichessLabel": "🌐 Practice vs London System on Lichess"
  },
  {
    "id": "l2-mid",
    "l": 2,
    "cat": "Middlegame",
    "group": "mid",
    "icon": "⚔️",
    "title": "Middlegame 2: Pins, Skewers, Discovered Attacks & Removing the Guard",
    "why": "At the 1400–1600 Lichess level, tactics are 2-move combinations: pin a defender, remove the guard, or unleash a discovered check.",
    "ideas": [
      "Put Pressure on the Pinned Piece (PPonnthePP): Don’t cash in a pin immediately—pile another pawn or piece onto the pinned target until it collapses.",
      "Removing the Guard: If an enemy knight defends a mate square or loose bishop, capture or deflect that knight first!",
      "Discovered Attack: Move the front piece with check or a threat so the bishop/rook/queen behind it wins a free piece."
    ],
    "drill": "Remove the guard or unleash a discovered attack to win material.",
    "videos": [
      [
        "Saint Louis Chess Club: Pins, Skewers & Discovered Attacks",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+pins+skewers+discovered+attacks"
      ]
    ],
    "lichessUrl": "https://lichess.org/training/pin",
    "lichessLabel": "🌐 Train Pins, Skewers & Discovered Attacks on Lichess"
  },
  {
    "id": "l2-end",
    "l": 2,
    "cat": "Endgame",
    "group": "end",
    "icon": "♚",
    "drill_id": "krk",
    "title": "Endgame 2: King & Pawn Endgames — The Rule of the Square & Direct Opposition",
    "why": "Every Queen’s Gambit and Caro-Kann endgame boils down to whether a single extra pawn can promote. Knowing Opposition and Key Squares tells you with 100% certainty.",
    "ideas": [
      "Direct Opposition: Kings face each other with 1 square in between—the player who does NOT have to move holds the opposition and forces the other King to yield.",
      "King IN FRONT of the Pawn: Always march your King ahead of your passed pawn to control the 3 Key Squares two ranks in front of the pawn.",
      "Rule of the Square: Draw a diagonal from the pawn to the 8th rank—if the enemy King cannot step inside that square on his turn, the pawn queens by force!"
    ],
    "drill": "Seize the opposition so your passed pawn promotes cleanly.",
    "videos": [
      [
        "Saint Louis Chess Club: King and Pawn Endgames & Opposition",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+king+and+pawn+endgames+opposition"
      ]
    ],
    "lichessUrl": "https://lichess.org/practice/pawn-endgames/key-squares/XP6RVc2B",
    "lichessLabel": "🌐 Practice King & Pawn Endgames on Lichess"
  },
  {
    "id": "l3-qg",
    "l": 3,
    "cat": "White Core",
    "group": "core_white",
    "rep": "qg",
    "icon": "⚪",
    "title": "Queen's Gambit 3: The Exchange QGD, Carlsbad Structure & Minority Attack",
    "why": "The Exchange Variation of the Queen’s Gambit Declined (1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.cxd5 exd5) is one of the most deadly positional weapons in chess.",
    "ideas": [
      "After 4.cxd5 exd5 5.Bg5 Be7 6.e3 c6 7.Bd3, we reach the famous Carlsbad Pawn Structure.",
      "The Minority Attack: Push your 2 queenside pawns (b2-b4-b5!) against Black’s 3 queenside pawns (a7, b7, c6) to create a permanent weak backward/isolated pawn on c6 or d5!",
      "Botvinnik Plan: You can also play Nge2, f3, and e4! to blow open the center while Black is passive."
    ],
    "drill": "Launch the classic Minority Attack with b4-b5! to saddle Black with a weak c6 pawn.",
    "videos": [
      [
        "Saint Louis Chess Club: Carlsbad Structure & Minority Attack",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+carlsbad+structure+minority+attack"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR_w_KQkq_-_2_4#explorer",
    "lichessLabel": "🌐 Practice Carlsbad QGD on Lichess"
  },
  {
    "id": "l3-eng",
    "l": 3,
    "cat": "White Core",
    "group": "core_white",
    "rep": "eng",
    "icon": "⚪",
    "title": "English Opening 3: English vs King’s Indian Setup (...Nf6, ...g6, ...Bg7)",
    "why": "Many Black players fianchetto automatically (...Nf6, ...g6, ...Bg7). In the English, you keep the center closed or expand on the queenside with Rb1 and b4-b5!",
    "ideas": [
      "Queenside Expansion: Place your bishop on g2, play d3, Rb1, and push b2-b4-b5! while your g2-bishop supports the attack from afar.",
      "Why it crushes KID players: King’s Indian players want White to commit d4+e4 so they can attack the kingside with ...f5. By keeping d3 and pushing b4-b5, Black’s g7-bishop bites on granite!",
      "Botvinnik Clamp: Put pawns on c4, d3, e4 and a knight on d5—Black has zero counterplay."
    ],
    "drill": "Prepare and launch the b4! queenside expansion with Rb1 in the English Fianchetto.",
    "videos": [
      [
        "Saint Louis Chess Club: English Opening Queenside Play",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+english+opening+g3+bg2"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkb1r/pppppp1p/5np1/8/2P5/2N3P1/PP1PPP1P/R1BQKBNR_b_KQkq_-_0_3#explorer",
    "lichessLabel": "🌐 Practice English vs KID on Lichess"
  },
  {
    "id": "l3-ck",
    "l": 3,
    "cat": "Black Core",
    "group": "core_black",
    "rep": "ck",
    "icon": "⚫",
    "title": "Caro-Kann 3: Refuting the Fantasy Variation (3.f3) & Two Knights (2.Nc3 d5 3.Nf3)",
    "why": "Tricky 1500+ players try 3.f3 (Fantasy Variation) to keep a big pawn center, or 2.Nc3 d5 3.Nf3 (Two Knights). Here is the exact punishment for both.",
    "ideas": [
      "Against 3.f3 (Fantasy): Play 3...dxe4 4.fxe4 e5!—strike the center immediately while White’s f-file/e1-h4 diagonal is wide open to ...Qh4+!",
      "Fantasy Trap: After 3...dxe4 4.fxe4 e5 5.dxe5??, 5...Qh4+! 6.Ke2 Qxe4+ or 6.g3 Qxe4+ forks the King and h1-rook!",
      "Against Two Knights (2.Nc3 d5 3.Nf3): Play 3...Bg4! 4.h3 Bxf3 5.Qxf3 e6, giving Black an ironclad dark-square grip on d5 and e6."
    ],
    "drill": "Strike with 4...e5! against the Fantasy Caro-Kann (1.e4 c6 2.d4 d5 3.f3 dxe4 4.fxe4).",
    "videos": [
      [
        "Saint Louis Chess Club: Caro-Kann Fantasy & Two Knights",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+caro+kann+fantasy+variation"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkbnr/pp2pppp/2p5/3p4/3PP3/5P2/PPP3PP/RNBQKBNR_b_KQkq_-_0_3?color=black#explorer",
    "lichessLabel": "🌐 Practice Caro-Kann Fantasy/2N on Lichess"
  },
  {
    "id": "l3-sic",
    "l": 3,
    "cat": "Black Core",
    "group": "core_black",
    "rep": "sic",
    "icon": "⚫",
    "title": "Sicilian 3: Crushing the Grand Prix Attack (2.f4) & Smith-Morra Gambit",
    "why": "Aggressive club players love 2.f4 (Grand Prix Attack) or 2.d4 cxd4 3.c3 (Smith-Morra Gambit). Neutralizing both turns their gambit into a lost endgame!",
    "ideas": [
      "Against the Grand Prix Attack (1.e4 c5 2.Nc3 Nc6 3.f4): Play 3...g6 4.Nf3 Bg7 5.Bb5 Nd4!—jump into d4 to trade off their dangerous light-squared bishop and follow with ...e6 and ...Ne7/...d5!",
      "Rule vs Kingside Attack: Counterattack in the center with ...d5! or on the queenside with ...Rb8 and ...b5.",
      "Against Smith-Morra Gambit (2.d4 cxd4 3.c3): Either decline cleanly with 3...Nf6! 4.e5 Nd5 (transposing directly into your Alapin repertoire!) or accept and setup ...d6, ...e6, ...Ne7-g6."
    ],
    "drill": "Use 3...Nf6! against the Smith-Morra Gambit to transpose directly into your winning Alapin setup.",
    "videos": [
      [
        "Saint Louis Chess Club: Beating the Grand Prix & Morra Gambit",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+grand+prix+attack+smith+morra"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/r1bqkbnr/pp1ppppp/2n5/2p5/4PP2/2N5/PPPP2PP/R1BQKBNR_b_KQkq_-_0_3?color=black#explorer",
    "lichessLabel": "🌐 Practice vs Grand Prix/Morra on Lichess"
  },
  {
    "id": "l3-cov",
    "l": 3,
    "cat": "Basic Coverage",
    "group": "basic",
    "icon": "🛡️",
    "title": "Basic Coverage 3: Defeating the Scotch Game, Italian Giuoco Piano & Trompowsky",
    "why": "Knowing how to handle 1.d4 Nf6 2.Bg5 (Trompowsky) and central 1.e4/1.d4 sidelines keeps your tournament repertoire airtight.",
    "ideas": [
      "Against Trompowsky (1.d4 Nf6 2.Bg5): Play 2...d5! (or 2...Ne4 3.Bf4 d5) seizing the center immediately.",
      "Against Queen’s Pawn Colle/Torre setups: Always break with ...c5! and ...Nc6—never let White build a free kingside attack without challenging d4.",
      "When playing White against 1.d4 Nf6 2.c4 e6: You can steer straight into your Queen’s Gambit Declined with 3.Nf3 d5!"
    ],
    "drill": "Challenge White’s center with ...c5! against passive Queen’s Pawn systems.",
    "videos": [
      [
        "Saint Louis Chess Club: Beating Sidelines in d4",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+trompowsky+colle"
      ]
    ],
    "lichessUrl": "https://lichess.org/training/opening",
    "lichessLabel": "🌐 Train Opening Sidelines on Lichess"
  },
  {
    "id": "l3-mid",
    "l": 3,
    "cat": "Middlegame",
    "group": "mid",
    "icon": "⚔️",
    "title": "Middlegame 3: Open Files, 7th-Rank Pigs & The Isolated Queen’s Pawn (IQP)",
    "why": "Both the Queen’s Gambit, Caro-Kann Panov, and Alapin Sicilian frequently produce an Isolated Queen’s Pawn (IQP) on d4 or d5. Whoever understands the IQP wins.",
    "ideas": [
      "Playing WITH the IQP (d4): Use its space and e5/c5 support squares to attack the kingside with Bd3, Bc2, Qd3, and a timely d4-d5! breakthrough.",
      "Playing AGAINST the IQP: Blockade the square directly in front of the pawn (d5 or d4) with a Knight, trade minor pieces (keep rooks/endgame!), and win the isolated pawn.",
      "Rooks on Open Files & 7th Rank: Seize the open c- or d-file, double rooks (Alekhine’s Gun), and invade the 7th rank to gobble pawns."
    ],
    "drill": "Invade the 7th rank with your Rook or execute the thematic d4-d5! IQP breakthrough.",
    "videos": [
      [
        "Saint Louis Chess Club: Isolated Queen Pawn (IQP) Middlegames",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+isolated+queen+pawn"
      ]
    ],
    "lichessUrl": "https://lichess.org/training/middlegame",
    "lichessLabel": "🌐 Train Adaptive Middlegames on Lichess"
  },
  {
    "id": "l3-end",
    "l": 3,
    "cat": "Endgame",
    "group": "end",
    "icon": "♚",
    "title": "Endgame 3: Active Rooks, Passed Pawns & \"Rooks Belong Behind Passed Pawns\"",
    "why": "Over 50% of all tournament games that reach move 35 are Rook Endgames. Tarrasch’s Golden Rule wins or saves dozens of rating points.",
    "ideas": [
      "Tarrasch’s Rule: ALWAYS place your Rook BEHIND a passed pawn—yours or the opponent’s!",
      "Why behind? As the pawn advances, your rook’s scope grows longer, while a rook in front of a pawn gets squeezed into the corner.",
      "Active Rook > Passive Pawn Defense: Never put your rook in front of a weak pawn passively; activate it onto the 7th rank to counterattack!"
    ],
    "drill": "Put your Rook behind the passed a-pawn so it supports promotion all the way to a8.",
    "videos": [
      [
        "Saint Louis Chess Club: Rook Endgame Fundamentals",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+rook+endgames"
      ]
    ],
    "lichessUrl": "https://lichess.org/training/rookEndgame",
    "lichessLabel": "🌐 Train Rook Endgames on Lichess"
  },
  {
    "id": "l4-qg",
    "l": 4,
    "cat": "White Core",
    "group": "core_white",
    "rep": "qg",
    "icon": "⚪",
    "title": "Queen's Gambit 4: Semi-Slav (...e6 + ...c6) & Tarrasch Defense (...c5)",
    "why": "Against stronger players (1600+ Lichess / 900+ OTB), you will face the Semi-Slav triangle and the Tarrasch Defense. Both have clear strategic blueprints.",
    "ideas": [
      "Against the Semi-Slav (1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6): Play 5.e3! Nbd7 6.Bd3 (Meran) avoiding the chaotic Botvinnik/Moscow gambits while keeping a rock-solid center.",
      "After 6...dxc4 7.Bxc4 b5 8.Bd3 a6, play 9.e4! seizing the center right before Black completes ...c5.",
      "Against the Tarrasch (1.d4 d5 2.c4 e6 3.Nc3 c5): Play 4.cxd5 exd5 5.Nf3 Nc6 6.g3! Nf6 7.Bg2—your g2-bishop lasers Black’s Isolated Queen’s Pawn on d5!"
    ],
    "drill": "Play 9.e4! in the Meran Semi-Slav to seize full central control.",
    "videos": [
      [
        "Saint Louis Chess Club: Queen’s Gambit vs Semi-Slav & Tarrasch",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+semi+slav+tarrasch"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R_w_KQkq_-_0_5#explorer",
    "lichessLabel": "🌐 Practice QG vs Semi-Slav/Tarrasch on Lichess"
  },
  {
    "id": "l4-eng",
    "l": 4,
    "cat": "White Core",
    "group": "core_white",
    "rep": "eng",
    "icon": "⚪",
    "title": "English Opening 4: Catalan / Reti Style vs ...e6 & ...d5 Setups",
    "why": "When Black plays 1...e6 and 2...d5 against 1.c4, keeping your g2-bishop pointed at the queenside creates the famous Catalan/English squeeze.",
    "ideas": [
      "After 1.c4 e6 2.Nc3 d5 3.d4 (or 2.Nf3 d5 3.g3 Nf6 4.Bg2), your g2-bishop x-rays Black’s entire queenside (d5, c6, b7, a8).",
      "Pressure on c5/d5: If Black takes ...dxc4, recover the pawn with Qa4+ and Qxc4 (or Nf3-e5) while your g2-bishop dominates.",
      "Double Fianchetto (b3 + Bb2 + g3 + Bg2): When Black plays a closed triangle (...c6, ...d5, ...e6), fianchetto BOTH bishops and break with cxd5 and e4!"
    ],
    "drill": "Use Qa4+ in the English/Catalan to recover the c4 pawn while keeping the long diagonal wide open.",
    "videos": [
      [
        "Saint Louis Chess Club: English & Catalan Long Diagonal Squeeze",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+english+catalan"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkb1r/ppp2ppp/4pn2/3p4/2P5/5NP1/PP1PPP1P/RNBQKB1R_w_KQkq_-_0_4#explorer",
    "lichessLabel": "🌐 Practice Catalan/English on Lichess"
  },
  {
    "id": "l4-ck",
    "l": 4,
    "cat": "Black Core",
    "group": "core_black",
    "rep": "ck",
    "icon": "⚫",
    "title": "Caro-Kann 4: Neutralizing the Panov-Botvinnik Attack (3.exd5 cxd5 4.c4)",
    "why": "Strong Queen’s Gambit players often meet the Caro-Kann with the Panov Attack (3.exd5 cxd5 4.c4), creating an IQP Battle. Here is how Black turns tables.",
    "ideas": [
      "After 1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.Nc3, play 5...e6! (or 5...Nc6 6.Bg5 dxc4!)—if White plays 6.Nf3 Be7 7.cxd5, recapture with the KNIGHT (7...Nxd5!).",
      "Why 7...Nxd5! is so strong: It leaves White with the Isolated Queen’s Pawn on d4 while your Knight sits right on the d5 blockade square!",
      "Trade off one or two pairs of minor pieces and White’s d4 pawn becomes a permanent endgame target."
    ],
    "drill": "Recapture with 7...Nxd5! in the Panov-Botvinnik Attack to blockade White’s isolated d4 pawn.",
    "videos": [
      [
        "Saint Louis Chess Club: Caro-Kann Panov-Botvinnik Attack",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+caro+kann+panov"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkbnr/pp2pppp/2p5/8/2pP4/8/PP3PPP/RNBQKBNR_w_KQkq_-_0_4?color=black#explorer",
    "lichessLabel": "🌐 Practice Caro-Kann Panov on Lichess"
  },
  {
    "id": "l4-sic",
    "l": 4,
    "cat": "Black Core",
    "group": "core_black",
    "rep": "sic",
    "icon": "⚫",
    "title": "Sicilian 4: Dragon / Classical Setup & The ...Rxc3! Exchange Sacrifice",
    "why": "In the Open Sicilian, Black’s counterattack down the half-open c-file (...Rc8, ...Qa5, and the famous ...Rxc3! sacrifice) is one of chess’s deadliest weapons.",
    "ideas": [
      "After 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6 (Dragon) or 5...Nc6 (Classical), place your rook on c8 and knight on c6/e5.",
      "The Thematic Sicilian Exchange Sacrifice (...Rxc3! bxc3 ...Nxe4 or ...Qxc3): Shaking White’s defender of e4 and shattering White’s queenside pawns into islands!",
      "Opposite-Side Castling Race: If White castles queenside (O-O-O), never waste moves on slow prophylaxis—attack c3/b2 immediately with ...Rc8, ...Qa5, and ...b5!"
    ],
    "drill": "Unleash the thematic Sicilian counterattack down the c-file.",
    "videos": [
      [
        "Saint Louis Chess Club: Sicilian Dragon & c-File Counterattacks",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+sicilian+dragon"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R_w_KQkq_-_0_6?color=black#explorer",
    "lichessLabel": "🌐 Practice Sicilian Dragon/Classical on Lichess"
  },
  {
    "id": "l4-cov",
    "l": 4,
    "cat": "Basic Coverage",
    "group": "basic",
    "icon": "🛡️",
    "title": "Basic Coverage 4: King’s Indian Defense & Benoni Antidotes",
    "why": "When you play 1.d4 or 1.c4, aggressive opponents try the King’s Indian (...g6/...e5) or Benoni (...c5). Knowing the Classical Bayonet / Gligoric structure keeps you in command.",
    "ideas": [
      "Against the King’s Indian (1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5): Castling 7.O-O and attacking on the queenside with c4-c5! (while Black attacks on the kingside) is a race White wins by crashing through c6/d6.",
      "Even simpler: Exchange 7.dxe5 dxe5 8.Qxd8 Rxd8 9.Bg5! (Petrosian/Exchange KID)—without Queens on the board, Black has ZERO kingside mate and a weak d5 square!",
      "Against the Benoni (1.d4 Nf6 2.c4 c5): Push 3.d5! seizing space and clamp down with Nc3, e4, and Nf3-d2-c4 targeting the backward d6 pawn."
    ],
    "drill": "Seize space with 3.d5! when Black plays the Benoni (1.d4 Nf6 2.c4 c5).",
    "videos": [
      [
        "Saint Louis Chess Club: Beating the King’s Indian & Benoni",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+beating+kings+indian+benoni"
      ]
    ],
    "lichessUrl": "https://lichess.org/training/hangingPiece",
    "lichessLabel": "🌐 Train Gambits & Hanging Pieces on Lichess"
  },
  {
    "id": "l4-mid",
    "l": 4,
    "cat": "Middlegame",
    "group": "mid",
    "icon": "⚔️",
    "title": "Middlegame 4: Greek Gift (Bxh7+), Deflection & Opposite-Side Castling",
    "why": "To cross 1700 Lichess and 925+ OTB, you must calculate 3-move sacrifices and recognize the classical Bxh7+ Greek Gift pattern instantly.",
    "ideas": [
      "Greek Gift Checklist (Bxh7+): Works when 1) Black has NO knight on f6, 2) your Bishop hits h7, 3) your Knight can jump Ng5+, and 4) your Queen can land on h5!",
      "Deflection / Overloading: When one enemy Queen or Rook guards both back-rank mate and a piece, sacrifice/attack to force it away from its defensive duty.",
      "Good Knight vs Bad Bishop: Lock enemy pawns on the same color as their remaining bishop, then outmaneuver it with a centralized Knight."
    ],
    "drill": "Execute the classic Bxh7+! Greek Gift sacrifice when Black’s f6 knight is absent.",
    "videos": [
      [
        "Saint Louis Chess Club: Greek Gift Sacrifice Bxh7+",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+greek+gift+sacrifice"
      ]
    ],
    "lichessUrl": "https://lichess.org/training/kingsideAttack",
    "lichessLabel": "🌐 Train Outposts & Kingside Attacks on Lichess"
  },
  {
    "id": "l4-end",
    "l": 4,
    "cat": "Endgame",
    "group": "end",
    "icon": "♚",
    "title": "Endgame 4: The Two Essential Rook Positions — Lucena (Win) & Philidor (Draw)",
    "why": "Every master knows two exact Rook Endgame blueprints: \"Building a Bridge\" (Lucena) to win a pawn up, and the \"3rd Rank Defense\" (Philidor) to save a pawn down.",
    "ideas": [
      "Lucena Position (Winning): Your pawn is on the 7th rank with your King in front of it. Play Rook to the 4th rank! Then walk your King out—when checks run out, your Rook drops in to block (\"building a bridge\").",
      "Philidor Position (Drawing): Keep your defending Rook on the 6th rank (their 3rd rank) so the enemy King CANNOT cross to the 6th rank. The moment they push the pawn to the 6th, drop your Rook to the 1st rank and check from behind forever!",
      "Outside Passed Pawn: Use a wing pawn as a decoy to drag the enemy King away from the main pawn cluster."
    ],
    "drill": "Build the Lucena Bridge on the 4th rank, and apply the Philidor 6th-rank barrier.",
    "videos": [
      [
        "Saint Louis Chess Club: Lucena and Philidor Positions",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+lucena+philidor"
      ]
    ],
    "lichessUrl": "https://lichess.org/practice/rook-endgames/7th-rank-rook-pawn/5c42B5Xg",
    "lichessLabel": "🌐 Practice Lucena & Philidor on Lichess"
  },
  {
    "id": "l5-qg",
    "l": 5,
    "cat": "White Core",
    "group": "core_white",
    "rep": "qg",
    "icon": "⚪",
    "title": "Queen's Gambit 5: Mastering Indian Systems (Nimzo-Indian, QID & Grünfeld)",
    "why": "At the 1000+ OTB / 1750+ Lichess level, opponents answer 1.d4 Nf6 2.c4 with 2...e6 (Nimzo/Queen’s Indian) or 2...g6 3...d5 (Grünfeld). Here is your grandmaster playbook.",
    "ideas": [
      "Against Nimzo-Indian (1.d4 Nf6 2.c4 e6 3.Nc3 Bb4): Play 4.e3! (Rubinstein System) O-O 5.Bd3 d5 6.Nf3—super solid, develops fast, and builds a massive center if Black trades ...Bxc3+ bxc3.",
      "Or use the 3.Nf3! move order: 1.d4 Nf6 2.c4 e6 3.Nf3! preventing 3...Bb4 completely and meeting 3...b6 (Queen’s Indian) with 4.g3! fighting for the long diagonal.",
      "Against the Grünfeld (1.d4 Nf6 2.c4 g6 3.Nc3 d5): Play 4.cxd5 Nxd5 5.e4 Nxc3 6.bxc3 Bg7 7.Bc4 + Ne2! (putting the knight on e2 so ...Bg4 cannot pin it!)."
    ],
    "drill": "Play 4.e3! in the Rubinstein Nimzo-Indian or 4.cxd5! in the Exchange Grünfeld.",
    "videos": [
      [
        "Saint Louis Chess Club: Playing Against Nimzo-Indian & Grünfeld",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+nimzo+indian+grunfeld"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR_w_KQkq_-_2_4#explorer",
    "lichessLabel": "🌐 Practice QG vs Nimzo/KID on Lichess"
  },
  {
    "id": "l5-eng",
    "l": 5,
    "cat": "White Core",
    "group": "core_white",
    "rep": "eng",
    "icon": "⚪",
    "title": "English Opening 5: The Maroczy Bind (c4 + e4) & Crushing the Hedgehog",
    "why": "The crown jewel of the English Opening is the Maroczy Bind (pawns on c4 and e4 after Black trades ...cxd4). It clamps d5 and b5 so tightly Black can barely breathe.",
    "ideas": [
      "Forming the Maroczy Bind: Whenever Black plays an early ...c5 or ...g6 and opens the d-file with ...cxd4 Nxd4, play e4! alongside your c4 pawn.",
      "Why c4 + e4 is so dominant: Black can never play the liberating ...d5 or ...b5 breaks without losing a pawn!",
      "Squeeze Plan: Tuck your knight back from d4 to c2, put bishops on e3 and e2/g2, double rooks on the d-file, and slowly suffocate Black’s Hedgehog."
    ],
    "drill": "Establish the Maroczy Bind (c4 + e4) to lock down d5 and b5.",
    "videos": [
      [
        "Saint Louis Chess Club: Maroczy Bind Mastery",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+maroczy+bind"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkbnr/pp2pppp/3p4/8/2PNP3/8/PP3PPP/RNBQKB1R_b_KQkq_-_0_4#explorer",
    "lichessLabel": "🌐 Practice Maroczy Bind on Lichess"
  },
  {
    "id": "l5-ck",
    "l": 5,
    "cat": "Black Core",
    "group": "core_black",
    "rep": "ck",
    "icon": "⚫",
    "title": "Caro-Kann 5: Tartakower (4...Nf6) & Karpov (4...Nd7) GM Endgame Squeezes",
    "why": "World Champion Anatoly Karpov and top GMs use the Karpov (4...Nd7) and Tartakower (4...Nf6 5.Nxf6+ exf6) Caro-Kann to grind out virtually risk-free wins.",
    "ideas": [
      "Tartakower System (1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nf6! 5.Nxf6+ exf6): Recapturing 5...exf6 opens the e-file immediately, gives ...Bd6 + ...O-O + ...Re8 in 3 moves, and controls e5/d5!",
      "Karpov System (4...Nd7 5.Ng5 Ngf6! 6.Bd3 e6 7.N1f3 Bd6): Note the famous trap—after 5.Ng5, NEVER play 5...h6?? (6.Ne6! fxe6 7.Qh5#)—always play 5...Ngf6!",
      "Endgame Edge: Black’s queenside pawn structure (a7-b7-c6) is one solid island, giving Black superior late-middlegame and endgame prospects."
    ],
    "drill": "Defend accurately with 5...Ngf6! against 5.Ng5 in the Karpov Caro-Kann (avoiding the 5...h6?? 6.Ne6! smothered mate trap).",
    "videos": [
      [
        "Saint Louis Chess Club: Tartakower & Karpov Caro-Kann",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+tartakower+karpov+caro+kann"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rn1qkbnr/pp2pppp/2p5/5b2/3PN3/8/PPP2PPP/R1BQKBNR_w_KQkq_-_1_5?color=black#explorer",
    "lichessLabel": "🌐 Practice Karpov/Tartakower Caro-Kann on Lichess"
  },
  {
    "id": "l5-sic",
    "l": 5,
    "cat": "Black Core",
    "group": "core_black",
    "rep": "sic",
    "icon": "⚫",
    "title": "Sicilian 5: Najdorf / Scheveningen (...a6 / ...e6) & The Liberating ...d5! Break",
    "why": "The Sicilian Najdorf (5...a6) and Scheveningen (...d6 + ...e6) were the favorite weapons of Bobby Fischer and Garry Kasparov. Their secret goal is the central ...d5! break.",
    "ideas": [
      "After 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6! (Najdorf), 5...a6 stops Nb5/Bb5+ and prepares ...e5 or ...e6 + ...b5!",
      "Golden Rule of the Sicilian: Whenever Black successfully plays ...d5! without tactical punishment, Black is already equal or better!",
      "Against English Attack (Be3, f3, Qd2, g4): Counterattack immediately with ...b5, ...Bb7, ...Rc8, and ...d5! in the center."
    ],
    "drill": "Play 5...a6! in the Najdorf Sicilian and unleash the liberating ...d5! central break.",
    "videos": [
      [
        "Saint Louis Chess Club: Sicilian Najdorf & The d5 Break",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+sicilian+najdorf"
      ]
    ],
    "lichessUrl": "https://lichess.org/analysis/standard/rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R_w_KQkq_-_0_6?color=black#explorer",
    "lichessLabel": "🌐 Practice Sicilian Najdorf on Lichess"
  },
  {
    "id": "l5-cov",
    "l": 5,
    "cat": "Basic Coverage",
    "group": "basic",
    "icon": "🛡️",
    "title": "Basic Coverage 5: Handling the Dutch Defense (1...f5) & Benko Gambit",
    "why": "Rounding out your 1000+ OTB tournament shield: knowing how to punish the Dutch Defense (1.d4 f5) and Benko Gambit (3...b5) ensures no sideline catches you off guard.",
    "ideas": [
      "Against the Dutch Defense (1.d4 f5): Play 2.g3! Nf6 3.Bg2 e6 4.Nf3 Be7 5.O-O O-O 6.c4—your g2-bishop cuts straight through Black’s weakened e8-h5/a8-h1 diagonals.",
      "Against the Benko Gambit (1.d4 Nf6 2.c4 c5 3.d5 b5): Either decline solidly with 4.Nf3! (or 4.cxb5 a6 5.b6! returning the pawn to keep the queenside closed!).",
      "Why 5.b6! crushes Benko players: Benko players only want open a- and b-files for their rooks—5.b6! gives the pawn back to keep the a-file locked!"
    ],
    "drill": "Play 5.b6! against the Benko Gambit to shut down Black’s open queenside files.",
    "videos": [
      [
        "Saint Louis Chess Club: Beating the Dutch & Benko Gambit",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+beating+dutch+benko+gambit"
      ]
    ],
    "lichessUrl": "https://lichess.org/training/crushing",
    "lichessLabel": "🌐 Train Positional Crushers on Lichess"
  },
  {
    "id": "l5-mid",
    "l": 5,
    "cat": "Middlegame",
    "group": "mid",
    "icon": "⚔️",
    "title": "Middlegame 5: Prophylaxis (\"What Is My Opponent’s Idea?\"), Zwischenzug & Endgame Transition",
    "why": "The single biggest leap from 800 OTB to 1100+ OTB is asking \"What does my opponent want to do next?\" (Prophylaxis) and spotting in-between moves (Zwischenzug).",
    "ideas": [
      "Karpov’s Prophylaxis Habit: Before executing your own plan, identify your opponent’s #1 active idea and stop it cold.",
      "Zwischenzug (In-Between Move): When an exchange starts, ALWAYS check if you can insert a check or attack on a higher-value piece before recapturing!",
      "Simplifying When Ahead: When up +2 or more points, trade PIECES (especially Queens!)—when behind, trade PAWNS and keep pieces on the board."
    ],
    "drill": "Insert a lethal Zwischenzug (in-between check) before recapturing.",
    "videos": [
      [
        "Saint Louis Chess Club: Prophylaxis & Zwischenzug",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+prophylaxis+zwischenzug"
      ]
    ],
    "lichessUrl": "https://lichess.org/training/defensiveMove",
    "lichessLabel": "🌐 Train Prophylaxis & Defense on Lichess"
  },
  {
    "id": "l5-end",
    "l": 5,
    "cat": "Endgame",
    "group": "end",
    "icon": "♚",
    "title": "Endgame 5: Principle of Two Weaknesses, Zugzwang & Bishop of Opposite Colors",
    "why": "Against tough tournament defenders who hold one weakness, you win by creating a SECOND weakness on the opposite side of the board and using Zugzwang.",
    "ideas": [
      "Principle of Two Weaknesses: A defender can usually guard 1 weak pawn. Fix a 1st weakness on the queenside, then open a 2nd front on the kingside—stretching their pieces until one breaks!",
      "Zugzwang: Force a position where any legal move the opponent makes ruins their defense (use Triangulation with your King to lose a tempo and pass the move!).",
      "Opposite-Colored Bishops: In a pure endgame, opposite-colored bishops are drawish even 1–2 pawns down if you blockade on your bishop’s color; in the middlegame with Queens/Rooks, they favor the attacker!"
    ],
    "drill": "Put Black into Zugzwang so every legal move drops the defense.",
    "videos": [
      [
        "Saint Louis Chess Club: Principle of Two Weaknesses & Zugzwang",
        "https://www.youtube.com/results?search_query=saint+louis+chess+club+principle+of+two+weaknesses+zugzwang"
      ]
    ],
    "lichessUrl": "https://lichess.org/training/endgame",
    "lichessLabel": "🌐 Train Master Endgames on Lichess"
  }
];

window.RECOMMENDED = [
  [
    "Saint Louis Chess Club — GM Lectures & Kids Class",
    "https://www.youtube.com/@STLChessClub"
  ],
  [
    "Saint Louis Chess Club — Openings Playlist",
    "https://www.youtube.com/results?search_query=saint+louis+chess+club+openings+playlist"
  ],
  [
    "Saint Louis Chess Club — Endgame Fundamentals",
    "https://www.youtube.com/results?search_query=saint+louis+chess+club+endgame+fundamentals"
  ],
  [
    "Daniel Naroditsky — Speedrun & Endgame Mastery",
    "https://www.youtube.com/@DanielNaroditskyGM"
  ],
  [
    "Hanging Pawns — Caro-Kann, Sicilian, QG & English",
    "https://www.youtube.com/@HangingPawns"
  ]
];
