import { useState, useMemo, useEffect, useRef } from "react";
import Modal, { ModalHeader } from "../Modal";
import { getCoordsFromPincode } from '../../../utils/geocoding';
import { createShipment, getClients } from "../../../utils/adminAPI";

// ─── Icon ─────────────────────────────────────────────────────────────────────
const Ico = ({ d, s = 14, c = "currentColor", f = "none", w = 1.8 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={f} stroke={c}
        strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);
const IC = {
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    mail: "M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z M22 6l-10 7L2 6",
    phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.43 9.5 2 2 0 013.34 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.29 6.29l.79-.79a2 2 0 012.1-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z",
    pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
    pkg: "M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z M12 22V9 M22 8.5L12 15 2 8.5",
    scale: "M3 3h18 M3 9h18 M3 15h18",
    cash: "M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-3 M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M9 7h6",
    cal: "M3 9h18 M8 3v3 M16 3v3 M3 7a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V7z",
    alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
    arrow: "M5 12h14 M12 5l7 7-7 7",
    check: "M20 6L9 17l-5-5",
    truck: "M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
    id: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 3H8L6 7h12l-2-4z",
    info: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 8v4 M12 16h.01",
    rupee: "M6 3h12 M6 8h12 M6 13l8.5 8 M6 13h3a4 4 0 000-8",
};

// ─── Price logic ──────────────────────────────────────────────────────────────
const PRIORITY_PRICE = { STANDARD: 1, EXPRESS: 1.8, OVERNIGHT: 2.8 };
const BASE_RATE_PER_KG = 45;

function computePrice(weight, priority) {
    const w = parseFloat(weight) || 0;
    const mult = PRIORITY_PRICE[priority] || 1;
    return Math.round(w * BASE_RATE_PER_KG * mult);
}

// ─── Indian states + UTs with cities ──────────────────────────────────────────
const STATE_CITIES = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kakinada", "Kadapa", "Anantapur", "Eluru", "Ongole"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Namsai", "Bomdila", "Tawang", "Ziro"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Diphu", "Karimganj", "Sivasagar"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai", "Katihar", "Munger", "Saharsa"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Ambikapur", "Raigarh"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Morbi", "Navsari", "Surendranagar"],
    "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Rewari", "Bhiwani"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi", "Kullu", "Bilaspur", "Hamirpur", "Nahan", "Una"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh"],
    "Karnataka": ["Bengaluru", "Mysore", "Hubli", "Mangalore", "Belgaum", "Davanagere", "Shimoga", "Tumkur", "Gulbarga", "Udupi", "Bidar", "Hassan", "Raichur"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam", "Malappuram", "Pathanamthitta", "Idukki"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Murwara", "Singrauli", "Burhanpur"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Thane", "Kolhapur", "Amravati", "Navi Mumbai", "Akola", "Nanded", "Sangli"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Ukhrul"],
    "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Baghmara"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Gurdaspur", "Firozpur", "Moga"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Sikar", "Pali", "Barmer", "Chittorgarh", "Jhunjhunu"],
    "Sikkim": ["Gangtok", "Namchi", "Mangan", "Gyalshing", "Rangpo"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode", "Tiruppur", "Dindigul", "Thoothukudi", "Kanchipuram", "Thanjavur"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Secunderabad", "Nalgonda", "Mahbubnagar", "Adilabad"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia", "Ambassa"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Prayagraj", "Ghaziabad", "Noida", "Mathura", "Bareilly", "Aligarh", "Moradabad", "Gorakhpur", "Firozabad"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh", "Nainital", "Mussoorie", "Rudrapur", "Kashipur"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Kharagpur", "Haldia", "Jalpaiguri", "Cooch Behar"],
    "Delhi": ["New Delhi", "Dwarka", "Rohini", "Pitampura", "Janakpuri", "Laxmi Nagar", "Saket", "Nehru Place", "Connaught Place", "Karol Bagh"],
    "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Kathua", "Udhampur", "Leh"],
    "Ladakh": ["Leh", "Kargil", "Diskit", "Padum"],
    "Chandigarh": ["Chandigarh", "Mani Majra", "Panchkula Extension"],
    "Dadra & Nagar Haveli": ["Silvassa", "Amli", "Khanvel", "Naroli"],
    "Daman & Diu": ["Daman", "Diu", "Moti Daman", "Nani Daman"],
    "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy", "Andrott", "Amini"],
    "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam", "Oulgaret"],
    "Andaman & Nicobar": ["Port Blair", "Diglipur", "Mayabunder", "Rangat", "Car Nicobar"],
};

const ALL_STATES = Object.keys(STATE_CITIES).sort();

// ─── Priority config ──────────────────────────────────────────────────────────
const PRIORITIES = [
    { k: "STANDARD", label: "Standard", desc: "3–5 business days", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", mult: "1×" },
    { k: "EXPRESS", label: "Express", desc: "1–2 business days", color: "#D97706", bg: "#FEF3C7", border: "#FDE68A", mult: "1.8×" },
    { k: "OVERNIGHT", label: "Overnight", desc: "Next-day delivery", color: "#DC2626", bg: "#FEE2E2", border: "#FECACA", mult: "2.8×" },
];

// ─── Section label ────────────────────────────────────────────────────────────
const Section = ({ icon, label, accent = "#2563EB" }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Ico d={icon} s={12} c={accent} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#4B5563", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
            {label}
        </span>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #E5E7EB, transparent)" }} />
    </div>
);

// ─── Field wrapper ────────────────────────────────────────────────────────────
const F = ({ label, icon, error, required, hint, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: error ? "#DC2626" : "#374151", display: "flex", alignItems: "center", gap: 4 }}>
            {icon && <Ico d={icon} s={12} c={error ? "#DC2626" : "#6B7280"} />}
            {label}{required && <span style={{ color: "#DC2626", marginLeft: 2 }}>*</span>}
        </label>
        {children}
        {error && <span style={{ fontSize: 11, color: "#DC2626", display: "flex", alignItems: "center", gap: 4 }}><Ico d={IC.alert} s={11} c="#DC2626" />{error}</span>}
        {hint && !error && <span style={{ fontSize: 11, color: "#6B7280" }}>{hint}</span>}
    </div>
);

// ─── Input / Select base styles ───────────────────────────────────────────────
const iBase = (err) => ({
    width: "100%", background: err ? "#FEF2F2" : "#FFFFFF",
    border: `1px solid ${err ? "#FCA5A5" : "#D1D5DB"}`,
    borderRadius: 8, padding: "9px 12px", color: "#111827",
    fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s ease", boxSizing: "border-box",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)"
});
const sBase = (err, disabled) => ({
    ...iBase(err),
    cursor: disabled ? "not-allowed" : "pointer",
    appearance: "none",
    opacity: disabled ? 0.6 : 1,
    backgroundColor: disabled ? "#F3F4F6" : (err ? "#FEF2F2" : "#FFFFFF")
});
const oF = e => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; };
const oB = e => { e.target.style.borderColor = "#D1D5DB"; e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.03)"; };

// ─── Reusable address block ───────────────────────────────────────────────────
function AddressBlock({ prefix, label, accentColor, accentBg, f, set, errs }) {
    const sk = `${prefix}_state`;
    const ck = `${prefix}_city`;
    const lk = `${prefix}_line1`;
    const pk = `${prefix}_pincode`;

    const selectedState = f[sk];
    const cities = useMemo(() =>
        selectedState ? (STATE_CITIES[selectedState] || []) : [],
        [selectedState]
    );

    const handleStateChange = (val) => {
        set(sk, val);
        set(ck, "");
    };
    const handlePincodeBlur = async (type) => {
        const pincode = type === "pickup" ? f.pickup_pincode : f.delivery_pincode;

        if (pincode.length !== 6) return;

        const coords = await getCoordsFromPincode(pincode);
        console.log("GEOCODE RESULT:", coords);

        if (!coords) {
            console.warn("Invalid pincode:", pincode);

            if (type === "pickup") {
                set("pickup_lat", null);
                set("pickup_lng", null);
            } else {
                set("delivery_lat", null);
                set("delivery_lng", null);
            }
            return;
        }

        if (type === "pickup") {
            set("pickup_lat", coords.lat);
            set("pickup_lng", coords.lng);
            if (!f.pickup_city) set("pickup_city", coords.city);
        } else {
            set("delivery_lat", coords.lat);
            set("delivery_lng", coords.lng);
            if (!f.delivery_city) set("delivery_city", coords.city);
        }
    };

    return (
        <div style={{ padding: "16px", background: "#F9FAFB", border: `1px solid #E5E7EB`, borderRadius: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor, boxShadow: `0 0 0 3px ${accentBg}` }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#111827", letterSpacing: "1px", textTransform: "uppercase" }}>{label}</span>
            </div>

            <F label="Street Address" required error={errs[lk]}>
                <input className="asf-in" value={f[lk]} onChange={e => set(lk, e.target.value)}
                    placeholder="Building, street, area" style={iBase(errs[lk])} onFocus={oF} onBlur={oB} />
            </F>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="State" required error={errs[sk]}>
                    <select className="asf-in" value={f[sk]} onChange={e => handleStateChange(e.target.value)}
                        style={sBase(errs[sk], false)} onFocus={oF} onBlur={oB}>
                        <option value="">Select state</option>
                        {ALL_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                </F>
                <F label="City" required error={errs[ck]} hint={!f[sk] ? "Select state first" : ""}>
                    <select className="asf-in" value={f[ck]} onChange={e => set(ck, e.target.value)}
                        style={sBase(errs[ck], !f[sk])} onFocus={oF} onBlur={oB} disabled={!f[sk]}>
                        <option value="">{f[sk] ? "Select city" : "—"}</option>
                        {cities.map(c => <option key={c}>{c}</option>)}
                    </select>
                </F>
            </div>

            <F label="Pincode" required error={errs[pk]}>
                <input
                    className="asf-in"
                    value={f[pk]}
                    onChange={e => set(pk, e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onBlur={() => handlePincodeBlur(prefix)}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    style={iBase(errs[pk])}
                    onFocus={oF}
                    onBlurCapture={oB}
                />
            </F>
        </div>
    );
}

// ─── Searchable Client Dropdown ───────────────────────────────────────────────
const SearchableClientDropdown = ({ clients, selectedId, onSelect, error, isLoading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef(null);

    const selectedClient = clients.find(c => c.id === selectedId);

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.business.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
            {/* The clickable input acting as the trigger */}
            <div
                onClick={() => setIsOpen(true)}
                style={{
                    width: "100%", background: error ? "#FEF2F2" : "#FFFFFF",
                    border: `1px solid ${error ? "#FCA5A5" : (isOpen ? "#2563EB" : "#D1D5DB")}`,
                    borderRadius: 8, padding: "9px 12px", color: "#111827",
                    fontSize: 13, outline: "none", cursor: "text",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    boxShadow: isOpen ? "0 0 0 3px rgba(37,99,235,0.15)" : "0 1px 2px rgba(0, 0, 0, 0.03)",
                    transition: "all 0.15s ease"
                }}
            >
                {isOpen ? (
                    <input
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search name or business..."
                        style={{ border: "none", outline: "none", width: "100%", fontSize: 13, background: "transparent" }}
                    />
                ) : (
                    <span style={{ color: selectedClient ? "#111827" : "#9CA3AF" }}>
                        {isLoading ? "Loading clients..." : (selectedClient ? `${selectedClient.name} (${selectedClient.business})` : "Select a client...")}
                    </span>
                )}

                {/* Chevron icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </div>

            {/* The Dropdown Menu */}
            {isOpen && (
                <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                    background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8,
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                    maxHeight: 200, overflowY: "auto", zIndex: 50, padding: 4
                }}>
                    {filteredClients.length > 0 ? (
                        filteredClients.map(client => (
                            <div
                                key={client.id}
                                onClick={() => {
                                    onSelect(client.id);
                                    setIsOpen(false);
                                    setSearchTerm("");
                                }}
                                style={{
                                    padding: "8px 12px", cursor: "pointer", borderRadius: 6,
                                    display: "flex", flexDirection: "column", gap: 2,
                                    background: selectedId === client.id ? "#EFF6FF" : "transparent"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
                                onMouseLeave={(e) => e.currentTarget.style.background = selectedId === client.id ? "#EFF6FF" : "transparent"}
                            >
                                <span style={{ fontSize: 13, fontWeight: 600, color: selectedId === client.id ? "#1D4ED8" : "#111827" }}>
                                    {client.name}
                                </span>
                                <span style={{ fontSize: 11, color: "#6B7280" }}>{client.business} • ID: {client.id}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: "12px", textAlign: "center", fontSize: 12, color: "#6B7280" }}>
                            No clients found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function AddShipmentModal({ onClose }) {
    const INIT = {
        sender_id: "",
        receiver_name: "", receiver_phone: "", receiver_email: "",
        pickup_line1: "", pickup_city: "", pickup_state: "", pickup_pincode: "",
        delivery_line1: "", delivery_city: "", delivery_state: "", delivery_pincode: "",
        weight: "", price: "",
        category: "", fragile: false, pickup_date: "", priority: "STANDARD",
        pickup_lat: 0,
        pickup_lng: 0,
        delivery_lat: 0,
        delivery_lng: 0,
    };

    const [f, setF] = useState(INIT);
    const [errs, setErrs] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiErr, setApiErr] = useState(null);
    const [success, setSuccess] = useState(null);
    const [clients, setClients] = useState([]);
    const [isLoadingClients, setIsLoadingClients] = useState(true);

    const set = (k, v) => {
        setF(p => ({ ...p, [k]: v }));
        if (errs[k]) setErrs(p => { const n = { ...p }; delete n[k]; return n; });
    };

    const computedPrice = computePrice(f.weight, f.priority);

    const handleWeightChange = (v) => {
        const auto = computePrice(v, f.priority);
        setF(p => ({ ...p, weight: v, price: auto > 0 ? String(auto) : "" }));
        if (errs.weight) setErrs(p => { const n = { ...p }; delete n.weight; return n; });
    };

    const handlePriorityChange = (k) => {
        const auto = computePrice(f.weight, k);
        setF(p => ({ ...p, priority: k, price: auto > 0 ? String(auto) : p.price }));
    };

    const validate = () => {
        const e = {};
        if (!f.sender_id) e.sender_id = "Required";
        else if (isNaN(+f.sender_id)) e.sender_id = "Must be numeric";
        if (!f.receiver_name) e.receiver_name = "Required";
        if (!f.receiver_phone) e.receiver_phone = "Required";
        if (!f.receiver_email) {
            e.receiver_email = "Required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.receiver_email)) {
            e.receiver_email = "Must be a valid email";
        }
        if (!f.pickup_line1) e.pickup_line1 = "Required";
        if (!f.pickup_state) e.pickup_state = "Required";
        if (!f.pickup_city) e.pickup_city = "Required";
        if (!f.pickup_pincode) e.pickup_pincode = "Required";
        else if (!/^\d{6}$/.test(f.pickup_pincode)) e.pickup_pincode = "Must be 6 digits";
        if (!f.delivery_line1) e.delivery_line1 = "Required";
        if (!f.delivery_state) e.delivery_state = "Required";
        if (!f.delivery_city) e.delivery_city = "Required";
        if (!f.delivery_pincode) e.delivery_pincode = "Required";
        else if (!/^\d{6}$/.test(f.delivery_pincode)) e.delivery_pincode = "Must be 6 digits";
        if (!f.weight) {
            errs.weight = "Weight is required";
        } else if (isNaN(f.weight)) {
            errs.weight = "Enter a valid weight";
        } else if (Number(f.weight) < 100) {
            errs.weight = "Minimum shipment weight is 100 kg";
        }
        if (!f.price || isNaN(+f.price) || +f.price <= 0) e.price = "Must be > 0";
        if (f.pickup_date && new Date(f.pickup_date) < new Date()) e.pickup_date = "Cannot be in the past";
        return e;
    };

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await getClients();
                const activeClients = res.clients
                    .filter(c => c.status === "Active")
                    .map(c => ({
                        id: parseInt(c.client_id.split("-")[1], 10),
                        name: c.contact_person,
                        business: c.business || "Independent"
                    }));
                setClients(activeClients);
            } catch (error) {
                console.error("Failed to load clients", error);
            } finally {
                setIsLoadingClients(false);
            }
        };
        fetchClients();
    }, []);



    // ── Submit ────────────────────────────────────────────────────────────────
    const submit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrs(e); return; }
        setLoading(true); setApiErr(null);

        // 1. Apply the priority map from RequestPickup
        const priorityMap = {
            STANDARD: "MEDIUM",
            EXPRESS: "HIGH",
            OVERNIGHT: "HIGH",
        };

        try {
            const res = await createShipment({
                sender_id: parseInt(f.sender_id, 10),
                receiver_name: f.receiver_name,

                // 2. Sanitize phone number exactly like RequestPickup
                receiver_phone: f.receiver_phone.replace(/\s|\+91/g, ""),

                // Fallback for strict Pydantic EmailStr validation
                receiver_email: f.receiver_email ? f.receiver_email : "not-provided@cargoflow.local",

                pickup_line1: f.pickup_line1,
                pickup_city: f.pickup_city,
                pickup_state: f.pickup_state,
                pickup_pincode: f.pickup_pincode,
                delivery_line1: f.delivery_line1,
                delivery_city: f.delivery_city,
                delivery_state: f.delivery_state,
                delivery_pincode: f.delivery_pincode,
                pickup_lat: f.pickup_lat,
                pickup_lng: f.pickup_lng,
                delivery_lat: f.delivery_lat,
                delivery_lng: f.delivery_lng,

                // 3. Ensure numerical safety
                weight: parseFloat(f.weight) || 0,
                price: parseFloat(f.price) || 0,

                category: f.category || null,
                fragile: f.fragile,
                pickup_date: f.pickup_date ? new Date(f.pickup_date).toISOString() : null,

                // 4. Translate UI priority to Backend Enum
                priority: priorityMap[f.priority] || "MEDIUM",
            });
            setSuccess(res);
        } catch (err) {
            const detail = err?.response?.data?.detail;

            // 5. Crash-proof parsing of FastAPI error arrays
            if (Array.isArray(detail)) {
                const formattedErrors = detail.map(errObj =>
                    `${errObj.loc.at(-1)}: ${errObj.msg}`
                ).join(" | ");

                setApiErr(`Validation failed: ${formattedErrors}`);
            }
            else if (typeof detail === "string") {
                setApiErr(detail);
            }
            else {
                setApiErr(err?.message || "Failed to create shipment");
            }
        } finally {
            setLoading(false);
        }
    };


    // new codes 
    // till here 
    const fromLabel = f.pickup_city || f.pickup_state || "Origin";
    const toLabel = f.delivery_city || f.delivery_state || "Destination";
    const routeActive = !!(f.pickup_city && f.delivery_city);

    // ── Success screen ────────────────────────────────────────────────────────
    if (success) return (
        <Modal onClose={onClose} width={500}>
            <style>{`@keyframes popIn{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
            <div style={{ padding: "32px 28px", fontFamily: "'DM Sans', sans-serif", background: "#FFFFFF", borderRadius: 16 }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#D1FAE5", border: "4px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "popIn .4s cubic-bezier(.175,.885,.32,1.275)" }}>
                        <Ico d={IC.check} s={32} c="#059669" w={2.5} />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 6, letterSpacing: "-0.3px" }}>Shipment Created</div>
                    <div style={{ fontSize: 13, color: "#6B7280" }}>Logged by admin · status: <span style={{ color: "#059669", fontWeight: 600 }}>CREATED</span></div>
                </div>

                <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
                    <div style={{ padding: "14px 20px", background: "#EFF6FF", borderBottom: "1px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, color: "#2563EB", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Tracking Number</span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: "#1D4ED8", fontFamily: "'DM Mono', monospace", letterSpacing: "1px" }}>{success.tracking_number}</span>
                    </div>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{success.pickup_city}</span>
                        <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg, #E5E7EB, #CBD5E1)" }} />
                        <span style={{ fontSize: 16 }}></span>
                        <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg, #CBD5E1, #E5E7EB)" }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{success.delivery_city}</span>
                    </div>
                    <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
                        {[
                            { l: "Sender", v: success.sender },
                            { l: "Receiver", v: success.receiver },
                            { l: "Priority", v: success.priority },
                            { l: "Est. Cost", v: `₹${computedPrice.toLocaleString("en-IN")}` },
                        ].map(r => (
                            <div key={r.l}>
                                <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{r.l}</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{r.v}</div>
                            </div>
                        ))}
                    </div>
                    {success.fragile && (
                        <div style={{ margin: "0 20px 16px", padding: "8px 12px", background: "#FEF3C7", borderRadius: 8, border: "1px solid #FDE68A", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, color: "#D97706", fontWeight: 600 }}>Fragile — Handle with care</span>
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => { setSuccess(null); setF(INIT); setErrs({}); }}
                        style={{ flex: 1, padding: "12px", borderRadius: 8, background: "#FFFFFF", border: "1px solid #D1D5DB", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                        + New Shipment
                    </button>
                    <button onClick={() => { onClose(); window.location.reload(); }}
                        style={{ flex: 1, padding: "12px", borderRadius: 8, background: "#2563EB", border: "1px solid #1D4ED8", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                        Done
                    </button>
                </div>
            </div>
        </Modal>
    );

    // ── Main modal ────────────────────────────────────────────────────────────
    return (
        <Modal onClose={onClose} width={790}>
            <style>{`
                .asf-in::placeholder { color: #9CA3AF; }
                .asf-in option       { background: #FFFFFF; color: #111827; }
                @keyframes fadeUp { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
                @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            `}</style>

            <div style={{ background: "#FFFFFF", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
                {/* ── Header ───────────────────────────────────────────────── */}
                <div style={{ padding: "24px 28px 20px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" }}>
                                <Ico d={IC.truck} s={20} c="#FFFFFF" />
                            </div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", letterSpacing: "-0.3px", marginBottom: 2 }}>Create Shipment</div>
                                <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Mono', monospace", letterSpacing: "0.5px" }}>ADMIN · LOGISTICS OPS</div>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "#FFFFFF", border: "1px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                            <Ico d="M18 6L6 18 M6 6l12 12" s={14} c="#6B7280" />
                        </button>
                    </div>

                    {/* Live route strip */}
                    <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", background: "#FFFFFF", borderRadius: 10, border: "1px solid #E5E7EB", gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: routeActive ? "#2563EB" : "#D1D5DB", boxShadow: routeActive ? "0 0 0 3px #EFF6FF" : "none", flexShrink: 0, transition: "all 0.3s" }} />
                            <span style={{ fontSize: 13, fontWeight: 700, color: f.pickup_city ? "#1D4ED8" : "#6B7280", fontFamily: "'DM Mono', monospace", transition: "color 0.2s", whiteSpace: "nowrap", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>{fromLabel}</span>
                        </div>
                        <div style={{ flex: 1, position: "relative", height: 2, background: "#F3F4F6", borderRadius: 1 }}>
                            <div style={{ position: "absolute", inset: 0, background: "#2563EB", borderRadius: 1, opacity: routeActive ? 1 : 0, transition: "opacity 0.4s" }} />
                            <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-60%)", fontSize: 14 }}></span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: f.delivery_city ? "#1D4ED8" : "#6B7280", fontFamily: "'DM Mono', monospace", transition: "color 0.2s", whiteSpace: "nowrap", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>{toLabel}</span>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: routeActive ? "#2563EB" : "#D1D5DB", boxShadow: routeActive ? "0 0 0 3px #EFF6FF" : "none", flexShrink: 0, transition: "all 0.3s" }} />
                        </div>

                        {/* Computed price + badges */}
                        <div style={{ marginLeft: "auto", paddingLeft: 16, borderLeft: "1px solid #E5E7EB", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                            {computedPrice > 0 && (
                                <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", fontFamily: "'DM Mono', monospace" }}>
                                    ₹{computedPrice.toLocaleString("en-IN")}
                                </span>
                            )}
                            {(() => {
                                const p = PRIORITIES.find(x => x.k === f.priority); return (
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: p.bg, color: p.color, border: `1px solid ${p.border}`, letterSpacing: "0.5px" }}>{p.label}</span>
                                );
                            })()}
                            {f.fragile && <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: "#FEF3C7", color: "#D97706", border: "1px solid #FDE68A" }}>⚠ FRAGILE</span>}
                        </div>
                    </div>
                </div>

                {/* ── Scrollable form body ─────────────────────────────────── */}
                <div style={{ padding: "24px 28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 28, flex: 1 }}>

                    {/* API error banner */}
                    {apiErr && (
                        <div style={{ display: "flex", gap: 10, padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, animation: "fadeUp .2s ease" }}>
                            <Ico d={IC.alert} s={16} c="#DC2626" />
                            <span style={{ fontSize: 13, color: "#DC2626", lineHeight: 1.5, fontWeight: 500 }}>{apiErr}</span>
                        </div>
                    )}

                    {/* 1 ── Client Reference */}
                    <div style={{ zIndex: 10 }}> {/* High z-index so dropdown floats over other inputs */}
                        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#4B5563", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
                                Client Reference
                            </span>
                            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #E5E7EB, transparent)" }} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16, alignItems: "start" }}>

                            {/* Dynamic Searchable Dropdown */}
                            <F label="Sender Client (Business Owner)" required error={errs.sender_id}>
                                <SearchableClientDropdown
                                    clients={clients}
                                    isLoading={isLoadingClients}
                                    selectedId={f.sender_id}
                                    onSelect={(id) => set("sender_id", id)}
                                    error={errs.sender_id}
                                />
                            </F>

                            {/* Info Box */}
                            <div style={{ padding: "12px 16px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 12, color: "#6B7280", lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 10, marginTop: 22 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <span>
                                    Client must be an active <strong style={{ color: "#374151" }}>BUSINESS_CLIENT</strong>.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 2 ── Receiver */}
                    <div>
                        <Section icon={IC.user} label="Receiver Details" accent="#2563EB" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                            <F label="Full Name" icon={IC.user} required error={errs.receiver_name}>
                                <input className="asf-in" value={f.receiver_name} onChange={e => set("receiver_name", e.target.value)}
                                    placeholder="Full name" style={iBase(errs.receiver_name)} onFocus={oF} onBlur={oB} />
                            </F>
                            <F label="Phone" icon={IC.phone} required error={errs.receiver_phone}>
                                <input className="asf-in" type="number" value={f.receiver_phone} onChange={e => set("receiver_phone", e.target.value)}
                                    placeholder="+91 XXXXX XXXXX" style={iBase(errs.receiver_phone)} onFocus={oF} onBlur={oB} maxLength={10} />
                            </F>
                            <F label="Email" icon={IC.mail} required error={errs.receiver_email}>
                                <input className="asf-in" type="email" value={f.receiver_email} onChange={e => set("receiver_email", e.target.value)}
                                    placeholder="receiver@example.com" style={iBase(errs.receiver_email)} onFocus={oF} onBlur={oB} />
                            </F>
                        </div>
                    </div>

                    {/* 3 ── Addresses */}
                    <div>
                        <Section icon={IC.pin} label="Pickup & Delivery" accent="#2563EB" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <AddressBlock prefix="pickup" label="Pickup Address" accentColor="#2563EB" accentBg="#DBEAFE" f={f} set={set} errs={errs} />
                            <AddressBlock prefix="delivery" label="Delivery Address" accentColor="#059669" accentBg="#D1FAE5" f={f} set={set} errs={errs} />
                        </div>
                    </div>

                    {/* 4 ── Package */}
                    <div>
                        <Section icon={IC.pkg} label="Package Details" accent="#2563EB" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                            <F label="Weight (kg)" icon={IC.scale} required error={errs.weight}>
                                <input className="asf-in" type="number" min="0.1" step="0.1" value={f.weight}
                                    onChange={e => handleWeightChange(e.target.value)}
                                    placeholder="0.0" style={iBase(errs.weight)} onFocus={oF} onBlur={oB} />
                            </F>
                            <F label="Price (₹)" icon={IC.cash} required error={errs.price} hint="Auto-computed">
                                <input className="asf-in" type="number" min="1" value={f.price}
                                    onChange={e => set("price", e.target.value)}
                                    placeholder="Auto" style={iBase(errs.price)} onFocus={oF} onBlur={oB} />
                            </F>
                            <F label="Category">
                                <select className="asf-in" value={f.category} onChange={e => set("category", e.target.value)}
                                    style={sBase(false, false)} onFocus={oF} onBlur={oB}>
                                    <option value="">— none —</option>
                                    {["Electronics", "Clothing", "Documents", "Food & Perishables", "Machinery", "Pharmaceuticals", "Other"].map(c => <option key={c}>{c}</option>)}
                                </select>
                            </F>
                            <F label="Pickup Date" icon={IC.cal} error={errs.pickup_date}>
                                <input className="asf-in" type="date" value={f.pickup_date}
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={e => set("pickup_date", e.target.value)}
                                    style={{ ...iBase(errs.pickup_date) }} onFocus={oF} onBlur={oB} />
                            </F>
                        </div>

                        {/* Price breakdown row */}
                        {computedPrice > 0 && (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, marginBottom: 16, animation: "fadeUp 0.2s ease" }}>
                                <span style={{ fontSize: 13, color: "#6B7280" }}>
                                    <span style={{ color: "#374151", fontWeight: 500 }}>{f.weight} kg</span>
                                    {" × "}
                                    <span style={{ color: "#374151", fontWeight: 500 }}>₹{BASE_RATE_PER_KG}/kg</span>
                                    {" × "}
                                    <span style={{ color: "#374151", fontWeight: 500 }}>{PRIORITY_PRICE[f.priority]}× ({f.priority})</span>
                                </span>
                                <span style={{ fontSize: 16, fontWeight: 800, color: "#059669", fontFamily: "'DM Mono', monospace" }}>
                                    = ₹{computedPrice.toLocaleString("en-IN")}
                                </span>
                            </div>
                        )}

                        {/* Fragile toggle */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <button onClick={() => set("fragile", !f.fragile)}
                                style={{ width: 44, height: 24, borderRadius: 12, background: f.fragile ? "#D97706" : "#E5E7EB", border: "none", cursor: "pointer", position: "relative", transition: "all 0.2s", flexShrink: 0 }}>
                                <div style={{ position: "absolute", top: 2, left: f.fragile ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#FFFFFF", transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                            </button>
                            <span style={{ fontSize: 13, fontWeight: f.fragile ? 600 : 500, color: f.fragile ? "#D97706" : "#6B7280", transition: "color 0.2s" }}>
                                {f.fragile ? "Fragile — Handle with care" : "Standard handling"}
                            </span>
                        </div>
                    </div>

                    {/* 5 ── Priority */}
                    <div>
                        <Section icon={IC.arrow} label="Shipping Priority" accent="#2563EB" />
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                            {PRIORITIES.map(p => (
                                <button key={p.k} onClick={() => handlePriorityChange(p.k)}
                                    style={{ padding: "16px", borderRadius: 12, border: `2px solid ${f.priority === p.k ? p.color : "#E5E7EB"}`, background: f.priority === p.k ? p.bg : "#FFFFFF", cursor: "pointer", textAlign: "left", transition: "all 0.15s", position: "relative", overflow: "hidden", boxShadow: f.priority === p.k ? `0 4px 6px -1px ${p.bg}` : "0 1px 2px rgba(0,0,0,0.02)" }}>

                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: f.priority === p.k ? p.color : "#374151" }}>{p.label}</span>
                                        <span style={{ fontSize: 11, color: f.priority === p.k ? p.color : "#9CA3AF", fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{p.mult}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: computedPrice > 0 ? 8 : 0 }}>{p.desc}</div>
                                    {computedPrice > 0 && (
                                        <div style={{ fontSize: 14, fontWeight: 700, color: f.priority === p.k ? p.color : "#4B5563", fontFamily: "'DM Mono', monospace" }}>
                                            ₹{computePrice(f.weight, p.k).toLocaleString("en-IN")}
                                        </div>
                                    )}
                                    {f.priority === p.k && <div style={{ position: "absolute", top: 12, right: 12 }}><Ico d={IC.check} s={14} c={p.color} w={2.5} /></div>}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ── Footer ───────────────────────────────────────────────── */}
                <div style={{ padding: "20px 28px", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F9FAFB" }}>
                    <div style={{ fontSize: 13, minHeight: 20 }}>
                        {Object.keys(errs).length > 0 && (
                            <span style={{ color: "#DC2626", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                                <Ico d={IC.alert} s={14} c="#DC2626" />
                                {Object.keys(errs).length} field{Object.keys(errs).length > 1 ? "s" : ""} need attention
                            </span>
                        )}
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={onClose} disabled={loading}
                            style={{ padding: "10px 20px", borderRadius: 8, background: "#FFFFFF", border: "1px solid #D1D5DB", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                            Cancel
                        </button>
                        <button onClick={submit} disabled={loading}
                            style={{ padding: "10px 24px", borderRadius: 8, background: loading ? "#93C5FD" : "#2563EB", border: "1px solid transparent", color: "#FFFFFF", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, minWidth: 160, justifyContent: "center", boxShadow: loading ? "none" : "0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)", transition: "all 0.2s" }}>
                            {loading ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" style={{ animation: "spin .7s linear infinite" }}>
                                        <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <><Ico d={IC.truck} s={15} c="white" /> Create Shipment</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}