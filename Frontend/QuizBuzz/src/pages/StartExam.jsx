import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/StartExam.css";

const ExamStart = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [questions, setQuestions] = useState([]);
  const [examDetails, setExamDetails] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({id:name});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${name}/getQuestions`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.got) {
          setQuestions(res.data.questions);
          setExamDetails(res.data.Nowexam);

          const duration = res.data.Nowexam.duration * 60;
          const endTime = res.data.Nowexam.endTime
            ? new Date(res.data.Nowexam.endTime).getTime()
            : Date.now() + duration * 1000;
          const timeRemaining = Math.floor((endTime - Date.now()) / 1000);
          setTimeLeft(timeRemaining);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getQuestions();

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure? Your answers will be lost.";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (timeLeft===null || timeLeft <= 0){
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionNo, value) => {
    setAnswers((prev) => ({ ...prev, [questionNo]: value }));
  };
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit(); // Auto-submit exactly once
    }
  }, [timeLeft]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

const handleSubmit = async () => {
  if (submitted) return;
  setSubmitted(true);

  try {
    console.log(answers);
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/${name}/submitAnswers`, { answers }, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data.sub) {
      const res2 = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/${name}/submitted`, {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res2.data.sub) {
        alert("Exam submitted successfully!");
      }
    }

    navigate("/home");
  } catch (err) {
    console.error(err);
    alert("Error submitting exam.");
  }
};

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions.length || !examDetails) return <div className="exam-interface">Loading...</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="exam-interface">
      <div className="timer">Time Left: {formatTime(timeLeft)}</div>
      <div className="question-box">
        <h3>Q{currentQ.questionNo}: {currentQ.question}</h3>
        {currentQ.questionsType === "MCQ" && (
          <div className="options">
            {currentQ.additional.map((opt, i) => (
                <div className="eachop">
                <input
                  type="radio"
                  name={`q${currentQ.questionNo}`}
                  value={opt}
                  checked={answers[currentQ.questionNo] === opt}
                  style={{margin:0, width:"0.75rem",marginRight:"0.5rem"}}
                  onChange={(e) => handleAnswerChange(currentQ.questionNo, e.target.value)}
                  className="mcqinput"
                />
                <label key={i} className="option-label">{opt}</label>
                </div>
                
              
            ))}
          </div>
        )}
        {currentQ.questionsType === "TrueFalse" && (
          <div className="options">
            {["True", "False"].map((val) => (
              <label key={val} className="option-label">
                <input
                  type="radio"
                  name={`q${currentQ.questionNo}`}
                  value={val}
                  checked={answers[currentQ.questionNo] === val}
                  style={{margin:0, width:"0.75rem",marginRight:"0.5rem"}}
                  onChange={(e) => handleAnswerChange(currentQ.questionNo, e.target.value)}
                />
                {val}
              </label>
            ))}
          </div>
        )}
        {currentQ.questionsType === "FillBlank" && (
          <input
            className="blank-input"
            type="text"
            value={answers[currentQ.questionNo] || ""}
            onChange={(e) => handleAnswerChange(currentQ.questionNo, e.target.value)}
          />
        )}
        <div className="nav-buttons">
          {examDetails.linearity && <button disabled={currentIndex === 0} onClick={handlePrev}>Previous</button>}
          <button disabled={currentIndex === questions.length - 1} onClick={handleNext}>Next</button>
        </div>
        <div className="submit-btn">
          <button onClick={handleSubmit}>Submit Exam</button>
        </div>
      </div>
    </div>
  );
};

export default ExamStart;