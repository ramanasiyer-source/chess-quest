/* Chess Quest - tap-to-move chessboard (uses chess.js for rules). */
(function () {
  const FILES = 'abcdefgh';
  class Board {
    constructor(el, opts = {}) {
      this.el = el; this.opts = opts; this.chess = new Chess(); this.orient = 'w';
      this.sel = null; this.last = null; this.locked = false; this.hint = null;
      el.classList.add('board');
      el.addEventListener('click', e => { const sq = e.target.closest('[data-sq]'); if (sq) this.click(sq.dataset.sq); });
    }
    set(fen, orient, last) { this.chess = new Chess(fen); this.orient = orient || this.chess.turn(); this.last = last || null; this.sel = null; this.hint = null; this.render(); }
    click(sq) {
      if (this.locked) return;
      const p = this.chess.get(sq);
      if (this.sel) {
        if (this.sel === sq) { this.sel = null; return this.render(); }
        const legal = this.chess.moves({ square: this.sel, verbose: true }).find(m => m.to === sq);
        if (legal) { const from = this.sel; this.sel = null; return this.opts.onMove && this.opts.onMove(from, sq); }
      }
      this.sel = (p && p.color === this.chess.turn()) ? sq : null; this.render();
    }
    // Apply a move (uci or {from,to,promotion}); returns the chess.js move or null.
    play(from, to, promo) {
      const m = this.chess.move({ from, to, promotion: promo || 'q' });
      if (m) { this.last = [from, to]; this.sel = null; this.hint = null; this.render(); }
      return m;
    }
    undo() { const m = this.chess.undo(); this.last = null; this.sel = null; this.render(); return m; }
    showHint(sq) { this.hint = sq; this.render(); }
    render() {
      const ch = this.chess, flip = this.orient === 'b';
      const legalTo = new Set(this.sel ? ch.moves({ square: this.sel, verbose: true }).map(m => m.to) : []);
      let kingInCheck = null;
      if (ch.in_check()) { const t = ch.turn(); for (const f of FILES) for (let r = 1; r <= 8; r++) { const p = ch.get(f + r); if (p && p.type === 'k' && p.color === t) kingInCheck = f + r; } }
      let h = '';
      for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
        const file = flip ? 7 - j : j, rank = flip ? i + 1 : 8 - i, sq = FILES[file] + rank;
        const p = ch.get(sq), light = (file + rank) % 2 === 1;
        const cls = ['sq', light ? 'light' : 'dark'];
        if (this.sel === sq) cls.push('sel'); if (this.last && (this.last[0] === sq || this.last[1] === sq)) cls.push('last');
        if (legalTo.has(sq)) cls.push(p ? 'cap' : 'dot'); if (kingInCheck === sq) cls.push('check'); if (this.hint === sq) cls.push('hint');
        h += `<div class="${cls.join(' ')}" data-sq="${sq}">`
          + (p ? `<img draggable="false" alt="" src="assets/pieces/${p.color}${p.type.toUpperCase()}.svg">` : '')
          + (j === 0 ? `<i class="rk">${rank}</i>` : '') + (i === 7 ? `<i class="fl">${FILES[file]}</i>` : '') + '</div>';
      }
      this.el.innerHTML = h;
    }
  }
  window.Board = Board;
})();
