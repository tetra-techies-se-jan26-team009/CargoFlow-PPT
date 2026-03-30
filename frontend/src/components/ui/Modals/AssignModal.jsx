import { useState } from "react";
import { INP,LBL,BTN_PRI,BTN_SEC } from "../modalStyle";
import { agents } from "../../../utils/tempData";
import Modal , {ModalHeader} from "../Modal"



export function AssignModal({ shipments, onClose }) {
    const [selS, setSelS] = useState("");
    const [selA, setSelA] = useState("");
    const [done, setDone] = useState(false);
    const assign = () => {
        if (!selS || !selA) return;
        console.warn("Missing backend API for this action");
    };
    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Assign Shipment to Agent" onClose={onClose} />
            {done ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#059669" }}>Assignment Successful!</div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>{selA} assigned to {selS}</div>
                </div>
            ) : (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                            <span style={LBL}>Select Shipment</span>
                            <select value={selS} onChange={e => setSelS(e.target.value)}
                                style={{ ...INP, cursor: "pointer" }}>
                                <option value="">Choose shipment...</option>
                                {shipments.filter(s => s.status !== "Delivered").map(s =>
                                    <option key={s.id} value={s.id}>{s.id} — {s.origin} → {s.dest}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <span style={LBL}>Select Agent</span>
                            <select value={selA} onChange={e => setSelA(e.target.value)}
                                style={{ ...INP, cursor: "pointer" }}>
                                <option value="">Choose agent...</option>
                                {agents.filter(a => a.status !== "Off").map(a =>
                                    <option key={a.name} value={a.name}>{a.name} ({a.status})</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                        <button onClick={onClose} style={BTN_SEC}>Cancel</button>
                        <button onClick={assign} style={BTN_PRI}>Assign</button>
                    </div>
                </>
            )}
        </Modal>
    );
}