import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function PenaltyList({ onEdit }) {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPenalties();
  }, [page]);

  const fetchPenalties = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/penalties?page=${page}&size=10`);

      // Handle both paginated {data: {content: []}} and flat {content: []} responses
      const responseData = res.data?.data || res.data;

      if (responseData?.content) {
        // Paginated response
        setPenalties(responseData.content);
        setTotalPages(responseData.totalPages || 1);
      } else if (Array.isArray(responseData)) {
        // Flat array response
        setPenalties(responseData);
        setTotalPages(1);
      } else {
        setPenalties([]);
        setTotalPages(1);
      }

      setError("");
    } catch (err) {
      console.error(err);
      setError("Backend not available. Showing sample data.");
      setPenalties([{
        id: 1, title: "Sample Penalty",
        status: "OPEN", penalty_amount: 5000, due_date: "2026-05-01",
      }]);
      setTotalPages(1);
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

      {success && (
        <p className="bg-green-100 text-green-700 p-2 mb-3 rounded">{success}</p>
      )}
      {error && (
        <p className="bg-red-100 text-red-600 p-2 rounded text-sm mb-3">{error}</p>
      )}

      {/* FILTERS — full width, no right gap */}
      <div className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">

          {/* SEARCH — grows to fill space */}
          <input
            className="flex-1 min-w-[180px] border border-gray-200 rounded-lg
              px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
              placeholder:text-gray-400"
            type="text"
            placeholder="Search penalties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* STATUS */}
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* CLEAR */}
          <button
            onClick={() => {
              setSearch(""); setStatusFilter("");
              setStartDate(""); setEndDate("");
              fetchPenalties();
            }}
            className="border border-gray-200 bg-gray-50 px-3 py-2 rounded-lg
              text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            Clear
          </button>

        </div>
      </div>

      {/* TABLE - desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-sm font-semibold text-left">Title</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold">Amount</th>
              <th className="p-3 text-sm font-semibold">Due Date</th>
              <th className="p-3 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPenalties.map((p) => (
              <tr key={p.id} className="border-t text-center hover:bg-gray-50 transition">
                <td
                  className="p-3 text-sm cursor-pointer text-blue-600 hover:underline text-left"
                  onClick={() => navigate(`/penalties/${p.id}`)}
                >
                  {p.title}
                </td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium
                    ${p.status === "OPEN"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3 text-sm">₹{(p.penalty_amount || p.amount || 0).toLocaleString()}</td>
                <td className="p-3 text-sm">{p.due_date || p.dueDate}</td>
                <td className="p-3 text-sm">
                  <button onClick={() => onEdit(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2
                      text-xs hover:bg-yellow-600">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded
                      text-xs hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARDS - mobile */}
      <div className="md:hidden flex flex-col gap-3">
        {filteredPenalties.map((p) => (
          <div key={p.id}
            className="bg-white rounded shadow p-4 border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <p
                className="font-medium text-blue-600 text-sm cursor-pointer hover:underline"
                onClick={() => navigate(`/penalties/${p.id}`)}
              >
                {p.title}
              </p>
              <span className={`px-2 py-1 rounded text-xs font-medium ml-2 flex-shrink-0
                ${p.status === "OPEN"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"}`}>
                {p.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              ₹{(p.penalty_amount || p.amount || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Due: {p.due_date || p.dueDate}
            </p>
            <div className="flex gap-2">
              <button onClick={() => onEdit(p)}
                className="flex-1 bg-yellow-500 text-white py-1 rounded text-xs hover:bg-yellow-600">
                Edit
              </button>
              <button onClick={() => handleDelete(p.id)}
                className="flex-1 bg-red-500 text-white py-1 rounded text-xs hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-40 hover:bg-gray-100"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {page + 1} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-40 hover:bg-gray-100"
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default PenaltyList;