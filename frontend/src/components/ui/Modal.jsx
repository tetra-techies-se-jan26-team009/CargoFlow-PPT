export default function Modal({ onClose, width = 460, children }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{
        background: "white", borderRadius: 16, padding: "28px 32px",
        width, maxHeight: "88vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "1px solid #F1F5F9",
      }}>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{title}</h3>
        {subtitle && <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94A3B8" }}>{subtitle}</p>}
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
        ✕
      </button>
    </div>
  );
}