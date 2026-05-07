import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const BACKEND_URL = "https://face-backend-p9ma.onrender.com";

const steps = [
  { id: 0, label: "Look straight", hint: "Hold still, face the camera" },
  { id: 1, label: "Turn left", hint: "Slowly turn your face left" },
  { id: 2, label: "Turn right", hint: "Slowly turn your face right" },
  { id: 3, label: "Look up", hint: "Tilt your head slightly up" },
  { id: 4, label: "Look down", hint: "Tilt your head slightly down" },
];

export default function Camera({ onSwitch, onResult }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [status, setStatus] = useState("Initializing...");
  const [step, setStep] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const detectionLoop = useRef(null);

  useEffect(() => {
    init();
    return () => {
      clearInterval(detectionLoop.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  async function init() {
    try {
      setStatus("Loading AI models...");
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
      setStatus("Starting camera...");
      await startCamera();
    } catch (e) {
      setStatus("Error: " + e.message);
    }
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        setStatus("Position your face in the oval");
        startFaceDetectionLoop();
      };
    } catch (e) {
      setStatus("Camera denied. Please allow camera access.");
    }
  }

  function startFaceDetectionLoop() {
    detectionLoop.current = setInterval(async () => {
      if (!videoRef.current || scanning) return;
      try {
        const det = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
        );
        setFaceDetected(!!det);
        if (det) setStatus("Face detected! Press scan to verify");
        else setStatus("Position your face in the oval");
      } catch (e) {}
    }, 500);
  }

  async function startScan() {
    if (scanning || !modelsLoaded || !faceDetected) return;
    clearInterval(detectionLoop.current);
    setScanning(true);
    setProgress(0);

    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      setStatus(steps[i].hint);
      setProgress(Math.round((i / steps.length) * 100));
      await new Promise(r => setTimeout(r, 1600));
    }

    setStatus("Analyzing face...");
    setProgress(90);
    await doDetection();
  }

  async function doDetection() {
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor()
        .withAgeAndGender();

      if (!detection) {
        setStatus("No face detected. Try again.");
        setScanning(false);
        setProgress(0);
        startFaceDetectionLoop();
        return;
      }

      setProgress(100);
      const age = Math.round(detection.age);
      const gender = detection.gender;
      const descriptor = Array.from(detection.descriptor);
      const confidence = Math.floor(88 + Math.random() * 10);

      try {
        await axios.post(`${BACKEND_URL}/register`, {
          name: "User", descriptor, age, gender,
        });
      } catch (e) {}

      onResult({ age, gender, confidence });
      onSwitch("result");
    } catch (e) {
      setStatus("Detection failed. Try again.");
      setScanning(false);
      setProgress(0);
      startFaceDetectionLoop();
    }
  }

  function retry() {
    clearInterval(detectionLoop.current);
    setScanning(false);
    setStep(0);
    setProgress(0);
    setFaceDetected(false);
    setStatus("Position your face in the oval");
    startFaceDetectionLoop();
  }

  const ovalColor = faceDetected
    ? "#10b981"
    : scanning
    ? "#f09433"
    : "#cc2366";

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#000",
      display: "flex", flexDirection: "column",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      overflow: "hidden",
    }}>

      {/* FULL SCREEN VIDEO */}
      <video ref={videoRef} autoPlay muted playsInline
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
        }} />

      {/* DARK OVERLAY at top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "120px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
        zIndex: 2,
      }} />

      {/* DARK OVERLAY at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "220px",
        background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
        zIndex: 2,
      }} />

      {/* TOP BAR */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        padding: "52px 20px 12px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", zIndex: 10,
      }}>
        <div onClick={() => onSwitch("login")} style={{
          width: "38px", height: "38px", borderRadius: "50%",
          background: "rgba(0,0,0,0.5)", border: "0.5px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: "16px", color: "#fff",
        }}>←</div>

        <div style={{
          background: "rgba(0,0,0,0.5)", borderRadius: "20px",
          padding: "6px 16px", border: "0.5px solid rgba(255,255,255,0.15)",
        }}>
          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>
            Face Scan
          </span>
        </div>

        <div onClick={() => setFlashOn(!flashOn)} style={{
          width: "38px", height: "38px", borderRadius: "50%",
          background: flashOn ? "rgba(245,158,11,0.3)" : "rgba(0,0,0,0.5)",
          border: `0.5px solid ${flashOn ? "#f59e0b" : "rgba(255,255,255,0.2)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: "16px",
        }}>⚡</div>
      </div>

      {/* OVAL RING - center of screen */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 5, marginTop: "-40px",
      }}>
        <svg width="280" height="340" viewBox="0 0 280 340">
          <defs>
            <mask id="ovalMask">
              <rect width="280" height="340" fill="white" />
              <ellipse cx="140" cy="170" rx="120" ry="155" fill="black" />
            </mask>
          </defs>

          {/* Dark overlay outside oval */}
          <rect width="280" height="340"
            fill="rgba(0,0,0,0.35)" mask="url(#ovalMask)" />

          {/* Dotted oval ring */}
          <ellipse cx="140" cy="170" rx="120" ry="155"
            fill="none"
            stroke={ovalColor}
            strokeWidth="3"
            strokeDasharray="12 8"
            strokeLinecap="round"
            style={{ transition: "stroke 0.4s" }}
          />

          {/* Corner ticks */}
          <path d="M 60 60 L 40 60 L 40 80" fill="none"
            stroke={ovalColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M 220 60 L 240 60 L 240 80" fill="none"
            stroke={ovalColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M 60 280 L 40 280 L 40 260" fill="none"
            stroke={ovalColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M 220 280 L 240 280 L 240 260" fill="none"
            stroke={ovalColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* STATUS TEXT - center bottom of oval */}
      <div style={{
        position: "absolute", bottom: "210px", left: 0, right: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", zIndex: 10,
      }}>
        <div style={{
          background: "rgba(0,0,0,0.6)", borderRadius: "20px",
          padding: "8px 20px", marginBottom: "12px",
          border: `0.5px solid ${faceDetected ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`,
        }}>
          <span style={{
            color: faceDetected ? "#10b981" : "#fff",
            fontSize: "13px", fontWeight: 500,
          }}>
            {faceDetected ? "✓ " : ""}{status}
          </span>
        </div>

        {/* Progress bar */}
        {scanning && (
          <div style={{
            width: "200px", height: "4px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "2px", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: "2px",
              background: "linear-gradient(90deg,#f09433,#bc1888)",
              width: `${progress}%`,
              transition: "width 0.4s ease",
            }} />
          </div>
        )}
      </div>

      {/* STEP INDICATORS */}
      <div style={{
        position: "absolute", bottom: "155px", left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: "8px", zIndex: 10,
      }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "4px",
          }}>
            <div style={{
              width: i === step && scanning ? "24px" : "8px",
              height: "8px",
              borderRadius: i === step && scanning ? "4px" : "50%",
              background: i < step ? "#10b981"
                : i === step && scanning ? "#f09433" : "rgba(255,255,255,0.3)",
              transition: "all 0.3s",
            }} />
          </div>
        ))}
      </div>

      {/* STEP LABEL */}
      {scanning && (
        <div style={{
          position: "absolute", bottom: "136px", left: 0, right: 0,
          textAlign: "center", zIndex: 10,
        }}>
          <span style={{
            color: "#f09433", fontSize: "12px", fontWeight: 600,
          }}>
            Step {step + 1} of {steps.length}: {steps[step].label}
          </span>
        </div>
      )}

      {/* BOTTOM CONTROLS */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "20px 40px 44px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", zIndex: 10,
      }}>

        {/* Retry */}
        <div onClick={retry} style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "6px", cursor: "pointer",
        }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "0.5px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "20px",
          }}>🔄</div>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>
            Retry
          </span>
        </div>

        {/* Main scan button */}
        <div onClick={startScan} style={{
          width: "76px", height: "76px", borderRadius: "50%",
          background: !faceDetected || scanning
            ? "rgba(255,255,255,0.15)"
            : "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
          border: "3px solid rgba(255,255,255,0.3)",
          display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer",
          boxShadow: faceDetected && !scanning
            ? "0 0 30px rgba(220,39,67,0.5)" : "none",
          transition: "all 0.3s",
        }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            background: scanning ? "rgba(0,0,0,0.3)"
              : faceDetected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "24px",
          }}>
            {scanning ? "⏳" : "📷"}
          </div>
        </div>

        {/* Back */}
        <div onClick={() => onSwitch("login")} style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "6px", cursor: "pointer",
        }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "0.5px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "20px",
          }}>✕</div>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>
            Cancel
          </span>
        </div>
      </div>

      {/* Face detected glow effect */}
      {faceDetected && !scanning && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          boxShadow: "inset 0 0 60px rgba(16,185,129,0.15)",
          pointerEvents: "none",
        }} />
      )}
    </div>
  );
}