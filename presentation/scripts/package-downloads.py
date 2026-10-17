"""Assemble the public downloads in "Free Toolkit Download/PDMA Edition/".

Copies the built single-file presentation next to the PDMA edition leave-behind and
writes PDMA-Webcast-Kit.zip with all of them. Entries get a fixed timestamp, so the
same inputs always produce the same ZIP and CI can check the committed files are current.
Run from presentation/ after `npm run build`.
"""
import pathlib, shutil, zipfile

here = pathlib.Path(__file__).resolve().parent.parent
folder = here.parent / "Free Toolkit Download" / "PDMA Edition"
html = folder / "PDMA-Webcast-The-New-PM-Operating-System.html"
members = [html.name, "AGENTS-Enterprise-Model-PDMA.pdf", "AGENTS-Enterprise-Model-PDMA.docx", "README.txt"]

shutil.copyfile(here / "dist" / "index.html", html)
with zipfile.ZipFile(folder / "PDMA-Webcast-Kit.zip", "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for name in members:
        info = zipfile.ZipInfo(f"PDMA-Webcast-Kit/{name}", date_time=(2026, 11, 19, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        z.writestr(info, (folder / name).read_bytes(), compresslevel=9)
print("PACKAGE_PASS", ", ".join(members), "-> PDMA-Webcast-Kit.zip")
