# Turns dist-single/index.html into the artifact fragment adaptia.html (no doctype/html/head/body; the viewer adds them).
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = (root / 'dist-single' / 'index.html').read_text()
head = re.search(r'<head>(.*?)</head>', src, re.S).group(1)
body = re.search(r'<body[^>]*>(.*?)</body>', src, re.S).group(1)
assets = ''.join(re.findall(r'<style[^>]*>.*?</style>|<script[^>]*>.*?</script>', head, re.S))
out = (
    '<title>ADAPTIA</title>\n'
    '<meta name="description" content="ADAPTIA: jawaban bisa disalin, pemahaman tidak. Mahasiswa membuktikan paham dengan mengajari Boby, murid AI yang sengaja keliru; dosen membaca buktinya kalimat demi kalimat." />\n'
    '<meta name="theme-color" content="#FEF8F5">\n'
    '<style>:root{color-scheme:light}html,body{background:#FEF8F5}</style>\n'
    + assets + '\n' + body.strip() + '\n'
)
(root / 'adaptia.html').write_text(out)
print('adaptia.html', len(out) // 1024, 'KB')
