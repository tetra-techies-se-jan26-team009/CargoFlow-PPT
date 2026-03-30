import { useState } from "react";
import { BTN_PRI, BTN_SEC } from "../modalStyle";
import { agents } from "../../../utils/tempData";
import Modal , {ModalHeader} from "../Modal"





export function ReportModal({ onClose, shipments }) {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const gen = () => { console.warn("Missing backend API for this action"); };
    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Generate Monthly Report" onClose={onClose} />
            {done ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#059669", marginBottom: 6 }}>Report Ready!</div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 18 }}>CargoFlow_Report_March2026.pdf</div>
                    <button style={{ ...BTN_PRI, flex: "none", padding: "10px 28px" }}>⬇ Download PDF</button>
                </div>
            ) : (
                <>
                    <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px", marginBottom: 18 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>Preview — March 2026</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {[
                                ["Total Shipments", shipments.length],
                                ["Delivered", shipments.filter(s => s.status === "Delivered").length],
                                ["Delayed", shipments.filter(s => s.status === "Delayed").length],
                                ["On-Time Rate", "96.4%"],
                                ["Active Agents", agents.length],
                                ["Clients", "67"],
                            ].map(([k, v]) => (
                                <div key={k} style={{ padding: "8px 10px", background: "white", borderRadius: 8, border: "1px solid #F1F5F9" }}>
                                    <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{k}</div>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={onClose} style={BTN_SEC}>Cancel</button>
                        <button onClick={gen} disabled={loading} style={{ ...BTN_PRI, opacity: loading ? 0.7 : 1 }}>
                            {loading ? "Generating…" : "Generate Report"}
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
}