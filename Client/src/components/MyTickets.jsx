import React, { useContext, useEffect, useState } from 'react'
import { EventContext } from '../App';
import api from './Api';
import TicketCard from './TicketCard';
function MyTickets({setActiveComponent} ) {

    const { user, token, categories } = useContext(EventContext);
    const [tickets,setTickets]=useState([])

    useEffect(()=>{
        api
      .get(`/user/Tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setTickets(res.data.data))
      .catch((e) => console.log(e));
    }
    ,[token])

  return (
    <>
    <header className="bg-[#111111] rounded-xl h-25 m-5 gap-3 flex sm:justify-between px-4 flex-wrap sm:flex-row  flex-col items-center justify-center">
        <div>
          <p className="text-white font-semibold md:text-lg sm:text-base sm:text-start text-sm w-90 leading-4  text-center  ">
            Welcome {user.fname} {user.lname}
            <span className="font-normal block text-sm"> {user.username}</span>
          </p>
        </div>
        <h1 className="text-white mr-20 sm:text-base md:text-lg lg:text-xl text-sm text-center ">My Tickets</h1>
      </header>

        <main className='p-5 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))
        ) : (
          <p className="text-gray-500">No tickets found.</p>
        )}
        </main>
    </>
  )
}

export default MyTickets