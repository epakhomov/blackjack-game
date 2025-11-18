import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [protectedMsg, setProtectedMsg] = useState("");
  const { token, login, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      login(data.token);
      setMessage("Login successful!");
      setEmail("");
      setPassword("");
    } else {
      setMessage(data.error || "Login failed");
    }
  };

  const callProtected = async () => {
    setProtectedMsg("");
    const res = await fetch("/api/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setProtectedMsg(`Protected: ${data.message} (User: ${data.user.email})`);
    } else {
      setProtectedMsg(data.error || "Failed to call protected API");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <h2 className="text-xl mb-4">Login</h2>
      {!token ? (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="block w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="block w-full mb-2 p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
          {message && <div className="mt-2 text-red-600">{message}</div>}
        </form>
      ) : (
        <div>
          <div className="mb-2">Logged in!</div>
          <button onClick={callProtected} className="w-full bg-green-600 text-white p-2 rounded mb-2">Call Protected API</button>
          <button onClick={logout} className="w-full bg-gray-600 text-white p-2 rounded">Logout</button>
          {protectedMsg && <div className="mt-2 text-blue-600">{protectedMsg}</div>}
        </div>
      )}
    </div>
  );
}
