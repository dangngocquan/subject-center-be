export enum EAuthorizationType {
  PLAN = 'PLAN',
}

export enum EAuthorizationPermission {
  READ = 'READ',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  OWNER = 'OWNER',
}

export type TResultAuthorizationGuard = {
  canActivate: boolean;
  message: string;
};

export enum EAuthorizationMetadataKey {
  AUTHORIZATION_TYPE = 'authorization:type',
  AUTHORIZATION_PERMISSIONS = 'authorization:permissions',
}

export enum EParamKey {
  PLAN_ID = 'planId',
  USER_ID = 'userId',
  MAJOR_ID = 'majorId',
  PLAN_ITEM_ID = 'planItemId',
}
