#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getConfig } from '../src/config.js';
import { runOAuthSetup } from '../src/setupOAuth.js';
import PreproductionAgent from '../src/agents/PreproductionAgent.js';
import ObsidianExportAgent from '../src/agents/ObsidianExportAgent.js';
import UploadAgent from '../src/agents/UploadAgent.js';
import { refreshAccessToken } from '../src/googleAds.js';

function getAsciiLogo() {
  const greenCube = chalk.hex('#1dd900');
  const cyanCube = chalk.hex('#06b6d4');
  const blueCube = chalk.hex('#4064d7');
  
  return [
    '',
    greenCube("             +---+ ") + cyanCube("     +---+ ") + blueCube("     +---+ "),
    greenCube("            /   /| ") + cyanCube("    /   /| ") + blueCube("    /   /| "),
    greenCube("           +---+ | ") + cyanCube("  +---+ | ") + blueCube("  +---+ | "),
    greenCube("           |   |/  ") + cyanCube("  |   |/  ") + blueCube("  |   |/  "),
    greenCube("           +---+   ") + cyanCube("  +---+   ") + blueCube("  +---+   "),
    blueCube("     +---+ ") + greenCube("     +---+ ") + blueCube("     +---+ "),
    blueCube("    /   /| ") + greenCube("    /   /| ") + blueCube("    /   /| "),
    blueCube("   +---+ | ") + greenCube("  +---+ | ") + blueCube("  +---+ | "),
    blueCube("   |   |/  ") + cyanCube("  |   |/  ") + blueCube("  |   |/  "),
    blueCube("   +---+   ") + greenCube("  +---+   ") + blueCube("  +---+   "),
    cyanCube("     +---+ ") + blueCube("     +---+ ") + greenCube("     +---+ "),
    cyanCube("    /   /| ") + blueCube("    /   /| ") + greenCube("    /   /| "),
    cyanCube("   +---+ | ") + blueCube("  +---+ | ") + greenCube("  +---+ | "),
    cyanCube("   |   |/  ") + blueCube("  |   |/  ") + greenCube("  |   |/  "),
    cyanCube("   +---+   ") + blueCube("  +---+   ") + blueCube("  +---+   "),
    '',
    chalk.bold.green('=== ai-asset-library - Google Ads Asset Library & Swarm Engine ==='),
    chalk.cyan('Pre-production, Obsidian Vault Export & Google Ads Upload'),
    chalk.gray('This AI Agent was created with the help of Google Antigravity CLI'),
    ''
  ].join('\n');
}

// Check if running inside Google Antigravity CLI (agy)
function isRunningInsideAntigravity() {
  if (process.argv.includes('--force') || process.argv.includes('--inside-agy')) {
    return true;
  }
  return Boolean(
    process.env.ANTIGRAVITY_PROJECT_ID ||
    process.env.ANTIGRAVITY_LS_VERSION ||
    process.env.ANTIGRAVITY_SOURCE_METADATA ||
    process.env.ANTIGRAVITY_TRAJECTORY_ID ||
    process.env.ANTIGRAVITY_AGENT ||
    process.env.JETSKI_APP_DATA_DIR ||
    process.env.AGY_SESSION ||
    process.env.AGY
  );
}

// Interceptor notice: skips static output and instructs user to start Antigravity
function showAgyPrerequisiteWarning(attemptedCmd) {
  const yellowBox = chalk.hex('#eab308');
  const greenText = chalk.bold.hex('#1dd900');
  const cyanText = chalk.bold.hex('#06b6d4');
  const whiteBold = chalk.bold.white;
  
  console.log(getAsciiLogo());
  console.log(yellowBox('================================================================================'));
  console.log(yellowBox('⚠️   VORBEDINGUNG ERFORDERLICH: GOOGLE ANTIGRAVITY CLI ("agy")'));
  console.log(yellowBox('================================================================================'));
  console.log();
  console.log(whiteBold('  Die ai-asset-library für Google Ads funktioniert ausschließlich'));
  console.log(whiteBold('  INNERHALB der Antigravity CLI!'));
  console.log();
  console.log(chalk.yellow('  Starte bitte vorher Antigravity mit dem Befehl "agy" und anschließend'));
  console.log(chalk.yellow('  kannst du mit den Befehlen der ai-asset-library chatten und die'));
  console.log(chalk.yellow('  Asset-Pre-Production- und Export-Prozesse bedienen.'));
  console.log();
  console.log(chalk.gray('  Hinweis: Auf dieser normalen Terminal-Ebene findet keine KI-Verarbeitung statt.'));
  console.log(chalk.gray('  Die Wiedergabe statischer Outputs wurde übersprungen.'));
  console.log();
  console.log(cyanText('  👉 SCHRITT 1:'));
  console.log(whiteBold('     Öffne deine Konsole und starte Antigravity mit folgendem Befehl:'));
  console.log();
  console.log('        ' + greenText('agy'));
  console.log();
  console.log(cyanText('  👉 SCHRITT 2:'));
  console.log(whiteBold('     In Antigravity kannst du interaktiv mit den AI Asset Library Agenten'));
  console.log(whiteBold('     chatten und sämtliche Pre-Production-, Obsidian- und Upload-Workflows steuern.'));
  console.log();
  console.log(yellowBox('================================================================================'));
  console.log(chalk.gray('  (Entwickler-Override:   Befehl mit "--force" oder "--inside-agy" ausführen)'));
  console.log();
}

const rawArgs = process.argv.slice(2);
if (!isRunningInsideAntigravity()) {
  showAgyPrerequisiteWarning(rawArgs.join(' '));
  process.exit(0);
}

const program = new Command();

program
  .name('ai-asset-library')
  .description('AI Agent Swarm & Mass Pre-production Library for 4,500 Google Ads Asset Groups & RSAs with Obsidian Desktop Vault Export (requires Antigravity CLI)')
  .version('1.0.0');

program.addHelpText('before', getAsciiLogo());

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
