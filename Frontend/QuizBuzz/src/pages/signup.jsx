import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Flash from "./flash";
import "../Styles/signup.css"

const Signup = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email:"",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/signUp`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true
      });

      if (res.data.err) {
        setError(res.data.err); // user already exists
        return;
      }
      
      const res2 = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        username: formData.username,
        password: formData.password
      }, {
        withCredentials: true
      });
      localStorage.setItem("token", res2.data.token);
      setflashMessage(res.data.message);
      setistype("success");
      setError(""); // Clear any previous error
      setShow(true);

      setTimeout(() => {
        navigate("/home")
      }, 3000);
    } catch (error) {
      console.error(error);
      setError("Signup failed due to a server error.");
      const errorMessage = error.response?.data?.message || "Login failed";
      setflashMessage(errorMessage);
      setShow(true);
      setistype("error");
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="login-title"><img src="/icon.png" alt="icon" />Welcome to QuizzBuzz👋</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <p className="error-message" style={{color:"white"}}>{error}</p>}

        <button type="submit">Register</button>
        {show && <Flash message={flashMessage} type={type} show={show} setShow={setShow}/>}
        <h4>Already have an account? <span onClick={()=>navigate("/login")} className="signup-link">Login</span></h4>
      </form>
    </div>
  );
};

export default Signup;
