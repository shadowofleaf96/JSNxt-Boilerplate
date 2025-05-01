export interface EmailTemplateOptions {
    logoUrl: string;
    frontendUrl?: string;
    user?: {
      name?: string;
      email?: string;
    };
    action?: {
      url?: string;
      text?: string;
    };
    additionalContent?: string;
  }
  