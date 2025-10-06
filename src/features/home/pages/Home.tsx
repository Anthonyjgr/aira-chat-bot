import BloomRotating from "@/components/BloomRotating";
import Bot from "../components/Bot";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative flex items-start justify-center w-screen h-screen dark:bg-dark-purple bg-white overflow-hidden">
      <BloomRotating styles="absolute w-full scale-150 -top-[800px] z-3" speed="15s" />
      <img
        src="/lines.png"
        alt="background rounded lines for decoration porpuses"
        className="absolute w-screen h-screen z-2 opacity-15 dark:opacity-30 object-cover"
      />

      <div className="z-20 flex flex-col items-center justify-center mt-30">
        <h1 className="text-dark-purple dark:text-white xl:text-7xl font-bold max-w-5xl text-center">
          Unlock the power of{" "}
          <span className="text-primary text-shadow-lg">
            Aira AI
          </span>{" "}
          The smartest ChatBot
        </h1>
        <span className="mt-10 text-2xl dark:text-gray-300">
          Your personal AI, tailored for every conversation, anytime, anywhere.
        </span>
        <Link to="/login">
          <button className="text-white bg-gradient-to-br from-primary to-secundary p-2 text-xl px-10 rounded-full mt-10 transition-all duration-200 cursor-pointer">
            Start conversation for free
          </button>
        </Link>
      </div>
      <div className="absolute scale-50 top-[200px] w-full z-2">
        <Bot />
      </div>
    </div>
  );
};

export default Home;
