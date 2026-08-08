import axios from 'axios';
import { saveConfig } from './config.js';

/**
 * Builds HTTP headers for Google Ads API requests including MCC support
 */
function getHeaders(config, accessToken) {
  const headers = {
    'Content-Type': 'application/json',
    'developer-token': config.developerToken,
    'Authorization': `Bearer ${accessToken}`
  };

  if (config.loginCustomerId) {
    headers['login-customer-id'] = config.loginCustomerId.replace(/-/g, '');
  }

  return headers;
}

/**
 * Refreshes the OAuth2 access token using the stored refresh token
 */
export async function refreshAccessToken(config) {
  if (!config.refreshToken || !config.clientId || !config.clientSecret) {
    throw new Error('OAuth credentials missing in config.json. Please run "ai-asset-library setup" first.');
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken,
    grant_type: 'refresh_token'
  });

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const newAccessToken = response.data.access_token;
    saveConfig({ accessToken: newAccessToken });
    return newAccessToken;
  } catch (err) {
    const details = err.response ? JSON.stringify(err.response.data) : err.message;
    throw new Error(`Failed to refresh OAuth token: ${details}`);
  }
}

/**
 * Fetches active RSAs from Google Ads API
 */
export async function fetchActiveAds(config, accessToken) {
  const customerId = config.customerId.replace(/-/g, '');
  const url = `https://googleads.googleapis.com/${config.googleAdsVersion || 'v16'}/customers/${customerId}/googleAds:searchStream`;
  
  const query = `
    SELECT 
      ad_group_ad.ad.id, 
      ad_group_ad.ad.responsive_search_ad.headlines, 
      ad_group_ad.ad.responsive_search_ad.descriptions, 
      ad_group_ad.ad.final_urls, 
      ad_group_ad.ad_group, 
      metrics.all_conversions, 
      metrics.cost_per_all_conversions, 
      metrics.cost_micros 
    FROM ad_group_ad 
    WHERE ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD' 
      AND ad_group_ad.status IN ('ENABLED', 'PAUSED') 
      AND ad_group.status IN ('ENABLED', 'PAUSED') 
      AND campaign.status IN ('ENABLED', 'PAUSED') 
    LIMIT 10
  `.replace(/\s+/g, ' ').trim();

  try {
    const response = await axios.post(url, { query }, { headers: getHeaders(config, accessToken) });
    let allResults = [];
    if (Array.isArray(response.data)) {
      for (const chunk of response.data) {
        if (chunk.results && Array.isArray(chunk.results)) allResults.push(...chunk.results);
      }
    } else if (response.data?.results) {
      allResults = response.data.results;
    }

    return allResults.map(item => {
      const adGroupAd = item.adGroupAd;
      const metrics = item.metrics || {};
      return {
        adId: adGroupAd.ad.id,
        adGroup: adGroupAd.adGroup,
        adGroupId: adGroupAd.adGroup.split('/').pop(),
        headlines: adGroupAd.ad.responsiveSearchAd?.headlines?.map(h => h.text) || [],
        descriptions: adGroupAd.ad.responsiveSearchAd?.descriptions?.map(d => d.text) || [],
        finalUrls: adGroupAd.ad.finalUrls || [],
        metrics: {
          allConversions: metrics.allConversions || 0,
          costPerAllConversion: metrics.costPerAllConversions || 0,
          cost: (metrics.costMicros || 0) / 1000000
        }
      };
    });
  } catch (error) {
    const details = error.response ? JSON.stringify(error.response.data) : error.message;
    throw new Error(`Google Ads searchStream API error: ${details}`);
  }
}

/**
 * Creates a PAUSED Responsive Search Ad in Google Ads
 */
export async function createAdGroupAd(config, accessToken, payload) {
  const customerId = config.customerId.replace(/-/g, '');
  const url = `https://googleads.googleapis.com/${config.googleAdsVersion || 'v16'}/customers/${customerId}/adGroupAds:mutate`;

  try {
    const response = await axios.post(url, payload, { headers: getHeaders(config, accessToken) });
    return response.data;
  } catch (error) {
    const details = error.response ? JSON.stringify(error.response.data) : error.message;
    throw new Error(`Google Ads mutate RSA API error: ${details}`);
  }
}

/**
 * Fetches active PMax Asset Groups from Google Ads
 */
export async function fetchActivePMaxAssetGroups(config, accessToken) {
  const customerId = config.customerId.replace(/-/g, '');
  const url = `https://googleads.googleapis.com/${config.googleAdsVersion || 'v16'}/customers/${customerId}/googleAds:searchStream`;
  
  const query = `
    SELECT 
      asset_group.id, 
      asset_group.name, 
      asset_group.resource_name, 
      asset_group.campaign, 
      asset_group.status, 
      asset_group.final_urls, 
      campaign.id, 
      campaign.name, 
      campaign.resource_name, 
      campaign.status 
    FROM asset_group 
    WHERE campaign.advertising_channel_type = 'PERFORMANCE_MAX' 
      AND asset_group.status IN ('ENABLED', 'PAUSED') 
      AND campaign.status IN ('ENABLED', 'PAUSED') 
    LIMIT 10
  `.replace(/\s+/g, ' ').trim();

  try {
    const response = await axios.post(url, { query }, { headers: getHeaders(config, accessToken) });
    let allResults = [];
    if (Array.isArray(response.data)) {
      for (const chunk of response.data) {
        if (chunk.results && Array.isArray(chunk.results)) allResults.push(...chunk.results);
      }
    } else if (response.data?.results) {
      allResults = response.data.results;
    }

    return allResults.map(item => {
      const ag = item.assetGroup || {};
      const camp = item.campaign || {};
      return {
        assetGroupId: ag.id,
        assetGroupName: ag.name,
        assetGroupResourceName: ag.resourceName || `customers/${customerId}/assetGroups/${ag.id}`,
        campaignId: camp.id,
        campaignName: camp.name,
        campaignResourceName: camp.resourceName || `customers/${customerId}/campaigns/${camp.id}`,
        finalUrls: ag.finalUrls || []
      };
    });
  } catch (error) {
    const details = error.response ? JSON.stringify(error.response.data) : error.message;
    throw new Error(`Google Ads searchStream PMax error: ${details}`);
  }
}

/**
 * Creates a PAUSED Performance Max Asset Group in Google Ads
 */
export async function createPMaxAssetGroup(config, accessToken, campaignResourceName, finalUrl, headlines, longHeadlines, descriptions, customGroupName = null) {
  const customerId = config.customerId.replace(/-/g, '');
  const url = `https://googleads.googleapis.com/${config.googleAdsVersion || 'v16'}/customers/${customerId}/googleAds:mutate`;

  // Build text asset operations
  const textAssetOperations = [
    ...headlines.map(text => ({ assetOperation: { create: { textAsset: { text } } } })),
    ...longHeadlines.map(text => ({ assetOperation: { create: { textAsset: { text } } } })),
    ...descriptions.map(text => ({ assetOperation: { create: { textAsset: { text } } } }))
  ];

  try {
    // 1) Create text assets
    const assetResp = await axios.post(url, { mutateOperations: textAssetOperations }, { headers: getHeaders(config, accessToken) });
    const createdAssetResourceNames = (assetResp.data.mutateOperationResponses || [])
      .map(r => r.assetOperationResponse?.resourceName)
      .filter(Boolean);

    const assetGroupName = customGroupName || `AI PMax AssetGroup ${Date.now()}`;
    const tempAssetGroupResource = `customers/${customerId}/assetGroups/-1`;

    const headlineResources = createdAssetResourceNames.slice(0, headlines.length);
    const longHeadlineResources = createdAssetResourceNames.slice(headlines.length, headlines.length + longHeadlines.length);
    const descriptionResources = createdAssetResourceNames.slice(headlines.length + longHeadlines.length);

    // 2) Build asset group operations
    const mutateOperations = [
      {
        assetGroupOperation: {
          create: {
            resourceName: tempAssetGroupResource,
            name: assetGroupName,
            campaign: campaignResourceName,
            finalUrls: [finalUrl],
            status: 'PAUSED'
          }
        }
      },
      ...headlineResources.map(res => ({
        assetGroupAssetOperation: {
          create: {
            assetGroup: tempAssetGroupResource,
            asset: res,
            fieldType: 'HEADLINE'
          }
        }
      })),
      ...longHeadlineResources.map(res => ({
        assetGroupAssetOperation: {
          create: {
            assetGroup: tempAssetGroupResource,
            asset: res,
            fieldType: 'LONG_HEADLINE'
          }
        }
      })),
      ...descriptionResources.map(res => ({
        assetGroupAssetOperation: {
          create: {
            assetGroup: tempAssetGroupResource,
            asset: res,
            fieldType: 'DESCRIPTION'
          }
        }
      }))
    ];

    const response = await axios.post(url, { mutateOperations }, { headers: getHeaders(config, accessToken) });
    return response.data;
  } catch (error) {
    const details = error.response ? JSON.stringify(error.response.data) : error.message;
    throw new Error(`Google Ads createPMaxAssetGroup error: ${details}`);
  }
}
