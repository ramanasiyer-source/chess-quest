/* Chess Quest v3 - 5 Master Levels, Weekly Goal Bonus/Penalty Engine, Lichess Auto-Star Sync, Repertoire Win Tracker & Google Sheet Sync */
(function () {
  const KEY = 'chessquest_v1';
  const TARGET = { p1: 600, p2: 600, p3: 600 };
  const MIN_FRAC = 0.8;
  const DEFAULT_PUZZLE_STAR_CAP = 200;
  const DEFAULT_ENDGAME_CAP = 10;
  const DEFAULT_SYNC_URL = 'https://script.google.com/macros/s/AKfycbxnUdMtHZZ39F8t4hp2QO-wIyQc5E-3w9oXeqH00iXuN9DwdcpPlbpy6pCWBBe0s-ag/exec';
  const DEFAULT_PIN = '2014';
  const MAX_LEVEL = 5;

  const pad = n => String(n).padStart(2, '0');
  const dstr = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const addDays = (s, n) => { const [y, m, d] = s.split('-').map(Number); return dstr(new Date(y, m - 1, d + n)); };
  const daysBetween = (a, b) => { const p = s => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); }; return Math.round((p(b) - p(a)) / 864e5); };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // Monday-based week start (YYYY-MM-DD of Monday)
  function weekStart(dateStr = dstr()) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const dow = dt.getDay(); // 0=Sun, 1=Mon, ...
    const diff = dow === 0 ? -6 : 1 - dow;
    return dstr(new Date(y, m - 1, d + diff));
  }

  const WEEKLY_TARGETS = {
    minutes: 210,        // 30 mins/day x 7 days
    classicalGames: 2,   // 2 Classical games/week
    rapidGames: 5,       // 5 Rapid games/week
    puzzles: 50,         // 50 puzzles/week (Lichess + App)
    theoryQuizzes: 3,    // 3 variation mastery exams/week (or 60m theory/endgames)
    theoryMinutes: 60,
    puzzleMinutes: 75,
  };

  const WEEKLY_MILESTONES = [
    { pct: 50, stars: 25, label: '🥉 50% Weekly Goal Checkpoint' },
    { pct: 75, stars: 50, label: '🥈 75% Weekly Home Stretch Bonus' },
    { pct: 100, stars: 100, label: '🥇 100% Weekly Goal Complete!' },
    { pct: 150, stars: 200, label: '🔥 150% Overdrive Double Bonus!' },
    { pct: 200, stars: 400, label: '💎 200% Netherite Beast Mode Jackpot!' },
  ];

  const DEFAULT_REWARDS = [
    { id: 'r1', icon: '📺', name: '30 min bonus watch time', cost: 100 },
    { id: 'r2', icon: '🎮', name: '30 min bonus gaming (Minecraft)', cost: 100 },
    { id: 'r3', icon: '🍕', name: 'Pick the family treat / dinner', cost: 150 },
    { id: 'r4', icon: '💵', name: '$5 to spend (Robux / LEGO / snacks)', cost: 200 },
    { id: 'r5', icon: '🎁', name: '$20 big prize fund', cost: 800 },
  ];

  const DEFAULT_PROFILE = () => ({
    fullName: 'Anish Ramana Iyer',
    title: 'Scholastic Contender · Skyview Middle School (6th Grade)',
    location: 'Bothell, WA',
    avatar: 'assets/anish-jacket.jpg',
    bio: 'Repertoire specialist (Queen’s Gambit & English | Caro-Kann & Sicilian) climbing toward 1000+ USCF/NWSRS.',
    ratings: {
      nwsrs: {
        label: 'NWChess (NWSRS)', current: 679, start: 679, peak: 732, target: 1000, id: '100854',
        url: 'https://www.nwchess.com/ratings/',
        history: [
          { date: '2026-05-01', r: 732, event: 'Spring Scholastic Rating' },
          { date: '2026-09-12', r: 679, event: 'WATA Autumn Scholastic (2.0/5)' },
        ],
      },
      uscf: {
        label: 'US Chess (USCF)', current: 463, start: 463, quick: 425, blitz: 425, onlineReg: 338, onlineQuick: 360, peak: 463, target: 1000, id: '17354281',
        url: 'https://www.uschess.org/msa/MbrDtlMain.php?17354281',
        history: [
          { date: '2026-05-16', r: 425, event: 'SPFNO Blitz (USCF Quick)' },
          { date: '2026-09-12', r: 463, event: 'WATA Autumn Scholastic (USCF Reg)' },
        ],
      },
      fide: {
        label: 'FIDE Standard', current: 0, start: 0, peak: 0, target: 1400, id: 'Unrated',
        url: 'https://ratings.fide.com/',
        history: [],
      },
      lichess: {
        label: 'Lichess (govindu)', current: 1611, start: 1500, puzzle: 1765, classical: 1255, blitz: 1210, bullet: 1058, peak: 1765,
        targetRapid: 1750, targetClassical: 1650, targetBlitz: 1500, targetPuzzle: 2000, target: 1750, id: 'govindu',
        url: 'https://lichess.org/@/govindu',
        history: [
          { date: '2026-09-01', r: 1500, pz: 1680, event: 'Baseline Lichess' },
          { date: '2026-11-13', r: 1581, pz: 1765, event: 'Live Lichess (94 Rapid / 2,303 Puzzles)' },
          { date: '2026-11-14', r: 1611, pz: 1765, event: 'Lichess Rapid Climb (1611)' },
        ],
      },
    },
    tournaments: [
      { id: 't-spfno2', date: '2026-11-07', name: '21st Susan Polgar National Open (Blitz)', section: 'Grades 6-12', score: 'Completed', sys: 'USCF Blitz / NWSRS', before: 425, after: 425, notes: 'Played strong training-school field up to ~1600.' },
      { id: 't-wata', date: '2026-09-12', name: 'WATA Autumn Scholastic', section: 'G4-12 U900', score: '2.0 / 5', sys: 'NWSRS / USCF', before: 732, after: 679, notes: 'Won 2 games; key takeaway: slow down in critical positions & convert endgames.' },
      { id: 't-lynn', date: '2026-11-27', name: 'Upcoming: WA Class Thanksgiving Scholastic (Lynnwood)', section: 'Target Tournament', score: 'Upcoming', sys: 'NWSRS / USCF', before: 679, after: null, notes: 'Goal: Deploy Queen’s Gambit / Caro-Kann & pass 725+ NWSRS.' },
      { id: 't-dec', date: '2026-12-19', name: 'Upcoming: Knight Before Christmas / Orlov Qualifier', section: 'State Qualifier', score: 'Upcoming', sys: 'NWSRS / USCF', before: 679, after: null, notes: 'Winter rating push toward 800–1000.' },
    ],
  });

  function fresh() {
    return {
      v: 3, updatedAt: 0, startDate: '2026-11-13',
      settings: {
        name: 'Anish', lichess: 'govindu', syncUrl: DEFAULT_SYNC_URL, pin: DEFAULT_PIN,
        rating: 679, ratingStart: 679, ratingTarget: 1000, ratingDate: dstr(),
        dailyMin: 30, puzzleStarCap: DEFAULT_PUZZLE_STAR_CAP, endgameCap: DEFAULT_ENDGAME_CAP,
      },
      profile: DEFAULT_PROFILE(),
      level: 1,
      days: {},
      excusedDays: {},
      puzzle: { seen: {}, recent: { 1: [], 2: [], 3: [], 4: [], 5: [] } },
      ledger: [], redemptions: [], rewards: DEFAULT_REWARDS,
      lessons: { done: {}, quizScores: {} },
      games: [],
      repWins: [], // [{ id, date, side: 'w'|'b', rep: 'qg'|'eng'|'ck'|'sic', speed: 'classical'|'rapid'|'blitz', opp, source: 'lichess'|'otb', lvl }]
      lichessSync: { puzzleDays: {}, gamesCredited: {} },
      endgames: {}, levelUps: {}, levelCleared: {},
    };
  }

  function ensureSchema(obj) {
    const f = fresh();
    const out = Object.assign(f, obj || {});
    out.settings = Object.assign(f.settings, (obj && obj.settings) || {});
    if (!out.settings.syncUrl) out.settings.syncUrl = DEFAULT_SYNC_URL;
    if (!out.settings.pin) out.settings.pin = DEFAULT_PIN;
    if (!out.settings.puzzleStarCap || out.settings.puzzleStarCap < 200) out.settings.puzzleStarCap = DEFAULT_PUZZLE_STAR_CAP;
    if (!out.settings.endgameCap || out.settings.endgameCap < 10) out.settings.endgameCap = DEFAULT_ENDGAME_CAP;
    if (!out.settings.lichess) out.settings.lichess = 'govindu';
    if (out.settings.name === 'Champ') out.settings.name = 'Anish';
    out.level = Math.max(1, Math.min(MAX_LEVEL, out.level || 1));

    const dp = DEFAULT_PROFILE();
    out.profile = Object.assign({}, dp, (obj && obj.profile) || {});
    out.profile.ratings = Object.assign({}, dp.ratings, (obj && obj.profile && obj.profile.ratings) || {});
    for (const k of Object.keys(dp.ratings)) {
      out.profile.ratings[k] = Object.assign({}, dp.ratings[k], (obj && obj.profile && obj.profile.ratings && obj.profile.ratings[k]) || {});
      if (!Array.isArray(out.profile.ratings[k].history) || !out.profile.ratings[k].history.length) {
        out.profile.ratings[k].history = dp.ratings[k].history.slice();
      }
    }
    if (!Array.isArray(out.profile.tournaments) || !out.profile.tournaments.length) out.profile.tournaments = dp.tournaments.slice();
    out.puzzle = out.puzzle || { seen: {}, recent: {} };
    out.puzzle.seen = out.puzzle.seen || {};
    out.puzzle.recent = Object.assign({ 1: [], 2: [], 3: [], 4: [], 5: [] }, out.puzzle.recent || {});
    out.lessons = out.lessons || { done: {}, quizScores: {} };
    out.lessons.done = out.lessons.done || {};
    out.lessons.quizScores = out.lessons.quizScores || {};
    // Preserve v2 lesson id migration: l1-open -> l1-cov
    if (out.lessons.done['l1-open'] && !out.lessons.done['l1-cov']) {
      out.lessons.done['l1-cov'] = out.lessons.done['l1-open'];
      out.lessons.quizScores['l1-cov'] = 3;
    }
    out.excusedDays = out.excusedDays || {};
    out.repWins = Array.isArray(out.repWins) ? out.repWins : [];
    out.lichessSync = out.lichessSync || { puzzleDays: {}, gamesCredited: {} };
    out.lichessSync.puzzleDays = out.lichessSync.puzzleDays || {};
    out.lichessSync.gamesCredited = out.lichessSync.gamesCredited || {};
    out.levelCleared = out.levelCleared || {};

    // Normalize daily records & cap any old idle-tab runaway counter
    const seenList = Object.values(out.puzzle.seen || {});
    for (const [k, d] of Object.entries(out.days || {})) {
      if (!d || !d.sec || !d.pz) continue;
      if (d.sec.free > 1800) d.sec.free = 600;
      if (d.sec.p2 > 1800) d.sec.p2 = 900;
      if (d.sec.p1 > 1800) d.sec.p1 = 900;
      if (k === '2026-11-13' && d.pz.tried < 28 && seenList.length >= 28) {
        d.pz = { tried: Math.max(d.pz.tried, 28), first: Math.max(d.pz.first, 21), solved: Math.max(d.pz.solved, 27), fastWrong: Math.max(d.pz.fastWrong, 1) };
        d.sec.p1 = Math.max(d.sec.p1, 600);
        d.sec.p2 = Math.max(d.sec.p2, 480);
        d.done.p1 = true;
      }
      d.li = Object.assign({ pzWins: 0, pzLosses: 0, classical: 0, rapid: 0, blitz: 0 }, d.li || {});
    }
    return out;
  }

  let S = fresh();
  let timer = { phase: null };
  let lastInputTs = Date.now();
  if (typeof document !== 'undefined' && document.addEventListener) {
    ['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, () => { lastInputTs = Date.now(); }, { passive: true }));
  }
  const listeners = new Set();
  let pushT = null, outbox = [];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) S = ensureSchema(JSON.parse(raw));
    } catch (e) { console.warn('load failed', e); }
    try { outbox = JSON.parse(localStorage.getItem(KEY + '_outbox') || '[]'); } catch { outbox = []; }
  }
  function day(date = dstr()) {
    if (!S.days[date]) {
      S.days[date] = {
        sec: { p1: 0, p2: 0, p3: 0, free: 0 },
        done: { p1: false, p2: false, p3: false },
        pz: { tried: 0, first: 0, solved: 0, fastWrong: 0 },
        li: { pzWins: 0, pzLosses: 0, classical: 0, rapid: 0, blitz: 0 },
        stars: 0, pzStars: 0, questComplete: false, lessonId: null,
      };
    }
    if (!S.days[date].li) S.days[date].li = { pzWins: 0, pzLosses: 0, classical: 0, rapid: 0, blitz: 0 };
    return S.days[date];
  }
  function save(touch = true, schedulePush = touch) {
    if (touch) S.updatedAt = Date.now();
    localStorage.setItem(KEY, JSON.stringify(S));
    localStorage.setItem(KEY + '_outbox', JSON.stringify(outbox));
    if (schedulePush && S.settings.syncUrl) { clearTimeout(pushT); pushT = setTimeout(cloudPush, 2500); }
  }
  function emit() { listeners.forEach(f => { try { f(); } catch (e) { console.error(e); } }); }
  function commit() { save(); emit(); }

  // ----- Stars / Credits Ledger -----
  const balance = () => S.ledger.reduce((a, e) => a + e.delta, 0);
  const lifetime = () => S.ledger.reduce((a, e) => a + (e.delta > 0 ? e.delta : 0), 0);
  const totalRedeemed = () => S.redemptions.filter(r => r.status !== 'denied').reduce((a, r) => a + (r.cost || 0), 0);
  function addStars(delta, type, desc, key, customDate) {
    if (key && S.ledger.some(e => e.key === key)) return false;
    const date = customDate || dstr();
    const entry = { id: uid(), key: key || null, ts: Date.now(), date, type, desc, delta, balance: balance() + delta };
    S.ledger.push(entry); outbox.push(entry);
    if (delta > 0) day(date).stars += delta;
    return true;
  }

  // ----- Time + Streaks -----
  function minutesOf(d) {
    if (!d || !d.sec) return 0;
    const appMin = Math.round((d.sec.p1 + d.sec.p2 + d.sec.p3 + (d.sec.free || 0)) / 60);
    const li = d.li || {};
    const liMin = (li.classical || 0) * 25 + (li.rapid || 0) * 15 + (li.blitz || 0) * 6 + Math.round(((li.pzWins || 0) + (li.pzLosses || 0)) * 1.5);
    return appMin + liMin;
  }
  const totalMinutes = () => Object.values(S.days).reduce((a, d) => a + minutesOf(d), 0);

  function streak() {
    let d = dstr(), n = 0;
    if (minutesOf(S.days[d]) < 15 && !(S.days[d] && S.days[d].questComplete)) d = addDays(d, -1);
    while (S.days[d] && (minutesOf(S.days[d]) >= 15 || S.days[d].questComplete || S.excusedDays[d])) {
      if (!S.excusedDays[d]) n++;
      d = addDays(d, -1);
    }
    return n;
  }
  function bestStreak() {
    const ds = Object.keys(S.days).filter(k => minutesOf(S.days[k]) >= 15 || S.days[k].questComplete).sort();
    let best = 0, cur = 0, prev = null;
    for (const k of ds) { cur = (prev && daysBetween(prev, k) === 1) ? cur + 1 : 1; best = Math.max(best, cur); prev = k; }
    return best;
  }
  function tick() {
    if (!timer.phase || document.hidden || (Date.now() - lastInputTs > 180000)) return;
    const d = day(); d.sec[timer.phase] = (d.sec[timer.phase] || 0) + 1;
    if (d.sec[timer.phase] % 5 === 0) save(false);
    return d.sec[timer.phase];
  }
  function finishPhase(p) {
    const d = day(); if (d.done[p]) return;
    d.done[p] = true; timer.phase = null;
    addStars(5, 'phase', 'Finished Phase ' + p.toUpperCase(), 'phase-' + p + '-' + dstr());
    if (d.done.p1 && d.done.p2 && d.done.p3 && !d.questComplete) {
      d.questComplete = true;
      addStars(20, 'quest', '🏆 Completed Daily Trifecta!', 'quest-' + dstr());
      return 'quest';
    }
    return 'phase';
  }

  // ----- Weekly Goal, Daily Contribution Log & Bonus/Penalty Engine -----
  function getWeekStats(mondayStr = weekStart()) {
    const today = dstr();
    const daysList = [];
    let totMin = 0, totPz = 0, totClassical = 0, totRapid = 0, totBlitz = 0, totQuizzes = 0, totEg = 0, totStars = 0;
    let puzzleMin = 0, theoryMin = 0;

    for (let i = 0; i < 7; i++) {
      const k = addDays(mondayStr, i);
      const d = S.days[k];
      const li = (d && d.li) || { pzWins: 0, pzLosses: 0, classical: 0, rapid: 0, blitz: 0 };
      const pzSolved = ((d && d.pz && d.pz.solved) || 0) + (li.pzWins || 0);
      const dayLedger = S.ledger.filter(e => e.date === k);
      const quizzes = dayLedger.filter(e => e.type === 'lesson_quiz').length;
      const egMates = dayLedger.filter(e => e.type === 'endgame').length;
      const netStars = dayLedger.reduce((a, e) => a + e.delta, 0);
      const earnedStars = dayLedger.filter(e => e.delta > 0).reduce((a, e) => a + e.delta, 0);
      const mins = minutesOf(d);
      const pMin = Math.round(((d && d.sec && d.sec.p1) || 0) / 60) + Math.round(((li.pzWins || 0) + (li.pzLosses || 0)) * 1.5);
      const tMin = Math.round(((d && d.sec && d.sec.p2) || 0) / 60) + quizzes * 12 + egMates * 4;

      // Daily contribution toward weekly 100% goal
      const dayPct = Math.round(
        (mins / WEEKLY_TARGETS.minutes) * 35 +
        (pzSolved / WEEKLY_TARGETS.puzzles) * 25 +
        ((li.classical * 2 + li.rapid) / (WEEKLY_TARGETS.classicalGames * 2 + WEEKLY_TARGETS.rapidGames)) * 20 +
        ((quizzes * 20 + tMin) / (WEEKLY_TARGETS.theoryQuizzes * 20 + WEEKLY_TARGETS.theoryMinutes)) * 20
      );

      totMin += mins;
      totPz += pzSolved;
      totClassical += li.classical || 0;
      totRapid += li.rapid || 0;
      totBlitz += li.blitz || 0;
      totQuizzes += quizzes;
      totEg += egMates;
      totStars += netStars;
      puzzleMin += pMin;
      theoryMin += tMin;

      daysList.push({
        date: k,
        dow: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        isToday: k === today,
        isFuture: k > today,
        excused: !!S.excusedDays[k],
        mins,
        pzSolved,
        quizzes,
        egMates,
        classical: li.classical || 0,
        rapid: li.rapid || 0,
        blitz: li.blitz || 0,
        earnedStars,
        netStars,
        dayPct,
      });
    }

    // Overall Weekly Progress % (can exceed 100% -> 150% -> 200%!)
    const minScore = (totMin / WEEKLY_TARGETS.minutes) * 35;
    const pzScore = (totPz / WEEKLY_TARGETS.puzzles) * 25;
    const gameScore = ((totClassical * 2 + totRapid) / (WEEKLY_TARGETS.classicalGames * 2 + WEEKLY_TARGETS.rapidGames)) * 20;
    const thScore = ((totQuizzes * 15 + theoryMin) / (WEEKLY_TARGETS.theoryQuizzes * 15 + WEEKLY_TARGETS.theoryMinutes)) * 20;
    const pct = Math.max(0, Math.round(minScore + pzScore + gameScore + thScore));

    const milestones = WEEKLY_MILESTONES.map(m => ({
      ...m,
      key: `wk-bonus-${mondayStr}-${m.pct}`,
      claimed: S.ledger.some(e => e.key === `wk-bonus-${mondayStr}-${m.pct}`),
      reached: pct >= m.pct,
    }));

    return {
      monday: mondayStr,
      sunday: addDays(mondayStr, 6),
      pct,
      totMin,
      totPz,
      totClassical,
      totRapid,
      totBlitz,
      totQuizzes,
      totEg,
      totStars,
      puzzleMin,
      theoryMin,
      days: daysList,
      milestones,
      targets: WEEKLY_TARGETS,
    };
  }

  function evaluateWeeklyBonusesAndPenalties() {
    let changed = false;
    const curMon = weekStart();
    const curStats = getWeekStats(curMon);

    // 1) Award any newly crossed weekly milestone bonuses (50%, 75%, 100%, 150%, 200%)
    for (const m of curStats.milestones) {
      if (m.reached && !m.claimed) {
        if (addStars(m.stars, 'weekly_bonus', `${m.label} (${curStats.pct}% of Weekly Goal!)`, m.key)) changed = true;
      }
    }

    // 2) Evaluate completed past weeks (from startDate's next full week onward) for missed-goal penalties
    const startMon = weekStart(S.startDate || '2026-11-13');
    let wk = startMon;
    while (wk < curMon) {
      // Only penalize full 7-day weeks where startDate was on or before Monday of that week
      if (wk >= (S.startDate || '2026-11-13')) {
        const st = getWeekStats(wk);
        const penKey = `wk-pen-${wk}`;
        if (!S.ledger.some(e => e.key === penKey)) {
          if (st.pct < 50) {
            if (addStars(-100, 'penalty', `🚨 Weekly Goal Missed (<50%: ${st.pct}% in week of ${wk})`, penKey, st.sunday)) changed = true;
          } else if (st.pct < 75) {
            if (addStars(-40, 'penalty', `⚠️ Weekly Goal Incomplete (50–74%: ${st.pct}% in week of ${wk})`, penKey, st.sunday)) changed = true;
          } else if (st.pct < 100) {
            if (addStars(-25, 'penalty', `🟡 Weekly Goal Near-Miss (75–99%: ${st.pct}% in week of ${wk})`, penKey, st.sunday)) changed = true;
          }
        }
      }
      wk = addDays(wk, 7);
    }

    // 3) Check 2 consecutive unexcused 0-activity days (prior to today, after startDate)
    const today = dstr();
    const span = daysBetween(S.startDate || '2026-11-13', today);
    let zeroRun = 0;
    for (let i = 0; i < span; i++) {
      const k = addDays(S.startDate || '2026-11-13', i);
      if (S.excusedDays[k]) continue;
      const d = S.days[k];
      const active = minutesOf(d) > 0 || (d && d.pz && d.pz.tried > 0) || S.ledger.some(e => e.date === k && e.delta > 0);
      if (!active) {
        zeroRun++;
        if (zeroRun >= 2) {
          const rustKey = `rust-pen-${k}`;
          if (addStars(-20, 'penalty', `🛑 Idle Rust Penalty (${zeroRun} consecutive 0-activity days on ${k})`, rustKey, k)) changed = true;
        }
      } else {
        zeroRun = 0;
      }
    }

    if (changed) save();
    return curStats;
  }

  function toggleExcusedDay(dateStr) {
    if (S.excusedDays[dateStr]) delete S.excusedDays[dateStr];
    else S.excusedDays[dateStr] = true;
    commit();
  }

  // ----- Lichess Auto-Sync: Convert Lichess Puzzles & Games into Stars + Repertoire Wins -----
  function classifyRepertoire(openingName = '', movesStr = '', side = 'w') {
    const op = openingName.toLowerCase();
    const mv = movesStr.trim();
    if (side === 'w') {
      if (op.includes("queen's gambit") || op.includes('queens gambit') || op.includes('slav') || op.includes('catalan') || /^d4\s+\S+\s+c4/.test(mv)) {
        return { code: 'qg', label: "Queen's Gambit" };
      }
      if (op.includes('english') || /^c4\b/.test(mv)) {
        return { code: 'eng', label: 'English Opening' };
      }
    } else {
      if (op.includes('caro-kann') || op.includes('caro kann') || /^e4\s+c6\b/.test(mv)) {
        return { code: 'ck', label: 'Caro-Kann Defense' };
      }
      if (op.includes('sicilian') || /^e4\s+c5\b/.test(mv)) {
        return { code: 'sic', label: 'Sicilian Defense' };
      }
    }
    return null;
  }

  function syncLichessData({ user, activity, games }) {
    let changed = false;
    const uname = (S.settings.lichess || 'govindu').toLowerCase();

    // 1) Update live Lichess profile ratings
    if (user && user.perfs && S.profile && S.profile.ratings && S.profile.ratings.lichess) {
      const lp = S.profile.ratings.lichess;
      if (user.perfs.rapid && user.perfs.rapid.rating) lp.current = user.perfs.rapid.rating;
      if (user.perfs.puzzle && user.perfs.puzzle.rating) lp.puzzle = user.perfs.puzzle.rating;
      if (user.perfs.classical && user.perfs.classical.rating) lp.classical = user.perfs.classical.rating;
      if (user.perfs.blitz && user.perfs.blitz.rating) lp.blitz = user.perfs.blitz.rating;
      if (user.perfs.bullet && user.perfs.bullet.rating) lp.bullet = user.perfs.bullet.rating;
      lp.peak = Math.max(lp.peak || 0, lp.current || 0, lp.puzzle || 0);
    }

    // 2) Sync daily Lichess puzzle & game counts from /api/user/{u}/activity
    if (Array.isArray(activity)) {
      for (const item of activity) {
        if (!item.interval || !item.interval.start) continue;
        // Lichess interval.start is UTC midnight timestamp of that activity window
        const dtStr = dstr(new Date(item.interval.start));
        if (dtStr < (S.startDate || '2026-11-13')) continue;
        const d = day(dtStr);

        if (item.puzzles && item.puzzles.score) {
          const wins = item.puzzles.score.win || 0;
          const losses = item.puzzles.score.loss || 0;
          d.li.pzWins = Math.max(d.li.pzWins || 0, wins);
          d.li.pzLosses = Math.max(d.li.pzLosses || 0, losses);
          const prevCredited = S.lichessSync.puzzleDays[dtStr] || 0;
          if (wins > prevCredited) {
            const diff = wins - prevCredited;
            const stars = diff * 2;
            S.lichessSync.puzzleDays[dtStr] = wins;
            addStars(stars, 'lichess_puzzle', `🧩 Lichess Puzzles: ${diff} solved on Lichess (${wins}W/${losses}L)`, `li-pz-${dtStr}-${wins}`, dtStr);
            changed = true;
          }
          // Daily rating gain bonus on Lichess puzzles
          const rp = item.puzzles.score.rp;
          if (rp && rp.after > rp.before) {
            const gain = rp.after - rp.before;
            if (addStars(10, 'lichess_puzzle', `📈 Lichess Puzzle Rating Climb (+${gain} to ${rp.after})`, `li-pzgain-${dtStr}`, dtStr)) changed = true;
          }
        }
        if (item.games) {
          for (const spd of ['classical', 'rapid', 'blitz']) {
            if (item.games[spd]) {
              const cnt = (item.games[spd].win || 0) + (item.games[spd].loss || 0) + (item.games[spd].draw || 0);
              d.li[spd] = Math.max(d.li[spd] || 0, cnt);
            }
          }
        }
      }
    }

    // 3) Sync individual Lichess games & Repertoire Wins
    if (Array.isArray(games)) {
      for (const g of games) {
        if (!g || !g.id || !g.players) continue;
        const isWhite = g.players.white && g.players.white.user && g.players.white.user.name.toLowerCase() === uname;
        const isBlack = g.players.black && g.players.black.user && g.players.black.user.name.toLowerCase() === uname;
        if (!isWhite && !isBlack) continue;
        const side = isWhite ? 'w' : 'b';
        const won = (g.winner === 'white' && isWhite) || (g.winner === 'black' && isBlack);
        const dtStr = dstr(new Date(g.createdAt || Date.now()));
        const speed = ['classical', 'rapid', 'blitz'].includes(g.speed) ? g.speed : 'rapid';
        const opName = (g.opening && g.opening.name) || '';
        const rep = classifyRepertoire(opName, g.moves || '', side);
        const oppObj = isWhite ? g.players.black : g.players.white;
        const oppName = (oppObj && oppObj.user && oppObj.user.name) || 'Opponent';

        // Record repertoire win if won using core repertoire
        if (won && rep && !S.repWins.some(w => w.id === 'li-' + g.id)) {
          S.repWins.push({
            id: 'li-' + g.id,
            gameId: g.id,
            date: dtStr,
            side,
            rep: rep.code,
            repLabel: rep.label,
            openingName: opName || rep.label,
            speed,
            opp: oppName,
            source: 'lichess',
            lvl: S.level,
          });
          changed = true;
        }

        // Credit stars for games played on or after startDate
        if (dtStr >= (S.startDate || '2026-11-13') && !S.lichessSync.gamesCredited[g.id]) {
          S.lichessSync.gamesCredited[g.id] = true;
          const baseStars = speed === 'classical' ? 15 : speed === 'rapid' ? 8 : 3;
          const winStars = won ? (speed === 'classical' ? 10 : speed === 'rapid' ? 7 : 3) : 0;
          const repStars = (rep && won) ? (speed === 'classical' ? 10 : 5) : (rep ? 3 : 0);
          const evalStars = (g.analysis || (isWhite ? g.players.white.analysis : g.players.black.analysis)) ? 5 : 0;
          const totalGameStars = baseStars + winStars + repStars + evalStars;
          const resLabel = won ? 'Won' : !g.winner ? 'Drew' : 'Played';
          addStars(
            totalGameStars,
            'lichess_game',
            `♟️ Lichess ${speed.toUpperCase()}: ${resLabel} vs ${oppName}${rep ? ' (' + rep.label + ')' : ''}${evalStars ? ' + Engine Review' : ''}`,
            `li-gm-${g.id}`,
            dtStr
          );
          changed = true;
        }
      }
    }

    evaluateWeeklyBonusesAndPenalties();
    if (changed) save();
  }

  function logManualRepertoireWin({ side, rep, speed, opp, date, notes }) {
    const repMap = { qg: "Queen's Gambit", eng: 'English Opening', ck: 'Caro-Kann Defense', sic: 'Sicilian Defense' };
    const dt = date || dstr();
    const id = 'rep-' + uid();
    S.repWins.push({
      id,
      date: dt,
      side: side || (['qg', 'eng'].includes(rep) ? 'w' : 'b'),
      rep,
      repLabel: repMap[rep] || rep,
      openingName: notes || repMap[rep] || rep,
      speed: speed || 'rapid',
      opp: opp || 'Opponent',
      source: 'manual',
      lvl: S.level,
    });
    const bonus = speed === 'classical' ? 20 : speed === 'rapid' ? 12 : 6;
    addStars(bonus, 'rep_win', `⚔️ Repertoire Win (${repMap[rep] || rep} · ${speed.toUpperCase()}) vs ${opp || 'Opponent'}`, id, dt);
    commit();
  }

  // ----- 5-Level Graduation Checklist & Mega Bonus -----
  function levelChecklist(lvl = S.level) {
    const lvObj = (window.LEVELS || []).find(x => x.n === lvl) || (window.LEVELS || [])[0];
    const mods = (window.LESSONS || []).filter(l => l.l === lvl);
    const whiteMods = mods.filter(l => l.group === 'core_white');
    const blackMods = mods.filter(l => l.group === 'core_black');
    const otherMods = mods.filter(l => !['core_white', 'core_black'].includes(l.group));

    const whiteDone = whiteMods.every(m => !!S.lessons.done[m.id]);
    const blackDone = blackMods.every(m => !!S.lessons.done[m.id]);
    const otherDone = otherMods.every(m => !!S.lessons.done[m.id]);
    const allModsDone = mods.every(m => !!S.lessons.done[m.id]);

    // Games requirement for this level: 5 White wins + 5 Black wins (with >=1 Classical, >=1 Rapid, >=1 Blitz)
    // Each level consumes 5 White + 5 Black wins, or filters wins tagged for this level / cumulative
    const allWhiteWins = S.repWins.filter(w => w.side === 'w');
    const allBlackWins = S.repWins.filter(w => w.side === 'b');
    const offset = (lvl - 1) * 5;
    const lvlWhiteWins = Math.max(0, Math.min(5, allWhiteWins.length - offset));
    const lvlBlackWins = Math.max(0, Math.min(5, allBlackWins.length - offset));
    const poolWins = S.repWins.slice((lvl - 1) * 10);
    const hasClassical = poolWins.some(w => w.speed === 'classical');
    const hasRapid = poolWins.some(w => w.speed === 'rapid');
    const hasBlitz = poolWins.some(w => w.speed === 'blitz');
    const gamesDone = lvlWhiteWins >= 5 && lvlBlackWins >= 5 && hasClassical && hasRapid && hasBlitz;

    // Lichess Adaptive Puzzles capability
    const totalPzSolved = Object.values(S.days).reduce((a, d) => a + (d.pz ? d.pz.solved : 0) + (d.li ? d.li.pzWins : 0), 0);
    const pzGate = totalPzSolved >= (lvObj.reqPuzzles || lvl * 25);

    const gates = [
      { id: 'white', label: `⚪ Deep White Core Roadmap: Queen's Gambit & English (${whiteMods.filter(m => S.lessons.done[m.id]).length}/${whiteMods.length} studied on Lichess)`, done: whiteDone },
      { id: 'black', label: `⚫ Deep Black Core Roadmap: Caro-Kann & Sicilian (${blackMods.filter(m => S.lessons.done[m.id]).length}/${blackMods.length} studied on Lichess)`, done: blackDone },
      { id: 'other', label: `🛡️ Sidelines, Middlegame & Endgame Roadmap (${otherMods.filter(m => S.lessons.done[m.id]).length}/${otherMods.length} studied on Lichess)`, done: otherDone },
      { id: 'games', label: `⚔️ 10 Repertoire Game Wins on Lichess/OTB: ${lvlWhiteWins}/5 White + ${lvlBlackWins}/5 Black (Classical: ${hasClassical ? '✅' : '0/1'} · Rapid: ${hasRapid ? '✅' : '0/1'} · Blitz: ${hasBlitz ? '✅' : '0/1'})`, done: gamesDone },
      { id: 'cap', label: `🧩 Lichess Adaptive Puzzles: ${Math.min(totalPzSolved, lvObj.reqPuzzles)}/${lvObj.reqPuzzles} Rated Puzzles solved on Lichess`, done: pzGate },
    ];

    const doneCount = gates.filter(g => g.done).length;
    const readyToClear = gates.every(g => g.done);
    const alreadyCleared = !!S.levelCleared[lvl];

    return {
      lvl,
      lvObj,
      mods,
      whiteMods,
      blackMods,
      otherMods,
      lvlWhiteWins,
      lvlBlackWins,
      hasClassical,
      hasRapid,
      hasBlitz,
      totalPzSolved,
      gates,
      doneCount,
      pct: Math.round((doneCount / gates.length) * 100),
      readyToClear,
      alreadyCleared,
    };
  }

  function claimLevelClear(lvl) {
    const chk = levelChecklist(lvl);
    if (!chk.readyToClear || chk.alreadyCleared) return false;
    S.levelCleared[lvl] = dstr();
    if (S.level === lvl && lvl < MAX_LEVEL) {
      S.level = lvl + 1;
      S.levelUps[S.level] = dstr();
    }
    const bonus = chk.lvObj.clearBonus || 250;
    addStars(bonus, 'level_clear', `🏆 CLEARED LEVEL ${lvl} (${chk.lvObj.name}) — Full Repertoire & Game Mastery!`, `lvl-clear-${lvl}`);
    commit();
    return bonus;
  }

  // ----- In-App Puzzle Bookkeeping -----
  function puzzleStarCap() { return S.settings.puzzleStarCap || DEFAULT_PUZZLE_STAR_CAP; }
  function puzzleStarsLeft() { return Math.max(0, puzzleStarCap() - day().pzStars); }
  function recordPuzzle(p, result, opts = {}) {
    const d = day();
    d.pz.tried++; if (result === 'first') d.pz.first++; if (result !== 'shown') d.pz.solved++;
    if (opts.fastWrong) d.pz.fastWrong++;
    if (!d.done.p1 && d.pz.solved >= 8 && (d.sec.p1 + (d.sec.free || 0)) >= TARGET.p1 * MIN_FRAC) {
      d.sec.p1 = Math.max(d.sec.p1, Math.round(TARGET.p1 * MIN_FRAC));
    }
    const s = S.puzzle.seen[p.id] || { n: 0, first: 0 };
    s.n++; if (result === 'first') s.first++; s.last = result; s.r = p.r; s.ts = Date.now(); S.puzzle.seen[p.id] = s;
    let stars = result === 'first' ? 3 : result === 'retry' ? 1 : 0;
    if (opts.challenge) stars *= 2;
    stars = Math.min(stars, puzzleStarsLeft());
    if (stars > 0) { addStars(stars, 'puzzle', (opts.challenge ? '⚡ ' : '') + 'Puzzle ' + p.id + ' (' + p.r + ')' + (result === 'first' ? ' first try' : ' retry')); d.pzStars += stars; }
    let levelUp = null;
    if (!opts.challenge && p.l >= S.level) {
      const r = S.puzzle.recent[S.level] = (S.puzzle.recent[S.level] || []).concat(result === 'first' ? 1 : 0).slice(-10);
      const streak5 = r.length >= 5 && r.slice(-5).every(x => x === 1);
      const eightOf10 = r.length >= 10 && r.reduce((a, b) => a + b, 0) >= 8;
      if ((streak5 || eightOf10) && S.level < MAX_LEVEL) {
        S.level++; S.puzzle.recent[S.level] = []; S.levelUps[S.level] = dstr();
        const lvObj = (window.LEVELS || [])[S.level - 1];
        addStars(50, 'levelup', '⛏️ Ranked up to Level ' + S.level + (lvObj ? ': ' + lvObj.name : '') + '!', 'levelup-' + S.level);
        levelUp = S.level;
      }
    }
    evaluateWeeklyBonusesAndPenalties();
    commit();
    return { stars, levelUp };
  }
  function recentAccuracy(l = S.level) { const r = S.puzzle.recent[l] || []; return r.length ? r.reduce((a, b) => a + b, 0) / r.length : null; }
  function setLevel(l) { S.level = Math.max(1, Math.min(MAX_LEVEL, l)); S.puzzle.recent[S.level] = []; commit(); }

  // ----- Theoretical "Playing At" Performance Rating -----
  function performanceRating(liveLichessUser) {
    const pmap = {}; (window.PUZZLES || []).forEach(p => pmap[p.id] = p);
    const seenEntries = Object.entries(S.puzzle.seen).map(([id, sv]) => ({ id, sv, r: sv.r || (pmap[id] && pmap[id].r) || 1250 })).sort((a, b) => (a.sv.ts || 0) - (b.sv.ts || 0));
    const recentEntries = seenEntries.slice(-30);
    let tacPerf = 1550;
    if (recentEntries.length > 0) {
      let sum = 0, wSum = 0;
      recentEntries.forEach((e, idx) => {
        const w = 1 + (idx / recentEntries.length);
        const perf = e.sv.last === 'first' ? e.r + 240 : e.sv.last === 'retry' ? e.r - 20 : e.r - 260;
        sum += perf * w; wSum += w;
      });
      tacPerf = Math.round(sum / wSum);
    }
    const liProf = S.profile.ratings.lichess || {};
    const liRapid = (liveLichessUser && liveLichessUser.perfs && liveLichessUser.perfs.rapid && liveLichessUser.perfs.rapid.rating) || liProf.current || 1611;
    const liPuzzle = (liveLichessUser && liveLichessUser.perfs && liveLichessUser.perfs.puzzle && liveLichessUser.perfs.puzzle.rating) || liProf.puzzle || 1765;
    const liClassical = (liveLichessUser && liveLichessUser.perfs && liveLichessUser.perfs.classical && liveLichessUser.perfs.classical.rating) || liProf.classical || 1255;
    const liBlitz = (liveLichessUser && liveLichessUser.perfs && liveLichessUser.perfs.blitz && liveLichessUser.perfs.blitz.rating) || liProf.blitz || 1210;

    const blendedTactical = seenEntries.length >= 5 ? Math.round(tacPerf * 0.55 + liPuzzle * 0.45) : liPuzzle;
    const lichessPlayingAt = Math.round(liRapid * 0.55 + blendedTactical * 0.45);

    const totalTried = Object.values(S.days).reduce((a, d) => a + d.pz.tried, 0);
    const totalFirst = Object.values(S.days).reduce((a, d) => a + d.pz.first, 0);
    const totalFastWrong = Object.values(S.days).reduce((a, d) => a + d.pz.fastWrong, 0);
    const firstAcc = totalTried ? (totalFirst / totalTried) : 0.75;
    const impulseRate = totalTried ? (totalFastWrong / totalTried) : 0;
    const egWins = Object.values(S.endgames).reduce((a, e) => a + (e.wins || 0), 0);
    const lessonsPassed = Object.keys(S.lessons.done || {}).length;

    let otbPlayingAt = Math.round((lichessPlayingAt - 640) + (firstAcc - 0.65) * 220 - impulseRate * 180 + Math.min(60, egWins * 6) + Math.min(90, lessonsPassed * 8));
    otbPlayingAt = Math.max(550, Math.min(2200, otbPlayingAt));

    const officialOtb = S.profile.ratings.nwsrs.current || S.settings.rating || 679;
    const deltaOtb = otbPlayingAt - officialOtb;
    const levels = window.LEVELS || [];
    const perfTier = levels.slice().reverse().find(l => lichessPlayingAt >= l.minR) || levels[0] || { n: 1, name: 'Stone Crafter', icon: '⛏️' };

    return {
      otbPlayingAt,
      officialOtb,
      deltaOtb,
      lichessPlayingAt,
      tacticalPerf: blendedTactical,
      appTacPerf: tacPerf,
      liRapid,
      liPuzzle,
      liClassical,
      liBlitz,
      firstAcc: Math.round(firstAcc * 100),
      impulseRate: Math.round(impulseRate * 100),
      puzzlesSampled: seenEntries.length,
      perfTier,
    };
  }

  // ----- Rating & Tournament Logger -----
  function logRatingUpdate({ sys, format, newRating, eventName, date, score, notes }) {
    const dt = date || dstr();
    const rNum = +newRating;
    const prof = S.profile;
    if (sys && prof.ratings[sys] && rNum > 0) {
      const card = prof.ratings[sys];
      const before = card.current || rNum;
      if (sys === 'uscf' && format === 'quick') card.quick = rNum;
      else if (sys === 'uscf' && format === 'blitz') card.blitz = rNum;
      else card.current = rNum;
      card.peak = Math.max(card.peak || 0, rNum);
      card.history = card.history || [];
      card.history.push({ date: dt, r: rNum, event: eventName || 'Rating Update' });
      if (sys === 'nwsrs') S.settings.rating = rNum;
      if (eventName) {
        prof.tournaments.unshift({
          id: 't-' + uid(), date: dt, name: eventName, section: score ? 'Rated Event' : 'Rating Update',
          score: score || 'Rated', sys: card.label + (format ? ' (' + format + ')' : ''), before, after: rNum, notes: notes || '',
        });
      }
      addStars(25, 'tournament', '🏅 Logged rating update (' + card.label + ': ' + rNum + ')', 'rt-' + sys + '-' + dt + '-' + rNum);
      commit();
      return true;
    }
    return false;
  }

  // ----- Parent-Only Direct Redemption & Legacy Compatibility -----
  function parentRedeem(cost, giftName) {
    const pts = Math.round(+cost || 0);
    if (pts <= 0 || !giftName) return false;
    const rid = uid();
    addStars(-pts, 'redeem', '🎁 Redeemed: ' + giftName, 'redeem-' + rid);
    S.redemptions.push({ id: rid, ts: Date.now(), date: dstr(), name: giftName, cost: pts, status: 'approved' });
    commit();
    return true;
  }
  function redeem(rw) {
    return parentRedeem(rw.cost, rw.name);
  }
  function resolveRedemption(id, approve) {
    const r = S.redemptions.find(x => x.id === id); if (!r || r.status !== 'pending') return;
    r.status = approve ? 'approved' : 'denied';
    if (!approve) addStars(r.cost, 'refund', 'Refund (declined): ' + r.name, 'refund-' + id);
    commit();
  }

  // ----- Cloud Merge -----
  function merge(local, remote) {
    local = ensureSchema(local); remote = ensureSchema(remote);
    const out = ensureSchema(remote.updatedAt > local.updatedAt ? remote : local);
    const newer = remote.updatedAt > local.updatedAt ? remote : local;
    out.settings = Object.assign({}, newer.settings, {
      syncUrl: local.settings.syncUrl || remote.settings.syncUrl || DEFAULT_SYNC_URL,
      pin: newer.settings.pin || local.settings.pin || remote.settings.pin || DEFAULT_PIN,
      puzzleStarCap: Math.max(local.settings.puzzleStarCap || 200, remote.settings.puzzleStarCap || 200),
      endgameCap: Math.max(local.settings.endgameCap || 10, remote.settings.endgameCap || 10),
    });
    const led = new Map(); [...local.ledger, ...remote.ledger].forEach(e => led.set(e.id, e));
    out.ledger = [...led.values()].sort((a, b) => a.ts - b.ts);
    out.days = {};
    for (const k of new Set([...Object.keys(local.days), ...Object.keys(remote.days)])) {
      const a = local.days[k], b = remote.days[k];
      if (!a || !b) { out.days[k] = a || b; continue; }
      const la = a.li || {}, lb = b.li || {};
      out.days[k] = {
        sec: {
          p1: Math.max(a.sec.p1 || 0, b.sec.p1 || 0),
          p2: Math.max(a.sec.p2 || 0, b.sec.p2 || 0),
          p3: Math.max(a.sec.p3 || 0, b.sec.p3 || 0),
          free: Math.min(1800, Math.max(a.sec.free || 0, b.sec.free || 0)),
        },
        done: { p1: !!(a.done.p1 || b.done.p1), p2: !!(a.done.p2 || b.done.p2), p3: !!(a.done.p3 || b.done.p3) },
        pz: {
          tried: Math.max((a.pz && a.pz.tried) || 0, (b.pz && b.pz.tried) || 0),
          first: Math.max((a.pz && a.pz.first) || 0, (b.pz && b.pz.first) || 0),
          solved: Math.max((a.pz && a.pz.solved) || 0, (b.pz && b.pz.solved) || 0),
          fastWrong: Math.max((a.pz && a.pz.fastWrong) || 0, (b.pz && b.pz.fastWrong) || 0),
        },
        li: {
          pzWins: Math.max(la.pzWins || 0, lb.pzWins || 0),
          pzLosses: Math.max(la.pzLosses || 0, lb.pzLosses || 0),
          classical: Math.max(la.classical || 0, lb.classical || 0),
          rapid: Math.max(la.rapid || 0, lb.rapid || 0),
          blitz: Math.max(la.blitz || 0, lb.blitz || 0),
        },
        stars: Math.max(a.stars || 0, b.stars || 0),
        pzStars: Math.max(a.pzStars || 0, b.pzStars || 0),
        questComplete: !!(a.questComplete || b.questComplete),
        lessonId: a.lessonId || b.lessonId || null,
      };
    }
    const rd = new Map(); [...local.redemptions, ...remote.redemptions].forEach(r => { const o = rd.get(r.id); if (!o || (o.status === 'pending' && r.status !== 'pending')) rd.set(r.id, r); });
    out.redemptions = [...rd.values()].sort((a, b) => a.ts - b.ts);
    const rw = new Map(); [...(local.repWins || []), ...(remote.repWins || [])].forEach(w => rw.set(w.id, w));
    out.repWins = [...rw.values()];
    out.excusedDays = Object.assign({}, remote.excusedDays, local.excusedDays);
    out.levelCleared = Object.assign({}, remote.levelCleared, local.levelCleared);
    out.lichessSync = {
      puzzleDays: Object.assign({}, (remote.lichessSync && remote.lichessSync.puzzleDays) || {}, (local.lichessSync && local.lichessSync.puzzleDays) || {}),
      gamesCredited: Object.assign({}, (remote.lichessSync && remote.lichessSync.gamesCredited) || {}, (local.lichessSync && local.lichessSync.gamesCredited) || {}),
    };
    for (const k of Object.keys(out.lichessSync.puzzleDays)) {
      out.lichessSync.puzzleDays[k] = Math.max(
        (local.lichessSync && local.lichessSync.puzzleDays && local.lichessSync.puzzleDays[k]) || 0,
        (remote.lichessSync && remote.lichessSync.puzzleDays && remote.lichessSync.puzzleDays[k]) || 0
      );
    }
    const seen = Object.assign({}, remote.puzzle.seen); for (const [id, v] of Object.entries(local.puzzle.seen)) if (!seen[id] || v.n >= seen[id].n) seen[id] = v;
    out.puzzle = { seen, recent: newer.puzzle.recent };
    out.level = Math.min(MAX_LEVEL, Math.max(local.level || 1, remote.level || 1));
    out.lessons = {
      done: Object.assign({}, remote.lessons.done, local.lessons.done),
      quizScores: Object.assign({}, (remote.lessons && remote.lessons.quizScores) || {}, (local.lessons && local.lessons.quizScores) || {}),
    };
    out.levelUps = Object.assign({}, remote.levelUps, local.levelUps);
    out.endgames = {};
    for (const k of new Set([...Object.keys(local.endgames || {}), ...Object.keys(remote.endgames || {})])) {
      const ea = (local.endgames || {})[k], eb = (remote.endgames || {})[k];
      if (!ea || !eb) { out.endgames[k] = ea || eb; continue; }
      out.endgames[k] = { wins: Math.max(ea.wins || 0, eb.wins || 0), best: Math.min(ea.best || 999, eb.best || 999) };
    }
    const g = new Map(); [...(local.games || []), ...(remote.games || [])].forEach(x => g.set(x.id, x)); out.games = [...g.values()].sort((a, b) => a.ts - b.ts);
    out.startDate = local.startDate < remote.startDate ? local.startDate : remote.startDate;
    out.updatedAt = Math.max(local.updatedAt, remote.updatedAt);
    return ensureSchema(out);
  }

  // ----- Cloud Sync -----
  let syncStatus = 'off', lastSync = null;
  const url = () => (S.settings.syncUrl || DEFAULT_SYNC_URL).trim();
  async function cloudPull() {
    if (!url()) { syncStatus = 'off'; return; }
    try {
      syncStatus = 'syncing'; emit();
      const r = await fetch(url() + (url().includes('?') ? '&' : '?') + 'action=getState', { redirect: 'follow' });
      const j = await r.json();
      if (j.status === 'success' && j.state) { S = merge(S, j.state); save(false, false); }
      syncStatus = 'ok'; lastSync = new Date();
    } catch (e) { console.warn('pull failed', e); syncStatus = 'error'; }
    emit();
  }
  async function cloudPush() {
    if (!url()) return;
    const d = day();
    const payload = {
      action: 'saveState', updatedAt: S.updatedAt, state: S,
      today: { date: dstr(), minutes: minutesOf(d), p1: d.done.p1, p2: d.done.p2, p3: d.done.p3, puzzlesTried: d.pz.tried, puzzlesFirstTry: d.pz.first, stars: d.stars, questComplete: d.questComplete, streak: streak(), level: S.level, balance: balance(), totalMinutes: totalMinutes() },
      ledger: outbox.slice(),
    };
    const sent = outbox.length;
    try {
      await cloudPull();
      payload.state = S; payload.updatedAt = S.updatedAt;
      syncStatus = 'syncing';
      await fetch(url(), { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      outbox = outbox.slice(sent); save(false, false); syncStatus = 'ok'; lastSync = new Date();
    } catch (e) { console.warn('push failed (will retry)', e); syncStatus = 'error'; }
    emit();
  }

  function applySetupHash() {
    const m = location.hash.match(/setup=([^&]+)/); if (!m) return false;
    try {
      const o = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[1])))));
      if (o.syncUrl) S.settings.syncUrl = o.syncUrl; if (o.lichess) S.settings.lichess = o.lichess; if (o.name) S.settings.name = o.name;
      if (o.rating) { S.settings.rating = S.settings.ratingStart = +o.rating; } if (o.target) S.settings.ratingTarget = +o.target;
      save(); history.replaceState(null, '', location.pathname + location.search); return true;
    } catch (e) { console.warn('bad setup link', e); return false; }
  }
  function makeSetupLink() {
    const o = { syncUrl: S.settings.syncUrl, lichess: S.settings.lichess, name: S.settings.name, rating: S.settings.ratingStart, target: S.settings.ratingTarget };
    return location.origin + location.pathname + '#setup=' + encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(o)))));
  }
  function exportJSON() { return JSON.stringify(S, null, 2); }
  function importJSON(txt) { const o = JSON.parse(txt); S = merge(S, o); commit(); }
  function reset() { S = fresh(); outbox = []; commit(); }

  window.CQ = {
    get S() { return S; }, TARGET, MIN_FRAC, MAX_LEVEL, WEEKLY_TARGETS, WEEKLY_MILESTONES,
    dstr, addDays, daysBetween, weekStart, uid,
    load, save, commit, emit, on: f => listeners.add(f), day, balance, lifetime, totalRedeemed, addStars, minutesOf, totalMinutes,
    streak, bestStreak, tick, finishPhase, recordPuzzle, recentAccuracy, setLevel, puzzleStarsLeft, puzzleStarCap,
    performanceRating, logRatingUpdate,
    getWeekStats, evaluateWeeklyBonusesAndPenalties, toggleExcusedDay,
    classifyRepertoire, syncLichessData, logManualRepertoireWin, levelChecklist, claimLevelClear,
    parentRedeem, redeem, resolveRedemption, cloudPull, cloudPush, applySetupHash, makeSetupLink, exportJSON, importJSON, reset,
    get timer() { return timer; }, get sync() { return { status: syncStatus, last: lastSync }; }, DEFAULT_REWARDS,
  };
})();
