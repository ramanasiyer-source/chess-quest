#!/usr/bin/env python3
"""Read Anish's live Chess Quest progress from Google Apps Script and mirror locally to state_mirror.json."""
import json
import os
import ssl
import urllib.request

SYNC_URL = "https://script.google.com/macros/s/AKfycbxnUdMtHZZ39F8t4hp2QO-wIyQc5E-3w9oXeqH00iXuN9DwdcpPlbpy6pCWBBe0s-ag/exec?action=getState"
MIRROR_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "state_mirror.json")

def main():
    req = urllib.request.Request(SYNC_URL, headers={"User-Agent": "AnishChessGuardian/1.0"})
    ctx = ssl._create_unverified_context()
    with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    with open(MIRROR_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    st = data.get("state")
    if not st:
        print("Connected to Google Sheet (no sessions logged yet).")
        return
    days = st.get("days", {})
    ledger = st.get("ledger", [])
    redemptions = st.get("redemptions", [])
    bal = sum(e.get("delta", 0) for e in ledger)
    lifetime = sum(e.get("delta", 0) for e in ledger if e.get("delta", 0) > 0)
    total_min = round(sum(
        d["sec"]["p1"] + d["sec"]["p2"] + d["sec"]["p3"] + d["sec"].get("free", 0)
        for d in days.values()
    ) / 60)
    print(f"Player: {st.get('settings', {}).get('name')} | Level: {st.get('level')} | Balance: {bal} ⭐ (Lifetime: {lifetime} ⭐) | Redemptions: {len(redemptions)} | Total Min: {total_min}")
    for r in redemptions:
        print(f"  Redemption: {r.get('date')} | {r.get('name')} (-{r.get('cost')} ⭐) | status={r.get('status')}")
    for k in sorted(days.keys())[-7:]:
        d = days[k]
        m = round((d["sec"]["p1"] + d["sec"]["p2"] + d["sec"]["p3"] + d["sec"].get("free", 0)) / 60)
        print(f"  {k}: {m} min | questComplete={d.get('questComplete')} | puzzles={d['pz']['tried']} ({d['pz']['first']} first-try) | stars={d.get('stars')}")

if __name__ == "__main__":
    main()
