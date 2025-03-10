import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    // Configuração do ConfigModule para carregar as variáveis de ambiente
    ConfigModule.forRoot({
      //configuração para setar qual arquivo .env será carregado de acordo com o ambiente
      envFilePath: process.env.NODE_ENV ? 
        `.env.${process.env.NODE_ENV}` : '.env'
    }),
    // Configuração do ThrottlerModule para limitar as requisições e assim evitar ataques de força bruta
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),
    forwardRef(() => UserModule),
    PrismaModule,
    forwardRef(() => AuthModule),
    FileModule,
    MailerModule.forRoot({
      // configuração do MailerModule para enviar e-mails usando um servidor de envio de e-mails para testes o Ethereal
      //https://ethereal.email/create site para criar um servidor de e-mails para testes
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'donnie.pfannerstill72@ethereal.email',
          pass: 'hmBQXUvPKQNhK7aA7h'
        }
      },
      defaults: {
        from: '"Alex Rangel" <lindsey.mitchell67@ethereal.email>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
