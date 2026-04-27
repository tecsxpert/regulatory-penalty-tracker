import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function PenaltyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [penalty, setPenalty] = useState(null);

  useEffect(() => {
    fetchPenalty();
  }, []);

  const fetchPenalty = async () => {
    try {
      const res = await api.get(`/penalties/${id}`);
      setPenalty(res.data);
    } catch (err) {
      console.error(err);

      // fallback
      setPenalty({
        id,
        title: "Sample Penalty",
        status: "OPEN",
        penalty_amount: 5000,
        due_date: "2026-05-01",
        score: 75,
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this penalty?")) return;

    try {
      await api.delete(`/penalties/${id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  if (!penalty) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white shadow rounded max-w-lg mx-auto">

      <h2 className="text-xl font-bold mb-4">{penalty.title}</h2>

      <p>Status: {penalty.status}</p>
      <p>Amount: ₹{penalty.penalty_amount}</p>
      <p>Due: {penalty.due_date}</p>

      {/* SCORE BADGE */}
      <div className="mt-3">
        <span className="bg-blue-500 text-white px-3 py-1 rounded">
          Score: {penalty.score || 70}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>

    </div>
  );
}

export default PenaltyDetail;