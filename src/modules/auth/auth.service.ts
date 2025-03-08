import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthConstants } from './auth.constant';
import { AuthTokenPayload } from './auth.type';
import { JwtConfig } from './config/jwt.config';
import { TUser } from '../user/type/user.type';
import { UsersService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  @Inject(ConfigService) private readonly configService: ConfigService;
  @Inject(JwtService) private readonly jwtService: JwtService;
  private readonly userService: UsersService;

  encodeToken(user: TUser): string {
    try {
      const jwtConfig = this.configService.get<JwtConfig>('jwt');
      const token = this.jwtService.sign(
        {
          id: user.id,
        } as AuthTokenPayload,
        {
          secret: jwtConfig.secret,
          expiresIn: AuthConstants.TOKEN_EXPIRES_IN,
        },
      );
      return token || '';
    } catch (error) {
      this.logger.error(
        `[encodeToken]: ${JSON.stringify({ user })}, error: ${error?.message || error.toString()}`,
      );
      throw new BadRequestException(`Encode token for user ${user.id} failed.`);
    }
  }

  async decodeToken(token: string): Promise<TUser> {
    try {
      const jwtConfig = this.configService.get<JwtConfig>('jwt');
      const tokenPayload: AuthTokenPayload =
        await this.jwtService.verifyAsync<AuthTokenPayload>(token, {
          secret: jwtConfig.secret,
        });
      const userResult = await this.userService.upsertUser({
        id: tokenPayload.id,
      });
      if (userResult.isBadRequest) {
        this.logger.error(
          `[decodeToken]: User not found, ${JSON.stringify({ token, tokenPayload, userResult })}`,
        );
        throw new BadRequestException('Token invalid. User not found.');
      }
      return userResult.data;
    } catch (error) {
      this.logger.error(
        `[decodeToken]: token ${token}, error: ${error?.message || error.toString()}`,
      );
      throw new BadRequestException(`Decode token ${token} failed.`);
    }
  }
}
