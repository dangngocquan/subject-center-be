import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import {
  EAuthenticationDataKey,
  EAuthenticationHeaderKey,
  EAuthenticationMetadataKey,
  EAuthenticationType,
  TResultAuthenticationGuard,
} from './authentication.type';
import { AuthenticationService } from './authentication.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticationGuard.name);

  constructor(
    @Inject(AuthenticationService)
    private readonly authService: AuthenticationService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    let result: TResultAuthenticationGuard = {
      canActivate: false,
      message: '',
      user: null,
    };
    try {
      const type = this.reflector.get<EAuthenticationType>(
        `${EAuthenticationMetadataKey.AUTHENTICATION_TYPE}`,
        context.getHandler(),
      );
      this.logger.debug(`[canActivate] Type: ${type}`);

      switch (type) {
        case EAuthenticationType.TOKEN:
          result = await this.handleTokenAuthentication(request);
          break;
        case EAuthenticationType.TOKEN_SECRET:
          result = await this.handleSecretAuthentication(request);
          break;
        case EAuthenticationType.API_KEY_ADMIN:
          result = await this.handleAdminAuthentication(request);
          break;

        case EAuthenticationType.API_KEY_USER:
          result = await this.handleUserAuthentication(request);
          break;

        default:
          this.logger.warn(
            `[canActivate] Unknown authentication type: ${type}`,
          );
          throw new UnauthorizedException('Invalid authentication type');
      }

      if (result.user) {
        request[`${EAuthenticationDataKey.USER}`] = result.user;
      }
    } catch (error) {
      this.logger.error(
        `[canActivate] Error during type/params handling: ${error.message}`,
      );
    }

    if (!result.canActivate) {
      throw new UnauthorizedException(result.message);
    }

    response['user'] = result.user;

    return true;
  }

  private async handleTokenAuthentication(
    request: any,
  ): Promise<TResultAuthenticationGuard> {
    try {
      this.logger.debug(
        `[handleTokenAuthentication] Token authentication logic`,
      );
      const token = request.headers[
        `${EAuthenticationHeaderKey.TOKEN}`
      ] as string;
      if (!token) {
        return { canActivate: false, message: 'Token is required' };
      }

      const user = await this.authService.decodeToken(token);
      return {
        canActivate: true,
        message: 'Token authentication successful',
        user,
      };
    } catch (error) {
      this.logger.error(`[handleTokenAuthentication] Error: ${error.message}`);
      return { canActivate: false, message: `${error.message}` };
    }
  }

  private async handleSecretAuthentication(
    request: any,
  ): Promise<TResultAuthenticationGuard> {
    try {
      this.logger.debug(
        `[handleSecretAuthentication] Secret authentication logic`,
      );
      const token = request.headers[
        `${EAuthenticationHeaderKey.TOKEN_SECRET}`
      ] as string;
      if (!token) {
        return { canActivate: false, message: 'Secret token is required' };
      }

      const resultCheckSecurity =
        await this.authService.checkTokenSecret(token);
      if (!resultCheckSecurity.canActivate) {
        return resultCheckSecurity;
      }
      return { canActivate: true, message: 'Secret authentication successful' };
    } catch (error) {
      this.logger.error(`[handleSecretAuthentication] Error: ${error.message}`);
      return { canActivate: false, message: error.message };
    }
  }

  private async handleAdminAuthentication(
    request: any,
  ): Promise<TResultAuthenticationGuard> {
    try {
      this.logger.debug(
        `[handleAdminAuthentication] Admin authentication logic`,
      );
      const dataEncoded = request.headers[
        `${EAuthenticationHeaderKey.API_KEY_ADMIN}`
      ] as string;
      if (!dataEncoded) {
        return { canActivate: false, message: 'Admin API key is required' };
      }

      const resultCheckSecurity =
        await this.authService.checkApiKeyAdmin(dataEncoded);
      if (!resultCheckSecurity.canActivate) {
        return resultCheckSecurity;
      }
      return { canActivate: true, message: 'Admin authentication successful' };
    } catch (error) {
      this.logger.error(`[handleAdminAuthentication] Error: ${error.message}`);
      return { canActivate: false, message: error.message };
    }
  }

  private async handleUserAuthentication(
    request: any,
  ): Promise<TResultAuthenticationGuard> {
    try {
      this.logger.debug(`[handleUserAuthentication] User authentication logic`);
      const dataEncoded = request.headers[
        `${EAuthenticationHeaderKey.API_KEY_USER}`
      ] as string;
      if (!dataEncoded) {
        return { canActivate: false, message: 'User API key is required' };
      }

      const resultCheckSecurity =
        await this.authService.checkApiKeyUser(dataEncoded);
      if (!resultCheckSecurity.canActivate) {
        return resultCheckSecurity;
      }
      return { canActivate: true, message: 'User authentication successful' };
    } catch (error) {
      this.logger.error(`[handleUserAuthentication] Error: ${error.message}`);
      return { canActivate: false, message: error.message };
    }
  }
}
