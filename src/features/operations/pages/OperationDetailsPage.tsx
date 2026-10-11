import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  Save,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

import { useOperation, useUpdateOperation } from "../hooks/useOperations";
import type {
  OperationStatus,
  OperationPriority,
  UpdateOperationPayload,
} from "../types/operation.types";

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
    dateStyle: "full",
    timeStyle: "medium",
  }).format(date);
}

export function OperationDetailsPage() {
  const { operationId = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const operationQuery = useOperation(operationId);
  const updateMutation = useUpdateOperation();

  const operation = operationQuery.data;

  // Editable Form States
  const [formTitle, setFormTitle] = useState("");
  const [formOwner, setFormOwner] = useState("");
  const [formStatus, setFormStatus] = useState<OperationStatus>("Pending");
  const [formPriority, setFormPriority] = useState<OperationPriority>("Medium");
  const [formDescription, setFormDescription] = useState("");

  const [successToast, setSuccessToast] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );

  // Sync form state when data loads or updates
  useEffect(() => {
    if (operation) {
      setFormTitle(operation.title || operation.name || "");
      setFormOwner(operation.owner || "");
      setFormStatus(operation.status);
      setFormPriority(operation.priority || "Medium");
      setFormDescription(operation.description || "");
    }
  }, [operation]);

  // Check if user has made unsaved modifications
  const isDirty = Boolean(
    operation &&
    (formTitle !== (operation.title || operation.name) ||
      formOwner !== operation.owner ||
      formStatus !== operation.status ||
      formPriority !== (operation.priority || "Medium") ||
      formDescription !== (operation.description || "")),
  );

  // Warn user on browser tab close or refresh if form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function getReturnUrl() {
    const previous = location.state?.from;
    if (typeof previous === "string" && previous.startsWith("/operations")) {
      return previous;
    }
    return "/operations";
  }

  function handleAttemptBack() {
    if (isDirty) {
      setShowDiscardModal(true);
      setPendingNavigation(getReturnUrl());
    } else {
      navigate(getReturnUrl());
    }
  }

  function confirmDiscard() {
    setShowDiscardModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    } else {
      navigate(getReturnUrl());
    }
  }

  function resetForm() {
    if (operation) {
      setFormTitle(operation.title || operation.name || "");
      setFormOwner(operation.owner || "");
      setFormStatus(operation.status);
      setFormPriority(operation.priority || "Medium");
      setFormDescription(operation.description || "");
    }
  }

  async function handleSave() {
    if (!operation) return;

    const payload: UpdateOperationPayload = {
      id: operation.id,
      title: formTitle.trim() || operation.title,
      name: formTitle.trim() || operation.name,
      owner: formOwner.trim() || operation.owner,
      status: formStatus,
      priority: formPriority,
      description: formDescription.trim(),
    };

    try {
      await updateMutation.mutateAsync(payload);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch {
      // Error handled by mutation state
    }
  }

  if (operationQuery.isPending) {
    return (
      <div
        className="flex min-h-96 flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400"
        role="status"
        aria-live="polite"
      >
        <LoaderCircle
          size={34}
          className="animate-spin text-indigo-600 dark:text-indigo-400"
        />
        <p className="text-sm font-semibold">Loading request details...</p>
      </div>
    );
  }

  if (operationQuery.isError || !operation) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-slate-200/80 bg-white/95 p-8 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90">
        <AlertCircle size={42} className="mx-auto text-rose-500" />
        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Request Not Found
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {operationQuery.error instanceof Error
            ? operationQuery.error.message
            : "The requested record could not be found."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => void operationQuery.refetch()}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={() => navigate("/operations")}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
          >
            Back to requests
          </button>
        </div>
      </section>
    );
  }

  const currentStatusConfig = statusStyles[operation.status];

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Back button with dirty status badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleAttemptBack}
          className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-white hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span>Back to requests list (Preserves filters)</span>
        </button>

        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 ring-1 ring-amber-500/20">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes
            </span>
          )}

          <span className="font-mono text-xs text-slate-400">
            ID: {operation.id}
          </span>
        </div>
      </div>

      {/* Main Edit Card */}
      <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start border-b border-slate-100 pb-6 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {operation.id}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${currentStatusConfig.pill}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${currentStatusConfig.dot}`}
                />
                {operation.status}
              </span>

              <span
                className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                  priorityStyles[operation.priority]
                }`}
              >
                {operation.priority} Priority
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Edit Request & Metadata
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Update any request field. Unsaved changes are guarded against
              accidental dismissal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void operationQuery.refetch()}
              disabled={operationQuery.isFetching}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw
                size={14}
                className={
                  operationQuery.isFetching
                    ? "animate-spin text-indigo-600"
                    : ""
                }
              />
              <span>Reload</span>
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="mt-6 space-y-5">
          {/* Title Field */}
          <div>
            <label
              htmlFor="edit-title"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400"
            >
              Request Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Enter request title..."
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-800"
            />
          </div>

          {/* Owner & Priority & Status Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Owner */}
            <div>
              <label
                htmlFor="edit-owner"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Owner
              </label>
              <input
                id="edit-owner"
                type="text"
                value={formOwner}
                onChange={(e) => setFormOwner(e.target.value)}
                placeholder="Assignee name..."
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-800"
              />
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="edit-priority"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Priority
              </label>
              <select
                id="edit-priority"
                value={formPriority}
                onChange={(e) =>
                  setFormPriority(e.target.value as OperationPriority)
                }
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-500 dark:border-white/10 dark:bg-[#111827] dark:text-slate-100 dark:focus:border-indigo-400"
              >
                {priorities.map((p) => (
                  <option
                    key={p}
                    value={p}
                    className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100"
                  >
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="edit-status"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Status
              </label>
              <select
                id="edit-status"
                value={formStatus}
                onChange={(e) =>
                  setFormStatus(e.target.value as OperationStatus)
                }
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-500 dark:border-white/10 dark:bg-[#111827] dark:text-slate-100 dark:focus:border-indigo-400"
              >
                {statuses.map((s) => (
                  <option
                    key={s}
                    value={s}
                    className="bg-white text-slate-800 dark:bg-[#111827] dark:text-slate-100"
                  >
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="edit-desc"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400"
            >
              Description & Notes
            </label>
            <textarea
              id="edit-desc"
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Detailed notes regarding this operation..."
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-800"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-5 dark:border-white/10">
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                disabled={!isDirty || updateMutation.isPending}
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {updateMutation.isPending ? (
                  <>
                    <LoaderCircle size={15} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>

              {isDirty && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <RotateCcw size={14} />
                  <span>Reset Form</span>
                </button>
              )}
            </div>

            {successToast && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                <CheckCircle2 size={16} /> Changes saved successfully!
              </span>
            )}

            {updateMutation.isError && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                <AlertCircle size={16} /> Save failed:{" "}
                {updateMutation.error instanceof Error
                  ? updateMutation.error.message
                  : "Server error"}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Metadata Readout Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                Created Timestamp
              </p>
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                {formatDate(operation.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Clock3 size={18} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                Last Updated Timestamp
              </p>
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                {formatDate(operation.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unsaved Changes Warning Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDiscardModal(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0f172a] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle size={24} />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                You have unsaved changes
              </h3>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              You edited this request but haven't saved your modifications. If
              you leave now, your changes will be discarded.
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDiscardModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Keep Editing
              </button>

              <button
                type="button"
                onClick={confirmDiscard}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700"
              >
                Discard & Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
