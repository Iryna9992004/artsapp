import { MailerService } from '@nestjs-modules/mailer';
import { Controller } from '@nestjs/common';
import { RMQRoute } from 'nestjs-rmq';

@Controller()
export class AppController {
  constructor(private readonly mailerService: MailerService) {}

  @RMQRoute('notify')
  async sendTestEmail(data: { type?: string; title: string; description: string; email: string }) {
    try {
      console.log('Received notification:', data);
      
      // Get template based on notification type
      const template = this.getEmailTemplate(data.type || 'default', data.title, data.description);
      
      const res = await this.mailerService.sendMail({
        to: data.email || 'iren171302@gmail.com',
        subject: data.title || 'Notification from ArtsApp',
        html: template,
      });

      console.log('Email sent successfully:', res);
      return res;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  private getIconForType(type: string): string {
    switch (type) {
      case 'topic':
        return '💬';
      case 'message':
        return '✉️';
      case 'post':
        return '📝';
      case 'event':
        return '🎭';
      default:
        return '🎵';
    }
  }

  private getHeaderTextForType(type: string): string {
    switch (type) {
      case 'topic':
        return 'Нова тема створена';
      case 'message':
        return 'Повідомлення відправлено';
      case 'post':
        return 'Нова публікація створена';
      case 'event':
        return 'Нова подія створена';
      default:
        return 'Сповіщення від ArtsApp';
    }
  }

  private getEmailTemplate(type: string, title: string, description: string): string {
    const icon = this.getIconForType(type);
    const headerText = this.getHeaderTextForType(type);
    
    return `
      <!DOCTYPE html>
      <html lang="uk">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 50%, #e8ebff 100%);
            background-attachment: fixed;
            padding: 40px 20px;
            line-height: 1.6;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
          }
          .email-container {
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(30, 37, 177, 0.1), 0 4px 12px rgba(115, 74, 215, 0.08);
            position: relative;
            border: 1px solid rgba(30, 37, 177, 0.08);
          }
          .email-header {
            background: linear-gradient(135deg, #1E25B1 0%, #734AD7 50%, #FF45EC 100%);
            padding: 48px 32px 52px;
            text-align: center;
            color: #ffffff;
            position: relative;
            overflow: hidden;
          }
          .email-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 70%);
            animation: pulse 8s ease-in-out infinite;
          }
          .email-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 30px;
            background: #ffffff;
            border-radius: 30px 30px 0 0;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(5deg); }
          }
          .icon-wrapper {
            position: relative;
            z-index: 1;
            margin: 0 auto 24px;
            text-align: center;
          }
          .icon {
            font-size: 64px;
            display: inline-block;
            filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
          }
          .email-header h1 {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            position: relative;
            z-index: 1;
          }
          .email-header .subtitle {
            opacity: 0.92;
            font-size: 16px;
            font-weight: 500;
            letter-spacing: 0.3px;
            position: relative;
            z-index: 1;
          }
          .email-body {
            padding: 48px 40px;
            color: #1a1a1a;
            background: #ffffff;
            position: relative;
          }
          .email-body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #1E25B1, #734AD7, #FF45EC);
          }
          .email-body h2 {
            font-size: 26px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 20px;
            line-height: 1.4;
            background: linear-gradient(135deg, #1E25B1 0%, #734AD7 50%, #FF45EC 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .email-body .content {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 32px;
            line-height: 1.7;
            font-weight: 400;
          }
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(30, 37, 177, 0.2) 20%, rgba(115, 74, 215, 0.3) 50%, rgba(255, 69, 236, 0.2) 80%, transparent);
            margin: 32px 0;
            position: relative;
            border-radius: 1px;
          }
          .info-box {
            background: #f8f9ff;
            border-left: 4px solid #734AD7;
            padding: 20px 24px;
            border-radius: 10px;
            margin: 28px 0;
            box-shadow: 0 2px 8px rgba(30, 37, 177, 0.08);
          }
          .info-box p {
            font-size: 14px;
            color: #5a5568;
            margin: 0;
            line-height: 1.6;
            font-weight: 400;
          }
          .email-footer {
            background: #f8f9ff;
            padding: 32px 30px;
            text-align: center;
            border-top: 1px solid rgba(30, 37, 177, 0.1);
            position: relative;
          }
          .footer-logo {
            font-size: 24px;
            font-weight: 800;
            background: linear-gradient(135deg, #1E25B1 0%, #734AD7 50%, #FF45EC 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
          }
          .email-footer p {
            font-size: 15px;
            color: #6c757d;
            margin: 4px 0;
            font-weight: 400;
          }
          .copyright {
            font-size: 13px;
            margin-top: 24px;
            color: #9ca3af;
            padding-top: 20px;
            border-top: 1px solid rgba(30, 37, 177, 0.08);
          }
          .decorative-dots {
            position: absolute;
            top: 24px;
            right: 24px;
            opacity: 0.1;
            font-size: 56px;
            line-height: 1;
            filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.2));
          }
          @media only screen and (max-width: 600px) {
            body {
              padding: 20px 10px;
            }
            .email-header {
              padding: 40px 25px 50px;
            }
            .email-body {
              padding: 35px 25px;
            }
            .email-footer {
              padding: 30px 20px;
            }
            .email-header h1 {
              font-size: 26px;
            }
            .email-body h2 {
              font-size: 22px;
            }
            .icon {
              font-size: 55px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="email-header">
              <div class="decorative-dots">🎵🎶🎼</div>
              <div class="icon-wrapper">
                <span class="icon">${icon}</span>
              </div>
              <h1>ArtsApp</h1>
              <p class="subtitle">${headerText}</p>
            </div>
            
            <div class="email-body">
              <h2>${title}</h2>
              <div class="content">${description}</div>
              
              <div class="divider"></div>
              
              <div class="info-box">
                <p>💡 Це автоматичне повідомлення від ArtsApp. Будь ласка, не відповідайте на цей email.</p>
              </div>
            </div>
            
            <div class="email-footer">
              <div class="footer-logo">ArtsApp</div>
              <p>Ваша музична спільнота</p>
              <p class="copyright">
                © ${new Date().getFullYear()} ArtsApp. Всі права захищені.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
