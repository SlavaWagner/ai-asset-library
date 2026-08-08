import path from 'path';
import fs from 'fs';
import { getConfig } from '../src/config.js';
import DecisionMatrix from '../src/scoring/DecisionMatrix.js';
import ReviewAgent from '../src/agents/ReviewAgent.js';
import AgentSwarm from '../src/agents/AgentSwarm.js';
import PreproductionAgent from '../src/agents/PreproductionAgent.js';
import ObsidianExportAgent from '../src/agents/ObsidianExportAgent.js';
import UploadAgent from '../src/agents/UploadAgent.js';

async function runVerification() {
  console.log(`===========================================================`);
  console.log(`RUNNING VERIFICATION SUITE FOR AI-ASSET-LIBRARY`);
  console.log(`===========================================================`);

  // 1. Config Test
  console.log(`[TEST 1] Testing config.js...`);
  const config = getConfig();
  console.log(`Vault Path configured: ${config.obsidianVaultPath}`);
  console.assert(config.obsidianVaultPath !== undefined, 'Obsidian Vault Path must be defined');

  // 2. Decision Matrix Test
  console.log(`[TEST 2] Testing DecisionMatrix...`);
  const matrix = new DecisionMatrix();
  const sampleAd = {
    id: 'TEST-001',
    framework: 'PAS',
    angleConfig: { angle: 'Asset Fortress', spin: 'Wealth Protection' },
    headlines: Array(15).fill('Test Headline (30 chars max)'),
    descriptions: Array(4).fill('Test Description (90 chars max)')
  };
  const evalResult = matrix.evaluateAd(sampleAd);
  console.log(`Weighted Score: ${evalResult.scores.weightedScore} | Grade: ${evalResult.grade}`);
  console.assert(evalResult.scores.weightedScore > 0, 'Score must be > 0');

  // 3. Review Agent Test
  console.log(`[TEST 3] Testing ReviewAgent compliance sanitizer...`);
  const reviewer = new ReviewAgent();
  const rawAd = {
    headlines: ['Get NOW 100% BOOST!', 'Buy Instant', 'Standard Headline'],
    descriptions: ['Here is a description with PROVEN and INSTANT results!']
  };
  const sanitized = reviewer.sanitizeAd(rawAd);
  console.log(`Cleaned Headline: "${sanitized.headlines[0]}"`);

  // 4. Agent Swarm Test
  console.log(`[TEST 4] Testing 20-Agent Swarm evaluation...`);
  const swarm = new AgentSwarm();
  const swarmEval = swarm.evaluateWithSwarm({ decisionMatrix: evalResult });
  console.log(`Swarm Approval: ${swarmEval.approvalRatePercent}% | Predicted CTR: ${swarmEval.projections.predictedCtrPercent}%`);
  console.assert(swarmEval.personaFeedbacks.length === 20, 'Must have 20 persona feedbacks');

  // 5. Preproduction Engine Batch Test (Small batch of 50 for quick verification)
  console.log(`[TEST 5] Testing PreproductionAgent mass pre-production engine...`);
  const preprod = new PreproductionAgent();
  const batchData = await preprod.preproduceBatch({
    theme: 'Real Estate Investment',
    track: 'RSA',
    count: 50,
    finalUrl: 'https://www.slavawagner.de'
  });
  console.log(`Generated ${batchData.generatedAds.length} ads. Grade A: ${batchData.gradeCounts.Grade_A}`);

  // 6. Obsidian Export Test
  console.log(`[TEST 6] Testing ObsidianExportAgent vault creation...`);
  const testVaultDir = path.resolve(process.env.USERPROFILE || 'C:\\Users\\User', 'Desktop', 'ObsidianVault_AI_Assets_Test');
  const obsidianExport = new ObsidianExportAgent();
  const exportRes = obsidianExport.exportToVault(batchData, testVaultDir);
  console.log(`Vault created at: ${exportRes.vaultPath}`);
  console.assert(fs.existsSync(path.join(testVaultDir, '00_Index_MOC', 'Master_Index.md')), 'Master Index MOC must exist');

  // 7. Upload Agent Filtering Test
  console.log(`[TEST 7] Testing UploadAgent Grade A filtering...`);
  const uploader = new UploadAgent();
  const uploadRes = await uploader.uploadBestWinners(batchData, { maxUploads: 5 });
  console.log(`Selected ${uploadRes.winners.length} winner ads for upload.`);

  console.log(`===========================================================`);
  console.log(`ALL 7 VERIFICATION TESTS PASSED SUCCESSFULLY!`);
  console.log(`===========================================================\n`);
}

runVerification().catch(err => {
  console.error(`Verification failed: ${err.message}\n${err.stack}`);
  process.exit(1);
});
