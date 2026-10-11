import type {
  Operation,
  OperationStatus,
  OperationPriority,
} from "../types/operation.types";

const statuses: OperationStatus[] = [
  "Pending",
  "Running",
  "Completed",
  "Failed",
];

const priorities: OperationPriority[] = ["Low", "Medium", "High", "Urgent"];

const requestTitles = [
  "Payment Processing Gateway",
  "Data Synchronization Service",
  "Executive Report Generation",
  "Bulk User Data Import",
  "Realtime Inventory Reconcile",
  "Transactional Email Delivery",
  "Snapshot Database Backup",
  "Billing & Invoice Calculation",
  "KYC Account Verification",
  "Telemetry & Analytics Aggregation",
  "Webhook Event Dispatcher",
  "Security Audit Log Export",
];

const owners = [
  "Sarah Chen",
  "James Wilson",
  "Emily Davis",
  "Michael Brown",
  "Olivia Martin",
  "Daniel Taylor",
  "Sophia Anderson",
  "William Thomas",
];

const descriptions = [
  "High priority pipeline task dispatched across cluster nodes.",
  "Scheduled batch synchronization requiring periodic polling.",
  "Critical workflow for customer ledger and analytics sync.",
  "Asynchronous data processing task with automatic retry guard.",
  "Background indexing service running under distributed lock.",
];

const TOTAL_OPERATIONS = 5000;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function createOperation(index: number, now: number): Operation {
  const createdTimestamp = now - Math.floor(Math.random() * 30 * DAY_IN_MS);
  const updatedTimestamp =
    createdTimestamp + Math.random() * (now - createdTimestamp);

  const title = `${randomItem(requestTitles)} #${index + 1}`;

  return {
    id: `REQ-${String(index + 1).padStart(5, "0")}`,
    title,
    name: title,
    owner: randomItem(owners),
    status: randomItem(statuses),
    priority: randomItem(priorities),
    description: randomItem(descriptions),
    createdAt: new Date(createdTimestamp).toISOString(),
    updatedAt: new Date(updatedTimestamp).toISOString(),
  };
}

export const mockOperations: Operation[] = (() => {
  const now = Date.now();
  return Array.from({ length: TOTAL_OPERATIONS }, (_, index) =>
    createOperation(index, now),
  );
})();
