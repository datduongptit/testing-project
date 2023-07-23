import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { HttpModule } from '@nestjs/axios';
import { Histories } from './entity/histories.entity';
import { HistoriesController } from './histories.controller';
import { HistoriesService } from './histories.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Histories]), HttpModule],
  controllers: [HistoriesController],
  providers: [HistoriesService],
  exports: [HistoriesService],
})
export class HistoriesModule {}
