import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AESModule } from '../aes/aes.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import jwtConfig from './config/jwt.config';
import appConfig from '../../configs/app.config';

@Module({
  imports: [
    AESModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
