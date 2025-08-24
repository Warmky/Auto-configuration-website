// // src/frontend/ConfigViewPage.jsx
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// function ConfigViewPage() {
//     const { mech, index } = useParams();
//     const [config, setConfig] = useState(null);

//     useEffect(() => {
//         fetch(`/api/get-config?mech=${mech}&index=${index}`)
//             .then((res) => res.json())
//             .then((data) => setConfig(data.content))
//             .catch(() => setConfig("⚠️ 获取配置失败"));
//     }, [mech, index]);

//     const handleDownload = () => {
//         const blob = new Blob([config], { type: 'text/xml' });
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(blob);
//         link.download = `${mech}_config_${index}.xml`;
//         link.click();
//     };

//     return (
//         <div style={{ padding: "30px", backgroundColor: "#111", color: "#fff", minHeight: "100vh" }}>
//             <h2>📄 {mech.toUpperCase()} Config (Index {index})</h2>
//             <button onClick={handleDownload} style={{
//                 padding: "10px", marginBottom: "20px", backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "4px"
//             }}>
//                 ⬇️ Download XML
//             </button>
//             <pre style={{
//                 backgroundColor: "#222", padding: "20px", borderRadius: "8px",
//                 border: "1px solid #444", whiteSpace: "pre-wrap", overflowX: "auto"
//             }}>
//                 {config || "Loading..."}
//             </pre>
//         </div>
//     );
// }

// export default ConfigViewPage;


// import React from 'react';
// import { useLocation } from 'react-router-dom';

// function ConfigViewPage() {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);

//   const uri = queryParams.get("uri");
//   const configEncoded = queryParams.get("config");
//   const actualConnectDetailsStr = queryParams.get("details");//8.13

//   let decodedConfig = "";
//   try {
//     decodedConfig = decodeURIComponent(atob(configEncoded));
//   } catch (error) {
//     decodedConfig = "⚠️ Error decoding configuration content.";
//   }
//   // 8.13
//   let connectDetails = [];
//   try {
//       const detailsJson = atob(actualConnectDetailsStr || "");
//       connectDetails = JSON.parse(detailsJson);
//   } catch (err) {
//       console.warn("⚠️ 无法解析 actualConnectDetails:", err);
//   } 
//   const renderConnectDetailTable = () => {
//       if (!Array.isArray(connectDetails) || connectDetails.length === 0) return null;

//       return (
//           <div style={{ marginTop: "2rem" }}>
//               <h3>🔌 Actual Connection Test Results</h3>
//               <table style={{ width: "100%", borderCollapse: "collapse", color: "#eee" }}>
//                   <thead>
//                       <tr style={{ backgroundColor: "#2c3e50" }}>
//                           <th>Protocol</th>
//                           <th>Host</th>
//                           <th>Port</th>
//                           <th>Plain</th>
//                           <th>STARTTLS</th>
//                           <th>TLS</th>
//                       </tr>
//                   </thead>
//                   <tbody>
//                       {connectDetails.map((item, idx) => (
//                           <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#34495e" : "#3d566e" }}>
//                               <td>{item.type}</td>
//                               <td>{item.host}</td>
//                               <td>{item.port}</td>
//                               <td>{renderConnectionInfo(item.plain)}</td>
//                               <td>{renderConnectionInfo(item.starttls)}</td>
//                               <td>{renderConnectionInfo(item.tls)}</td>
//                           </tr>
//                       ))}
//                   </tbody>
//               </table>
//           </div>
//       );
//   };

//   const renderConnectionInfo = (info) => {
//       if (!info || !info.success) return <span style={{ color: "red" }}>❌</span>;
//       return (
//           <div style={{ fontSize: "0.9em" }}>
//               ✅ <br />
//               TLS: {info.info?.version || "?"} <br />
//               Cipher: {info.info?.cipher?.join(', ') || "N/A"}
//           </div>
//       );
//   };


//   return (
//     <div style={{ backgroundColor: "#111", minHeight: "100vh", padding: "2rem", color: "#fff" }}>
//       <h2>📄 Configuration from Method</h2>
//       <p><strong>Requested URI:</strong> {uri}</p>

//       <pre style={{
//         background: "#1e1e1e",
//         color: "#eee",
//         padding: "20px",
//         borderRadius: "8px",
//         whiteSpace: "pre-wrap",
//         maxHeight: "80vh",
//         overflowY: "auto",
//         border: "1px solid #444"
//       }}>
//         {decodedConfig}
//       </pre>

//       <a
//         href={`data:text/plain;charset=utf-8,${encodeURIComponent(decodedConfig)}`}
//         download={`config_from_${encodeURIComponent(uri || 'unknown')}.xml`}
//         style={{
//           display: "inline-block",
//           marginTop: "1rem",
//           backgroundColor: "#3498db",
//           color: "#fff",
//           padding: "10px 15px",
//           textDecoration: "none",
//           borderRadius: "4px"
//         }}
//       >
//         ⬇️ Download Configuration
//       </a>

//       {renderConnectDetailTable()}
//     </div>
//   );
// }

// export default ConfigViewPage;


// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { PeculiarCertificateViewer } from '@peculiar/certificates-viewer-react';

// function ConfigViewPage() {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);

//   const uri = queryParams.get("uri");
//   const configEncoded = queryParams.get("config");
//   const tempId = queryParams.get("id"); // ✅ 新增，用于 GUESS / 临时存储

//   const [connectDetails, setConnectDetails] = useState([]);
//   const [rawCerts, setRawCerts] = useState([]);
//   const [showCertChain, setShowCertChain] = useState(false);
//   const [activeCertIdx, setActiveCertIdx] = useState(0);


//   let decodedConfig = "";
//   try {
//     decodedConfig = decodeURIComponent(atob(configEncoded || ""));
//   } catch (error) {
//     decodedConfig = "⚠️ Error decoding configuration content.";
//   }

//   // useEffect(() => {
//   //   if (tempId) {
//   //     fetch(`http://localhost:8081/get-temp-data?id=${tempId}`)
//   //       .then(res => res.json())
//   //       .then(data => {
//   //         setConnectDetails(data.details || []);
//   //         setRawCerts(data.rawCerts || []);
//   //       })
//   //       .catch(err => console.error("❌ Failed to fetch temp data:", err));
//   //   }else{
//   //       if ((uri === "guess_results" || uri === "srv_results") && tempId) {
//   //       fetch(`http://localhost:8081/get-temp-data?id=${tempId}`)
//   //         .then(res => res.json())
//   //         .then(data => setConnectDetails(data))
//   //         .catch(err => console.error("❌ Failed to fetch temp data:", err));
//   //       } else if (uri !== "guess_results") {
//   //         // 如果不是临时存储方式，尝试从 details URL 参数解析
//   //         const actualConnectDetailsStr = queryParams.get("details");
//   //         if (actualConnectDetailsStr) {
//   //           try {
//   //             const detailsJson = atob(actualConnectDetailsStr);
//   //             setConnectDetails(JSON.parse(detailsJson));
//   //           } catch (err) {
//   //             console.warn("⚠️ 无法解析 actualConnectDetails:", err);
//   //           }
//   //         }
//   //       }
//   //       const rawCertsEncoded = queryParams.get("rawCerts");
//   //       if (rawCertsEncoded) {
//   //         try {
//   //           const certs = JSON.parse(atob(rawCertsEncoded));
//   //           if (Array.isArray(certs)) {
//   //             setRawCerts(certs);
//   //           }
//   //         } catch (err) {
//   //           console.warn("⚠️ 无法解析 rawCerts:", err);
//   //         }
//   //       }
//   //     }
//   // //   if ((uri === "guess_results" || uri === "srv_results") && tempId) {
//   // //     fetch(`http://localhost:8081/get-temp-data?id=${tempId}`)
//   // //       .then(res => res.json())
//   // //       .then(data => setConnectDetails(data))
//   // //       .catch(err => console.error("❌ Failed to fetch temp data:", err));
//   // //   } else if (uri !== "guess_results") {
//   // //     // 如果不是临时存储方式，尝试从 details URL 参数解析
//   // //     const actualConnectDetailsStr = queryParams.get("details");
//   // //     if (actualConnectDetailsStr) {
//   // //       try {
//   // //         const detailsJson = atob(actualConnectDetailsStr);
//   // //         setConnectDetails(JSON.parse(detailsJson));
//   // //       } catch (err) {
//   // //         console.warn("⚠️ 无法解析 actualConnectDetails:", err);
//   // //       }
//   // //     }
//   // //   }
//   // //   const rawCertsEncoded = queryParams.get("rawCerts");
//   // //   if (rawCertsEncoded) {
//   // //     try {
//   // //       const certs = JSON.parse(atob(rawCertsEncoded));
//   // //       if (Array.isArray(certs)) {
//   // //         setRawCerts(certs);
//   // //       }
//   // //     } catch (err) {
//   // //       console.warn("⚠️ 无法解析 rawCerts:", err);
//   // //     }
//   // //   }
//   // // }, [uri, tempId, queryParams]);
//   //   }, [tempId]);
//   useEffect(() => {
//     if (tempId) {
//       // 有临时 ID，直接从后端获取
//       fetch(`http://localhost:8081/get-temp-data?id=${tempId}`)
//         .then(res => res.json())
//         .then(data => {
//           setConnectDetails(data.score_detail?.actualconnect_details || []);
//           setRawCerts(data.rawCerts || []);
//         })
//         .catch(err => console.error("❌ Failed to fetch temp data:", err));
//     } else {
//       // 没有临时 ID，从 URL 解析（只适合小数据）
//       const detailsEncoded = queryParams.get("details");
//       if (detailsEncoded) {
//         try {
//           const detailsJson = atob(detailsEncoded);
//           setConnectDetails(JSON.parse(detailsJson));
//         } catch (err) {
//           console.warn("⚠️ 无法解析 details:", err);
//         }
//       }

//       const rawCertsEncoded = queryParams.get("rawCerts");
//       if (rawCertsEncoded) {
//         try {
//           const certs = JSON.parse(atob(rawCertsEncoded));
//           if (Array.isArray(certs)) {
//             setRawCerts(certs);
//           }
//         } catch (err) {
//           console.warn("⚠️ 无法解析 rawCerts:", err);
//         }
//       }
//     }
//   }, [tempId, queryParams]);


//   const renderConnectionInfo = (info) => {
//     if (!info || !info.success) return <span style={{ color: "red" }}>❌</span>;
//     return (
//       <div style={{ fontSize: "0.9em" }}>
//         ✅ <br />
//         TLS: {info.info?.version || "?"} <br />
//         Cipher: {info.info?.cipher?.join(', ') || "N/A"}
//       </div>
//     );
//   };

//   const renderConnectDetailTable = () => {
//     if (!Array.isArray(connectDetails) || connectDetails.length === 0) return null;

//     return (
//       <div style={{ marginTop: "2rem" }}>
//         <h3>🔌 Actual Connection Test Results</h3>
//         <table style={{ width: "100%", borderCollapse: "collapse", color: "#eee" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#2c3e50" }}>
//               <th>Protocol</th>
//               <th>Host</th>
//               <th>Port</th>
//               <th>Plain</th>
//               <th>STARTTLS</th>
//               <th>TLS</th>
//             </tr>
//           </thead>
//           <tbody>
//             {connectDetails.map((item, idx) => (
//               <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#34495e" : "#3d566e" }}>
//                 <td>{item.type}</td>
//                 <td>{item.host}</td>
//                 <td>{item.port}</td>
//                 <td>{renderConnectionInfo(item.plain)}</td>
//                 <td>{renderConnectionInfo(item.starttls)}</td>
//                 <td>{renderConnectionInfo(item.tls)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const renderCertChain = () => {
//     if (!Array.isArray(rawCerts) || rawCerts.length === 0) return null;

//     return (
//         <div style={{ marginTop: "2rem" }}>
//             <h3
//                 onClick={() => setShowCertChain(prev => !prev)}
//                 style={{ cursor: "pointer", color: "#8ac6ff", userSelect: "none" }}
//             >
//                 🔐 Certificate Chain {showCertChain ? "▲" : "▼"}
//             </h3>

//             {showCertChain && (
//                 <>
//                     <div style={{ marginBottom: '10px' }}>
//                         {rawCerts.map((_, idx) => (
//                             <button
//                                 key={idx}
//                                 onClick={() => setActiveCertIdx(idx)}
//                                 style={{
//                                     marginRight: '8px',
//                                     padding: '4px 10px',
//                                     backgroundColor: activeCertIdx === idx ? '#007bff' : '#ddd',
//                                     color: activeCertIdx === idx ? '#fff' : '#000',
//                                     border: 'none',
//                                     borderRadius: '4px',
//                                     cursor: 'pointer'
//                                 }}
//                             >
//                                 #{idx + 1}
//                             </button>
//                         ))}
//                     </div>
//                     <PeculiarCertificateViewer certificate={rawCerts[activeCertIdx]} />
//                 </>
//             )}
//         </div>
//     );
//   };


//   return (
//     <div style={{ backgroundColor: "#111", minHeight: "100vh", padding: "2rem", color: "#fff" }}>
//       <h2>📄 Configuration from Method</h2>
//       <p><strong>Requested URI:</strong> {uri}</p>

//       <pre style={{
//         background: "#1e1e1e",
//         color: "#eee",
//         padding: "20px",
//         borderRadius: "8px",
//         whiteSpace: "pre-wrap",
//         maxHeight: "80vh",
//         overflowY: "auto",
//         border: "1px solid #444"
//       }}>
//         {decodedConfig}
//       </pre>

//       <a
//         href={`data:text/plain;charset=utf-8,${encodeURIComponent(decodedConfig)}`}
//         download={`config_from_${encodeURIComponent(uri || 'unknown')}.xml`}
//         style={{
//           display: "inline-block",
//           marginTop: "1rem",
//           backgroundColor: "#3498db",
//           color: "#fff",
//           padding: "10px 15px",
//           textDecoration: "none",
//           borderRadius: "4px"
//         }}
//       >
//         ⬇️ Download Configuration
//       </a>

//       {renderConnectDetailTable()}
//       {renderCertChain()}
//     </div>
//   );
// }

// export default ConfigViewPage;


// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { PeculiarCertificateViewer } from '@peculiar/certificates-viewer-react';

// function ConfigViewPage() {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const tempId = queryParams.get("id"); // 前端只会传 id

//   const [uri, setUri] = useState("");
//   const [configContent, setConfigContent] = useState("⚠️ 无法加载配置");
//   const [connectDetails, setConnectDetails] = useState([]);
//   const [rawCerts, setRawCerts] = useState([]);
//   const [showCertChain, setShowCertChain] = useState(false);
//   const [activeCertIdx, setActiveCertIdx] = useState(0);

//   // 初始化：从后端拉数据
//   useEffect(() => {
//     if (!tempId) return;

//     fetch(`http://localhost:8081/get-temp-data?id=${tempId}`)
//       .then(res => res.json())
//       .then(data => {
//         console.log("✅ 拉取详情数据:", data);
//         setUri(data.uri || "");
//         setConfigContent(data.config || "⚠️ 无法获取配置内容");
//         setConnectDetails(data.details || []);
//         setRawCerts(data.rawCerts || []);
//       })
//       .catch(err => {
//         console.error("❌ Failed to fetch temp data:", err);
//         setConfigContent("⚠️ 加载数据失败");
//       });
//   }, [tempId]);

//   const renderConnectionInfo = (info) => {
//     if (!info || !info.success) return <span style={{ color: "red" }}>❌</span>;
//     return (
//       <div style={{ fontSize: "0.9em" }}>
//         ✅ <br />
//         TLS: {info.info?.version || "?"} <br />
//         Cipher: {info.info?.cipher?.join(", ") || "N/A"}
//       </div>
//     );
//   };

//   const renderConnectDetailTable = () => {
//     if (!Array.isArray(connectDetails) || connectDetails.length === 0) return null;

//     return (
//       <div style={{ marginTop: "2rem" }}>
//         <h3>🔌 Actual Connection Test Results</h3>
//         <table style={{ width: "100%", borderCollapse: "collapse", color: "#eee" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#2c3e50" }}>
//               <th>Protocol</th>
//               <th>Host</th>
//               <th>Port</th>
//               <th>Plain</th>
//               <th>STARTTLS</th>
//               <th>TLS</th>
//             </tr>
//           </thead>
//           <tbody>
//             {connectDetails.map((item, idx) => (
//               <tr
//                 key={idx}
//                 style={{ backgroundColor: idx % 2 === 0 ? "#34495e" : "#3d566e" }}
//               >
//                 <td>{item.type}</td>
//                 {/* <td>{item.host}</td> */}
//                 <td>
//                   {item.host}
//                   <button
//                     style={{ marginLeft: "8px", padding: "2px 6px" }}
//                     onClick={() => handleRetest(item)}
//                   >
//                     Retest
//                   </button>
//                 </td>

//                 <td>{item.port}</td>
//                 <td>{renderConnectionInfo(item.plain)}</td>
//                 <td>{renderConnectionInfo(item.starttls)}</td>
//                 <td>{renderConnectionInfo(item.tls)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const renderCertChain = () => {
//     if (!Array.isArray(rawCerts) || rawCerts.length === 0) return null;

//     return (
//       <div style={{ marginTop: "2rem" }}>
//         <h3
//           onClick={() => setShowCertChain((prev) => !prev)}
//           style={{ cursor: "pointer", color: "#8ac6ff", userSelect: "none" }}
//         >
//           🔐 Certificate Chain {showCertChain ? "▲" : "▼"}
//         </h3>

//         {showCertChain && (
//           <>
//             <div style={{ marginBottom: "10px" }}>
//               {rawCerts.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setActiveCertIdx(idx)}
//                   style={{
//                     marginRight: "8px",
//                     padding: "4px 10px",
//                     backgroundColor: activeCertIdx === idx ? "#007bff" : "#ddd",
//                     color: activeCertIdx === idx ? "#fff" : "#000",
//                     border: "none",
//                     borderRadius: "4px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   #{idx + 1}
//                 </button>
//               ))}
//             </div>
//             <PeculiarCertificateViewer certificate={rawCerts[activeCertIdx]} />
//           </>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "#111",
//         minHeight: "100vh",
//         padding: "2rem",
//         color: "#fff",
//       }}
//     >
//       <h2>📄 Configuration from Method</h2>
//       <p>
//         <strong>Requested URI:</strong> {uri}
//       </p>

//       <pre
//         style={{
//           background: "#1e1e1e",
//           color: "#eee",
//           padding: "20px",
//           borderRadius: "8px",
//           whiteSpace: "pre-wrap",
//           maxHeight: "80vh",
//           overflowY: "auto",
//           border: "1px solid #444",
//         }}
//       >
//         {configContent}
//       </pre>

//       <a
//         href={`data:text/plain;charset=utf-8,${encodeURIComponent(configContent)}`}
//         download={`config_from_${encodeURIComponent(uri || "unknown")}.xml`}
//         style={{
//           display: "inline-block",
//           marginTop: "1rem",
//           backgroundColor: "#3498db",
//           color: "#fff",
//           padding: "10px 15px",
//           textDecoration: "none",
//           borderRadius: "4px",
//         }}
//       >
//         ⬇️ Download Configuration
//       </a>

//       {renderConnectDetailTable()}
//       {renderCertChain()}
//     </div>
//   );
// }

// export default ConfigViewPage;


// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { PeculiarCertificateViewer } from '@peculiar/certificates-viewer-react';

// function ConfigViewPage() {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const tempId = queryParams.get("id"); // 前端只会传 id

//   const [uri, setUri] = useState("");
//   const [configContent, setConfigContent] = useState("⚠️ 无法加载配置");
//   const [connectDetails, setConnectDetails] = useState([]);
//   const [rawCerts, setRawCerts] = useState([]);
//   const [showCertChain, setShowCertChain] = useState(false);
//   const [activeCertIdx, setActiveCertIdx] = useState(0);

//   // 🔌 新增的状态：实时测试
//   const [liveLogs, setLiveLogs] = useState([]);
//   const [liveResult, setLiveResult] = useState(null);
//   const [testingHost, setTestingHost] = useState(null);

//   // 初始化：从后端拉数据
//   useEffect(() => {
//     if (!tempId) return;

//     fetch(`http://localhost:8081/get-temp-data?id=${tempId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("✅ 拉取详情数据:", data);
//         setUri(data.uri || "");
//         setConfigContent(data.config || "⚠️ 无法获取配置内容");
//         setConnectDetails(data.details || []);
//         setRawCerts(data.rawCerts || []);
//       })
//       .catch((err) => {
//         console.error("❌ Failed to fetch temp data:", err);
//         setConfigContent("⚠️ 加载数据失败");
//       });
//   }, [tempId]);

//   // 复测逻辑（WebSocket）
//   const handleRetest = (item) => {
//     const { host, port, type } = item;

//     const protocol = window.location.protocol === "https:" ? "wss" : "ws";
//     const wsUrl = `${protocol}://${window.location.host}/ws/testconnect?host=${host}&port=${port}&protocol=${type}`;
//     console.log("🔌 Retest connecting:", wsUrl);

//     const ws = new WebSocket(wsUrl);

//     setLiveLogs([]);
//     setLiveResult(null);
//     setTestingHost(`${type}://${host}:${port}`);

//     ws.onopen = () => {
//       setLiveLogs((prev) => [...prev, "🔗 WebSocket 已连接"]);
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.Host) {
//           setLiveResult(data);
//           setLiveLogs((prev) => [...prev, "✅ 测试结果已返回"]);
//           ws.close();
//         } else if (data.type === "log") {
//           setLiveLogs((prev) => [...prev, data.content]);
//         } else {
//           setLiveLogs((prev) => [...prev, event.data]);
//         }
//       } catch {
//         setLiveLogs((prev) => [...prev, event.data]);
//       }
//     };

//     ws.onerror = (e) => {
//       console.error("❌ WebSocket error", e);
//       setLiveLogs((prev) => [...prev, "❌ WebSocket error"]);
//       ws.close();
//     };

//     ws.onclose = () => {
//       setLiveLogs((prev) => [...prev, "🔚 测试已结束"]);
//     };
//   };

//   const renderConnectionInfo = (info) => {
//     if (!info || !info.success)
//       return <span style={{ color: "red" }}>❌</span>;
//     return (
//       <div style={{ fontSize: "0.9em" }}>
//         ✅ <br />
//         TLS: {info.info?.version || "?"} <br />
//         Cipher: {info.info?.cipher?.join(", ") || "N/A"}
//       </div>
//     );
//   };

//   const renderConnectDetailTable = () => {
//     if (!Array.isArray(connectDetails) || connectDetails.length === 0)
//       return null;

//     return (
//       <div style={{ marginTop: "2rem" }}>
//         <h3>🔌 Actual Connection Test Results</h3>
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             color: "#eee",
//           }}
//         >
//           <thead>
//             <tr style={{ backgroundColor: "#2c3e50" }}>
//               <th>Protocol</th>
//               <th>Host</th>
//               <th>Port</th>
//               <th>Plain</th>
//               <th>STARTTLS</th>
//               <th>TLS</th>
//             </tr>
//           </thead>
//           <tbody>
//             {connectDetails.map((item, idx) => (
//               <tr
//                 key={idx}
//                 style={{
//                   backgroundColor: idx % 2 === 0 ? "#34495e" : "#3d566e",
//                 }}
//               >
//                 <td>{item.type}</td>
//                 <td>
//                   {item.host}
//                   <button
//                     style={{
//                       marginLeft: "8px",
//                       padding: "2px 6px",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => handleRetest(item)}
//                   >
//                     Retest
//                   </button>
//                 </td>
//                 <td>{item.port}</td>
//                 <td>{renderConnectionInfo(item.plain)}</td>
//                 <td>{renderConnectionInfo(item.starttls)}</td>
//                 <td>{renderConnectionInfo(item.tls)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {testingHost && (
//           <div
//             style={{
//               marginTop: "2rem",
//               padding: "1rem",
//               backgroundColor: "#222",
//             }}
//           >
//             <h4>🔍 Testing: {testingHost}</h4>
//             <div
//               style={{
//                 maxHeight: "200px",
//                 overflowY: "auto",
//                 background: "#111",
//                 padding: "1rem",
//                 fontFamily: "monospace",
//                 fontSize: "14px",
//               }}
//             >
//               {liveLogs.map((line, idx) => (
//                 <div key={idx}>{line}</div>
//               ))}
//             </div>

//             {liveResult && (
//               <div
//                 style={{
//                   marginTop: "1rem",
//                   padding: "1rem",
//                   backgroundColor: "#333",
//                   border: "1px solid #666",
//                 }}
//               >
//                 <h4>✅ Final Result</h4>
//                 <pre
//                   style={{ whiteSpace: "pre-wrap", color: "#eee" }}
//                 >
//                   {JSON.stringify(liveResult, null, 2)}
//                 </pre>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderCertChain = () => {
//     if (!Array.isArray(rawCerts) || rawCerts.length === 0) return null;

//     return (
//       <div style={{ marginTop: "2rem" }}>
//         <h3
//           onClick={() => setShowCertChain((prev) => !prev)}
//           style={{ cursor: "pointer", color: "#8ac6ff", userSelect: "none" }}
//         >
//           🔐 Certificate Chain {showCertChain ? "▲" : "▼"}
//         </h3>

//         {showCertChain && (
//           <>
//             <div style={{ marginBottom: "10px" }}>
//               {rawCerts.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setActiveCertIdx(idx)}
//                   style={{
//                     marginRight: "8px",
//                     padding: "4px 10px",
//                     backgroundColor:
//                       activeCertIdx === idx ? "#007bff" : "#ddd",
//                     color: activeCertIdx === idx ? "#fff" : "#000",
//                     border: "none",
//                     borderRadius: "4px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   #{idx + 1}
//                 </button>
//               ))}
//             </div>
//             <PeculiarCertificateViewer
//               certificate={rawCerts[activeCertIdx]}
//             />
//           </>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "#111",
//         minHeight: "100vh",
//         padding: "2rem",
//         color: "#fff",
//       }}
//     >
//       <h2>📄 Configuration from Method</h2>
//       <p>
//         <strong>Requested URI:</strong> {uri}
//       </p>

//       <pre
//         style={{
//           background: "#1e1e1e",
//           color: "#eee",
//           padding: "20px",
//           borderRadius: "8px",
//           whiteSpace: "pre-wrap",
//           maxHeight: "80vh",
//           overflowY: "auto",
//           border: "1px solid #444",
//         }}
//       >
//         {configContent}
//       </pre>

//       <a
//         href={`data:text/plain;charset=utf-8,${encodeURIComponent(
//           configContent
//         )}`}
//         download={`config_from_${encodeURIComponent(uri || "unknown")}.xml`}
//         style={{
//           display: "inline-block",
//           marginTop: "1rem",
//           backgroundColor: "#3498db",
//           color: "#fff",
//           padding: "10px 15px",
//           textDecoration: "none",
//           borderRadius: "4px",
//         }}
//       >
//         ⬇️ Download Configuration
//       </a>

//       {renderConnectDetailTable()}
//       {renderCertChain()}
//     </div>
//   );
// }

// export default ConfigViewPage;


import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PeculiarCertificateViewer } from '@peculiar/certificates-viewer-react';

function ConfigViewPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tempId = queryParams.get("id");

  const [uri, setUri] = useState("");
  const [configContent, setConfigContent] = useState("⚠️ 无法加载配置");
  const [connectDetails, setConnectDetails] = useState([]);
  const [rawCerts, setRawCerts] = useState([]);
  const [showCertChain, setShowCertChain] = useState(false);
  const [activeCertIdx, setActiveCertIdx] = useState(0);

  // 👇 新增 state
  const [liveLogs, setLiveLogs] = useState([]);
  const [liveResult, setLiveResult] = useState(null);
  const [testingHost, setTestingHost] = useState(null);

  const [mech, setMech] = useState("");

  const [showTlsCert, setShowTlsCert] = useState(false);
  const [selectedMode, setSelectedMode] = useState("ssl");
  const [rowModes, setRowModes] = useState({});



  useEffect(() => {
    if (!tempId) return;

    fetch(`http://localhost:8081/get-temp-data?id=${tempId}`)
      .then(res => res.json())
      .then(data => {
        console.log("✅ 拉取详情数据:", data);
        setUri(data.uri || "");
        setConfigContent(data.config || "⚠️ 无法获取配置内容");
        setConnectDetails(data.details || []);
        setRawCerts(data.rawCerts || []);
        setMech(data.mech || ""); // ✅ 保存 mech
      })
      .catch(err => {
        console.error("❌ Failed to fetch temp data:", err);
        setConfigContent("⚠️ 加载数据失败");
      });
  }, [tempId]);


  // // 初始化：从后端拉数据
  // useEffect(() => {
  //   if (!tempId) return;

  //   fetch(`http://localhost:8081/get-temp-data?id=${tempId}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log("✅ 拉取详情数据:", data);
  //       setUri(data.uri || "");
  //       setConfigContent(data.config || "⚠️ 无法获取配置内容");
  //       setConnectDetails(data.details || []);
  //       setRawCerts(data.rawCerts || []);
  //     })
  //     .catch(err => {
  //       console.error("❌ Failed to fetch temp data:", err);
  //       setConfigContent("⚠️ 加载数据失败");
  //     });
  // }, [tempId]);

  // 👇 复用旧逻辑：点击 Retest 走 WebSocket
  const handleRetest = (item, mode) => {
    const { host, port, type } = item;
  // setTestingHost(item.host);
    setLiveLogs([]);
    setLiveResult(null);
    setTestingHost(`${type}://${host}:${port} [${type}, ${mode}]`); 

    const ws = new WebSocket(
      `ws://localhost:8081/ws/testconnect?host=${item.host}&port=${item.port}&protocol=${item.type}&mode=${mode}`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "log") {
        setLiveLogs((prev) => [...prev, data.content]);
      } else if (data.type === "result") {
        setLiveResult(data.result);
      }
    };
  };

  // const handleRetest = (item) => {
  //   const { host, port, type } = item;

  //   const ws = new WebSocket(
  //     `${window.location.protocol === "https:" ? "wss" : "ws"}://localhost:8081/ws/testconnect?host=${host}&port=${port}&protocol=${type}`
  //   );


  //   setLiveLogs([]);
  //   setLiveResult(null);
  //   setTestingHost(`${type}://${host}:${port}`);

  //   ws.onmessage = (event) => {
  //     const msg = JSON.parse(event.data);
  //     if (msg.type === "log") {
  //       setLiveLogs((prev) => [...prev, msg.content]);
  //     } else if (msg.type === "result") {
  //       setLiveResult(msg.result);
  //       ws.close();
  //     }
  //   };

  //   ws.onerror = () => {
  //     setLiveLogs((prev) => [...prev, "❌ Connection error."]);
  //     ws.close();
  //   };
  // };

  const renderConnectionInfo = (info) => {
    if (!info || !info.success) return <span style={{ color: "red" }}>❌</span>;
    return (
      <div style={{ fontSize: "0.9em" }}>
        ✅ <br />
        TLS: {info.info?.version || "?"} <br />
        Cipher: {info.info?.cipher?.join(", ") || "N/A"}
      </div>
    );
  };

  // const renderConnectDetailTable = () => {
  //   if (!Array.isArray(connectDetails) || connectDetails.length === 0) return null;

  //   return (
  //     <div style={{ marginTop: "2rem" }}>
  //       <h3>🔌 Actual Connection Test Results</h3>
  //       <table style={{ width: "100%", borderCollapse: "collapse", color: "#eee" }}>
  //         <thead>
  //           <tr style={{ backgroundColor: "#2c3e50" }}>
  //             <th>Protocol</th>
  //             <th>Host</th>
  //             <th>Port</th>
  //             <th>Plain</th>
  //             <th>STARTTLS</th>
  //             <th>TLS</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {connectDetails.map((item, idx) => (
  //             <tr
  //               key={idx}
  //               style={{ backgroundColor: idx % 2 === 0 ? "#34495e" : "#3d566e" }}
  //             >
  //               <td>{item.type}</td>
  //               <td>
  //                 {item.host}
  //                 <button
  //                   style={{ marginLeft: "8px", padding: "2px 6px" }}
  //                   onClick={() => handleRetest(item, selectedMode)}
  //                 >
  //                   Retest
  //                 </button>
  //                 <select
  //                   style={{ marginLeft: "8px" }}
  //                   onChange={(e) => setSelectedMode(e.target.value)}
  //                 >
  //                   <option value="plain">Plain</option>
  //                   <option value="starttls">STARTTLS</option>
  //                   <option value="ssl">SSL/TLS</option>
  //                 </select>
  //               </td>

  //               {/* <td>
  //                 {item.host}
  //                 <button
  //                   style={{ marginLeft: "8px", padding: "2px 6px" }}
  //                   onClick={() => handleRetest(item)}
  //                 >
  //                   Retest
  //                 </button>
  //               </td> */}
  //               <td>{item.port}</td>
  //               <td>{renderConnectionInfo(item.plain)}</td>
  //               <td>{renderConnectionInfo(item.starttls)}</td>
  //               <td>{renderConnectionInfo(item.tls)}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>

  //       {/* 👇 Retest 的日志展示 */}
  //       {testingHost && (
  //         <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#222" }}>
  //           <h4>🔍 Testing: {testingHost}</h4>
  //           <div
  //             style={{
  //               maxHeight: "200px",
  //               overflowY: "auto",
  //               background: "#111",
  //               padding: "1rem",
  //               fontFamily: "monospace",
  //               fontSize: "14px",
  //             }}
  //           >
  //             {liveLogs.map((line, idx) => (
  //               <div key={idx}>{line}</div>
  //             ))}
  //           </div>
            
  //           {liveResult && (
  //             <div
  //               style={{
  //                 marginTop: "1rem",
  //                 padding: "1rem",
  //                 backgroundColor: "#333",
  //                 border: "1px solid #666",
  //               }}
  //             >
  //               <h4>✅ Final Result</h4>
  //               {liveResult.success ? (
  //                 <>
  //                   <p>✅ 测试成功</p>
  //                   <p><strong>TLS 版本：</strong>{liveResult.info?.version || "未知"}</p>
  //                   <p><strong>加密套件：</strong>{liveResult.info?.cipher?.join(", ") || "N/A"}</p>

  //                   {liveResult.info?.["tls ca"] && (
  //                     <>
  //                       <div style={{ marginTop: "1rem" }}>
  //                         <h4
  //                           onClick={() => setShowTlsCert((prev) => !prev)}
  //                           style={{
  //                             cursor: "pointer",
  //                             color: "#e7ecf2ff",
  //                             userSelect: "none",
  //                           }}
  //                         >
  //                           🔐 查看服务器证书信息 {showTlsCert ? "▲" : "▼"}
  //                         </h4>
  //                         {showTlsCert && (
  //                           <PeculiarCertificateViewer certificate={liveResult.info["tls ca"]} />
  //                         )}
  //                       </div>
  //                       <a
  //                         href={`data:text/plain;charset=utf-8,${encodeURIComponent(liveResult.info["tls ca"])}`}
  //                         download={`certificate_${testingHost}.crt`}
  //                         style={{
  //                           display: "inline-block",
  //                           marginTop: "1rem",
  //                           backgroundColor: "#5bc889ff",
  //                           color: "#fff",
  //                           padding: "8px 12px",
  //                           textDecoration: "none",
  //                           borderRadius: "4px",
  //                         }}
  //                       >
  //                         ⬇️ 下载服务器证书
  //                       </a>
  //                     </>
  //                   )}
  //                 </>
  //               ) : (
  //                 <>
  //                   <p style={{ color: "red" }}>❌ 测试失败</p>
  //                   <p><strong>错误信息：</strong>{liveResult.error}</p>
  //                 </>
  //               )}
  //             </div>
  //           )}


  //           {/* {liveResult && (
  //             <div
  //               style={{
  //                 marginTop: "1rem",
  //                 padding: "1rem",
  //                 backgroundColor: "#333",
  //                 border: "1px solid #666",
  //               }}
  //             >
  //               <h4>✅ Final Result</h4>
  //               <pre style={{ whiteSpace: "pre-wrap", color: "#eee" }}>
  //                 {JSON.stringify(liveResult, null, 2)}
  //               </pre>
  //             </div>
  //           )} */}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  const renderConnectDetailTable = () => {
    if (!Array.isArray(connectDetails) || connectDetails.length === 0) return null;

    // // 每行独立模式
    // const [rowModes, setRowModes] = useState({}); // key: idx, value: mode

    return (
      <div style={{ marginTop: "2rem" }}>
        <h3>🔌 Actual Connection Test Results</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#eee" }}>
          <thead>
            <tr style={{ backgroundColor: "#2c3e50" }}>
              <th>Protocol</th>
              <th>Host</th>
              <th>Port</th>
              <th>Plain</th>
              <th>STARTTLS</th>
              <th>TLS</th>
            </tr>
          </thead>
          <tbody>
            {connectDetails.map((item, idx) => (
              <tr
                key={idx}
                style={{ backgroundColor: idx % 2 === 0 ? "#34495e" : "#3d566e" }}
              >
                <td>{item.type}</td>
                <td>
                  {item.host}
                  {/* 下拉在前，按钮在后 */}
                  <select
                    style={{ marginLeft: "8px" }}
                    value={rowModes[idx] || "plain"}
                    onChange={(e) =>
                      setRowModes((prev) => ({ ...prev, [idx]: e.target.value }))
                    }
                  >
                    <option value="plain">Plain</option>
                    <option value="starttls">STARTTLS</option>
                    <option value="ssl">SSL/TLS</option>
                  </select>
                  <button
                    style={{ marginLeft: "8px", padding: "2px 6px" }}
                    onClick={() => handleRetest(item, rowModes[idx] || "plain")}
                  >
                    Retest
                  </button>
                </td>
                <td>{item.port}</td>
                <td>{renderConnectionInfo(item.plain)}</td>
                <td>{renderConnectionInfo(item.starttls)}</td>
                <td>{renderConnectionInfo(item.tls)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 👇 Retest 的日志展示 */}
        {testingHost && (
          <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#222" }}>
            <h4>
              🔍 Testing: {testingHost}
              {/* {testingPort && `:${testingPort}`} [{testingProtocol}, {testingMode}] */}
            </h4>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                background: "#111",
                padding: "1rem",
                fontFamily: "monospace",
                fontSize: "14px",
              }}
            >
              {liveLogs.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>

            {liveResult && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  backgroundColor: "#333",
                  border: "1px solid #666",
                }}
              >
                <h4>✅ Final Result</h4>
                {liveResult.success ? (
                  <>
                    <p>✅ 测试成功</p>
                    <p><strong>TLS 版本：</strong>{liveResult.info?.version || "未知"}</p>
                    <p><strong>加密套件：</strong>{liveResult.info?.cipher?.join(", ") || "N/A"}</p>

                    {liveResult.info?.["tls ca"] && (
                      <>
                        <div style={{ marginTop: "1rem" }}>
                          <h4
                            onClick={() => setShowTlsCert((prev) => !prev)}
                            style={{
                              cursor: "pointer",
                              color: "#e7ecf2ff",
                              userSelect: "none",
                            }}
                          >
                            🔐 查看服务器证书信息 {showTlsCert ? "▲" : "▼"}
                          </h4>
                          {showTlsCert && (
                            <PeculiarCertificateViewer certificate={liveResult.info["tls ca"]} />
                          )}
                        </div>
                        <a
                          href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                            liveResult.info["tls ca"]
                          )}`}
                          download={`certificate_${testingHost}.crt`}
                          style={{
                            display: "inline-block",
                            marginTop: "1rem",
                            backgroundColor: "#5bc889ff",
                            color: "#fff",
                            padding: "8px 12px",
                            textDecoration: "none",
                            borderRadius: "4px",
                          }}
                        >
                          ⬇️ 下载服务器证书
                        </a>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <p style={{ color: "red" }}>❌ 测试失败</p>
                    <p>
                      <strong>错误信息：</strong>
                      {liveResult.error || liveResult.info?.error?.join(", ") || "未知错误"}
                    </p>

                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };


  const renderCertChain = () => {
    if (!Array.isArray(rawCerts) || rawCerts.length === 0) return null;
    return (
      <div style={{ marginTop: "2rem" }}>
        <h3
          onClick={() => setShowCertChain((prev) => !prev)}
          style={{ cursor: "pointer", color: "#8ac6ff", userSelect: "none" }}
        >
          🔐 Certificate Chain {showCertChain ? "▲" : "▼"}
        </h3>
        {showCertChain && (
          <>
            <div style={{ marginBottom: "10px" }}>
              {rawCerts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCertIdx(idx)}
                  style={{
                    marginRight: "8px",
                    padding: "4px 10px",
                    backgroundColor: activeCertIdx === idx ? "#007bff" : "#ddd",
                    color: activeCertIdx === idx ? "#fff" : "#000",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
            <PeculiarCertificateViewer certificate={rawCerts[activeCertIdx]} />
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: "#111", minHeight: "100vh", padding: "2rem", color: "#fff" }}>
      {/* 只有 autodiscover 或 autoconfig 显示配置块 */}
      {(mech === "autodiscover" || mech === "autoconfig") && (
        <>
          <h2>📄 Configuration from Method</h2>
          <p>
            <strong>Requested URI:</strong> {uri}
          </p>

          <pre
            style={{
              background: "#1e1e1e",
              color: "#eee",
              padding: "20px",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
              maxHeight: "80vh",
              overflowY: "auto",
              border: "1px solid #444",
            }}
          >
            {configContent}
          </pre>

          {configContent && configContent !== "⚠️ 无法获取配置内容" && (
            <a
              href={`data:text/xml;charset=utf-8,${encodeURIComponent(configContent)}`}
              download={`config_from_${encodeURIComponent(uri || "unknown")}.xml`}
              style={{
                display: "inline-block",
                marginTop: "1rem",
                backgroundColor: "#3498db",
                color: "#fff",
                padding: "10px 15px",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              ⬇️ Download Configuration
            </a>
          )}
        </>
      )}

      {renderConnectDetailTable()}
      {renderCertChain()}
    </div>
  );

  // return (
  //   <div style={{ backgroundColor: "#111", minHeight: "100vh", padding: "2rem", color: "#fff" }}>
  //     <h2>📄 Configuration from Method</h2>
  //     <p>
  //       <strong>Requested URI:</strong> {uri}
  //     </p>

  //     <pre
  //       style={{
  //         background: "#1e1e1e",
  //         color: "#eee",
  //         padding: "20px",
  //         borderRadius: "8px",
  //         whiteSpace: "pre-wrap",
  //         maxHeight: "80vh",
  //         overflowY: "auto",
  //         border: "1px solid #444",
  //       }}
  //     >
  //       {configContent}
  //     </pre>

  //     <a
  //       href={`data:text/plain;charset=utf-8,${encodeURIComponent(configContent)}`}
  //       download={`config_from_${encodeURIComponent(uri || "unknown")}.xml`}
  //       style={{
  //         display: "inline-block",
  //         marginTop: "1rem",
  //         backgroundColor: "#3498db",
  //         color: "#fff",
  //         padding: "10px 15px",
  //         textDecoration: "none",
  //         borderRadius: "4px",
  //       }}
  //     >
  //       ⬇️ Download Configuration
  //     </a>

  //     {renderConnectDetailTable()}
  //     {renderCertChain()}
  //   </div>
  // );
}

export default ConfigViewPage;
