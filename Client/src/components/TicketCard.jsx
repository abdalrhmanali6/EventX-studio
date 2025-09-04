import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import { EventContext } from '../App';

function TicketCard({ ticket }) {
    const navigate=useNavigate()
    const { setTicketID } = useContext(EventContext);
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col md:flex-row gap-4 hover:shadow-lg transition w-full" 
    onClick={()=>{
        setTicketID(ticket._id)
        navigate("/User/TicketDetails")}}>
    
      
      <div className="flex justify-center md:w-1/3">
        <img
          src={ticket.ticketQR}
          alt="QR Code"
          className="w-32 h-32 object-contain"
        />
      </div>

      
      <div className="flex-1 text-gray-700">
        <h2 className="text-lg font-semibold mb-2">
          Seat #{ticket.seatNumber} - {ticket.ticketType}
        </h2>
        <h2 className="text-lg font-semibold mb-2">
          {ticket.event.title}
        </h2>
        <p>
          <span className="font-medium">Price:</span> {ticket.price} EGP
        </p>
        <p>
          <span className="font-medium">Payment Method:</span>{" "}
          {ticket.paymentMethod}
        </p>
        <p>
          <span className="font-medium">Payment Status:</span>{" "}
          <span
            className={`${
              ticket.paymentStatus === "Paid"
                ? "text-green-600"
                : "text-red-500"
            } font-semibold`}
          >
            {ticket.paymentStatus}
          </span>
        </p>
        <p>
          <span className="font-medium">Status:</span> {ticket.status}
        </p>
        <p>
          <span className="font-medium">Checked-in:</span>{" "}
          {ticket.checkedIn ? "Yes ✅" : "No ❌"}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Booked At: {new Date(ticket.bookedAt).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default TicketCard