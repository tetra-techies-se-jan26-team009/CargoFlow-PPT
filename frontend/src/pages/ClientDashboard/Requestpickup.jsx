import { useState } from "react";
import ClientNavbar from "../../components/ClientNavbar";

const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const icons = {
    pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
    package: "M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z M12 22V9 M22 8.5L12 15 2 8.5",
    clock: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
    check: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
    arrow: "M5 12h14 M12 5l7 7-7 7",
    info: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 8v4 M12 16h.01",
};

const STEPS = [
    { label: "Locations", icon: icons.pin },
    { label: "Package Info", icon: icons.package },
    { label: "Schedule", icon: icons.clock },
    { label: "Confirm", icon: icons.check },
];

const CITIES = ["Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Kolkata", "Kochi", "Ahmedabad", "Jaipur"];

const inputStyle = {
    width: "100%", background: "white", border: "1px solid #E2E8F0", borderRadius: 10,
    padding: "11px 14px", color: "#334155", fontSize: 13, outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "'DM Sans','Segoe UI',sans-serif",
};

const selectStyle = { ...inputStyle, cursor: "pointer", appearance: "none", background: "white" };

const labelStyle = {
    fontSize: 11, fontWeight: 600, color: "#64748B", letterSpacing: "0.5px",
    textTransform: "uppercase", display: "block", marginBottom: 6,
};

function Field({ label, hint, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={labelStyle}>{label}</span>
            {children}
            {hint && <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{hint}</span>}
        </div>
    );
}

export default function RequestPickup() {
    const [step, setStep] = useState(0);
    const [done, setDone] = useState(false);
    const [tid] = useState(() => "V1-" + Math.floor(Math.random() * 90000 + 10000));
    const [f, setF] = useState({
        fromCity: "", fromAddr: "", toCity: "", toAddr: "",
        name: "", phone: "",
        weight: "", category: "", desc: "", fragile: false,
        date: "", slot: "", priority: "Standard",
    });
    const set = (k, v) => setF(p => ({ ...p, [k]: v }));

    if (done) return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F8FAFC", color: "#0F172A" }}>
            <ClientNavbar />
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", maxWidth: 440 }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#D1FAE5,#A7F3D0)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 4px 20px rgba(16,185,129,0.2)" }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                    </div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.6px", margin: "0 0 10px" }}>Pickup Confirmed!</h2>
                    <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 6px" }}>Your tracking ID is</p>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#2563EB", letterSpacing: "-0.3px", margin: "0 0 8px", padding: "12px 24px", background: "#EFF6FF", borderRadius: 12, display: "inline-block", border: "1px solid #BFDBFE" }}>{tid}</div>
                    <p style={{ fontSize: 13, color: "#94A3B8", margin: "12px 0 28px" }}>Our agent will call 30 minutes before pickup</p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                        <button onClick={() => setDone(false)}
                            style={{ padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#3B82F6)", border: "none", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
                            New Pickup
                        </button>
                        <button style={{ padding: "11px 20px", borderRadius: 10, background: "white", border: "1px solid #E2E8F0", color: "#334155", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                            View Shipments
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F8FAFC", color: "#0F172A" }}>
            <ClientNavbar />

            <main style={{ flex: 1, overflow: "auto", padding: "28px 100px" }}>
                <div style={{ maxWidth: 680, margin: "0 auto" }}>

                    {/* Header */}
                    <div style={{ marginBottom: 32 }}>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.6px" }}>Request Pickup</h1>
                        <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>Fill in the details to schedule your shipment</p>
                    </div>

                    {/* Stepper */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
                        {STEPS.map((s, i) => (
                            <div key={s.label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: i < step ? "pointer" : "default" }}
                                    onClick={() => i < step && setStep(i)}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: "50%",
                                        background: i < step ? "linear-gradient(135deg,#10B981,#059669)" : i === step ? "linear-gradient(135deg,#2563EB,#3B82F6)" : "white",
                                        border: i > step ? "2px solid #E2E8F0" : "none",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        boxShadow: i === step ? "0 4px 14px rgba(37,99,235,0.3)" : i < step ? "0 2px 8px rgba(16,185,129,0.25)" : "0 1px 4px rgba(0,0,0,0.05)",
                                        flexShrink: 0,
                                    }}>
                                        {i < step
                                            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                                            : <Icon d={s.icon} size={15} stroke={i === step ? "white" : "#CBD5E1"} />}
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: i === step ? 700 : 500, color: i === step ? "#2563EB" : i < step ? "#059669" : "#94A3B8", whiteSpace: "nowrap" }}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div style={{ flex: 1, height: 2, background: i < step ? "#10B981" : "#E2E8F0", margin: "0 16px", borderRadius: 1 }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Panel */}
                    <div style={{ background: "white", borderRadius: 16, padding: "28px 32px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", marginBottom: 16 }}>

                        {/* STEP 0 – Locations */}
                        {step === 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>Pickup & Delivery Locations</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <Field label="Pickup City">
                                        <select value={f.fromCity} onChange={e => set("fromCity", e.target.value)} style={selectStyle}>
                                            <option value="">Select city</option>
                                            {CITIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Delivery City">
                                        <select value={f.toCity} onChange={e => set("toCity", e.target.value)} style={selectStyle}>
                                            <option value="">Select city</option>
                                            {CITIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </Field>
                                </div>
                                <Field label="Pickup Address" hint="Full street address with pincode">
                                    <input value={f.fromAddr} onChange={e => set("fromAddr", e.target.value)} placeholder="e.g. 42, Anna Salai, Chennai – 600002" style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = "#93C5FD"}
                                        onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                                </Field>
                                <Field label="Delivery Address">
                                    <input value={f.toAddr} onChange={e => set("toAddr", e.target.value)} placeholder="e.g. 101, Nariman Point, Mumbai – 400021" style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = "#93C5FD"}
                                        onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                                </Field>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <Field label="Receiver Name">
                                        <input value={f.name} onChange={e => set("name", e.target.value)} placeholder="Receiver's full name" style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = "#93C5FD"}
                                            onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                                    </Field>
                                    <Field label="Receiver Phone">
                                        <input value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = "#93C5FD"}
                                            onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                                    </Field>
                                </div>
                            </div>
                        )}

                        {/* STEP 1 – Package */}
                        {step === 1 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>Package Details</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <Field label="Total Weight (kg)">
                                        <input type="number" value={f.weight} onChange={e => set("weight", e.target.value)} placeholder="e.g. 12" style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = "#93C5FD"}
                                            onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                                    </Field>
                                    <Field label="Category">
                                        <select value={f.category} onChange={e => set("category", e.target.value)} style={selectStyle}>
                                            <option value="">Select category</option>
                                            {["Electronics", "Clothing", "Documents", "Food & Perishables", "Machinery", "Pharmaceuticals", "Other"].map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </Field>
                                </div>
                                <Field label="Description" hint="Brief description of package contents">
                                    <textarea value={f.desc} onChange={e => set("desc", e.target.value)}
                                        placeholder="e.g. 2 boxes of electronic components, securely packed"
                                        rows={3}
                                        style={{ ...inputStyle, resize: "vertical" }}
                                        onFocus={e => e.target.style.borderColor = "#93C5FD"}
                                        onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                                </Field>
                                <div>
                                    <span style={labelStyle}>Fragile Items?</span>
                                    <div style={{ display: "flex", gap: 10 }}>
                                        {[{ v: true, l: "Yes – Handle with care" }, { v: false, l: "No – Standard handling" }].map(o => (
                                            <button key={String(o.v)} onClick={() => set("fragile", o.v)}
                                                style={{ padding: "10px 20px", borderRadius: 10, border: "1.5px solid", borderColor: f.fragile === o.v ? "#2563EB" : "#E2E8F0", background: f.fragile === o.v ? "#EFF6FF" : "white", color: f.fragile === o.v ? "#1D4ED8" : "#64748B", fontSize: 12, fontWeight: f.fragile === o.v ? 600 : 400, cursor: "pointer", transition: "all 0.15s" }}>
                                                {o.l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2 – Schedule */}
                        {step === 2 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>Schedule Pickup</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <Field label="Pickup Date">
                                        <input type="date" value={f.date} onChange={e => set("date", e.target.value)} style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = "#93C5FD"}
                                            onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                                    </Field>
                                    <Field label="Preferred Time Slot">
                                        <select value={f.slot} onChange={e => set("slot", e.target.value)} style={selectStyle}>
                                            <option value="">Select slot</option>
                                            {["9:00 AM – 12:00 PM", "12:00 PM – 3:00 PM", "3:00 PM – 6:00 PM", "6:00 PM – 9:00 PM"].map(t => <option key={t}>{t}</option>)}
                                        </select>
                                    </Field>
                                </div>
                                <div>
                                    <span style={labelStyle}>Shipping Priority</span>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                                        {[
                                            { k: "Standard", desc: "3–5 business days", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
                                            { k: "Express", desc: "1–2 business days", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
                                            { k: "Overnight", desc: "Next-day delivery", color: "#DC2626", bg: "#FFF5F5", border: "#FECACA" },
                                        ].map(p => (
                                            <button key={p.k} onClick={() => set("priority", p.k)}
                                                style={{ padding: "14px", borderRadius: 12, border: "1.5px solid", borderColor: f.priority === p.k ? p.border : "#E2E8F0", background: f.priority === p.k ? p.bg : "white", cursor: "pointer", textAlign: "left", transition: "all 0.18s", boxShadow: f.priority === p.k ? "0 2px 8px rgba(0,0,0,0.06)" : "none" }}>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: f.priority === p.k ? p.color : "#0F172A", marginBottom: 4 }}>{p.k}</div>
                                                <div style={{ fontSize: 11, color: "#94A3B8" }}>{p.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3 – Confirm */}
                        {step === 3 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>Order Summary</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                    {[
                                        { k: "From City", v: f.fromCity || "—" },
                                        { k: "To City", v: f.toCity || "—" },
                                        { k: "Pickup Addr.", v: f.fromAddr || "—" },
                                        { k: "Delivery Addr.", v: f.toAddr || "—" },
                                        { k: "Receiver", v: f.name || "—" },
                                        { k: "Phone", v: f.phone || "—" },
                                        { k: "Weight", v: f.weight ? `${f.weight} kg` : "—" },
                                        { k: "Category", v: f.category || "—" },
                                        { k: "Fragile", v: f.fragile ? "Yes ⚠️" : "No" },
                                        { k: "Date", v: f.date || "—" },
                                        { k: "Time Slot", v: f.slot || "—" },
                                        { k: "Priority", v: f.priority },
                                    ].map(r => (
                                        <div key={r.k} style={{ padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" }}>
                                            <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{r.k}</div>
                                            <div style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{r.v}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ padding: "14px 16px", background: "#EFF6FF", borderRadius: 12, border: "1px solid #BFDBFE", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                    <Icon d={icons.info} size={16} stroke="#2563EB" />
                                    <p style={{ fontSize: 12, color: "#1D4ED8", margin: 0, lineHeight: 1.6 }}>
                                        Our agent will call you 30 minutes before pickup. You'll receive a tracking ID immediately after confirmation.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                            style={{ padding: "11px 22px", borderRadius: 10, background: "white", border: "1px solid #E2E8F0", color: step === 0 ? "#CBD5E1" : "#334155", fontSize: 13, fontWeight: 500, cursor: step === 0 ? "not-allowed" : "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                            ← Back
                        </button>
                        {step < STEPS.length - 1
                            ? <button onClick={() => setStep(s => s + 1)}
                                style={{ padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#3B82F6)", border: "none", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.3)", display: "flex", alignItems: "center", gap: 8 }}>
                                Continue <Icon d={icons.arrow} size={14} stroke="white" />
                            </button>
                            : <button onClick={() => setDone(true)}
                                style={{ padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg,#10B981,#059669)", border: "none", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(16,185,129,0.3)", display: "flex", alignItems: "center", gap: 8 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                                Confirm Pickup
                            </button>}
                    </div>

                </div>
            </main>
        </div>
    );
}