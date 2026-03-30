import { useState } from "react";
import { LBL, INP } from "../modalStyle";
import { BTN_PRI, BTN_SEC } from "../modalStyle";
import Modal , {ModalHeader} from "../Modal"
import { createClient } from "../../../utils/adminAPI";



export function AddClientModal({ onClose }) {
    const [f, setF] = useState({ name: "", email: "", phone: "", city: "" });
    const set = (k, v) => setF(p => ({ ...p, [k]: v }));
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submit = async () => {
        if (!f.name || !f.email) {
            setError("Name and Email are required");
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            await createClient({
                name: f.name,
                email: f.email,
                phone: f.phone || "0000000000",
                city: f.city || "Unknown",
                password: "password123" // Auto-generated default password 
            });
            setDone(true);
            setTimeout(() => {
                onClose();
                window.location.reload(); // Re-fetch data
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Failed to add client");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Add New Client" onClose={onClose} />
            {done ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#059669" }}>Client Added!</div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>{f.name}</div>
                </div>
            ) : (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {error && (
                            <div style={{ padding: "8px 12px", background: "#FEF2F2", color: "#991B1B", fontSize: 13, borderRadius: 6, border: "1px solid #FCA5A5" }}>
                                {error}
                            </div>
                        )}
                        <div>
                            <span style={LBL}>Business Name *</span>
                            <input value={f.name} onChange={e => set("name", e.target.value)}
                                placeholder="e.g. Apex Traders" style={INP}
                                onFocus={e => e.target.style.borderColor = "#93C5FD"}
                                onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                        </div>
                        <div>
                            <span style={LBL}>Email *</span>
                            <input value={f.email} onChange={e => set("email", e.target.value)}
                                placeholder="client@company.com" style={INP} type="email"
                                onFocus={e => e.target.style.borderColor = "#93C5FD"}
                                onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <span style={LBL}>Phone</span>
                                <input value={f.phone} onChange={e => set("phone", e.target.value)}
                                    placeholder="+91 XXXXX XXXXX" style={INP}
                                    onFocus={e => e.target.style.borderColor = "#93C5FD"}
                                    onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                            </div>
                            <div>
                                <span style={LBL}>City</span>
                                <input value={f.city} onChange={e => set("city", e.target.value)}
                                    placeholder="Chennai" style={INP}
                                    onFocus={e => e.target.style.borderColor = "#93C5FD"}
                                    onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                        <button onClick={onClose} style={BTN_SEC} disabled={loading}>Cancel</button>
                        <button onClick={submit} style={{...BTN_PRI, opacity: loading ? 0.6 : 1}} disabled={loading}>
                            {loading ? "Adding..." : "Add Client"}
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
}
