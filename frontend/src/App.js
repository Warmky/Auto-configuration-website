// import React, { useState } from "react";

// function App() {
//     const [email, setEmail] = useState("");
//     const [mechanism, setMechanism] = useState("autodiscover");
//     const [result, setResult] = useState(null);
//     const [error, setError] = useState("");

//     const handleSearch = async () => {
//         setError("");
//         setResult(null);

//         try {
//             const response = await fetch(`http://localhost:8081/${mechanism}?email=${email}`);
//             if (!response.ok) {
//                 throw new Error("No valid configuration found.");
//             }

//             const data = await response.json();
//             setResult(data);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     const getBarColor = (score) => {
//         if (score >= 90) return "#2ecc71";
//         if (score >= 75) return "#27ae60";
//         if (score >= 60) return "#f1c40f";
//         if (score >= 40) return "#e67e22";
//         return "#e74c3c";
//     };

//     const getGradeColor = (grade) => {
//         switch (grade) {
//             case "A+": return "#2ecc71";
//             case "A": return "#27ae60";
//             case "B": return "#f1c40f";
//             case "C": return "#e67e22";
//             case "D": return "#e74c3c";
//             case "F": return "#c0392b";
//             default: return "#7f8c8d";
//         }
//     };

//     const renderScoreBar = (label, score) => (
//         <div style={{ marginBottom: "12px" }}>
//             <strong>{label}</strong>
//             <div style={{
//                 height: "18px",
//                 backgroundColor: "#eee",
//                 borderRadius: "10px",
//                 overflow: "hidden",
//                 marginTop: "4px"
//             }}>
//                 <div style={{
//                     height: "100%",
//                     width: `${score}%`,
//                     backgroundColor: getBarColor(score),
//                     transition: "width 0.5s ease"
//                 }} />
//             </div>
//             <span style={{ fontSize: "14px", fontWeight: "bold" }}>{score}%</span>
//         </div>
//     );

//     return (
//         <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial" }}>
//             <h1>Auto Configuration Checker</h1>

//             <div style={{ marginBottom: "10px" }}>
//                 <input
//                     type="text"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter email"
//                     style={{ padding: "8px", width: "300px" }}
//                 />
//                 <select
//                     value={mechanism}
//                     onChange={(e) => setMechanism(e.target.value)}
//                     style={{ padding: "8px", marginLeft: "10px" }}
//                 >
//                     <option value="autodiscover">Autodiscover</option>
//                     <option value="autoconfig">Autoconfig</option>
//                     <option value="srv">SRV</option>
//                 </select>
//                 <button onClick={handleSearch} style={{ padding: "8px 12px", marginLeft: "8px" }}>Check</button>
//             </div>

//             {error && <p style={{ color: "red" }}>{error}</p>}

//             {/* SRV 显示内容 */}
//             {result && mechanism === "srv" && (
//                 <div>
//                     <h3>SRV Configuration Score</h3>
//                     {renderScoreBar("Encrypted Ports", result.score.encrypted_ports)}
//                     {renderScoreBar("Standard Ports", result.score.standard_ports)}
//                     {renderScoreBar("DNSSEC Score", result.score.dnssec_score)}
//                     {renderScoreBar("Connection Score", result.score.connect_score)}

//                     {/* Connection Rating Detail */}
//                     {result.score_detail && result.score_detail.connection && (
//                         <div style={{ marginTop: "30px" }}>
//                             <h3>Connection Security Rating</h3>
//                             <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
//                                 <div style={{
//                                     fontSize: "40px",
//                                     fontWeight: "bold",
//                                     color: getGradeColor(result.score_detail.connection.Connection_Grade),
//                                     border: "3px solid",
//                                     borderColor: getGradeColor(result.score_detail.connection.Connection_Grade),
//                                     borderRadius: "10px",
//                                     padding: "12px 20px",
//                                     marginRight: "30px",
//                                     minWidth: "100px",
//                                     textAlign: "center"
//                                 }}>
//                                     {result.score_detail.connection.Connection_Grade}
//                                 </div>

//                                 <div style={{ flexGrow: 1 }}>
//                                     <ScoreBar label="TLS" value={result.score_detail.connection.TLS_Connections} color="#4CAF50" />
//                                     <ScoreBar label="STARTTLS" value={result.score_detail.connection.STARTTLS_Connections} color="#FFC107" />
//                                     <ScoreBar label="Plaintext" value={result.score_detail.connection.Plaintext_Connections} color="#F44336" />
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Raw SRV Record */}
//                     <h3 style={{ marginTop: "30px" }}>Raw SRV Records</h3>
//                     <pre style={{
//                         background: "#f4f4f4",
//                         padding: "12px",
//                         whiteSpace: "pre-wrap",
//                         wordWrap: "break-word",
//                         borderRadius: "6px"
//                     }}>
//                         {JSON.stringify(result.srv_records, null, 2)}
//                     </pre>

//                     {/* Raw DNS Record (if available) */}
//                     {result.dns_record && (
//                         <>
//                             <h3 style={{ marginTop: "30px" }}>DNS Record Info</h3>
//                             <ul>
//                                 {Object.entries(result.dns_record).map(([key, value]) => (
//                                     <li key={key}><strong>{key}:</strong> {String(value)}</li>
//                                 ))}
//                             </ul>
//                         </>
//                     )}
//                 </div>
//             )}


//             {/* Autodiscover & Autoconfig 显示内容 */}
//             {result && mechanism !== "srv" && (
//                 <div>
//                     <h3>Configuration Score</h3>
//                     {renderScoreBar("Encrypted Ports", result.score.encrypted_ports)}
//                     {renderScoreBar("Standard Ports", result.score.standard_ports)}
//                     {renderScoreBar("Certificate Score", result.score.cert_score)}
//                     {renderScoreBar("Connection Score", result.score.connect_score)}

//                     {result.score_detail && result.score_detail.connection && (
//                         <div style={{ marginTop: "30px" }}>
//                             <h3>Connection Security Rating</h3>
//                             <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
//                                 <div style={{
//                                     fontSize: "40px",
//                                     fontWeight: "bold",
//                                     color: getGradeColor(result.score_detail.connection.Connection_Grade),
//                                     border: "3px solid",
//                                     borderColor: getGradeColor(result.score_detail.connection.Connection_Grade),
//                                     borderRadius: "10px",
//                                     padding: "12px 20px",
//                                     marginRight: "30px",
//                                     minWidth: "100px",
//                                     textAlign: "center"
//                                 }}>
//                                     {result.score_detail.connection.Connection_Grade}
//                                 </div>

//                                 <div style={{ flexGrow: 1 }}>
//                                     <ScoreBar label="TLS" value={result.score_detail.connection.TLS_Connections} color="#4CAF50" />
//                                     <ScoreBar label="STARTTLS" value={result.score_detail.connection.STARTTLS_Connections} color="#FFC107" />
//                                     <ScoreBar label="Plaintext" value={result.score_detail.connection.Plaintext_Connections} color="#F44336" />
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     <h3 style={{ marginTop: "30px" }}>Raw Config</h3>
//                     <pre style={{
//                         background: "#f4f4f4",
//                         padding: "12px",
//                         whiteSpace: "pre-wrap",
//                         wordWrap: "break-word",
//                         borderRadius: "6px"
//                     }}>
//                         {result.config}
//                     </pre>

//                     <h3>Cert Info</h3>
//                     <ul>
//                         {Object.entries(result.cert_info).map(([key, value]) => (
//                             <li key={key}>
//                                 <strong>{key}:</strong> {String(value)}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default App;

// function ScoreBar({ label, value, color }) {
//     return (
//         <div style={{ marginBottom: "10px" }}>
//             <span style={{ display: "inline-block", width: "100px" }}>{label}</span>
//             <div style={{
//                 display: "inline-block",
//                 width: "60%",
//                 height: "20px",
//                 backgroundColor: "#eee",
//                 borderRadius: "4px",
//                 verticalAlign: "middle"
//             }}>
//                 <div style={{
//                     width: `${value}%`,
//                     height: "100%",
//                     backgroundColor: color,
//                     borderRadius: "4px"
//                 }}></div>
//             </div>
//             <span style={{ marginLeft: "10px" }}>{value}%</span>
//         </div>
//     );
// }

//7.22原可用
// import React, { useState, useEffect } from "react";
// import {
//     Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
//     ResponsiveContainer, Tooltip
// } from 'recharts';
// import { motion } from 'framer-motion';


// function App() {
//     const [email, setEmail] = useState("");
//     const [results, setResults] = useState({});
//     const [errors, setErrors] = useState("");
//     const [showRawConfig, setShowRawConfig] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [recentlySeen, setRecentlySeen] = useState([]);

//     const mechanisms = ["autodiscover", "autoconfig", "srv"];

//     useEffect(() => {
//         fetchRecent();
//     }, []);

//     const fetchRecent = () => {
//         fetch("http://localhost:8081/api/recent")
//             .then((res) => res.json())
//             .then((data) => setRecentlySeen(data))
//             .catch((err) => console.error("Failed to fetch recent scans:", err));
//     };

//     const handleSearch = async () => {
//         setResults({});
//         setErrors("");
//         setLoading(true);
//         try {
//             const response = await fetch(`http://localhost:8081/checkAll?email=${email}`);
//             if (!response.ok) throw new Error("No valid configuration found.");
//             const data = await response.json();
//             setResults(data);
//             fetchRecent();
//         } catch (err) {
//             setErrors(err.message);
//         }
//         setLoading(false);
//     };

//     const toggleRaw = (mech) => {
//         setShowRawConfig(prev => ({ ...prev, [mech]: !prev[mech] }));
//     };

//     const getBarColor = (score) => {
//         if (score >= 90) return "#2ecc71";
//         if (score >= 75) return "#27ae60";
//         if (score >= 60) return "#f1c40f";
//         if (score >= 40) return "#e67e22";
//         return "#e74c3c";
//     };

//     const getGradeColor = (grade) => {
//         switch (grade) {
//             case "A+": return "#2ecc71";
//             case "A": return "#27ae60";
//             case "B": return "#f1c40f";
//             case "C": return "#e67e22";
//             case "D": return "#e74c3c";
//             case "F": return "#c0392b";
//             default: return "#7f8c8d";
//         }
//     };
//     const thStyle = {
//         padding: "8px",
//         backgroundColor: "#333",
//         color: "#fff",
//         textAlign: "left"
//     };

//     const tdStyle = {
//         padding: "8px",
//         color: "#ddd",
//         fontSize: "14px"
//     };


//     const renderScoreBar = (label, score) => (
//         <div style={{ marginBottom: "10px" }}>
//             <strong>{label}:</strong>
//             <div style={{
//                 height: "18px",
//                 backgroundColor: "#eee",
//                 borderRadius: "10px",
//                 overflow: "hidden",
//                 marginTop: "4px"
//             }}>
//                 <div style={{
//                     height: "100%",
//                     width: `${score}%`,
//                     backgroundColor: getBarColor(score),
//                     transition: "width 0.5s ease"
//                 }} />
//             </div>
//             <span style={{ fontSize: "14px", fontWeight: "bold" }}>{score}%</span>
//         </div>
//     );

//     const renderConnectionDetail = (detail) => (
//         <div style={{ marginTop: "20px" }}>
//             <h4>Connection Security</h4>
//             <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
//                 <div style={{
//                     fontSize: "36px",
//                     fontWeight: "bold",
//                     color: getGradeColor(detail.Connection_Grade),
//                     border: "3px solid",
//                     borderColor: getGradeColor(detail.Connection_Grade),
//                     borderRadius: "8px",
//                     padding: "10px 16px",
//                     marginRight: "20px"
//                 }}>
//                     {detail.Connection_Grade}
//                 </div>
//                 <div style={{ flexGrow: 1 }}>
//                     <ScoreBar label="TLS" value={detail.TLS_Connections} color="#4CAF50" />
//                     <ScoreBar label="STARTTLS" value={detail.STARTTLS_Connections} color="#FFC107" />
//                     <ScoreBar label="Plaintext" value={detail.Plaintext_Connections} color="#F44336" />
//                 </div>
//             </div>
//             {detail.warnings?.length > 0 && (
//                 <ul style={{ color: "#e74c3c" }}>
//                     {detail.warnings.map((w, i) => <li key={i}>{w}</li>)}
//                 </ul>
//             )}
//         </div>
//     );

//     return (
//         <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem", fontFamily: "Arial" }}>
//             <h1>Auto Configuration Checker</h1>
//             <div style={{ marginBottom: "1rem" }}>
//                 <input
//                     type="text"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter email address (e.g., user@example.com)"
//                     style={{ padding: "0.5rem", width: "300px" }}
//                 />
//                 <button onClick={handleSearch} style={{ marginLeft: "1rem", padding: "0.5rem" }}>
//                     Check
//                 </button>
//             </div>

//             {loading && (
//                 <div style={{ margin: "20px 0", textAlign: "center" }}>
//                     <div style={{
//                         width: "40px",
//                         height: "40px",
//                         border: "4px solid #f3f3f3",
//                         borderTop: "4px solid #3498db",
//                         borderRadius: "50%",
//                         animation: "spin 1s linear infinite",
//                         margin: "0 auto"
//                     }} />
//                     <p style={{ marginTop: "10px" }}>Checking configuration...</p>
//                 </div>
//             )}

//             {errors && <p style={{ color: "red" }}>{errors}</p>}

//             {mechanisms.map((mech) => {
//                 const result = results[mech];
//                 if (!result) return null;

//                 const score = result.score || {};
//                 const detail = result.score_detail?.connection;

//                 return (
//                     <div key={mech} style={{ marginBottom: "40px" }}>
//                         <h2>{mech.toUpperCase()} Result</h2>
//                         {renderScoreBar("Encrypted Ports", score.encrypted_ports || 0)}
//                         {renderScoreBar("Standard Ports", score.standard_ports || 0)}
//                         {mech === "srv"
//                             ? renderScoreBar("DNSSEC Score", score.dnssec_score || 0)
//                             : renderScoreBar("Certificate Score", score.cert_score || 0)}
//                         {renderScoreBar("Connection Score", score.connect_score || 0)}
//                         {renderConnectionDetail(detail)}

//                         {(mech === "autodiscover" || mech === "autoconfig") && result.score_detail?.ports_usage && (
//                             <div style={{
//                                 backgroundColor: "rgb(88, 181, 224)",
//                                 padding: "15px",
//                                 borderRadius: "8px",
//                                 border: "1px solid #ccc",
//                                 marginTop: "20px"
//                             }}>
//                                 <h4 style={{ marginBottom: "10px" }}>🔧 Recommended Improvements</h4>
//                                 {(() => {
//                                     const rec = getAutodiscoverRecommendations(result.score_detail.ports_usage, result.score);
//                                     return (
//                                         <>
//                                             <ul style={{ paddingLeft: "1.2em" }}>
//                                                 {rec.tips.map((tip, idx) => (
//                                                     <li key={idx} style={{ marginBottom: "6px" }}>
//                                                         {tip.text} {tip.impact && <span style={{ color: "rgb(26, 110, 166)" }}>{tip.impact}</span>}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                             <p><strong>预估改进后评分:</strong> <span style={{ color: "rgb(63, 3, 166)" }}>{rec.improvedScore}</span></p>
//                                         </>
//                                     );
//                                 })()}
//                             </div>
//                         )}


//                         {mech === "srv" && result.score_detail?.ports_usage && (
//                             <div style={{
//                                 backgroundColor: "rgb(88, 181, 224)",
//                                 padding: "15px",
//                                 borderRadius: "8px",
//                                 border: "1px solid #ccc",
//                                 marginTop: "20px"
//                             }}>
//                                 <h4 style={{ marginBottom: "10px" }}>🔧 Recommended Improvements</h4>
//                                 {(() => {
//                                     const rec = getSRVRecommendations(result.score_detail.ports_usage, result.score);
//                                     return (
//                                         <>
//                                             <ul style={{ paddingLeft: "1.2em" }}>
//                                                 {rec.tips.map((tip, idx) => (
//                                                     <li key={idx} style={{ marginBottom: "6px" }}>
//                                                         {tip.text} {tip.impact && <span style={{ color: "rgb(26, 110, 166)" }}>{tip.impact}</span>}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                             <p><strong>预估改进后评分:</strong> <span style={{ color: "rgb(63, 3, 166)" }}>{rec.improvedScore}</span></p>
//                                         </>
//                                     );
//                                 })()}
//                             </div>
//                         )}

//                         {(mech === "autodiscover" || mech === "autoconfig") && result.cert_info && result.score && (
//                             <div style={{
//                                 backgroundColor: "rgb(138, 138, 222)",
//                                 padding: "15px",
//                                 borderRadius: "8px",
//                                 border: "1px solid #ccc",
//                                 marginTop: "20px"
//                             }}>
//                                 <h4 style={{ marginBottom: "10px" }}>📜 Certificate Optimization Suggestions</h4>
//                                 {(() => {
//                                     const rec = getCertRecommendations(result.cert_info, result.score);
//                                     return (
//                                         <>
//                                             <ul style={{ paddingLeft: "1.2em" }}>
//                                                 {rec.tips.map((tip, idx) => (
//                                                     <li key={idx} style={{ marginBottom: "6px" }}>
//                                                         {tip.text} {tip.impact && <span style={{ color: "#004085" }}>{tip.impact}</span>}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                             <p><strong>预估改进后评分:</strong> <span style={{ color: "#002366" }}>{rec.improvedScore}</span></p>
//                                         </>
//                                     );
//                                 })()}
//                             </div>
//                         )}


//                         {mech === "autodiscover" && result.score_detail?.defense && (
//                             <DefenseRadarChart data={result.score_detail.defense} />
//                         )} 
//                         {/* 7.22 */}
//                         {mech === "autodiscover" && result.all && Array.isArray(result.all) && (
//                             <div style={{
//                                 marginTop: "30px",
//                                 backgroundColor: "#222",
//                                 padding: "20px",
//                                 borderRadius: "8px",
//                                 border: "1px solid #444",
//                                 color: "#fff"
//                             }}>
//                                 <h4>📡 All Autodiscover Methods Used</h4>
//                                 <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
//                                     <thead>
//                                         <tr>
//                                             <th style={thStyle}>Method</th>
//                                             <th style={thStyle}>Index</th>
//                                             <th style={thStyle}>URI</th>
//                                             <th style={thStyle}>Config Present</th>
//                                             <th style={thStyle}>Encrypted Ports</th>
//                                             <th style={thStyle}>Standard Ports</th>
//                                             <th style={thStyle}>Score</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {Array.isArray(result.all) && result.all.map((item, idx) => (
//                                             <tr key={idx} style={{ borderBottom: "1px solid #444" }}>
//                                                 <td style={tdStyle}>{item.method}</td>
//                                                 <td style={tdStyle}>{item.index}</td> 
//                                                 <td style={tdStyle}>{item.uri}</td>
//                                                 <td style={tdStyle}>{item.config ? "✅" : "❌"}</td>
//                                                 <td style={tdStyle}>{item.score?.encrypted_ports ?? "-"}</td>
//                                                 <td style={tdStyle}>{item.score?.standard_ports ?? "-"}</td>
//                                                 <td style={tdStyle}>{item.score?.overall ?? "-"}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>

//                                 {(() => {
//                                     const configs = result.all.map(r => r.config).filter(Boolean);
//                                     const unique = [...new Set(configs)];
//                                     if (unique.length > 1) {
//                                         return <p style={{ color: "#e74c3c", marginTop: "10px" }}>
//                                             ⚠️ 检测到多个路径配置结果不一致，请手动确认是否存在配置偏差！
//                                         </p>;
//                                     }
//                                     return null;
//                                 })()}
//                             </div>
//                         )}
//                         {/* 7.22 */}

//                         {mech === "autoconfig" && result.score_detail?.defense && (
//                             <DefenseRadarChart data={result.score_detail.defense} />
//                         )}
//                         {mech === "srv" && result.score_detail?.defense && (
//                             <DefenseRadarChart data={result.score_detail.defense} />
//                         )}


//                         {mech === "srv" && result.srv_records && (
//                             <>
//                                 <h4>Raw SRV Records</h4>
//                                 <pre style={{ background: "rgba(104, 144, 231, 0.66)", padding: "12px", borderRadius: "6px" }}>
//                                     {JSON.stringify(result.srv_records, null, 2)}
//                                 </pre>
//                                 {result.dns_record && (
//                                     <>
//                                         <h4>DNS Info</h4>
//                                         <ul>
//                                             {Object.entries(result.dns_record).map(([k, v]) => (
//                                                 <li key={k}><strong>{k}:</strong> {String(v)}</li>
//                                             ))}
//                                         </ul>
//                                     </>
//                                 )}
//                             </>
//                         )}

//                         {mech !== "srv" && (
//                             <>
//                                 <h4
//                                     onClick={() => toggleRaw(mech)}
//                                     style={{ cursor: "pointer", color: "rgba(182, 198, 233, 0.66)", userSelect: "none" }}
//                                 >
//                                     Raw Config {showRawConfig[mech] ? "▲" : "▼"}
//                                 </h4>
//                                 {showRawConfig[mech] && (
//                                     <pre style={{
//                                         background: "rgba(104, 144, 231, 0.66)",
//                                         padding: "12px",
//                                         whiteSpace: "pre-wrap",
//                                         borderRadius: "6px"
//                                     }}>
//                                         {result.config}
//                                     </pre>
//                                 )}
//                                 <h4>Cert Info</h4>
//                                 <ul>
//                                     {Object.entries(result.cert_info || {}).map(([k, v]) => (
//                                         <li key={k}><strong>{k}:</strong> {String(v)}</li>
//                                     ))}
//                                 </ul>
//                             </>
//                         )}
//                     </div>
//                 );
//             })}

//             <h2>Recently Seen</h2>
//             {recentlySeen.length > 0 ? (
//                 <ul>
//                     {recentlySeen.map((item, index) => (
//                         <li key={index}>
//                             <strong>{item.domain}</strong> - Score: {item.score}, Grade: {item.grade}, Scanned Time:{" "}
//                             {new Date(item.timestamp).toLocaleString()}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>No Records</p>
//             )}
//             <style>
//                 {`
//                     @keyframes spin {
//                         0% { transform: rotate(0deg); }
//                         100% { transform: rotate(360deg); }
//                     }
//                 `}
//             </style>
//         </div>
//     );
// }

// export default App;

// function ScoreBar({ label, value, color }) {
//     return (
//         <div style={{ marginBottom: "10px" }}>
//             <span style={{ display: "inline-block", width: "100px" }}>{label}</span>
//             <div style={{
//                 display: "inline-block",
//                 width: "60%",
//                 height: "20px",
//                 backgroundColor: "#eee",
//                 borderRadius: "4px",
//                 verticalAlign: "middle"
//             }}>
//                 <div style={{
//                     width: `${value}%`,
//                     height: "100%",
//                     backgroundColor: color,
//                     borderRadius: "4px"
//                 }}></div>
//             </div>
//             <span style={{ marginLeft: "10px" }}>{value}%</span>
//         </div>
//     );
// }

// function DefenseRadarChart({ data }) {
//     if (!data || typeof data !== 'object') return null;

//     const chartData = Object.entries(data).map(([key, value]) => ({
//         dimension: key.replace(/_/g, ' ').replace('defense', '').trim(),
//         score: typeof value === 'number' ? value : 0
//     }));

//     return (
//         <motion.div
//             style={{
//                 marginTop: "30px",
//                 height: "360px",
//                 background: "radial-gradient(circle at center, #0f0f0f 0%, #1a1a1a 100%)",
//                 borderRadius: "16px",
//                 padding: "20px",
//                 color: "#fff",
//                 boxShadow: "0 0 20px rgba(136, 132, 216, 0.3)"
//             }}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//         >
//             <h4 style={{ marginBottom: "12px", fontSize: "1.2rem", fontWeight: "600", textAlign: "center" }}>
//                 🛡️ Defense Capability Radar
//             </h4>

//             <ResponsiveContainer width="100%" height="100%">
//                 <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
//                     <PolarGrid
//                         stroke="#444"
//                         strokeDasharray="4 4"
//                     />
//                     <PolarAngleAxis
//                         dataKey="dimension"
//                         stroke="#aaa"
//                         tick={{ fontSize: 12 }}
//                     />
//                     <PolarRadiusAxis
//                         angle={30}
//                         domain={[0, 100]}
//                         tick={{ fontSize: 11, fill: "#888" }}
//                         axisLine={false}
//                         tickLine={false}
//                     />
//                     <Tooltip
//                         contentStyle={{
//                             backgroundColor: "#222",
//                             border: "none",
//                             borderRadius: "8px",
//                             color: "#fff",
//                             fontSize: "0.9rem"
//                         }}
//                         formatter={(value) => [`${value}/100`, "Score"]}
//                     />
//                     <Radar
//                         name="Defense Score"
//                         dataKey="score"
//                         stroke="#8884d8"
//                         fill="url(#radarGradient)"
//                         fillOpacity={0.7}
//                         dot={{ r: 3, fill: "#ffffff" }}
//                         isAnimationActive={true}
//                     />
//                     <defs>
//                         <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
//                             <stop offset="100%" stopColor="#8884d8" stopOpacity={0.2} />
//                         </linearGradient>
//                     </defs>
//                 </RadarChart>
//             </ResponsiveContainer>
//         </motion.div>
//     );
// }

// const getAutodiscoverRecommendations = (portUsage, originalScores) => {
//     if (!Array.isArray(portUsage)) return [];

//     const recommendations = [];
//     let improvedEncryptedPorts = originalScores.encrypted_ports;
//     let improvedStandardPorts = originalScores.standard_ports;

//     const usedProtocols = new Set();

//     for (const item of portUsage) {
//         usedProtocols.add(item.protocol);

//         if (item.status === "insecure") {
//             recommendations.push({
//                 text: `⚠️ 建议将 ${item.protocol} 从不安全端口 ${item.port} 更换为安全端口（如 ${getSecurePort(item.protocol)}），可提升加密评分`,
//                 impact: "+40"
//             });
//             improvedEncryptedPorts = Math.min(improvedEncryptedPorts + 40, 100);
//         } else if (item.status === "nonstandard") {
//             recommendations.push({
//                 text: `⚠️ ${item.protocol} 使用了非标准端口 ${item.port}，建议更换为标准端口（如 ${getStandardPort(item.protocol)}）`,
//                 impact: "+20"
//             });
//             improvedStandardPorts = Math.min(improvedStandardPorts + 20, 100);
//         }
//     }

//     const simulatedOverall = Math.round(
//         (improvedEncryptedPorts + improvedStandardPorts + originalScores.cert_score + originalScores.connect_score) / 4
//     );

//     if (recommendations.length === 0) {
//         recommendations.push({ text: "✅ 配置使用了标准且安全的端口。无需修改。", impact: "" });
//     }

//     return {
//         tips: recommendations,
//         improvedScore: simulatedOverall,
//         improvedEncryptedPorts,
//         improvedStandardPorts,
//     };
// };

// const getSRVRecommendations = (portUsage, originalScores) => {
//     if (!Array.isArray(portUsage)) return [];

//     const recommendations = [];
//     let improvedEncryptedPorts = originalScores.encrypted_ports;
//     let improvedStandardPorts = originalScores.standard_ports;

//     const usedProtocols = new Set();

//     for (const item of portUsage) {
//         usedProtocols.add(item.Protocol);

//         if (item.status === "insecure") {
//             recommendations.push({
//                 text: `⚠️ 建议将 ${item.protocol} 从不安全端口 ${item.port} 更换为安全端口（如 ${getSecurePort(item.protocol)}），可提升加密评分`,
//                 impact: "+40"
//             });
//             improvedEncryptedPorts = Math.min(improvedEncryptedPorts + 40, 100);
//         } else if (item.status === "nonstandard") {
//             recommendations.push({
//                 text: `⚠️ ${item.protocol} 使用了非标准端口 ${item.port}，建议更换为标准端口（如 ${getStandardPort(item.protocol)}）`,
//                 impact: "+20"
//             });
//             improvedStandardPorts = Math.min(improvedStandardPorts + 20, 100);
//         }
//     }

//     const simulatedOverall = Math.round(
//         (improvedEncryptedPorts + improvedStandardPorts + originalScores.dnssec_score + originalScores.connect_score) / 4
//     );

//     if (recommendations.length === 0) {
//         recommendations.push({ text: "✅ 配置使用了标准且安全的端口。无需修改。", impact: "" });
//     }
//     console.log("SRV portsUsage sample:", portUsage);
//     console.log("Recommendations generated:", recommendations);

//     return {
//         tips: recommendations,
//         improvedScore: simulatedOverall,
//         improvedEncryptedPorts,
//         improvedStandardPorts,
//     };
// };

// const getSecurePort = (protocol) => {
//     switch (protocol) {
//         case "SMTP": return "465";
//         case "IMAP": return "993";
//         case "POP3": return "995";
//         default: return "安全端口";
//     }
// };

// const getStandardPort = (protocol) => {
//     switch (protocol) {
//         case "SMTP": return "25 / 587";
//         case "IMAP": return "143";
//         case "POP3": return "110";
//         default: return "标准端口";
//     }
// };

// const getCertRecommendations = (certInfo, originalScores) => {
//     if (!certInfo || typeof certInfo !== 'object') return [];

//     const recommendations = [];
//     let certScore = originalScores.cert_score;

//     if (!certInfo.IsTrusted) {
//         recommendations.push({
//             text: "⚠️ 当前证书不是由受信任 CA 签发，建议更换为权威机构签发的证书。",
//             impact: "+25"
//         });
//         certScore = Math.min(certScore + 25, 100);
//     }

//     if (!certInfo.IsHostnameMatch) {
//         recommendations.push({
//             text: "⚠️ 证书域名与服务器地址不匹配，建议使用与实际主机名一致的证书。",
//             impact: "+20"
//         });
//         certScore = Math.min(certScore + 20, 100);
//     }

//     if (certInfo.IsExpired) {
//         recommendations.push({
//             text: "⚠️ 当前证书已过期，建议尽快更换为新的有效证书。",
//             impact: "+30"
//         });
//         certScore = Math.min(certScore + 30, 100);
//     }

//     if (certInfo.IsSelfSigned) {
//         recommendations.push({
//             text: "⚠️ 当前为自签名证书，缺乏第三方验证，建议使用由可信 CA 签发的证书。",
//             impact: "+25"
//         });
//         certScore = Math.min(certScore + 25, 100);
//     }

//     if (certInfo.SignatureAlg && certInfo.SignatureAlg.toLowerCase().includes("sha1")) {
//         recommendations.push({
//             text: "⚠️ 证书使用了弱签名算法 SHA1，建议使用 SHA256 或更强的算法。",
//             impact: "+15"
//         });
//         certScore = Math.min(certScore + 15, 100);
//     }

//     if (certInfo.TLSVersion < 0x0303) { // TLS 1.2 以下
//         recommendations.push({
//             text: "⚠️ 服务器使用了过时的 TLS 协议版本，建议升级到 TLS 1.2 或更高。",
//             impact: "+10"
//         });
//         certScore = Math.min(certScore + 10, 100);
//     }

//     if (recommendations.length === 0) {
//         recommendations.push({
//             text: "✅ 当前证书配置良好，未发现需要优化的问题。",
//             impact: ""
//         });
//     }

//     // 模拟总分改进后（其他分数保持不变）
//     const simulatedOverall = Math.round(
//         (originalScores.encrypted_ports + originalScores.standard_ports + certScore + originalScores.connect_score) / 4
//     );

//     return {
//         tips: recommendations,
//         improvedScore: simulatedOverall,
//         improvedCertScore: certScore
//     };
// };


// src/frontend/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import ConfigViewPage from "./ConfigViewPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/config-view" element={<ConfigViewPage />} />
            </Routes>
        </Router>
    );
}

export default App;
