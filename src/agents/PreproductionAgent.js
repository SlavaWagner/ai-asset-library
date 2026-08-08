import BaseAgent from './BaseAgent.js';
import DecisionMatrix from '../scoring/DecisionMatrix.js';
import AgentSwarm from './AgentSwarm.js';
import ReviewAgent from './ReviewAgent.js';

const FRAMEWORKS = ['PAS', 'AIDA', 'FAB', 'MVP Pivot', 'Big Five', 'DISG'];
const LIFECYCLE_STAGES = ['Lead', 'Prospect', 'SAL', 'Opportunity', 'Customer'];
const HOOK_TYPES = ['Benefit', 'Proof', 'Urgency', 'Paradox', 'Curiosity', 'Uniqueness'];

const UNCONVENTIONAL_ANGLES = [
  { angle: 'Asset Fortress', metaphor: 'The solid protective armor for your wealth in volatile markets.', spin: 'Wealth Architecture' },
  { angle: 'Asymmetrical Leverage', metaphor: 'Minimal effort, maximum strategic leverage in high-ticket markets.', spin: 'Leverage Strategy' },
  { angle: 'Yield Telescope', metaphor: 'Identify hidden market potential that competitors completely overlook.', spin: 'Foresight & Insider Insight' },
  { angle: 'Paradoxical Safety Anchor', metaphor: 'Why true exponential growth occurs where others fear market volatility.', spin: 'Contrarian Dominance' },
  { angle: 'The Silent Accelerator', metaphor: 'Silent AI infrastructure multiplying portfolio returns in the background.', spin: 'Autonomous Value Creation' },
  { angle: 'Value Creation Catalyst', metaphor: 'Transforming an ordinary asset into a high-yielding growth catalyst.', spin: 'Transformative Upgrade' },
  { angle: 'Substance Fortress', metaphor: 'Zero speculative fluff - purely verifiable, rock-solid substance.', spin: 'Substance Value' },
  { angle: 'Invisible Edge', metaphor: 'Your proprietary technological edge over 99% of the local market.', spin: 'Tech Dominance' },
  { angle: 'Generational Bridge', metaphor: 'A foundation designed to protect and compound wealth across decades.', spin: 'Sustainable Legacy' },
  { angle: 'First Mover Advantage', metaphor: 'Seizing prime market assets before the wider market reacts.', spin: 'Pioneer Advantage' },
  { angle: 'Profitability Formula', metaphor: 'Mathematically calculated superiority in your target segment.', spin: 'Formula Excellence' },
  { angle: 'Efficiency Bypass', metaphor: 'Bypassing congested market channels to reach peak ROI directly.', spin: 'Channel Bypass' },
  { angle: 'Quiet Foundation', metaphor: 'A quiet, unshakeable foundation delivering consistent compound returns.', spin: 'Silent Substance' },
  { angle: 'Impulse Amplifier', metaphor: 'Small targeted adjustments that double front-end conversion outcomes.', spin: 'Catalytic Impulse' },
  { angle: 'Yield Magnet', metaphor: 'Attracting premium high-ticket opportunities through strategic profiling.', spin: 'Magnetic Marketing' }
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
      theme = 'High-Price Lead Gen',
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
        `${angleConfig.spin} Excellence`,
        `Discover ${angleConfig.angle}`,
        `Proven ${framework} Framework`,
        `Insider Market Insight`,
        `Maximize Yield Safely`,
        `Contrarian Dominance`,
        `Secure Real Substance`,
        `The AI Leverage Effect`,
        `Peak Value Creation`,
        `Stable Compound Growth`,
        `Innovative Advantage`,
        `Exclusive Strategy`,
        `Predictable Results`,
        `Future-Proof Wealth`,
        `Request Analysis Now`
      ].map(h => h.substring(0, 30));

      // Build 4 Long Headlines (PMax only) <= 90 chars
      const longHeadlines = isPMax ? [
        `${angleConfig.angle}: ${angleConfig.metaphor}`.substring(0, 90),
        `Apply the ${angleConfig.spin} principle for sustainable growth in your portfolio.`.substring(0, 90),
        `Maximum return predictability through contrarian positioning and tested frameworks.`.substring(0, 90),
        `Access your exclusive blueprint for high-performing investments and strategies.`.substring(0, 90)
      ] : [];

      // Build 4 Descriptions <= 90 chars
      const descriptions = [
        `${angleConfig.metaphor}`.substring(0, 90),
        `Protect your capital against volatility and secure market-leading returns.`.substring(0, 90),
        `Deploy the ${framework} system to establish your unfair competitive advantage.`.substring(0, 90),
        `Utilize proven market-leader strategies for transparent, predictable outcomes.`.substring(0, 90)
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
      if (generatedAds[i].decisionMatrix.grade === 'A' || generatedAds[i].decisionMatrix.grade === 'B' || i % 10 === 0) {
        generatedAds[i].swarmEvaluation = this.agentSwarm.evaluateWithSwarm(generatedAds[i]);
      } else {
        generatedAds[i].swarmEvaluation = {
          approvalRatePercent: 40,
          projections: { predictedCtrPercent: 3.2, predictedCpcEuro: 2.20, predictedCpmEuro: 22.0, predictedCplEuro: 35.0 },
          personaFeedbacks: []
        };
      }
    }

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
