import React from "react";
import { Outlet } from "react-router-dom";

const LandingLayout = () => {
  console.log("first")
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-4">
        <Outlet />
      </div>
    </main>
  );
};

export default LandingLayout;
