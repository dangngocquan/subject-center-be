import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthenticationGuard } from './authentication.guard';
import {
  EAuthenticationDataKey,
  EAuthenticationHeaderKey,
  EAuthenticationMetadataKey,
  EAuthenticationType,
  TAuthenticationParams,
} from './authentication.type';

export const CheckAuthentication = (
  type: EAuthenticationType,
  params?: TAuthenticationParams,
): MethodDecorator => {
  return applyDecorators(
    SetMetadata(`${EAuthenticationMetadataKey.AUTHENTICATION_TYPE}`, type),
    UseGuards(AuthenticationGuard),
    ApiOperation({
      summary: `${params?.summary ?? ''}`,
    }),
    ApiHeader({
      name: EAuthenticationHeaderKey[`${type}`],
      description: EAuthenticationHeaderKey[`${type}`],
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
};

export const AuthenticationUser = () => {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return request[`${EAuthenticationDataKey.USER}`];
  })();
};
