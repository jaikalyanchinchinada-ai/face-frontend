import React, { useState } from "react";

const grad = "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)";

const steps = [
  "Fill in your name, username and password",
  "Click Face Verification to open camera",
  "Fit your face in oval — turn left, right, up, down",
  "AI detects your real age and gender automatically",
  "Account created with verified identity",
];

export default function Register({ onSwitch }) {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* LEFT - Signup Form */}
      <div style={{ width: "280px", flexShrink: 0, background: "#000",
        borderRight: "0.5px solid #1a1a1a", display: "flex",
        flexDirection: "column", alignItems: "center", padding: "32px 24px 24px" }}>

        <div style={{ fontSize: "22px", fontWeight: 900, background: grad,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", marginBottom: "4px", textAlign: "center" }}>
          Create Account
        </div>

        <div style={{ fontSize: "9px", color: "#333", letterSpacing: "2px",
          textTransform: "uppercase", marginBottom: "22px" }}>
          Join Social Media
        </div>

        {/* First Name */}
        <div style={{ width: "100%", marginBottom: "8px" }}>
          <div style={{ fontSize: "9px", color: "#444", fontWeight: 700,
            letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "4px" }}>
            First Name
          </div>
          <input placeholder="First name" value={name1}
            onChange={e => setName1(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", background: "#111",
              border: "0.5px solid #2a2a2a", borderRadius: "5px",
              fontSize: "13px", color: "#fff", outline: "none" }} />
        </div>

        {/* Second Name */}
        <div style={{ width: "100%", marginBottom: "8px" }}>
          <div style={{ fontSize: "9px", color: "#444", fontWeight: 700,
            letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "4px" }}>
            Second Name
          </div>
          <input placeholder="Second name" value={name2}
            onChange={e => setName2(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", background: "#111",
              border: "0.5px solid #2a2a2a", borderRadius: "5px",
              fontSize: "13px", color: "#fff", outline: "none" }} />
        </div>

        {/* Username */}
        <div style={{ width: "100%", marginBottom: "8px" }}>
          <div style={{ fontSize: "9px", color: "#444", fontWeight: 700,
            letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "4px" }}>
            Username
          </div>
          <input placeholder="Username" value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", background: "#111",
              border: "0.5px solid #2a2a2a", borderRadius: "5px",
              fontSize: "13px", color: "#fff", outline: "none" }} />
        </div>

        {/* Password */}
        <div style={{ width: "100%", marginBottom: "12px" }}>
          <div style={{ fontSize: "9px", color: "#444", fontWeight: 700,
            letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "4px" }}>
            Password
          </div>
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", background: "#111",
              border: "0.5px solid #2a2a2a", borderRadius: "5px",
              fontSize: "13px", color: "#fff", outline: "none" }} />
        </div>

        {/* Face Verify Button */}
        <button onClick={() => onSwitch("camera")}
          style={{ width: "100%", padding: "11px", background: grad,
            border: "none", borderRadius: "7px", marginBottom: "8px",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "9px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>
            Face Verification
          </span>
        </button>

        {/* Auto detect note */}
        <div style={{ width: "100%", background: "#0d0d0d",
          border: "0.5px solid #222", borderRadius: "6px",
          padding: "8px 12px", textAlign: "center",
          fontSize: "11px", color: "#555", marginBottom: "14px" }}>
          Auto detects →{" "}
          <span style={{ background: grad, WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", backgroundClip: "text",
            fontWeight: 700 }}>
            Gender & Age
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px",
          width: "100%", marginBottom: "12px" }}>
          <div style={{ flex: 1, height: "0.5px", background: "#1a1a1a" }} />
          <div style={{ fontSize: "10px", color: "#333", fontWeight: 700 }}>OR</div>
          <div style={{ flex: 1, height: "0.5px", background: "#1a1a1a" }} />
        </div>

        <button onClick={() => onSwitch("login")}
          style={{ width: "100%", padding: "10px", background: "transparent",
            border: "0.5px solid #222", borderRadius: "7px",
            fontSize: "12px", color: "#555", cursor: "pointer" }}>
          Already have an account? Log in
        </button>
      </div>

      {/* RIGHT - Info */}
      <div style={{ flex: 1, background: "#000", padding: "32px 28px",
        display: "flex", flexDirection: "column", gap: "14px" }}>

        <div style={{ fontSize: "17px", fontWeight: 700, background: grad,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text" }}>
          Sign up with face verification
        </div>

        <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.7" }}>
          When you click Face Verification our AI camera will automatically
          detect your real age and gender. This ensures every account on
          Social Media is genuine and safe.
        </div>

        <div style={{ background: "#0d0d0d", border: "0.5px solid #1a1a1a",
          borderRadius: "10px", padding: "18px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#444",
            textTransform: "uppercase", letterSpacing: "0.5px",
            marginBottom: "14px" }}>
            What happens during sign up
          </div>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "12px",
              alignItems: "center", marginBottom: "12px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%",
                background: grad, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "11px", color: "#fff",
                fontWeight: 700, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.5" }}>
                {step}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#0d0d0d", border: "0.5px solid #f59e0b",
          borderRadius: "8px", padding: "10px 14px",
          display: "flex", gap: "10px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%",
            background: "#f59e0b", flexShrink: 0, marginTop: "3px" }} />
          <div style={{ fontSize: "11px", color: "#f59e0b", lineHeight: "1.6" }}>
            Age prediction may vary by ±3–5 years. Gender detection is
            approx 90% accurate and used as a safety reference only.
          </div>
        </div>
      </div>
    </div>
  );
}