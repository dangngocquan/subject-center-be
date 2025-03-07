export const AuthConstants = {
  TOKEN_EXPIRES_IN: '365 days',
  TIMESTAMP_MAX_LIVE_TIME: 5 * 60 * 1000,
  TELEGRAM_AUTH_MAX_LIVE_TIME: 5 * 60 * 1000,
  SECURITY_MAX_TIME_LIVE: 30 * 1000,
};

export const AuthHeaderKeys = {
  API_KEY_ADMIN: 'api-key-admin',
  API_KEY_USER: 'api-key-user',
  TOKEN: 'token',
  TOKEN_SECRET: 'token-secret',
};
