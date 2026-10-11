import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getOperationActivity,
  getOperationById,
  getOperationStats,
  getOperations,
  updateOperation,
  updateOperationStatus,
} from "../api/operationsApi";

import type {
  Operation,
  OperationStatus,
  OperationsParams,
  OperationsResponse,
  UpdateOperationPayload,
} from "../types/operation.types";

export const operationKeys = {
  all: ["operations"] as const,
  lists: () => [...operationKeys.all, "list"] as const,
  list: (params: OperationsParams) =>
    [...operationKeys.lists(), params] as const,
  details: () => [...operationKeys.all, "detail"] as const,
  detail: (id: string) => [...operationKeys.details(), id] as const,
  stats: () => [...operationKeys.all, "stats"] as const,
  activity: () => [...operationKeys.all, "activity"] as const,
};

export function useOperations(params: OperationsParams) {
  return useQuery({
    queryKey: operationKeys.list(params),
    queryFn: ({ signal }) => getOperations(params, signal),
    // Periodic background refresh every 30s without clearing active page or filters
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}

export function useOperation(id: string) {
  return useQuery({
    queryKey: operationKeys.detail(id),
    queryFn: ({ signal }) => getOperationById(id, signal),
    enabled: Boolean(id),
  });
}

export function useOperationStats() {
  return useQuery({
    queryKey: operationKeys.stats(),
    queryFn: ({ signal }) => getOperationStats(signal),
    refetchInterval: 30_000,
  });
}

export function useOperationActivity() {
  return useQuery({
    queryKey: operationKeys.activity(),
    queryFn: ({ signal }) => getOperationActivity(signal),
    staleTime: 60_000,
  });
}

/**
 * Optimistic mutation for inline status changes from the list or details
 * Updates the UI immediately, and rolls back if the network request fails!
 */
export function useUpdateOperationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OperationStatus }) =>
      updateOperationStatus(id, status),

    onMutate: async ({ id, status }) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: operationKeys.lists() });
      await queryClient.cancelQueries({ queryKey: operationKeys.detail(id) });

      // Snapshot previous states
      const previousLists = queryClient.getQueriesData<OperationsResponse>({
        queryKey: operationKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData<Operation>(
        operationKeys.detail(id)
      );

      // Optimistically update list queries
      queryClient.setQueriesData<OperationsResponse>(
        { queryKey: operationKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((item) =>
              item.id === id
                ? { ...item, status, updatedAt: new Date().toISOString() }
                : item
            ),
          };
        }
      );

      // Optimistically update detail query
      if (previousDetail) {
        queryClient.setQueryData<Operation>(operationKeys.detail(id), {
          ...previousDetail,
          status,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousLists, previousDetail };
    },

    onError: (_err, variables, context) => {
      // Rollback to snapshot on failure
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(
          operationKeys.detail(variables.id),
          context.previousDetail
        );
      }
    },

    onSettled: (_data, _error, variables) => {
      void queryClient.invalidateQueries({ queryKey: operationKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: operationKeys.detail(variables.id),
      });
      void queryClient.invalidateQueries({ queryKey: operationKeys.stats() });
    },
  });
}

/**
 * Full update mutation for editing title, owner, priority, status, description
 */
export function useUpdateOperation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOperationPayload) => updateOperation(payload),

    onSuccess: (updated) => {
      queryClient.setQueryData(operationKeys.detail(updated.id), updated);
      void queryClient.invalidateQueries({ queryKey: operationKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: operationKeys.stats() });
    },
  });
}
