export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginatedMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
