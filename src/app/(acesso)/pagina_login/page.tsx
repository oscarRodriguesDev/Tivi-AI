"use client"; // Se estiver no Next.js App Router

import { useRouter } from "next/navigation";

const Congrat = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Landing page aqui...</h1>
      <button 
        onClick={() => router.push("/login")} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Login
      </button>
    </div>
  );
};

export default Congrat;
