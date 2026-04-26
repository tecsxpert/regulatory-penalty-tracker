import { useEffect, useState } from "react";
import api from "../services/api";
import PenaltyForm from "./PenaltyForm";

function PenaltyList() {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/penalties/${id}`);
      setSuccess("Deleted successfully");
      fetchPenalties();
    } catch (error) {
      console.error(error);
      setError("Delete failed");
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
      console.error(error);
      setError("Search failed");
    }
  };

  return (
    <div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <p className="bg-green-100 text-green-700 p-2 mb-3 rounded">
          {success}
        </p>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <p className="bg-red-100 text-red-700 p-2 mb-3 rounded">
          {error}
        </p>
      )}

      {/* FORM */}
      <PenaltyForm
        penalty={selectedPenalty}
        onSuccess={() => {
          setSuccess("Saved successfully");
          fetchPenalties();
          setSelectedPenalty(null);
        }}
      />

      {/* SEARCH */}
      <div className="flex justify-between items-center mt-6 mb-3">
        <h2 className="text-xl font-semibold">Penalty List</h2>

        <input
          className="border p-2 rounded w-64"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : penalties.length === 0 ? (
        <p>No penalties found.</p>
      ) : (
        <table className="w-full border bg-white shadow">
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
                    className="bg-yellow-500 text-white px-3 py-1 mr-2 rounded"
                    onClick={() => setSelectedPenalty(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
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