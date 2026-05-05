import { useEffect, useState } from "react";
import api from "../services/api";
import AIPanel from "../components/AIPanel";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [stats, setStats]     = useState({ total: 0, open: 0, closed: 0, totalAmount: 0 });
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/penalties/stats");
      // Handle both {data: {...}} and direct {...} responses
      const statsData = res.data?.data || res.data;
      setStats(statsData);
    } catch {
      setStats({ total: 10, open: 6, closed: 4, totalAmount: 25000 });
    }
  };

  const handleExport = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res  = await api.get("/export", { responseType: "blob" });
      const url  = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", "penalties.csv");
      document.body.appendChild(link);
      link.click();
      setSuccess("Download started");
    } catch { setError("Export failed"); }
    finally  { setLoading(false); }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const allowed = ["text/csv", "application/vnd.ms-excel"];
    if (!allowed.includes(f.type)) { setError("Only CSV files allowed"); return; }
    if (f.size > 2 * 1024 * 1024)  { setError("File too large (max 2MB)"); return; }
    setError(""); setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true); setError(""); setSuccess("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Upload successful");
    } catch { setError("Upload failed"); }
    finally  { setLoading(false); }
  };

  const chartData = [
    { name: "Open",   value: stats.open },
    { name: "Closed", value: stats.closed },
  ];

  return (
    <div className="w-full space-y-4">

      {/* ── ROW 1 : KPI CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total"        value={stats.total}
          color="text-blue-600"   bg="bg-blue-50" />
        <KpiCard label="Open"         value={stats.open}
          color="text-yellow-600" bg="bg-yellow-50" />
        <KpiCard label="Closed"       value={stats.closed}
          color="text-green-600"  bg="bg-green-50" />
        <KpiCard label="Total Amount"
          value={`₹${Number(stats.totalAmount).toLocaleString()}`}
          color="text-purple-600" bg="bg-purple-50" />
      </div>

      {/* ── ROW 2 : CHART ── */}
      <div className="w-full bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-gray-700">
            Penalty Status Overview
          </h2>
          <button onClick={handleExport} disabled={loading}
            className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg
              hover:bg-green-700 disabled:opacity-50 transition">
            Export CSV
          </button>
        </div>
        <div className="w-full h-40 md:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={{
                borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12,
              }} />
              <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── ROW 3 : UPLOAD + AI — side by side ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* UPLOAD */}
        <div className="bg-white rounded-xl border border-gray-200 p-4
          flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Upload Data
            </h2>

            {success && (
              <p className="text-xs bg-green-50 text-green-700 p-2 rounded mb-2 border border-green-100">
                {success}
              </p>
            )}
            {error && (
              <p className="text-xs bg-red-50 text-red-600 p-2 rounded mb-2 border border-red-100">
                {error}
              </p>
            )}

            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-gray-200 rounded-lg
                p-4 md:p-5 text-center hover:border-blue-400 transition">
                <div className="text-2xl mb-1">📂</div>
                <p className="text-xs text-gray-600 font-medium truncate px-2">
                  {file ? file.name : "Click to choose file"}
                </p>
                <p className="text-xs text-gray-400 mt-1">CSV only · Max 2MB</p>
              </div>
              <input type="file" onChange={handleFileChange}
                className="hidden" accept=".csv" />
            </label>
          </div>

          <button onClick={handleUpload} disabled={loading || !file}
            className="mt-4 w-full bg-blue-600 text-white text-sm py-2 rounded-lg
              hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* AI ASSISTANT */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
          <AIPanel />
        </div>

      </div>
    </div>
  );
}

function KpiCard({ label, value, color, bg }) {
  return (
    <div className={`${bg} rounded-xl p-3 md:p-4 border border-gray-100`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl md:text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default Dashboard;