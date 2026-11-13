/* Chess Quest - UI */
(function () {
  const S = () => CQ.S;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const rand = a => a[Math.floor(Math.random() * a.length)];
  const PHASES = [
    { id: 'p1', icon: '🎯', title: 'Tactical Sniping', sub: 'Puzzles + the Golden Rule (Checks, Captures, Threats)' },
    { id: 'p2', icon: '📚', title: 'Lesson & Endgame Drill', sub: 'One focused idea, then practice it' },
    { id: 'p3', icon: '♟️', title: 'Play & Review', sub: 'One rapid game on Lichess + a 2-minute blunder review' },
  ];
  const TABS = [['today', '🏠', 'Today'], ['puzzles', '🧩', 'Puzzles'], ['lessons', '📚', 'Lessons'], ['endgames', '♚', 'Endgames'], ['progress', '📈', 'Progress'], ['vault', '⭐', 'Vault'], ['settings', '⚙️', 'Settings']];
  const UI = window.CQ_UI = { tab: 'today', open: null, persist: {}, lichess: { user: null, games: null, err: null } };

  /* ---------- tiny helpers: toast, modal, confetti, beep ---------- */
  let audioCtx = null;
  function beep(freq, dur = 0.12, type = 'sine') {
    try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.type = type; o.frequency.value = freq; g.gain.value = 0.05; o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + dur); } catch { }
  }
  const sfx = { good() { beep(660); setTimeout(() => beep(880), 110); }, bad() { beep(180, 0.2, 'sawtooth'); }, win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.18), i * 130)); } };
  function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = msg; document.body.appendChild(t); setTimeout(() => t.classList.add('show'), 10); setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3200); }
  function confetti() { const em = ['⭐', '🎉', '✨', '♟️', '🏆']; for (let i = 0; i < 40; i++) { const e = document.createElement('span'); e.className = 'confetti'; e.textContent = rand(em); e.style.left = Math.random() * 100 + 'vw'; e.style.animationDelay = Math.random() * 0.8 + 's'; e.style.fontSize = 16 + Math.random() * 22 + 'px'; document.body.appendChild(e); setTimeout(() => e.remove(), 3500); } }
  function modal(html, buttons = [['OK', null, true]]) {
    return new Promise(res => {
      const m = document.createElement('div'); m.className = 'modal';
      m.innerHTML = `<div class="card">${html}<div class="row end" style="margin-top:14px"></div></div>`;
      const row = $('.row', m);
      buttons.forEach(([label, val, primary]) => { const b = document.createElement('button'); b.textContent = label; if (primary) b.className = 'primary'; b.onclick = () => { m.remove(); res(val); }; row.appendChild(b); });
      document.body.appendChild(m);
    });
  }
  async function askPin(reason) {
    const pin = S().settings.pin; if (!pin) return true;
    const m = document.createElement('div'); m.className = 'modal';
    return new Promise(res => {
      m.innerHTML = `<div class="card"><h3>🔒 Parent PIN</h3><p>${esc(reason || 'Enter the parent PIN')}</p><input id="pinin" type="password" inputmode="numeric" autocomplete="off" style="width:100%"><div class="row end" style="margin-top:12px"><button id="pc">Cancel</button><button id="po" class="primary">OK</button></div></div>`;
      document.body.appendChild(m); $('#pinin', m).focus();
      const done = ok => { m.remove(); res(ok); };
      $('#pc', m).onclick = () => done(false);
      $('#po', m).onclick = () => { if ($('#pinin', m).value === pin) done(true); else { toast('Wrong PIN'); $('#pinin', m).value = ''; } };
    });
  }

  /* ---------- Lichess (public API, no password needed) ---------- */
  async function loadLichess(force) {
    const u = (S().settings.lichess || '').trim(); if (!u) return;
    if (!force && UI.lichess.user && UI.lichess.name === u && Date.now() - UI.lichess.ts < 300000) return;
    UI.lichess = { name: u, ts: Date.now(), user: null, games: null, err: null };
    try {
      const r = await fetch('https://lichess.org/api/user/' + encodeURIComponent(u)); if (!r.ok) throw new Error('user ' + r.status);
      UI.lichess.user = await r.json();
      const g = await fetch('https://lichess.org/api/games/user/' + encodeURIComponent(u) + '?max=8&opening=true', { headers: { Accept: 'application/x-ndjson' } });
      if (!g.ok) throw new Error('games ' + g.status);
      UI.lichess.games = (await g.text()).trim().split('\n').filter(Boolean).map(l => JSON.parse(l)).filter(x => x && x.players && x.players.white && x.players.black);
    } catch (e) { UI.lichess.err = String(e); UI.lichess.games = UI.lichess.games || []; }
    if (['progress', 'today'].includes(UI.tab)) renderView();
  }

  /* ---------- puzzle trainer ---------- */
  const PMAP = {}; (window.PUZZLES || []).forEach(p => PMAP[p.id] = p);
  function pickPuzzle(level) {
    const pool = (window.PUZZLES || []).filter(p => p.l === level); if (!pool.length) return null;
    const seen = S().puzzle.seen, unseen = pool.filter(p => !seen[p.id]);
    if (unseen.length) return rand(unseen);
    const sorted = pool.slice().sort((a, b) => ((seen[a.id].last === 'first') - (seen[b.id].last === 'first')) || (seen[a.id].ts - seen[b.id].ts));
    return rand(sorted.slice(0, 8));
  }
  function makeTrainer(opts = {}) {
    const root = document.createElement('div'); root.className = 'trainer';
    root.innerHTML = `
      <div class="tr-top"><div id="tr-info" class="muted"></div><label class="chal"><input type="checkbox" id="tr-chal"> ⚡ Challenge <small>(next level · 2× ⭐)</small></label></div>
      <div class="board-wrap"><div id="tr-board"></div></div>
      <div class="rule">🛑 Before you move: <b>C</b>hecks · <b>C</b>aptures · <b>T</b>hreats — <u>theirs</u> and yours</div>
      <div id="tr-msg" class="tr-msg">Loading…</div>
      <div class="row center wrap"><button id="tr-hint">💡 Hint</button><button id="tr-show">👁 Show answer</button><button id="tr-next" class="primary" disabled>Next puzzle ▶</button></div>`;
    const T = { p: null, idx: 0, wrong: 0, done: false, t0: 0, fast: false, challenge: false, busy: false };
    const board = new Board($('#tr-board', root), { onMove: (f, t) => onMove(f, t) });
    const msg = (h, cls = '') => { const m = $('#tr-msg', root); m.className = 'tr-msg ' + cls; m.innerHTML = h; };
    const sol = () => T.p.s.split(' ');
    function next() {
      T.challenge = $('#tr-chal', root).checked;
      const lvl = Math.min(4, S().level + (T.challenge ? 1 : 0));
      const p = pickPuzzle(lvl);
      if (!p) return msg('No puzzles for this level yet.');
      Object.assign(T, { p, idx: 0, wrong: 0, done: false, t0: Date.now(), fast: false, busy: false, shown: false });
      const side = new Chess(p.f).turn();
      board.locked = false;
      board.set(p.f, side, p.lm ? [p.lm.slice(0, 2), p.lm.slice(2, 4)] : null);
      $('#tr-info', root).innerHTML = `Level ${lvl}${T.challenge ? ' ⚡' : ''} · Puzzle rating ${p.r} · ${side === 'w' ? '⚪ White' : '⚫ Black'} to move`;
      msg(`Find the best move for <b>${side === 'w' ? 'White' : 'Black'}</b>. Take your time — look at checks, captures, threats first.`);
      $('#tr-next', root).disabled = true; $('#tr-hint', root).disabled = false; $('#tr-show', root).disabled = false;
    }
    function flashBad(sq) { const el = board.el.querySelector(`[data-sq="${sq}"]`); if (el) { el.classList.add('bad'); setTimeout(() => el.classList.remove('bad'), 650); } }
    function onMove(from, to) {
      if (T.done || T.busy || !T.p) return;
      const expect = sol()[T.idx], elapsed = (Date.now() - T.t0) / 1000;
      let ok = from + to === expect.slice(0, 4);
      if (!ok) { const test = new Chess(board.chess.fen()); const m = test.move({ from, to, promotion: 'q' }); if (m && test.in_checkmate()) ok = true; }
      if (ok) {
        board.play(from, to, expect[4]); T.idx++; sfx.good();
        if (T.idx >= sol().length) return finish();
        T.busy = true; board.locked = true; msg('✅ Good move! The opponent replies…', 'ok');
        setTimeout(() => { const r = sol()[T.idx]; board.play(r.slice(0, 2), r.slice(2, 4), r[4]); T.idx++; T.busy = false; board.locked = false; if (T.idx >= sol().length) return finish(); msg('Your turn again — find the next move. Remember CCT!', 'ok'); }, 550);
      } else {
        T.wrong++; sfx.bad(); flashBad(to);
        if (T.wrong === 1 && T.idx === 0 && elapsed < 4) { T.fast = true; msg(`⚡ You moved in <b>${elapsed.toFixed(1)}s</b> — that's too fast! Stop. What are their <b>checks, captures, threats</b>? Then try again.`, 'bad'); }
        else if (T.wrong >= 3) msg('Not quite. Press <b>💡 Hint</b> or <b>👁 Show answer</b> — learning the pattern is a win too.', 'bad');
        else msg(`Not quite${T.wrong === 2 ? ' — try the 💡 Hint' : ''}. Look again: is there a check? A capture? What is being attacked?`, 'bad');
      }
    }
    function finish() {
      T.done = true; board.locked = true;
      const result = T.shown ? 'shown' : (T.wrong === 0 ? 'first' : 'retry');
      const r = CQ.recordPuzzle(T.p, result, { challenge: T.challenge, fastWrong: T.fast });
      if (result === 'shown') msg('That was the answer. Study the pattern, then try the next one!', 'bad');
      else { sfx.win(); msg(`🎉 <b>${result === 'first' ? 'First try!' : 'Solved!'}</b> ${r.stars ? `<span class="star">+${r.stars} ⭐</span>` : '(daily puzzle-star limit reached — keep training!)'}`, 'ok'); }
      $('#tr-next', root).disabled = false; $('#tr-hint', root).disabled = true; $('#tr-show', root).disabled = true;
      if (r.levelUp) { confetti(); modal(`<h2>🎊 LEVEL UP!</h2><p>You reached <b>Level ${r.levelUp}: ${LEVELS[r.levelUp - 1].name}</b> ${LEVELS[r.levelUp - 1].icon}</p><p>+50 ⭐ bonus! ${esc(LEVELS[r.levelUp - 1].goal)}</p>`); }
      opts.onDone && opts.onDone(result);
    }
    $('#tr-hint', root).onclick = () => { if (T.done || !T.p) return; const m = sol()[T.idx]; board.showHint(m.slice(0, 2)); msg('💡 Move <b>this piece</b>. Where does it create a threat or win something?'); T.hinted = true; };
    $('#tr-show', root).onclick = async () => {
      if (T.done || T.busy || !T.p) return; T.shown = true; board.locked = true; T.busy = true;
      for (; T.idx < sol().length; T.idx++) { const m = sol()[T.idx]; board.play(m.slice(0, 2), m.slice(2, 4), m[4]); await new Promise(r => setTimeout(r, 700)); }
      T.busy = false; finish();
    };
    $('#tr-next', root).onclick = next;
    $('#tr-chal', root).onchange = () => { if (T.done || !T.p) next(); };
    root.reload = next; root.T = T; root.board = board; next();
    return root;
  }
  function persistent(key, factory) { if (!UI.persist[key]) UI.persist[key] = factory(); return UI.persist[key]; }

  /* ---------- coaching / encouragement ---------- */
  function weekAcc(offsetWeeks) {
    let tried = 0, first = 0, mins = 0; const end = CQ.addDays(CQ.dstr(), -7 * offsetWeeks);
    for (let i = 0; i < 7; i++) { const d = S().days[CQ.addDays(end, -i)]; if (d) { tried += d.pz.tried; first += d.pz.first; mins += CQ.minutesOf(d); } }
    return { tried, first, mins, acc: tried ? first / tried : null };
  }
  function coach() {
    const name = S().settings.name, d = CQ.day(), target = S().settings.dailyMin, m = CQ.minutesOf(d), st = CQ.streak();
    const w0 = weekAcc(0), w1 = weekAcc(1);
    if (d.questComplete) return `🔥 Quest complete, ${name}! That's a <b>${st}-day streak</b>. ${d.pz.tried} puzzles today, ${d.pz.first} first try. Champions are built exactly like this.`;
    if (w0.acc != null && w1.acc != null && w0.tried >= 10 && w0.acc > w1.acc) return `📈 Your first-try puzzle accuracy rose from <b>${Math.round(w1.acc * 100)}%</b> to <b>${Math.round(w0.acc * 100)}%</b> this week — your effort is paying off!`;
    if (m > 0) return `💪 ${m} of ${target} minutes done — only <b>${Math.max(0, target - m)} to go</b>. Finish the quest to protect your streak!`;
    if (st === 0 && Object.keys(S().days).filter(k => S().days[k].questComplete).length > 0) return `🌅 Ready for a comeback, ${name}? One quest brings the streak back to life. Even Magnus lost games — he just kept going.`;
    if (st > 0) return `⚡ ${st}-day streak on the line! Start today's 30-minute quest to keep it burning.`;
    return `👋 Welcome, ${name}! Your goal: <b>1000 rating</b>. Each 30-minute quest earns stars ⭐ you can spend in the Vault. Ready for Quest #1?`;
  }

  /* ---------- header ---------- */
  function updateHeader() {
    const lv = LEVELS[S().level - 1], sy = CQ.sync;
    $('#hdr').innerHTML = `<div class="brand"><img src="assets/pieces/wN.svg" alt=""><div><b>${esc(S().settings.name)}'s Chess Quest</b><small>${lv.icon} Level ${lv.n}: ${lv.name}</small></div></div>
      <div class="chips"><span class="chip" title="Streak">🔥 ${CQ.streak()}</span><span class="chip star" title="Stars">⭐ ${CQ.balance()}</span>
      <span class="chip sync ${sy.status}" title="Cloud sync: ${sy.status}">${sy.status === 'ok' ? '☁️' : sy.status === 'syncing' ? '🔄' : sy.status === 'error' ? '⚠️' : '📴'}</span></div>`;
  }
  function updateTimers() {
    const d = CQ.day();
    PHASES.forEach(p => { const el = $('#tm-' + p.id); if (el) { el.textContent = fmt(d.sec[p.id]) + ' / ' + fmt(CQ.TARGET[p.id]); const bar = $('#bar-' + p.id); if (bar) bar.style.width = Math.min(100, d.sec[p.id] / CQ.TARGET[p.id] * 100) + '%'; const fb = $('#fin-' + p.id); if (fb) fb.disabled = d.sec[p.id] < CQ.TARGET[p.id] * CQ.MIN_FRAC; } });
    const q = $('#qmin'); if (q) q.textContent = CQ.minutesOf(d);
  }

  /* ---------- views ---------- */
  function renderNav() { $('#nav').innerHTML = TABS.map(([id, ic, lb]) => `<button class="${UI.tab === id ? 'on' : ''}" data-tab="${id}"><span>${ic}</span>${lb}</button>`).join(''); }
  function go(tab) {
    if (UI.tab === 'today' && tab !== 'today' && CQ.timer.phase && CQ.timer.phase !== 'free') { CQ.timer.phase = null; toast('⏸ Quest timer paused'); }
    UI.tab = tab;
    if (tab === 'puzzles' || tab === 'endgames') CQ.timer.phase = 'free'; else if (tab !== 'today' || CQ.timer.phase === 'free') CQ.timer.phase = null;
    renderNav(); renderView(); window.scrollTo(0, 0);
  }
  function renderView() { const v = $('#view'); ({ today: viewToday, puzzles: viewPuzzles, lessons: viewLessons, endgames: viewEndgames, progress: viewProgress, vault: viewVault, settings: viewSettings })[UI.tab](v); updateHeader(); }

  function todaysLesson() {
    const d = CQ.day(); if (d.lessonId) return LESSONS.find(l => l.id === d.lessonId);
    const lvl = LESSONS.filter(l => l.l === S().level), done = S().lessons.done;
    const l = lvl.find(x => !done[x.id]) || rand(lvl); d.lessonId = l.id; return l;
  }
  function lessonCard(l) {
    return `<div class="lesson"><h3>${l.icon} ${esc(l.title)}</h3><p class="muted">${esc(l.why)}</p><ul>${l.ideas.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      <div class="drill">🏋️ <b>Drill:</b> ${esc(l.drill)}</div>
      <div class="row wrap" style="margin-top:8px">${(l.videos || []).map(v => `<a class="btn" target="_blank" rel="noopener" href="${v[1]}">▶ ${esc(v[0])}</a>`).join('')}
      ${l.link ? `<a class="btn" target="_blank" rel="noopener" href="${l.link[1]}">🔗 ${esc(l.link[0])}</a>` : ''}
      ${l.drill_id ? `<button class="primary" data-act="lab" data-id="${l.drill_id}">♚ Open Endgame Lab</button>` : ''}</div></div>`;
  }

  function viewToday(v) {
    const d = CQ.day(), target = S().settings.dailyMin;
    const doneN = PHASES.filter(p => d.done[p.id]).length;
    v.innerHTML = `
      <div class="card hero"><div class="coach">${coach()}</div>
        <div class="row between"><div><div class="big"><span id="qmin">${CQ.minutesOf(d)}</span><small> / ${target} min today</small></div><div class="muted">${doneN}/3 phases · 🔥 ${CQ.streak()}-day streak · best ${CQ.bestStreak()}</div></div>
        <div class="ring" style="--p:${Math.round(doneN / 3 * 100)}"><span>${doneN}/3</span></div></div></div>
      ${PHASES.map(p => {
        const sec = d.sec[p.id], running = CQ.timer.phase === p.id, done = d.done[p.id], open = UI.open === p.id;
        return `<div class="card phase ${done ? 'done' : ''} ${open ? 'open' : ''}">
          <div class="row between" data-act="toggle" data-id="${p.id}" style="cursor:pointer"><div><b>${p.icon} ${p.title}</b><div class="muted small">${p.sub}</div></div>
            <span class="chip ${done ? 'ok' : running ? 'run' : ''}">${done ? '✅ Done' : running ? '⏱ Running' : sec ? '⏸ Paused' : 'Not started'}</span></div>
          <div class="bar"><i id="bar-${p.id}" style="width:${Math.min(100, sec / CQ.TARGET[p.id] * 100)}%"></i></div>
          <div class="row between"><span class="muted small" id="tm-${p.id}">${fmt(sec)} / ${fmt(CQ.TARGET[p.id])}</span>
            <div class="row">${done ? '' : `${running ? `<button data-act="pause" data-id="${p.id}">⏸ Pause</button>` : `<button class="primary" data-act="start" data-id="${p.id}">▶ ${sec ? 'Resume' : 'Start'}</button>`}
            <button id="fin-${p.id}" data-act="finish" data-id="${p.id}" ${sec < CQ.TARGET[p.id] * CQ.MIN_FRAC ? 'disabled' : ''}>✔ Finish</button>`}</div></div>
          ${open ? `<div class="pbody" id="body-${p.id}"></div>` : ''}</div>`;
      }).join('')}
      <p class="muted small center">A phase unlocks <b>Finish</b> after 80% of its 10 minutes. Completing all 3 earns <b>+10 ⭐</b>, plus streak bonuses (+20 ⭐ at 3 and 7 days).</p>`;
    const open = UI.open, body = open && $('#body-' + open);
    if (open === 'p1') body.appendChild(persistent('quest-trainer', () => makeTrainer()));
    if (open === 'p2') { const l = todaysLesson(); body.innerHTML = lessonCard(l) + `<div class="row center"><button data-act="otherlesson">🔄 Different lesson</button></div>`; }
    if (open === 'p3') renderGamePanel(body);
  }

  function renderGamePanel(body) {
    const u = S().settings.lichess, L = UI.lichess;
    const games = (L.games || []).map(g => {
      const me = u.toLowerCase(); const w = g.players.white.user && g.players.white.user.name.toLowerCase() === me; const res = !g.winner ? 'Draw' : ((g.winner === 'white') === w ? 'Win' : 'Loss');
      const opp = (w ? g.players.black : g.players.white); const on = opp.user ? opp.user.name : 'AI';
      return `<div class="game ${res}"><b>${res}</b> vs ${esc(on)} · ${g.speed} · ${esc((g.opening && g.opening.name) || '')}<a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/${g.id}">Review on Lichess ↗</a></div>`;
    }).join('');
    body.innerHTML = `<div class="lesson"><h3>♟️ Play ONE game (10+0 or 15+10)</h3>
      <div class="row wrap"><a class="btn primary" target="_blank" rel="noopener" href="https://lichess.org/">Open Lichess ↗</a><button data-act="refreshli">🔄 Refresh my games</button></div>
      <p class="muted small">Slow down. CCT before every move. Then review the game — the review is where the rating points come from.</p>
      ${u ? (games || `<p class="muted small">${L.err ? 'Could not load games (' + esc(L.err) + ').' : 'Loading your recent Lichess games…'}</p>`) : '<p class="muted small">Add the Lichess username in Settings to see your recent games here.</p>'}
      <h4>📝 2-minute Blunder Review</h4>
      <div class="form"><label>Result <select id="gres"><option>Win</option><option>Loss</option><option>Draw</option></select></label>
      <label>My biggest mistake (what did I miss — a check, capture or threat?)<textarea id="gmist" rows="2" placeholder="e.g. I moved my knight and left my bishop hanging"></textarea></label>
      <label>How well did I use Checks-Captures-Threats? <select id="gcct"><option>1</option><option>2</option><option>3</option><option selected>4</option><option>5</option></select> / 5</label>
      <button class="primary" data-act="savegame">Save review (+3 ⭐ once a day)</button></div></div>`;
    loadLichess();
  }

  function viewPuzzles(v) {
    const ac = CQ.recentAccuracy(), lv = LEVELS[S().level - 1], r = S().puzzle.recent[S().level] || [];
    v.innerHTML = `<div class="card"><div class="row between"><div><b>${lv.icon} Level ${lv.n}: ${lv.name}</b><div class="muted small">${esc(lv.goal)}</div></div>
      <div class="center"><div class="muted small">Level-up progress</div><div class="dots">${Array.from({ length: 10 }, (_, i) => `<i class="${i < r.length ? (r[i] ? 'g' : 'r') : ''}"></i>`).join('')}</div><div class="muted small">8 of 10 first-try → Level ${Math.min(4, lv.n + 1)}</div></div></div>
      ${(r.length >= 10 && ac <= 0.3 && S().level > 1) ? `<div class="notice">These feel tough right now. <button data-act="stepdown">Practice Level ${S().level - 1} for a bit</button></div>` : ''}</div>
      <div id="ptrainer"></div>
      <p class="muted small center">Free practice time counts toward your total minutes. Puzzle stars cap at 40/day (+2 first try, +1 after a retry, ×2 in ⚡ Challenge).</p>`;
    $('#ptrainer').appendChild(persistent('free-trainer', () => makeTrainer()));
  }

  function viewLessons(v) {
    v.innerHTML = LEVELS.map(lv => `<div class="card"><h3>${lv.icon} Level ${lv.n}: ${lv.name} <small class="muted">${lv.band}</small></h3><p class="muted small">${esc(lv.goal)}</p>
      ${LESSONS.filter(l => l.l === lv.n).map(l => `<details ${l.l === S().level && !S().lessons.done[l.id] ? '' : ''}><summary>${S().lessons.done[l.id] ? '✅' : l.icon} ${esc(l.title)}</summary>${lessonCard(l)}<div class="row end"><button data-act="lessondone" data-id="${l.id}">${S().lessons.done[l.id] ? 'Mark as not done' : '✔ Mark as done'}</button></div></details>`).join('')}</div>`).join('')
      + `<div class="card"><h3>🌐 Free & paid resources</h3><div class="row wrap">${RECOMMENDED.map(r => `<a class="btn" target="_blank" rel="noopener" href="${r[1]}">${esc(r[0])} ↗</a>`).join('')}</div>
      <p class="muted small">Tip: pick ONE video lesson per day (10 min) rather than binge-watching — then practice it in puzzles. Paid options worth a look when you're ready: Chessable (Chess Tactics for beginners courses), ChessKid Diamond, Chessly.</p></div>`;
  }

  /* ----- Endgame Lab ----- */
  const DRILLS = {
    kqk: { name: 'King + Queen vs King', limit: 20, piece: 'Q', tip: 'Shrink the box with the queen a knight-move away, then bring your king. Avoid stalemate!' },
    krk: { name: 'King + Rook vs King', limit: 35, piece: 'R', tip: 'Cut the king off with the rook, walk your king up, keep the rook safe.' },
  };
  const EG_KINGS = ['8/8/8/3k4/8/8/8/', '8/8/2k5/8/8/8/8/', '8/8/8/5k2/8/8/8/', '8/4k3/8/8/8/8/8/', '8/8/6k1/8/8/8/8/'];
  const EG = window.CQ_EG = { id: 'kqk', board: null, moves: 0, over: false };
  function opponentMove(chess) {
    const ms = chess.moves({ verbose: true }); if (!ms.length) return null;
    const cap = ms.find(m => m.captured); if (cap) return cap;
    const dist = sq => { const f = sq.charCodeAt(0) - 97, r = +sq[1] - 1; return Math.max(Math.abs(f - 3.5), Math.abs(r - 3.5)); };
    return ms.map(m => [m, -dist(m.to) + Math.random() * 0.4]).sort((a, b) => b[1] - a[1])[0][0];
  }
  function egStart() {
    const dr = DRILLS[EG.id], fen = rand(EG_KINGS) + dr.piece + '3K3 w - - 0 1';
    EG.moves = 0; EG.over = false; EG.board.locked = false; EG.board.set(fen, 'w');
    $('#eg-msg').innerHTML = `Checkmate in <b>${dr.limit} moves or fewer</b>. ${dr.tip}`; $('#eg-moves').textContent = '0';
  }
  function viewEndgames(v) {
    v.innerHTML = `<div class="card"><div class="row between wrap"><div><b>♚ Endgame Lab</b><div class="muted small">Conversion practice — you play White, the computer defends.</div></div>
      <select id="eg-sel">${Object.entries(DRILLS).map(([k, d]) => `<option value="${k}" ${k === EG.id ? 'selected' : ''}>${d.name}</option>`).join('')}</select></div></div>
      <div class="card"><div class="row between"><span class="muted">Moves: <b id="eg-moves">0</b></span><button data-act="egrestart">🔄 New position</button><button data-act="egundo">↩ Undo</button></div>
      <div class="board-wrap"><div id="eg-board"></div></div><div id="eg-msg" class="tr-msg"></div>
      <p class="muted small">Wins in the lab: ${Object.entries(S().endgames).map(([k, e]) => `${DRILLS[k] ? DRILLS[k].name : k}: ${e.wins} (best ${e.best} moves)`).join(' · ') || 'none yet'} — +5 ⭐ for each clean mate (up to 3 a day).</p></div>
      <div class="card"><b>More endgame practice</b><div class="row wrap" style="margin-top:6px"><a class="btn" target="_blank" rel="noopener" href="https://lichess.org/practice">Lichess Practice (pawn & rook endings) ↗</a><a class="btn" target="_blank" rel="noopener" href="https://lichess.org/training/endgame">Endgame puzzles on Lichess ↗</a></div></div>`;
    EG.board = new Board($('#eg-board'), { onMove: (f, t) => egMove(f, t) }); egStart();
    $('#eg-sel').onchange = e => { EG.id = e.target.value; egStart(); };
  }
  function egMove(f, t) {
    if (EG.over) return; const dr = DRILLS[EG.id], b = EG.board;
    if (!b.play(f, t)) return; EG.moves++; $('#eg-moves').textContent = EG.moves; sfx.good();
    const end = () => {
      EG.over = true; b.locked = true;
      if (b.chess.in_checkmate()) {
        const w = S().endgames[EG.id] || { wins: 0, best: 999 }; w.wins++; w.best = Math.min(w.best, EG.moves); S().endgames[EG.id] = w;
        const efficient = EG.moves <= dr.limit; const today = CQ.dstr(), n = Object.keys(S().ledger.filter(e => e.type === 'endgame' && e.date === today)).length;
        let got = 0; if (efficient && n < 3) { CQ.addStars(5, 'endgame', 'Checkmate: ' + dr.name + ' in ' + EG.moves, 'eg-' + CQ.uid()); got = 5; }
        CQ.commit(); sfx.win(); confetti(); $('#eg-msg').className = 'tr-msg ok'; $('#eg-msg').innerHTML = `🏆 <b>CHECKMATE in ${EG.moves}!</b> ${efficient ? (got ? '+5 ⭐' : '(daily endgame star limit reached)') : `Nice! Try for ${dr.limit} or fewer to earn stars.`}`;
      } else { sfx.bad(); $('#eg-msg').className = 'tr-msg bad'; $('#eg-msg').innerHTML = b.chess.in_stalemate() ? '🤝 <b>Stalemate!</b> That is a draw — you must leave the enemy king a legal move unless it is mate. Press 🔄 and try again.' : '😬 The game is drawn (material lost). Press 🔄 to try again.'; }
    };
    if (b.chess.game_over()) return end();
    b.locked = true; setTimeout(() => { const m = opponentMove(b.chess); if (m) b.play(m.from, m.to); b.locked = false; if (b.chess.game_over()) end(); else if (EG.moves >= dr.limit + 20) { EG.over = true; $('#eg-msg').innerHTML = 'Too many moves — press 🔄 and aim to be more efficient.'; } }, 450);
  }

  /* ----- Progress ----- */
  function badges() {
    const s = S(), q = Object.values(s.days).filter(d => d.questComplete).length, pz = Object.values(s.days).reduce((a, d) => a + d.pz.solved, 0), bs = CQ.bestStreak();
    const eg = Object.values(s.endgames).reduce((a, e) => a + e.wins, 0);
    return [['🏁', 'First Quest', q >= 1], ['🔥', '3-Day Streak', bs >= 3], ['🌋', '7-Day Streak', bs >= 7], ['💯', '100 Puzzles', pz >= 100], ['🧩', '500 Puzzles', pz >= 500], ['🛡️', 'Level 2', s.level >= 2], ['♞', 'Level 3', s.level >= 3], ['👑', 'Level 4', s.level >= 4], ['⏱️', '500 Minutes', CQ.totalMinutes() >= 500], ['♚', 'Mate Master (5 lab mates)', eg >= 5], ['📝', '5 Game Reviews', (s.games || []).length >= 5], ['⭐', '1000 Stars Earned', CQ.lifetime() >= 1000]];
  }
  function viewProgress(v) {
    const s = S(), set = s.settings, today = CQ.dstr();
    const days = Array.from({ length: 14 }, (_, i) => CQ.addDays(today, i - 13));
    const target = set.dailyMin; let invested = 0, missed = 0, played = 0, completed = 0;
    const span = Math.max(1, CQ.daysBetween(s.startDate, today) + 1);
    for (let i = 0; i < span; i++) { const k = CQ.addDays(s.startDate, i), d = s.days[k], m = CQ.minutesOf(d); invested += m; if (d && d.questComplete) completed++; if (m > 0) played++; if (k !== today || m >= target) missed += Math.max(0, target - m); }
    const pctR = Math.max(0, Math.min(100, (set.rating - set.ratingStart) / (set.ratingTarget - set.ratingStart) * 100));
    // accuracy by theme
    const th = {}; for (const [id, sv] of Object.entries(s.puzzle.seen)) { const p = PMAP[id]; if (!p) continue; const t = (p.t && p.t[0]) || 'other'; (th[t] = th[t] || { n: 0, first: 0 }); th[t].n += sv.n; th[t].first += sv.first; }
    const themes = Object.entries(th).filter(([, x]) => x.n >= 3).map(([k, x]) => [k, x.first / x.n, x.n]).sort((a, b) => a[1] - b[1]);
    const fastWrong = Object.values(s.days).reduce((a, d) => a + d.pz.fastWrong, 0), tried = Object.values(s.days).reduce((a, d) => a + d.pz.tried, 0), first = Object.values(s.days).reduce((a, d) => a + d.pz.first, 0);
    const L = UI.lichess;
    v.innerHTML = `
      <div class="card"><h3>🎯 Road to ${set.ratingTarget}</h3><div class="bar big"><i style="width:${pctR}%"></i></div><div class="row between muted small"><span>${set.ratingStart} start</span><b>${set.rating} now</b><span>${set.ratingTarget} goal</span></div></div>
      <div class="grid4"><div class="stat"><b>🔥 ${CQ.streak()}</b><span>streak (best ${CQ.bestStreak()})</span></div><div class="stat"><b>⏱ ${CQ.totalMinutes()}</b><span>minutes trained</span></div>
        <div class="stat"><b>🧩 ${tried}</b><span>puzzles (${tried ? Math.round(first / tried * 100) : 0}% first try)</span></div><div class="stat"><b>⭐ ${CQ.lifetime()}</b><span>stars earned</span></div></div>
      <div class="card"><h3>⏱ Time invested vs missed</h3><div class="row between"><span>✅ Invested: <b>${invested} min</b> (${completed} full quests, ${played}/${span} days played)</span><span>⏳ Missed: <b>${missed} min</b></span></div>
        <div class="chart">${days.map(k => { const m = CQ.minutesOf(s.days[k]), h = Math.min(100, m / (target * 1.33) * 100); return `<div class="col"><div class="barv ${m >= target ? 'g' : m > 0 ? 'y' : 'n'}" style="height:${Math.max(3, h)}%" title="${k}: ${m} min"></div><small>${k.slice(8)}</small></div>`; }).join('')}<div class="tline" style="bottom:${target / (target * 1.33) * 100}%"><small>${target} min</small></div></div></div>
      <div class="card"><h3>🧠 Coach's focus</h3><ul>
        <li><b>Moving too fast:</b> ${fastWrong} puzzles started with a too-fast wrong move${fastWrong ? ' — slow down and use CCT!' : ' — great patience!'}</li>
        ${themes.length ? `<li><b>Weakest theme:</b> ${esc(themes[0][0])} (${Math.round(themes[0][1] * 100)}% first try over ${themes[0][2]} tries)</li><li><b>Strongest theme:</b> ${esc(themes[themes.length - 1][0])} (${Math.round(themes[themes.length - 1][1] * 100)}%)</li>` : '<li>Solve more puzzles to see your strongest and weakest themes.</li>'}
        <li><b>Level ${s.level}</b> recent: ${(s.puzzle.recent[s.level] || []).map(x => x ? '🟢' : '🔴').join('') || '—'}</li></ul></div>
      <div class="card"><h3>🏅 Badges</h3><div class="badges">${badges().map(b => `<div class="badge ${b[2] ? 'on' : ''}"><span>${b[0]}</span><small>${b[1]}</small></div>`).join('')}</div></div>
      <div class="card"><h3>🌐 Lichess${set.lichess ? ' · ' + esc(set.lichess) : ''}</h3>${set.lichess ? (L.user ? `<div class="grid4">${['rapid', 'blitz', 'bullet', 'puzzle'].map(k => `<div class="stat"><b>${(L.user.perfs[k] || {}).rating || '–'}</b><span>${k} (${(L.user.perfs[k] || {}).games || 0})</span></div>`).join('')}</div><p class="muted small">Online ratings run much higher than over-the-board scholastic ratings, so they are for reference only — your goal rating above is the over-the-board one.</p>` : `<p class="muted small">${L.err ? 'Could not load (' + esc(L.err) + ')' : 'Loading…'}</p>`) : '<p class="muted small">Set the Lichess username in Settings.</p>'}</div>
      <div class="card"><button data-act="report">📋 Copy progress report</button></div>`;
    loadLichess();
  }

  /* ----- Vault ----- */
  function viewVault(v) {
    const s = S(), bal = CQ.balance();
    v.innerHTML = `<div class="card hero"><div class="big">⭐ ${bal}</div><div class="muted">stars to spend · ${CQ.lifetime()} earned all-time</div></div>
      <div class="card"><h3>🎁 Prize Vault</h3><div class="rewards">${s.rewards.map(r => `<div class="reward ${bal >= r.cost ? 'can' : ''}"><div class="ri">${r.icon}</div><b>${esc(r.name)}</b><div class="cost">⭐ ${r.cost}</div><button data-act="redeem" data-id="${r.id}" ${bal >= r.cost ? 'class="primary"' : 'disabled'}>${bal >= r.cost ? 'Redeem' : `${r.cost - bal} more ⭐`}</button></div>`).join('')}</div></div>
      <div class="card"><h3>🕒 My redemptions</h3>${s.redemptions.length ? s.redemptions.slice().reverse().map(r => `<div class="row between line"><span>${esc(r.name)} <small class="muted">${r.date}</small></span><span class="chip ${r.status === 'approved' ? 'ok' : r.status === 'denied' ? 'bad' : ''}">${r.status === 'pending' ? '⏳ waiting for parent' : r.status}</span></div>`).join('') : '<p class="muted small">Nothing redeemed yet — save up!</p>'}</div>
      <div class="card"><h3>📒 Star history</h3>${s.ledger.slice(-15).reverse().map(e => `<div class="row between line"><span>${esc(e.desc)} <small class="muted">${e.date}</small></span><b class="${e.delta > 0 ? 'plus' : 'minus'}">${e.delta > 0 ? '+' : ''}${e.delta}</b></div>`).join('') || '<p class="muted small">Earn your first star by solving a puzzle!</p>'}</div>`;
  }

  /* ----- Settings / Parent zone ----- */
  function viewSettings(v) {
    const s = S(), set = s.settings, pend = s.redemptions.filter(r => r.status === 'pending');
    v.innerHTML = `
      <div class="card"><h3>👤 Player</h3><div class="form"><label>Name <input id="s-name" value="${esc(set.name)}"></label><label>Lichess username (public — never enter a password here) <input id="s-li" value="${esc(set.lichess)}" placeholder="username"></label></div></div>
      <div class="card"><h3>🔒 Parent zone</h3>
        <p class="muted small">Redemptions need approval here. ${set.pin ? 'PIN is set.' : '<b>No PIN set yet</b> — set one so the player cannot approve his own rewards.'}</p>
        <div class="form"><label>Parent PIN <input id="s-pin" type="password" inputmode="numeric" placeholder="${set.pin ? '••••  (type new to change)' : 'choose a PIN'}"></label></div>
        <h4>Pending redemptions (${pend.length})</h4>${pend.map(r => `<div class="row between line"><span>${esc(r.name)} · ⭐${r.cost} <small class="muted">${r.date}</small></span><span class="row"><button class="primary" data-act="approve" data-id="${r.id}">Approve</button><button data-act="deny" data-id="${r.id}">Decline &amp; refund</button></span></div>`).join('') || '<p class="muted small">None.</p>'}
        <h4>Rewards &amp; star prices</h4>${s.rewards.map((r, i) => `<div class="row line"><input class="ic" data-rw="${i}" data-f="icon" value="${esc(r.icon)}"><input data-rw="${i}" data-f="name" value="${esc(r.name)}" style="flex:1"><input type="number" class="cost" data-rw="${i}" data-f="cost" value="${r.cost}"><button data-act="delrw" data-id="${i}">✕</button></div>`).join('')}
        <div class="row"><button data-act="addrw">+ Add reward</button></div>
        <div class="form"><label>Daily training target (minutes) <input id="s-dmin" type="number" value="${set.dailyMin}"></label>
          <label>Current over-the-board rating (NWSRS) <input id="s-rating" type="number" value="${set.rating}"></label><label>Goal rating <input id="s-target" type="number" value="${set.ratingTarget}"></label></div>
        <div class="row"><button data-act="bonus">+ Bonus stars</button><button data-act="level">Set level</button></div></div>
      <div class="card"><h3>☁️ Cloud sync (Google Sheet)</h3>
        <div class="form"><label>Apps Script web-app URL <input id="s-sync" value="${esc(set.syncUrl)}" placeholder="https://script.google.com/macros/s/…/exec"></label></div>
        <div class="muted small">Status: <b>${CQ.sync.status}</b>${CQ.sync.last ? ' · last ' + CQ.sync.last.toLocaleTimeString() : ''}. Setup guide: SETUP.md.</div>
        <div class="row wrap"><button data-act="syncnow">🔄 Sync now</button><button data-act="copylink">🔗 Copy setup link for other devices</button></div></div>
      <div class="card"><h3>💾 Backup</h3><div class="row wrap"><button data-act="export">Export JSON</button><label class="btn">Import JSON<input id="s-imp" type="file" accept=".json" hidden></label><button data-act="reset" class="danger">Reset everything</button></div></div>
      <div class="row center"><button class="primary" data-act="savesettings">💾 Save settings</button></div>`;
    const f = $('#s-imp'); if (f) f.onchange = async e => { try { CQ.importJSON(await e.target.files[0].text()); toast('Imported ✔'); renderView(); } catch (x) { toast('Import failed'); } };
  }

  /* ---------- actions ---------- */
  async function act(a, id, el) {
    const s = S();
    switch (a) {
      case 'toggle': UI.open = UI.open === id ? null : id; return renderView();
      case 'start': CQ.timer.phase = id; UI.open = id; renderView(); return;
      case 'pause': CQ.timer.phase = null; return renderView();
      case 'finish': {
        if (id === 'p2') { const l = todaysLesson(); s.lessons.done[l.id] = CQ.dstr(); }
        const r = CQ.finishPhase(id); CQ.commit(); if (UI.open === id) UI.open = null;
        if (r === 'quest') { confetti(); sfx.win(); await modal(`<h2>🏆 QUEST COMPLETE!</h2><p>+10 ⭐ earned. Streak: <b>${CQ.streak()} days</b> 🔥</p><p>${coach()}</p>`); } else toast('✅ Phase complete!');
        return renderView();
      }
      case 'otherlesson': { const d = CQ.day(), same = LESSONS.filter(l => l.l === s.level); const i = same.findIndex(l => l.id === d.lessonId); d.lessonId = same[(i + 1) % same.length].id; CQ.commit(); return renderView(); }
      case 'lab': EG.id = id; return go('endgames');
      case 'refreshli': await loadLichess(true); return renderView();
      case 'savegame': {
        const text = $('#gmist').value.trim(); s.games.push({ id: CQ.uid(), ts: Date.now(), date: CQ.dstr(), result: $('#gres').value, mistake: text, cct: +$('#gcct').value });
        let msg = 'Review saved ✔'; if (text.length > 5 && CQ.addStars(3, 'review', 'Game review', 'review-' + CQ.dstr())) msg += ' +3 ⭐';
        CQ.commit(); toast(msg); $('#gmist').value = ''; return;
      }
      case 'stepdown': CQ.setLevel(s.level - 1); return renderView();
      case 'lessondone': { if (s.lessons.done[id]) delete s.lessons.done[id]; else s.lessons.done[id] = CQ.dstr(); CQ.commit(); return renderView(); }
      case 'egrestart': return egStart();
      case 'egundo': { const b = EG.board; if (EG.over) return; b.undo(); b.undo(); EG.moves = Math.max(0, EG.moves - 1); $('#eg-moves').textContent = EG.moves; return; }
      case 'redeem': {
        const r = s.rewards.find(x => x.id === id); if (!r) return;
        if (await modal(`<h3>Redeem ${r.icon} ${esc(r.name)}?</h3><p>This costs <b>⭐ ${r.cost}</b>. A parent will approve it.</p>`, [['Not yet', false], ['Yes, redeem!', true, true]])) { if (CQ.redeem(r)) { confetti(); toast('Sent to parent for approval 🎉'); } renderView(); }
        return;
      }
      case 'approve': case 'deny': if (!await askPin('Approve or decline redemptions')) return; CQ.resolveRedemption(id, a === 'approve'); return renderView();
      case 'delrw': if (!await askPin('Edit rewards')) return; s.rewards.splice(+id, 1); CQ.commit(); return renderView();
      case 'addrw': if (!await askPin('Edit rewards')) return; s.rewards.push({ id: 'r' + CQ.uid(), icon: '🎁', name: 'New reward', cost: 100 }); CQ.commit(); return renderView();
      case 'bonus': { if (!await askPin('Give bonus stars')) return; const n = parseInt(prompt('Bonus stars to give (negative to deduct):', '10'), 10); if (n) { CQ.addStars(n, 'bonus', 'Parent bonus: ' + (prompt('Reason?', 'Great effort!') || 'bonus')); CQ.commit(); renderView(); } return; }
      case 'level': { if (!await askPin('Change level')) return; const n = parseInt(prompt('Set level (1-4):', s.level), 10); if (n >= 1 && n <= 4) { CQ.setLevel(n); renderView(); } return; }
      case 'savesettings': {
        const set = s.settings; if (set.pin && ($('#s-pin').value || $('#s-dmin').value !== String(set.dailyMin) || $('#s-rating').value !== String(set.rating)) && !await askPin('Save parent settings')) return;
        set.name = $('#s-name').value.trim() || 'Champ'; set.lichess = $('#s-li').value.trim(); if ($('#s-pin').value) set.pin = $('#s-pin').value;
        set.dailyMin = +$('#s-dmin').value || 30; set.rating = +$('#s-rating').value || set.rating; set.ratingTarget = +$('#s-target').value || 1000; set.syncUrl = $('#s-sync').value.trim();
        document.querySelectorAll('[data-rw]').forEach(i => { const r = s.rewards[+i.dataset.rw]; if (r) r[i.dataset.f] = i.dataset.f === 'cost' ? (+i.value || 0) : i.value; });
        CQ.commit(); toast('Saved ✔'); if (set.syncUrl) CQ.cloudPull().then(CQ.cloudPush); return renderView();
      }
      case 'syncnow': await CQ.cloudPull(); await CQ.cloudPush(); return renderView();
      case 'copylink': { const l = CQ.makeSetupLink(); try { await navigator.clipboard.writeText(l); toast('Setup link copied — open it once on each device'); } catch { prompt('Copy this link:', l); } return; }
      case 'export': { const b = new Blob([CQ.exportJSON()], { type: 'application/json' }), a2 = document.createElement('a'); a2.href = URL.createObjectURL(b); a2.download = 'chess-quest-backup-' + CQ.dstr() + '.json'; a2.click(); return; }
      case 'reset': if (await askPin('Erase ALL progress') && await modal('<h3>⚠️ Erase all progress?</h3><p>This cannot be undone (cloud copy will also be overwritten).</p>', [['Cancel', false], ['Erase', true, true]])) { CQ.reset(); UI.persist = {}; renderView(); } return;
      case 'report': { const d = CQ.day(), t = `Chess Quest report for ${s.settings.name} (${CQ.dstr()})\nLevel ${s.level} · streak ${CQ.streak()} (best ${CQ.bestStreak()}) · ${CQ.totalMinutes()} min total · ⭐ ${CQ.balance()}\nToday: ${CQ.minutesOf(d)} min, ${d.pz.tried} puzzles (${d.pz.first} first try), quest ${d.questComplete ? 'complete' : 'not complete'}`; try { await navigator.clipboard.writeText(t); toast('Report copied'); } catch { prompt('Copy:', t); } return; }
    }
  }
  document.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (t && !t.closest('.board')) { e.stopPropagation(); act(t.dataset.act, t.dataset.id, t); } const n = e.target.closest('[data-tab]'); if (n) go(n.dataset.tab); });

  /* ---------- boot ---------- */
  function boot() {
    CQ.load(); CQ.applySetupHash();
    CQ.on(updateHeader);
    const qt = new URLSearchParams(location.search).get('tab'); if (qt && TABS.some(t => t[0] === qt)) go(qt); else { renderNav(); renderView(); }
    setInterval(() => { if (CQ.tick() !== undefined) updateTimers(); }, 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) CQ.cloudPull().then(() => { updateHeader(); }); else CQ.cloudPush(); });
    window.addEventListener('pagehide', () => CQ.save(false));
    if (S().settings.syncUrl) CQ.cloudPull().then(() => renderView());
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
  }
  window.addEventListener('DOMContentLoaded', boot);
})();
