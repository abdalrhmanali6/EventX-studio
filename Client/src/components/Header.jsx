import React from 'react'
import { Link ,useLocation  } from "react-router";

const Header = () => {

const location=useLocation().pathname

  return (
    <>
        <p className=" w-0.5 leading-3 font-extrabold ml-6 text-2xl">
          EventX <span className="font-ReenieBeanie font-normal">Studio</span>
        </p>
        <nav className="flex sm:space-x-7 sm:mr-10 items-center  space-x-3 ">
          <Link to={"/"}>
          <p className={`${location=="/"? "text-blue-400 font-medium cursor-not-allowed " :"hover:text-blue-400 active:opacity-55"} `} >
              Home
          </p>
          </Link>
          <a href="#" className="sm:inline-flex hidden">
            About
          </a>
          <a href="#" className="sm:inline-flex hidden">
            Contact
          </a>
          <Link to={"/register"}>
            <p  className={`${location=="/register"? "bg-gray-200 px-4 py-2 rounded-xl font-medium cursor-not-allowed " :"bg-blue-400 px-4 py-2 rounded-xl font-medium cursor-pointer active:opacity-55 hover:bg-blue-500"} `}>
              Sign up
            </p>
          </Link>
          <Link to={"/login"}>
            <p  className={`${location=="/login"? "bg-gray-200 px-4 py-2 rounded-xl font-medium cursor-not-allowed " :"bg-blue-400 px-4 py-2 rounded-xl font-medium cursor-pointer active:opacity-55 hover:bg-blue-500"} `}>
              Sign In
            </p>
          </Link>
        </nav>
    </>
  )
}

export default Header