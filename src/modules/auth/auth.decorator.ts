import { applyDecorators } from '@nestjs/common';
import {
  EAuthenticationType,
  TAuthenticationParams,
} from './authentication/authentication.type';
import {
  EAuthorizationPermission,
  EAuthorizationType,
} from './authorization/authorization.type';
import { CheckAuthorization } from './authorization/authorization.decorator';
import { CheckAuthentication } from './authentication/authentication.decorator';

export const CheckAuthenticationAndAuthorization = (
  authenticationType: EAuthenticationType,
  authorizationType: EAuthorizationType,
  authorizationPermissions: EAuthorizationPermission[],
  params?: TAuthenticationParams,
): MethodDecorator => {
  return applyDecorators(
    CheckAuthentication(authenticationType, params),
    CheckAuthorization(authorizationType, authorizationPermissions),
  );
};
