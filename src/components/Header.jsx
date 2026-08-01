import React, { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";

const Header = ({ setShowSidebar }) => {
  const [showLanguages, setShowLanguages] = useState(false);
  const [language, setLanguage] = useState("EN");
  const dropdownRef = useRef(null);

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

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    setShowLanguages(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguages(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-dark px-6 h-14 flex items-center shadow-md relative z-30">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left: Sidebar button */}
        <div className="flex items-center z-40 relative">
          <button
            onClick={() => setShowSidebar(true)}
            className="text-gold focus:outline-none hover:text-yellow-400 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Center: CryptoNexia */}
        <h1 className="text-xl md:text-2xl font-extrabold tracking-wider text-white uppercase font-[Playfair_Display] z-30 relative">
          <span className="text-gold">CryptoGeniux</span>
        </h1>

        {/* Right: Language Selector */}
        <div className="relative z-50" ref={dropdownRef}>
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className="flex items-center gap-1 text-white hover:text-gold transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="font-semibold text-sm">{language}</span>
          </button>

          {showLanguages && (
            <div className="absolute right-0 mt-2 w-40 bg-blue-900 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
