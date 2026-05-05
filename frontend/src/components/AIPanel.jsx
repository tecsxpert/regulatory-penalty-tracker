import { useState } from "react";
import api from "../services/api";

function AIPanel() {
  const [query,    setQuery]    = useState("");
  const [response, setResponse] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleAskAI = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true); setError(""); setResponse(null);
      const res = await api.post("/ai/describe", { penalty_text: query });
      setResponse(res.data);
    } catch {
      setError("AI service unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleAskAI(); };

  return (
    <div className="flex flex-col h-full w-full">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center
          justify-center text-white text-xs font-bold flex-shrink-0">
          AI
        </div>
        <h2 className="text-sm font-semibold text-gray-700">AI Assistant</h2>
      </div>

      {/* INPUT */}
      <div className="flex w-full gap-2">
        <input
          className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2
            text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
            placeholder:text-gray-400"
          placeholder="e.g. GST Late Filing..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          onClick={handleAskAI}
          disabled={loading || !query.trim()}
          className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg text-sm
            hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed
            flex-shrink-0 transition"
        >
          {loading ? (
            <span className="flex items-center gap-1">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="hidden sm:inline">Thinking</span>
            </span>
          ) : "Ask"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <p className="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
          {error}
        </p>
      )}

      {/* RESPONSE */}
      {response && !loading && (
        <div className="mt-3 flex-1 overflow-y-auto border border-blue-100
          bg-blue-50 rounded-lg p-3 space-y-2">
          {response.description && (
            <div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Description
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {response.description}
              </p>
            </div>
          )}
          {response.impact && (
            <div className="border-t border-blue-100 pt-2">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Impact
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {response.impact}
              </p>
            </div>
          )}
          {response.generated_at && (
            <p className="text-xs text-gray-400 border-t border-blue-100 pt-2">
              Generated: {new Date(response.generated_at).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* EMPTY STATE */}
      {!response && !loading && !error && (
        <div className="flex-1 flex items-center justify-center mt-3">
          <p className="text-xs text-gray-400 text-center px-2">
            Type a penalty name above and press Ask or Enter
          </p>
        </div>
      )}
    </div>
  );
}

export default AIPanel;