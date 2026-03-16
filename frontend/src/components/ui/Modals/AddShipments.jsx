import { useState } from "react";
import { BTN_PRI,BTN_SEC,LBL,INP } from "../modalStyle";
import { agents } from "../../../utils/tempData";
import Modal , {ModalHeader} from "../Modal"


export default function AddShipmentModal({ onClose, onAdd }) {
    const [f, setF] = useState({ client: "", agent: "", origin: "", dest: "", status: "Pending", risk: "Low" });
    const set = (k, v) => setF(p => ({ ...p, [k]: v }));
    const submit = () => {
        if (!f.client || !f.origin || !f.dest) return;
        onAdd({ ...f, id: "V1-" + Date.now().toString().slice(-8), eta: "TBD" });
        onClose();
    };
    return (
        <Modal onClose={onClose} width={500}>
            <ModalHeader title="Add New Shipment" onClose={onClose} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <span style={LBL}>Client Name *</span>
                        <input value={f.client} onChange={e => set("client", e.target.value)}
                            placeholder="e.g. Apex Traders" style={INP}
                            onFocus={e => e.target.style.borderColor = "#93C5FD"}
                            onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                    </div>
                    <div>
                        <span style={LBL}>Assign Agent</span>
                        <select value={f.agent} onChange={e => set("agent", e.target.value)}
                            style={{ ...INP, cursor: "pointer" }}>
                            <option value="">Select agent</option>
                            {agents.map(a => <option key={a.name}>{a.name}</option>)}
                        </select>
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <span style={LBL}>Origin *</span>
                        <input value={f.origin} onChange={e => set("origin", e.target.value)}
                            placeholder="e.g. Chennai" style={INP}
                            onFocus={e => e.target.style.borderColor = "#93C5FD"}
                            onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                    </div>
                    <div>
                        <span style={LBL}>Destination *</span>
                        <input value={f.dest} onChange={e => set("dest", e.target.value)}
                            placeholder="e.g. Mumbai" style={INP}
                            onFocus={e => e.target.style.borderColor = "#93C5FD"}
                            onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <span style={LBL}>Status</span>
                        <select value={f.status} onChange={e => set("status", e.target.value)}
                            style={{ ...INP, cursor: "pointer" }}>
                            {["Pending", "In Transit", "Delivered", "Delayed"].map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <span style={LBL}>Risk</span>
                        <select value={f.risk} onChange={e => set("risk", e.target.value)}
                            style={{ ...INP, cursor: "pointer" }}>
                            {["Low", "Medium", "High"].map(r => <option key={r}>{r}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={onClose} style={BTN_SEC}>Cancel</button>
                <button onClick={submit} style={BTN_PRI}>+ Add Shipment</button>
            </div>
        </Modal>
    );
}
