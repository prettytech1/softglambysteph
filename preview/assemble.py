# Assemble the single-file preview: compiled CSS (fonts inlined) + bundled app.
import base64, glob, re, sys
out_html, app_js = sys.argv[1], sys.argv[2]
css = open(glob.glob('out/assets/_next/static/css/*.css')[0]).read()
def font(m):
    f = m.group(1).split('/')[-1]
    data = base64.b64encode(open(f'out/assets/_next/static/media/{f}', 'rb').read()).decode()
    return f'url(data:font/woff2;base64,{data}) format("woff2")'
css = re.sub(r',\s*url\([^)]*?\.woff\)\s*format\("woff"\)', '', css)          # drop woff fallbacks
css = re.sub(r'url\(([^)]*?\.woff2)\)\s*format\("woff2"\)', font, css)
js = open(app_js).read().replace('</script', '<\\/script')
html = f'''<title>Softglambysteph</title>
<meta name="description" content="Makeup studio in Ologolo, Lekki and the GlowbySteph lip collection.">
<style>{css}</style>
<div id="root"></div>
<script>{js}</script>
'''
open(out_html, 'w').write(html)
print(len(html)//1024, 'KB')
