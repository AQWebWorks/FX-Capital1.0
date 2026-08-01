// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from "react";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
    setUserId(params.get("id") || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setError("Password too short (min 6)");
    if (password !== confirm) return setError("Passwords do not match");
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong");
    }
  };

  if (!token || !userId) {
    return <div className="container p-6">Invalid reset link.</div>;
  }

  return (
    <div className="container p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Set a new password</h2>
      {status === "success" ? (
        <div>
          <p>Password changed — you can now login.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full mb-3" />
          <input type="password" placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} required className="w-full mb-3" />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button className="btn" type="submit">{status === "loading" ? "Saving..." : "Save password"}</button>
        </form>
      )}
    </div>
  );
}
