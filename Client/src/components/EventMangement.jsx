import React, { useEffect, useState } from "react";
import api from "./Api";
import EventCard from "./EventCard";
import { data } from "react-router";

function EventMangement({ setActiveComponent }) {
  const [events, setEvents] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get("/showCreatedEvents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => setEvents(data.data.data))
      .catch((e) => console.log(e));
  }, []);

  console.log(events);

  return (
    <>
      <header className="bg-white rounded-t-3xl h-30 gap-3">
        <div className="flex ">
          <div className="ml-5 lg:text-xl md:text-lg text-base flex flex-col flex-1">
            <p className="font-bold mb-6">Event Management Section</p>
            <div className="flex  ">
              <button
                className="text-[#0122F5] border-2 rounded-2xl border-[#0122F5] flex  pl-5 pr-10 py-1.5  md:scale-100  scale-75 text-base cursor pointer active:opacity-40  hover:shadow-md"
                onClick={() => setActiveComponent("CreateEvent")}
              >
                <img src="Plus.svg" className="mr-5 " />
                New Event
              </button>
              <button className="text-[#FA921B] border-2 rounded-2xl border-[#FA921B]  ml-3 flex md:scale-100  scale-75 pl-4 pr-5 py-1.5 text-base cursor pointer  active:opacity-40  hover:shadow-md"
              onClick={() => setActiveComponent("AttendanceInsight")}>
                Attendee Insights
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
  <div className="flex-col space-y-4">
    <p className="text-center font-semibold mb-2">🔵 Up-Coming Events</p>
    {events
      ?.filter((e) => e.status === "UpComing")
      .map((event) => (
        <EventCard key={event._id} data={{ title: event.title, price: event.price, totalSeats: event.totalSeats, availableSeats: event.availableSeats, venue: event.venue, date: event.date.split("T")[0], time: event.date.split("T")[1].split(".")[0], id: event._id, setActiveComponent:setActiveComponent, c:event.categories, path:"EventDetails" }} />
      ))}
  </div>

  <div className="flex-col space-y-4">
    <p className="text-center font-semibold mb-2">🟢 Active Events</p>
    {events
      ?.filter((e) => e.status === "Active")
      .map((event) => (
        <EventCard key={event._id} data={{ title: event.title, price: event.price, totalSeats: event.totalSeats, availableSeats: event.availableSeats, venue: event.venue, date: event.date.split("T")[0], time: event.date.split("T")[1].split(".")[0], id: event._id, setActiveComponent:setActiveComponent, c:event.categories, path:"EventDetails" }} />
      ))}
  </div>

  <div className="flex-col space-y-4">
    <p className="text-center font-semibold mb-2">🔴 Closed Events</p>
    {events
      ?.filter((e) => e.status === "Closed")
      .map((event) => (
        <EventCard key={event._id} data={{ title: event.title, price: event.price, totalSeats: event.totalSeats, availableSeats: event.availableSeats, venue: event.venue, date: event.date.split("T")[0], time: event.date.split("T")[1].split(".")[0], id: event._id, setActiveComponent:setActiveComponent, c:event.categories, path:"EventDetails" }} />
      ))}
  </div>
</main>

    </>
  );
}

export default EventMangement;
