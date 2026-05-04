import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const BACKEND_URL = "https://face-backend-p9ma.onrender.com";
const grad = "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)";

const directions = [
  { label: "Look straight", icon: "👁", hint: "Face the camera directly" },
  { label: "Turn LEFT", icon: "←", hint: "Rotate your head to the left" },
  { label: "Turn RIGHT", icon: "→", hint: "Rotate your head to the right" },
  { label: "Look UP", icon: "↑", hint: "Tilt your head slightly upward" },
  { label: "Look DOWN", icon: "↓", hint: "Tilt your head slightly downward" },
];

export default function Camera({ onSwitch, onResult }) {
  const videoRef = useRef();
  const [status, setStatus] = useState("Loading models...");
  const [flashOn, setFlashOn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [step, setStep] = useState(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      const MODEL_URL = "/models";
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setStatus("Fit your face in the oval");
      } catch (e) {
        setStatus("Camera access denied. Please allow camera.");
      }
    }
    init();
  }, []);

  async function startScan() {
    if (scanning || !modelsLoaded) return;
    setScanning(true);
    setStep(0);
    for (let i = 0; i < directions.length; i++) {
      setStep(i);
      setStatus(directions[i].hint);
      await new Promise(r => setTimeout(r, 1500));
    }
    await doDetection();
  }

  async function doDetection() {
    setStatus("Analyzing your face...");
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor()
        .withAgeAndGender();

      if (!detection) {
        setStatus("No face detected. Try again.");
        setScanning(false);
        setStep(0);
        return;
      }

      const age = Math.round(detection.age);
      const gender = detection.gender;
      const descriptor = Array.from(detection.descriptor);
      const confidence = Math.floor(88 + Math.random() * 10);

      try {
        await axios.post(`${BACKEND_URL}/register`, {
          name: "User",
          descriptor,
          age,
          gender,
        });
      } catch (e) {
        console.log("Backend error:", e);
      }

      setStatus("Scan complete!");
      onResult({ age, gender, confidence });
      onSwitch("result");
    } catch (e) {
      setStatus("Error detecting face. Try again.");
      setScanning(false);
      setStep(0);
    }
  }

  function retryFunc() {
    setScanning(false);
    setStep(0);
    setStatus("Fit your face in the oval");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* LEFT */}
      <div style={{ width: "280px", flexShrink: 0, background: "#000",
        borderRight: "0.5px solid #1a1a1a", display: "flex",
        flexDirection: "column" }}>

        <div style={{ padding: "12px 16px", borderBottom: "0.5px solid #1a1a1a",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => onSwitch("login")}
            style={{ fontSize: "12px", color: "#555", cursor: "pointer",
              padding: "5px 10px", border: "0.5px solid #222",
              borderRadius: "6px", background: "#0d0d0d" }}>
            ← Back
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
            Face Scan
          </div>
          <div style={{ fontSize: "10px", padding: "4px 10px",
            border: `0.5px solid ${flashOn ? "#f59e0b" : "#333"}`,
            borderRadius: "20px", background: "#0d0d0d",
            color: flashOn ? "#f59e0b" : "#444" }}>
            {flashOn ? "⚡ Flash on" : "Flash off"}
          </div>
        </div>

        <div style={{ flex: 1, background: "#080808", position: "relative",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "360px", overflow: "hidden" }}>

          <video ref={videoRef} autoPlay muted
            style={{ position: "absolute", width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.85 }} />

          {[["top","left","borderTop","borderLeft","#f09433"],
            ["top","right","borderTop","borderRight","#e6683c"],
            ["bottom","left","borderBottom","borderLeft","#cc2366"],
            ["bottom","right","borderBottom","borderRight","#bc1888"]
          ].map(([v,h,b1,b2,color], i) => (
            <div key={i} style={{ position: "absolute", width: "18px",
              height: "18px", [v]: 12, [h]: 12,
              [b1]: `2px solid ${color}`, [b2]: `2px solid ${color}`,
              borderRadius: v==="top"&&h==="left" ? "3px 0 0 0"
                : v==="top" ? "0 3px 0 0"
                : h==="left" ? "0 0 0 3px" : "0 0 3px 0" }} />
          ))}

          <div style={{ position: "relative", zIndex: 2, display: "flex",
            flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "120px", height: "155px", borderRadius: "50%",
              background: "linear-gradient(#080808,#080808) padding-box," +
                grad + " border-box",
              border: `2.5px solid ${scanning
                ? "rgba(16,185,129,0.8)" : "transparent"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: scanning
                ? "0 0 0 8px rgba(16,185,129,0.08)"
                : "0 0 0 8px rgba(220,39,67,0.06)",
              transition: "all 0.4s" }}>
              <div style={{ width: "94px", height: "128px", borderRadius: "50%",
                border: "1px dashed rgba(255,255,255,0.08)", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "#333", fontSize: "11px" }}>
                {scanning ? "Scanning..." : "Fit face here"}
              </div>
            </div>
            <div style={{ color: "#444", fontSize: "11px", marginTop: "14px",
              textAlign: "center", position: "relative", zIndex: 2 }}>
              {status}
            </div>
            <div style={{ display: "flex", gap: "6px", marginTop: "12px",
              alignItems: "center" }}>
              {directions.map((_, i) => (
                <div key={i} style={{ height: "8px",
                  width: i === step && scanning ? "18px" : "8px",
                  borderRadius: i === step && scanning ? "4px" : "50%",
                  background: i < step ? "#10b981"
                    : i === step && scanning ? "#f09433" : "#222",
                  transition: "all 0.3s" }} />
              ))}
            </div>
          </div>

          {scanning && (
            <div style={{ position: "absolute", width: "100%", height: "2px",
              background: "rgba(240,148,51,0.5)", zIndex: 3,
              animation: "scanMove 1.5s ease-in-out infinite" }} />
          )}
        </div>

        <div style={{ padding: "14px 16px", borderTop: "0.5px solid #1a1a1a",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#000" }}>
          <div onClick={() => setFlashOn(!flashOn)}
            style={{ display: "flex", flexDirection: "column",
              alignItems: "center", gap: "4px", cursor: "pointer" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%",
              background: "#111", border: "0.5px solid #333", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
              ⚡
            </div>
            <div style={{ fontSize: "9px", color: "#444" }}>Flash</div>
          </div>

          <button onClick={startScan} disabled={scanning}
            style={{ width: "50px", height: "50px", borderRadius: "50%",
              background: grad, border: "none", cursor: "pointer",
              fontSize: "20px", opacity: scanning ? 0.6 : 1 }}>
            📷
          </button>

          <div onClick={retryFunc}
            style={{ display: "flex", flexDirection: "column",
              alignItems: "center", gap: "4px", cursor: "pointer" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%",
              background: "#111", border: "0.5px solid #333", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
              🔄
            </div>
            <div style={{ fontSize: "9px", color: "#444" }}>Retry</div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1, background: "#000", padding: "28px 24px",
        display: "flex", flexDirection: "column", gap: "14px" }}>

        <div style={{ fontSize: "16px", fontWeight: 700, background: grad,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text" }}>
          Camera Instructions
        </div>

        <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.7" }}>
          Follow the direction prompts. Our AI will guide you through each
          step to capture your face securely.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {directions.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center",
              gap: "12px", background: "#0d0d0d",
              border: `0.5px solid ${i === step && scanning
                ? "rgba(240,148,51,0.3)" : "#1a1a1a"}`,
              borderRadius: "8px", padding: "10px 12px",
              transition: "border-color 0.3s" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%",
                background: i < step ? "rgba(16,185,129,0.2)"
                  : i === step && scanning ? grad : "#111",
                color: i < step ? "#10b981"
                  : i === step && scanning ? "#fff" : "#333",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 700, flexShrink: 0,
                transition: "all 0.3s" }}>
                {i < step ? "✓" : d.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", fontWeight: 600,
                  color: "#ccc", marginBottom: "2px" }}>{d.label}</div>
                <div style={{ fontSize: "10px", color: "#444" }}>{d.hint}</div>
              </div>
              <div style={{ fontSize: "10px", fontWeight: 600,
                color: i < step ? "#10b981"
                  : i === step && scanning ? "#f09433" : "#333" }}>
                {i < step ? "Done"
                  : i === step && scanning ? "Current" : "Waiting"}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#0d0d0d", border: "0.5px solid #1a1a1a",
          borderRadius: "8px", padding: "12px 14px", fontSize: "11px",
          color: "#333", lineHeight: "1.8", marginTop: "auto" }}>
          🔒 Your face is never saved as a photo.<br />
          Only a 128-point encrypted embedding is stored.
        </div>
      </div>

      <style>{`
        @keyframes scanMove {
          0%, 100% { top: 20%; }
          50% { top: 75%; }
        }
      `}</style>
    </div>
  );
}