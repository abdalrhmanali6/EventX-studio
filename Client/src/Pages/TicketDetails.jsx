import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../App";
import api from "../components/Api";
import { useNavigate } from "react-router";

function TicketDetails() {
  const { token, Event, ticketID } = useContext(EventContext);
  const [ticket, setTicket] = useState({});
const navigate = useNavigate();
  useEffect(() => {
    api
      .get(`/user/ticket/${ticketID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setTicket(res.data.data))
      .catch((e) => console.log(e));
  }, []);

  return (
    <div>
      <header>
        <p className=" w-0.5 leading-3 font-extrabold ml-6 text-2xl">
          EventX <span className="font-ReenieBeanie font-normal">Studio</span>
        </p>
      </header>
      <main className="m-12  flex md:flex-row  flex-col">
        <div className="flex-2">
          <section className="ticketSections space-y-5 bg-[#FAFAFBFF] ">
            <h1 className="font-semibold sm:text-2xl">Event Details</h1>
            <p className="sm:text-xl text-base font-semibold">
              Event Name : {ticket.event?.title}
            </p>
            <p>Date: {ticket.event?.date?.split("T")[0]}</p>
            <p>Venue: {ticket.event?.venue}</p>
            <p className="">Description: {ticket.event?.description}</p>
          </section>
          <section className="ticketSections bg-[#FFF8F0FF] ">
            <p className="sm:text-2xl text-base font-semibold">
              Ticket & User Information
            </p>
            <div className="flex space-x-2">
              <div>
                <img src="/userPhoto.svg" className="w-10" />
              </div>
              <div>
                <p className="font-md">
                  {ticket.user?.fname} {ticket.user?.lname}
                </p>
                <p className="text-[#565D6DFF]">Ticket Holder</p>
              </div>
            </div>
            <p className="font-medium">
              Seat Number:{" "}
              <span className="text-[#565D6DFF]">{ticket.seatNumber}</span>
            </p>
            <p className="font-medium">
              Ticket Type:{" "}
              <span className="text-[#565D6DFF]">{ticket.ticketType}</span>
            </p> 
            <p className="font-medium">
              Price: <span className="text-[#565D6DFF]">{ticket.price}</span>
            </p>
            <p className="font-medium">
              Payment Method:{" "}
              <span className="text-[#565D6DFF]">{ticket.paymentMethod}</span>
            </p>
            <p className="font-medium">
              Status:{" "}
              <span className="text-[#565D6DFF]">{ticket.paymentStatus}</span>
            </p>
            <p className="font-medium">
              Checked-in Status:{" "}
              <span className="text-[#565D6DFF]">
                {ticket.checkedIn ? "Checked-in" : " Not Checked-in"}
              </span>
            </p>
            
          </section>
        </div>
        <div className="flex-1">
        <section className="ticketSections bg-[#F6F7F8FF] flex  flex-col items-center  space-y-8">
            <h1 className="font-semibold">Your Ticket</h1>
            <img src={ticket.ticketQR} alt="Ticket QR"  />

            <p className=" font-semibold bg-[#FF9800FF] py-3 px-5 rounded-3xl">{ticket.status}</p>
        </section>
        <section className="ticketSections bg-[#F6F7F8FF] flex  flex-col start space-y-9 ">
            <p className="font-medium text-2xl text-[#565D6DFF]">Order Summary</p>
            <p className="font-medium  text-[#565D6DFF]">Selected Ticket: <span className="text-[#565D6DFF]">{ticket.ticketType} - {ticket.price} EG</span></p>
            <p className="font-medium  text-[#565D6DFF]">Total Price: <span className="text-[#565D6DFF]">{ticket.price} EG</span></p>
            <p className="font-medium  text-[#565D6DFF]">Payment Method: <span className="text-[#565D6DFF]">{ticket.paymentMethod}</span>  </p>
            <p className="font-medium  text-[#565D6DFF]">Terms: <span className="text-[#565D6DFF]">Non-refundable, transferable only through EventX.</span> </p>
             <div className="flex justify-center">
                    <button
                    className="bg-gray-300 hover:bg-gray-600   rounded-2xl font-medium py-3 px-10 sm:scale-75 md:scale-100 scale-65"
                    onClick={() => navigate("/User")}
                >
                    Return
                </button>
             </div>
        </section>
        </div>
      </main>
      <footer className="text-center  py-6 text-sm text-gray-500">
        © 2025 EventX Studio. All rights reserved.
      </footer>
    </div>
  );
}

export default TicketDetails;
