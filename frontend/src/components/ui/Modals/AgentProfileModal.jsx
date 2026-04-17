import { useState } from "react";
import Modal from "../Modal";
import { updateAgentDetails } from "../../../utils/adminAPI";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, s = 14, c = "currentColor", f = "none", w = 1.8 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={f} stroke={c}
        strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const IC = {
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.43 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.34 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.29 6.29l.79-.79a2 2 0 012.1-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
    pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    check: "M20 6L9 17l-5-5",
    alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
};

// ─── Input Styles ─────────────────────────────────────────────────────────────
const F = ({ label, icon, required, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 4 }}>
            {icon && <Ico d={icon} s={12} c="#6B7280" />}
            {label}{required && <span style={{ color: "#DC2626", marginLeft: 2 }}>*</span>}
        </label>
        {children}
    </div>
);

const iBase = {
    width: "100%", background: "#FFFFFF", border: "1px solid #D1D5DB",
    borderRadius: 8, padding: "9px 12px", color: "#111827",
    fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s ease", boxSizing: "border-box",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)"
};

const oF = e => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; };
const oB = e => { e.target.style.borderColor = "#D1D5DB"; e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.03)"; };

export function AgentProfileModal({ agent, onClose }) {
    // ─── State ────────────────────────────────────────────────────────────────
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiErr, setApiErr] = useState(null);

    const [f, setF] = useState({
        name: agent.name || "",
        email: agent.email || "",
        phone: agent.phone || "",
        city: agent.city || agent.zone || "",
    });

    if (!agent) return null;

    const statusBg = { Active: "#D1FAE5", Block: "#FAD1D1", Off: "#F1F5F9" };
    const statusTxt = { Active: "#065F46", Idle: "#92400E", Off: "#64748B" };


    const set = (k, v) => setF(p => ({ ...p, [k]: v }));

    const handleSave = async () => {
        setLoading(true);
        setApiErr(null);
        try {
            const numericId = parseInt(agent.id.replace(/\D/g, ""), 10);
            const payload = {
                ...f,
                phone: f.phone.replace(/\s|\+91/g, "")
            };
            await updateAgentDetails(numericId, payload);
            window.location.reload();
        } catch (err) {
            const detail = err?.response?.data?.detail;
            if (Array.isArray(detail)) {
                setApiErr(detail.map(e => `${e.loc.at(-1)}: ${e.msg}`).join(" | "));
            } else {
                setApiErr(typeof detail === "string" ? detail : "Failed to update agent.");
            }
            setLoading(false);
        }
    };

    return (
        <Modal onClose={onClose} width={480}>
            <div style={{ background: "#FFFFFF", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>

                {/* ─── Header Profile Section ──────────────────────────────── */}
                <div style={{ padding: "32px 28px 24px", background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)", borderBottom: "1px solid #E5E7EB", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>

                    {/* ─── Top Right Action Bar ─── */}
                    <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 8 }}>
                        {/* Edit Button (Only visible when NOT editing) */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                title="Edit Agent"
                                style={{ width: 32, height: 32, borderRadius: 8, background: "#FFFFFF", border: "1px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "all 0.2s" }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#2563EB"}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#D1D5DB"}
                            >
                                <Ico d={IC.edit} s={14} c="#4B5563" />
                            </button>
                        )}

                        {/* Top-Right "X" Close Button */}
                        <button
                            onClick={onClose}
                            title="Close"
                            style={{ width: 32, height: 32, borderRadius: 8, background: "#FFFFFF", border: "1px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "all 0.2s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#EF4444"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "#6B7280"; }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18 M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Avatar & Name */}
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#EFF6FF", border: "4px solid #FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#2563EB", boxShadow: "0 4px 10px rgba(37,99,235,0.15)", marginBottom: 16 }}>
                        {f.name[0]?.toUpperCase() || "?"}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: "-0.3px", marginBottom: 6 }}>
                        {isEditing ? "Editing Profile" : f.name}
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#64748B", fontFamily: "'DM Mono', monospace" }}>{agent.id}</span>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#CBD5E1" }} />
                        <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: statusBg[agent.status], color: statusTxt[agent.status] }}>
                            {agent.status}
                        </span>
                    </div>
                </div>

                {/* ─── Details / Edit Section ──────────────────────────────── */}
                <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

                    {apiErr && (
                        <div style={{ display: "flex", gap: 10, padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8 }}>
                            <Ico d={IC.alert} s={14} c="#DC2626" />
                            <span style={{ fontSize: 12, color: "#DC2626", fontWeight: 500 }}>{apiErr}</span>
                        </div>
                    )}

                    {isEditing ? (
                        /* ================== EDIT MODE ================== */
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <F label="Agent Full Name" icon={IC.user} required>
                                <input value={f.name} onChange={e => set("name", e.target.value)} style={iBase} onFocus={oF} onBlur={oB} />
                            </F>
                            <F label="Base City / Zone" icon={IC.pin} required>
                                <input value={f.city} onChange={e => set("city", e.target.value)} style={iBase} onFocus={oF} onBlur={oB} />
                            </F>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <F label="Email Address" icon={IC.mail} required>
                                    <input type="email" value={f.email} onChange={e => set("email", e.target.value)} style={iBase} onFocus={oF} onBlur={oB} />
                                </F>
                                <F label="Phone Number" icon={IC.phone} required>
                                    <input type="text" maxLength={10} value={f.phone} onChange={e => set("phone", e.target.value.replace(/\D/g, ""))} style={iBase} onFocus={oF} onBlur={oB} />
                                </F>
                            </div>
                        </div>
                    ) : (
                        /* ================== VIEW MODE ================== */
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div style={{ gridColumn: "span 2", padding: "14px 16px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB" }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Base City / Operating Zone</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
                                    <Ico d={IC.pin} s={15} c="#2563EB" /> {f.city || "Unassigned"}
                                </div>
                            </div>
                            <div style={{ padding: "14px 16px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB" }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Contact Email</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 6, wordBreak: "break-all" }}>
                                    <Ico d={IC.mail} s={14} c="#2563EB" /> {f.email}
                                </div>
                            </div>
                            <div style={{ padding: "14px 16px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB" }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Phone Number</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
                                    <Ico d={IC.phone} s={14} c="#2563EB" /> {f.phone}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Performance Metrics (Always visible) */}
                    {!isEditing ? (
                        <div style={{ padding: "16px 20px", background: "#FFFFFF", borderRadius: 12, border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Performance Metrics</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, textAlign: "center" }}>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: "#2563EB" }}>{agent.deliveries}</div>
                                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2, fontWeight: 500 }}>Today</div>
                                </div>
                                <div style={{ borderLeft: "1px solid #F1F5F9", borderRight: "1px solid #F1F5F9" }}>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{agent.completed}</div>
                                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2, fontWeight: 500 }}>Total Lifetime</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: "#10B981" }}>{agent.rate}</div>
                                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2, fontWeight: 500 }}>Success Rate</div>
                                </div>
                            </div>
                        </div>
                    ): null
                }

                </div>

                {/* ─── Bottom Footer Actions ─────────────────────────────────── */}
                <div style={{ padding: "16px 28px", borderTop: "1px solid #E5E7EB", background: "#F9FAFB", display: "flex", justifyContent: "flex-end", gap: 12 }}>
                    {isEditing ? (
                        <>
                            <button onClick={() => { setIsEditing(false); setF({ name: agent.name, email: agent.email, phone: agent.phone, city: agent.city || agent.zone }); setApiErr(null); }} disabled={loading}
                                className="bg-red-800"
                                style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #D1D5DB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={loading}
                                style={{ padding: "10px 24px", borderRadius: 8, background: loading ? "#93C5FD" : "#2563EB", border: "1px solid transparent", color: "#FFFFFF", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, minWidth: 140, justifyContent: "center", transition: "all 0.2s", boxShadow: loading ? "none" : "0 2px 4px rgba(37,99,235,0.2)" }}>
                                {loading ? "Saving..." : <><Ico d={IC.check} s={14} c="white" /> Save Changes</>}
                            </button>
                        </>
                    ) : (
                        <>  </>
                    )}
                </div>

            </div>
        </Modal>
    );
}