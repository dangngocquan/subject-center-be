import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TAuthenticationParams } from '../authentication/authentication.type';
import { AuthorizationGuard } from './authorization.guard';
import {
  EAuthorizationMetadataKey,
  EAuthorizationPermission,
  EAuthorizationType,
} from './authorization.type';

export const CheckAuthorization = (
  type: EAuthorizationType,
  permissions: EAuthorizationPermission[],
  params?: TAuthenticationParams,
): MethodDecorator => {
  return applyDecorators(
    SetMetadata(`${EAuthorizationMetadataKey.AUTHORIZATION_TYPE}`, type),
    SetMetadata(
      `${EAuthorizationMetadataKey.AUTHORIZATION_PERMISSIONS}`,
      permissions,
    ),
    UseGuards(AuthorizationGuard),
    ApiOperation({
      summary: `${params?.summary ?? ''}`,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
};
