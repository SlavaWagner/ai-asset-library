import BaseAgent from './BaseAgent.js';

const RESTRICTED_TERMS = ['ROI', 'BOOST', 'SOFORT', 'JETZT', 'BEWIESEN', 'GARANTIERT100%'];

export default class ReviewAgent extends BaseAgent {
  constructor() {
    super('ReviewAgent');
  }

  /**
   * Sanitizes ad assets for Google Ads compliance and character length constraints
   */
  sanitizeAd(ad) {
    const sanitizeText = (text, maxLength) => {
      let cleaned = text || '';
      for (const term of RESTRICTED_TERMS) {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        cleaned = cleaned.replace(regex, '');
      }
      cleaned = cleaned.replace(/\s+/g, ' ').trim();
      if (cleaned.length > maxLength) {
        cleaned = cleaned.substring(0, maxLength).trim();
      }
      return cleaned;
    };

    const cleanHeadlines = (ad.headlines || [])
      .map(h => sanitizeText(h, 30))
      .filter(h => h.length >= 5);

    const cleanLongHeadlines = (ad.longHeadlines || [])
      .map(h => sanitizeText(h, 90))
      .filter(h => h.length >= 10);

    const cleanDescriptions = (ad.descriptions || [])
      .map(d => sanitizeText(d, 90))
      .filter(d => d.length >= 15);

    return {
      ...ad,
      headlines: cleanHeadlines,
      longHeadlines: cleanLongHeadlines,
      descriptions: cleanDescriptions,
      isCompliant: true
    };
  }
}
