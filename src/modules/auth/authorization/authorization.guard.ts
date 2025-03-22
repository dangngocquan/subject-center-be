import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EAuthenticationDataKey } from '../authentication/authentication.type';
import { AuthorizationService } from './authorization.service';
import {
  EAuthorizationMetadataKey,
  EAuthorizationPermission,
  EAuthorizationType,
  EParamKey,
  TResultAuthorizationGuard,
} from './authorization.type';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(AuthorizationGuard.name);

  constructor(
    @Inject(AuthorizationService)
    private readonly authorizationService: AuthorizationService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let result: TResultAuthorizationGuard = {
      canActivate: false,
      message: '',
    };
    try {
      const type = this.reflector.get<EAuthorizationType>(
        `${EAuthorizationMetadataKey.AUTHORIZATION_TYPE}`,
        context.getHandler(),
      );
      const permissions = this.reflector.get<EAuthorizationPermission[]>(
        `${EAuthorizationMetadataKey.AUTHORIZATION_PERMISSIONS}`,
        context.getHandler(),
      );
      this.logger.debug(`[canActivate] Type: ${type}`);

      switch (type) {
        case EAuthorizationType.PLAN:
          result = await this.handlePlanPermissions(request, permissions);
          break;

        default:
          this.logger.warn(`[canActivate] Unknown authorization type: ${type}`);
          throw new UnauthorizedException('Invalid authorization type');
      }
    } catch (error) {
      this.logger.error(
        `[canActivate] Error during type/params handling: ${error.message}`,
      );
    }

    if (!result.canActivate) {
      throw new UnauthorizedException(result.message);
    }

    return true;
  }

  private async handlePlanPermissions(
    request: any,
    permissions: EAuthorizationPermission[],
  ): Promise<any> {
    const result: TResultAuthorizationGuard = {
      canActivate: false,
      message: '',
    };
    try {
      const planId = request.params
        ? request.params[`${EParamKey.PLAN_ID}`]
        : null;
      if (!planId) {
        result.message = 'Plan ID is required';
        return result;
      }
      const user = request[`${EAuthenticationDataKey.USER}`];
      if (!user) {
        result.message = 'Authentication is required';
        return result;
      }
      if (permissions.length == 0) {
        result.canActivate = true;
        return result;
      }
      return await this.authorizationService.isOwnerPlan(user, planId);
    } catch (error) {
      this.logger.error(
        `[handlePlanPermissions] Error during plan permission handling: ${error.message}`,
      );
      result.message = `${error?.message || error.toString()}`;
      return result;
    }
  }
}
