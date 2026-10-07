export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  meta?: any;
  message?: string;
  errorCode?: string;
}
