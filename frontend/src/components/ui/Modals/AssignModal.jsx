import { useState, useEffect } from "react";
import Modal from "../Modal";
import { getAgents, assignAgent } from "../../../utils/adminAPI";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, s = 14, c = "currentColor", f = "none", w = 1.8 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={f} stroke={c}
        strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const IC = {
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    pkg: "M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z M12 22V9 M22 8.5L12 15 2 8.5",
    alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
    check: "M20 6L9 17l-5-5",
    link: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
    info: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 8v4 M12 16h.01",
};

// ─── Field Wrapper & Input Styles ─────────────────────────────────────────────
const F = ({ label, icon, error, required, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: error ? "#DC2626" : "#374151", display: "flex", alignItems: "center", gap: 4 }}>
            {icon && <Ico d={icon} s={12} c={error ? "#DC2626" : "#6B7280"} />}
            {label}{required && <span style={{ color: "#DC2626", marginLeft: 2 }}>*</span>}
        </label>
        {children}
        {error && <span style={{ fontSize: 11, color: "#DC2626", display: "flex", alignItems: "center", gap: 4 }}><Ico d={IC.alert} s={11} c="#DC2626" />{error}</span>}
    </div>
);

const sBase = (err) => ({
    width: "100%", background: err ? "#FEF2F2" : "#FFFFFF",
    border: `1px solid ${err ? "#FCA5A5" : "#D1D5DB"}`,
    borderRadius: 8, padding: "9px 12px", color: "#111827",
    fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s ease", boxSizing: "border-box", cursor: "pointer",
    appearance: "none", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)"
});

const oF = e => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; };
const oB = e => { e.target.style.borderColor = "#D1D5DB"; e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.03)"; };

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export function AssignModal({ shipments, onClose }) {
    console.log("SHIPMENTS PROP RECEIVED:", shipments);
    const [selS, setSelS] = useState("");
    const [selA, setSelA] = useState("");

    const [agents, setAgents] = useState([]);
    const [isLoadingAgents, setIsLoadingAgents] = useState(true);

    const [errs, setErrs] = useState({});
    const [apiErr, setApiErr] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Fetch agents on mount
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await getAgents();
                // Filter for active agents and parse their ID (e.g., "AGT-005" -> 5)
                const activeAgents = res.agents
                    .filter(a => a.status === "Active")
                    .map(a => ({
                        ...a,
                        numericId: parseInt(a.agent_id.split("-")[1], 10)
                    }));
                setAgents(activeAgents);
            } catch (error) {
                console.error("Failed to load agents", error);
            } finally {
                setIsLoadingAgents(false);
            }
        };
        fetchAgents();
    }, []);

    const submit = async () => {
        const e = {};
        if (!selS) e.shipment = "Please select a shipment";
        if (!selA) e.agent = "Please select an agent";
        if (Object.keys(e).length) { setErrs(e); return; }

        // 🚨 THE TRIPWIRE: Explicitly check what React is trying to send
        const parsedShipmentId = parseInt(selS, 10);
        const parsedAgentId = parseInt(selA, 10);

        if (isNaN(parsedShipmentId)) {
            setApiErr("DATA ERROR: React is still not receiving the integer 'id' from FastAPI. Please hard-refresh your browser and restart the Python server.");
            return; // Stop the API call from firing
        }

        setSubmitting(true);
        setApiErr(null);

        try {
            // Safely send the parsed integers
            await assignAgent(parsedShipmentId, parsedAgentId);
            setSuccess(true);
        } catch (err) {
            // ... (keep your existing catch block here) ...
            const detail = err?.response?.data?.detail;

            // Crash-proof Pydantic error parsing
            if (Array.isArray(detail)) {
                const formattedErrors = detail.map(errObj =>
                    `${errObj.loc.at(-1)}: ${errObj.msg}`
                ).join(" | ");
                setApiErr(`Validation failed: ${formattedErrors}`);
            } else if (typeof detail === "string") {
                setApiErr(detail);
            } else {
                setApiErr(err?.message || "Failed to assign shipment");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Success Screen ────────────────────────────────────────────────────────
    if (success) return (
        <Modal onClose={onClose} width={420}>
            <style>{`@keyframes popIn{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
            <div style={{ padding: "32px 28px", fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", borderRadius: 16 }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#D1FAE5", border: "4px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "popIn .4s cubic-bezier(.175,.885,.32,1.275)" }}>
                        <Ico d={IC.check} s={32} c="#059669" w={2.5} />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 6, letterSpacing: "-0.3px" }}>Assignment Complete!</div>
                    <div style={{ fontSize: 13, color: "#6B7280" }}>The delivery agent has been notified.</div>
                </div>

                <button onClick={() => { onClose(); window.location.reload(); }}
                    style={{ width: "100%", padding: "12px", borderRadius: 8, background: "#2563EB", border: "1px solid #1D4ED8", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                    Done
                </button>
            </div>
        </Modal>
    );

    // ─── Main Form ─────────────────────────────────────────────────────────────
    return (
        <Modal onClose={onClose} width={460}>
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
                @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                .chevron-select { position: relative; }
                .chevron-select::after {
                    content: ""; position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
                    width: 10px; height: 10px; pointer-events: none;
                    background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%236B7280" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6"></path></svg>');
                    background-repeat: no-repeat; background-position: center;
                }
            `}</style>

            <div style={{ background: "#FFFFFF", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>

                {/* Header */}
                <div style={{ padding: "24px 28px 20px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" }}>
                            <Ico d={IC.link} s={20} c="#FFFFFF" />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", letterSpacing: "-0.3px", marginBottom: 2 }}>Assign Agent</div>
                            <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Mono', monospace", letterSpacing: "0.5px" }}>DISPATCH MANAGEMENT</div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "#FFFFFF", border: "1px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                        <Ico d="M18 6L6 18 M6 6l12 12" s={14} c="#6B7280" />
                    </button>
                </div>

                {/* Form Body */}
                <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

                    {apiErr && (
                        <div style={{ display: "flex", gap: 10, padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, animation: "fadeUp .2s ease" }}>
                            <Ico d={IC.alert} s={16} c="#DC2626" />
                            <span style={{ fontSize: 13, color: "#DC2626", lineHeight: 1.5, fontWeight: 500 }}>{apiErr}</span>
                        </div>
                    )}

                    <F label="Pending Shipment" icon={IC.pkg} required error={errs.shipment}>
                        <div className="chevron-select">
                            <select
                                value={selS}
                                onChange={e => { setSelS(e.target.value); setErrs(p => ({ ...p, shipment: null })); }}
                                style={sBase(errs.shipment)} onFocus={oF} onBlur={oB}
                            >
                                <option value="">Select a shipment...</option>
                                {/* Filter out delivered/assigned based on your frontend data structure */}
                                {shipments?.filter(s => s.status === "CREATED" || s.status === "Pending").map(s => (
                                    <option key={s.tracking_id} value={s.db_id}>
                                        {s.tracking_id} — {s.origin} → {s.destination || s.dest}
                                    </option>))}
                            </select>
                        </div>
                    </F>

                    <F label="Available Delivery Agent" icon={IC.user} required error={errs.agent}>
                        <div className="chevron-select">
                            <select
                                value={selA}
                                onChange={e => { setSelA(e.target.value); setErrs(p => ({ ...p, agent: null })); }}
                                style={sBase(errs.agent)} onFocus={oF} onBlur={oB}
                                disabled={isLoadingAgents}
                            >
                                <option value="">{isLoadingAgents ? "Loading agents..." : "Select an agent..."}</option>
                                {agents.map(a => (
                                    <option key={a.numericId} value={a.numericId}>
                                        {a.name} ({a.city})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </F>

                    <div style={{ padding: "12px 16px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 12, color: "#6B7280", lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <Ico d={IC.info} s={16} c="#9CA3AF" />
                        <span>
                            Assigning an agent will instantly update the shipment status to <strong style={{ color: "#374151" }}>ASSIGNED</strong> and notify the client.
                        </span>
                    </div>

                </div>

                {/* Footer */}
                <div style={{ padding: "20px 28px", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "flex-end", background: "#F9FAFB" }}>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={onClose} disabled={submitting}
                            style={{ padding: "10px 20px", borderRadius: 8, background: "#FFFFFF", border: "1px solid #D1D5DB", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                            Cancel
                        </button>
                        <button onClick={submit} disabled={submitting}
                            style={{ padding: "10px 24px", borderRadius: 8, background: submitting ? "#93C5FD" : "#2563EB", border: "1px solid transparent", color: "#FFFFFF", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, minWidth: 140, justifyContent: "center", boxShadow: submitting ? "none" : "0 4px 6px -1px rgba(37, 99, 235, 0.2)", transition: "all 0.2s" }}>
                            {submitting ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" style={{ animation: "spin .7s linear infinite" }}>
                                        <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                                    </svg>
                                    Assigning...
                                </>
                            ) : (
                                <><Ico d={IC.check} s={15} c="white" /> Confirm</>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </Modal>
    );
}