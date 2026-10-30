#!/usr/bin/env python3
"""Delete every photo in the photo selector that was not selected.

Usage:
  python3 scripts/prune-photo-picker.py picks.txt            # dry run, lists what would go
  python3 scripts/prune-photo-picker.py picks.txt --apply    # deletes

picks.txt is the text the "Copy for Peter" button puts on the clipboard. A photo counts as
selected when it carries a star, or when it has a page other than "Not used". Everything
else in brandguide/photo-picker/img/ is deleted, and its line is removed from the images
list in brandguide/photo-picker/index.html. The files stay in git history until that
history is rewritten, so a deletion can be undone with git.

The script refuses to run when the text selects nothing, or when it names a photo that is
not in the list, so a truncated or wrong paste cannot empty the folder.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = ROOT / "brandguide/photo-picker/index.html"
IMG = ROOT / "brandguide/photo-picker/img"


def selected_names(text):
    sel = set()
    mode = "placed"
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("Starred, no page yet"):
            mode = "starred"
            continue
        if line.startswith("Not placed"):
            mode = "skip"
            continue
        if line.startswith("picks (paste into config)"):
            mode = "skip"
            continue
        if mode == "skip":
            continue
        star = line.startswith("★")
        line = line.lstrip("★").strip()
        if mode == "starred":
            sel.add(line)
            continue
        m = re.match(r"(\S+)\s+->\s+(.+?)(?:\s+\(position:.*\))?$", line)
        if not m:
            continue
        name, page = m.group(1), m.group(2).strip()
        if star or page != "Not used":
            sel.add(name)
    return sel


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    apply = "--apply" in sys.argv
    if len(args) != 1:
        sys.exit(__doc__)
    sel = selected_names(pathlib.Path(args[0]).read_text())
    s = PAGE.read_text()
    m = re.search(r"window\.SS_PHOTOS = (\{.*?\n\});", s, re.S)
    cfg = json.loads(m.group(1))
    names = {u.rsplit("/", 1)[-1]: u for u in cfg["images"]}
    unknown = sorted(n for n in sel if n not in names)
    if unknown:
        sys.exit("not in the photo list, nothing deleted: " + ", ".join(unknown))
    if not sel:
        sys.exit("the text selects no photo, nothing deleted")
    drop = [n for n in names if n not in sel]
    print(f"{len(sel)} selected, {len(drop)} not selected")
    for n in drop:
        print(("delete " if apply else "would delete ") + n)
    if not apply:
        print("dry run: add --apply to delete")
        return
    for n in drop:
        f = IMG / n
        if f.is_file() and f.parent == IMG:
            f.unlink()
    cfg["images"] = [u for u in cfg["images"] if u.rsplit("/", 1)[-1] in sel]
    PAGE.write_text(s[: m.start(1)] + json.dumps(cfg, indent=2, ensure_ascii=False) + s[m.end(1):])
    print("done: files deleted and the photo list updated")


main()
