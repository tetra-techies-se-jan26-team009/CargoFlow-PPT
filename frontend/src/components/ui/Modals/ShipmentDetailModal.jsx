import Modal from "../Modal";
import { statusMeta } from "../../../utils/tempData";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, s = 14, c = "currentColor", f = "none", w = 1.8 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={f} stroke={c}
        strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const IC = {
    pkg:   "M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z M12 22V9 M22 8.5L12 15 2 8.5",
    user:  "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    agent: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    clock: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
    close: "M18 6L6 18 M6 6l12 12",
};

export function ShipmentDetailModal({ s, onClose }) {
    // Fallback for status styling if statusMeta is missing the specific status
    const badgeBg = statusMeta[s.status]?.bg || "#F3F4F6";
    const badgeColor = statusMeta[s.status]?.color || "#4B5563";
    const badgeBorder = statusMeta[s.status]?.border || "#E5E7EB"; // Assuming you might have borders in your meta

    return (
        <Modal onClose={onClose} width={520}>
            <style>{`
                @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
            `}</style>
            
            <div style={{ background: "#FFFFFF", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", animation: "slideUp 0.2s ease-out" }}>
                
                {/* ── Header: Tracking ID & Status ─────────────────────────── */}
                <div style={{ padding: "24px 28px 20px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FFFFFF", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                            <Ico d={IC.pkg} s={22} c="#2563EB" />
                        </div>
                        <div>
                            <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Tracking Number</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", fontFamily: "'DM Mono', monospace", letterSpacing: "-0.5px" }}>{s.id || s.tracking_id}</div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "#FFFFFF", border: "1px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                        <Ico d={IC.close} s={14} c="#6B7280" />
                    </button>
                </div>

                {/* ── Route Visualizer ─────────────────────────────────────── */}
                <div style={{ padding: "24px 28px", borderBottom: "1px solid #E5E7EB" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Origin</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{s.origin || "—"}</div>
                        </div>
                        
                        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "0 10px" }}>
                            <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "#E5E7EB", borderRadius: 1 }} />
                            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", background: "#FFFFFF", padding: "0 8px", zIndex: 1 }}>
                                <span style={{ fontSize: 18 }}></span>
                            </div>
                        </div>

                        <div style={{ flex: 1, textAlign: "right" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Destination</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{s.destination || s.dest || "—"}</div>
                        </div>
                    </div>
                    
                    {/* Status Badge centered below route */}
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor, fontSize: 12, fontWeight: 700, letterSpacing: "0.5px" }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: badgeColor }} />
                            {s.status}
                        </div>
                    </div>
                </div>

                {/* ── Details Grid ─────────────────────────────────────────── */}
                <div style={{ padding: "24px 0px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, background: "#FAFAFA" }}>
                    
                    <div style={{ padding: "14px 16px", background: "#FFFFFF", borderRadius: 10, border: "1px solid #E5E7EB", display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Ico d={IC.user} s={16} c="#2563EB" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Client / Sender</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.client || "—"}</div>
                        </div>
                    </div>

                    <div style={{ padding: "14px 16px", background: "#FFFFFF", borderRadius: 10, border: "1px solid #E5E7EB", display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Ico d={IC.agent} s={16} c="#0284C7" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Assigned Agent</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: s.agent === "Unassigned" ? "#9CA3AF" : "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.agent || "Unassigned"}</div>
                        </div>
                    </div>

                    <div style={{ gridColumn: "span 2", padding: "14px 16px", background: "#FFFFFF", borderRadius: 10, border: "1px solid #E5E7EB", display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Ico d={IC.clock} s={16} c="#D97706" />
                        </div>
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Estimated Time of Arrival (ETA)</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                                {s.eta ? new Date(s.eta).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Pending routing"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Footer ───────────────────────────────────────────────── */}
                <div style={{ padding: "16px ", borderTop: "1px solid #E5E7EB", background: "#FFFFFF", display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={onClose} 
                        style={{ padding: "10px 28px", borderRadius: 8, background: "#2563EB", border: "none", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 4px rgba(37,99,235,0.2)" }}>
                        Close
                    </button>
                </div>

            </div>
        </Modal>
    );
}