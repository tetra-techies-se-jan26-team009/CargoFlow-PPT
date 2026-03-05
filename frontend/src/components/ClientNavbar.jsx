import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";


const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const icons = {
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
};

const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Shipments", path: "/shipments" },
    { label: "Request Pickup", path: "/pickup" },
    { label: "Invoices", path: "/invoices" },
];

export default function ClientNavbar() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <nav
            className="bg-tertiary"
            style={{
                height: 62,
                display: "flex",
                alignItems: "center",
                padding: "0 32px",
                flexShrink: 0,
                zIndex: 100,
                boxShadow: "0 2px 20px rgba(11,31,59,0.4)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                fontFamily: "'DM Sans','Segoe UI',sans-serif",
            }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 180, cursor: "pointer" }}
                onClick={() => navigate("/auth_client/dashboard")}>
                <div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 20, letterSpacing: "-0.3px", lineHeight: 1.1 }}>CargoFlow</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>Client Portal</div>
                </div>
            </div>

            {/* Nav Links */}
            <div style={{ display: "flex", gap: 2, marginLeft: 32 }}>
                {navLinks.map(link => {
                    const active = location.pathname === link.path;
                    return (
                        <button key={link.label} onClick={() => navigate(link.path)}
                            style={{
                                background: "none",
                                border: "none",
                                color: active ? "white" : "rgba(255,255,255,0.5)",
                                padding: "6px 16px",
                                borderRadius: 6,
                                fontSize: 13,
                                fontWeight: active ? 600 : 400,
                                cursor: "pointer",
                                borderBottom: active
                                    ? "2px solid #2563EB"
                                    : "2px solid transparent",
                                transition: "all 0.15s",
                            }}>
                            {link.label}
                        </button>
                    );
                })}
            </div>

            {/* Right side */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
                {/* Search */}
                <div style={{ position: "relative" }}>
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Track a shipment..."
                        style={{
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 20, padding: "7px 16px 7px 36px",
                            color: "white", fontSize: 12, width: 200, outline: "none",
                            fontFamily: "'DM Sans','Segoe UI',sans-serif",
                        }} />
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                        <Icon d={icons.search} size={13} stroke="rgba(255,255,255,0.4)" />
                    </span>
                </div>

                {/* Bell */}
                <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", position: "relative", padding: 4 }}>
                    <Icon d={icons.bell} size={18} stroke="rgba(255,255,255,0.6)" />
                    <span style={{ position: "absolute", top: 2, right: 2, background: "#F59E0B", borderRadius: "50%", width: 7, height: 7 }} />
                </button>

                {/* User */}
                <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 12px", borderRadius: 20, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
                    <div style={{
                        width: 26, height: 26,
                        background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
                        borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#0B1F3B", fontSize: 11, fontWeight: 800,
                    }}>
                        {user?.name?.[0]?.toUpperCase() || "C"}
                    </div>
                    <span style={{ color: "white", fontSize: 12, fontWeight: 500 }}>{user?.name || "Client"}</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "end",
                        gap: 1,
                        minWidth: 1,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/settings")}
                >
                    <div style={{ display: "flex", alignItems: "end", gap: 1, minWidth: 1 }}>
                        <Cog6ToothIcon className="size-5 stroke-[rgba(255,255,255,0.6)]" />
                    </div>
                </div>

                {/* Logout */}
                <button onClick={() => { logout(); navigate("/login"); }}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", padding: 4 }}>
                    <Icon d={icons.logout} size={16} stroke="rgba(255,255,255,0.35)" />
                </button>
            </div>
        </nav>
    );
}