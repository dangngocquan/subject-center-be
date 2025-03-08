import { Module } from '@nestjs/common';
import { GoogleModule } from '../google/google.module';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { AccountEntity } from './entity/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AccountEntity]),
    GoogleModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
