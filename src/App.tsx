import React from "react";
import { ToastContainer } from "react-toastify";

interface AppProps {
  children: React.ReactNode;
}

const App = ({ children }: AppProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen w-screen">
      {children}
      <ToastContainer />
    </div>
  );
};

export default App;
