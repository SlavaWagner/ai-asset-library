import BaseAgent from './BaseAgent.js';
import DecisionMatrix from '../scoring/DecisionMatrix.js';
import AgentSwarm from './AgentSwarm.js';
import ReviewAgent from './ReviewAgent.js';

const FRAMEWORKS = ['PAS', 'AIDA', 'FAB', 'MVP Pivot', 'Big Five', 'DISG'];
const LIFECYCLE_STAGES = ['Lead', 'Prospect', 'SAL', 'Opportunity', 'Customer'];
const HOOK_TYPES = ['Benefit', 'Proof', 'Urgency', 'Paradox', 'Curiosity', 'Uniqueness'];

const UNCONVENTIONAL_ANGLES = [
  { angle: 'Asset-Festung', metaphor: 'Der stahlharte Schutzpanzer für dein Vermögen in unruhigen Zeiten.', spin: 'Vermögensarchitektur' },
  { angle: 'Asymmetrisches Hebelgesetz', metaphor: 'Minimaler Aufwand, maximale Hebelwirkung im Immobilienmarkt.', spin: 'Hebel-Strategie' },
  { angle: 'Rendite-Teleskop', metaphor: 'Versteckte Potenziale erkennen, die der Wettbewerb völlig übersieht.', spin: 'Weitsicht & Markt-Insider' },
  { angle: 'Paradoxer Sicherheitsanker', metaphor: 'Warum echtes Wachstum dort entsteht, wo andere Risiken fürchten.', spin: 'Antizyklische Dominanz' },
  { angle: 'Der Lautlose Beschleuniger', metaphor: 'Lautlose KI-Infrastruktur, die dein Portfolio im Hintergrund vervielfacht.', spin: 'Autonome Wertschöpfung' },
  { angle: 'Wertschöpfungs-Katalysator', metaphor: 'Wie aus einem gewöhnlichen Asset ein Rendite-Katalysator wird.', spin: 'Transformative Aufwertung' },
  { angle: 'Garantierte Substanz-Bastion', metaphor: 'Kein spekulativer Schaum – nur echte, unumstößliche Betonsubstanz.', spin: 'Substanzwert' },
  { angle: 'Der Unsichtbare Wettbewerbs-Vorsprung', metaphor: 'Dein technologischer Vorsprung vor 99% des lokalen Marktes.', spin: 'Technologiedominanz' },
  { angle: 'Generationen-Brücke', metaphor: 'Ein Fundament, das Werte sichert und über Jahrzehnte trägt.', spin: 'Nachhaltiges Erbe' },
  { angle: 'Das Gesetz des Ersten Zugs', metaphor: 'Wer den ersten Schritt wagt, sichert sich die Filetstücke am Markt.', spin: 'Pionier-Vorteil' },
  { angle: 'Die Rentabilitäts-Formel', metaphor: 'Mathematisch berechenbare Überlegenheit im Marktsegment.', spin: 'Formel-Exzellenz' },
  { angle: 'Bypass-Strategie', metaphor: 'Umschiffe überlaufene Pfade und gelange direkt zum Ziel.', spin: 'Effizienz-Bypass' },
  { angle: 'Das Stille Fundament', metaphor: 'Solides Fundament ohne Lärm – nachhaltiger Erfolg im Verborgenen.', spin: 'Stille Substanz' },
  { angle: 'Impuls-Verstärker', metaphor: 'Kleine gezielte Optimierungen verdoppeln das Resultat.', spin: 'Katalytischer Impuls' },
  { angle: 'Der Ertrags-Magnet', metaphor: 'Attrahiere erstklassige Gelegenheiten durch strategisches Profiling.', spin: 'Magnetisches Marketing' }
];

export default class PreproductionAgent extends BaseAgent {
  constructor() {
    super('PreproductionAgent');
    this.decisionMatrix = new DecisionMatrix();
    this.agentSwarm = new AgentSwarm();
    this.reviewAgent = new ReviewAgent();
  }

  /**
   * Mass pre-produces up to 4,500 cardinal AI ad alternatives (RSA or PMax Asset Groups),
   * vectorizes & scores them via DecisionMatrix, evaluates top candidates via 20-Agent Swarm.
   * 
   * @param {object} options
   * @param {string} options.theme - Campaign focus topic
   * @param {string} options.track - 'RSA' or 'PMAX'
   * @param {number} options.count - Number of assets to generate (default 4500)
   * @param {string} options.finalUrl - Target landing page URL
   * @returns {Promise<object>} Complete pre-production & evaluation dataset
   */
  async preproduceBatch(options = {}) {
    const {
      theme = 'Immobilien & High-Price Lead Gen',
      track = 'RSA',
      count = 4500,
      finalUrl = 'https://www.slavawagner.de'
    } = options;

    const isPMax = track.toUpperCase() === 'PMAX';
    this.log(`===========================================================`);
    this.log(`[START MASS PRODUCTION] Pre-producing ${count} ${isPMax ? 'PMax Asset Groups' : 'RSAs'}`);
    this.log(`Theme: "${theme}" | Target URL: ${finalUrl}`);
    this.log(`===========================================================`);

    const generatedAds = [];

    for (let i = 0; i < count; i++) {
      const angleConfig = UNCONVENTIONAL_ANGLES[i % UNCONVENTIONAL_ANGLES.length];
      const framework = FRAMEWORKS[i % FRAMEWORKS.length];
      const lifecycle = LIFECYCLE_STAGES[i % LIFECYCLE_STAGES.length];
      const hookType = HOOK_TYPES[i % HOOK_TYPES.length];
      const sophLevel = (i % 3) + 1;
      const sentimentVal = parseFloat((0.2 + ((i % 8) * 0.1)).toFixed(2));

      const adId = `AD-${track.toUpperCase()}-${(i + 1).toString().padStart(4, '0')}`;
      const name = isPMax ? `PMax Asset Group ${adId}` : `RSA Alternative ${adId}`;

      // Build 15 Headlines <= 30 chars
      const headlines = [
        `${angleConfig.spin} Exzellenz`,
        `Entdecke ${angleConfig.angle}`,
        `Starke ${framework}-Methode`,
        `Kompakter Markt-Insider`,
        `Mehr Ertrag ohne Risiko`,
        `Antizyklische Dominanz`,
        `Sichere jetzt Substanz`,
        `Der KI-Hebeleffekt`,
        `Maximale Wertschöpfung`,
        `Stabile Rendite sichern`,
        `Innovativer Vorsprung`,
        `Exklusive Strategie`,
        `Planbare Ergebnisse`,
        `Zukunftssichere Werte`,
        `Jetzt Analyse anfordern`
      ].map(h => h.substring(0, 30));

      // Build 4 Long Headlines (PMax only) <= 90 chars
      const longHeadlines = isPMax ? [
        `${angleConfig.angle}: ${angleConfig.metaphor}`.substring(0, 90),
        `Wende das ${angleConfig.spin} Prinzip für nachhaltigen Erfolg in deinem Portfolio an.`.substring(0, 90),
        `Maximale Renditesicherheit durch antizyklische Positionierung und erprobte Frameworks.`.substring(0, 90),
        `Erhalte jetzt deinen exklusiven Leitfaden für erstklassige Investments & Strategien.`.substring(0, 90)
      ] : [];

      // Build 4 Descriptions <= 90 chars
      const descriptions = [
        `${angleConfig.metaphor}`.substring(0, 90),
        `Schütze dein Kapital vor Inflation und sichere dir erstklassige Erträge.`.substring(0, 90),
        `Wende das ${framework}-System an und sichere dir jetzt deinen Wettbewerbsvorteil.`.substring(0, 90),
        `Nutze die Strategie der Marktführer für transparente, berechenbare Resultate.`.substring(0, 90)
      ];

      const rawAd = {
        id: adId,
        name,
        track: track.toUpperCase(),
        theme,
        finalUrl,
        framework,
        angleConfig,
        lifecycle,
        hookType,
        sophLevel,
        sentimentVal,
        headlines,
        longHeadlines,
        descriptions
      };

      // Sanitize compliance & length
      const sanitizedAd = this.reviewAgent.sanitizeAd(rawAd);

      // Score via Decision Matrix
      const matrixResult = this.decisionMatrix.evaluateAd(sanitizedAd);

      // Combine into ad record
      const fullAdRecord = {
        ...sanitizedAd,
        decisionMatrix: matrixResult
      };

      generatedAds.push(fullAdRecord);

      // Log progress every 500 items or at completion
      if ((i + 1) % 500 === 0 || (i + 1) === count) {
        this.log(`Progress: Generated & matrix scored ${i + 1} / ${count} assets...`);
      }
    }

    // Sort generated ads by weightedScore descending
    generatedAds.sort((a, b) => b.decisionMatrix.scores.weightedScore - a.decisionMatrix.scores.weightedScore);

    // Evaluate top candidates via 20-Agent Persona Swarm
    this.log(`Deploying 20-Agent Persona Swarm to test and project performance for assets...`);
    for (let i = 0; i < generatedAds.length; i++) {
      // Swarm evaluate Grade A and B winners, or every 10th for lower tiers to keep execution fast
      if (generatedAds[i].decisionMatrix.grade === 'A' || generatedAds[i].decisionMatrix.grade === 'B' || i % 10 === 0) {
        generatedAds[i].swarmEvaluation = this.agentSwarm.evaluateWithSwarm(generatedAds[i]);
      } else {
        // Lightweight default swarm metrics for archived ads
        generatedAds[i].swarmEvaluation = {
          approvalRatePercent: 40,
          projections: { predictedCtrPercent: 3.2, predictedCpcEuro: 2.20, predictedCpmEuro: 22.0, predictedCplEuro: 35.0 },
          personaFeedbacks: []
        };
      }
    }

    // Summary statistics
    const gradeCounts = {
      Grade_A: generatedAds.filter(a => a.decisionMatrix.grade === 'A').length,
      Grade_B: generatedAds.filter(a => a.decisionMatrix.grade === 'B').length,
      Grade_C: generatedAds.filter(a => a.decisionMatrix.grade === 'C').length,
      Grade_D: generatedAds.filter(a => a.decisionMatrix.grade === 'D').length
    };

    this.log(`Mass Production Complete! Grade A: ${gradeCounts.Grade_A} | Grade B: ${gradeCounts.Grade_B} | Grade C: ${gradeCounts.Grade_C} | Grade D: ${gradeCounts.Grade_D}`);

    return {
      totalCount: count,
      track: track.toUpperCase(),
      theme,
      finalUrl,
      gradeCounts,
      generatedAds
    };
  }
}
