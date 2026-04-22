import { useEffect, useState } from "react";
import api from "../services/api";

function PenaltyList() {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPenalties();
  }, []);

  const fetchPenalties = async () => {
    try {
      // TEMP MOCK DATA
      const data = [
        {
          id: 1,
          title: "Late Filing",
          status: "OPEN",
          penalty_amount: 5000,
          due_date: "2026-05-01",
        },
      ];

      setPenalties(data);

      // const res = await api.get("/penalties");
      // setPenalties(res.data);

    } catch (error) {
      console.error("Error fetching penalties:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Penalty List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : penalties.length === 0 ? (
        <p>No penalties found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Status</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {penalties.map((p) => (
              <tr key={p.id} className="border-t text-center">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.status}</td>
                <td className="p-2">{p.penalty_amount}</td>
                <td className="p-2">{p.due_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PenaltyList;