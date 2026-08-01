import React, { useState, useEffect, useRef } from "react";
import { FiUser, FiShield, FiInfo, FiGlobe, FiDollarSign, FiLogOut } from "react-icons/fi";
import PersonalInfoModal from "./PersonalInfoModal";
import AuthenticationModal from "./AuthenticationModal";

const languages = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Spanish" },
  { code: "FR", name: "French" },
  { code: "AR", name: "Arabic" },
  { code: "DE", name: "German" },
  { code: "CN", name: "Chinese" },
  { code: "JP", name: "Japanese" },
  { code: "RU", name: "Russian" },
  { code: "PT", name: "Portuguese" },
  { code: "IT", name: "Italian" },
  { code: "TR", name: "Turkish" },
];

const Sidebar = ({ onClose, user, onLogout, onNavigate }) => {
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const languageRef = useRef(null);

  // Disable background scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Sidebar Panel */}
      <div className="absolute left-0 top-0 h-full w-80 bg-gray-900 shadow-2xl transform transition-transform duration-300 overflow-y-auto">
        {/* Compact Profile Header */}
        <div className="p-4 border-b border-gray-700 flex flex-col items-center bg-gray-900 rounded-b-xl">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold ring-2 ring-gray-700">
            {user?.name ? user.name.charAt(0) : "G"}
          </div>

          {/* Name */}
          <h2 className="text-white mt-2 font-semibold text-md">
            {JSON.parse(localStorage.getItem("user")).username || "Guest User"}
          </h2>

          {/* Balance */}
          <p className="text-gray-300 text-xs mt-1">
            Balance: <span className="font-medium">{localStorage.getItem("balance")}</span>
          </p>

          {/* Verification Status */}
          {/* <span
            className={`mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${user?.verified ? "bg-green-600 text-white" : "bg-red-600 text-white"
              }`}
          >
            {user?.verified ? "Verified" : "Unverified"}
          </span> */}
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {/* Authentication */}
          <button
            onClick={() => setShowAuth(true)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
          >
            <FiShield size={18} />
            <span>Authentication</span>
          </button>

          {/* Personal Info */}
          <button
            onClick={() => setShowPersonalInfo(true)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
          >
            <FiUser size={18} />
            <span>Personal Information</span>
          </button>

          {/* Default Fiat Currency */}
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition">
            <FiDollarSign size={18} />
            <span>Default Fiat Currency</span>
            <span className="ml-auto text-gray-400 text-sm">USDT</span>
          </button>

          {/* Select Language */}
          <div className="relative" ref={languageRef}>
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
            >
              <FiGlobe size={18} />
              <span>Select Language</span>
              <span className="ml-auto text-gray-400 text-sm">{selectedLanguage}</span>
            </button>

            {/* Language Dropdown */}
            {showLanguageMenu && (
              <ul className="absolute left-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg overflow-y-auto max-h-48 z-10">
                {languages.map((lang) => (
                  <li
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.name);
                      setShowLanguageMenu(false);
                    }}
                    className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200 ${selectedLanguage === lang.name ? "bg-gray-700 font-semibold" : ""
                      }`}
                  >
                    {lang.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* About Us */}
          <button
            onClick={() => {
              onNavigate("aboutus");
              onClose();
            }}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
          >
            <FiInfo size={18} />
            <span>About Us</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-gray-700">
          {/* Exit button: shows confirmation modal */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center space-x-2"
          >
            <FiLogOut size={18} />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 w-80 p-6 flex flex-col items-center animate-scale-up">
            {/* Icon (optional) */}
            <div className="w-14 h-14 mb-4 flex items-center justify-center bg-red-600 rounded-full text-white text-2xl font-bold shadow-lg">
              !
            </div>

            {/* Heading */}
            <h2 className="text-white text-xl font-bold mb-6 text-center">
              Are you sure you want to logout?
            </h2>

            {/* Buttons */}
            <div className="flex w-full justify-between gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setShowLogoutConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold shadow-lg hover:scale-105 transition transform"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AuthenticationModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />
      <PersonalInfoModal
        isOpen={showPersonalInfo}
        onClose={() => setShowPersonalInfo(false)}
        user={user}
      />
    </div>
  );
};

export default Sidebar;
