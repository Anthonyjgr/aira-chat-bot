import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { Menu, X } from "lucide-react";
import { useUIStore } from "@/app/store/useUIStore";

const DashboardLayout = () => {
  const { isDrawerOpen, openDrawer, closeDrawer } = useUIStore();

  return (
    <div className="flex min-h-screen bg-gray-200 dark:bg-dark-purple">
      {/* hamburger button */}
      <button
        onClick={() => openDrawer()}
        className="lg:hidden fixed top-4 right-4 z-40 p-2 text-primary"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar fiexed in desktop */}
      <aside className="hidden lg:flex w-full max-w-80 border-r border-gray-400 dark:border-primary/50 fixed inset-y-0 left-0">
        <Sidebar />
      </aside>

      {/* Drawer in móvil */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.aside
            key="mobile-drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed inset-0 z-50 flex flex-col bg-gray-100 dark:bg-dark-purple border-r border-gray-400 dark:border-primary/50 lg:hidden"
          >
            {/* Botón cerrar */}
            <button
              onClick={() => closeDrawer()}
              className="absolute top-4 right-4 z-50 p-2 text-primary"
            >
              <X size={24} />
            </button>
            <Sidebar />
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-80 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
