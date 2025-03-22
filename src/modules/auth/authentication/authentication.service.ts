import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AESService } from '../../aes/aes.service';
import { TUser } from '../../user/type/user.type';
import { UsersService } from '../../user/user.service';
import { JwtConfig } from './config/jwt.config';
import { SecurityConfig } from './config/security.config';
import {
  AuthConstants,
  TAuthenticationTokenPayload,
  TResultAuthenticationGuard,
} from './authentication.type';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  private userService: UsersService;
  private aesService: AESService;

  constructor(
    private moduleRef: ModuleRef,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.aesService = this.moduleRef.get(AESService, { strict: false });
    this.userService = this.moduleRef.get(UsersService, { strict: false });
  }

  encodeToken(user: TUser): string {
    try {
      const jwtConfig = this.configService.get<JwtConfig>('jwt');
      const token = this.jwtService.sign(
        {
          id: user.id,
        } as TAuthenticationTokenPayload,
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
      const tokenPayload: TAuthenticationTokenPayload =
        await this.jwtService.verifyAsync<TAuthenticationTokenPayload>(token, {
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

  async checkTokenSecret(token: string): Promise<TResultAuthenticationGuard> {
    const result: TResultAuthenticationGuard = {
      canActivate: false,
      message: '',
    };
    try {
      const decoded = await this.aesService.decode(token);
      const data: TAuthenticationTokenPayload = JSON.parse(decoded);
      if (
        new Date().getTime() - data.timestamp >
        AuthConstants.TIMESTAMP_MAX_LIVE_TIME
      ) {
        result.message = 'Token expired time.';
        return result;
      }
      const config = this.configService.get<SecurityConfig>('security', {
        infer: true,
      });
      const secret = config.secret ?? '';
      if (data.secret != secret) {
        result.message = 'Token invalid. Private key not match.';
      }
      result.canActivate = true;
      result.message = 'Token is valid.';
    } catch (error) {
      result.message = `${error?.message || error.toString()}`;
    }
    return result;
  }

  async checkApiKeyUser(token: string): Promise<TResultAuthenticationGuard> {
    const result: TResultAuthenticationGuard = {
      canActivate: false,
      message: '',
    };
    try {
      const dataDecoded = await this.aesService.decode(token);
      const data: TAuthenticationTokenPayload = JSON.parse(dataDecoded);

      const now = new Date().getTime();
      if (now - (data?.timestamp ?? 0) > AuthConstants.SECURITY_MAX_TIME_LIVE) {
        this.logger.debug(
          `[canActivate] Api key user expired time, ${JSON.stringify({ dataEncode: token, dataDecode: dataDecoded, data })}.`,
        );
        result.message = 'Api key user expired time';
      }

      result.canActivate = true;
      result.message = 'Api key user is valid.';
    } catch (error) {
      result.message = `${error?.message || error.toString()}`;
    }
    return result;
  }

  async checkApiKeyAdmin(token: string): Promise<TResultAuthenticationGuard> {
    const result: TResultAuthenticationGuard = {
      canActivate: false,
      message: '',
    };
    try {
      const dataDecoded = await this.aesService.decode(token);
      const data: TAuthenticationTokenPayload = JSON.parse(dataDecoded);

      const now = new Date().getTime();
      if (now - (data?.timestamp ?? 0) > AuthConstants.SECURITY_MAX_TIME_LIVE) {
        this.logger.debug(
          `[canActivate] Api key admin expired time, ${JSON.stringify({ dataEncode: token, dataDecode: dataDecoded, data })}.`,
        );
        result.message = 'Api key admin expired time';
      }

      const config = this.configService.get<SecurityConfig>('security');
      const adminPassword = config.adminPassword ?? '';
      if (data.password != adminPassword) {
        this.logger.debug(
          `[canActivate] Password is not match, ${JSON.stringify({ token, dataDecoded, adminPassword })}.`,
        );
        result.message = 'Password is not match';
      }

      result.canActivate = true;
      result.message = 'Api key admin is valid.';
    } catch (error) {
      result.message = `${error?.message || error.toString()}`;
    }
    return result;
  }
}
