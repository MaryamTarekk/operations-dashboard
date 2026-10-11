import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  Sun,
  Moon,
  Home,
  CheckCircle2,
  AlertTriangle,
  Menu,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const isDetailsPage = /^\/operations\/[^/]+$/.test(location.pathname);

  const notifications = [
    {
      id: "1",
      title: "Batch Sync Succeeded",
      desc: "Operation OP-00124 completed in 420ms",
      time: "2 mins ago",
      type: "success",
    },
    {
      id: "2",
      title: "Retry Triggered",
      desc: "Operation OP-00089 failed — retry scheduled",
      time: "14 mins ago",
      type: "warning",
    },
    {
      id: "3",
      title: "New Dataset Streamed",
      desc: "5,000 records loaded into in-memory store",
      time: "1 hour ago",
      type: "info",
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex min-h-[64px] sm:min-h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-8 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-[#090e1a]/80">
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle mobile menu"
            className="rounded-xl border border-slate-200 p-2 text-slate-600 md:hidden dark:border-white/10 dark:text-slate-300"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Breadcrumbs */}
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
            <Link
              to="/"
              className="flex items-center gap-1 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0"
            >
              <Home size={13} />
              <span className="hidden xs:inline">Portal</span>
            </Link>
            <span>/</span>
            <Link
              to="/operations"
              className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
            >
              Requests
            </Link>
            {isDetailsPage && (
              <>
                <span>/</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                  Details
                </span>
              </>
            )}
          </nav>
          <h2 className="mt-0.5 text-xs sm:text-base font-bold tracking-tight text-slate-900 dark:text-white truncate max-w-[130px] sm:max-w-none">
            {isDetailsPage ? "Request Inspector" : "Requests Console"}
          </h2>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* System Health Status Indicator */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/80 px-3 py-1.5 sm:flex dark:border-emerald-500/30 dark:bg-emerald-950/40">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            5,000 Nodes Active
          </span>
        </div>

        {/* Quick Search Shortcut */}
        <button
          type="button"
          aria-label="Focus search input"
          onClick={() => {
            const input = document.getElementById("operations-search");
            input?.focus();
          }}
          className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 transition hover:border-indigo-300 hover:bg-white hover:text-slate-800 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Search size={15} />
          <span className="hidden sm:inline">Search (Ctrl+K)</span>
        </button>

        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? (
            <Sun size={18} className="text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon size={18} className="text-indigo-600 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            aria-label="View notifications"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-[#090e1a]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-[#0f172a]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Notifications
                </span>
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  3 New
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-2.5 rounded-xl p-2 transition hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    {n.type === "success" ? (
                      <CheckCircle2 size={16} className="mt-0.5 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertTriangle size={16} className="mt-0.5 text-amber-500 shrink-0" />
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {n.desc}
                      </p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-md shadow-indigo-500/20">
          OP
        </div>
      </div>
    </header>
  );
}
