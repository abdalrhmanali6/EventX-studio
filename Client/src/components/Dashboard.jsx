import React, { useContext, useState } from "react";
import { EventContext } from "../App";
import { useEffect } from "react";
import api from "./Api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
 } from "recharts";

const COLORS = ["#1968AF", "#F29D38", "#197920", "#9b59b6", "#e74c3c"];

function Dashboard({setActiveComponent}) {
  const { user, token } = useContext(EventContext);
  const [insights, setInsights] = useState({});

  useEffect(() => {
    api
      .get("/Admin/insights", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setInsights(res.data);
      })
      .catch((e) => console.log(e));
  }, {});

  return (
    <div>
      <header className="bg-[#111111] rounded-xl h-25 m-5 flex    justify-center px-4">
        <div className=" lg:scale-100 md:scale-90 sm:scale-75 scale-65">
          <p className="text-white font-semibold   leading-4 text-xl text-center">
            Welcome {user.fname} {user.lname}
            <span className="font-normal block text-sm">
              {" "}
              Events Administrator
            </span>
          </p>
        </div>
      </header>
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 flex items-center space-x-4 shadow">
            <img src="Dancing.svg" className="w-12 h-12" />
            <div>
              <p className="text-gray-500">EVENTS</p>
              <p className="text-[#1968AF] font-bold text-2xl">
                {insights?.totalEvents}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex items-center space-x-4 shadow">
            <img src="MovieTicket.svg" className="w-12 h-12" />
            <div>
              <p className="text-gray-500">BOOKINGS</p>
              <p className="text-[#F29D38] font-bold text-2xl">
                {insights?.totalTicketsSold}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex items-center space-x-4 shadow">
            <img src="Transaction.svg" className="w-12 h-12" />
            <div>
              <p className="text-gray-500">REVENUE</p>
              <p className="text-[#197920] font-bold text-2xl">
                {insights?.totalRevenue} EG
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Upcoming Events + Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-gray-700 mb-4">UPCOMING EVENTS</h3>
            <div className="space-y-3">
              {insights.upcomingEvents?.slice(0, 5).map((event) => (
                <div key={event._id} className="shadow p-4 rounded-xl">
                  <p className="font-medium">Event: {event.title}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-gray-700 mb-4">
              ATTENDANCE INSIGHTS
            </h3>
            <p className="mb-2">Attendance Rate:</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${insights?.attendanceRate || 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {insights?.attendanceRate || 0}% of attendees checked in
            </p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-gray-700 mb-4">RECENT BOOKINGS</h3>
            <ul className="space-y-3">
              {insights.recentBookingsEvents?.map((b) => (
                <li key={b._id} className="p-3 bg-gray-100 rounded-lg">
                  <p className="font-medium">
                    {b.userName} booked {b.ticketType}
                  </p>
                  <p className="text-sm text-gray-500">Event: {b.eventTitle}</p>
                  <p className="text-xs text-gray-400">
                    Date: {new Date(b.bookedAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-gray-700 mb-4">REVENUE TREND</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={insights.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" tickFormatter={(m) => `M${m}`} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#1968AF"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
        </div>

        
        

          
        </div>

        
        <button className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        onClick={()=>{setActiveComponent("CreateEvent")}}
        >
          + Create Event
        </button>
      </main>
    </div>
  );
}

export default Dashboard;
