import React, { useState, useEffect } from "react";
import Loader from "./components/Loader";
import Flag from "react-world-flags";
import { motion, LayoutGroup } from "framer-motion";

function App() {
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rate, setRate] = useState(0);

  // This state controls the physical side (left/right)
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        const data = await res.json();
        setCurrencies(Object.keys(data.rates));
        setRate(data.rates[to]);
        if (loading) setTimeout(() => setLoading(false), 1200);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchRates();
  }, [from, to]);

  const handleSwap = () => {
    // We swap the values...
    setFrom(to);
    setTo(from);
    // ...and we flip the physical order!
    setIsSwapped(!isSwapped);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* 1. The Header with the entrance bounce */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="text-4xl font-extrabold text-white mb-8 tracking-tight"
      >
        Currency <span className="text-emerald-400">Converter</span>
      </motion.h1>

      {/* 2. The Main Card with a fade-in effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* --- Rest of your card content (Amount, LayoutGroup, Result) --- */}
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

        <LayoutGroup>
          <div
            className={`flex items-center gap-4 mb-8 ${isSwapped ? "flex-row-reverse" : "flex-row"}`}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex-1"
            >
              <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
                {isSwapped ? "To" : "From"}
              </label>
              <div className="flex flex-col gap-2">
                <Flag
                  code={
                    (isSwapped ? to : from) === "EUR"
                      ? "EU"
                      : (isSwapped ? to : from).slice(0, 2)
                  }
                  className="h-6 w-10 shadow-md rounded"
                />
                <select
                  value={isSwapped ? to : from}
                  onChange={(e) =>
                    isSwapped ? setTo(e.target.value) : setFrom(e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 outline-none focus:border-emerald-500"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            <motion.button
              layout
              whileTap={{ scale: 0.8, rotate: 180 }}
              onClick={handleSwap}
              className="p-2 bg-gray-100 hover:bg-emerald-100 rounded-full transition-colors z-20 mt-6"
            >
              ⇄
            </motion.button>

            <motion.div
              layout
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex-1"
            >
              <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
                {isSwapped ? "From" : "To"}
              </label>
              <div className="flex flex-col gap-2">
                <Flag
                  code={
                    (isSwapped ? from : to) === "EUR"
                      ? "EU"
                      : (isSwapped ? from : to).slice(0, 2)
                  }
                  className="h-6 w-10 shadow-md rounded"
                />
                <select
                  value={isSwapped ? from : to}
                  onChange={(e) =>
                    isSwapped ? setFrom(e.target.value) : setTo(e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 outline-none focus:border-emerald-500"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>
        </LayoutGroup>

        <div className="mt-2 p-6 bg-slate-50 rounded-xl text-center border border-slate-100">
          <p className="text-gray-500 text-sm mb-1">
            {amount} {from} =
          </p>
          <h2 className="text-3xl font-bold text-slate-800">
            {(amount * rate).toFixed(2)}{" "}
            <span className="text-emerald-500">{to}</span>
          </h2>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
