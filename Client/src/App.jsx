import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages//Home";
import BookTicket from "./Pages/BookTicket";
import UserHome from "./Pages/UserHome";
import AdminHome from "./Pages/AdminHome";
import TicketDetails from "./Pages/TicketDetails";
import { ProtectRoute, isTokenValid, checkRole } from "./components/navigate";
import { ToastContainer } from 'react-toastify';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { createContext, useState } from "react";

export const EventContext = createContext();

const App = () => {
  const [eventID, setEventID] = useState(null);
  const[user,setuser]=useState({})
  const[ticketID,setTicketID]=useState("")
  const[Event,setEvent]=useState({})
  const token=localStorage.getItem("token")
  const categories = [
    { value: "music", label: "🎵 Music & Concerts " },
    { value: "arts", label: "🎭 Arts & Culture " },
    { value: "film", label: "🎬 Film & Media" },
    { value: "conferences", label: "🎤 Conferences & Talks" },
    { value: "business", label: "💼 Business & Networking " },
    { value: "education", label: "📚 Education & Training " },
    { value: "sports", label: "⚽ Sports & Fitness " },
    { value: "food", label: "🍽️ Food & Drink " },
    { value: "community", label: "🌍 Community & Charity " },
    { value: "parties", label: "🕺 Parties & Nightlife  " },
    { value: "fashion", label: "🛍️ Fashion & Lifestyle  " },
    { value: "gaming", label: "🎮 Gaming & Esports  " },
    { value: "travel", label: "✈️ Travel & Outdoor " },
    { value: "health", label: "🧘 Health & Wellness " },
    { value: "family", label: "👨‍👩‍👧 Family & Kids " },
    { value: "festivals", label: "🎉 Festivals & Fairs " },
    { value: "technology", label: "💻 Technology & Innovation " },
    { value: "government", label: "🏛️ Government & Politics " },
    { value: "religion", label: "🙏 Religion & Spirituality " },
  ];

  const popularity = [
    { value: "low", label: "Low" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
  ];

  const status = [
    { value: "UpComing", label: "Upcoming" },
    { value: "Closed", label: "Closed" },
    { value: "Active", label: "Active" },
  ];




  const router = createBrowserRouter([
    {
      path: "/",
      element:
        isTokenValid() && checkRole() == "User" ? (
          <Navigate to="/User" replace />
        ) : isTokenValid() && checkRole() == "Admin" ? (
          <Navigate to="/Admin" replace />
        ) : (
          <Home />
        ),
    },
    {
      path: "/User",
      element: (
        <ProtectRoute>
          <UserHome />
        </ProtectRoute>
      ),
    },
    {
      path: "/Admin",
      element: (
        <ProtectRoute>
          <AdminHome />
        </ProtectRoute>
      ),
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  {
    path:"/User/BookTicket",
    element:<ProtectRoute>
          <BookTicket/>
        </ProtectRoute>
  },
  {
    path:"/User/TicketDetails",
    element:<ProtectRoute>
          <TicketDetails/>
        </ProtectRoute>
  }
  
  ]);

  return (
    <EventContext.Provider
      value={{ eventID, setEventID, categories, popularity, status,user,setuser,token,Event,setEvent,ticketID,setTicketID}}
    >
      <ToastContainer />
      <RouterProvider router={router} />
    </EventContext.Provider>
  );
};

export default App;
