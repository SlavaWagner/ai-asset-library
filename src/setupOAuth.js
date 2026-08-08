import express from 'express';
import axios from 'axios';
import open from 'open';
import { getConfig, saveConfig } from './config.js';

export async function runOAuthSetup(port = 8085) {
  const config = getConfig();

  if (!config.clientId || !config.clientSecret) {
    console.log('\n[FEHLER] GCP OAuth Client ID und Client Secret sind nicht in config.json hinterlegt.');
    console.log('Bitte passe config.json an und trage deine OAuth Credentials ein.\n');
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
  console.log(`🔑 GOOGLE ADS OAUTH2 MCC SET-UP TOOL`);
  console.log(`===========================================================`);
  console.log(`Starte lokalen Server auf ${redirectUri} ...`);
  console.log(`\nBitte öffne folgenden Link in deinem Browser für die Freigabe:`);
  console.log(`\n🔗 ${authUrl}\n`);

  let server;

  return new Promise((resolve, reject) => {
    server = app.listen(port, async () => {
      // Attempt to open browser automatically
      try {
        await open(authUrl);
      } catch (err) {
        // Browser auto-open silent ignore
      }
    });

    app.get('/', async (req, res) => {
      const code = req.query.code;
      if (!code) {
        res.send('<h1>Fehler: Kein Code empfangen</h1>');
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
            <h1 style="color: #10b981;">✅ Authentifizierung Erfolgreich!</h1>
            <p>Die Refresh- und Access-Tokens wurden in deiner <code>config.json</code> gespeichert.</p>
            <p>Du kannst dieses Browser-Fenster jetzt schließen und zur Antigravity CLI zurückkehren.</p>
          </div>
        `);

        console.log(`\n===========================================================`);
        console.log(`✅ OAUTH AUTHENTIFIZIERUNG ERFOLGREICH!`);
        console.log(`Access Token und Refresh Token wurden gespeichert in config.json.`);
        console.log(`===========================================================\n`);

        setTimeout(() => {
          server.close();
          resolve(true);
        }, 1500);

      } catch (err) {
        const details = err.response ? JSON.stringify(err.response.data) : err.message;
        res.send(`<h1>Fehler bei der Token-Generierung</h1><pre>${details}</pre>`);
        console.error(`Token Exchange Failed: ${details}`);
        server.close();
        reject(err);
      }
    });
  });
}
