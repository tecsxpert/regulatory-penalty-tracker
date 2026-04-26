import { useEffect, useState } from "react";
import api from "../services/api";
import PenaltyForm from "./PenaltyForm";

function PenaltyList() {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPenalties();
  }, []);

  const fetchPenalties = async () => {
    try {
      setLoading(true);
      const res = await api.get("/penalties");
      setPenalties(res.data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to fetch penalties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/penalties/${id}`);
      fetchPenalties();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (value) => {
    setSearch(value);

    try {
      if (!value) {
        fetchPenalties();
        return;
      }

      const res = await api.get(`/penalties/search?q=${value}`);
      setPenalties(res.data);
    } catch (error) {
      console.error("Search API failed:", error);
    }
  };

  return (
    <div className="p-4">

      {/* FORM */}
      <PenaltyForm
        penalty={selectedPenalty}
        onSuccess={() => {
          fetchPenalties();
          setSelectedPenalty(null);
        }}
      />

      {/* SEARCH */}
      <input
        className="border p-2 mb-3 w-full max-w-md"
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* ERROR MESSAGE */}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : penalties.length === 0 ? (
        <p>No penalties found.</p>
      ) : (
        <table className="w-full border mt-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Status</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {penalties.map((p) => (
              <tr key={p.id} className="border-t text-center">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.status}</td>
                <td className="p-2">{p.penalty_amount}</td>
                <td className="p-2">{p.due_date}</td>

                <td className="p-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                    onClick={() => setSelectedPenalty(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
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