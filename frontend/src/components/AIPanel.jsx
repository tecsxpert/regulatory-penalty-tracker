import { useState } from "react";
import api from "../services/api";

function AIPanel() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAskAI = async () => {
    if (!query) return;
    try {
      setLoading(true);
      setError("");
      setResponse(null);
      const res = await api.post("/ai/describe", { penalty_text: query });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-3">AI Assistant</h2>

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

      {/* LOADING SPINNER */}
      {loading && (
        <div className="mt-3 flex items-center gap-2 text-blue-500">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-sm">Thinking...</span>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="mt-3 text-red-500 text-sm">{error}</p>
      )}

      {/* FORMATTED RESPONSE CARD */}
      {response && !loading && (
        <div className="mt-4 p-4 border rounded bg-gray-50 space-y-2">
          <h3 className="font-semibold text-gray-700">AI Response</h3>
          {response.description && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Description</p>
              <p className="text-sm text-gray-800">{response.description}</p>
            </div>
          )}
          {response.impact && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Impact</p>
              <p className="text-sm text-gray-800">{response.impact}</p>
            </div>
          )}
          {response.generated_at && (
            <p className="text-xs text-gray-400">Generated at: {response.generated_at}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AIPanel;