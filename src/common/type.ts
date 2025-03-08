export type TResponse<TData> = {
  isBadRequest: boolean;
  message: string;
  data?: TData;
};
