# 18-Qadian Election Intelligence & Booth Analytics
### Comparative Polling Analysis: 2022 Punjab Assembly vs 2024 Lok Sabha (Gurdaspur PC)

An interactive, high-precision election analytics dashboard and intelligence platform for the **18-Qadian Assembly Segment** of Punjab.

---

## 🌟 Key Features

1. **Complete 223-Booth Master Directory**:
   - Exact bilingual village & polling station nomenclature (English and Punjabi Gurmukhi).
   - Direct comparison of booth-by-booth votes, turnout, margins, and swings between 2022 and 2024.

2. **Party Intelligence Hubs**:
   - **All Parties Mode**: Global comparison across INC, AAP, BJP, and SAD.
   - **AAP Analytics**: Real-time segmentation into:
     - 🟢 **Won Both Times (Strongholds)**: 18 booths
     - 🔵 **Gained in 2024 (New Wins)**: 63 booths
     - 🔴 **Lost in 2024 (Flipped Away)**: 39 booths
     - ⚠️ **Weak Booths (< 20% Vote Share)**: 31 booths
     - ⚪ **Lost Both Times (Deficit)**: 103 booths
   - **INC Analytics**: Full classification of Congress performance across all 223 booths.

3. **Separate Light & Dark Themes**:
   - **Light Theme**: Editorial daylight contrast with porcelain and deep slate palette.
   - **Dark Theme**: Midnight obsidian palette with luminous indicators.

4. **Multi-Format Export & Reports**:
   - **One-by-One Booth PDF Export**: Generate print-ready official dossiers for any individual booth.
   - **Master List PDF Export**: Instant printable multi-page reports of all 223 booths or filtered views.
   - **Master Excel Spreadsheet (`.xlsx`)**: 3-sheet workbook with color-coded status, swings, and cluster rankings.
   - **Master Word Report (`.docx`)**: Formatted executive report with tables and analysis.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- npm or yarn

### Installation
```bash
git clone https://github.com/Jass-2005/qadian-web.git
cd qadian-web
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### Production Build
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

---

## 📊 Data & Methodology

- **2022 Assembly Election**: Form-20 final result sheet for 18-Qadian Assembly Segment (Partap Singh Bajwa INC vs Guriqbal Singh Mahal AAP vs Jagroop Singh Sekhwan SAD).
- **2024 Lok Sabha Election**: Form-20 final result sheet for 18-Qadian Segment under 2-Gurdaspur Parliamentary Constituency (Sukhjinder Singh Randhawa INC vs Amansher Singh Shery Kalsi AAP vs Dinesh Singh Babbu BJP vs Dr. Daljit Singh Cheema SAD).
- **Data Normalization**: Strict resolution of compound and multi-station polling names across all 223 booths.

---

## 📁 Repository Structure

```
qadian-web/
├── public/                     # Static assets, Master Excel (.xlsx) and Word (.docx)
│   ├── Qadian_Master_Booth_Analysis_AAP_INC.xlsx
│   └── Qadian_Master_Booth_Analysis_AAP.docx
├── src/
│   ├── components/             # UI Components (Header, PartyHub, BoothGrid, BoothModal)
│   ├── data/
│   │   └── qadian_comparison_data.json  # Consolidated 223-booth comparative dataset
│   ├── App.jsx                 # Main application controller
│   ├── App.css                 # Layout and print stylesheets
│   └── index.css               # Design system and Light/Dark themes
├── data-scripts/               # Data processing and analysis generation scripts
│   ├── generate_qadian_2022_sheets.py
│   ├── generate_qadian_master_analysis.py
│   ├── Qadian_2022_Assembly_Booth_Results.csv
│   └── Qadian_2024_Parliamentary_Booth_Results.csv
├── package.json
└── vite.config.js
```

---

## 📄 License
MIT License.
