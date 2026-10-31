import random, math, base64, itertools, os
ROOT='/Users/petervanrhoon/Desktop/Builds/BrandguideNWFA'
INK='#1B3326'; CREAM='#F0EAD9'; AMBER='#eeba3f'; NAVY='#233260'; GREEN='#1c9055'; OCHRE='#9F6E29'

# ---------- 1. clean grape grid, rebuilt from the bead-grid structure of the umbrella mark ----------
def grape_cells():
    W,H,cx=40,50,20
    G={}   # (x,y)->colour code n/y/g
    core=set()
    # berries: 6w x 5h, pitch 9 horizontal, 6 vertical; rows of 3,4,3,2,1
    rows=[(14,[-9,0,9]),(20,[-13.5,-4.5,4.5,13.5]),(26,[-9,0,9]),(32,[-4.5,4.5]),(38,[0])]
    berries=[]
    for top,offs in rows:
        for o in offs:
            x0=int(round(cx+o-3))
            cells={(x0+i,top+j) for i in range(6) for j in range(5)}
            for c in [(x0,top),(x0+5,top),(x0,top+4),(x0+5,top+4)]: cells.discard(c)
            berries.append(cells); core|=cells
    # leaves
    leaf=set()
    for side in (-1,1):
        for c in range(6,18):
            bottom=7+round((c-6)*4/11)
            for r in range(3,bottom+1):
                x=c if side<0 else (2*cx-1-c)
                leaf.add((x,r))
        leaf.discard((6 if side<0 else 2*cx-1-6,3))
    core|=leaf
    # stem + tail
    stem={(x,y) for x in (cx-1,cx) for y in range(1,15)}|{(x,y) for x in (cx-1,cx) for y in range(41,46)}
    # small gold tendrils under the leaves
    tend={(x,y) for x in range(14,19) for y in (11,12)}|{(x,y) for x in range(2*cx-19,2*cx-14) for y in (11,12)}
    # navy = dilation by 2 of everything
    allc=core|stem|tend
    navy=set()
    for (x,y) in allc:
        for dx in range(-2,3):
            for dy in range(-2,3):
                navy.add((x+dx,y+dy))
    for c in navy: G[c]='n'
    for b in berries:
        for c in b: G[c]='y'
    for c in leaf: G[c]='g'
    for c in tend: G[c]='y'
    xs=[c[0] for c in G]; ys=[c[1] for c in G]
    x0,y0=min(xs),min(ys)
    return {(x-x0,y-y0):v for (x,y),v in G.items()}, max(xs)-x0+1, max(ys)-y0+1
GRAPE,GW,GH=grape_cells()

def badge_cells(D=66):
    C={}
    R=D/2
    for y in range(D):
        for x in range(D):
            d=math.hypot(x+.5-R,y+.5-R)
            if d<=R-1.2: C[(x,y)]='y'
            elif d<=R: C[(x,y)]='r'   # ring
    ox=(D-GW)//2; oy=(D-GH)//2+1
    for (x,y),v in GRAPE.items(): C[(x+ox,y+oy)]=v
    return C,D,D


def church_cells(N=64):
    from PIL import Image
    im=Image.open(ROOT+'/scripts/merch/church-1200.png').convert('RGBA')   # rendered from logos-/logo-church-tuned.svg
    P=im.size[0]/N; C={}
    cols={'n':(40,65,124),'y':(219,187,0),'g':(28,144,85)}
    for j in range(N):
        for i in range(N):
            r,g,b,a=im.getpixel((int((i+.5)*P),int((j+.5)*P)))
            if a<128: continue
            C[(i,j)]=min(cols,key=lambda k:sum((x-y)**2 for x,y in zip(cols[k],(r,g,b))))
    return C,N,N
CHURCH,CW,CH=church_cells()
CHURCH_B64=base64.b64encode(open(ROOT+'/logos-/logo-church-tuned.svg','rb').read()).decode()

# ---------- 2. renderers ----------
def shade(h,f):
    r,g,b=[int(h[i:i+2],16) for i in (1,3,5)]
    if f>=0: r,g,b=[round(c+(255-c)*f) for c in (r,g,b)]
    else: r,g,b=[round(c*(1+f)) for c in (r,g,b)]
    return '#%02x%02x%02x'%(r,g,b)

def render_bead(C,pal):
    out=[]
    for (x,y),v in sorted(C.items(),key=lambda k:(k[0][1],k[0][0])):
        col=pal[v]
        out.append(f'<rect x="{x+.06:.2f}" y="{y+.06:.2f}" width=".88" height=".88" rx=".16" fill="{col}"/>'
                   f'<rect x="{x+.16:.2f}" y="{y+.16:.2f}" width=".68" height=".26" rx=".1" fill="{shade(col,.35)}" opacity=".45"/>')
    return ''.join(out)

SH=[]
base=[[(0,0)],[(0,0),(1,0)],[(0,0),(1,0),(2,0)],[(0,0),(1,0),(2,0),(3,0)],[(0,0),(1,0),(0,1),(1,1)],
      [(0,0),(0,1),(0,2),(1,2)],[(0,0),(1,0),(2,0),(1,1)],[(0,0),(1,0),(1,1),(2,1)]]
wts=[1,3,3,3,2,3,1,1]
def orients(s):
    res=set()
    for f in (1,-1):
        for k in range(4):
            pts=[(x*f,y) for x,y in s]
            for _ in range(k): pts=[(-y,x) for x,y in pts]
            mx=min(p[0] for p in pts); my=min(p[1] for p in pts)
            res.add(tuple(sorted((x-mx,y-my) for x,y in pts)))
    return list(res)
ORI=[orients(s) for s in base]

def tile(cells,rng):
    left=set(cells); pieces=[]
    order=sorted(cells,key=lambda c:rng.random())
    for a in order:
        if a not in left: continue
        for _ in range(12):
            i=rng.choices(range(len(base)),wts)[0]
            o=rng.choice(ORI[i]); placed=None
            for ax,ay in o:
                cs=[(a[0]+x-ax,a[1]+y-ay) for x,y in o]
                if all(c in left for c in cs): placed=cs;break
            if placed: break
        if not placed: placed=[a]
        for c in placed: left.discard(c)
        pieces.append(placed)
    return pieces

def piece_rects(p,g=.075):
    s=set(p); r=[]
    for (x,y) in p:
        l=0 if (x-1,y) in s else g; rr=0 if (x+1,y) in s else g
        t=0 if (x,y-1) in s else g; b=0 if (x,y+1) in s else g
        r.append((x+l,y+t,1-l-rr,1-t-b))
    return r

def render_ministeck(C,pal,seed=7):
    rng=random.Random(seed); out=[]; shadow=[]; top=[]
    for v in ('r','y','g','n'):
        cells={c for c,k in C.items() if k==v}
        if not cells: continue
        col=pal[v]
        for p in tile(cells,rng):
            rects=piece_rects(p)
            sh=''.join(f'<rect x="{x+.05:.3f}" y="{y+.07:.3f}" width="{w:.3f}" height="{h:.3f}"/>' for x,y,w,h in rects)
            shadow.append(f'<g fill="{shade(col,-.38)}" stroke="{shade(col,-.38)}" stroke-width=".1" stroke-linejoin="round">{sh}</g>')
            fg=''.join(f'<rect x="{x+.05:.3f}" y="{y+.05:.3f}" width="{max(w-.1,.05):.3f}" height="{max(h-.1,.05):.3f}"/>' for x,y,w,h in rects)
            top.append(f'<g fill="{col}" stroke="{col}" stroke-width=".1" stroke-linejoin="round">{fg}</g>')
    return ''.join(shadow)+''.join(top)


def ministeck_photo(C,pal,seed=11,gap=.06):
    rng=random.Random(seed); sh=[];hi=[];top=[]
    for v in ('r','y','g','n'):
        cells={c for c,k in C.items() if k==v}
        if not cells: continue
        for p in tile(cells,rng):
            col=shade(pal[v],rng.uniform(-.04,.04)); R=piece_rects(p,gap)
            f=lambda dx,dy,dw:''.join(f'<rect x="{x+dx:.3f}" y="{y+dy:.3f}" width="{max(w-dw,.05):.3f}" height="{max(h-dw,.05):.3f}"/>' for x,y,w,h in R)
            sh.append(f'<g fill="{shade(col,-.45)}">{f(.07,.09,0)}</g>')
            hi.append(f'<g fill="{shade(col,.28)}">{f(0,0,0)}</g>')
            top.append(f'<g fill="{col}">{f(.07,.07,.09)}</g>')
    return ''.join(sh)+''.join(hi)+''.join(top)

def palette(route,mode,berry=None,ring=None):
    # mode: 'light' garment (paper/amber) or 'dark' garment (ink)
    if route=='bead':
        gold,nav,gr='#eeba3f',NAVY,GREEN
    else:
        gold,nav,gr='#e6b13b',NAVY,GREEN
    p={'y':gold,'n':nav,'g':gr,'r':ring or (CREAM if mode=='dark' else nav)}
    return p

def mark(route,kind,mode,berry=None,ring=None,key=''):
    """returns (svg-group-string, w, h)"""
    if kind=='badge': C,W,H=badge_cells()
    elif kind=='church': C,W,H=CHURCH,CW,CH
    else: C,W,H=GRAPE,GW,GH
    pal=palette(route,mode,berry,ring)
    if kind=='grape' and mode=='dark':
        pal['n']=CREAM            # outline must read on ink
    if berry:
        C={c:('b' if v=='y' and kind=='grape' else v) for c,v in C.items()}; pal['b']=berry
    if route=='mini': pal.update({'y':'#e8b53f','n':'#1f2f5c','g':GREEN,'r':'#1f2f5c' if kind=='badge' else pal['r']})
    if kind=='church': pal['n']='#28417c'
    body=render_bead(C,pal) if route=='bead' else ministeck_photo(C,pal,gap=(.12 if kind=='church' else .06))
    return body,W,H

_cp=[0]
def place(route,kind,mode,x,y,w,berry=None,ring=None):
    if route=='poster':
        _cp[0]+=1; i=f'cp{_cp[0]}'
        return (f'<clipPath id="{i}"><circle cx="{x+w/2}" cy="{y+w/2}" r="{w*.465:.1f}"/></clipPath>'
                f'<image x="{x}" y="{y}" width="{w}" height="{w}" clip-path="url(#{i})" href="grape-poster.svg"/>'), w, w
    if kind=='church' and route=='bead':
        return f'<image x="{x}" y="{y}" width="{w}" height="{w}" href="data:image/svg+xml;base64,{CHURCH_B64}"/>', w, w
    body,W,H=mark(route,kind,mode,berry,ring)
    s=w/W
    return f'<g transform="translate({x:.1f},{y:.1f}) scale({s:.4f})">{body}</g>', W*s, H*s

# ---------- 3. garments ----------
def tee(fill,edge,content):
    return f'''<svg viewBox="0 0 600 580" class="gm"><path d="M205 62 L238 48 Q300 98 362 48 L395 62 L520 122 L482 214 L432 190 L432 535 L168 535 L168 190 L118 214 L80 122 Z" fill="{fill}" stroke="{edge}" stroke-width="3" stroke-linejoin="round"/>
<path d="M238 48 Q300 98 362 48" fill="none" stroke="{edge}" stroke-width="3"/><path d="M246 56 Q300 102 354 56" fill="none" stroke="{edge}" stroke-width="2" opacity=".5"/>
<path d="M168 190 Q175 150 205 62 M432 190 Q425 150 395 62" fill="none" stroke="{edge}" stroke-width="1.5" opacity=".35"/>{content}</svg>'''
def cap(fill,edge,brim,content):
    return f'''<svg viewBox="0 0 600 440" class="gm"><path d="M105 300 C100 140 185 62 300 62 C415 62 500 140 495 300 Z" fill="{fill}" stroke="{edge}" stroke-width="3"/>
<path d="M300 62 L300 300 M300 62 C235 105 215 205 222 300 M300 62 C365 105 385 205 378 300" fill="none" stroke="{edge}" stroke-width="1.6" opacity=".4"/>
<circle cx="300" cy="62" r="9" fill="{fill}" stroke="{edge}" stroke-width="3"/>
<path d="M82 296 Q300 262 518 296 Q545 352 300 384 Q55 352 82 296Z" fill="{brim}" stroke="{edge}" stroke-width="3" stroke-linejoin="round"/>
<path d="M104 305 Q300 276 496 305" fill="none" stroke="{edge}" stroke-width="1.5" opacity=".45"/>{content}</svg>'''
def txt(s,x,y,size,fill,cls='f',anchor='middle',ls='-.02em',up=False):
    st=f'font-size:{size}px;letter-spacing:{ls};'+('text-transform:uppercase;letter-spacing:.12em;' if up else '')
    return f'<text x="{x}" y="{y}" class="{cls}" fill="{fill}" text-anchor="{anchor}" style="{st}">{s}</text>'

NIGHT='#131f4a'; NEDGE='#0a1230'; NBRIM='#0f183c'
def designs(route):
    D={'cap':[],'tee':[]}
    # --- caps
    g,_,_=place(route,'badge','dark',225,92,150)
    D['cap'].append(('cap 1 · badge',cap(NIGHT,NEDGE,NBRIM,g),'night-blue cap. The grape in its disc, centred on the front.'))
    g,w,h=place(route,'grape','light',262,92,76)
    D['cap'].append(('cap 2 · grape + name',cap(CREAM,'#a79f86','#e3dcc6',g+txt("natural wine festival a'dam",300,230,15,INK)),'paper cap. Grape in navy, gold and green, wordmark in one line beneath it.'))
    g,w,h=place(route,'grape','light',252,84,96,berry=CREAM)
    D['cap'].append(('cap 3 · grape on amber',cap(AMBER,'#a8801f','#d9a62c',g),'amber cap. Navy outline, green leaf, berries in paper so they separate from the cap.'))
    g,w,h=place(route,'grape','dark',264,86,72)
    D['cap'].append(('cap 4 · with subtitle',cap(NIGHT,NEDGE,NBRIM,g+txt("natural wine festival a'dam",300,208,14,CREAM)+txt('united by wine',300,236,21,AMBER,'v')),'night-blue cap. Grape, wordmark and “united by wine” in Vicky as subtitle.'))
    g,w,h=place(route,'church','dark',205,62,190)
    D['cap'].append(('cap 5 · church window',cap(NIGHT,NEDGE,NBRIM,g),'night-blue cap. The round church-window logo, front centre.'+(' Existing vector logo.' if route=='bead' else ' Rebuilt from the bead grid in ministeck pieces.')))
    # --- tees (night blue)
    f,_,_=place(route,'badge','dark',340,146,62)
    b,_,_=place(route,'badge','dark',205,128,190)
    D['tee'].append(('tee 1 · chest + back',(tee(NIGHT,NEDGE,f),tee(NIGHT,NEDGE,b)),'night-blue tee. Small grape in its disc, left chest on the front; large grape in its disc on the back, no text.'))
    f,_,_=place(route,'badge','dark',190,118,220)
    front=f
    bk=txt('crew',300,200,64,CREAM,'f')
    D['tee'].append(('tee 2 · badge',(tee(NIGHT,NEDGE,front),tee(NIGHT,NEDGE,bk)),'The grape in its gold disc, no text. Back: the word “crew” in Figtree.'))
    f,_,_=place(route,'grape','dark',253,100,94)
    front=f+txt('living',300,282,74,CREAM)+txt('wines',300,350,74,CREAM)
    b,_,_=place(route,'grape','dark',270,118,60)
    bk=b+txt("28 feb + 1 mar '27",300,226,13,CREAM,'f',up=True)
    D['tee'].append(('tee 3 · living wines',(tee(NIGHT,NEDGE,front),tee(NIGHT,NEDGE,bk)),'“living wines” under the grape, the edition 05 film line. Small grape and the date on the back yoke.'))
    f,_,_=place(route,'grape','dark',238,92,124)
    front=f+txt("natural wine festival a'dam",300,296,21,CREAM)+txt('united by wine',300,338,34,AMBER,'v')
    b,_,_=place(route,'grape','dark',270,118,60)
    D['tee'].append(('tee 4 · with subtitle',(tee(NIGHT,NEDGE,front),tee(NIGHT,NEDGE,b+txt('united by wine',300,226,22,AMBER,'v'))),'Grape, wordmark, and “united by wine” in Vicky as subtitle. Back: small grape with the payoff.'))
    f,_,_=place(route,'church','dark',190,118,220)
    front=f
    b,_,_=place(route,'church','dark',250,110,100)
    D['tee'].append(('tee 5 · church window',(tee(NIGHT,NEDGE,front),tee(NIGHT,NEDGE,b)),'The round church-window logo, no text. Back: the logo small across the shoulders.'+(' Existing vector logo.' if route=='bead' else ' Ministeck rebuild.')))
    keep={'cap 1 · badge','tee 1 · chest + back','tee 2 · badge'}|({'cap 5 · church window','tee 5 · church window'} if route=='mini' else set())
    if route=='poster': D['cap']=[d for d in D['cap'] if d[0] in keep]
    D={k:[d for d in v if d[0] in keep] for k,v in D.items()}
    return D
FONTS={}
for n,f in (('Figtree','concept-assets/Figtree.woff2'),('Vicky','concept-assets/Vicky-Black.woff2')):
    FONTS[n]=base64.b64encode(open(f'{ROOT}/{f}','rb').read()).decode()

def section(route,title,sub):
    D=designs(route); h=f'<section id="{route}"><h2>{title}</h2><p class="sub">{sub}</p>'
    for kind,label in (('cap','pet'),('tee','t-shirt')):
        h+=f'<h3>{label}</h3><div class="grid">'
        for name,svg,note in D[kind]:
            body=svg if isinstance(svg,str) else f'<div class="pair"><div><span>voor</span>{svg[0]}</div><div><span>achter</span>{svg[1]}</div></div>'
            h+=f'<figure class="card"><div class="stage">{body}</div><figcaption><b>{name}</b>{note}</figcaption></figure>'
        h+='</div>'
    return h+'</section>'

html=f'''<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>NWFA merch · pet en t-shirt</title>
<style>
@font-face{{font-family:Figtree;font-weight:100 900;src:url(data:font/woff2;base64,{FONTS['Figtree']}) format('woff2')}}
@font-face{{font-family:Vicky;src:url(data:font/woff2;base64,{FONTS['Vicky']}) format('woff2')}}
:root{{--paper:#ECE6D6;--ink:#1B3326;--amber:#eeba3f;--ochre:#9F6E29}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font:16px/1.45 Figtree,sans-serif;padding:32px 24px 80px}}
header{{max-width:1500px;margin:0 auto 24px}}h1{{font-size:40px;letter-spacing:-.03em;line-height:.95;margin:0 0 8px;font-weight:700}}
.tabs{{display:flex;gap:8px;margin:20px 0 8px}}.tabs button{{font:700 13px Figtree;letter-spacing:.12em;text-transform:uppercase;border:2px solid var(--ink);background:none;color:var(--ink);padding:10px 16px;border-radius:99px;cursor:pointer}}
.tabs button.on{{background:var(--ink);color:var(--paper)}}
section{{max-width:1500px;margin:0 auto;display:none}}section.on{{display:block}}
h2{{font-size:26px;margin:24px 0 2px;letter-spacing:-.02em}}h3{{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ochre);margin:32px 0 12px}}.sub{{margin:0;max-width:70ch}}
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:20px}}
.card{{margin:0;background:#f6f1e3;border:1px solid #cfc7ae;border-radius:6px;overflow:hidden}}.stage{{padding:20px;background:#dcd5c0}}
.pair{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}.pair span{{display:block;font:700 11px Figtree;letter-spacing:.14em;text-transform:uppercase;color:var(--ochre);margin-bottom:4px}}
.gm{{width:100%;height:auto;display:block}}.f{{font-family:Figtree;font-weight:700}}.v{{font-family:Vicky,Figtree;font-weight:400}}
figcaption{{padding:14px 18px 18px;font-size:14px}}figcaption b{{display:block;font-size:16px;margin-bottom:2px}}
</style></head><body><header><h1>pet en t-shirt<br>op de druiventros</h1>
<p>Pet en t-shirt in twee versies van de druiventros: ministeck-stukjes en de kleine blokjes uit de poster. Alles met de cirkel, op nachtblauw.</p>
<div class="tabs"><button class="on" data-t="mini">ministeck</button><button data-t="poster">kleine blokjes · poster</button></div></header>
{section('mini','ministeck','Losse ministeck-stukjes zoals in de foto uit Downloads: mat, 1 tot 4 vakjes, lichte rand linksboven. Alleen de cirkel, zonder gaatjesbord. Hier staat ook het kerkraam.')}
{section('poster','kleine blokjes (poster)','De druiventros zoals nu in de poster staat: kleine beads met gouden schijf en groene gloed, als cirkel uitgesneden zoals in de hero-post.')}
<script>
document.querySelector('#mini').classList.add('on');
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{{document.querySelectorAll('.tabs button,section').forEach(e=>e.classList.remove('on'));b.classList.add('on');document.getElementById(b.dataset.t).classList.add('on')}});
</script>\n<script>window.SS_ANNOTATIONS={{api:"https://annotations.superstories.com",project:"nwfa"}};</script>\n<script src="js/annotate.js" defer></script>\n</body></html>'''
open(f'{ROOT}/merch/index.html','w').write(html)
for route in ('mini',):
    body,W,H=mark(route,'grape','light')
    open(f'{ROOT}/merch/grape-{route}.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">{body}</svg>')
print('ok',GW,GH)
