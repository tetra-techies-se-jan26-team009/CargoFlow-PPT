
export const FormGroup = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: ".5px" }}>{label}</label>
    {children}
  </div>
);

export const BtnPrimary = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    background: "linear-gradient(135deg,#1D4ED8,#2563EB)", color: "white", border: "none",
    borderRadius: 10, padding: "11px 22px", fontSize: 13.5, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit", width: "100%", ...style,
  }}>{children}</button>
);

export const BtnSecondary = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    background: "#F1F5F9", color: "#334155", border: "none", borderRadius: 10,
    padding: "11px 22px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  }}>{children}</button>
);

export const ModalActions = ({ children }) => (
  <div style={{ display: "flex", gap: 10, marginTop: 20 }}>{children}</div>
);
