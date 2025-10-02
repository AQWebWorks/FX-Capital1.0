import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PersonalInfoModal = ({ isOpen, onClose, user }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-gray-900 w-96 rounded-xl shadow-xl p-6 z-50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-4">
          <h2 className="text-lg font-semibold text-white">
            Modify Login Password
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-gray-400 text-sm">Name</label>
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
            />
          </div>

          {/* Account */}
          <div>
            <label className="text-gray-400 text-sm">Account</label>
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
            />
          </div>

          {/* Current Password */}
          <div>
            <label className="text-gray-400 text-sm">Current login password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Please enter the current login password"
                className="w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showCurrent ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-gray-400 text-sm">New login password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Please enter a new login password"
                className="w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showNew ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-400 text-sm">Confirm new password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Please enter a new password to confirm"
                className="w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-lg hover:opacity-90 transition">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoModal;
