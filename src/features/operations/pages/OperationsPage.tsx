import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import {
  Activity,
  CheckCircle2,
  Clock3,
  XCircle,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  AlertCircle,
  Eye,
  X,
  PlayCircle,
  Sparkles,
  ChevronDown,
  Flame,
  Check,
} from "lucide-react";

import { OperationsCharts } from "../components/OperationsCharts";
import {
  useOperations,
  useOperationStats,
  useUpdateOperationStatus,
} from "../hooks/useOperations";

import type {
  Operation,
  OperationStatus,
  OperationPriority,
  OperationSortField,
  SortDirection,
  OperationsParams,
} from "../types/operation.types";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 250;

const statuses: OperationStatus[] = [
  "Pending",
  "Running",
  "Completed",
  "Failed",
];

const priorities: OperationPriority[] = ["Low", "Medium", "High", "Urgent"];

const statusStyles: Record<OperationStatus, { pill: string; dot: string }> = {
  Completed: {
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/30",
    dot: "bg-emerald-500",
  },
  Running: {
    pill: "bg-indigo-50 text-indigo-700 ring-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-500/30",
    dot: "bg-indigo-500 animate-ping",
  },
  Pending: {
    pill: "bg-amber-50 text-amber-700 ring-amber-500/20 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/30",
    dot: "bg-amber-500",
  },
  Failed: {
    pill: "bg-rose-50 text-rose-700 ring-rose-500/20 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-500/30",
    dot: "bg-rose-500",
  },
};

const priorityStyles: Record<OperationPriority, string> = {
  Urgent:
    "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 ring-rose-500/30",
  High: "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 ring-orange-500/30",
  Medium:
    "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 ring-blue-500/30",
  Low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-slate-400/20",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  badgeText,
}: {
  title: string;
  value: number;
  icon: typeof Activity;
  color: string;
  badgeText: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-4 sm:p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/80">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-1.5 sm:mt-3 font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {value.toLocaleString("en-US")}
          </p>
        </div>

        <div className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 shadow-md ${color}`}>
          <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex items-center justify-between border-t border-slate-100 pt-2 sm:pt-3 text-[10px] sm:text-xs text-slate-500 dark:border-white/5 dark:text-slate-400">
        <span className="truncate max-w-[90px] sm:max-w-none">{badgeText}</span>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Live</span>
      </div>
    </article>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-8" role="status" aria-live="polite">
      <div className="flex items-center justify-center gap-3 py-12 text-slate-500 dark:text-slate-400">
        <LoaderCircle className="animate-spin text-indigo-600 dark:text-indigo-400" size={32} />
        <span className="text-sm font-semibold">Streaming requests...</span>
      </div>
    </div>
  );
}

/**
 * Interactive inline status changer with optimistic UI update
 */
function InlineStatusChanger({
  operation,
}: {
  operation: Operation;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const updateStatus = useUpdateOperationStatus();

  const currentConfig = statusStyles[operation.status];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (newStatus: OperationStatus) => {
    setOpen(false);
    if (newStatus === operation.status) return;
    updateStatus.mutate({ id: operation.id, status: newStatus });
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={updateStatus.isPending}
        title="Click to change status immediately"
        className={`group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition-all hover:scale-105 hover:shadow-sm ${currentConfig.pill}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${currentConfig.dot}`} />
        <span>{operation.status}</span>
        <ChevronDown size={12} className="opacity-60 transition-transform group-hover:opacity-100" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-36 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-[#0f172a]">
          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Change Status
          </p>
          <div className="space-y-0.5">
            {statuses.map((status) => {
              const active = status === operation.status;
              const cfg = statusStyles[status];
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleSelect(status)}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    <span>{status}</span>
                  </span>
                  {active && <Check size={12} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function OperationsPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read search & filters from URL
  const search = searchParams.get("search") ?? "";
  const rawStatus = searchParams.get("status") ?? "All";
  const rawPriority = searchParams.get("priority") ?? "All";
  const rawSortBy = searchParams.get("sortBy") ?? "createdAt";
  const rawDirection = searchParams.get("direction") ?? "desc";

  // Local search input state (keeps typing buttery smooth!)
  const [searchInput, setSearchInput] = useState(search);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronize local input state only if URL search changed externally (e.g. Back/Forward button)
  useEffect(() => {
    if (search !== searchInput && document.activeElement?.id !== "operations-search") {
      setSearchInput(search);
    }
  }, [search]);

  // Clean timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current !== null) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const status: OperationStatus | "All" =
    rawStatus === "Pending" ||
    rawStatus === "Running" ||
    rawStatus === "Completed" ||
    rawStatus === "Failed"
      ? rawStatus
      : "All";

  const priority: OperationPriority | "All" =
    rawPriority === "Low" ||
    rawPriority === "Medium" ||
    rawPriority === "High" ||
    rawPriority === "Urgent"
      ? rawPriority
      : "All";

  const sortBy: OperationSortField =
    rawSortBy === "updatedAt" ||
    rawSortBy === "priority" ||
    rawSortBy === "title"
      ? rawSortBy
      : "createdAt";

  const sortDirection: SortDirection = rawDirection === "asc" ? "asc" : "desc";

  const parsedPage = Number(searchParams.get("page"));
  const page =
    Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const params: OperationsParams = useMemo(
    () => ({
      search,
      status,
      priority,
      sortBy,
      sortDirection,
      page,
      limit: PAGE_SIZE,
    }),
    [search, status, priority, sortBy, sortDirection, page],
  );

  const operationsQuery = useOperations(params);
  const statsQuery = useOperationStats();

  const operations = operationsQuery.data;
  const stats = statsQuery.data;

  function updateParams(updates: Record<string, string>, resetPage = true) {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "All") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    if (resetPage) {
      next.delete("page");
    }

    setSearchParams(next, { replace: true });
  }

  // Smooth, non-blocking debounced search handler
  function handleSearchChange(value: string) {
    setSearchInput(value);

    if (searchTimeoutRef.current !== null) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const trimmedSearch = value.trim();

      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);

          if (trimmedSearch) {
            next.set("search", trimmedSearch);
          } else {
            next.delete("search");
          }

          next.delete("page");
          return next;
        },
        { replace: true },
      );

      searchTimeoutRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
  }

  function clearSearch() {
    setSearchInput("");
    updateParams({ search: "" }, true);
  }

  function changePage(nextPage: number) {
    const next = new URLSearchParams(searchParams);

    if (nextPage <= 1) {
      next.delete("page");
    } else {
      next.set("page", String(nextPage));
    }

    setSearchParams(next);
  }

  function clearFilters() {
    if (searchTimeoutRef.current !== null) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    setSearchInput("");
    setSearchParams(new URLSearchParams(), { replace: true });
  }

  const hasFilters =
    search !== "" ||
    searchInput.trim() !== "" ||
    status !== "All" ||
    priority !== "All" ||
    sortBy !== "createdAt" ||
    sortDirection !== "desc";

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              WORKSPACE
            </span>
            <span className="text-xs font-semibold text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              OPERATIONS & REQUESTS
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Requests Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time management for 5,000+ workload requests with optimistic updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              void operationsQuery.refetch();
              void statsQuery.refetch();
            }}
            disabled={operationsQuery.isFetching || statsQuery.isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RefreshCw
              size={15}
              className={
                operationsQuery.isFetching || statsQuery.isFetching
                  ? "animate-spin text-indigo-600 dark:text-indigo-400"
                  : ""
              }
            />
            <span>Refresh State</span>
          </button>
        </div>
      </section>

      {/* Statistics Cards */}
      {statsQuery.isPending && !stats ? (
        <section className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 sm:h-36 animate-pulse rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/60"
            />
          ))}
        </section>
      ) : stats ? (
        <section className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            color="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
            badgeText="Finished successfully"
          />

          <StatCard
            title="Running"
            value={stats.running}
            icon={PlayCircle}
            color="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
            badgeText="In-flight workload"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon={Clock3}
            color="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
            badgeText="Queued for dispatch"
          />

          <StatCard
            title="Failed"
            value={stats.failed}
            icon={XCircle}
            color="bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
            badgeText="Requires investigation"
          />
        </section>
      ) : null}

      {/* Analytics Charts */}
      <OperationsCharts />

      {/* Main Operations Table Container */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-900/80">
        <div className="flex flex-col gap-5 border-b border-slate-200/80 p-5 sm:p-7 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                All Requests
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Search, filter, and change status directly from the list
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {operations
                  ? `${operations.total.toLocaleString("en-US")} total requests`
                  : "Synchronizing..."}
              </span>
            </div>
          </div>

          {/* Search and Filters Toolbar */}
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-[minmax(240px,1.2fr)_170px_170px_200px_auto]">
            {/* Search Input */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="operations-search"
                type="search"
                value={searchInput}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search by title, owner, or ID (e.g. REQ-00042)..."
                className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 py-2.5 pl-10 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-800"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            {/* Status Filter */}
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(event) => updateParams({ status: event.target.value })}
              className="rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 dark:border-white/10 dark:bg-[#111827] dark:text-slate-100 dark:focus:border-indigo-400"
            >
              <option value="All" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">All statuses</option>
              <option value="Pending" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">Pending only</option>
              <option value="Running" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">Running only</option>
              <option value="Completed" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">Completed only</option>
              <option value="Failed" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">Failed only</option>
            </select>

            {/* Priority Filter */}
            <select
              aria-label="Filter by priority"
              value={priority}
              onChange={(event) =>
                updateParams({ priority: event.target.value })
              }
              className="rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 dark:border-white/10 dark:bg-[#111827] dark:text-slate-100 dark:focus:border-indigo-400"
            >
              <option value="All" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">All priorities</option>
              <option value="Urgent" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">Urgent only</option>
              <option value="High" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">High only</option>
              <option value="Medium" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">Medium only</option>
              <option value="Low" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">Low only</option>
            </select>

            {/* Sort Filter */}
            <select
              aria-label="Sort requests"
              value={`${sortBy}:${sortDirection}`}
              onChange={(event) => {
                const [nextSortBy, nextDirection] =
                  event.target.value.split(":");
                updateParams({
                  sortBy: nextSortBy,
                  direction: nextDirection,
                });
              }}
              className="rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 dark:border-white/10 dark:bg-[#111827] dark:text-slate-100 dark:focus:border-indigo-400"
            >
              <option value="createdAt:desc" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">Newest created</option>
              <option value="createdAt:asc" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">Oldest created</option>
              <option value="updatedAt:desc" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">Recently updated</option>
              <option value="priority:desc" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">Highest priority first</option>
              <option value="title:asc" className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100">Title (A-Z)</option>
            </select>

            {/* Clear Filters Button */}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Query Error State */}
        {operationsQuery.isError && !operations ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <AlertCircle size={38} className="text-rose-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">
              Unable to load requests
            </h3>
            <p className="max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {operationsQuery.error instanceof Error
                ? operationsQuery.error.message
                : "An unexpected network error occurred."}
            </p>
            <button
              type="button"
              onClick={() => void operationsQuery.refetch()}
              className="mt-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
            >
              Retry request
            </button>
          </div>
        ) : operationsQuery.isPending && !operations ? (
          <LoadingSkeleton />
        ) : operations && operations.data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <Search size={24} className="text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No requests match your criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try modifying your search or resetting filters.
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-2 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Reset all filters
              </button>
            )}
          </div>
        ) : operations ? (
          <>
            {operationsQuery.isError && (
              <div
                role="alert"
                className="border-b border-rose-200 bg-rose-50 px-5 py-3 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300"
              >
                <span>Latest background update failed. Retrying automatically.</span>
                <button
                  type="button"
                  onClick={() => void operationsQuery.refetch()}
                  className="ml-2 font-bold underline"
                >
                  Retry now
                </button>
              </div>
            )}

            {/* Mobile Card List (Visible on phones & small screens < md) */}
            <div className="divide-y divide-slate-100 md:hidden dark:divide-white/5">
              {operations.data.map((operation) => {
                const titleText = operation.title || operation.name;
                return (
                  <div
                    key={operation.id}
                    className="p-4 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/operations/${encodeURIComponent(operation.id)}`}
                          state={{ from: `${location.pathname}${location.search}` }}
                          className="font-bold text-sm text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 block truncate"
                        >
                          {titleText}
                        </Link>
                        <span className="font-mono text-xs text-slate-400 mt-0.5 block">
                          {operation.id}
                        </span>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center rounded-lg px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${
                          priorityStyles[operation.priority]
                        }`}
                      >
                        {operation.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[140px]">
                        👤 {operation.owner}
                      </span>
                      <InlineStatusChanger operation={operation} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-white/5 pt-2">
                      <span>{formatDate(operation.createdAt)}</span>
                      <Link
                        to={`/operations/${encodeURIComponent(operation.id)}`}
                        state={{ from: `${location.pathname}${location.search}` }}
                        className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Eye size={13} />
                        <span>Details</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Hidden on mobile < md, visible md and up) */}
            <div className="hidden md:block relative overflow-x-auto">
              {/* Subtle top loading progress bar (non-blocking) */}
              {operationsQuery.isFetching && (
                <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-indigo-100 dark:bg-indigo-950">
                  <div className="h-full w-1/3 animate-pulse bg-indigo-600 dark:bg-indigo-400" />
                </div>
              )}

              <table className="w-full min-w-[950px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-white/5 dark:bg-slate-800/40 dark:text-slate-400">
                    <th className="px-6 py-4">Request Title & ID</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4">Status (Click to change)</th>
                    <th className="px-6 py-4">Created At</th>
                    <th className="px-6 py-4">Last Updated</th>
                    <th className="px-6 py-4 text-right">Inspect</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {operations.data.map((operation) => {
                    const titleText = operation.title || operation.name;

                    return (
                      <tr
                        key={operation.id}
                        className="group transition-all duration-150 hover:bg-slate-50/90 dark:hover:bg-slate-800/40"
                      >
                        {/* Title & ID */}
                        <td className="px-6 py-4">
                          <Link
                            to={`/operations/${encodeURIComponent(operation.id)}`}
                            state={{
                              from: `${location.pathname}${location.search}`,
                            }}
                            className="block"
                          >
                            <span className="font-semibold text-slate-800 transition group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">
                              {titleText}
                            </span>
                            <span className="mt-0.5 block font-mono text-xs text-slate-400">
                              {operation.id}
                            </span>
                          </Link>
                        </td>

                        {/* Priority Badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ${
                              priorityStyles[operation.priority]
                            }`}
                          >
                            {operation.priority}
                          </span>
                        </td>

                        {/* Owner */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {operation.owner}
                          </span>
                        </td>

                        {/* Inline Status Changer */}
                        <td className="px-6 py-4">
                          <InlineStatusChanger operation={operation} />
                        </td>

                        {/* Created At */}
                        <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(operation.createdAt)}
                        </td>

                        {/* Updated At */}
                        <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(operation.updatedAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/operations/${encodeURIComponent(operation.id)}`}
                            state={{
                              from: `${location.pathname}${location.search}`,
                            }}
                            aria-label={`View ${operation.id}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-white/10 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300"
                          >
                            <Eye size={14} />
                            <span>Details</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col gap-3 border-t border-slate-200/80 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
              <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {operations.total === 0
                    ? 0
                    : (operations.page - 1) * operations.limit + 1}
                  {" – "}
                  {Math.min(
                    operations.page * operations.limit,
                    operations.total,
                  )}
                </span>{" "}
                of {operations.total.toLocaleString("en-US")} requests
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changePage(operations.page - 1)}
                  disabled={operations.page <= 1 || operationsQuery.isFetching}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ChevronLeft size={15} />
                  <span>Previous</span>
                </button>

                <span className="font-mono px-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  Page {operations.page} / {Math.max(1, operations.totalPages)}
                </span>

                <button
                  type="button"
                  onClick={() => changePage(operations.page + 1)}
                  disabled={
                    operations.page >= operations.totalPages ||
                    operationsQuery.isFetching
                  }
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span>Next</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
