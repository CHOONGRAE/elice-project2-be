import { Global, Module } from '@nestjs/common';
import { MailerModule as MailModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: configService.get('MAILER_SERVICE'),
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
          dir: join(__dirname, 'templates'),
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
