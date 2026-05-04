import React from "react";

const grad = "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)";

const threats = [
  { icon: "🪤", name: "Honey trapping",
    tag: "High risk threat", tagBg: "rgba(239,68,68,0.1)", tagColor: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    desc: "Fake attractive profiles lure real users into emotional or financial traps. Scammers use stolen photos to build fake relationships then exploit victims for money or personal data." },
  { icon: "🎂", name: "Fake age",
    tag: "Age safety threat", tagBg: "rgba(245,158,11,0.1)", tagColor: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    desc: "Minors lie about their age to access adult content. Adults pretend to be younger to target and groom teenagers. Our AI detects real age and flags mismatches with your profile." },
  { icon: "⚧️", name: "Fake gender",
    tag: "Identity threat", tagBg: "rgba(139,92,246,0.1)", tagColor: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    desc: "Users misrepresent their gender to deceive others in social or dating contexts. This causes emotional harm, erodes trust and can lead to dangerous real-world situations." },
];

export default function Result({ onSwitch, result }) {
  const age = result?.age || 22;
  const gender = result?.gender || "Male";
  const confidence = result?.confidence || 94;

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* LEFT - Result */}
      <div style={{ width: "280px", flexShrink: 0, background: "#000",
        borderRight: "0.5px solid #1a1a1a", display: "flex",
        flexDirection: "column", alignItems: "center", padding: "32px 20px" }}>

        <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>

        <div style={{ fontSize: "20px", fontWeight: 700, background: grad,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", marginBottom: "6px", textAlign: "center" }}>
          Identity Verified!
        </div>

        <div style={{ fontSize: "12px", color: "#555", marginBottom: "20px",
          textAlign: "center" }}>
          Welcome! You are safely logged in.
        </div>

        {/* Age Card */}
        <div style={{ width: "100%", background: "#0d0d0d",
          border: "0.5px solid #1a1a1a", borderRadius: "8px",
          padding: "12px 14px", marginBottom: "8px" }}>
          <div style={{ fontSize: "10px", color: "#444", marginBottom: "4px" }}>
            Detected Age
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700, background: grad,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text" }}>
            ~{age} years
          </div>
          <div style={{ fontSize: "9px", color: "#333", marginTop: "3px" }}>
            AI estimation — may vary ±3–5 years
          </div>
        </div>

        {/* Gender Card */}
        <div style={{ width: "100%", background: "#0d0d0d",
          border: "0.5px solid #1a1a1a", borderRadius: "8px",
          padding: "12px 14px", marginBottom: "8px" }}>
          <div style={{ fontSize: "10px", color: "#444", marginBottom: "4px" }}>
            Detected Gender
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700, background: grad,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text" }}>
            {gender}
          </div>
          <div style={{ fontSize: "9px", color: "#333", marginTop: "3px" }}>
            Based on facial features — ~90% accurate
          </div>
        </div>

        {/* Match Score Card */}
        <div style={{ width: "100%", background: "#0d0d0d",
          border: "0.5px solid #1a1a1a", borderRadius: "8px",
          padding: "12px 14px", marginBottom: "14px" }}>
          <div style={{ fontSize: "10px", color: "#444", marginBottom: "4px" }}>
            Match Score
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700, background: grad,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text" }}>
            {confidence}%
          </div>
          <div style={{ fontSize: "9px", color: "#333", marginTop: "3px" }}>
            Face embedding similarity score
          </div>
        </div>

        {/* Accuracy Warning */}
        <div style={{ width: "100%", background: "#0d0d0d",
          border: "0.5px solid #f59e0b", borderRadius: "8px",
          padding: "10px 12px", marginBottom: "16px",
          display: "flex", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%",
            background: "#f59e0b", flexShrink: 0, marginTop: "3px" }} />
          <div style={{ fontSize: "10px", color: "#f59e0b", lineHeight: "1.5" }}>
            Age and gender detection is AI-based and used as a safety
            reference. Results may not be 100% accurate.
          </div>
        </div>

        {/* Buttons */}
        <button onClick={() => onSwitch("login")}
          style={{ width: "100%", padding: "12px", background: grad,
            color: "#fff", border: "none", borderRadius: "8px",
            fontSize: "14px", fontWeight: 700, cursor: "pointer",
            marginBottom: "8px" }}>
          Continue to feed →
        </button>

        <button onClick={() => onSwitch("camera")}
          style={{ width: "100%", padding: "10px", background: "transparent",
            border: "0.5px solid #222", borderRadius: "8px",
            fontSize: "12px", color: "#555", cursor: "pointer" }}>
          Scan again
        </button>
      </div>

      {/* RIGHT - Why Required */}
      <div style={{ flex: 1, background: "#000", padding: "28px 24px",
        display: "flex", flexDirection: "column", gap: "12px" }}>

        <div style={{ fontSize: "16px", fontWeight: 700, background: grad,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text" }}>
          Why this verification was required
        </div>

        <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.7" }}>
          Your face scan protects you and others from the following threats
          that are common on social media platforms today.
        </div>

        {threats.map((t) => (
          <div key={t.name} style={{ background: "#0d0d0d",
            border: "0.5px solid #1a1a1a", borderRadius: "10px",
            padding: "14px", display: "flex", gap: "12px",
            alignItems: "flex-start" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "9px",
              background: t.bg, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
              {t.icon}
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#ddd",
                marginBottom: "5px" }}>
                {t.name}
              </div>
              <div style={{ fontSize: "11px", color: "#555", lineHeight: "1.6" }}>
                {t.desc}
              </div>
              <div style={{ display: "inline-block", padding: "3px 9px",
                borderRadius: "20px", fontSize: "9px", fontWeight: 700,
                marginTop: "7px", background: t.tagBg, color: t.tagColor }}>
                {t.tag}
              </div>
            </div>
          </div>
        ))}

        <div style={{ background: "#0d0d0d", border: "0.5px solid #1a1a1a",
          borderRadius: "8px", padding: "12px 14px", fontSize: "11px",
          color: "#333", lineHeight: "1.8", marginTop: "auto" }}>
          🔒 Your face is never saved as a photo. Only a 128-point
          encrypted embedding is stored on our servers.
        </div>
      </div>
    </div>
  );
}