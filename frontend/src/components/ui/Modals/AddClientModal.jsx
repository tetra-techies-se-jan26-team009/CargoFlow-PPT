import { useState } from "react";
import Modal from "../Modal";
import { createClient } from "../../../utils/adminAPI";
// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, s = 14, c = "currentColor", f = "none", w = 1.8 }) => (
    <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill={f}
        stroke={c}
        strokeWidth={w}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d={d} />
    </svg>
);

const IC = {
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    mail: "M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z M22 6l-10 7L2 6",
    phone:
        "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.43 9.5 2 2 0 013.34 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.29 6.29l.79-.79a2 2 0 012.1-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z",
    pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
    lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
    alert:
        "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
    check: "M20 6L9 17l-5-5",
    business:
        "M3 21h18 M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14 M9 9h6 M9 13h6 M9 17h6",
};

// ─── Field Wrapper & Input Styles ─────────────────────────────────────────────
const F = ({ label, icon, error, required, hint, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label
            style={{
                fontSize: 11,
                fontWeight: 600,
                color: error ? "#DC2626" : "#374151",
                display: "flex",
                alignItems: "center",
                gap: 4,
            }}
        >
            {icon && <Ico d={icon} s={12} c={error ? "#DC2626" : "#6B7280"} />}
            {label}
            {required && <span style={{ color: "#DC2626", marginLeft: 2 }}>*</span>}
        </label>
        {children}
        {error && (
            <span
                style={{
                    fontSize: 11,
                    color: "#DC2626",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                }}
            >
                <Ico d={IC.alert} s={11} c="#DC2626" />
                {error}
            </span>
        )}
        {hint && !error && (
            <span style={{ fontSize: 11, color: "#6B7280" }}>{hint}</span>
        )}
    </div>
);

const iBase = (err) => ({
    width: "100%",
    background: err ? "#FEF2F2" : "#FFFFFF",
    border: `1px solid ${err ? "#FCA5A5" : "#D1D5DB"}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: "#111827",
    fontSize: 13,
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s ease",
    boxSizing: "border-box",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
});

const oF = (e) => {
    e.target.style.borderColor = "#2563EB";
    e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
};
const oB = (e) => {
    e.target.style.borderColor = "#D1D5DB";
    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.03)";
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export function AddClientModal({ onClose }) {
    const INIT = { name: "", email: "", phone: "", city: "", password: "" };

    const [f, setF] = useState(INIT);
    const [errs, setErrs] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiErr, setApiErr] = useState(null);
    const [success, setSuccess] = useState(false);

    const set = (k, v) => {
        setF((p) => ({ ...p, [k]: v }));
        if (errs[k])
            setErrs((p) => {
                const n = { ...p };
                delete n[k];
                return n;
            });
    };

    const validate = () => {
        const e = {};
        if (!f.name) e.name = "Owner Name is required";
        if (!f.email) {
            e.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
            e.email = "Must be a valid email address";
        }
        if (!f.phone) {
            e.phone = "Phone number is required";
        } else if (f.phone.length < 10) {
            e.phone = "Must be 10 digits";
        }
        if (!f.city) e.city = "City is required";
        if (!f.password) {
            e.password = "Password is required";
        } else if (f.password.length < 6) {
            e.password = "Minimum 6 characters";
        }
        return e;
    };

    const submit = async () => {
        const e = validate();
        if (Object.keys(e).length) {
            setErrs(e);
            return;
        }

        setLoading(true);
        setApiErr(null);

        try {
            // Format phone to strip spaces just in case
            const payload = {
                ...f,
                phone: f.phone.replace(/\s|\+91/g, ""),
            };

            await createClient(payload);
            setSuccess(true);
        } catch (err) {
            const detail = err?.response?.data?.detail;

            // Crash-proof parsing of FastAPI Pydantic errors
            if (Array.isArray(detail)) {
                const formattedErrors = detail
                    .map((errObj) => `${errObj.loc.at(-1)}: ${errObj.msg}`)
                    .join(" | ");
                setApiErr(`Validation failed: ${formattedErrors}`);
            } else if (typeof detail === "string") {
                setApiErr(detail);
            } else {
                setApiErr(err?.message || "Failed to create client");
            }
        } finally {
            setLoading(false);
        }
    };

    // ─── Success Screen ────────────────────────────────────────────────────────
    if (success)
        return (
            <Modal onClose={onClose} width={420}>
                <style>{`@keyframes popIn{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
                <div
                    style={{
                        padding: "32px 28px",
                        fontFamily: "'DM Sans', sans-serif",
                        background: "#FFFFFF",
                        borderRadius: 16,
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                background: "#D1FAE5",
                                border: "4px solid #A7F3D0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px",
                                animation: "popIn .4s cubic-bezier(.175,.885,.32,1.275)",
                            }}
                        >
                            <Ico d={IC.check} s={32} c="#059669" w={2.5} />
                        </div>
                        <div
                            style={{
                                fontSize: 20,
                                fontWeight: 800,
                                color: "#111827",
                                marginBottom: 6,
                                letterSpacing: "-0.3px",
                            }}
                        >
                            Client Added!
                        </div>
                        <div style={{ fontSize: 13, color: "#6B7280" }}>
                            Business account successfully registered
                        </div>
                    </div>

                    <div
                        style={{
                            background: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                            borderRadius: 12,
                            overflow: "hidden",
                            marginBottom: 24,
                        }}
                    >
                        <div
                            style={{
                                padding: "16px 20px",
                                display: "grid",
                                gridTemplateColumns: "1fr",
                                gap: "12px",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: 10,
                                        color: "#6B7280",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.8px",
                                        marginBottom: 4,
                                    }}
                                >
                                    Client / Business
                                </div>
                                <div
                                    style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}
                                >
                                    {f.name}
                                </div>
                            </div>
                            <div style={{ height: 1, background: "#E5E7EB" }} />
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "12px",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: 10,
                                            color: "#6B7280",
                                            fontWeight: 700,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.8px",
                                            marginBottom: 4,
                                        }}
                                    >
                                        Email
                                    </div>
                                    <div
                                        style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}
                                    >
                                        {f.email}
                                    </div>
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontSize: 10,
                                            color: "#6B7280",
                                            fontWeight: 700,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.8px",
                                            marginBottom: 4,
                                        }}
                                    >
                                        Location
                                    </div>
                                    <div
                                        style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}
                                    >
                                        {f.city}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            onClose();
                            window.location.reload();
                        }}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: 8,
                            background: "#2563EB",
                            border: "1px solid #1D4ED8",
                            color: "#FFFFFF",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}
                    >
                        Done
                    </button>
                </div>
            </Modal>
        );

    // ─── Main Form ─────────────────────────────────────────────────────────────
    return (
        <Modal onClose={onClose} width={500}>
            <style>{`
                .asf-in::placeholder { color: #9CA3AF; }
                @keyframes fadeUp { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
                @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            `}</style>

            <div
                style={{
                    background: "#FFFFFF",
                    borderRadius: 16,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "24px 28px 20px",
                        background: "#F9FAFB",
                        borderBottom: "1px solid #E5E7EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                background: "#2563EB",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
                            }}
                        >
                            <Ico d={IC.business} s={20} c="#FFFFFF" />
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 800,
                                    color: "#111827",
                                    letterSpacing: "-0.3px",
                                    marginBottom: 2,
                                }}
                            >
                                Add New Client
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "#6B7280",
                                    fontFamily: "'DM Mono', monospace",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                REGISTER BUSINESS ACCOUNT
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "#FFFFFF",
                            border: "1px solid #D1D5DB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Ico d="M18 6L6 18 M6 6l12 12" s={14} c="#6B7280" />
                    </button>
                </div>

                {/* Form Body */}
                <div
                    style={{
                        padding: "24px 28px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                    }}
                >
                    {/* API error banner */}
                    {apiErr && (
                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                                padding: "12px 16px",
                                background: "#FEF2F2",
                                border: "1px solid #FECACA",
                                borderRadius: 10,
                                animation: "fadeUp .2s ease",
                            }}
                        >
                            <Ico d={IC.alert} s={16} c="#DC2626" />
                            <span
                                style={{
                                    fontSize: 13,
                                    color: "#DC2626",
                                    lineHeight: 1.5,
                                    fontWeight: 500,
                                }}
                            >
                                {apiErr}
                            </span>
                        </div>
                    )}

                    <F
                        label="Business Owner Name"
                        icon={IC.user}
                        required
                        error={errs.name}
                    >
                        <input
                            className="asf-in"
                            value={f.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="e.g. Apex Traders"
                            style={iBase(errs.name)}
                            onFocus={oF}
                            onBlur={oB}
                        />
                    </F>

                    <div
                        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
                    >
                        <F label="Email Address" icon={IC.mail} required error={errs.email}>
                            <input
                                className="asf-in"
                                type="email"
                                value={f.email}
                                onChange={(e) => set("email", e.target.value)}
                                placeholder="client@company.com"
                                style={iBase(errs.email)}
                                onFocus={oF}
                                onBlur={oB}
                            />
                        </F>
                        <F label="Phone Number" icon={IC.phone} required error={errs.phone}>
                            <input
                                className="asf-in"
                                type="number"
                                value={f.phone}
                                onChange={(e) => set("phone", e.target.value)}
                                placeholder="+91 98765 43210"
                                maxLength={10}
                                style={iBase(errs.phone)}
                                onFocus={oF}
                                onBlur={oB}
                            />
                        </F>
                    </div>

                    <div
                        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
                    >
                        <F label="City" icon={IC.pin} required error={errs.city}>
                            <input
                                className="asf-in"
                                value={f.city}
                                onChange={(e) => set("city", e.target.value)}
                                placeholder="e.g. Mumbai"
                                style={iBase(errs.city)}
                                onFocus={oF}
                                onBlur={oB}
                            />
                        </F>
                        <F
                            label="Initial Password"
                            icon={IC.lock}
                            required
                            error={errs.password}
                            hint="Temporary login access"
                        >
                            <input
                                className="asf-in"
                                type="password"
                                value={f.password}
                                onChange={(e) => set("password", e.target.value)}
                                placeholder="••••••••"
                                style={iBase(errs.password)}
                                onFocus={oF}
                                onBlur={oB}
                            />
                        </F>
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        padding: "20px 28px",
                        borderTop: "1px solid #E5E7EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#F9FAFB",
                    }}
                >
                    <div style={{ fontSize: 13 }}>
                        {Object.keys(errs).length > 0 && (
                            <span
                                style={{
                                    color: "#DC2626",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    fontWeight: 500,
                                }}
                            >
                                <Ico d={IC.alert} s={14} c="#DC2626" /> Fix{" "}
                                {Object.keys(errs).length} error
                                {Object.keys(errs).length > 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 8,
                                background: "#FFFFFF",
                                border: "1px solid #D1D5DB",
                                color: "#374151",
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={submit}
                            disabled={loading}
                            style={{
                                padding: "10px 24px",
                                borderRadius: 8,
                                background: loading ? "#93C5FD" : "#2563EB",
                                border: "1px solid transparent",
                                color: "#FFFFFF",
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: loading ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                minWidth: 140,
                                justifyContent: "center",
                                boxShadow: loading
                                    ? "none"
                                    : "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
                                transition: "all 0.2s",
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#FFFFFF"
                                        strokeWidth="2.5"
                                        style={{ animation: "spin .7s linear infinite" }}
                                    >
                                        <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Ico d={IC.check} s={15} c="white" /> Add Client
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
