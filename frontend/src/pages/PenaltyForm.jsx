import { useState, useEffect } from "react";
import api from "../services/api";

function PenaltyForm({ penalty, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    regulation_body: "",
    penalty_amount: "",
    status: "OPEN",
    due_date: "",
  });

  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (penalty) {
      setFormData({
        title:           penalty.title           || "",
        description:     penalty.description     || "",
        regulation_body: penalty.regulation_body || "",
        penalty_amount:  penalty.penalty_amount  || "",
        status:          penalty.status          || "OPEN",
        due_date:        penalty.due_date        || "",
      });
    }
  }, [penalty]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.penalty_amount) {
      setError("Title and Amount are required");
      return;
    }
    try {
      setLoading(true);
      if (penalty) await api.put(`/penalties/${penalty.id}`, formData);
      else         await api.post("/penalties", formData);
      setError("");
      onSuccess();
      setFormData({
        title: "", description: "", regulation_body: "",
        penalty_amount: "", status: "OPEN", due_date: "",
      });
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full border border-gray-200 p-2.5 rounded-lg text-sm
    focus:outline-none focus:ring-2 focus:ring-blue-400 transition
    placeholder:text-gray-400`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 w-full">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-5 rounded-full ${penalty ? "bg-yellow-500" : "bg-blue-600"}`} />
        <h2 className="text-sm md:text-base font-semibold text-gray-800">
          {penalty ? "Edit Penalty" : "Add Penalty"}
        </h2>
      </div>

      {error && (
        <p className="text-red-500 mb-3 text-xs bg-red-50 p-2 rounded border border-red-100">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Title *</label>
          <input className={inputClass} name="title"
            placeholder="e.g. GST Late Filing" value={formData.title}
            onChange={handleChange} />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Amount (₹) *</label>
          <input className={inputClass} name="penalty_amount" type="number"
            placeholder="e.g. 15000" value={formData.penalty_amount}
            onChange={handleChange} />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Due Date</label>
          <input className={inputClass} name="due_date" type="date"
            value={formData.due_date} onChange={handleChange} />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Description</label>
          <input className={inputClass} name="description"
            placeholder="Brief description" value={formData.description}
            onChange={handleChange} />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Regulation Body</label>
          <input className={inputClass} name="regulation_body"
            placeholder="e.g. GST Department" value={formData.regulation_body}
            onChange={handleChange} />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Status</label>
          <select className={inputClass} name="status"
            value={formData.status} onChange={handleChange}>
            <option value="OPEN">OPEN</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm
            font-medium hover:bg-blue-700 disabled:opacity-50
            disabled:cursor-not-allowed transition mt-1"
        >
          {loading ? "Processing..." : penalty ? "Update Penalty" : "Add Penalty"}
        </button>

        {penalty && (
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: "", description: "", regulation_body: "",
                penalty_amount: "", status: "OPEN", due_date: "",
              });
              onSuccess();
            }}
            className="w-full border border-gray-200 text-gray-500 py-2 rounded-lg
              text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        )}

      </form>
    </div>
  );
}

export default PenaltyForm;