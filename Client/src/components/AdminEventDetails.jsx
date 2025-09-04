import  { useContext, useEffect, useState } from "react";
import { EventContext } from "../App";

import Input from "./Input";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import api from "./Api";


const AdminEventDetails = ({ setActiveComponent }) => {
  const { eventID, token } = useContext(EventContext);
  const [Event, setEvent] = useState({});
  const [warning, SetWarning] = useState(false);
  const [edit, SetEdit] = useState(false);
  const [alert, setAlert] = useState("");

  const { categories, popularity } = useContext(EventContext);

  const [Data, setData] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    totalSeats: "",
    price: "",
    popularity: "",
    categories: [],
    ticketTypes: [],
  });

  useEffect(() => {
    api
      .get(`/admin/Event/${eventID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEvent(res.data.data);
        setData({
          title: res.data.data.title || "",
          description: res.data.data.description || "",
          date: res.data.data.date || "",
          venue: res.data.data.venue || "",
          totalSeats: res.data.data.totalSeats || "",
          price: res.data.data.price || "",
          popularity: res.data.data.popularity || "",
          categories: res.data.data.categories || [],
          ticketTypes: res.data.data.ticketTypes || [],
        });
      })
      .catch((e) => console.log(e));
    console.log(Event);
  }, [eventID]);

  const Delete = (id) => {
    api
      .delete(`/admin/deleteEvent/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => console.log(res))
      .then(() => setActiveComponent("manageEvents"))
      .catch((e) => console.log(e));
  };

  const Update = (id) => {
    api
      .patch(`/admin/updateEvent/${id}`, Data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setEvent(res.data.data);
        SetEdit(false);
        setAlert(null);
      })
      .catch((e) => console.log(e));
  };

  const Isempty = (data) => {
    if (Object.values(data).some((value) => value == null || value == "")) {
      return true;
    }
    return false;
  };

  return (
    <div className="bg-white size-full rounded-3xl md:px-15 px-4 overflow-y-auto h-screen">
      <div className="flex pt-4 pb-4 responsive ">
        <img
          src="BackArrow.svg"
          className="inline-block cursor-pointer   active:opacity-25 "
          onClick={() => setActiveComponent("manageEvents")}
        />
        <h1 className="m-auto inline-block">Event Details</h1>
      </div>

      <div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 md:flex-[3]">
            {edit ? (
              <div className="relative">
                <img src="Pen.svg" className="absolute bottom-3 right-2" />
                <Input
                  htmlFor="title"
                  label="Event Name"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter your event name"
                  className="input w-full"
                  value={Data.title}
                  onChange={(e) => setData({ ...Data, title: e.target.value })}
                  required
                />
              </div>
            ) : (
              <>
                <p>Event Name</p>
                <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative w-full">
                  <img src="Pen.svg" className="absolute right-2" />
                  {Event.title}
                </div>
              </>
            )}
          </div>

          <div className="flex-1">
            {edit ? (
              <Input
                htmlFor="date"
                label="Date"
                id="date"
                name="date"
                type="datetime-local"
                className="input w-full"
                value={Data.date}
                onChange={(e) => setData({ ...Data, date: e.target.value })}
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            ) : (
              <>
                <p>Event Date</p>
                <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative w-full">
                  <img src="Date.svg" className="absolute right-2" />
                  {Event.date?.split("T")[0]}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-2 md:mt-6">
          <div className="flex-1 md:flex-[3]">
            {edit ? (
              <div className="relative">
                <img src="Location.svg" className="absolute bottom-3 right-2" />
                <Input
                  htmlFor="venue"
                  label="Event venue"
                  id="venue"
                  name="venue"
                  placeholder="Enter the event Location"
                  type="text"
                  className="input w-full"
                  value={Data.venue}
                  onChange={(e) => setData({ ...Data, venue: e.target.value })}
                  required
                  minLength={15}
                />
              </div>
            ) : (
              <>
                <p>Event Venue</p>
                <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative w-full">
                  <img src="Location.svg" className="absolute right-2" />
                  {Event.venue}
                </div>
              </>
            )}
          </div>

          {!edit && (
            <div className="flex-1">
              <p>Event Time</p>
              <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative w-full">
                <img src="Time.svg" className="absolute right-2" />
                {Event.date?.split("T")[1].split(".")[0]}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 w-full">
          <div className="flex flex-col">
            {edit ? (
              <div className="info w-full">
                <label htmlFor="des">Description</label>
                <textarea
                  name="des"
                  id="des"
                  className="input w-full"
                  required
                  placeholder="Describe your event"
                  value={Data.description}
                  onChange={(e) =>
                    setData({ ...Data, description: e.target.value })
                  }
                  minLength={16}
                ></textarea>
              </div>
            ) : (
              <>
                <p>Event Description</p>
                <div className="h-30 w-full border rounded-xl pl-5 mt-2 relative break-words">
                  {Event.description}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <p>Regular Ticket Price</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="USD.svg" className="absolute right-2" />
              {Event.price}
            </div>
          </div>

          <div className="flex-1">
            <p>Total Seat Amount</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="Seat.svg" className="absolute right-2" />
              {Event.totalSeats}
            </div>
          </div>

          <div className="flex-1">
            <p>Total Available Seats</p>
            <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
              <img src="WaitingRoom.svg" className="absolute right-2" />
              {Event.availableSeats}
            </div>
          </div>

          <div className="flex-1">
            {edit ? (
              <div className="info flex-1">
                <label htmlFor="popularity">Popularity</label>
                <Select
                  options={popularity}
                  components={makeAnimated()}
                  required
                  value={popularity.find(
                    (opt) => opt.value === Data.popularity
                  )}
                  onChange={(selected) =>
                    setData({ ...Data, popularity: selected.value })
                  }
                  id="popularity"
                  name="popularity"
                />
              </div>
            ) : (
              <>
                <p>Popularity</p>
                <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
                  <img
                    src="Popular.svg"
                    className="absolute right-2 capitalize "
                  />
                  {`${Event.popularity} Popularity`}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-1">
              {edit ? (
                <div className="info flex-1">
                  <label htmlFor="category">Category</label>
                  <Select
                    options={categories}
                    isMulti
                    components={makeAnimated()}
                    required
                    id="category"
                    name="category"
                    value={categories.filter((opt) =>
                      Data.categories.includes(opt.value)
                    )}
                    onChange={(selected) =>
                      setData({
                        ...Data,
                        categories: selected.map((ca) => ca.value),
                      })
                    }
                  />
                </div>
              ) : (
                <>
                  <p>Tags</p>
                  <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
                    <img src="Tags.svg" className="absolute right-2" />
                    {Event.categories?.join(", ")}
                  </div>
                </>
              )}
            </div>

            <div className="flex-1">
              <p>Expected Attendance</p>
              <div className="h-12 border rounded-xl flex pl-5 mt-2 items-center relative">
                <img src="Group.svg" className="absolute right-2" />
                +1000
              </div>
            </div>
          </div>
        </div>

        <div className="lg:mt-10 md:mt-7 mt-2 space-y-4">
          {Event?.ticketTypes?.map((t, i) => (
            <div key={i} className="p-4 rounded-2xl shadow bg-gray-50">
              <h3 className="font-semibold mb-3">{t.type} Ticket</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {edit ? (
                  <>
                    <Input
                      htmlFor={`price-${i}`}
                      label="Ticket Price"
                      id={`price-${i}`}
                      name={`price-${i}`}
                      type="number"
                      className="input"
                      value={Data.ticketTypes[i]?.price}
                      onChange={(e) => {
                        const updateTicket = [...Data.ticketTypes];
                        updateTicket[i].price = e.target.value;
                        setData({ ...Data, ticketTypes: updateTicket });
                      }}
                      required
                      min={0}
                    />

                    <Input
                      htmlFor={`seats-${i}`}
                      label="Seat Amount"
                      id={`seats-${i}`}
                      name={`seats-${i}`}
                      type="number"
                      className="input"
                      value={Data.ticketTypes[i]?.seats}
                      onChange={(e) => {
                        const updateTicket = [...Data.ticketTypes];
                        updateTicket[i].seats = e.target.value;
                        updateTicket[i].availableSeats = e.target.value;
                        setData({ ...Data, ticketTypes: updateTicket });
                      }}
                      required
                      min={0}
                    />

                    <Input
                      htmlFor={`available-${i}`}
                      label="Available Seats"
                      id={`available-${i}`}
                      name={`available-${i}`}
                      type="number"
                      className="input"
                      value={Data.ticketTypes[i]?.availableSeats}
                      onChange={(e) => {
                        const updateTicket = [...Data.ticketTypes];
                        updateTicket[i].availableSeats = e.target.value;
                        setData({ ...Data, ticketTypes: updateTicket });
                      }}
                      required
                      min={0}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label>Price</label>
                      <input className="input" value={t.price} readOnly />
                    </div>
                    <div>
                      <label>Seats</label>
                      <input className="input" value={t.seats} readOnly />
                    </div>
                    <div>
                      <label>Available</label>
                      <input
                        className="input"
                        value={t.availableSeats}
                        readOnly
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex mt-6  mb-5 responsive ">
          <button
            type="submit"
            className="input bg-[#CF730A] text-white w-100  m-auto hover:bg-[#ab773b] transition-colors "
            onClick={() =>
              edit
                ? Isempty(Data)
                  ? setAlert("All fields are required")
                  : Update(eventID)
                : SetEdit(!edit)
            }
          >
            {edit ? "Confirm" : "Edit"}
          </button>

          <button
            type="submit"
            className="input bg-red-500 text-white w-100  m-auto hover:bg-red-600 transition-colors "
            onClick={() => SetWarning(true)}
          >
            Delete
          </button>
        </div>
        {alert ? <p className="error text-center text-lg">{alert}</p> : null}
      </div>

      {warning && (
        <div className="inset-0 bg-black/50  fixed flex items-center justify-center responsive ">
          <div className="bg-[#282828] p-7 rounded-xl">
            <p className="text-center text-white pb-5">
              Are you sure you want to delete this event?
            </p>
            <div className="flex justify-evenly">
              <button
                className="bg-red-500 hover:bg-red-700 text-white p-3 rounded-2xl"
                onClick={() => {
                  Delete(eventID);
                }}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black p-3 rounded-2xl  "
                onClick={() => SetWarning(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventDetails;
