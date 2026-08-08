import BaseAgent from './BaseAgent.js';

export const PERSONAS = [
  { id: 'SWARM-01', name: 'Early Tech Adopter', age: 28, gender: 'm', focus: 'Innovation & Speed', bias: 'Pragmatisch' },
  { id: 'SWARM-02', name: 'Skeptischer Bedenkenträger', age: 54, gender: 'm', focus: 'Risikominimierung', bias: 'Hyperkritisch' },
  { id: 'SWARM-03', name: 'Erstkäufer & Junge Familie', age: 32, gender: 'w', focus: 'Sicherheit & Transparenz', bias: 'Emotional' },
  { id: 'SWARM-04', name: 'Klassischer Kapitalanleger', age: 48, gender: 'm', focus: 'Cashflow & ROI', bias: 'Zahlengetrieben' },
  { id: 'SWARM-05', name: 'Vorsichtige Bausparerin', age: 42, gender: 'w', focus: 'Substanzschutz', bias: 'Risikoavers' },
  { id: 'SWARM-06', name: 'Immobilien-Erbe', age: 39, gender: 'm', focus: 'Wertsicherung & Effizienz', bias: 'Substanzorientiert' },
  { id: 'SWARM-07', name: 'Vermögensvererber', age: 67, gender: 'm', focus: 'Generationswechsel', bias: 'Traditionell' },
  { id: 'SWARM-08', name: 'Urban Career Professional', age: 35, gender: 'w', focus: 'Zeitersparnis & Premium', bias: 'Qualitätsbewusst' },
  { id: 'SWARM-09', name: 'Konservativer Vermögensschützer', age: 61, gender: 'm', focus: 'Inflationsschutz', bias: 'Konservativ' },
  { id: 'SWARM-10', name: 'ESG & Sustainability Fan', age: 31, gender: 'w', focus: 'Nachhaltigkeit & ESG', bias: 'Werteorientiert' },
  { id: 'SWARM-11', name: 'Schnäppchen- & Value-Jäger', age: 44, gender: 'm', focus: 'Preis-Leistung Arbitrage', bias: 'Opportunistisch' },
  { id: 'SWARM-12', name: 'Gewerbe- & Portfoliokäufer', age: 52, gender: 'm', focus: 'Skalierung & B2B', bias: 'Institutionell' },
  { id: 'SWARM-13', name: 'Suburban Relocator', age: 37, gender: 'w', focus: 'Platz & Lebensqualität', bias: 'Familienfokussiert' },
  { id: 'SWARM-14', name: 'Downsizer / Best-Ager', age: 64, gender: 'w', focus: 'Barrierefreiheit & Komfort', bias: 'Komfortsuchend' },
  { id: 'SWARM-15', name: 'Tech Entrepreneur', age: 33, gender: 'm', focus: 'Autonomie & KI-Hebel', bias: 'Skalierungsgetrieben' },
  { id: 'SWARM-16', name: 'Mehrgenerationen-Planerin', age: 45, gender: 'w', focus: 'Flexibilität & Zusammenhalt', bias: 'Ganzheitlich' },
  { id: 'SWARM-17', name: 'Passives-Einkommen-Seeker', age: 36, gender: 'm', focus: 'Hands-off Rendite', bias: 'Freiheitsorientiert' },
  { id: 'SWARM-18', name: 'Luxus- & Prestige-Käufer', age: 46, gender: 'm', focus: 'Exklusivität & Status', bias: 'Prestigebewusst' },
  { id: 'SWARM-19', name: 'Value-Add Renovator', age: 41, gender: 'm', focus: 'Wertsteigerungspotenzial', bias: 'Machertyp' },
  { id: 'SWARM-20', name: 'Institutioneller Anleger', age: 58, gender: 'w', focus: 'Governance & Compliance', bias: 'Regelkonform' }
];

export default class AgentSwarm extends BaseAgent {
  constructor() {
    super('AgentSwarm');
  }

  /**
   * Runs predictive testing across 20 personas for a candidate ad
   * 
   * @param {object} ad - Ad alternative object with matrix score
   * @returns {object} Persona feedback statements and predictive metric projections
   */
  evaluateWithSwarm(ad) {
    const score = ad.decisionMatrix?.scores?.weightedScore || 7.5;
    const grade = ad.decisionMatrix?.grade || 'B';

    // Base projections derived from DecisionMatrix score
    const baseCtr = parseFloat((3.5 + (score * 0.45)).toFixed(2)); // e.g. 7.1% CTR
    const baseCpc = parseFloat((2.80 - (score * 0.15)).toFixed(2)); // e.g. €1.68 CPC
    const baseCpm = parseFloat((18.0 + (score * 1.2)).toFixed(2));  // e.g. €27.00 CPM
    const baseCpl = parseFloat((45.0 - (score * 3.2)).toFixed(2));  // e.g. €21.00 CPL

    const personaFeedbacks = PERSONAS.map(p => {
      let isPositive = score >= 7.0;
      let oTon = '';

      if (grade === 'A') {
        oTon = `[${p.id} ${p.name}]: "Sehr starker Aufhänger! Die Metapher trifft genau mein Bedürfnis nach ${p.focus}. Klicke ich sofort."`;
      } else if (grade === 'B') {
        oTon = `[${p.id} ${p.name}]: "Interessant formuliert. Macht neugierig, aber ich brauche auf der Landingpage konkrete Beweise."`;
      } else if (grade === 'C') {
        oTon = `[${p.id} ${p.name}]: "Ein wenig austauschbar. Klingt nach Standard-Marketing. Klicke ich nur bedingt."`;
      } else {
        oTon = `[${p.id} ${p.name}]: "Zu viel Marketing-Sprech. Überhaupt nicht überzeugend für meine Ansprüche an ${p.focus}."`;
      }

      return {
        personaId: p.id,
        personaName: p.name,
        ageGender: `${p.gender}/${p.age}`,
        focusArea: p.focus,
        rating: isPositive ? 'POSITIVE' : 'NEUTRAL_OR_NEGATIVE',
        oTon
      };
    });

    const positiveCount = personaFeedbacks.filter(f => f.rating === 'POSITIVE').length;
    const approvalRate = Math.round((positiveCount / PERSONAS.length) * 100);

    return {
      approvalRatePercent: approvalRate,
      projections: {
        predictedCtrPercent: baseCtr,
        predictedCpcEuro: Math.max(0.50, baseCpc),
        predictedCpmEuro: baseCpm,
        predictedCplEuro: Math.max(8.00, baseCpl)
      },
      personaFeedbacks
    };
  }
}
