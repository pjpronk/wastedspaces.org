import { OAuth2Client } from "google-auth-library";
import http from "http";
import url from "url";
import open from "open";
import dotenv from "dotenv";

dotenv.config({ path: `.env.development` });

// Configuration from environment variables
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/callback";

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

async function setupGmailOAuth() {
  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  // Generate the auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Force consent screen to get refresh token
  });

  console.log("Starting Gmail OAuth setup...\n");
  console.log("Before you start:");
  console.log(
    "1. Make sure you have set up OAuth 2.0 credentials in Google Cloud Console"
  );
  console.log(
    "2. Add this redirect URI to your OAuth credentials: " + REDIRECT_URI
  );
  console.log("3. Update CLIENT_ID and CLIENT_SECRET in this script\n");

  // Create a simple HTTP server to handle the callback
  const server = http.createServer(async (req, res) => {
    const queryObject = url.parse(req.url, true).query;

    if (queryObject.code) {
      try {
        const { tokens } = await oauth2Client.getToken(queryObject.code);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
              <h1 style="color: #4CAF50;">OAuth Setup Complete!</h1>
              <p>You can close this window and return to your terminal.</p>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>Your tokens have been generated successfully!</strong>
              </div>
            </body>
          </html>
        `);

        console.log("\n Success! Here are your Gmail OAuth tokens:\n");
        console.log("Add these to your environment variables:");
        console.log("=====================================");
        console.log(`GMAIL_ACCESS_TOKEN="${tokens.access_token}"`);
        console.log(`GMAIL_REFRESH_TOKEN="${tokens.refresh_token}"`);
        console.log("=====================================\n");

        console.log("For Firebase Functions, use:");
        console.log(
          `firebase functions:config:set gmail.access_token="${tokens.access_token}" gmail.refresh_token="${tokens.refresh_token}"`
        );
        console.log("\nYour email service is now ready to use!");

        server.close();
        process.exit(0);
      } catch (error) {
        console.error("Error getting tokens:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error getting tokens");
        server.close();
        process.exit(1);
      }
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("No authorization code found");
    }
  });

  server.listen(3000, () => {
    console.log("Opening browser for OAuth authorization...");
    open(authUrl);
  });
}

// Check if required config is set
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.log(
    "Please set OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET in your .env file!"
  );
  console.log(
    "Get these from Google Cloud Console → APIs & Services → Credentials"
  );
  console.log("\nAdd to your .env file:");
  console.log("OAUTH_CLIENT_ID=your_client_id_here");
  console.log("OAUTH_CLIENT_SECRET=your_client_secret_here");
  process.exit(1);
}

setupGmailOAuth().catch(console.error);
