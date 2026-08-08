import fs from 'fs';
import path from 'path';
import BaseAgent from './BaseAgent.js';
import { PERSONAS } from './AgentSwarm.js';

export default class ObsidianExportAgent extends BaseAgent {
  constructor() {
    super('ObsidianExportAgent');
  }

  /**
   * Exports the entire pre-production dataset of 4,500 ads + evaluations into a structured Obsidian Vault.
   * 
   * @param {object} dataset - Generated ads dataset
   * @param {string} vaultPath - Destination directory path for the Obsidian Vault
   * @returns {Promise<object>} Export status and vault summary stats
   */
  exportToVault(dataset, vaultPath) {
    const targetVault = vaultPath || path.resolve(process.env.USERPROFILE || 'C:\\Users\\User', 'Desktop', 'ObsidianVault_AI_Assets');

    this.log(`===========================================================`);
    this.log(`[OBSIDIAN EXPORT] Creating Obsidian Vault at: ${targetVault}`);
    this.log(`===========================================================`);

    // Ensure folders exist
    const dirs = [
      targetVault,
      path.join(targetVault, '.obsidian'),
      path.join(targetVault, '00_Index_MOC'),
      path.join(targetVault, '01_Grade_A_Winners'),
      path.join(targetVault, '02_Grade_B_Candidates'),
      path.join(targetVault, '03_Grade_C_D_Archive'),
      path.join(targetVault, '04_Personas'),
      path.join(targetVault, '05_Upload_Batch')
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Write .obsidian app config so Obsidian instantly opens as a Vault
    fs.writeFileSync(
      path.join(targetVault, '.obsidian', 'app.json'),
      JSON.stringify({ legacyConfigFile: false, useMarkdownLinks: true }, null, 2),
      'utf8'
    );

    const ads = dataset.generatedAds || [];
    const gradeA = ads.filter(a => a.decisionMatrix?.grade === 'A');
    const gradeB = ads.filter(a => a.decisionMatrix?.grade === 'B');
    const gradeC = ads.filter(a => a.decisionMatrix?.grade === 'C');
    const gradeD = ads.filter(a => a.decisionMatrix?.grade === 'D');

    // 1. Export 20 Persona Notes
    this.log(`Writing 20 Swarm Persona Notes into 04_Personas/...`);
    for (const p of PERSONAS) {
      const personaFile = path.join(targetVault, '04_Personas', `${p.id}_${p.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`);
      const personaContent = `---
id: ${p.id}
name: ${p.name}
age: ${p.age}
gender: ${p.gender}
focus: "${p.focus}"
bias: "${p.bias}"
tags:
  - persona
  - agent-swarm
---

# 🤖 Persona: ${p.name} (${p.id})

- **Demografie:** ${p.gender.toUpperCase()} / ${p.age} Jahre
- **Fokus-Thema:** \`${p.focus}\`
- **Bewertungs-Bias:** \`${p.bias}\`

---

## 📌 Beschreibung & Rolle im Swarm
${p.name} ist einer von 20 automatisierten Testkunden-Agenten im Predictive Swarm Testing.
Dieser Agent bewertet Werbeanzeigen auf psychologische Ansprache, Einwandbehandlung und Klickwahrscheinlichkeit im Segment **${p.focus}**.

---

## 🔗 Verknüpfte Top-Anzeigen (Grade A)
${gradeA.slice(0, 10).map(ad => `- [[${ad.id}]] (Grade A - Score ${ad.decisionMatrix.scores.weightedScore})`).join('\n')}

---
[[00_Index_MOC/Master_Index|⬅️ Zurück zum Master Index]]
`;
      fs.writeFileSync(personaFile, personaContent, 'utf8');
    }

    // Helper to format individual ad notes
    const renderAdNote = (ad) => {
      const dm = ad.decisionMatrix || {};
      const scores = dm.scores || {};
      const vec = dm.vectorization || {};
      const swarm = ad.swarmEvaluation || {};
      const proj = swarm.projections || {};
      const feedbacks = swarm.personaFeedbacks || [];

      return `---
id: ${ad.id}
track: ${ad.track}
grade: ${dm.grade || 'B'}
weighted_score: ${scores.weightedScore || 0}
predicted_ctr: ${proj.predictedCtrPercent || 0}%
predicted_cpl: €${proj.predictedCplEuro || 0}
approval_rate: ${swarm.approvalRatePercent || 0}%
framework: ${vec.D1_Framework || ad.framework}
angle: "${vec.D2_Angle || ad.angleConfig?.angle}"
tags:
  - grade/${dm.grade || 'B'}
  - track/${ad.track ? ad.track.toLowerCase() : 'rsa'}
  - framework/${(vec.D1_Framework || ad.framework || 'pas').toLowerCase()}
---

# 🎯 Ad Alternative: ${ad.id} (${dm.grade} Grade - Score: ${scores.weightedScore})

> **Empfehlung:** ${dm.recommendation || 'Keine Angabe'}

---

## 📊 Performance Projections (20-Agent Swarm)
- **Predicted CTR:** \`${proj.predictedCtrPercent || 0}%\`
- **Predicted CPC:** \`€${proj.predictedCpcEuro || 0}\`
- **Predicted CPM:** \`€${proj.predictedCpmEuro || 0}\`
- **Predicted CPL:** \`€${proj.predictedCplEuro || 0}\`
- **Swarm Approval Rate:** \`${swarm.approvalRatePercent || 0}%\`

---

## 📐 AI Asset Decision Matrix (6D Vectorization)
| Dimension | Wert |
| :--- | :--- |
| **D1 Framework** | \`${vec.D1_Framework || ad.framework}\` |
| **D2 Angle & Metaphor** | \`${vec.D2_Angle || ad.angleConfig?.angle}\` |
| **D3 Lifecycle Stage** | \`${vec.D3_LifecycleStage || ad.lifecycle}\` |
| **D4 Market Sophistication** | Level \`${vec.D4_MarketSophistication || ad.sophLevel}\` |
| **D5 Hook Type** | \`${vec.D5_HookType || ad.hookType}\` |
| **D6 Sentiment** | \`${vec.D6_Sentiment || ad.sentimentVal}\` |

### 5 Score-Achsen
- **Conversion Score:** \`${scores.conversion}/10\`
- **Audience Fit:** \`${scores.audience}/10\`
- **Hook Interrupt:** \`${scores.hook}/10\`
- **Tension Curve:** \`${scores.tension}/10\`
- **Sentiment Alignment:** \`${scores.sentiment}/10\`

---

## ✍️ Generierte Anzeigentexte

### Headlines (Max 30 Zeichen)
${(ad.headlines || []).map((h, idx) => `${idx + 1}. \`${h}\` (${h.length} Zeichen)`).join('\n')}

${ad.longHeadlines && ad.longHeadlines.length > 0 ? `### Long Headlines (PMax - Max 90 Zeichen)\n${ad.longHeadlines.map((lh, idx) => `${idx + 1}. \`${lh}\` (${lh.length} Zeichen)`).join('\n')}\n` : ''}

### Descriptions (Max 90 Zeichen)
${(ad.descriptions || []).map((d, idx) => `${idx + 1}. \`${d}\` (${d.length} Zeichen)`).join('\n')}

---

## 🗣️ 20-Agent Persona Swarm O-Ton Feedback
${feedbacks.length > 0 ? feedbacks.map(f => `> **[[${f.personaId}_${f.personaName.replace(/[^a-zA-Z0-9_-]/g, '_')}|${f.personaId} - ${f.personaName}]]** (${f.ageGender}):\n> ${f.oTon}\n`).join('\n') : '*Keine detaillierten Persona-Feedbacks hinterlegt.*'}

---
[[00_Index_MOC/Master_Index|⬅️ Zurück zum Master Index]] | [[05_Upload_Batch/Grade_A_Upload_Summary|📤 Zum Upload-Batch]]
`;
    };

    // 2. Export Grade A Winner Notes
    this.log(`Writing ${gradeA.length} Grade A Winner Notes...`);
    for (const ad of gradeA) {
      fs.writeFileSync(path.join(targetVault, '01_Grade_A_Winners', `${ad.id}.md`), renderAdNote(ad), 'utf8');
    }

    // 3. Export Grade B Candidate Notes
    this.log(`Writing ${gradeB.length} Grade B Candidate Notes...`);
    for (const ad of gradeB) {
      fs.writeFileSync(path.join(targetVault, '02_Grade_B_Candidates', `${ad.id}.md`), renderAdNote(ad), 'utf8');
    }

    // 4. Export Grade C & D Summary Archive Note
    this.log(`Writing Archive summary for ${gradeC.length + gradeD.length} Grade C & D Ads...`);
    const archiveContent = `---
title: Grade C & D Archive Summary
total_archived: ${gradeC.length + gradeD.length}
tags:
  - archive
---

# 📦 Grade C & D Archive Summary

Insgesamt wurden **${gradeC.length} Grade C** (Grenzwertig) und **${gradeD.length} Grade D** (Noise) Anzeigen archiviert.

## Beispiele aus dem Archiv:
${[...gradeC, ...gradeD].slice(0, 50).map(ad => `- **${ad.id}** (${ad.decisionMatrix.grade}): Score \`${ad.decisionMatrix.scores.weightedScore}\` | Angle: \`${ad.angleConfig?.angle}\` | Headline: "${ad.headlines[0]}"`).join('\n')}

---
[[00_Index_MOC/Master_Index|⬅️ Zurück zum Master Index]]
`;
    fs.writeFileSync(path.join(targetVault, '03_Grade_C_D_Archive', 'Archive_Summary.md'), archiveContent, 'utf8');

    // 5. Write Upload Summary Note
    const uploadSummaryContent = `---
title: Grade A Upload Summary
target_upload_count: ${gradeA.length}
tags:
  - upload
  - google-ads
---

# 📤 Google Ads Grade A Winner Upload Summary

Folgende **Grade A Gewinner-Anzeigen** wurden für den Upload in Google Ads im Status \`PAUSED\` ausgewählt:

${gradeA.map(ad => `- [[${ad.id}]] | Score: \`${ad.decisionMatrix.scores.weightedScore}\` | Predicted CTR: \`${ad.swarmEvaluation?.projections?.predictedCtrPercent}%\` | CPL: \`€${ad.swarmEvaluation?.projections?.predictedCplEuro}\``).join('\n')}

---
[[00_Index_MOC/Master_Index|⬅️ Zurück zum Master Index]]
`;
    fs.writeFileSync(path.join(targetVault, '05_Upload_Batch', 'Grade_A_Upload_Summary.md'), uploadSummaryContent, 'utf8');

    // 6. Write Master Index / Map of Content (MOC)
    const masterIndexContent = `---
title: Master Index & Map of Content (MOC)
vault_name: ObsidianVault_AI_Assets
generated_at: "${new Date().toISOString()}"
total_ads: ${ads.length}
track: ${dataset.track || 'RSA'}
theme: "${dataset.theme || 'SEA Lead Gen'}"
tags:
  - index
  - moc
  - dashboard
---

# 🚀 Obsidian AI Asset Library Dashboard

Willkommen in deinem lokalen **AI Asset Library Vault**! Hier findest du das vollständige Predictive Testing & Pre-production Archiv für **${ads.length} vorgenerierte ${dataset.track === 'PMAX' ? 'PMax Asset-Gruppen' : 'Responsive Search Ads (RSAs)'}**.

---

## 📈 Executive Summary Dashboard

| Metrik | Wert |
| :--- | :--- |
| **Gesamtzahl vorgenerierter Assets** | \`${ads.length}\` |
| **Kampagnen-Typ / Track** | \`${dataset.track || 'RSA'}\` |
| **Kampagnen-Thema** | \`${dataset.theme || 'SEA Lead Gen'}\` |
| **Grade A Winners (PMF-Skalierung)** | \`${gradeA.length}\` |
| **Grade B Candidates (Testwürdig)** | \`${gradeB.length}\` |
| **Grade C Grenzwertig** | \`${gradeC.length}\` |
| **Grade D Noise (Archiviert)** | \`${gradeD.length}\` |
| **Bester Predicted CTR** | \`${gradeA[0]?.swarmEvaluation?.projections?.predictedCtrPercent || 7.5}%\` |
| **Bester Predicted CPL** | \`€${gradeA[0]?.swarmEvaluation?.projections?.predictedCplEuro || 18.50}\` |

---

## 🗂️ Schnellzugriff & Navigation

- 🏆 **[[05_Upload_Batch/Grade_A_Upload_Summary|📤 Upload-Batch (Top Grade A Winners)]]**
- 🌟 **Grade A Gewinner (${gradeA.length} Notes):**
${gradeA.slice(0, 10).map(ad => `  - [[${ad.id}]] (Score: \`${ad.decisionMatrix.scores.weightedScore}\` | CTR: \`${ad.swarmEvaluation?.projections?.predictedCtrPercent}%\`)`).join('\n')}
- 🔬 **[[02_Grade_B_Candidates/|🧪 Grade B Test-Kandidaten (${gradeB.length} Ads)]]**
- 📦 **[[03_Grade_C_D_Archive/Archive_Summary|📦 Grade C & D Archiv (${gradeC.length + gradeD.length} Ads)]]**
- 🤖 **[[04_Personas/|👥 20-Agent Persona Swarm Übersicht]]**

---
*Erstellt von Antigravity CLI - ai-asset-library*
`;
    fs.writeFileSync(path.join(targetVault, '00_Index_MOC', 'Master_Index.md'), masterIndexContent, 'utf8');

    this.log(`Obsidian Vault successfully generated at: ${targetVault}`);
    return {
      vaultPath: targetVault,
      totalNotes: ads.length + PERSONAS.length + 3,
      gradeCounts: dataset.gradeCounts
    };
  }
}
