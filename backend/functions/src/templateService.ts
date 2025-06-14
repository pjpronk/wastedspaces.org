import Handlebars from "handlebars";
import { readFileSync } from "fs";
import { join } from "path";
import { logger } from "firebase-functions";

interface BaseTemplateData {
  title?: string;
  [key: string]: any;
}

class TemplateService {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();
  private templatesPath: string;

  constructor() {
    this.templatesPath = join(__dirname, "templates");
    this.registerHelpers();
    this.registerPartials();
  }

  private registerPartials(): void {
    try {
      const partialsPath = join(this.templatesPath, "partials");
      const emailStylesPath = join(partialsPath, "styles.hbs");
      const emailStylesSource = readFileSync(emailStylesPath, "utf8");
      Handlebars.registerPartial("styles", emailStylesSource);
      logger.info("Email styles partial registered");
    } catch (error) {
      logger.warn("Failed to load email styles partial", error);
    }
  }

  private registerHelpers(): void {
    // Helper for date formatting
    Handlebars.registerHelper("formatDate", function (date: Date) {
      return date.toLocaleDateString("nl-NL");
    });
  }

  private loadTemplate(name: string): HandlebarsTemplateDelegate {
    if (this.templates.has(name)) {
      return this.templates.get(name)!;
    }

    try {
      const templatePath = join(this.templatesPath, `${name}.hbs`);
      const templateSource = readFileSync(templatePath, "utf8");
      const template = Handlebars.compile(templateSource);

      this.templates.set(name, template);
      logger.info(`Template loaded: ${name}`);
      return template;
    } catch (error) {
      logger.error(`Failed to load template: ${name}`, error);
      throw new Error(`Template not found: ${name}`);
    }
  }

  render(templateName: string, data: BaseTemplateData = {}): string {
    try {
      const template = this.loadTemplate(templateName);
      return template(data);
    } catch (error) {
      logger.error(`Failed to render template: ${templateName}`, error);
      throw error;
    }
  }

  preloadTemplates(templateNames: string[]): void {
    templateNames.forEach(name => {
      try {
        this.loadTemplate(name);
      } catch (error) {
        logger.warn(`Failed to preload template: ${name}`, error);
      }
    });
  }

  clearCache(): void {
    this.templates.clear();
    logger.info("Template cache cleared");
  }
}

export const templateService = new TemplateService();

templateService.preloadTemplates([
  "base-email",
  "location-verification",
  "vote-verification",
  "verification-result",
]);
