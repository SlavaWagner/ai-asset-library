# ai-asset-library Setup & Deployment Guide

Welcome to **ai-asset-library** — the persistent AI Agent framework for Google Ads MCC token authentication, mass pre-production of up to 4,500 PMax Asset Groups and RSAs, 20-Agent Swarm predictive asset testing, and direct Desktop Obsidian Vault export.

---

## 1. Prerequisites

1. **Node.js**: Version 18.0.0 or higher.
2. **Google Cloud Project**:
   - Enable the **Google Ads API**.
   - Create an OAuth 2.0 Client ID (Application Type: **Web Application**).
   - Set Authorized Redirect URI to: `http://localhost:8085`.
3. **Obsidian**: Installed on your desktop (Optional but recommended for viewing the local Vault).

---

## 2. Installation & Quick Start

```bash
cd ai-asset-library
npm install
npm link
```

---

## 3. Google Ads MCC OAuth Setup

Run the interactive setup command:

```bash
ai-asset-library setup
```

1. Enter your Google Cloud OAuth `clientId` and `clientSecret` in `config.json`.
2. Enter your `developerToken`, `customerId` (and `loginCustomerId` if using an MCC Manager account).
3. The CLI starts a local authorization server at `http://localhost:8085` and opens the Google login window.
4. Grant access to Google Ads. Your `refreshToken` and `accessToken` will be securely stored in `config.json`.

---

## 4. Mass Pre-Production (4,500 Asset Groups / RSAs)

To generate 4,500 PMax Asset Groups or Responsive Search Ads:

### Search Track (RSAs):
```bash
ai-asset-library preproduce --track rsa --count 4500 --theme "Immobilien Lead Gen"
```

### Performance Max Track (PMax):
```bash
ai-asset-library preproduce --track pmax --count 4500 --theme "E-Commerce High-ROAS"
```

### Options:
- `-c, --count <number>`: Number of ad alternatives to generate (Default: 4500)
- `-k, --track <rsa|pmax>`: Campaign track (`rsa` or `pmax`)
- `-t, --theme <topic>`: Topic focus theme
- `-u, --url <url>`: Landing page URL
- `-v, --vault <path>`: Custom Obsidian Vault path (Default: `C:\Users\User\Desktop\ObsidianVault_AI_Assets`)
- `--upload`: Automatically upload top Grade A winners to Google Ads as `PAUSED`

---

## 5. Desktop Obsidian Vault Architecture

When pre-production completes, `ai-asset-library` automatically exports the full database into an Obsidian Vault on your Desktop (`ObsidianVault_AI_Assets`):

- **`00_Index_MOC/Master_Index.md`**: Master Index & Dashboard with CTR/CPL statistics and quick links.
- **`01_Grade_A_Winners/`**: High-converting Grade A winner ad notes formatted with YAML Frontmatter, Decision Matrix breakdown, and 20-Agent O-Ton feedback.
- **`02_Grade_B_Candidates/`**: Grade B test candidate notes.
- **`03_Grade_C_D_Archive/`**: Archive summary note for lower-scoring assets.
- **`04_Personas/`**: 20 Markdown notes for the 20 Persona Agents (`SWARM-01` to `SWARM-20`).
- **`05_Upload_Batch/`**: Summary report of Grade A winners submitted for upload.

Open Obsidian -> **"Open folder as vault"** -> Select `C:\Users\User\Desktop\ObsidianVault_AI_Assets`.

---

## 6. Security Note

> [!WARNING]
> Never hardcode API keys or OAuth personal tokens in your public repositories. Use environment variables or `config.json` (which is excluded via `.gitignore`). If a personal token is accidentally exposed in chat or code, revoke and regenerate it immediately in your GitHub developer settings.
