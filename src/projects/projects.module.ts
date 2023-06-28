import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { HttpModule } from '@nestjs/axios';
import { Projects } from './entity/projects.entity';
import { ProjectController } from './projects.controller';
import { ProjectService } from './projects.service';
// import { MulterModule } from '@nestjs/platform-express';
// import { MulterConfig } from 'src/config/multer.config';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Projects]),
    HttpModule,
    // MulterModule.registerAsync({
    //   useClass: MulterConfig,
    // }),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectsModule {}
