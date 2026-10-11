import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Database,
  Moon,
  Sun,
  Flame,
  Search,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

export function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [simulatedQuery, setSimulatedQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#070b14] dark:text-slate-100">
      {/* Background ambient gradient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] top-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[130px] dark:bg-indigo-600/15" />
        <div className="absolute -right-[15%] top-[15%] h-[550px] w-[550px] rounded-full bg-violet-600/10 blur-[140px] dark:bg-violet-500/15" />
        <div className="absolute left-[30%] top-[45%] h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px] dark:bg-cyan-500/10" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-[#090e1a]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
              <Activity size={22} className="animate-pulse" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-indigo-400 dark:to-violet-400">
                OpsPulse
              </span>
              <span className="ml-2 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                Enterprise
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white"
            >
              Features
            </a>
            <a
              href="#architecture"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white"
            >
              Race Protection
            </a>
            <a
              href="#telemetry"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white"
            >
              5,000+ Scale
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {theme === "dark" ? (
                <Sun
                  size={18}
                  className="text-amber-400 transition-transform hover:rotate-45"
                />
              ) : (
                <Moon
                  size={18}
                  className="text-indigo-600 transition-transform hover:-rotate-12"
                />
              )}
            </button>

            {/* Launch Dashboard CTA */}
            <Link
              to="/operations"
              className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] hover:shadow-indigo-600/40 active:scale-[0.98]"
            >
              <span className="hidden xs:inline">Launch Dashboard</span>
              <span className="xs:hidden">Dashboard</span>
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-20 pt-10 sm:pt-16 md:pt-24">
        <div className="flex flex-col items-center text-center">
          {/* Top subtle pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-50/80 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur-sm dark:border-indigo-500/30 dark:bg-indigo-950/40 dark:text-indigo-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 -ml-3" />
            <span>5,000+ Live Workloads • Zero Stale-Search Guarantee</span>
          </div>

          <h1 className="mt-6 sm:mt-8 max-w-4xl text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black tracking-tight">
            High-Performance Operations{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-300 dark:to-pink-400">
              Orchestration Platform
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            Engineered with strict separation of concerns, concurrency-safe
            query aborts, and sub-millisecond filtering across massive dataset
            states. Complete with dark mode, real-time telemetry, and resilient
            lifecycle mutations.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 sm:gap-4 w-full xs:w-auto px-4 xs:px-0">
            <Link
              to="/operations"
              className="group inline-flex items-center justify-center gap-2.5 sm:gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 hover:shadow-indigo-600/50"
            >
              <span>Enter Operations Console</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#architecture"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white/80 px-5 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-slate-50 dark:border-white/15 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ShieldCheck size={18} className="text-indigo-500" />
              <span>Verify Architecture</span>
            </a>
          </div>

          {/* Quick Stats Grid */}
          {/* Quick Stats Grid */}
          <div className="mt-12 sm:mt-16 grid w-full max-w-5xl grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3.5 sm:p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60">
              <div className="flex items-center gap-1.5 sm:gap-2 text-indigo-600 dark:text-indigo-400">
                <Database size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Dataset
                </span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                5,000
              </p>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Mock records
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3.5 sm:p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60">
              <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Race Shield
                </span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                100%
              </p>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                AbortSignal guard
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3.5 sm:p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60">
              <div className="flex items-center gap-1.5 sm:gap-2 text-amber-500">
                <Clock size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Mock Latency
                </span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                300ms+
              </p>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Jitter simulated
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3.5 sm:p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60">
              <div className="flex items-center gap-1.5 sm:gap-2 text-violet-600 dark:text-violet-400">
                <Flame size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Statuses
                </span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                4 States
              </p>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Pending, Done...
              </p>
            </div>
          </div>
        </div>

        {/* Live Interactive UI Preview */}
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-3 text-xs font-mono font-medium text-slate-400">
                opspulse.internal/operations?status=All&sortBy=createdAt
              </span>
            </div>
            <Link
              to="/operations"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300"
            >
              <span>Open live app</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  Mission Control Console
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Filtered preview with live mock data
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  ● Cluster Sync: Active
                </span>
              </div>
            </div>

            {/* Quick interactive search simulation box */}
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-800/50">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Try interactive preview search (e.g., Payment, OP-00042)..."
                value={simulatedQuery}
                onChange={(e) => setSimulatedQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              {simulatedQuery && (
                <button
                  type="button"
                  onClick={() => setSimulatedQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Mock Rows */}
            <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-100 overflow-hidden dark:divide-white/5 dark:border-white/5">
              {[
                {
                  id: "REQ-00001",
                  name: "Payment Processing Gateway 1",
                  owner: "Sarah Chen",
                  status: "Completed",
                  time: "2 mins ago",
                },
                {
                  id: "REQ-00002",
                  name: "Data Synchronization Service 2",
                  owner: "James Wilson",
                  status: "Running",
                  time: "Just now",
                },
                {
                  id: "REQ-00003",
                  name: "Bulk User Data Import 3",
                  owner: "Emily Davis",
                  status: "Pending",
                  time: "10 mins ago",
                },
                {
                  id: "REQ-00004",
                  name: "Analytics Processing Engine 4",
                  owner: "Michael Brown",
                  status: "Failed",
                  time: "1 hour ago",
                },
              ]
                .filter(
                  (item) =>
                    !simulatedQuery ||
                    item.name
                      .toLowerCase()
                      .includes(simulatedQuery.toLowerCase()) ||
                    item.id
                      .toLowerCase()
                      .includes(simulatedQuery.toLowerCase()),
                )
                .map((row) => (
                  <div
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-4 bg-white/50 px-4 py-3.5 transition-colors hover:bg-indigo-50/50 dark:bg-slate-900/40 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {row.id}
                      </span>
                      <span className="font-medium text-sm text-slate-800 dark:text-slate-200">
                        {row.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {row.owner}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          row.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : row.status === "Running"
                              ? "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-950/40 dark:text-blue-400"
                              : row.status === "Pending"
                                ? "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-950/40 dark:text-amber-400"
                                : "bg-red-50 text-red-700 ring-1 ring-red-500/20 dark:bg-red-950/40 dark:text-red-400"
                        }`}
                      >
                        {row.status}
                      </span>
                      <span className="text-xs text-slate-400">{row.time}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Race Condition Protection Section */}
      <section
        id="architecture"
        className="border-t border-slate-200 bg-slate-100/60 py-20 dark:border-white/10 dark:bg-[#0b101e]/80"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
              Core Requirement: Race Condition Protection
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Deterministic Query Resolution Under Network Jitter
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
              Simulated real-world network latency (300ms–1200ms) with
              out-of-order race guards. When a user changes their search query
              before the previous request finishes, stale packets are discarded
              immediately.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Zap size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold">1. Debounced Input</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Keeps the UI responsive at 60fps without triggering premature
                calls while the user is still typing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <ShieldCheck size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold">2. Native AbortSignal</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Every request carries an active AbortSignal. In-flight delayed
                queries are formally cancelled if parameters mutate.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold">
                3. URL State Persistence
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                All filters and queries are synced to the URL and location
                state. Open details, change status, and navigate back with zero
                loss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 p-10 text-white shadow-2xl md:p-16">
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Ready to explore all 5,000 operations?
            </h2>
            <p className="mt-4 text-indigo-200 text-base sm:text-lg">
              Launch into the full operations console with real-time charts,
              dark mode, status modification, and responsive management.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to="/operations"
                className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl transition-all hover:bg-slate-100 hover:scale-105"
              >
                <span>Launch Operations Dashboard</span>
                <ArrowRight
                  size={18}
                  className="text-indigo-600 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 transition-colors dark:border-white/10 dark:bg-[#070b14] dark:text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              OpsPulse
            </span>
            <span>— Operations Management Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span>React 19 + TypeScript</span>
            <span>•</span>
            <span>TanStack Query v5</span>
            <span>•</span>
            <span>Tailwind v4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
