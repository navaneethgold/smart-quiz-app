import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/geminiAI.css";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Flash from "./flash";
const GeminiAI=()=>{
    const {un,exam}=useParams();
    const navigate=useNavigate();
    const token=localStorage.getItem("token");
    const [difficult,setdifficulty]=useState("Medium");
    const [maxMarks,setmaxMarks]=useState('');
    const [noQuestions,setnoQuestions]=useState('');
    const [typeQuestions,settypeQuestions]=useState("MCQ");
    const [portions,setportions]=useState("");
    const [flashMessage,setflashMessage]=useState("");
    const [type,setisType]=useState("");
    const [show,setshow]=useState(false);
    const handleAIgen = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/generate-AI-questions`, {
          difficult,
          maxMarks,
          noQuestions,
          typeQuestions,
          portions
        }, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        const questions = res.data.allAiQuestions;
        console.log("Type of allAiQuestions:", typeof res.data.allAiQuestions);
        // Fix bad quotes using regex (NOT RECOMMENDED LONG-TERM)
// const cleanedString = res.data.allAiQuestions.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
// const questions = JSON.parse(cleanedString);

        // const questions = JSON.parse(res.data.allAiQuestions);
        console.log(questions);
        console.log("Type of allAiQuestions:", typeof questions);
        for (const eachobj of questions) {
          const questionPayload = {
            examName: exam,
            // questionNo:eachobj.questionNo,
            // questionsType:eachobj.questionsType,
            // question:eachobj.question,
            // additional:eachobj.additional,
            // qAnswer:eachobj.qAnswer,
            ...eachobj,
            marks: Number(maxMarks) / Number(noQuestions)
          };
          console.log(questionPayload);
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/create-new-exam/${exam}/create-question`, {payload:questionPayload}, {
            withCredentials: true
          });
        }
        setshow(true);
        console.log("Questions generated and added successfully!");
        setflashMessage("Questions generated and added successfully!")
        setisType("success");
        setTimeout(() => {
            navigate("/home");
        }, 3000);
      } catch (error) {
        setshow(true);
        console.error("Error during AI generation or question creation:", error);
        // alert("Something went wrong while generating or submitting questions.");
        setflashMessage("Something went wrong while generating or submitting questions.")
        setisType("error");
      }
    };

    return(
        <div className="prompt">
            <div className="diff">
                <label>Difficulty Level:</label>
                <select name="difficult" id="difficult" value={difficult} onChange={(e)=>setdifficulty(e.target.value)}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>
            <div className="total">
                <label>Total Marks:</label>
                <input type="Number" placeholder="Enter maximum marks..." value={maxMarks} onChange={(e)=>setmaxMarks(e.target.value)}/>
            </div>
            <div className="noq">
                <label>Total number of questions:</label>
                <input type="Number" placeholder="Enter total number of questions..." value={noQuestions} onChange={(e)=>setnoQuestions(e.target.value)}/>
            </div>
            <div className="typeq">
                <label>Type of questions:</label>
                <select name="typeQuestions" id="typeQuestions" value={typeQuestions} onChange={(e)=>settypeQuestions(e.target.value)}>
                    <option value="MCQ">MCQ</option>
                    <option value="TrueFalse">True/False</option>
                    <option value="FillBlank">Fill in the Blank</option>
                    <option value="MCQ,TrueFalse,FillBlank">Mixed</option>
                </select>
            </div>
            <div className="portions">
                <label>Describe about the syllabus and standard of questions in Detail:</label>
                <textarea
                    placeholder="Describe syllabus and question standard..."
                    value={portions}
                    onChange={(e) => setportions(e.target.value)}
                />
            </div>
            {show && <Flash message={flashMessage} type={type} show={show} setShow={setshow}/>}
            <button style={{display:"flex",alignItems:"center"}} onClick={handleAIgen}><AutoAwesomeIcon sx={{margin:"0.5rem"}}/>Generate</button>
        </div>
    );
}
export default GeminiAI;