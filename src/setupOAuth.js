import express from 'express';
import axios from 'axios';
import open from 'open';
import { getConfig, saveConfig } from './config.js';

export async function runOAuthSetup(port = 8085) {
  const config = getConfig();

  if (!config.clientId || !config.clientSecret) {
    console.log('\n[ERROR] GCP OAuth Client ID and Client Secret are missing from config.json.');
    console.log('Please update config.json with your OAuth credentials.\n');
    return;
  }

  const app = express();
  const redirectUri = `http://localhost:${port}`;

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(config.clientId)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent('https://www.googleapis.com/auth/adwords')}&` +
    `access_type=offline&` +
    `prompt=consent`;

  console.log(`\n===========================================================`);
  console.log(`GOOGLE ADS OAUTH2 MCC SETUP TOOL`);
  console.log(`===========================================================`);
  console.log(`Starting local server on ${redirectUri} ...`);
  console.log(`\nPlease open the following authorization link in your browser:`);
  console.log(`\nURL: ${authUrl}\n`);

  let server;

  return new Promise((resolve, reject) => {
    server = app.listen(port, async () => {
      try {
        await open(authUrl);
      } catch (err) {
        // Browser auto-open fallback
      }
    });

    app.get('/', async (req, res) => {
      const code = req.query.code;
      if (!code) {
        res.send('<h1>Error: No authorization code received</h1>');
        return;
      }

      try {
        const tokenResp = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
          code,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        }).toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token, refresh_token } = tokenResp.data;

        saveConfig({
          accessToken: access_token,
          refreshToken: refresh_token || config.refreshToken
        });

        res.send(`
          <div style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h1 style="color: #10b981;">Authentication Successful</h1>
            <p>Your OAuth refresh and access tokens have been stored in <code>config.json</code>.</p>
            <p>You may close this browser tab and return to the terminal.</p>
          </div>
        `);

        console.log(`\n===========================================================`);
        console.log(`OAUTH AUTHENTICATION SUCCESSFUL!`);
        console.log(`Tokens stored successfully in config.json.`);
        console.log(`===========================================================\n`);

        setTimeout(() => {
          server.close();
          resolve(true);
        }, 1500);

      } catch (err) {
        const details = err.response ? JSON.stringify(err.response.data) : err.message;
        res.send(`<h1>Token Exchange Error</h1><pre>${details}</pre>`);
        console.error(`Token Exchange Failed: ${details}`);
        server.close();
        reject(err);
      }
    });
  });
}
