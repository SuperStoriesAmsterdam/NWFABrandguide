import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    try: b=p.chromium.launch()
    except Exception: b=p.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
    pg=b.new_page(viewport={'width':1500,'height':900})
    pg.goto('file:///Users/petervanrhoon/Desktop/Builds/BrandguideNWFA/merch/index.html')
    pg.wait_for_timeout(800)
    for r in ('mini','poster'):
        pg.click(f'button[data-t={r}]')
        pg.wait_for_timeout(300)
        pg.locator(f'#{r}').screenshot(path=f'/private/tmp/claude-501/-Users-petervanrhoon-Desktop-Builds-BrandguideNWFA/5511aaa0-eb21-452a-aa74-32c09b134039/scratchpad/{r}.png')
    b.close()
