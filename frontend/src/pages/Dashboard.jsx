import { useEffect, useState } from "react";
import api from "../services/api";
import AIPanel from "../components/AIPanel";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    closed: 0,
    totalAmount: 0,
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/penalties/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);

      // fallback demo data
      setStats({
        total: 10,
        open: 6,
        closed: 4,
        totalAmount: 25000,
      });
    }
  };

  const handleExport = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.get("/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "penalties.csv");
      document.body.appendChild(link);
      link.click();
      setSuccess("Download started");
    } catch (err) {
      console.error(err);
      setError("Export failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const allowedTypes = ["text/csv", "application/vnd.ms-excel"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only CSV files allowed");
      setSuccess("");
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("File too large (max 2MB)");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Upload successful");
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: "Open", value: stats.open },
    { name: "Closed", value: stats.closed },
  ];

  return (
    <div className="mb-6">

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500 text-sm">Total</p>
          <h2 className="text-2xl font-bold text-blue-600">{stats.total}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500 text-sm">Open</p>
          <h2 className="text-2xl font-bold text-yellow-600">{stats.open}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500 text-sm">Closed</p>
          <h2 className="text-2xl font-bold text-green-600">{stats.closed}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500 text-sm">Total Amount</p>
          <h2 className="text-2xl font-bold text-blue-600">₹{stats.totalAmount}</h2>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white p-4 rounded shadow mt-4 w-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Penalty Status Overview</h2>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Export CSV
          </button>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-semibold mb-2">Data Management</h2>

        {success && (
          <p className="bg-green-100 text-green-700 p-2 rounded text-sm mb-3">
            {success}
          </p>
        )}

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded text-sm mb-3">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-500 text-white px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      <AIPanel />
    </div>
  );
}

export default Dashboard;