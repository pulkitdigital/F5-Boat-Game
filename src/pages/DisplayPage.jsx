// src/pages/DisplayPage.jsx
import { useState, useEffect } from "react";
import {
  subscribeScores, calcTotal, calcFilled, calcProgress,
  MAX_SCORE, F5_RED, F5_RED_DARK, F5_RED_LIGHT,
} from "../store/gameStore";

const FONT = "'Noto Sans', sans-serif";

function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const fn = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return size;
}

function F5Logo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="50" cy="50" r="50" fill={F5_RED} />
      <text x="50" y="68" textAnchor="middle" fill="white"
        style={{ fontFamily: "Georgia,serif", fontWeight: 900, fontSize: 48 }}>f5</text>
    </svg>
  );
}

function WaterTrack({ ratio, height = 160, boatSize = 60 }) {
  return (
    <div style={{ position: "relative", width: "100%", height, userSelect: "none" }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 22, overflow: "hidden",
        background: "linear-gradient(180deg, #dbeafe 0%, #bfdbfe 45%, #93c5fd 100%)",
        border: `3px solid ${F5_RED}33`,
        boxShadow: `inset 0 4px 20px rgba(147,197,253,0.5), 0 8px 40px rgba(59,130,246,0.15)`,
      }}>
        {/* Shimmer */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "30%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)",
          borderRadius: "22px 22px 0 0",
        }} />
        {/* Waves */}
        {[
          { h: 55, op: 0.22, dur: "7s", bot: 0, col: "#3b82f6", dir: "" },
          { h: 40, op: 0.15, dur: "11s", bot: 8, col: "#60a5fa", dir: "reverse" },
          { h: 28, op: 0.10, dur: "15s", bot: 14, col: "#93c5fd", dir: "" },
        ].map((w, i) => (
          <div key={i} style={{
            position: "absolute", bottom: w.bot, left: "-100%",
            width: "300%", height: w.h, borderRadius: "50% 50% 0 0",
            background: `linear-gradient(180deg, ${w.col}, transparent)`,
            opacity: w.op, animation: `wave ${w.dur} linear infinite ${w.dir}`,
          }} />
        ))}
        {/* Progress fill */}
        {ratio > 0 && (
          <div style={{
            position: "absolute", inset: 0, width: `${ratio * 100}%`,
            background: `linear-gradient(90deg, ${F5_RED}0a, ${F5_RED}22)`,
            borderRight: `3px solid ${F5_RED}88`,
            transition: "width 0.75s cubic-bezier(0.25,0.46,0.45,0.94)",
          }} />
        )}
        {/* Ticks */}
        {[0.25, 0.5, 0.75].map((t) => (
          <div key={t} style={{ position: "absolute", top: 0, bottom: 0, left: `${t * 100}%` }}>
            <div style={{ width: 1, height: "100%", background: "rgba(30,64,175,0.15)" }} />
            <span style={{
              position: "absolute", bottom: 8, left: 4,
              fontSize: 9, color: "rgba(30,64,175,0.45)", fontFamily: FONT, fontWeight: 600,
            }}>{t * MAX_SCORE}</span>
          </div>
        ))}
        {/* Labels */}
        <span style={{ position: "absolute", left: 14, top: 10, fontSize: 11, fontWeight: 700, color: "rgba(30,64,175,0.45)", fontFamily: FONT, letterSpacing: 2 }}>START</span>
        <span style={{ position: "absolute", right: 14, top: 10, fontSize: 11, fontWeight: 700, color: "rgba(30,64,175,0.45)", fontFamily: FONT, letterSpacing: 2 }}>FINISH 🏁</span>
        {/* Boat */}
        <div style={{
          position: "absolute", bottom: Math.max(height * 0.18, 24),
          left: `calc(${ratio * 100}% - ${boatSize / 2}px)`,
          transition: "left 0.75s cubic-bezier(0.25,0.46,0.45,0.94)",
          fontSize: boatSize, lineHeight: 1,
          filter: `drop-shadow(0 5px 14px ${F5_RED}88)`,
          animation: "bob 2.4s ease-in-out infinite",
        }}>
          🚣
          {ratio > 0.03 && (
            <div style={{
              position: "absolute", right: boatSize - 8, bottom: 6,
              width: Math.min(ratio * 110, 80), height: 4,
              borderRadius: "0 50% 50% 0",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75))",
              transform: "scaleX(-1)",
            }} />
          )}
        </div>
      </div>
      <style>{`
        @keyframes wave{0%{transform:translateX(0)}100%{transform:translateX(33.33%)}}
        @keyframes bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-9px) rotate(2deg)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
      `}</style>
    </div>
  );
}

export default function DisplayPage() {
  const [scores, setScores] = useState(Array(20).fill(""));
  const [connected, setConnected] = useState(false);
  const { w } = useWindowSize();

  useEffect(() => {
    const unsub = subscribeScores((data) => { setScores(data); setConnected(true); });
    return () => unsub();
  }, []);

  const total = calcTotal(scores);
  const filled = calcFilled(scores);
  const pct = calcProgress(total);
  const ratio = Math.min(total / MAX_SCORE, 1);

  // Responsive breakpoints
  const isMobile = w < 480;
  const isTablet = w >= 480 && w < 900;
  const isDesktop = w >= 900;

  const px = isMobile ? 16 : isTablet ? 28 : 56;
  const logoSize = isMobile ? 36 : isTablet ? 48 : 64;
  const titleSize = isMobile ? 22 : isTablet ? 34 : 52;
  const subtitleSize = isMobile ? 10 : isTablet ? 12 : 14;
  const trackH = isMobile ? 110 : isTablet ? 140 : 185;
  const boatSz = isMobile ? 40 : isTablet ? 52 : 70;
  const statFontSize = isMobile ? 28 : isTablet ? 38 : 50;
  const statPad = isMobile ? "14px 10px" : isTablet ? "16px 14px" : "20px 24px";
  const qDotW = isMobile ? 42 : isTablet ? 48 : 54;
  const qDotH = isMobile ? 36 : isTablet ? 40 : 46;
  const qFontSize = isMobile ? 12 : isTablet ? 14 : 16;
  const qLabelSize = isMobile ? 8 : 9;

  return (
    <div style={{
      minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column",
      background: "#f5f5f5", fontFamily: FONT, overflowX: "hidden", position: "relative",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700;900&display=swap');`}</style>

      {/* Top red stripe */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 5, zIndex: 10, background: `linear-gradient(90deg,${F5_RED_DARK},${F5_RED},${F5_RED_LIGHT},${F5_RED})` }} />
      {/* Top glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: `radial-gradient(ellipse 80% 35% at 50% -5%, ${F5_RED}0d 0%, transparent 60%)` }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1, padding: `${isMobile ? 36 : 44}px ${px}px ${isMobile ? 20 : 32}px` }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 18, marginBottom: isMobile ? 14 : 24 }}>
          <F5Logo size={logoSize} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              margin: 0, fontSize: titleSize, fontWeight: 900, color: "#111",
              letterSpacing: isMobile ? "0.03em" : "0.06em", textTransform: "uppercase",
              lineHeight: 1.1, fontFamily: FONT, whiteSpace: isMobile ? "normal" : "nowrap",
            }}>Rowing the Boat</h1>
            <div style={{ color: F5_RED, fontSize: subtitleSize, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4, fontFamily: FONT }}>
              F5 · Live Score Challenge
            </div>
          </div>
          {/* LIVE badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
            padding: isMobile ? "5px 10px" : "7px 16px", borderRadius: 99,
            background: connected ? `${F5_RED}12` : "#f3f4f6",
            border: `1.5px solid ${connected ? F5_RED + "44" : "#d1d5db"}`,
          }}>
            <div style={{ width: isMobile ? 6 : 8, height: isMobile ? 6 : 8, borderRadius: "50%", background: connected ? F5_RED : "#9ca3af", boxShadow: connected ? `0 0 8px ${F5_RED}` : "none", animation: connected ? "pulse 1.5s ease-in-out infinite" : "none" }} />
            {!isMobile && <span style={{ color: connected ? F5_RED : "#9ca3af", fontSize: 12, fontFamily: FONT, fontWeight: 700, letterSpacing: 1 }}>{connected ? "LIVE" : "..."}</span>}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 2, background: `linear-gradient(90deg,${F5_RED},${F5_RED}22,transparent)`, marginBottom: isMobile ? 14 : 22, borderRadius: 99 }} />

        {/* Track */}
        <WaterTrack ratio={ratio} height={trackH} boatSize={boatSz} />

        {/* Progress bar */}
        <div style={{ margin: `${isMobile ? 12 : 18}px 0 ${isMobile ? 14 : 20}px` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "#999", fontSize: isMobile ? 10 : 12, fontFamily: FONT }}>0</span>
            <span style={{ color: "#333", fontSize: isMobile ? 11 : 13, fontFamily: FONT, fontWeight: 600 }}>
              <span style={{ color: F5_RED }}>{total.toLocaleString()}</span> / {MAX_SCORE.toLocaleString()} pts
            </span>
            <span style={{ color: "#999", fontSize: isMobile ? 10 : 12, fontFamily: FONT }}>{MAX_SCORE.toLocaleString()}</span>
          </div>
          <div style={{ height: isMobile ? 9 : 13, borderRadius: 99, background: "#e5e7eb", overflow: "hidden", border: "1px solid #d1d5db" }}>
            <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: `linear-gradient(90deg,${F5_RED_DARK},${F5_RED},${F5_RED_LIGHT})`, boxShadow: `0 0 12px ${F5_RED}55`, transition: "width 0.75s ease" }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: isMobile ? 8 : 14, marginBottom: isMobile ? 14 : 20 }}>
          {[
            { label: "Total Score", value: total.toLocaleString(), accent: F5_RED },
            { label: "Progress", value: `${pct.toFixed(1)}%`, accent: "#1d4ed8" },
            { label: "Questions Done", value: `${filled}/20`, accent: "#ea580c" },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{ borderRadius: isMobile ? 14 : 20, padding: statPad, textAlign: "center", background: "#fff", border: `1.5px solid ${accent}22`, boxShadow: `0 4px 20px ${accent}10` }}>
              <div style={{ fontSize: isMobile ? 8 : 10, color: accent, fontFamily: FONT, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 3, opacity: 0.75 }}>{label}</div>
              <div style={{ fontSize: statFontSize, fontWeight: 900, color: accent, fontFamily: FONT, lineHeight: 1 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Q dots */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 5 : 7, justifyContent: "center" }}>
          {scores.map((v, i) => {
            const done = v !== "" && v !== null;
            return (
              <div key={i} style={{
                width: qDotW, height: qDotH, borderRadius: 10,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: done ? `${F5_RED}10` : "#fff",
                border: `1.5px solid ${done ? F5_RED + "55" : "#e5e7eb"}`,
                transition: "all 0.35s ease",
                boxShadow: done ? `0 2px 10px ${F5_RED}22` : "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                <span style={{ fontSize: qLabelSize, color: done ? F5_RED : "#bbb", fontFamily: FONT, fontWeight: 700 }}>Q{i + 1}</span>
                <span style={{ fontSize: qFontSize, fontFamily: FONT, fontWeight: 700, color: done ? "#111" : "#ddd" }}>{done ? v : "–"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}