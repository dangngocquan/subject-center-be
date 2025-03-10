import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import googleConfig from './google.config';
import { GoogleService } from './google.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [googleConfig],
    }),
  ],
  controllers: [],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
