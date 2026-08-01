import React, { useEffect, useState } from "react";
import {
  Wallet,
  ArrowDownUp,
  BarChart3,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import Withdraw from "./Withdraw";
import Recharge from "./Recharge";
import axios from "axios";

const Assets = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("ON_GOING");
  const [showAssets, setShowAssets] = useState(true);
  const [page, setPage] = useState("assets");
  const [balance, setBalance] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [todayEarning, setTodayEarning] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    async function getDetail() {
      try {
        let data = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/wallet/details`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setBalance(data.data.message.balance);
        setRevenue(data.data.message.revenue);
        setTodayEarning(data.data.message.todayEarnings);
        localStorage.setItem("balance", data.data.message.balance);
      } catch (err) {
        console.error("Error fetching wallet details:", err);
      }
    }
    getDetail();
  }, []);

  useEffect(() => {
    async function getDetail() {
      try {
        let data = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/order-set/user-order/${activeTab}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (activeTab === 'ON_GOING') {
          const orders = data.data.orders
          const positionData = orders.map(order => ({
            id: order._id,
            pair: order.coin,
            direction: order.direction,
            openingPrice: order.opening_price,
            amount: order.amount,
            status: order.earned_status,
            duration: order.order_duration,
            buyTime: order.start_time
          }))
          console.log(positionData)
          setPositions(positionData);
        }
        else if (activeTab === 'COMPLETED') {
          const orders = data.data.orders
          const historyData = orders.map(order => ({
            id: order._id,
            pair: order.coin,
            direction: order.direction,
            openingPrice: order.opening_price,
            amount: order.amount,
            duration: order.order_duration,
            buyTime: order.start_time,
            sellTime: order.end_time,
            result: order.earned_status
          }))
          setHistoryData(historyData);
        }
      } catch (err) {
        console.error("Error fetching wallet details:", err);
      }
    }
    getDetail();


  }, [activeTab]);

  const renderWithdraw = () => <Withdraw onClose={() => setPage("assets")} />;

  const renderRecharge = () => <Recharge onBack={() => setPage("assets")} />;

  // Assets Main Page
  const renderAssets = () => (
    <div className="fixed inset-0 z-50 bg-[#0a1a2f] min-h-screen text-white font-sans overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-center px-5 py-2 border-b border-blue-900">
        <h1 className="text-base font-medium m-0">Available Assets</h1>
      </div>

      {/* Assets Card */}
      <div className="w-full px-5 py-5">
        <div className="bg-gradient-to-b from-[#fbe9d7] to-[#f7d6ad] w-full rounded-xl shadow p-4 text-black mb-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs flex items-center gap-1">
              Convert total assets
              <span
                className="cursor-pointer"
                onClick={() => setShowAssets(!showAssets)}
              >
                {showAssets ? <Eye size={16} /> : <EyeOff size={16} />}
              </span>
            </p>
            <button className="bg-[#6b4c1f] text-white text-[11px] px-3 py-1 rounded-full">
              Account change record →
            </button>
          </div>

          {/* Total Assets */}
          <p className="text-2xl font-bold mb-4 flex items-center gap-2">
            {showAssets ? balance : "****"}
            <span className="text-sm font-normal">USDT</span>
          </p>

          {/* Asset Stats */}
          <div className="grid grid-cols-3 text-xs">
            <div>
              <p className="text-gray-600">Today's income(USDT)</p>
              <p className="font-semibold text-base">{todayEarning}</p>
            </div>
            <div>
              <p className="text-gray-600">Total revenue(USDT)</p>
              <p className="font-semibold text-base">{revenue}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-around text-center text-xs text-white mb-8">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setPage("recharge")}
          >
            <Wallet className="w-6 h-6 mb-1 text-[#c49a6c]" />
            <span>Recharge</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setPage("withdraw")}
          >
            <ArrowDownUp className="w-6 h-6 mb-1 text-[#c49a6c]" />
            <span>Withdrawal/Transfer</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => {
              if (onNavigate) onNavigate("finance");
              setPage(null);
            }}
          >
            <BarChart3 className="w-6 h-6 mb-1 text-[#c49a6c]" />
            <span>Futures Market</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#2a2a2a] rounded-full p-1 mb-8">
          <button
            onClick={() => setActiveTab("ON_GOING")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${activeTab === "ON_GOING"
              ? "bg-gradient-to-r from-[#fbe9d7] to-[#f7d6ad] text-black"
              : "text-white"
              }`}
          >
            Position
          </button>
          <button
            onClick={() => setActiveTab("COMPLETED")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${activeTab === "COMPLETED"
              ? "bg-gradient-to-r from-[#fbe9d7] to-[#f7d6ad] text-black"
              : "text-white"
              }`}
          >
            History
          </button>
        </div>

        {/* Position Tab */}
        {activeTab === "ON_GOING" && (
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {positions?.length > 0 ? (
              positions.map((pos, index) => (
                <div
                  key={pos.id}
                  className="bg-[#1a2b45] border border-gray-700 rounded-xl p-4 text-sm text-gray-200"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-white">
                      {pos.pair}
                    </span>
                    <span
                      className={
                        pos.direction === "BUY"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {pos.direction}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1">
                    <span className="text-gray-400">Opening Price:</span>
                    <span>{pos.openingPrice}</span>

                    <span className="text-gray-400">Purchase Amount:</span>
                    <span>{pos.amount} USDT</span>

                    <span className="text-gray-400">Duration:</span>
                    <span>{pos.duration}s</span>

                    <span className="text-gray-400">Status:</span>
                    <span className="text-yellow-400">{pos.status}</span>

                    <span className="text-gray-400">Buy Time:</span>
                    <span>{pos.buyTime}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <FileText className="w-12 h-12 mb-2 text-gray-500" />
                <p className="text-sm">No active positions</p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "COMPLETED" && (
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {historyData?.length > 0 ? (
              historyData.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-[#1a2b45] border border-gray-700 rounded-xl p-4 text-sm text-gray-200"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-white">{item.pair}</span>
                    <span
                      className={
                        item.result === "TOTAL_PROFIT"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {item.result === 'TOTAL_PROFIT' ? 'PROFIT' : 'LOSS' || "Completed"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1">
                    <span className="text-gray-400">Direction:</span>
                    <span
                      className={
                        item.direction === "BUY"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {item.direction}
                    </span>

                    <span className="text-gray-400">Opening Price:</span>
                    <span>{item.openingPrice}</span>

                    <span className="text-gray-400">Purchase Amount:</span>
                    <span>{item.amount} USDT</span>

                    <span className="text-gray-400">Order Duration:</span>
                    <span>{item.duration}</span>

                    <span className="text-gray-400">Buy Time:</span>
                    <span>{item.buyTime}</span>

                    <span className="text-gray-400">Sell Time:</span>
                    <span>{item.sellTime}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <FileText className="w-12 h-12 mb-2 text-gray-500" />
                <p className="text-sm">No trading history yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Main return
  return page === "assets"
    ? renderAssets()
    : page === "recharge"
      ? renderRecharge()
      : renderWithdraw();
};

export default Assets;