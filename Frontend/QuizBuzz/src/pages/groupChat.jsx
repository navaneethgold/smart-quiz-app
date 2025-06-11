import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { all } from "axios";
import { useParams } from "react-router-dom";
import Flash from "./flash";
import { useRef } from "react";
import {io} from "socket.io-client";
import "../Styles/groupChat.css"
const GroupChat=()=>{
    const {id}=useParams();
    const token=localStorage.getItem("token");
    const [allMsgs,setallMsgs]=useState([]);
    const [userData,setuserData]=useState("");
    const socketRef=useRef(null);
    const [newMsg,setnewMsg]=useState("");
    useEffect(()=>{
        const getmsgs=async()=>{
            const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/groups/${id}/fetchgroupChat`,{
                withCredentials:true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(res.data.fetched){
                setallMsgs(res.data.message);
                setuserData(res.data.puser);
            }
        }
        getmsgs();
    },[]);
    
    useEffect(() => {
      if (!userData || !userData.userId || socketRef.current || !id) return;

      socketRef.current = io(import.meta.env.VITE_API_BASE_URL, {
        auth: { userId: userData.userId },
        withCredentials: true
      });

      socketRef.current.emit("join-room", { roomId: id });

      socketRef.current.on("grp-message", ({ username, newMsg, id }) => {
        const newtxt = {
          sender: username,
          message: newMsg,
          roomId: id,
          time: Date.now()
        };
        setallMsgs((prev) => [...prev, newtxt]);
      });

      return () => {
        socketRef.current?.disconnect();
        socketRef.current = null;
      };
    }, [userData, id]);
    useEffect(() => {
      const chatBox = document.querySelector(".messages");
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, [allMsgs]);
    const handleChange=(e)=>{
        setnewMsg(e.target.value);
    }
    const handleSubmit=async(event)=>{
        event.preventDefault();
        let username=userData.username;
        if(!socketRef.current || newMsg.trim()==='') return;
        console.log("hi");
        socketRef.current.emit("grp-message",{username,newMsg,id});
        const newtxt2 = {
          sender: username,
          message: newMsg,
          roomId: id,
          time: Date.now()
        };
        setnewMsg("");
        const res=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/groups/${id}/addmsg`,{newtxt2},{
            withCredentials:true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    return (
      <div className="chat">
        <div className="chat-header">Group Chat</div>
        <div className="messages">
          {allMsgs && allMsgs.map((msg, ind) => (
            <div
              key={ind}
              className={`message ${msg.sender === userData.username ? "sent" : "received"}`}
            >
              <div className="message-sender">{msg.sender}</div>
              <div>{msg.message}</div>
              <div className="message-time">
                {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={newMsg}
            onChange={handleChange}
            placeholder="Type your message..."
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>
    );

}
export default GroupChat;
