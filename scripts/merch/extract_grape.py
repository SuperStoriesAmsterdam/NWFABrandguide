import re, json
from collections import deque
src='/Users/petervanrhoon/Desktop/Builds/BrandguideNWFA/logos-/goodjuice-marks/goodjuice-grapes-umbrella.svg'
s=open(src).read()
P=13.695
cells={}
for m in re.finditer(r'<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="[\d.]+" rx="[\d.]+" fill="#([0-9a-f]{6})"/>',s):
    x,y,w,f=float(m[1]),float(m[2]),float(m[3]),m[4]
    if abs(w-12.47)>0.3: continue
    i=round((x-0.62)/P); j=round((y-0.62)/P)
    r,g,b=int(f[:2],16),int(f[2:4],16),int(f[4:],16)
    if r>0xe8 and g>0xe8 and b>0xb0: c='w'
    elif r>0xc0 and g>0x90: c='y'
    elif g>r+20 and g>b: c='g'
    else: c='n'
    cells[(i,j)]=c
N=max(max(k) for k in cells)+1
X0,X1,Y0,Y1=16,58,8,61
grid=[[cells.get((i,j),'n') if (X0<=i<X1 and Y0<=j<Y1) else 'y' for i in range(N)] for j in range(N)]
# outside navy = navy connected to border
out=set(); q=deque()
for k in range(N):
    for (i,j) in [(k,0),(k,N-1),(0,k),(N-1,k)]:
        if grid[j][i]=='n' and (i,j) not in out: out.add((i,j)); q.append((i,j))
while q:
    i,j=q.popleft()
    for di,dj in((1,0),(-1,0),(0,1),(0,-1)):
        a,b=i+di,j+dj
        if 0<=a<N and 0<=b<N and grid[b][a]=='n' and (a,b) not in out: out.add((a,b)); q.append((a,b))
gn={(i,j) for j in range(N) for i in range(N) if grid[j][i]=='n' and (i,j) not in out}
# fill: flood from border across everything except grape navy
reach=set(); q=deque()
for k in range(N):
    for (i,j) in [(k,0),(k,N-1),(0,k),(N-1,k)]:
        if (i,j) not in gn and (i,j) not in reach: reach.add((i,j)); q.append((i,j))
while q:
    i,j=q.popleft()
    for di,dj in((1,0),(-1,0),(0,1),(0,-1)):
        a,b=i+di,j+dj
        if 0<=a<N and 0<=b<N and (a,b) not in gn and (a,b) not in reach: reach.add((a,b)); q.append((a,b))
inside={(i,j) for j in range(N) for i in range(N) if (i,j) not in reach}
mark={}
for (i,j) in gn: mark[(i,j)]='n'
for (i,j) in inside:
    if (i,j) not in gn: mark[(i,j)]='y' if grid[j][i]=='w' else grid[j][i]
xs=[k[0] for k in mark]; ys=[k[1] for k in mark]
x0,y0=min(xs),min(ys); W=max(xs)-x0+1; H=max(ys)-y0+1
rows=[''.join(mark.get((x0+i,y0+j),'.') for i in range(W)) for j in range(H)]
json.dump(rows,open('grape_grid.json','w'))
print(N,W,H); print('\n'.join(rows))
