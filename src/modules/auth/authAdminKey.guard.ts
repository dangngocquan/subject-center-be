import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AESService } from '../aes/aes.service';
import { AuthConstants, AuthHeaderKeys } from './auth.constant';
import { DataAuthAdminKey } from './auth.type';
import { AppConfig } from '../../configs/app.config';

@Injectable()
export class AuthAdminKeyGuard implements CanActivate {
  private readonly logger = new Logger(AuthAdminKeyGuard.name);
  @Inject(ConfigService) private readonly configService: ConfigService;
  @Inject(AESService) private readonly aesService: AESService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let dataEncoded: string = '';
    let dataDecoded: string = '';

    try {
      await this.showHash();
      dataEncoded = request.headers[
        `${AuthHeaderKeys.API_KEY_ADMIN}`
      ] as string;
      if (!dataEncoded) {
        this.logger.debug(`[canActivate] Not found password.`);
        throw new UnauthorizedException('Password is required');
      }

      dataDecoded = await this.aesService.decode(dataEncoded);
      const data: DataAuthAdminKey = JSON.parse(dataDecoded);

      const now = new Date().getTime();
      if (now - (data?.timestamp ?? 0) > AuthConstants.SECURITY_MAX_TIME_LIVE) {
        this.logger.debug(
          `[canActivate] Api key admin expired time, ${JSON.stringify({ dataEncode: dataEncoded, dataDecode: dataDecoded, data })}.`,
        );
        throw new UnauthorizedException('Api key admin expired time');
      }

      const appConfig = this.configService.get<AppConfig>('app');
      const adminPassword = appConfig.adminPassword;
      if (data.password != adminPassword) {
        this.logger.debug(
          `[canActivate] Password is not match, ${JSON.stringify({ dataEncoded, dataDecoded, adminPassword })}.`,
        );
        throw new UnauthorizedException('Password is not match');
      }
      return true;
    } catch (error) {
      this.logger.error(
        `[canActivate] ${JSON.stringify({ dataEncoded, dataDecoded })}, error: ${error?.message || error.toString()}`,
      );
      throw new UnauthorizedException(`${error?.message || error.toString()}`);
    }
  }

  async showHash() {
    try {
      const appConfig = this.configService.get<AppConfig>('app');
      const adminPassword = appConfig.adminPassword;
      const decoded = await this.aesService.encode(
        JSON.stringify({
          password: adminPassword,
          timestamp: new Date().getTime() + 100000000000,
        }),
      );
      this.logger.debug(
        `[showHash] ${JSON.stringify({ decoded, adminPassword })}`,
      );
    } catch (error) {
      this.logger.error(
        `[showHash] error: ${error?.message || error.toString()}`,
      );
    }
  }
}
