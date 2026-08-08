import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.resolve(__dirname, '../config.json');
const EXAMPLE_CONFIG_PATH = path.resolve(__dirname, '../config.example.json');

const DEFAULT_OBSIDIAN_VAULT = path.resolve(process.env.USERPROFILE || 'C:\\Users\\User', 'Desktop', 'ObsidianVault_AI_Assets');

export function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    if (fs.existsSync(EXAMPLE_CONFIG_PATH)) {
      const defaultData = fs.readFileSync(EXAMPLE_CONFIG_PATH, 'utf8');
      fs.writeFileSync(CONFIG_PATH, defaultData, 'utf8');
    } else {
      const initialConfig = {
        customerId: '',
        loginCustomerId: '',
        developerToken: '',
        clientId: '',
        clientSecret: '',
        refreshToken: '',
        accessToken: '',
        googleAdsVersion: 'v16',
        geminiApiKey: process.env.GEMINI_API_KEY || '',
        activeFramework: 'angles',
        obsidianVaultPath: DEFAULT_OBSIDIAN_VAULT
      };
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(initialConfig, null, 2), 'utf8');
    }
  }

  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config = JSON.parse(raw);
    if (!config.obsidianVaultPath) {
      config.obsidianVaultPath = DEFAULT_OBSIDIAN_VAULT;
    }
    return config;
  } catch (err) {
    console.error(`Error reading config.json: ${err.message}`);
    return {};
  }
}

export function saveConfig(updates) {
  const current = getConfig();
  const updated = { ...current, ...updates };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf8');
  return updated;
}
