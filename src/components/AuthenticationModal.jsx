import React, { useState } from "react";
import BasicAuthModal from "./BasicAuthModal"; // 👈 Import

const AuthenticationModal = ({ isOpen, onClose }) => {
  const [showBasicAuth, setShowBasicAuth] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-gray-900 text-white rounded-2xl shadow-2xl w-96 p-6 z-10">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>

          {/* Basic Authentication */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Basic authentication</p>
            <button
              onClick={() => setShowBasicAuth(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
            >
              Go to authentication
            </button>
          </div>

          {/* Advanced Authentication */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Advanced authentication</p>
            <button
              disabled
              className="w-full bg-gray-700 text-gray-400 font-semibold py-3 rounded-lg cursor-not-allowed"
            >
              Go to authentication
            </button>
          </div>

          {/* Close button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* 👇 Basic Auth Modal */}
      <BasicAuthModal
        isOpen={showBasicAuth}
        onClose={() => setShowBasicAuth(false)}
      />
    </>
  );
};

export default AuthenticationModal;
