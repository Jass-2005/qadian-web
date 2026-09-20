# -*- coding: utf-8 -*-
"""
Generate Master Analysis Excel Workbook and Word Strategic Executive Report for 18-Qadian:
Strict Party-Focused Analysis:
- 2022 Assembly: AAP (Jagroop Singh Sekhwan), SAD (Guriqbal Singh Mahal), INC (Partap Singh Bajwa)
- 2024 Parliamentary: AAP (Amansher Singh Shery Kalsi), INC (Sukhjinder Singh Randhawa), SAD (Dr. Daljit Singh Cheema), BJP (Dinesh Singh Babbu), SAD-A (Gurinder Singh Bajwa)

Outputs:
1. Qadian_Master_Party_Booth_Analysis_2022_2024.xlsx
2. Qadian_Master_Booth_Analysis_AAP_INC.xlsx (Synced)
3. qadian-election-dashboard/public/Qadian_Master_Booth_Analysis_AAP_INC.xlsx (Synced)
4. Qadian_Party_Analysis_Executive_Report_2022_2024.docx
5. Qadian_Master_Booth_Analysis_AAP.docx (Synced)
"""

import sys
import os
import json
import shutil
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

sys.stdout.reconfigure(encoding='utf-8')

# 1. Load verified comparison data
with open('qadian_comparison_data.json', 'r', encoding='utf-8') as f:
    payload = json.load(f)

booths = payload['booths']
summary = payload['summary']

print(f"Loaded {len(booths)} booths from qadian_comparison_data.json")

# ==============================================================================
# PART 1: MASTER EXCEL WORKBOOK
# ==============================================================================
wb = openpyxl.Workbook()

# Styling tokens
font_title = Font(name="Calibri", size=14, bold=True, color="1F4E79")
font_subtitle = Font(name="Calibri", size=10, italic=True, color="595959")
font_section = Font(name="Calibri", size=12, bold=True, color="1F4E79")
font_header = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
font_data = Font(name="Calibri", size=10)
font_bold = Font(name="Calibri", size=10, bold=True)
font_total = Font(name="Calibri", size=10, bold=True)

fill_navy = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
fill_aap = PatternFill(start_color="B28900", end_color="B28900", fill_type="solid")  # Gold/Amber
fill_inc = PatternFill(start_color="0F766E", end_color="0F766E", fill_type="solid")  # Teal/Emerald
fill_sad = PatternFill(start_color="5B21B6", end_color="5B21B6", fill_type="solid")  # Purple
fill_bjp = PatternFill(start_color="C2410C", end_color="C2410C", fill_type="solid")  # Saffron/Rust
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

# ------------------------------------------------------------------------------
# SHEET 1: EXECUTIVE SUMMARY & PARTY KPIS
# ------------------------------------------------------------------------------
ws_sum = wb.active
ws_sum.title = "Executive Summary & Party KPIs"
ws_sum.views.sheetView[0].showGridLines = True

ws_sum.cell(row=1, column=1, value="18-QADIAN ASSEMBLY SEGMENT: PARTY PERFORMANCE & SHIFT AUDIT").font = font_title
ws_sum.cell(row=2, column=1, value="Comparative Official Election Commission Data: 2022 Assembly vs 2024 Parliamentary").font = font_subtitle

# Table 1: Party Overview Table
ws_sum.cell(row=4, column=1, value="1. PARTY VOTE TOTALS, SHARES & BOOTH WINS (2022 vs 2024)").font = font_section

headers_p = [
    "Party", "2022 Candidate", "2022 EVM Votes", "2022 Share (%)", "2022 Booths Won",
    "2024 Candidate", "2024 EVM Votes", "2024 Share (%)", "2024 Booths Won",
    "Vote Diff", "Vote Share Swing (%)", "Booths Delta"
]

for col_idx, h in enumerate(headers_p, start=1):
    c = ws_sum.cell(row=5, column=col_idx, value=h)
    c.font = font_header
    c.fill = fill_navy
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = border_cell
ws_sum.row_dimensions[5].height = 30

party_rows = [
    ("INC", "Partap Singh Bajwa", 48116, 36.61, 125, "Sukhjinder Singh Randhawa", 41806, 35.13, 111, -6310, -1.48, -14),
    ("AAP", "Jagroop Singh Sekhwan", 34195, 26.02, 41, "Amansher Singh Shery Kalsi", 38654, 32.48, 81, 4459, 6.46, 40),
    ("SAD", "Guriqbal Singh Mahal", 41125, 31.30, 57, "Dr. Daljit Singh Cheema", 15568, 13.08, 5, -25557, -18.22, -52),
    ("BJP", "-", 0, 0.00, 0, "Dinesh Singh Babbu", 12959, 10.89, 25, 12959, 10.89, 25),
    ("SAD(A)", "Jatinderbir Singh Pannu", 4306, 3.28, 0, "Gurinder Singh Bajwa", 4725, 3.97, 0, 419, 0.69, 0),
    ("Others & NOTA", "Independent & Others", 3676, 2.79, 0, "Others (4,893) + NOTA (386)", 5279, 4.45, 0, 1603, 1.66, 0),
]

for r_idx, pr in enumerate(party_rows, start=6):
    is_zebra = (r_idx % 2 == 1)
    for c_idx, val in enumerate(pr, start=1):
        c = ws_sum.cell(row=r_idx, column=c_idx, value=val)
        c.font = font_bold if c_idx == 1 else font_data
        c.border = border_cell
        if is_zebra:
            c.fill = fill_zebra
        
        # Formatting
        if c_idx in (1, 2, 6):
            c.alignment = Alignment(horizontal="left", vertical="center")
        elif c_idx in (3, 7, 10):
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "#,##0"
        elif c_idx in (4, 8):
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "0.00%"
            c.value = val / 100.0
        elif c_idx == 11:
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "+0.00%;-0.00%;0.00%"
            c.value = val / 100.0
        elif c_idx in (5, 9, 12):
            c.alignment = Alignment(horizontal="center", vertical="center")
            if c_idx == 12:
                c.font = font_bold
                if val > 0:
                    c.fill = fill_status_won_both
                elif val < 0:
                    c.fill = fill_status_lost_24
    ws_sum.row_dimensions[r_idx].height = 22

# Total Row
tot_r_sum = 12
tot_vals_sum = [
    "TOTAL", "All Candidates", 131418, 1.0, 223,
    "All Candidates", 118991, 1.0, 222, -12427, -0.0946, -1
]
for c_idx, val in enumerate(tot_vals_sum, start=1):
    c = ws_sum.cell(row=tot_r_sum, column=c_idx, value=val)
    c.font = font_total
    c.border = border_total
    c.fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
    if c_idx in (1, 2, 6):
        c.alignment = Alignment(horizontal="left", vertical="center")
    elif c_idx in (3, 7, 10):
        c.alignment = Alignment(horizontal="right", vertical="center")
        c.number_format = "#,##0"
    elif c_idx in (4, 8, 11):
        c.alignment = Alignment(horizontal="right", vertical="center")
        c.number_format = "0.00%"
    else:
        c.alignment = Alignment(horizontal="center", vertical="center")
ws_sum.row_dimensions[tot_r_sum].height = 24

# Table 2: 2022 to 2024 Party Transition Matrix
ws_sum.cell(row=15, column=1, value="2. 2022 TO 2024 BOOTH RETENTION & TRANSITION MATRIX").font = font_section

headers_tm = ["2022 Winner Party", "Held by Same Party", "Flipped to AAP", "Flipped to INC", "Flipped to BJP", "Flipped to SAD", "No Polling (2024)", "Total 2022 Booths"]
for col_idx, h in enumerate(headers_tm, start=1):
    c = ws_sum.cell(row=16, column=col_idx, value=h)
    c.font = font_header
    c.fill = fill_navy
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border = border_cell
ws_sum.row_dimensions[16].height = 26

trans_matrix = [
    ("INC (125 Booths in '22)", 69, 40, "-", 14, 2, 0, 125),
    ("SAD (57 Booths in '22)", 3, 18, 27, 9, "-", 0, 57),
    ("AAP (41 Booths in '22)", 23, "-", 15, 2, 0, 1, 41),
    ("Total 2024 Wins", "-", 81, 111, 25, 5, 1, 223)
]

for r_idx, tm in enumerate(trans_matrix, start=17):
    is_total_row = (r_idx == 20)
    for c_idx, val in enumerate(tm, start=1):
        c = ws_sum.cell(row=r_idx, column=c_idx, value=val)
        c.font = font_total if is_total_row else font_data
        c.border = border_total if is_total_row else border_cell
        if is_total_row:
            c.fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
        c.alignment = Alignment(horizontal="left" if c_idx == 1 else "center", vertical="center")
    ws_sum.row_dimensions[r_idx].height = 22

# ------------------------------------------------------------------------------
# SHEET 2: AAP STRATEGIC BOOTH ANALYSIS (81 WON BOOTHS & TARGETS)
# ------------------------------------------------------------------------------
ws_aap = wb.create_sheet(title="AAP Strategic Analysis")
ws_aap.views.sheetView[0].showGridLines = True

headers_aap = [
    "Booth No", "Village / Polling Station (English)", "Village (Punjabi)", "AAP Strategic Category",
    "2022 Sekhwan Votes", "2022 Sekhwan Share", "2022 Winner",
    "2024 Shery Kalsi Votes", "2024 Shery Kalsi Share", "2024 Winner",
    "Vote Diff", "Vote Share Swing", "2024 Margin", "2024 Turnout"
]

for col_idx, h in enumerate(headers_aap, start=1):
    c = ws_aap.cell(row=1, column=col_idx, value=h)
    c.font = font_header
    c.fill = fill_aap
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = Border(left=thin_gray, right=thin_gray, top=thin_gray, bottom=thick_bottom)
ws_aap.row_dimensions[1].height = 28

for idx, b in enumerate(booths, start=2):
    cat = b['categories']['AAP']
    if cat == 'WON_BOTH':
        cat_label, status_fill, status_font = 'Won Both Times (Stronghold)', fill_status_won_both, font_status_won_both
    elif cat == 'GAINED':
        from_p = b['data_2022']['winner_party']
        cat_label, status_fill, status_font = f'Gained in 2024 (from {from_p})', fill_status_gained, font_status_gained
    elif cat == 'LOST_24':
        to_p = b['data_2024']['winner_party']
        cat_label, status_fill, status_font = f'Lost in 2024 (to {to_p})', fill_status_lost_24, font_status_lost_24
    elif cat == 'WEAK':
        cat_label, status_fill, status_font = 'Weak Booth (< 20% Share)', fill_status_weak, font_status_weak
    else:
        cat_label, status_fill, status_font = 'Lost Both Times (Deficit)', fill_status_lost_both, font_status_lost_both

    v22 = b['data_2022']['aap']
    t22 = b['data_2022']['total']
    s22 = (v22 / t22) if t22 > 0 else 0.0

    v24 = b['data_2024']['aap']
    t24 = b['data_2024']['total']
    s24 = (v24 / t24) if t24 > 0 else 0.0

    diff = v24 - v22
    swing = s24 - s22

    row_vals = [
        b['booth_no'],
        b['village_english'],
        b['village_punjabi'],
        cat_label,
        v22,
        s22,
        f"{b['data_2022']['winner_party']} (+{b['data_2022']['margin']})",
        v24,
        s24,
        f"{b['data_2024']['winner_party']} (+{b['data_2024']['margin']})" if t24 > 0 else "No Polling",
        diff,
        swing,
        b['data_2024']['margin'] if b['data_2024']['winner_party'] == 'AAP' else -b['data_2024']['margin'],
        t24
    ]
    ws_aap.append(row_vals)
    ws_aap.row_dimensions[idx].height = 20

    is_zebra = (idx % 2 == 1)
    for c_idx in range(1, len(row_vals) + 1):
        c = ws_aap.cell(row=idx, column=c_idx)
        c.border = border_cell
        if is_zebra and c_idx != 4:
            c.fill = fill_zebra
        
        if c_idx == 1:
            c.alignment = Alignment(horizontal="center", vertical="center")
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
        elif c_idx == 12:
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "+0.0%;-0.0%;0.0%"
        elif c_idx in (7, 10):
            c.alignment = Alignment(horizontal="center", vertical="center")

# Total row AAP
tot_row_aap = len(booths) + 2
tot_vals_aap = [
    'TOTAL', f'{len(booths)} Booths', 'Constituency Total', 'AAP Summary (81 Wins)',
    f'=SUM(E2:E{tot_row_aap-1})', f'=E{tot_row_aap}/SUM(N2:N{tot_row_aap-1})', 'Sekhwan (41 Wins)',
    f'=SUM(H2:H{tot_row_aap-1})', f'=H{tot_row_aap}/SUM(N2:N{tot_row_aap-1})', 'Shery Kalsi (81 Wins)',
    f'=H{tot_row_aap}-E{tot_row_aap}', f'=I{tot_row_aap}-F{tot_row_aap}',
    '+40 Booth Gain', f'=SUM(N2:N{tot_row_aap-1})'
]
ws_aap.append(tot_vals_aap)
ws_aap.row_dimensions[tot_row_aap].height = 24
for c_idx in range(1, len(tot_vals_aap) + 1):
    c = ws_aap.cell(row=tot_row_aap, column=c_idx)
    c.font = font_total
    c.border = border_total
    c.fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
    if c_idx in (5, 8, 11, 14):
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

ws_aap.freeze_panes = "D2"

# ------------------------------------------------------------------------------
# SHEET 3: INC STRATEGIC BOOTH ANALYSIS (111 WON BOOTHS & DEFENSE)
# ------------------------------------------------------------------------------
ws_inc = wb.create_sheet(title="INC Strategic Analysis")
ws_inc.views.sheetView[0].showGridLines = True

headers_inc = [
    "Booth No", "Village / Polling Station (English)", "Village (Punjabi)", "INC Strategic Category",
    "2022 Bajwa Votes", "2022 Bajwa Share", "2022 Winner",
    "2024 Randhawa Votes", "2024 Randhawa Share", "2024 Winner",
    "Vote Diff", "Vote Share Swing", "2024 Margin", "2024 Turnout"
]

for col_idx, h in enumerate(headers_inc, start=1):
    c = ws_inc.cell(row=1, column=col_idx, value=h)
    c.font = font_header
    c.fill = fill_inc
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = Border(left=thin_gray, right=thin_gray, top=thin_gray, bottom=thick_bottom)
ws_inc.row_dimensions[1].height = 28

for idx, b in enumerate(booths, start=2):
    cat = b['categories']['INC']
    if cat == 'WON_BOTH':
        cat_label, status_fill, status_font = 'Won Both Times (Stronghold)', fill_status_won_both, font_status_won_both
    elif cat == 'GAINED':
        from_p = b['data_2022']['winner_party']
        cat_label, status_fill, status_font = f'Gained in 2024 (from {from_p})', fill_status_gained, font_status_gained
    elif cat == 'LOST_24':
        to_p = b['data_2024']['winner_party']
        cat_label, status_fill, status_font = f'Lost in 2024 (to {to_p})', fill_status_lost_24, font_status_lost_24
    elif cat == 'WEAK':
        cat_label, status_fill, status_font = 'Weak Booth (< 20% Share)', fill_status_weak, font_status_weak
    else:
        cat_label, status_fill, status_font = 'Lost Both Times (Deficit)', fill_status_lost_both, font_status_lost_both

    v22 = b['data_2022']['inc']
    t22 = b['data_2022']['total']
    s22 = (v22 / t22) if t22 > 0 else 0.0

    v24 = b['data_2024']['inc']
    t24 = b['data_2024']['total']
    s24 = (v24 / t24) if t24 > 0 else 0.0

    diff = v24 - v22
    swing = s24 - s22

    row_vals = [
        b['booth_no'],
        b['village_english'],
        b['village_punjabi'],
        cat_label,
        v22,
        s22,
        f"{b['data_2022']['winner_party']} (+{b['data_2022']['margin']})",
        v24,
        s24,
        f"{b['data_2024']['winner_party']} (+{b['data_2024']['margin']})" if t24 > 0 else "No Polling",
        diff,
        swing,
        b['data_2024']['margin'] if b['data_2024']['winner_party'] == 'INC' else -b['data_2024']['margin'],
        t24
    ]
    ws_inc.append(row_vals)
    ws_inc.row_dimensions[idx].height = 20

    is_zebra = (idx % 2 == 1)
    for c_idx in range(1, len(row_vals) + 1):
        c = ws_inc.cell(row=idx, column=c_idx)
        c.border = border_cell
        if is_zebra and c_idx != 4:
            c.fill = fill_zebra
        
        if c_idx == 1:
            c.alignment = Alignment(horizontal="center", vertical="center")
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
        elif c_idx == 12:
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "+0.0%;-0.0%;0.0%"
        elif c_idx in (7, 10):
            c.alignment = Alignment(horizontal="center", vertical="center")

# Total row INC
tot_row_inc = len(booths) + 2
tot_vals_inc = [
    'TOTAL', f'{len(booths)} Booths', 'Constituency Total', 'INC Summary (111 Wins)',
    f'=SUM(E2:E{tot_row_inc-1})', f'=E{tot_row_inc}/SUM(N2:N{tot_row_inc-1})', 'Bajwa (125 Wins)',
    f'=SUM(H2:H{tot_row_inc-1})', f'=H{tot_row_inc}/SUM(N2:N{tot_row_inc-1})', 'Randhawa (111 Wins)',
    f'=H{tot_row_inc}-E{tot_row_inc}', f'=I{tot_row_inc}-F{tot_row_inc}',
    '-14 Booth Net', f'=SUM(N2:N{tot_row_inc-1})'
]
ws_inc.append(tot_vals_inc)
ws_inc.row_dimensions[tot_row_inc].height = 24
for c_idx in range(1, len(tot_vals_inc) + 1):
    c = ws_inc.cell(row=tot_row_inc, column=c_idx)
    c.font = font_total
    c.border = border_total
    c.fill = PatternFill(start_color="D1FAE5", end_color="D1FAE5", fill_type="solid")
    if c_idx in (5, 8, 11, 14):
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

ws_inc.freeze_panes = "D2"

# ------------------------------------------------------------------------------
# SHEET 4: SAD COLLAPSE & BJP INROADS
# ------------------------------------------------------------------------------
ws_sad_bjp = wb.create_sheet(title="SAD Collapse & BJP Inroads")
ws_sad_bjp.views.sheetView[0].showGridLines = True

ws_sad_bjp.cell(row=1, column=1, value="SAD TO OPPOSITION DISPERSION & BJP URBAN GAINS").font = font_title
ws_sad_bjp.cell(row=2, column=1, value="Tracking SAD's 57 booths from 2022 and BJP's 25 booth captures in 2024").font = font_subtitle

headers_sb = [
    "Booth No", "Village / Polling Station (English)", "Village (Punjabi)",
    "2022 SAD (Mahal)", "2024 SAD (Cheema)", "SAD Drop",
    "2022 Winner", "2024 Winner", "Party Transition",
    "2024 BJP (Babbu)", "BJP Share (%)", "2024 Margin"
]

for col_idx, h in enumerate(headers_sb, start=1):
    c = ws_sad_bjp.cell(row=4, column=col_idx, value=h)
    c.font = font_header
    c.fill = fill_sad
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border = border_cell
ws_sad_bjp.row_dimensions[4].height = 28

# Filter booths where SAD won in 2022 OR BJP won in 2024
sb_booths = [b for b in booths if b['data_2022']['winner_party'] == 'SAD' or b['data_2024']['winner_party'] == 'BJP']

for idx, b in enumerate(sb_booths, start=5):
    s22 = b['data_2022']['sad']
    s24 = b['data_2024']['sad']
    s_diff = s24 - s22
    bjp_v = b['data_2024']['bjp']
    bjp_s = (bjp_v / b['data_2024']['total']) if b['data_2024']['total'] > 0 else 0.0

    row_vals = [
        b['booth_no'],
        b['village_english'],
        b['village_punjabi'],
        s22,
        s24,
        s_diff,
        b['data_2022']['winner_party'],
        b['data_2024']['winner_party'],
        b['comparison']['status_label'],
        bjp_v,
        bjp_s,
        b['data_2024']['margin']
    ]
    ws_sad_bjp.append(row_vals)
    ws_sad_bjp.row_dimensions[idx].height = 20

    is_zebra = (idx % 2 == 1)
    for c_idx in range(1, len(row_vals) + 1):
        c = ws_sad_bjp.cell(row=idx, column=c_idx)
        c.border = border_cell
        if is_zebra:
            c.fill = fill_zebra
        
        if c_idx == 1:
            c.alignment = Alignment(horizontal="center", vertical="center")
        elif c_idx in (2, 3, 9):
            c.alignment = Alignment(horizontal="left", vertical="center")
        elif c_idx in (4, 5, 6, 10, 12):
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "#,##0"
        elif c_idx == 11:
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "0.0%"
        elif c_idx in (7, 8):
            c.alignment = Alignment(horizontal="center", vertical="center")
            c.font = font_bold
            if str(c.value) == 'BJP':
                c.fill = PatternFill(start_color="FFEDD5", end_color="FFEDD5", fill_type="solid")
            elif str(c.value) == 'AAP':
                c.fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
            elif str(c.value) == 'INC':
                c.fill = PatternFill(start_color="D1FAE5", end_color="D1FAE5", fill_type="solid")

# ------------------------------------------------------------------------------
# SHEET 5: ALL 223 BOOTHS COMPLETE MASTER DATASET
# ------------------------------------------------------------------------------
ws_all = wb.create_sheet(title="All 223 Booths Master")
ws_all.views.sheetView[0].showGridLines = True

headers_all = [
    "Booth No", "Village Name (English)", "Village Name (Punjabi)",
    "2022 Turnout", "2024 Turnout", "Turnout Diff", "Turnout Swing (%)",
    "2022 Winner", "2022 Margin",
    "2024 Winner", "2024 Margin",
    "Party Shift Status",
    "AAP 2022 (Sekhwan)", "AAP 2024 (Kalsi)", "AAP Swing (%)",
    "INC 2022 (Bajwa)", "INC 2024 (Randhawa)", "INC Swing (%)",
    "SAD 2022 (Mahal)", "SAD 2024 (Cheema)", "SAD Swing (%)",
    "BJP 2024 (Babbu)", "BJP Share (%)"
]

for col_idx, h in enumerate(headers_all, start=1):
    c = ws_all.cell(row=1, column=col_idx, value=h)
    c.font = font_header
    c.fill = fill_navy
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = Border(left=thin_gray, right=thin_gray, top=thin_gray, bottom=thick_bottom)
ws_all.row_dimensions[1].height = 30

for idx, b in enumerate(booths, start=2):
    row_vals = [
        b['booth_no'],
        b['village_english'],
        b['village_punjabi'],
        b['data_2022']['total'],
        b['data_2024']['total'],
        b['comparison']['turnout_diff'],
        b['comparison']['turnout_pct'] / 100.0,
        b['data_2022']['winner_party'],
        b['data_2022']['margin'],
        b['data_2024']['winner_party'],
        b['data_2024']['margin'],
        b['comparison']['status_label'],
        b['data_2022']['aap'],
        b['data_2024']['aap'],
        b['comparison']['aap_swing'] / 100.0,
        b['data_2022']['inc'],
        b['data_2024']['inc'],
        b['comparison']['inc_swing'] / 100.0,
        b['data_2022']['sad'],
        b['data_2024']['sad'],
        b['comparison']['sad_swing'] / 100.0,
        b['data_2024']['bjp'],
        b['data_2024']['bjp_pct'] / 100.0
    ]
    ws_all.append(row_vals)
    ws_all.row_dimensions[idx].height = 20

    is_zebra = (idx % 2 == 1)
    for c_idx in range(1, len(row_vals) + 1):
        c = ws_all.cell(row=idx, column=c_idx)
        c.border = border_cell
        if is_zebra:
            c.fill = fill_zebra
        
        if c_idx == 1:
            c.alignment = Alignment(horizontal="center", vertical="center")
        elif c_idx in (2, 3, 12):
            c.alignment = Alignment(horizontal="left", vertical="center")
        elif c_idx in (4, 5, 6, 9, 11, 13, 14, 16, 17, 19, 20, 22):
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "#,##0"
        elif c_idx in (7, 15, 18, 21, 23):
            c.alignment = Alignment(horizontal="right", vertical="center")
            c.number_format = "+0.0%;-0.0%;0.0%"
        elif c_idx in (8, 10):
            c.alignment = Alignment(horizontal="center", vertical="center")
            c.font = font_bold
            if str(c.value) == 'AAP':
                c.fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
            elif str(c.value) == 'INC':
                c.fill = PatternFill(start_color="D1FAE5", end_color="D1FAE5", fill_type="solid")
            elif str(c.value) == 'BJP':
                c.fill = PatternFill(start_color="FFEDD5", end_color="FFEDD5", fill_type="solid")
            elif str(c.value) == 'SAD':
                c.fill = PatternFill(start_color="EDE9FE", end_color="EDE9FE", fill_type="solid")

ws_all.freeze_panes = "D2"

# Auto-fit column widths across all sheets
for ws in wb.worksheets:
    for col in ws.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            val_str = str(cell.value or '')
            max_len = max(max_len, len(val_str))
        ws.column_dimensions[col_letter].width = min(max(max_len + 3, 11), 40)

# Save Master Workbooks
wb_path1 = "Qadian_Master_Party_Booth_Analysis_2022_2024.xlsx"
wb_path2 = "Qadian_Master_Booth_Analysis_AAP_INC.xlsx"
pub_xlsx = "qadian-election-dashboard/public/Qadian_Master_Booth_Analysis_AAP_INC.xlsx"

wb.save(wb_path1)
wb.save(wb_path2)
os.makedirs(os.path.dirname(pub_xlsx), exist_ok=True)
shutil.copyfile(wb_path2, pub_xlsx)
print(f"Successfully generated and synced:\n  1. {wb_path1}\n  2. {wb_path2}\n  3. {pub_xlsx}")


# ==============================================================================
# PART 2: WORD STRATEGIC EXECUTIVE REPORT (.docx)
# ==============================================================================
doc = docx.Document()

# Configure margins
for section in doc.sections:
    section.top_margin = Inches(0.75)
    section.bottom_margin = Inches(0.75)
    section.left_margin = Inches(0.75)
    section.right_margin = Inches(0.75)

    header = section.header
    hp = header.paragraphs[0]
    hp.text = "DSIDEIN FIELD INTELLIGENCE | 18-QADIAN ASSEMBLY SEGMENT (2022 vs 2024)"
    hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    hp.runs[0].font.name = "Calibri"
    hp.runs[0].font.size = Pt(8.5)
    hp.runs[0].font.color.rgb = RGBColor(100, 116, 139)

    footer = section.footer
    fp = footer.paragraphs[0]
    fp.text = "Official Command Center: https://dsidein.com/qadian-2022-2024 | Party Intelligence Dossier"
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    fp.runs[0].font.name = "Calibri"
    fp.runs[0].font.size = Pt(8.5)
    fp.runs[0].font.color.rgb = RGBColor(100, 116, 139)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

# Title Header Table
ht = doc.add_table(rows=1, cols=2)
ht.alignment = WD_TABLE_ALIGNMENT.CENTER
ht.autofit = False
ht.columns[0].width = Inches(1.2)
ht.columns[1].width = Inches(5.8)

if os.path.exists('dsidein_logo_transparent.png'):
    p_logo = ht.cell(0, 0).paragraphs[0]
    p_logo.add_run().add_picture('dsidein_logo_transparent.png', width=Inches(1.0))

p_title = ht.cell(0, 1).paragraphs[0]
r1 = p_title.add_run("DSIDEIN POLITICAL INTELLIGENCE DIVISION\n")
r1.font.name = "Calibri"
r1.font.size = Pt(11)
r1.font.bold = True
r1.font.color.rgb = RGBColor(0, 43, 73)

r2 = p_title.add_run("18-QADIAN: CONSTITUENCY PARTY SHIFT & BOOTH AUDIT\n")
r2.font.name = "Calibri"
r2.font.size = Pt(15)
r2.font.bold = True
r2.font.color.rgb = RGBColor(31, 78, 121)

r3 = p_title.add_run("Comparative Electoral Analysis: 2022 Punjab Assembly vs 2024 Lok Sabha Elections\nCandidate Context: Sekhwan (AAP) vs Mahal (SAD) vs Bajwa (INC) in 2022 | Kalsi (AAP) vs Randhawa (INC) in 2024")
r3.font.name = "Calibri"
r3.font.size = Pt(9.5)
r3.font.italic = True
r3.font.color.rgb = RGBColor(89, 89, 89)

doc.add_paragraph()

# 1. Executive Summary
doc.add_heading("1. Executive Summary & Core Political Realities", level=1)
p_sum = doc.add_paragraph(
    "A rigorous, party-level comparative audit of all 223 polling booths in 18-Qadian (Gurdaspur Parliamentary Constituency) reveals "
    "a dramatic structural realignment between the 2022 Punjab Assembly elections and the 2024 Lok Sabha elections:\n\n"
    "• Total Voter Turnout: Overall polled EVM votes contracted from 131,418 to 118,991, reflecting a -9.46% drop (-12,427 votes).\n"
    "• AAP Surged by +40 Booths: In 2022, under Jagroop Singh Sekhwan, AAP secured 34,195 EVM votes (26.02% vote share) and won 41 booths. "
    "In 2024, under Amansher Singh Shery Kalsi, AAP expanded to 38,654 votes (32.48% vote share) and captured 81 booths (+40 booth net expansion, +6.46% swing).\n"
    "• INC Victory Margin Compressed: Partap Singh Bajwa (INC) won Qadian in 2022 with 48,116 votes (36.61%) and 125 booths (+6,991 lead over SAD). "
    "In 2024, Sukhjinder Singh Randhawa (INC) polled 41,806 votes (35.13%) and won 111 booths (-14 booths), with its constituency lead narrowing to +3,152 votes over AAP.\n"
    "• Akali Dal (SAD) Decimated (-52 Booths): Guriqbal Singh Mahal (SAD) held 41,125 votes (31.30%) and 57 booths in 2022 as runner-up. "
    "In 2024, Dr. Daljit Singh Cheema (SAD) collapsed to 15,568 votes (13.08%) and only 5 booths—a historic loss of 25,557 votes and 52 booths.\n"
    "• BJP Urban Breakthrough (25 Booths): Dinesh Singh Babbu (BJP) capitalized on anti-incumbency and urban consolidation, polling 12,959 votes (10.89%) "
    "and sweeping 25 booths primarily in Dhariwal and Qadian municipal wards."
)

# Table: Official Party Summary
doc.add_heading("2. Official Party Performance Matrix (All 223 Booths)", level=1)
t_p = doc.add_table(rows=1, cols=7)
t_p.alignment = WD_TABLE_ALIGNMENT.CENTER
t_p.autofit = False

p_headers = ["Party", "2022 Candidate", "2022 Votes (Share)", "2024 Candidate", "2024 Votes (Share)", "Net Swing", "Booths (22 → 24)"]
for c_i, th in enumerate(p_headers):
    cell = t_p.rows[0].cells[c_i]
    cell.text = th
    set_cell_background(cell, "1F4E79")
    cell.paragraphs[0].runs[0].font.bold = True
    cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    cell.paragraphs[0].runs[0].font.size = Pt(9)
    cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

p_table_data = [
    ("INC", "Partap Singh Bajwa", "48,116 (36.61%)", "Sukhjinder Singh Randhawa", "41,806 (35.13%)", "-1.48%", "125 → 111 (-14)"),
    ("AAP", "Jagroop Singh Sekhwan", "34,195 (26.02%)", "Amansher Singh Shery Kalsi", "38,654 (32.48%)", "+6.46%", "41 → 81 (+40)"),
    ("SAD", "Guriqbal Singh Mahal", "41,125 (31.30%)", "Dr. Daljit Singh Cheema", "15,568 (13.08%)", "-18.22%", "57 → 5 (-52)"),
    ("BJP", "-", "0 (0.00%)", "Dinesh Singh Babbu", "12,959 (10.89%)", "+10.89%", "0 → 25 (+25)"),
    ("SAD(A)", "Jatinderbir Singh Pannu", "4,306 (3.28%)", "Gurinder Singh Bajwa", "4,725 (3.97%)", "+0.69%", "0 → 0 (0)"),
    ("Others/NOTA", "Combined Others", "3,676 (2.79%)", "Others (4,893) + NOTA (386)", "5,279 (4.45%)", "+1.66%", "0 → 0 (0)"),
]

for row_vals in p_table_data:
    row = t_p.add_row()
    for c_i, val in enumerate(row_vals):
        cell = row.cells[c_i]
        cell.text = str(val)
        p = cell.paragraphs[0]
        p.runs[0].font.size = Pt(9)
        if c_i in (0, 5, 6):
            p.runs[0].font.bold = True
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        elif c_i in (2, 4):
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        else:
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT

doc.add_paragraph()

# 3. Transition Matrix
doc.add_heading("3. Ground Booth Migration: Where Did the Votes Go?", level=1)
p_trans = doc.add_paragraph(
    "Cross-tabulating the 223 booth outcomes between 2022 and 2024 reveals the exact voter migration channels:\n\n"
    "1. AAP Gained 40 Booths Directly from INC: In 40 booths where Partap Singh Bajwa led in 2022, Shery Kalsi took the lead in 2024. "
    "Conversely, INC gained 15 booths from AAP, resulting in a net direct flip of +25 booths in favor of AAP against Congress.\n"
    "2. Absorption of the Akali Base: Out of 57 booths won by SAD's Mahal in 2022, SAD held only 3 booths. "
    "Congress absorbed 27 SAD booths, AAP captured 18 SAD booths, and BJP seized 9 SAD booths.\n"
    "3. BJP's Urban Concentration: BJP won 25 booths in 2024 (14 captured from INC, 9 from SAD, and 2 from AAP). "
    "These are heavily clustered in Dhariwal town (Booths 33-56) and Qadian municipal wards.\n"
    "4. AAP Retained Core: AAP retained 23 of its 41 booths from 2022, while expanding its footprint in rural farmer belts."
)

t_m = doc.add_table(rows=1, cols=4)
t_m.alignment = WD_TABLE_ALIGNMENT.CENTER
for c_i, th in enumerate(["2022 Winner Party", "2024 Retained", "Major Flips & Losses", "Net Trajectory"]):
    cell = t_m.rows[0].cells[c_i]
    cell.text = th
    set_cell_background(cell, "0F766E")
    cell.paragraphs[0].runs[0].font.bold = True
    cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    cell.paragraphs[0].runs[0].font.size = Pt(9)
    cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

t_m_data = [
    ("INC (125 Booths)", "69 Held (55.2%)", "Lost 40 to AAP, 14 to BJP, 2 to SAD", "Net -14 Booths (111 Wins)"),
    ("AAP (41 Booths)", "23 Held (56.1%)", "Gained 40 from INC, 18 from SAD; Lost 15 to INC, 2 to BJP", "Net +40 Booths (81 Wins)"),
    ("SAD (57 Booths)", "3 Held (5.3%)", "Lost 27 to INC, 18 to AAP, 9 to BJP", "Net -52 Booths (5 Wins)"),
    ("BJP (0 Booths)", "0 Held (New)", "Gained 14 from INC, 9 from SAD, 2 from AAP", "Net +25 Booths (25 Wins)")
]

for row_vals in t_m_data:
    row = t_m.add_row()
    for c_i, val in enumerate(row_vals):
        cell = row.cells[c_i]
        cell.text = val
        p = cell.paragraphs[0]
        p.runs[0].font.size = Pt(9)
        if c_i == 0 or c_i == 3:
            p.runs[0].font.bold = True
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        else:
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT

doc.add_paragraph()

# 4. Strategic Priorities for AAP (2027 Assembly Blueprint)
doc.add_heading("4. Action Blueprint for 2027 Punjab Assembly Campaign", level=1)
p_rec = doc.add_paragraph(
    "To achieve a decisive victory in 18-Qadian in the upcoming 2027 Assembly Election, the campaign strategy must capitalize on "
    "the structural shift observed in 2024:\n\n"
    "1. Protect the 81 Won Booths: Mobilize dedicated booth committees in all 81 booths won in 2024 (23 strongholds + 58 flipped gains). "
    "Focus on local delivery, canal irrigation access, and rural road infrastructure.\n"
    "2. Reclaim the 15 Defensive Losses: 15 booths won by Sekhwan in 2022 flipped to Randhawa in 2024. Most of these had wafer-thin margins "
    "under 45 votes. Deploy dedicated ground coordinators in villages like Kot Santokh Rai, Trija Nagar, and Sanghar.\n"
    "3. Squeeze the Remaining SAD Remnants: SAD polled 15,568 votes in 2024. As the Akali base continues to erode, proactive outreach to Panthic "
    "and rural farm families will prevent these votes from drifting into Congress's column.\n"
    "4. Counter the BJP Urban Surge in Dhariwal: In Dhariwal (Booths 33-56), BJP captured significant vote shares among trade and urban communities. "
    "Targeted urban municipal policies and trader dispute grievance desks must be established."
)

doc_path1 = "Qadian_Party_Analysis_Executive_Report_2022_2024.docx"
doc_path2 = "Qadian_Master_Booth_Analysis_AAP.docx"

doc.save(doc_path1)
doc.save(doc_path2)
print(f"Successfully generated and synced Word executive reports:\n  1. {doc_path1}\n  2. {doc_path2}")
