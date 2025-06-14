import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../Styles/settings.css";
import Flash from "./flash";
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import Divider from '@mui/material/Divider';

const Settings = () => {
    const token = localStorage.getItem("token");
    const [flashMessage, setflashMessage] = useState("");
    const [type, setistype] = useState("");
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const deleteorganQuizHistory = async () => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/deleteOrganQuizes`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.deleted) {
                setflashMessage("✅ Successfully deleted all quizzes you organized.");
                setistype("success");
            } else {
                setflashMessage("❌ Failed to delete organized quizzes.");
                setistype("error");
            }
        } catch {
            setflashMessage("❌ Server error while deleting organized quizzes.");
            setistype("error");
        }
        setShow(true);
    };

    const deleteCreatedGroups = async () => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/deleteCreatedGroups`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.deleted) {
                setflashMessage("✅ Successfully deleted all groups.");
                setistype("success");
            } else {
                setflashMessage("❌ Failed to delete Groups.");
                setistype("error");
            }
        } catch {
            setflashMessage("❌ Server error while deleting groups.");
            setistype("error");
        }
        setShow(true);
    };

    const deleteAcc = async () => {
        try {
            const res1 = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/deleteOrganQuizes`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
            const res2 = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/deleteCreatedGroups`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
            const res3 = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/deleteAccount`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res1.data.deleted && res2.data.deleted && res3.data.deleted) {
                setflashMessage("✅ Account and all related data deleted successfully.");
                setistype("success");
                setShow(true);
                setTimeout(() => {
                    navigate("/signUp");
                }, 3000);
            } else {
                throw new Error("Incomplete deletion");
            }
        } catch {
            setflashMessage("❌ Failed to delete account.");
            setistype("error");
            setShow(true);
        }
    };

    return (
        <div className="settin">
            <h2>⚙️ Settings</h2>
            <Divider sx={{ my: 2 }} />

            {show && <Flash message={flashMessage} type={type} show={show} setShow={setShow} />}

            <div className="setting-option" onClick={deleteorganQuizHistory}>
                <HistoryIcon sx={{ color: "#2c3e50", marginRight: "10px" }} />
                <span>Delete All Organized Quizzes</span>
            </div>

            <div className="setting-option" onClick={deleteCreatedGroups}>
                <DeleteIcon sx={{ color: "#2c3e50", marginRight: "10px" }} />
                <span>Delete All Created Groups</span>
            </div>

            <div className="setting-option delete-account" onClick={deleteAcc}>
                <PersonOffIcon sx={{ color: "#c0392b", marginRight: "10px" }} />
                <span>Delete My Account</span>
            </div>
        </div>
    );
};

export default Settings;
