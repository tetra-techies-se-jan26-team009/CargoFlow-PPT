import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { TruckIcon, InboxIcon, PhoneArrowDownLeftIcon } from "@heroicons/react/24/solid";
import { Package, Eye, EyeOff, Loader2, ShieldCheck, Zap, Navigation } from "lucide-react"; 
import { loginUser } from "../../utils/auth";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/ui/Toast";

const AgentLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { toast, showToast, hideToast } = useToast();
    
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        
        if (!email || !password) {
            showToast("Credentials required for system access", "error");
            return;
        }
        
        setIsLoading(true);
        try {
            const data = await loginUser(email, password);
            setUser({ email, role: data.role });

            switch (data.role) {
                case "ADMIN": navigate("/admin/dashboard"); break;
                case "DELIVERY_AGENT": navigate("/agent/dashboard"); break;
                case "BUSINESS_CLIENT": 
                    showToast("Access Denied: Client accounts restricted.", "error"); 
                    break;
                default: navigate("/");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || "Authentication sequence failed.";
            showToast(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans selection:bg-blue-100 bg-white">
            <title>Agent Access | CargoFlow</title>

            {/* --- LEFT PANEL: Operational Overview --- */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#0B1F3B] flex-col justify-between p-12 text-white relative overflow-hidden">
                {/* Decorative Grid Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                
                <Link to="/" className="flex items-center gap-2 z-10">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/40">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter">CargoFlow</span>
                </Link>

                <div className="max-w-md z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">System Live: v2.4</span>
                    </div>
                    <h1 className="text-5xl font-black leading-tight mb-6 tracking-tighter">
                        Logistics <br /><span className="text-blue-500 text-6xl">Intelligence.</span>
                    </h1>
                    
                    <div className="space-y-4">
                        {[
                            { icon: Navigation, val: "AI Optimization", lab: "Real-time calculated paths", color: "text-blue-400" },
                            { icon: ShieldCheck, val: "99.1% Target", lab: "Industry leading efficiency", color: "text-emerald-400" },
                            { icon: Zap, val: "Instant Dispatch", lab: "24/7 technical Liaison", color: "text-amber-400" }
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                                <div className={`p-3 rounded-xl bg-slate-900 group-hover:scale-110 transition-transform`}>
                                    <s.icon size={20} className={s.color} />
                                </div>
                                <div>
                                    <div className="text-sm font-black tracking-tight">{s.val}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{s.lab}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] z-10">
                    Proprietary Agent Framework
                </div>
            </div>

            {/* --- RIGHT PANEL: Secure Access --- */}
            <div className="flex-1 flex flex-col bg-[#F8FAFC] justify-center items-center p-8 relative">
                <div className="absolute top-6 right-8">
                    <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2">
                        Back to main <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="w-full max-w-[420px] bg-white p-12 rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100">
                    <header className="mb-10 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Navigation className="text-blue-600 w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Agent Terminal</h2>
                        <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Secure Personnel Login</p>
                    </header>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Work Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                                className={`w-full bg-slate-50 border px-5 py-4 rounded-2xl text-sm font-bold transition-all focus:ring-4 focus:ring-blue-500/10 outline-none ${emailError ? "border-red-500" : "border-slate-100 focus:border-blue-600 focus:bg-white"}`}
                                placeholder="agent.id@cargoflow.com"
                            />
                            {emailError && <p className="mt-2 text-[10px] text-red-500 font-black uppercase tracking-tight italic">! {emailError}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Key</label>
                                <Link to="/forgot-password" opacity-70 className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.25em] py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-[0.97] disabled:opacity-70 flex justify-center items-center gap-3 mt-8"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <>Secure Login <ArrowRight size={14} /> </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-50">
                        <p className="text-center text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                            New Personnel? <br />
                            <span className="text-slate-900">Registration is handled by the Admin</span>
                        </p>
                    </div>
                </div>
            </div>
            <Toast 
                show={toast.show} 
                message={toast.message} 
                type={toast.type} 
                onClose={hideToast} 
            />
        </div>
    );
};

// Helper for the arrow icon
const ArrowRight = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

export default AgentLogin;