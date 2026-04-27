import { useEffect, useState } from "react";
import api from "../services/api";
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
        <h2 className="font-semibold mb-2">Penalty Status Overview</h2>

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
    </div>
  );
}

export default Dashboard;