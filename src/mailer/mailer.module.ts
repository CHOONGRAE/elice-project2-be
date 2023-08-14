import { Global, Module } from '@nestjs/common';
import { MailerModule as MailModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  imports: [
    MailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILER_HOST'),
          port: 587,
          auth: {
            user: configService.get('MAILER_EMAIL'),
            pass: configService.get('MAILER_PASSWORD'),
          },
        },
        defaults: {
          from: `No Reply <${configService.get('MAILER_EMAIL')}>`,
        },
        preview: true,
        template: {
          dir: __dirname + '/templates',
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
