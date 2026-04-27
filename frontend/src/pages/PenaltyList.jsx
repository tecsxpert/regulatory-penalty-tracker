import { useEffect, useState } from "react";
import api from "../services/api";

import { useLocation, useNavigate } from "react-router-dom";

function PenaltyList({ onEdit }) {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPenalties();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchPenalties = async () => {
    try {
      setLoading(true);

      const res = await api.get("/penalties");
      setPenalties(res.data);
      setError("");

    } catch (err) {
      console.error(err);
      setError("Backend not available. Showing sample data.");

      setPenalties([
        {
          id: 1,
          title: "Sample Penalty",
          status: "OPEN",
          penalty_amount: 5000,
          due_date: "2026-05-01",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/penalties/${id}`);
      setSuccess("Deleted successfully");
      fetchPenalties();

      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  // Filter penalties
  const filteredPenalties = penalties.filter((p) => {
    const due = new Date(p.due_date);

    return (
      (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || p.status === statusFilter) &&
      (!startDate || new Date(startDate) <= due) &&
      (!endDate || new Date(endDate) >= due)
    );
  });

  return (
    <div className="p-4">

      {/* SUCCESS */}
      {success && (
        <p className="bg-green-100 text-green-700 p-2 mb-3 rounded">
          {success}
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="bg-red-100 text-red-600 p-2 rounded text-sm mb-3">
          {error}
        </p>
      )}

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-3 mt-6 mb-4 bg-white p-4 rounded shadow">

        {/* SEARCH */}
        <input
          className="border p-2 rounded w-64"
          type="text"
          placeholder=" Search penalties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* STATUS FILTER */}
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="OPEN">OPEN</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        {/* DATE RANGE */}
        <div className="flex items-center gap-2">
          <input
            className="border p-2 rounded"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <span className="text-gray-500 text-sm">to</span>

          <input
            className="border p-2 rounded"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* CLEAR FILTER BUTTON */}
        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("");
            setStartDate("");
            setEndDate("");
            fetchPenalties();
          }}
          className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
        >
          Clear
        </button>

      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredPenalties.length === 0 ? (
        <p>No penalties found.</p>
      ) : (
        <table className="w-full border bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 font-semibold">Title</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Amount</th>
              <th className="p-3 font-semibold">Due Date</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPenalties.map((p) => (
              <tr key={p.id} className="border-t text-center hover:bg-gray-50 transition">

                <td
                  className="p-3 cursor-pointer text-blue-600 hover:underline"
                  onClick={() => navigate(`/penalties/${p.id}`)}
                >
                  {p.title}
                </td>

                <td className="p-3">{p.status}</td>
                <td className="p-3">₹{p.penalty_amount}</td>
                <td className="p-3">{p.due_date}</td>

                <td className="p-3">
                  <button
                    onClick={() => onEdit(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}

export default PenaltyList;