import React from "react";

const Futures = () => {
  return (
    <div className="mb-16 flex flex-col items-center font-sans">
      {/* Page Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
        Futures Market
      </h1>

      {/* Main Card */}
      <div className="bg-poloniex-gray rounded-lg p-6 shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6 font-sans">Futures Market</h2>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 font-sans">Funds in custody</h3>
          <p className="text-3xl font-bold mb-6 font-sans">0 USDT</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 font-sans">Estimated today's rate of return</p>
              <p className="text-lg font-sans">0.00 USDT</p>
            </div>
            <div>
              <p className="text-gray-400 font-sans">Cumulative Income</p>
              <p className="text-lg font-sans">0 USDT</p>
            </div>
            <div>
              <p className="text-gray-400 font-sans">Endjusted Orders</p>
              <p className="text-lg font-sans">-</p>
            </div>
            <div>
              <p className="text-gray-400 font-sans">Orders in Custody</p>
              <p className="text-lg font-sans">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Futures;
