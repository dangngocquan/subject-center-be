import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AESService } from '../aes/aes.service';
import { AuthConstants, AuthHeaderKeys } from './auth.constant';
import { DataAuthSecret } from './auth.type';
import { AppConfig } from 'src/configs/app.config';

@Injectable()
export class AuthSecretGuard implements CanActivate {
  private readonly logger = new Logger(AuthSecretGuard.name);
  @Inject(ConfigService)
  private readonly configService: ConfigService;
  @Inject(AESService)
  private readonly aesService: AESService;

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers[`${AuthHeaderKeys.TOKEN_SECRET}`] as string;
    if (!token) {
      this.logger.debug(`[canActivate] Token is missing.`);
      throw new UnauthorizedException(`Token is missing.`);
    }

    try {
      const decoded = await this.aesService.decode(token);
      const data: DataAuthSecret = JSON.parse(decoded);

      // Check time
      if (
        new Date().getTime() - data.timestamp >
        AuthConstants.TIMESTAMP_MAX_LIVE_TIME
      ) {
        throw new UnauthorizedException('Token expired time.');
      }

      // Check private key
      const appConfig = this.configService.get<AppConfig>('app', {
        infer: true,
      });
      if (data.secret != appConfig.secret) {
        throw new UnauthorizedException(
          'Token invalid. Private key not match.',
        );
      }
    } catch (error) {
      throw new UnauthorizedException(`${error?.message || error.toString()}`);
    }

    return true;
  }
}
