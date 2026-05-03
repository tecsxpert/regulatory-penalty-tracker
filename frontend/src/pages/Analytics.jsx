import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";

const COLORS  = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
const PERIODS = ["All", "Last 7 Days", "Last 30 Days", "Last 90 Days"];

function Analytics() {
  const navigate = useNavigate();   // ✅ INSIDE the component

  const [penalties, setPenalties] = useState([]);
  const [period,    setPeriod]    = useState("All");
  const [loading,   setLoading]   = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      let all = [], page = 0, totalPages = 1;
      while (page < totalPages) {
        const res = await api.get(`/penalties?page=${page}&size=50`);
        all        = [...all, ...res.data.content];
        totalPages = res.data.totalPages;
        page++;
      }
      setPenalties(all);
    } catch (err) {
      console.error(err);
      setPenalties([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Filter by period ──
  const filtered = penalties.filter((p) => {
    if (period === "All") return true;
    const due    = new Date(p.due_date || p.dueDate);
    const days   = period === "Last 7 Days" ? 7
                 : period === "Last 30 Days" ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return due >= cutoff;
  });

  // ── Chart data ──
  const statusData = [
    { name: "Open",   value: filtered.filter(p => p.status === "OPEN").length },
    { name: "Closed", value: filtered.filter(p => p.status === "CLOSED").length },
  ];

  const bodyMap = {};
  filtered.forEach((p) => {
    const body   = p.regulationBody || p.regulation_body || "Unknown";
    bodyMap[body] = (bodyMap[body] || 0) + (p.amount || p.penalty_amount || 0);
  });
  const bodyData = Object.entries(bodyMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const monthMap = {};
  filtered.forEach((p) => {
    const date = new Date(p.due_date || p.dueDate);
    const key  = date.toLocaleString("default", { month: "short", year: "2-digit" });
    monthMap[key] = (monthMap[key] || 0) + 1;
  });
  const monthData = Object.entries(monthMap)
    .map(([month, count]) => ({ month, count }));

  const topPenalties = [...filtered]
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 5)
    .map(p => ({
      name:   (p.title?.slice(0, 15) || "") + "...",
      amount: p.amount || p.penalty_amount || 0,
    }));

  // ── KPIs ──
  const totalAmount = filtered.reduce((s, p) => s + (p.amount || p.penalty_amount || 0), 0);
  const avgAmount   = filtered.length ? (totalAmount / filtered.length).toFixed(0) : 0;
  const openCount   = filtered.filter(p => p.status === "OPEN").length;
  const closedCount = filtered.filter(p => p.status === "CLOSED").length;
  const highestAmount = filtered.length
    ? Math.max(...filtered.map(p => p.amount || p.penalty_amount || 0))
    : 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-gray-500 text-sm">Loading analytics...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start
        sm:items-center gap-3 mb-6">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1 bg-white border border-gray-200
              text-gray-600 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50
              hover:border-gray-300 transition"
          >
            ← Dashboard
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Analytics
          </h1>
        </div>

        {/* RIGHT — period selector */}
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium
                border transition
                ${period === p
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Total Penalties" value={filtered.length}
          color="text-blue-600"   bg="bg-blue-50" />
        <KpiCard label="Open"            value={openCount}
          color="text-yellow-600" bg="bg-yellow-50" />
        <KpiCard label="Closed"          value={closedCount}
          color="text-green-600"  bg="bg-green-50" />
        <KpiCard label="Total Amount"
          value={`₹${totalAmount.toLocaleString()}`}
          color="text-purple-600" bg="bg-purple-50" />
      </div>

      {/* ── CHARTS 2x2 ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        {/* Chart 1 — Status Pie */}
        <ChartCard title="Penalty Status Breakdown">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={90} label>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2 — Amount by Regulation Body */}
        <ChartCard title="Total Amount by Regulation Body">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bodyData} layout="vertical"
              margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number"
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name"
                width={130} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3 — Penalties by Month */}
        <ChartCard title="Penalties Count by Due Month">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count"
                stroke="#8B5CF6" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4 — Top 5 by Amount */}
        <ChartCard title="Top 5 Penalties by Amount">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topPenalties}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* ── SUMMARY ROW ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4
        grid grid-cols-2 md:grid-cols-4 gap-4">

        <SummaryItem
          label="Average Penalty"
          value={`₹${Number(avgAmount).toLocaleString()}`}
          color="text-gray-800"
        />
        <SummaryItem
          label="Highest Penalty"
          value={`₹${highestAmount.toLocaleString()}`}
          color="text-red-600"
        />
        <SummaryItem
          label="Compliance Rate"
          value={filtered.length
            ? `${((closedCount / filtered.length) * 100).toFixed(0)}%`
            : "0%"}
          color="text-green-600"
        />
        <SummaryItem
          label="Period"
          value={period}
          color="text-blue-600"
        />
      </div>

    </div>
  );
}

// ── Reusable components ──
function KpiCard({ label, value, color, bg }) {
  return (
    <div className={`${bg} rounded-xl p-4 border border-gray-100`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function SummaryItem({ label, value, color }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default Analytics;