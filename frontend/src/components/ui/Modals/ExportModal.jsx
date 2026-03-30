import { useState } from "react";
import { BTN_PRI, BTN_SEC } from "../modalStyle";
import Modal , {ModalHeader} from "../Modal"




export function ExportModal({ onClose, shipments }) {
    const [fmt, setFmt] = useState("csv");
    const [done, setDone] = useState(false);
    const doExport = () => {
        try {
            if (fmt === "csv") {
                const headers = ["ID", "Client", "Agent", "Origin", "Dest", "Status", "Risk"];
                const rows = shipments.map(s => [s.id, s.client, s.agent, s.origin, s.dest, s.status, s.risk]);
                const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "shipments.csv";
                a.click();
                URL.revokeObjectURL(a.href);
            } else if (fmt === "json") {
                const json = JSON.stringify(shipments, null, 2);
                const blob = new Blob([json], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "shipments.json";
                a.click();
                URL.revokeObjectURL(a.href);
            }
            setDone(true);
            setTimeout(onClose, 1400);
        } catch (err) {
            console.error("Export Failed", err);
        }
    };
    return (
        <Modal onClose={onClose} width={380}>
            <ModalHeader title="Export Report" onClose={onClose} />
            {done ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>Exported successfully!</div>
                </div>
            ) : (
                <>
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Format</div>
                        <div style={{ display: "flex", gap: 8 }}>
                            {["csv", "json"].map(f => (
                                <button key={f} onClick={() => setFmt(f)}
                                    style={{ flex: 1, padding: "9px", borderRadius: 9, border: "1.5px solid", borderColor: fmt === f ? "#2563EB" : "#E2E8F0", background: fmt === f ? "#EFF6FF" : "white", color: fmt === f ? "#1D4ED8" : "#64748B", fontSize: 12, fontWeight: fmt === f ? 700 : 400, cursor: "pointer", textTransform: "uppercase" }}>
                                    .{f}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#64748B" }}>
                        {shipments.length} shipments will be exported
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={onClose} style={BTN_SEC}>Cancel</button>
                        <button onClick={doExport} style={BTN_PRI}>Export</button>
                    </div>
                </>
            )}
        </Modal>
    );
}