import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function PenaltyDetail() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [penalty, setPenalty] = useState(null);

  useEffect(() => { fetchPenalty(); }, []);

  const fetchPenalty = async () => {
    try {
      const res = await api.get(`/penalties/${id}`);
      setPenalty(res.data);
    } catch {
      setPenalty({
        id, title: "Sample Penalty", status: "OPEN",
        penalty_amount: 5000, due_date: "2026-05-01", score: 75,
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this penalty?")) return;
    try {
      await api.delete(`/penalties/${id}`);
      navigate("/dashboard");
    } catch (err) { console.error(err); }
  };

  if (!penalty) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* BACK */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-1 text-sm text-gray-500 mb-4
          hover:text-gray-800 transition"
      >
        ← Back to Dashboard
      </button>

      {/* CARD */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6
        w-full max-w-lg mx-auto">

        {/* TITLE + STATUS */}
        <div className="flex flex-col sm:flex-row sm:justify-between
          sm:items-start gap-2 mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            {penalty.title}
          </h2>
          <span className={`self-start px-3 py-1 rounded-full text-xs font-medium
            flex-shrink-0
            ${penalty.status === "OPEN"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"}`}>
            {penalty.status}
          </span>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <DetailItem label="Amount"
            value={`₹${(penalty.penalty_amount || penalty.amount || 0).toLocaleString()}`} />
          <DetailItem label="Due Date"
            value={penalty.due_date || penalty.dueDate || "—"} />
          {penalty.description && (
            <DetailItem label="Description" value={penalty.description} />
          )}
          {(penalty.regulation_body || penalty.regulationBody) && (
            <DetailItem label="Regulation Body"
              value={penalty.regulation_body || penalty.regulationBody} />
          )}
        </div>

        {/* SCORE BADGE */}
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-1">Compliance Score</p>
          <span className="inline-block bg-blue-600 text-white
            px-3 py-1 rounded-full text-sm font-medium">
            {penalty.score || 70} / 100
          </span>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-yellow-500 text-white py-2 rounded-lg
              text-sm font-medium hover:bg-yellow-600 transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg
              text-sm font-medium hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

export default PenaltyDetail;