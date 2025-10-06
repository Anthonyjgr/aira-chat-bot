// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import LandingLayout from "@/layouts/LandingLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import DashboardEmpty from "@/features/conversations/pages/DashboardEmpty";
import Chat from "@/features/chat/pages/Chat";
import Profile from "@/features/profile/pages/ Profile";
import NotFound from "@/components/NotFound";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import Home from "@/features/home/pages/Home";

export const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardEmpty /> }, // Estado vacío inicial
          { path: "chat/:conversationId", element: <Chat /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
