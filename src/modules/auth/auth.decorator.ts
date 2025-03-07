import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthHeaderKeys } from './auth.constant';
import {
  AuthAdminKeyParams,
  AuthSecretParams,
  AuthTokenParams,
  AuthUserKeyParams,
} from './auth.type';
import { AuthAdminKeyGuard } from './authAdminKey.guard';
import { AuthSecretGuard } from './authSecret.guard';
import { AuthTokenGuard } from './authToken.guard';
import { AuthUserKeyGuard } from './authUserKey.guard';

export const ApiAuthToken = (params?: AuthTokenParams): MethodDecorator => {
  return applyDecorators(
    UseGuards(AuthTokenGuard),
    ApiOperation({
      summary: `${params?.summary ?? ''}`,
    }),
    ApiHeader({ name: AuthHeaderKeys.TOKEN, description: 'token' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
};

export const AuthTokenUser = () => {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return request['user'];
  })();
};

export const ApiAuthSecret = (params?: AuthSecretParams): MethodDecorator => {
  return applyDecorators(
    UseGuards(AuthSecretGuard),
    ApiOperation({
      summary: `[API for External Application] ${params?.summary ?? ''}`,
    }),
    ApiHeader({
      name: AuthHeaderKeys.TOKEN_SECRET,
      description: 'Token secret',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
};

export const ApiAuthSecurityAdmin = (
  params?: AuthAdminKeyParams,
): MethodDecorator => {
  return applyDecorators(
    UseGuards(AuthAdminKeyGuard),
    ApiOperation({
      summary: `[API for Admin] ${params?.summary ?? ''}`,
    }),
    ApiHeader({
      name: AuthHeaderKeys.API_KEY_ADMIN,
      description: 'Security Admin Key',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
};

export const ApiAuthSecurityUser = (
  params?: AuthUserKeyParams,
): MethodDecorator => {
  return applyDecorators(
    UseGuards(AuthUserKeyGuard),
    ApiOperation({
      summary: `${params?.summary ?? ''}`,
    }),
    ApiHeader({
      name: AuthHeaderKeys.API_KEY_USER,
      description: 'Security User Key',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
};
