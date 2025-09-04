import React, { useState } from "react";

function PaymentWallet({ setWalletData }) {
  const [wallet, setWallet] = useState("vodafone");
  const [warning,setWarning]=useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "number") {
      if (!(/^\d*$/.test(value) && value.length == 11)) {
        setWarning(true)
      }else{
        setWarning(false)
        setWalletData(value)
      }
    }
  };
  return (
    <>
      <div className="flex  flex-col space-y-5 mt-5">
        <div className="flex flex-col space-y-3">
          <p className="sm:text-2xl text-base font-semibold">Select a Wallet</p>
          <div className="flex space-x-4">
            <img
              src="/vodafone.svg"
              alt="vodafone"
              className={`walletIcons ${wallet == "vodafone" && "shadow-2xl"} `}
              onClick={() => setWallet("vodafone")}
            />
            <img
              src="/Orange.svg"
              alt="Orange"
              className={`walletIcons ${wallet == "Orange" && "shadow-2xl"} `}
              onClick={() => setWallet("Orange")}
            />
            <img
              src="/etisalat.svg"
              alt="etisalat"
              className={`walletIcons ${wallet == "etisalat" && "shadow-2xl"} `}
              onClick={() => setWallet("etisalat")}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <label
            htmlFor="number"
            className="sm:text-2xl text-base font-semibold"
          >
            Phone number
          </label>
          <input
            type="tel"
            className="input lg:w-200 "
            name="number"
            id="number"
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            required
          />
          {warning ? <p className="error m-auto">this number not vaild</p> : <p></p>}
        </div>
      </div>
    </>
  );
}

export default PaymentWallet;
