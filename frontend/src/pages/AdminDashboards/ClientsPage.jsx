import { useState, useEffect } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { updateClientProfile, toggleClientStatus, getClients } from "../../utils/adminAPI";
import { AddClientModal } from "../../components/ui/Modals/AddClientModal";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/ui/Toast";
import { SquarePen } from 'lucide-react';

export default function ClientsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [modal, setModal] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const { toast, showToast, hideToast } = useToast();

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const [data, setData] = useState({ total_clients: 0, active: 0, overdue: 0, total_revenue: 0 });
    const [clientList, setClientList] = useState([]);

    const statusMeta = {
        Active: { bg: "bg-emerald-100", text: "text-emerald-700" },
        Overdue: { bg: "bg-red-100", text: "text-red-700" },
        Inactive: { bg: "bg-slate-100", text: "text-slate-500" },
        Blocked: { bg: "bg-gray-200", text: "text-gray-700" }
    };

    // Initialize Edit Form when a client is selected
    const handleViewClient = (client) => {
        setSelectedClient(client);
        setEditForm({
            contact_person: client.contact_person || "",
            business_name: client.business_name || "",
            email: client.email || "",
            phone: client.phone || "",
            city: client.city || ""
        });
        setIsEditing(false);
        setModal('viewClient');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const fetchData = async () => {
        try {
            const res = await getClients();
            setData({
                total_clients: res?.total_clients || 0,
                active: res?.active || 0,
                overdue: res?.overdue || 0,
                total_revenue: res?.total_revenue || 0
            });
            setClientList((res?.clients || []).map(c => {
                const extractedId = parseInt(c.client_id.split("-")[1]);

                return {
                    ...c,
                    db_id: extractedId,
                    display_id: c.client_id,
                    business_name: c.business || "Unknown Client",
                    joined_date: c.joined ? new Date(c.joined).toLocaleDateString() : "N/A",
                    is_active: c.status === "Active"
                };
            }));
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = clientList.filter(c => {
        const matchStatus = filter === "All" || c.status === filter;
        const matchSearch = !search || [c.business_name, c.contact_person, c.city].some(v => v?.toLowerCase().includes(search.toLowerCase()));
        return matchStatus && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSaveProfile = async () => {
        try {
            setIsUpdating(true);
            const payload = {
                name: editForm.contact_person,
                email: editForm.email,
                phone: editForm.phone,
                city: editForm.city
            };
            await updateClientProfile(selectedClient.db_id, payload);
            setSelectedClient(prev => ({ ...prev, ...payload }));
            await fetchData();
            setIsEditing(false);
            showToast("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            showToast("Something went wrong", "error");
        } finally {
            setIsUpdating(false);
        }
    };
    const handleToggleStatus = async () => {
        try {
            setIsUpdating(true);
            const response = await toggleClientStatus(selectedClient.db_id);
            setSelectedClient(prev => ({
                ...prev,
                is_active: response.is_active
            }));

            setClientList(prevList =>
                prevList.map(client =>
                    client.db_id === selectedClient.db_id
                        ? { ...client, is_active: response.is_active, status: response.is_active ? "Active" : "Inactive" }
                        : client
                )
            );
            fetchData();

        } catch (err) {
            console.error(err);
            showToast("Failed to update status. Please try again.", "error");
        } finally {
            setIsUpdating(false);
        }
    };
    const isClientActive = selectedClient?.is_active;

    return (
        <div className="flex flex-col h-screen bg-[#F1F5F9] font-sans overflow-hidden">
            <title>Clients | CargoFlow</title>
            <DashboardNavbar />

            <main className="flex-1 overflow-hidden px-[100px] py-6 flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-[22px] font-extrabold text-[#0F172A] m-0 tracking-tight">Manage Clients</h1>
                        <p className="text-xs text-[#94A3B8] mt-1">{data.total_clients} registered business clients</p>
                    </div>
                    <button onClick={() => setModal('addClient')} className="flex items-center gap-1.5 px-[18px] py-[9px] bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
                        <span>+</span> Add Client
                    </button>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { label: "Total Clients", val: data.total_clients, color: "text-[#2563EB]" },
                        { label: "Active", val: data.active, color: "text-[#10B981]" },
                        { label: "Overdue", val: data.overdue, color: "text-[#EF4444]" },
                        { label: "Total Revenue", val: `₹${data.total_revenue.toLocaleString()}`, color: "text-[#7C3AED]" },
                    ].map(k => (
                        <div key={k.label} className="bg-white rounded-xl p-[14px_18px] border border-[#F1F5F9] shadow-sm">
                            <div className={`text-[26px] font-extrabold ${k.color} tracking-tighter`}>{k.val}</div>
                            <div className="text-[11px] text-[#94A3B8] mt-1 uppercase font-bold">{k.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex gap-2.5 items-center">
                    <input className="flex-1 max-w-[300px] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none bg-white font-medium" placeholder="Search clients, contacts, cities..." value={search} onChange={e => setSearch(e.target.value)} />
                    {["All", "Active", "Overdue", "Inactive"].map(f => (
                        <button key={f} onClick={() => { setFilter(f); setCurrentPage(1); }} className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold ${filter === f ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]' : 'bg-white border-[#E2E8F0] text-[#64748B]'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="flex-1 bg-white rounded-xl border border-[#F1F5F9] shadow-sm flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="sticky top-0 bg-[#F8FAFC] z-10 shadow-sm">
                                <tr>
                                    {["Company Name", "Contact Person", "Email", "Phone", "City", "Shipments", "Revenue", "Status", "Joined", "Actions"].map(h => (
                                        <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-[#94A3B8] uppercase border-b border-[#F1F5F9] whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map(c => (
                                    <tr key={c.id} className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8.5 h-8.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-xs font-bold shrink-0">{c.business_name[0]}</div>
                                                <div>
                                                    <div className="text-xs font-bold text-[#0F172A]">{c.contact_person}</div>
                                                    <div className="text-[10px] text-[#94A3B8]">{c.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-[#334155]">{c.contact_person}</td>
                                        <td className="p-4 text-[11px] text-[#64748B]">{c.email}</td>
                                        <td className="p-4 text-[11px] text-[#64748B] whitespace-nowrap">{c.phone}</td>
                                        <td className="p-4 text-xs text-[#64748B]">{c.city}</td>
                                        <td className="p-4 text-[13px] font-bold text-[#0F172A]">{c.shipments}</td>
                                        <td className="p-4 text-xs font-bold text-[#2563EB]">{c.revenue_str}</td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusMeta[c.status]?.bg} ${statusMeta[c.status]?.text}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[11px] text-[#94A3B8]">{c.joined_date}</td>
                                        <td className="p-4">
                                            <button onClick={() => handleViewClient(c)} className="px-4 py-1.5 border border-[#E2E8F0] rounded-md bg-white text-[#334155] text-[11px] font-bold hover:bg-gray-50 uppercase tracking-tighter">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-4 border-t border-[#F1F5F9] flex justify-between items-center bg-white">
                        <span className="text-[11px] text-[#94A3B8]">Showing {paginatedData.length} of {filtered.length} clients</span>
                        <div className="flex gap-2">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 text-xs border border-[#E2E8F0] rounded-md hover:bg-gray-50 disabled:opacity-30 font-semibold">Previous</button>
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 text-xs border border-[#E2E8F0] rounded-md hover:bg-gray-50 disabled:opacity-30 font-semibold">Next</button>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- FIXED VIEW CLIENT MODAL --- */}
            {modal === 'viewClient' && selectedClient && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-200">
                        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-none">Client Profile</h2>
                                <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">Admin Control Center</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition"
                                    >
                                        <SquarePen size={18} className="text-slate-600" />
                                    </button>
                                ) : (
                                    <button onClick={handleSaveProfile} disabled={isUpdating} className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-lg hover:bg-blue-700 uppercase tracking-widest disabled:opacity-50 transition-all">
                                        {isUpdating ? "Saving..." : "Save Changes"}
                                    </button>
                                )}
                                <button onClick={() => setModal(null)} className="text-slate-400 hover:text-black text-2xl ml-2 leading-none">&times;</button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                            {/* Profile Header Card */}
                            <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-50">
                                {/* Avatar Color based on boolean is_active */}
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0 transition-colors ${isClientActive ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                    {editForm.contact_person?.[0]}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-tight">{editForm.contact_person}</h3>
                                    <div className="mt-2 flex gap-2">
                                        {/* Status Badge: Now using the boolean state directly */}
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${isClientActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {isClientActive ? "Account Active" : "Account Blocked"}
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-50 text-slate-400 uppercase tracking-wider border border-slate-100">
                                            Partner Since {selectedClient.joined_date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                {[
                                    { label: "Business Name", name: "business_name" },
                                    { label: "Contact Person", name: "contact_person" },
                                    { label: "Official Email", name: "email" },
                                    { label: "Phone Number", name: "phone" },
                                    { label: "Operational City", name: "city" },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">{field.label}</label>
                                        <input
                                            disabled={!isEditing}
                                            name={field.name}
                                            value={editForm[field.name] || ""}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${isEditing ? 'border-blue-200 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500' : 'border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed'}`}
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Shipments Count</label>
                                    <div className="w-full px-4 py-2.5 rounded-lg text-sm font-bold bg-slate-50 border border-slate-100 text-slate-900">
                                        {selectedClient.shipments} total deliveries
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="mt-12 p-6 bg-red-50/50 rounded-2xl border border-red-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-xs font-black text-red-700 uppercase tracking-widest">Danger Zone</h4>
                                        <p className="text-[10px] text-red-600 mt-1 font-medium">Temporary disable or remove this client's access.</p>
                                    </div>
                                    <button
                                        onClick={handleToggleStatus}
                                        disabled={isUpdating}
                                        className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border shadow-sm ${isClientActive
                                            ? "bg-white border-red-200 text-red-600 hover:bg-red-600 hover:text-white"
                                            : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                                            }`}
                                    >
                                        {isClientActive ? "Block Client" : "Unblock Client"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {modal === 'addClient' && <AddClientModal onClose={() => setModal(null)} />}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />
        </div>
    );
}