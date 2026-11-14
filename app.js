/* Chess Quest v2 - UI: Profile & Multi-Rating Tracker, 8 Minecraft Tiers, Theoretical Performance Rating, Mandatory Lesson Quizzes, and Daily Star Bounties */
(function () {
  const S = () => CQ.S;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const rand = a => a[Math.floor(Math.random() * a.length)];

  const PHASES = [
    { id: 'p1', icon: '🎯', title: 'Tactical Sniping', sub: 'Puzzles + the Golden Rule (Checks, Captures, Threats) · +5 ⭐' },
    { id: 'p2', icon: '🎓', title: 'Theory Lesson & Mastery Test', sub: 'Study one lesson & pass the 3-question board/theory test · +15 ⭐' },
    { id: 'p3', icon: '♟️', title: 'Play & Blunder Audit', sub: 'One rapid game on Lichess + 2-minute blunder review · +10 ⭐' },
  ];
  const TABS = [
    ['today', '🏠', 'Today'],
    ['profile', '👤', 'Profile'],
    ['puzzles', '🧩', 'Puzzles'],
    ['lessons', '📚', 'Lessons'],
    ['endgames', '♚', 'Endgames'],
    ['progress', '📈', 'Stats'],
    ['vault', '⭐', 'Vault'],
    ['settings', '⚙️', 'Settings'],
  ];
  const AVATARS = [
    ['assets/anish-jacket.jpg', 'Classic + Columbia Jacket'],
    ['assets/anish-blazer.jpg', 'Classic + Grandmaster Blazer'],
    ['assets/anish-jacket-fringe.jpg', 'Side Fringe + Columbia Jacket'],
    ['assets/anish-blazer-fringe.jpg', 'Side Fringe + Grandmaster Blazer'],
  ];
  const UI = window.CQ_UI = { tab: 'today', open: null, persist: {}, puzzleFilterLvl: null, lichess: { user: null, games: null, err: null } };

  /* ---------- tiny helpers: toast, modal, confetti, beep ---------- */
  let audioCtx = null;
  function beep(freq, dur = 0.12, type = 'sine') {
    try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.type = type; o.frequency.value = freq; g.gain.value = 0.05; o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + dur); } catch { }
  }
  const sfx = { good() { beep(660); setTimeout(() => beep(880), 110); }, bad() { beep(180, 0.2, 'sawtooth'); }, win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.18), i * 130)); } };
  function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = msg; document.body.appendChild(t); setTimeout(() => t.classList.add('show'), 10); setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3400); }
  function confetti() { const em = ['⭐', '🎉', '💎', '⛏️', '♟️', '🏆', '🔥']; for (let i = 0; i < 42; i++) { const e = document.createElement('span'); e.className = 'confetti'; e.textContent = rand(em); e.style.left = Math.random() * 100 + 'vw'; e.style.animationDelay = Math.random() * 0.8 + 's'; e.style.fontSize = 16 + Math.random() * 22 + 'px'; document.body.appendChild(e); setTimeout(() => e.remove(), 3500); } }
  function modal(html, buttons = [['OK', null, true]]) {
    return new Promise(res => {
      const m = document.createElement('div'); m.className = 'modal';
      m.innerHTML = `<div class="card modal-card">${html}<div class="row end wrap" style="margin-top:14px"></div></div>`;
      const row = $('.row.end', m);
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
    const u = (S().settings.lichess || 'govindu').trim(); if (!u) return;
    if (!force && UI.lichess.user && UI.lichess.name === u && Date.now() - UI.lichess.ts < 300000) return;
    UI.lichess = { name: u, ts: Date.now(), user: UI.lichess.user, games: UI.lichess.games || [], err: null };
    try {
      const r = await fetch('https://lichess.org/api/user/' + encodeURIComponent(u));
      if (r.ok) {
        const usr = await r.json();
        UI.lichess.user = usr;
        // Keep profile Lichess snapshot fresh
        if (usr.perfs && S().profile && S().profile.ratings && S().profile.ratings.lichess) {
          const lp = S().profile.ratings.lichess;
          if (usr.perfs.rapid && usr.perfs.rapid.rating) lp.current = usr.perfs.rapid.rating;
          if (usr.perfs.puzzle && usr.perfs.puzzle.rating) lp.puzzle = usr.perfs.puzzle.rating;
          if (usr.perfs.classical && usr.perfs.classical.rating) lp.classical = usr.perfs.classical.rating;
          if (usr.perfs.blitz && usr.perfs.blitz.rating) lp.blitz = usr.perfs.blitz.rating;
          if (usr.perfs.bullet && usr.perfs.bullet.rating) lp.bullet = usr.perfs.bullet.rating;
          CQ.save(false, false);
        }
      }
    } catch (e) { UI.lichess.err = String(e); }
    try {
      const g = await fetch('https://lichess.org/api/games/user/' + encodeURIComponent(u) + '?max=8&opening=true', { headers: { Accept: 'application/x-ndjson' } });
      if (g.ok) {
        UI.lichess.games = (await g.text()).trim().split('\n').filter(Boolean).map(l => JSON.parse(l)).filter(x => x && x.players && x.players.white && x.players.black);
      }
    } catch {}
    if (['progress', 'today', 'profile'].includes(UI.tab)) renderView();
  }

  /* ---------- puzzle trainer ---------- */
  const PMAP = {}; (window.PUZZLES || []).forEach(p => PMAP[p.id] = p);
  function getLvlObj(n) { return (window.LEVELS || [])[Math.max(0, Math.min((window.LEVELS || []).length - 1, (n || 1) - 1))]; }
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
      <div class="tr-top">
        <div id="tr-info" class="muted"></div>
        <div class="row wrap">
          <select id="tr-tier" title="Choose Minecraft Tier" style="padding:5px 8px;font-size:13px">
            <option value="0">🎯 My Rank (Auto)</option>
            ${(window.LEVELS || []).map(l => `<option value="${l.n}">${l.icon} L${l.n}: ${l.name} (${l.minR}-${l.maxR})</option>`).join('')}
          </select>
          <label class="chal"><input type="checkbox" id="tr-chal"> ⚡ Overclock <small>(+1 tier · 2× ⭐)</small></label>
        </div>
      </div>
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
      const pickedTier = +($('#tr-tier', root).value || 0);
      const baseLvl = pickedTier > 0 ? pickedTier : S().level;
      const lvl = Math.min(CQ.MAX_LEVEL, baseLvl + (T.challenge ? 1 : 0));
      const lvObj = getLvlObj(lvl);
      const p = pickPuzzle(lvl);
      if (!p) return msg('No puzzles for this tier yet.');
      Object.assign(T, { p, idx: 0, wrong: 0, done: false, t0: Date.now(), fast: false, busy: false, shown: false });
      const side = new Chess(p.f).turn();
      board.locked = false;
      board.set(p.f, side, p.lm ? [p.lm.slice(0, 2), p.lm.slice(2, 4)] : null);
      $('#tr-info', root).innerHTML = `${lvObj.icon} <b>${lvObj.name}</b> (L${lvl}${T.challenge ? ' ⚡' : ''}) · Rating <b>${p.r}</b> · ${side === 'w' ? '⚪ White' : '⚫ Black'} to move`;
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
      const perf = CQ.performanceRating(UI.lichess.user);
      if (result === 'shown') msg('That was the answer. Study the pattern, then try the next one!', 'bad');
      else {
        sfx.win();
        const rem = CQ.puzzleStarsLeft();
        msg(`🎉 <b>${result === 'first' ? 'First try!' : 'Solved!'}</b> ${r.stars ? `<span class="star">+${r.stars} ⭐</span>` : `(daily puzzle cap reached — do a Lesson Quiz or Endgame Lab for bonus ⭐!)`} · <small>Playing at ~<b>${perf.otbPlayingAt} OTB</b> (${perf.lichessPlayingAt} Lichess) · ${rem} puzzle ⭐ left today</small>`, 'ok');
      }
      $('#tr-next', root).disabled = false; $('#tr-hint', root).disabled = true; $('#tr-show', root).disabled = true;
      if (r.levelUp) {
        const lv = getLvlObj(r.levelUp);
        confetti();
        modal(`<h2>⛏️ MINECRAFT RANK UP!</h2><p>You crafted <b>${lv.icon} Level ${lv.n}: ${lv.name}</b> <span class="chip">${lv.mc}</span></p><p><b class="star">+50 ⭐ Rank-Up Bonus!</b></p><p class="muted">${esc(lv.goal)}</p>`);
      }
      opts.onDone && opts.onDone(result);
    }
    $('#tr-hint', root).onclick = () => { if (T.done || !T.p) return; const m = sol()[T.idx]; board.showHint(m.slice(0, 2)); msg('💡 Move <b>this piece</b>. Where does it create a threat or win something?'); T.hinted = true; };
    $('#tr-show', root).onclick = async () => {
      if (T.done || T.busy || !T.p) return; T.shown = true; board.locked = true; T.busy = true;
      for (; T.idx < sol().length; T.idx++) { const m = sol()[T.idx]; board.play(m.slice(0, 2), m.slice(2, 4), m[4]); await new Promise(r => setTimeout(r, 700)); }
      T.busy = false; finish();
    };
    $('#tr-next', root).onclick = next;
    $('#tr-chal', root).onchange = () => { if (T.done || !T.p) next(); else toast('⚡ Overclock mode starts with your next puzzle'); };
    $('#tr-tier', root).onchange = () => next();
    root.reload = next; root.T = T; root.board = board; next();
    return root;
  }
  function persistent(key, factory) { if (!UI.persist[key]) UI.persist[key] = factory(); return UI.persist[key]; }

  /* ---------- Mandatory Lesson Mastery Quiz Modal (Board + Theory Exam) ---------- */
  function openLessonQuiz(lesson, onPass) {
    const questions = (lesson && lesson.quiz) || [];
    if (!questions.length) return;
    let qIdx = 0;
    const m = document.createElement('div'); m.className = 'modal';
    document.body.appendChild(m);

    function renderQ() {
      const q = questions[qIdx];
      const prog = `Question ${qIdx + 1} of ${questions.length}`;
      if (q.type === 'board') {
        m.innerHTML = `<div class="card modal-card">
          <div class="row between"><span class="chip ok">🎓 Mastery Test · ${prog}</span><button id="qz-close" class="btn small">✕ Close</button></div>
          <h3 style="margin-top:8px">${lesson.icon} ${esc(lesson.title)}</h3>
          <p><b>Board Challenge:</b> ${esc(q.prompt)}</p>
          <div class="board-wrap" style="max-width:340px"><div id="qz-board"></div></div>
          <div id="qz-msg" class="tr-msg">Make the winning / theoretical move on the board (${q.side === 'w' ? '⚪ White' : '⚫ Black'} to move).</div>
          <div class="row between"><button id="qz-hint">💡 Hint</button><button id="qz-next" class="primary" disabled>${qIdx + 1 < questions.length ? 'Next Question ▶' : '🏆 Claim Mastery (+15 ⭐)'}</button></div>
        </div>`;
        const b = new Board($('#qz-board', m), {
          onMove(from, to) {
            const uci = from + to;
            if (q.moves.some(x => x.slice(0, 4) === uci)) {
              b.play(from, to, 'q'); b.locked = true; sfx.good();
              $('#qz-msg', m).className = 'tr-msg ok';
              $('#qz-msg', m).innerHTML = `✅ <b>Correct!</b> ${esc(q.explain)}`;
              $('#qz-next', m).disabled = false;
            } else {
              sfx.bad();
              $('#qz-msg', m).className = 'tr-msg bad';
              $('#qz-msg', m).innerHTML = `❌ Not that move — think about the core concept of <b>${esc(lesson.title)}</b> and try again!`;
            }
          }
        });
        b.set(q.fen, q.side);
        $('#qz-hint', m).onclick = () => { const mv = q.moves[0]; b.showHint(mv.slice(0, 2)); };
      } else {
        m.innerHTML = `<div class="card modal-card">
          <div class="row between"><span class="chip ok">🎓 Mastery Test · ${prog}</span><button id="qz-close" class="btn small">✕ Close</button></div>
          <h3 style="margin-top:8px">${lesson.icon} ${esc(lesson.title)}</h3>
          <p><b>Theory Question:</b> ${esc(q.q)}</p>
          <div id="qz-opts" class="form">${q.opts.map((o, idx) => `<button class="qz-opt" data-idx="${idx}" style="text-align:left;padding:12px">${String.fromCharCode(65 + idx)}. ${esc(o)}</button>`).join('')}</div>
          <div id="qz-msg" class="tr-msg">Select the right answer above.</div>
          <div class="row end"><button id="qz-next" class="primary" disabled>${qIdx + 1 < questions.length ? 'Next Question ▶' : '🏆 Claim Mastery (+15 ⭐)'}</button></div>
        </div>`;
        m.querySelectorAll('.qz-opt').forEach(btn => {
          btn.onclick = () => {
            const pick = +btn.dataset.idx;
            if (pick === q.ans) {
              sfx.good();
              btn.style.borderColor = '#22c55e'; btn.style.background = '#14532d';
              $('#qz-msg', m).className = 'tr-msg ok';
              $('#qz-msg', m).innerHTML = `✅ <b>Spot on!</b> ${esc(q.explain)}`;
              $('#qz-next', m).disabled = false;
              m.querySelectorAll('.qz-opt').forEach(x => x.disabled = true);
            } else {
              sfx.bad();
              btn.style.borderColor = '#ef4444'; btn.style.background = '#7f1d1d';
              $('#qz-msg', m).className = 'tr-msg bad';
              $('#qz-msg', m).innerHTML = `❌ Not quite — re-read the options carefully and try again!`;
            }
          };
        });
      }
      $('#qz-close', m).onclick = () => m.remove();
      $('#qz-next', m).onclick = () => {
        qIdx++;
        if (qIdx < questions.length) renderQ();
        else {
          m.remove();
          S().lessons.done[lesson.id] = CQ.dstr();
          S().lessons.quizScores[lesson.id] = questions.length;
          const gotBounty = CQ.addStars(15, 'lesson_quiz', '🎓 Passed Mastery Exam: ' + lesson.title, 'quiz-' + lesson.id);
          // Also give a daily theory practice bonus if re-testing a lesson on a new day
          const gotDaily = !gotBounty && CQ.addStars(10, 'lesson_quiz', '🎓 Daily Theory Mastery: ' + lesson.title, 'quiz-daily-' + CQ.dstr());
          const d = CQ.day();
          d.sec.p2 = Math.max(d.sec.p2, Math.round(CQ.TARGET.p2 * CQ.MIN_FRAC));
          CQ.commit();
          confetti(); sfx.win();
          modal(`<h2>🎓 MASTERY PASSED (3/3)!</h2><p>You mastered <b>${lesson.icon} ${esc(lesson.title)}</b>!</p><p><b class="star">${gotBounty ? '+15 ⭐ Mastery Bounty!' : gotDaily ? '+10 ⭐ Daily Theory Bounty!' : '✅ Theory Verified!'}</b></p>`)
            .then(() => { if (onPass) onPass(); renderView(); });
        }
      };
    }
    renderQ();
  }

  /* ---------- coaching / encouragement ---------- */
  function weekAcc(offsetWeeks) {
    let tried = 0, first = 0, mins = 0; const end = CQ.addDays(CQ.dstr(), -7 * offsetWeeks);
    for (let i = 0; i < 7; i++) { const d = S().days[CQ.addDays(end, -i)]; if (d) { tried += d.pz.tried; first += d.pz.first; mins += CQ.minutesOf(d); } }
    return { tried, first, mins, acc: tried ? first / tried : null };
  }
  function coach() {
    const name = S().settings.name, d = CQ.day(), target = S().settings.dailyMin, m = CQ.minutesOf(d), st = CQ.streak();
    const perf = CQ.performanceRating(UI.lichess.user);
    if (d.questComplete) return `🔥 Full Trifecta Quest complete, ${name}! <b>${st}-day streak</b> · Playing at a <b>~${perf.otbPlayingAt} OTB (${perf.lichessPlayingAt} Lichess)</b> level!`;
    if (d.pz.solved >= 10 && (!d.done.p2 || !d.done.p3)) return `⛏️ Awesome tactics session (${d.pz.solved} puzzles solved)! Now unlock bonus ⭐ by passing today's <b>🎓 Theory Mastery Quiz (+15 ⭐)</b> or winning an <b>♚ Endgame Lab (+5 ⭐)</b>!`;
    if (m > 0) return `💪 ${m} of ${target} min done — playing like a <b>~${perf.otbPlayingAt} OTB</b> player! Finish all 3 pillars for the <b>+20 ⭐ Trifecta Chest</b>.`;
    return `👋 Ready to craft your next rank, ${name}? Your live tactical level is <b>~${perf.otbPlayingAt} OTB (${perf.lichessPlayingAt} Lichess)</b>! Complete today's 3 pillars to earn massive ⭐.`;
  }

  /* ---------- header ---------- */
  function updateHeader() {
    const lv = getLvlObj(S().level), sy = CQ.sync, perf = CQ.performanceRating(UI.lichess.user);
    const av = (S().profile && S().profile.avatar) || 'assets/anish-jacket.jpg';
    $('#hdr').innerHTML = `
      <div class="brand" data-tab="profile" style="cursor:pointer" title="Open Player Profile">
        <img class="avatar-sm" src="${esc(av)}" alt="Anish">
        <div>
          <b>${esc(S().settings.name)}'s Chess Quest</b>
          <small>${lv.icon} L${lv.n} ${lv.name} · ⚡ Playing @ ~${perf.otbPlayingAt} OTB</small>
        </div>
      </div>
      <div class="chips">
        <span class="chip" title="Streak">🔥 ${CQ.streak()}</span>
        <span class="chip star" title="Stars">⭐ ${CQ.balance()}</span>
        <span class="chip sync ${sy.status}" title="Cloud sync: ${sy.status}">${sy.status === 'ok' ? '☁️' : sy.status === 'syncing' ? '🔄' : sy.status === 'error' ? '⚠️' : '📴'}</span>
      </div>`;
  }
  function updateTimers() {
    const d = CQ.day();
    PHASES.forEach(p => { const el = $('#tm-' + p.id); if (el) { el.textContent = fmt(d.sec[p.id]) + ' / ' + fmt(CQ.TARGET[p.id]); const bar = $('#bar-' + p.id); if (bar) bar.style.width = Math.min(100, d.sec[p.id] / CQ.TARGET[p.id] * 100) + '%'; const fb = $('#fin-' + p.id); if (fb) fb.disabled = d.sec[p.id] < CQ.TARGET[p.id] * CQ.MIN_FRAC; } });
    const q = $('#qmin'); if (q) q.textContent = CQ.minutesOf(d);
  }

  /* ---------- views & cross-tab timer credit ---------- */
  function renderNav() { $('#nav').innerHTML = TABS.map(([id, ic, lb]) => `<button class="${UI.tab === id ? 'on' : ''}" data-tab="${id}"><span>${ic}</span>${lb}</button>`).join(''); }
  function go(tab) {
    UI.tab = tab;
    const d = CQ.day();
    // Auto-credit Phase 1 when in Puzzles, Phase 2 when in Lessons or Endgames!
    if (tab === 'puzzles') CQ.timer.phase = d.sec.p1 < CQ.TARGET.p1 ? 'p1' : 'free';
    else if (tab === 'lessons' || tab === 'endgames') CQ.timer.phase = d.sec.p2 < CQ.TARGET.p2 ? 'p2' : 'free';
    else if (tab !== 'today') CQ.timer.phase = null;
    renderNav(); renderView(); window.scrollTo(0, 0);
  }
  function renderView() {
    const v = $('#view');
    ({ today: viewToday, profile: viewProfile, puzzles: viewPuzzles, lessons: viewLessons, endgames: viewEndgames, progress: viewProgress, vault: viewVault, settings: viewSettings })[UI.tab](v);
    updateHeader();
  }

  function todaysLesson() {
    const d = CQ.day();
    if (d.lessonId) { const found = LESSONS.find(l => l.id === d.lessonId); if (found) return found; }
    const lvl = LESSONS.filter(l => l.l === S().level);
    const pool = lvl.length ? lvl : LESSONS;
    const done = S().lessons.done;
    const l = pool.find(x => !done[x.id]) || LESSONS.find(x => !done[x.id]) || rand(pool);
    d.lessonId = l.id; return l;
  }
  function lessonCard(l) {
    const mastered = S().lessons.done[l.id];
    return `<div class="lesson">
      <div class="row between wrap">
        <h3>${l.icon} ${esc(l.title)}</h3>
        <span class="chip ${mastered ? 'ok' : 'run'}">${mastered ? '✅ Mastered (3/3 Exam)' : '🔒 Pass 3/3 Quiz to Complete'}</span>
      </div>
      <p class="muted">${esc(l.why)}</p>
      <ul>${l.ideas.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      <div class="drill">🏋️ <b>Board Drill:</b> ${esc(l.drill)}</div>
      <div class="row wrap" style="margin-top:10px">
        <button class="primary" data-act="quiz" data-id="${l.id}">🎓 ${mastered ? 'Retake Mastery Test (+10 ⭐ daily)' : 'Take Mastery Test (Board + Theory · +15 ⭐)'}</button>
        ${(l.videos || []).map(v => `<a class="btn" target="_blank" rel="noopener" href="${v[1]}">▶ Watch: ${esc(v[0])}</a>`).join('')}
        ${l.link ? `<a class="btn" target="_blank" rel="noopener" href="${l.link[1]}">🔗 ${esc(l.link[0])}</a>` : ''}
        ${l.drill_id ? `<button data-act="lab" data-id="${l.drill_id}">♚ Open Endgame Lab</button>` : ''}
      </div>
    </div>`;
  }

  function renderBountiesCard() {
    const bounties = CQ.dailyBounties();
    return `<div class="card">
      <div class="row between wrap">
        <h3>⚡ Daily Star Bounties & Activities</h3>
        <span class="chip star">Puzzle Cap: ${CQ.day().pzStars} / ${CQ.puzzleStarCap()} ⭐ today</span>
      </div>
      <p class="muted small">Don't stop at just puzzles — complete all daily activities below to unlock massive bonus ⭐!</p>
      <div class="bounty-list">
        ${bounties.map(b => `
          <div class="bounty-row ${b.done ? 'done' : ''}">
            <div class="row" style="flex:1">
              <span style="font-size:20px">${b.done ? '✅' : b.icon}</span>
              <div><b>${esc(b.title)}</b><div class="muted small">Progress: ${esc(b.prog)} · <span class="star">${esc(b.reward)}</span></div></div>
            </div>
            ${b.done ? `<span class="chip ok">Claimed</span>` : `<button class="btn small primary" data-tab="${b.tab}">Go ▶</button>`}
          </div>`).join('')}
      </div>
    </div>`;
  }

  function viewToday(v) {
    const d = CQ.day(), target = S().settings.dailyMin, perf = CQ.performanceRating(UI.lichess.user), lv = getLvlObj(S().level);
    const doneN = PHASES.filter(p => d.done[p.id]).length;
    const tl = todaysLesson(), lessonMastered = !!S().lessons.done[tl.id];
    v.innerHTML = `
      <div class="card hero">
        <div class="coach">${coach()}</div>
        <div class="row between wrap">
          <div>
            <div class="big"><span id="qmin">${CQ.minutesOf(d)}</span><small> / ${target} min today</small></div>
            <div class="muted">${doneN}/3 phases · 🔥 ${CQ.streak()}-day streak · ${lv.icon} <b>${lv.name}</b></div>
          </div>
          <div class="perf-pill" data-tab="profile" style="cursor:pointer" title="Tap to view full rating & performance breakdown">
            <small>THEORETICAL LEVEL</small>
            <b>⚡ ~${perf.otbPlayingAt} OTB</b>
            <span>~${perf.lichessPlayingAt} Lichess (${perf.deltaOtb >= 0 ? '+' : ''}${perf.deltaOtb} vs NWSRS)</span>
          </div>
          <div class="ring" style="--p:${Math.round(doneN / 3 * 100)}"><span>${doneN}/3</span></div>
        </div>
      </div>
      ${PHASES.map(p => {
        const sec = d.sec[p.id], running = CQ.timer.phase === p.id, done = d.done[p.id], open = UI.open === p.id;
        const needQuiz = p.id === 'p2' && !lessonMastered;
        const canFinish = sec >= CQ.TARGET[p.id] * CQ.MIN_FRAC && !needQuiz;
        return `<div class="card phase ${done ? 'done' : ''} ${open ? 'open' : ''}">
          <div class="row between" data-act="toggle" data-id="${p.id}" style="cursor:pointer">
            <div><b>${p.icon} ${p.title}</b><div class="muted small">${p.sub}</div></div>
            <span class="chip ${done ? 'ok' : running ? 'run' : ''}">${done ? '✅ Done' : running ? '⏱ Running' : sec ? '⏸ Paused' : 'Start ▶'}</span>
          </div>
          <div class="bar"><i id="bar-${p.id}" style="width:${Math.min(100, sec / CQ.TARGET[p.id] * 100)}%"></i></div>
          <div class="row between wrap">
            <span class="muted small" id="tm-${p.id}">${fmt(sec)} / ${fmt(CQ.TARGET[p.id])}${p.id === 'p2' ? (lessonMastered ? ' · ✅ Quiz Passed' : ' · 🔒 Requires 3/3 Mastery Test') : ''}</span>
            <div class="row wrap">
              ${done ? '' : `${running ? `<button data-act="pause" data-id="${p.id}">⏸ Pause</button>` : `<button class="primary" data-act="start" data-id="${p.id}">▶ ${sec ? 'Resume' : 'Start'}</button>`}
              ${p.id === 'p2' && !lessonMastered ? `<button class="primary" data-act="quiz" data-id="${tl.id}">🎓 Pass Mastery Quiz (+15 ⭐)</button>` : ''}
              <button id="fin-${p.id}" data-act="finish" data-id="${p.id}" ${canFinish ? '' : 'disabled'}>✔ Finish Phase</button>`}
            </div>
          </div>
          ${open ? `<div class="pbody" id="body-${p.id}"></div>` : ''}
        </div>`;
      }).join('')}
      ${renderBountiesCard()}`;
    const open = UI.open, body = open && $('#body-' + open);
    if (open === 'p1') body.appendChild(persistent('quest-trainer', () => makeTrainer()));
    if (open === 'p2') { body.innerHTML = lessonCard(tl) + `<div class="row center" style="margin-top:8px"><button data-act="otherlesson">🔄 Pick a different lesson</button></div>`; }
    if (open === 'p3') renderGamePanel(body);
    loadLichess();
  }

  /* ---------- NEW: Player Profile & Multi-Federation Rating Tracker ---------- */
  function viewProfile(v) {
    const s = S(), prof = s.profile, lv = getLvlObj(s.level), perf = CQ.performanceRating(UI.lichess.user);
    const rt = prof.ratings;
    const tried = Object.values(s.days).reduce((a, d) => a + d.pz.tried, 0);
    const solved = Object.values(s.days).reduce((a, d) => a + d.pz.solved, 0);
    const first = Object.values(s.days).reduce((a, d) => a + d.pz.first, 0);
    const egWins = Object.values(s.endgames).reduce((a, e) => a + (e.wins || 0), 0);
    const masteredCount = Object.keys(s.lessons.done || {}).length;

    const deltaBadge = (hist) => {
      if (!hist || hist.length < 2) return `<span class="chip">Baseline</span>`;
      const d = hist[hist.length - 1].r - hist[hist.length - 2].r;
      return `<span class="chip ${d >= 0 ? 'ok' : 'bad'}">${d >= 0 ? '▲ +' + d : '▼ ' + d} last change</span>`;
    };

    v.innerHTML = `
      <div class="card profile-hero">
        <div class="profile-top">
          <div class="avatar-box">
            <img class="avatar-lg" src="${esc(prof.avatar || 'assets/anish-jacket.jpg')}" alt="Anish">
            <button class="btn small" data-act="switchavatar" style="margin-top:6px">🖼️ Switch Portrait</button>
          </div>
          <div class="profile-meta">
            <div class="row wrap">
              <h2 style="margin:0">${esc(prof.fullName)}</h2>
              <span class="chip ok">${lv.icon} Level ${lv.n}: ${lv.name} (${lv.mc})</span>
            </div>
            <div class="muted">${esc(prof.title)} · 📍 ${esc(prof.location)}</div>
            <p class="small" style="margin:6px 0">${esc(prof.bio)}</p>
            <div class="row wrap" style="margin-top:6px">
              <span class="chip">NWChess ID: <b>${esc(rt.nwsrs.id)}</b></span>
              <span class="chip">USCF ID: <b>${esc(rt.uscf.id)}</b></span>
              <span class="chip">Lichess: <b>${esc(rt.lichess.id)}</b></span>
              <span class="chip">FIDE: <b>${esc(rt.fide.id)}</b></span>
            </div>
          </div>
        </div>
      </div>

      <div class="card perf-card">
        <div class="row between wrap">
          <div>
            <span class="chip star">📡 TOURNAMENT BROADCAST METRIC</span>
            <h3 style="margin:6px 0 2px">Theoretical Playing Level ("Playing At" Rating)</h3>
            <p class="muted small" style="margin:0">Just like grandmaster broadcasts show "2500 player playing at a 2900 level", this calculates Anish's live playing strength from solved puzzle Elo, first-try accuracy (${perf.firstAcc}%), impulse discipline, and Lichess Rapid performance.</p>
          </div>
        </div>
        <div class="grid4" style="margin-top:12px">
          <div class="stat highlight">
            <small class="muted">PLAYING AT (OTB EST.)</small>
            <b style="font-size:28px;color:#fbbf24">~${perf.otbPlayingAt}</b>
            <span class="plus">${perf.deltaOtb >= 0 ? '+' : ''}${perf.deltaOtb} vs Official ${perf.officialOtb} NWSRS</span>
          </div>
          <div class="stat highlight">
            <small class="muted">PLAYING AT (LICHESS)</small>
            <b style="font-size:28px;color:#38bdf8">~${perf.lichessPlayingAt}</b>
            <span>${perf.perfTier.icon} ${perf.perfTier.name} Level</span>
          </div>
          <div class="stat">
            <small class="muted">TACTICAL ELO PERF</small>
            <b>~${perf.tacticalPerf}</b>
            <span>App Perf ${perf.appTacPerf} · Lichess Pz ${perf.liPuzzle}</span>
          </div>
          <div class="stat">
            <small class="muted">FIRST-TRY ACCURACY</small>
            <b>${perf.firstAcc}%</b>
            <span>${perf.puzzlesSampled} rated puzzles · ${perf.impulseRate}% fast-wrong</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="row between wrap">
          <h3>🌍 Official & Online Ratings Tracker</h3>
          <button class="primary small" data-act="openlograting">➕ Log Rating / Tournament (+25 ⭐)</button>
        </div>
        <div class="rating-grid">
          <div class="rating-card">
            <div class="row between"><b>🌲 NWChess (NWSRS)</b>${deltaBadge(rt.nwsrs.history)}</div>
            <div class="big" style="margin:6px 0">${rt.nwsrs.current} <small>Peak ${rt.nwsrs.peak} · Goal ${rt.nwsrs.target}</small></div>
            <div class="muted small">ID: ${esc(rt.nwsrs.id)} · Washington Scholastic Rating</div>
            <div class="hist-list">${(rt.nwsrs.history || []).slice(-4).reverse().map(h => `<div class="row between small"><span>${esc(h.date)}: ${esc(h.event)}</span><b>${h.r}</b></div>`).join('')}</div>
            <a class="btn small" target="_blank" rel="noopener" href="${esc(rt.nwsrs.url)}" style="margin-top:8px">NWChess Ratings Lookup ↗</a>
          </div>

          <div class="rating-card">
            <div class="row between"><b>🇺🇸 US Chess (USCF)</b>${deltaBadge(rt.uscf.history)}</div>
            <div class="big" style="margin:6px 0">${rt.uscf.current} <small>Regular · Quick ${rt.uscf.quick}</small></div>
            <div class="muted small">ID: ${esc(rt.uscf.id)} · Online Reg ${rt.uscf.onlineReg} · Online Quick ${rt.uscf.onlineQuick}</div>
            <div class="hist-list">${(rt.uscf.history || []).slice(-4).reverse().map(h => `<div class="row between small"><span>${esc(h.date)}: ${esc(h.event)}</span><b>${h.r}</b></div>`).join('')}</div>
            <a class="btn small" target="_blank" rel="noopener" href="${esc(rt.uscf.url)}" style="margin-top:8px">Official USCF MSA Profile ↗</a>
          </div>

          <div class="rating-card">
            <div class="row between"><b>🌐 Lichess (${esc(rt.lichess.id)})</b><button class="btn small" data-act="refreshli">🔄 Live Sync</button></div>
            <div class="big" style="margin:6px 0">${rt.lichess.current} <small>Rapid · 🧩 ${rt.lichess.puzzle} Puzzle</small></div>
            <div class="muted small">Classical ${rt.lichess.classical} · Blitz ${rt.lichess.blitz} · Bullet ${rt.lichess.bullet}</div>
            <div class="hist-list">${(rt.lichess.history || []).slice(-4).reverse().map(h => `<div class="row between small"><span>${esc(h.date)}: ${esc(h.event)}</span><b>${h.r}</b></div>`).join('')}</div>
            <a class="btn small" target="_blank" rel="noopener" href="${esc(rt.lichess.url)}" style="margin-top:8px">Open Lichess Profile ↗</a>
          </div>

          <div class="rating-card">
            <div class="row between"><b>🏛️ FIDE International</b><span class="chip">${rt.fide.current ? rt.fide.current : 'Target: ' + rt.fide.target}</span></div>
            <div class="big" style="margin:6px 0">${rt.fide.current || 'Unrated'} <small>FIDE Standard</small></div>
            <div class="muted small">Ready to track FIDE-rated Open & Junior events</div>
            <div class="hist-list">${(rt.fide.history || []).length ? rt.fide.history.slice(-4).reverse().map(h => `<div class="row between small"><span>${esc(h.date)}: ${esc(h.event)}</span><b>${h.r}</b></div>`).join('') : '<div class="muted small" style="padding:4px 0">Log first FIDE event above when played!</div>'}</div>
            <a class="btn small" target="_blank" rel="noopener" href="${esc(rt.fide.url)}" style="margin-top:8px">FIDE Ratings Portal ↗</a>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>⛏️ Minecraft Mastery Ranks (8-Tier Progression)</h3>
        <p class="muted small">Solve 5 in a row on first try (or 8 of 10) at your current tier to craft the next Minecraft rank and earn <b>+50 ⭐</b>!</p>
        <div class="mc-grid">
          ${(window.LEVELS || []).map(l => {
            const unlocked = s.level >= l.n;
            const current = s.level === l.n;
            return `<div class="mc-tier ${unlocked ? 'unlocked' : 'locked'} ${current ? 'current' : ''}" data-act="picktier" data-id="${l.n}" style="cursor:pointer" title="Tap to train at Level ${l.n}">
              <div class="mc-icon">${l.icon}</div>
              <b>L${l.n}: ${esc(l.name)}</b>
              <span class="small muted">${esc(l.mc)}</span>
              <small>${esc(l.band)}</small>
              <span class="chip small">${current ? '⚡ Current Rank' : unlocked ? '✅ Unlocked' : '🔒 Locked'}</span>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="card">
        <h3>🏆 Tournament History & Upcoming Events</h3>
        ${(prof.tournaments || []).map(t => {
          const hasDelta = t.before != null && t.after != null;
          const diff = hasDelta ? (t.after - t.before) : null;
          return `<div class="line row between wrap">
            <div>
              <b>${esc(t.name)}</b> <span class="chip small">${esc(t.score)}</span>
              <div class="muted small">${esc(t.date)} · ${esc(t.section)} · ${esc(t.sys)} ${t.notes ? '— ' + esc(t.notes) : ''}</div>
            </div>
            <div>
              ${hasDelta ? `<span class="chip ${diff >= 0 ? 'ok' : 'bad'}">${t.before} → <b>${t.after}</b> (${diff >= 0 ? '+' + diff : diff})</span>` : `<span class="chip run">📅 Upcoming</span>`}
            </div>
          </div>`;
        }).join('')}
      </div>

      <div class="card">
        <h3>📊 Lifetime Training Summary</h3>
        <div class="grid4">
          <div class="stat"><b>⏱ ${CQ.totalMinutes()}m</b><span>Total Training Time</span></div>
          <div class="stat"><b>🧩 ${solved}/${tried}</b><span>Puzzles (${tried ? Math.round(first / tried * 100) : 0}% 1st try)</span></div>
          <div class="stat"><b>🎓 ${masteredCount}/${LESSONS.length}</b><span>Theory Exams Passed</span></div>
          <div class="stat"><b>♚ ${egWins}</b><span>Endgame Checkmates</span></div>
        </div>
      </div>`;
    loadLichess();
  }

  function renderGamePanel(body) {
    const u = S().settings.lichess, L = UI.lichess;
    const games = (L.games || []).map(g => {
      const me = (u || '').toLowerCase(); const w = g.players.white.user && g.players.white.user.name.toLowerCase() === me; const res = !g.winner ? 'Draw' : ((g.winner === 'white') === w ? 'Win' : 'Loss');
      const opp = (w ? g.players.black : g.players.white); const on = opp.user ? opp.user.name : 'AI';
      return `<div class="game ${res}"><b>${res}</b> vs ${esc(on)} · ${g.speed} · ${esc((g.opening && g.opening.name) || '')}<a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/${g.id}">Review on Lichess ↗</a></div>`;
    }).join('');
    body.innerHTML = `<div class="lesson"><h3>♟️ Play ONE game (10+0 or 15+10)</h3>
      <div class="row wrap"><a class="btn primary" target="_blank" rel="noopener" href="https://lichess.org/">Open Lichess ↗</a><button data-act="refreshli">🔄 Refresh my games</button></div>
      <p class="muted small">Slow down. CCT before every move. Then review the game — the review is where the rating points come from.</p>
      ${u ? (games || `<p class="muted small">${L.err ? 'Could not load games (' + esc(L.err) + ').' : 'Use the form below to log your game review after playing on Lichess!'}</p>`) : '<p class="muted small">Add the Lichess username in Settings to see your recent games here.</p>'}
      <h4>📝 2-minute Blunder Audit (+10 ⭐ Daily Bounty)</h4>
      <div class="form"><label>Result <select id="gres"><option>Win</option><option>Loss</option><option>Draw</option></select></label>
      <label>My biggest mistake (what did I miss — a check, capture or threat?)<textarea id="gmist" rows="2" placeholder="e.g. I moved my knight and left my bishop hanging on c4"></textarea></label>
      <label>How well did I use Checks-Captures-Threats? <select id="gcct"><option>1</option><option>2</option><option>3</option><option selected>4</option><option>5</option></select> / 5</label>
      <button class="primary" data-act="savegame">Save Blunder Review (+10 ⭐ once a day)</button></div></div>`;
    loadLichess();
  }

  function viewPuzzles(v) {
    const ac = CQ.recentAccuracy(), lv = getLvlObj(S().level), r = S().puzzle.recent[S().level] || [], perf = CQ.performanceRating(UI.lichess.user);
    v.innerHTML = `
      <div class="card">
        <div class="row between wrap">
          <div>
            <b>${lv.icon} Rank ${lv.n}/8: ${lv.name} <span class="chip small">${lv.mc}</span></b>
            <div class="muted small">${esc(lv.band)} — ${esc(lv.goal)}</div>
          </div>
          <div class="center">
            <div class="muted small">Rank-Up Progress (5 in a row or 8/10)</div>
            <div class="dots">${Array.from({ length: 10 }, (_, i) => `<i class="${i < r.length ? (r[i] ? 'g' : 'r') : ''}"></i>`).join('')}</div>
            <div class="muted small">Playing @ <b>~${perf.otbPlayingAt} OTB</b> (~${perf.lichessPlayingAt} Lichess)</div>
          </div>
        </div>
        ${(r.length >= 10 && ac <= 0.3 && S().level > 1) ? `<div class="notice">These feel tough right now. <button data-act="stepdown">Step down to Level ${S().level - 1}</button></div>` : ''}
      </div>
      <div id="ptrainer"></div>
      <p class="muted small center">Puzzles solved here automatically credit <b>Today's Phase 1 Quest</b>! Daily puzzle star cap: <b>${CQ.day().pzStars} / ${CQ.puzzleStarCap()} ⭐</b> (+3 first try, +1 retry, ×2 in ⚡ Overclock).</p>
      ${renderBountiesCard()}`;
    $('#ptrainer').appendChild(persistent('free-trainer', () => makeTrainer()));
  }

  function viewLessons(v) {
    const masteredCount = Object.keys(S().lessons.done || {}).length;
    v.innerHTML = `
      <div class="card hero">
        <div class="row between wrap">
          <div>
            <h3>🎓 Foundational Chess Theory & Mastery Exams</h3>
            <p class="muted small" style="margin:4px 0 0">A lesson is ONLY marked complete when you pass its <b>3-question Board + Theory Mastery Test (3/3)</b>! Each exam passed earns <b>+15 ⭐</b> and credits Today's Phase 2 Quest.</p>
          </div>
          <span class="chip ok" style="font-size:16px">✅ ${masteredCount} / ${LESSONS.length} Mastered</span>
        </div>
      </div>
      <div class="card">
        <div class="row between wrap">
          <div>
            <b>🎬 Watched a YouTube Opening / Endgame Video? Take a Topic Mastery Test!</b>
            <div class="muted small">Pick the topic you just watched on YouTube and pass the interactive 3-question test to prove you mastered it!</div>
          </div>
          <div class="row wrap">
            <select id="yt-topic-sel">
              ${LESSONS.map(l => `<option value="${l.id}">${l.icon} L${l.l}: ${esc(l.title)}</option>`).join('')}
            </select>
            <button class="primary" data-act="yttest">🎓 Test Me Now (+15 ⭐)</button>
          </div>
        </div>
      </div>
      ${LEVELS.map(lv => `<div class="card">
        <h3>${lv.icon} Level ${lv.n}: ${lv.name} <small class="muted">(${lv.mc} · ${lv.band})</small></h3>
        <p class="muted small">${esc(lv.goal)}</p>
        ${LESSONS.filter(l => l.l === lv.n).map(l => {
          const isDone = !!S().lessons.done[l.id];
          return `<details ${l.l === S().level && !isDone ? 'open' : ''}>
            <summary>${isDone ? '✅' : l.icon} ${esc(l.title)} <span class="chip small ${isDone ? 'ok' : ''}">${isDone ? 'Mastered 3/3' : 'Take Test (+15 ⭐)'}</span></summary>
            ${lessonCard(l)}
          </details>`;
        }).join('')}
      </div>`).join('')}
      <div class="card"><h3>🌐 Curated Video & Interactive Channels</h3><div class="row wrap">${RECOMMENDED.map(r => `<a class="btn" target="_blank" rel="noopener" href="${r[1]}">${esc(r[0])} ↗</a>`).join('')}</div></div>`;
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
    const egCap = S().settings.endgameCap || 10;
    const todayCount = S().ledger.filter(e => e.type === 'endgame' && e.date === CQ.dstr()).length;
    v.innerHTML = `<div class="card"><div class="row between wrap"><div><b>♚ Endgame Lab</b><div class="muted small">Conversion practice — you play White, the computer defends. Time here auto-credits Today's Phase 2!</div></div>
      <select id="eg-sel">${Object.entries(DRILLS).map(([k, d]) => `<option value="${k}" ${k === EG.id ? 'selected' : ''}>${d.name}</option>`).join('')}</select></div></div>
      <div class="card"><div class="row between"><span class="muted">Moves: <b id="eg-moves">0</b></span><span class="chip star">Today: ${todayCount}/${egCap} mates (+5 ⭐ each)</span><button data-act="egrestart">🔄 New position</button><button data-act="egundo">↩ Undo</button></div>
      <div class="board-wrap"><div id="eg-board"></div></div><div id="eg-msg" class="tr-msg"></div>
      <p class="muted small">Wins in the lab: ${Object.entries(S().endgames).map(([k, e]) => `${DRILLS[k] ? DRILLS[k].name : k}: ${e.wins} (best ${e.best} moves)`).join(' · ') || 'none yet'} — +5 ⭐ for each clean mate (up to ${egCap}/day = ${egCap * 5} ⭐).</p></div>
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
        const egCap = S().settings.endgameCap || 10;
        const efficient = EG.moves <= dr.limit; const today = CQ.dstr(), n = S().ledger.filter(e => e.type === 'endgame' && e.date === today).length;
        let got = 0; if (efficient && n < egCap) { CQ.addStars(5, 'endgame', 'Checkmate: ' + dr.name + ' in ' + EG.moves, 'eg-' + CQ.uid()); got = 5; }
        CQ.commit(); sfx.win(); confetti(); $('#eg-msg').className = 'tr-msg ok'; $('#eg-msg').innerHTML = `🏆 <b>CHECKMATE in ${EG.moves}!</b> ${efficient ? (got ? '+5 ⭐' : '(daily endgame star limit reached)') : `Nice! Try for ${dr.limit} or fewer to earn stars.`}`;
      } else { sfx.bad(); $('#eg-msg').className = 'tr-msg bad'; $('#eg-msg').innerHTML = b.chess.in_stalemate() ? '🤝 <b>Stalemate!</b> That is a draw — you must leave the enemy king a legal move unless it is mate. Press 🔄 and try again.' : '😬 The game is drawn (material lost). Press 🔄 to try again.'; }
    };
    if (b.chess.game_over()) return end();
    b.locked = true; setTimeout(() => { const m = opponentMove(b.chess); if (m) b.play(m.from, m.to); b.locked = false; if (b.chess.game_over()) end(); else if (EG.moves >= dr.limit + 20) { EG.over = true; $('#eg-msg').innerHTML = 'Too many moves — press 🔄 and aim to be more efficient.'; } }, 450);
  }

  /* ----- Progress / Stats ----- */
  function badges() {
    const s = S(), q = Object.values(s.days).filter(d => d.questComplete).length, pz = Object.values(s.days).reduce((a, d) => a + d.pz.solved, 0), bs = CQ.bestStreak();
    const eg = Object.values(s.endgames).reduce((a, e) => a + e.wins, 0), qz = Object.keys(s.lessons.done || {}).length;
    return [
      ['🏁', 'First Quest', q >= 1], ['🔥', '3-Day Streak', bs >= 3], ['🌋', '7-Day Streak', bs >= 7],
      ['💯', '100 Puzzles', pz >= 100], ['🧩', '500 Puzzles', pz >= 500],
      ['🛡️', 'Iron Defender (L3)', s.level >= 3], ['⚔️', 'Gold Knight (L4)', s.level >= 4], ['🔴', 'Redstone Tactician (L5)', s.level >= 5],
      ['💎', 'Diamond Commander (L6)', s.level >= 6], ['🟪', 'Obsidian Master (L7)', s.level >= 7], ['🔥', 'Netherite GM (L8)', s.level >= 8],
      ['🎓', '5 Theory Exams Passed', qz >= 5], ['♚', 'Mate Master (5 lab mates)', eg >= 5], ['⭐', '1000 Stars Earned', CQ.lifetime() >= 1000]
    ];
  }
  function viewProgress(v) {
    const s = S(), set = s.settings, today = CQ.dstr(), perf = CQ.performanceRating(UI.lichess.user);
    const days = Array.from({ length: 14 }, (_, i) => CQ.addDays(today, i - 13));
    const target = set.dailyMin; let invested = 0, missed = 0, played = 0, completed = 0;
    const span = Math.max(1, CQ.daysBetween(s.startDate, today) + 1);
    for (let i = 0; i < span; i++) { const k = CQ.addDays(s.startDate, i), d = s.days[k], m = CQ.minutesOf(d); invested += m; if (d && d.questComplete) completed++; if (m > 0) played++; if (k !== today || m >= target) missed += Math.max(0, target - m); }
    const pctR = Math.max(5, Math.min(100, (set.rating - 500) / (set.ratingTarget - 500) * 100));
    const th = {}; for (const [id, sv] of Object.entries(s.puzzle.seen)) { const p = PMAP[id]; if (!p) continue; const t = (p.t && p.t[0]) || 'other'; (th[t] = th[t] || { n: 0, first: 0 }); th[t].n += sv.n; th[t].first += sv.first; }
    const themes = Object.entries(th).filter(([, x]) => x.n >= 3).map(([k, x]) => [k, x.first / x.n, x.n]).sort((a, b) => a[1] - b[1]);
    const fastWrong = Object.values(s.days).reduce((a, d) => a + d.pz.fastWrong, 0), tried = Object.values(s.days).reduce((a, d) => a + d.pz.tried, 0), first = Object.values(s.days).reduce((a, d) => a + d.pz.first, 0);
    v.innerHTML = `
      <div class="card">
        <div class="row between wrap">
          <h3>🎯 Road to ${set.ratingTarget} OTB</h3>
          <span class="chip star">⚡ Theoretical Level: ~${perf.otbPlayingAt} OTB (~${perf.lichessPlayingAt} Lichess)</span>
        </div>
        <div class="bar big"><i style="width:${pctR}%"></i></div>
        <div class="row between muted small"><span>Start: ${set.ratingStart}</span><b>Official Now: ${set.rating} NWSRS</b><span>Goal: ${set.ratingTarget}</span></div>
      </div>
      <div class="grid4">
        <div class="stat"><b>🔥 ${CQ.streak()}</b><span>streak (best ${CQ.bestStreak()})</span></div>
        <div class="stat"><b>⏱ ${CQ.totalMinutes()}</b><span>minutes trained</span></div>
        <div class="stat"><b>🧩 ${tried}</b><span>puzzles (${tried ? Math.round(first / tried * 100) : 0}% first try)</span></div>
        <div class="stat"><b>⭐ ${CQ.lifetime()}</b><span>stars earned</span></div>
      </div>
      <div class="card"><h3>⏱ Time invested vs missed</h3><div class="row between"><span>✅ Invested: <b>${invested} min</b> (${completed} full quests, ${played}/${span} days played)</span><span>⏳ Missed: <b>${missed} min</b></span></div>
        <div class="chart">${days.map(k => { const m = CQ.minutesOf(s.days[k]), h = Math.min(100, m / (target * 1.33) * 100); return `<div class="col"><div class="barv ${m >= target ? 'g' : m > 0 ? 'y' : 'n'}" style="height:${Math.max(3, h)}%" title="${k}: ${m} min"></div><small>${k.slice(8)}</small></div>`; }).join('')}<div class="tline" style="bottom:${target / (target * 1.33) * 100}%"><small>${target} min</small></div></div></div>
      <div class="card"><h3>🧠 Coach's Diagnostic</h3><ul>
        <li><b>Theoretical Playing Strength:</b> Playing like a <b>~${perf.otbPlayingAt} OTB / ~${perf.lichessPlayingAt} Lichess</b> player (${perf.perfTier.icon} ${perf.perfTier.name}).</li>
        <li><b>Impulse Discipline:</b> ${fastWrong} puzzles started with a &lt;4s wrong move${fastWrong ? ' — pause 3s and use CCT!' : ' — outstanding patience!'}</li>
        ${themes.length ? `<li><b>Theme to sharpen:</b> ${esc(themes[0][0])} (${Math.round(themes[0][1] * 100)}% first try over ${themes[0][2]} tries)</li><li><b>Strongest tactical motif:</b> ${esc(themes[themes.length - 1][0])} (${Math.round(themes[themes.length - 1][1] * 100)}%)</li>` : '<li>Solve more puzzles to see your strongest and weakest themes.</li>'}
      </ul></div>
      <div class="card"><h3>🏅 Minecraft & Training Badges</h3><div class="badges">${badges().map(b => `<div class="badge ${b[2] ? 'on' : ''}"><span>${b[0]}</span><small>${b[1]}</small></div>`).join('')}</div></div>
      <div class="card"><button data-act="report">📋 Copy progress report</button></div>`;
    loadLichess();
  }

  /* ----- Vault ----- */
  function viewVault(v) {
    const s = S(), bal = CQ.balance();
    v.innerHTML = `<div class="card hero"><div class="big">⭐ ${bal}</div><div class="muted">stars to spend · ${CQ.lifetime()} earned all-time</div></div>
      <div class="card"><h3>🎁 Prize Vault</h3><div class="rewards">${s.rewards.map(r => `<div class="reward ${bal >= r.cost ? 'can' : ''}"><div class="ri">${r.icon}</div><b>${esc(r.name)}</b><div class="cost">⭐ ${r.cost}</div><button data-act="redeem" data-id="${r.id}" ${bal >= r.cost ? 'class="primary"' : 'disabled'}>${bal >= r.cost ? 'Redeem' : `${r.cost - bal} more ⭐`}</button></div>`).join('')}</div></div>
      <div class="card"><h3>🕒 My redemptions</h3>${s.redemptions.length ? s.redemptions.slice().reverse().map(r => `<div class="row between line"><span>${esc(r.name)} <small class="muted">${r.date}</small></span><span class="chip ${r.status === 'approved' ? 'ok' : r.status === 'denied' ? 'bad' : ''}">${r.status === 'pending' ? '⏳ waiting for parent' : r.status}</span></div>`).join('') : '<p class="muted small">Nothing redeemed yet — save up!</p>'}</div>
      <div class="card"><h3>📒 Star history</h3>${s.ledger.slice(-20).reverse().map(e => `<div class="row between line"><span>${esc(e.desc)} <small class="muted">${e.date}</small></span><b class="${e.delta > 0 ? 'plus' : 'minus'}">${e.delta > 0 ? '+' : ''}${e.delta}</b></div>`).join('') || '<p class="muted small">Earn your first star by solving a puzzle!</p>'}</div>`;
  }

  /* ----- Settings / Parent zone ----- */
  function viewSettings(v) {
    const s = S(), set = s.settings, pend = s.redemptions.filter(r => r.status === 'pending');
    v.innerHTML = `
      <div class="card"><h3>👤 Player</h3><div class="form"><label>Name <input id="s-name" value="${esc(set.name)}"></label><label>Lichess username (public — never enter a password here) <input id="s-li" value="${esc(set.lichess)}" placeholder="govindu"></label></div></div>
      <div class="card"><h3>🔒 Parent zone</h3>
        <p class="muted small">Redemptions need approval here. ${set.pin ? 'PIN is set.' : '<b>No PIN set yet</b> — set one so the player cannot approve his own rewards.'}</p>
        <div class="form"><label>Parent PIN <input id="s-pin" type="password" inputmode="numeric" placeholder="${set.pin ? '••••  (type new to change)' : 'choose a PIN'}"></label></div>
        <h4>Pending redemptions (${pend.length})</h4>${pend.map(r => `<div class="row between line"><span>${esc(r.name)} · ⭐${r.cost} <small class="muted">${r.date}</small></span><span class="row"><button class="primary" data-act="approve" data-id="${r.id}">Approve</button><button data-act="deny" data-id="${r.id}">Decline &amp; refund</button></span></div>`).join('') || '<p class="muted small">None.</p>'}
        <h4>Rewards &amp; star prices</h4>${s.rewards.map((r, i) => `<div class="row line"><input class="ic" data-rw="${i}" data-f="icon" value="${esc(r.icon)}"><input data-rw="${i}" data-f="name" value="${esc(r.name)}" style="flex:1"><input type="number" class="cost" data-rw="${i}" data-f="cost" value="${r.cost}"><button data-act="delrw" data-id="${i}">✕</button></div>`).join('')}
        <div class="row"><button data-act="addrw">+ Add reward</button></div>
        <div class="form">
          <label>Daily training target (minutes) <input id="s-dmin" type="number" value="${set.dailyMin}"></label>
          <label>Daily Puzzle Star Cap (default 200 ⭐/day) <input id="s-pzcap" type="number" value="${set.puzzleStarCap || 200}"></label>
          <label>Current over-the-board rating (NWSRS) <input id="s-rating" type="number" value="${set.rating}"></label>
          <label>Goal rating <input id="s-target" type="number" value="${set.ratingTarget}"></label>
        </div>
        <div class="row wrap"><button data-act="bonus">+ Bonus stars</button><button data-act="level">Set Minecraft Rank (1–8)</button></div></div>
      <div class="card"><h3>☁️ Cloud sync (Google Sheet)</h3>
        <div class="form"><label>Apps Script web-app URL <input id="s-sync" value="${esc(set.syncUrl)}" placeholder="https://script.google.com/macros/s/…/exec"></label></div>
        <div class="muted small">Status: <b>${CQ.sync.status}</b>${CQ.sync.last ? ' · last ' + CQ.sync.last.toLocaleTimeString() : ''}. Setup guide: SETUP.md.</div>
        <div class="row wrap"><button data-act="syncnow">🔄 Sync now</button><button data-act="copylink">🔗 Copy setup link for other devices</button></div></div>
      <div class="card"><h3>💾 Backup</h3><div class="row wrap"><button data-act="export">Export JSON</button><label class="btn">Import JSON<input id="s-imp" type="file" accept=".json" hidden></label><button data-act="reset" class="danger">Reset everything</button></div></div>
      <div class="row center"><button class="primary" data-act="savesettings">💾 Save settings</button></div>`;
    const f = $('#s-imp'); if (f) f.onchange = async e => { try { CQ.importJSON(await e.target.files[0].text()); toast('Imported ✔'); renderView(); } catch (x) { toast('Import failed'); } };
  }

  /* ---------- Modals for Profile Portrait Switcher & Rating Logger ---------- */
  function openAvatarSwitcher() {
    const cur = S().profile.avatar || 'assets/anish-jacket.jpg';
    const m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = `<div class="card modal-card">
      <h3>🖼️ Choose Anish's Profile Portrait</h3>
      <div class="avatar-grid">
        ${AVATARS.map(([src, label]) => `
          <div class="av-choice ${cur === src ? 'on' : ''}" data-src="${src}">
            <img src="${src}" alt="${esc(label)}">
            <small>${esc(label)}</small>
          </div>`).join('')}
      </div>
      <div class="row between wrap" style="margin-top:12px">
        <label class="btn small">📤 Upload Custom Photo<input id="av-up" type="file" accept="image/*" hidden></label>
        <button id="av-close" class="primary">Done</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    m.querySelectorAll('.av-choice').forEach(el => {
      el.onclick = () => {
        S().profile.avatar = el.dataset.src;
        CQ.commit(); m.remove(); renderView(); toast('Portrait updated ✔');
      };
    });
    $('#av-up', m).onchange = e => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => { S().profile.avatar = ev.target.result; CQ.commit(); m.remove(); renderView(); toast('Custom photo saved ✔'); };
      reader.readAsDataURL(file);
    };
    $('#av-close', m).onclick = () => m.remove();
  }

  function openRatingLogger() {
    const m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = `<div class="card modal-card">
      <h3>➕ Log Rating Update / Tournament Result</h3>
      <p class="muted small">Track rating changes across NWChess, USCF, FIDE, or Lichess and earn <b>+25 ⭐</b>!</p>
      <div class="form">
        <label>Rating System
          <select id="rl-sys">
            <option value="nwsrs">🌲 NWChess (NWSRS)</option>
            <option value="uscf">🇺🇸 US Chess (USCF Regular)</option>
            <option value="fide">🏛️ FIDE Standard</option>
            <option value="lichess">🌐 Lichess Rapid</option>
          </select>
        </label>
        <label>New Rating <input id="rl-r" type="number" placeholder="e.g. 725"></label>
        <label>Tournament / Event Name <input id="rl-ev" placeholder="e.g. Thanksgiving Scholastic"></label>
        <label>Score (optional) <input id="rl-sc" placeholder="e.g. 3.5 / 5"></label>
        <label>Date <input id="rl-dt" type="date" value="${CQ.dstr()}"></label>
        <label>Key Takeaway / Notes <input id="rl-nt" placeholder="e.g. Great endgame conversion!"></label>
      </div>
      <div class="row end" style="margin-top:12px">
        <button id="rl-cancel">Cancel</button>
        <button id="rl-save" class="primary">Save Rating (+25 ⭐)</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    $('#rl-cancel', m).onclick = () => m.remove();
    $('#rl-save', m).onclick = () => {
      const ok = CQ.logRatingUpdate({
        sys: $('#rl-sys', m).value,
        newRating: $('#rl-r', m).value,
        eventName: $('#rl-ev', m).value.trim(),
        score: $('#rl-sc', m).value.trim(),
        date: $('#rl-dt', m).value,
        notes: $('#rl-nt', m).value.trim(),
      });
      if (!ok) return toast('Please enter a valid rating number');
      m.remove(); confetti(); sfx.win(); toast('Rating logged! +25 ⭐'); renderView();
    };
  }

  /* ---------- actions ---------- */
  async function act(a, id, el) {
    const s = S();
    switch (a) {
      case 'toggle': UI.open = UI.open === id ? null : id; return renderView();
      case 'start': CQ.timer.phase = id; UI.open = id; renderView(); return;
      case 'pause': CQ.timer.phase = null; return renderView();
      case 'finish': {
        if (id === 'p2') {
          const l = todaysLesson();
          if (!s.lessons.done[l.id]) {
            toast('🎓 Pass the 3-question Mastery Quiz first to complete Phase 2!');
            return openLessonQuiz(l, () => {
              const r2 = CQ.finishPhase('p2'); CQ.commit();
              if (r2 === 'quest') { confetti(); sfx.win(); modal(`<h2>🏆 TRIFECTA QUEST COMPLETE!</h2><p>+20 ⭐ Chest earned. Streak: <b>${CQ.streak()} days</b> 🔥</p>`); }
            });
          }
        }
        const r = CQ.finishPhase(id); CQ.commit(); if (UI.open === id) UI.open = null;
        if (r === 'quest') { confetti(); sfx.win(); await modal(`<h2>🏆 TRIFECTA QUEST COMPLETE!</h2><p>+20 ⭐ earned. Streak: <b>${CQ.streak()} days</b> 🔥</p><p>${coach()}</p>`); } else toast('✅ Phase complete! +5 ⭐');
        return renderView();
      }
      case 'quiz': {
        const l = LESSONS.find(x => x.id === id) || todaysLesson();
        return openLessonQuiz(l);
      }
      case 'yttest': {
        const sel = $('#yt-topic-sel');
        const l = LESSONS.find(x => x.id === (sel && sel.value)) || todaysLesson();
        return openLessonQuiz(l);
      }
      case 'switchavatar': return openAvatarSwitcher();
      case 'openlograting': return openRatingLogger();
      case 'picktier': {
        const lvl = +id;
        go('puzzles');
        const sel = $('#tr-tier'); if (sel) { sel.value = String(lvl); sel.dispatchEvent(new Event('change')); }
        toast(`Training at Level ${lvl}: ${getLvlObj(lvl).name}`);
        return;
      }
      case 'otherlesson': { const d = CQ.day(), same = LESSONS.filter(l => l.l === s.level), pool = same.length ? same : LESSONS; const i = pool.findIndex(l => l.id === d.lessonId); d.lessonId = pool[(i + 1) % pool.length].id; CQ.commit(); return renderView(); }
      case 'lab': EG.id = id; return go('endgames');
      case 'refreshli': await loadLichess(true); toast('Lichess synced ✔'); return renderView();
      case 'savegame': {
        const text = $('#gmist').value.trim(); s.games.push({ id: CQ.uid(), ts: Date.now(), date: CQ.dstr(), result: $('#gres').value, mistake: text, cct: +$('#gcct').value });
        const d = CQ.day(); d.sec.p3 = Math.max(d.sec.p3, Math.round(CQ.TARGET.p3 * CQ.MIN_FRAC));
        let msg = 'Review saved ✔'; if (text.length > 5 && CQ.addStars(10, 'review', '📝 Game Blunder Audit', 'review-' + CQ.dstr())) msg += ' +10 ⭐ Bounty!';
        CQ.commit(); toast(msg); $('#gmist').value = ''; renderView(); return;
      }
      case 'stepdown': CQ.setLevel(s.level - 1); return renderView();
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
      case 'bonus': { if (!await askPin('Give bonus stars')) return; const n = parseInt(prompt('Bonus stars to give (negative to deduct):', '20'), 10); if (n) { CQ.addStars(n, 'bonus', 'Parent bonus: ' + (prompt('Reason?', 'Great effort!') || 'bonus')); CQ.commit(); renderView(); } return; }
      case 'level': { if (!await askPin('Change level')) return; const n = parseInt(prompt('Set Minecraft Rank (1-8):', s.level), 10); if (n >= 1 && n <= 8) { CQ.setLevel(n); renderView(); } return; }
      case 'savesettings': {
        const set = s.settings; if (set.pin && ($('#s-pin').value || $('#s-dmin').value !== String(set.dailyMin) || $('#s-rating').value !== String(set.rating)) && !await askPin('Save parent settings')) return;
        set.name = $('#s-name').value.trim() || 'Anish'; set.lichess = $('#s-li').value.trim() || 'govindu'; if ($('#s-pin').value) set.pin = $('#s-pin').value;
        set.dailyMin = +$('#s-dmin').value || 30; set.puzzleStarCap = +$('#s-pzcap').value || 200;
        set.rating = +$('#s-rating').value || set.rating; s.profile.ratings.nwsrs.current = set.rating;
        set.ratingTarget = +$('#s-target').value || 1000; set.syncUrl = $('#s-sync').value.trim();
        document.querySelectorAll('[data-rw]').forEach(i => { const r = s.rewards[+i.dataset.rw]; if (r) r[i.dataset.f] = i.dataset.f === 'cost' ? (+i.value || 0) : i.value; });
        CQ.commit(); toast('Saved ✔'); if (set.syncUrl) CQ.cloudPull().then(CQ.cloudPush); return renderView();
      }
      case 'syncnow': await CQ.cloudPull(); await CQ.cloudPush(); toast('Cloud synced ✔'); return renderView();
      case 'copylink': { const l = CQ.makeSetupLink(); try { await navigator.clipboard.writeText(l); toast('Setup link copied — open it once on each device'); } catch { prompt('Copy this link:', l); } return; }
      case 'export': { const b = new Blob([CQ.exportJSON()], { type: 'application/json' }), a2 = document.createElement('a'); a2.href = URL.createObjectURL(b); a2.download = 'chess-quest-backup-' + CQ.dstr() + '.json'; a2.click(); return; }
      case 'reset': if (await askPin('Erase ALL progress') && await modal('<h3>⚠️ Erase all progress?</h3><p>This cannot be undone (cloud copy will also be overwritten).</p>', [['Cancel', false], ['Erase', true, true]])) { CQ.reset(); UI.persist = {}; renderView(); } return;
      case 'report': { const d = CQ.day(), perf = CQ.performanceRating(UI.lichess.user), lv = getLvlObj(s.level), t = `Chess Quest report for ${s.settings.name} (${CQ.dstr()})\nRank: L${lv.n} ${lv.name} · Playing At: ~${perf.otbPlayingAt} OTB (~${perf.lichessPlayingAt} Lichess)\nStreak: ${CQ.streak()} (best ${CQ.bestStreak()}) · ${CQ.totalMinutes()} min total · ⭐ ${CQ.balance()}\nToday: ${CQ.minutesOf(d)} min, ${d.pz.tried} puzzles (${d.pz.first} first try), quest ${d.questComplete ? 'complete' : 'in progress'}`; try { await navigator.clipboard.writeText(t); toast('Report copied'); } catch { prompt('Copy:', t); } return; }
    }
  }
  document.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (t && !t.closest('.board')) { e.stopPropagation(); act(t.dataset.act, t.dataset.id, t); return; } const n = e.target.closest('[data-tab]'); if (n) go(n.dataset.tab); });

  /* ---------- boot ---------- */
  function boot() {
    CQ.load(); CQ.applySetupHash();
    CQ.on(updateHeader);
    const qt = new URLSearchParams(location.search).get('tab'); if (qt && TABS.some(t => t[0] === qt)) go(qt); else { renderNav(); renderView(); }
    setInterval(() => { if (CQ.tick() !== undefined) updateTimers(); }, 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) CQ.cloudPull().then(() => { updateHeader(); }); else CQ.cloudPush(); });
    window.addEventListener('pagehide', () => CQ.save(false));
    if (S().settings.syncUrl) CQ.cloudPull().then(() => renderView());
    loadLichess();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
  }
  window.addEventListener('DOMContentLoaded', boot);
})();
