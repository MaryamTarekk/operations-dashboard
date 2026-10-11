export type OperationStatus = "Pending" | "Running" | "Completed" | "Failed";

export type OperationPriority = "Low" | "Medium" | "High" | "Urgent";

export type OperationSortField = "createdAt" | "updatedAt" | "priority" | "title";

export type SortDirection = "asc" | "desc";

export interface Operation {
  id: string;
  title: string;
  name: string; // alias for backwards compatibility
  owner: string;
  status: OperationStatus;
  priority: OperationPriority;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperationsParams {
  search?: string;
  status?: OperationStatus | "All";
  priority?: OperationPriority | "All";
  sortBy?: OperationSortField;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
}

export interface OperationsResponse {
  data: Operation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OperationStats {
  total: number;
  completed: number;
  running: number;
  pending: number;
  failed: number;
}

export interface OperationActivityPoint {
  date: string;
  label: string;
  count: number;
}

export interface UpdateOperationPayload {
  id: string;
  title?: string;
  name?: string;
  owner?: string;
  status?: OperationStatus;
  priority?: OperationPriority;
  description?: string;
}
