"""Download real Lichess puzzles (public API, no login) into /tmp/cq_raw/*.json.
Polite: ~1 request / 8s, backs off 70s on HTTP 429 (Lichess asks for a 1-minute wait).
Run: python3 tools/fetch_puzzles.py   then   node tools/build_puzzles.js
"""
import subprocess, json, time, os
ANGLES = ["mateIn1","mateIn2","fork","hangingPiece","pin","skewer","backRankMate",
          "discoveredAttack","trappedPiece","endgame","rookEndgame","pawnEndgame",
          "advantage","quietMove","sacrifice","attraction"]
DIFFS = ["easiest","easier","normal","harder"]
os.makedirs("/tmp/cq_raw", exist_ok=True)
def get(url):
    r = subprocess.run(["curl","-s","-m","30","-w","\n%{http_code}",url], capture_output=True, text=True)
    body, _, code = r.stdout.rpartition("\n")
    return code, body
n = 0
for a in ANGLES:
    for d in DIFFS:
        out = f"/tmp/cq_raw/{a}_{d}.json"
        if os.path.exists(out): continue
        url = f"https://lichess.org/api/puzzle/batch/{a}?nb=50&difficulty={d}"
        for attempt in range(4):
            code, body = get(url)
            if code == "200":
                try:
                    data = json.loads(body); json.dump(data, open(out,"w")); n += len(data.get("puzzles", []))
                except Exception: print("bad json", a, d)
                break
            print("HTTP", code, a, d, "-> backing off", flush=True); time.sleep(70)
        time.sleep(8)
    print(a, "done; puzzles so far", n, flush=True)
print("ALL DONE")
