import { logger } from "firebase-functions";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { LocationDetails } from "./types";

interface EmailCredentials {
  accessToken: string;
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}

class EmailService {
  private oauth2Client: OAuth2Client;

  constructor(credentials: EmailCredentials) {
    this.oauth2Client = new google.auth.OAuth2(
      credentials.clientId,
      credentials.clientSecret,
      "https://developers.google.com/oauthplayground"
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

  private createEmailContent(
    location: Omit<LocationDetails, "id">,
    locationId: string,
    verificationToken: string,
  ): string {
    return `
      <h2>Nieuwe Locatie Toegevoegd aan Wasted Spaces</h2>
      <p>Een nieuwe locatie is ingediend bij de Wasted Spaces database:</p>
      
      <h3>Locatie Details:</h3>
      <ul>
        <li><strong>Adres:</strong> ${location.address}</li>
        <li><strong>Stad:</strong> ${location.city}</li>
        <li><strong>Type:</strong> ${location.type}</li>
        <li><strong>Eigendom:</strong> ${location.ownership}</li>
        <li><strong>Leeg Sinds:</strong> ${location.vacatedSince.toDateString()}</li>
        <li><strong>Coördinaten:</strong> ${location.latLng.latitude}, ${location.latLng.longitude}</li>
        <li><strong>Geverifieerd:</strong> ${location.verified ? "Ja" : "Nee"}</li>
        <li><strong>Ingediend Op:</strong> ${location.createdAt.toDate().toLocaleString()}</li>
      </ul>

      <p>
        <a href="${process.env.FUNCTIONS_BASE_URL}/verifyLocation?verificationToken=${verificationToken}&locationId=${locationId}" 
           style="color: #CC0000; text-decoration: underline;">
          Klik hier om deze locatie te verifiëren
        </a>
      </p>
      
      <p>Beoordeel deze inzending voor verificatie.</p>
    `;
  }

  private createEmailMessage(
    to: string,
    subject: string,
    htmlBody: string
  ): string {
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      htmlBody,
    ].join("\n");

    return Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  async sendLocationNotification(
    location: Omit<LocationDetails, "id">,
    locationId: string,
    verificationToken: string,
    submitterEmail: string
  ): Promise<void> {
    try {
      // Refresh credentials if needed
      await this.refreshCredentials();

      // Build Gmail service
      const gmail = google.gmail({ version: "v1", auth: this.oauth2Client });
      logger.info("Gmail service built successfully.");

      // Email configuration
      const toEmail = submitterEmail;
      const subject = `Thank you for submitting: ${location.address}`;
      const htmlBody = this.createEmailContent(
        location,
        locationId,
        verificationToken,
      );

      // Create and encode email message
      const encodedMessage = this.createEmailMessage(
        toEmail,
        subject,
        htmlBody
      );

      // Send email
      const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage,
        },
      });

      logger.info(
        `Email sent successfully to submitter: ${submitterEmail}. Message ID: ${response.data.id}`
      );
      logger.info(`Location notification sent for location ID: ${locationId}`);
    } catch (error) {
      logger.error("Error sending email notification:", error);
      // Don't throw the error to prevent location creation from failing
      // if email sending fails
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

    logger.info(credentials);

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
