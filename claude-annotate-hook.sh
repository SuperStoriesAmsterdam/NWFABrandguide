#!/usr/bin/env bash
# Claude Code UserPromptSubmit hook — `annotate` review tool.
# Pulls open @claude notes for the current project, prints them (Claude Code injects to context),
# then marks each captured note status=resolved via curl PUT (urllib was silently failing).
#
# Install (once, globally):
#   echo "https://annotations.superstories.com" > ~/.claude/annotate-endpoint
#   echo "<YOUR_API_KEY>"                       > ~/.claude/annotate-token
#   cp claude-annotate-hook.sh                   ~/.claude/claude-annotate-hook.sh
#   chmod +x ~/.claude/claude-annotate-hook.sh
#   # register the hook in ~/.claude/settings.json under hooks.UserPromptSubmit
#
# Per project: put a `.annotate-project` file at the repo root containing the project id (e.g. "nwfa").

ENDPOINT="$(cat "$HOME/.claude/annotate-endpoint" 2>/dev/null)"
KEY="$(cat "$HOME/.claude/annotate-token" 2>/dev/null)"
PROJECT="$(cat .annotate-project 2>/dev/null)"

[ -z "$ENDPOINT" ] && exit 0
[ -z "$KEY"      ] && exit 0
[ -z "$PROJECT"  ] && exit 0

DATA="$(curl -fsS -m 10 -H "X-Annotation-Key: $KEY" "$ENDPOINT/export?project=$PROJECT&target=claude" 2>/dev/null)" || exit 0
[ -z "$DATA" ] && exit 0

IDS_FILE="$(mktemp 2>/dev/null || echo "/tmp/annotate-ids.$$")"
trap 'rm -f "$IDS_FILE"' EXIT

# Parse the JSON and print the notes to stdout (Claude Code injects into next context).
# Capture IDs to IDS_FILE so the shell can PUT each one resolved afterwards.
ANNOT_DATA="$DATA" IDS_FILE="$IDS_FILE" python3 - <<'PY'
import json, os, sys
try:
    data = json.loads(os.environ.get("ANNOT_DATA",""))
except Exception:
    sys.exit(0)
count = data.get("count", 0)
if count == 0:
    sys.exit(0)
pages = data.get("pages", {})
proj  = data.get("project","?")
ids   = []
print(f"## Pending design-review notes (auto-pulled from annotate · {count} open · project={proj})")
print("Apply these — each will be marked `resolved` after this turn so they don't re-arrive.\n")
for page, items in pages.items():
    print(f"### {page}")
    for a in items:
        meta  = f"[{a.get('priority','medium')}] {a.get('block','general')} · by {a.get('name','anon')}"
        coord = f" @({a.get('x',0)},{a.get('y',0)})" if (a.get('x') or a.get('y')) else ""
        print(f"- #{a['id']} {meta}{coord}: {a['text']}")
        ids.append(str(a['id']))
    print()
open(os.environ["IDS_FILE"], "w").write("\n".join(ids) + "\n")
PY

# Mark each captured ID resolved via curl (proven to work; urllib was the previous bug).
[ -s "$IDS_FILE" ] || exit 0
while IFS= read -r id; do
    [ -n "$id" ] && curl -s -m 8 -o /dev/null \
        -X PUT \
        -H "X-Annotation-Key: $KEY" \
        -H "Content-Type: application/json" \
        -d '{"status":"resolved"}' \
        "$ENDPOINT/annotations/$id"
done < "$IDS_FILE"
