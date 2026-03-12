// src/components/BoatTrack.jsx
const BOAT_SIZE = 60;

export default function BoatTrack({ totalScore, maxScore = 2000 }) {
  const ratio = Math.min(totalScore / maxScore, 1);

  return (
    <div className="relative w-full select-none" style={{ height: "170px" }}>
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0e4d6e 0%, #0a3352 40%, #062240 100%)",
          border: "3px solid rgba(34,211,238,0.3)",
          boxShadow: "0 0 40px rgba(6,182,212,0.2), inset 0 0 60px rgba(0,0,0,0.4)",
        }}
      >
        <div className="wave-layer wave1" />
        <div className="wave-layer wave2" />
        <div className="wave-layer wave3" />

        <div
          className="absolute bottom-0 left-0 h-full transition-all duration-1000"
          style={{
            width: `${ratio * 100}%`,
            background: "linear-gradient(90deg, rgba(6,182,212,0.06), rgba(34,211,238,0.16))",
            borderRight: ratio > 0.02 ? "2px solid rgba(34,211,238,0.45)" : "none",
          }}
        />

        {[0.25, 0.5, 0.75].map((t) => (
          <div key={t} className="absolute inset-y-0 flex items-end pb-2" style={{ left: `${t * 100}%` }}>
            <div style={{ width: "1px", height: "100%", background: "rgba(255,255,255,0.07)", position: "absolute", top: 0 }} />
            <span className="text-cyan-500 opacity-50 relative z-10" style={{ fontFamily: "'Orbitron',monospace", fontSize: "10px" }}>
              {t * maxScore}
            </span>
          </div>
        ))}

        <span className="absolute left-4 top-3 text-xs text-cyan-300 opacity-50 font-bold" style={{ fontFamily: "'Orbitron',monospace" }}>START</span>
        <span className="absolute right-4 top-3 text-xs text-cyan-300 opacity-50 font-bold" style={{ fontFamily: "'Orbitron',monospace" }}>FINISH 🏁</span>

        <div
          className="absolute"
          style={{
            bottom: "30px",
            left: `calc(${ratio * 100}% - ${BOAT_SIZE / 2}px)`,
            transition: "left 1.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="boat-bob" style={{ fontSize: `${BOAT_SIZE}px`, lineHeight: 1, filter: "drop-shadow(0 4px 16px rgba(6,182,212,0.7))" }}>
            🚤
          </div>
          {ratio > 0.03 && (
            <div style={{
              position: "absolute", right: BOAT_SIZE - 4, bottom: 8,
              width: Math.min(ratio * 100, 80), height: 5,
              borderRadius: "0 50% 50% 0",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2))",
              transform: "scaleX(-1)",
            }} />
          )}
        </div>
      </div>

      <style>{`
        .wave-layer { position:absolute; bottom:0; left:-100%; width:300%; border-radius:50% 50% 0 0; }
        .wave1 { height:55px; background:linear-gradient(180deg,#22d3ee,#0891b2); opacity:.15; animation:wm 6s linear infinite; }
        .wave2 { height:45px; background:linear-gradient(180deg,#38bdf8,#0284c7); opacity:.10; animation:wm 9s linear infinite reverse; bottom:8px; }
        .wave3 { height:35px; background:linear-gradient(180deg,#7dd3fc,#0ea5e9); opacity:.07; animation:wm 13s linear infinite; bottom:14px; }
        @keyframes wm { 0%{transform:translateX(0)} 100%{transform:translateX(33.33%)} }
        .boat-bob { animation: bob 2.2s ease-in-out infinite; display:inline-block; }
        @keyframes bob { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-8px) rotate(1.5deg)} }
      `}</style>
    </div>
  );
}