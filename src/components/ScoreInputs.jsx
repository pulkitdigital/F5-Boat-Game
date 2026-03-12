// export default function ScoreInputs({ scores, onChange }) {
//   const handleChange = (index, value) => {
//     const num = value === "" ? "" : Math.min(100, Math.max(0, Number(value)));
//     onChange(index, num);
//   };

//   return (
//     <div className="flex flex-col gap-2 h-full overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#22d3ee #0f172a" }}>
//       {scores.map((val, i) => (
//         <div key={i} className="flex items-center gap-3">
//           <label
//             className="text-cyan-400 font-bold text-sm w-8 shrink-0 text-right"
//             style={{ fontFamily: "'Orbitron', monospace" }}
//           >
//             Q{i + 1}
//           </label>
//           <input
//             type="number"
//             min={0}
//             max={100}
//             value={val}
//             onChange={(e) => handleChange(i, e.target.value)}
//             placeholder="0"
//             className="w-full rounded-lg px-3 py-2 text-center font-bold text-base text-white border-2 transition-all duration-150 focus:outline-none focus:border-cyan-400"
//             style={{
//               fontFamily: "'Orbitron', monospace",
//               background: val !== "" && val > 0 ? "rgba(6, 182, 212, 0.15)" : "rgba(15, 23, 42, 0.8)",
//               borderColor: val !== "" && val > 0 ? "#22d3ee" : "#1e3a5f",
//               MozAppearance: "textfield",
//             }}
//           />
//           <span
//             className="text-xs w-6 shrink-0 text-center"
//             style={{ color: val >= 80 ? "#4ade80" : val >= 50 ? "#facc15" : val > 0 ? "#fb923c" : "#334155" }}
//           >
//             {val !== "" && val > 0 ? "✓" : "–"}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }