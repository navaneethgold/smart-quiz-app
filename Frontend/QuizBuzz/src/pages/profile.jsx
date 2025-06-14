import { useState,useEffect } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import Flash from "./flash";
import "../Styles/profile.css"
const Profile=()=>{
    const token=localStorage.getItem("token");
    const [userData,setUserData]=useState({});
    const [allExams,setAllExams]=useState([]);
    const [grpNames,setgrpNames]=useState({});
    const [isLogged,setisLogged]=useState(false);
    const navigate=useNavigate();
    const getProfile=async()=>{
        const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/getProfile`,{
            withCredentials:true,
            headers:{Authorization:`Bearer ${token}`}
        })
        if(res.data.got){
            setUserData(res.data.profile);
            setisLogged(true);
            const res2=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/home/getExams/${res.data.profile.username}`,{
                withCredentials:true,
                headers:{Authorization:`Bearer ${token}`}
            })
            if(res2.data.gotExams){
                console.log(res.data.profile.username);
                setAllExams(res2.data.exams);
                setgrpNames(res2.data.grpNames);
            }
        }
    }
    useEffect(()=>{
        getProfile();
    },[])
    const startExam = async (name) => {
    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/${name}/setEnd`, {}, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navigate(`/start-exam/${name}`);
  };
    const handleLogout=()=>{
      localStorage.removeItem("token");
      setisLogged(false);
      setUserData({});
      setAllExams([]);
      setgrpNames({});
      navigate("/login")
    }
    return(
        <div className="pro">
            <div className="user-profile-section">
                <h2 className="profile-title">👤 User Profile</h2>
                {isLogged && <>
                    <button onClick={handleLogout} id="myb">LogOut</button>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p></>
                }
            </div>
          <h1 className="exam-heading">Your Exams</h1>
            <div className="exam-grid">
                {allExams.length > 0 ? (
                  allExams.map((exam) => (
                    <div className="exam-card" key={exam._id}>
                      <h2>{exam.examName}</h2>
                      <p><strong>Created by:</strong> {exam.createdBy}</p>
                      <p><strong>Groups:</strong> {exam.groups.map((grp) => grpNames[grp] || grp).join(", ")}</p>
                      <p><strong>Duration:</strong> {exam.duration} minutes</p>
                      <p><strong>Created on:</strong> {new Date(exam.createtime).toLocaleString()}</p>
                      {!exam.submitted && (
                        <button className="start-btn" onClick={() => startExam(exam._id)}>
                          {exam.endTime === null ? "Start Exam" : "Resume Exam"}
                        </button>
                      )}
                      {exam.submitted && (
                        <div className="completed-section">
                          <button className="start-btn completed">Exam Completed</button>
                          <button className="start-btn view-analytics" onClick={() => navigate(`/${exam._id}/analytics`)}>View Analytics</button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No exams available yet.</p>
                )}
            </div>
      </div>
    ); 
}
export default Profile;