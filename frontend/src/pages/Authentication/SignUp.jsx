import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TruckIcon, InboxIcon, PhoneArrowDownLeftIcon } from "@heroicons/react/24/solid";
import api from "../../utils/api";
import { Package } from "lucide-react";

const Field = ({ label, field, type = "text", placeholder, formData, errors, handleChange, handleBlur, ...rest }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            value={formData[field]}
            onChange={handleChange(field)}
            onBlur={handleBlur(field)}
            placeholder={placeholder}
            {...rest}
            className={`w-full border rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 transition
                ${errors[field]
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                }`}
        />
        {errors[field] && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors[field]}
            </p>
        )}
    </div>
);

const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city:"",
        password: "",
        confirmPassword: "",
    });

    const stats = [
        { icon: TruckIcon, value: "99.8%", label: "On-time Delivery" },
        { icon: InboxIcon, value: "250K+", label: "Shipments Managed" },
        { icon: PhoneArrowDownLeftIcon, value: "24/7", label: "Support" },
    ];

    const [errors, setErrors] = useState({});

    const validate = (field, value) => {
        switch (field) {
            case "email":
                if (!value) return "Email is required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
                return "";
            case "password":
                if (!value) return "Password is required";
                if (value.length < 6) return "Password must be at least 6 characters";
                return "";
            case "confirmPassword":
                if (!value) return "Please confirm your password";
                if (value !== formData.password) return "Passwords do not match";
                return "";
            default:
                if (!value) return "This field is required";
                return "";
        }
    };

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        setServerError("");
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleBlur = (field) => () => {
        const err = validate(field, formData[field]);
        setErrors((prev) => ({ ...prev, [field]: err }));
    };

    const handleSubmit = async () => {
        const newErrors = {};
        Object.keys(formData).forEach((field) => {
            const err = validate(field, formData[field]);
            if (err) newErrors[field] = err;
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setIsLoading(true);
        setServerError("");

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
            const detail = err.response?.data?.detail;
            if (detail === "Email already registered") {
                setErrors((prev) => ({ ...prev, email: "This email is already registered" }));
            } else {
                setServerError(detail || "Registration failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            <title>Registration | CargoFlow</title>
            <div className="flex-1 flex flex-col bg-background">
                <div className="flex justify-start px-8 pt-6">
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center px-8 py-6">
                    <div className="w-full max-w-sm">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Your Account</h2>
                        <p className="text-sm text-gray-500 mb-5">Fill in your details to get started.</p>
                        {serverError && (
                            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                                {serverError}
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <Field label="First Name" field="firstName" placeholder="John"
                                        formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
                                </div>
                                <div className="flex-1">
                                    <Field label="Last Name" field="lastName" placeholder="Doe"
                                        formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
                                </div>
                            </div>

                            <Field label="Email Address" field="email" type="email" placeholder="email@business.com"
                                formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />

                            <Field label="Phone Number" field="phone" type="tel" placeholder="+91 98765 43210" maxLength={10}
                                formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />

                            <Field label="City" field="city" type="text" placeholder="New Delhi"
                                formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />

                            <Field label="Password" field="password" type="password" placeholder="Min. 6 characters"
                                formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />

                            <Field label="Confirm Password" field="confirmPassword" type="password" placeholder="Re-enter password"
                                formData={formData} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />

                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="mt-5 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-accent font-semibold text-sm py-2.5 rounded transition"
                        >
                            {isLoading ? "Creating Account..." : "CREATE ACCOUNT"}
                        </button>

                        <p className="mt-4 text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex md:w-1/2 bg-[#0f1c2e] flex-col justify-between p-10 text-accent">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                        <Package className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-xl font-bold text-background">CargoFlow</span>
                </Link>
                <div>
                    <h1 className="text-5xl font-bold leading-snug mb-3">
                        Logistics Partner<br />for SMEs
                    </h1>
                    <p className="text-sm text-accent leading-relaxed mb-8">
                        Trust. Speed. Visibility.<br /> CargoFlow provides reliable shipment management solutions for your growing business.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        {stats.map((s) => (
                            <div key={s.label} className="bg-accent text-[#0f1c2e] rounded-lg p-3 flex flex-col items-center text-center">
                                <span className="mb-1"><s.icon className="w-7 h-7" /></span>
                                <span className="text-base font-bold">{s.value}</span>
                                <span className="text-[10px] mt-0.5">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div />
            </div>
        </div>
    );
};

export default Signup;