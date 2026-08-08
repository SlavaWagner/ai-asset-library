# ai-asset-library

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![AI Framework: Antigravity CLI](https://img.shields.io/badge/AI_Framework-Antigravity_CLI-blue.svg)](https://antigravity.google)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)

> **Created with Google Antigravity CLI**  
> *Persistent AI Agent Swarm & Mass Pre-production Engine for Google Ads (PMax & RSA) with Desktop Obsidian Vault Export & Google Ads MCC OAuth Integration.*

---

## 📖 Was es macht (Overview & Purpose)

**ai-asset-library** ist ein autonomes AI-Agenten-Framework zur Massen-Vorgenerierung, prädiktiven Qualitätsbewertung und zum automatisierten Upload von Google Ads Werbemitteln (Performance Max Asset-Gruppen und Responsive Search Ads).

Statt wenige Anzeigen manuell zu verfassen oder ungetestete Varianten live auf Google Ads zu schalten, automatisiert `ai-asset-library` den gesamten Vorproduktions- und Testing-Prozess:

1. **Massen-Vorgenerierung (4.500 Asset-Gruppen / RSAs)**: Erzeugt vor dem Go-Live bis zu **4.500 kardinale Ad-Alternativen** mit hoher Story-Spine-Konsistenz und unkonventionellen Metaphern (z. B. *Asset-Festung*, *Rendite-Teleskop*, *Asymmetrisches Hebelgesetz*).
2. **AI Asset Decision Matrix Scoring**: Vektorisiert jedes Asset in 6 Dimensionen (D1–D6) und bewertet es auf 5 orthogonalen Achsen (*Conversion, Audience Fit, Hook Interrupt, Tension Curve, Sentiment*), um Noten von **Grade A bis Grade D** zu vergeben.
3. **20-Agenten Persona Swarm Testing**: Testet Top-Kandidaten gegen ein Swarm von 20 automatisierten Testkunden-Personas (z. B. *Early Tech Adopter*, *Skeptischer Bedenkenträger*, *Kapitalanleger*, *Immobilien-Erbe*) und prognostiziert **CTR (%)**, **CPC (€)**, **CPM (€)** und **Cost per Lead (CPL €)**.
4. **Desktop Obsidian Vault Export (Vorbedingung)**: Exportiert das komplette Dataset (alle 4.500 Ads inklusive Bewertungen, Scores, Persona-O-Tönen und Projektionen) direkt in einen lokalen **Obsidian Vault** auf dem Desktop (`ObsidianVault_AI_Assets`).
5. **Selektiver Google Ads API Upload**: Filtert die 4.500 Assets und reicht **ausschließlich die besten Grade A Gewinner** im Status `PAUSED` bei Google Ads ein.

---

## ⚡ Was die Hebelwirkung ist (The Strategic Leverage)

Im klassischen Performance Marketing wird wertvolles Werbebudget verbrannt, um über Wochen hinweg ungeprüfte Creatives im Live-Betrieb auf Google Ads zu testen.

**Die Hebelwirkung von `ai-asset-library` liegt in der prädiktiven Vorproduktion:**
* **99% Pre-Budget Risk Elimination**: Du testest 4.500 Anzeigen-Varianten *bevor* auch nur 1 Euro Media-Budget ausgegeben wird.
* **Radikale Varianz ohne Phrasen**: Der Algorithmus nutzt psychologische Angles (PAS, AIDA, FAB, DISG) und unkonventionelle Metaphern, um abgedroschene Phrasen wie *"Zeit sparen"* oder *"Jetzt kaufen"* konsequent zu vermeiden.
* **100% Dateisystem-Transparenz in Obsidian**: Jede Entscheidung, jedes Persona-Feedback und jede Score-Aufschlüsselung liegt als lesbares Markdown mit Wikilinks auf deinem Desktop vor.
* **Nahtlose Skalierung über MCC**: Ein Klick lädt nur die verifizierten **Grade A Gewinner ($\ge 8.0$)** in dein Google Ads MCC Konto hoch.

---

## 🏗️ Architektur & Agenten-Workflow

```
[Kampagnen-Thema / Landingpage URL]
               │
               ▼
 ┌───────────────────────────┐
 │ 1. Mass Pre-production    │ ──► Erzeugt 4.500 Kardinale Ad-Alternativen
 └─────────────┬─────────────┘     (PMax Asset-Gruppen oder Search RSAs)
               │
               ▼
 ┌───────────────────────────┐
 │ 2. AI Asset Decision      │ ──► 6D Vektorisierung & 5 Score-Achsen
 │    Matrix Scoring         │     Klassifiziert in Grade A, B, C, D
 └─────────────┬─────────────┘
               │
               ▼
 ┌───────────────────────────┐
 │ 3. 20-Agenten Persona     │ ──► 20 Testkunden-Personas bewerten Creatives
 │    Swarm Testing          │     Gibt O-Ton Feedback & Projektionen (CTR, CPC, CPL)
 └─────────────┬─────────────┘
               │
               ├─────────────────────────────────────────┐
               ▼                                         ▼
 ┌───────────────────────────┐             ┌───────────────────────────┐
 │ 4. Desktop Obsidian Vault │             │ 5. Selektiver Google Ads  │
 │    Export (Alle 4.500 Ads)│             │    API Upload (Grade A)   │
 └───────────────────────────┘             └───────────────────────────┘
```

---

## 📋 Vorbedingungen (Prerequisites)

1. **Node.js**: Version 18.0.0 oder neuer.
2. **Google Antigravity CLI**: Empfohlen für die globale Agenten-Orchestrierung.
3. **Google Cloud Project**:
   - Aktivierte **Google Ads API**.
   - Erstellte **OAuth 2.0 Client-ID** (Anwendungstyp: *Webanwendung*).
   - Registrierte Redirect-URI: `http://localhost:8085`.
4. **Obsidian**: Auf dem Desktop installiert (empfohlen zur Ansicht des generierten Vaults).

---

## 🔑 Authentifizierungsanleitung (Google Ads MCC OAuth Setup)

1. **Repository klonen & installieren:**
   ```bash
   git clone https://github.com/SlavaWagner/ai-asset-library.git
   cd ai-asset-library
   npm install
   ```

2. **Credentials in `config.json` konfigurieren:**
   Erstelle eine `config.json` (basierend auf `config.example.json`) und trage deine Daten ein:
   ```json
   {
     "customerId": "123-456-7890",
     "loginCustomerId": "987-654-3210",
     "developerToken": "DEIN_DEVELOPER_TOKEN",
     "clientId": "DEINE_GCP_CLIENT_ID.apps.googleusercontent.com",
     "clientSecret": "DEIN_GCP_CLIENT_SECRET",
     "obsidianVaultPath": "C:\\Users\\User\\Desktop\\ObsidianVault_AI_Assets"
   }
   ```

3. **Interaktiven OAuth2 Setup-Prozess starten:**
   ```bash
   ai-asset-library setup
   ```
   * Das CLI startet einen lokalen Server auf `http://localhost:8085` und öffnet das Google-Login-Fenster.
   * Nach der Freigabe werden dein Access Token und Refresh Token automatisch in `config.json` gespeichert.

---

## 💻 Befehlsreferenz (CLI Commands & Options)

| Befehl | Beschreibung |
| :--- | :--- |
| `ai-asset-library setup` | Startet den interaktiven OAuth2-Authentifizierungsserver auf Port 8085. |
| `ai-asset-library preproduce` | Generiert bis zu 4.500 Assets, führt Swarm-Testing durch & exportiert den Obsidian Vault. |
| `ai-asset-library run-workflow` | Führt den kompletten End-to-End Workflow aus (Generierung $\rightarrow$ Obsidian Vault $\rightarrow$ Google Ads Upload). |
| `ai-asset-library refresh-token` | Erneuert das Google Ads OAuth Access Token manuell. |

### Optionale Parameter für `preproduce`:
- `-c, --count <anzahl>`: Anzahl der zu generierenden Ad-Alternativen (Standard: `4500`).
- `-k, --track <rsa|pmax>`: Kampagnen-Typ (`rsa` für Search, `pmax` für Performance Max, Standard: `rsa`).
- `-t, --theme <thema>`: Inhaltlicher Fokus der Kampagne (Standard: `"Immobilien & High-Price Lead Gen"`).
- `-u, --url <url>`: Ziel-Landingpage URL für Kontext-Scraping.
- `-v, --vault <pfad>`: Individueller Zielpfad für den Obsidian Vault auf dem Desktop.
- `--upload`: Lädt die besten Grade A Gewinner nach der Generierung automatisch zu Google Ads hoch.

---

## 📂 Desktop Obsidian Vault Struktur

Der generierte Obsidian Vault unter `C:\Users\User\Desktop\ObsidianVault_AI_Assets` ist wie folgt strukturiert:

```
ObsidianVault_AI_Assets/
├── .obsidian/                       # Obsidian App-Konfiguration
├── 00_Index_MOC/
│   └── Master_Index.md              # MOC Dashboard mit Statistiken & Links
├── 01_Grade_A_Winners/
│   ├── AD-RSA-0001.md               # Einzel-Notes für Grade A Gewinner
│   └── ...
├── 02_Grade_B_Candidates/           # Markdown Notes für Grade B Kandidaten
├── 03_Grade_C_D_Archive/
│   └── Archive_Summary.md           # Archiv-Zusammenfassung für C & D Ads
├── 04_Personas/
│   ├── SWARM-01_Early_Tech_Adopter.md # 20 Swarm Persona Notes mit Feedback-Log
│   └── ...
└── 05_Upload_Batch/
    └── Grade_A_Upload_Summary.md    # Upload-Protokoll der Google Ads Gewinner
```

---

## 📄 Lizenz (License)

Dieses Projekt ist unter der **MIT-Lizenz** lizenziert – siehe die [LICENSE](LICENSE) Datei für Details.

---

*Created with Google Antigravity CLI*
