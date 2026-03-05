import { useState, useEffect } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { getCurrentUser, updateProfile } from "../../utils/auth";

const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const icons = {
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    globe: "M12 2a10 10 0 100 20A10 10 0 0012 2z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    save: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8",
};

const tabs = [
    { key: "profile", label: "Profile", icon: icons.user },
    { key: "security", label: "Security", icon: icons.lock },
    { key: "notifications", label: "Notifications", icon: icons.bell },
    { key: "regional", label: "Regional", icon: icons.globe },
    { key: "security2", label: "Permissions", icon: icons.shield },
];

const Toggle = ({ on, onToggle }) => (
    <button onClick={onToggle}
        style={{ width: 44, height: 24, borderRadius: 12, background: on ? "#2563EB" : "#E2E8F0", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 3, left: on ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </button>
);

const FieldRow = ({ label, desc, children }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: desc ? "flex-start" : "center", padding: "16px 0", borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ flex: 1, marginRight: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{label}</div>
            {desc && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{desc}</div>}
        </div>
        {children}
    </div>
);

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState(null); 

    const [notifs, setNotifs] = useState({
        email_shipment: true, email_delay: true, email_report: false,
        sms_delivery: true, sms_delay: false, push_all: true,
    });

    const [profile, setProfile] = useState({
        name: "", email: "", phone: "", company: " Cargo Flow Pvt. Ltd.", timezone: "Asia/Kolkata"
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    setProfile(prev => ({
                        ...prev,
                        name: user.name || "",
                        email: user.email || "",
                        phone: user.phone || "",
                    }));
                }
            } catch (err) {
                console.error("Failed to load user:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // ── Save profile changes ─────────────────────────────────────────────
    const handleSaveProfile = async () => {
        setSaving(true);
        setSaveMsg(null);
        try {
            await updateProfile({
                name: profile.name,
                phone: profile.phone,
                email: profile.email,
            });
            setSaveMsg({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            setSaveMsg({ type: "error", text: err.message || "Failed to save. Please try again." });
        } finally {
            setSaving(false);
            setTimeout(() => setSaveMsg(null), 3000);
        }
    };
    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#F1F5F9" }}>
                <DashboardNavbar />
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: 14 }}>
                    Loading settings...
                </div>
            </div>
        );
    }
    return (
        <>
            <title>Settings | CargoFlow</title>
            <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F1F5F9", color: "#0F172A" }}>
                <DashboardNavbar />

                <main style={{ flex: 1, overflow: "auto", padding: "24px 100px", display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Header */}
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.5px" }}>Settings</h1>
                        <p style={{ fontSize: 12, color: "#94A3B8", margin: "4px 0 0" }}>Manage your account and platform preferences</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "start" }}>

                        {/* Tab Sidebar */}
                        <div style={{ background: "white", borderRadius: 12, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>
                            {tabs.map(t => {
                                const active = activeTab === t.key;
                                return (
                                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: active ? "#EFF6FF" : "none", color: active ? "#2563EB" : "#64748B", fontWeight: active ? 600 : 400, fontSize: 13, textAlign: "left", marginBottom: 2, transition: "all 0.1s" }}>
                                        <Icon d={t.icon} size={15} stroke={active ? "#2563EB" : "#94A3B8"} /> {t.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Content panel */}
                        <div style={{ background: "white", borderRadius: 12, padding: "24px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>

                            {/* ── PROFILE TAB ── */}
                            {activeTab === "profile" && (
                                <div>
                                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 20px" }}>Profile Information</h2>

                                    {/* Avatar */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: "1px solid #F1F5F9", marginBottom: 8 }}>
                                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#2563EB" }}>
                                            {profile.name?.[0]?.toUpperCase() || "A"}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{profile.name}</div>
                                            <div style={{ fontSize: 12, color: "#94A3B8" }}>{profile.email}</div>
                                        </div>
                                    </div>

                                    {/* Editable fields */}
                                    <FieldRow label="Full Name">
                                        <input type="text" value={profile.name}
                                            onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                            style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#334155", outline: "none", width: 260, background: "white" }} />
                                    </FieldRow>

                                    {/* Email — read only, can't change via this form */}
                                    <FieldRow label="Email">
                                        <input type="email" value={profile.email}
                                            onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                                            style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#334155", outline: "none", width: 260, background: "white" }} />
                                    </FieldRow>

                                    <FieldRow label="Phone">
                                        <input type="tel" value={profile.phone}
                                            onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                                            style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#334155", outline: "none", width: 260, background: "white" }} />
                                    </FieldRow>

                                    <FieldRow label="Company">
                                        <input type="text" value={profile.company} disabled
                                            onChange={e => setProfile(p => ({ ...p, company: e.target.value }))}
                                            style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#334155", outline: "none", width: 260, background: "white" }} />
                                    </FieldRow>

                                    <FieldRow label="Timezone" desc="Used for scheduling and report generation">
                                        <select value={profile.timezone} onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}
                                            style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#334155", outline: "none", width: 260, background: "white", cursor: "pointer" }}>
                                            <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                                        </select>
                                    </FieldRow>

                                    {/* Save message */}
                                    {saveMsg && (
                                        <div style={{ margin: "12px 0", padding: "10px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: saveMsg.type === "success" ? "#D1FAE5" : "#FEE2E2", color: saveMsg.type === "success" ? "#065F46" : "#991B1B" }}>
                                            {saveMsg.text}
                                        </div>
                                    )}

                                    <div style={{ marginTop: 20 }}>
                                        <button onClick={handleSaveProfile} disabled={saving}
                                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", border: "none", borderRadius: 8, background: saving ? "#93C5FD" : "#2563EB", color: "white", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
                                            <Icon d={icons.save} size={14} stroke="white" />
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── SECURITY TAB ── */}
                            {activeTab === "security" && (
                                <div>
                                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 20px" }}>Security Settings</h2>
                                    <FieldRow label="Change Password" desc="Last changed 45 days ago">
                                        <button style={{ padding: "8px 16px", border: "1px solid #E2E8F0", borderRadius: 8, background: "white", color: "#334155", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Update Password</button>
                                    </FieldRow>
                                    <FieldRow label="Two-Factor Authentication" desc="Add an extra layer of security to your account">
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span style={{ fontSize: 12, color: "#EF4444", fontWeight: 500 }}>Disabled</span>
                                            <button style={{ padding: "7px 14px", border: "none", borderRadius: 7, background: "#2563EB", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Enable 2FA</button>
                                        </div>
                                    </FieldRow>
                                    <FieldRow label="Active Sessions" desc="Devices currently logged into your account">
                                        <button style={{ padding: "8px 16px", border: "1px solid #FCA5A5", borderRadius: 8, background: "white", color: "#EF4444", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Revoke All Sessions</button>
                                    </FieldRow>
                                    <FieldRow label="Login History" desc="Review recent account access">
                                        <button style={{ padding: "8px 16px", border: "1px solid #E2E8F0", borderRadius: 8, background: "white", color: "#334155", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>View History</button>
                                    </FieldRow>
                                </div>
                            )}

                            {/* ── NOTIFICATIONS TAB ── */}
                            {activeTab === "notifications" && (
                                <div>
                                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 20px" }}>Notification Preferences</h2>

                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.5px", marginBottom: 8 }}>EMAIL</div>
                                    <FieldRow label="Shipment Updates" desc="When a shipment status changes">
                                        <Toggle on={notifs.email_shipment} onToggle={() => setNotifs(n => ({ ...n, email_shipment: !n.email_shipment }))} />
                                    </FieldRow>
                                    <FieldRow label="Delay Alerts" desc="When a shipment is flagged as delayed">
                                        <Toggle on={notifs.email_delay} onToggle={() => setNotifs(n => ({ ...n, email_delay: !n.email_delay }))} />
                                    </FieldRow>
                                    <FieldRow label="Monthly Reports" desc="Auto-generated performance reports">
                                        <Toggle on={notifs.email_report} onToggle={() => setNotifs(n => ({ ...n, email_report: !n.email_report }))} />
                                    </FieldRow>

                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.5px", margin: "20px 0 8px" }}>SMS</div>
                                    <FieldRow label="Delivery Confirmation" desc="SMS when shipment is delivered">
                                        <Toggle on={notifs.sms_delivery} onToggle={() => setNotifs(n => ({ ...n, sms_delivery: !n.sms_delivery }))} />
                                    </FieldRow>
                                    <FieldRow label="Delay Alerts" desc="SMS for high-risk delays">
                                        <Toggle on={notifs.sms_delay} onToggle={() => setNotifs(n => ({ ...n, sms_delay: !n.sms_delay }))} />
                                    </FieldRow>

                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.5px", margin: "20px 0 8px" }}>PUSH</div>
                                    <FieldRow label="All Push Notifications" desc="Browser and mobile push alerts">
                                        <Toggle on={notifs.push_all} onToggle={() => setNotifs(n => ({ ...n, push_all: !n.push_all }))} />
                                    </FieldRow>
                                    <div style={{ marginTop: 20 }}>
                                        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", border: "none", borderRadius: 8, background: "#2563EB", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                            <Icon d={icons.save} size={14} stroke="white" /> Save Preferences
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── REGIONAL TAB ── */}
                            {activeTab === "regional" && (
                                <div>
                                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 20px" }}>Regional Settings</h2>
                                    {[
                                        { label: "Language", desc: "Platform display language", options: ["English (India)", "Hindi", "Tamil", "Telugu"] },
                                        { label: "Currency", desc: "Used for invoicing and reports", options: ["INR (₹)", "USD ($)", "EUR (€)"] },
                                        { label: "Date Format", desc: "How dates are displayed", options: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] },
                                        { label: "Distance Unit", desc: "Used in route calculations", options: ["Kilometers", "Miles"] },
                                        { label: "Weight Unit", desc: "For shipment weight display", options: ["Kilograms (kg)", "Pounds (lb)"] },
                                    ].map(f => (
                                        <FieldRow key={f.label} label={f.label} desc={f.desc}>
                                            <select style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#334155", outline: "none", width: 240, background: "white", cursor: "pointer" }}>
                                                {f.options.map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </FieldRow>
                                    ))}
                                    <div style={{ marginTop: 20 }}>
                                        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", border: "none", borderRadius: 8, background: "#2563EB", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                            <Icon d={icons.save} size={14} stroke="white" /> Save Regional Settings
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── PERMISSIONS TAB ── */}
                            {activeTab === "security2" && (
                                <div>
                                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 20px" }}>Role Permissions</h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {[
                                            { role: "ADMIN", perms: ["Full access", "Manage agents", "Manage clients", "View reports", "Settings"], color: "#7C3AED", bg: "#EDE9FE" },
                                            { role: "DELIVERY_AGENT", perms: ["View assigned shipments", "Update delivery status", "Report issues"], color: "#2563EB", bg: "#EFF6FF" },
                                            { role: "BUSINESS_CLIENT", perms: ["Track shipments", "Request pickup", "View own invoices", "Contact support"], color: "#10B981", bg: "#D1FAE5" },
                                        ].map(r => (
                                            <div key={r.role} style={{ padding: "16px 18px", borderRadius: 10, border: "1px solid #F1F5F9", background: "#F8FAFC" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: r.bg, color: r.color }}>{r.role}</span>
                                                </div>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                    {r.perms.map(p => (
                                                        <span key={p} style={{ fontSize: 11, color: "#64748B", background: "white", border: "1px solid #E2E8F0", borderRadius: 6, padding: "4px 10px" }}>✓ {p}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 16, padding: "12px 16px", background: "#FEF3C7", borderRadius: 8, border: "1px solid #FDE68A", fontSize: 12, color: "#92400E" }}>
                                        ⚠️ Role permissions are system-defined. Contact your system administrator to modify access levels.
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}