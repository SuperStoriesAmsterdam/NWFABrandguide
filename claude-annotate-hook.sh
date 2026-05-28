#!/usr/bin/env bash
# Claude Code UserPromptSubmit hook — `annotate` review tool.
# Pulls all open @claude notes for the current project (from annotations.superstories.com)
# and injects them into Claude's next context. Then marks each captured note status=resolved
# so the same note never re-arrives. Notes stay in the SQLite DB (auditable);
# reopen via PUT /annotations/<id> {"status":"open"} to make them flow again.
#
# Install (once, globally):
#   echo "https://annotations.superstories.com" > ~/.claude/annotate-endpoint
#   echo "<YOUR_API_KEY>"                       > ~/.claude/annotate-token
#   cp claude-annotate-hook.sh                   ~/.claude/claude-annotate-hook.sh
#   chmod +x ~/.claude/claude-annotate-hook.sh
#   # then register the hook in ~/.claude/settings.json under hooks.UserPromptSubmit
#
# Per project: put a `.annotate-project` file at the repo root containing the project id (e.g. "nwfa").

ENDPOINT="$(cat "$HOME/.claude/annotate-endpoint" 2>/dev/null)"
KEY="$(cat "$HOME/.claude/annotate-token" 2>/dev/null)"
PROJECT="$(cat .annotate-project 2>/dev/null)"

[ -z "$ENDPOINT" ] && exit 0
[ -z "$KEY"      ] && exit 0
[ -z "$PROJECT"  ] && exit 0

DATA="$(curl -fsS -H "X-Annotation-Key: $KEY" "$ENDPOINT/export?project=$PROJECT&target=claude" 2>/dev/null)" || exit 0
[ -z "$DATA" ] && exit 0

ANNOT_DATA="$DATA" ANNOT_EP="$ENDPOINT" ANNOT_KEY="$KEY" python3 - <<'PY' 2>/dev/null
import json, os, urllib.request
try:
    data = json.loads(os.environ.get("ANNOT_DATA", ""))
except Exception:
    raise SystemExit(0)
count = data.get("count", 0)
if count == 0:
    raise SystemExit(0)

pages = data.get("pages", {})
project = data.get("project", "?")
print(f"## Pending design-review notes (auto-pulled from annotate · {count} open · project={project})")
print("Apply these — each will be marked `resolved` after this turn so they don't re-arrive.\n")

ids = []
for page, items in pages.items():
    print(f"### {page}")
    for a in items:
        meta = f"[{a.get('priority','medium')}] {a.get('block','general')} · by {a.get('name','anon')}"
        coord = f" @({a.get('x',0)},{a.get('y',0)})" if (a.get('x') or a.get('y')) else ""
        print(f"- #{a['id']} {meta}{coord}: {a['text']}")
        ids.append(a['id'])
    print()

ep  = os.environ["ANNOT_EP"]
key = os.environ["ANNOT_KEY"]
for i in ids:
    req = urllib.request.Request(
        f"{ep}/annotations/{i}",
        method="PUT",
        headers={"X-Annotation-Key": key, "Content-Type": "application/json"},
        data=json.dumps({"status": "resolved"}).encode(),
    )
    try:
        urllib.request.urlopen(req, timeout=8).read()
    except Exception:
        pass
PY
