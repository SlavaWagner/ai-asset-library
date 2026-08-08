#!/usr/bin/env node

import { Command } from 'commander';
import { getConfig } from '../src/config.js';
import { runOAuthSetup } from '../src/setupOAuth.js';
import PreproductionAgent from '../src/agents/PreproductionAgent.js';
import ObsidianExportAgent from '../src/agents/ObsidianExportAgent.js';
import UploadAgent from '../src/agents/UploadAgent.js';
import { refreshAccessToken } from '../src/googleAds.js';

const program = new Command();

program
  .name('ai-asset-library')
  .description('AI Agent Swarm & Mass Pre-production Library for 4,500 Google Ads Asset Groups & RSAs with Obsidian Desktop Vault Export')
  .version('1.0.0');

/**
 * Command: setup
 */
program
  .command('setup')
  .description('Interactive OAuth2 authentication tool for Google Ads MCC token')
  .option('-p, --port <number>', 'Local server port', '8085')
  .action(async (options) => {
    try {
      await runOAuthSetup(parseInt(options.port, 10));
    } catch (err) {
      console.error(`Setup aborted: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Command: preproduce
 */
program
  .command('preproduce')
  .description('Mass pre-production of up to 4,500 Asset Groups (PMax) or RSAs with Decision Matrix scoring & Swarm testing')
  .option('-c, --count <number>', 'Number of ad alternatives to generate (Default: 4500)', '4500')
  .option('-k, --track <rsa|pmax>', 'Campaign track (rsa or pmax)', 'rsa')
  .option('-t, --theme <topic>', 'Focus topic theme for the campaign', 'High-Price Lead Gen')
  .option('-u, --url <url>', 'Target landing page URL', 'https://www.slavawagner.de')
  .option('-v, --vault <path>', 'Destination path for Desktop Obsidian Vault')
  .option('--upload', 'Upload top Grade A winners to Google Ads after generation', false)
  .action(async (options) => {
    const config = getConfig();
    const count = parseInt(options.count, 10);
    const track = options.track.toUpperCase();
    const vaultPath = options.vault || config.obsidianVaultPath;

    const preprodAgent = new PreproductionAgent();
    const obsidianAgent = new ObsidianExportAgent();
    const uploadAgent = new UploadAgent();

    // 1. Generate & Score & Swarm Evaluate 4,500 Asset Groups / RSAs
    const dataset = await preprodAgent.preproduceBatch({
      theme: options.theme,
      track,
      count,
      finalUrl: options.url
    });

    // 2. Export ALL 4,500 ads + evaluations into Obsidian Desktop Vault
    const exportResult = obsidianAgent.exportToVault(dataset, vaultPath);
    console.log(`\nObsidian Vault successfully exported to: ${exportResult.vaultPath}`);

    // 3. Optional Upload of top Grade A winners to Google Ads
    if (options.upload) {
      console.log(`\nStarting Google Ads upload for top Grade A winners...`);
      const uploadResult = await uploadAgent.uploadBestWinners(dataset);
      console.log(`Upload Result: ${uploadResult.uploadedCount} Ads uploaded in PAUSED status.`);
    }

    console.log(`\n===========================================================`);
    console.log(`MASS PRE-PRODUCTION PIPELINE COMPLETED SUCCESSFULLY`);
    console.log(`Processed: ${dataset.totalCount} ${track === 'PMAX' ? 'Asset Groups' : 'RSAs'}`);
    console.log(`Obsidian Vault: ${exportResult.vaultPath}`);
    console.log(`===========================================================\n`);
  });

/**
 * Command: refresh-token
 */
program
  .command('refresh-token')
  .description('Manually refresh Google Ads OAuth access token')
  .action(async () => {
    const config = getConfig();
    try {
      const newToken = await refreshAccessToken(config);
      console.log(`Access token refreshed successfully: ${newToken.substring(0, 15)}...`);
    } catch (err) {
      console.error(`Token refresh error: ${err.message}`);
    }
  });

/**
 * Command: run-workflow
 */
program
  .command('run-workflow')
  .description('End-to-End Workflow: Generate 4,500 ads, score via AI, write Obsidian Vault & upload Grade A winners')
  .option('-c, --count <number>', 'Number of pre-productions (Default: 4500)', '4500')
  .option('-k, --track <rsa|pmax>', 'Campaign track', 'rsa')
  .action(async (options) => {
    const config = getConfig();
    const count = parseInt(options.count, 10);
    const track = options.track.toUpperCase();
    const vaultPath = config.obsidianVaultPath;

    const preprodAgent = new PreproductionAgent();
    const obsidianAgent = new ObsidianExportAgent();
    const uploadAgent = new UploadAgent();

    console.log(`\nSTARTING END-TO-END AI AD WORKFLOW (${count} ${track} Ads)...`);

    const dataset = await preprodAgent.preproduceBatch({
      theme: 'High-Converting SEA Campaign',
      track,
      count,
      finalUrl: 'https://www.slavawagner.de'
    });

    const exportResult = obsidianAgent.exportToVault(dataset, vaultPath);
    const uploadResult = await uploadAgent.uploadBestWinners(dataset);

    console.log(`\n===========================================================`);
    console.log(`WORKFLOW COMPLETE`);
    console.log(`Generated: ${dataset.totalCount} Ads`);
    console.log(`Obsidian Vault: ${exportResult.vaultPath}`);
    console.log(`Uploaded Google Ads Winners: ${uploadResult.uploadedCount}`);
    console.log(`===========================================================\n`);
  });

program.parse(process.argv);
