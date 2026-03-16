import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Bell, Search, Settings, User, Menu, ChevronDown, Package } from 'lucide-react';


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

// const icons = {
//     bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
//     search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
//     logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
// };

const navLinks = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Shipments", path: "/admin/shipments" },
    { label: "Agents", path: "/admin/agents" },
    { label: "Clients", path: "/admin/clients", },
    { label: "Reports", path: "/admin/reports", },
];

export default function DashboardNavbar() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, title: 'Shipment Delayed', desc: 'V1-20250303 is running 2 hours late', time: '5m ago', type: 'warning' },
        { id: 2, title: 'Delivery Complete', desc: 'V1-20250302 delivered successfully', time: '15m ago', type: 'success' },
        { id: 3, title: 'New Client Added', desc: 'BlueStar Exports joined', time: '1h ago', type: 'info' },
    ];


    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav
            className="bg-background/80 sticky top-0 z-50 backdrop-blur-xl border-b border-gray-200"
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
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-lg tracking-tight">CargoFlow</span>
                    <span className="text-[10px] text-gray-500 -mt-1">Logistics Platform</span>
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
                            className="text-tertiary"
                            style={{
                                background: "none",
                                border: "none",
                                padding: "6px 16px",
                                borderRadius: 6,
                                fontSize: 13,
                                fontWeight: active ? 700 : 600,
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
                    <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-64 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search shipments..."
                            className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full"
                        />
                        <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-200 rounded">⌘K</kbd>
                    </div>

                </div>
                {/* <button
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
                </button> */}
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                                    <span className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-700">Mark all read</span>
                                </div>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors">
                                        <div className="flex gap-3">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.type === 'warning' ? 'bg-amber-500' :
                                                notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                                                }`}></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                                <p className="text-xs text-gray-600 mt-0.5">{notif.desc}</p>
                                                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                                <button className="text-xs text-blue-600 font-medium hover:text-blue-700 w-full text-center">View all notifications</button>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "end",
                        gap: 1,
                        minWidth: 1,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/admin/settings")}
                >
                    <Settings className="w-6 h-6 text-gray-600" />
                </div>
                {/* <div
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
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ color: "white", fontSize: 12, fontWeight: 500 }}>
                        {user?.name}
                    </span>
                </div> */}

                {/* <button
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
                </button> */}
                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <div className="p-2">
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => navigate("/admin/settings")}>Profile Settings</button>
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Preferences</button>
                                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={handleLogout}>Log Out</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
