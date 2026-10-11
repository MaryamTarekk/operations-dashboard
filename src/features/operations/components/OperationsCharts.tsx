import { Activity, ChartNoAxesColumn, PieChart } from "lucide-react";
import {
  useOperationActivity,
  useOperationStats,
} from "../hooks/useOperations";
import type { OperationStatus } from "../types/operation.types";
import { useTheme } from "../../../context/ThemeContext";

const statusItems: {
  key: "completed" | "running" | "pending" | "failed";
  label: OperationStatus;
  color: string;
}[] = [
  { key: "completed", label: "Completed", color: "#10b981" },
  { key: "running", label: "Running", color: "#6366f1" },
  { key: "pending", label: "Pending", color: "#f59e0b" },
  { key: "failed", label: "Failed", color: "#ef4444" },
];

function ChartLoading() {
  return (
    <div
      className="flex h-52 items-center justify-center text-sm text-slate-400 dark:text-slate-500"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
        <span>Loading chart telemetry...</span>
      </div>
    </div>
  );
}

function ChartError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="flex h-52 flex-col items-center justify-center gap-3"
      role="alert"
    >
      <p className="text-sm text-rose-500">Couldn't load chart telemetry.</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Retry chart sync
      </button>
    </div>
  );
}

export function OperationsCharts() {
  const { theme } = useTheme();
  const statsQuery = useOperationStats();
  const activityQuery = useOperationActivity();

  const stats = statsQuery.data;
  const activity = activityQuery.data;

  const statusTotal = statusItems.reduce(
    (total, item) => total + (stats?.[item.key] ?? 0),
    0,
  );

  const segments = statusItems.reduce<
    {
      key: "completed" | "running" | "pending" | "failed";
      label: OperationStatus;
      color: string;
      count: number;
      percentage: number;
      offset: number;
    }[]
  >((result, item) => {
    const count = stats?.[item.key] ?? 0;
    const percentage = statusTotal > 0 ? (count / statusTotal) * 100 : 0;
    const previousOffset =
      result.length > 0
        ? result[result.length - 1].offset +
          result[result.length - 1].percentage
        : 0;

    result.push({
      ...item,
      count,
      percentage,
      offset: previousOffset,
    });

    return result;
  }, []);

  const maxCount = Math.max(1, ...(activity?.map((day) => day.count) ?? []));

  return (
    <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* Status distribution */}
      <article className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md transition-colors dark:border-white/10 dark:bg-slate-900/70 sm:p-7">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Status Distribution
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Live breakdown across 5,000 operations
            </p>
          </div>

          <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <PieChart size={20} />
          </div>
        </div>

        {statsQuery.isPending ? (
          <ChartLoading />
        ) : statsQuery.isError ? (
          <ChartError onRetry={() => void statsQuery.refetch()} />
        ) : (
          <div className="flex flex-col items-center gap-6 py-5 sm:flex-row sm:justify-around">
            <div className="relative h-44 w-44 shrink-0">
              <svg
                viewBox="0 0 120 120"
                className="h-full w-full -rotate-90"
                role="img"
                aria-label="Operations status distribution chart"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="43"
                  fill="none"
                  stroke={theme === "dark" ? "#1f2937" : "#e2e8f0"}
                  strokeWidth="12"
                />

                {statusTotal > 0 &&
                  segments.map((segment) => (
                    <circle
                      key={segment.key}
                      cx="60"
                      cy="60"
                      r="43"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="12"
                      strokeDasharray={`${
                        (segment.percentage / 100) * 270.18
                      } 270.18`}
                      strokeDashoffset={-(segment.offset / 100) * 270.18}
                      strokeLinecap="round"
                    />
                  ))}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {stats?.total.toLocaleString() ?? 0}
                </span>
                <span className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Total Operations
                </span>
              </div>
            </div>

            <div className="w-full space-y-3.5">
              {segments.map((segment) => (
                <div
                  key={segment.key}
                  className="flex items-center justify-between gap-3 rounded-xl p-2 transition hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full shadow-sm"
                      style={{
                        backgroundColor: segment.color,
                        boxShadow: `0 0 8px ${segment.color}40`,
                      }}
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {segment.label}
                    </span>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {segment.count.toLocaleString()}
                    </span>
                    <span className="ml-2 font-mono text-[11px] text-slate-400">
                      {segment.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Operations activity */}
      <article className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md transition-colors dark:border-white/10 dark:bg-slate-900/70 sm:p-7">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              7-Day Activity Velocity
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Operations creation throughput
            </p>
          </div>

          <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <ChartNoAxesColumn size={20} />
          </div>
        </div>

        {activityQuery.isPending ? (
          <ChartLoading />
        ) : activityQuery.isError ? (
          <ChartError onRetry={() => void activityQuery.refetch()} />
        ) : (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Activity size={18} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {(activity ?? [])
                  .reduce((sum, day) => sum + day.count, 0)
                  .toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                operations generated in 7 days
              </span>
            </div>

            <div
              className="mt-6 grid h-44 grid-cols-7 items-end gap-2 border-b border-slate-100 pb-2 sm:gap-4 dark:border-white/10"
              role="img"
              aria-label="Bar chart showing new operations for the last seven days"
            >
              {(activity ?? []).map((day) => {
                const height =
                  day.count > 0 ? Math.max(8, (day.count / maxCount) * 100) : 0;

                return (
                  <div
                    key={day.date}
                    className="group flex h-full min-w-0 flex-col items-center justify-end gap-2"
                  >
                    <span className="font-mono text-[11px] font-semibold text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-400">
                      {day.count}
                    </span>

                    <div className="flex min-h-0 w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-violet-500 transition-all duration-300 group-hover:from-indigo-500 group-hover:to-violet-400 group-hover:shadow-lg group-hover:shadow-indigo-500/30"
                        style={{
                          height: `${height}%`,
                          minHeight: day.count > 0 ? "6px" : "0",
                        }}
                        title={`${day.date}: ${day.count} operations`}
                      />
                    </div>

                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </article>
    </section>
  );
}
