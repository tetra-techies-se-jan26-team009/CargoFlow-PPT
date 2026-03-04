import { useState } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";

const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const icons = {
    plus: "M12 5v14 M5 12h14",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    building: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.43 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.34 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.29 6.29l.79-.79a2 2 0 012.1-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
    truck: "M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
    invoice: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M12 18v-6 M9 15h6",
};

const clients = [
    { id: "CLT-001", name: "Apex Traders", contact: "Ramesh Kumar", email: "ramesh@apextraders.com", phone: "+91 98100 11223", city: "Chennai", shipments: 28, revenue: "₹84,000", status: "Active", joined: "Jan 2024" },
    { id: "CLT-002", name: "BlueStar Exports", contact: "Priya Singh", email: "priya@bluestar.com", phone: "+91 87200 22334", city: "Delhi", shipments: 42, revenue: "₹1,26,000", status: "Active", joined: "Feb 2024" },
    { id: "CLT-003", name: "Metro Supplies", contact: "Ankit Sharma", email: "ankit@metrosupplies.com", phone: "+91 76300 33445", city: "Hyderabad", shipments: 15, revenue: "₹48,000", status: "Overdue", joined: "Mar 2024" },
    { id: "CLT-004", name: "Sunrise Co.", contact: "Neha Patel", email: "neha@sunriseco.com", phone: "+91 65400 44556", city: "Mumbai", shipments: 9, revenue: "₹27,000", status: "Active", joined: "Apr 2024" },
    { id: "CLT-005", name: "Northern Goods", contact: "Vikram Roy", email: "vikram@northerngoods.com", phone: "+91 54500 55667", city: "Kolkata", shipments: 31, revenue: "₹93,000", status: "Active", joined: "May 2024" },
    { id: "CLT-006", name: "South Freight", contact: "Deepa Nair", email: "deepa@southfreight.com", phone: "+91 43600 66778", city: "Bangalore", shipments: 7, revenue: "₹21,000", status: "Inactive", joined: "Jun 2024" },
    { id: "CLT-007", name: "Coastal Cargo", contact: "Suresh Menon", email: "suresh@coastalcargo.com", phone: "+91 32700 77889", city: "Kochi", shipments: 19, revenue: "₹57,000", status: "Active", joined: "Jul 2024" },
    { id: "CLT-008", name: "Peak Logistics", contact: "Kavitha Iyer", email: "kavitha@peaklogistics.com", phone: "+91 21800 88990", city: "Pune", shipments: 52, revenue: "₹1,56,000", status: "Active", joined: "Aug 2024" },
];

const statusMeta = {
    Active: { bg: "#D1FAE5", color: "#065F46" },
    Overdue: { bg: "#FEE2E2", color: "#991B1B" },
    Inactive: { bg: "#F1F5F9", color: "#64748B" },
};

export default function ClientsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filtered = clients.filter(c => {
        const matchStatus = filter === "All" || c.status === filter;
        const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <>
        <title>Clients | CargoFlow</title>
            <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F1F5F9", color: "#0F172A" }}>
                <DashboardNavbar />

                <main style={{ flex: 1, overflow: "auto", padding: "24px 100px", display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.5px" }}>Manage Clients</h1>
                            <p style={{ fontSize: 12, color: "#94A3B8", margin: "4px 0 0" }}>{clients.length} registered business clients</p>
                        </div>
                        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "none", borderRadius: 8, background: "#2563EB", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                            <Icon d={icons.plus} size={13} stroke="white" /> Add Client
                        </button>
                    </div>

                    {/* KPIs */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                        {[
                            { label: "Total Clients", value: clients.length, color: "#2563EB" },
                            { label: "Active", value: clients.filter(c => c.status === "Active").length, color: "#10B981" },
                            { label: "Overdue", value: clients.filter(c => c.status === "Overdue").length, color: "#EF4444" },
                            { label: "Total Revenue", value: "₹6.12L", color: "#7C3AED" },
                        ].map(k => (
                            <div key={k.label} style={{ background: "white", borderRadius: 10, padding: "14px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
                                <div style={{ fontSize: 26, fontWeight: 800, color: k.color, letterSpacing: "-0.5px" }}>{k.value}</div>
                                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{k.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients, contacts, cities..."
                                style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 8, padding: "7px 12px 7px 34px", fontSize: 12, color: "#334155", outline: "none", background: "white", boxSizing: "border-box" }} />
                            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
                                <Icon d={icons.search} size={13} stroke="#94A3B8" />
                            </span>
                        </div>
                        {["All", "Active", "Overdue", "Inactive"].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid", borderColor: filter === f ? "#2563EB" : "#E2E8F0", background: filter === f ? "#EFF6FF" : "white", color: filter === f ? "#2563EB" : "#64748B", fontSize: 12, fontWeight: filter === f ? 600 : 400, cursor: "pointer" }}>
                                {f}
                            </button>
                        ))}
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "#94A3B8" }}>{filtered.length} clients</span>
                    </div>

                    {/* Table */}
                    <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#F8FAFC" }}>
                                    {["Client", "Contact Person", "Email", "Phone", "City", "Shipments", "Revenue", "Status", "Joined", "Actions"].map(h => (
                                        <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textAlign: "left", borderBottom: "1px solid #F1F5F9", whiteSpace: "nowrap" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(c => (
                                    <tr key={c.id} style={{ borderBottom: "1px solid #F8FAFC", cursor: "pointer" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                                        onMouseLeave={e => e.currentTarget.style.background = "white"}>
                                        <td style={{ padding: "13px 16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{ width: 34, height: 34, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#2563EB", flexShrink: 0 }}>
                                                    {c.name[0]}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{c.name}</div>
                                                    <div style={{ fontSize: 10, color: "#94A3B8" }}>{c.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "13px 16px", fontSize: 12, color: "#334155" }}>{c.contact}</td>
                                        <td style={{ padding: "13px 16px", fontSize: 11, color: "#64748B" }}>{c.email}</td>
                                        <td style={{ padding: "13px 16px", fontSize: 11, color: "#64748B", whiteSpace: "nowrap" }}>{c.phone}</td>
                                        <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748B" }}>{c.city}</td>
                                        <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{c.shipments}</td>
                                        <td style={{ padding: "13px 16px", fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{c.revenue}</td>
                                        <td style={{ padding: "13px 16px" }}>
                                            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: statusMeta[c.status]?.bg, color: statusMeta[c.status]?.color }}>{c.status}</span>
                                        </td>
                                        <td style={{ padding: "13px 16px", fontSize: 11, color: "#94A3B8" }}>{c.joined}</td>
                                        <td style={{ padding: "13px 16px" }}>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button style={{ padding: "5px 10px", border: "1px solid #E2E8F0", borderRadius: 6, background: "white", color: "#334155", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>View</button>
                                                <button style={{ padding: "5px 10px", border: "none", borderRadius: 6, background: "#EFF6FF", color: "#2563EB", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Invoice</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </main>
            </div>
        </>
    );
}