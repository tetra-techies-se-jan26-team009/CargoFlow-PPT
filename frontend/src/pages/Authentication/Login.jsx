import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TruckIcon, InboxIcon, PhoneArrowDownLeftIcon } from "@heroicons/react/24/solid";
import { loginUser } from "../../utils/auth";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (val) => {
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address";
    return "";
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const stats = [
    { icon: TruckIcon, value: "99.8%", label: "On-time Delivery" },
    { icon: InboxIcon, value: "250K+", label: "Shipments Managed" },
    { icon: PhoneArrowDownLeftIcon, value: "24/7", label: "Support" },
  ];

  const handleLogin = async () => {
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    if (!password) { alert("Enter your password"); return; }

    try {
      const data = await loginUser(email, password);
      setUser({ email, role: data.role });

      switch (data.role) {
        case "ADMIN":
          navigate("/admin/dashboard"); break;
        case "DELIVERY_AGENT":
          navigate("/agent/dashboard"); break;
        case "BUSINESS_CLIENT":
          navigate("/client/dashboard"); break;
        default: navigate("/");
      }
    } catch (err) {
      alert(err.message || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden md:flex md:w-1/2 bg-[#0f1c2e] flex-col justify-between p-10 text-accent">
        <div className="text-white font-bold text-lg tracking-wide">
          CargoFlow
        </div>
        <div className="mx-24">
          <h1 className="text-5xl font-bold leading-snug mb-3">
            Logistics Partner<br />for SMEs
          </h1>
          <p className="text-md text-accent leading-relaxed mb-8">
            Trust. Speed. Visibility. <br /> CargoFlow provides reliable shipment management solutions for your growing business.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="bg-accent text-[#0f1c2e] rounded-lg p-3 flex flex-col items-center text-center">
                <span className="mb-1">
                  <s.icon className="w-7 h-7" />
                </span>
                <span className="text-base font-bold">{s.value}</span>
                <span className="text-[10px] mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div />
      </div>
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex justify-end px-8 pt-6">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Log In to Your Account</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                onBlur={handleEmailBlur}
                placeholder="email@business.com"
                className={`w-full border rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 transition
                  ${emailError
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                  }`}
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {emailError}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
              />
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm py-2.5 rounded transition"
            >
              LOG IN
            </button>

            <p className="mt-4 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;