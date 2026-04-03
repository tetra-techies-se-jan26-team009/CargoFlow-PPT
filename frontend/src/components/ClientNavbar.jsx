import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Package } from "lucide-react";
import { ModalHeader } from "./ui/Modal";
import { FormGroup, BtnPrimary, BtnSecondary, ModalActions } from "./ui/ClientModals/SharedPrimitives";


const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const inputStyle = {
    width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 10,
    padding: "10px 14px", fontSize: 13.5, fontFamily: "inherit", outline: "none", color: "#0F172A",
};

const ConfirmPickupModal = ({ onClose, showToast, dismissAlert, user }) => (
    <>
        <ModalHeader title="⏰ Confirm Pickup" onClose={onClose} />
        <div style={{ background: "#FEF3C7", borderRadius: 14, padding: 16, marginBottom: 16, border: "1.5px solid #FDE68A" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#92400E", letterSpacing: 1, textTransform: "uppercase" }}>Shipment</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", margin: "4px 0" }}>V1-20250276</div>
            <div style={{ fontSize: 13, color: "#92400E" }}>Mumbai → Pune · Mar 5, 10:00 AM</div>
        </div>
        <FormGroup label="Confirm Availability">
            <select style={inputStyle}><option>Yes, I'll be available at 10AM</option><option>I need to reschedule</option><option>Someone else will be there</option></select>
        </FormGroup>
        <FormGroup label="Contact Person"><input style={inputStyle} defaultValue={user?.name || ""} /></FormGroup>
        <FormGroup label="Mobile"><input style={inputStyle} defaultValue="+91 98765 43210" /></FormGroup>
        <ModalActions>
            <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
            <BtnPrimary onClick={() => { onClose(); dismissAlert(); showToast("Pickup confirmed for Mar 5, 10AM. Meena Shah will pick up your parcel.", "✅", "success"); }} style={{ flex: 2 }}>
                Confirm Pickup
            </BtnPrimary>
        </ModalActions>
    </>
);

const RescheduleModal = ({ onClose, showToast }) => (
    <>
        <ModalHeader title="📅 Reschedule Pickup" onClose={onClose} />
        <FormGroup label="Current Schedule">
            <div style={{ background: "#FEF3C7", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#92400E", fontWeight: 600 }}>Mar 5, 2025 — 10:00 AM</div>
        </FormGroup>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormGroup label="New Date"><input style={inputStyle} type="date" /></FormGroup>
            <FormGroup label="Preferred Time">
                <select style={inputStyle}><option>9AM – 12PM</option><option>12PM – 3PM</option><option>3PM – 6PM</option></select>
            </FormGroup>
        </div>
        <FormGroup label="Reason">
            <select style={inputStyle}><option>Not available at that time</option><option>Need more preparation time</option><option>Address change</option><option>Other</option></select>
        </FormGroup>
        <ModalActions>
            <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
            <BtnPrimary onClick={() => { onClose(); showToast("Pickup rescheduled successfully!", "📅", "success"); }} style={{ flex: 2 }}>Reschedule</BtnPrimary>
        </ModalActions>
    </>
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

export default function ClientNavbar({
    onTrackSearch,
    onBellClick,
    unreadCount = 0,
    // onConfirmPickup,
    // onReschedule,
}) {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    // if (loading) return null;
    const handleSearchKey = (e) => {
        if (e.key === "Enter" && search.trim()) {
            if (onTrackSearch) {
                onTrackSearch(search.trim().toUpperCase());
            }
        }
    };

    const linkAction = (link) => {
        return () => navigate(link.path);
    };

    return (
        <div className="sticky top-0 left-0 w-full z-1100">
            <nav
                className="bg-background border-b border-gray-100"
                style={{
                    height: 62,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 32px",
                    flexShrink: 0,
                    fontFamily: "'DM Sans','Segoe UI',sans-serif",
                }}
            >
                {/* Logo */}
                <div
                    style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 180, cursor: "pointer" }}
                    onClick={() => navigate("/dashboard")}
                >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Package className="w-5 h-5 text-background" />
                    </div>
                    <div>
                        <div style={{ color: "black", fontWeight: 700, fontSize: 20, letterSpacing: "-0.3px", lineHeight: 1.1 }}>CargoFlow</div>
                        <div className="text-gray-800" style={{ fontSize: 9, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>Client Portal</div>
                    </div>
                </div>

                {/* Nav Links */}
                <div style={{ display: "flex", gap: 2, marginLeft: 32 }}>
                    {navLinks.map(link => {
                        const active = location.pathname === link.path;
                        return (
                            <button
                                className="text-tertiary"
                                key={link.label}
                                onClick={linkAction(link)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: "6px 16px",
                                    borderRadius: 6,
                                    fontSize: 13,
                                    fontWeight: active ? 600 : 400,
                                    cursor: "pointer",
                                    borderBottom: active ? "2px solid #2563EB" : "2px solid transparent",
                                    transition: "all 0.15s",
                                    fontFamily: "inherit",
                                }}
                            >
                                {link.label}
                            </button>
                        );
                    })}
                </div>

                {/* Right side */}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>

                    {/* Track search */}
                    <div style={{ position: "relative" }}>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={handleSearchKey}
                            placeholder="Track a shipment..."
                            className="bg-gray-100/80 text-text"
                            style={{
                                border: "1px solid rgba(255,255,255,0.12)",
                                borderRadius: 20,
                                padding: "7px 16px 7px 36px",
                                fontSize: 12,
                                width: 200,
                                outline: "none",
                                fontFamily: "'DM Sans','Segoe UI',sans-serif",
                            }}
                        />
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                            <Icon d={icons.search} size={13} className="text-black" />
                        </span>
                    </div>

                    {/* Bell */}
                    <button
                        onClick={onBellClick}
                        style={{
                            borderRadius: 20,
                            cursor: "pointer", position: "relative", padding: 4,
                        }}
                    >
                        <Icon d={icons.bell} size={18} className="text-text/50" />
                        {unreadCount > 0 && (
                            <span style={{
                                position: "absolute", top: 2, right: 2,
                                background: "#F59E0B", borderRadius: "50%",
                                width: 7, height: 7,
                                ...(unreadCount > 9 ? {
                                    width: "auto", height: 16, borderRadius: 8,
                                    padding: "0 4px", fontSize: 9, color: "white",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: 700,
                                } : {}),
                            }}>
                                {unreadCount > 9 ? "9+" : ""}
                            </span>
                        )}
                    </button>

                    {/* User chip */}
                    <div
                        className="bg-gray-100/80"
                        style={{
                            display: "flex", alignItems: "center", gap: 9,
                            padding: "5px 12px", borderRadius: 20,
                            border: "1px solid rgba(255,255,255,0.1)",
                            cursor: "pointer",
                        }}>
                        <div
                            className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f59e0b] via-[#fcd34d] to-[#fef9c3]"
                            style={{
                                width: 26, height: 26,
                                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#0B1F3B", fontSize: 11, fontWeight: 800,
                            }}>
                            {user?.name?.[0]?.toUpperCase() || "C"}
                        </div>
                        <span className="text-tertiary" style={{ fontSize: 12, fontWeight: 500 }}>{user?.name?.split(" ")[0] || "Loading..."}</span>

                    </div>

                    {/* Settings */}
                    <div
                        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => navigate("/settings")}
                    >
                        <Cog6ToothIcon className="size-5 stroke-[rgba(255,255,255,0.6)]" />
                    </div>

                    {/* Logout */}
                    <button
                        className="text-red-900"
                        onClick={() => { logout(); navigate("/login"); }}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                    >
                        <Icon d={icons.logout} size={16} className="bg-red-900" />
                    </button>
                </div>
            </nav>
        </div>

    );
}