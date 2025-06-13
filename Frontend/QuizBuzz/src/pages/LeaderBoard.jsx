import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../Styles/LeaderBoard.css";

const LeaderBoard = () => {
  const { exam } = useParams();
  const token = localStorage.getItem("token");
  const [analysis, setAnalysis] = useState([]);

  useEffect(() => {
    const getLeader = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/${exam}/analytics/leaderboard`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.got) {
        setAnalysis(res.data.leader);
      }
    };
    getLeader();
  }, [exam, token]);

  return (
  <div className="weAreLeaders">
    <div className="leaderboard-title">🏆 Leaderboard</div>
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Correct</th>
          <th>Unattempted</th>
          <th>Total</th>
          <th>Marks</th>
          <th>Time (min)</th>
        </tr>
      </thead>
      <tbody>
        {analysis.map((entry, index) => (
          <tr key={entry.examWho}>
            <td className={
              index === 0 ? "rank-gold"
              : index === 1 ? "rank-silver"
              : index === 2 ? "rank-bronze"
              : ""
            }>
              {index + 1}
            </td>
            <td>{entry.examWho}</td>
            <td>{entry.correctQ}</td>
            <td>{entry.unattempted}</td>
            <td>{entry.totalQ}</td>
            <td>{entry.marks}</td>
            <td>{entry.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

};

export default LeaderBoard;
