import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flash from "./flash.jsx";
import "../Styles/home.css";

const Home = () => {
  const [isLogged, setisLogged] = useState(false);
  const [userData, setuserData] = useState({});
  const [flashMessage, setflashMessage] = useState("");
  const [type, setistype] = useState("");
  const [allExams, setallExams] = useState([]);
  const navigate = useNavigate();
  const [grpNames,setgrpNames]=useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setisLogged(false);
        setflashMessage("No token found. Please log in.");
        setistype("error");
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/check-login`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.isLoggedIn) {
          setisLogged(true);
          setuserData(res.data.user);
          setflashMessage(res.data.message);
          setistype(res.data.type || "success");
        } else {
          setisLogged(false);
          setflashMessage("Not logged in");
          setistype("error");
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setisLogged(false);
        setflashMessage("Not logged in");
        setistype("error");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      if (!userData?.username) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/home/getExams/${userData.username}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.gotExams) {
          setallExams(res.data.exams);
          setgrpNames(res.data.grpNames);
        }
      } catch (err) {
        console.error("Failed to fetch exams", err);
      }
    };
    fetchExams();
  }, [userData]);

  const startExam=async(name)=>{
    const res=await axios.put(`${import.meta.env.VITE_API_BASE_URL}/${name}/setEnd`,{},{
      withCredentials:true,
      headers:{
        Authorization: `Bearer ${token}`,
      }
    })
    navigate(`/start-exam/${name}`)
  }

  return (
    <div className="home-page">
      <h1 className="exam-heading">Your Exams</h1>
      <div className="exam-grid">
        {allExams.length > 0 ? (
          allExams.map((exam) => (
            <div className="exam-card" key={exam._id}>
              <h2>{exam.examName}</h2>
              <p><strong>Created by:</strong> {exam.createdBy}</p>
              <p><strong>Groups:</strong> {exam.groups.map((grp)=>
                grpNames[grp] || grp).join(", ")
              }</p>
              <p><strong>Duration:</strong> {exam.duration} minutes</p>
              <p><strong>Created on:</strong> {new Date(exam.createtime).toLocaleString()}</p>
              {!exam.submitted && <button
                className="start-btn"
                onClick={() => startExam(exam._id)}
              >
                {exam.endTime===null ? "Start Exam":"Resume Exam"}
              </button>}
              {exam.submitted && 
                <>
                  <button className="start-btn" style={{backgroundColor:"blue"}}>Exam Completed</button>
                  <button className="start-btn" style={{marginLeft:"2rem"}} onClick={()=>navigate(`/${exam._id}/analytics`)}>View Analytics</button>
                </>
              }
            </div>
          ))
        ) : (
          <p>No exams available yet.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
