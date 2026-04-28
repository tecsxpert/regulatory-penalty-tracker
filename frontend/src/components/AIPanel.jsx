import { useState } from "react";
import api from "../services/api";

function AIPanel() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!query) return;

    try {
      setLoading(true);

      // Example API call - will replace with actual endpoint and payload
      const res = await api.post("/ai/query", { query });

      setResponse(res.data.answer || "No response");

    } catch (err) {
      console.error(err);
      setResponse("Error fetching AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">

      <h2 className="text-lg font-semibold mb-3">AI Assistant</h2>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="Ask something about penalties..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={handleAskAI}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Ask
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-3 animate-pulse text-blue-500">
          Thinking...
        </div>
      )}

      {/* RESPONSE CARD */}
      {response && !loading && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <h3 className="font-semibold mb-1">AI Response</h3>
          <p className="text-sm text-gray-700">{response}</p>
        </div>
      )}

    </div>
  );
}

export default AIPanel;