import { useState, useEffect } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { getCurrentUser, updateProfile } from "../../utils/auth";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/ui/Toast";
import { User, Lock, Bell, Globe, Shield } from 'lucide-react';

const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "regional", label: "Regional", icon: Globe },
];

// --- Components ---
const Toggle = ({ on, onToggle }) => (
    <button onClick={onToggle}
        className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors duration-200 shrink-0 ${on ? "bg-blue-600" : "bg-slate-200"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 shadow-sm ${on ? "left-5.5" : "left-0.5"}`} />
    </button>
);

const FieldRow = ({ label, desc, children, highlight = false }) => (
    <div className={`flex justify-between items-start py-5 border-b border-slate-50 last:border-0 ${highlight ? "bg-blue-50/30 -mx-4 px-4 rounded-lg" : ""}`}>
        <div className="flex-1 mr-6">
            <div className="text-[13px] font-bold text-slate-900 leading-none mb-1.5">{label}</div>
            {desc && <div className="text-[11px] text-slate-400 font-medium leading-relaxed">{desc}</div>}
        </div>
        <div className="shrink-0">{children}</div>
    </div>
);

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    const [profile, setProfile] = useState({
        name: "", email: "", phone: "", company: "CargoFlow Pvt. Ltd.", timezone: "Asia/Kolkata",
        lang: "English (India)", currency: "INR (₹)"
    });

    const [notifs, setNotifs] = useState({
        email_shipment: true, email_delay: true, email_report: false,
        sms_delivery: true, sms_delay: false, push_all: true,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    setProfile(prev => ({
                        ...prev,
                        name: user.name || "",
                        email: user.email || "",
                        phone: user.phone || "",
                    }));
                }
            } catch (err) {
                showToast("Failed to load user data", "error");
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [showToast]);

    const handleSave = async (category) => {
        setSaving(true);
        try {
            if (category === 'profile') {
                const updatedUser = await updateProfile({
                    name: profile.name,
                    phone: profile.phone
                });

                // Trigger a global event to notify the Navbar
                const event = new CustomEvent("userProfileUpdated", { detail: updatedUser });
                window.dispatchEvent(event);
            }

            showToast("Profile updated successfully!", "success");
        } catch (err) {
            showToast("Update failed", "error");
            console.error("Error updating profile:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-black uppercase tracking-tighter">Initializing Secure Environment...</div>;

    return (
        <div className="flex flex-col h-screen bg-[#F8FAFC] font-sans overflow-hidden">
            <title>Settings | CargoFlow</title>
            <DashboardNavbar />

            <main className="flex-1 overflow-auto px-[100px] py-8 max-w-[1400px] mx-auto w-full">
                {/* Header Section */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Configure your personal experience and security protocols</p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-100">
                        Level: Enterprise Admin
                    </div>
                </div>

                <div className="grid grid-cols-[240px_1fr] gap-8">
                    {/* Navigation Sidebar */}
                    <div className="space-y-1">
                        {tabs.map(t => {
                            const IconComponent = t.icon; // Get the component reference
                            const active = activeTab === t.key;

                            return (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 border-none cursor-pointer text-left
                ${active ? "bg-white shadow-sm border-slate-100 text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                                >
                                    {/* Render the Lucide Icon */}
                                    <IconComponent
                                        size={16}
                                        strokeWidth={active ? 3 : 2}
                                        className={active ? "text-blue-600" : "text-slate-400"}
                                    />
                                    <span className={`text-[13px] ${active ? "font-black" : "font-bold"}`}>
                                        {t.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {/* Content Panel */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[500px] overflow-hidden">
                        <div className="flex-1 p-10">

                            {/* --- PROFILE TAB --- */}
                            {activeTab === "profile" && (
                                <div className="animate-in fade-in duration-300">
                                    <h2 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Public Profile</h2>

                                    <div className="mb-10 p-6 bg-slate-50 rounded-2xl flex items-center gap-6 border border-slate-100">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-200">
                                            {profile.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Identification</p>
                                            <h3 className="text-lg font-black text-slate-900 leading-none">{profile.name}</h3>
                                            <p className="text-xs text-slate-400 mt-1.5 font-bold">{profile.company}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <FieldRow label="Legal Name" desc="Used for official documents and billing.">
                                            <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                                                className="w-64 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none" />
                                        </FieldRow>

                                        <FieldRow label="Login Email" desc="The primary address linked to this account.">
                                            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                                                <span className="text-sm font-bold text-slate-400">{profile.email}</span>
                                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Verified</span>
                                            </div>
                                        </FieldRow>

                                        <FieldRow label="Phone Number" desc="Used for emergency delay alerts and 2FA.">
                                            <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                                className="w-64 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none" />
                                        </FieldRow>
                                    </div>

                                    <button onClick={() => handleSave('profile')} disabled={saving}
                                        className="mt-10 px-8 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all disabled:opacity-50">
                                        {saving ? "Processing..." : "Commit Changes"}
                                    </button>
                                </div>
                            )}

                            {/* --- NOTIFICATIONS TAB --- */}
                            {activeTab === "notifications" && (
                                <div className="animate-in fade-in duration-300">
                                    <h2 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Notification Channels</h2>

                                    <section className="mb-10">
                                        <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Critical System Alerts</h3>
                                        <FieldRow label="Delay & Risk Alerts" desc="Immediate email/push when a high-priority shipment is blocked.">
                                            <Toggle on={notifs.email_delay} onToggle={() => setNotifs({ ...notifs, email_delay: !notifs.email_delay })} />
                                        </FieldRow>
                                        <FieldRow label="Status Transitions" desc="Updates when cargo moves from Processing to In-Transit.">
                                            <Toggle on={notifs.email_shipment} onToggle={() => setNotifs({ ...notifs, email_shipment: !notifs.email_shipment })} />
                                        </FieldRow>
                                    </section>

                                    <section>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Operational Reports</h3>
                                        <FieldRow label="Weekly Performance" desc="Summary of delivery times and agent efficiency.">
                                            <Toggle on={notifs.email_report} onToggle={() => setNotifs({ ...notifs, email_report: !notifs.email_report })} />
                                        </FieldRow>
                                    </section>

                                    <button onClick={() => handleSave('preferences')}
                                        className="mt-10 px-8 py-3 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all">
                                        Update Preferences
                                    </button>
                                </div>
                            )}

                            {/* --- REGIONAL TAB --- */}
                            {activeTab === "regional" && (
                                <div className="animate-in fade-in duration-300">
                                    <h2 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Localization</h2>
                                    <div className="space-y-2">
                                        <FieldRow label="Preferred Language" desc="Primary interface and communication language.">
                                            <select className="w-64 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold">
                                                <option>English (India)</option>
                                                <option>Hindi</option>
                                            </select>
                                        </FieldRow>
                                        <FieldRow label="Currency Unit" desc="Default currency for invoices and dashboards.">
                                            <select className="w-64 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold">
                                                <option>INR (₹) - Indian Rupee</option>
                                                <option>USD ($) - US Dollar</option>
                                            </select>
                                        </FieldRow>
                                    </div>
                                    <button onClick={() => handleSave('regional settings')}
                                        className="mt-10 px-8 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all">
                                        Save Regional Settings
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>

            {/* --- Global Notification --- */}
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
        </div>
    );
}