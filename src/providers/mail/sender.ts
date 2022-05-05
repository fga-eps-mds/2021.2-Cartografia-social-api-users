import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/configuration';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailSender {
  private transporter;

  constructor(@Inject('CONFIG') config: ConfigService) {
    const mailConfig = config.get('mail');
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: mailConfig.user,
        pass: mailConfig.password,
      },
    });
  }

  async sendMail(recipientMail: string) {
    const mailOptions = {
      to: recipientMail,
      subject: 'Cadastro no aplicativo Cartografia',
      html: `<divs tyle="font-size: 16px;">
        <p>Olá! Seu cadastro no aplicativo da Nova Cartografia Social foi aprovado!</p><br/>
        <p>Agora é só ir até o aplicativo e fazer login com as credenciais escolhidas durante o cadastro.</p>
        </div>`,
    };

    this.transporter.sendMail(mailOptions, (erro) => {
      if (erro) {
        console.log(erro.toString());
      } else {
        console.log(`Welcome email sent to ${recipientMail}`);
      }
    });
  }
}
