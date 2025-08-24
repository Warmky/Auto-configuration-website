// /*7.22*/
// import React, { useState, useEffect } from "react";
// import {
//     ScoreBar,
//     renderScoreBar,
//     renderConnectionDetail,
//     getAutodiscoverRecommendations,
//     DefenseRadarChart,
//     getSRVRecommendations,
//     getSecurePort,
//     getStandardPort,
//     getCertRecommendations,
//     // 其他你从 renderHelpers.js 中导出的函数
// } from "./renderHelper";
// import { PeculiarCertificateViewer } from '@peculiar/certificates-viewer-react';
// function MainPage() {
//     const [email, setEmail] = useState("");
//     const [results, setResults] = useState({});
//     const [errors, setErrors] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [recentlySeen, setRecentlySeen] = useState([]);
//     const [showAnalysis, setShowAnalysis] = useState({});
//     const [activeTab, setActiveTab] = useState({});
//     const [showRawConfig, setShowRawConfig] = useState({});
//     const [showRawCertsMap, setShowRawCertsMap] = useState({});
//     const [activeCertIdxMap, setActiveCertIdxMap] = useState({});
//     const [showCertChainMap, setShowCertChainMap] = useState({});
//     const [expandedMechanism, setExpandedMechanism] = useState(null);/*7.22 */


//     const toggleCertChain = (mech) => {
//         setShowCertChainMap(prev => ({
//             ...prev,
//             [mech]: !prev[mech],
//         }));
//     };


//     const toggleRawCerts = (mech) => {
//         setShowRawCertsMap(prev => ({
//             ...prev,
//             [mech]: !prev[mech],
//         }));
//     };

//     const setActiveCertIdx = (mech, idx) => {
//         setActiveCertIdxMap(prev => ({
//             ...prev,
//             [mech]: idx,
//         }));
//     };


//     const mechanisms = ["autodiscover", "autoconfig", "srv", "guess"];

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

//     const toggleAnalysis = (mech) => {
//         setShowAnalysis(prev => ({ ...prev, [mech]: !prev[mech] }));
//     };

//     const changeTab = (mech, tabName) => {
//         setActiveTab(prev => ({ ...prev, [mech]: tabName }));
//     };

//     const handleGuessViewClick = async (details) => {
//         try {
//             const res = await fetch('http://localhost:8081/store-temp-data', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ details })
//             });

//             if (!res.ok) throw new Error('Failed to store data');

//             const { id } = await res.json();
//             const newTab = window.open(`/config-view?uri=guess_results&id=${id}, '_blank'`);
//             if (!newTab) alert("⚠️ 请允许浏览器弹出窗口。");

//         } catch (err) {
//             console.error("❌ Error storing GUESS detail:", err);
//             alert("❌ 无法打开连接详情（GUESS）页面。");
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

//     const handleViewClick = async (item) => {
//         const payload = {
//             config: item.config,
//             details: item.score_detail?.actualconnect_details || [],
//             certs: item.cert_info?.RawCerts || [],
//             uri: item.uri,
//         };

//         try {
//             const res = await fetch("http://localhost:8081/store-temp-data", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//             });

//             if (!res.ok) throw new Error("Failed to store temp data");

//             const { id } = await res.json();
//             const url = `/config-view?id=${encodeURIComponent(id)}`;
//             const newTab = window.open(url, "_blank");
//             if (!newTab) alert("⚠️ 请允许浏览器弹出窗口。");
//         } catch (err) {
//             console.error("❌ Failed to handle view click:", err);
//             alert("Error: Could not open detailed config view.");
//         }
//     };


//     return (
//         <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem", fontFamily: "Arial" }}>
//             <h1>Auto Configuration Checker</h1>
//             <div style={{ marginBottom: "1rem" }}>
//                 <input
//                     type="text"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter email address"
//                     style={{ padding: "0.5rem", width: "300px" }}
//                 />
//                 <button onClick={handleSearch} style={{ marginLeft: "1rem", padding: "0.5rem" }}>
//                     Check
//                 </button>
//             </div>

//             {loading && <p>⏳ Checking...</p>}
//             {errors && <p style={{ color: "red" }}>{errors}</p>}

//             {mechanisms.map(mech => {
//                 const result = results[mech];
//                 if (!result) return null;
//                 const score = result.score || {};
//                 const defense = result.score_detail?.defense;
//                 const portsUsage = result.score_detail?.ports_usage;
//                 const detail = result.score_detail?.connection;
//                 const certInfo = result.cert_info;

//                 return (
//                     <div key={mech} style={{ borderBottom: "1px solid #444", marginBottom: "3rem", paddingBottom: "2rem" }}>
//                         <h2>{mech.toUpperCase()} Result</h2>

//                         {/* 客观部分优先展示 */}
//                         {(mech === "autodiscover" || mech === "autoconfig") && result.all && (
//                             <div>
//                                 <h4>📡 All {mech.toUpperCase()} Methods</h4>
//                                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                                     <thead>
//                                         <tr>
//                                             <th style={thStyle}>Method</th>
//                                             <th style={thStyle}>Index</th>
//                                             <th style={thStyle}>URI</th>
//                                             <th style={thStyle}>Config</th>
//                                             <th style={thStyle}>Encrypted</th>
//                                             <th style={thStyle}>Standard</th>
//                                             <th style={thStyle}>Score</th>
//                                             <th style={thStyle}>View</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {result.all.map((item, idx) => (
//                                             <tr key={idx}>
//                                                 <td style={tdStyle}>{item.method}</td>
//                                                 <td style={tdStyle}>{item.index}</td>
//                                                 <td style={tdStyle}>{item.uri}</td>
//                                                 <td style={tdStyle}>{item.config ? "✅" : "❌"}</td>
//                                                 <td style={tdStyle}>{item.score?.encrypted_ports ?? "-"}</td>
//                                                 <td style={tdStyle}>{item.score?.standard_ports ?? "-"}</td>
//                                                 <td style={tdStyle}>{item.score?.overall ?? "-"}</td>
//                                                 <td style={tdStyle}>
//                                                     {item.config && (
//                                                         // <a href={/config-view?uri=${encodeURIComponent(item.uri)}&config=${btoa(encodeURIComponent(item.config))}&details=${btoa(JSON.stringify(item.score_detail?.actualconnect_details || []))}}
//                                                         //     target="_blank"
//                                                         //     rel="noopener noreferrer"
//                                                         //     style={{ color: "#8ac6ff", textDecoration: "underline" }}>
//                                                         //     查看
//                                                         // </a>
//                                                         <a
//                                                             href={`/config-view?uri=${encodeURIComponent(item.uri)}&config=${btoa(encodeURIComponent(item.config))}`}
//                                                             target="_blank"
//                                                             rel="noopener noreferrer"
//                                                             style={{
//                                                                 color: "#3498db",
//                                                                 textDecoration: "underline"
//                                                             }}
//                                                         >
//                                                             查看
//                                                         </a>
//                                                         // <button
//                                                         //     onClick={() => handleViewClick(item)}
//                                                         //     style={{
//                                                         //         background: "none",
//                                                         //         border: "none",
//                                                         //         color: "#8ac6ff",
//                                                         //         textDecoration: "underline",
//                                                         //         cursor: "pointer"
//                                                         //     }}
//                                                         // >
//                                                         //     查看
//                                                         // </button>

//                                                     )}
//                                                 </td>
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

//                                 {/* 端口使用信息展示 7.27*/}
//                                 {Array.isArray(portsUsage) && portsUsage.length > 0 && (
//                                     <div style={{ marginTop: "2rem" }}>
//                                         <h4 style={{ marginBottom: "1rem" }}>🔌 Service Configuration Overview</h4>
//                                         <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
//                                             {portsUsage.map((item, idx) => (
//                                                 <div
//                                                     key={idx}
//                                                     style={{
//                                                         backgroundColor: "#222",
//                                                         color: "#ddd",
//                                                         padding: "1rem",
//                                                         borderRadius: "12px",
//                                                         boxShadow: "0 2px 8px rgba(85, 136, 207, 0.05)",
//                                                         border: "1px solid #eee",
//                                                         minWidth: "220px",
//                                                         flex: "1",
//                                                         maxWidth: "280px"
//                                                     }}
//                                                 >
//                                                     <table
//                                                         style={{
//                                                             width: "100%",
//                                                             borderCollapse: "collapse"
//                                                         }}
//                                                     >
//                                                         <tbody>
//                                                             <tr>
//                                                                 <td style={tdStyle}><strong>Protocol</strong></td>
//                                                                 <td style={tdStyle}>{item.protocol}</td>
//                                                             </tr>
//                                                             <tr>
//                                                                 <td style={tdStyle}><strong>Port</strong></td>
//                                                                 <td style={tdStyle}>{item.port}</td>
//                                                             </tr>
//                                                             <tr>
//                                                                 <td style={tdStyle}><strong>Host</strong></td>
//                                                                 <td style={tdStyle}>{item.host}</td>
//                                                             </tr>
//                                                             <tr>
//                                                                 <td style={tdStyle}><strong>SSL</strong></td>
//                                                                 <td style={tdStyle}>{item.ssl}</td>
//                                                             </tr>
//                                                             <tr>
//                                                                 <td style={tdStyle}><strong>Username</strong></td>
//                                                                 <td style={tdStyle}>Your email address</td>
//                                                             </tr>
//                                                             <tr>
//                                                                 <td style={tdStyle}><strong>Password</strong></td>
//                                                                 <td style={tdStyle}>Your password</td>
//                                                             </tr>
//                                                         </tbody>
//                                                     </table>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>


//                                 )}

//                             </div>
//                         )}


//                         {(mech === "srv") && result.srv_records && (
//                             <>
//                                 <h4>📄 SRV Records</h4>
//                                 <pre style={{ background: "#222", color: "#ccc", padding: "10px", borderRadius: "4px" }}>
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

//                         {/* 原始配置 */}
//                         {mech !== "srv" && (
//                             <>
//                                 <h4
//                                     onClick={() => toggleRaw(mech)}
//                                     style={{ cursor: "pointer", color: "#8ac6ff", userSelect: "none" }}>
//                                     Raw Config {showRawConfig[mech] ? "▲" : "▼"}
//                                 </h4>
//                                 {showRawConfig[mech] && (
//                                     <pre style={{ background: "#2c3e50", padding: "12px", borderRadius: "6px" }}>
//                                         {result.config}
//                                     </pre>
//                                 )}

//                                 <h4>Cert Info</h4>
//                                 <ul>
//                                     {Object.entries(certInfo || {}).map(([k, v]) => (
//                                         k !== "RawCert" && k !== "RawCerts" && (
//                                             <li key={k}><strong>{k}:</strong> {String(v)}</li>
//                                         )
//                                     ))}
//                                     {certInfo?.RawCerts && (
//                                         <li>
//                                             <strong>RawCerts:</strong>
//                                             <button onClick={() => toggleRawCerts(mech)} style={{ marginLeft: '10px' }}>
//                                                 {showRawCertsMap[mech] ? "隐藏" : "展开"}
//                                             </button>
//                                             {showRawCertsMap[mech] && (
//                                                 <div style={{
//                                                     wordBreak: 'break-all',
//                                                     maxHeight: '200px',
//                                                     overflowY: 'auto',
//                                                     marginTop: '10px',
//                                                     background: '#5d90c3ff',
//                                                     padding: '8px',
//                                                     borderRadius: '6px'
//                                                 }}>
//                                                     {certInfo.RawCerts.join(', ')}
//                                                 </div>
//                                             )}
//                                         </li>
//                                     )}
//                                 </ul>

                                
//                                 {Array.isArray(certInfo?.RawCerts) && certInfo.RawCerts.length > 0 && (
//                                     <div style={{ marginTop: '20px' }}>
//                                         <h4
//                                             onClick={() => toggleCertChain(mech)}
//                                             style={{ cursor: "pointer", color: "#8ac6ff", userSelect: "none" }}
//                                         >
//                                             Certificate Chain {showCertChainMap[mech] ? "▲" : "▼"}
//                                         </h4>

//                                         {showCertChainMap[mech] && (
//                                             <>
//                                                 <div style={{ marginBottom: '10px' }}>
//                                                     {certInfo.RawCerts.map((_, idx) => (
//                                                         <button
//                                                             key={idx}
//                                                             onClick={() => setActiveCertIdx(mech, idx)}
//                                                             style={{
//                                                                 marginRight: '8px',
//                                                                 padding: '4px 10px',
//                                                                 backgroundColor: activeCertIdxMap[mech] === idx ? '#007bff' : '#ddd',
//                                                                 color: activeCertIdxMap[mech] === idx ? '#fff' : '#000',
//                                                                 border: 'none',
//                                                                 borderRadius: '4px',
//                                                                 cursor: 'pointer'
//                                                             }}
//                                                         >
//                                                             #{idx + 1}
//                                                         </button>
//                                                     ))}
//                                                 </div>
//                                                 <PeculiarCertificateViewer certificate={certInfo.RawCerts[activeCertIdxMap[mech] || 0]} />  
//                                             </>
//                                         )}
//                                     </div>
//                                 )}





//                             </>
//                         )}

//                         {/* 连接详情跳转 */}
//                         {mech === "srv" && result.score_detail?.actualconnect_details && (
//                             <a
//                                 href={`/config-view?uri=srv_records&config=${btoa("SRV_PLACEHOLDER")}&details=${btoa(JSON.stringify(result.score_detail.actualconnect_details))}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 style={{
//                                     display: "inline-block",
//                                     marginTop: "1rem",
//                                     backgroundColor: "#27ae60",
//                                     color: "white",
//                                     padding: "10px 15px",
//                                     textDecoration: "none",
//                                     borderRadius: "4px"
//                                 }}
//                             >
//                                 查看连接详情(SRV)
//                             </a>
//                         )}

//                         {mech === "guess" && result.score_detail?.actualconnect_details && (
//                             <button
//                                 onClick={() => handleGuessViewClick(result.score_detail.actualconnect_details)}
//                                 style={{
//                                     marginTop: "1rem",
//                                     backgroundColor: "#27ae60",
//                                     color: "white",
//                                     padding: "10px 15px",
//                                     border: "none",
//                                     borderRadius: "4px",
//                                     cursor: "pointer"
//                                 }}>
//                                 查看连接详情(GUESS)
//                             </button>
//                         )}

//                         {/* 折叠主观部分 */}
//                         <h3
//                             onClick={() => toggleAnalysis(mech)}
//                             style={{ marginTop: "20px", cursor: "pointer", color: "#ffde72", userSelect: "none" }}
//                         >
//                             {showAnalysis[mech] ? "⬆️ 收起分析结果" : "⬇️ 展开评分与建议"}
//                         </h3>

//                         {showAnalysis[mech] && (
//                             <>
//                                 {/* Tab 控制 */}
//                                 <div style={{ display: "flex", marginBottom: "1rem" }}>
//                                     {["score", "recommend", "radar"].map(tab => (
//                                         <button
//                                             key={tab}
//                                             onClick={() => changeTab(mech, tab)}
//                                             style={{
//                                                 padding: "8px 16px",
//                                                 marginRight: "8px",
//                                                 backgroundColor: (activeTab[mech] === tab ? "#2980b9" : "#7f8c8d"),
//                                                 color: "#fff",
//                                                 border: "none",
//                                                 borderRadius: "4px"
//                                             }}>
//                                             {tab.toUpperCase()}
//                                         </button>
//                                     ))}
//                                 </div>

//                                 {activeTab[mech] === "score" && (
//                                     <>
//                                         {renderScoreBar("Encrypted Ports", score.encrypted_ports || 0)}
//                                         {renderScoreBar("Standard Ports", score.standard_ports || 0)}
//                                         {renderScoreBar(
//                                             mech === "srv" ? "DNSSEC Score" : "Certificate Score",
//                                             mech === "srv" ? score.dnssec_score || 0 : score.cert_score || 0
//                                         )}
//                                         {renderScoreBar("Connection Score", score.connect_score || 0)}
//                                         {renderConnectionDetail(detail)}
//                                     </>
//                                 )}


//                                 {activeTab[mech] === "recommend" && (
//                                     <div style={{ backgroundColor: "#2980b9", padding: "15px", borderRadius: "6px" }}>
//                                         {mech === "autodiscover" && portsUsage && (() => {
//                                             const rec = getAutodiscoverRecommendations(portsUsage, score);
//                                             return (
//                                                 <>
//                                                     <h4>🔧 Port Usage Suggestions</h4>
//                                                     <ul>{rec.tips.map((tip, i) => <li key={i}>{tip.text} <b>{tip.impact}</b></li>)}</ul>
//                                                     <p><b>Estimated Score:</b> {rec.improvedScore}</p>
//                                                 </>
//                                             );
//                                         })()}
//                                         {mech === "srv" && portsUsage && (() => {
//                                             const rec = getSRVRecommendations(portsUsage, score);
//                                             return (
//                                                 <>
//                                                     <h4>🔧 Port Usage Suggestions</h4>
//                                                     <ul>{rec.tips.map((tip, i) => <li key={i}>{tip.text} <b>{tip.impact}</b></li>)}</ul>
//                                                     <p><b>Estimated Score:</b> {rec.improvedScore}</p>
//                                                 </>
//                                             );
//                                         })()}
//                                         {/* {mech === "guess" && portsUsage && (() => {
//                                             const rec = getGUESSRecommendations(portsUsage, score);
//                                             return (
//                                                 <>
//                                                     <h4>🔧 Port Usage Suggestions</h4>
//                                                     <ul>{rec.tips.map((tip, i) => <li key={i}>{tip.text} <b>{tip.impact}</b></li>)}</ul>
//                                                     <p><b>Estimated Score:</b> {rec.improvedScore}</p>
//                                                 </>
//                                             );
//                                         })()} */}  
//                                         {(mech === "autodiscover" || mech === "autoconfig") && certInfo && (() => {
//                                             const rec = getCertRecommendations(certInfo, score);
//                                             return (
//                                                 <>
//                                                     <h4>📜 Certificate Suggestions</h4>
//                                                     <ul>{rec.tips.map((tip, i) => <li key={i}>{tip.text} <b>{tip.impact}</b></li>)}</ul>
//                                                     <p><b>Estimated Score:</b> {rec.improvedScore}</p>
//                                                 </>
//                                             );
//                                         })()}
//                                     </div>
//                                 )}

//                                 {activeTab[mech] === "radar" && defense && (
//                                     <DefenseRadarChart data={defense} />
//                                 )}
//                             </>
//                         )}
//                     </div>
//                 );
//             })}

//             {/* Recently Seen */}
//             <h2>Recently Seen</h2>
//             {recentlySeen.length > 0 ? (
//                 <ul>
//                     {recentlySeen.map((item, index) => (
//                         <li key={index}>
//                             <strong>{item.domain}</strong> - Score: {item.score}, Grade: {item.grade}, Time:{" "}
//                             {new Date(item.timestamp).toLocaleString()}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>No Records</p>
//             )}

//             {/* <CSVUploadForm />  */}  

//         </div>
//     );
// }

// export default MainPage;

// import React, { useState, useEffect } from "react";
// import {
//     ScoreBar,
//     renderScoreBar,
//     renderConnectionDetail,
//     getAutodiscoverRecommendations,
//     DefenseRadarChart,
//     getSRVRecommendations,
//     getSecurePort,
//     getStandardPort,
//     getCertRecommendations,
// } from "./renderHelper";
// import { PeculiarCertificateViewer } from '@peculiar/certificates-viewer-react';

// function MainPage() {
//     const [email, setEmail] = useState("");
//     const [results, setResults] = useState({});
//     const [errors, setErrors] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [recentlySeen, setRecentlySeen] = useState([]);
//     const [showAnalysis, setShowAnalysis] = useState({});
//     const [activeTab, setActiveTab] = useState({});
//     const [showRawConfig, setShowRawConfig] = useState({});
//     const [showRawCertsMap, setShowRawCertsMap] = useState({});
//     const [activeCertIdxMap, setActiveCertIdxMap] = useState({});
//     const [showCertChainMap, setShowCertChainMap] = useState({});

//     // 新增：控制哪种机制当前展开
//     const [expandedMechanism, setExpandedMechanism] = useState(null);

//     const mechanisms = ["autodiscover", "autoconfig", "srv", "guess"];

//     useEffect(() => {
//         fetchRecent();
//     }, []);

//     // 新增：当 results 更新时，默认展开第一个有结果的机制
//     useEffect(() => {
//         if (!results) return;
//         const firstAvailable = mechanisms.find((m) => results[m]);
//         setExpandedMechanism(firstAvailable || null);
//     }, [results]);

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
//         setShowRawConfig((prev) => ({ ...prev, [mech]: !prev[mech] }));
//     };

//     const toggleAnalysis = (mech) => {
//         setShowAnalysis((prev) => ({ ...prev, [mech]: !prev[mech] }));
//     };

//     const changeTab = (mech, tabName) => {
//         setActiveTab((prev) => ({ ...prev, [mech]: tabName }));
//     };

//     const toggleRawCerts = (mech) => {
//         setShowRawCertsMap((prev) => ({ ...prev, [mech]: !prev[mech] }));
//     };

//     const toggleCertChain = (mech) => {
//         setShowCertChainMap((prev) => ({ ...prev, [mech]: !prev[mech] }));
//     };

//     const setActiveCertIdx = (mech, idx) => {
//         setActiveCertIdxMap((prev) => ({ ...prev, [mech]: idx }));
//     };

    // const handleViewClick = async (item) => {
    //     const payload = {
    //         config: item.config,
    //         details: item.score_detail?.actualconnect_details || [],
    //         certs: item.cert_info?.RawCerts || [],
    //         uri: item.uri,
    //     };

    //     try {
    //         const res = await fetch("http://localhost:8081/store-temp-data", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(payload),
    //         });

    //         if (!res.ok) throw new Error("Failed to store temp data");

    //         const { id } = await res.json();
    //         const url = `/config-view?id=${encodeURIComponent(id)}`;
    //         const newTab = window.open(url, "_blank");
    //         if (!newTab) alert("⚠️ 请允许浏览器弹出窗口。");
    //     } catch (err) {
    //         console.error("❌ Failed to handle view click:", err);
    //         alert("Error: Could not open detailed config view.");
    //     }
    // };

//     const handleGuessViewClick = async (details) => {
//         try {
//             const res = await fetch('http://localhost:8081/store-temp-data', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ details })
//             });

//             if (!res.ok) throw new Error('Failed to store data');

//             const { id } = await res.json();
//             const newTab = window.open(`/config-view?uri=guess_results&id=${id}`, '_blank');
//             if (!newTab) alert("⚠️ 请允许浏览器弹出窗口。");

//         } catch (err) {
//             console.error("❌ Error storing GUESS detail:", err);
//             alert("❌ 无法打开连接详情（GUESS）页面。");
//         }
//     };

//     // 样式定义
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

//     // 新增：切换机制折叠展开状态
//     const toggleExpandedMechanism = (mech) => {
//         setExpandedMechanism((prev) => (prev === mech ? null : mech));
//     };

//     return (
//         <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem", fontFamily: "Arial" }}>
//             <h1>Auto Configuration Checker</h1>
//             <div style={{ marginBottom: "1rem" }}>
//                 <input
//                     type="text"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter email address"
//                     style={{ padding: "0.5rem", width: "300px" }}
//                 />
//                 <button onClick={handleSearch} style={{ marginLeft: "1rem", padding: "0.5rem" }}>
//                     Check
//                 </button>
//             </div>

//             {loading && <p>⏳ Checking...</p>}
//             {errors && <p style={{ color: "red" }}>{errors}</p>}

//             {/* 遍历机制，折叠显示 */}
//             {mechanisms.map((mech) => {
//                 const result = results[mech];
//                 if (!result) return null;

//                 const score = result.score || {};
//                 const defense = result.score_detail?.defense;
//                 const portsUsage = result.score_detail?.ports_usage;
//                 const detail = result.score_detail?.connection;
//                 const certInfo = result.cert_info;

//                 const isExpanded = expandedMechanism === mech;

//                 return (
//                     <div
//                         key={mech}
//                         style={{
//                             borderBottom: "1px solid #444",
//                             marginBottom: "1rem",
//                             paddingBottom: "1rem",
//                             backgroundColor: "#111",
//                             borderRadius: "8px",
//                             padding: "10px"
//                         }}
//                     >
//                         <h2
//                             onClick={() => toggleExpandedMechanism(mech)}
//                             style={{
//                                 cursor: "pointer",
//                                 userSelect: "none",
//                                 color: "#8ac6ff",
//                                 marginBottom: "10px",
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                             }}
//                         >
//                             <span>{mech.toUpperCase()} Result</span>
//                             <span style={{ fontSize: "1.5rem" }}>{isExpanded ? "▼" : "▶"}</span>
//                         </h2>

//                         {isExpanded && (
//                             <>
//                                 {/* 你原有的机制内容全部放这里，注意缩进 */}

//                                 {/* 客观部分优先展示 */}
//                                 {(mech === "autodiscover" || mech === "autoconfig") && result.all && (
//                                     <div>
//                                         <h4>📡 All {mech.toUpperCase()} Methods</h4>
//                                         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                                             <thead>
//                                                 <tr>
//                                                     <th style={thStyle}>Method</th>
//                                                     <th style={thStyle}>Index</th>
//                                                     <th style={thStyle}>URI</th>
//                                                     <th style={thStyle}>Config</th>
//                                                     <th style={thStyle}>Encrypted</th>
//                                                     <th style={thStyle}>Standard</th>
//                                                     <th style={thStyle}>Score</th>
//                                                     <th style={thStyle}>View</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {result.all.map((item, idx) => (
//                                                     <tr key={idx}>
//                                                         <td style={tdStyle}>{item.method}</td>
//                                                         <td style={tdStyle}>{item.index}</td>
//                                                         <td style={tdStyle}>{item.uri}</td>
//                                                         <td style={tdStyle}>{item.config ? "✅" : "❌"}</td>
//                                                         <td style={tdStyle}>{item.score?.encrypted_ports ?? "-"}</td>
//                                                         <td style={tdStyle}>{item.score?.standard_ports ?? "-"}</td>
//                                                         <td style={tdStyle}>{item.score?.overall ?? "-"}</td>
//                                                         <td style={tdStyle}>
//                                                             {item.config && (
//                                                                 <a
//                                                                     href={`/config-view?uri=${encodeURIComponent(item.uri)}&config=${btoa(encodeURIComponent(item.config))}`}
//                                                                     target="_blank"
//                                                                     rel="noopener noreferrer"
//                                                                     style={{
//                                                                         color: "#3498db",
//                                                                         textDecoration: "underline"
//                                                                     }}
//                                                                 >
//                                                                     查看
//                                                                 </a>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>

//                                         {(() => {
//                                             const configs = result.all.map(r => r.config).filter(Boolean);
//                                             const unique = [...new Set(configs)];
//                                             if (unique.length > 1) {
//                                                 return (
//                                                     <p style={{ color: "#e74c3c", marginTop: "10px" }}>
//                                                         ⚠️ 检测到多个路径配置结果不一致，请手动确认是否存在配置偏差！
//                                                     </p>
//                                                 );
//                                             }
//                                             return null;
//                                         })()}

//                                         {/* 端口使用信息展示 */}
//                                         {Array.isArray(portsUsage) && portsUsage.length > 0 && (
//                                             <div style={{ marginTop: "2rem" }}>
//                                                 <h4 style={{ marginBottom: "1rem" }}>🔌 Service Configuration Overview</h4>
//                                                 <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
//                                                     {portsUsage.map((item, idx) => (
//                                                         <div
//                                                             key={idx}
//                                                             style={{
//                                                                 backgroundColor: "#222",
//                                                                 color: "#ddd",
//                                                                 padding: "1rem",
//                                                                 borderRadius: "12px",
//                                                                 boxShadow: "0 2px 8px rgba(85, 136, 207, 0.05)",
//                                                                 border: "1px solid #eee",
//                                                                 minWidth: "220px",
//                                                                 flex: "1",
//                                                                 maxWidth: "280px"
//                                                             }}
//                                                         >
//                                                             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                                                                 <tbody>
//                                                                     <tr>
//                                                                         <td style={tdStyle}><strong>Protocol</strong></td>
//                                                                         <td style={tdStyle}>{item.protocol}</td>
//                                                                     </tr>
//                                                                     <tr>
//                                                                         <td style={tdStyle}><strong>Port</strong></td>
//                                                                         <td style={tdStyle}>{item.port}</td>
//                                                                     </tr>
//                                                                     <tr>
//                                                                         <td style={tdStyle}><strong>Host</strong></td>
//                                                                         <td style={tdStyle}>{item.host}</td>
//                                                                     </tr>
//                                                                     <tr>
//                                                                         <td style={tdStyle}><strong>SSL</strong></td>
//                                                                         <td style={tdStyle}>{item.ssl}</td>
//                                                                     </tr>
//                                                                     <tr>
//                                                                         <td style={tdStyle}><strong>Username</strong></td>
//                                                                         <td style={tdStyle}>Your email address</td>
//                                                                     </tr>
//                                                                     <tr>
//                                                                         <td style={tdStyle}><strong>Password</strong></td>
//                                                                         <td style={tdStyle}>Your password</td>
//                                                                     </tr>
//                                                                 </tbody>
//                                                             </table>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}

//                                 {/* srv */}
//                                 {(mech === "srv") && result.srv_records && (
//                                     <>
//                                         <h4>📄 SRV Records</h4>
//                                         <pre style={{ background: "#222", color: "#ccc", padding: "10px", borderRadius: "4px" }}>
//                                             {JSON.stringify(result.srv_records, null, 2)}
//                                         </pre>
//                                         {result.dns_record && (
//                                             <>
//                                                 <h4>DNS Info</h4>
//                                                 <ul>
//                                                     {Object.entries(result.dns_record).map(([k, v]) => (
//                                                         <li key={k}><strong>{k}:</strong> {String(v)}</li>
//                                                     ))}
//                                                 </ul>
//                                             </>
//                                         )}
//                                     </>
//                                 )}

//                                 {/* 原始配置 */}
//                                 {mech !== "srv" && (
//                                     <>
//                                         <h4
//                                             onClick={() => toggleRaw(mech)}
//                                             style={{ cursor: "pointer", color: "#8ac6ff", userSelect: "none" }}>
//                                             Raw Config {showRawConfig[mech] ? "▲" : "▼"}
//                                         </h4>
//                                         {showRawConfig[mech] && (
//                                             <pre style={{ background: "#2c3e50", padding: "12px", borderRadius: "6px" }}>
//                                                 {result.config}
//                                             </pre>
//                                         )}

//                                         <h4>Cert Info</h4>
//                                         <ul>
//                                             {Object.entries(certInfo || {}).map(([k, v]) => (
//                                                 k !== "RawCert" && k !== "RawCerts" && (
//                                                     <li key={k}><strong>{k}:</strong> {String(v)}</li>
//                                                 )
//                                             ))}
//                                             {certInfo?.RawCerts && (
//                                                 <li>
//                                                     <strong>RawCerts:</strong>
//                                                     <button onClick={() => toggleRawCerts(mech)} style={{ marginLeft: '10px' }}>
//                                                         {showRawCertsMap[mech] ? "隐藏" : "展开"}
//                                                     </button>
//                                                     {showRawCertsMap[mech] && (
//                                                         <div style={{
//                                                             wordBreak: 'break-all',
//                                                             maxHeight: '200px',
//                                                             overflowY: 'auto',
//                                                             marginTop: '10px',
//                                                             background: '#5d90c3ff',
//                                                             padding: '8px',
//                                                             borderRadius: '6px'
//                                                         }}>
//                                                             {certInfo.RawCerts.join(', ')}
//                                                         </div>
//                                                     )}
//                                                 </li>
//                                             )}
//                                         </ul>

//                                         {Array.isArray(certInfo?.RawCerts) && certInfo.RawCerts.length > 0 && (
//                                             <div style={{ marginTop: '20px' }}>
//                                                 <h4
//                                                     onClick={() => toggleCertChain(mech)}
//                                                     style={{ cursor: "pointer", color: "#8ac6ff", userSelect: "none" }}
//                                                 >
//                                                     Certificate Chain {showCertChainMap[mech] ? "▲" : "▼"}
//                                                 </h4>

//                                                 {showCertChainMap[mech] && (
//                                                     <>
//                                                         <div style={{ marginBottom: '10px' }}>
//                                                             {certInfo.RawCerts.map((_, idx) => (
//                                                                 <button
//                                                                     key={idx}
//                                                                     onClick={() => setActiveCertIdx(mech, idx)}
//                                                                     style={{
//                                                                         marginRight: '8px',
//                                                                         padding: '4px 10px',
//                                                                         backgroundColor: activeCertIdxMap[mech] === idx ? '#007bff' : '#ddd',
//                                                                         color: activeCertIdxMap[mech] === idx ? '#fff' : '#000',
//                                                                         border: 'none',
//                                                                         borderRadius: '4px',
//                                                                         cursor: 'pointer'
//                                                                     }}
//                                                                 >
//                                                                     #{idx + 1}
//                                                                 </button>
//                                                             ))}
//                                                         </div>
//                                                         <PeculiarCertificateViewer certificate={certInfo.RawCerts[activeCertIdxMap[mech] || 0]} />
//                                                     </>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </>
//                                 )}

                                // {/* 连接详情跳转 */}
                                // {mech === "srv" && result.score_detail?.actualconnect_details && (
                                //     <a
                                //         href={`/config-view?uri=srv_records&config=${btoa("SRV_PLACEHOLDER")}&details=${btoa(JSON.stringify(result.score_detail.actualconnect_details))}`}
                                //         target="_blank"
                                //         rel="noopener noreferrer"
                                //         style={{
                                //             display: "inline-block",
                                //             marginTop: "1rem",
                                //             backgroundColor: "#27ae60",
                                //             color: "white",
                                //             padding: "10px 15px",
                                //             textDecoration: "none",
                                //             borderRadius: "4px"
                                //         }}
                                //     >
                                //         查看连接详情(SRV)
                                //     </a>
                                // )}

                                // {mech === "guess" && result.score_detail?.actualconnect_details && (
                                //     <button
                                //         onClick={() => handleGuessViewClick(result.score_detail.actualconnect_details)}
                                //         style={{
                                //             marginTop: "1rem",
                                //             backgroundColor: "#27ae60",
                                //             color: "white",
                                //             padding: "10px 15px",
                                //             border: "none",
                                //             borderRadius: "4px",
                                //             cursor: "pointer"
                                //         }}>
                                //         查看连接详情(GUESS)
                                //     </button>
                                // )}

//                                 {/* 折叠主观部分 */}
//                                 <h3
//                                     onClick={() => toggleAnalysis(mech)}
//                                     style={{ marginTop: "20px", cursor: "pointer", color: "#ffde72", userSelect: "none" }}
//                                 >
//                                     {showAnalysis[mech] ? "⬆️ 收起分析结果" : "⬇️ 展开评分与建议"}
//                                 </h3>

//                                 {showAnalysis[mech] && (
//                                     <>
//                                         {/* Tab 控制 */}
//                                         <div style={{ display: "flex", marginBottom: "1rem" }}>
//                                             {["score", "recommend", "radar"].map(tab => (
//                                                 <button
//                                                     key={tab}
//                                                     onClick={() => changeTab(mech, tab)}
//                                                     style={{
//                                                         padding: "8px 16px",
//                                                         marginRight: "8px",
//                                                         backgroundColor: (activeTab[mech] === tab ? "#2980b9" : "#7f8c8d"),
//                                                         color: "#fff",
//                                                         border: "none",
//                                                         borderRadius: "4px"
//                                                     }}>
//                                                     {tab.toUpperCase()}
//                                                 </button>
//                                             ))}
//                                         </div>

//                                         {activeTab[mech] === "score" && (
//                                             <>
//                                                 {renderScoreBar("Encrypted Ports", score.encrypted_ports || 0)}
//                                                 {renderScoreBar("Standard Ports", score.standard_ports || 0)}
//                                                 {renderScoreBar(
//                                                     mech === "srv" ? "DNSSEC Score" : "Certificate Score",
//                                                     mech === "srv" ? score.dnssec_score || 0 : score.cert_score || 0
//                                                 )}
//                                                 {renderScoreBar("Connection Score", score.connect_score || 0)}
//                                                 {renderConnectionDetail(detail)}
//                                             </>
//                                         )}

//                                         {activeTab[mech] === "recommend" && (
//                                             <div style={{ backgroundColor: "#2980b9", padding: "15px", borderRadius: "6px" }}>
//                                                 {mech === "autodiscover" && portsUsage && (() => {
//                                                     const rec = getAutodiscoverRecommendations(portsUsage, score);
//                                                     return (
//                                                         <>
//                                                             <h4>🔧 Port Usage Suggestions</h4>
//                                                             <ul>{rec.tips.map((tip, i) => <li key={i}>{tip.text} <b>{tip.impact}</b></li>)}</ul>
//                                                             <p><b>Estimated Score:</b> {rec.improvedScore}</p>
//                                                         </>
//                                                     );
//                                                 })()}
//                                                 {mech === "srv" && portsUsage && (() => {
//                                                     const rec = getSRVRecommendations(portsUsage, score);
//                                                     return (
//                                                         <>
//                                                             <h4>🔧 Port Usage Suggestions</h4>
//                                                             <ul>{rec.tips.map((tip, i) => <li key={i}>{tip.text} <b>{tip.impact}</b></li>)}</ul>
//                                                             <p><b>Estimated Score:</b> {rec.improvedScore}</p>
//                                                         </>
//                                                     );
//                                                 })()}
//                                                 {(mech === "autodiscover" || mech === "autoconfig") && certInfo && (() => {
//                                                     const rec = getCertRecommendations(certInfo, score);
//                                                     return (
//                                                         <>
//                                                             <h4>📜 Certificate Suggestions</h4>
//                                                             <ul>{rec.tips.map((tip, i) => <li key={i}>{tip.text} <b>{tip.impact}</b></li>)}</ul>
//                                                             <p><b>Estimated Score:</b> {rec.improvedScore}</p>
//                                                         </>
//                                                     );
//                                                 })()}
//                                             </div>
//                                         )}

//                                         {activeTab[mech] === "radar" && defense && (
//                                             <DefenseRadarChart data={defense} />
//                                         )}
//                                     </>
//                                 )}
//                             </>
//                         )}
//                     </div>
//                 );
//             })}

//             {/* Recently Seen */}
//             <h2>Recently Seen</h2>
//             {recentlySeen.length > 0 ? (
//                 <ul>
//                     {recentlySeen.map((item, index) => (
//                         <li key={index}>
//                             <strong>{item.domain}</strong> - Score: {item.score}, Grade: {item.grade}, Time:{" "}
//                             {new Date(item.timestamp).toLocaleString()}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>No Records</p>
//             )}

//         </div>
//     );
// }

// export default MainPage;


import React, { useState, useEffect } from "react";
import {
    ScoreBar,
    renderScoreBar,
    renderConnectionDetail,
    getAutodiscoverRecommendations,
    DefenseRadarChart,
    getSRVRecommendations,
    getCertRecommendations,
} from "./renderHelper";
import { PeculiarCertificateViewer } from '@peculiar/certificates-viewer-react';
import LinearProgress from '@mui/material/LinearProgress';

function MainPage() {
    const [email, setEmail] = useState("");
    const [results, setResults] = useState({});
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [recentlySeen, setRecentlySeen] = useState([]);
    const [showRawConfig, setShowRawConfig] = useState({});
    const [showRawCertsMap, setShowRawCertsMap] = useState({});
    const [activeCertIdxMap, setActiveCertIdxMap] = useState({});
    const [showCertChainMap, setShowCertChainMap] = useState({});
    const [showAnalysis, setShowAnalysis] = useState({});
    const [activeTab, setActiveTab] = useState({});
    const [progress, setProgress] = useState(0);
    const [liveLogs, setLiveLogs] = useState([]); 
    const [liveResult, setLiveResult] = useState(null); 
    const [testingHost, setTestingHost] = useState(null);

    const [stage, setStage] = useState("");
    const [progressMessage, setProgressMessage] = useState("");


    const mechanisms = ["autodiscover", "autoconfig", "srv", "guess"];
    // 默认选中第一个有结果的机制
    const firstAvailable = mechanisms.find(m => results[m]) || mechanisms[0];
    const [currentMech, setCurrentMech] = useState(firstAvailable);

    useEffect(() => {
        fetchRecent();
    }, []);

    useEffect(() => {
        // 当 results 更新时，自动切换到第一个有结果机制
        const first = mechanisms.find(m => results[m]);
        if (first) setCurrentMech(first);
    }, [results]);

    const fetchRecent = () => {
        fetch("http://localhost:8081/api/recent")
            .then((res) => res.json())
            .then((data) => setRecentlySeen(data))
            .catch((err) => console.error("Failed to fetch recent scans:", err));
    };

    const handleSearch = async () => {
        if (!email) {
            setErrors("请输入邮箱地址");
            return;
        }

        setErrors("");
        setLoading(true);
        setProgress(0);
        setStage("开始检测");
        setProgressMessage("");

        const ws = new WebSocket("ws://localhost:8081/ws/checkall-progress");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "progress") {
                setProgress(data.progress);
                setStage(data.stage);
                setProgressMessage(data.message);

                // ✅ 检测完成时关闭 WS
                if (data.progress === 100) {
                    ws.close();
                }
            }
        };

        ws.onerror = () => {
            console.error("WebSocket 连接失败");
        };

        ws.onclose = () => {
            console.log("进度 WebSocket 已关闭");
        };

        try {
            const response = await fetch(`http://localhost:8081/checkAll?email=${email}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setResults(result);
        } catch (err) {
            console.error(err);
            setErrors("检测失败，请重试");
        } finally {
            setLoading(false);
            // ❌ 不要在这里关闭 WS，否则进度还没推完就断掉
        }
    };



    // const handleSearch = async () => {
    //     setResults({});
    //     setErrors("");
    //     setLoading(true);
    //     try {
    //         const response = await fetch(`http://localhost:8081/checkAll?email=${email}`);
    //         if (!response.ok) throw new Error("No valid configuration found.");
    //         const data = await response.json();
    //         setResults(data);
    //         fetchRecent();
    //     } catch (err) {
    //         setErrors(err.message);
    //     }
    //     setLoading(false);
    // };

    const toggleRaw = (mech) => {
        setShowRawConfig((prev) => ({ ...prev, [mech]: !prev[mech] }));
    };

    const toggleRawCerts = (mech) => {
        setShowRawCertsMap((prev) => ({ ...prev, [mech]: !prev[mech] }));
    };

    const toggleCertChain = (mech) => {
        setShowCertChainMap((prev) => ({ ...prev, [mech]: !prev[mech] }));
    };

    const setActiveCertIdx = (mech, idx) => {
        setActiveCertIdxMap((prev) => ({ ...prev, [mech]: idx }));
    };

    const toggleAnalysis = (mech) => {
        setShowAnalysis((prev) => ({ ...prev, [mech]: !prev[mech] }));
    };

    const changeTab = (mech, tabName) => {
        setActiveTab((prev) => ({ ...prev, [mech]: tabName }));
    };

    // 在组件里定义一个通用函数
    const handleViewDetailsClick = async (mechType, details) => {
        try {
            const res = await fetch("http://localhost:8081/store-temp-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ details }),
            });

            if (!res.ok) throw new Error("Failed to store data");

            const { id } = await res.json();
            const newTab = window.open(`/config-view?uri=${mechType}_results&id=${id}`, "_blank");
            if (!newTab) alert("⚠️ 请允许浏览器弹出窗口。");
        } catch (err) {
            console.error(`❌ Error storing ${mechType} detail:`, err);
            alert(`❌ 无法打开连接详情（${mechType.toUpperCase()}）页面。`);
        }
    };

    // 公用按钮样式
    const viewButtonStyle = {
        display: "inline-block",
        marginTop: "1rem",
        backgroundColor: "#27ae60",
        color: "white",
        padding: "10px 15px",
        textDecoration: "none",
        borderRadius: "4px",
        cursor: "pointer",
    };


    // 样式
    const tabStyle = (mech) => ({
        cursor: "pointer",
        padding: "10px 20px",
        borderBottom: mech === currentMech ? "3px solid #3498db" : "3px solid transparent",
        color: mech === currentMech ? "#3498db" : "#888",
        fontWeight: mech === currentMech ? "bold" : "normal",
        userSelect: "none",
        marginRight: "10px",
    });

    const thStyle = {
        padding: "8px",
        backgroundColor: "#a1ccdeff",
        color: "#fff",
        textAlign: "left"
    };
    const tdStyle = {
        padding: "8px",
        color: "#485156ff",
        fontSize: "14px"
    };

    // 当前机制内容渲染函数7.28
    const renderMechanismContent = (mech) => {
        const result = results[mech];
        if (!result && Object.keys(results).length === 0) return null;
        if (!result) return <p style={{ color: "gray" }}>No data for {mech}</p>;

        const score = result.score || result.score_detail?.connection || {};
        // 8.10
        const defense = result.score_detail?.defense;
        const portsUsage = result.score_detail?.ports_usage;
        const detail = result.score_detail?.connection;
        const certInfo = result.cert_info;
        const connectDetails = result.score_detail?.actualconnect_details;

        return (
            <div>
                {(mech === "autodiscover" || mech === "autoconfig") && result.all && (
                    <div>
                        <h4>📡 All {mech.toUpperCase()} Methods</h4>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {/* <th style={thStyle}>Method</th>
                                    <th style={thStyle}>Index</th>
                                    <th style={thStyle}>URI</th>
                                    <th style={thStyle}>Config</th>
                                    <th style={thStyle}>Encrypted</th>
                                    <th style={thStyle}>Standard</th>
                                    <th style={thStyle}>Score</th>
                                    <th style={thStyle}>View</th> */}
                                    <th style={thStyle}>途径</th>
                                    <th style={thStyle}>序号</th>
                                    <th style={thStyle}>请求URI</th>
                                    <th style={thStyle}>是否得到配置</th>
                                    <th style={thStyle}>加密评分</th>
                                    <th style={thStyle}>标准评分</th>
                                    <th style={thStyle}>分数</th>
                                    <th style={thStyle}>查看</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.all.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={tdStyle}>{item.method}</td>
                                        <td style={tdStyle}>{item.index}</td>
                                        <td style={tdStyle}>{item.uri}</td>
                                        <td style={tdStyle}>{item.config ? "✅" : "❌"}</td>
                                        <td style={tdStyle}>{item.score?.encrypted_ports ?? "-"}</td>
                                        <td style={tdStyle}>{item.score?.standard_ports ?? "-"}</td>
                                        <td style={tdStyle}>{item.score?.overall ?? "-"}</td>
                                        {/* <td style={tdStyle}>
                                            {item.config && (
                                                // <a
                                                //     href={`/config-view?uri=${encodeURIComponent(item.uri)}&config=${btoa(encodeURIComponent(item.config))}&details=${btoa(JSON.stringify(connectDetails))}`}//&rawCerts=${btoa(JSON.stringify(certInfo?.RawCerts || []))}
                                                //     target="_blank"
                                                //     rel="noopener noreferrer"
                                                //     style={{
                                                //         color: "#3498db",
                                                //         textDecoration: "underline"
                                                //     }}
                                                // >
                                                //     查看
                                                // </a>
                                            )}
                                        </td> */}
                                        <td style={tdStyle}>
                                            {item.config && (
                                                <button
                                                onClick={async () => {
                                                    console.log("当前 item:", item);

                                                    // ⚠️ 一定要用 item 自己的数据
                                                    const payload = {
                                                        config: item.config,
                                                        uri: item.uri,
                                                        details: item.score_detail?.actualconnect_details || [],
                                                        rawCerts: item.cert_info?.RawCerts || [],
                                                        mech: mech,
                                                    };

                                                    try {
                                                    const res = await fetch("http://localhost:8081/store-temp-data", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify(payload),
                                                    });

                                                    if (!res.ok) throw new Error("存储失败");

                                                    const { id } = await res.json();

                                                    // ✅ 避免 431：只带 id
                                                    window.open(`/config-view?id=${id}`, "_blank");
                                                    } catch (err) {
                                                    console.error("❌ 打开详情失败:", err);
                                                    alert("⚠️ 无法打开详情页");
                                                    }
                                                }}
                                                style={{
                                                    color: "#3498db",
                                                    textDecoration: "underline",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                }}
                                                >
                                                查看
                                                </button>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {(() => {
                            const configs = result.all.map(r => r.config).filter(Boolean);
                            const unique = [...new Set(configs)];
                            if (unique.length > 1) {
                                return (
                                    <p style={{ color: "#e74c3c", marginTop: "10px" }}>
                                        ⚠️ 检测到多个路径配置结果不一致，请手动确认是否存在配置偏差！
                                    </p>
                                );
                            }
                            return null;
                        })()}

                        {Array.isArray(portsUsage) && portsUsage.length > 0 && (
                            <div style={{ marginTop: "2rem" }}>
                                {/* <h4 style={{ marginBottom: "1rem" }}>🔌 Service Configuration Overview</h4> */}
                                <h4 style={{ marginBottom: "1rem" }}>🔌 配置信息概况</h4>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                                    {portsUsage.map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                backgroundColor: "#7ba8c6ff",
                                                color: "#ddd",
                                                padding: "1rem",
                                                borderRadius: "12px",
                                                boxShadow: "0 2px 8px rgba(85, 136, 207, 0.05)",
                                                border: "1px solid #eee",
                                                minWidth: "220px",
                                                flex: "1",
                                                maxWidth: "280px"
                                            }}
                                        >
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <tbody>
                                                    <tr>
                                                        {/* <td style={tdStyle}><strong>Protocol</strong></td> */}
                                                        <td style={tdStyle}><strong>协议</strong></td>
                                                        <td style={tdStyle}>{item.protocol}</td>
                                                    </tr>
                                                    <tr>
                                                        {/* <td style={tdStyle}><strong>Port</strong></td> */}
                                                        <td style={tdStyle}><strong>端口</strong></td>
                                                        <td style={tdStyle}>{item.port}</td>
                                                    </tr>
                                                    <tr>
                                                        {/* <td style={tdStyle}><strong>Host</strong></td> */}
                                                        <td style={tdStyle}><strong>主机名</strong></td>
                                                        <td style={tdStyle}>{item.host}</td>
                                                    </tr>
                                                    <tr>
                                                        {/* <td style={tdStyle}><strong>SSL</strong></td> */}
                                                        <td style={tdStyle}><strong>SSL类型</strong></td>
                                                        <td style={tdStyle}>{item.ssl}</td>
                                                    </tr>
                                                    <tr>
                                                        {/* <td style={tdStyle}><strong>Username</strong></td>
                                                        <td style={tdStyle}>Your email address</td> */}
                                                        <td style={tdStyle}><strong>用户名</strong></td>
                                                        <td style={tdStyle}>你的邮件地址</td>
                                                    </tr>
                                                    <tr>
                                                        {/* <td style={tdStyle}><strong>Password</strong></td>
                                                        <td style={tdStyle}>Your password</td> */}
                                                        <td style={tdStyle}><strong>密码</strong></td>
                                                        <td style={tdStyle}>你的邮箱密码</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {mech === "srv" && result.srv_records && (
                    <>
                        {/* <h4>📄 SRV Records</h4> */}
                        <h4>📄 SRV 记录</h4>
                        <pre style={{ background: "#7ba8c6ff", color: "#4c5a64ff", padding: "10px", borderRadius: "4px" }}>
                            {JSON.stringify(result.srv_records, null, 2)}
                        </pre>
                        {result.dns_record && (
                            <>
                                {/* <h4>DNS Info</h4> */}
                                <h4>DNS 信息</h4>
                                <ul>
                                    {Object.entries(result.dns_record).map(([k, v]) => (
                                        <li key={k}><strong>{k}:</strong> {String(v)}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </>
                )}
                {mech === "srv" && result.srv_records && (
                <div style={{ marginTop: "2rem" }}>
                    {/* <h4 style={{ marginBottom: "1rem" }}>📄 SRV Records - Receive (Recv)</h4> */}
                    <h4 style={{ marginBottom: "1rem" }}>📄 SRV 记录 - 接收 (Recv)</h4>
                    {Array.isArray(result.srv_records.recv) && result.srv_records.recv.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                        {result.srv_records.recv.map((item, idx) => (
                        <div
                            key={`recv-${idx}`}
                            style={{
                            backgroundColor: "#7ba8c6ff",
                            color: "#ddd",
                            padding: "1rem",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                            border: "1px solid #ddd",
                            // minWidth: "220px",
                            minWidth: "300px",
                            flex: "1",
                            // maxWidth: "280px"
                            maxWidth: "300px"
                            }}
                        >
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <tbody>
                                <tr>
                                {/* <td style={tdStyle}><strong>Service</strong></td> */}
                                <td style={tdStyle}><strong>服务标签</strong></td>
                                <td style={tdStyle}>{item.Service}</td>
                                </tr>
                                <tr>
                                {/* <td style={tdStyle}><strong>Priority</strong></td> */}
                                <td style={tdStyle}><strong>优先级</strong></td>
                                <td style={tdStyle}>{item.Priority}</td>
                                </tr>
                                <tr>
                                {/* <td style={tdStyle}><strong>Weight</strong></td> */}
                                <td style={tdStyle}><strong>权重</strong></td>
                                <td style={tdStyle}>{item.Weight}</td>
                                </tr>
                                <tr>
                                {/* <td style={tdStyle}><strong>Port</strong></td> */}
                                <td style={tdStyle}><strong>端口</strong></td>
                                <td style={tdStyle}>{item.Port}</td>
                                </tr>
                                <tr>
                                {/* <td style={tdStyle}><strong>Target</strong></td> */}
                                <td style={tdStyle}><strong>邮件服务器</strong></td>
                                <td style={tdStyle}>{item.Target}</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <p>No receive records found.</p>
                    )}

                    {/* <h4 style={{ margin: "2rem 0 1rem" }}>📄 SRV Records - Send</h4> */}
                    <h4 style={{ marginBottom: "1rem" }}>📄 SRV 记录 - 发送 (Send)</h4>
                    {Array.isArray(result.srv_records.send) && result.srv_records.send.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                        {result.srv_records.send.map((item, idx) => (
                        <div
                            key={`send-${idx}`}
                            style={{
                            backgroundColor: "#7ba8c6ff",
                            color: "#ddd",
                            padding: "1rem",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                            border: "1px solid #ddd",
                            minWidth: "300px",
                            flex: "1",
                            maxWidth: "300px"
                            }}
                        >
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <tbody>
                                <tr>
                                {/* <td style={tdStyle}><strong>Service</strong></td> */}
                                <td style={tdStyle}><strong>服务标签</strong></td>
                                <td style={tdStyle}>{item.Service}</td>
                                </tr>
                                <tr>
                                {/* <td style={tdStyle}><strong>Priority</strong></td> */}
                                <td style={tdStyle}><strong>优先级</strong></td>
                                <td style={tdStyle}>{item.Priority}</td>
                                </tr>
                                <tr>
                                {/* <td style={tdStyle}><strong>Weight</strong></td> */}
                                <td style={tdStyle}><strong>权重</strong></td>
                                <td style={tdStyle}>{item.Weight}</td>
                                </tr>
                                <tr>
                                {/* <td style={tdStyle}><strong>Port</strong></td> */}
                                <td style={tdStyle}><strong>端口</strong></td>
                                <td style={tdStyle}>{item.Port}</td>
                                </tr>
                                <tr>
                                <td style={tdStyle}><strong>Target</strong></td>
                                {/* <td style={tdStyle}><strong>邮件服务器</strong></td> */}
                                <td style={tdStyle}>{item.Target}</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <p>No send records found.</p>
                    )}
                </div>
                )}


                {mech !== "srv" && mech!=="guess" &&(
                    <>
                        <h4
                            onClick={() => toggleRaw(mech)}
                            style={{ cursor: "pointer", color: "#31587dff", userSelect: "none" }}>
                            Raw Config {showRawConfig[mech] ? "▲" : "▼"}
                        </h4>
                        {showRawConfig[mech] && (
                            <pre style={{ background: "#84b1d1ff", padding: "12px", borderRadius: "6px" }}>
                                {result.config}
                            </pre>
                        )}

                        <h4>Cert Info</h4>
                        <ul>
                            {Object.entries(certInfo || {}).map(([k, v]) => (
                                k !== "RawCert" && k !== "RawCerts" && (
                                    // <li key={k}><strong>{k}:</strong> {String(v)}</li> 7.28
                                    <li key={k} style={{ color: "#364957ff" }}>
                                        <strong>{k}:</strong> {String(v)}
                                    </li>
                                )
                            ))}
                            {certInfo?.RawCerts && (
                                <li>
                                    <strong>RawCerts:</strong>
                                    <button onClick={() => toggleRawCerts(mech)} style={{ marginLeft: '10px' }}>
                                        {showRawCertsMap[mech] ? "隐藏" : "展开"}
                                    </button>
                                    {showRawCertsMap[mech] && (
                                        <div style={{
                                            wordBreak: 'break-all',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            marginTop: '10px',
                                            background: '#a6d1e3ff',
                                            padding: '8px',
                                            borderRadius: '6px'
                                        }}>
                                            {certInfo.RawCerts.join(', ')}
                                        </div>
                                    )}
                                </li>
                            )}
                        </ul>

                        {Array.isArray(certInfo?.RawCerts) && certInfo.RawCerts.length > 0 && (
                            <div style={{ marginTop: '20px' }}>
                                <h4
                                    onClick={() => toggleCertChain(mech)}
                                    style={{ cursor: "pointer", color: "#3e5c79ff", userSelect: "none" }}
                                >
                                    Certificate Chain {showCertChainMap[mech] ? "▲" : "▼"}
                                </h4>

                                {showCertChainMap[mech] && (
                                    <>
                                        <div style={{ marginBottom: '10px' }}>
                                            {certInfo.RawCerts.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveCertIdx(mech, idx)}
                                                    style={{
                                                        marginRight: '8px',
                                                        padding: '4px 10px',
                                                        backgroundColor: activeCertIdxMap[mech] === idx ? '#5b73a9ff' : '#ddd',
                                                        color: activeCertIdxMap[mech] === idx ? '#8899beff' : '#000',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    #{idx + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <PeculiarCertificateViewer certificate={certInfo.RawCerts[activeCertIdxMap[mech] || 0]} />
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}

                
                {/* 连接详情跳转 */}
                {/* {["srv", "guess"].map(type => (
                    mech === type && result.score_detail?.actualconnect_details && (
                        <button
                            key={type}
                            onClick={() => handleViewDetailsClick(type, result.score_detail.actualconnect_details)}
                            style={viewButtonStyle}
                        >
                            查看连接详情({type.toUpperCase()})
                        </button>
                    )
                ))} */}
                
                {/* {mech === "srv" && result.score_detail?.actualconnect_details && (
                    <a
                        href={`/config-view?uri=srv_records&config=${btoa("SRV_PLACEHOLDER")}&details=${btoa(JSON.stringify(result.score_detail.actualconnect_details))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-block",
                            marginTop: "1rem",
                            backgroundColor: "#27ae60",
                            color: "white",
                            padding: "10px 15px",
                            textDecoration: "none",
                            borderRadius: "4px"
                        }}
                    >
                        查看连接详情(SRV)
                    </a>
                )} */}

                {/* GUESS 连接详情跳转 */}
                {/* {mech === "guess" && result.score_detail?.actualconnect_details && (
                    <a
                        href={`/config-view?uri=guess&config=${btoa("GUESS_PLACEHOLDER")}&details=${btoa(JSON.stringify(result.score_detail.actualconnect_details))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-block",
                            marginTop: "1rem",
                            backgroundColor: "#27ae60",
                            color: "white",
                            padding: "10px 15px",
                            textDecoration: "none",
                            borderRadius: "4px"
                        }}
                    >
                        查看连接详情(GUESS)
                    </a>
                )} */}
                {/* GUESS 连接详情跳转 */}
                {/* {mech === "guess" && result.score_detail?.actualconnect_details && (
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch("http://localhost:8081/store-temp-data", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ details: result.score_detail.actualconnect_details }),
                                });

                                if (!res.ok) throw new Error("Failed to store data");

                                const { id } = await res.json();
                                const newTab = window.open(`/config-view?uri=guess_results&id=${id}`, "_blank");
                                if (!newTab) alert("⚠️ 请允许浏览器弹出窗口。");
                            } catch (err) {
                                console.error("❌ Error storing GUESS detail:", err);
                                alert("❌ 无法打开连接详情（GUESS）页面。");
                            }
                        }}
                        style={{
                            display: "inline-block",
                            marginTop: "1rem",
                            backgroundColor: "#27ae60",
                            color: "white",
                            padding: "10px 15px",
                            textDecoration: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        查看连接详情(GUESS)
                    </button>
                )} */}


                {/* 8.12 TODO只是初步猜测成功的结果，涉及邮件协议实际连接的可以通过上面的查看连接详情实现*/}
                {/* {mech === "guess" && result.score_detail?.ports_usage?.map((item, idx) => (
                    <div key={idx}>
                        {item.host}:{item.port} 
                    </div>
                ))} */}
                {mech === "guess" && result.score_detail?.ports_usage?.length > 0 && (
                <div className="guess-result-card">
                    <h3>猜测到的可用邮件服务器</h3>
                    <p className="text-gray-600">
                    （以下是基于常见邮件服务前缀和端口的初步探测结果，表示这些服务器端口可以建立 TCP 连接。）
                    </p>
                    
                    <table className="table-auto border-collapse border border-gray-300 mt-3">
                    <thead>
                        <tr className="bg-gray-100">
                        <th style={{ fontSize: "18px", color: "#899db1ff", fontWeight: "bold" }} className="border border-gray-300 px-4 py-2">
                            主机
                        </th>
                        <th style={{ fontSize: "18px", color: "#87a4c2ff", fontWeight: "bold" }} className="border border-gray-300 px-4 py-2">
                            端口
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.score_detail.ports_usage.map((item, idx) => (
                        <tr key={idx}>
                            <td style={{ fontSize: "18px", color: "#4578e5ff", fontWeight: "bold" }} className="border border-gray-300 px-4 py-2">
                            {item.host}
                            </td>
                            <td style={{ fontSize: "18px", color: "#2a8cedff", fontWeight: "bold" }} className="border border-gray-300 px-4 py-2">
                            {item.port}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                    {/* <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => navigate(`/connection-details?domain=${domain}`)}
                    >
                    查看连接详情
                    </button> */}
                </div>
                )}

                {/* 连接详情跳转 */}
                {["srv", "guess"].map(type => (
                    mech === type && result.score_detail?.actualconnect_details && (
                        <button
                            key={type}
                            onClick={() => handleViewDetailsClick(type, result.score_detail.actualconnect_details)}
                            style={viewButtonStyle}
                        >
                            查看连接详情({type.toUpperCase()})
                        </button>
                    )
                ))}


                
                {/* 7.28 {mech === "guess" && result.score_detail?.actualconnect_details && (
                    <button
                        onClick={() => handleGuessViewClick(result.score_detail.actualconnect_details)}
                        style={{
                            marginTop: "1rem",
                            backgroundColor: "#27ae60",
                            color: "white",
                            padding: "10px 15px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}>
                        查看连接详情(GUESS)
                    </button>
                )} */}



                {/* 折叠主观分析 */}
                <h3
                    onClick={() => toggleAnalysis(mech)}
                    style={{ marginTop: "20px", cursor: "pointer", color: "#5f8fcaff", userSelect: "none" }}
                >
                    {showAnalysis[mech] ? "⬆️ 收起分析结果" : "⬇️ 展开评分与建议"}
                </h3>

                {showAnalysis[mech] && (
                    <>
                        <div style={{ display: "flex", marginBottom: "1rem" }}>
                            {["score", "recommend", "radar"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => changeTab(mech, tab)}
                                    style={{
                                        padding: "8px 16px",
                                        marginRight: "8px",
                                        backgroundColor: (activeTab[mech] === tab ? "#2980b9" : "#7f8c8d"),
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px"
                                    }}>
                                    {tab.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {activeTab[mech] === "score" && (
                            <>
                                {renderScoreBar("Encrypted Ports", score.encrypted_ports || 0)}
                                {renderScoreBar("Standard Ports", score.standard_ports || 0)}
                                {renderScoreBar(
                                    mech === "srv" ? "DNSSEC Score" : "Certificate Score",
                                    mech === "srv" ? score.dnssec_score || 0 : score.cert_score || 0
                                )}
                                {renderScoreBar("Connection Score", score.connect_score || 0)}
                                {renderConnectionDetail(detail)}
                            </>
                        )}

                        {activeTab[mech] === "recommend" && (
                            <div style={{ backgroundColor: "#7ab0ceff", padding: "15px", borderRadius: "6px" }}>
                                {mech === "autodiscover" && portsUsage && (() => {
                                    const rec = getAutodiscoverRecommendations(portsUsage, score);
                                    return (
                                        <>
                                            <h4>🔧 Port Usage Suggestions</h4>
                                            <ul>{rec.tips.map((tip, i) => <li key={i}>{tip.text} <b>{tip.impact}</b></li>)}</ul>
                                            <p><b>Estimated Score:</b> {rec.improvedScore}</p>
                                        </>
                                    );
                                })()}
                                {mech === "srv" && portsUsage && (() => {
                                    const rec = getSRVRecommendations(portsUsage, score);
                                    return (
                                        <>
                                            <h4>🔧 Port Usage Suggestions</h4>
                                            <ul>{rec.tips.map((tip, i) => <li key={i}>{tip.text} <b>{tip.impact}</b></li>)}</ul>
                                            <p><b>Estimated Score:</b> {rec.improvedScore}</p>
                                        </>
                                    );
                                })()}
                                {(mech === "autodiscover" || mech === "autoconfig") && certInfo && (() => {
                                    const rec = getCertRecommendations(certInfo, score);
                                    return (
                                        <>
                                            <h4>📜 Certificate Suggestions</h4>
                                            <ul>{rec.tips.map((tip, i) => <li key={i}>{tip.text} <b>{tip.impact}</b></li>)}</ul>
                                            <p><b>Estimated Score:</b> {rec.improvedScore}</p>
                                        </>
                                    );
                                })()}
                            </div>
                        )}

                        {activeTab[mech] === "radar" && defense && (
                            <DefenseRadarChart data={defense} />
                        )}
                    </>
                )}
            </div>
        );
    };
    const hasAnyResult = Object.values(results).some((r) => r && Object.keys(r).length > 0);{/*7.28 */}

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10vh", marginBottom: "2rem" }}> {/* 7.28 */}
        {/* <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Auto Configuration Checker</h1> */}
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>邮件自动化配置检测</h1>

        <div>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // placeholder="Enter email address"
                placeholder="请输入您的邮件地址"
                style={{
                    padding: "1rem",
                    width: "400px",
                    fontSize: "1.2rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                }}
            />
            <button
                onClick={handleSearch}
                style={{
                    marginLeft: "1rem",
                    padding: "1rem",
                    fontSize: "1.2rem",
                    borderRadius: "8px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                {/* Check */}
                开始检测
            </button>
        </div>

        {loading && (
            <div style={{ marginTop: "1rem", width: "400px", textAlign: "center" }}>
                <div style={{ background: "#eee", borderRadius: "10px", overflow: "hidden", height: "20px", marginBottom: "0.5rem" }}>
                    <div style={{
                        width: `${progress}%`,
                        background: "#1976d2",
                        height: "100%",
                        transition: "width 0.3s ease"
                    }}></div>
                </div>
                <p>{progress}% - {stage} - {progressMessage}</p>
            </div>
        )}

        {/* {loading && <p>⏳ Checking...</p>} */}
        {/* {loading && (
            <div style={{ marginTop: "1rem" }}>
                <LinearProgress variant="determinate" value={progress} />
                <p>Checking... {progress}%</p>
            </div>
        )} */}
        {errors && <p style={{ color: "red" }}>{errors}</p>}

        {/* 机制 Tabs */}
        {/* <div style={{ display: "flex", borderBottom: "2px solid #ddd", marginBottom: "1rem" }}>
            {mechanisms.map((mech) => (
                <div
                    key={mech}
                    style={tabStyle(mech)}
                    onClick={() => setCurrentMech(mech)}
                >
                    {mech.toUpperCase()}
                </div>
            ))}
        </div> 7.28下面可用*/}
        {hasAnyResult && (
            <>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                    {mechanisms.map((mech) => (
                        <div
                            key={mech}
                            onClick={() => setCurrentMech(mech)}
                            style={{
                                padding: "0.8rem 1.2rem",
                                borderRadius: "10px",
                                cursor: "pointer",
                                backgroundColor: currentMech === mech ? "#1976d2" : "#a1aeb1ff",
                                color: currentMech === mech ? "#fff" : "#ccc",
                                border: currentMech === mech ? "2px solid #1976d2" : "2px solid #555",
                                boxShadow: currentMech === mech ? "0 2px 8px rgba(25, 118, 210, 0.4)" : "none",
                                transition: "all 0.2s ease-in-out",
                                minWidth: "120px",
                                textAlign: "center",
                                fontWeight: 600,
                                letterSpacing: "0.5px",
                            }}
                        >
                            {mech.toUpperCase()}
                        </div>
                    ))}
                </div>


                {/* 当前机制内容7.28 */}
                <div
                    style={{
                        width: "100%",
                        maxWidth: "900px",
                        backgroundColor: "#94c4dc",
                        padding: "2rem",
                        borderRadius: "12px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                        border: "1px solid #eee",
                        marginTop: "1rem"
                    }}
                >
                    {renderMechanismContent(currentMech)}
                </div>
            </>
        )}

        <CSVUploadForm />

        {/* Recently Seen */}
        {/* <h2 style={{ marginTop: "3rem" }}>Recently Seen</h2> */}
        <h2 style={{ marginTop: "3rem" }}>历史查询</h2>
        {recentlySeen.length > 0 ? (
            <ul>
                {recentlySeen.map((item, index) => (
                    <li key={index}>
                        <strong>{item.domain}</strong> - Score: {item.score}, Grade: {item.grade}, Time:{" "}
                        {new Date(item.timestamp).toLocaleString()}
                    </li>
                ))}
            </ul>
        ) : (
            // <p>No Records</p>
            <p>暂无记录</p>
        )}
        </div>

        
    );
}



function CSVUploadForm() {
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setDownloadUrl(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:8081/api/uploadCsvAndExportJsonl", {
            method: "POST",
            body: formData,
            });


            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = await res.json();
            setDownloadUrl(data.download_url);
        } catch (err) {
            alert("上传失败：" + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const res = await fetch(`http://localhost:8081${downloadUrl}`);
            if (!res.ok) {
                throw new Error("下载失败");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "result.jsonl"; // 可以改成动态文件名
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert("下载失败：" + err.message);
        }
    };


    // return (
    //     <div style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "10px" }}>
    //         <h3>📄 批量域名检测</h3>
    //         <input type="file" accept=".csv" onChange={handleUpload} />
    //         {isUploading && <p>处理中，请稍等...</p>}
    //         {downloadUrl && (
    //         <p>
    //             ✅ 查询完成，
    //             <button onClick={handleDownload}>点击下载结果</button>
    //         </p>
    //         )}
    //     </div>
    // );
    return (
        <div style={{ marginBottom: "30px", padding: "20px", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#333" }}>📄 批量域名检测</h3>
            
            {/* 上传按钮 */}
            <label 
                style={{ 
                    display: "inline-block",
                    padding: "10px 20px",
                    backgroundColor: "#79c9dfff",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background 0.3s"
                }}
            >
                选择 CSV 文件
                <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleUpload} 
                    style={{ display: "none" }}
                />
            </label>

            {isUploading && <p style={{ marginTop: "1rem", color: "#999" }}>⏳ 处理中，请稍等...</p>}

            {downloadUrl && (
                <p style={{ marginTop: "1rem" }}>
                    ✅ 查询完成，
                    <button 
                        onClick={handleDownload}
                        style={{
                            marginLeft: "10px",
                            padding: "8px 16px",
                            backgroundColor: "#70aadaff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        点击下载结果
                    </button>
                </p>
            )}
        </div>
    );

}



export default MainPage;
