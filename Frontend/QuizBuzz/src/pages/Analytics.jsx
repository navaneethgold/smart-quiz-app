import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../Styles/analytics.css';

const Analytics = () => {
  const { exam } = useParams();
  const token = localStorage.getItem("token");
  const [examDetails, setExamDetails] = useState({});
  const [questions, setQuestions] = useState([]);
  const [userData, setUserData] = useState({});
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res1 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${exam}/getQuestions`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res1.data.got) {
          const questionsFetched = res1.data.questions;
          const examInfo = res1.data.Nowexam;
          const user = res1.data.puser;

          const res2 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${examInfo.examName}/getAnswers`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res2.data.got) {
            const userAnswers = res2.data.answersq.answersAll;
            console.log("user:",userAnswers);
            let correctCount = 0;
            questionsFetched.forEach((q, i) => {
              if (userAnswers[i] && userAnswers[i].trim().toLowerCase() === q.qAnswer.trim().toLowerCase()) {
                correctCount++;
              }
            });

            const totalQuestions = questionsFetched.length;
            const percentage = (correctCount / totalQuestions) * 100;

            setQuestions(questionsFetched);
            setExamDetails(examInfo);
            setUserData(user);
            setAnswers(userAnswers);
            setScore(correctCount);
            setAccuracy(percentage.toFixed(2));
          }
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    fetchAnalytics();
  }, [exam, token]);

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Exam Analytics</h1>
      <div className="analytics-summary">
        <div><strong>Student:</strong> {userData.username}</div>
        <div><strong>Exam Name:</strong> {examDetails.examName}</div>
        <div><strong>Total Questions:</strong> {questions.length}</div>
        <div><strong>Correct Answers:</strong> {score}</div>
        <div><strong>Accuracy:</strong> {accuracy}%</div>
        <div><strong>Duration:</strong> {examDetails.duration} minutes</div>
      </div>

      <div className="analytics-breakdown">
        <h2>Question-wise Analysis</h2>
        {questions.map((q, idx) => (
          <div key={q._id} className={`question-block ${answers[idx]?.trim().toLowerCase() === q.qAnswer.trim().toLowerCase() ? 'correct' : 'wrong'}`}>
            <p><strong>Q{q.questionNo}:</strong> {q.question}</p>
            <p><strong>Your Answer:</strong> {answers[idx] || "Not Answered"}</p>
            <p><strong>Correct Answer:</strong> {q.qAnswer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
