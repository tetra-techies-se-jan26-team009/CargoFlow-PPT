import { useState } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";

const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const icons = {
    download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    bar: "M12 20V10 M18 20V4 M6 20v-4",
    calendar: "M3 4h18M3 8h18M3 12h18M5 16h14M8 20h8",
    file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6",
    check: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
    truck: "M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
};

const monthlyData = [
    { month: "Oct", shipments: 62, delivered: 58, delayed: 4, revenue: 186000 },
    { month: "Nov", shipments: 71, delivered: 67, delayed: 4, revenue: 213000 },
    { month: "Dec", shipments: 88, delivered: 82, delayed: 6, revenue: 264000 },
    { month: "Jan", shipments: 74, delivered: 71, delayed: 3, revenue: 222000 },
    { month: "Feb", shipments: 81, delivered: 79, delayed: 2, revenue: 243000 },
    { month: "Mar", shipments: 92, delivered: 88, delayed: 4, revenue: 276000 },
];

const maxShipments = Math.max(...monthlyData.map(d => d.shipments));
const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

const recentReports = [
    { name: "February 2025 Summary", type: "Monthly", date: "Mar 1, 2025", size: "2.4 MB" },
    { name: "Q4 2024 Performance Report", type: "Quarterly", date: "Jan 5, 2025", size: "5.1 MB" },
    { name: "January 2025 Summary", type: "Monthly", date: "Feb 1, 2025", size: "2.1 MB" },
    { name: "Agent Performance – Feb", type: "Agent", date: "Mar 1, 2025", size: "1.8 MB" },
    { name: "Client Revenue – Q4", type: "Client", date: "Jan 10, 2025", size: "3.2 MB" },
];

const typeBg = { Monthly: "#DBEAFE", Quarterly: "#EDE9FE", Agent: "#D1FAE5", Client: "#FEF3C7" };
const typeTxt = { Monthly: "#1D4ED8", Quarterly: "#6D28D9", Agent: "#065F46", Client: "#92400E" };

export default function ReportsPage() {
    const [range, setRange] = useState("6M");

    const totals = monthlyData.reduce((acc, m) => ({
        shipments: acc.shipments + m.shipments,
        delivered: acc.delivered + m.delivered,
        delayed: acc.delayed + m.delayed,
        revenue: acc.revenue + m.revenue,
    }), { shipments: 0, delivered: 0, delayed: 0, revenue: 0 });

    return (
        <>
        <title>Reports | CargoFlow</title>
            <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F1F5F9", color: "#0F172A" }}>
                <DashboardNavbar />

                <main style={{ flex: 1, overflow: "auto", padding: "24px 100px", display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.5px" }}>Reports & Analytics</h1>
                            <p style={{ fontSize: 12, color: "#94A3B8", margin: "4px 0 0" }}>Operational performance overview</p>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            {["1M", "3M", "6M", "1Y"].map(r => (
                                <button key={r} onClick={() => setRange(r)}
                                    style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid", borderColor: range === r ? "#2563EB" : "#E2E8F0", background: range === r ? "#EFF6FF" : "white", color: range === r ? "#2563EB" : "#64748B", fontSize: 12, fontWeight: range === r ? 600 : 400, cursor: "pointer" }}>
                                    {r}
                                </button>
                            ))}
                            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", border: "none", borderRadius: 8, background: "#2563EB", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                                <Icon d={icons.download} size={13} stroke="white" /> Export PDF
                            </button>
                        </div>
                    </div>

                    {/* KPI Summary */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
                        {[
                            { label: "Total Shipments", value: totals.shipments, sub: "Last 6 months", color: "#2563EB" },
                            { label: "Successfully Delivered", value: totals.delivered, sub: `${((totals.delivered / totals.shipments) * 100).toFixed(1)}% success rate`, color: "#10B981" },
                            { label: "Delayed", value: totals.delayed, sub: "Needs attention", color: "#EF4444" },
                            { label: "Total Revenue", value: `₹${(totals.revenue / 100000).toFixed(2)}L`, sub: "Gross earnings", color: "#7C3AED" },
                        ].map(k => (
                            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>
                                <div style={{ fontSize: 32, fontWeight: 800, color: k.color, letterSpacing: "-1px", lineHeight: 1 }}>{k.value}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginTop: 6 }}>{k.label}</div>
                                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{k.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                        {/* Shipments Bar Chart */}
                        <div style={{ background: "white", borderRadius: 12, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>
                            <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Monthly Shipments</h3>
                            <p style={{ margin: "0 0 20px", fontSize: 11, color: "#94A3B8" }}>Delivered vs Delayed</p>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 180 }}>
                                {monthlyData.map(d => (
                                    <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                        <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 160, gap: 2 }}>
                                            <div title={`Delayed: ${d.delayed}`}
                                                style={{ width: "100%", height: `${(d.delayed / maxShipments) * 160}px`, background: "#FEE2E2", borderRadius: "3px 3px 0 0", minHeight: 4 }} />
                                            <div title={`Delivered: ${d.delivered}`}
                                                style={{ width: "100%", height: `${(d.delivered / maxShipments) * 160}px`, background: "#2563EB", borderRadius: "3px 3px 0 0" }} />
                                        </div>
                                        <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500 }}>{d.month}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748B" }}>
                                    <span style={{ width: 12, height: 12, background: "#2563EB", borderRadius: 2, display: "inline-block" }} />Delivered
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748B" }}>
                                    <span style={{ width: 12, height: 12, background: "#FEE2E2", borderRadius: 2, display: "inline-block" }} />Delayed
                                </span>
                            </div>
                        </div>

                        {/* Revenue Chart */}
                        <div style={{ background: "white", borderRadius: 12, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>
                            <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Monthly Revenue</h3>
                            <p style={{ margin: "0 0 20px", fontSize: 11, color: "#94A3B8" }}>Gross earnings per month</p>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 180 }}>
                                {monthlyData.map(d => (
                                    <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                        <div style={{ width: "100%", height: `${(d.revenue / maxRevenue) * 160}px`, background: "linear-gradient(180deg,#7C3AED,#A78BFA)", borderRadius: "4px 4px 0 0", minHeight: 8 }} />
                                        <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500 }}>{d.month}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: 12, display: "flex", gap: 20 }}>
                                {monthlyData.slice(-2).map(d => (
                                    <div key={d.month}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED" }}>₹{(d.revenue / 1000).toFixed(0)}K</div>
                                        <div style={{ fontSize: 10, color: "#94A3B8" }}>{d.month}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Performance breakdown + Recent reports */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                        {/* Agent Performance Table */}
                        <div style={{ background: "white", borderRadius: 12, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>
                            <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Agent Performance</h3>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#F8FAFC" }}>
                                        {["Agent", "Zone", "Deliveries", "Rate"].map(h => (
                                            <th key={h} style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textAlign: "left", borderBottom: "1px solid #F1F5F9" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: "Meena Shah", zone: "Mumbai", deliveries: 223, rate: "95.7%", rateNum: 95.7 },
                                        { name: "Priya Nair", zone: "Kochi", deliveries: 198, rate: "100%", rateNum: 100 },
                                        { name: "Ravi Kumar", zone: "Chennai", deliveries: 142, rate: "98.2%", rateNum: 98.2 },
                                        { name: "Sneha Gupta", zone: "Delhi", deliveries: 176, rate: "97.1%", rateNum: 97.1 },
                                        { name: "Kiran Roy", zone: "Kolkata", deliveries: 64, rate: "90.0%", rateNum: 90.0 },
                                        { name: "Arjun Das", zone: "Hyderabad", deliveries: 87, rate: "83.5%", rateNum: 83.5 },
                                    ].map(a => (
                                        <tr key={a.name} style={{ borderBottom: "1px solid #F8FAFC" }}>
                                            <td style={{ padding: "10px 12px", fontSize: 12, fontWeight: 600, color: "#0F172A" }}>{a.name}</td>
                                            <td style={{ padding: "10px 12px", fontSize: 11, color: "#64748B" }}>{a.zone}</td>
                                            <td style={{ padding: "10px 12px", fontSize: 12, color: "#334155" }}>{a.deliveries}</td>
                                            <td style={{ padding: "10px 12px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div style={{ flex: 1, background: "#F1F5F9", borderRadius: 4, height: 6, overflow: "hidden" }}>
                                                        <div style={{ width: `${a.rateNum}%`, height: "100%", background: a.rateNum > 95 ? "#10B981" : a.rateNum > 88 ? "#F59E0B" : "#EF4444", borderRadius: 4 }} />
                                                    </div>
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: a.rateNum > 95 ? "#10B981" : a.rateNum > 88 ? "#F59E0B" : "#EF4444", minWidth: 36 }}>{a.rate}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Recent Reports */}
                        <div style={{ background: "white", borderRadius: 12, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>
                            <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Recent Reports</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {recentReports.map(r => (
                                    <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #F1F5F9" }}>
                                        <div style={{ width: 36, height: 36, background: "#EFF6FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <Icon d={icons.file} size={16} stroke="#2563EB" />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                                            <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{r.date} · {r.size}</div>
                                        </div>
                                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: typeBg[r.type], color: typeTxt[r.type], flexShrink: 0 }}>{r.type}</span>
                                        <button style={{ border: "none", background: "none", cursor: "pointer", color: "#94A3B8", padding: 4 }}>
                                            <Icon d={icons.download} size={14} stroke="#2563EB" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button style={{ width: "100%", marginTop: 12, padding: "9px", border: "1px solid #E2E8F0", borderRadius: 8, background: "white", color: "#334155", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                                Generate New Report
                            </button>
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}