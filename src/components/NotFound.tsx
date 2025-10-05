import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-3xl font-bold mb-4">404</h1>
      <p className="mb-4">Página no encontrada</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Ir al inicio
      </Link>
    </div>
  );
};

export default NotFound;
