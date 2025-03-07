import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '../../configs/jwt.config';
import { UserDocument } from '../users/user.model';
import { UserService } from '../users/user.service';
import { AuthConstants } from './auth.constant';
import { AuthTokenPayload } from './auth.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  @Inject(ConfigService) private readonly configService: ConfigService;
  @Inject(JwtService) private readonly jwtService: JwtService;
  @Inject(forwardRef(() => UserService))
  private readonly userService: UserService;

  encodeToken(user: UserDocument): string {
    try {
      const jwtConfig = this.configService.get<JwtConfig>('jwt');
      const token = this.jwtService.sign(
        {
          telegram_id: user.telegramId,
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

  async decodeToken(token: string): Promise<UserDocument> {
    try {
      const jwtConfig = this.configService.get<JwtConfig>('jwt');
      const tokenPayload: AuthTokenPayload =
        await this.jwtService.verifyAsync<AuthTokenPayload>(token, {
          secret: jwtConfig.secret,
        });
      const user = await this.userService.findUserByTelegramId(
        tokenPayload.telegram_id,
      );
      if (!user) {
        this.logger.error(
          `[decodeToken]: User not found, ${JSON.stringify({ token, tokenPayload })}`,
        );
        throw new BadRequestException('Token invalid. User not found.');
      }
      return user;
    } catch (error) {
      this.logger.error(
        `[decodeToken]: token ${token}, error: ${error?.message || error.toString()}`,
      );
      throw new BadRequestException(`Decode token ${token} failed.`);
    }
  }
}
