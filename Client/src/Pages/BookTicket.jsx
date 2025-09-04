import React, { useContext, useState,useEffect } from "react";
import { EventContext } from "../App";
import PaymentForm from "../components/PaymentCArd";
import PaymentWallet from "../components/PaymentWallet";
import { useNavigate } from "react-router-dom";
import api from "../components/Api";
function BookTicket() {
  const { eventID, token, Event, setTicketID } = useContext(EventContext);
  const [EventTicket, setEventTicket] = useState("");
  const [method, setMethod] = useState("Cash");
  const [cardData, setCardData] = useState(null);
  const [warning, setWarning] = useState("");
  const [success, setSuccess] = useState(false);
  const [walletData, setWalletData] = useState(null);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateCardData = () => {
    return Object.values(cardData).every((data) => data.trim() !== "");
  };

  const createTicket = () => {
    if (method == "Wallet" && walletData == null) {
      return setWarning(
        "plz choose your Wallet and enter your phone number to complete payment "
      );
    }

    if (method == "Card" && !validateCardData()) {
      return setWarning("Please fill in all card fields to continue.");
    }

    if (!EventTicket) {
      return setWarning("Please select a ticket type.");
    }

    setWarning("");

    api
      .post(
        `/user/bookTicket/${eventID}`,
        {
          type: EventTicket?.split("-")[0].trim(),
          paymentMethod: method,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setTicketID(res.data?.data?._id);
        setSuccess(true);
        setError("");
      })
      .catch((e) => {
        setError(e.response.data.message);
        console.log(e);
      });
};

 useEffect(() => {
      if (success) {
        const timer = setTimeout(() => {
          navigate("/User/TicketDetails");
        }, 2000);

        return () => clearTimeout(timer); 
      }
    }, [success, navigate]);

  return (
    <div>
      <header>
        <p className=" w-0.5 leading-3 font-extrabold ml-6 text-2xl">
          EventX <span className="font-ReenieBeanie font-normal">Studio</span>
        </p>
      </header>
      <main className="m-7 ">
        <section className="ticketSections space-y-7">
          <h1 className="sm:text-2xl text-base">Event Name : {Event.title}</h1>
          <p>Date: {Event.date?.split("T")[0]}</p>
          <p>Venue: {Event.venue}</p>
          <p className="">Description: {Event.description}</p>
        </section>
        <div className="flex md:flex-row flex-col">
          <section className="ticketSections bg-white flex-2">
            <label
              htmlFor="type"
              className="sm:text-2xl text-base font-semibold"
            >
              Select Ticket Type
            </label>
            <select
              id="type"
              className=" input py-0.5"
              onChange={(e) => {
                setEventTicket(e.target.value);
              }}
            >
              <option disabled selected>
                Ticket Type
              </option>
              {Event.ticketTypes?.map((t, i) => (
                <option key={i} value={`${t.type} - ${t.price}`}>
                  {t.type} - {t.price} EG
                </option>
              ))}
            </select>
            {warning ? <p className="error m-auto">{warning}</p> : null}
            <label
              htmlFor="method"
              className="sm:text-2xl text-base font-semibold"
            >
              Select Payment Method
            </label>
            <select
              id="method"
              className="input py-0.5"
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Wallet">Wallet</option>
              <option value="Card">Card</option>
            </select>

            {method == "Card" ? (
              <>
                <PaymentForm setCardData={setCardData} />
                {warning ? <p className="error m-auto">{warning}</p> : null}
              </>
            ) : method == "Wallet" ? (
              <>
                <PaymentWallet setWalletData={setWalletData} />
                {warning ? <p className="error m-auto">{warning}</p> : null}
              </>
            ) : null}
          </section>
          <section className="ticketSections flex-1">
            <p className="sm:text-2xl text-base font-semibold">
              Review Your Order
            </p>
            <p>Selected Ticket: {EventTicket} EG</p>
            <p>Total Price: {EventTicket.split("-")[1]} EG</p>
            <p>Payment Method: {method} </p>
            <p>Terms: Non-refundable, transferable only through EventX.</p>
            <div className="flex justify-center space-x-5 mt-auto mb-5">
              <button
                className="bg-amber-500 hover:bg-amber-600 text-white  rounded-2xl font-medium py-3 px-10 sm:scale-75 md:scale-100 scale-50"
                onClick={createTicket}
              >
                Confirm
              </button>

              <button
                className="bg-gray-300 hover:bg-gray-600   rounded-2xl font-medium py-3 px-10 sm:scale-75 md:scale-100 scale-65"
                onClick={() => navigate("/User")}
              >
                Cancel
              </button>
            </div>
            <div className="flex justify-center">
              {error ? <p className="error m-auto">{error}</p> : null}
              {success ? (
                <p className="font-semibold text-xl text-[#565D6DFF] text-center mb-10">
                  Ticket Created Successfully
                </p>
              ) : null}
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

export default BookTicket;
