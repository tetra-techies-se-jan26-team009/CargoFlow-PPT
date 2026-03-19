
export const NotifPanel = ({ notifs, setNotifs, onTrack, onClose, showToast }) => (
  <div style={{
    position: "fixed", top: 70, right: 24, zIndex: 200,
    background: "white", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,.14)",
    padding: 16, width: 290, border: "1px solid #E8EEF6",
    animation: "slideDown .18s ease",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 4px" }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Notifications</span>
      <button onClick={() => { setNotifs(n => n.map(x => ({ ...x, unread: false }))); showToast("All notifications marked as read", "✓"); }}
        style={{ fontSize: 11, color: "#2563EB", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit" }}>
        Mark all read
      </button>
    </div>
    {notifs.map(n => (
      <div key={n.id} onClick={() => { onClose(); if (n.id === 1) onTrack("V1-20250301"); }}
        style={{ display: "flex", gap: 10, padding: "10px 6px", borderBottom: "1px solid #F1F5F9", cursor: "pointer", borderRadius: 8 }}
        onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: n.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>{n.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, color: "#334155", fontWeight: 500, lineHeight: 1.4 }}>{n.msg}</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{n.time}</div>
        </div>
        {n.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563EB", flexShrink: 0, marginTop: 4 }} />}
      </div>
    ))}
  </div>
);