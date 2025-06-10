import { useState,useEffect } from "react";
import "../Styles/flash.css";
const Flash=({message,type})=>{
    const [show,setShow]=useState(true);
    useEffect(()=>{
        const timer=setTimeout(()=>setShow(false),3000);
        return()=>clearTimeout(timer);
    },[]);
    if(!show) return null;
    return(
        <div className={`flash-message ${type}`}>
            {message}
        </div>
    )
}
export default Flash;