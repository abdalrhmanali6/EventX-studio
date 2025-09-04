import React from "react";
import { EventContext } from "../App";
import { useContext } from "react";

function UnderDevelopment({ setActiveComponent }) {
  const { user } = useContext(EventContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 px-4">
      <h1 className="mt-6 text-3xl md:text-4xl font-bold text-center">
        This Page is Under Development 🚧
      </h1>

      <p className="mt-3 text-lg md:text-xl text-gray-600 text-center max-w-xl">
        We’re working hard to bring you this feature soon. Please check back
        later!
      </p>

      <button
        onClick={() => {
          if (user?.role === "User") setActiveComponent("MyTickets");
          else if (user?.role === "Admin") setActiveComponent("Dashboard");
        }}
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
      >
        Go Back
      </button>
    </div>
  );
}

export default UnderDevelopment;
