import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";


const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen ">
      {/* Sidebar fijo */}
      <aside className="max-w-80 border-r border-gray-200 fixed inset-y-0 left-0">
        <Sidebar />
      </aside>

      {/* Contenedor principal */}
      <main className="flex-1 ml-80 p-6 overflow-y-auto">
        {/* 
          Si usas children, se renderiza directamente. 
          Si usas rutas anidadas (como lo tienes en router.tsx), 
          usamos <Outlet /> para mostrar el contenido de la ruta activa.
        */}
        {<Outlet />}
      </main>
    </div>
  );
};

export default DashboardLayout;
