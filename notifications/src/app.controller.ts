import { MailerService } from '@nestjs-modules/mailer';
import { Controller } from '@nestjs/common';
import { RMQRoute } from 'nestjs-rmq';

@Controller()
export class AppController {
  constructor(private readonly mailerService: MailerService) {}

  @RMQRoute('notify')
  async sendTestEmail(data: { title: string; description: string; email: string }) {
    try {
      console.log('Received notification:', data);
      const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="uk">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 25%, #c44569 50%, #a55eea 75%, #8854d0 100%);
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
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25), 0 10px 30px rgba(0, 0, 0, 0.15);
            position: relative;
          }
          .email-header {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 20%, #c44569 40%, #a55eea 60%, #8854d0 80%, #6c5ce7 100%);
            padding: 50px 30px 60px;
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
            margin: 0 auto 20px;
            text-align: center;
          }
          .icon {
            font-size: 70px;
            display: inline-block;
            filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
          }
          .email-header h1 {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 8px;
            letter-spacing: -1px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            position: relative;
            z-index: 1;
          }
          .email-header .subtitle {
            opacity: 0.95;
            font-size: 15px;
            font-weight: 500;
            letter-spacing: 0.5px;
            position: relative;
            z-index: 1;
          }
          .email-body {
            padding: 50px 40px;
            color: #333333;
            background: #ffffff;
            position: relative;
          }
          .email-body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #ff6b6b, #ee5a6f, #c44569, #a55eea, #8854d0, #6c5ce7);
          }
          .email-body h2 {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 20px;
            line-height: 1.3;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 30%, #a55eea 70%, #6c5ce7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .email-body .content {
            font-size: 17px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.8;
            font-weight: 400;
          }
          .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #ff6b6b 20%, #a55eea 50%, #ff6b6b 80%, transparent);
            margin: 35px 0;
            position: relative;
            border-radius: 2px;
          }
          .divider::before {
            content: '✨';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #fff5f5, #ffffff);
            padding: 0 18px;
            font-size: 20px;
            filter: drop-shadow(0 2px 4px rgba(255, 107, 107, 0.2));
          }
          .info-box {
            background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 50%, #ffe0e0 100%);
            border-left: 5px solid;
            border-image: linear-gradient(180deg, #ff6b6b, #a55eea) 1;
            padding: 22px;
            border-radius: 12px;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.1);
          }
          .info-box p {
            font-size: 14px;
            color: #5a5568;
            margin: 0;
            line-height: 1.7;
            font-weight: 500;
          }
          .email-footer {
            background: linear-gradient(180deg, #fef5f5 0%, #ffe8e8 50%, #f8f0f0 100%);
            padding: 35px 30px;
            text-align: center;
            border-top: 2px solid;
            border-image: linear-gradient(90deg, #ff6b6b, #a55eea) 1;
            position: relative;
          }
          .footer-logo {
            font-size: 22px;
            font-weight: 800;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 30%, #a55eea 70%, #6c5ce7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
          }
          .email-footer p {
            font-size: 14px;
            color: #6c757d;
            margin: 6px 0;
          }
          .social-icons {
            margin: 20px 0 15px;
            display: flex;
            justify-content: center;
            gap: 15px;
          }
          .social-icon {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #a55eea 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 20px;
            text-decoration: none;
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4), 0 2px 8px rgba(165, 94, 234, 0.3);
            transition: all 0.3s ease;
          }
          .social-icon:hover {
            transform: translateY(-3px) scale(1.1);
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.5), 0 4px 12px rgba(165, 94, 234, 0.4);
          }
          .copyright {
            font-size: 12px;
            margin-top: 20px;
            color: #adb5bd;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
          }
          .decorative-dots {
            position: absolute;
            top: 20px;
            right: 20px;
            opacity: 0.15;
            font-size: 65px;
            line-height: 1;
            filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.3));
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
                <span class="icon">🎵</span>
              </div>
              <h1>ArtsApp</h1>
              <p class="subtitle">Музична платформа нового покоління</p>
            </div>
            
            <div class="email-body">
              <h2>${data.title}</h2>
              <div class="content">${data.description}</div>
              
              <div class="divider"></div>
              
              <div class="info-box">
                <p>💡 Це автоматичне повідомлення від ArtsApp. Будь ласка, не відповідайте на цей email.</p>
              </div>
            </div>
            
            <div class="email-footer">
              <div class="footer-logo">ArtsApp</div>
              <p style="font-weight: 500; color: #495057;">Ваша музична спільнота</p>
              
              <div class="social-icons">
                <a href="#" class="social-icon">📱</a>
                <a href="#" class="social-icon">🌐</a>
                <a href="#" class="social-icon">📧</a>
              </div>
              
              <p class="copyright">
                © ${new Date().getFullYear()} ArtsApp. Всі права захищені.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

      const res = await this.mailerService.sendMail({
        to: data.email || 'iren171302@gmail.com',
        subject: data.title || 'Welcome to ArtsApp!',
        html: htmlTemplate,
      });

      console.log('Email sent successfully:', res);
      return res;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error; // Перекидаємо помилку, щоб RMQ міг обробити її
    }
  }
}
