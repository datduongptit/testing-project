import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ProjectsModule } from './projects/projects.module';
import { FileModule } from './file/file.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './utils/response.interceptor';
import { MailModule } from './mailer/mail.module';
import { HistoriesModule } from './histories/histories.module';
// import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AuthModule,
    ProductsModule,
    ProjectsModule,
    FileModule,
    MailModule,
    HistoriesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
