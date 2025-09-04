import axios from "axios";
import { toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';

const api = axios.create({ baseURL: "process.env.REACT_APP_API_URL" });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); 

      toast.error("Session expired, please login again", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 3500); 
    }
    return Promise.reject(error);
  }
);

export default api;
