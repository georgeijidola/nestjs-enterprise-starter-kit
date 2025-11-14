import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { AppConfiguration } from '../../../config/app.config';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: AppConfiguration) {
    this.resend = new Resend(this.config.resendApiKey);
  }

  async send(payload: {
    to: string | string[];
    subject: string;
    html: string;
  }): Promise<void> {
    this.logger.log('Sending email to:', payload.to);

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.config.emailFrom,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });

      if (error) throw error;

      this.logger.log('Email sent successfully', data);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw error;
    }
  }
}
