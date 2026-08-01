import React, { useState, useEffect } from "react";
import {
  Banknote,
  ArrowUpRight,
  ReceiptText,
  BarChart3,
} from "lucide-react";
import Withdraw from "./Withdraw";
import Recharge from "./Recharge";
import axios from "axios";

const Dashboard = ({ resetSignal, onNavigate }) => {
  const [page, setPage] = useState("dashboard");
  const [currentAd, setCurrentAd] = useState(0);
  const [prices, setPrices] = useState({});
  const [status, setStatus] = useState({});
  const [amount, setAmount] = useState(0);

  const ads = [
    {
      id: 1,
      title: "🔥 Special Offer!",
      content: "Get 0% trading fees for the first month on all BTC pairs",
      bgColor: "bg-gradient-to-r from-blue-800 to-blue-600",
    },
    {
      id: 2,
      title: "✨ New Listing",
      content: "Trade the new YOBAHENT/USDT pair with enhanced liquidity",
      bgColor: "bg-gradient-to-r from-purple-800 to-purple-600",
    },
    {
      id: 3,
      title: "🎁 Referral Bonus",
      content: "Earn 50% commission on every friend you refer to CoinApexia",
      bgColor: "bg-gradient-to-r from-green-800 to-green-600",
    },
  ];

  const coinList = [
    { symbol: "BTCUSDT", pair: "BTC/USDT", logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
    { symbol: "ETHUSDT", pair: "ETH/USDT", logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
    { symbol: "LTCUSDT", pair: "LTC/USDT", logo: "https://assets.coingecko.com/coins/images/2/large/litecoin.png" },
    { symbol: "BNBUSDT", pair: "BNB/USDT", logo: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png" },
    { symbol: "NEOUSDT", pair: "NEO/USDT", logo: "https://assets.coingecko.com/coins/images/480/large/NEO_512_512.png" },
    { symbol: "QTUMUSDT", pair: "QTUM/USDT", logo: "https://assets.coingecko.com/coins/images/684/large/qtum.png" },
    { symbol: "EOSUSDT", pair: "EOS/USDT", logo: "https://assets.coingecko.com/coins/images/738/large/eos-eos-logo.png" },
    { symbol: "SNTUSDT", pair: "SNT/USDT", logo: "https://assets.coingecko.com/coins/images/779/large/status.png" },
    { symbol: "BNTUSDT", pair: "BNT/USDT", logo: "https://assets.coingecko.com/coins/images/736/large/bancor.png" },
    { symbol: "BCHUSDT", pair: "BCH/USDT", logo: "https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png" },
    { symbol: "GASUSDT", pair: "GAS/USDT", logo: "https://assets.coingecko.com/coins/images/858/large/gas.png" },
  ];

  // 🔁 Rotate ads every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  // 📊 Binance live prices (using the public market-data stream domain, not geo-blocked in the US)
  useEffect(() => {
    const streamUrl =
      "wss://data-stream.binance.vision/stream?streams=" +
      coinList.map((c) => `${c.symbol.toLowerCase()}@ticker`).join("/");
    const ws = new WebSocket(streamUrl);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message?.data?.s) {
        const symbol = message.data.s;
        const price = parseFloat(message.data.c).toFixed(2);
        setPrices((prev) => ({ ...prev, [symbol]: price }));
        setStatus((prev) => ({
          ...prev,
          [symbol]: Math.random() > 0.3 ? "In transaction" : "Closed",
        }));
      }
    };
    return () => ws.close();
  }, []);

  // 🧠 Reset Dashboard when Home button pressed
  useEffect(() => {
    if (resetSignal) setPage("dashboard");
  }, [resetSignal]);

  useEffect(() => {
    async function getDetail() {
      try {
        let data = await axios.get(`${process.env.REACT_APP_BASE_URL}/wallet/details`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });
        setAmount(Number(data.data.message.balance || 0).toFixed(2));
        localStorage.setItem("balance", Number(data.data.message.balance || 0).toFixed(2));
      } catch (error) {
        console.error("Failed to fetch wallet details:", error);
      }
    }
    getDetail();
  }, []);

  // 🏠 Dashboard main content
  const renderDashboard = () => (
    <div className="bg-[#0F172A] min-h-screen font-sans">
      {/* Header Section */}
      <div className="relative border-b border-gray-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex justify-around items-center -top-6">
          <img src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png" alt="btc" className="w-20 h-20 animate-slowspin" />
          <img src="https://assets.coingecko.com/coins/images/279/large/ethereum.png" alt="eth" className="w-16 h-16 animate-float" />
          <img src="https://assets.coingecko.com/coins/images/325/large/Tether-logo.png" alt="usdt" className="w-14 h-14 animate-slowspin" />
        </div>

        <div className="relative z-10 p-2 pt-2">
          <h2 className="text-xs text-gray-400 font-light mb-1">Total assets equivalent (USDT)</h2>
          <p className="text-3xl font-sans text-white tracking-tight mb-3">{localStorage.getItem("balance")}</p>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-4 mt-2">
            {[
              { icon: <Banknote size={24} />, label: "Recharge", action: () => setPage("recharge") },
              { icon: <ArrowUpRight size={24} />, label: "Withdrawal", action: () => setPage("withdrawal") },
              { icon: <ReceiptText size={24} />, label: "Transaction", action: () => onNavigate && onNavigate("tradeFromDashboard") },
              { icon: <BarChart3 size={24} />, label: "Future Market", action: () => onNavigate && onNavigate("finance") },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                className="flex flex-col items-center justify-center py-3 transition"
              >
                <span className="text-[#c49a6c]">{btn.icon}</span>
                <span className="text-xs font-light mt-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  {btn.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ad Banner */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className={`${ads[currentAd].bgColor} rounded-lg p-4 text-white transition-all duration-700`}>
          <h3 className="text-sm font-light mb-1">{ads[currentAd].title}</h3>
          <p className="text-xs font-light opacity-90">{ads[currentAd].content}</p>
        </div>
      </div>

      {/* Scrolling Message */}
      <div className="overflow-hidden whitespace-nowrap py-1 px-3 bg-gray-800 rounded-lg mt-2">
        <div className="inline-block animate-marquee text-white font-light text-xs">
          🔥 In your payment, please feel free to contact our representatives 🔥
          &nbsp; 🔥 In your payment, please feel free to contact our representatives 🔥
        </div>
      </div>

      {/* Coin Table */}
      <div>
        <h3 className="text-lg font-light mb-3 text-white p-2">
          Trade these coins with CryptoGeniux
        </h3>
        <div className="overflow-x-auto p-3">
          <table className="min-w-full border-collapse table-fixed">
            <thead>
              <tr className="text-gray-400 text-[11px] font-light">
                <th className="py-2 text-left w-1/3">Pair</th>
                <th className="py-2 text-center w-1/3">Status</th>
                <th className="py-2 text-right w-1/3">Price</th>
              </tr>
            </thead>
            <tbody>
              {coinList.map((coin, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                  <td className="py-3 flex items-center space-x-3 text-white text-sm w-1/3 font-light">
                    <img src={coin.logo} alt={coin.pair} className="w-5 h-5" />
                    <span>{coin.pair}</span>
                  </td>
                  <td
                    className={`py-2 text-sm w-1/3 text-center font-light ${
                      status[coin.symbol] === "In transaction" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {status[coin.symbol] || "--"}
                  </td>
                  <td className="py-3 text-sm w-1/3 text-right text-white font-sans">
                    {prices[coin.symbol] || "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 🔁 Page switch logic
  return page === "dashboard" ? (
    renderDashboard()
  ) : page === "recharge" ? (
    <Recharge onBack={() => setPage("dashboard")} />
  ) : page === "withdrawal" ? (
    <Withdraw onClose={() => setPage("dashboard")} />
  ) : null;
};

export default Dashboard;