import { useState, useEffect } from "react";
import ClientNavbar from "../../components/ClientNavbar";
import { getCurrentUser } from "../../utils/auth";

const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  truck:    "M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  check:    "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
  clock:    "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
  invoice:  "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8",
  arrow:    "M5 12h14 M12 5l7 7-7 7",
  plus:     "M12 5v14 M5 12h14",
  search:   "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  location: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  phone:    "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.43 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.34 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.29 6.29l.79-.79a2 2 0 012.1-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
};

const recentShipments = [
  { id:"V1-20250301", from:"Chennai", to:"Mumbai",    status:"In Transit", eta:"Today 6PM",   progress:72,  agent:"Ravi Kumar"  },
  { id:"V1-20250289", from:"Delhi",   to:"Bangalore", status:"Delivered",  eta:"Completed",   progress:100, agent:"Priya Nair"  },
  { id:"V1-20250276", from:"Mumbai",  to:"Pune",      status:"Pending",    eta:"Mar 5, 10AM", progress:10,  agent:"Meena Shah"  },
  { id:"V1-20250261", from:"Kolkata", to:"Delhi",     status:"Delivered",  eta:"Completed",   progress:100, agent:"Kiran Roy"   },
];

const statusMeta = {
  "In Transit": { bg:"#DBEAFE", color:"#1D4ED8", dot:"#3B82F6" },
  "Delivered":  { bg:"#D1FAE5", color:"#065F46", dot:"#10B981" },
  "Pending":    { bg:"#FEF3C7", color:"#92400E", dot:"#F59E0B" },
  "Delayed":    { bg:"#FEE2E2", color:"#991B1B", dot:"#EF4444" },
};

const timelineSteps = [
  { label:"Order Placed",    done:true,  time:"Mar 1, 9:00 AM"  },
  { label:"Picked Up",       done:true,  time:"Mar 1, 2:30 PM"  },
  { label:"In Transit",      done:true,  time:"Mar 2, 8:00 AM"  },
  { label:"At Delivery Hub", done:false, time:"Expected Today"  },
  { label:"Delivered",       done:false, time:"Today by 6PM"    },
];

const TrackingTimeline = () => {
  const activeIdx = timelineSteps.findIndex(s => !s.done);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
      {timelineSteps.map((step, i) => (
        <div key={step.label} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:20 }}>
            <div style={{
              width:20, height:20, borderRadius:"50%", flexShrink:0,
              background: step.done ? "linear-gradient(135deg,#10B981,#059669)" : i === activeIdx ? "#2563EB" : "#E2E8F0",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow: step.done ? "0 0 0 3px rgba(16,185,129,0.15)" : i === activeIdx ? "0 0 0 3px rgba(37,99,235,0.2)" : "none",
            }}>
              {step.done
                ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                : i === activeIdx
                  ? <div style={{ width:6, height:6, borderRadius:"50%", background:"white" }}/>
                  : null}
            </div>
            {i < timelineSteps.length - 1 && (
              <div style={{ width:2, height:32, background: step.done ? "#10B981" : "#E2E8F0", marginTop:2, borderRadius:1 }}/>
            )}
          </div>
          <div style={{ paddingBottom: i < timelineSteps.length - 1 ? 24 : 0, paddingTop:1 }}>
            <div style={{ fontSize:13, fontWeight: step.done ? 600 : 500, color: step.done ? "#0F172A" : i === activeIdx ? "#2563EB" : "#94A3B8" }}>
              {step.label}
            </div>
            <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>{step.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ClientDashboard() {
  const [userName, setUserName] = useState("there");
  const [trackInput, setTrackInput] = useState("");

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getDate = () => new Date().toLocaleDateString("en-IN", {
    weekday:"long", month:"long", day:"numeric", year:"numeric"
  });

  useEffect(() => {
    getCurrentUser().then(u => { if (u?.name) setUserName(u.name); }).catch(() => {});
  }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#F8FAFC", color:"#0F172A" }}>
      <ClientNavbar />

      <main style={{ flex:1, overflow:"auto", padding:"28px 100px", display:"flex", flexDirection:"column", gap:24 }}>

        {/* ── HERO BANNER ─────────────────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, #0B1F3B 0%, #1E3A5F 50%, #1a3a6b 100%)",
          borderRadius: 20,
          padding: "32px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "relative", overflow: "hidden",
          boxShadow: "0 8px 32px rgba(11,31,59,0.2)",
        }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(37,99,235,0.15)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-60, right:120, width:150, height:150, borderRadius:"50%", background:"rgba(96,165,250,0.08)", pointerEvents:"none" }}/>

          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.5)", letterSpacing:"1px", textTransform:"uppercase", marginBottom:8 }}>
              {getDate()}
            </div>
            <h1 style={{ fontSize:28, fontWeight:800, color:"white", margin:"0 0 8px", letterSpacing:"-0.8px" }}>
              {getGreeting()}, {userName.split(' ')[0]} 
            </h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.55)", margin:0 }}>
              You have <span style={{ color:"#60A5FA", fontWeight:700 }}>3 active shipments</span> and <span style={{ color:"#FBBF24", fontWeight:700 }}>1 pending invoice</span>
            </p>
          </div>

          <div style={{ position:"relative", zIndex:1, display:"flex", gap:10 }}>
            <div style={{ position:"relative" }}>
              <input value={trackInput} onChange={e => setTrackInput(e.target.value)}
                placeholder="Enter tracking ID..."
                style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:12, padding:"12px 16px 12px 40px", color:"white", fontSize:13, width:240, outline:"none" }}/>
              <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}>
                <Icon d={icons.search} size={14} stroke="rgba(255,255,255,0.5)"/>
              </span>
            </div>
            <button style={{ padding:"12px 20px", border:"none", borderRadius:12, background:"linear-gradient(135deg,#2563EB,#3B82F6)", color:"white", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(37,99,235,0.4)", display:"flex", alignItems:"center", gap:6 }}>
              <Icon d={icons.search} size={13} stroke="white"/> Track
            </button>
          </div>
        </div>

        {/* ── KPI CARDS ─────────────────────────────────────────────────── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {[
            { label:"Active Shipments", value:"3",     icon:icons.truck,   color:"#2563EB", bg:"linear-gradient(135deg,#EFF6FF,#DBEAFE)", iconBg:"#DBEAFE", trend:"+1 this week"   },
            { label:"Delivered",        value:"28",    icon:icons.check,   color:"#10B981", bg:"linear-gradient(135deg,#F0FDF4,#D1FAE5)", iconBg:"#D1FAE5", trend:"All time"       },
            { label:"Pending Pickup",   value:"1",     icon:icons.clock,   color:"#F59E0B", bg:"linear-gradient(135deg,#FFFBEB,#FEF3C7)", iconBg:"#FEF3C7", trend:"Scheduled Mar 5"},
            { label:"Open Invoices",    value:"₹4.2K", icon:icons.invoice, color:"#7C3AED", bg:"linear-gradient(135deg,#FAF5FF,#EDE9FE)", iconBg:"#EDE9FE", trend:"Due in 7 days"  },
          ].map(kpi => (
            <div key={kpi.label}
              style={{ background:kpi.bg, borderRadius:16, padding:"20px", border:"1px solid rgba(255,255,255,0.8)", boxShadow:"0 2px 12px rgba(0,0,0,0.04)", transition:"all 0.2s", cursor:"default" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.04)"; }}>
              <div style={{ marginBottom:16 }}>
                <div style={{ width:40, height:40, background:kpi.iconBg, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                  <Icon d={kpi.icon} size={18} stroke={kpi.color}/>
                </div>
              </div>
              <div style={{ fontSize:30, fontWeight:900, color:"#0F172A", letterSpacing:"-1px", lineHeight:1 }}>{kpi.value}</div>
              <div style={{ fontSize:12, fontWeight:600, color:"#64748B", marginTop:6 }}>{kpi.label}</div>
              <div style={{ fontSize:11, color:kpi.color, marginTop:4, fontWeight:500 }}>{kpi.trend}</div>
            </div>
          ))}
        </div>

        {/* ── ACTIVE TRACKER + TIMELINE ─────────────────────────────────── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16 }}>

          {/* Tracker card */}
          <div style={{ background:"white", borderRadius:16, padding:"24px", boxShadow:"0 2px 16px rgba(0,0,0,0.06)", border:"1px solid #F1F5F9" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:"#0F172A", letterSpacing:"-0.3px" }}>Active Shipment</h3>
                <p style={{ margin:"3px 0 0", fontSize:12, color:"#94A3B8" }}>V1-20250301 · Chennai → Mumbai</p>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20, background:"#DBEAFE", color:"#1D4ED8", display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#2563EB", display:"inline-block" }}/>
                In Transit
              </span>
            </div>

            {/* Progress */}
            <div style={{ marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:12, color:"#64748B", fontWeight:500 }}>Delivery Progress</span>
                <span style={{ fontSize:12, color:"#2563EB", fontWeight:700 }}>72%</span>
              </div>
              <div style={{ background:"#F1F5F9", borderRadius:8, height:10, overflow:"hidden" }}>
                <div style={{ width:"72%", height:"100%", background:"linear-gradient(90deg,#2563EB,#60A5FA)", borderRadius:8, position:"relative", transition:"width 1s ease" }}>
                  <div style={{ position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", width:14, height:14, borderRadius:"50%", background:"white", border:"3px solid #2563EB", boxShadow:"0 0 0 3px rgba(37,99,235,0.2)" }}/>
                </div>
              </div>
            </div>

            {/* Route visualization */}
            <div style={{ background:"linear-gradient(135deg,#EFF6FF,#F0F9FF)", borderRadius:12, padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center" }}>
              <div style={{ textAlign:"center", minWidth:80 }}>
                <div style={{ fontSize:11, color:"#94A3B8", marginBottom:4, fontWeight:500 }}>FROM</div>
                <div style={{ width:36, height:36, background:"#2563EB", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 6px" }}>
                  <Icon d={icons.location} size={16} stroke="white" fill="white"/>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:"#0F172A" }}>Chennai</div>
              </div>
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"0 12px" }}>
                <div style={{ fontSize:10, color:"#94A3B8", fontWeight:500 }}>ETA Today 6PM</div>
                <div style={{ width:"100%", height:2, background:"linear-gradient(90deg,#2563EB 72%,#E2E8F0 72%)", borderRadius:1, position:"relative" }}>
                  <div style={{ position:"absolute", left:"72%", top:"50%", transform:"translate(-50%,-50%)", fontSize:16 }}>🚚</div>
                </div>
                <div style={{ fontSize:10, color:"#2563EB", fontWeight:600 }}>~248km remaining</div>
              </div>
              <div style={{ textAlign:"center", minWidth:80 }}>
                <div style={{ fontSize:11, color:"#94A3B8", marginBottom:4, fontWeight:500 }}>TO</div>
                <div style={{ width:36, height:36, background:"#E2E8F0", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 6px" }}>
                  <Icon d={icons.location} size={16} stroke="#64748B"/>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:"#0F172A" }}>Mumbai</div>
              </div>
            </div>

            {/* Agent */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"#F8FAFC", borderRadius:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#2563EB,#3B82F6)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:13 }}>R</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:"#0F172A" }}>Ravi Kumar</div>
                  <div style={{ fontSize:10, color:"#94A3B8" }}>Your Delivery Agent</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button style={{ padding:"6px 12px", border:"1px solid #E2E8F0", borderRadius:8, background:"white", color:"#334155", fontSize:11, fontWeight:500, cursor:"pointer" }}>
                  <Icon d={icons.phone} size={11} stroke="#334155"/> Call
                </button>
                <button style={{ padding:"6px 12px", border:"none", borderRadius:8, background:"#EFF6FF", color:"#2563EB", fontSize:11, fontWeight:600, cursor:"pointer" }}>Message</button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ background:"white", borderRadius:16, padding:"24px", boxShadow:"0 2px 16px rgba(0,0,0,0.06)", border:"1px solid #F1F5F9" }}>
            <h3 style={{ margin:"0 0 20px", fontSize:15, fontWeight:800, color:"#0F172A", letterSpacing:"-0.3px" }}>Delivery Timeline</h3>
            <TrackingTimeline />

            {/* ETA highlight */}
            <div style={{ marginTop:20, padding:"14px 16px", background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)", borderRadius:12, border:"1px solid #BFDBFE" }}>
              <div style={{ fontSize:10, fontWeight:600, color:"#1D4ED8", letterSpacing:"1px", textTransform:"uppercase", marginBottom:4 }}>Estimated Arrival</div>
              <div style={{ fontSize:20, fontWeight:800, color:"#0F172A", letterSpacing:"-0.5px" }}>Today, 6:00 PM</div>
              <div style={{ fontSize:11, color:"#64748B", marginTop:3 }}>Mumbai — Nariman Point</div>
            </div>
          </div>
        </div>

        {/* ── RECENT SHIPMENTS + QUICK ACTIONS ──────────────────────────── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16 }}>

          {/* Recent Shipments */}
          <div style={{ background:"white", borderRadius:16, boxShadow:"0 2px 16px rgba(0,0,0,0.06)", border:"1px solid #F1F5F9", overflow:"hidden" }}>
            <div style={{ padding:"20px 24px", borderBottom:"1px solid #F8FAFC", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ margin:0, fontSize:15, fontWeight:800, color:"#0F172A" }}>Recent Shipments</h3>
              <button style={{ fontSize:12, color:"#2563EB", fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>View all →</button>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#F8FAFC" }}>
                  {["Tracking ID","Route","Agent","Progress","Status","ETA"].map(h => (
                    <th key={h} style={{ padding:"10px 16px", fontSize:11, fontWeight:600, color:"#94A3B8", textAlign:"left", borderBottom:"1px solid #F1F5F9", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentShipments.map(s => (
                  <tr key={s.id}
                    style={{ borderBottom:"1px solid #F8FAFC", cursor:"pointer", transition:"background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background="#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background="white"}>
                    <td style={{ padding:"13px 16px", fontSize:12, fontWeight:700, color:"#2563EB" }}>{s.id}</td>
                    <td style={{ padding:"13px 16px", fontSize:12, color:"#334155" }}>{s.from} → {s.to}</td>
                    <td style={{ padding:"13px 16px", fontSize:12, color:"#64748B" }}>{s.agent}</td>
                    <td style={{ padding:"13px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ flex:1, background:"#F1F5F9", borderRadius:4, height:5, overflow:"hidden", minWidth:60 }}>
                          <div style={{ width:`${s.progress}%`, height:"100%", background:s.progress===100?"#10B981":"#2563EB", borderRadius:4 }}/>
                        </div>
                        <span style={{ fontSize:10, color:"#64748B", fontWeight:600, minWidth:28 }}>{s.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"13px 16px" }}>
                      <span style={{ fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20, background:statusMeta[s.status]?.bg, color:statusMeta[s.status]?.color }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding:"13px 16px", fontSize:11, color:"#64748B", whiteSpace:"nowrap" }}>{s.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Actions */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <h3 style={{ margin:0, fontSize:15, fontWeight:800, color:"#0F172A" }}>Quick Actions</h3>
            {[
              { label:"Request Pickup",  desc:"Schedule a new pickup",    icon:icons.plus,     color:"#2563EB", bg:"linear-gradient(135deg,#EFF6FF,#DBEAFE)" },
              { label:"View Invoices",   desc:"Download & pay invoices",  icon:icons.invoice,  color:"#7C3AED", bg:"linear-gradient(135deg,#FAF5FF,#EDE9FE)" },
              { label:"Track Shipment",  desc:"Enter tracking ID",        icon:icons.search,   color:"#0891B2", bg:"linear-gradient(135deg,#F0F9FF,#E0F2FE)" },
              { label:"Download Report", desc:"Monthly shipment summary", icon:icons.download, color:"#059669", bg:"linear-gradient(135deg,#F0FDF4,#D1FAE5)" },
            ].map(a => (
              <button key={a.label}
                style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", border:"1px solid rgba(255,255,255,0.8)", borderRadius:14, background:a.bg, cursor:"pointer", textAlign:"left", transition:"all 0.2s", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateX(4px)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateX(0)"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.04)"; }}>
                <div style={{ width:40, height:40, background:"white", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", flexShrink:0 }}>
                  <Icon d={a.icon} size={17} stroke={a.color}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#0F172A" }}>{a.label}</div>
                  <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>{a.desc}</div>
                </div>
                <Icon d={icons.arrow} size={14} stroke="#CBD5E1"/>
              </button>
            ))}

            {/* Satisfaction */}
            <div style={{ background:"linear-gradient(135deg,#0B1F3B,#1E3A5F)", borderRadius:14, padding:"16px", marginTop:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <Icon d={icons.star} size={16} stroke="#FBBF24" fill="#FBBF24"/>
                <span style={{ fontSize:12, fontWeight:700, color:"white" }}>Your Experience</span>
              </div>
              <div style={{ fontSize:28, fontWeight:900, color:"white", letterSpacing:"-1px" }}>
                4.9 <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)", fontWeight:400 }}>/ 5.0</span>
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:4 }}>Based on 28 deliveries</div>
              <div style={{ display:"flex", gap:3, marginTop:10 }}>
                {[1,2,3,4,5].map(s => <div key={s} style={{ flex:1, height:4, borderRadius:2, background:"#FBBF24" }}/>)}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}