import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AESService } from './aes.service';
import aesConfig from './aes.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [aesConfig],
    }),
  ],
  providers: [AESService],
  exports: [AESService],
})
export class AESModule {}
