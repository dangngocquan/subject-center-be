import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import googleConfig from './google.config';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [googleConfig],
    }),
  ],
  controllers: [GoogleController],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
