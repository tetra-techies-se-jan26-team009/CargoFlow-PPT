import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

const Icon = ({
    d,
    size = 18,
    stroke = "currentColor",
    fill = "none",
    strokeWidth = 1.6,
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d={d} />
    </svg>
);

const icons = {
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
};

const navLinks = [
    { label: "Dashboard", path: "/auth_admin/dashboard" },
    { label: "Shipments", path: "/auth_admin/shipments" },
    { label: "Agents", path: "/auth_admin/agents" },
    { label: "Clients", path: "/auth_admin/clients" },
    { label: "Reports", path: "/auth_admin/reports" },
    // { label: "Settings", path: "/auth_admin/settings" },
];

export default function DashboardNavbar() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav
        className="bg-tertiary"
            style={{
                height: 58,
                display: "flex",
                alignItems: "center",
                padding: "0 28px",
                flexShrink: 0,
                zIndex: 100,
            }}
        >
            {/* Logo */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minWidth: 160,
                    cursor: "pointer",
                }}
                onClick={() => navigate("/auth_admin/dashboard")}
            >
                <div className="flex items-center gap-2 text-white font-bold text-lg tracking-wide">
                    CargoFlow
                </div>
            </div>

            {/* Nav Links */}
            <div style={{ display: "flex", gap: 2, marginLeft: 24 }}>
                {navLinks.map((link) => {
                    const active = location.pathname === link.path;
                    return (
                        <button
                            key={link.label}
                            onClick={() => navigate(link.path)}
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
                            }}
                        >
                            {link.label}
                        </button>
                    );
                })}
            </div>

            {/* Right */}
            <div
                style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                }}
            >
                <div style={{ position: "relative" }}>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search shipments, agents..."
                        style={{
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 8,
                            padding: "6px 14px 6px 36px",
                            color: "white",
                            fontSize: 12,
                            width: 230,
                            outline: "none",
                        }}
                    />
                    <span
                        style={{
                            position: "absolute",
                            left: 11,
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    >
                        <Icon d={icons.search} size={13} stroke="rgba(255,255,255,0.45)" />
                    </span>
                </div>
                <button
                    style={{
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.6)",
                        cursor: "pointer",
                        position: "relative",
                        padding: 4,
                    }}
                >
                    <Icon d={icons.bell} size={18} stroke="rgba(255,255,255,0.6)" />
                    <span
                        style={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            background: "#EF4444",
                            borderRadius: "50%",
                            width: 7,
                            height: 7,
                        }}
                    />
                </button>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "4px 10px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.07)",
                    }}
                >
                    <div
                        style={{
                            width: 28,
                            height: 28,
                            background: "#2563EB",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: 11,
                            fontWeight: 700,
                        }}
                    >
                        {user?.name?.[0]?.toUpperCase() || "A"}
                    </div>
                    <span style={{ color: "white", fontSize: 12, fontWeight: 500 }}>
                        {user?.name || "Admin"}
                    </span>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "end",
                        gap: 1,
                        minWidth: 1,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/auth_admin/settings")}
                >
                    <div style={{ display: "flex", alignItems: "end", gap: 1, minWidth: 1 }}>
                        <Cog6ToothIcon className="size-5 stroke-[rgba(255,255,255,0.6)]" />
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.4)",
                        cursor: "pointer",
                        padding: 4,
                    }}
                >
                    <Icon d={icons.logout} size={16} stroke="rgba(255,255,255,0.4)" />
                </button>
            </div>
        </nav>
    );
}
