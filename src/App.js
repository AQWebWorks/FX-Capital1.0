// src/App.js
import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import Markets from "./components/Markets";
import Trading from "./components/Trading";
import Finance from "./components/Finance";
import Assets from "./components/Assets";
import Settings from "./components/Settings";
import AboutUs from "./components/AboutUs";
import AuthModal from "./components/AuthModal";
import Sidebar from "./components/Sidebar";
import BackgroundAnimation from "./components/BackgroundAnimation";

function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [dashboardReset, setDashboardReset] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();

  // --- LOGIN SCREEN WITH ANIMATION ---
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-poloniex-dark overflow-hidden">
        {/* Animated coins background */}
        <BackgroundAnimation />

        {/* Auth modal on top */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <AuthModal
            mode="login"
            onClose={() => {}}
            onSuccess={() => setActiveTab("dashboard")}
            alwaysOpen={true} // cannot close until login
          />
        </div>
      </div>
    );
  }

  // --- Handle tab navigation ---
  const handleNavigation = (tab) => {
    if (tab === "dashboard") setDashboardReset((prev) => !prev);
    setActiveTab(tab);
    setShowSidebar(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setActiveTab("dashboard");
  };

  const handleAuthAction = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const renderContent = () => {
    const commonProps = { setShowSidebar, onNavigate: handleNavigation };

    switch (activeTab) {
      case "dashboard": return <Dashboard {...commonProps} resetSignal={dashboardReset} />;
      case "markets": return <Markets {...commonProps} />;
      case "trade":
      case "tradeFromDashboard": return <Trading {...commonProps} />;
      case "finance": return <Finance {...commonProps} />;
      case "assets": return <Assets {...commonProps} />;
      case "settings": return <Settings {...commonProps} />;
      case "aboutus": return <AboutUs onBack={() => handleNavigation("dashboard")} />;
      default: return <Dashboard {...commonProps} />;
    }
  };

  return (
    <div className="App min-h-screen bg-poloniex-dark text-white">
      {activeTab === "dashboard" && (
        <Header
          setShowSidebar={setShowSidebar}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={logout}
          onLogin={() => handleAuthAction("login")}
          onSignup={() => handleAuthAction("signup")}
        />
      )}

      <div className="container mx-auto px-4 py-6 pb-20">
        {renderContent()}
      </div>

      {activeTab !== "aboutus" && (
        <Navigation activeTab={activeTab} setActiveTab={handleNavigation} />
      )}

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {showSidebar && (
        <Sidebar
          activeTab={activeTab}
          onNavigate={handleNavigation}
          onClose={() => setShowSidebar(false)}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogin={() => handleAuthAction("login")}
          onSignup={() => handleAuthAction("signup")}
          onLogout={logout}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
