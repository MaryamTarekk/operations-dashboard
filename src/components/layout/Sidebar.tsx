import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Activity,
  Home,
  CheckCircle2,
  Clock,
  XCircle,
  PlayCircle,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Wifi,
  X,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useOperationStats } from "../../features/operations/hooks/useOperations";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}

export function Sidebar({
  collapsed: externalCollapsed,
  onToggleCollapse,
  onClose,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data: stats } = useOperationStats();

  const isCollapsed =
    externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const handleToggle =
    onToggleCollapse || (() => setInternalCollapsed((prev) => !prev));

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 flex flex-col border-r transition-all duration-300 ease-in-out z-40 overflow-hidden ${
        isCollapsed ? "w-20" : "w-72"
      } border-slate-200 bg-white text-slate-800 backdrop-blur-xl dark:border-white/10 dark:bg-[#090e1a] dark:text-slate-100 shadow-xl md:shadow-none`}
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between border-b border-slate-200/80 px-5 dark:border-white/10">
        <Link
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-3 overflow-hidden"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
            <Activity size={22} className="animate-pulse" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 transition-opacity duration-200">
              <div className="flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-lg font-black tracking-tight text-transparent dark:from-indigo-400 dark:to-violet-400">
                  OpsPulse
                </span>
                <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  PRO
                </span>
              </div>
              <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                Operations Engine
              </p>
            </div>
          )}
        </Link>

        {/* Mobile close button or Desktop collapse toggle */}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 md:hidden"
          >
            <X size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggle}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden md:flex rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            {isCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-6">
          {!isCollapsed && (
            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Navigation
            </p>
          )}

          <nav className="space-y-1.5">
            <NavLink
              to="/operations"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                } ${isCollapsed ? "justify-center" : ""}`
              }
              title="Requests Console"
            >
              <Activity size={20} className="shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">Requests</span>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-current">
                    5k
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                } ${isCollapsed ? "justify-center" : ""}`
              }
              title="Portal Landing Page"
            >
              <Home size={20} className="shrink-0" />
              {!isCollapsed && <span className="flex-1">Portal Home</span>}
            </NavLink>
          </nav>
        </div>

        {/* Live Operational Counters in Sidebar (when expanded) */}
        {!isCollapsed && stats && (
          <div className="mb-6">
            <p className="mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Live Workload Status
            </p>
            <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-white/10 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={14} /> Completed
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {stats.completed.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                  <PlayCircle size={14} /> Running
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {stats.running.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
                  <Clock size={14} /> Pending
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {stats.pending.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-rose-600 dark:text-rose-400">
                  <XCircle size={14} /> Failed
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {stats.failed.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Network & Concurrency Shield Info */}
        {!isCollapsed && (
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-violet-50/30 p-4 dark:border-indigo-900/30 dark:bg-gradient-to-br dark:from-indigo-950/20 dark:to-violet-950/10">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Wifi size={15} />
              <span className="text-xs font-bold">Network Simulator</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Jitter: 300–1200ms. AbortSignal actively protects against race conditions.
            </p>
          </div>
        )}
      </div>

      {/* Footer Profile & Theme Switcher */}
      <div className="border-t border-slate-200/80 p-4 dark:border-white/10">
        <div
          className={`flex items-center ${
            isCollapsed ? "flex-col gap-3" : "justify-between"
          }`}
        >
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
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

          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-sm">
                  MT
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#090e1a]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                  Operations Admin
                </p>
                <p className="text-[11px] text-slate-400">Team Workspace</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
