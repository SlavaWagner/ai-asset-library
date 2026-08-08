import BaseAgent from './BaseAgent.js';

export const PERSONAS = [
  { id: 'SWARM-01', name: 'Early Tech Adopter', age: 28, gender: 'm', focus: 'Innovation & Speed', bias: 'Pragmatic' },
  { id: 'SWARM-02', name: 'Skeptical Auditor', age: 54, gender: 'm', focus: 'Risk Reduction', bias: 'Hyper-critical' },
  { id: 'SWARM-03', name: 'First-time Buyer Family', age: 32, gender: 'f', focus: 'Security & Transparency', bias: 'Emotional' },
  { id: 'SWARM-04', name: 'Classic Capital Investor', age: 48, gender: 'm', focus: 'Cashflow & ROI', bias: 'Data-driven' },
  { id: 'SWARM-05', name: 'Cautious Saver', age: 42, gender: 'f', focus: 'Substance Protection', bias: 'Risk-averse' },
  { id: 'SWARM-06', name: 'Real Estate Heir', age: 39, gender: 'm', focus: 'Asset Preservation', bias: 'Value-oriented' },
  { id: 'SWARM-07', name: 'Estate Wealth Planner', age: 67, gender: 'm', focus: 'Generational Transfer', bias: 'Traditional' },
  { id: 'SWARM-08', name: 'Urban Career Professional', age: 35, gender: 'f', focus: 'Time Savings & Quality', bias: 'Premium' },
  { id: 'SWARM-09', name: 'Conservative Wealth Defender', age: 61, gender: 'm', focus: 'Inflation Protection', bias: 'Conservative' },
  { id: 'SWARM-10', name: 'ESG & Sustainability Advocate', age: 31, gender: 'f', focus: 'Sustainability & ESG', bias: 'Values-driven' },
  { id: 'SWARM-11', name: 'Bargain & Value Hunter', age: 44, gender: 'm', focus: 'Price-Performance Arbitrage', bias: 'Opportunistic' },
  { id: 'SWARM-12', name: 'Commercial Portfolio Buyer', age: 52, gender: 'm', focus: 'Scaling & B2B', bias: 'Institutional' },
  { id: 'SWARM-13', name: 'Suburban Relocator', age: 37, gender: 'f', focus: 'Space & Lifestyle', bias: 'Family-focused' },
  { id: 'SWARM-14', name: 'Downsizer Best-Ager', age: 64, gender: 'f', focus: 'Accessibility & Comfort', bias: 'Comfort-seeking' },
  { id: 'SWARM-15', name: 'Tech Entrepreneur', age: 33, gender: 'm', focus: 'Automation & AI Leverage', bias: 'Growth-driven' },
  { id: 'SWARM-16', name: 'Multi-Generation Planner', age: 45, gender: 'f', focus: 'Flexibility & Cohesion', bias: 'Holistic' },
  { id: 'SWARM-17', name: 'Passive Income Seeker', age: 36, gender: 'm', focus: 'Hands-off Yield', bias: 'Freedom-oriented' },
  { id: 'SWARM-18', name: 'Luxury & Prestige Buyer', age: 46, gender: 'm', focus: 'Exclusivity & Status', bias: 'Status-conscious' },
  { id: 'SWARM-19', name: 'Value-Add Renovator', age: 41, gender: 'm', focus: 'Value Appreciation', bias: 'Action-oriented' },
  { id: 'SWARM-20', name: 'Institutional Investor', age: 58, gender: 'f', focus: 'Governance & Compliance', bias: 'Strictly Compliant' }
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
    const baseCtr = parseFloat((3.5 + (score * 0.45)).toFixed(2));
    const baseCpc = parseFloat((2.80 - (score * 0.15)).toFixed(2));
    const baseCpm = parseFloat((18.0 + (score * 1.2)).toFixed(2));
    const baseCpl = parseFloat((45.0 - (score * 3.2)).toFixed(2));

    const personaFeedbacks = PERSONAS.map(p => {
      let isPositive = score >= 7.0;
      let oTon = '';

      if (grade === 'A') {
        oTon = `[${p.id} ${p.name}]: "Strong angle! The metaphor aligns directly with my core requirement for ${p.focus}. Would click immediately."`;
      } else if (grade === 'B') {
        oTon = `[${p.id} ${p.name}]: "Interesting positioning. Creates curiosity, but I require concrete proof points on the landing page."`;
      } else if (grade === 'C') {
        oTon = `[${p.id} ${p.name}]: "Somewhat generic. Sounds like standard marketing messaging. Moderate interest."`;
      } else {
        oTon = `[${p.id} ${p.name}]: "Too buzzword-heavy. Not persuasive for my expectations regarding ${p.focus}."`;
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
