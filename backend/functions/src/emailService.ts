import { logger } from "firebase-functions";
import FormData from "form-data";
import Mailgun from "mailgun.js";

interface EmailMessage {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

class EmailService {
  private mailgun: ReturnType<Mailgun["client"]>;
  private domain: string;

  constructor(apiKey: string, domain: string) {
    const mailgun = new Mailgun(FormData);
    this.mailgun = mailgun.client({
      username: "api",
      key: apiKey,
      url: "https://api.eu.mailgun.net",
    });
    this.domain = domain;
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    try {
      const messageData = {
        from:
          process.env.MAILGUN_SENDER ||
          "Wasted Spaces <noreply@wastedspaces.org>",
        to: message.to,
        subject: message.subject,
        ...(message.isHtml ? { html: message.body } : { text: message.body }),
      };

      const response = await this.mailgun.messages.create(
        this.domain,
        messageData
      );
      logger.info(
        `Email sent successfully to: ${message.to}. Message ID: ${response.id}`
      );
    } catch (error) {
      logger.error("Error sending email:", error);
      throw error;
    }
  }
}

export function createEmailService(): EmailService | null {
  try {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;

    if (!apiKey || !domain) {
      logger.warn(
        "Mailgun credentials not configured. Email notifications will be disabled."
      );
      return null;
    }

    return new EmailService(apiKey, domain);
  } catch (error) {
    logger.error("Error creating email service:", error);
    return null;
  }
}

export { EmailService, EmailMessage };
