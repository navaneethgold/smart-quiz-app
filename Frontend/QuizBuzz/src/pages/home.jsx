import React,{useState,useEffect} from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Flash from "./flash.jsx";
const Home=()=>{
    const [isLogged,setisLogged]=useState(false);
    const [userData,setuserData]=useState({});
    const [flashMessage,setflashMessage]=useState("");
    const [type ,setistype]=useState("");
    useEffect(()=>{
        const checkAuth=async()=>{
            const token=localStorage.getItem("token");
            if (!token) {
                setisLogged(false);
                setflashMessage("No token found. Please log in.");
                setistype("error");
                return;
            }
            try{
                const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/check-login`,{
                    withCredentials:true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.data.isLoggedIn) {
                  setisLogged(true);
                  setuserData(res.data.user);
                  console.log(res.data.user);
                  setflashMessage(res.data.message);
                  setistype(res.data.type || "success");
                } else {
                  setisLogged(false);
                  setflashMessage("Not logged in");
                  setistype("error");
                }
            }catch(err){
                console.error("Auth check failed", err);
                setisLogged(false);
                setflashMessage("Not logged in");
                setistype("error");
            }
        }
        checkAuth();
    },[])
    return(
        <>
            {isLogged && <h3>{userData.username}</h3>}
            {flashMessage && <Flash message={flashMessage} type={type}/>}
        </>
    )
}
export default Home;