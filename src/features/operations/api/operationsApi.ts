import { mockOperations } from "./mockOperations";
import type {
  Operation,
  OperationActivityPoint,
  OperationStats,
  OperationStatus,
  OperationPriority,
  OperationsParams,
  OperationsResponse,
  UpdateOperationPayload,
} from "../types/operation.types";

const MIN_LATENCY = 250;
const MAX_LATENCY = 900;
const FAILURE_RATE = 0.04; // 4% simulation failure rate

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException("Request was cancelled.", "AbortError");
  }
}

function simulateNetwork(signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Request was cancelled.", "AbortError"));
      return;
    }

    const latency = MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY);

    let timeoutId: ReturnType<typeof setTimeout>;

    const cleanup = () => {
      signal?.removeEventListener("abort", handleAbort);
    };

    const handleAbort = () => {
      clearTimeout(timeoutId);
      cleanup();
      reject(new DOMException("Request was cancelled.", "AbortError"));
    };

    timeoutId = setTimeout(() => {
      cleanup();
      resolve();
    }, latency);

    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}

function maybeFail(): void {
  if (Math.random() < FAILURE_RATE) {
    throw new Error("Server temporarily unreachable. Please retry the operation.");
  }
}

const priorityWeights: Record<OperationPriority, number> = {
  Urgent: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export async function getOperations(
  params: OperationsParams = {},
  signal?: AbortSignal,
): Promise<OperationsResponse> {
  await simulateNetwork(signal);
  throwIfAborted(signal);
  maybeFail();

  const {
    search = "",
    status = "All",
    priority = "All",
    sortBy = "createdAt",
    sortDirection = "desc",
    page = 1,
    limit = 10,
  } = params;

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = mockOperations.filter((operation) => {
    const titleMatch = (operation.title || operation.name || "")
      .toLowerCase()
      .includes(normalizedSearch);
    const idMatch = operation.id.toLowerCase().includes(normalizedSearch);
    const ownerMatch = operation.owner.toLowerCase().includes(normalizedSearch);

    const matchesSearch =
      normalizedSearch === "" || titleMatch || idMatch || ownerMatch;

    const matchesStatus = status === "All" || operation.status === status;
    const matchesPriority =
      priority === "All" || operation.priority === priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  filtered.sort((a, b) => {
    let difference = 0;

    if (sortBy === "priority") {
      difference = priorityWeights[a.priority] - priorityWeights[b.priority];
    } else if (sortBy === "title") {
      difference = (a.title || a.name).localeCompare(b.title || b.name);
    } else {
      difference =
        new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
    }

    if (difference === 0) {
      return a.id.localeCompare(b.id);
    }

    return sortDirection === "asc" ? difference : -difference;
  });

  const safeLimit =
    Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
  const safeRequestedPage =
    Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

  const total = filtered.length;
  const totalPages = Math.ceil(total / safeLimit);
  const safePage = Math.min(safeRequestedPage, Math.max(1, totalPages));

  const startIndex = (safePage - 1) * safeLimit;

  return {
    data: filtered.slice(startIndex, startIndex + safeLimit),
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
  };
}

export async function getOperationById(
  id: string,
  signal?: AbortSignal,
): Promise<Operation> {
  await simulateNetwork(signal);
  throwIfAborted(signal);
  maybeFail();

  const operation = mockOperations.find((item) => item.id === id);

  if (!operation) {
    throw new Error(`Request ${id} was not found.`);
  }

  return { ...operation };
}

export async function updateOperation(
  payload: UpdateOperationPayload,
  signal?: AbortSignal,
): Promise<Operation> {
  await simulateNetwork(signal);
  throwIfAborted(signal);
  maybeFail();
  throwIfAborted(signal);

  const index = mockOperations.findIndex((item) => item.id === payload.id);

  if (index === -1) {
    throw new Error(`Request ${payload.id} was not found.`);
  }

  const existing = mockOperations[index];
  const updatedTitle = payload.title || payload.name || existing.title;

  const updated: Operation = {
    ...existing,
    title: updatedTitle,
    name: updatedTitle,
    owner: payload.owner ?? existing.owner,
    status: payload.status ?? existing.status,
    priority: payload.priority ?? existing.priority,
    description: payload.description ?? existing.description,
    updatedAt: new Date().toISOString(),
  };

  mockOperations[index] = updated;
  return { ...updated };
}

export async function updateOperationStatus(
  id: string,
  status: OperationStatus,
  signal?: AbortSignal,
): Promise<Operation> {
  return updateOperation({ id, status }, signal);
}

export async function getOperationStats(
  signal?: AbortSignal,
): Promise<OperationStats> {
  await simulateNetwork(signal);
  throwIfAborted(signal);
  maybeFail();

  return mockOperations.reduce<OperationStats>(
    (stats, operation) => {
      stats.total += 1;

      switch (operation.status) {
        case "Completed":
          stats.completed += 1;
          break;
        case "Running":
          stats.running += 1;
          break;
        case "Pending":
          stats.pending += 1;
          break;
        case "Failed":
          stats.failed += 1;
          break;
      }

      return stats;
    },
    {
      total: 0,
      completed: 0,
      running: 0,
      pending: 0,
      failed: 0,
    },
  );
}

export async function getOperationActivity(
  signal?: AbortSignal,
): Promise<OperationActivityPoint[]> {
  await simulateNetwork(signal);
  throwIfAborted(signal);
  maybeFail();

  const today = new Date();
  const days: OperationActivityPoint[] = [];

  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const count = mockOperations.filter((operation) => {
      const createdAt = new Date(operation.createdAt).getTime();
      return createdAt >= date.getTime() && createdAt < nextDay.getTime();
    }).length;

    days.push({
      date: [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-"),
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      count,
    });
  }

  return days;
}
