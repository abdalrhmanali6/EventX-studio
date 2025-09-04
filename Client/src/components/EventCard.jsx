import React, { useContext,useEffect, useState } from 'react'
import { EventContext } from '../App'
const EventCard = ({data}) => {

    
    const {setEventID}=useContext(EventContext)
   

  return (
    <>


    <div key={data.id}  className=" eventsCard ">
              
              <p className="text-center text-black [text-shadow:_0px_1px_2px_rgba(102,102,102,1)] font-bold  ">{data.title}</p>
              <div className="grid grid-cols-3 gap-3 border-b-1 p-4 ">
                <div className="grid grid-cols-2 gap-3">
                  <img src="Cash.svg " className="w-6 h-6" />
                  <p className="text-center text-[#0F5D13] [text-shadow:_0px_1px_2px_rgba(102,102,102,1)] font-bold  ">{data.price}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 ">
                  <img src="Seat1.svg " className="w-6 h-6" />
                  <p className="text-center text-[#EB3223] [text-shadow:_0px_1px_2px_rgba(102,102,102,1)] font-bold  ">{data.totalSeats}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <img src="Ticket.svg " className="w-6 h-6" />
                  <p className="text-center text-[#8B2CF5] [text-shadow:_0px_1px_2px_rgba(102,102,102,1)] font-bold ">{data.availableSeats}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2 pt-2">
                  <p className="text-[#666666] font-bold [text-shadow:_0px_0px_2px_rgba(102,102,102,0.7)]">
                   Venue :<span className="text-black [text-shadow:_0px_0px_2px_rgba(102,102,102,0.4)]">{data.venue}</span> 
                  </p>
                  <p className="text-[#666666] font-bold [text-shadow:_0px_0px_2px_rgba(102,102,102,0.7)]">
                    Date    : <span className="text-black [text-shadow:_0px_0px_2px_rgba(102,102,102,0.4)]">{data.date}</span> 
                  </p>

                  <p className="text-[#666666] font-bold [text-shadow:_0px_0px_2px_rgba(102,102,102,0.7)]">
                    Time    : <span className="text-black [text-shadow:_0px_0px_2px_rgba(102,102,102,0.4)]">{data.time}</span>
                  </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
              className="size-9 absolute bottom-4 right-4 cursor-pointer "
              onClick={()=>{

                data.setActiveComponent(data.path);
                setEventID(data.id) ;
              }
              }
              >
              <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            </div>




    </>
  )
}

export default EventCard