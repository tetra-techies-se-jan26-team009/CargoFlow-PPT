import { BTN_PRI } from "../modalStyle";
import Modal , {ModalHeader} from "../Modal"






export function AlertModal({ alert, onClose }) {
    const details = {
        warning: { action: "Reroute affected shipments via NH-48. Estimated ETA impact: +35 mins.", col: "#92400E", bg: "#FFFBEB" },
        info: { action: "3 shipments affected. Notify clients and adjust ETAs by 2–4 hours.", col: "#1D4ED8", bg: "#EFF6FF" },
        danger: { action: "Send payment reminders to BlueStar Exports, Sunrise Co., and Metro Supplies.", col: "#991B1B", bg: "#FFF5F5" },
    };
    const d = details[alert.type] || details.info;
    return (
        <Modal onClose={onClose} width={420}>
            <ModalHeader title="Risk Alert" onClose={onClose} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 24 }}>{alert.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{alert.label}</span>
            </div>
            <div style={{ padding: "14px 16px", background: d.bg, borderRadius: 12, marginBottom: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: d.col, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5 }}>Recommended Action</div>
                <p style={{ margin: 0, fontSize: 13, color: "#334155", lineHeight: 1.65 }}>{d.action}</p>
            </div>
            <button onClick={onClose} style={{ ...BTN_PRI, width: "100%", flex: "none", textAlign: "center" }}>
                Acknowledge & Close
            </button>
        </Modal>
    );
}