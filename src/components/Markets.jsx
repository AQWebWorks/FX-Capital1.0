import React, { useState, useEffect } from "react";

const coins = [
  { symbol: "BTCUSDT", display: "BTC/USDT", id: "BTC" },
  { symbol: "ETHUSDT", display: "ETH/USDT", id: "ETH" },
  { symbol: "LTCUSDT", display: "LTC/USDT", id: "LTC" },
  { symbol: "BNBUSDT", display: "BNB/USDT", id: "BNB" },
  { symbol: "NEOUSDT", display: "NEO/USDT", id: "NEO" },
  { symbol: "QTUMUSDT", display: "QTUM/USDT", id: "QTUM" },
  { symbol: "EOSUSDT", display: "EOS/USDT", id: "EOS" },
  { symbol: "SNTUSDT", display: "SNT/USDT", id: "SNT" },
  { symbol: "BNTUSDT", display: "BNT/USDT", id: "BNT" },
  { symbol: "BCHUSDT", display: "BCH/USDT", id: "BCH" },
  { symbol: "GASUSDT", display: "GAS/USDT", id: "GAS" },
];

const coinIcons = {
  BTC: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  LTC: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
  BNB: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
  NEO: "https://assets.coingecko.com/coins/images/480/large/neo.png",
  QTUM: "https://assets.coingecko.com/coins/images/684/large/qtum.png",
  EOS: "https://assets.coingecko.com/coins/images/738/large/eos-eos-logo.png",
  SNT: "https://assets.coingecko.com/coins/images/779/large/status.png",
  BNT: "https://assets.coingecko.com/coins/images/736/large/bancor.png",
  BCH: "https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png",
  GAS: "https://assets.coingecko.com/coins/images/1785/large/neogas.png",
};

const Markets = () => {
  const [activeTab, setActiveTab] = useState("coin");
  const [tradingPairs, setTradingPairs] = useState(
    coins.map((coin) => ({
      ...coin,
      price: "0.0000",
      status: Math.random() > 0.5 ? "in transaction" : "closed",
      image: coinIcons[coin.id],
    }))
  );

  const fetchPrices = async () => {
    try {
      // Changed endpoint to Binance's public market-data domain (not geo-blocked in the US)
      const response = await fetch("https://data-api.binance.vision/api/v3/ticker/24hr");
      const data = await response.json();

      const updatedPairs = coins.map((coin) => {
        const coinData = data.find((d) => d.symbol === coin.symbol);
        const price = coinData ? parseFloat(coinData.lastPrice).toFixed(4) : "0.0000";
        return {
          ...coin,
          price,
          status: Math.random() > 0.5 ? "in transaction" : "closed",
          image: coinIcons[coin.id],
        };
      });

      setTradingPairs(updatedPairs);
    } catch (error) {
      console.error("Failed to fetch Binance prices:", error);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white font-sans">
      {/* Header — same style as Withdraw (no back arrow) */}
      <div className="flex items-center justify-center px-4 py-3 -mt-6 border-b border-blue-900">
        <h1 className="text-base font-medium">Transaction Quote</h1>
      </div>

      {/* Main Content (reduced top padding) */}
      <div className="flex flex-col items-center pt-2 pb-2">
        <div className="w-full max-w-3xl space-y-3">
          {/* Tabs */}
          <div className="flex bg-gray-800 rounded-full p-1 w-full max-w-lg mx-auto shadow-inner">
            <button
              onClick={() => setActiveTab("optional")}
              className={`flex-1 px-8 py-1 rounded-full text-sm font-medium transition ${
                activeTab === "optional"
                  ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Optional
            </button>
            <button
              onClick={() => setActiveTab("coin")}
              className={`flex-1 px-8 py-1 rounded-full text-sm font-medium transition ${
                activeTab === "coin"
                  ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Coin
            </button>
          </div>

          {/* Table */}
          {activeTab === "coin" && (
            <>
              <div className="grid grid-cols-3 text-gray-400 text-sm font-semibold pl-3 pr-6 py-2 border-b border-gray-800">
                <div>Trading Pair</div>
                <div className="text-center">Status</div>
                <div className="text-right">Latest Price</div>
              </div>

              {tradingPairs.map((coin, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 items-center pl-3 pr-6 py-2 border-b border-gray-800 hover:bg-slate-800/30 transition"
                >
                  <div className="flex items-center space-x-2">
                    <img src={coin.image} alt={coin.symbol} className="w-5 h-5 rounded-full" />
                    <span className="text-white text-xs font-semibold">{coin.display}</span>
                  </div>

                  <div className="flex justify-center">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        coin.status === "in transaction"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {coin.status}
                    </span>
                  </div>

                  <div
                    className={`text-sm font-bold text-right ${
                      coin.status === "in transaction" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {coin.price}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "optional" && (
            <div className="text-center text-gray-400 py-6">
              No optional data yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Markets;