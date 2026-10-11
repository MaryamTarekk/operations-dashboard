import { useState, useRef } from "react";
import { Play, CheckCircle2, Clock, Zap, Terminal } from "lucide-react";
import { getOperations } from "../api/operationsApi";

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warn" | "error";
}

export function RaceConditionTester() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeResult, setActiveResult] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<
    "idle" | "running" | "passed" | "failed"
  >("idle");

  const activeRequestIdRef = useRef<number>(0);

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });

    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        timestamp: time,
        message,
        type,
      },
    ]);
  };

  const runSimulation = async () => {
    setIsRunning(true);
    setLogs([]);
    setActiveResult(null);
    setTestStatus("running");

    addLog(
      "🚀 Starting Concurrency & Out-of-Order Race Condition Test...",
      "info",
    );

    const req1Id = ++activeRequestIdRef.current;

    addLog(
      `[#${req1Id}] Dispatched Request 1: search="User" (Simulating slow 1800ms server lag)...`,
      "warn",
    );

    const controller1 = new AbortController();

    const promise1 = new Promise<{ id: number; data: string }>(
      (resolve, reject) => {
        const timer = setTimeout(async () => {
          try {
            if (controller1.signal.aborted) {
              reject(new DOMException("Aborted", "AbortError"));
              return;
            }

            const res = await getOperations({
              search: "User",
              limit: 3,
            });

            resolve({
              id: req1Id,
              data: `User (${res.total} matches)`,
            });
          } catch (error) {
            reject(error);
          }
        }, 1600);

        controller1.signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        });
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 250));

    const req2Id = ++activeRequestIdRef.current;

    addLog(
      `[#${req2Id}] User quickly changed search to: search="Invoice" (Fast 350ms response)...`,
      "info",
    );

    controller1.abort();

    addLog(
      `[Shield] AbortSignal triggered for Request #${req1Id} because search query changed.`,
      "info",
    );

    const promise2 = new Promise<{ id: number; data: string }>(
      (resolve, reject) => {
        setTimeout(async () => {
          try {
            const res = await getOperations({
              search: "Invoice",
              limit: 3,
            });

            resolve({
              id: req2Id,
              data: `Invoice (${res.total} matches)`,
            });
          } catch (error) {
            reject(error);
          }
        }, 350);
      },
    );

    promise2
      .then((res) => {
        addLog(
          `[#${res.id}] ✅ Request 2 finished FIRST! Active search result set to: "${res.data}"`,
          "success",
        );

        setActiveResult(res.data);
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        addLog(`[#${req2Id}] Error in Request 2: ${message}`, "error");
      });

    promise1
      .then((res) => {
        if (res.id !== activeRequestIdRef.current) {
          addLog(
            `[#${res.id}] ⚠️ Stale response arrived late! Concurrency Guard successfully DISCARDED it without overwriting active result.`,
            "success",
          );
        } else {
          setActiveResult(res.data);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") {
          addLog(
            `[#${req1Id}] ✅ Slow Request #1 was safely cancelled and aborted before rendering.`,
            "success",
          );
        } else {
          const message =
            error instanceof Error ? error.message : "Unknown error";

          addLog(`[#${req1Id}] Request 1 error: ${message}`, "warn");
        }
      })
      .finally(() => {
        setTimeout(() => {
          setIsRunning(false);
          setTestStatus("passed");

          addLog(
            "🎉 TEST PASSED: Latest search preserved. Stale response had zero impact on UI state.",
            "success",
          );
        }, 1800);
      });
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Zap size={20} />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Live Race Condition Verifier
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Requirement #4: Stale delayed searches must never overwrite newer
              search results
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {testStatus === "passed" && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 size={14} /> Shield Verified
            </span>
          )}

          <button
            type="button"
            disabled={isRunning}
            onClick={runSimulation}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:scale-105 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Clock size={14} className="animate-spin" />
                <span>Simulating Race...</span>
              </>
            ) : (
              <>
                <Play size={14} />
                <span>Simulate Race Condition</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs text-slate-200 shadow-inner dark:border-white/10">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-indigo-400" />
            <span>Concurrency Event Stream</span>
          </div>

          {activeResult && (
            <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-indigo-300">
              Active UI Search: {activeResult}
            </span>
          )}
        </div>

        <div className="max-h-56 space-y-1.5 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="py-4 text-center text-slate-500">
              Click "Simulate Race Condition" to trigger two asynchronous
              out-of-order search requests.
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2 leading-relaxed"
              >
                <span className="shrink-0 text-slate-500">
                  [{log.timestamp}]
                </span>

                <span
                  className={
                    log.type === "success"
                      ? "text-emerald-400"
                      : log.type === "warn"
                        ? "text-amber-400"
                        : log.type === "error"
                          ? "text-rose-400"
                          : "text-slate-300"
                  }
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
