import React, { useEffect, useState, useContext } from "react";
import api from "./Api";
import { EventContext } from "../App";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";


const COLORS = ["#1968AF", "#F29D38", "#197920", "#9b59b6", "#e74c3c"];

function AdminAnalytics({ setActiveComponent }) {
  const { token } = useContext(EventContext);
  const [summary, setSummary] = useState({});
  const [charts, setCharts] = useState({
    ageGroups: [],
    gender: [],
    ticketTypeDistribution: [],
  });

  // Fetch summary (insights)


const exportCSV = () => {
  api
    .get("/admin/analytics/export", {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob", 
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tickets_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((err) => {
      console.error("CSV export failed:", err);
      alert("Export failed. Please try again.");
    });
};



  useEffect(() => {
    api
      .get("/Admin/insights", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSummary(res.data))
      .catch((e) => console.log(e));
  }, [token]);

  // Fetch charts (age, gender, ticket type)
  useEffect(() => {
    api
      .get("/admin/analytics/charts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCharts({
          ageGroups: Object.entries(res.data.ageGroups || {}).map(
            ([key, value]) => ({ name: key, value })
          ),
          gender: Object.entries(res.data.gender || {}).map(([key, value]) => ({
            name: key,
            value,
          })),
          ticketTypeDistribution: res.data.ticketTypeDistribution || [],
        });
      })
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 flex items-center space-x-4 shadow">
          <img src="Dancing.svg" className="w-12 h-12" />
          <div>
            <p className="text-gray-500">EVENTS</p>
            <p className="text-[#1968AF] font-bold text-2xl">
              {summary.totalEvents || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 flex items-center space-x-4 shadow">
          <img src="MovieTicket.svg" className="w-12 h-12" />
          <div>
            <p className="text-gray-500">BOOKINGS</p>
            <p className="text-[#F29D38] font-bold text-2xl">
              {summary.totalTicketsSold || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 flex items-center space-x-4 shadow">
          <img src="Transaction.svg" className="w-12 h-12" />
          <div>
            <p className="text-gray-500">REVENUE</p>
            <p className="text-[#197920] font-bold text-2xl">
              {summary.totalRevenue || 0} EG
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 flex items-center space-x-4 shadow">
          <img src="Transaction.svg" className="w-12 h-12" />
          <div>
            <p className="text-gray-500">ATTENDEES</p>
            <p className="text-purple-500 font-bold text-2xl">
              {summary.totalAttendees || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.ageGroups.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-gray-700 mb-4">Age Groups</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={charts.ageGroups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1968AF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {charts.gender.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-gray-700 mb-4">
              Gender Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={charts.gender}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {charts.gender.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {charts.ticketTypeDistribution.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-gray-700 mb-4">
              Ticket Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={charts.ticketTypeDistribution}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {charts.ticketTypeDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {summary.eventCategories?.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-gray-700 mb-4">Event Categories</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={summary.eventCategories}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {summary.eventCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <a
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow"
          onClick={exportCSV}
        >
          Export CSV
        </a>
      </div>
    </div>
  );
}

export default AdminAnalytics;
