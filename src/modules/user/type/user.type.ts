export enum EUserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum EPlatformProvider {
  GOOGLE = 'GOOGLE',
}

export type TUser = {
  id?: number;
  role?: EUserRole;
  name?: string;
  accounts?: {
    id?: number;
    key?: string;
    provider?: EPlatformProvider;
  }[];
};
