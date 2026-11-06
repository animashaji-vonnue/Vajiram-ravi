"""
The programme cards' illustrations (src/components/sections/Courses/ProgrammeCard.tsx): one SVG per course,
drawn to the card's 308 x 220 box, written to public/images/courses/art.

    python scripts/course-art.py [preview-dir]

With a preview directory it also writes preview.html there: the eight cards mocked up in their final look.

The style ("block-print vignettes"): a soft peach disc printed with the butta flower and ringed by a dotted
block-print border, cropped by the card's top; on it one flat object for the course, in the site's palette
with fine mahogany outlines and a soft ground shadow. Everything sits in the card's upper right, clear of
the chip (top left) and the knob (top right), so the title and meta stay on plain paper. The flagship card
(GS Foundation) is dark, so its disc and print are saffron at low strength instead of peach.
"""
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PREVIEW = Path(sys.argv[1]) if len(sys.argv) > 1 else None
OUT = ROOT / "public/images/courses/art"
OUT.mkdir(parents=True, exist_ok=True)

ORANGE, BURNT, SAFFRON, INK, CREAM, CLAY, PEACH = "#e57512", "#cc5500", "#f4c430", "#2b1206", "#fff8ec", "#8a4b2a", "#ffe3bd"
LINE = f'stroke="{INK}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"'
BUTTA = (
    "M7 0C10.64 2.352 9.184 5.32 7 5.88C4.816 5.32 3.36 2.352 7 0ZM7 14C10.64 11.648 9.184 8.68 7 8.12C4.816 8.68 3.36 "
    "11.648 7 14ZM0 7C2.352 3.36 5.32 4.816 5.88 7C5.32 9.184 2.352 10.64 0 7ZM14 7C11.648 3.36 8.68 4.816 8.12 7C8.68 "
    "9.184 11.648 10.64 14 7ZM6.02 7C6.02 6.45875 6.45875 6.02 7 6.02C7.54125 6.02 7.98 6.45875 7.98 7C7.98 7.54125 "
    "7.54125 7.98 7 7.98C6.45875 7.98 6.02 7.54125 6.02 7Z"
)

# The disc: centred over the art, cropped by the card's top edge.
DX, DY, DR = 204, 40, 74


def backdrop(dark: bool) -> str:
    disc = "rgb(244 196 48 / 0.13)" if dark else PEACH
    print_colour, print_alpha = (SAFFRON, 0.22) if dark else (BURNT, 0.11)
    ring = SAFFRON if dark else ORANGE
    shadow = "#000" if dark else INK
    shadow_alpha = 0.32 if dark else 0.09
    return f"""
  <defs>
    <pattern id="butta" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="translate({DX} {DY}) rotate(45)">
      <path d="{BUTTA}" transform="translate(4 4)" fill="{print_colour}" fill-opacity="{print_alpha}"/>
    </pattern>
    <clipPath id="disc"><circle cx="{DX}" cy="{DY}" r="{DR}"/></clipPath>
  </defs>
  <circle cx="{DX}" cy="{DY}" r="{DR}" fill="{disc}"/>
  <rect x="{DX - DR}" y="{DY - DR}" width="{2 * DR}" height="{2 * DR}" fill="url(#butta)" clip-path="url(#disc)"/>
  <circle cx="{DX}" cy="{DY}" r="{DR + 9}" stroke="{ring}" stroke-opacity="0.45" stroke-width="1.6" stroke-dasharray="0.1 6" stroke-linecap="round"/>
  <circle cx="{DX}" cy="{DY}" r="{DR + 14}" stroke="{ring}" stroke-opacity="0.16" stroke-width="1"/>
  <ellipse cx="204" cy="121" rx="66" ry="5.5" fill="{shadow}" fill-opacity="{shadow_alpha}"/>"""


def svg(name: str, body: str, dark: bool = False) -> None:
    doc = f"""<svg xmlns="http://www.w3.org/2000/svg" width="308" height="220" viewBox="0 0 308 220" fill="none">{backdrop(dark)}
{body}
</svg>
"""
    (OUT / f"{name}.svg").write_text(doc, encoding="utf-8")


def pencil(x1, y1, x2, y2, w=10, body=ORANGE):
    """A pencil from its point (x1, y1) to its end (x2, y2)."""
    ang = math.degrees(math.atan2(y2 - y1, x2 - x1))
    length = math.hypot(x2 - x1, y2 - y1)
    h = w / 2
    return f"""  <g transform="translate({x1} {y1}) rotate({ang:.2f})">
    <path d="M0 0L16 {-h}H{length - 14}V{h}H16Z" fill="{body}" {LINE}/>
    <path d="M0 0L16 {-h}V{h}Z" fill="#f6d9b0" {LINE}/>
    <path d="M0 0L5.5 {-h * 0.34}V{h * 0.34}Z" fill="{INK}"/>
    <path d="M16 0H{length - 14}" stroke="{BURNT}" stroke-width="1.2" stroke-opacity="0.55"/>
    <rect x="{length - 14}" y="{-h}" width="6" height="{w}" fill="{SAFFRON}" {LINE}/>
    <path d="M{length - 8} {-h}H{length - 3}Q{length} {-h} {length} {-h + 3}V{h - 3}Q{length} {h} {length - 3} {h}H{length - 8}Z" fill="#e8916a" {LINE}/>
  </g>"""


# 1. UPSC GS Foundation Course - PCM (the dark flagship card): a stack of books with a globe on top.
def gs_foundation():
    def book(x, y, w, h, fill, band, pages_left):
        px = x + 4 if pages_left else x + w - 14
        return f"""  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2.5" fill="{fill}" {LINE}/>
  <rect x="{px}" y="{y + 3}" width="10" height="{h - 6}" rx="1" fill="{CREAM}" {LINE}/>
  <path d="M{px + 2} {y + 6.5}H{px + 8}M{px + 2} {y + h / 2}H{px + 8}M{px + 2} {y + h - 6.5}H{px + 8}" stroke="{INK}" stroke-opacity="0.35" stroke-width="1"/>
  <path d="M{x + (w - 34 if pages_left else 18)} {y}V{y + h}M{x + (w - 28 if pages_left else 24)} {y}V{y + h}" stroke="{band}" stroke-width="2"/>"""

    globe = f"""  <path d="M190 58H218L214 52H194Z" fill="{BURNT}" {LINE}/>
  <path d="M204 52V48" {LINE}/>
  <path d="M181.5 27A24 24 0 0 0 222 44" stroke="{SAFFRON}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="202" cy="28" r="19" fill="#fdf2dc" {LINE}/>
  <path d="M191 17C196 15 199 19 197 23C195 27 189 25 187 30C185.5 25 186.5 19 191 17Z" fill="{ORANGE}"/>
  <path d="M206 24C211 21 217 24 218 30C215 35 209 34 207 39C204 35 202 28 206 24Z" fill="{ORANGE}"/>
  <path d="M196 40C199 39 202 41 201 44C198 45 195 43 196 40Z" fill="{ORANGE}"/>
  <ellipse cx="202" cy="28" rx="8" ry="19" stroke="{BURNT}" stroke-opacity="0.55" stroke-width="1"/>
  <path d="M183 28H221" stroke="{BURNT}" stroke-opacity="0.55" stroke-width="1"/>
  <circle cx="202" cy="28" r="19" {LINE}/>"""
    body = (
        book(140, 98, 128, 20, ORANGE, SAFFRON, False)
        + "\n"
        + book(150, 78, 112, 20, SAFFRON, BURNT, True)
        + "\n"
        + book(144, 58, 118, 20, "#a8431a", SAFFRON, False)
        + "\n"
        + globe
    )
    svg("gs-foundation", body, dark=True)


# 2. Optional Subject Programme: a shelf of upright subject books, one leaning.
def optional_subject():
    books = [
        (146, 18, 66, ORANGE, SAFFRON),
        (164, 15, 80, BURNT, SAFFRON),
        (179, 21, 58, SAFFRON, BURNT),
        (200, 16, 74, CREAM, ORANGE),
        (236, 19, 54, ORANGE, CREAM),
    ]
    parts = [f'  <rect x="138" y="116" width="128" height="5" rx="1.5" fill="{CLAY}" {LINE}/>']
    for x, w, h, fill, band in books:
        top = 116 - h
        parts.append(f'  <rect x="{x}" y="{top}" width="{w}" height="{h}" rx="2" fill="{fill}" {LINE}/>')
        parts.append(f'  <path d="M{x + 2} {top + 8}H{x + w - 2}M{x + 2} {116 - 8}H{x + w - 2}" stroke="{band}" stroke-width="2.4"/>')
        parts.append(f'  <rect x="{x + w / 2 - 3.5}" y="{top + 16}" width="7" height="{min(22, h - 34)}" rx="1.5" fill="{band}" fill-opacity="0.85"/>')
    # The leaning book rests on the cream one's right side.
    parts.append(
        f"""  <g transform="rotate(16 216 116)">
    <rect x="216" y="48" width="16" height="68" rx="2" fill="#a8431a" {LINE}/>
    <path d="M218 56H230M218 108H230" stroke="{SAFFRON}" stroke-width="2.4"/>
    <rect x="220.5" y="64" width="7" height="20" rx="1.5" fill="{SAFFRON}" fill-opacity="0.85"/>
  </g>"""
    )
    svg("optional-subject", "\n".join(parts))


# 3. CSAT Course: a protractor, a pencil and the four operations.
def csat():
    cx, cy, r = 200, 114, 58
    ticks = []
    for i in range(1, 36):
        a = math.radians(180 - i * 5)
        long = i % 9 == 0
        r1 = r - (13 if long else 8 if i % 3 == 0 else 5)
        ticks.append(
            f"M{cx + r1 * math.cos(a):.2f} {cy - r1 * math.sin(a):.2f}L{cx + (r - 2) * math.cos(a):.2f} {cy - (r - 2) * math.sin(a):.2f}"
        )
    body = f"""  <path d="M{cx - r} {cy}A{r} {r} 0 0 1 {cx + r} {cy}Z" fill="{SAFFRON}" fill-opacity="0.92" {LINE}/>
  <path d="M{cx - 22} {cy}A22 22 0 0 1 {cx + 22} {cy}Z" fill="{PEACH}" {LINE}/>
  <path d="{' '.join(ticks)}" stroke="{INK}" stroke-width="1.1" stroke-linecap="round"/>
  <circle cx="{cx}" cy="{cy}" r="2.4" fill="{INK}"/>
{pencil(158, 104, 238, 47, 11)}
  <path d="M156 34V46M150 40H162" stroke="{BURNT}" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M146 62L155 71M155 62L146 71" stroke="{BURNT}" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M174 22H186" stroke="{BURNT}" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="180" cy="17" r="1.8" fill="{BURNT}"/><circle cx="180" cy="27" r="1.8" fill="{BURNT}"/>"""
    svg("csat", body)


# 4. Prelims Test Series: an OMR answer sheet with a pencil.
def prelims():
    rows = []
    for row, filled in enumerate([1, 3, 0, 2, 1, 3]):
        y = 46 + row * 12.5
        rows.append(f'    <path d="M162 {y}H167" stroke="{INK}" stroke-opacity="0.45" stroke-width="1.4" stroke-linecap="round"/>')
        for col in range(4):
            x = 178 + col * 14
            fill = INK if col == filled else "none"
            rows.append(f'    <circle cx="{x}" cy="{y}" r="4.2" fill="{fill}" stroke="{INK}" stroke-opacity="{1 if col == filled else 0.55}" stroke-width="1.2"/>')
    body = f"""  <g transform="translate(-6 2) rotate(-6 204 72)">
    <rect x="154" y="18" width="98" height="104" rx="3" fill="{CREAM}" {LINE}/>
    <path d="M154 21A3 3 0 0 1 157 18H249A3 3 0 0 1 252 21V32H154Z" fill="{ORANGE}" {LINE}/>
    <path d="M162 25H196M226 25H244" stroke="{CREAM}" stroke-width="2" stroke-linecap="round"/>
{chr(10).join(rows)}
  </g>
{pencil(204, 120, 266, 70, 10)}"""
    svg("prelims-test-series", body)


# 5. Mains Test Series: an open answer booklet with a fountain pen.
def mains():
    def lines(x0, x1, y0, n, seed):
        out = []
        for i in range(n):
            y = y0 + i * 9
            end = x1 - (seed * 7 + i * 5) % 14
            d = f"M{x0} {y}"
            x = x0
            while x < end:
                d += f"q2 -2.4 4 0t4 0"
                x += 8
            out.append(f'    <path d="{d}" stroke="{INK}" stroke-opacity="0.45" stroke-width="1.1" stroke-linecap="round"/>')
        return "\n".join(out)

    body = f"""  <g>
    <path d="M142 34Q170 28 196 36V120Q170 112 142 118Z" fill="{CREAM}" {LINE}/>
    <path d="M196 36Q222 28 248 34V118Q222 112 196 120Z" fill="#fdf0da" {LINE}/>
    <path d="M196 36V120" stroke="{BURNT}" stroke-width="2"/>
    <rect x="150" y="40" width="18" height="6" rx="1.5" fill="{ORANGE}"/>
{lines(150, 190, 56, 6, 1)}
{lines(203, 242, 46, 7, 2)}
  </g>
  <g transform="translate(214 122) rotate(-48)">
    <path d="M0 0L9 -4.5H16V4.5H9Z" fill="{SAFFRON}" {LINE}/>
    <path d="M3 0H9" stroke="{INK}" stroke-width="1"/>
    <rect x="16" y="-5.5" width="11" height="11" rx="1" fill="{SAFFRON}" {LINE}/>
    <path d="M27 -6H70Q76 -6 76 0Q76 6 70 6H27Z" fill="{INK}" {LINE}/>
    <path d="M44 -6V6" stroke="{SAFFRON}" stroke-width="2.2"/>
    <path d="M50 -9H66" stroke="{SAFFRON}" stroke-width="2" stroke-linecap="round"/>
  </g>"""
    svg("mains-test-series", body)


# 6. Optional Test Series: a subject book behind a clipboard checklist with a rosette.
def optional_test():
    rows = []
    for i, done in enumerate([True, True, True, False]):
        y = 54 + i * 15
        rows.append(f'  <rect x="178" y="{y - 4.5}" width="9" height="9" rx="1.5" fill="{CREAM}" stroke="{INK}" stroke-width="1.3"/>')
        if done:
            rows.append(f'  <path d="M179.5 {y}L182.5 {y + 3}L188.5 {y - 4.5}" stroke="{ORANGE}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>')
        rows.append(f'  <path d="M194 {y}H{226 - (i * 6) % 14}" stroke="{INK}" stroke-opacity="0.45" stroke-width="1.6" stroke-linecap="round"/>')
    body = f"""  <g transform="rotate(-8 160 116)">
    <rect x="144" y="48" width="26" height="70" rx="2" fill="{SAFFRON}" {LINE}/>
    <path d="M146 56H168M146 110H168" stroke="{BURNT}" stroke-width="2.4"/>
    <rect x="153.5" y="64" width="7" height="22" rx="1.5" fill="{BURNT}" fill-opacity="0.85"/>
  </g>
  <rect x="164" y="34" width="78" height="86" rx="6" fill="{BURNT}" {LINE}/>
  <rect x="170" y="42" width="66" height="72" rx="2" fill="{CREAM}" {LINE}/>
  <rect x="189" y="28" width="28" height="12" rx="3" fill="{CLAY}" {LINE}/>
  <circle cx="203" cy="32" r="2.2" fill="{PEACH}"/>
{chr(10).join(rows)}
  <path d="M232 110L227 126L233 123L236 129L240 112Z" fill="{ORANGE}" {LINE}/>
  <path d="M242 110L247 126L241 123L238 129L234 112Z" fill="{BURNT}" {LINE}/>
  <circle cx="237" cy="104" r="11" fill="{SAFFRON}" {LINE}/>
  <path d="{BUTTA}" transform="translate(230 97)" fill="{BURNT}"/>"""
    svg("optional-test-series", body)


# 7. Mentorship Programme: a lit diya passing its flame to a smaller one.
def mentorship():
    def diya(cx, base, w, fill, rim):
        h = w * 0.36
        return f"""  <path d="M{cx - w / 2} {base - h}Q{cx - w / 2 + 2} {base} {cx} {base}Q{cx + w / 2 - 6} {base} {cx + w / 2 + w * 0.16} {base - h - 3}L{cx + w / 2} {base - h}Z" fill="{fill}" {LINE}/>
  <path d="M{cx - w / 2} {base - h}H{cx + w / 2}" stroke="{rim}" stroke-width="3" stroke-linecap="round"/>
  <path d="M{cx - w * 0.18} {base}h{w * 0.36}l-3 5h{-w * 0.36 + 6}z" fill="{BURNT}" {LINE}/>
  <path d="M{cx - w * 0.28} {base - h * 0.45}c{w * 0.06} 3 {w * 0.18} 3 {w * 0.24} 0M{cx + w * 0.02} {base - h * 0.45}c{w * 0.06} 3 {w * 0.18} 3 {w * 0.24} 0" stroke="{rim}" stroke-width="1.6" stroke-linecap="round"/>"""

    def flame(x, y, s):
        return f"""  <circle cx="{x}" cy="{y - 12 * s}" r="{20 * s}" fill="{SAFFRON}" fill-opacity="0.28"/>
  <path d="M{x} {y - 30 * s}C{x + 9 * s} {y - 18 * s} {x + 10 * s} {y - 6 * s} {x} {y}C{x - 10 * s} {y - 6 * s} {x - 9 * s} {y - 18 * s} {x} {y - 30 * s}Z" fill="{SAFFRON}" stroke="{ORANGE}" stroke-width="1.4"/>
  <path d="M{x} {y - 17 * s}C{x + 4 * s} {y - 11 * s} {x + 4.5 * s} {y - 5 * s} {x} {y - 1.5 * s}C{x - 4.5 * s} {y - 5 * s} {x - 4 * s} {y - 11 * s} {x} {y - 17 * s}Z" fill="#fffbe9"/>"""

    body = f"""{flame(186, 82, 1.25)}
{diya(170, 116, 70, ORANGE, SAFFRON)}
{flame(240, 98, 0.75)}
{diya(232, 117, 42, BURNT, SAFFRON)}
  <circle cx="212" cy="70" r="2" fill="{SAFFRON}"/>
  <circle cx="221" cy="76" r="1.6" fill="{ORANGE}"/>
  <circle cx="229" cy="70" r="1.3" fill="{SAFFRON}"/>"""
    svg("mentorship", body)


# 8. Interview Guidance Programme: the candidate's chair, with the question and the answer above it.
def interview():
    body = f"""  <rect x="178" y="50" width="52" height="52" rx="12" fill="{BURNT}" {LINE}/>
  <rect x="185" y="57" width="38" height="38" rx="8" fill="{ORANGE}"/>
  <path d="M185 76H223" stroke="{BURNT}" stroke-width="1.4" stroke-opacity="0.6"/>
  <path d="M170 100H238L232 110H176Z" fill="{ORANGE}" {LINE}/>
  <path d="M176 110L174 122M232 110L234 122M186 110V120M222 110V120" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>
  <path d="M140 20H174A8 8 0 0 1 182 28V38A8 8 0 0 1 174 46H162L156 53L155 46H140A8 8 0 0 1 132 38V28A8 8 0 0 1 140 20Z" fill="{CREAM}" {LINE}/>
  <path d="M152.5 29.5A4.5 4.5 0 1 1 158.5 33.5C157.4 34.1 157 35 157 36.4" stroke="{BURNT}" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="157" cy="40.6" r="1.4" fill="{BURNT}"/>
  <path d="M201 24H233A8 8 0 0 1 241 32V40A8 8 0 0 1 233 48H225L226 55L219 48H201A8 8 0 0 1 193 40V32A8 8 0 0 1 201 24Z" fill="{SAFFRON}" {LINE}/>
  <path d="M202 33H231M202 39.5H223" stroke="{INK}" stroke-opacity="0.55" stroke-width="1.6" stroke-linecap="round"/>"""
    svg("interview-guidance", body)


for make in (gs_foundation, optional_subject, csat, prelims, mains, optional_test, mentorship, interview):
    make()

# A preview of the cards in their new look: plain paper under the text, ink title (cream on the dark card).
cards = [
    ("gs-foundation", "LEARN", "UPSC GS Foundation Course - PCM", "Classroom · LIVE-Online · 4 courses", True),
    ("optional-subject", "LEARN", "Optional Subject Programme", "Classroom · LIVE-Online · 26 courses", False),
    ("csat", "LEARN", "CSAT Course", "Classroom · LIVE-Online", False),
    ("prelims-test-series", "PRACTISE", "Prelims Test Series", "Classroom · LIVE-Online", False),
    ("mains-test-series", "PRACTISE", "Mains Test Series", "Classroom · LIVE-Online", False),
    ("optional-test-series", "PRACTISE", "Optional Test Series", "Classroom · LIVE-Online", False),
    ("mentorship", "GUIDANCE", "Mentorship Programme", "Classroom · LIVE-Online", False),
    ("interview-guidance", "GUIDANCE", "Interview Guidance Programme", "Classroom · LIVE-Online", False),
]
art = OUT.as_uri()
html = ["""<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:24px;background:#fffaf2;font-family:'Hanken Grotesk','Segoe UI',sans-serif;display:grid;grid-template-columns:repeat(4,308px);gap:16px}
.card{position:relative;width:308px;height:220px;border-radius:16px;overflow:hidden;background:#fff8ec;border:1px solid #eadbc4;box-sizing:border-box;padding:22px;display:flex;flex-direction:column;justify-content:space-between}
.card.dark{background:#3b2416;border:none}
.card img{position:absolute;inset:0;width:308px;height:220px}
.top{position:relative;display:flex;justify-content:space-between;align-items:center}
.chip{font-size:11px;font-weight:700;letter-spacing:.88px;color:#cc5500;background:rgba(229,117,18,.1);border-radius:99px;padding:5px 10px}
.dark .chip{color:#f4c430;background:rgba(255,255,255,.15)}
.knob{width:36px;height:36px;border-radius:50%;background:#ffefd5;display:grid;place-items:center;color:#cc5500;font-weight:700}
.dark .knob{background:#e57512;color:#fff}
.foot{position:relative}
h3{margin:0 0 6px;width:264px;font-size:20px;line-height:1.22;color:#2a1a12;letter-spacing:-.2px}
.dark h3{color:#fff8ec}
p{margin:0;font-size:13px;color:#6b4a3a}.dark p{color:rgba(255,248,236,.82)}
</style>"""]
for name, chip, title, meta, dark in cards:
    html.append(
        f'<div class="card{" dark" if dark else ""}"><img src="{art}/{name}.svg"><div class="top"><span class="chip">✣ {chip}</span><span class="knob">↗</span></div>'
        f'<div class="foot"><h3>{title}</h3><p>{meta}</p></div></div>'
    )
if PREVIEW:
    PREVIEW.mkdir(parents=True, exist_ok=True)
    (PREVIEW / "preview.html").write_text("".join(html), encoding="utf-8")
print("wrote", len(cards), "illustrations to", OUT)
