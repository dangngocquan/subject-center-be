import { forwardRef, Module } from '@nestjs/common';
import { AESModule } from '../aes/aes.module';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [forwardRef(() => UserModule), AESModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
