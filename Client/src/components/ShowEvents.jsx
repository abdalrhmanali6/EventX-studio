import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../App";
import api from "./Api";
import EventCard from "./EventCard";
import Select from "react-select";

const ShowEvents = ({ setActiveComponent }) => {
  const { user, token, categories } = useContext(EventContext);
  const [events, setEvents] = useState([]);
  const [Category, setCategory] = useState(null);
  const [notfound, setNotFound] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    api
      .get("/user/Events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setEvents(res.data.data))
      .catch((e) => console.log(e.message));
  }, [token]);

  useEffect(() => {
    api
      .get(
        `/user/SearchEvent?title=${search || ""}&categories=${
          Category?.value || ""
        }`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setEvents(res.data.data);
        setNotFound(false);
      })
      .catch((e) => {
        if (e.response && e.response.status === 404) {
          setNotFound(true);
          setEvents([]);
        } else {
          console.log(e);
        }
      });
  }, [search, Category, token]);

  return (
    <>
      <header className="bg-[#111111] rounded-xl h-25 m-5 flex  md:flex-row flex-col flex-wrap  justify-between px-4">
        <div className="lg:scale-100 md:scale-90 sm:scale-75 scale-65">
          <p className="text-white font-semibold  leading-4 text-xl">
            Welcome {user.fname} {user.lname}
            <span className="font-normal block text-sm"> {user.username}</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 ">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <img src="Search.svg" className="absolute top-3 left-3 w-5 h-5" />
            <input
              className="bg-white w-full outline-0 rounded-2xl pl-10 pr-4 py-2 text-sm sm:text-base"
              placeholder="Search..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {/* Category Select */}
          <div className="w-full sm:w-40 z-50">
            <Select
              options={categories}
              value={Category}
              onChange={setCategory}
              placeholder="Category..."
              isClearable
            />
          </div>
        </div>
      </header>
      {notfound ? (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-center text-xl font-semibold">
            No events found. Try another search
          </h1>
        </div>
      ) : (
        <main className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <div className="flex-col space-y-4">
            <p className="text-center font-semibold mb-2">
              🔵 Up-Coming Events
            </p>
            {events
              ?.filter((e) => e.status === "UpComing")
              .map((event) => (
                <EventCard
                  key={event._id}
                  data={{
                    title: event.title,
                    price: event.price,
                    totalSeats: event.totalSeats,
                    availableSeats: event.availableSeats,
                    venue: event.venue,
                    date: event.date.split("T")[0],
                    time: event.date.split("T")[1].split(".")[0],
                    id: event._id,
                    setActiveComponent: setActiveComponent,
                    c: event.categories,
                    path: "userEventDetails",
                  }}
                />
              ))}
          </div>

          <div className="flex-col space-y-4">
            <p className="text-center font-semibold mb-2">🟢 Active Events</p>
            {events
              ?.filter((e) => e.status === "Active")
              .map((event) => (
                <EventCard
                  key={event._id}
                  data={{
                    title: event.title,
                    price: event.price,
                    totalSeats: event.totalSeats,
                    availableSeats: event.availableSeats,
                    venue: event.venue,
                    date: event.date.split("T")[0],
                    time: event.date.split("T")[1].split(".")[0],
                    id: event._id,
                    setActiveComponent: setActiveComponent,
                    c: event.categories,
                    path: "userEventDetails",
                  }}
                />
              ))}
          </div>

          <div className="flex-col space-y-4">
            <p className="text-center font-semibold mb-2">🔴 Closed Events</p>
            {events
              ?.filter((e) => e.status === "Closed")
              .map((event) => (
                <EventCard
                  key={event._id}
                  data={{
                    title: event.title,
                    price: event.price,
                    totalSeats: event.totalSeats,
                    availableSeats: event.availableSeats,
                    venue: event.venue,
                    date: event.date.split("T")[0],
                    time: event.date.split("T")[1].split(".")[0],
                    id: event._id,
                    setActiveComponent: setActiveComponent,
                    c: event.categories,
                    path: "userEventDetails",
                  }}
                />
              ))}
          </div>
        </main>
      )}
    </>
  );
};

export default ShowEvents;
