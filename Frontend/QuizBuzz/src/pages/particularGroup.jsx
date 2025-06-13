import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../Styles/particularGroup.css";
import Flash from "./flash";
import { useNavigate } from "react-router-dom";

export default function Pgroup() {
  const { id } = useParams();
  const navigate=useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMember, setNewMember] = useState("");
  const [flash, setFlash] = useState({ message: "", type: "" });

  const token = localStorage.getItem("token");

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setGroup(res.data.grp);
    } catch (err) {
      console.error("Error fetching group:", err);
      setFlash({ message: "Group not found or unauthorized", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const handleAddMember = async () => {
    if (!newMember.trim()) return;
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/groups/${id}/addmem`, 
        { email: newMember },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setFlash({ message: res.data.message, type: "success" });
      setNewMember("");
      fetchGroup(); // Refresh group data
    } catch (error) {
      console.error("Failed to add member:", error);
      setFlash({ message: error.response?.data?.message || "Error adding member", type: "error" });
    }
  };
  const handleRemoveMember = async (member) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/groups/${id}/removemem`, 
        { part: member },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if(res.data.removed){
        setFlash({ message: res.data.message, type: "success" });
        fetchGroup(); // Refresh data
      }
    } catch (error) {
      setFlash({ message: error.response?.data?.message || "Error removing member", type: "error" });
    }
  };
  const handleSubmit=()=>{
    try{
      navigate(`/groups/${id}/groupChat`);
    }catch(err){
      console.log(err);
    }
  }
  if (loading) return <p className="indiGroup">Loading...</p>;
  if (!group) return <p className="indiGroup">Group not found or unauthorized</p>;


  return (
    <div className="indiGroup">
      <h2>Group Name: {group.groupName}</h2>
      <p><strong>Created By:</strong> {group.createdBy}</p>
      <button onClick={handleSubmit} id="gc">GroupChat</button>

      <div className="add-member-container">
        <input
          type="email"
          placeholder="Enter member email"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
        />
        <button onClick={handleAddMember}>Add Member</button>
      </div>

      {flash.message && (
        <Flash message={flash.message} type={flash.type}/>
      )}
      <h3>Members</h3>
      <div className="members-list">
        {group.members && group.members.length > 0 ? (
          group.members.map((member, index) => (
            <div key={index} className="member-row">
              <span>{member}</span>
              <button className="remove-btn" onClick={()=>handleRemoveMember(member)}>Remove</button>
            </div>
          ))
        ) : (
          <p>No members</p>
        )}
      </div>
    </div>
  );
}
