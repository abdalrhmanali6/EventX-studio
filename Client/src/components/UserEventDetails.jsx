import React, { useContext, useEffect, useState } from "react";
import api from "./Api";
import { EventContext } from "../App";
import { useNavigate } from "react-router-dom";

function UserEventDetails({ setActiveComponent }) {
  const { eventID, token, Event, setEvent } = useContext(EventContext);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/user/Event/${eventID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEvent(res.data.data);
      })
      .catch((e) => console.log(e));
  }, [eventID]);

  return (
    <div className="bg-white w-full rounded-3xl px-4 md:px-10 overflow-y-auto min-h-screen py-5">
      
      <div className="flex items-center pb-4 border-b">
        <img
          src="BackArrow.svg"
          className="sm:w-10   cursor-pointer active:opacity-25"
          onClick={() => setActiveComponent("showEvents")}
        />
        <h1 className="m-auto text-lg md:text-xl font-semibold">Event Details</h1>
      </div>

      <div className="space-y-6 mt-6">
        
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <p>Event Name</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="Pen.svg" className="absolute right-2 w-5 h-5" />
              {Event?.title}
            </div>
          </div>
          <div className="flex-1">
            <p>Event Date</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="Date.svg" className="absolute right-2 w-5 h-5" />
              {Event?.date?.split("T")[0]}
            </div>
          </div>
        </div>

        
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <p>Event Venue</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="Location.svg" className="absolute right-2 w-5 h-5" />
              {Event?.venue}
            </div>
          </div>
          <div className="flex-1">
            <p>Event Time</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="Time.svg" className="absolute right-2 w-5 h-5" />
              {Event?.date?.split("T")[1]?.split(".")[0]}
            </div>
          </div>
        </div>

        
        <div>
          <p>Event Description</p>
          <div className="min-h-20 border rounded-xl pl-5 mt-2 py-2">
            {Event?.description}
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <p>Regular Ticket Price</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="USD.svg" className="absolute right-2 w-5 h-5" />
              {Event?.price}
            </div>
          </div>
          <div>
            <p>Total Seat Amount</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="Seat.svg" className="absolute right-2 w-5 h-5" />
              {Event?.totalSeats}
            </div>
          </div>
          <div>
            <p>Total Available Seats</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="WaitingRoom.svg" className="absolute right-2 w-5 h-5" />
              {Event?.availableSeats}
            </div>
          </div>
          <div>
            <p>Popularity</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="Popular.svg" className="absolute right-2 w-5 h-5" />
              {`${Event?.popularity} Popularity`}
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <p>Tags</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative overflow-x-auto">
              <img src="Tags.svg" className="absolute right-2 w-5 h-5" />
              {Event?.categories?.join(", ")}
            </div>
          </div>
          <div>
            <p>Expected Attendance</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="Group.svg" className="absolute right-2 w-5 h-5" />
              +1000
            </div>
          </div>
          <div>
            <p>Created By</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="user.svg" className="absolute right-2 w-5 h-5" />
              {Event?.createdBy?.username}
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          {Event?.ticketTypes?.map((t, i) => (
            <div key={i} className="p-4 rounded-2xl shadow bg-gray-50">
              <h3 className="font-semibold mb-3">{t.type} Ticket</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label>Price</label>
                  <input className="input w-full" value={t.price} readOnly />
                </div>
                <div>
                  <label>Seats</label>
                  <input className="input w-full" value={t.seats} readOnly />
                </div>
                <div>
                  <label>Available</label>
                  <input className="input w-full" value={t.availableSeats} readOnly />
                </div>
              </div>
            </div>
          ))}
        </div>

        
        <div className="flex justify-center my-5">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold w-full sm:w-auto"
            onClick={() => navigate("/User/BookTicket")}
          >
            Book Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserEventDetails;
