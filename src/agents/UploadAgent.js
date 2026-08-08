import BaseAgent from './BaseAgent.js';
import { getConfig } from '../config.js';
import { refreshAccessToken, createAdGroupAd, createPMaxAssetGroup } from '../googleAds.js';

export default class UploadAgent extends BaseAgent {
  constructor() {
    super('UploadAgent');
  }

  /**
   * Filters the pre-generated batch for top Grade A winning assets and uploads them to Google Ads in PAUSED status.
   * 
   * @param {object} preproductionDataset - Dataset containing generated & evaluated ads
   * @param {object} options - Upload options (maxUploads, targetAdGroupId, targetCampaignResourceName)
   * @returns {Promise<object>} Summary of uploaded ads
   */
  async uploadBestWinners(preproductionDataset, options = {}) {
    const config = getConfig();
    const {
      maxUploads = 10,
      targetAdGroupId = null,
      targetCampaignResourceName = null
    } = options;

    const allAds = preproductionDataset.generatedAds || [];
    // Filter strictly for Grade A winners (or top candidates if no Grade A)
    let winners = allAds.filter(a => a.decisionMatrix?.grade === 'A');
    if (winners.length === 0) {
      winners = allAds.slice(0, maxUploads);
    } else {
      winners = winners.slice(0, maxUploads);
    }

    this.log(`Selected top ${winners.length} Grade A winner ads for upload to Google Ads.`);

    if (!config.refreshToken || !config.developerToken || !config.customerId) {
      this.log(`[NOTICE] Google Ads API credentials not configured. Preserving top ${winners.length} winner ads for manual/Editor upload.`);
      return {
        uploadedCount: 0,
        skippedReason: 'Credentials missing (run "ai-asset-library setup" to configure OAuth)',
        winners
      };
    }

    let accessToken;
    try {
      accessToken = await refreshAccessToken(config);
    } catch (err) {
      this.log(`Google Ads OAuth error: ${err.message}`);
      return { uploadedCount: 0, error: err.message, winners };
    }

    const isPMax = preproductionDataset.track === 'PMAX';
    const uploadResults = [];

    for (let i = 0; i < winners.length; i++) {
      const ad = winners[i];
      try {
        if (isPMax) {
          const campaignRes = targetCampaignResourceName || `customers/${config.customerId.replace(/-/g, '')}/campaigns/1234567890`;
          const resp = await createPMaxAssetGroup(
            config,
            accessToken,
            campaignRes,
            ad.finalUrl,
            ad.headlines,
            ad.longHeadlines,
            ad.descriptions,
            `AI Winner ${ad.id} (Grade A)`
          );
          uploadResults.push({ id: ad.id, status: 'SUCCESS', response: resp });
        } else {
          const adGroupRes = targetAdGroupId 
            ? `customers/${config.customerId.replace(/-/g, '')}/adGroups/${targetAdGroupId}`
            : `customers/${config.customerId.replace(/-/g, '')}/adGroups/1234567890`;
          
          const payload = {
            operations: [{
              create: {
                adGroup: adGroupRes,
                status: 'PAUSED',
                ad: {
                  finalUrls: [ad.finalUrl],
                  responsiveSearchAd: {
                    headlines: ad.headlines.map(text => ({ text })),
                    descriptions: ad.descriptions.map(text => ({ text }))
                  }
                }
              }
            }]
          };

          const resp = await createAdGroupAd(config, accessToken, payload);
          uploadResults.push({ id: ad.id, status: 'SUCCESS', response: resp });
        }
        this.log(`Successfully uploaded winner ${ad.id} (${ad.decisionMatrix.grade}) to Google Ads in PAUSED status.`);
      } catch (err) {
        this.log(`Failed to upload winner ${ad.id}: ${err.message}`);
        uploadResults.push({ id: ad.id, status: 'FAILED', error: err.message });
      }
    }

    return {
      uploadedCount: uploadResults.filter(r => r.status === 'SUCCESS').length,
      uploadResults,
      winners
    };
  }
}
