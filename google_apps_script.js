/**
 * Chess Quest - Google Apps Script backend (bound to the "Chess Quest - Training Log" sheet).
 *
 * What it does
 *  - GET  ?action=getState  -> returns the saved app state so any device can load the player's progress
 *  - POST {action:'saveState', state, today, ledger} -> saves state + keeps human-readable tabs:
 *        Daily_Summary (one row per day, easy for parents / the AI guardian to read)
 *        Stars_Ledger  (every star earned / spent)
 *        State         (machine data used for syncing - don't edit)
 *
 * Setup (3 minutes, once):
 *  1. Open the Google Sheet  >  Extensions  >  Apps Script.
 *  2. Delete the sample code, paste this whole file, click Save.
 *  3. Deploy  >  New deployment  >  type "Web app"
 *       Execute as: Me      Who has access: Anyone
 *     Authorize when asked (Advanced > Go to project > Allow), then copy the Web app URL (ends in /exec).
 *  4. Paste that URL into Chess Quest > Settings > Cloud sync (or use SETUP.md's one-tap setup link).
 */

const CHUNK = 45000;

function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }

function sheet_(name, headers) {
  let s = ss_().getSheetByName(name);
  if (!s) {
    // Reuse the default empty first tab for Daily_Summary so CSV export of the sheet shows daily data.
    const first = ss_().getSheets()[0];
    if (name === 'Daily_Summary' && first && first.getLastRow() === 0 && /^Sheet\d*$/.test(first.getName())) { first.setName(name); s = first; }
    else s = ss_().insertSheet(name);
    if (headers) { s.appendRow(headers); s.setFrozenRows(1); s.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#e2e8f0'); }
  }
  return s;
}

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet(e) {
  try {
    const s = sheet_('State', ['updatedAt / chunks...']);
    const vals = s.getRange(1, 1, Math.max(1, s.getLastRow()), 1).getValues().map(r => String(r[0]));
    if (vals.length < 2 || !vals[1]) return json_({ status: 'success', state: null, updatedAt: 0 });
    const updatedAt = Number(vals[1]) || 0;
    const body = vals.slice(2).join('');
    return json_({ status: 'success', updatedAt: updatedAt, state: body ? JSON.parse(body) : null });
  } catch (err) { return json_({ status: 'error', message: String(err) }); }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const p = JSON.parse(e.postData.contents);
    if (p.action !== 'saveState') return json_({ status: 'error', message: 'unknown action' });

    // 1) machine state (chunked because a single cell holds ~50k chars)
    const st = sheet_('State', ['updatedAt / chunks...']);
    const text = JSON.stringify(p.state);
    const rows = [['updatedAt / chunks...'], [String(p.updatedAt || Date.now())]];
    for (let i = 0; i < text.length; i += CHUNK) rows.push([text.slice(i, i + CHUNK)]);
    st.clear();
    st.getRange(1, 1, rows.length, 1).setNumberFormat('@').setValues(rows);

    // 2) one readable row per day (upsert)
    const t = p.today;
    if (t) {
      const ds = sheet_('Daily_Summary', ['Date', 'Minutes today', 'Phase 1 done', 'Phase 2 done', 'Phase 3 done', 'Quest complete', 'Puzzles tried', 'First-try', 'Stars earned today', 'Streak', 'Level', 'Star balance', 'Total minutes', 'Updated']);
      const last = ds.getLastRow();
      const dates = last > 1 ? ds.getRange(2, 1, last - 1, 1).getDisplayValues().map(r => r[0]) : [];
      const row = [t.date, t.minutes, t.p1, t.p2, t.p3, t.questComplete, t.puzzlesTried, t.puzzlesFirstTry, t.stars, t.streak, t.level, t.balance, t.totalMinutes, new Date()];
      const idx = dates.indexOf(t.date);
      ds.getRange(idx >= 0 ? idx + 2 : last + 1, 1, 1, row.length).setValues([row]);
    }

    // 3) star ledger (append only new ids)
    if (p.ledger && p.ledger.length) {
      const ls = sheet_('Stars_Ledger', ['Id', 'Time', 'Date', 'Type', 'Description', 'Stars', 'Balance after']);
      const last = ls.getLastRow();
      const have = new Set(last > 1 ? ls.getRange(2, 1, last - 1, 1).getValues().map(r => String(r[0])) : []);
      const add = p.ledger.filter(x => !have.has(String(x.id))).map(x => [x.id, new Date(x.ts), x.date, x.type, x.desc, x.delta, x.balance]);
      if (add.length) ls.getRange(ls.getLastRow() + 1, 1, add.length, 7).setValues(add);
    }
    return json_({ status: 'success' });
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  } finally { lock.releaseLock(); }
}
