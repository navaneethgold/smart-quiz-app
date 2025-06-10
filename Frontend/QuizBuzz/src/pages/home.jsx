import React,{useState,useEffect} from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Flash from "./flash.css";
const home=()=>{
    const [isLogged,setisLogged]=useState(false);
    const [userData,setuserData]=useState({});
    const [flashMessage,setflashMessage]=useState("");
    const [type ,setistype]=useState("");
    useEffect(()=>{
        const checkAuth=async()=>{
            try{
                const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/check-login`,{
                    withCredentials:true,
                });
                setflashMessage(res.data.message);
                setisLogged(res.data.isLoggedIn);
                if(isLogged){
                    setuserData(res.data.user);
                    setistype(res.data.type);
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