import { useState } from "react";
import ClientNavbar from "../../components/ClientNavbar";

const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  invoice:  "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  check:    "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
  clock:    "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
  warning:  "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  search:   "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  card:     "M1 4h22v16H1z M1 9h22",
  close:    "M18 6L6 18 M6 6l12 12",
};

const DATA = [
  { id:"INV-2025-031", sid:"V1-20250301", date:"Mar 1, 2025",  due:"Mar 15, 2025", amt:1200,  status:"Unpaid",  route:"Chennai → Mumbai"      },
  { id:"INV-2025-028", sid:"V1-20250289", date:"Feb 18, 2025", due:"Mar 4, 2025",  amt:800,   status:"Overdue", route:"Delhi → Bangalore"     },
  { id:"INV-2025-025", sid:"V1-20250276", date:"Feb 10, 2025", due:"Feb 24, 2025", amt:500,   status:"Paid",    route:"Mumbai → Pune"         },
  { id:"INV-2025-022", sid:"V1-20250261", date:"Jan 28, 2025", due:"Feb 11, 2025", amt:2100,  status:"Paid",    route:"Kolkata → Delhi"       },
  { id:"INV-2025-019", sid:"V1-20250248", date:"Jan 20, 2025", due:"Feb 3, 2025",  amt:1100,  status:"Paid",    route:"Bangalore → Hyderabad" },
  { id:"INV-2025-016", sid:"V1-20250235", date:"Jan 10, 2025", due:"Jan 24, 2025", amt:3200,  status:"Paid",    route:"Chennai → Delhi"       },
];

const statusMeta = {
  Paid:    { bg:"#D1FAE5", color:"#065F46", dot:"#10B981", icon:icons.check   },
  Unpaid:  { bg:"#FEF3C7", color:"#92400E", dot:"#F59E0B", icon:icons.clock   },
  Overdue: { bg:"#FEE2E2", color:"#991B1B", dot:"#EF4444", icon:icons.warning },
};

export default function ClientInvoices() {
  const [filter, setFilter] = useState("All");
  const [q,      setQ]      = useState("");
  const [paying, setPaying] = useState(null);
  const [paid,   setPaid]   = useState([]);

  const getStatus = inv => paid.includes(inv.id) ? "Paid" : inv.status;

  const rows = DATA.filter(inv => {
    const rs = getStatus(inv);
    const ms = filter === "All" || rs === filter;
    const mq = !q || inv.id.toLowerCase().includes(q.toLowerCase()) || inv.sid.toLowerCase().includes(q.toLowerCase());
    return ms && mq;
  });

  const totalDue   = DATA.filter(i => !paid.includes(i.id) && (i.status==="Unpaid" || i.status==="Overdue")).reduce((a,b) => a+b.amt, 0);
  const totalPaid  = DATA.filter(i => paid.includes(i.id) || i.status==="Paid").reduce((a,b) => a+b.amt, 0);
  const overdueCount = DATA.filter(i => !paid.includes(i.id) && i.status==="Overdue").length;

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#F8FAFC", color:"#0F172A" }}>
      <title>Invoices</title>
      <ClientNavbar />

      {/* PAY MODAL */}
      {paying && (
        <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.45)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"white", borderRadius:20, padding:"32px", width:420, boxShadow:"0 20px 60px rgba(0,0,0,0.2)", border:"1px solid #F1F5F9" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:4 }}>Pay Invoice</div>
                <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:"#0F172A" }}>{paying.id}</h3>
                <p style={{ margin:"4px 0 0", fontSize:12, color:"#94A3B8" }}>{paying.route}</p>
              </div>
              <button onClick={() => setPaying(null)} style={{ background:"none", border:"none", cursor:"pointer", padding:4, color:"#94A3B8" }}>
                <Icon d={icons.close} size={18} stroke="#94A3B8"/>
              </button>
            </div>

            <div style={{ padding:"14px 18px", background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)", borderRadius:12, border:"1px solid #FDE68A", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <span style={{ fontSize:13, color:"#92400E", fontWeight:500 }}>Amount Due</span>
              <span style={{ fontSize:22, fontWeight:900, color:"#92400E", letterSpacing:"-0.5px" }}>₹{paying.amt.toLocaleString()}</span>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
              {[
                { l:"UPI / PhonePe / Google Pay", e:"📱" },
                { l:"Net Banking",                e:"🏦" },
                { l:"Credit / Debit Card",        e:"💳" },
              ].map(m => (
                <button key={m.l}
                  onClick={() => { setPaid(p => [...p, paying.id]); setPaying(null); }}
                  style={{ padding:"13px 16px", borderRadius:12, background:"white", border:"1px solid #E2E8F0", color:"#334155", fontSize:13, fontWeight:500, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:12, transition:"all 0.15s", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => { e.currentTarget.style.background="#F8FAFC"; e.currentTarget.style.borderColor="#93C5FD"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="white"; e.currentTarget.style.borderColor="#E2E8F0"; }}>
                  <span style={{ fontSize:20 }}>{m.e}</span>
                  <span style={{ flex:1 }}>{m.l}</span>
                  <span style={{ color:"#CBD5E1" }}>›</span>
                </button>
              ))}
            </div>

            <button onClick={() => setPaying(null)}
              style={{ width:"100%", padding:"11px", borderRadius:12, background:"#F8FAFC", border:"1px solid #E2E8F0", color:"#64748B", fontSize:12, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <main style={{ flex:1, overflow:"auto", padding:"28px 100px", display:"flex", flexDirection:"column", gap:20 }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, color:"#0F172A", margin:"0 0 4px", letterSpacing:"-0.6px" }}>Invoices</h1>
            <p style={{ fontSize:13, color:"#94A3B8", margin:0 }}>Manage and pay your shipment invoices</p>
          </div>
          <button style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px", borderRadius:10, background:"white", border:"1px solid #E2E8F0", color:"#334155", fontSize:12, fontWeight:500, cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
            <Icon d={icons.download} size={13} stroke="#334155"/> Download All
          </button>
        </div>

        {/* KPI Summary */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {[
            { label:"Total Due",    val:`₹${totalDue.toLocaleString()}`,   sub:"Pay to avoid late fees",  color:"#92400E",  bg:"linear-gradient(135deg,#FFFBEB,#FEF3C7)", iconBg:"#FDE68A",  icon:icons.clock   },
            { label:"Overdue",      val:overdueCount,                       sub: overdueCount>0?"Needs immediate action":"All clear!", color:"#991B1B", bg:"linear-gradient(135deg,#FFF5F5,#FEE2E2)", iconBg:"#FECACA",  icon:icons.warning },
            { label:"Total Paid",   val:`₹${totalPaid.toLocaleString()}`,   sub:"Lifetime payments",       color:"#065F46",  bg:"linear-gradient(135deg,#F0FDF4,#D1FAE5)", iconBg:"#A7F3D0",  icon:icons.check   },
          ].map(k => (
            <div key={k.label} style={{ background:k.bg, borderRadius:16, padding:"20px", border:"1px solid rgba(255,255,255,0.8)", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:36, height:36, background:k.iconBg, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon d={k.icon} size={16} stroke={k.color}/>
                </div>
                <span style={{ fontSize:11, fontWeight:600, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.5px" }}>{k.label}</span>
              </div>
              <div style={{ fontSize:28, fontWeight:900, color:"#0F172A", letterSpacing:"-1px", lineHeight:1 }}>{k.val}</div>
              <div style={{ fontSize:11, color:k.color, marginTop:6, fontWeight:500 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ position:"relative" }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search invoices…"
              style={{ width:280, background:"white", border:"1px solid #E2E8F0", borderRadius:10, padding:"9px 14px 9px 36px", color:"#334155", fontSize:12, outline:"none", boxShadow:"0 1px 4px rgba(0,0,0,0.03)" }}
              onFocus={e => e.target.style.borderColor="#93C5FD"}
              onBlur={e => e.target.style.borderColor="#E2E8F0"}/>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>
              <Icon d={icons.search} size={13} stroke="#94A3B8"/>
            </span>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {["All","Unpaid","Overdue","Paid"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding:"7px 14px", borderRadius:9, border:"1px solid", borderColor:filter===f?"#2563EB":"#E2E8F0", background:filter===f?"#EFF6FF":"white", color:filter===f?"#1D4ED8":"#64748B", fontSize:12, fontWeight:filter===f?600:400, cursor:"pointer", transition:"all 0.15s" }}>
                {f}
              </button>
            ))}
          </div>
          <span style={{ marginLeft:"auto", fontSize:12, color:"#94A3B8" }}>{rows.length} invoices</span>
        </div>

        {/* Invoice list */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {rows.length === 0
            ? <div style={{ textAlign:"center", padding:48, color:"#94A3B8", fontSize:13, background:"white", borderRadius:16, border:"1px solid #F1F5F9" }}>No invoices found.</div>
            : rows.map(inv => {
                const rs = getStatus(inv);
                const sm = statusMeta[rs] || statusMeta.Unpaid;
                return (
                  <div key={inv.id}
                    style={{ background:"white", borderRadius:14, padding:"16px 20px", border:"1px solid #F1F5F9", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", display:"flex", alignItems:"center", gap:16, transition:"all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor="#E2E8F0"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor="#F1F5F9"; }}>

                    {/* Icon */}
                    <div style={{ width:44, height:44, borderRadius:12, background:"#F8FAFC", border:"1px solid #F1F5F9", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon d={icons.invoice} size={20} stroke="#94A3B8"/>
                    </div>

                    {/* ID + route */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                        <span style={{ fontSize:13, fontWeight:700, color:"#2563EB" }}>{inv.id}</span>
                        <span style={{ fontSize:10, color:"#CBD5E1" }}>·</span>
                        <span style={{ fontSize:11, color:"#94A3B8" }}>{inv.sid}</span>
                      </div>
                      <div style={{ fontSize:12, color:"#64748B" }}>{inv.route}</div>
                    </div>

                    {/* Issued */}
                    <div style={{ textAlign:"center", minWidth:90 }}>
                      <div style={{ fontSize:10, fontWeight:600, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:3 }}>Issued</div>
                      <div style={{ fontSize:12, color:"#334155" }}>{inv.date}</div>
                    </div>

                    {/* Due */}
                    <div style={{ textAlign:"center", minWidth:90 }}>
                      <div style={{ fontSize:10, fontWeight:600, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:3 }}>Due</div>
                      <div style={{ fontSize:12, color:rs==="Overdue"?"#991B1B":"#334155", fontWeight:rs==="Overdue"?700:400 }}>{inv.due}</div>
                    </div>

                    {/* Amount */}
                    <div style={{ textAlign:"right", minWidth:80 }}>
                      <div style={{ fontSize:18, fontWeight:800, color:"#0F172A", letterSpacing:"-0.3px" }}>₹{inv.amt.toLocaleString()}</div>
                    </div>

                    {/* Status badge */}
                    <div style={{ minWidth:90 }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:20, background:sm.bg, color:sm.color }}>
                        <span style={{ width:5, height:5, borderRadius:"50%", background:sm.dot, display:"inline-block" }}/>
                        {rs}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                      <button style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, background:"white", border:"1px solid #E2E8F0", color:"#334155", fontSize:11, fontWeight:500, cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                        <Icon d={icons.download} size={11} stroke="#334155"/> PDF
                      </button>
                      {rs !== "Paid" && (
                        <button onClick={() => setPaying(inv)}
                          style={{ padding:"6px 16px", borderRadius:8, background:"linear-gradient(135deg,#2563EB,#3B82F6)", border:"none", color:"white", fontSize:11, fontWeight:700, cursor:"pointer", boxShadow:"0 2px 8px rgba(37,99,235,0.25)", transition:"all 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 14px rgba(37,99,235,0.4)"}
                          onMouseLeave={e => e.currentTarget.style.boxShadow="0 2px 8px rgba(37,99,235,0.25)"}>
                          Pay Now
                        </button>
                      )}
                      {rs === "Paid" && (
                        <div style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:8, background:"#D1FAE5", border:"1px solid #A7F3D0" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                          <span style={{ fontSize:11, fontWeight:600, color:"#065F46" }}>Paid</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>

      </main>
    </div>
  );
}