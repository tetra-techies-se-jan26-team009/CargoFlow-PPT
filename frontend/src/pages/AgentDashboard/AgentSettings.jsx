import { useState } from 'react';
//eslint-disable-next-line
import { motion } from 'motion/react';
import { updateAgentProfile } from "../../utils/agentAPI";
import {
    User, Mail, Phone, Lock, Shield,
    ChevronRight, Camera, Save, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import AgentNavbar from '../../components/AgentNavbar';
import { CgPassword } from 'react-icons/cg';

export default function AgentSettings() {
    const { user, setUser } = useAuth();
    const { showToast: addToast } = useToast();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const handleUpdateProfile = async (e) => {

        e.preventDefault();
        setLoading(true);
        try {
            if (!formData.name || !formData.email || !formData.phone) {
                addToast("All fields are required", "error");
                return;
            }

            if (!formData.email.includes("@")) {
                addToast("Invalid email", "error");
                return;
            }
            // API call logic here (e.g., await updateAgentProfile(formData))
            await updateAgentProfile({
                name: formData.name,
                phone: formData.phone,
                password: formData.newPassword,
            });

            setUser(prev => ({
                ...prev,
                name: formData.name,
                phone: formData.phone
            }));

            addToast("Profile updated successfully", "success");
            if (activeTab === "security") {
                if (formData.newPassword !== formData.confirmPassword) {
                    addToast("Passwords do not match", "error");
                    return;
                }

                if (!formData.currentPassword) {
                    addToast("Enter current password", "error");
                    return;
                }
            }
        } catch (err) {
            addToast(err?.response?.data?.detail || "Update failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <title>Settings</title>
            <AgentNavbar />

            <main className="max-w-4xl mx-auto px-4 py-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-slate-950 tracking-tight">Settings</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage your account preferences and security.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="md:col-span-4 space-y-2">
                        <TabItem
                            active={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                            icon={User}
                            label="General Profile"
                        />
                        <TabItem
                            active={activeTab === 'security'}
                            onClick={() => setActiveTab('security')}
                            icon={Shield}
                            label="Password & Security"
                        />
                    </aside>

                    {/* Main Form Area */}
                    <div className="md:col-span-8">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                        >
                            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                                {activeTab === 'profile' ? (
                                    <>
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="relative group">
                                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                                    {user?.name?.charAt(0) || 'A'}
                                                </div>

                                            </div>

                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <InputGroup
                                                label="Full Name"
                                                icon={User}
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <InputGroup
                                                label="Email Address"
                                                icon={Mail}
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                            <InputGroup
                                                label="Phone Number"
                                                icon={Phone}
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 mb-4">
                                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                                            <p className="text-xs text-amber-700 leading-relaxed">
                                                Strong passwords include a mix of letters, numbers, and symbols. Changing your password will log you out of other sessions.
                                            </p>
                                        </div>
                                        <InputGroup
                                            label="Current Password"
                                            icon={Lock}
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                        />
                                        <InputGroup
                                            label="New Password"
                                            icon={Lock}
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        />
                                        <InputGroup
                                            label="Confirm New Password"
                                            icon={Lock}
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="pt-6 border-t border-slate-100 flex justify-end">
                                    <button
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50"
                                    >
                                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// ── Sub-components ──────────────────────────────────────────────────────────
//eslint-disable-next-line no-unused-vars
function TabItem({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${active
                ? 'bg-white shadow-sm border border-slate-200 text-blue-600'
                : 'text-slate-500 hover:bg-slate-100 border border-transparent'
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-sm font-bold tracking-tight">{label}</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
        </button>
    );
}
//eslint-disable-next-line no-unused-vars
function InputGroup({ label, icon: Icon, type = "text", ...props }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                {label}
            </label>
            <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type={type}
                    {...props}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-900 font-medium"
                />
            </div>
        </div>
    );
}