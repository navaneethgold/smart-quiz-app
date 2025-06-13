import { useState,useEffect,useCallback } from "react";
import axios, { all } from "axios";
import { useNavigate } from "react-router-dom";
import { Axis3D } from "lucide-react";
import Flash from "./flash";
import '../Styles/groups.css'
const CreateExam=()=>{
    const [exam,setexam]=useState("");
    const [allGroups,setAllGroups]=useState([]);
    const [flashMessage,setflashMessage]=useState("");
    const [type,setistype]=useState("");
    const token=localStorage.getItem("token");
    const [totalTime, setTotalTime] = useState(0);
    const navigate=useNavigate();
    const [checked,setisChecked]=useState([]);
    const [linearity,setlinearity]=useState("Yes");
    const fetchGroups = useCallback(async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/groups/getAdmins`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.fetched) {
                setAllGroups(res.data.allg);
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

    const handleChange=(e)=>{
        setexam(e.target.value);
    }
    const handleChecking=(id)=>{
        setisChecked((preChecked)=>{
            if(preChecked.includes(id)){
                return preChecked.filter((item)=>item!==id)
            }else{
                return [...preChecked,id];
            }
        })
    }
    const handleProceeding=async()=>{
        const res=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/create-new-exam`,{groups:checked,examName:exam,duration:totalTime,linear:linearity==="Yes"},{
            withCredentials:true,
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        if(res.data.message==="success"){
            const un=res.data.owner;
            navigate(`/${un}/${exam}`);
        }
    }

    return(
        <div className="class2">
            <div className="list-class">
              {allGroups.length > 0 ? (
                <div className="group-table">
                  <div className="group-header">
                    <div>Group Name</div>
                    <div>Created By</div>
                    <div>Members</div>
                    <div>Your Role</div>
                    <div>Include for Exam</div>
                  </div>
                  {allGroups.map((grp, index) => (
                    <div key={grp._id} className="group-row">
                      <div>{grp.groupName}</div>
                      <div>{grp.createdBy}</div>
                      <div>{grp.members?.join(", ") || "No members"}</div>
                      <div>Admin</div>
                      <div style={{display:"flex",alignItems:"center", gap:'0.5rem'}}>
                        <input type="checkbox"  name="include" checked={checked.includes(grp._id)}  onChange={() => handleChecking(grp._id)}/>
                        <label htmlFor="include">check for including</label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>You can only Conduct a exam if you are the group Admin</p>
              )}
            </div>
            <div className="proceed">
                <div className="foot">
                    <div className="ename">
                        <label>Exam Name:</label>
                        <input type="text" value={exam} onChange={handleChange} />
                    </div>
                    <div className="exam-time">
                      <label>Total Exam Time (in minutes): </label>
                      <input
                        type="number"
                        value={totalTime}
                        onChange={(e) => setTotalTime(e.target.value)}
                      />
                    </div>
                    <div className="linear">
                        <label>Linear Mode of exam</label>
                        <select name="linearity" id="linear" value={linearity} onChange={(e)=>setlinearity(e.target.value)}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
                
                <button onClick={handleProceeding}>Proceed with creating Exam</button>
            </div>

        </div>
    )
}
export default CreateExam;