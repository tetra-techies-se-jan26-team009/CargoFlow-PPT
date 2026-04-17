import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { TruckIcon, InboxIcon, PhoneArrowDownLeftIcon } from "@heroicons/react/24/solid";
// Add Eye icons from lucide
import { Package, Eye, EyeOff, Loader2 } from "lucide-react"; 
import { loginUser, getCurrentUser } from "../../utils/auth";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // NEW: Loading state
  
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (val) => {
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address";
    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // NEW: Prevents page reload
    
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    
    setIsLoading(true); // NEW: Start loading
    try {
      const data = await loginUser(email, password);
      const userData = await getCurrentUser();
      setUser(userData);

      switch (data.role) {
        case "ADMIN": navigate("/admin/dashboard"); break;
        case "BUSINESS_CLIENT": navigate("/dashboard"); break;
        case "DELIVERY_AGENT": 
           // In industry, we use Toasts instead of Alerts
           alert("Agents must use the CargoFlow Mobile App."); 
           break;
        default: navigate("/");
      }
    } catch (err) {
      alert(err.message || "Invalid Credentials");
    } finally {
      setIsLoading(false); // NEW: End loading
    }
  };

  return (

    <div className="min-h-screen flex font-sans selection:bg-blue-100">
      <title>Authorization | CargoFLow</title>
      {/* Left Panel: Narrative & Stats */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f1c2e] flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Abstract background flare for that "Premium" feel */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_30%_30%,#2563eb_0%,transparent_50%)]" />
        
        <Link to="/" className="flex items-center gap-2 z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/40">
            <Package className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter ">CargoFlow</span>
        </Link>

        <div className="max-w-md mx-auto z-10">
          <h1 className="text-6xl font-black leading-tight mb-6 tracking-tighter">
            Smart Logistics <br /><span className="text-blue-500">for Scale.</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">
            Streamline your supply chain with real-time intelligence and enterprise-grade reliability.
          </p>
          
          <div className="grid grid-cols-3 gap-4">
            {[{ icon: TruckIcon, val: "99.8%", lab: "Uptime" },
              { icon: InboxIcon, val: "250K+", lab: "Shipments" },
              { icon: PhoneArrowDownLeftIcon, val: "24/7", lab: "Expertise" }
            ].map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/10">
                <s.icon className="w-6 h-6 text-blue-400 mb-2" />
                <div className="text-xl font-bold">{s.val}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{s.lab}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-slate-500 text-xs font-medium z-10">© 2026 CargoFlow Technologies. All rights reserved.</div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex-1 flex flex-col bg-slate-50 justify-center items-center p-8">
        <div className="w-full max-w-[400px] bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <header className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Enter your credentials to access the platform.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                className={`w-full bg-slate-50 border px-4 py-3 rounded-xl text-sm font-bold transition-all focus:ring-4 focus:ring-blue-500/10 outline-none ${emailError ? "border-red-500" : "border-slate-200 focus:border-blue-500"}`}
                placeholder="name@company.com"
              />
              {emailError && <p className="mt-2 text-xs text-red-500 font-bold italic">{emailError}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" opacity-70 className="text-[11px] font-black text-blue-600 uppercase hover:text-blue-800 transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Authorize Access"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            New here? <Link to="/register" className="text-blue-600 hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;