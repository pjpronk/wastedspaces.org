import { logger } from "firebase-functions";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

interface EmailCredentials {
  accessToken: string;
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}

interface EmailMessage {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

class EmailService {
  private oauth2Client: OAuth2Client;

  constructor(credentials: EmailCredentials) {
    this.oauth2Client = new google.auth.OAuth2(
      credentials.clientId,
      credentials.clientSecret,
      process.env.OAUTH_REDIRECT_URI ||
        "http://localhost:5001/wastedspaces-prod/us-central1/oauthCallback"
    );

    this.oauth2Client.setCredentials({
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
    });
  }

  private async refreshCredentials(): Promise<void> {
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.oauth2Client.setCredentials(credentials);
      logger.info("Credentials refreshed successfully.");
    } catch (error) {
      logger.error("Error refreshing credentials:", error);
      throw error;
    }
  }

  private createEmailMessage(message: EmailMessage): string {
    const contentType = message.isHtml
      ? "Content-Type: text/html; charset=utf-8"
      : "Content-Type: text/plain; charset=utf-8";

    const emailMessage = [
      `To: ${message.to}`,
      `Subject: ${message.subject}`,
      contentType,
      "",
      message.body,
    ].join("\n");

    return Buffer.from(emailMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    try {
      // Refresh credentials if needed
      await this.refreshCredentials();

      // Build Gmail service
      const gmail = google.gmail({ version: "v1", auth: this.oauth2Client });
      logger.info("Gmail service built successfully.");

      // Create and encode email message
      const encodedMessage = this.createEmailMessage(message);

      // Send email
      const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage,
        },
      });

      logger.info(
        `Email sent successfully to: ${message.to}. Message ID: ${response.data.id}`
      );
    } catch (error) {
      logger.error("Error sending email:", error);
      throw error;
    }
  }
}

export function createEmailService(): EmailService | null {
  try {
    const credentials: EmailCredentials = {
      accessToken: process.env.GMAIL_ACCESS_TOKEN || "",
      refreshToken: process.env.GMAIL_REFRESH_TOKEN || "",
      clientId: process.env.OAUTH_CLIENT_ID || "",
      clientSecret: process.env.OAUTH_CLIENT_SECRET || "",
    };

    // Check if all required credentials are present
    if (
      !credentials.accessToken ||
      !credentials.refreshToken ||
      !credentials.clientId ||
      !credentials.clientSecret
    ) {
      logger.warn(
        "Email credentials not configured. Email notifications will be disabled."
      );
      return null;
    }

    return new EmailService(credentials);
  } catch (error) {
    logger.error("Error creating email service:", error);
    return null;
  }
}

export { EmailService, EmailMessage };
