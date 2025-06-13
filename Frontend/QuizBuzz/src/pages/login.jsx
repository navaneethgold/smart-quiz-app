import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Flash from "./flash";
import "../Styles/login.css"

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();
  const [flashMessage,setflashMessage]=useState("");
  const [type ,setistype]=useState("");
  const [show,setShow]=useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, formData, {
        withCredentials: true
      });
      localStorage.setItem("token", res.data.token);
      setflashMessage(res.data.message);
      setistype("success");
      setShow(true);
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Login failed";
      setflashMessage(errorMessage);
      setShow(true);
      setistype("error");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title"><img src="/icon.png" alt="icon" />Welcome Back to QuizzBuzz👋</h2>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="login-input"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
        {show && <Flash message={flashMessage} type={type} show={show} setShow={setShow}/>}
        <p className="signup-text">
          Don't have an account? <span onClick={() => navigate("/signUp")} className="signup-link">Sign up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
