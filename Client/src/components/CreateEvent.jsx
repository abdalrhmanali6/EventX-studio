import React, { useContext, useState } from "react";
import Input from "./Input";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import api from "./Api";
import { EventContext } from "../App";

function CreateEvent({ setActiveComponent }) {
  const [Categories, setCatgories] = useState([]);
  const [error, seterror] = useState("");
  const [Creating, setCreating] = useState("");
  const [ticketWarning,setTicketWarning]=useState("")
  const [ticket, setTicket] = useState([]);
  const { categories, popularity, status } = useContext(EventContext);

  
  //عايزين نعدل ان مينفعش يتكرر نفس تايب التيكت


  const ticketTypes = [
    { value: "VIP", label: "VIP" },
    { value: "Regular", label: "Regular" },
    { value: "Student", label: "Student" },
  ];
  console.log(ticket)

  const CreateEvent = (event) => {
    event.preventDefault();
    console.log(event);

    if(ticket.length==0){
      return setTicketWarning("You should add at least one ticket")
    }



    const data = {
      title: event.target.elements.title.value,
      description: event.target.elements.des.value,
      date: event.target.elements.date.value,
      venue: event.target.elements.venue.value,
      status: event.target.elements.Status.value,
      popularity: event.target.elements.popularity.value,
      categories: Categories,
      ticketTypes:ticket
    };

     

    console.log(data);

    const token = localStorage.getItem("token");

   
    api
      .post("/addEvent", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        console.log(data);
        setCreating("Creating the event");
        setTimeout(() => {
          setActiveComponent("manageEvents");
        }, 3000);
      })
      .catch((e) => {
        console.error(e);
        seterror(e.data.message);
      });
  };

  const createTickets = () => {
    setTicket([
      ...ticket,
      {
        type: "",
        price: 0,
        seats: 0,
      },
    ]);
  };

  const updateTickets = (i, prop, value) => {
    const newTicket = [...ticket];
    newTicket[i][prop] = value;
    setTicket(newTicket);
  };

  const removeTicket = (index) => {
    setTicket(ticket.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white size-full rounded-3xl px-4">
      <div className="flex pt-4 pb-4 ">
        <img
          src="BackArrow.svg"
          className="inline-block cursor-pointer   active:opacity-25 "
          onClick={() => setActiveComponent("manageEvents")}
        />
        <h1 className="m-auto inline-block">Create Event</h1>
      </div>

      <form
        className="bg-white flex flex-col space-y-7  "
        onSubmit={CreateEvent}
      >
        <div className="grid grid-cols-2  gap-7 ">
          <div className="relative">
            <img src="Pen.svg" className="absolute bottom-3 right-2" />
            <Input
              htmlFor="title"
              label="Event Name"
              id="title"
              name="title"
              type="text"
              placeholder="Enter your event name"
              className="input"
              required
            />
          </div>

          <Input
            htmlFor="date"
            label="Date"
            id="date"
            name="date"
            type="datetime-local"
            className="input"
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div className="info flex-1">
          <label htmlFor="des">Description</label>
          <textarea
            name="des"
            id="des"
            className="input"
            required
            placeholder="Describe your event"
            minLength={16}
          ></textarea>
        </div>

        <div className="info flex-1">
          <div className="relative">
            <img src="Location.svg" className="absolute bottom-3 right-2 " />
            <Input
              htmlFor="venue"
              label="Event venue"
              id="venue"
              name="venue"
              placeholder="Enter the event Location"
              type="text"
              className="input"
              required
              minLength={15}
            />
          </div>
        </div>

        <div className="grid grid-cols-3  gap-6">
          <div className="info flex-1">
            <label htmlFor="Status">Status</label>
            <Select
              options={status}
              components={makeAnimated()}
              required
              id="Status"
              name="Status"
            />
          </div>

          <div className="info flex-1">
            <label htmlFor="popularity">Popularity</label>
            <Select
              options={popularity}
              components={makeAnimated()}
              required
              id="popularity"
              name="popularity"
            />
          </div>

          <div className="info flex-1">
            <label htmlFor="category">Category</label>
            <Select
              options={categories}
              isMulti
              components={makeAnimated()}
              required
              id="category"
              name="category"
              onChange={(selected) =>
                setCatgories(selected.map((ca) => ca.value))
              }
            />
          </div>
        </div>

        {ticket.map((ticket, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_1fr_3rem] gap-6 flex-1"
          >
            <div className="info flex-1">
              <label htmlFor="ticketType">Ticket Type</label>
              <Select
                id="ticketType"
                options={ticketTypes}
                components={makeAnimated()}
                onChange={(option) =>
                  updateTickets(i, "type", option.value)
                }
                className="py-2"
              />
            </div>

            <div className="info flex-1 relative">
              <img src="Seat.svg" className="absolute bottom-3 right-2 " />
              <Input
                htmlFor="seat"
                label="Seats Amount"
                id="seat"
                name="seat"
                type="number"
                placeholder="Seats"
                min={10}
                value={ticket.seats}
                onChange={(e) => updateTickets(i, "seats", e.target.value)}
                className="input"
              />
            </div>

            <div className="relative  info flex-1">
              <img src="USD.svg" className="absolute bottom-3 right-2 " />
              <Input
                htmlFor="price"
                label="Ticket price"
                id="price"
                nmae="price"
                min={0}
                type="number"
                placeholder="Price"
                value={ticket.price}
                onChange={(e) => updateTickets(i, "price", e.target.value)}
                className="input"
              />
            </div>
            <div className=" relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                className="size-6 cursor-pointer absolute bottom-4 active:opacity-35"
                onClick={()=>(removeTicket(i))}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
        ))}

        
        <button
          type="button"
          onClick={createTickets}
          className="input bg-amber-400 w-100 mx-auto hover:bg-amber-300 transition-colors"
        >
          Add Ticket
        </button>
        {ticketWarning? <p className="error m-auto">{ticketWarning}</p> : null}
        <button
          type="submit"
          className="input bg-[#1A6291] text-white w-100  m-auto hover:bg-blue-400 transition-colors active:opacity-35"
        >
          Create
        </button>
        {Creating ? (
          <p className="flex items-center text-green-500 text-[1.1rem] m-auto">
            <svg
              className="mr-3 h-5 w-5 animate-spin text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            {Creating}
          </p>
        ) : null}
        {error ? <p className="error m-auto">{error}</p> : null}
      </form>
    </div>
  );
}

export default CreateEvent;
