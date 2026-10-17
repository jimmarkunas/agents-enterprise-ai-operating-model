"""Rebrand the A.G.E.N.T.S. leave-behind DOCX from USAII to PDMA Innovation in Focus."""
import re, shutil, sys, zipfile, pathlib
src, logo, out = sys.argv[1:4]
HEADING_FONT = "Poppins"  # body and worksheets keep Inter so the 19-page layout does not reflow
z = zipfile.ZipFile(src)
files = {n: z.read(n) for n in z.namelist()}

BLUE, LIME, BLUE_SOFT, LIME_SOFT = "004679", "B1D101", "E6EEF4", "F3F8DF"
def recolor(xml):
    xml = re.sub("447ACB|4F81BD", BLUE, xml, flags=re.I)
    xml = re.sub("95B3D7", "99B5C9", xml, flags=re.I)
    xml = re.sub("DBE5F1", BLUE_SOFT, xml, flags=re.I)
    xml = re.sub("EEF4FC", BLUE_SOFT, xml, flags=re.I)
    xml = re.sub("F3F6FA", LIME_SOFT, xml, flags=re.I)
    return xml
FOOTER = "Open Source Framework for PDMA members. Author: Jim Markunas"
def drop_paragraphs(xml, text):
    """Remove each whole paragraph whose visible text is exactly `text` (no co-brand lines)."""
    def keep(m):
        return "" if re.sub(r"<[^>]+>", "", m.group(0)).strip() == text else m.group(0)
    return re.sub(r"<w:p\b[^>]*>(?:(?!<w:p\b).)*?</w:p>", keep, xml, flags=re.S)
def rebrand(xml):
    xml = xml.replace("USAII AI EXPERT TALKS", "PDMA INNOVATION IN FOCUS")
    xml = xml.replace("USAII × JIM MARKUNAS", "PDMA INNOVATION IN FOCUS")
    xml = drop_paragraphs(xml, "USAII × Jim Markunas")
    # Footer runs: "USAII × Jim " + "Markunas  ·" + "  A.G.E.N.T.S. Enterprise Agent Operating Model"
    xml = xml.replace(">USAII × Jim </w:t>", f">{FOOTER}</w:t>")
    xml = xml.replace(">Markunas  ·</w:t>", "></w:t>")
    xml = xml.replace(">  A.G.E.N.T.S. Enterprise Agent Operating Model</w:t>", "></w:t>")
    return xml

doc = files["word/document.xml"].decode()
doc = rebrand(recolor(doc))
# Page titles (25pt and up) take PDMA's Poppins.
def heading_font(m):
    rpr = m.group(0)
    size = re.search(r'<w:sz w:val="(\d+)"/>', rpr)
    if not size or int(size.group(1)) < 50: return rpr
    if "<w:rFonts" in rpr:
        return re.sub(r"<w:rFonts( [^>]*)?/>", lambda f: f'<w:rFonts w:ascii="{HEADING_FONT}" w:hAnsi="{HEADING_FONT}"' + re.sub(r' w:(ascii|hAnsi)="[^"]*"', "", f.group(1) or "") + "/>", rpr, count=1)
    return rpr.replace("<w:rPr>", f'<w:rPr><w:rFonts w:ascii="{HEADING_FONT}" w:hAnsi="{HEADING_FONT}"/>', 1)
doc = re.sub(r"<w:rPr>.*?</w:rPr>", heading_font, doc, flags=re.S)
# Poppins has taller ascenders than Inter; pin title line height so no page reflows.
def tight_title(m):
    para = m.group(0)
    if f'w:ascii="{HEADING_FONT}"' not in para: return para
    size = max(int(v) for v in re.findall(r'<w:sz w:val="(\d+)"/>', para))
    line = f'w:line="{round(size / 2 * 20 * 1.12)}" w:lineRule="exact"'
    ppr = re.search(r"<w:pPr>.*?</w:pPr>", para, flags=re.S)
    if ppr and "<w:spacing" in ppr.group(0):
        new = re.sub(r"<w:spacing([^>]*?)/>", lambda sp: "<w:spacing" + re.sub(r' w:(line|lineRule)="[^"]*"', "", sp.group(1)) + " " + line + "/>", ppr.group(0), count=1)
    elif ppr:
        new = ppr.group(0).replace("<w:pPr>", f"<w:pPr><w:spacing {line}/>", 1)
    else:
        return re.sub(r"(<w:p\b[^>]*>)", rf"\1<w:pPr><w:spacing {line}/></w:pPr>", para, count=1)
    return para.replace(ppr.group(0), new, 1)
doc = re.sub(r"<w:p\b[^>]*>(?:(?!<w:p\b).)*?</w:p>", tight_title, doc, flags=re.S)
# Cover: first blue bar becomes PDMA lime.
doc = doc.replace(f'w:fill="{BLUE}"', f'w:fill="{LIME}"', 1)
# Cover: PDMA logo above the series label (first paragraph of the document body).
w_emu, h_emu = int(1.6 * 914400), int(1.6 * 914400 * 159 / 520)
drawing = (f'<w:p><w:pPr><w:spacing w:after="160"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">'
  f'<wp:extent cx="{w_emu}" cy="{h_emu}"/><wp:docPr id="9001" name="PDMA logo" descr="PDMA: Connecting Innovators Worldwide"/>'
  '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
  '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="9001" name="pdma-logo.png"/><pic:cNvPicPr/></pic:nvPicPr>'
  '<pic:blipFill><a:blip r:embed="rIdPdmaLogo"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
  f'<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{w_emu}" cy="{h_emu}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>'
  '</a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>')
doc = doc.replace("<w:body>", "<w:body>" + drawing, 1)
assert "USAII" not in doc and "×" not in doc, "co-brand text remains"
files["word/document.xml"] = doc.encode()

for name in ("word/footer1.xml", "word/styles.xml", "word/numbering.xml"):
    x = rebrand(recolor(files[name].decode()))
    assert "USAII" not in x, name
    files[name] = x.encode()
th = files["word/theme/theme1.xml"].decode()
th = th.replace('srgbClr val="4F81BD"', f'srgbClr val="{BLUE}"').replace('srgbClr val="9BBB59"', f'srgbClr val="{LIME}"')
files["word/theme/theme1.xml"] = th.encode()
rels = files["word/_rels/document.xml.rels"].decode().replace("</Relationships>",
  '<Relationship Id="rIdPdmaLogo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/pdma-logo.png"/></Relationships>')
files["word/_rels/document.xml.rels"] = rels.encode()
ct = files["[Content_Types].xml"].decode()
if 'Extension="png"' not in ct:
    ct = ct.replace("<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">", "<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\"><Default Extension=\"png\" ContentType=\"image/png\"/>")
files["[Content_Types].xml"] = ct.encode()
files["word/media/pdma-logo.png"] = pathlib.Path(logo).read_bytes()
core = files["docProps/core.xml"].decode()
core = re.sub(r"<dc:title>.*?</dc:title>", "<dc:title>A.G.E.N.T.S. Enterprise AI Agent Implementation Package · PDMA Innovation in Focus</dc:title>", core)
files["docProps/core.xml"] = core.encode()
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as o:
    for n in z.namelist() + ["word/media/pdma-logo.png"]:
        if n in files and n not in o.namelist(): o.writestr(n, files[n])
print("wrote", out)
