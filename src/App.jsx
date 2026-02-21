import React, { useState } from "react";
import { useEffect } from "react";
import Loader from "./components/Loader";

function App() {
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rate, setRate] = useState(0);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        const data = await res.json();

        setCurrencies(Object.keys(data.rates));

        // 2. Set the current rate for our 'to' currency
        setRate(data.rates[to]);
        setTimeout(() => setLoading(false), 1200);
      } catch (error) {
        console.error("Error fetching currency:", error);
        setLoading(false);
      } finally {
        // Small timeout so the earth has time to spin!
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchRates();
  }, [from, to]); // This means: "Re-run this whenever 'from' or 'to' changes"

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight">
        Currency <span className="text-emerald-400">Converter</span>
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* 1. Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors text-lg font-semibold"
          />
        </div>

        {/* 2. Dropdowns */}
        <div className="flex gap-4 mb-8 items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              From
            </label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 outline-none focus:border-emerald-500"
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* The Swap Button - Right in the middle! */}
          <button
            onClick={handleSwap}
            className="p-2 mb-0.5 bg-gray-100 hover:bg-emerald-100 rounded-full transition-colors"
          >
            ⇄
          </button>

          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              To
            </label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 outline-none focus:border-emerald-500"
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. The Result - Clean and at the bottom */}
        <div className="mt-2 p-6 bg-slate-50 rounded-xl text-center border border-slate-100">
          <p className="text-gray-500 text-sm mb-1">
            {amount} {from} =
          </p>
          <h2 className="text-3xl font-bold text-slate-800">
            {(amount * rate).toFixed(2)}{" "}
            <span className="text-emerald-500">{to}</span>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default App;
