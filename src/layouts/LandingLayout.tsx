import { Outlet } from "react-router-dom";

const LandingLayout = () => {
  console.log("first")
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full h-full">
        <Outlet />
      </div>
    </main>
  );
};

export default LandingLayout;
