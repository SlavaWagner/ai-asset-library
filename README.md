# ai-asset-library

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![AI Framework: Antigravity CLI](https://img.shields.io/badge/AI_Framework-Antigravity_CLI-blue.svg)](https://antigravity.google)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)

> **Created with Google Antigravity CLI**  
> *Persistent AI Agent Swarm & Mass Pre-production Engine for Google Ads (PMax & RSA) with Desktop Obsidian Vault Export & Google Ads MCC OAuth Integration.*

> [!IMPORTANT]
> **Prerequisite for AI Processing:**
> Please start Google Antigravity beforehand using the command **`agy`** in your console!
> Interactive chat sessions, asset generation workflows, and AI processing run exclusively **INSIDE the Antigravity CLI**. In a standard terminal shell outside Antigravity, no AI processing takes place, and static execution outputs are intercepted with a guidance notice.

---

## Overview & Purpose

ai-asset-library is an autonomous AI agent framework designed for mass pre-production, predictive quality evaluation, and automated upload of Google Ads creative assets (Performance Max Asset Groups and Responsive Search Ads).

Instead of drafting a small number of ads manually or launching unverified variants live on Google Ads, ai-asset-library automates the entire pre-production and testing workflow:

1. **Mass Pre-production (4,500 Asset Groups / RSAs)**: Pre-produces up to **4,500 cardinal ad alternatives** prior to launch with high story-spine consistency and unconventional metaphors (e.g. Asset Fortress, Yield Telescope, Asymmetrical Leverage).
2. **AI Asset Decision Matrix Scoring**: Vectorizes every asset across 6 dimensions (D1-D6) and evaluates it on 5 orthogonal score axes (Conversion, Audience Fit, Hook Interrupt, Tension Curve, Sentiment) to assign grades from **Grade A to Grade D**.
3. **20-Agent Persona Swarm Testing**: Tests top candidate creatives against a swarm of 20 automated test customer personas (e.g. Early Tech Adopter, Skeptical Auditor, Real Estate Investor, Asset Heir) to project **CTR (%)**, **CPC ($/€)**, **CPM ($/€)**, and **Cost per Lead (CPL $/€)**.
4. **Desktop Obsidian Vault Export (Prerequisite)**: Exports the complete dataset (all 4,500 ads including evaluations, scores, persona feedback statements, and projections) directly into a local **Obsidian Vault** on your Desktop (`ObsidianVault_AI_Assets`).
5. **Selective Google Ads API Upload**: Filters the 4,500 assets and submits **only the top-scoring Grade A winners** in `PAUSED` status to Google Ads via the API.

---

## Strategic Leverage

In traditional performance marketing, valuable ad spend is wasted by running unverified creatives live on Google Ads over several weeks to gather statistical significance.

**The leverage of ai-asset-library lies in predictive pre-production:**
* **Pre-Budget Risk Elimination Support**: Test 4,500 ad variants before spending a single dollar or euro of media budget.
* **Radical Asset Variance Without Clichés**: Utilizes structured psychological frameworks (PAS, AIDA, FAB, DISG) and unconventional metaphors to eliminate tired marketing clichés such as "save time" or "buy now".
* **100% File System Transparency in Obsidian**: Every decision, persona feedback statement, and score breakdown is stored as readable Markdown notes with internal Wikilinks on your local Desktop.
* **Seamless Scaling via MCC**: Automatically uploads only verified **Grade A winners (>= 8.0)** directly to your Google Ads MCC account.

---

## Architecture & Workflow

```
[Campaign Theme / Landing Page URL]
               │
               ▼
 ┌───────────────────────────┐
 │ 1. Mass Pre-production    │ ──► Pre-produces 4,500 Cardinal Ad Alternatives
 └─────────────┬─────────────┘     (PMax Asset Groups or Search RSAs)
               │
               ▼
 ┌───────────────────────────┐
 │ 2. AI Asset Decision      │ ──► 6D Vectorization & 5 Score Axes
 │    Matrix Scoring         │     Classifies Ads into Grades A, B, C, D
 └─────────────┬─────────────┘
               │
               ▼
 ┌───────────────────────────┐
 │ 3. 20-Agent Persona       │ ──► 20 Test Customer Personas Evaluate Creatives
 │    Swarm Testing          │     Returns Persona Feedback & Projections (CTR, CPC, CPL)
 └─────────────┬─────────────┘
               │
               ├─────────────────────────────────────────┐
               ▼                                         ▼
 ┌───────────────────────────┐             ┌───────────────────────────┐
 │ 4. Desktop Obsidian Vault │             │ 5. Selective Google Ads   │
 │    Export (All 4,500 Ads) │             │    API Upload (Grade A)   │
 └───────────────────────────┘             └───────────────────────────┘
```

---

## Prerequisites

1. **Node.js**: Version 18.0.0 or higher.
2. **Google Antigravity CLI**: Recommended for global agent orchestration.
3. **Google Cloud Project**:
   - Enabled **Google Ads API**.
   - Created **OAuth 2.0 Client ID** (Application type: Web application).
   - Configured Authorized Redirect URI: `http://localhost:8085`.
4. **Obsidian**: Installed on Desktop (recommended for viewing the generated local vault).

---

## Authentication Guide (Google Ads MCC OAuth Setup)

1. **Clone repository & install dependencies:**
   ```bash
   git clone https://github.com/SlavaWagner/ai-asset-library.git
   cd ai-asset-library
   npm install
   ```

2. **Configure credentials in `config.json`:**
   Create `config.json` (based on `config.example.json`) and enter your credentials:
   ```json
   {
     "customerId": "123-456-7890",
     "loginCustomerId": "987-654-3210",
     "developerToken": "YOUR_DEVELOPER_TOKEN",
     "clientId": "YOUR_GCP_CLIENT_ID.apps.googleusercontent.com",
     "clientSecret": "YOUR_GCP_CLIENT_SECRET",
     "obsidianVaultPath": "C:\\Users\\User\\Desktop\\ObsidianVault_AI_Assets"
   }
   ```

3. **Run the interactive OAuth2 setup tool:**
   ```bash
   ai-asset-library setup
   ```
   * Starts a local server on `http://localhost:8085` and opens the Google authentication page in your browser.
   * After granting access, your access token and refresh token are saved automatically to `config.json`.

---

## CLI & Agent Command Reference

Alle Befehle werden innerhalb der Google Antigravity CLI (`agy`) ausgeführt:

| Befehl | Kurzbeschreibung |
| :--- | :--- |
| `ai-asset-library preproduce` | Massen-Vorproduktion von bis zu 4.500 Asset Groups oder RSAs: Führt 6-D Vektorisierung, Entscheidungsmatrix-Scoring (Grades A–D) und 20-Agenten Persona Swarm Simulation durch und exportiert das vollständige Repository in den Obsidian Vault auf dem Desktop. Mit `--upload` werden Gewinner-Assets (Grade A) direkt als `PAUSED` in Google Ads angelegt. |
| `ai-asset-library run-workflow` | Führt die vollständige End-to-End-Pipeline synchron aus: Generierung -> Swarm-Evaluation -> Lokaler Obsidian Vault Export -> Automatischer Google Ads Upload der Top Grade A Gewinner. |
| `ai-asset-library refresh-token` | Aktualisiert das Google Ads OAuth2 Access Token manuell und validiert die Verbindung zum MCC. |
| `ai-asset-library setup` | Startet den interaktiven OAuth2-Authentifizierungsserver auf Port 8085 und speichert die Tokens in `config.json`. |

### Beteiligte KI-Agenten

*   **`PreproductionAgent`**: Generiert bis zu 4.500 Ad-Alternativen basierend auf Story-Spines und psychologischen Blickwinkeln, führt 6-D-Vektorisierung durch und simuliert den 20-Agenten Persona Swarm.
*   **`ObsidianExportAgent`**: Konvertiert das gesamte Ad-Inventar inklusive aller Matrix-Scores, Persona-Statements und Performance-Prognosen (CTR, CPC, CPL) in verlinkte Markdown-Notizen für den lokalen Obsidian Desktop Vault.
*   **`UploadAgent`**: Filtert verifizierte Grade A Gewinner (Score $\ge 8.0$) und mutiert diese als pausierte RSAs oder PMax Asset Groups in Google Ads (API v24).

#### Anwendungsbeispiele:

```bash
# 1. 4.500 Performance Max Asset Groups vorproduzieren und nach Obsidian exportieren:
ai-asset-library preproduce -k pmax -c 4500 -t "High-Ticket B2B Lead Gen" -u "https://www.slavawagner.de"

# 2. RSA Massenvorproduktion mit automatischem Google Ads Upload der Grade-A-Gewinner:
ai-asset-library preproduce -k rsa -c 1000 -t "Immobilienverkauf diskret" --upload

# 3. End-to-End Workflow ausführen:
ai-asset-library run-workflow -k pmax -c 4500
```

---

## Desktop Obsidian Vault Structure

The generated Obsidian Vault at `C:\Users\User\Desktop\ObsidianVault_AI_Assets` follows this structure:

```
ObsidianVault_AI_Assets/
├── .obsidian/                       # Obsidian app configuration
├── 00_Index_MOC/
│   └── Master_Index.md              # Master Index & Dashboard with stats and quick links
├── 01_Grade_A_Winners/
│   ├── AD-RSA-0001.md               # Markdown notes for Grade A winner ads
│   └── ...
├── 02_Grade_B_Candidates/           # Markdown notes for Grade B test candidates
├── 03_Grade_C_D_Archive/
│   └── Archive_Summary.md           # Summary note for Grade C and D lower tier assets
├── 04_Personas/
│   ├── SWARM-01_Early_Tech_Adopter.md # Notes for 20 Swarm Personas with feedback logs
│   └── ...
└── 05_Upload_Batch/
    └── Grade_A_Upload_Summary.md    # Upload batch summary report for Google Ads
```

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

*Created with Google Antigravity CLI*
