import { useState,useEffect,useCallback } from "react";
import axios, { all } from "axios";
import { useNavigate } from "react-router-dom";
import { Axis3D } from "lucide-react";
import Flash from "./flash";
import '../Styles/groups.css'
const Groups=()=>{
    const [group,setGroup]=useState("");
    const [allGroups,setAllGroups]=useState([]);
    const [flashMessage,setflashMessage]=useState("");
    const [type,setistype]=useState("");
    const [roles,setRoles]=useState([]);
    const token=localStorage.getItem("token");
    const navigate=useNavigate();
    const fetchGroups = useCallback(async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/groups/getAll`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.fetched) {
                setAllGroups(res.data.allg);
                setRoles(res.data.roles);
                console.log("Fetched groups:", res.data.allg); // For debugging
            } else {
                setflashMessage(res.data.message || "Failed to fetch groups.");
                setistype("error");
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
            setflashMessage("An error occurred while fetching groups.");
            setistype("error");
        }
    }, []); 
    useEffect(() => {
        if(token){
            fetchGroups();
        }
    }, [fetchGroups]);

    const handleChange=(event)=>{
        setGroup(event.target.value);
    }
    const handleSubmit=async(event)=>{
        event.preventDefault();
        const res=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/groups/new/${group}`,{},{
            withCredentials:true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setGroup("");
        if(res.data.created){
            setflashMessage(res.data.message);
            setGroup("");
            setistype("success");
            fetchGroups();
        }else{
            setflashMessage(res.data.message);
            setistype("error");
        }
    }
    const handleViewGroup = (id) => {
      try {
        console.log(id);
        navigate(`/groups/${id}`);
      } catch (error) {
        console.error("Error fetching group:", error);
        setflashMessage("Failed to fetch group details.");
        setistype("error");
      }
    };

    return(
        <div className="class">
            <div className="create">
                <form onSubmit={handleSubmit}>
                    <input type="text" onChange={handleChange} value={group} required />
                    {token ?(<button type="submit">Create a Group {group}</button>):(<button>Login for creating a group</button>)}
                </form>
                {flashMessage && <Flash message={flashMessage} type={type}/>}
            </div>
            <div className="list-class">
              {allGroups.length > 0 ? (
                <div className="group-table">
                  <div className="group-header">
                    <div>Group Name</div>
                    <div>Created By</div>
                    <div>Members</div>
                    <div>Your Role</div>
                    <div>View It</div>
                  </div>
                  {allGroups.map((grp, index) => (
                    <div key={grp._id} className="group-row">
                      <div>{grp.groupName}</div>
                      <div>{grp.createdBy}</div>
                      <div>{grp.members?.join(", ") || "No members"}</div>
                      <div>{roles[index]}</div>
                      <div onClick={()=>handleViewGroup(grp._id)} style={{ cursor: "pointer", color: "#2563eb", fontWeight: "500" }}>View Group</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No groups found. Create one!</p>
              )}
            </div>

        </div>
    )
}
export default Groups;