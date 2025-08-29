export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: { [key: string]: string[] };
  timestamp: Date;
}