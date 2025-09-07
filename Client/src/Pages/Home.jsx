import React from "react";
import { Link } from "react-router";
import Header from "../components/Header";
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header>
        <Header/>
      </header>
      <main>
        <section>
                <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Simplify Event Management 🚀
                </h1>
                <p className="max-w-2xl text-lg sm:text-xl mb-6">
                Event organizers often face challenges in managing events, selling
                tickets, tracking attendees, and analyzing engagement. Our platform
                makes it <span className="font-semibold">simple, affordable, and efficient</span> 
                for small to medium-sized organizations.
                </p>
                <div className="flex gap-4">
                <Link to="/register">
                    <button className="px-6 py-3 rounded-2xl bg-white text-blue-600 font-medium shadow hover:bg-gray-100 transition cursor-pointer">
                    Get Started
                    </button>
                </Link>
                <Link to="/login">
                    <button className="px-6 py-3 rounded-2xl border border-white text-white font-medium hover:bg-white hover:text-blue-600 transition cursor-pointer" >
                    Log In
                    </button>
                </Link>
                </div>
            </div>
        </section>
            <section className="flex flex-col items-center py-16 px-6 ">
                
                <h2 className="text-2xl font-bold mb-10">Why choose our platform?</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
                <div className="featuresCard">
                    <h3 className="font-semibold text-lg mb-2">🎟 Ticket Management</h3>
                    <p className="text-gray-600 text-sm">
                    Sell tickets online and track registrations in real-time.
                    </p>
                </div>
                <div className="featuresCard">
                    <h3 className="font-semibold text-lg mb-2">📊 Analytics</h3>
                    <p className="text-gray-600 text-sm">
                    Gain insights into attendees and engagement with easy-to-read dashboards.
                    </p>
                </div>
                <div className="featuresCard">
                    <h3 className="font-semibold text-lg mb-2">🤝 Easy Collaboration</h3>
                    <p className="text-gray-600 text-sm">
                    Organize with your team seamlessly and assign roles effortlessly.
                    </p>
                </div>
                </div>
            </section>
      </main>

      
    
      <footer className="text-center py-6 text-sm text-gray-500">
        © 2025 EventX Studio. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
