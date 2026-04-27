import { useEffect, useState } from "react";
import api from "../services/api";
import PenaltyForm from "./PenaltyForm";

import { useLocation, useNavigate } from "react-router-dom";

function PenaltyList() {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // EDIT FROM DETAIL
  useEffect(() => {
    if (location.state?.editPenalty) {
      setSelectedPenalty(location.state.editPenalty);
    }
  }, [location.state]);

  useEffect(() => {
    fetchPenalties();
  }, []);

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

  const handleSearch = async (value) => {
    setSearch(value);

    try {
      if (!value) {
        fetchPenalties();
        return;
      }

      const res = await api.get(`/penalties/search?q=${value}`);
      setPenalties(res.data);

    } catch (err) {
      console.error(err);
      setError("Search failed");
    }
  };

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
          setTimeout(() => setSuccess(""), 3000);
        }}
      />

      {/* SEARCH */}
      <div className="flex justify-between items-center mt-6 mb-3">
        <h2 className="text-lg font-semibold">Penalty List</h2>

        <input
          className="border p-2 rounded w-64"
          type="text"
          placeholder="Search penalties..."
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

                <td
                  className="p-2 cursor-pointer text-blue-600"
                  onClick={() => navigate(`/penalties/${p.id}`)}
                >
                  {p.title}
                </td>

                <td className="p-2">{p.status}</td>
                <td className="p-2">{p.penalty_amount}</td>
                <td className="p-2">{p.due_date}</td>

                <td className="p-2">
                  <button
                    onClick={() =>
                      navigate("/dashboard", { state: { editPenalty: p } })
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
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