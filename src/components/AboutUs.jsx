import React from "react";
import { ArrowLeft } from "lucide-react";

const AboutUs = ({ onBack }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0b1220] min-h-screen text-white font-sans">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-blue-900">
        <button onClick={onBack} className="text-gray-300 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-center text-base font-medium">About Us</h1>
        <div className="w-6" /> {/* Placeholder for symmetry */}
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 text-sm leading-relaxed">
        {/* Section 1 */}
        <div className="bg-[#121c30] border border-blue-900 rounded-lg p-4">
          <h2 className="text-blue-400 font-semibold mb-2 text-base">
            Payments
          </h2>
          <p className="text-gray-300">
            Dear valued users, if you need assistance with your payments,
            please contact our receptionist team. They’ll help you resolve
            payment-related queries or transaction issues quickly.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-[#121c30] border border-blue-900 rounded-lg p-4">
          <h2 className="text-blue-400 font-semibold mb-2 text-base">
            Bonus Event
          </h2>
          <p className="text-gray-300">
            Participate in our latest reset bonus event and unlock exclusive
            rewards! Get in touch with our customer service team for more
            details about ongoing promotions and eligibility.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-[#121c30] border border-blue-900 rounded-lg p-4">
          <h2 className="text-blue-400 font-semibold mb-2 text-base">
            Our Vision
          </h2>
          <p className="text-gray-300">
            Our mission is to create a secure, user-friendly, and transparent
            trading environment where users can trade digital assets with
            confidence. We’re committed to innovation, reliability, and
            long-term trust.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
