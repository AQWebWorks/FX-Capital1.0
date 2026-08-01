import React, { useState } from "react";

const Settings = ({ setShowSidebar, setShowAuthModal }) => {
  const [settings, setSettings] = useState({
    authentication: false,
    defaultCurrency: "USDT",
    language: "English",
  });

  return (
    <div className='flex justify-center py-8'>
      <div className='bg-[#1a1a1a] max-w-lg w-full rounded-2xl shadow-lg p-6 border border-gray-800'>
        {/* Heading */}
        <h2 className='text-xl font-semibold mb-6 text-center text-yellow-400 border-b border-gray-700 pb-3'>
          Settings
        </h2>

        {/* Settings List */}
        <div className='space-y-4 mb-6'>
          {/* Authentication Toggle */}
          <div className='flex items-center justify-between p-4 bg-[#222] rounded-xl border border-gray-700 hover:bg-[#2a2a2a] transition'>
            <span className='text-gray-200 font-medium'>Authentication</span>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                className='sr-only peer'
                checked={settings.authentication}
                onChange={() =>
                  setSettings({
                    ...settings,
                    authentication: !settings.authentication,
                  })
                }
              />
              <div className='w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition relative'>
                <div className='absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5' />
              </div>
            </label>
          </div>

          {/* Personal Info */}
          <div className='flex items-center justify-between p-4 bg-[#222] rounded-xl border border-gray-700 hover:bg-[#2a2a2a] transition'>
            <span className='text-gray-200 font-medium'>
              Personal Information
            </span>
            <span className='text-green-400 font-bold'>✓</span>
          </div>

          {/* Default Fiat Currency */}
          <div className='flex items-center justify-between p-4 bg-[#222] rounded-xl border border-gray-700 hover:bg-[#2a2a2a] transition'>
            <span className='text-gray-200 font-medium'>
              Default Fiat Currency
            </span>
            <select
              className='bg-[#1a1a1a] border border-gray-600 text-gray-200 px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500'
              value={settings.defaultCurrency}
              onChange={(e) =>
                setSettings({ ...settings, defaultCurrency: e.target.value })
              }
            >
              <option value='USDT'>USDT</option>
              <option value='USD'>USD</option>
              <option value='EUR'>EUR</option>
            </select>
          </div>

          {/* Language */}
          <div className='flex items-center justify-between p-4 bg-[#222] rounded-xl border border-gray-700 hover:bg-[#2a2a2a] transition'>
            <span className='text-gray-200 font-medium'>Select Language</span>
            <select
              className='bg-[#1a1a1a] border border-gray-600 text-gray-200 px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500'
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
            >
              <option value='English'>English</option>
              <option value='Chinese'>Chinese</option>
              <option value='Spanish'>Spanish</option>
            </select>
          </div>

          {/* About Us */}
          <div className='flex items-center justify-between p-4 bg-[#222] rounded-xl border border-gray-700 hover:bg-[#2a2a2a] transition'>
            <span className='text-gray-200 font-medium'>About Us</span>
            <button className='text-blue-400 text-sm hover:underline'>
              View
            </button>
          </div>
        </div>

        {/* Modify Password */}
        <button
          className='w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-medium hover:opacity-90 active:scale-[0.98] transition'
          onClick={() => setShowAuthModal(true)}
        >
          Modify Password
        </button>
      </div>
    </div>
  );
};

export default Settings;
