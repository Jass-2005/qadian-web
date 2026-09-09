# -*- coding: utf-8 -*-
"""
Generate Master Analysis Excel Workbook and Word Document for 18-Qadian:
Focusing on AAP & INC booth-level categorization:
- Won Both Times (Stronghold) [Green]
- Gained in 2024 (Flipped In) [Blue]
- Lost in 2024 (Flipped Away) [Red]
- Weak Booth (< 20% Vote Share) [Yellow]
- Lost Both Times (Deficit) [Gray]
"""

import sys
import codecs
sys.stdout.reconfigure(encoding='utf-8')

import json
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# 1. Load data
with open('qadian_comparison_data.json', 'r', encoding='utf-8') as f:
    payload = json.load(f)

booths = payload['booths']
summary = payload['summary']

print(f'Loaded {len(booths)} booths from qadian_comparison_data.json')

# ==============================================================================
# PART 1: MASTER EXCEL WORKBOOK (Qadian_Master_Booth_Analysis_AAP_INC.xlsx)
# ==============================================================================
wb = openpyxl.Workbook()

# Styling tokens
font_title = Font(name="Calibri", size=14, bold=True, color="1F4E79")
font_subtitle = Font(name="Calibri", size=10, italic=True, color="595959")
font_header = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
font_data = Font(name="Calibri", size=10)
font_bold = Font(name="Calibri", size=10, bold=True)
font_total = Font(name="Calibri", size=10, bold=True)

fill_header_navy = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
fill_header_aap = PatternFill(start_color="B28900", end_color="B28900", fill_type="solid") # Gold/Amber
fill_header_inc = PatternFill(start_color="0F766E", end_color="0F766E", fill_type="solid") # Teal/Emerald
fill_zebra = PatternFill(start_color="F9FAFB", end_color="F9FAFB", fill_type="solid")

# Status Highlight Fills
fill_status_won_both = PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid") # Light Green
fill_status_gained = PatternFill(start_color="BDD7EE", end_color="BDD7EE", fill_type="solid")   # Light Blue
fill_status_lost_24 = PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid")  # Light Red
fill_status_weak = PatternFill(start_color="FFEB9C", end_color="FFEB9C", fill_type="solid")     # Light Yellow
fill_status_lost_both = PatternFill(start_color="E7E6E6", end_color="E7E6E6", fill_type="solid")# Light Gray

font_status_won_both = Font(name="Calibri", size=10, bold=True, color="276A3C")
font_status_gained = Font(name="Calibri", size=10, bold=True, color="1B4F72")
font_status_lost_24 = Font(name="Calibri", size=10, bold=True, color="9C0006")
font_status_weak = Font(name="Calibri", size=10, bold=True, color="9C6500")
font_status_lost_both = Font(name="Calibri", size=10, color="595959")

thin_gray = Side(border_style="thin", color="D9D9D9")
double_bottom = Side(border_style="double", color="1F4E79")
thick_bottom = Side(border_style="medium", color="1F4E79")
border_cell = Border(left=thin_gray, right=thin_gray, top=thin_gray, bottom=thin_gray)
border_total = Border(left=thin_gray, right=thin_gray, top=thin_gray, bottom=double_bottom)

# Helper function to classify AAP booth status
def get_aap_classification(b):
    w22 = b['data_2022']['winner_party']
    w24 = b['data_2024']['winner_party']
    pct24 = b['data_2024']['aap_pct']
    tot24 = b['data_2024']['total']

    if tot24 == 0:
        return ('No Polling in 2024', fill_status_lost_both, font_status_lost_both)
    if w22 == 'AAP' and w24 == 'AAP':
        return ('Won Both Times (Stronghold)', fill_status_won_both, font_status_won_both)
    if w22 != 'AAP' and w24 == 'AAP':
        return ('Gained in 2024 (New Win)', fill_status_gained, font_status_gained)
    if w22 == 'AAP' and w24 != 'AAP':
        return (f'Lost in 2024 (to {w24})', fill_status_lost_24, font_status_lost_24)
    if pct24 < 20.0:
        return ('Weak Booth (< 20% Share)', fill_status_weak, font_status_weak)
    return ('Lost Both Times (Deficit)', fill_status_lost_both, font_status_lost_both)

# Helper function to classify INC booth status
def get_inc_classification(b):
    w22 = b['data_2022']['winner_party']
    w24 = b['data_2024']['winner_party']
    pct24 = b['data_2024']['inc_pct']
    tot24 = b['data_2024']['total']

    if tot24 == 0:
        return ('No Polling in 2024', fill_status_lost_both, font_status_lost_both)
    if w22 == 'INC' and w24 == 'INC':
        return ('Won Both Times (Stronghold)', fill_status_won_both, font_status_won_both)
    if w22 != 'INC' and w24 == 'INC':
        return ('Gained in 2024 (New Win)', fill_status_gained, font_status_gained)
    if w22 == 'INC' and w24 != 'INC':
        return (f'Lost in 2024 (to {w24})', fill_status_lost_24, font_status_lost_24)
    if pct24 < 20.0:
        return ('Weak Booth (< 20% Share)', fill_status_weak, font_status_weak)
    return ('Lost Both Times (Deficit)', fill_status_lost_both, font_status_lost_both)

# -------------------------------------------------------------
# SHEET 1: AAP Master Booth Analysis
# -------------------------------------------------------------
ws1 = wb.active
ws1.title = "AAP Master Analysis"
ws1.views.sheetView[0].showGridLines = True

headers_aap = [
    'Booth No',
    'Village / Polling Station (English)',
    'Village Name (Punjabi)',
    'AAP Status Category',
    '2022 AAP Votes',
    '2022 AAP %',
    '2022 Winner',
    '2024 AAP Votes',
    '2024 AAP %',
    '2024 Winner',
    'Vote Shift (+/-)',
    'Swing % (+/-)',
    '2024 Margin',
    '2024 Total Polled'
]

ws1.append(headers_aap)
ws1.row_dimensions[1].height = 28
for col_num in range(1, len(headers_aap) + 1):
    cell = ws1.cell(row=1, column=col_num)
    cell.font = font_header
    cell.fill = fill_header_aap
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.border = Border(left=thin_gray, right=thin_gray, top=thin_gray, bottom=thick_bottom)

for idx, b in enumerate(booths, start=2):
    status_text, status_fill, status_font = get_aap_classification(b)
    diff = b['data_2024']['aap'] - b['data_2022']['aap']
    swing = round(b['data_2024']['aap_pct'] - b['data_2022']['aap_pct'], 2)
    
    row_vals = [
        b['booth_no'],
        b['village_english'],
        b['village_punjabi'],
        status_text,
        b['data_2022']['aap'],
        f"={b['data_2022']['aap']}/{b['data_2022']['total']}",
        b['data_2022']['winner_party'],
        b['data_2024']['aap'],
        f"={b['data_2024']['aap']}/{b['data_2024']['total']}" if b['data_2024']['total'] > 0 else 0,
        b['data_2024']['winner_party'],
        diff,
        f"=I{idx}-F{idx}",
        b['data_2024']['margin'],
        b['data_2024']['total']
    ]
    ws1.append(row_vals)
    ws1.row_dimensions[idx].height = 20

    is_even = (idx % 2 == 0)
    c_fill = fill_zebra if is_even else PatternFill(fill_type=None)

    for c_idx in range(1, len(row_vals) + 1):
        c = ws1.cell(row=idx, column=c_idx)
        c.font = font_data
        c.border = border_cell
        c.fill = c_fill

        if c_idx == 1:
            c.alignment = Alignment(horizontal="center", vertical="center")
            c.number_format = "0"
        elif c_idx in (2, 3):
            c.alignment = Alignment(horizontal="left", vertical="center")
        elif c_idx == 4:
            # Status badge with custom coloring
            c.fill = status_fill
            c.font = status_font
            c.alignment = Alignment(horizontal="left", vertical="center")
        elif c_idx in (5, 8, 11, 13, 14):
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "#,##0"
        elif c_idx in (6, 9):
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "0.0%"
        elif c_idx in (7, 10):
            c.alignment = Alignment(horizontal="center", vertical="center")
            c.font = font_bold
        elif c_idx == 12:
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "+0.0%;-0.0%;0.0%"

# Total row
tot_row_aap = len(booths) + 2
tot_vals_aap = [
    'TOTAL', f'{len(booths)} Booths', 'Constituency Total', 'AAP Summary',
    f'=SUM(E2:E{tot_row_aap-1})', f'=E{tot_row_aap}/SUM(N2:N{tot_row_aap-1})', 'Bajwa Won',
    f'=SUM(H2:H{tot_row_aap-1})', f'=H{tot_row_aap}/SUM(N2:N{tot_row_aap-1})', 'Randhawa Won',
    f'=H{tot_row_aap}-E{tot_row_aap}', f'=I{tot_row_aap}-F{tot_row_aap}',
    f'=SUM(M2:M{tot_row_aap-1})', f'=SUM(N2:N{tot_row_aap-1})'
]
ws1.append(tot_vals_aap)
ws1.row_dimensions[tot_row_aap].height = 24
for c_idx in range(1, len(tot_vals_aap) + 1):
    c = ws1.cell(row=tot_row_aap, column=c_idx)
    c.font = font_total
    c.border = border_total
    c.fill = PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid") # Soft gold
    if c_idx in (5, 8, 11, 13, 14):
        c.alignment = Alignment(horizontal="right", vertical="center")
        c.number_format = "#,##0"
    elif c_idx in (6, 9):
        c.alignment = Alignment(horizontal="right", vertical="center")
        c.number_format = "0.0%"
    elif c_idx == 12:
        c.alignment = Alignment(horizontal="right", vertical="center")
        c.number_format = "+0.0%;-0.0%;0.0%"
    else:
        c.alignment = Alignment(horizontal="center", vertical="center")

ws1.freeze_panes = "D2"

# -------------------------------------------------------------
# SHEET 2: INC Master Booth Analysis
# -------------------------------------------------------------
ws2 = wb.create_sheet(title="INC Master Analysis")
ws2.views.sheetView[0].showGridLines = True

headers_inc = [
    'Booth No',
    'Village / Polling Station (English)',
    'Village Name (Punjabi)',
    'INC Status Category',
    '2022 INC Votes',
    '2022 INC %',
    '2022 Winner',
    '2024 INC Votes',
    '2024 INC %',
    '2024 Winner',
    'Vote Shift (+/-)',
    'Swing % (+/-)',
    '2024 Margin',
    '2024 Total Polled'
]

ws2.append(headers_inc)
ws2.row_dimensions[1].height = 28
for col_num in range(1, len(headers_inc) + 1):
    cell = ws2.cell(row=1, column=col_num)
    cell.font = font_header
    cell.fill = fill_header_inc
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.border = Border(left=thin_gray, right=thin_gray, top=thin_gray, bottom=thick_bottom)

for idx, b in enumerate(booths, start=2):
    status_text, status_fill, status_font = get_inc_classification(b)
    diff = b['data_2024']['inc'] - b['data_2022']['inc']
    
    row_vals = [
        b['booth_no'],
        b['village_english'],
        b['village_punjabi'],
        status_text,
        b['data_2022']['inc'],
        f"={b['data_2022']['inc']}/{b['data_2022']['total']}",
        b['data_2022']['winner_party'],
        b['data_2024']['inc'],
        f"={b['data_2024']['inc']}/{b['data_2024']['total']}" if b['data_2024']['total'] > 0 else 0,
        b['data_2024']['winner_party'],
        diff,
        f"=I{idx}-F{idx}",
        b['data_2024']['margin'],
        b['data_2024']['total']
    ]
    ws2.append(row_vals)
    ws2.row_dimensions[idx].height = 20

    is_even = (idx % 2 == 0)
    c_fill = fill_zebra if is_even else PatternFill(fill_type=None)

    for c_idx in range(1, len(row_vals) + 1):
        c = ws2.cell(row=idx, column=c_idx)
        c.font = font_data
        c.border = border_cell
        c.fill = c_fill

        if c_idx == 1:
            c.alignment = Alignment(horizontal="center", vertical="center")
            c.number_format = "0"
        elif c_idx in (2, 3):
            c.alignment = Alignment(horizontal="left", vertical="center")
        elif c_idx == 4:
            c.fill = status_fill
            c.font = status_font
            c.alignment = Alignment(horizontal="left", vertical="center")
        elif c_idx in (5, 8, 11, 13, 14):
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "#,##0"
        elif c_idx in (6, 9):
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "0.0%"
        elif c_idx in (7, 10):
            c.alignment = Alignment(horizontal="center", vertical="center")
            c.font = font_bold
        elif c_idx == 12:
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "+0.0%;-0.0%;0.0%"

# Total row sheet 2
tot_row_inc = len(booths) + 2
tot_vals_inc = [
    'TOTAL', f'{len(booths)} Booths', 'Constituency Total', 'INC Summary',
    f'=SUM(E2:E{tot_row_inc-1})', f'=E{tot_row_inc}/SUM(N2:N{tot_row_inc-1})', 'Bajwa Won',
    f'=SUM(H2:H{tot_row_inc-1})', f'=H{tot_row_inc}/SUM(N2:N{tot_row_inc-1})', 'Randhawa Won',
    f'=H{tot_row_inc}-E{tot_row_inc}', f'=I{tot_row_inc}-F{tot_row_inc}',
    f'=SUM(M2:M{tot_row_inc-1})', f'=SUM(N2:N{tot_row_inc-1})'
]
ws2.append(tot_vals_inc)
ws2.row_dimensions[tot_row_inc].height = 24
for c_idx in range(1, len(tot_vals_inc) + 1):
    c = ws2.cell(row=tot_row_inc, column=c_idx)
    c.font = font_total
    c.border = border_total
    c.fill = PatternFill(start_color="D1FAE5", end_color="D1FAE5", fill_type="solid") # Soft emerald
    if c_idx in (5, 8, 11, 13, 14):
        c.alignment = Alignment(horizontal="right", vertical="center")
        c.number_format = "#,##0"
    elif c_idx in (6, 9):
        c.alignment = Alignment(horizontal="right", vertical="center")
        c.number_format = "0.0%"
    elif c_idx == 12:
        c.alignment = Alignment(horizontal="right", vertical="center")
        c.number_format = "+0.0%;-0.0%;0.0%"
    else:
        c.alignment = Alignment(horizontal="center", vertical="center")

ws2.freeze_panes = "D2"

# -------------------------------------------------------------
# SHEET 3: AAP Breakdown by Category (Tables)
# -------------------------------------------------------------
ws3 = wb.create_sheet(title="AAP Strategy & Booth Clusters")
ws3.views.sheetView[0].showGridLines = True

# Title
ws3.cell(row=1, column=1, value="AAP (AAM AADMI PARTY) - STRATEGIC BOOTH CLUSTERS").font = font_title
ws3.cell(row=2, column=1, value="Breakdown of Strongholds, Flipped Gains, At-Risk Losses, and Weak Booths").font = font_subtitle

# Summary Counts Table
summary_data_aap = [
    ("Won Both Times (Strongholds)", 18, "Consistently held in 2022 & 2024", fill_status_won_both, font_status_won_both),
    ("Gained in 2024 (Flipped in favor)", 63, "Won in 2024, previously held by INC or SAD", fill_status_gained, font_status_gained),
    ("Lost in 2024 (Flipped away)", 39, "Won in 2022, lost to INC/BJP in 2024", fill_status_lost_24, font_status_lost_24),
    ("Weak Booths (< 20% Vote Share)", 31, "Critically low support base in 2024", fill_status_weak, font_status_weak),
    ("Lost Both Times (Deficit)", 103, "Opponent bastions in both elections", fill_status_lost_both, font_status_lost_both),
]

cat_headers = ["Category", "Booth Count", "Strategic Takeaway"]
for col_idx, h in enumerate(cat_headers, start=1):
    c = ws3.cell(row=4, column=col_idx, value=h)
    c.font = font_header
    c.fill = fill_header_aap
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border = border_cell

for r_idx, (cat_name, count, note, fill_style, font_style) in enumerate(summary_data_aap, start=5):
    c1 = ws3.cell(row=r_idx, column=1, value=cat_name)
    c2 = ws3.cell(row=r_idx, column=2, value=count)
    c3 = ws3.cell(row=r_idx, column=3, value=note)

    c1.fill = fill_style
    c1.font = font_style
    c2.fill = fill_style
    c2.font = font_style
    c2.alignment = Alignment(horizontal="center", vertical="center")
    c3.font = font_data
    c3.border = border_cell
    c1.border = border_cell
    c2.border = border_cell

# Top Strongholds List for AAP
ws3.cell(row=12, column=1, value="Top 15 AAP Strongholds (Highest Votes in 2024)").font = font_bold
headers_top = ["Booth No", "Village (English)", "Village (Punjabi)", "2024 AAP Votes", "2024 AAP Share %", "2024 Margin", "2022 Result"]
for col_idx, h in enumerate(headers_top, start=1):
    c = ws3.cell(row=13, column=col_idx, value=h)
    c.font = font_header
    c.fill = fill_header_navy
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border = border_cell

sorted_aap_strong = sorted(booths, key=lambda x: x['data_2024']['aap'], reverse=True)[:15]
for r_idx, b in enumerate(sorted_aap_strong, start=14):
    row_v = [
        b['booth_no'],
        b['village_english'],
        b['village_punjabi'],
        b['data_2024']['aap'],
        f"{b['data_2024']['aap_pct']}%",
        f"+{b['data_2024']['margin']} lead",
        f"{b['data_2022']['winner_party']} (+{b['data_2022']['margin']})"
    ]
    for col_idx, val in enumerate(row_v, start=1):
        c = ws3.cell(row=r_idx, column=col_idx, value=val)
        c.font = font_data
        c.border = border_cell
        if col_idx in (1, 4, 5, 6, 7):
            c.alignment = Alignment(horizontal="center", vertical="center")
        else:
            c.alignment = Alignment(horizontal="left", vertical="center")

# Weakest Booths List for AAP
ws3.cell(row=31, column=1, value="Top 15 Weakest Booths for AAP in 2024 (< 20% Vote Share)").font = font_bold
headers_weak = ["Booth No", "Village (English)", "Village (Punjabi)", "2024 AAP Votes", "2024 AAP Share %", "2024 Winner", "Winner Margin"]
for col_idx, h in enumerate(headers_weak, start=1):
    c = ws3.cell(row=32, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color="9C0006", end_color="9C0006", fill_type="solid")
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border = border_cell

sorted_aap_weak = sorted([b for b in booths if b['data_2024']['total'] > 0], key=lambda x: x['data_2024']['aap_pct'])[:15]
for r_idx, b in enumerate(sorted_aap_weak, start=33):
    row_v = [
        b['booth_no'],
        b['village_english'],
        b['village_punjabi'],
        b['data_2024']['aap'],
        f"{b['data_2024']['aap_pct']}%",
        b['data_2024']['winner_party'],
        f"-{b['data_2024']['margin']} deficit"
    ]
    for col_idx, val in enumerate(row_v, start=1):
        c = ws3.cell(row=r_idx, column=col_idx, value=val)
        c.font = font_data
        c.border = border_cell
        if col_idx in (1, 4, 5, 6, 7):
            c.alignment = Alignment(horizontal="center", vertical="center")
        else:
            c.alignment = Alignment(horizontal="left", vertical="center")

# Auto-fit column widths across all sheets
for ws in wb.worksheets:
    for col in ws.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            val_str = str(cell.value or '')
            max_len = max(max_len, len(val_str))
        ws.column_dimensions[col_letter].width = max(max_len + 3, 11)

# Specific custom widths
ws1.column_dimensions['A'].width = 10
ws1.column_dimensions['B'].width = 30
ws1.column_dimensions['C'].width = 30
ws1.column_dimensions['D'].width = 28
ws1.column_dimensions['K'].width = 14
ws1.column_dimensions['L'].width = 14

ws2.column_dimensions['A'].width = 10
ws2.column_dimensions['B'].width = 30
ws2.column_dimensions['C'].width = 30
ws2.column_dimensions['D'].width = 28
ws2.column_dimensions['K'].width = 14
ws2.column_dimensions['L'].width = 14

ws3.column_dimensions['A'].width = 32
ws3.column_dimensions['B'].width = 28
ws3.column_dimensions['C'].width = 32

wb.save('Qadian_Master_Booth_Analysis_AAP_INC.xlsx')
print('Successfully generated Qadian_Master_Booth_Analysis_AAP_INC.xlsx!')

# ==============================================================================
# PART 2: WORD DOCUMENT (Qadian_Master_Booth_Analysis_AAP.docx)
# ==============================================================================
doc_word = docx.Document()

# Set page margins
for section in doc_word.sections:
    section.top_margin = Inches(0.75)
    section.bottom_margin = Inches(0.75)
    section.left_margin = Inches(0.75)
    section.right_margin = Inches(0.75)

# Helper XML cell shading
def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

# Document Header
title_p = doc_word.add_paragraph()
title_run = title_p.add_run("18-QADIAN CONSTITUENCY: BOOTH-LEVEL ELECTION INTELLIGENCE REPORT")
title_run.font.name = "Arial"
title_run.font.size = Pt(16)
title_run.font.bold = True
title_run.font.color.rgb = RGBColor(31, 78, 121)

sub_p = doc_word.add_paragraph()
sub_run = sub_p.add_run("Comparative Analysis: 2022 Assembly Election vs 2024 Lok Sabha Parliamentary Election\nFocus: AAP (Aam Aadmi Party) & INC (Congress) Booth-by-Booth Categorization")
sub_run.font.name = "Arial"
sub_run.font.size = Pt(10)
sub_run.font.italic = True
sub_run.font.color.rgb = RGBColor(89, 89, 89)

doc_word.add_heading("1. Executive Summary & Constituency Dynamics", level=1)

p1 = doc_word.add_paragraph(
    "In the 2024 Parliamentary elections, 18-Qadian (part of Gurdaspur PC) witnessed significant electoral shifts compared to 2022. "
    "Overall voter turnout contracted by 12,427 votes (-9.46%), dropping from 131,418 votes in 2022 to 118,991 votes in 2024. "
    "While Congress (INC) retained the overall lead in both elections, its victory margin narrowed from +6,991 votes (Partap Singh Bajwa in 2022) "
    "to +3,152 votes (Sukhjinder Singh Randhawa in 2024). Concurrently, AAP expanded its booth footprint from 57 booth wins in 2022 to 81 booth wins in 2024 (+24 booths), "
    "while BJP made unprecedented inroads, capturing 25 booths primarily in urban Dhariwal and Qadian town wards."
)

# Table 1: Constituency Totals
t1 = doc_word.add_table(rows=1, cols=5)
t1.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = t1.rows[0].cells
hdr_titles = ["Party", "2022 Assembly Votes", "2022 Share", "2024 Lok Sabha Votes", "2024 Share"]
for idx, title in enumerate(hdr_titles):
    hdr_cells[idx].text = title
    set_cell_background(hdr_cells[idx], "1F4E79")
    hdr_cells[idx].paragraphs[0].runs[0].font.bold = True
    hdr_cells[idx].paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)

t1_rows = [
    ("INC (Congress)", "48,116", "36.61%", "41,806", "35.13%"),
    ("AAP (Aam Aadmi Party)", "41,125", "31.30%", "38,654", "32.48%"),
    ("SAD (Akali Dal)", "34,195", "26.02%", "15,568", "13.08%"),
    ("BJP (Bharatiya Janata Party)", "—", "—", "12,959", "10.89%"),
    ("Others & NOTA", "7,982", "6.07%", "10,004", "8.41%"),
    ("TOTAL POLLED", "131,418", "100.0%", "118,991", "100.0%")
]

for r_data in t1_rows:
    row_c = t1.add_row().cells
    for i, val in enumerate(r_data):
        row_c[i].text = val
        if r_data[0] == "TOTAL POLLED":
            set_cell_background(row_c[i], "D9E1F2")
            row_c[i].paragraphs[0].runs[0].font.bold = True

doc_word.add_paragraph().paragraph_format.space_after = Pt(12)

# Section 2: AAP Deep-Dive
doc_word.add_heading("2. AAP (Aam Aadmi Party) Booth-Level Categorization", level=1)

p_aap = doc_word.add_paragraph(
    "All 223 booths in Qadian have been categorized into 5 distinct operational groups to guide field strategy, "
    "retention efforts, and vulnerability management:"
)

t_aap_cat = doc_word.add_table(rows=1, cols=4)
t_aap_cat.alignment = WD_TABLE_ALIGNMENT.CENTER
h_cells = t_aap_cat.rows[0].cells
h_vals = ["Classification Category", "Booths Count", "Vote Share Profile", "Strategic Assessment"]
for idx, title in enumerate(h_vals):
    h_cells[idx].text = title
    set_cell_background(h_cells[idx], "B28900") # AAP Gold
    h_cells[idx].paragraphs[0].runs[0].font.bold = True
    h_cells[idx].paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)

aap_cat_data = [
    ("Won Both Times (Stronghold)", "18 Booths", "> 45% Share in '22 & '24", "Solid AAP fortresses (Chhotepur, Allowal, Sohal, Bhikari Harni). Must protect and nurture local leadership."),
    ("Gained in 2024 (Flipped In)", "63 Booths", "Rural expansion", "Major surge areas flipped from INC (40 booths) and SAD (23 booths). High priority for consolidating grassroot base."),
    ("Lost in 2024 (Flipped Away)", "39 Booths", "Deficit swing to INC/BJP", "Booths won in 2022 that flipped to rivals (27 to INC, 9 to BJP, 3 to SAD). Immediate redressal needed."),
    ("Weak Booths (< 20% Share)", "31 Booths", "Severe minority vote share", "Pockets with critical vulnerability where AAP polled below 20% (e.g. Chib, Sanghar, Daili Bangar)."),
    ("Lost Both Times (Deficit)", "103 Booths", "Opponent bastions", "Traditional Congress and Akali/BJP stronghold villages where AAP has remained in 2nd or 3rd position.")
]

for r_data in aap_cat_data:
    row_c = t_aap_cat.add_row().cells
    for i, val in enumerate(r_data):
        row_c[i].text = val

doc_word.add_paragraph().paragraph_format.space_after = Pt(12)

# Section 3: Top Strongholds and Top Weaknesses Tables
doc_word.add_heading("3. AAP Priority Focus Booths (Top 10 Strongholds vs Top 10 Weaknesses)", level=2)

t_strong = doc_word.add_table(rows=1, cols=6)
t_strong.alignment = WD_TABLE_ALIGNMENT.CENTER
hs = t_strong.rows[0].cells
ht = ["Booth", "Village Name", "2024 AAP Votes", "2024 AAP %", "2024 Margin", "2022 Result"]
for idx, title in enumerate(ht):
    hs[idx].text = title
    set_cell_background(hs[idx], "276A3C") # Dark Green
    hs[idx].paragraphs[0].runs[0].font.bold = True
    hs[idx].paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)

for b in sorted_aap_strong[:10]:
    row_c = t_strong.add_row().cells
    row_c[0].text = f"#{b['booth_no']}"
    row_c[1].text = b['village_english']
    row_c[2].text = str(b['data_2024']['aap'])
    row_c[3].text = f"{b['data_2024']['aap_pct']}%"
    row_c[4].text = f"+{b['data_2024']['margin']} lead"
    row_c[5].text = f"{b['data_2022']['winner_party']} (+{b['data_2022']['margin']})"

doc_word.add_paragraph().paragraph_format.space_after = Pt(12)

doc_word.save('Qadian_Master_Booth_Analysis_AAP.docx')
print('Successfully generated Qadian_Master_Booth_Analysis_AAP.docx!')
