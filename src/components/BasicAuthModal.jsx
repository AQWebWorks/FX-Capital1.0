import React, { useState } from "react";

const BasicAuthModal = ({ isOpen, onClose }) => {
  const [idType, setIdType] = useState("ID Card");
  const [holderName, setHolderName] = useState("");
  const [idNumber, setIdNumber] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-gray-900 text-white rounded-2xl shadow-2xl w-96 p-6 z-10">
        <h2 className="text-lg font-bold mb-4">Basic authentication</h2>

        {/* ID Type */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">ID Type :</label>
          <select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded-lg border border-gray-700"
          >
            <option>ID Card</option>
            <option>Passport</option>
            <option>Driver License</option>
          </select>
        </div>

        {/* Account Holder Name */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Account Holder Name :
          </label>
          <input
            type="text"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded-lg border border-gray-700"
            placeholder="Enter account holder name"
          />
        </div>

        {/* ID number */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">ID number :</label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded-lg border border-gray-700"
            placeholder="Enter ID number"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log("Submitted:", { idType, holderName, idNumber });
              onClose();
            }}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicAuthModal;
