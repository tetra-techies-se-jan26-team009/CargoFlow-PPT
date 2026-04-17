import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TruckIcon, InboxIcon, PhoneArrowDownLeftIcon } from "@heroicons/react/24/solid";
import { Package, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import api from "../../utils/api";

const Field = ({ label, field, type = "text", placeholder, formData, errors, handleChange, handleBlur, showVisibilityToggle, onToggleVisibility, ...rest }) => (
    <div className="group">
        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 group-focus-within:text-blue-600 transition-colors">
            {label}
        </label>
        <div className="relative">
            <input
                type={type}
                value={formData[field]}
                onChange={handleChange(field)}
                onBlur={handleBlur(field)}
                placeholder={placeholder}
                {...rest}
                className={`w-full bg-slate-50 border px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 outline-none
                    ${errors[field]
                        ? "border-red-500 focus:ring-4 focus:ring-red-500/10 shadow-[0_0_0_1px_rgba(239,68,68,1)]"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                    }`}
            />
            {showVisibilityToggle && (
                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    {type === "password" ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            )}
        </div>
        {errors[field] && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                <XCircle size={12} /> {errors[field]}
            </div>
        )}
    </div>
);

const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phone: "", city: "", password: "", confirmPassword: ""
    });
    const [errors, setErrors] = useState({});

    // Real-time password strength logic
    useEffect(() => {
        const pass = formData.password;
        let strength = 0;
        if (pass.length > 5) strength += 25;
        if (/[A-Z]/.test(pass)) strength += 25;
        if (/[0-9]/.test(pass)) strength += 25;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
        setPasswordStrength(strength);
    }, [formData.password]);

    const validate = (field, value) => {
        switch (field) {
            case "email":
                return !value ? "Email required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : "";
            case "phone":
                return !value ? "Phone required" : value.length < 10 ? "Enter 10-digit mobile number" : "";
            case "password":
                return !value ? "Password required" : value.length < 6 ? "Must be 6+ characters" : "";
            case "confirmPassword":
                return value !== formData.password ? "Passwords do not match" : "";
            default:
                return !value ? "Required" : "";
        }
    };

    const handleChange = (field) => (e) => {
        let value = e.target.value;
        if (field === "phone") value = value.replace(/\D/g, "").slice(0, 10);
        setFormData(prev => ({ ...prev, [field]: value }));
        setServerError("");
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const handleBlur = (field) => () => {
        const err = validate(field, formData[field]);
        setErrors(prev => ({ ...prev, [field]: err }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        Object.keys(formData).forEach(f => {
            const err = validate(f, formData[f]);
            if (err) newErrors[f] = err;
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setIsLoading(true);
        try {
            await api.post("/api/auth/register", {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                city: formData.city,
                phone: formData.phone,
                password: formData.password,
            });
            navigate("/login", { state: { registered: true } });
        } catch (err) {
            setServerError(err.response?.data?.detail || "System temporarily unavailable.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans selection:bg-blue-100">
            <title>Join CargoFlow | Enterprise Logistics</title>

            <div className="flex-1 flex flex-col bg-white overflow-y-auto">
                <div className="flex justify-start px-8 pt-8">
                    <Link to="/" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        Exit to Home
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center px-8 py-12">
                    <div className="w-full max-w-md">
                        <header className="mb-10">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Start shipping.</h2>
                            <p className="text-slate-400 font-medium mt-2">Create your CargoFlow enterprise account today.</p>
                        </header>

                        {serverError && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 text-red-700 text-sm font-bold animate-in zoom-in duration-300">
                                <XCircle className="shrink-0" size={20} /> {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Field label="First Name" field="firstName" placeholder="John" formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
                                </div>
                                <div className="flex-1">
                                    <Field label="Last Name" field="lastName" placeholder="Doe" formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
                                </div>
                            </div>

                            <Field label="Email Address" field="email" type="email" placeholder="name@company.com" formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Field label="Phone" field="phone" type="tel" placeholder="9876543210" formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
                                </div>
                                <div className="flex-1">
                                    <Field label="Operational City" field="city" placeholder="New Delhi" formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Field label="Password" field="password" type={showPassword ? "text" : "password"} placeholder="••••••••" formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} showVisibilityToggle onToggleVisibility={() => setShowPassword(!showPassword)} />
                                {/* Password Strength Bar */}
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                                    <div className={`h-full transition-all duration-500 ${passwordStrength >= 25 ? 'bg-red-400' : 'bg-transparent'}`} style={{ width: '25%' }}></div>
                                    <div className={`h-full transition-all duration-500 ${passwordStrength >= 50 ? 'bg-amber-400' : 'bg-transparent'}`} style={{ width: '25%' }}></div>
                                    <div className={`h-full transition-all duration-500 ${passwordStrength >= 75 ? 'bg-blue-400' : 'bg-transparent'}`} style={{ width: '25%' }}></div>
                                    <div className={`h-full transition-all duration-500 ${passwordStrength >= 100 ? 'bg-emerald-400' : 'bg-transparent'}`} style={{ width: '25%' }}></div>
                                </div>
                            </div>

                            <Field label="Verify Password" field="confirmPassword" type="password" placeholder="••••••••" formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 mt-4"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Establish Account"}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Already part of the network? <Link to="/login" className="text-blue-600 hover:underline underline-offset-4">Log In</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Side Panel: Brand Reinforcement */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#0f1c2e] flex-col justify-between p-12 text-white relative overflow-hidden shadow-[-20px_0_40px_rgba(0,0,0,0.2)]">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_30%_30%,#2563eb_0%,transparent_50%)]" />

                <Link to="/" className="flex items-center gap-2 z-10">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-2xl">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter">CargoFlow</span>
                </Link>

                <div>

                    <h1 className="text-5xl font-bold leading-snug mb-3">

                        Logistics Partner<br />for SMEs

                    </h1>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        {[
                            { icon: TruckIcon, val: "99.8%", lab: "Transit Precision" },
                            { icon: InboxIcon, val: "250K+", lab: "Active Nodes" },
                            { icon: PhoneArrowDownLeftIcon, val: "24/7", lab: "Direct Liaison" }
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-default">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-blue-600 transition-colors">
                                    <s.icon className="w-6 h-6 text-blue-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <div className="text-xl font-black">{s.val}</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{s.lab}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest z-10 opacity-50">
                    Proprietary Software © 2026 CargoFlow Technologies.
                </div>
            </div>
        </div>
    );
};

export default Signup;