"""
Generate a PDF of all LiD Master questions and answers.
Includes 300 general questions (by topic) + 160 state-specific questions.
Each question shows both German and English text, options, and marks the correct answer.
"""

import json
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# ── Paths ──────────────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH   = os.path.join(SCRIPT_DIR, "../src/data/questions.json")
OUT_PATH    = os.path.join(SCRIPT_DIR, "../LiD-Master-Questions.pdf")

# ── Colours ────────────────────────────────────────────────────────────────────
BLUE        = colors.HexColor("#2563EB")
LIGHT_BLUE  = colors.HexColor("#EFF6FF")
GREEN       = colors.HexColor("#16A34A")
LIGHT_GREEN = colors.HexColor("#F0FDF4")
AMBER       = colors.HexColor("#D97706")
LIGHT_AMBER = colors.HexColor("#FFFBEB")
PURPLE      = colors.HexColor("#7C3AED")
LIGHT_PURPLE= colors.HexColor("#F5F3FF")
ROSE        = colors.HexColor("#E11D48")
LIGHT_ROSE  = colors.HexColor("#FFF1F2")
GREY        = colors.HexColor("#6B7280")
LIGHT_GREY  = colors.HexColor("#F9FAFB")
MID_GREY    = colors.HexColor("#E5E7EB")
DARK        = colors.HexColor("#111827")

TOPIC_META = {
    "politik":      {"label": "Politik",      "color": BLUE,   "bg": LIGHT_BLUE},
    "geschichte":   {"label": "Geschichte",   "color": AMBER,  "bg": LIGHT_AMBER},
    "gesellschaft": {"label": "Gesellschaft", "color": PURPLE, "bg": LIGHT_PURPLE},
}

PAGE_W, PAGE_H = A4
LEFT_M = RIGHT_M = 18 * mm
TOP_M  = BOTTOM_M = 20 * mm
CONTENT_W = PAGE_W - LEFT_M - RIGHT_M

# ── Styles ─────────────────────────────────────────────────────────────────────
base_styles = getSampleStyleSheet()

def S(name, **kw):
    return ParagraphStyle(name, **kw)

style_cover_title = S("CoverTitle",
    fontName="Helvetica-Bold", fontSize=32, leading=40,
    textColor=DARK, alignment=TA_CENTER)

style_cover_sub = S("CoverSub",
    fontName="Helvetica", fontSize=14, leading=20,
    textColor=GREY, alignment=TA_CENTER)

style_cover_meta = S("CoverMeta",
    fontName="Helvetica", fontSize=11, leading=16,
    textColor=GREY, alignment=TA_CENTER)

style_section_title = S("SectionTitle",
    fontName="Helvetica-Bold", fontSize=18, leading=24,
    textColor=colors.white)

style_topic_title = S("TopicTitle",
    fontName="Helvetica-Bold", fontSize=14, leading=20,
    textColor=colors.white)

style_q_number = S("QNumber",
    fontName="Helvetica-Bold", fontSize=9, leading=12,
    textColor=GREY)

style_q_de = S("QDE",
    fontName="Helvetica-Bold", fontSize=10, leading=14,
    textColor=DARK)

style_q_en = S("QEN",
    fontName="Helvetica-Oblique", fontSize=9, leading=13,
    textColor=GREY)

style_option = S("Option",
    fontName="Helvetica", fontSize=9.5, leading=13,
    textColor=DARK)

style_option_correct = S("OptionCorrect",
    fontName="Helvetica-Bold", fontSize=9.5, leading=13,
    textColor=GREEN)

style_toc_item = S("TocItem",
    fontName="Helvetica", fontSize=11, leading=16, textColor=DARK)

style_toc_header = S("TocHeader",
    fontName="Helvetica-Bold", fontSize=13, leading=18, textColor=DARK)


# ── Helpers ────────────────────────────────────────────────────────────────────
OPTION_LETTERS = ["A", "B", "C", "D"]

def make_question_block(q_num, q, topic_color=BLUE):
    """Return a list of flowables for one question."""
    items = []

    de_text  = q.get("question", "")
    en_text  = q.get("question_en", "")
    options  = q.get("options", [])
    opts_en  = q.get("options_en", [])
    correct  = q.get("correctAnswer", -1)

    # ── Card background via Table trick ───────────────────────────────────────
    # Build inner content as a list of rows for a single-col table (card)
    rows = []

    # Question number badge + question text
    badge_text = f"Q{q_num}"
    rows.append([Paragraph(badge_text, style_q_number)])
    rows.append([Paragraph(de_text, style_q_de)])
    if en_text and en_text != de_text:
        rows.append([Paragraph(en_text, style_q_en)])
    rows.append([Spacer(1, 4)])

    # Options
    for i, (opt_de, opt_en) in enumerate(zip(options, opts_en)):
        letter = OPTION_LETTERS[i]
        is_correct = (i == correct)

        marker = "✓ " if is_correct else f"{letter}.  "
        de_str = f"{marker}{opt_de}"
        en_str = f"     {opt_en}"

        if is_correct:
            opt_style = style_option_correct
            bg_col = LIGHT_GREEN
        else:
            opt_style = style_option
            bg_col = colors.white

        opt_inner = Table(
            [[Paragraph(de_str, opt_style)],
             [Paragraph(en_str, S("OptEnSub", fontName="Helvetica-Oblique",
                                   fontSize=8.5, leading=11,
                                   textColor=GREEN if is_correct else GREY))]],
            colWidths=[CONTENT_W - 12*mm],
        )
        opt_inner.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), bg_col),
            ("LEFTPADDING",  (0,0), (-1,-1), 6),
            ("RIGHTPADDING", (0,0), (-1,-1), 6),
            ("TOPPADDING",   (0,0), (-1,-1), 3),
            ("BOTTOMPADDING",(0,0), (-1,-1), 3),
            ("ROUNDEDCORNERS", [4]),
        ]))
        rows.append([opt_inner])
        rows.append([Spacer(1, 2)])

    card = Table(rows, colWidths=[CONTENT_W - 6*mm])
    card.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), LIGHT_GREY),
        ("BOX",           (0,0), (-1,-1), 0.5, MID_GREY),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("ROUNDEDCORNERS", [6]),
    ]))

    # Left accent stripe (1px coloured column)
    outer = Table([[" ", card]], colWidths=[3*mm, CONTENT_W - 3*mm])
    outer.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (0,-1), topic_color),
        ("LEFTPADDING",   (0,0), (-1,-1), 0),
        ("RIGHTPADDING",  (0,0), (-1,-1), 0),
        ("TOPPADDING",    (0,0), (-1,-1), 0),
        ("BOTTOMPADDING", (0,0), (-1,-1), 0),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))

    items.append(KeepTogether([outer, Spacer(1, 6)]))
    return items


def section_header(title, color, subtitle=""):
    """Full-width coloured section divider."""
    inner = [Paragraph(title, style_section_title)]
    if subtitle:
        inner.append(Paragraph(subtitle, S("SecSub",
            fontName="Helvetica", fontSize=11, leading=14,
            textColor=colors.Color(1,1,1,0.75))))
    t = Table([[inner]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), color),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 12),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("ROUNDEDCORNERS", [8]),
    ]))
    return [t, Spacer(1, 8)]


def topic_header(topic_key, count):
    meta = TOPIC_META.get(topic_key, {"label": topic_key, "color": GREY, "bg": LIGHT_GREY})
    label = meta["label"]
    color = meta["color"]
    inner = [Paragraph(f"{label}  ·  {count} questions", style_topic_title)]
    t = Table([[inner]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), color),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("ROUNDEDCORNERS", [6]),
    ]))
    return [t, Spacer(1, 6)]


def page_header_footer(canvas, doc):
    """Running header / footer on every page."""
    canvas.saveState()
    w, h = A4

    # Header line
    canvas.setStrokeColor(MID_GREY)
    canvas.setLineWidth(0.5)
    canvas.line(LEFT_M, h - TOP_M + 4*mm, w - RIGHT_M, h - TOP_M + 4*mm)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(DARK)
    canvas.drawString(LEFT_M, h - TOP_M + 6*mm, "LiD Master — German Citizenship Test")
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(GREY)
    canvas.drawRightString(w - RIGHT_M, h - TOP_M + 6*mm, "Leben in Deutschland Einbürgerungstest")

    # Footer
    canvas.setStrokeColor(MID_GREY)
    canvas.line(LEFT_M, BOTTOM_M - 4*mm, w - RIGHT_M, BOTTOM_M - 4*mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(GREY)
    canvas.drawCentredString(w/2, BOTTOM_M - 9*mm, f"Page {doc.page}")
    canvas.restoreState()


# ── Build story ────────────────────────────────────────────────────────────────
def build_story(data):
    story = []

    # ── Cover page ─────────────────────────────────────────────────────────────
    story.append(Spacer(1, 40*mm))
    story.append(Paragraph("LiD Master", style_cover_title))
    story.append(Spacer(1, 6))
    story.append(Paragraph("German Citizenship Test — Complete Question Bank", style_cover_sub))
    story.append(Spacer(1, 10*mm))

    # Stats boxes
    general_count = len(data["general"])
    state_count   = sum(len(v) for v in data["states"].values())
    total         = general_count + state_count
    meta_rows = [[
        Paragraph(f"<b>{general_count}</b><br/>General Questions", style_cover_meta),
        Paragraph(f"<b>{state_count}</b><br/>State-Specific Questions", style_cover_meta),
        Paragraph(f"<b>{total}</b><br/>Total Questions", style_cover_meta),
    ]]
    meta_t = Table(meta_rows, colWidths=[CONTENT_W/3]*3)
    meta_t.setStyle(TableStyle([
        ("ALIGN",  (0,0), (-1,-1), "CENTER"),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("BOX",    (0,0), (0,0), 0.5, MID_GREY),
        ("BOX",    (1,0), (1,0), 0.5, MID_GREY),
        ("BOX",    (2,0), (2,0), 0.5, MID_GREY),
        ("BACKGROUND", (0,0), (0,0), LIGHT_BLUE),
        ("BACKGROUND", (1,0), (1,0), LIGHT_ROSE),
        ("BACKGROUND", (2,0), (2,0), LIGHT_GREEN),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("ROUNDEDCORNERS", [6]),
    ]))
    story.append(meta_t)
    story.append(Spacer(1, 8*mm))
    story.append(Paragraph(
        "Each question is shown in German and English.<br/>"
        "The correct answer is highlighted in green.",
        style_cover_meta))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph(
        f"Version {data.get('metadata', {}).get('version', '2025')}",
        style_cover_meta))
    story.append(PageBreak())

    # ── Part 1: General Questions ───────────────────────────────────────────────
    story += section_header(
        "Part 1 — General Questions",
        BLUE,
        f"{general_count} questions across Politik, Geschichte and Gesellschaft"
    )

    topic_order = ["politik", "geschichte", "gesellschaft"]
    by_topic = {t: [] for t in topic_order}
    for q in data["general"]:
        t = q.get("topic", "")
        if t in by_topic:
            by_topic[t].append(q)

    q_num = 1
    for topic in topic_order:
        qs = by_topic[topic]
        if not qs:
            continue
        meta = TOPIC_META[topic]
        story += topic_header(topic, len(qs))
        for q in qs:
            story += make_question_block(q_num, q, topic_color=meta["color"])
            q_num += 1
        story.append(Spacer(1, 4))

    # ── Part 2: State-Specific Questions ───────────────────────────────────────
    story.append(PageBreak())
    story += section_header(
        "Part 2 — State-Specific Questions",
        ROSE,
        f"{len(data['states'])} Bundesländer · 10 questions each"
    )

    for state_name, qs in data["states"].items():
        story.append(Spacer(1, 4))
        # State header
        state_t = Table(
            [[Paragraph(state_name, style_topic_title)]],
            colWidths=[CONTENT_W]
        )
        state_t.setStyle(TableStyle([
            ("BACKGROUND",    (0,0), (-1,-1), ROSE),
            ("LEFTPADDING",   (0,0), (-1,-1), 10),
            ("TOPPADDING",    (0,0), (-1,-1), 8),
            ("BOTTOMPADDING", (0,0), (-1,-1), 8),
            ("ROUNDEDCORNERS", [6]),
        ]))
        story.append(state_t)
        story.append(Spacer(1, 6))

        for i, q in enumerate(qs, 1):
            story += make_question_block(i, q, topic_color=ROSE)

        story.append(PageBreak())

    return story


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    print("Reading questions.json …")
    with open(DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)

    print(f"  General: {len(data['general'])} questions")
    print(f"  States:  {sum(len(v) for v in data['states'].values())} questions")

    print("Building PDF …")
    doc = SimpleDocTemplate(
        OUT_PATH,
        pagesize=A4,
        leftMargin=LEFT_M,
        rightMargin=RIGHT_M,
        topMargin=TOP_M + 6*mm,
        bottomMargin=BOTTOM_M + 4*mm,
        title="LiD Master — German Citizenship Test Question Bank",
        author="LiD Master",
        subject="Leben in Deutschland Einbürgerungstest",
    )

    story = build_story(data)
    doc.build(story, onFirstPage=page_header_footer, onLaterPages=page_header_footer)
    print(f"Done! Saved to: {OUT_PATH}")


if __name__ == "__main__":
    main()
