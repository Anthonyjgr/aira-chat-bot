import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen ">
      {/* Sidebar fijo */}
      <aside className="w-full max-w-80 border-r border-gray-200 fixed inset-y-0 left-0">
        <Sidebar />
      </aside>

      {/* Contenedor principal */}
      <main className="flex-1 ml-80 p-6 overflow-y-auto">{<Outlet />}</main>
    </div>
  );
};

export default DashboardLayout;
