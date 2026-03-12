// src/pages/InputPage.jsx
import { useState, useEffect, useRef } from "react";
import {
  subscribeScores, saveScores, resetScores, calcTotal, calcFilled, calcProgress,
  QUESTION_COUNT, MAX_SCORE, emptyScores, F5_RED, F5_RED_DARK, F5_RED_LIGHT,
} from "../store/gameStore";

const FONT = "'Noto Sans', sans-serif";

function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth });
  useEffect(() => {
    const fn = () => setSize({ w: window.innerWidth });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return size;
}

function F5Badge({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="50" cy="50" r="50" fill={F5_RED} />
      <text x="50" y="68" textAnchor="middle" fill="white"
        style={{ fontFamily: "Georgia,serif", fontWeight: 900, fontSize: 48 }}>f5</text>
    </svg>
  );
}

export default function InputPage() {
  const [scores, setScores] = useState(emptyScores());
  const [activeQ, setActiveQ] = useState(0);
  const [localVal, setLocalVal] = useState("");
  const [flash, setFlash] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [connected, setConnected] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const initialLoadDone = useRef(false);
  const inputRef = useRef(null);
  const { w } = useWindowSize();

  const isMobile = w < 480;
  const isTablet = w >= 480 && w < 900;
  const maxW = isMobile ? "100%" : isTablet ? 480 : 520;
  const px = isMobile ? 16 : isTablet ? 24 : 32;

  useEffect(() => {
    const unsub = subscribeScores((data) => {
      setScores(data);
      setConnected(true);
      if (!initialLoadDone.current) {
        // First load only: jump to first empty slot
        initialLoadDone.current = true;
        setFetching(false);
        const firstEmpty = data.findIndex((v) => v === "" || v === null);
        const jumpTo = firstEmpty === -1 ? QUESTION_COUNT - 1 : firstEmpty;
        setActiveQ(jumpTo);
        // Prefill only if resuming (slot already has a value)
        const existing = data[jumpTo];
        setLocalVal(existing !== "" && existing !== null ? String(existing) : "");
        if (firstEmpty === -1) setGameFinished(true);
      }
      // After first load: NEVER touch localVal from Firebase listener
      // User must type manually — Firebase only updates scores for stats/display
    });
    return () => unsub();
  }, []);

  const activeQRef = useRef(activeQ);
  useEffect(() => {
    const prev = activeQRef.current;
    activeQRef.current = activeQ;
    if (!initialLoadDone.current) return;
    if (prev === activeQ) return; // no change, don't reset user input
    // User navigated to a different Q — prefill its saved value
    const existing = scores[activeQ];
    setLocalVal(existing !== "" && existing !== null ? String(existing) : "");
    inputRef.current?.focus();
  }, [activeQ]);

  const total = calcTotal(scores);
  const filled = calcFilled(scores);
  const pct = calcProgress(total).toFixed(1);
  const isComplete = gameFinished;
  const hasVal = String(localVal).trim() !== "" && localVal !== null && localVal !== undefined;

  const handleChange = (val) => {
    // ONLY update local input state — NO Firebase save here
    // Firebase push happens ONLY on Next/Finish button click
    if (val === "") { setLocalVal(""); return; }
    const num = Math.max(0, Math.min(100, Number(val)));
    setLocalVal(String(num));
  };

  const handleNext = async () => {
    // Strict guard: must have a non-empty string that is a valid number
    const trimmed = String(localVal).trim();
    if (trimmed === "" || trimmed === null || saving) return;
    const num = Number(trimmed);
    if (isNaN(num)) return;

    setSaving(true);
    try {
      const clamped = Math.max(0, Math.min(100, num));
      const updated = [...scores];
      updated[activeQ] = clamped;
      setScores(updated);
      await saveScores(updated);
      if (activeQ === QUESTION_COUNT - 1) { setGameFinished(true); return; }
      setFlash(activeQ);
      setTimeout(() => setFlash(null), 600);
      setActiveQ((q) => q + 1);
      setLocalVal("");
    } finally { setSaving(false); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleNext(); };

  const handleReset = async () => {
    if (!window.confirm("Reset all scores?")) return;
    setSaving(true);
    try {
      await resetScores();
      setScores(emptyScores());
      setActiveQ(0); setLocalVal(""); setGameFinished(false);
      initialLoadDone.current = false;
    } finally { setSaving(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
      background: "#f5f5f5", fontFamily: FONT, padding: `0 ${px}px 48px`, position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700;900&display=swap');
        *{box-sizing:border-box;}
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
        .qbtn{transition:all 0.18s ease;cursor:pointer;}
        .qbtn:active{transform:scale(0.93);}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
        @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes fadeIn{0%{opacity:0}100%{opacity:1}}
      `}</style>

      {/* Top red stripe */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 5, zIndex: 10, background: `linear-gradient(90deg,${F5_RED_DARK},${F5_RED},${F5_RED_LIGHT})` }} />

      {/* Fetching overlay */}
      {fetching && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100, background: "#f5f5f5",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 20, animation: "fadeIn 0.3s ease",
        }}>
          <F5Badge size={64} />
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: `4px solid ${F5_RED}22`, borderTop: `4px solid ${F5_RED}`, animation: "spin 0.8s linear infinite" }} />
          <div style={{ fontFamily: FONT, fontSize: 16, color: "#555", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Loading Game...</div>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: maxW, paddingTop: 36 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <F5Badge size={isMobile ? 32 : 38} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, color: "#111", lineHeight: 1.1, fontFamily: FONT }}>Rowing the Boat</div>
            <div style={{ fontSize: isMobile ? 9 : 11, color: F5_RED, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2, fontFamily: FONT, fontWeight: 700 }}>Score Input · Admin</div>
          </div>
          {/* Live badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
            padding: isMobile ? "4px 10px" : "5px 14px", borderRadius: 99,
            background: connected ? `${F5_RED}12` : "#f3f4f6",
            border: `1.5px solid ${connected ? F5_RED + "33" : "#d1d5db"}`,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: connected ? F5_RED : "#9ca3af", animation: connected ? "pulse 1.5s ease-in-out infinite" : "none" }} />
            <span style={{ color: connected ? F5_RED : "#9ca3af", fontSize: 11, fontFamily: FONT, fontWeight: 700, letterSpacing: 1 }}>{connected ? "LIVE" : "..."}</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 2, background: `linear-gradient(90deg,${F5_RED},${F5_RED}22,transparent)`, margin: "12px 0 16px", borderRadius: 99 }} />

        {/* Stats */}
        <div style={{ display: "flex", gap: isMobile ? 8 : 10, marginBottom: 14 }}>
          {[
            { label: "Total", value: total, color: F5_RED },
            { label: "Progress", value: `${pct}%`, color: "#1d4ed8" },
            { label: "Done", value: `${filled}/20`, color: "#ea580c" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ flex: 1, borderRadius: 14, padding: isMobile ? "10px 4px" : "12px 6px", textAlign: "center", background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: isMobile ? 8 : 9, color, opacity: 0.7, letterSpacing: 2, textTransform: "uppercase", fontFamily: FONT, fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 900, color, fontFamily: FONT, lineHeight: 1.2 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ height: 9, borderRadius: 99, background: "#e5e7eb", overflow: "hidden", border: "1px solid #d1d5db" }}>
            <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: `linear-gradient(90deg,${F5_RED_DARK},${F5_RED})`, boxShadow: `0 0 10px ${F5_RED}55`, transition: "width 0.5s ease" }} />
          </div>
        </div>

        {/* Main Input Card */}
        <div style={{
          borderRadius: isMobile ? 18 : 24, padding: isMobile ? "22px 18px 18px" : "28px 26px 24px", marginBottom: 16,
          background: "#fff",
          border: isComplete ? "2px solid #22c55e" : `2px solid ${F5_RED}33`,
          boxShadow: isComplete ? "0 8px 40px rgba(34,197,94,0.12)" : `0 8px 40px ${F5_RED}0f, 0 2px 8px rgba(0,0,0,0.06)`,
        }}>
          {!isComplete ? (
            <>
              <div style={{ textAlign: "center", marginBottom: isMobile ? 14 : 18 }}>
                <div style={{ fontSize: isMobile ? 10 : 12, color: "#999", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4, fontFamily: FONT, fontWeight: 600 }}>Entering Score For</div>
                <div style={{ fontSize: isMobile ? 60 : 80, fontWeight: 900, color: F5_RED, lineHeight: 1, fontFamily: FONT }}>{`Q${activeQ + 1}`}</div>
                <div style={{ width: 40, height: 3, background: F5_RED, borderRadius: 99, margin: "6px auto 0" }} />
              </div>

              <input
                ref={inputRef}
                type="number"
                min={0}
                max={100}
                value={localVal}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="0 – 100"
                style={{
                  width: "100%", textAlign: "center", fontSize: isMobile ? 44 : 58,
                  fontWeight: 900, borderRadius: 14, padding: isMobile ? "12px 10px" : "14px 12px",
                  marginBottom: 14, color: "#111", outline: "none",
                  background: hasVal ? `${F5_RED}08` : "#fafafa",
                  border: `2px solid ${hasVal ? F5_RED : "#e5e7eb"}`,
                  boxShadow: hasVal ? `0 0 18px ${F5_RED}22` : "inset 0 2px 4px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease", fontFamily: FONT, caretColor: F5_RED,
                }}
              />

              <button
                onClick={handleNext}
                disabled={saving || !hasVal}
                className="qbtn"
                style={{
                  width: "100%", padding: isMobile ? "13px" : "15px", borderRadius: 14, border: "none",
                  fontSize: isMobile ? 16 : 18, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                  fontFamily: FONT,
                  background: saving ? `${F5_RED}cc` : hasVal ? `linear-gradient(135deg,${F5_RED_DARK},${F5_RED},${F5_RED_LIGHT})` : "#f3f4f6",
                  color: hasVal || saving ? "#fff" : "#ccc",
                  boxShadow: hasVal ? `0 4px 20px ${F5_RED}44` : "none",
                  transition: "all 0.2s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  opacity: saving ? 0.9 : 1,
                  cursor: saving || !hasVal ? "not-allowed" : "pointer",
                }}
              >
                {saving ? (
                  <>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid #fff", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
                    Saving...
                  </>
                ) : (
                  activeQ < QUESTION_COUNT - 1 ? `Next → Q${activeQ + 2}` : "Finish ✓"
                )}
              </button>

              <div style={{ textAlign: "center", marginTop: 10, color: "#ccc", fontSize: 12, fontFamily: FONT }}>
                {saving ? "Syncing with Firebase..." : "Press Enter to continue"}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
              <div style={{ fontSize: isMobile ? 26 : 32, fontWeight: 900, color: "#22c55e", marginBottom: 8, fontFamily: FONT }}>Game Complete!</div>
              <div style={{ color: "#666", fontSize: isMobile ? 14 : 16, fontFamily: FONT }}>
                Final Score: <span style={{ color: F5_RED, fontWeight: 900 }}>{total}</span> / {MAX_SCORE}
              </div>
            </div>
          )}
        </div>

        {/* Q grid */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 2, textTransform: "uppercase", textAlign: "center", marginBottom: 10, fontFamily: FONT, fontWeight: 600 }}>
            Tap to Edit Any Question
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 5 : 5}, 1fr)`, gap: isMobile ? 6 : 8 }}>
            {scores.map((v, i) => {
              const isCurrent = i === activeQ;
              const isDone = v !== "" && v !== null;
              const isFlash = flash === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveQ(i)}
                  className="qbtn"
                  style={{
                    borderRadius: 10, padding: isMobile ? "8px 0" : "10px 0", border: "none",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    background: isCurrent ? `${F5_RED}10` : isFlash ? "rgba(34,197,94,0.1)" : isDone ? "#f9fafb" : "#fff",
                    outline: isCurrent ? `2.5px solid ${F5_RED}` : isFlash ? "2px solid #22c55e" : isDone ? "1px solid #e5e7eb" : "1px solid #f0f0f0",
                    boxShadow: isCurrent ? `0 0 12px ${F5_RED}22` : "0 1px 3px rgba(0,0,0,0.05)",
                    fontFamily: FONT, transition: "all 0.18s ease",
                  }}
                >
                  <span style={{ fontSize: isMobile ? 8 : 9, color: isCurrent ? F5_RED : isDone ? "#999" : "#ccc", fontWeight: 700, letterSpacing: 0.5 }}>Q{i + 1}</span>
                  <span style={{ fontSize: isMobile ? 14 : 17, fontWeight: 900, color: isCurrent ? F5_RED : isDone ? "#111" : "#ddd" }}>
                    {isDone ? v : "–"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleReset}
            className="qbtn"
            style={{
              padding: isMobile ? "10px 24px" : "11px 28px", borderRadius: 12,
              border: "1.5px solid #fca5a5", background: "transparent", color: "#f87171",
              fontSize: isMobile ? 13 : 14, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", fontFamily: FONT,
            }}
          >↺ Reset Game</button>
        </div>
      </div>
    </div>
  );
}