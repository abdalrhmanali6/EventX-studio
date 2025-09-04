import React, { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

function PaymentForm({setCardData}) {
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });



  
  

   
  const handleInputFocus = (e) => {
    setState((prev) => ({ ...prev, focus: e.target.name }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(state.cvc)
    console.log("Payment submitted:", state);
  };


  const handleInputChange = (e) => {
  const { name, value } = e.target;
  let newValue = value;

  if (name === "number") {
    if (/^\d*$/.test(value) && value.length <= 16) {
      newValue = value;
    } else return;
  } else if (name === "cvc") {
    if (/^\d*$/.test(value) && value.length <= 3) {
      newValue = value;
    } else return;
  } else if (name === "expiry") {
    if (/^\d{0,2}\/?\d{0,2}$/.test(value)) {
      newValue = value;
    } else return;
  } else if (name === "name") {
    if (/^[a-zA-Z\s]*$/.test(value)) {
      newValue = value;
    } else return;
  }

  const newState = { ...state, [name]: newValue };
  setState(newState);
  setCardData(newState);
};

  

  return (
    <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-6 mt-10 ">
      <div className="transform scale-90 sm:scale-75 md:scale-90 lg:scale-100">
        <Cards
          number={state.number}
          expiry={state.expiry}
          cvc={state.cvc}
          name={state.name}
          focused={state.focus}
        />
      </div>

      <form className="flex flex-col gap-3 w-64" onSubmit={handleSubmit}>
        <input
          type="tel"
          name="number"
          placeholder="Card Number"
          value={state.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          inputMode="numeric"
          className="input"
          maxLength={16}
          minLength={16}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Card Holder Name"
          value={state.name}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="input"
          required
        />

        <input
          type="text"
          name="expiry"
          placeholder="MM/YY"
          value={state.expiry}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="input"
          maxLength={5}
          required
        />

        <input
          type="number"
          name="cvc"
          placeholder="CVC"
          value={state.cvc}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="input"
          required
          maxLength={3}
        />

       
      </form>
    </div>
  );
}

export default PaymentForm;
