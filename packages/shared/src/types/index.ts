/**
 * @workspace/shared — Type exports
 *
 * Re-exports all domain types from the generated API schema.
 * Import types from here instead of directly from @workspace/api-zod
 * so that if the generated layer changes, only this file needs updating.
 */
export type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "@workspace/api-zod";

export type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@workspace/api-zod";

export type {
  StoreSettings,
  UpdateStoreSettingsRequest,
} from "@workspace/api-zod";

export type { AdminInfo, AdminLoginBody, AdminLoginResponse } from "@workspace/api-zod";

/**
 * Pagination meta returned by list endpoints.
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Generic API error shape returned by the backend.
 */
export interface ApiError {
  error: string;
  statusCode?: number;
}

/**
 * Role types — extend as needed.
 */
export type AdminRole = "admin" | "superadmin";
