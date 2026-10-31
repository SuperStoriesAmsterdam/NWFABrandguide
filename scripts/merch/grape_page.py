import os,random
os.chdir('/Users/petervanrhoon/Desktop/Builds/BrandguideNWFA/merch')
BP='/Users/petervanrhoon/Desktop/Builds/BrandguideNWFA/scripts/merch/build.py'
exec(open(BP).read().split("# ---------- 3. garments")[0])
def ministeck_photo(C,pal,seed=11):
    rng=random.Random(seed); sh=[];hi=[];top=[]
    for v in ('r','y','g','n'):
        cells={c for c,k in C.items() if k==v}
        for p in tile(cells,rng):
            col=shade(pal[v],rng.uniform(-.04,.04)); R=piece_rects(p,.06)
            f=lambda dx,dy,dw,c:''.join(f'<rect x="{x+dx:.3f}" y="{y+dy:.3f}" width="{max(w-dw,.05):.3f}" height="{max(h-dw,.05):.3f}"/>' for x,y,w,h in R)
            sh.append(f'<g fill="{shade(col,-.45)}">{f(.07,.09,0,0)}</g>')
            hi.append(f'<g fill="{shade(col,.28)}">{f(0,0,0,0)}</g>')
            top.append(f'<g fill="{col}">{f(.07,.07,.09,0)}</g>')
    return ''.join(sh)+''.join(hi)+''.join(top)
C,W,H=badge_cells(66)
pal={'y':'#e8b53f','n':'#1f2f5c','g':'#1c9055','r':'#1f2f5c'}
body=ministeck_photo(C,pal)
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 {W+2} {H+2}">{body}</svg>'
open('grape-ministeck-disc.svg','w').write(svg)
html=f'''<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>NWFA druiventros · twee versies</title>
<style>body{{margin:0;background:#ECE6D6;color:#1B3326;font:16px/1.45 system-ui,sans-serif;padding:32px 24px}}h1{{font-size:34px;letter-spacing:-.03em;margin:0 0 20px}}
.g{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:20px;max-width:1300px}}figure{{margin:0;background:#131f4a;border-radius:6px;overflow:hidden}}
figure svg,figure img{{width:100%;display:block;aspect-ratio:1}}figcaption{{background:#f6f1e3;padding:12px 16px;font-size:14px}}b{{display:block;font-size:16px}}</style></head><body>
<h1>druiventros in twee versies</h1><div class="g">
<figure><svg viewBox="-1 -1 {W+2} {H+2}">{body}</svg><figcaption><b>ministeck</b>Losse stukjes van 1 tot 4 vakjes, mat, met lichte rand linksboven en schaduw rechtsonder. Kleuren naar de foto in Downloads. Geen gaatjesbord.</figcaption></figure>
<figure><img src="grape-poster.svg" alt=""><figcaption><b>kleine blokjes (poster)</b>De druiventros zoals nu in de poster staat: vierkante beads met gouden schijf en groene gloed op navy.</figcaption></figure></div>\n<script>window.SS_ANNOTATIONS={{api:"https://annotations.superstories.com",project:"nwfa"}};</script>\n<script src="js/annotate.js" defer></script>\n</body></html>'''
open('grape.html','w').write(html)
print(len(html))
