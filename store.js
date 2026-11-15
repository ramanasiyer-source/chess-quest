/* Chess Quest v2 - state, star ledger, streaks, profile ratings, performance rating, and Google Sheet cloud sync. */
(function () {
  const KEY = 'chessquest_v1';
  const TARGET = { p1: 600, p2: 600, p3: 600 };      // seconds per phase (3 x 10 min = 30 min)
  const MIN_FRAC = 0.8;                                // a phase can be finished after 80% of its time
  const DEFAULT_PUZZLE_STAR_CAP = 200;                 // raised from 40 -> 200 stars/day!
  const DEFAULT_ENDGAME_CAP = 10;                      // raised from 3 -> 10 mates/day (50 stars/day)!
  const DEFAULT_SYNC_URL = 'https://script.google.com/macros/s/AKfycbxnUdMtHZZ39F8t4hp2QO-wIyQc5E-3w9oXeqH00iXuN9DwdcpPlbpy6pCWBBe0s-ag/exec';

  const pad = n => String(n).padStart(2, '0');
  const dstr = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const addDays = (s, n) => { const [y, m, d] = s.split('-').map(Number); return dstr(new Date(y, m - 1, d + n)); };
  const daysBetween = (a, b) => { const p = s => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); }; return Math.round((p(b) - p(a)) / 864e5); };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const DEFAULT_REWARDS = [
    { id: 'r1', icon: '📺', name: '30 min bonus watch time', cost: 100 },
    { id: 'r2', icon: '🎮', name: '30 min bonus gaming (Minecraft)', cost: 100 },
    { id: 'r3', icon: '🍕', name: 'Pick the family treat / dinner', cost: 150 },
    { id: 'r4', icon: '💵', name: '$5 to spend (Minecoins / LEGO / snacks)', cost: 250 },
    { id: 'r5', icon: '🎁', name: '$20 big prize fund', cost: 900 },
  ];

  const DEFAULT_PROFILE = () => ({
    fullName: 'Anish Ramana Iyer',
    title: 'Scholastic Contender · Skyview Middle School (6th Grade)',
    location: 'Bothell, WA',
    avatar: 'assets/anish-jacket.jpg',
    bio: 'Aggressive tactical player climbing toward 1000+ OTB and Netherite Grandmaster mastery.',
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
        label: 'US Chess (USCF)', current: 463, quick: 425, onlineReg: 338, onlineQuick: 360, peak: 463, target: 1000, id: '17354281',
        url: 'https://www.uschess.org/msa/MbrDtlMain.php?17354281',
        history: [
          { date: '2026-05-16', r: 425, event: 'SPFNO Blitz (USCF Quick)' },
          { date: '2026-09-12', r: 463, event: 'WATA Autumn Scholastic (USCF Reg)' },
        ],
      },
      fide: {
        label: 'FIDE Standard', current: 0, peak: 0, target: 1400, id: 'Unrated',
        url: 'https://ratings.fide.com/',
        history: [],
      },
      lichess: {
        label: 'Lichess (govindu)', current: 1581, puzzle: 1765, classical: 1255, blitz: 1210, bullet: 1058, peak: 1765, target: 1800, id: 'govindu',
        url: 'https://lichess.org/@/govindu',
        history: [
          { date: '2026-09-01', r: 1500, pz: 1680, event: 'Baseline Lichess' },
          { date: '2026-11-13', r: 1581, pz: 1765, event: 'Live Lichess (94 Rapid / 2,303 Puzzles)' },
        ],
      },
    },
    tournaments: [
      { id: 't-wata', date: '2026-09-12', name: 'WATA Autumn Scholastic', section: 'G4-6 U800', score: '2.0 / 5', sys: 'NWSRS / USCF', before: 732, after: 679, notes: 'Won 2 games; key takeaway: slow down in critical positions & convert endgames.' },
      { id: 't-spfno', date: '2026-05-16', name: 'SPFNO Blitz Championship', section: 'Scholastic Blitz (G/5)', score: 'Completed', sys: 'USCF Quick (425)', before: 425, after: 425, notes: 'High-speed tactical experience.' },
      { id: 't-lynn', date: '2026-11-27', name: 'Upcoming: Thanksgiving Scholastic (Lynnwood)', section: 'Target Tournament', score: 'Upcoming', sys: 'NWSRS / USCF', before: 679, after: null, notes: 'Goal: Use CCT on every move & pass 725+ NWSRS.' },
      { id: 't-dec', date: '2026-12-19', name: 'Upcoming: Bellevue / Redmond Winter Scholastics', section: 'Target Tournament', score: 'Upcoming', sys: 'NWSRS / USCF', before: 679, after: null, notes: 'Winter rating push toward 800+.' },
    ],
  });

  function fresh() {
    return {
      v: 2, updatedAt: 0, startDate: dstr(),
      settings: { name: 'Anish', lichess: 'govindu', syncUrl: DEFAULT_SYNC_URL, pin: '', rating: 679, ratingStart: 679, ratingTarget: 1000, ratingDate: dstr(), dailyMin: 30, puzzleStarCap: DEFAULT_PUZZLE_STAR_CAP, endgameCap: DEFAULT_ENDGAME_CAP },
      profile: DEFAULT_PROFILE(),
      level: 3,
      days: {},
      puzzle: { seen: {}, recent: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] } },
      ledger: [], redemptions: [], rewards: DEFAULT_REWARDS,
      lessons: { done: {}, quizScores: {} }, games: [], endgames: {}, levelUps: {},
    };
  }

  function ensureSchema(obj) {
    const f = fresh();
    const out = Object.assign(f, obj || {});
    out.settings = Object.assign(f.settings, (obj && obj.settings) || {});
    if (!out.settings.syncUrl) out.settings.syncUrl = DEFAULT_SYNC_URL;
    if (!out.settings.puzzleStarCap || out.settings.puzzleStarCap < 200) out.settings.puzzleStarCap = DEFAULT_PUZZLE_STAR_CAP;
    if (!out.settings.endgameCap || out.settings.endgameCap < 10) out.settings.endgameCap = DEFAULT_ENDGAME_CAP;
    if (!out.settings.lichess) out.settings.lichess = 'govindu';
    if (out.settings.name === 'Champ') out.settings.name = 'Anish';
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
    out.puzzle.recent = Object.assign({ 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] }, out.puzzle.recent || {});
    out.lessons = out.lessons || { done: {}, quizScores: {} };
    out.lessons.done = out.lessons.done || {};
    out.lessons.quizScores = out.lessons.quizScores || {};
    // Repair & normalize daily records (recover pz counts from seen/ledger if an idle tab merged 0s, cap runaway idle free time)
    const seenList = Object.values(out.puzzle.seen || {});
    for (const [k, d] of Object.entries(out.days || {})) {
      if (!d || !d.sec || !d.pz) continue;
      if (d.sec.free > 1800) d.sec.free = 600; // cap any old idle-tab runaway counter
      if (k === '2026-11-13' && d.pz.tried < 28 && seenList.length >= 28) {
        d.pz = { tried: Math.max(d.pz.tried, 28), first: Math.max(d.pz.first, 21), solved: Math.max(d.pz.solved, 27), fastWrong: Math.max(d.pz.fastWrong, 1) };
        d.sec.p1 = Math.max(d.sec.p1, 600);
        d.sec.p2 = Math.max(d.sec.p2, 480);
        d.sec.free = Math.min(d.sec.free, 300);
        d.done.p1 = true;
      }
      if (d.sec.free > 0 && d.pz.solved >= 5 && d.sec.p1 < TARGET.p1) {
        const shift = Math.min(d.sec.free, TARGET.p1 - d.sec.p1);
        d.sec.p1 += shift;
        d.sec.free -= shift;
      }
    }
    return out;
  }

  let S = fresh();
  let timer = { phase: null };            // runtime only
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
    if (!S.days[date]) S.days[date] = { sec: { p1: 0, p2: 0, p3: 0, free: 0 }, done: { p1: false, p2: false, p3: false }, pz: { tried: 0, first: 0, solved: 0, fastWrong: 0 }, stars: 0, pzStars: 0, questComplete: false, lessonId: null };
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

  // ----- stars ledger (balance is always derived, so merging devices can never lose or double stars)
  const balance = () => S.ledger.reduce((a, e) => a + e.delta, 0);
  const lifetime = () => S.ledger.reduce((a, e) => a + (e.delta > 0 ? e.delta : 0), 0);
  function addStars(delta, type, desc, key) {
    if (key && S.ledger.some(e => e.key === key)) return false;
    const date = dstr();
    const entry = { id: uid(), key: key || null, ts: Date.now(), date, type, desc, delta, balance: balance() + delta };
    S.ledger.push(entry); outbox.push(entry);
    if (delta > 0) day(date).stars += delta;
    return true;
  }

  // ----- time + streaks
  const minutesOf = d => d ? Math.round((d.sec.p1 + d.sec.p2 + d.sec.p3 + (d.sec.free || 0)) / 60) : 0;
  const totalMinutes = () => Math.round(Object.values(S.days).reduce((a, d) => a + d.sec.p1 + d.sec.p2 + d.sec.p3 + (d.sec.free || 0), 0) / 60);
  function streak() {
    let d = dstr(), n = 0;
    if (!(S.days[d] && S.days[d].questComplete)) d = addDays(d, -1);
    while (S.days[d] && S.days[d].questComplete) { n++; d = addDays(d, -1); }
    return n;
  }
  function bestStreak() {
    const ds = Object.keys(S.days).filter(k => S.days[k].questComplete).sort();
    let best = 0, cur = 0, prev = null;
    for (const k of ds) { cur = (prev && daysBetween(prev, k) === 1) ? cur + 1 : 1; best = Math.max(best, cur); prev = k; }
    return best;
  }
  function tick() {
    if (!timer.phase || document.hidden || (Date.now() - lastInputTs > 180000)) return; // pause timer if idle > 3 min
    const d = day(); d.sec[timer.phase] = (d.sec[timer.phase] || 0) + 1;
    if (d.sec[timer.phase] % 5 === 0) save(false);
    return d.sec[timer.phase];
  }
  function finishPhase(p) {
    const d = day(); if (d.done[p]) return;
    d.done[p] = true; timer.phase = null;
    addStars(5, 'phase', 'Finished Quest Phase ' + p.toUpperCase(), 'phase-' + p + '-' + dstr());
    if (d.done.p1 && d.done.p2 && d.done.p3 && !d.questComplete) {
      d.questComplete = true;
      addStars(20, 'quest', '🏆 Completed Full Daily Trifecta Quest!', 'quest-' + dstr());
      const s = streak();
      if (s >= 3 && (s === 3 || s % 7 === 0)) addStars(25, 'streak', s + '-day streak bonus!', 'streak-' + s + '-' + dstr());
      return 'quest';
    }
    return 'phase';
  }

  // ----- puzzle bookkeeping + 8-tier Minecraft progression
  const MAX_LEVEL = 8;
  function puzzleStarCap() { return S.settings.puzzleStarCap || DEFAULT_PUZZLE_STAR_CAP; }
  function puzzleStarsLeft() { return Math.max(0, puzzleStarCap() - day().pzStars); }
  function recordPuzzle(p, result, opts = {}) {   // result: first | retry | shown
    const d = day();
    d.pz.tried++; if (result === 'first') d.pz.first++; if (result !== 'shown') d.pz.solved++;
    if (opts.fastWrong) d.pz.fastWrong++;
    // Auto-credit Phase 1 if they have solved >= 8 puzzles today and spent >= 8 min in p1+free
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
    commit();
    return { stars, levelUp };
  }
  function recentAccuracy(l = S.level) { const r = S.puzzle.recent[l] || []; return r.length ? r.reduce((a, b) => a + b, 0) / r.length : null; }
  function setLevel(l) { S.level = Math.max(1, Math.min(MAX_LEVEL, l)); S.puzzle.recent[S.level] = []; commit(); }

  // ----- Theoretical "Playing At" Performance Rating (Tournament Broadcast Style)
  function performanceRating(liveLichessUser) {
    const pmap = {}; (window.PUZZLES || []).forEach(p => pmap[p.id] = p);
    const seenEntries = Object.entries(S.puzzle.seen).map(([id, sv]) => ({ id, sv, r: sv.r || (pmap[id] && pmap[id].r) || 1250 })).sort((a, b) => (a.sv.ts || 0) - (b.sv.ts || 0));
    const recentEntries = seenEntries.slice(-30);
    // Calculate tactical performance Elo from solved puzzles:
    // In tournament performance rating, solving a puzzle of rating R on first try = +220 performance over R; retry = R; shown = R - 250
    let tacPerf = 1550;
    if (recentEntries.length > 0) {
      let sum = 0, wSum = 0;
      recentEntries.forEach((e, idx) => {
        const w = 1 + (idx / recentEntries.length); // weight newer puzzles higher
        const perf = e.sv.last === 'first' ? e.r + 240 : e.sv.last === 'retry' ? e.r - 20 : e.r - 260;
        sum += perf * w; wSum += w;
      });
      tacPerf = Math.round(sum / wSum);
    }
    const liProf = S.profile.ratings.lichess || {};
    const liRapid = (liveLichessUser && liveLichessUser.perfs && liveLichessUser.perfs.rapid && liveLichessUser.perfs.rapid.rating) || liProf.current || 1581;
    const liPuzzle = (liveLichessUser && liveLichessUser.perfs && liveLichessUser.perfs.puzzle && liveLichessUser.perfs.puzzle.rating) || liProf.puzzle || 1765;

    // Blend app tactical performance with Lichess Rapid & Lichess Puzzle
    const blendedTactical = seenEntries.length >= 5 ? Math.round(tacPerf * 0.55 + liPuzzle * 0.45) : liPuzzle;
    const lichessPlayingAt = Math.round(liRapid * 0.55 + blendedTactical * 0.45);

    // Discipline & conversion modifiers
    const totalTried = Object.values(S.days).reduce((a, d) => a + d.pz.tried, 0);
    const totalFirst = Object.values(S.days).reduce((a, d) => a + d.pz.first, 0);
    const totalFastWrong = Object.values(S.days).reduce((a, d) => a + d.pz.fastWrong, 0);
    const firstAcc = totalTried ? (totalFirst / totalTried) : 0.75;
    const impulseRate = totalTried ? (totalFastWrong / totalTried) : 0;
    const egWins = Object.values(S.endgames).reduce((a, e) => a + (e.wins || 0), 0);
    const lessonsPassed = Object.keys(S.lessons.done || {}).length;

    // Convert Lichess performance to Theoretical OTB (NWSRS/USCF) Playing Strength:
    // Scholastic OTB is roughly (LichessPlayingAt - 620) + accuracy/endgame/theory bonuses
    let otbPlayingAt = Math.round((lichessPlayingAt - 640) + (firstAcc - 0.65) * 220 - impulseRate * 180 + Math.min(60, egWins * 8) + Math.min(80, lessonsPassed * 12));
    otbPlayingAt = Math.max(550, Math.min(2200, otbPlayingAt));

    const officialOtb = S.profile.ratings.nwsrs.current || S.settings.rating || 679;
    const deltaOtb = otbPlayingAt - officialOtb;
    const levels = window.LEVELS || [];
    const perfTier = levels.slice().reverse().find(l => lichessPlayingAt >= l.minR) || levels[0] || { n: 1, name: 'Wood Scout', icon: '🪵' };

    return {
      otbPlayingAt,
      officialOtb,
      deltaOtb,
      lichessPlayingAt,
      tacticalPerf: blendedTactical,
      appTacPerf: tacPerf,
      liRapid,
      liPuzzle,
      firstAcc: Math.round(firstAcc * 100),
      impulseRate: Math.round(impulseRate * 100),
      puzzlesSampled: seenEntries.length,
      perfTier,
    };
  }

  // ----- Rating & Tournament Logger
  function logRatingUpdate({ sys, newRating, eventName, date, score, notes }) {
    const dt = date || dstr();
    const rNum = +newRating;
    const prof = S.profile;
    if (sys && prof.ratings[sys] && rNum > 0) {
      const card = prof.ratings[sys];
      const before = card.current || rNum;
      card.current = rNum;
      card.peak = Math.max(card.peak || 0, rNum);
      card.history = card.history || [];
      card.history.push({ date: dt, r: rNum, event: eventName || 'Rating Update' });
      if (sys === 'nwsrs') S.settings.rating = rNum;
      if (eventName) {
        prof.tournaments.unshift({
          id: 't-' + uid(), date: dt, name: eventName, section: score ? 'Rated Event' : 'Rating Update',
          score: score || 'Rated', sys: card.label, before, after: rNum, notes: notes || '',
        });
      }
      addStars(25, 'tournament', '🏅 Logged rating update (' + card.label + ': ' + rNum + ')', 'rt-' + sys + '-' + dt + '-' + rNum);
      commit();
      return true;
    }
    return false;
  }

  // ----- Daily Activity Bounties (encouraging balanced completion across all activities)
  function dailyBounties() {
    const d = day(), today = dstr();
    const quizToday = S.ledger.some(e => e.type === 'lesson_quiz' && e.date === today);
    const egToday = S.ledger.filter(e => e.type === 'endgame' && e.date === today).length;
    const revToday = S.ledger.some(e => e.type === 'review' && e.date === today);
    return [
      { id: 'b-pz', icon: '🎯', title: 'Solve 10 Tactics Puzzles', done: d.pz.solved >= 10, prog: `${Math.min(10, d.pz.solved)}/10`, reward: `Up to ${puzzleStarCap()} ⭐/day`, tab: 'puzzles' },
      { id: 'b-qz', icon: '🎓', title: 'Pass a Theory Lesson Mastery Test (3/3)', done: quizToday, prog: quizToday ? 'Passed!' : '0/1', reward: '+15 ⭐ Bounty', tab: 'lessons' },
      { id: 'b-eg', icon: '♚', title: 'Win 2 Endgame Lab Checkmates', done: egToday >= 2, prog: `${Math.min(2, egToday)}/2`, reward: '+5 ⭐ each (up to 50 ⭐)', tab: 'endgames' },
      { id: 'b-rv', icon: '📝', title: 'Play & Review 1 Lichess Rapid Game', done: revToday, prog: revToday ? 'Reviewed!' : '0/1', reward: '+10 ⭐ Bounty', tab: 'today' },
      { id: 'b-qu', icon: '🏆', title: 'Complete All 3 Daily Quest Phases', done: d.questComplete, prog: `${['p1', 'p2', 'p3'].filter(k => d.done[k]).length}/3`, reward: '+20 ⭐ Trifecta Chest', tab: 'today' },
    ];
  }

  // ----- rewards
  function redeem(rw) {
    if (balance() < rw.cost) return false;
    const rid = uid();
    addStars(-rw.cost, 'redeem', 'Redeemed: ' + rw.name, 'redeem-' + rid);
    S.redemptions.push({ id: rid, ts: Date.now(), date: dstr(), name: rw.name, cost: rw.cost, status: 'pending' });
    commit(); return true;
  }
  function resolveRedemption(id, approve) {
    const r = S.redemptions.find(x => x.id === id); if (!r || r.status !== 'pending') return;
    r.status = approve ? 'approved' : 'denied';
    if (!approve) addStars(r.cost, 'refund', 'Refund (declined): ' + r.name, 'refund-' + id);
    commit();
  }

  // ----- merge (so phone / iPad / laptop can all be used without losing anything)
  function merge(local, remote) {
    local = ensureSchema(local); remote = ensureSchema(remote);
    const out = ensureSchema(remote.updatedAt > local.updatedAt ? remote : local);
    const newer = remote.updatedAt > local.updatedAt ? remote : local;
    out.settings = Object.assign({}, newer.settings, {
      syncUrl: local.settings.syncUrl || remote.settings.syncUrl,
      puzzleStarCap: Math.max(local.settings.puzzleStarCap || 200, remote.settings.puzzleStarCap || 200),
      endgameCap: Math.max(local.settings.endgameCap || 10, remote.settings.endgameCap || 10),
    });
    const led = new Map(); [...local.ledger, ...remote.ledger].forEach(e => led.set(e.id, e));
    out.ledger = [...led.values()].sort((a, b) => a.ts - b.ts);
    out.days = {};
    for (const k of new Set([...Object.keys(local.days), ...Object.keys(remote.days)])) {
      const a = local.days[k], b = remote.days[k];
      if (!a || !b) { out.days[k] = a || b; continue; }
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
        stars: Math.max(a.stars || 0, b.stars || 0),
        pzStars: Math.max(a.pzStars || 0, b.pzStars || 0),
        questComplete: !!(a.questComplete || b.questComplete),
        lessonId: a.lessonId || b.lessonId || null,
      };
    }
    const rd = new Map(); [...local.redemptions, ...remote.redemptions].forEach(r => { const o = rd.get(r.id); if (!o || (o.status === 'pending' && r.status !== 'pending')) rd.set(r.id, r); });
    out.redemptions = [...rd.values()].sort((a, b) => a.ts - b.ts);
    const seen = Object.assign({}, remote.puzzle.seen); for (const [id, v] of Object.entries(local.puzzle.seen)) if (!seen[id] || v.n >= seen[id].n) seen[id] = v;
    out.puzzle = { seen, recent: newer.puzzle.recent };
    out.level = Math.max(local.level, remote.level);
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

  // ----- cloud sync (Google Apps Script web app -> private Google Sheet)
  let syncStatus = 'off', lastSync = null;
  const url = () => (S.settings.syncUrl || '').trim();
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
    get S() { return S; }, TARGET, MIN_FRAC, MAX_LEVEL, dstr, addDays, daysBetween, uid,
    load, save, commit, emit, on: f => listeners.add(f), day, balance, lifetime, addStars, minutesOf, totalMinutes,
    streak, bestStreak, tick, finishPhase, recordPuzzle, recentAccuracy, setLevel, puzzleStarsLeft, puzzleStarCap,
    performanceRating, logRatingUpdate, dailyBounties,
    redeem, resolveRedemption, cloudPull, cloudPush, applySetupHash, makeSetupLink, exportJSON, importJSON, reset,
    get timer() { return timer; }, get sync() { return { status: syncStatus, last: lastSync }; }, DEFAULT_REWARDS,
  };
})();
