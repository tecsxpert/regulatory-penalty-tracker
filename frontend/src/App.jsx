import PenaltyList from "./pages/PenaltyList";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Regulatory Penalty Tracker
        </h1>

        <PenaltyList />
      </div>
    </div>
  );
}

export default App;