import { useState } from "react";
import Spline from "@splinetool/react-spline";

const Bot = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="relative w-full h-screen overflow-hidden z-10">
      {/* 🧩 Imagen de fallback */}
      {isLoading && (
        <div className="flex items-center justify-center z-10 w-screen h-screen">
          <img
            src="/bot.webp" // 🔹 coloca aquí tu imagen local o remota
            alt="Loading bot scene..."
            className="w-screen h-screen object-contain animate-pulse"
          />
        </div>
      )}

      <Spline
        scene="https://prod.spline.design/1BgwkNcI1-zJFb5X/scene.splinecode"
        onLoad={() => setIsLoading(false)} // ✅ cuando termina de cargar, ocultamos el fallback
      />

      <div className="bg-white dark:bg-dark-purple w-[200px] h-[100px] absolute right-0 bottom-0"></div>
    </main>
  );
};

export default Bot;
