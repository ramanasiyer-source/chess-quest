/* Chess Quest v3 - UI:
 * Tabs: 🎯 Goals | 🌐 Lichess (+ 🔬 Engine Analysis & Puzzles/Endgame Arena) | 📚 Theory (5 Packages) | 👤 Profile (5 Tiers) | 🎁 Rewards | ⚙️ Settings
 */
(function () {
  const S = () => CQ.S;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const rand = a => a[Math.floor(Math.random() * a.length)];

  const TABS = [
    ['goals', '🎯', 'Goals'],
    ['lichess', '🌐', 'Lichess'],
    ['lessons', '📚', 'Theory'],
    ['profile', '👤', 'Profile'],
    ['vault', '🎁', 'Rewards'],
    ['settings', '⚙️', 'Settings'],
  ];

  const AVATARS = [
    ['assets/anish-jacket.jpg', 'Classic + Columbia Jacket'],
    ['assets/anish-blazer.jpg', 'Classic + Grandmaster Blazer'],
    ['assets/anish-jacket-fringe.jpg', 'Side Fringe + Columbia Jacket'],
    ['assets/anish-blazer-fringe.jpg', 'Side Fringe + Grandmaster Blazer'],
  ];

  const UI = window.CQ_UI = {
    tab: 'goals',
    weekMon: null,
    calYm: null,
    arenaMode: 'tactics', // 'tactics' | 'endgame_pz' | 'endgame_lab'
    lichess: { user: null, activity: null, games: null, ts: 0, err: null },
    persist: {},
  };

  /* ---------- tiny helpers: toast, modal, confetti, beep ---------- */
  let audioCtx = null;
  function beep(freq, dur = 0.12, type = 'sine') {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type; o.frequency.value = freq; g.gain.value = 0.05;
      o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + dur);
    } catch {}
  }
  const sfx = {
    good() { beep(660); setTimeout(() => beep(880), 110); },
    bad() { beep(180, 0.2, 'sawtooth'); },
    win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.18), i * 130)); },
  };
  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3400);
  }
  function confetti() {
    const em = ['⭐', '🎉', '💎', '⛏️', '♟️', '🏆', '🔥'];
    for (let i = 0; i < 42; i++) {
      const e = document.createElement('span'); e.className = 'confetti'; e.textContent = rand(em);
      e.style.left = Math.random() * 100 + 'vw'; e.style.animationDelay = Math.random() * 0.8 + 's';
      e.style.fontSize = 16 + Math.random() * 22 + 'px';
      document.body.appendChild(e); setTimeout(() => e.remove(), 3500);
    }
  }
  function modal(html, buttons = [['OK', null, true]]) {
    return new Promise(res => {
      const m = document.createElement('div'); m.className = 'modal';
      m.innerHTML = `<div class="card modal-card">${html}<div class="row end wrap" style="margin-top:14px"></div></div>`;
      const row = $('.row.end', m);
      buttons.forEach(([label, val, primary]) => {
        const b = document.createElement('button'); b.textContent = label;
        if (primary) b.className = 'primary';
        b.onclick = () => { m.remove(); res(val); };
        row.appendChild(b);
      });
      document.body.appendChild(m);
    });
  }
  async function askPin(reason) {
    const pin = S().settings.pin || '2014';
    const m = document.createElement('div'); m.className = 'modal';
    return new Promise(res => {
      m.innerHTML = `<div class="card modal-card">
        <h3>🔒 Parent 4-Digit PIN</h3>
        <p class="muted small">${esc(reason || 'Enter the 4-digit parent PIN')}</p>
        <input id="pinin" type="password" inputmode="numeric" maxlength="8" placeholder="••••" autocomplete="off" style="width:100%;font-size:20px;letter-spacing:4px;text-align:center">
        <div class="row end" style="margin-top:12px"><button id="pc">Cancel</button><button id="po" class="primary">Verify PIN</button></div>
      </div>`;
      document.body.appendChild(m); $('#pinin', m).focus();
      const done = ok => { m.remove(); res(ok); };
      $('#pc', m).onclick = () => done(false);
      $('#po', m).onclick = () => {
        if ($('#pinin', m).value === pin) done(true);
        else { sfx.bad(); toast('Incorrect PIN'); $('#pinin', m).value = ''; }
      };
      $('#pinin', m).onkeydown = e => { if (e.key === 'Enter') $('#po', m).click(); };
    });
  }

  function getLvlObj(n) {
    const arr = window.LEVELS || [];
    return arr[Math.max(0, Math.min(arr.length - 1, (n || 1) - 1))] || { n: 1, name: 'Stone Crafter', icon: '⛏️', mc: 'Stone Pickaxe', targets: { otb: 700, classical: 1300, rapid: 1550, blitz: 1250, puzzle: 1650 }, clearBonus: 250 };
  }

  /* ---------- Lichess Live Sync (User + Daily Activity + Games w/ Evals & Clocks) ---------- */
  async function loadLichess(force) {
    const u = (S().settings.lichess || 'govindu').trim(); if (!u) return;
    if (!force && UI.lichess.user && UI.lichess.name === u && Date.now() - UI.lichess.ts < 240000) return;
    UI.lichess = { name: u, ts: Date.now(), user: UI.lichess.user, activity: UI.lichess.activity || [], games: UI.lichess.games || [], err: null };
    try {
      const [uRes, aRes, gRes] = await Promise.allSettled([
        fetch('https://lichess.org/api/user/' + encodeURIComponent(u)),
        fetch('https://lichess.org/api/user/' + encodeURIComponent(u) + '/activity'),
        fetch('https://lichess.org/api/games/user/' + encodeURIComponent(u) + '?max=25&opening=true&evals=true&accuracy=true&clocks=true', { headers: { Accept: 'application/x-ndjson' } }),
      ]);
      if (uRes.status === 'fulfilled' && uRes.value.ok) UI.lichess.user = await uRes.value.json();
      if (aRes.status === 'fulfilled' && aRes.value.ok) UI.lichess.activity = await aRes.value.json();
      if (gRes.status === 'fulfilled' && gRes.value.ok) {
        const txt = await gRes.value.text();
        UI.lichess.games = txt.trim().split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(x => x && x.players);
      }
      CQ.syncLichessData({ user: UI.lichess.user, activity: UI.lichess.activity, games: UI.lichess.games });
    } catch (e) { UI.lichess.err = String(e); }
    if (['goals', 'lichess', 'lessons', 'profile'].includes(UI.tab)) renderView();
  }

  /* ---------- Lichess Engine & Game Diagnostic ("Why Anish Wins vs. Why He Loses") ---------- */
  function analyzeLichessGames(games = []) {
    const uname = (S().settings.lichess || 'govindu').toLowerCase();
    const stats = {
      total: 0, wins: 0, losses: 0, draws: 0,
      repPlayed: 0, repWins: 0,
      nonRepPlayed: 0, nonRepWins: 0,
      lossCauses: { fastImpulse: 0, opening: 0, middlegame: 0, endgame: 0, timeTrouble: 0 },
      blundersTotal: 0, analyzedGames: 0, avgAccWin: [], avgAccLoss: [],
      annotatedGames: [],
    };
    for (const g of games) {
      if (!g || !g.players) continue;
      const isWhite = g.players.white && g.players.white.user && g.players.white.user.name.toLowerCase() === uname;
      const isBlack = g.players.black && g.players.black.user && g.players.black.user.name.toLowerCase() === uname;
      if (!isWhite && !isBlack) continue;
      const side = isWhite ? 'w' : 'b';
      const myPlayer = isWhite ? g.players.white : g.players.black;
      const oppPlayer = isWhite ? g.players.black : g.players.white;
      const oppName = (oppPlayer && oppPlayer.user && oppPlayer.user.name) || 'AI';
      const oppRating = (oppPlayer && oppPlayer.rating) || '?';
      const res = !g.winner ? 'Draw' : ((g.winner === 'white') === isWhite ? 'Win' : 'Loss');
      const movesArr = (g.moves || '').trim().split(/\s+/).filter(Boolean);
      const numMoves = Math.ceil(movesArr.length / 2);
      const opName = (g.opening && g.opening.name) || 'Custom Opening';
      const rep = CQ.classifyRepertoire(opName, g.moves || '', side);
      const myAnalysis = myPlayer && myPlayer.analysis;
      const clocks = Array.isArray(g.clocks) ? g.clocks : [];

      // Count fast moves (< 3.5 seconds in middlegame) from clock centiseconds
      let fastMoves = 0;
      const startIdx = isWhite ? 0 : 1;
      for (let i = startIdx + 12; i < clocks.length; i += 2) {
        const prevClk = clocks[i - 2], curClk = clocks[i];
        if (prevClk != null && curClk != null && prevClk > 6000) {
          const spentSec = (prevClk - curClk) / 100;
          if (spentSec >= 0 && spentSec < 3.0) fastMoves++;
        }
      }

      stats.total++;
      if (res === 'Win') stats.wins++;
      else if (res === 'Loss') stats.losses++;
      else stats.draws++;

      if (rep) { stats.repPlayed++; if (res === 'Win') stats.repWins++; }
      else { stats.nonRepPlayed++; if (res === 'Win') stats.nonRepWins++; }

      if (myAnalysis) {
        stats.analyzedGames++;
        stats.blundersTotal += myAnalysis.blunder || 0;
        if (myAnalysis.accuracy) {
          if (res === 'Win') stats.avgAccWin.push(myAnalysis.accuracy);
          if (res === 'Loss') stats.avgAccLoss.push(myAnalysis.accuracy);
        }
      }

      let reason = '';
      if (res === 'Loss') {
        if (g.status === 'outoftime') {
          stats.lossCauses.timeTrouble++;
          reason = '⏱️ Clock flag — ran out of time';
        } else if (fastMoves >= 4) {
          stats.lossCauses.fastImpulse++;
          reason = `⚡ Impulse pace (${fastMoves} middlegame moves played in <3s)`;
        } else if (numMoves <= 16) {
          stats.lossCauses.opening++;
          reason = `🏛️ Early opening tactical trap (${numMoves} moves in ${opName})`;
        } else if (numMoves <= 32) {
          stats.lossCauses.middlegame++;
          reason = `⚔️ Middlegame tactical blunder (${numMoves} moves)`;
        } else {
          stats.lossCauses.endgame++;
          reason = `♚ Late-game / endgame conversion slip (${numMoves} moves)`;
        }
      } else if (res === 'Win') {
        reason = rep
          ? `✅ Core Repertoire Win (${rep.label}) in ${numMoves} moves`
          : `✅ Tactical win in ${numMoves} moves`;
      } else {
        reason = `🤝 Draw in ${numMoves} moves`;
      }

      stats.annotatedGames.push({
        id: g.id,
        date: CQ.dstr(new Date(g.createdAt || Date.now())),
        speed: g.speed || 'rapid',
        side,
        res,
        oppName,
        oppRating,
        opName,
        rep,
        numMoves,
        fastMoves,
        myAnalysis,
        reason,
      });
    }
    return stats;
  }

  /* ---------- Header ---------- */
  function updateHeader() {
    const lv = getLvlObj(S().level), sy = CQ.sync, perf = CQ.performanceRating(UI.lichess.user);
    const av = (S().profile && S().profile.avatar) || 'assets/anish-jacket.jpg';
    const wk = CQ.getWeekStats();
    $('#hdr').innerHTML = `
      <div class="brand" data-tab="profile" style="cursor:pointer" title="Open Player Profile">
        <img class="avatar-sm" src="${esc(av)}" alt="Anish">
        <div>
          <b>${esc(S().settings.name)}'s Chess Quest</b>
          <small>${lv.icon} L${lv.n}/5 ${lv.name} · 🎯 Week: ${wk.pct}% · ⚡ ~${perf.otbPlayingAt} OTB</small>
        </div>
      </div>
      <div class="chips">
        <span class="chip" title="Streak">🔥 ${CQ.streak()}d</span>
        <span class="chip star" data-tab="vault" style="cursor:pointer" title="Open Rewards">⭐ ${CQ.balance()}</span>
        <span class="chip sync ${sy.status}" title="Cloud sync: ${sy.status}">${sy.status === 'ok' ? '☁️' : sy.status === 'syncing' ? '🔄' : sy.status === 'error' ? '⚠️' : '📴'}</span>
      </div>`;
  }

  function renderNav() {
    $('#nav').innerHTML = TABS.map(([id, ic, lb]) => `<button class="${UI.tab === id ? 'on' : ''}" data-tab="${id}"><span>${ic}</span>${lb}</button>`).join('');
  }
  function go(tab) {
    UI.tab = tab;
    const d = CQ.day();
    if (tab === 'lichess') CQ.timer.phase = d.sec.p1 < CQ.TARGET.p1 ? 'p1' : 'free';
    else if (tab === 'lessons') CQ.timer.phase = d.sec.p2 < CQ.TARGET.p2 ? 'p2' : 'free';
    else CQ.timer.phase = null;
    renderNav(); renderView(); window.scrollTo(0, 0);
  }
  function renderView() {
    const v = $('#view');
    ({
      goals: viewGoals,
      lichess: viewLichess,
      lessons: viewLessons,
      profile: viewProfile,
      vault: viewVault,
      settings: viewSettings,
    })[UI.tab](v);
    updateHeader();
  }

  /* ==================== TAB 1: 🎯 GOALS (Overall + Weekly + Bonus/Penalty + Daily/Weekly Log) ==================== */
  function viewGoals(v) {
    const s = S(), rt = s.profile.ratings, perf = CQ.performanceRating(UI.lichess.user), lv = getLvlObj(s.level);
    const curMon = CQ.weekStart();
    const selMon = UI.weekMon || curMon;
    const wk = CQ.getWeekStats(selMon);
    const isCurWeek = selMon === curMon;

    const goalBar = (label, cur, start, target, sub, badge) => {
      const base = Math.min(start || 400, cur || 400);
      const pct = Math.max(6, Math.min(100, Math.round(((cur - base) / Math.max(1, target - base)) * 100)));
      const rem = Math.max(0, target - cur);
      return `<div class="rating-card">
        <div class="row between"><b>${label}</b><span class="chip small ${rem === 0 ? 'ok' : ''}">${rem === 0 ? '🏆 Goal Hit!' : `${rem} pts to go`}</span></div>
        <div class="big" style="margin:4px 0">${cur} <small>/ ${target} Goal</small></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="row between muted small"><span>${sub}</span><span>${badge || ''}</span></div>
      </div>`;
    };

    // Build past 4 weeks summary
    const weekHistory = [0, -1, -2, -3].map(off => CQ.getWeekStats(CQ.addDays(curMon, off * 7)));

    v.innerHTML = `
      <div class="card hero">
        <div class="row between wrap">
          <div>
            <span class="chip star">${lv.icon} Level ${lv.n}/5: ${lv.name}</span>
            <h2 style="margin:6px 0 2px">🎯 Progress Against Goals</h2>
            <div class="muted small">Road to <b>1000 USCF / NWSRS OTB</b> & <b>Lichess Mastery</b> · Playing at <b>~${perf.otbPlayingAt} OTB (~${perf.lichessPlayingAt} Lichess)</b></div>
          </div>
          <div class="perf-pill" data-tab="lichess" style="cursor:pointer" title="Open Lichess & Practice Arena">
            <small>THIS WEEK'S GOAL</small>
            <b style="color:${wk.pct >= 100 ? '#22c55e' : wk.pct >= 50 ? '#fbbf24' : '#38bdf8'}">${wk.pct}%</b>
            <span>${wk.totMin} / ${wk.targets.minutes} mins · ⭐ ${wk.totStars >= 0 ? '+' : ''}${wk.totStars}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="row between wrap">
          <div>
            <h3>🏆 1. Overall Rating Goals (OTB 1000 & Online Lichess Targets)</h3>
            <p class="muted small" style="margin:2px 0 0">OTB ratings climb by playing rated tournaments; Online ratings sync automatically from Lichess (<b>govindu</b>).</p>
          </div>
          <button class="btn small primary" data-act="openlograting">➕ Log OTB Tournament Rating (+25 ⭐)</button>
        </div>
        <h4 style="margin:12px 0 6px">🏛️ Over-The-Board (OTB) — Target: 1000 Across All Formats</h4>
        <div class="rating-grid">
          ${goalBar('🇺🇸 USCF Regular', rt.uscf.current || 463, 400, 1000, 'Classical / Scholastic OTB', 'ID: 17354281')}
          ${goalBar('⚡ USCF Quick', rt.uscf.quick || 425, 350, 1000, 'G/10 – G/25 Rated Quick', 'Peak: ' + (rt.uscf.quick || 425))}
          ${goalBar('🔥 USCF Blitz', rt.uscf.blitz || 425, 350, 1000, 'G/5 Blitz (SPFNO)', 'Tournament Blitz')}
          ${goalBar('🌲 NWChess (NWSRS)', rt.nwsrs.current || 679, 500, 1000, 'WA Scholastic Rating', 'Peak: 732')}
        </div>

        <h4 style="margin:14px 0 6px">🌐 Online Lichess (govindu) — Calibrated to 1000 USCF Strength</h4>
        <div class="rating-grid">
          ${goalBar('🕰️ Lichess Classical', rt.lichess.classical || 1255, 1100, rt.lichess.targetClassical || 1650, '15+10 or slower', 'L5 Goal: 1650')}
          ${goalBar('⚡ Lichess Rapid', rt.lichess.current || 1611, 1400, rt.lichess.targetRapid || 1750, '10+0 / 10+5 Rapid', 'L5 Goal: 1750')}
          ${goalBar('🔥 Lichess Blitz', rt.lichess.blitz || 1210, 1050, rt.lichess.targetBlitz || 1500, '3+2 / 5+0 Blitz', 'L5 Goal: 1500')}
          ${goalBar('🧩 Lichess Puzzles', rt.lichess.puzzle || 1765, 1500, rt.lichess.targetPuzzle || 2000, '2,303+ Rated Puzzles', 'L5 Goal: 2000')}
        </div>
      </div>

      <div class="card">
        <div class="row between wrap">
          <div>
            <h3>📅 2. Weekly Training Goal & Bonus/Penalty Meter (${esc(wk.monday)} → ${esc(wk.sunday)})</h3>
            <p class="muted small" style="margin:2px 0 0">Hit 50%, 75%, 100% for escalating bonuses — push to <b>150% (+200 ⭐)</b> and <b>200% (+400 ⭐)</b> for double overdrive rewards!</p>
          </div>
          <div class="row">
            <button class="btn small" data-act="wkprev">◀ Prev Week</button>
            ${!isCurWeek ? `<button class="btn small primary" data-act="wktoday">This Week</button>` : ''}
            <button class="btn small" data-act="wknext" ${isCurWeek ? 'disabled' : ''}>Next Week ▶</button>
          </div>
        </div>

        <div class="wk-meter-wrap" style="margin:12px 0">
          <div class="row between small" style="margin-bottom:4px">
            <b>Weekly Completion: <span style="color:#fbbf24;font-size:18px">${wk.pct}%</span> (Scale: 0% → 200%)</b>
            <span class="muted">100% = Full Goal · 200% = Double Beast Mode</span>
          </div>
          <div class="bar big" style="position:relative;height:18px;background:#0f172a">
            <i style="width:${Math.min(100, wk.pct / 2)}%;background:linear-gradient(90deg,#ef4444 0%,#f59e0b 25%,#22c55e 50%,#38bdf8 75%,#a855f7 100%)"></i>
          </div>
          <div class="row between small muted" style="margin-top:4px;font-size:11px">
            <span>0% (🚨 -100⭐)</span>
            <span>50% (+25⭐)</span>
            <span>75% (+50⭐)</span>
            <span><b>100% (+100⭐)</b></span>
            <span>150% (+200⭐)</span>
            <span>200% (+400⭐)</span>
          </div>
        </div>

        <div class="grid4" style="margin:12px 0">
          <div class="stat">
            <small class="muted">⏱ WEEKLY TIME</small>
            <b>${wk.totMin} / ${wk.targets.minutes}m</b>
            <span>30m/day average</span>
          </div>
          <div class="stat">
            <small class="muted">♟️ LICHESS GAMES</small>
            <b>${wk.totClassical}/${wk.targets.classicalGames} C · ${wk.totRapid}/${wk.targets.rapidGames} R</b>
            <span>2 Classical + 5 Rapid/wk</span>
          </div>
          <div class="stat">
            <small class="muted">🧩 LICHESS PUZZLES</small>
            <b>${wk.totPz} / ${wk.targets.puzzles}</b>
            <span>~${wk.puzzleMin}m (${wk.targets.puzzleMinutes}m goal)</span>
          </div>
          <div class="stat">
            <small class="muted">📚 ROADMAP &amp; STUDY</small>
            <b>${wk.totQuizzes}/${wk.targets.theoryQuizzes} Modules</b>
            <span>~${wk.theoryMin}m (${wk.targets.theoryMinutes}m goal)</span>
          </div>
        </div>

        <div class="row wrap" style="margin:10px 0">
          <button class="primary" data-tab="lichess">🌐 Open Lichess Hub &amp; Launchpad ▶</button>
          <button data-tab="lessons">📚 Open Level ${s.level} Roadmap ▶</button>
          <button data-act="refreshli">🔄 Sync Lichess Activity Now</button>
        </div>

        <h4 style="margin:14px 0 6px">⚡ Weekly Bonus & Penalty Tiers</h4>
        <div class="bounty-list">
          ${wk.milestones.map(m => `
            <div class="bounty-row ${m.reached ? 'done' : ''}">
              <div class="row">
                <span style="font-size:18px">${m.reached ? '✅' : '🎯'}</span>
                <div><b>${esc(m.label)}</b><div class="muted small">Requires ${m.pct}% weekly progress (Currently ${wk.pct}%)</div></div>
              </div>
              <span class="chip ${m.reached ? 'ok' : 'star'}">${m.reached ? `Unlocked +${m.stars} ⭐` : `+${m.stars} ⭐`}</span>
            </div>`).join('')}
          <div class="bounty-row" style="border-color:#7f1d1d">
            <div class="row">
              <span style="font-size:18px">🚨</span>
              <div>
                <b>Weekly Miss & Idle Penalties (Accountability Rules)</b>
                <div class="muted small">End week &lt;50%: <b>-100 ⭐</b> · 50–74%: <b>-40 ⭐</b> · 75–99%: <b>-25 ⭐</b> · 2 consecutive 0-min unexcused days: <b>-20 ⭐/day</b></div>
              </div>
            </div>
            <span class="chip bad">Penalty Rule</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>📋 3. Daily Log Toward Weekly Goal (${esc(wk.monday)} → ${esc(wk.sunday)})</h3>
        <div class="muted small" style="margin-bottom:8px">Shows how much each day contributed toward the weekly goal. Parents can mark travel/swim-meet days as <b>Excused</b>.</div>
        <div class="table-wrap">
          <table class="goal-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Puzzles</th>
                <th>Games (C/R/B)</th>
                <th>Theory / Endgames</th>
                <th>Weekly +%</th>
                <th>Credits</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${wk.days.map(d => {
                const statusBadge = d.excused
                  ? '<span class="chip">🛡️ Excused</span>'
                  : d.isFuture
                    ? '<span class="muted">—</span>'
                    : d.mins >= 30
                      ? '<span class="chip ok">🟩 30m+ Hit</span>'
                      : (d.mins > 0 || d.pzSolved > 0 || d.earnedStars > 0)
                        ? '<span class="chip run">🟨 Active</span>'
                        : '<span class="chip bad">🟥 0 Min</span>';
                return `<tr class="${d.isToday ? 'today-row' : ''}">
                  <td><b>${d.dow}</b> <small class="muted">${d.date.slice(5)}</small> ${d.isToday ? '<span class="chip small ok">Today</span>' : ''}</td>
                  <td><b>${d.mins}m</b></td>
                  <td>🧩 ${d.pzSolved}</td>
                  <td>${d.classical}C · ${d.rapid}R · ${d.blitz}B</td>
                  <td>🎓 ${d.quizzes} · ♚ ${d.egMates}</td>
                  <td><b style="color:#38bdf8">+${d.dayPct}%</b></td>
                  <td><b class="${d.netStars >= 0 ? 'plus' : 'minus'}">${d.netStars >= 0 ? '+' : ''}${d.netStars} ⭐</b></td>
                  <td>
                    <div class="row">
                      ${statusBadge}
                      <button class="btn small" data-act="excuse" data-id="${d.date}" title="Parent: Toggle Excused Day (Swim Meet / Sick)">${d.excused ? 'Unexcuse' : 'Excuse'}</button>
                    </div>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3>📈 4. Week-over-Week Progress History</h3>
        <div class="bounty-list">
          ${weekHistory.map((w, idx) => `
            <div class="bounty-row" data-act="pickweek" data-id="${w.monday}" style="cursor:pointer">
              <div>
                <b>${idx === 0 ? '🟢 Current Week' : 'Week of'} ${esc(w.monday)} → ${esc(w.sunday)}</b>
                <div class="muted small">${w.totMin} mins · ${w.totPz} puzzles · ${w.totClassical} Classical / ${w.totRapid} Rapid · ${w.totQuizzes} Theory Exams</div>
              </div>
              <div class="row">
                <span class="chip ${w.pct >= 100 ? 'ok' : w.pct >= 50 ? 'run' : 'bad'}"><b>${w.pct}%</b> of Goal</span>
                <span class="chip star">${w.totStars >= 0 ? '+' : ''}${w.totStars} ⭐</span>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <details class="card">
        <summary><b>📅 Open Full Monthly Activity Calendar View</b></summary>
        <div style="margin-top:10px">${renderCalendarCardInner()}</div>
      </details>`;
    loadLichess();
  }

  /* ==================== TAB 2: 🌐 LICHESS (Live Stats, Star Breakdown, 🔬 Engine Analysis & Practice Arena) ==================== */
  function viewLichess(v) {
    const s = S(), u = s.settings.lichess || 'govindu', rt = s.profile.ratings.lichess;
    const L = UI.lichess;
    const usr = L.user;
    const streakScore = (usr && usr.perfs && usr.perfs.streak && usr.perfs.streak.score) || 0;
    const stormScore = (usr && usr.perfs && usr.perfs.storm && usr.perfs.storm.score) || 0;
    const diag = analyzeLichessGames(L.games || []);
    const liLedger = s.ledger.filter(e => ['lichess_puzzle', 'lichess_game', 'rep_win', 'puzzle', 'endgame'].includes(e.type)).slice(-15).reverse();

    const repWinPct = diag.repPlayed ? Math.round((diag.repWins / diag.repPlayed) * 100) : null;
    const nonRepWinPct = diag.nonRepPlayed ? Math.round((diag.nonRepWins / diag.nonRepPlayed) * 100) : null;

    v.innerHTML = `
      <div class="card hero">
        <div class="row between wrap">
          <div>
            <span class="chip ok">🌐 CONNECTED TO LICHESS.ORG/@/${esc(u.toUpperCase())}</span>
            <h2 style="margin:6px 0 2px">Lichess Command Center & Engine Analysis</h2>
            <p class="muted small" style="margin:0">Every game and puzzle Anish completes on Lichess is automatically read here and credited with <b>⭐ Stars</b> and <b>Weekly Goal %</b>!</p>
          </div>
          <div class="row wrap">
            <button class="primary" data-act="refreshli">🔄 Sync Lichess Now</button>
            <a class="btn" target="_blank" rel="noopener" href="https://lichess.org/@/${encodeURIComponent(u)}">Open Profile ↗</a>
          </div>
        </div>
        <div class="grid4" style="margin-top:12px">
          <div class="stat highlight">
            <small class="muted">🕰️ CLASSICAL (GOAL 1650)</small>
            <b>${rt.classical || 1255}</b>
            <span>+15 ⭐ played · +10 ⭐ win</span>
          </div>
          <div class="stat highlight">
            <small class="muted">⚡ RAPID (GOAL 1750)</small>
            <b>${rt.current || 1611}</b>
            <span>+8 ⭐ played · +7 ⭐ win</span>
          </div>
          <div class="stat highlight">
            <small class="muted">🔥 BLITZ (GOAL 1500)</small>
            <b>${rt.blitz || 1210}</b>
            <span>+3 ⭐ played · +3 ⭐ win</span>
          </div>
          <div class="stat highlight">
            <small class="muted">🧩 PUZZLES (GOAL 2000)</small>
            <b>${rt.puzzle || 1765}</b>
            <span>+2 ⭐/puzzle · Streak ${streakScore} · Storm ${stormScore}</span>
          </div>
        </div>
        <div class="row wrap" style="margin-top:12px">
          <a class="btn primary" target="_blank" rel="noopener" href="https://lichess.org/training">🧩 Train Lichess Rated Puzzles (+2 ⭐ each) ↗</a>
          <a class="btn primary" target="_blank" rel="noopener" href="https://lichess.org/training/endgame">♚ Train Lichess Endgame Puzzles ↗</a>
          <a class="btn" target="_blank" rel="noopener" href="https://lichess.org/streak">🔥 Puzzle Streak ↗</a>
          <a class="btn" target="_blank" rel="noopener" href="https://lichess.org/">♟️ Play 15+10 Classical or 10+0 Rapid ↗</a>
        </div>
      </div>

      <div class="card">
        <h3>🔬 Engine & Game Analysis — "Why Anish Wins vs. Why He Loses"</h3>
        <p class="muted small">Diagnostic across his last <b>${diag.total}</b> Lichess games (${diag.wins}W – ${diag.losses}L – ${diag.draws}D) using move clocks, opening ECO detection, and Stockfish evaluations.</p>

        <div class="rating-grid" style="margin:10px 0">
          <div class="rating-card" style="border-color:#14532d">
            <b>✅ Why He Wins (Winning Patterns)</b>
            <ul class="small" style="margin:8px 0 0;padding-left:18px">
              <li><b>Core Repertoire Advantage:</b> ${diag.repPlayed ? `Won <b>${diag.repWins}/${diag.repPlayed} (${repWinPct}%)</b> when playing Queen's Gambit, English, Caro-Kann, or Sicilian` : 'Play your Core Repertoire (QG, English, Caro-Kann, Sicilian) to track your repertoire win rate!'} ${nonRepWinPct != null ? `(vs <b>${nonRepWinPct}%</b> in random openings)` : ''}.</li>
              <li><b>Deliberate Calculation:</b> In wins, he takes 8–15s on critical middlegame turns and converts material leads cleanly into the endgame.</li>
              <li><b>Tactical Eye:</b> His <b>${rt.puzzle || 1765}</b> Lichess puzzle rating lets him spot forks and pins immediately when he pauses to scan CCT.</li>
            </ul>
          </div>

          <div class="rating-card" style="border-color:#7f1d1d">
            <b>⚠️ Why He Loses (Root-Cause Breakdown of ${diag.losses} Losses)</b>
            <ul class="small" style="margin:8px 0 0;padding-left:18px">
              <li><b>⚡ Fast Impulse Moves (&lt;3s in Middlegame):</b> <b>${diag.lossCauses.fastImpulse} losses</b> — moving in under 3 seconds with plenty of clock time left.</li>
              <li><b>🏛️ Early Opening Sidelines (≤16 moves):</b> <b>${diag.lossCauses.opening} losses</b> — straying from Core Repertoire into unfamiliar traps.</li>
              <li><b>⚔️ Middlegame Tactical Misses (Moves 17–32):</b> <b>${diag.lossCauses.middlegame} losses</b> — missing opponent's Checks/Captures/Threats.</li>
              <li><b>♚ Endgame / Late Conversion (Move 33+):</b> <b>${diag.lossCauses.endgame} losses</b> · <b>⏱️ Time Flags:</b> <b>${diag.lossCauses.timeTrouble} losses</b>.</li>
            </ul>
          </div>
        </div>

        <h4 style="margin:12px 0 6px">🕹️ Recent Lichess Games & Stockfish Audit</h4>
        <div class="muted small" style="margin-bottom:6px">Tip: After any game on Lichess, click <b>"Analysis Board → Request Computer Analysis"</b> on Lichess to earn an extra <b>+5 ⭐ Engine Review Bonus</b>!</div>
        ${diag.annotatedGames.length ? `<div class="table-wrap">
          <table class="goal-table">
            <thead>
              <tr><th>Date</th><th>Format</th><th>Color & Result</th><th>Opening Played</th><th>Diagnostic / Engine Note</th><th>Action</th></tr>
            </thead>
            <tbody>
              ${diag.annotatedGames.slice(0, 10).map(g => `
                <tr>
                  <td>${esc(g.date.slice(5))}</td>
                  <td><span class="chip small">${esc(g.speed.toUpperCase())}</span></td>
                  <td><b class="${g.res === 'Win' ? 'plus' : g.res === 'Loss' ? 'minus' : ''}">${g.side === 'w' ? '⚪' : '⚫'} ${g.res}</b> <small class="muted">vs ${esc(g.oppName)} (${g.oppRating})</small></td>
                  <td>${g.rep ? `<span class="chip small ok">🎯 ${esc(g.rep.label)}</span>` : `<span class="small muted">${esc(g.opName)}</span>`}</td>
                  <td class="small">${esc(g.reason)} ${g.myAnalysis && g.myAnalysis.accuracy ? `· <b>${g.myAnalysis.accuracy}% acc</b> (${g.myAnalysis.blunder || 0} blunders)` : ''}</td>
                  <td><a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/${g.id}/${g.side === 'w' ? 'white' : 'black'}#analysis">🔬 Analyze ↗</a></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>` : `<p class="muted small">Click <b>🔄 Sync Lichess Now</b> above to load recent games for <b>${esc(u)}</b>.</p>`}
      </div>

      <div class="card">
        <h3>🎯 Lichess Adaptive Training &amp; Stockfish Launchpad (All Play &amp; Testing on Lichess)</h3>
        <p class="muted small" style="margin:2px 0 12px">All puzzles, tactics, endgames, and games run directly on <b>Lichess.org</b> so Lichess's adaptive rating system and Stockfish engine test you dynamically. When finished, click <b>🔄 Sync Lichess Now</b> above to claim your stars!</p>

        <div class="rating-grid">
          <div class="rating-card">
            <b>🧩 1. Adaptive Rated Tactics (Scales to ${rt.puzzle || 1765}+)</b>
            <p class="muted small" style="margin:4px 0 8px">Earns <b>+2 ⭐ per solved puzzle</b> + <b>+10 ⭐ daily rating climb bonus</b> automatically.</p>
            <div class="row wrap">
              <a class="btn small primary" target="_blank" rel="noopener" href="https://lichess.org/training">🧩 Mixed Rated Puzzles ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/training/middlegame">⚔️ Middlegame Tactics ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/training/fork">🐴 Forks &amp; Double Attacks ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/training/pin">📌 Pins &amp; Skewers ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/training/discoveredAttack">💥 Discovered Attacks ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/streak">🔥 Puzzle Streak ↗</a>
            </div>
          </div>

          <div class="rating-card">
            <b>♚ 2. Adaptive Endgames &amp; Stockfish Conversion Drills</b>
            <p class="muted small" style="margin:4px 0 8px">Practice endgames against Lichess's adaptive database and live Stockfish engine.</p>
            <div class="row wrap">
              <a class="btn small primary" target="_blank" rel="noopener" href="https://lichess.org/training/endgame">♚ Rated Endgame Puzzles ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/training/rookEndgame">🏰 Rook Endgames ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/training/pawnEndgame">♟️ King &amp; Pawn Endgames ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/practice/checkmates/piece-checkmates-i/BJy6fEDf">👑 Stockfish K+Q / K+R Mates ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/practice/pawn-endgames/key-squares/XP6RVc2B">🗝️ Stockfish Key Squares ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/practice/rook-endgames/7th-rank-rook-pawn/5c42B5Xg">🌉 Lucena &amp; Philidor Drills ↗</a>
            </div>
          </div>

          <div class="rating-card">
            <b>🏛️ 3. Repertoire Opening Explorer &amp; Rated Games</b>
            <p class="muted small" style="margin:4px 0 8px">Drill your 4 Core Openings in Lichess Opening Explorer or play rated games for your 10-Win Level Gate!</p>
            <div class="row wrap">
              <a class="btn small primary" target="_blank" rel="noopener" href="https://lichess.org/">🕹️ Play Rated Game on Lichess ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/analysis/standard/rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR_b_KQkq_-_0_2#explorer">⚪ Queen's Gambit Explorer ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/analysis/standard/rnbqkbnr/pppp1ppp/8/4p3/2P5/2N5/PP1PPPPP/R1BQKBNR_b_KQkq_-_1_2#explorer">⚪ English 1.c4 Explorer ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/analysis/standard/rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR_w_KQkq_-_0_3?color=black#explorer">⚫ Caro-Kann Explorer ↗</a>
              <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/analysis/standard/rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R_b_KQkq_-_0_3?color=black#explorer">⚫ Sicilian Explorer ↗</a>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>⭐ Lichess Activity Star Log</h3>
        ${liLedger.length ? liLedger.map(e => `<div class="row between line small"><span>${esc(e.desc)} <small class="muted">(${e.date})</small></span><b class="plus">+${e.delta} ⭐</b></div>`).join('') : '<p class="muted small">Complete puzzles or games on Lichess and tap Sync!</p>'}
      </div>`;

    loadLichess();
  }

  /* ==================== TAB 3: 📚 THEORY ROADMAP (5 Packages & Lichess Graduation Checklists — Zero Local Boards) ==================== */
  function lessonCard(l) {
    const mastered = S().lessons.done[l.id];
    const badgeMap = {
      'White Core': '⚪ Deep White Core (QG / English)',
      'Black Core': '⚫ Deep Black Core (Caro-Kann / Sicilian)',
      'Basic Coverage': '🛡️ Basic Sideline Coverage',
      'Middlegame': '⚔️ Middlegame Strategy & Tactics',
      'Endgame': '♚ Endgame Technique',
    };
    return `<div class="lesson">
      <div class="row between wrap">
        <div>
          <span class="chip small">${badgeMap[l.cat] || l.cat}</span>
          <h4 style="margin:4px 0">${l.icon} ${esc(l.title)}</h4>
        </div>
        <span class="chip ${mastered ? 'ok' : 'run'}">${mastered ? `✅ Studied (${mastered})` : '📖 Roadmap Study & Lichess Practice'}</span>
      </div>
      <p class="muted small">${esc(l.why)}</p>
      <ul class="small">${l.ideas.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      <div class="drill small">🎯 <b>Lichess Practice Goal:</b> ${esc(l.drill)}</div>
      <div class="row wrap" style="margin-top:10px">
        <a class="btn primary" target="_blank" rel="noopener" href="${esc(l.lichessUrl || 'https://lichess.org/training')}">${esc(l.lichessLabel || '🌐 Practice on Lichess')} ↗</a>
        ${(l.videos || []).map(v => `<a class="btn small" target="_blank" rel="noopener" href="${v[1]}">▶ ${esc(v[0])} ↗</a>`).join('')}
        <button class="btn small ${mastered ? '' : 'primary'}" data-act="markstudied" data-id="${l.id}">
          ${mastered ? '🔄 Log Lichess Review (+10 ⭐ daily)' : '✅ Mark Studied & Practiced on Lichess (+15 ⭐)'}
        </button>
      </div>
    </div>`;
  }

  function viewLessons(v) {
    const s = S(), totalDone = Object.keys(s.lessons.done || {}).length;
    const whiteWins = s.repWins.filter(w => w.side === 'w');
    const blackWins = s.repWins.filter(w => w.side === 'b');

    v.innerHTML = `
      <div class="card hero">
        <div class="row between wrap">
          <div>
            <span class="chip star">🗺️ 5-PACKAGE TOURNAMENT REPERTOIRE ROADMAP</span>
            <h2 style="margin:6px 0 2px">Repertoire Roadmap &amp; Lichess Level Graduation</h2>
            <p class="muted small" style="margin:0">
              <b>⚪ White Core Offenses:</b> Queen's Gambit (<code>1.d4 d5 2.c4</code>) &amp; English Opening (<code>1.c4</code>)<br>
              <b>⚫ Black Core Defenses:</b> Caro-Kann Defense (<code>1.e4 c6</code>) &amp; Sicilian Defense (<code>1.e4 c5</code>)<br>
              Study each Roadmap Module, practice it directly on <b>Lichess</b>, and win <b>10 Repertoire Games (5 White + 5 Black across Classical, Rapid &amp; Blitz)</b> to unlock each Level's Mega Bonus!
            </p>
          </div>
          <div class="center">
            <div class="big">${totalDone} <small>/ ${LESSONS.length}</small></div>
            <div class="muted small">Roadmap Modules Studied</div>
            <button class="btn small primary" data-act="openrepwin" style="margin-top:6px">➕ Log OTB / Repertoire Win</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="row between wrap">
          <div>
            <b>⚔️ Repertoire Game Wins Tracker (Auto-Detected from Lichess + OTB Log)</b>
            <div class="muted small">White Wins (QG / English): <b>${whiteWins.length}</b> · Black Wins (Caro-Kann / Sicilian): <b>${blackWins.length}</b></div>
          </div>
          <div class="row wrap">
            <button class="primary small" data-act="refreshli">🔄 Sync Lichess Wins Now</button>
            <a class="btn small" target="_blank" rel="noopener" href="https://lichess.org/">🕹️ Play on Lichess ↗</a>
          </div>
        </div>
      </div>

      ${LEVELS.map(lv => {
        const chk = CQ.levelChecklist(lv.n);
        return `<div class="card" style="border-left:4px solid ${lv.color}">
          <div class="row between wrap">
            <div>
              <h3>${lv.icon} Package ${lv.n} — Level ${lv.n}: ${esc(lv.name)} <small class="muted">(${esc(lv.mc)})</small></h3>
              <div class="muted small">${esc(lv.band)}</div>
            </div>
            <div class="row wrap">
              <span class="chip ${chk.alreadyCleared ? 'ok' : chk.readyToClear ? 'star' : ''}">
                ${chk.alreadyCleared ? `🏆 Level ${lv.n} Cleared!` : `Checklist: ${chk.doneCount}/${chk.gates.length} Gates (${chk.pct}%)`}
              </span>
              ${!chk.alreadyCleared ? `<button class="primary" data-act="claimlvl" data-id="${lv.n}" ${chk.readyToClear ? '' : 'disabled'}>🏆 Unlock +${lv.clearBonus} ⭐ Mega Bonus</button>` : ''}
            </div>
          </div>

          <p class="muted small" style="margin:6px 0">${esc(lv.goal)}</p>

          <div class="bounty-list" style="margin:8px 0 12px">
            ${chk.gates.map(g => `
              <div class="bounty-row ${g.done ? 'done' : ''}" style="padding:7px 10px">
                <div class="row">
                  <span>${g.done ? '✅' : '⬜'}</span>
                  <span class="small"><b>${esc(g.label)}</b></span>
                </div>
                <span class="chip small ${g.done ? 'ok' : ''}">${g.done ? 'Complete' : 'Required'}</span>
              </div>`).join('')}
          </div>

          ${chk.mods.map(l => {
            const isDone = !!s.lessons.done[l.id];
            return `<details>
              <summary>
                <span>${isDone ? '✅' : l.icon} <b>[${esc(l.cat)}]</b> ${esc(l.title)}</span>
                <span class="chip small ${isDone ? 'ok' : ''}">${isDone ? 'Studied ✔' : 'Study on Lichess (+15 ⭐)'}</span>
              </summary>
              ${lessonCard(l)}
            </details>`;
          }).join('')}
        </div>`;
      }).join('')}

      <div class="card">
        <h3>🏛️ Saint Louis Chess Club GM Lectures &amp; Lichess Practice Links</h3>
        <div class="row wrap">${RECOMMENDED.map(r => `<a class="btn" target="_blank" rel="noopener" href="${r[1]}">${esc(r[0])} ↗</a>`).join('')}</div>
      </div>`;
  }

  function markLessonStudied(lesson) {
    if (!lesson) return;
    S().lessons.done[lesson.id] = CQ.dstr();
    const gotBounty = CQ.addStars(15, 'lesson_quiz', '📚 Studied & Practiced on Lichess: ' + lesson.title, 'quiz-' + lesson.id);
    const gotDaily = !gotBounty && CQ.addStars(10, 'lesson_quiz', '📚 Lichess Roadmap Review: ' + lesson.title, 'quiz-daily-' + lesson.id + '-' + CQ.dstr());
    const d = CQ.day();
    d.sec.p2 = Math.max(d.sec.p2, 600);
    CQ.evaluateWeeklyBonusesAndPenalties();
    CQ.commit();
    confetti(); sfx.win();
    toast(gotBounty ? `✅ Marked Studied on Lichess! +15 ⭐` : gotDaily ? `🔄 Logged Lichess Review! +10 ⭐` : `✅ Roadmap Module Updated!`);
    renderView();
  }

  /* ==================== TAB 4: 👤 PROFILE (5 Minecraft Ranks w/ All-Format Targets + Official Ratings) ==================== */
  function viewProfile(v) {
    const s = S(), prof = s.profile, lv = getLvlObj(s.level), perf = CQ.performanceRating(UI.lichess.user);
    const rt = prof.ratings;

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
              <span class="chip ok">${lv.icon} Level ${lv.n}/5: ${lv.name} (${lv.mc})</span>
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
        <span class="chip star">📡 TOURNAMENT BROADCAST METRIC</span>
        <h3 style="margin:6px 0 2px">Theoretical Playing Level ("Playing At" Rating)</h3>
        <div class="grid4" style="margin-top:10px">
          <div class="stat highlight">
            <small class="muted">PLAYING AT (OTB EST.)</small>
            <b style="font-size:26px;color:#fbbf24">~${perf.otbPlayingAt}</b>
            <span class="plus">${perf.deltaOtb >= 0 ? '+' : ''}${perf.deltaOtb} vs Official ${perf.officialOtb} NWSRS</span>
          </div>
          <div class="stat highlight">
            <small class="muted">PLAYING AT (LICHESS)</small>
            <b style="font-size:26px;color:#38bdf8">~${perf.lichessPlayingAt}</b>
            <span>${perf.perfTier.icon} ${perf.perfTier.name} Level</span>
          </div>
          <div class="stat">
            <small class="muted">TACTICAL ELO PERF</small>
            <b>~${perf.tacticalPerf}</b>
            <span>Lichess Pz ${perf.liPuzzle}</span>
          </div>
          <div class="stat">
            <small class="muted">FIRST-TRY ACCURACY</small>
            <b>${perf.firstAcc}%</b>
            <span>${perf.impulseRate}% fast-wrong</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>⛏️ 5 Minecraft Mastery Ranks — Multi-Format Rating Benchmarks</h3>
        <p class="muted small">Each tier tracks target ratings across <b>OTB</b>, <b>Classical</b>, <b>Rapid</b>, <b>Blitz</b>, and <b>Puzzles</b>, plus its Theory Package &amp; Mega Bonus.</p>
        <div class="table-wrap">
          <table class="goal-table">
            <thead>
              <tr>
                <th>Rank / Tier</th>
                <th>OTB Target</th>
                <th>Classical</th>
                <th>Rapid</th>
                <th>Blitz</th>
                <th>Puzzles</th>
                <th>Clear Bonus</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(window.LEVELS || []).map(l => {
                const t = l.targets || {};
                const unlocked = s.level >= l.n;
                const current = s.level === l.n;
                const cleared = !!s.levelCleared[l.n];
                return `<tr class="${current ? 'today-row' : ''}">
                  <td><b>${l.icon} L${l.n}: ${esc(l.name)}</b><div class="muted small">${esc(l.mc)}</div></td>
                  <td><b>${t.otb}</b> <small class="muted">(Now ${rt.nwsrs.current})</small></td>
                  <td><b>${t.classical}</b> <small class="muted">(Now ${rt.lichess.classical})</small></td>
                  <td><b>${t.rapid}</b> <small class="muted">(Now ${rt.lichess.current})</small></td>
                  <td><b>${t.blitz}</b> <small class="muted">(Now ${rt.lichess.blitz})</small></td>
                  <td><b>${t.puzzle}</b> <small class="muted">(Now ${rt.lichess.puzzle})</small></td>
                  <td><b class="star">+${l.clearBonus} ⭐</b></td>
                  <td><span class="chip small ${cleared ? 'ok' : current ? 'run' : ''}">${cleared ? '🏆 Cleared' : current ? '⚡ Current' : unlocked ? 'Unlocked' : '🔒 Locked'}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="row between wrap">
          <h3>🌍 Official &amp; Online Ratings History</h3>
          <button class="primary small" data-act="openlograting">➕ Log Rating / Tournament (+25 ⭐)</button>
        </div>
        <div class="rating-grid">
          <div class="rating-card">
            <div class="row between"><b>🌲 NWChess (NWSRS)</b>${deltaBadge(rt.nwsrs.history)}</div>
            <div class="big" style="margin:6px 0">${rt.nwsrs.current} <small>Peak ${rt.nwsrs.peak} · Goal 1000</small></div>
            <div class="hist-list">${(rt.nwsrs.history || []).slice(-4).reverse().map(h => `<div class="row between small"><span>${esc(h.date)}: ${esc(h.event)}</span><b>${h.r}</b></div>`).join('')}</div>
            <a class="btn small" target="_blank" rel="noopener" href="${esc(rt.nwsrs.url)}" style="margin-top:8px">NWChess Lookup ↗</a>
          </div>
          <div class="rating-card">
            <div class="row between"><b>🇺🇸 US Chess (USCF)</b>${deltaBadge(rt.uscf.history)}</div>
            <div class="big" style="margin:6px 0">${rt.uscf.current} <small>Reg · ${rt.uscf.quick} Quick · ${rt.uscf.blitz || 425} Blitz</small></div>
            <div class="hist-list">${(rt.uscf.history || []).slice(-4).reverse().map(h => `<div class="row between small"><span>${esc(h.date)}: ${esc(h.event)}</span><b>${h.r}</b></div>`).join('')}</div>
            <a class="btn small" target="_blank" rel="noopener" href="${esc(rt.uscf.url)}" style="margin-top:8px">USCF Profile ↗</a>
          </div>
          <div class="rating-card">
            <div class="row between"><b>🌐 Lichess (${esc(rt.lichess.id)})</b><button class="btn small" data-act="refreshli">🔄 Sync</button></div>
            <div class="big" style="margin:6px 0">${rt.lichess.current} <small>Rapid · 🧩 ${rt.lichess.puzzle} Pz</small></div>
            <div class="muted small">Classical ${rt.lichess.classical} · Blitz ${rt.lichess.blitz} · Bullet ${rt.lichess.bullet}</div>
            <div class="hist-list">${(rt.lichess.history || []).slice(-4).reverse().map(h => `<div class="row between small"><span>${esc(h.date)}: ${esc(h.event)}</span><b>${h.r}</b></div>`).join('')}</div>
          </div>
          <div class="rating-card">
            <div class="row between"><b>🏛️ FIDE Standard</b><span class="chip">Goal: ${rt.fide.target}</span></div>
            <div class="big" style="margin:6px 0">${rt.fide.current || 'Unrated'}</div>
            <a class="btn small" target="_blank" rel="noopener" href="${esc(rt.fide.url)}" style="margin-top:8px">FIDE Portal ↗</a>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>🏆 Tournament History &amp; Upcoming Events</h3>
        ${(prof.tournaments || []).map(t => {
          const hasDelta = t.before != null && t.after != null;
          const diff = hasDelta ? (t.after - t.before) : null;
          return `<div class="line row between wrap">
            <div>
              <b>${esc(t.name)}</b> <span class="chip small">${esc(t.score)}</span>
              <div class="muted small">${esc(t.date)} · ${esc(t.section)} · ${esc(t.sys)} ${t.notes ? '— ' + esc(t.notes) : ''}</div>
            </div>
            <div>${hasDelta ? `<span class="chip ${diff >= 0 ? 'ok' : 'bad'}">${t.before} → <b>${t.after}</b> (${diff >= 0 ? '+' + diff : diff})</span>` : `<span class="chip run">📅 Upcoming</span>`}</div>
          </div>`;
        }).join('')}
      </div>`;
    loadLichess();
  }

  /* ==================== TAB 5: 🎁 REWARDS (Simplified Parent-Redeemed Vault) ==================== */
  function viewVault(v) {
    const s = S(), bal = CQ.balance(), life = CQ.lifetime(), spent = CQ.totalRedeemed();
    v.innerHTML = `
      <div class="card hero">
        <div class="row between wrap">
          <div>
            <small class="muted">ANISH'S OVERALL CREDIT BALANCE</small>
            <div class="big" style="color:#fbbf24">⭐ ${bal} <small>credits available</small></div>
            <div class="muted small">Lifetime Earned: <b>${life} ⭐</b> · Total Redeemed: <b>${spent} ⭐</b></div>
          </div>
          <div>
            <button class="primary" data-act="openparentredeem" style="font-size:16px;padding:12px 18px">🔒 Redeem Credits (Parent Only)</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="row between wrap">
          <div>
            <h3>📋 Reference Rewards Menu</h3>
            <p class="muted small" style="margin:2px 0 0">Curated by parents in Settings → Parent Zone. Ask Mom or Dad when you have enough credits to redeem!</p>
          </div>
          <button class="btn small" data-tab="settings">⚙️ Edit in Parent Zone</button>
        </div>
        <div class="table-wrap" style="margin-top:8px">
          <table class="goal-table">
            <thead>
              <tr><th>Reward</th><th style="width:140px;text-align:right">Points (⭐)</th></tr>
            </thead>
            <tbody>
              ${s.rewards.map(r => `
                <tr>
                  <td><b>${r.icon || '🎁'} ${esc(r.name)}</b></td>
                  <td style="text-align:right"><b class="star">⭐ ${r.cost}</b></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3>🎁 Redemption History</h3>
        ${s.redemptions.length ? s.redemptions.slice().reverse().map(r => `
          <div class="row between line">
            <div>
              <b>🎁 ${esc(r.name)}</b>
              <div class="muted small">Date: ${esc(r.date)}</div>
            </div>
            <b class="minus">-⭐ ${r.cost}</b>
          </div>`).join('') : '<p class="muted small">No rewards redeemed yet.</p>'}
      </div>

      <div class="card">
        <h3>📒 Credits History</h3>
        <div style="max-height:380px;overflow-y:auto">
          ${s.ledger.slice().reverse().map(e => `
            <div class="row between line small">
              <span>${esc(e.desc)} <small class="muted">(${esc(e.date)})</small></span>
              <b class="${e.delta >= 0 ? 'plus' : 'minus'}">${e.delta >= 0 ? '+' : ''}${e.delta} ⭐</b>
            </div>`).join('') || '<p class="muted small">No credits logged yet.</p>'}
        </div>
      </div>`;
  }

  function openParentRedeemModal() {
    const s = S(), bal = CQ.balance();
    const m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = `<div class="card modal-card">
      <h3>🔒 Parent Credit Redemption</h3>
      <p class="muted small">Available Balance: <b class="star">⭐ ${bal}</b>. Enter the credits to redeem, the gift/reward given to Anish, and your 4-digit Parent PIN.</p>
      <div class="form">
        <label>Quick-Fill from Reference Menu (optional)
          <select id="pr-preset">
            <option value="">— Custom Gift / Reward —</option>
            ${s.rewards.map(r => `<option value="${r.cost}|${esc(r.name)}">${r.icon} ${esc(r.name)} (${r.cost} ⭐)</option>`).join('')}
          </select>
        </label>
        <label>Credits to Redeem (⭐)
          <input id="pr-cost" type="number" min="1" placeholder="e.g. 200">
        </label>
        <label>Gift / Reward Given
          <input id="pr-name" placeholder="e.g. $5 Minecoins / 30 min Minecraft">
        </label>
        <label>Secret 4-Digit Parent PIN
          <input id="pr-pin" type="password" inputmode="numeric" maxlength="8" placeholder="••••" autocomplete="off">
        </label>
      </div>
      <div class="row end" style="margin-top:14px">
        <button id="pr-cancel">Cancel</button>
        <button id="pr-submit" class="primary">✔ Confirm &amp; Redeem</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    $('#pr-preset', m).onchange = e => {
      if (!e.target.value) return;
      const [c, n] = e.target.value.split('|');
      $('#pr-cost', m).value = c;
      $('#pr-name', m).value = n;
    };
    $('#pr-cancel', m).onclick = () => m.remove();
    $('#pr-submit', m).onclick = () => {
      const cost = +($('#pr-cost', m).value || 0);
      const name = ($('#pr-name', m).value || '').trim();
      const pin = ($('#pr-pin', m).value || '').trim();
      const expectedPin = S().settings.pin || '2014';
      if (pin !== expectedPin) { sfx.bad(); return toast('❌ Incorrect 4-digit Parent PIN'); }
      if (cost <= 0 || !name) return toast('Please enter both credits and the gift/reward given');
      if (cost > CQ.balance()) return toast('Not enough credits in balance!');
      CQ.parentRedeem(cost, name);
      m.remove();
      confetti(); sfx.win();
      toast(`🎁 Redeemed ${cost} ⭐ for ${name}!`);
      renderView();
    };
  }

  /* ==================== TAB 6: ⚙️ SETTINGS (Parent Zone & Sync) ==================== */
  function viewSettings(v) {
    const s = S(), set = s.settings;
    v.innerHTML = `
      <div class="card"><h3>👤 Player</h3>
        <div class="form">
          <label>Name <input id="s-name" value="${esc(set.name)}"></label>
          <label>Lichess username (public) <input id="s-li" value="${esc(set.lichess)}" placeholder="govindu"></label>
        </div>
      </div>
      <div class="card"><h3>🔒 Parent Zone (4-Digit PIN Protected)</h3>
        <p class="muted small">Current 4-digit PIN is active (default: <code>2014</code>). Used to redeem credits in <b>🎁 Rewards</b> and edit reference rewards below.</p>
        <div class="form">
          <label>Change 4-Digit Parent PIN <input id="s-pin" type="password" inputmode="numeric" placeholder="•••• (type new 4-digit PIN to change)"></label>
        </div>
        <h4 style="margin-top:12px">📋 Reference Rewards Table (Reward &amp; Points)</h4>
        ${s.rewards.map((r, i) => `
          <div class="row line">
            <input class="ic" data-rw="${i}" data-f="icon" value="${esc(r.icon)}">
            <input data-rw="${i}" data-f="name" value="${esc(r.name)}" style="flex:1">
            <input type="number" class="cost" data-rw="${i}" data-f="cost" value="${r.cost}">
            <button data-act="delrw" data-id="${i}">✕</button>
          </div>`).join('')}
        <div class="row wrap" style="margin-top:8px">
          <button data-act="addrw">+ Add Reference Reward</button>
          <button data-act="bonus">± Give Bonus / Penalty Credits</button>
          <button data-act="level">Set Level (1–5)</button>
        </div>
        <div class="form" style="margin-top:10px">
          <label>Current OTB Rating (NWSRS) <input id="s-rating" type="number" value="${set.rating}"></label>
          <label>Goal OTB Rating <input id="s-target" type="number" value="${set.ratingTarget}"></label>
        </div>
      </div>
      <div class="card"><h3>☁️ Cloud Sync (Google Sheet)</h3>
        <div class="form"><label>Apps Script Web-App URL <input id="s-sync" value="${esc(set.syncUrl)}"></label></div>
        <div class="muted small">Status: <b>${CQ.sync.status}</b>${CQ.sync.last ? ' · last ' + CQ.sync.last.toLocaleTimeString() : ''}.</div>
        <div class="row wrap"><button data-act="syncnow">🔄 Sync now</button><button data-act="copylink">🔗 Copy setup link</button></div>
      </div>
      <div class="card"><h3>💾 Backup</h3>
        <div class="row wrap">
          <button data-act="export">Export JSON</button>
          <label class="btn">Import JSON<input id="s-imp" type="file" accept=".json" hidden></label>
        </div>
      </div>
      <div class="row center"><button class="primary" data-act="savesettings">💾 Save Settings (Requires PIN)</button></div>`;
    const f = $('#s-imp');
    if (f) f.onchange = async e => { try { CQ.importJSON(await e.target.files[0].text()); toast('Imported ✔'); renderView(); } catch { toast('Import failed'); } };
  }

  /* ---------- Collapsible Monthly Activity Calendar Helper ---------- */
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function renderCalendarCardInner() {
    const s = S(), today = CQ.dstr(), target = 30;
    const ym = UI.calYm || today.slice(0, 7);
    const [Y, M] = ym.split('-').map(Number);
    const firstDow = new Date(Y, M - 1, 1).getDay();
    const numDays = new Date(Y, M, 0).getDate();
    const cells = [];
    for (let b = 0; b < firstDow; b++) cells.push(`<div class="cal-cell empty"></div>`);
    for (let dayNum = 1; dayNum <= numDays; dayNum++) {
      const k = `${Y}-${String(M).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const d = s.days[k];
      const mins = CQ.minutesOf(d);
      const pz = ((d && d.pz && d.pz.solved) || 0) + ((d && d.li && d.li.pzWins) || 0);
      const dayLedger = s.ledger.filter(e => e.date === k && e.delta > 0);
      const stars = dayLedger.reduce((a, e) => a + e.delta, 0);
      const isFuture = k > today;
      let cls = 'cal-future', badge = '';
      if (!isFuture) {
        if (s.excusedDays[k]) { cls = 'cal-part'; badge = 'EXCUSED'; }
        else if (mins >= target) { cls = 'cal-max'; badge = 'MAX'; }
        else if (mins > 0 || pz > 0 || stars > 0) { cls = 'cal-part'; badge = 'ACTIVE'; }
        else { cls = 'cal-zero'; badge = '0 MIN'; }
      }
      cells.push(`
        <div class="cal-cell ${cls}" data-act="calday" data-id="${k}">
          <div class="cal-hd"><b>${dayNum}</b>${badge ? `<span class="cal-tag">${badge}</span>` : ''}</div>
          ${isFuture ? `<div class="cal-body muted">—</div>` : `<div class="cal-body"><div>⏱ <b>${mins}m</b></div><div>🧩 ${pz} · <span class="star">+${stars}⭐</span></div></div>`}
        </div>`);
    }
    return `
      <div class="row between wrap" style="margin-bottom:8px">
        <b>${MONTHS[M - 1]} ${Y}</b>
        <div class="row"><button class="btn small" data-act="calprev">◀ Prev</button><button class="btn small" data-act="calnext">Next ▶</button></div>
      </div>
      <div class="cal-dow"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
      <div class="cal-grid">${cells.join('')}</div>`;
  }

  /* ---------- Modals: Avatar Switcher, Rating Logger, Repertoire Win Logger ---------- */
  function openAvatarSwitcher() {
    const cur = S().profile.avatar || 'assets/anish-jacket.jpg';
    const m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = `<div class="card modal-card">
      <h3>🖼️ Choose Anish's Portrait</h3>
      <div class="avatar-grid">
        ${AVATARS.map(([src, label]) => `
          <div class="av-choice ${cur === src ? 'on' : ''}" data-src="${src}">
            <img src="${src}" alt="${esc(label)}"><small>${esc(label)}</small>
          </div>`).join('')}
      </div>
      <div class="row end" style="margin-top:12px"><button id="av-close" class="primary">Done</button></div>
    </div>`;
    document.body.appendChild(m);
    m.querySelectorAll('.av-choice').forEach(el => {
      el.onclick = () => { S().profile.avatar = el.dataset.src; CQ.commit(); m.remove(); renderView(); toast('Portrait updated ✔'); };
    });
    $('#av-close', m).onclick = () => m.remove();
  }

  function openRatingLogger() {
    const m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = `<div class="card modal-card">
      <h3>➕ Log OTB / Online Rating Update (+25 ⭐)</h3>
      <div class="form">
        <label>Rating System
          <select id="rl-sys">
            <option value="uscf|reg">🇺🇸 USCF Regular (OTB)</option>
            <option value="uscf|quick">⚡ USCF Quick (OTB)</option>
            <option value="uscf|blitz">🔥 USCF Blitz (OTB)</option>
            <option value="nwsrs|reg">🌲 NWChess NWSRS (OTB)</option>
            <option value="fide|reg">🏛️ FIDE Standard</option>
          </select>
        </label>
        <label>New Rating <input id="rl-r" type="number" placeholder="e.g. 725"></label>
        <label>Tournament / Event Name <input id="rl-ev" placeholder="e.g. Thanksgiving Scholastic"></label>
        <label>Score (optional) <input id="rl-sc" placeholder="e.g. 3.5 / 5"></label>
        <label>Date <input id="rl-dt" type="date" value="${CQ.dstr()}"></label>
        <label>Key Takeaway / Notes <input id="rl-nt" placeholder="e.g. Won 2 games with Caro-Kann!"></label>
      </div>
      <div class="row end" style="margin-top:12px"><button id="rl-cancel">Cancel</button><button id="rl-save" class="primary">Save Rating (+25 ⭐)</button></div>
    </div>`;
    document.body.appendChild(m);
    $('#rl-cancel', m).onclick = () => m.remove();
    $('#rl-save', m).onclick = () => {
      const [sys, format] = $('#rl-sys', m).value.split('|');
      const ok = CQ.logRatingUpdate({
        sys, format,
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

  function openRepertoireWinLogger() {
    const m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = `<div class="card modal-card">
      <h3>⚔️ Log Repertoire Game Win</h3>
      <p class="muted small">Lichess wins in your Core Repertoire are detected automatically. Use this to log OTB tournament wins or extra repertoire wins toward your 10-Win Level Gate!</p>
      <div class="form">
        <label>Core Repertoire Opening Used
          <select id="rw-rep">
            <option value="w|qg">⚪ White: Queen's Gambit (1.d4 d5 2.c4)</option>
            <option value="w|eng">⚪ White: English Opening (1.c4)</option>
            <option value="b|ck">⚫ Black: Caro-Kann Defense (1.e4 c6)</option>
            <option value="b|sic">⚫ Black: Sicilian Defense (1.e4 c5)</option>
          </select>
        </label>
        <label>Format / Time Control
          <select id="rw-spd">
            <option value="classical">🕰️ Classical (15+10 or OTB Tournament)</option>
            <option value="rapid" selected>⚡ Rapid (10+0 / 10+5)</option>
            <option value="blitz">🔥 Blitz (3+2 / 5+0)</option>
          </select>
        </label>
        <label>Opponent / Event <input id="rw-opp" placeholder="e.g. Lichess / WATA Round 2"></label>
      </div>
      <div class="row end" style="margin-top:12px"><button id="rw-cancel">Cancel</button><button id="rw-save" class="primary">Log Repertoire Win</button></div>
    </div>`;
    document.body.appendChild(m);
    $('#rw-cancel', m).onclick = () => m.remove();
    $('#rw-save', m).onclick = () => {
      const [side, rep] = $('#rw-rep', m).value.split('|');
      CQ.logManualRepertoireWin({
        side, rep,
        speed: $('#rw-spd', m).value,
        opp: $('#rw-opp', m).value.trim() || 'Opponent',
      });
      m.remove(); confetti(); sfx.win(); toast('Repertoire Win credited ✔'); renderView();
    };
  }

  /* ---------- Actions Dispatcher ---------- */
  async function act(a, id) {
    const s = S();
    switch (a) {
      case 'wkprev': {
        const cur = UI.weekMon || CQ.weekStart();
        UI.weekMon = CQ.addDays(cur, -7);
        return renderView();
      }
      case 'wknext': {
        const cur = UI.weekMon || CQ.weekStart();
        const nxt = CQ.addDays(cur, 7);
        UI.weekMon = nxt >= CQ.weekStart() ? null : nxt;
        return renderView();
      }
      case 'wktoday': UI.weekMon = null; return renderView();
      case 'pickweek': UI.weekMon = id === CQ.weekStart() ? null : id; return renderView();
      case 'excuse': {
        if (!await askPin('Toggle Excused Day (Swim Meet / Travel)')) return;
        CQ.toggleExcusedDay(id);
        toast('Updated Excused Day status ✔');
        return renderView();
      }
      case 'markstudied': {
        const l = LESSONS.find(x => x.id === id) || LESSONS[0];
        return markLessonStudied(l);
      }
      case 'claimlvl': {
        const bonus = CQ.claimLevelClear(+id);
        if (bonus) {
          confetti(); sfx.win();
          await modal(`<h2>🏆 LEVEL ${id} GRADUATION COMPLETE!</h2><p>You unlocked the <b class="star">+${bonus} ⭐ Mega Bonus!</b></p>`);
          renderView();
        }
        return;
      }
      case 'openrepwin': return openRepertoireWinLogger();
      case 'switchavatar': return openAvatarSwitcher();
      case 'openlograting': return openRatingLogger();
      case 'openparentredeem': return openParentRedeemModal();
      case 'calprev': case 'calnext': {
        const cur = UI.calYm || CQ.dstr().slice(0, 7);
        const [y, m] = cur.split('-').map(Number);
        const dt = new Date(y, m - 1 + (a === 'calnext' ? 1 : -1), 1);
        UI.calYm = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0');
        return renderView();
      }
      case 'refreshli': await loadLichess(true); toast('Lichess activity & stars synced ✔'); return renderView();
      case 'delrw': if (!await askPin('Edit reference rewards')) return; s.rewards.splice(+id, 1); CQ.commit(); return renderView();
      case 'addrw': if (!await askPin('Edit reference rewards')) return; s.rewards.push({ id: 'r' + CQ.uid(), icon: '🎁', name: 'New reward', cost: 100 }); CQ.commit(); return renderView();
      case 'bonus': {
        if (!await askPin('Adjust credits')) return;
        const n = parseInt(prompt('Credits to add (negative for penalty):', '25'), 10);
        if (n) { CQ.addStars(n, n > 0 ? 'bonus' : 'penalty', (n > 0 ? 'Parent bonus: ' : 'Parent penalty: ') + (prompt('Reason?', 'Parent adjustment') || 'adjustment')); CQ.commit(); renderView(); }
        return;
      }
      case 'level': {
        if (!await askPin('Set Level (1-5)')) return;
        const n = parseInt(prompt('Set Level (1–5):', s.level), 10);
        if (n >= 1 && n <= 5) { CQ.setLevel(n); renderView(); }
        return;
      }
      case 'savesettings': {
        if (!await askPin('Save Parent Zone & Settings')) return;
        const set = s.settings;
        set.name = $('#s-name').value.trim() || 'Anish';
        set.lichess = $('#s-li').value.trim() || 'govindu';
        if ($('#s-pin').value.trim()) set.pin = $('#s-pin').value.trim();
        set.rating = +$('#s-rating').value || set.rating;
        s.profile.ratings.nwsrs.current = set.rating;
        set.ratingTarget = +$('#s-target').value || 1000;
        set.syncUrl = $('#s-sync').value.trim() || set.syncUrl;
        document.querySelectorAll('[data-rw]').forEach(i => {
          const r = s.rewards[+i.dataset.rw];
          if (r) r[i.dataset.f] = i.dataset.f === 'cost' ? (+i.value || 0) : i.value;
        });
        CQ.commit(); toast('Settings saved ✔');
        if (set.syncUrl) CQ.cloudPull().then(CQ.cloudPush);
        return renderView();
      }
      case 'syncnow': await CQ.cloudPull(); await CQ.cloudPush(); toast('Cloud synced ✔'); return renderView();
      case 'copylink': {
        const l = CQ.makeSetupLink();
        try { await navigator.clipboard.writeText(l); toast('Setup link copied ✔'); } catch { prompt('Copy this link:', l); }
        return;
      }
      case 'export': {
        const b = new Blob([CQ.exportJSON()], { type: 'application/json' }), a2 = document.createElement('a');
        a2.href = URL.createObjectURL(b); a2.download = 'chess-quest-backup-' + CQ.dstr() + '.json'; a2.click();
        return;
      }
    }
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-act]');
    if (t && !t.closest('.board')) { e.stopPropagation(); act(t.dataset.act, t.dataset.id, t); return; }
    const n = e.target.closest('[data-tab]');
    if (n) go(n.dataset.tab);
  });

  function boot() {
    CQ.load(); CQ.applySetupHash();
    CQ.evaluateWeeklyBonusesAndPenalties();
    CQ.on(updateHeader);
    const qt = new URLSearchParams(location.search).get('tab');
    if (qt && TABS.some(t => t[0] === qt)) go(qt);
    else { renderNav(); renderView(); }
    setInterval(() => { CQ.tick(); }, 1000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) CQ.cloudPull().then(() => { loadLichess(); updateHeader(); });
      else CQ.cloudPush();
    });
    window.addEventListener('pagehide', () => CQ.save(false));
    if (S().settings.syncUrl) CQ.cloudPull().then(() => renderView());
    loadLichess();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  window.addEventListener('DOMContentLoaded', boot);
})();
