"""Insert the one-page Hype Gap worksheet after the S: Success & Accountability page of the PDMA edition DOCX.

Run after brand-leave-behind.py:
    python3 scripts/add-hype-gap-page.py in.docx out.docx
The page reuses the S page's own header, table and paragraph formatting, so it matches the package.
Later page numbers shift by one. Running it on a file that already has the page changes nothing.
"""
import random, re, sys, zipfile

src, out = sys.argv[1:3]
z = zipfile.ZipFile(src)
files = {n: z.read(n) for n in z.namelist()}
doc = files["word/document.xml"].decode()

PARA = r"<w:p\b[^>]*>(?:(?!<w:p\b).)*?</w:p>"
def text(xml): return re.sub(r"<[^>]+>", "", xml).replace("&amp;", "&").strip()
def esc(s): return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
def set_texts(xml, texts):
    """Put texts into the element's <w:t> nodes in order; nodes past the list are emptied."""
    it = iter(texts)
    def sub(m):
        t = next(it, "")
        return f'<w:t xml:space="preserve">{esc(t)}</w:t>'
    return re.sub(r"<w:t(?: [^>]*)?>[^<]*</w:t>|<w:t(?: [^>]*)?/>", sub, xml)
def para_with(start, needle):
    for m in re.finditer(PARA, doc[start:], flags=re.S):
        if text(m.group(0)).startswith(needle): return m.group(0), start + m.start()
    raise SystemExit(f"not found: {needle}")

if "Measure the Hype Gap" in doc:
    open(out, "wb").write(open(src, "rb").read()); print("HYPE_GAP_PAGE_ALREADY_PRESENT"); raise SystemExit

s_title, s_at = para_with(0, "S: Success")
header_start = doc.rfind("<w:tbl>", 0, s_at)
header_end = doc.index("</w:tbl>", header_start) + len("</w:tbl>")
header = doc[header_start:header_end]
gap = doc[header_end:s_at]  # spacing between the header rule and the page title
subtitle, _ = para_with(s_at, "Did the agent create")
intro, _ = para_with(s_at, "Measure the same business-value")
kicker, _ = para_with(s_at, "SUCCESS MEASUREMENT")
table_start = doc.index("<w:tbl>", s_at)
table = doc[table_start:doc.index("</w:tbl>", table_start) + len("</w:tbl>")]
owner, _ = para_with(s_at, "Business Owner:")
principle, _ = para_with(s_at, "PRINCIPLE")
output, _ = para_with(s_at, "OUTPUT")
next_page = doc.index("Production Readiness Gate")
insert_at = doc.rfind("<w:tbl>", 0, next_page)  # the next page's header table

# Renumber every page header after the insertion point (18 -> 19, 19 -> 20, ...).
# The number can sit in its own run after "MODEL  ·", so allow tags between them.
PAGE_NO = re.compile(r"(MODEL\s*·(?:\s|<[^>]+>)*)(\d+)", re.S)
tail = PAGE_NO.sub(lambda m: f"{m.group(1)}{int(m.group(2)) + 1:02d}", doc[insert_at:])
page_no = int(PAGE_NO.search(header).group(2)) + 1
new_header = PAGE_NO.sub(lambda m: f"{m.group(1)}{page_no:02d}", header)

rows = re.findall(r"<w:tr\b.*?</w:tr>", table, flags=re.S)
head_row, body_rows = rows[0], rows[1:]
def cells(row): return re.findall(r"<w:tc>.*?</w:tc>", row, flags=re.S)
def fill_row(row, values):
    cs = cells(row)
    for c, v in zip(cs, values): row = row.replace(c, set_texts(c, [v]), 1)
    return row
values = [
    ("GROW · New or larger revenue", "", "", ""),
    ("SAVE · Non-labor cost removed", "", "", ""),
    ("SCALE · More volume, same team", "", "", ""),
    ("GUT · Headcount cut (review first)", "", "", ""),
]
new_rows = [fill_row(head_row, ["Value Source", "Promised (at approval)", "Realized (at 12 months)", "Hype Gap %"])]
new_rows += [fill_row(body_rows[min(i, len(body_rows) - 1)], v) for i, v in enumerate(values)]
new_table = table[:table.index(rows[0])] + "".join(new_rows) + table[table.rindex(rows[-1]) + len(rows[-1]):]

block = "".join([
    new_header,
    gap,
    set_texts(s_title, ["S: Measure the Hype Gap"]),
    set_texts(subtitle, ["Did the value we promised actually show up?"]),
    set_texts(intro, ["Record the value promised at approval, then the value realized at 12 months. Use only numbers you can trace to a source. The Hype Gap is the share of the promise that never showed up."]),
    set_texts(kicker, ["HYPE GAP = 1 − (REALIZED VALUE ÷ PROMISED VALUE)"]),
    new_table,
    set_texts(kicker, ["CHECKS BEFORE YOU REPORT IT"]),
    set_texts(owner, ["Promised value comes from (business case, approval memo): ", "______________________"]),
    set_texts(owner, ["Realized value comes from (finance report, system data): ", "______________________"]),
    set_texts(owner, ["Durability (impact at 12 months ÷ impact at 3 months): ", "______________________"]),
    set_texts(principle, ["PRINCIPLE  ", "Report", " realized value, not promised value. Don’t gut it. Grow it."]),
    set_texts(output, ["OUTPUT  ", "Hype", " Gap ", "Record", "  ·", "  Bring it to every quarterly business review."]),
    '<w:p><w:r><w:br w:type="page"/></w:r></w:p>',
])
# Copied paragraphs need their own ids.
used = set(re.findall(r'w14:(?:paraId|textId)="([0-9A-F]{8})"', doc))
def fresh(m):
    while True:
        v = f"{random.randrange(1, 0x7FFFFFFF):08X}"
        if v not in used: used.add(v); return f'{m.group(1)}="{v}"'
block = re.sub(r'(w14:paraId)="[0-9A-F]{8}"', fresh, block)

doc = doc[:insert_at] + block + tail
files["word/document.xml"] = doc.encode()
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as o:
    for n in z.namelist(): o.writestr(z.getinfo(n), files[n])
print("HYPE_GAP_PAGE_ADDED", f"page {page_no:02d}")
