import { BTN_PRI, } from "../modalStyle";
import { statusMeta } from "../../../utils/tempData";
import Modal , {ModalHeader} from "../Modal"



export function ShipmentDetailModal({ s, onClose }) {
    return (
        <Modal onClose={onClose}>
            <ModalHeader title={s.id} subtitle={`${s.origin} → ${s.dest}`} onClose={onClose} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
                {[["Client", s.client], ["Agent", s.agent], ["Origin", s.origin],
                ["Destination", s.dest], ["ETA", s.eta]].map(([k, v]) => (
                    <div key={k} style={{ background: "#F8FAFC", borderRadius: 10, padding: "12px 14px", border: "1px solid #F1F5F9" }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{k}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{v}</div>
                    </div>
                ))}
                <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "12px 14px", border: "1px solid #F1F5F9" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Status</div>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: statusMeta[s.status]?.bg, color: statusMeta[s.status]?.color }}>{s.status}</span>
                </div>
            </div>
            <button onClick={onClose} style={{ ...BTN_PRI, width: "100%", flex: "none", textAlign: "center" }}>Close</button>
        </Modal>
    );
}

