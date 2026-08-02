import axios from "axios";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {addUser} from "../utils/userSlice"
import { useEffect } from "react";

const PUBLIC_ROUTES = ["/login", "/forgot-password"];
const isPublicRoute = (pathname) =>
  PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/reset-password/");

function Body() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location=useLocation();
  const userData=useSelector((store)=>store.user);

  const fetchUser =async () =>{
    if(userData) return;
    if(isPublicRoute(location.pathname)) return;
   try{
     const res = await axios.get("/api/profile/view",
     { 
      withCredentials:true,
     });
     dispatch(addUser(res.data));

    }catch(err){
      if(err.status==401){
        navigate("/login");
      }
      console.error(err);
    }
  };

  useEffect(()=>{
    fetchUser();
  },[])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Body;