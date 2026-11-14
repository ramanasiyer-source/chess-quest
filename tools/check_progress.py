#!/usr/bin/env python3
"""Read Anish's live Chess Quest progress from the Google Apps Script endpoint."""
import json
import ssl
import urllib.request

SYNC_URL = "https://script.google.com/macros/s/AKfycbxnUdMtHZZ39F8t4hp2QO-wIyQc5E-3w9oXeqH00iXuN9DwdcpPlbpy6pCWBBe0s-ag/exec?action=getState"

def main():
    req = urllib.request.Request(SYNC_URL, headers={"User-Agent": "AnishChessGuardian/1.0"})
    ctx = ssl._create_unverified_context()
    with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    st = data.get("state")
    if not st:
        print("Connected to Google Sheet (no sessions logged yet).")
        return
    days = st.get("days", {})
    ledger = st.get("ledger", [])
    bal = sum(e.get("delta", 0) for e in ledger)
    total_min = round(sum(
        d["sec"]["p1"] + d["sec"]["p2"] + d["sec"]["p3"] + d["sec"].get("free", 0)
        for d in days.values()
    ) / 60)
    print(f"Player: {st.get('settings', {}).get('name')} | Level: {st.get('level')} | Stars: {bal} | Total Min: {total_min}")
    for k in sorted(days.keys())[-7:]:
        d = days[k]
        m = round((d["sec"]["p1"] + d["sec"]["p2"] + d["sec"]["p3"] + d["sec"].get("free", 0)) / 60)
        print(f"  {k}: {m} min | questComplete={d.get('questComplete')} | puzzles={d['pz']['tried']} ({d['pz']['first']} first-try)")

if __name__ == "__main__":
    main()
