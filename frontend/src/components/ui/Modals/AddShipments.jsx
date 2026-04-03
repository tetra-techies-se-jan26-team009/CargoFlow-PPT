import { useState } from "react";
import { BTN_PRI,BTN_SEC,LBL,INP } from "../modalStyle";
// import { agents } from "../../../utils/tempData";
import Modal , {ModalHeader} from "../Modal";
import { createShipment } from "../../../utils/adminAPI";


export default function AddShipmentModal({ onClose }) {
    const [f, setF] = useState({
        receiver_name: "", receiver_phone: "", receiver_email: "",
        pickup_line1: "", pickup_city: "", pickup_state: "", pickup_pincode: "",
        delivery_line1: "", delivery_city: "", delivery_state: "", delivery_pincode: "",
        weight: "", price: ""
    });
    const set = (k, v) => setF(p => ({ ...p, [k]: v }));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submit = async () => {
        if (!f.receiver_name || !f.pickup_city || !f.delivery_city) {
            setError("Receiver name, origin city, and dest city are required.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await createShipment({
                ...f,
                weight: parseFloat(f.weight) || 1.0,
                price: parseFloat(f.price) || 100.0
            });
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 500);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Failed to create shipment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal onClose={onClose} width={700}>
            <ModalHeader title="Create New Shipment" onClose={onClose} />
            <hr />
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: "65vh", overflowY: "auto", paddingRight: 8 }}>
                {error && (
                    <div style={{ padding: "8px 12px", background: "#FEF2F2", color: "#991B1B", fontSize: 13, borderRadius: 6, border: "1px solid #FCA5A5" }}>
                        {error}
                    </div>
                )}
                
                {/* Receiver Info */}
                <div className="mt-6" style={{ fontWeight: 600, fontSize: 14, color: "#334155", marginTop: 5 }}>Receiver Details</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div>
                        <span style={LBL}>Name *</span>
                        <input value={f.receiver_name} onChange={e => set("receiver_name", e.target.value)} style={INP} />
                    </div>
                    <div>
                        <span style={LBL}>Email</span>
                        <input value={f.receiver_email} type="email" onChange={e => set("receiver_email", e.target.value)} style={INP} />
                    </div>
                    <div>
                        <span style={LBL}>Phone</span>
                        <input value={f.receiver_phone} onChange={e => set("receiver_phone", e.target.value)} style={INP} />
                    </div>
                </div>

                {/* Pickup Address */}
                <div style={{ fontWeight: 600, fontSize: 14, color: "#334155", marginTop: 10 }}>Pickup Address</div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12 }}>
                    <div><span style={LBL}>Line 1</span><input value={f.pickup_line1} onChange={e => set("pickup_line1", e.target.value)} style={INP} /></div>
                    <div><span style={LBL}>City *</span><input value={f.pickup_city} onChange={e => set("pickup_city", e.target.value)} style={INP} /></div>
                    <div><span style={LBL}>State</span><input value={f.pickup_state} onChange={e => set("pickup_state", e.target.value)} style={INP} /></div>
                    <div><span style={LBL}>PIN</span><input value={f.pickup_pincode} onChange={e => set("pickup_pincode", e.target.value)} style={INP} /></div>
                </div>

                {/* Delivery Address */}
                <div style={{ fontWeight: 600, fontSize: 14, color: "#334155", marginTop: 10 }}>Delivery Address</div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12 }}>
                    <div><span style={LBL}>Line 1</span><input value={f.delivery_line1} onChange={e => set("delivery_line1", e.target.value)} style={INP} /></div>
                    <div><span style={LBL}>City *</span><input value={f.delivery_city} onChange={e => set("delivery_city", e.target.value)} style={INP} /></div>
                    <div><span style={LBL}>State</span><input value={f.delivery_state} onChange={e => set("delivery_state", e.target.value)} style={INP} /></div>
                    <div><span style={LBL}>PIN</span><input value={f.delivery_pincode} onChange={e => set("delivery_pincode", e.target.value)} style={INP} /></div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
                    <div>
                        <span style={LBL}>Weight (kg)</span>
                        <input type="number" value={f.weight} onChange={e => set("weight", e.target.value)} style={INP} />
                    </div>
                    <div>
                        <span style={LBL}>Price (₹)</span>
                        <input type="number" value={f.price} onChange={e => set("price", e.target.value)} style={INP} />
                    </div>
                </div>
            </div>
            
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={onClose} style={BTN_SEC} disabled={loading}>Cancel</button>
                <button onClick={submit} style={{...BTN_PRI, opacity: loading ? 0.6 : 1}} disabled={loading}>
                    {loading ? "Creating..." : "+ Add Shipment"}
                </button>
            </div>
        </Modal>
    );
}
