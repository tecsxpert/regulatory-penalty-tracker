import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
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
          <p>Total</p>
          <h2 className="text-xl font-bold">{stats.total}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p>Open</p>
          <h2 className="text-xl font-bold text-yellow-600">{stats.open}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p>Closed</p>
          <h2 className="text-xl font-bold text-green-600">{stats.closed}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p>Total Amount</p>
          <h2 className="text-xl font-bold">₹{stats.totalAmount}</h2>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="mb-3 font-semibold">Penalty Status Overview</h3>

        <BarChart width={400} height={250} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>
    </div>
  );
}

export default Dashboard;