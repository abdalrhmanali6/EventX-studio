import React, { useState } from "react";
import api from "../components/Api";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Input from "../components/Input";
const Register = () => {
  const navigate = useNavigate();

  const [passError, setPassError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernamError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [registed, setRegisted] = useState("");

  const getFormData = (event) => {
    event.preventDefault();

    if (
      event.target.elements["pass"].value !==
      event.target.elements["re-pass"].value
    ) {
      return setPassError("Password not Match");
    } else {
      setPassError("");
    }

    const regex = /^[0-9]+$/;
    if (!regex.test(event.target.elements["phone"].value)) {
      return setPhoneError("Phone is invalid (must contain only numbers)");
    } else {
      setPhoneError("");
    }

    const user = {
      fname: event.target.elements["firstName"].value,
      lname: event.target.elements["lastName"].value,
      username: event.target.elements["username"].value,
      email: event.target.elements["email"].value,
      pass: event.target.elements["pass"].value,
      phone: event.target.elements["phone"].value,
      gender: event.target.elements["Gender"].value,
      age: event.target.elements["Age"].value,
    };

    api
      .post("/register", user)
      .then((res) => {
        console.log(res);
        setEmailError("");
        setUsernameError("");
        setPhoneError("");
        res.status == 201 &&
          setRegisted("Account created successfully! You can sign in now");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
        setRegisted("");
        if (e.response.data.message == "Duplicate Found!") {
          e.response.data.existingEmail
            ? setEmailError("This Email already exist")
            : setEmailError("");
          e.response.data.existingUsername
            ? setUsernameError("This username already exist")
            : setUsernameError("");
          e.response.data.existingPhone
            ? setPhoneError("This phone already used")
            : setPhoneError("");
        }
      });
  };

  return (
    <>
      <header>
        <Header />
      </header>
      <main className="my-5 flex  flex-col items-center ">
        <h1>Create your account</h1>

        <form
          className="my-7 grid grid-cols-1 gap-7 sm:w-120 w-60"
          onSubmit={getFormData}
        >
          <div className="grid grid-cols-2  gap-6">
            
              <Input
                htmlFor="firstName"
                label="First Name"
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                className="input"
                required
              />
            
              <Input
                htmlFor="lastName"
                label="Last Name"
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                className="input"
                required
              />
            
          </div>
          
            <Input
              htmlFor="username"
              label="Username"
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              className="input"
              required
              minLength={6}
              element={usernamError ? <p className="error">{usernamError}</p> : null}
            />
        
            <Input
              htmlFor="email"
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="input"
              required
              minLength={15}
              element={emailError ? <p className="error">{emailError}</p> : null}
            />
            
            <Input
              htmlFor="pass"
              label="Password"
              id="pass"
              name="pass"
              type={showPass ? "text" : "password"}
              placeholder="Create a password"
              className="input"
              required
              minLength={9}
              formprop="relative"
              element={<button
                  type="button"
                  className="absolute top-12 sm:left-105  left-61 cursor-pointer active:text-blue-400  text-sm text-blue-500"
                  onClick={() => setShowPass(!showPass)}
                >
                  show
                </button>}
            />
            
            <Input
              htmlFor="re-pass"
              label="Re-enter Password"
              id="re-pass"
              name="re-pass"
              type={showPass ? "text" : "password"}
              placeholder="Re-enter your password"
              className="input"
              required
              minLength={9}
              element={passError ? <p className="error">{passError}</p> : null}
            />
            
          
            <Input
              htmlFor="phone"
              label="Phone Number"
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your Phone number"
              className="input"
              required
              minLength={10}
              element={phoneError ? <p className="error">{phoneError}</p> : null}
            />
          
          <div className="info">
            <label htmlFor="Gender">Gender</label>
            <select id="Gender" name="Gender" className="input cursor-pointer">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

            <Input
               htmlFor="Age"
               label="Age"
              id="Age"
              name="Age"
              type="number"
              placeholder="Enter your Age"
              className="input"
              required
              max={90}
              min={16}
            />
          
          
          {registed ? (
            <p className="flex items-center text-green-500 text-[1.1rem]">
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
              {registed}
            </p>
          ) : (
            <p></p>
          )}

          <button
            type="submit"
            className="input bg-blue-400 font-medium active:bg-blue-500 cursor-pointer"
          >
            Register
          </button>
          <Link to={"/login"}>
            <p className="text-center  text-blue-500 underline cursor-pointer ">
              Already have an account? Sign in
            </p>
          </Link>
        </form>
      </main>
    </>
  );
};

export default Register;
