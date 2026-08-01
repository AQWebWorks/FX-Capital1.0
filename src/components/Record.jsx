import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const Record = ({ onClose }) => {
  const [records, setRecords] = useState([])
  useEffect(() => {
    requestHistory()
  }, [])
  async function requestHistory() {
    try {
      const resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/with-drawal/get-all-for-user`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })
      const formattedPayload = resp.data.message.allRequests.map((item) => ({
        id: item.id,
        amount: item.amount,
        fee: 0,
        status: item.status,
        date: item.createdAt,
      }))
      setRecords(formattedPayload)
    } catch (error) {

    }
  }
  return (
    <div className="fixed inset-0 z-50 bg-[#0b1220] text-white font-sans flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-blue-900 shrink-0">
        <button onClick={onClose} className="text-gray-300 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-center text-base font-medium">Record</h1>
        <div className="w-6" />
      </div>

      {/* Records List (scrollable area) */}
      <div className="overflow-y-auto px-4 py-3 space-y-3 text-sm"
        style={{ height: "calc(100vh - 56px)", paddingBottom: "80px" }}>
        {records.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No records found</p>
        ) : (
          records.map((rec) => (
            <div
              key={rec.id}
              className="p-3 rounded bg-[#121c30] border border-blue-900 shadow-sm"
            >
              {/* Top Row */}
              <div className="flex justify-between items-center">
                <p className="font-medium text-[13px]">Withdrawal</p>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded ${rec.status === "Success"
                    ? "bg-green-700 text-green-100"
                    : rec.status === "Pending"
                      ? "bg-yellow-700 text-yellow-100"
                      : "bg-gray-700 text-gray-200"
                    }`}
                >
                  {rec.status}
                </span>
                <p className="text-sm font-semibold text-blue-400">
                  {rec.amount} USDT
                </p>
              </div>

              {/* Details */}
              <div className="mt-2 text-xs text-gray-400 space-y-0.5">
                <p>
                  Accounts received:{" "}
                  <span className="text-gray-200">{rec.amount} USDT</span>
                </p>
                <p>
                  Fee: <span className="text-gray-200">{rec.fee} USDT</span>
                </p>
                {/* <p>
                  Remark:{" "}
                  <span className="text-gray-200">
                    {rec.remark || "undefined"}
                  </span>
                </p> */}
                <p className="text-[11px] text-gray-500">{rec.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Record;
