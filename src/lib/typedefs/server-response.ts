export interface ServerResponseModel<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
}
