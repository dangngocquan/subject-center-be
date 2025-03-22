import { TUser } from '../../user/type/user.type';

export const AuthConstants = {
  TOKEN_EXPIRES_IN: '365 days',
  TIMESTAMP_MAX_LIVE_TIME: 5 * 60 * 1000,
  TELEGRAM_AUTH_MAX_LIVE_TIME: 5 * 60 * 1000,
  SECURITY_MAX_TIME_LIVE: 30 * 1000,
};

export enum EAuthenticationType {
  TOKEN = 'TOKEN',
  TOKEN_SECRET = 'TOKEN_SECRET',
  API_KEY_USER = 'API_KEY_USER',
  API_KEY_ADMIN = 'API_KEY_ADMIN',
}

export enum EAuthenticationHeaderKey {
  API_KEY_ADMIN = 'api-key-admin',
  API_KEY_USER = 'api-key-user',
  TOKEN = 'token',
  TOKEN_SECRET = 'token-secret',
}

export enum EAuthenticationMetadataKey {
  AUTHENTICATION_TYPE = 'authentication:type',
}

export enum EAuthenticationDataKey {
  USER = 'user',
}

export type TAuthenticationParams = {
  summary?: string;
};

export type TResultAuthenticationGuard = {
  canActivate: boolean;
  message: string;
  user?: TUser;
};

export type TAuthenticationTokenPayload = {
  id?: number;
  secret?: string;
  timestamp?: number;
  password?: string;
};
