// Recharge.jsx
import React, { useState } from "react";
import { ArrowLeft, X, UploadCloud } from "lucide-react";
import axios from "axios";

const Recharge = ({ onBack }) => {
  const [amount, setAmount] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileURL] = useState(null)

  const rechargeOptions = [500, 2000, 5000, 10000, 50000];

  const handleFileChange = async (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log("here")
      try {
        const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/image-upload`, { image: file }, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        });

        setSelectedFile(file);
        setFileURL(res.data.data.url)
        console.log("✅ Upload success:", res.data);
      } catch (error) {
        console.error("❌ Upload failed:", error);
      }
      alert(`Uploaded: ${file.name}`);
    }
  };

  const removeFile = () => setSelectedFile(null);

  const handleSubmit = async () => {
    try {
      if (!amount || !selectedFile) {
        alert("Please select amount and upload an image!");
        return;
      }

      await axios.post(`${process.env.REACT_APP_BASE_URL}/wallet/recharge`, {
        amountRecharged: amount, paymentUrl: fileUrl
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })
      alert(`Recharge request submitted: ${amount} USDT`);
      setAmount(0)
      setFileURL(null)
      setSelectedFile(null)
    } catch (error) {
      alert("Recharge Failed")
    }

  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A1A2F] min-h-screen text-white font-sans overflow-y-auto pb-[calc(6rem+env(safe-area-inset-bottom))]">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-blue-900">
        <button
          onClick={onBack}
          className="text-gray-300 hover:text-white transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-center text-base font-medium text-white">
          Recharge
        </h1>
        <div className="w-6" />
      </div>

      {/* Wallet Addresses */}
      <div className="space-y-3 px-4 mt-6">
        {[
          { label: "USDT (TRC20)", value: "TEGTTcWuEwqc39b3RFZJVNbQnT5oNygXJa" },
          {
            label: "USDT (ERC20)",
            value: "0x84323b0a2809e939e97db9d0fd2f75946ee0cd75",
          },
          { label: "BTC", value: "bc1qedmwyztw28ddyhxkfqtrv0mxrekca98mc0zjve" },
          { label: "ETH", value: "0x4756328b26EC04F6bFa0B9f249D297FC9dE5b40b" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-[#10243D]/70 rounded-md px-3 py-2 flex justify-between items-center shadow-sm border border-blue-900/30"
          >
            <div>
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-xs break-all text-gray-200">{item.value}</p>
            </div>
            <button
              className="text-blue-400 text-xs px-2 py-1 rounded hover:bg-blue-500/20"
              onClick={() => {
                navigator.clipboard.writeText(item.value);
                alert("Copied to clipboard!");
              }}
            >
              Copy
            </button>
          </div>
        ))}
      </div>

      {/* Recharge Options */}
      <div className="mt-6 px-4">
        <p className="text-sm text-gray-300 mb-2">Recharge Amount (USDT)</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {rechargeOptions.map((value) => (
            <button
              key={value}
              onClick={() => setAmount(value)}
              className={`py-2 rounded-md text-sm font-medium transition shadow-md ${amount === value
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-500/30"
                : "bg-gray-800 text-gray-300 hover:bg-blue-600 hover:text-white"
                }`}
            >
              {value}
            </button>
          ))}
        </div>

        <input
          type="number"
          placeholder="Or enter custom amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-3 w-full px-3 py-2 bg-gray-800 text-base rounded-md outline-none text-white placeholder-gray-400 border border-blue-900/40 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Upload Proof */}
      <div className="mt-6 px-4">
        <p className="text-sm text-gray-300 mb-2">Upload Proof</p>
        <label className="w-full max-h-52 sm:h-32 border-2 border-dashed border-blue-700/60 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 relative bg-gray-900/40 transition-all duration-200">
          {selectedFile ? (
            <>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-full h-full object-contain rounded-md"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1 hover:bg-red-500"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-6">
              <UploadCloud size={32} className="text-blue-400" />
              <span className="text-blue-300 text-sm text-center">
                Click to upload image
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Submit Button */}
      <div className="mt-8 px-4 flex justify-center">
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-800/40 transition"
        >
          Submit
        </button>
      </div>

      {/* Bottom spacing for safe scroll */}
      <div className="h-24"></div>
    </div>
  );
};

export default Recharge;
