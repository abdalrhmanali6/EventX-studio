import React,{useState,useContext,useEffect} from "react";
import SidebarItem from "../components/SidebarItem";
import EventMangement from "../components/EventMangement";
import CreateEvent from "../components/CreateEvent";
import AdminEventDetails from "../components/AdminEventDetails";
import {useNavigate  } from "react-router-dom";
import UnderDevelopment from "../components/UnderDevelopment";
import Dashboard from "../components/Dashboard";
import { EventContext } from "../App";
import AdminAnalytics from "../components/AdminAnalytics";
import AttendanceInsight from "../components/AttendanceInsight";
import api from "../components/Api";
const AdminHome = () => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { setuser, token } = useContext(EventContext);

  useEffect(() => {
      api
        .get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setuser(res.data.data))
        .catch((e) => console.log(e.message));
    },[]);




  return (
    <div className="flex h-screen bg-[#111111] relative">
      <button
        className="absolute top-4 left-4 z-50 text-white sm:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="black"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      <aside  className={`fixed sm:static top-0 left-0 h-full bg-[#111111] transform 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0 transition-transform duration-300 
          w-64 sm:w-56 p-4 z-40 space-y-5`}>
        <div className="flex items-center border-b  border-[#D9D9D9] pb-4 mb-4 pl-5 ">
          <img
            src="logo.png"
            className="sm:w-10 w-5 border-amber-50 border-2 rounded-full"
          />
          <p className="w-0.5 leading-3 font-extrabold ml-6 sm:text-2xl text-white">
            EventX <span className="font-ReenieBeanie font-normal">Studio</span>
          </p>
        </div>

        <div className="flex  flex-col space-y-6">
          <h2 className="mainTitle">Main Navigation</h2>
          <SidebarItem image="ControlPanel.svg" text="Dashboard" onClick={()=>setActiveComponent("Dashboard")} />
          <SidebarItem
           image="EventAccepted.svg"
            text="Manage Events"
            onClick={()=>setActiveComponent("manageEvents")}
             />
          <SidebarItem
            image="CollaboratingInCircle.svg"
            text="Attendee Insights"
            onClick={()=>setActiveComponent("AttendanceInsight")}
          />
          <SidebarItem image="Statistics.svg" text="Analytics & Reports" onClick={()=>setActiveComponent("AdminAnalytics") }/>
        </div>

        <div className="flex  flex-col space-y-5">
          <h2 className="mainTitle">Support & Management</h2>
          <SidebarItem image="CustomerSupport.svg" text="Contact Support" onClick={() => setActiveComponent("UnderDevelopment")} />
          <SidebarItem image="Reminder.svg" text="Notifications"  onClick={() => setActiveComponent("UnderDevelopment")}/>
          <SidebarItem image="Settings.svg" text="Settings"  onClick={() => setActiveComponent("UnderDevelopment")}/>
        </div>

        <div className="flex  flex-col space-y-4">
          <h2 className="mainTitle">Users & Logout</h2>
          <SidebarItem image="AddUser.svg" text="Manage Users"  onClick={() => setActiveComponent("UnderDevelopment")}/>
            <SidebarItem image="Logout.svg" text="Logout" onClick={()=>{
              localStorage.removeItem("token")
              navigate("/login")} } />
          
        </div>
      </aside>
      <main className="flex-1 bg-gray-200 p-3 sm:ml-0 ml-0 rounded-2xl overflow-y-auto" >
        {activeComponent=="manageEvents"&&<EventMangement setActiveComponent={setActiveComponent}/>}
        {activeComponent=="CreateEvent"&&<CreateEvent setActiveComponent={setActiveComponent}/>}
        {activeComponent=="EventDetails"&&<AdminEventDetails setActiveComponent={setActiveComponent}/>}
         {activeComponent=="UnderDevelopment"&&<UnderDevelopment setActiveComponent={setActiveComponent}/>}
         {activeComponent=="Dashboard"&&<Dashboard setActiveComponent={setActiveComponent}/>}
         {activeComponent=="AdminAnalytics"&&<AdminAnalytics setActiveComponent={setActiveComponent}/>}
         {activeComponent=="AttendanceInsight"&&<AttendanceInsight setActiveComponent={setActiveComponent}/>}


      </main>
    </div>
  );
};

export default AdminHome;
