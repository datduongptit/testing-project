import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HttpModule } from '@nestjs/axios';
import { MailService } from './mail.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
