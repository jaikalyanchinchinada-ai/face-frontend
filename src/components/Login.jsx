import React from "react";

const grad = "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)";

const threats = [
  { icon: "🪤", name: "Honey trapping", tag: "High risk",
    tagBg: "rgba(239,68,68,0.1)", tagColor: "#ef4444",
    desc: "Fake attractive profiles lure users into emotional or financial traps using stolen photos." },
  { icon: "⚧️", name: "Fake gender", tag: "Identity threat",
    tagBg: "rgba(139,92,246,0.1)", tagColor: "#8b5cf6",
    desc: "Users misrepresent gender to deceive others in social and dating contexts causing harm." },
  { icon: "🎂", name: "Fake age", tag: "Age safety",
    tagBg: "rgba(245,158,11,0.1)", tagColor: "#f59e0b",
    desc: "Minors lie about age to access adult content. Adults target and groom teenagers." },
  { icon: "🎭", name: "Catfishing", tag: "Fraud",
    tagBg: "rgba(188,24,136,0.1)", tagColor: "#bc1888",
    desc: "Fake identities built to manipulate victims emotionally or financially." },
];

export default function Login({ onSwitch }) {
  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* LEFT - Login Form */}
      <div style={{ width: "280px", flexShrink: 0, background: "#000",
        borderRight: "0.5px solid #1a1a1a", display: "flex",
        flexDirection: "column", alignItems: "center", padding: "40px 24px 24px" }}>

        <div style={{ fontSize: "28px", fontWeight: 900, background: grad,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", marginBottom: "4px" }}>
          Social Media
        </div>

        <div style={{ fontSize: "9px", color: "#333", letterSpacing: "2px",
          textTransform: "uppercase", marginBottom: "28px" }}>
          Safe · Verified · Trusted
        </div>

        <div style={{ fontSize: "20px", color: "#444", marginBottom: "12px" }}>@</div>

        <input placeholder="Username or email"
          style={{ width: "100%", padding: "10px 12px", background: "#111",
            border: "0.5px solid #2a2a2a", borderRadius: "5px",
            fontSize: "13px", color: "#fff", marginBottom: "9px", outline: "none" }} />

        <input type="password" placeholder="Password"
          style={{ width: "100%", padding: "10px 12px", background: "#111",
            border: "0.5px solid #2a2a2a", borderRadius: "5px",
            fontSize: "13px", color: "#fff", marginBottom: "9px", outline: "none" }} />

        <div style={{ fontSize: "12px", width: "100%", marginBottom: "10px",
          cursor: "pointer", background: grad, WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Forgot password?
        </div>

        <button onClick={() => onSwitch("camera")}
          style={{ width: "100%", padding: "11px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "9px", background: "linear-gradient(#000,#000) padding-box",
            backgroundImage: "linear-gradient(#000,#000)," + grad,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box,border-box",
            border: "1.5px solid transparent",
            borderRadius: "7px", marginBottom: "16px" }}>
          <div style={{ width: "18px", height: "18px", borderRadius: "50%",
            background: grad, display: "flex", alignItems: "center",
            justifyContent: "center" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <span style={{ background: grad, WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", backgroundClip: "text",
            fontSize: "13px", fontWeight: 700 }}>
            Face Verification
          </span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px",
          width: "100%", marginBottom: "14px" }}>
          <div style={{ flex: 1, height: "0.5px", background: "#1a1a1a" }} />
          <div style={{ fontSize: "10px", color: "#333", fontWeight: 700 }}>OR</div>
          <div style={{ flex: 1, height: "0.5px", background: "#1a1a1a" }} />
        </div>

        <button onClick={() => onSwitch("signup")}
          style={{ width: "100%", padding: "10px", background: "transparent",
            border: "1.5px solid #333", borderRadius: "7px",
            fontSize: "13px", fontWeight: 700, cursor: "pointer",
            color: "#888" }}>
          Sign Up
        </button>
      </div>

      {/* RIGHT - Why section */}
      <div style={{ flex: 1, background: "#000", padding: "32px 28px",
        display: "flex", flexDirection: "column", gap: "16px" }}>

        <div style={{ fontSize: "17px", fontWeight: 700, background: grad,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text" }}>
          Why face verification?
        </div>

        <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.7" }}>
          Social Media uses AI face verification to protect every user from
          the most dangerous online threats.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {threats.map((t) => (
            <div key={t.name} style={{ background: "#0d0d0d",
              border: "0.5px solid #1a1a1a", borderRadius: "10px", padding: "14px" }}>
              <div style={{ fontSize: "20px", marginBottom: "8px" }}>{t.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#ddd",
                marginBottom: "5px" }}>{t.name}</div>
              <div style={{ fontSize: "11px", color: "#555", lineHeight: "1.5" }}>
                {t.desc}
              </div>
              <div style={{ display: "inline-block", padding: "3px 9px",
                borderRadius: "20px", fontSize: "9px", fontWeight: 700,
                marginTop: "8px", background: t.tagBg, color: t.tagColor }}>
                {t.tag}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {["React.js","face-api.js","Python Flask","SQLite","AI / ML"].map(t => (
            <span key={t} style={{ padding: "3px 10px", borderRadius: "20px",
              fontSize: "10px", fontWeight: 600, background: "#111",
              border: "0.5px solid #222", color: "#555" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}