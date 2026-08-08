/**
 * AI Asset Decision Matrix - 6D Vectorization & 5 Score Axes Calculator
 */
export default class DecisionMatrix {
  /**
   * Vectorizes an ad creative into 6 dimensions and scores it across 5 orthogonal axes.
   * 
   * @param {object} ad - Ad creative object
   * @returns {object} Vectorization, scores breakdown, composite score, and Grade (A, B, C, D)
   */
  evaluateAd(ad) {
    const d1_framework = ad.framework || 'PAS';
    const d2_angle = ad.angleConfig?.angle || ad.angle || 'Asset Fortress';
    const d3_lifecycle = ad.lifecycle || 'Lead';
    const d4_sophistication = ad.sophLevel || 2;
    const d5_hook = ad.hookType || 'Benefit';
    const d6_sentiment = ad.sentimentVal !== undefined ? ad.sentimentVal : 0.7;

    let conversion = 7.0;
    let audience = 7.0;
    let hook = 7.0;
    let tension = 7.0;
    let sentiment = Math.min(10.0, d6_sentiment * 10);

    const headlines = ad.headlines || [];
    const descriptions = ad.descriptions || [];
    
    if (headlines.length >= 15) conversion += 0.8;
    if (descriptions.length >= 4) audience += 0.8;

    if (['Asset Fortress', 'Asymmetrical Leverage', 'Yield Telescope', 'Paradoxical Safety Anchor'].includes(d2_angle)) {
      hook += 1.2;
      tension += 1.0;
      conversion += 0.5;
    }

    if (['PAS', 'AIDA'].includes(d1_framework)) {
      tension += 0.8;
      conversion += 0.7;
    }

    const idNum = parseInt((ad.id || '100').replace(/\D/g, '') || '100', 10);
    const variance = ((idNum * 13) % 25) / 10 - 1.0;

    conversion = Math.min(9.9, Math.max(4.0, parseFloat((conversion + variance * 0.4).toFixed(1))));
    audience = Math.min(9.9, Math.max(4.0, parseFloat((audience + variance * 0.3).toFixed(1))));
    hook = Math.min(9.9, Math.max(4.0, parseFloat((hook + variance * 0.5).toFixed(1))));
    tension = Math.min(9.9, Math.max(4.0, parseFloat((tension + variance * 0.4).toFixed(1))));
    sentiment = Math.min(9.9, Math.max(4.0, parseFloat((sentiment + variance * 0.2).toFixed(1))));

    const weightedScore = parseFloat((
      (0.35 * conversion) +
      (0.20 * audience) +
      (0.15 * hook) +
      (0.15 * tension) +
      (0.15 * sentiment)
    ).toFixed(2));

    let grade = 'C';
    let recommendation = 'Borderline - Low budget testing only';

    if (weightedScore >= 8.0) {
      grade = 'A';
      recommendation = 'PMF Candidate - Winner / Scale & Upload to Google Ads';
    } else if (weightedScore >= 6.5) {
      grade = 'B';
      recommendation = 'Test Worthy - Generate further variations';
    } else if (weightedScore < 5.0) {
      grade = 'D';
      recommendation = 'Noise - Archive & Discard';
    }

    return {
      vectorization: {
        D1_Framework: d1_framework,
        D2_Angle: d2_angle,
        D3_LifecycleStage: d3_lifecycle,
        D4_MarketSophistication: d4_sophistication,
        D5_HookType: d5_hook,
        D6_Sentiment: d6_sentiment
      },
      scores: {
        conversion,
        audience,
        hook,
        tension,
        sentiment,
        weightedScore
      },
      grade,
      recommendation
    };
  }
}
