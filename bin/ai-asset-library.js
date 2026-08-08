#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { getConfig, saveConfig } from '../src/config.js';
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
  .description('Interaktiver OAuth2 Authentifizierungs-Prozess für das Google Ads MCC Token')
  .option('-p, --port <number>', 'Lokaler Server Port', '8085')
  .action(async (options) => {
    try {
      await runOAuthSetup(parseInt(options.port, 10));
    } catch (err) {
      console.error(`Setup abgebrochen: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Command: preproduce
 */
program
  .command('preproduce')
  .description('Massen-Vorgenerierung von bis zu 4.500 Asset-Gruppen (PMax) oder RSAs mit Decision Matrix & Swarm Testing')
  .option('-c, --count <number>', 'Anzahl vorgenerierter Ad-Alternativen (Standard: 4500)', '4500')
  .option('-k, --track <rsa|pmax>', 'Kampagnen-Typ (rsa oder pmax)', 'rsa')
  .option('-t, --theme <topic>', 'Fokus-Thema der Kampagne', 'Immobilien & High-Price Lead Gen')
  .option('-u, --url <url>', 'Ziel-Landingpage URL', 'https://www.slavawagner.de')
  .option('-v, --vault <path>', 'Obsidian Vault Zielpfad auf dem Desktop')
  .option('--upload', 'Upload der Top Grade A Gewinner im Anschluss an Google Ads ausführen', false)
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

    // 2. Export ALL 4,500 ads + evaluations into Obsidian Desktop Vault (Vorbedingung)
    const exportResult = obsidianAgent.exportToVault(dataset, vaultPath);
    console.log(`\n✅ Obsidian Vault erfolgreich exportiert nach: ${exportResult.vaultPath}`);

    // 3. Optional Upload of top Grade A winners to Google Ads
    if (options.upload) {
      console.log(`\n📤 Starte Google Ads Upload der Top Grade A Gewinner...`);
      const uploadResult = await uploadAgent.uploadBestWinners(dataset);
      console.log(`Upload Result: ${uploadResult.uploadedCount} Ads im Status PAUSED hochgeladen.`);
    }

    console.log(`\n===========================================================`);
    console.log(`🎉 MASS PRE-PRODUCTION PIPELINE ERFOLGREICH ABGESCHLOSSEN!`);
    console.log(`Insgesamt: ${dataset.totalCount} ${track === 'PMAX' ? 'Asset-Gruppen' : 'RSAs'} verarbeitet.`);
    console.log(`Obsidian Vault: ${exportResult.vaultPath}`);
    console.log(`===========================================================\n`);
  });

/**
 * Command: refresh-token
 */
program
  .command('refresh-token')
  .description('Manuelles Erneuern des Google Ads OAuth Access Tokens')
  .action(async () => {
    const config = getConfig();
    try {
      const newToken = await refreshAccessToken(config);
      console.log(`✅ Access Token erfolgreich erneuert: ${newToken.substring(0, 15)}...`);
    } catch (err) {
      console.error(`Fehler beim Token-Refresh: ${err.message}`);
    }
  });

/**
 * Command: run-workflow
 */
program
  .command('run-workflow')
  .description('End-to-End Workflow: 4.500 Ads generieren, AI-Bewertungen erstellen, Obsidian Vault schreiben & Gewinner hochladen')
  .option('-c, --count <number>', 'Anzahl Vorgenerierungen (Standard: 4500)', '4500')
  .option('-k, --track <rsa|pmax>', 'Kampagnen-Typ', 'rsa')
  .action(async (options) => {
    const config = getConfig();
    const count = parseInt(options.count, 10);
    const track = options.track.toUpperCase();
    const vaultPath = config.obsidianVaultPath;

    const preprodAgent = new PreproductionAgent();
    const obsidianAgent = new ObsidianExportAgent();
    const uploadAgent = new UploadAgent();

    console.log(`\n🚀 STARTE END-TO-END AI AD WORKFLOW (${count} ${track} ADs)...`);

    const dataset = await preprodAgent.preproduceBatch({
      theme: 'High-Converting SEA Campaign',
      track,
      count,
      finalUrl: 'https://www.slavawagner.de'
    });

    const exportResult = obsidianAgent.exportToVault(dataset, vaultPath);
    const uploadResult = await uploadAgent.uploadBestWinners(dataset);

    console.log(`\n===========================================================`);
    console.log(`✅ WORKFLOW COMPLETE!`);
    console.log(`Generated: ${dataset.totalCount} Ads`);
    console.log(`Obsidian Vault: ${exportResult.vaultPath}`);
    console.log(`Google Ads Uploaded Winners: ${uploadResult.uploadedCount}`);
    console.log(`===========================================================\n`);
  });

program.parse(process.argv);
