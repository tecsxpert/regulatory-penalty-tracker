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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (penalty) {
      setFormData({
        title: penalty.title || "",
        description: penalty.description || "",
        regulation_body: penalty.regulation_body || "",
        penalty_amount: penalty.penalty_amount || "",
        status: penalty.status || "OPEN",
        due_date: penalty.due_date || "",
      });
    }
  }, [penalty]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.penalty_amount) {
      setError("Title and Amount are required");
      return;
    }

    try {
      setLoading(true);

      if (penalty) {
        await api.put(`/penalties/${penalty.id}`, formData);
      } else {
        await api.post("/penalties", formData);
      }

      setError("");
      onSuccess();

      setFormData({
        title: "",
        description: "",
        regulation_body: "",
        penalty_amount: "",
        status: "OPEN",
        due_date: "",
      });

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6 max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-3">
        {penalty ? "Edit Penalty" : "Add Penalty"}
      </h2>

      {error && (
        <p className="text-red-500 mb-2">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input
          className="border p-2 rounded"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          name="penalty_amount"
          type="number"
          placeholder="Amount"
          value={formData.penalty_amount}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          className="border p-2 rounded"
          name="regulation_body"
          placeholder="Regulation Body"
          value={formData.regulation_body}
          onChange={handleChange}
        />

        <select
          className="border p-2 rounded"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="OPEN">OPEN</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <button
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : penalty ? "Update" : "Submit"}
        </button>

      </form>
    </div>
  );
}

export default PenaltyForm;