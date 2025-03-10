import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresqlModule } from './modules/postgresql/postgres.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GoogleModule } from './modules/google/google.module';
import { AESModule } from './modules/aes/aes.module';
import { UserModule } from './modules/user/user.module';
import { MajorModule } from './modules/major/major.module';
import { ExportModule } from './modules/export/export.module';
import { ImportModule } from './modules/import/import.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/docs',
    }),
    AESModule,
    PostgresqlModule,
    GoogleModule,
    UserModule,
    MajorModule,
    ExportModule,
    ImportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
