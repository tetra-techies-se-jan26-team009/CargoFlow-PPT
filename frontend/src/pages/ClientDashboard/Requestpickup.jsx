import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClientNavbar from "../../components/ClientNavbar";
import { createShipment } from "../../utils/clientAPI";
import { MapPin, MapPinCheck, PhoneIncoming } from 'lucide-react';
import { getCoordsFromPincode } from '../../utils/geocoding';


// ── Icon helper ───────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
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
    copy: "M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2v-2 M16 4h2a2 2 0 012 2v4 M12 12h8 M16 8l4 4-4 4",
    alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
};

const STEPS = [
    { label: "Locations", icon: icons.pin },
    { label: "Package Info", icon: icons.package },
    { label: "Schedule", icon: icons.clock },
    { label: "Confirm", icon: icons.check },
];

// Getting States and Cities from APIs

const getStates = async () => {
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: "India" })
    });
    const data = await res.json();
    return data.data.states;
};

const getCities = async (state) => {
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            country: "India",
            state: state
        })
    });

    const data = await res.json();
    return data.data;
};

// Priority → price multiplier (base price computed from weight)
const PRIORITY_PRICE = { Standard: 1, Express: 1.8, Overnight: 2.8 };
const BASE_RATE_PER_KG = 45; // ₹45/kg base

// ── Styles ────────────────────────────────────────────────────────────────────
const inputStyle = {
    width: "100%", background: "white", border: "1px solid #E2E8F0", borderRadius: 10,
    padding: "11px 14px", color: "#334155", fontSize: 13, outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
};
const inputErrStyle = { ...inputStyle, border: "1px solid #FCA5A5", background: "#FFF5F5" };
const selectStyle = { ...inputStyle, cursor: "pointer", appearance: "none" };
const selectErrStyle = { ...inputErrStyle, cursor: "pointer", appearance: "none" };

const labelStyle = {
    fontSize: 11, fontWeight: 600, color: "#64748B", letterSpacing: "0.5px",
    textTransform: "uppercase", display: "block", marginBottom: 6,
};

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, hint, error, required, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={labelStyle}>
                {label}
                {required && <span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>}
            </span>
            {children}
            {error && (
                <span style={{ fontSize: 11, color: "#DC2626", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon d={icons.alert} size={11} stroke="#DC2626" /> {error}
                </span>
            )}
            {hint && !error && (
                <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{hint}</span>
            )}
        </div>
    );
}

// ── Focus helpers ─────────────────────────────────────────────────────────────
const onFocus = e => { e.target.style.borderColor = "#93C5FD"; e.target.style.boxShadow = "0 0 0 3px rgba(147,197,253,0.2)"; };
const onBlur = e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; };

// ── Step validation rules ─────────────────────────────────────────────────────
function validateStep(step, f) {
    const errs = {};
    if (step === 0) {
        if (!f.pickup_city) errs.pickup_city = "Pickup city is required";
        if (!f.delivery_city) errs.delivery_city = "Delivery city is required";
        if (f.pickup_city && f.delivery_city && f.pickup_city === f.delivery_city)
            errs.delivery_city = "Pickup and delivery city cannot be the same";
        if (!f.pickup_line1) errs.pickup_line1 = "Pickup address is required";
        if (!f.pickup_state) errs.pickup_state = "State is required";
        if (!f.pickup_pincode) errs.pickup_pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(f.pickup_pincode)) errs.pickup_pincode = "Enter a valid 6-digit pincode";
        if (!f.delivery_line1) errs.delivery_line1 = "Delivery address is required";
        if (!f.delivery_state) errs.delivery_state = "State is required";
        if (!f.delivery_pincode) errs.delivery_pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(f.delivery_pincode)) errs.delivery_pincode = "Enter a valid 6-digit pincode";
        if (!f.receiver_name) errs.receiver_name = "Receiver name is required";
        if (!f.receiver_phone) errs.receiver_phone = "Phone number is required";
        if (!f.receiver_email) errs.receiver_email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.receiver_email))
            errs.receiver_email = "Enter a valid email address";
    }
    if (step === 1) {
        if (!f.weight) errs.weight = "Weight is required";
        else if (isNaN(f.weight) || Number(f.weight) <= 0) errs.weight = "Enter a valid weight";
        if (!f.category) errs.category = "Category is required";
    }
    if (step === 2) {
        if (!f.date) errs.date = "Pickup date is required";
        else {
            const picked = new Date(f.date);
            const today = new Date(); today.setHours(0, 0, 0, 0);
            if (picked < today) errs.date = "Date cannot be in the past";
        }
    }
    return errs;
}

// ── Computed price ────────────────────────────────────────────────────────────
function computePrice(weight, priority) {
    const w = parseFloat(weight) || 0;
    const mult = PRIORITY_PRICE[priority] || 1;
    return Math.round(w * BASE_RATE_PER_KG * mult);
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function RequestPickup() {
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);

    // --- API Data States ---
    const [statesList, setStatesList] = useState([]);
    const [pickupCities, setPickupCities] = useState([]);
    const [deliveryCities, setDeliveryCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState({ pickup: false, delivery: false });

    const [f, setF] = useState({
        pickup_state: "", pickup_city: "", pickup_line1: "", pickup_pincode: "",
        delivery_state: "", delivery_city: "", delivery_line1: "", delivery_pincode: "",
        receiver_name: "", receiver_phone: "", receiver_email: "",
        weight: "", category: "", fragile: false, date: "", priority: "Standard",
        pickup_lat: 0,
        pickup_lng: 0,
        delivery_lat: 0,
        delivery_lng: 0,
    });

    // 1. Initial Load: Fetch All States
    useEffect(() => {
        getStates().then(data => setStatesList(data || []));
    }, []);

    // 2. Handle Pickup State Selection
    const handlePickupStateChange = async (stateName) => {
        set("pickup_state", stateName);
        set("pickup_city", ""); // Reset city
        setLoadingCities(prev => ({ ...prev, pickup: true }));
        try {
            const cities = await getCities(stateName);
            setPickupCities(cities || []);
        } finally {
            setLoadingCities(prev => ({ ...prev, pickup: false }));
        }
    };

    // 3. Handle Delivery State Selection
    const handleDeliveryStateChange = async (stateName) => {
        set("delivery_state", stateName);
        set("delivery_city", ""); // Reset city
        setLoadingCities(prev => ({ ...prev, delivery: true }));
        try {
            const cities = await getCities(stateName);
            setDeliveryCities(cities || []);
        } finally {
            setLoadingCities(prev => ({ ...prev, delivery: false }));
        }
    };


    // New codes 

    const handlePincodeBlur = async (type) => {
        const pincode = type === "pickup" ? f.pickup_pincode : f.delivery_pincode;

        if (pincode.length !== 6) return;

        const coords = await getCoordsFromPincode(pincode);
        console.log("GEOCODE RESULT:", coords);

        if (!coords) {
            console.warn("Invalid pincode:", pincode);
            return;
        }

        if (coords) {
            if (type === "pickup") {
                setF(prev => ({
                    ...prev,
                    pickup_lat: coords.lat,
                    pickup_lng: coords.lng,
                    pickup_city: prev.pickup_city || coords.city
                }));
            } else {
                setF(prev => ({
                    ...prev,
                    delivery_lat: coords.lat,
                    delivery_lng: coords.lng,
                    delivery_city: prev.delivery_city || coords.city
                }));
            }
        }
    };

    // Till here 
    const set = (k, v) => {
        setF(p => ({ ...p, [k]: v }));
        if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
    };
    const price = computePrice(f.weight, f.priority);

    // ── Navigation ──────────────────────────────────────────────────────────
    const goNext = () => {
        const errs = validateStep(step, f);
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setStep(s => s + 1);
    };

    const goBack = () => { setErrors({}); setStep(s => Math.max(0, s - 1)); };
    const priorityMap = {
        Standard: "MEDIUM",
        Express: "HIGH",
        Overnight: "HIGH",
    };

    // ── Submit ───────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        setApiError(null);
        await handlePincodeBlur("pickup");
        await handlePincodeBlur("delivery");

        // 🔥 STEP 2 — VALIDATE LAT/LNG
        if (!f.pickup_lat || !f.pickup_lng) {
            alert("Pickup location not resolved. Please re-enter pickup pincode.");
            return;
        }

        if (!f.delivery_lat || !f.delivery_lng) {
            alert("Delivery location not resolved. Please re-enter delivery pincode.");
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                pickup_line1: f.pickup_line1,
                pickup_city: f.pickup_city,
                pickup_state: f.pickup_state,
                pickup_pincode: f.pickup_pincode,

                delivery_line1: f.delivery_line1,
                delivery_city: f.delivery_city,
                delivery_state: f.delivery_state,
                delivery_pincode: f.delivery_pincode,

                receiver_name: f.receiver_name,
                receiver_phone: f.receiver_phone.replace(/\s|\+91/g, ""),
                receiver_email: f.receiver_email,

                weight: Number(f.weight) || 0,
                price: price,

                category: f.category,
                fragile: f.fragile,
                pickup_date: f.date ? new Date(f.date).toISOString() : null,
                priority: priorityMap[f.priority] || "MEDIUM",

                pickup_lat: f.pickup_lat,
                pickup_lng: f.pickup_lng,
                delivery_lat: f.delivery_lat,
                delivery_lng: f.delivery_lng,
            };

            const data = await createShipment(payload);
            setResult(data);

        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";
            setApiError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const copyTracking = () => {
        if (result?.tracking_number) {
            navigator.clipboard.writeText(result.tracking_number);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // ── Success screen ───────────────────────────────────────────────────────
    if (result) {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F8FAFC", color: "#0F172A" }}>
                <ClientNavbar />
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                    <div style={{ textAlign: "center", maxWidth: 480, width: "100%" }}>
                        {/* Success icon */}
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#D1FAE5,#A7F3D0)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 4px 24px rgba(16,185,129,0.25)", animation: "pop 0.4s cubic-bezier(.175,.885,.32,1.275)" }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                        </div>

                        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.6px", margin: "0 0 8px" }}>Pickup Confirmed!</h2>
                        <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 20px" }}>
                            Your shipment from <strong>{result.pickup_city}</strong> to <strong>{result.delivery_city}</strong> has been booked.
                        </p>

                        {/* Tracking ID card */}
                        <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", border: "1px solid #BFDBFE", marginBottom: 16, boxShadow: "0 4px 16px rgba(37,99,235,0.08)" }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 8 }}>Your Tracking ID</div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                                <span style={{ fontSize: 24, fontWeight: 900, color: "#2563EB", letterSpacing: "-0.5px" }}>{result.tracking_number}</span>
                                <button onClick={copyTracking} title="Copy" style={{ padding: "6px 10px", border: "1px solid #BFDBFE", borderRadius: 8, background: copied ? "#D1FAE5" : "#EFF6FF", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: copied ? "#059669" : "#2563EB", fontSize: 11, fontWeight: 600, transition: "all 0.2s" }}>
                                    <Icon d={icons.copy} size={13} stroke="currentColor" />
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                        </div>

                        {/* Summary pills */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
                            {[
                                { label: "Receiver", value: result.receiver },
                                { label: "Status", value: result.status?.replace(/_/g, " ") || "Created" },
                                { label: "Est. Cost", value: `₹${price.toLocaleString("en-IN")}` },
                            ].map(item => (
                                <div key={item.label} style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 12px", border: "1px solid #F1F5F9" }}>
                                    <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{item.label}</div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>{item.value}</div>
                                </div>
                            ))}
                        </div>

                        <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 24px" }}>
                            Our agent will call you 30 minutes before pickup
                        </p>

                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <button onClick={() => { setResult(null); setStep(0); setF({ pickup_city: "", pickup_line1: "", pickup_state: "", pickup_pincode: "", delivery_city: "", delivery_line1: "", delivery_state: "", delivery_pincode: "", receiver_name: "", receiver_phone: "", receiver_email: "", weight: "", category: "", desc: "", fragile: false, date: "", slot: "", priority: "Standard" }); }}
                                style={{ padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#3B82F6)", border: "none", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
                                + New Pickup
                            </button>
                            <button onClick={() => navigate("/shipments")}
                                style={{ padding: "11px 20px", borderRadius: 10, background: "white", border: "1px solid #E2E8F0", color: "#334155", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                                View Shipments
                            </button>
                        </div>
                    </div>
                </div>
                <style>{`@keyframes pop { from { transform: scale(.7); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
            </div>
        );
    }

    // ── Main form ────────────────────────────────────────────────────────────
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F8FAFC", color: "#0F172A" }}>
            <ClientNavbar />
            <title>Request Pickup</title>

            <style>{`
                @keyframes slideIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
                input:focus, select:focus, textarea:focus { border-color: #93C5FD !important; box-shadow: 0 0 0 3px rgba(147,197,253,0.2) !important; }
            `}</style>

            <main style={{ flex: 1, overflow: "auto", padding: "28px 100px" }}>
                <div style={{ maxWidth: 680, margin: "0 auto" }}>

                    {/* Header */}
                    <div style={{ marginBottom: 28 }}>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.6px" }}>Request Pickup</h1>
                        <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>Fill in the details to schedule your shipment</p>
                    </div>

                    {/* Stepper */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
                        {STEPS.map((s, i) => (
                            <div key={s.label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: i < step ? "pointer" : "default" }}
                                    onClick={() => { if (i < step) { setErrors({}); setStep(i); } }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: "50%",
                                        background: i < step ? "linear-gradient(135deg,#10B981,#059669)" : i === step ? "linear-gradient(135deg,#2563EB,#3B82F6)" : "white",
                                        border: i > step ? "2px solid #E2E8F0" : "none",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        boxShadow: i === step ? "0 4px 14px rgba(37,99,235,0.3)" : i < step ? "0 2px 8px rgba(16,185,129,0.25)" : "0 1px 4px rgba(0,0,0,0.05)",
                                        flexShrink: 0, transition: "all 0.3s",
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
                                    <div style={{ flex: 1, height: 2, background: i < step ? "#10B981" : "#E2E8F0", margin: "0 16px", borderRadius: 1, transition: "background 0.3s" }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Panel */}
                    <div style={{ background: "white", borderRadius: 16, padding: "28px 32px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", marginBottom: 16, animation: "slideIn 0.25s ease" }}>

                        {step === 0 && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">

                                {/* --- ORIGIN SECTION --- */}
                                <section className="relative pl-10">
                                    <div className="absolute left-[19px] top-8 bottom-0 w-0.5 border-l-2 border-dashed border-blue-200" />
                                    <div className="absolute left-[10px] top-0 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-md" />
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6">Origin Dispatch Point</h3>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* State Choice First */}
                                        <Field label="Pickup State" required error={errors.pickup_state}>
                                            <select value={f.pickup_state} onChange={e => handlePickupStateChange(e.target.value)} style={selectStyle}>
                                                <option value="">Select state</option>
                                                {statesList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                            </select>
                                        </Field>

                                        {/* City based on State */}
                                        <Field label="Pickup City" required error={errors.pickup_city}>
                                            <select
                                                disabled={!f.pickup_state || loadingCities.pickup}
                                                value={f.pickup_city}
                                                onChange={e => set("pickup_city", e.target.value)}
                                                style={selectStyle}
                                            >
                                                <option value="">{loadingCities.pickup ? "Loading Cities..." : "Select city"}</option>
                                                {pickupCities.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </Field>

                                        <div className="col-span-2 grid grid-cols-[1fr_140px] gap-4">
                                            <Field label="Street Address" required error={errors.pickup_line1}>
                                                <input value={f.pickup_line1} onChange={e => set("pickup_line1", e.target.value)} placeholder="Building/Area" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                            </Field>
                                            <Field label="Pincode" required error={errors.pickup_pincode}>
                                                <input
                                                    value={f.pickup_pincode}
                                                    onChange={e => set("pickup_pincode", e.target.value.replace(/\D/g, ""))}
                                                    maxLength={6}
                                                    placeholder="600001"
                                                    style={inputStyle}
                                                    onFocus={onFocus}
                                                    onBlur={(e) => {
                                                        handlePincodeBlur('pickup');
                                                        onBlur(e);
                                                    }}
                                                />
                                            </Field>
                                        </div>
                                    </div>
                                </section>

                                {/* --- RECEIVER SECTION --- */}
                                <section className="relative pl-10">
                                    <div className="absolute left-[10px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-md" />
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-6">Destination Details</h3>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2 grid grid-cols-2 gap-4">
                                            <Field label="Receiver Name" required error={errors.receiver_name}><input value={f.receiver_name} onChange={e => set("receiver_name", e.target.value)} placeholder="Full Name" style={inputStyle} /></Field>
                                            <Field label="Receiver Phone" required error={errors.receiver_phone}><input value={f.receiver_phone} onChange={e => set("receiver_phone", e.target.value)} placeholder="+91" style={inputStyle} /></Field>
                                        </div>
                                        <Field label="Receiver Email" required error={errors.receiver_email}>
                                            <input
                                                type="email"
                                                value={f.receiver_email}
                                                onChange={e => set("receiver_email", e.target.value)}
                                                placeholder="example@gmail.com"
                                                style={errors.receiver_email ? inputErrStyle : inputStyle}
                                                onFocus={onFocus}
                                                onBlur={onBlur}
                                            />
                                        </Field>

                                        {/* State Choice First */}
                                        <Field label="Delivery State" required error={errors.delivery_state}>
                                            <select value={f.delivery_state} onChange={e => handleDeliveryStateChange(e.target.value)} style={selectStyle}>
                                                <option value="">Select state</option>
                                                {statesList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                            </select>
                                        </Field>

                                        {/* City based on State */}
                                        <Field label="Delivery City" required error={errors.delivery_city}>
                                            <select
                                                disabled={!f.delivery_state || loadingCities.delivery}
                                                value={f.delivery_city}
                                                onChange={e => set("delivery_city", e.target.value)}
                                                style={selectStyle}
                                            >
                                                <option value="">{loadingCities.delivery ? "Loading Cities..." : "Select city"}</option>
                                                {deliveryCities.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </Field>

                                        <div className="col-span-2 grid grid-cols-[1fr_140px] gap-4">
                                            <Field label="Delivery Address" required error={errors.delivery_line1}><input value={f.delivery_line1} onChange={e => set("delivery_line1", e.target.value)} placeholder="Apt/Street" style={inputStyle} /></Field>
                                            <Field label="Pincode" required error={errors.delivery_pincode}><input onBlur={(e) => {
                                                handlePincodeBlur('delivery');
                                                onBlur(e);
                                            }} value={f.delivery_pincode} onChange={e => set("delivery_pincode", e.target.value.replace(/\D/g, ""))} maxLength={6} placeholder="400001" style={inputStyle} /></Field>
                                        </div>
                                    </div>
                                </section>
                            </div>)}
                        {/* ── STEP 1 — Package ────────────────────────────── */}
                        {step === 1 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>Package Details</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <Field label="Total Weight (kg)" required error={errors.weight}>
                                        <input type="number" min="0.1" step="0.1" value={f.weight}
                                            onChange={e => set("weight", e.target.value)}
                                            placeholder="e.g. 12"
                                            style={errors.weight ? inputErrStyle : inputStyle}
                                            onFocus={onFocus} onBlur={onBlur} />
                                    </Field>
                                    <Field label="Category" required error={errors.category}>
                                        <select value={f.category} onChange={e => set("category", e.target.value)}
                                            style={errors.category ? selectErrStyle : selectStyle}>
                                            <option value="">Select category</option>
                                            {["Electronics", "Clothing", "Documents", "Food & Perishables", "Machinery", "Pharmaceuticals", "Other"].map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </Field>
                                </div>
                                <div>
                                    <span style={labelStyle}>Fragile Items?</span>
                                    <div style={{ display: "flex", gap: 10 }}>
                                        {[{ v: true, l: "⚠️ Yes – Handle with care" }, { v: false, l: "✅ No – Standard handling" }].map(o => (
                                            <button key={String(o.v)} onClick={() => set("fragile", o.v)}
                                                style={{ padding: "10px 20px", borderRadius: 10, border: "1.5px solid", borderColor: f.fragile === o.v ? "#2563EB" : "#E2E8F0", background: f.fragile === o.v ? "#EFF6FF" : "white", color: f.fragile === o.v ? "#1D4ED8" : "#64748B", fontSize: 12, fontWeight: f.fragile === o.v ? 600 : 400, cursor: "pointer", transition: "all 0.15s" }}>
                                                {o.l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Live price estimate */}
                                {f.weight && Number(f.weight) > 0 && (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", borderRadius: 12, border: "1px solid #BFDBFE" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <Icon d={icons.info} size={15} stroke="#2563EB" />
                                            <span style={{ fontSize: 12, color: "#1D4ED8", fontWeight: 500 }}>Estimated shipping cost</span>
                                        </div>
                                        <span style={{ fontSize: 18, fontWeight: 800, color: "#1D4ED8", letterSpacing: "-0.3px" }}>
                                            ₹{price.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── STEP 2 — Schedule ───────────────────────────── */}
                        {step === 2 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>Schedule Pickup</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <Field label="Pickup Date" required error={errors.date}>
                                        <input type="date" value={f.date}
                                            min={new Date().toISOString().split("T")[0]}
                                            onChange={e => set("date", e.target.value)}
                                            style={errors.date ? inputErrStyle : inputStyle}
                                            onFocus={onFocus} onBlur={onBlur} />
                                    </Field>
                                </div>

                                {/* Priority selector */}
                                <div>
                                    <span style={labelStyle}>Shipping Priority</span>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                                        {[
                                            { k: "Standard", desc: "3–5 business days", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", badge: "Recommended" },
                                            { k: "Express", desc: "1–2 business days", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", badge: "1.8× price" },
                                            { k: "Overnight", desc: "Next-day delivery", color: "#DC2626", bg: "#FFF5F5", border: "#FECACA", badge: "2.8× price" },
                                        ].map(p => (
                                            <button key={p.k} onClick={() => set("priority", p.k)}
                                                style={{ padding: "14px", borderRadius: 12, border: "1.5px solid", borderColor: f.priority === p.k ? p.border : "#E2E8F0", background: f.priority === p.k ? p.bg : "white", cursor: "pointer", textAlign: "left", transition: "all 0.18s", boxShadow: f.priority === p.k ? "0 2px 8px rgba(0,0,0,0.06)" : "none", position: "relative" }}>
                                                {f.priority === p.k && (
                                                    <div style={{ position: "absolute", top: -8, right: 8, fontSize: 9, fontWeight: 700, background: p.color, color: "white", padding: "2px 7px", borderRadius: 20 }}>{p.badge}</div>
                                                )}
                                                <div style={{ fontSize: 13, fontWeight: 700, color: f.priority === p.k ? p.color : "#0F172A", marginBottom: 4 }}>{p.k}</div>
                                                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 6 }}>{p.desc}</div>
                                                {f.weight && Number(f.weight) > 0 && (
                                                    <div style={{ fontSize: 12, fontWeight: 700, color: f.priority === p.k ? p.color : "#64748B" }}>
                                                        ₹{computePrice(f.weight, p.k).toLocaleString("en-IN")}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 3 — Confirm ────────────────────────────── */}
                        {step === 3 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>Order Summary</h3>

                                {/* Route visual */}
                                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "linear-gradient(135deg,#EFF6FF,#F0F9FF)", borderRadius: 12, border: "1px solid #BFDBFE" }}>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>From</div>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{f.pickup_city || "—"}</div>
                                        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{f.pickup_pincode}</div>
                                    </div>
                                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                        <div style={{ flex: 1, height: 1, background: "#BFDBFE" }} />
                                        <span style={{ fontSize: 18 }}></span>
                                        <div style={{ flex: 1, height: 1, background: "#BFDBFE" }} />
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>To</div>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{f.delivery_city || "—"}</div>
                                        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{f.delivery_pincode}</div>
                                    </div>
                                </div>

                                {/* Details grid */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                    {[
                                        { k: "Pickup Address", v: f.pickup_line1 || "—" },
                                        { k: "Delivery Address", v: f.delivery_line1 || "—" },
                                        { k: "Receiver", v: f.receiver_name || "—" },
                                        { k: "Phone", v: f.receiver_phone || "—" },
                                        { k: "Weight", v: f.weight ? `${f.weight} kg` : "—" },
                                        { k: "Category", v: f.category || "—" },
                                        { k: "Fragile", v: f.fragile ? "Yes ⚠️" : "No" },
                                        { k: "Pickup Date", v: f.date ? new Date(f.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—" },
                                        { k: "Time Slot", v: f.slot || "—" },
                                        { k: "Priority", v: f.priority },
                                    ].map(r => (
                                        <div key={r.k} style={{ padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" }}>
                                            <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{r.k}</div>
                                            <div style={{ fontSize: 13, fontWeight: 500, color: "#334155", wordBreak: "break-word" }}>{r.v}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price summary */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "linear-gradient(135deg,#F0FDF4,#D1FAE5)", borderRadius: 12, border: "1px solid #6EE7B7" }}>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: "#064E3B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Estimated Total</div>
                                        <div style={{ fontSize: 11, color: "#6EE7B7", marginTop: 2 }}>{f.weight} kg × ₹{BASE_RATE_PER_KG}/kg × {PRIORITY_PRICE[f.priority]}× ({f.priority})</div>
                                    </div>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: "#059669", letterSpacing: "-0.5px" }}>
                                        ₹{price.toLocaleString("en-IN")}
                                    </div>
                                </div>

                                {/* Info note */}
                                <div style={{ padding: "14px 16px", background: "#EFF6FF", borderRadius: 12, border: "1px solid #BFDBFE", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                    <Icon d={icons.info} size={16} stroke="#2563EB" />
                                    <p style={{ fontSize: 12, color: "#1D4ED8", margin: 0, lineHeight: 1.6 }}>
                                        Our agent will call you 30 minutes before pickup. You'll receive a tracking ID immediately after confirmation.
                                    </p>
                                </div>

                                {/* API error */}
                                {apiError && (
                                    <div style={{ padding: "12px 16px", background: "#FEF2F2", borderRadius: 12, border: "1px solid #FCA5A5", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                        <Icon d={icons.alert} size={16} stroke="#DC2626" />
                                        <p style={{ fontSize: 12, color: "#DC2626", margin: 0, lineHeight: 1.6 }}>{apiError}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <button onClick={goBack} disabled={step === 0}
                            style={{ padding: "11px 22px", borderRadius: 10, background: "white", border: "1px solid #E2E8F0", color: step === 0 ? "#CBD5E1" : "#334155", fontSize: 13, fontWeight: 500, cursor: step === 0 ? "not-allowed" : "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                            ← Back
                        </button>

                        {/* Step indicator */}
                        <span style={{ fontSize: 12, color: "#94A3B8" }}>Step {step + 1} of {STEPS.length}</span>

                        {step < STEPS.length - 1 ? (
                            <button onClick={goNext}
                                style={{ padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#3B82F6)", border: "none", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.3)", display: "flex", alignItems: "center", gap: 8 }}>
                                Continue <Icon d={icons.arrow} size={14} stroke="white" />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={submitting}
                                style={{ padding: "11px 26px", borderRadius: 10, background: submitting ? "#6EE7B7" : "linear-gradient(135deg,#10B981,#059669)", border: "none", color: "white", fontSize: 13, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(16,185,129,0.3)", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", minWidth: 160, justifyContent: "center" }}>
                                {submitting ? (
                                    <>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                                            <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                                        Confirm Pickup
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </main>

            <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
    );
}