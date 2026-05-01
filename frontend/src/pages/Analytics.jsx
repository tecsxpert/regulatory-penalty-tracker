import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
const PERIODS = ["All", "Last 7 Days", "Last 30 Days", "Last 90 Days"];

function Analytics() {
  const [penalties, setPenalties] = useState([]);
  const [period, setPeriod] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      // fetch all pages
      let all = [];
      let page = 0;
      let totalPages = 1;
      while (page < totalPages) {
        const res = await api.get(`/penalties?page=${page}&size=50`);
        all = [...all, ...res.data.content];
        totalPages = res.data.totalPages;
        page++;
      }
      setPenalties(all);
    } catch (err) {
      console.error(err);
      // fallback demo data
      setPenalties([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter by period
  const filtered = penalties.filter((p) => {
    if (period === "All") return true;
    const due = new Date(p.due_date || p.dueDate);
    const now = new Date();
    const days = period === "Last 7 Days" ? 7
      : period === "Last 30 Days" ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - days);
    return due >= cutoff;
  });

  // --- Chart 1: Status breakdown (Pie) ---
  const statusData = [
    { name: "Open",   value: filtered.filter(p => p.status === "OPEN").length },
    { name: "Closed", value: filtered.filter(p => p.status === "CLOSED").length },
  ];

  // --- Chart 2: Amount by Regulation Body (Bar) ---
  const bodyMap = {};
  filtered.forEach((p) => {
    const body = p.regulationBody || p.regulation_body || "Unknown";
    bodyMap[body] = (bodyMap[body] || 0) + (p.amount || p.penalty_amount || 0);
  });
  const bodyData = Object.entries(bodyMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // --- Chart 3: Penalties count by month (Line) ---
  const monthMap = {};
  filtered.forEach((p) => {
    const date = new Date(p.due_date || p.dueDate);
    const key = date.toLocaleString("default", { month: "short", year: "2-digit" });
    monthMap[key] = (monthMap[key] || 0) + 1;
  });
  const monthData = Object.entries(monthMap).map(([month, count]) => ({ month, count }));

  // --- Chart 4: Top penalties by amount (Bar) ---
  const topPenalties = [...filtered]
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 5)
    .map(p => ({ name: p.title?.slice(0, 18) + "...", amount: p.amount || p.penalty_amount || 0 }));

  // --- KPIs ---
  const totalAmount = filtered.reduce((s, p) => s + (p.amount || p.penalty_amount || 0), 0);
  const avgAmount   = filtered.length ? (totalAmount / filtered.length).toFixed(0) : 0;
  const openCount   = filtered.filter(p => p.status === "OPEN").length;
  const closedCount = filtered.filter(p => p.status === "CLOSED").length;

  if (loading) return <p className="p-6">Loading analytics...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>

        {/* PERIOD SELECTOR */}
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded text-sm font-medium border transition
                ${period === p
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Penalties" value={filtered.length} color="text-blue-600" />
        <KpiCard label="Open"            value={openCount}       color="text-yellow-600" />
        <KpiCard label="Closed"          value={closedCount}     color="text-green-600" />
        <KpiCard label="Total Amount"    value={`₹${totalAmount.toLocaleString()}`} color="text-purple-600" />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Chart 1 - Status Pie */}
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

        {/* Chart 2 - Amount by Regulation Body */}
        <ChartCard title="Total Amount by Regulation Body">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bodyData} layout="vertical"
              margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3 - Penalties by Month */}
        <ChartCard title="Penalties Count by Due Month">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count"
                stroke="#8B5CF6" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4 - Top 5 by Amount */}
        <ChartCard title="Top 5 Penalties by Amount">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topPenalties}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* SUMMARY ROW */}
      <div className="mt-6 bg-white rounded shadow p-4 flex flex-wrap gap-6">
        <div>
          <p className="text-xs text-gray-500">Average Penalty Amount</p>
          <p className="text-xl font-bold text-gray-800">₹{Number(avgAmount).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Highest Single Penalty</p>
          <p className="text-xl font-bold text-gray-800">
            ₹{Math.max(...filtered.map(p => p.amount || 0), 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Compliance Rate</p>
          <p className="text-xl font-bold text-green-600">
            {filtered.length
              ? `${((closedCount / filtered.length) * 100).toFixed(0)}%`
              : "0%"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Period</p>
          <p className="text-xl font-bold text-gray-800">{period}</p>
        </div>
      </div>

    </div>
  );
}

// Reusable components
function KpiCard({ label, value, color }) {
  return (
    <div className="bg-white p-4 shadow rounded">
      <p className="text-gray-500 text-sm">{label}</p>
      <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default Analytics;