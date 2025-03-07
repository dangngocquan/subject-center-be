export type AuthTokenPayload = {
  telegram_id: number;
};

export type DataAuthSecret = {
  secret: string;
  timestamp: number;
};

export type DataAuthUserKey = {
  timestamp: number;
};

export type DataAuthAdminKey = {
  timestamp: number;
  password: string;
};

export type AuthAdminKeyParams = {
  summary: string;
};

export type AuthTokenParams = {
  summary: string;
};

export type AuthSecretParams = {
  summary: string;
};

export type AuthUserKeyParams = {
  summary: string;
};
