import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { OperationsPage } from "../features/operations/pages/OperationsPage";
import { OperationDetailsPage } from "../features/operations/pages/OperationDetailsPage";
import { LandingPage } from "../features/landing/pages/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "operations",
        element: <OperationsPage />,
      },
      {
        path: "operations/:operationId",
        element: <OperationDetailsPage />,
      },
    ],
  },
]);
