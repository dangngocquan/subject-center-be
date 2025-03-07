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

@Injectable()
export class AuthUserKeyGuard implements CanActivate {
  private readonly logger = new Logger(AuthUserKeyGuard.name);
  @Inject(ConfigService) private readonly configService: ConfigService;
  @Inject(AESService) private readonly aesService: AESService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let dataEncoded: string = '';
    let dataDecoded: string = '';

    try {
      dataEncoded = request.headers[`${AuthHeaderKeys.API_KEY_USER}`] as string;
      if (!dataEncoded) {
        this.logger.debug(`[canActivate] Not found api key user.`);
        throw new UnauthorizedException('Api key user is required');
      }

      dataDecoded = await this.aesService.decode(dataEncoded);
      const data = JSON.parse(dataDecoded);

      const now = new Date().getTime();
      if (now - (data?.timestamp ?? 0) > AuthConstants.SECURITY_MAX_TIME_LIVE) {
        this.logger.debug(
          `[canActivate] Api key user expired time, ${JSON.stringify({ dataEncode: dataEncoded, dataDecode: dataDecoded, data })}.`,
        );
        throw new UnauthorizedException('Api key user expired time');
      }
      return true;
    } catch (error) {
      this.logger.error(
        `[canActivate] ${JSON.stringify({ dataEncode: dataEncoded, dataDecode: dataDecoded })}, error: ${error?.message || error.toString()}`,
      );
      throw new UnauthorizedException(`${error?.message || error.toString()}`);
    }
  }
}
