// import { useState, useCallback } from "react";
// import BoatTrack from "./BoatTrack";
// import ScoreInputs from "./ScoreInputs";
// import GameControls from "./GameControls";

// const QUESTION_COUNT = 20;
// const MAX_SCORE = 2000;

// const emptyScores = () => Array(QUESTION_COUNT).fill("");

// function randomScores() {
//   return Array.from({ length: QUESTION_COUNT }, () => Math.floor(Math.random() * 101));
// }

// export default function BoatGame() {
//   const [scores, setScores] = useState(emptyScores());

//   const handleChange = useCallback((index, value) => {
//     setScores((prev) => {
//       const next = [...prev];
//       next[index] = value;
//       return next;
//     });
//   }, []);

//   const handleReset = () => setScores(emptyScores());
//   const handleRandom = () => setScores(randomScores());

//   const totalScore = scores.reduce((sum, v) => sum + (v !== "" ? Number(v) : 0), 0);
//   const filledCount = scores.filter((v) => v !== "").length;
//   const progressPct = Math.min((totalScore / MAX_SCORE) * 100, 100).toFixed(1);

//   return (
//     <div
//       className="min-h-screen w-full flex flex-col overflow-hidden"
//       style={{
//         background: "linear-gradient(135deg, #020b18 0%, #030f1f 50%, #050c1a 100%)",
//         fontFamily: "'Orbitron', 'Courier New', monospace",
//       }}
//     >
//       {/* Google Font import via style tag */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
//         ::-webkit-scrollbar { width: 6px; }
//         ::-webkit-scrollbar-track { background: #0f172a; }
//         ::-webkit-scrollbar-thumb { background: #22d3ee; border-radius: 3px; }
//         input[type=number]::-webkit-inner-spin-button,
//         input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
//       `}</style>

//       {/* ── Header ── */}
//       <header className="flex-shrink-0 text-center pt-6 pb-2 px-8">
//         <div className="flex items-center justify-center gap-4 mb-1">
//           <div style={{ height: "2px", flex: 1, background: "linear-gradient(90deg, transparent, #22d3ee)" }} />
//           <h1
//             className="text-4xl font-black tracking-widest text-white uppercase"
//             style={{ textShadow: "0 0 30px rgba(34,211,238,0.6), 0 0 60px rgba(6,182,212,0.3)", letterSpacing: "0.25em" }}
//           >
//             🌊 Boat Sync Challenge
//           </h1>
//           <div style={{ height: "2px", flex: 1, background: "linear-gradient(90deg, #22d3ee, transparent)" }} />
//         </div>
//         <p className="text-cyan-500 text-sm tracking-widest uppercase opacity-70">Live Event Score Tracker</p>
//       </header>

//       {/* ── Main Content ── */}
//       <main className="flex flex-1 gap-6 px-8 pb-6 min-h-0">

//         {/* ── Left / Center column ── */}
//         <div className="flex flex-col flex-1 gap-6 min-w-0">

//           {/* Track */}
//           <div className="flex-shrink-0">
//             <BoatTrack totalScore={totalScore} maxScore={MAX_SCORE} />
//           </div>

//           {/* Stats row */}
//           <div className="grid grid-cols-3 gap-4 flex-shrink-0">
//             <StatCard label="Total Score" value={totalScore.toLocaleString()} accent="#22d3ee" />
//             <StatCard label="Progress" value={`${progressPct}%`} accent="#4ade80" />
//             <StatCard label="Questions Filled" value={`${filledCount} / ${QUESTION_COUNT}`} accent="#facc15" />
//           </div>

//           {/* Controls */}
//           <div className="flex-shrink-0">
//             <GameControls onReset={handleReset} onRandomDemo={handleRandom} />
//           </div>

//           {/* Progress bar */}
//           <div className="flex-shrink-0">
//             <div className="flex justify-between text-xs text-cyan-600 mb-1 px-1" style={{ fontFamily: "'Orbitron', monospace" }}>
//               <span>0</span>
//               <span style={{ color: "#22d3ee" }}>{totalScore.toLocaleString()} pts</span>
//               <span>{MAX_SCORE.toLocaleString()}</span>
//             </div>
//             <div className="w-full rounded-full overflow-hidden" style={{ height: "12px", background: "rgba(14,116,144,0.2)", border: "1px solid rgba(34,211,238,0.2)" }}>
//               <div
//                 className="h-full rounded-full transition-all duration-1000"
//                 style={{
//                   width: `${progressPct}%`,
//                   background: "linear-gradient(90deg, #0891b2, #22d3ee, #67e8f9)",
//                   boxShadow: "0 0 12px rgba(34,211,238,0.6)",
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ── Right Panel: Score Inputs ── */}
//         <div
//           className="flex-shrink-0 flex flex-col rounded-2xl p-4"
//           style={{
//             width: "220px",
//             background: "rgba(2, 18, 36, 0.85)",
//             border: "1px solid rgba(34,211,238,0.2)",
//             boxShadow: "0 0 30px rgba(6,182,212,0.08)",
//           }}
//         >
//           <h2
//             className="text-center text-cyan-400 font-bold text-sm tracking-widest uppercase mb-3 flex-shrink-0"
//             style={{ fontFamily: "'Orbitron', monospace", letterSpacing: "0.2em" }}
//           >
//             Score Panel
//           </h2>
//           <div className="flex-1 min-h-0">
//             <ScoreInputs scores={scores} onChange={handleChange} />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// function StatCard({ label, value, accent }) {
//   return (
//     <div
//       className="rounded-2xl p-4 text-center flex flex-col gap-1"
//       style={{
//         background: "rgba(2,18,36,0.85)",
//         border: `1px solid ${accent}40`,
//         boxShadow: `0 0 20px ${accent}18`,
//       }}
//     >
//       <span className="text-xs uppercase tracking-widest opacity-60" style={{ color: accent, fontFamily: "'Orbitron', monospace" }}>
//         {label}
//       </span>
//       <span
//         className="text-3xl font-black"
//         style={{ color: accent, textShadow: `0 0 20px ${accent}80`, fontFamily: "'Orbitron', monospace" }}
//       >
//         {value}
//       </span>
//     </div>
//   );
// }