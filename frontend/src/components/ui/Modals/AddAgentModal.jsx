import { useState } from "react";
import { LBL, INP } from "../modalStyle";
import { BTN_PRI, BTN_SEC } from "../modalStyle";
import Modal, { ModalHeader } from "../Modal";

export function AddAgentModal({ onClose }) {
  const [f, setF] = useState({
    name: "",
    phone: "",
    city: "",
    vehicle: "",
  });

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!f.name) return;
    setDone(true);
    setTimeout(onClose, 1500);
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Add New Agent" onClose={onClose} />

      {done ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🚚</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#059669" }}>
            Agent Added!
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>
            {f.name}
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            
            <div>
              <span style={LBL}>Agent Name *</span>
              <input
                value={f.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Ravi Kumar"
                style={INP}
                onFocus={(e) => (e.target.style.borderColor = "#93C5FD")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
            </div>

            <div>
              <span style={LBL}>Phone Number</span>
              <input
                value={f.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                style={INP}
                onFocus={(e) => (e.target.style.borderColor = "#93C5FD")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              
              <div>
                <span style={LBL}>City</span>
                <input
                  value={f.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="e.g. Chennai"
                  style={INP}
                  onFocus={(e) => (e.target.style.borderColor = "#93C5FD")}
                  onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                />
              </div>

              <div>
                <span style={LBL}>Vehicle Type</span>
                <select
                  value={f.vehicle}
                  onChange={(e) => set("vehicle", e.target.value)}
                  style={{ ...INP, cursor: "pointer" }}
                >
                  <option value="">Select vehicle</option>
                  <option>Bike</option>
                  <option>Van</option>
                  <option>Mini Truck</option>
                  <option>Truck</option>
                </select>
              </div>

            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={onClose} style={BTN_SEC}>
              Cancel
            </button>
            <button onClick={submit} style={BTN_PRI}>
              Add Agent
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}