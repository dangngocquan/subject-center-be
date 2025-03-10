import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TResponse } from '../../common/type';
import { AccountEntity } from './entity/account.entity';
import { UserEntity } from './entity/user.entity';
import { EPlatformProvider, EUserRole, TUser } from './type/user.type';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async findAccountByKeyAndProvider(
    key: string,
    provider: EPlatformProvider,
  ): Promise<AccountEntity> {
    try {
      return await this.accountRepository.findOne({
        where: { key, provider },
      });
    } catch (error) {
      this.logger.error(
        `[findAccountByKeyAndProvider] ${JSON.stringify({ key, provider })}, error: ${
          error.message || error.toString()
        }`,
      );
      return null;
    }
  }

  async findById(id: number): Promise<UserEntity> {
    try {
      return await this.usersRepository.findOne({
        relations: {
          accounts: true,
        },
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `[findById]: Failed to find user by id ${id}, error: ${
          error.message || error.toString()
        }`,
      );
      return null;
    }
  }

  async upsertUser(data: TUser): Promise<TResponse<TUser>> {
    const result: TResponse<TUser> = {
      isBadRequest: false,
      message: '',
      data: null,
    };
    try {
      let entity = null;
      if (data.id) {
        entity = await this.findById(data.id);
      } else if (data.accounts.length > 0) {
        for (const account of data.accounts) {
          const foundAccount = await this.findAccountByKeyAndProvider(
            account.key,
            account.provider,
          );
          if (foundAccount) {
            entity = await this.findById(foundAccount.userId);
            break;
          }
        }
      }
      if (entity) {
        entity.name = data.name ?? entity.name;
        await this.usersRepository.save(entity);
        result.data = {
          id: entity.id,
          role: entity.role,
          name: entity.name,
          accounts: entity.accounts,
        };
        return result;
      }
      entity = await this.usersRepository.create({
        role: EUserRole.USER,
        name: data.name,
      });
      entity = await this.usersRepository.save(entity);
      result.data = {
        id: entity.id,
        role: entity.role,
        name: entity.name,
        accounts: [],
      };
      for (const account of data.accounts) {
        const existed = await this.findAccountByKeyAndProvider(
          account.key,
          account.provider,
        );
        if (existed) {
          continue;
        }
        const newAccount = await this.accountRepository.create({
          userId: entity.id,
          key: account.key,
          provider: account.provider,
        });
        await this.accountRepository.save(newAccount);
        result.data.accounts.push(newAccount);
      }
    } catch (error) {
      this.logger.error(
        `[upsertUser]: Failed to upsert user, error: ${
          error.message || error.toString()
        }`,
      );
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
    }
    return result;
  }
}
