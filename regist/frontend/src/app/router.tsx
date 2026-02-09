// frontend/src/app/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { SignupPage } from "../pages/SignupPage";
import { MemberEditPage } from "../pages/MemberEditPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/signup" replace /> },
      { path: "signup", element: <SignupPage /> },
      { path: "member/:id/edit", element: <MemberEditPage /> }
    ]
  }
]);
