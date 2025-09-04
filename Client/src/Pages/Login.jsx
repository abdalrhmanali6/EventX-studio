import React, { useState } from "react";
import Header from "../components/Header";
import Input from "../components/input";
import { Link, useNavigate } from "react-router-dom";
import api from "../components/Api";
const Login = () => {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [method, setmethod] = useState("username");
  const [userExist, setUserExist] = useState("");
  const [passmatch, setPassMatch] = useState("");

  const verfiyAccount = (event) => {
    event.preventDefault();

    const data = {
      pass: event.target.elements["pass"].value,
      role: event.target.elements["role"].value,
    };

    if (method == "username") {
      data.username = event.target.elements["username"].value;
    } else {
      data.email = event.target.elements["email"].value;
    }

    api
      .post("/login", data, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setUserExist("");
        setPassMatch("");
        const token = res.data.token;
        localStorage.setItem("token", token);
        
        if (data.role == "Admin") {
          navigate("/Admin");
        } else {
          navigate("/User", { replace: true });
        }

        setTimeout(() => {
          window.location.reload();
        }, 200);
      })
      .catch((e) => {
        console.log(e);
        e.status == 404 && method == "username"
          ? setUserExist("User not found")
          : e.status == 404 && method == "email"
          ? setUserExist("Email not found")
          : setUserExist("");

        e.status == 400 ? setPassMatch("Wrong password") : setPassMatch("");
      });
  };

  const changeMethod = (method) => {
    setmethod(method);
  };

  return (
    <div>
      <header>
        <Header />
      </header>

      <main className="my-12 flex  flex-col items-center">
        <h1 className="m-2 ">Log in to your account</h1>

        <form
          className="my-7 grid grid-cols-1 gap-6 sm:w-120 w-60"
          onSubmit={(event) => verfiyAccount(event)}
        >
          {method == "username" ? (
            <Input
              htmlFor="username"
              label="Username"
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              className="input"
              required
              minLength={6}
              element={
                userExist && method == "username" ? (
                  <p className="error">{userExist}</p>
                ) : (
                  <p></p>
                )
              }
            />
          ) : (
            <Input
              htmlFor="username"
              label="E-mail"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="input"
              required
              minLength={15}
              element={
                userExist && method == "email" ? (
                  <p className="error">{userExist}</p>
                ) : (
                  <p></p>
                )
              }
            />
          )}

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
            element={
              <>
                <button
                  type="button"
                  className="absolute top-12 sm:left-105  left-61 cursor-pointer active:text-blue-400  text-sm text-blue-500"
                  onClick={() => setShowPass(!showPass)}
                >
                  show
                </button>
                {passmatch ? <p className="error">{passmatch}</p> : null}
                <p className="text-start  text-blue-500  text-[0.9rem] underline cursor-pointer ">
                  Forgot password?
                </p>
              </>
            }
          />

          <div className="info">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" className="input cursor-pointer">
              <option value={"User"}>User</option>
              <option value={"Admin"}>Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="input bg-blue-400 font-medium active:bg-blue-500 cursor-pointer"
          >
            Log in
          </button>
          <div className="mt-4 flex flex-col items-center gap-2 text-sm">
            <Link to={"/register"}>
              <p className="text-center  text-blue-500 underline cursor-pointer ">
                Don't have an account? Sign up
              </p>
            </Link>
            <p
              className="text-center  text-blue-500 underline cursor-pointer"
              onClick={() => changeMethod("email")}
            >
              Sign in with email?
            </p>
            <p
              className="text-center  text-blue-500 underline cursor-pointer"
              onClick={() => changeMethod("username")}
            >
              Sign in with username?
            </p>
          </div>
        </form>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500">
        © 2025 EventX Studio. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
