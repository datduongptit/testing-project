import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { HttpModule } from '@nestjs/axios';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from './entity/file.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([File]), HttpModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
