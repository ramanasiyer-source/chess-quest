/* Chess Quest - state, star ledger, streaks and Google Sheet cloud sync. */
(function () {
  const KEY = 'chessquest_v1';
  const TARGET = { p1: 600, p2: 600, p3: 600 };      // seconds per phase (3 x 10 min = 30 min)
  const MIN_FRAC = 0.8;                                // a phase can be finished after 80% of its time
  const DAILY_PUZZLE_STAR_CAP = 40;

  const pad = n => String(n).padStart(2, '0');
  const dstr = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const addDays = (s, n) => { const [y, m, d] = s.split('-').map(Number); return dstr(new Date(y, m - 1, d + n)); };
  const daysBetween = (a, b) => { const p = s => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); }; return Math.round((p(b) - p(a)) / 864e5); };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const DEFAULT_REWARDS = [
    { id: 'r1', icon: '📺', name: '30 min bonus watch time', cost: 100 },
    { id: 'r2', icon: '🎮', name: '30 min bonus gaming', cost: 100 },
    { id: 'r3', icon: '🍕', name: 'Pick the family treat / dinner', cost: 150 },
    { id: 'r4', icon: '💵', name: '$5 to spend (Robux / LEGO / snacks)', cost: 250 },
    { id: 'r5', icon: '🎁', name: '$20 big prize fund', cost: 900 },
  ];

  function fresh() {
    return {
      v: 1, updatedAt: 0, startDate: dstr(),
      settings: { name: 'Champ', lichess: '', syncUrl: '', pin: '', rating: 600, ratingStart: 600, ratingTarget: 1000, ratingDate: dstr(), dailyMin: 30 },
      level: 1,
      days: {},
      puzzle: { seen: {}, recent: { 1: [], 2: [], 3: [], 4: [] } },
      ledger: [], redemptions: [], rewards: DEFAULT_REWARDS,
      lessons: { done: {} }, games: [], endgames: {}, levelUps: {},
    };
  }

  let S = fresh();
  let timer = { phase: null };            // runtime only
  const listeners = new Set();
  let saveT = null, pushT = null, outbox = [];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const o = JSON.parse(raw); S = Object.assign(fresh(), o); S.settings = Object.assign(fresh().settings, o.settings || {}); }
    } catch (e) { console.warn('load failed', e); }
    try { outbox = JSON.parse(localStorage.getItem(KEY + '_outbox') || '[]'); } catch { outbox = []; }
  }
  function day(date = dstr()) {
    if (!S.days[date]) S.days[date] = { sec: { p1: 0, p2: 0, p3: 0, free: 0 }, done: { p1: false, p2: false, p3: false }, pz: { tried: 0, first: 0, solved: 0, fastWrong: 0 }, stars: 0, pzStars: 0, questComplete: false, lessonId: null };
    return S.days[date];
  }
  function save(touch = true, schedulePush = touch) {   // only real user changes (touch) schedule a cloud push; internal saves never loop
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
  function tick() {   // called every second by the UI while a phase timer is running
    if (!timer.phase || document.hidden) return;
    const d = day(); d.sec[timer.phase] += 1;
    if (d.sec[timer.phase] % 5 === 0) save(false);
    return d.sec[timer.phase];
  }
  function finishPhase(p) {
    const d = day(); if (d.done[p]) return;
    d.done[p] = true; timer.phase = null;
    if (d.done.p1 && d.done.p2 && d.done.p3 && !d.questComplete) {
      d.questComplete = true;
      addStars(10, 'quest', 'Completed the daily 30-minute quest', 'quest-' + dstr());
      const s = streak();
      if (s >= 3 && (s === 3 || s % 7 === 0)) addStars(20, 'streak', s + '-day streak bonus!', 'streak-' + s + '-' + dstr());
      return 'quest';
    }
    return 'phase';
  }

  // ----- puzzle bookkeeping + adaptive levels
  function puzzleStarsLeft() { return Math.max(0, DAILY_PUZZLE_STAR_CAP - day().pzStars); }
  function recordPuzzle(p, result, opts = {}) {   // result: first | retry | shown
    const d = day();
    d.pz.tried++; if (result === 'first') d.pz.first++; if (result !== 'shown') d.pz.solved++;
    if (opts.fastWrong) d.pz.fastWrong++;
    const s = S.puzzle.seen[p.id] || { n: 0, first: 0 };
    s.n++; if (result === 'first') s.first++; s.last = result; s.ts = Date.now(); S.puzzle.seen[p.id] = s;
    let stars = result === 'first' ? 2 : result === 'retry' ? 1 : 0;
    if (opts.challenge) stars *= 2;
    stars = Math.min(stars, puzzleStarsLeft());
    if (stars > 0) { addStars(stars, 'puzzle', (opts.challenge ? '⚡ ' : '') + 'Puzzle ' + p.id + (result === 'first' ? ' (first try)' : ' (retry)')); d.pzStars += stars; }
    let levelUp = null;
    if (!opts.challenge && p.l === S.level) {
      const r = S.puzzle.recent[S.level] = (S.puzzle.recent[S.level] || []).concat(result === 'first' ? 1 : 0).slice(-10);
      if (r.length >= 10 && r.reduce((a, b) => a + b, 0) >= 8 && S.level < 4) {
        S.level++; S.puzzle.recent[S.level] = []; S.levelUps[S.level] = dstr();
        addStars(50, 'levelup', 'Level up to Level ' + S.level + '!', 'levelup-' + S.level);
        levelUp = S.level;
      }
    }
    commit();
    return { stars, levelUp };
  }
  function recentAccuracy(l = S.level) { const r = S.puzzle.recent[l] || []; return r.length ? r.reduce((a, b) => a + b, 0) / r.length : null; }
  function setLevel(l) { S.level = Math.max(1, Math.min(4, l)); S.puzzle.recent[S.level] = []; commit(); }

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
    const out = Object.assign({}, remote.updatedAt > local.updatedAt ? remote : local);
    const newer = remote.updatedAt > local.updatedAt ? remote : local;
    out.settings = Object.assign({}, newer.settings, { syncUrl: local.settings.syncUrl || remote.settings.syncUrl });
    const led = new Map(); [...local.ledger, ...remote.ledger].forEach(e => led.set(e.id, e));
    out.ledger = [...led.values()].sort((a, b) => a.ts - b.ts);
    out.days = {};
    for (const k of new Set([...Object.keys(local.days), ...Object.keys(remote.days)])) {
      const a = local.days[k], b = remote.days[k];
      if (!a || !b) { out.days[k] = a || b; continue; }
      const score = d => d.sec.p1 + d.sec.p2 + d.sec.p3 + (d.sec.free || 0) + d.pz.tried * 10;
      const w = Object.assign({}, score(a) >= score(b) ? a : b);
      w.done = { p1: a.done.p1 || b.done.p1, p2: a.done.p2 || b.done.p2, p3: a.done.p3 || b.done.p3 };
      w.questComplete = a.questComplete || b.questComplete; out.days[k] = w;
    }
    const rd = new Map(); [...local.redemptions, ...remote.redemptions].forEach(r => { const o = rd.get(r.id); if (!o || (o.status === 'pending' && r.status !== 'pending')) rd.set(r.id, r); });
    out.redemptions = [...rd.values()].sort((a, b) => a.ts - b.ts);
    const seen = Object.assign({}, remote.puzzle.seen); for (const [id, v] of Object.entries(local.puzzle.seen)) if (!seen[id] || v.n >= seen[id].n) seen[id] = v;
    out.puzzle = { seen, recent: newer.puzzle.recent };
    out.level = Math.max(local.level, remote.level);
    out.lessons = { done: Object.assign({}, remote.lessons.done, local.lessons.done) };
    out.levelUps = Object.assign({}, remote.levelUps, local.levelUps);
    out.endgames = Object.assign({}, remote.endgames, local.endgames);
    const g = new Map(); [...(local.games || []), ...(remote.games || [])].forEach(x => g.set(x.id, x)); out.games = [...g.values()].sort((a, b) => a.ts - b.ts);
    out.startDate = local.startDate < remote.startDate ? local.startDate : remote.startDate;
    out.updatedAt = Math.max(local.updatedAt, remote.updatedAt);
    return out;
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
      if (j.status === 'success' && j.state) { S = Object.assign(fresh(), merge(S, j.state)); save(false, false); }
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
      await cloudPull();                       // always merge the cloud copy first so devices never overwrite each other
      payload.state = S; payload.updatedAt = S.updatedAt;
      syncStatus = 'syncing';
      await fetch(url(), { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      outbox = outbox.slice(sent); save(false, false); syncStatus = 'ok'; lastSync = new Date();
    } catch (e) { console.warn('push failed (will retry)', e); syncStatus = 'error'; }
    emit();
  }

  function applySetupHash() {   // one-tap setup link: #setup=<base64 json>  (sheet URL + lichess name)
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
  function importJSON(txt) { const o = JSON.parse(txt); S = Object.assign(fresh(), merge(S, Object.assign(fresh(), o))); commit(); }
  function reset() { S = fresh(); outbox = []; commit(); }

  window.CQ = {
    get S() { return S; }, TARGET, MIN_FRAC, dstr, addDays, daysBetween, uid,
    load, save, commit, emit, on: f => listeners.add(f), day, balance, lifetime, addStars, minutesOf, totalMinutes,
    streak, bestStreak, tick, finishPhase, recordPuzzle, recentAccuracy, setLevel, puzzleStarsLeft,
    redeem, resolveRedemption, cloudPull, cloudPush, applySetupHash, makeSetupLink, exportJSON, importJSON, reset,
    get timer() { return timer; }, get sync() { return { status: syncStatus, last: lastSync }; }, DEFAULT_REWARDS,
  };
})();
