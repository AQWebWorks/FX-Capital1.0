import React from "react";
import { FiPieChart, FiBriefcase } from "react-icons/fi";
import { ArrowLeftRight, CandlestickChart } from "lucide-react";

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: "dashboard",
      label: "Home",
      icon: <img src="/Logo.png" alt="home" width={24} height={24} />,
    },
    {
      id: "markets",
      label: "Markets",
      icon: (isActive) => (
        <CandlestickChart
          size={22}
          strokeWidth={2.5}
          className={isActive ? "text-blue-500" : "text-gray-400"}
        />
      ),
    },
    {
      id: "trade",
      label: "Trade",
      // 🔵 Always blue gradient circle
      icon: () => (
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
          <ArrowLeftRight size={18} strokeWidth={2.5} className="text-white" />
        </div>
      ),
    },
    {
      id: "finance",
      label: "Finance",
      icon: (isActive) => (
        <FiPieChart
          size={20}
          className={isActive ? "text-blue-500" : "text-gray-400"}
        />
      ),
    },
    {
      id: "assets",
      label: "Assets",
      icon: (isActive) => (
        <FiBriefcase
          size={20}
          className={isActive ? "text-blue-500" : "text-gray-400"}
        />
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-poloniex-gray py-2 border-t border-gray-700 z-50">
      <div className="container mx-auto flex justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mb-1">
                {typeof tab.icon === "function" ? tab.icon(isActive) : tab.icon}
              </span>
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
