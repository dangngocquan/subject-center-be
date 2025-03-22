import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleModule } from '../google/google.module';
import { AccountEntity } from './entity/account.entity';
import { UserEntity } from './entity/user.entity';
import { UserController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AccountEntity]),
    GoogleModule,
  ],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
