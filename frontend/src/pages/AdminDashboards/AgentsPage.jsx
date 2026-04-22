import { useState, useEffect } from "react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { getAgents, updateAgent } from "../../utils/adminAPI";
import { AddAgentModal } from "../../components/ui/Modals/AddAgentModal";
import { AgentProfileModal } from "../../components/ui/Modals/AgentProfileModal";
import { approveDuty } from "../../utils/adminAPI";

const Icon = ({
    d,
    size = 16,
    stroke = "currentColor",
    fill = "none",
    strokeWidth = 1.6,
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d={d} />
    </svg>
);

const icons = {
    plus: "M12 5v14 M5 12h14",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    phone:
        "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.43 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.34 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.29 6.29l.79-.79a2 2 0 012.1-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    truck:
        "M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
};



const statusColor = { Active: "#22C55E", Block: "#FF0000", Off: "#9CA3AF" };
const statusBg = { Active: "#D1FAE5", Block: "#FAD1D1", Off: "#F1F5F9" };
const statusTxt = { Active: "#065F46", Idle: "#92400E", Off: "#64748B" };

function ConfirmOffDutyModal({ agent, onConfirm, onCancel }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
            <div style={{ background: "white", padding: 24, borderRadius: 16, width: 400, textAlign: "center", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}></div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                    {agent.pending_duty_status === "OFF_DUTY"
                        ? "Confirm Off-Duty?"
                        : "Confirm On-Duty?"}
                </h3>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>
                    Agent <b>{agent.name}</b> wants to go{" "}
                    <b>{agent.pending_duty_status === "OFF_DUTY" ? "Off-Duty" : "On-Duty"}</b>.{agent.pending_duty_status === "OFF_DUTY"
                        ? "They will no longer be visible for new shipment assignments."
                        : "They will become available for new shipment assignments."}
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={onCancel}
                        style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #E2E8F0", background: "white", fontWeight: 600, cursor: "pointer" }}
                    >
                        {agent.pending_duty_status === "OFF_DUTY"
                            ? "Keep On-Duty"
                            : "Keep Off-Duty"}
                    </button>
                    <button
                        onClick={() => onConfirm(agent.id)}
                        style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "#EF4444", color: "white", fontWeight: 600, cursor: "pointer" }}
                    >
                        {agent.pending_duty_status === "OFF_DUTY"
                            ? "Confirm Off-Duty"
                            : "Confirm On-Duty"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AgentsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [modal, setModal] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);


    // Strict State Management Rule
    const [data, setData] = useState({ total_agents: 0, active_now: 0, blocked: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agentList, setAgentList] = useState([]);
    const [pendingOffDuty, setPendingOffDuty] = useState(null);

    const openModal = (key) => { setModal(key); };
    const closeModal = () => { setModal(null); };

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                setLoading(true);
                const agentsRes = await getAgents();

                if (!isMounted) return;

                setData({
                    total_agents: agentsRes?.total_agents || 0,
                    active_now: agentsRes?.active_now || 0,
                    blocked: agentsRes?.blocked || 0
                });
                const mappedAgents = (agentsRes?.agents || []).map(a => ({
                    ...a,
                    id: a.agent_id,
                    zone: a.city,
                    deliveries: a.today_deliveries || 0,
                    completed: a.total_deliveries || 0,
                    rate: a.total_deliveries > 0 ? "98%" : "0%",
                    duty_status: a.duty_status,
                    status: a.status === "Block"
                        ? "Block"
                        : a.duty_status === "OFF_DUTY"
                            ? "Off"
                            : "Active",
                    needs_approval: !!a.pending_duty_status
                }));
                setAgentList(mappedAgents);
                setError(null);
            } catch (err) {
                if (isMounted) {
                    console.error("Failed to fetch agents:", err);
                    setError("Failed to load agents data.");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const addAgent = (newAgent) => {
        setAgentList((prev) => [...prev, newAgent]);
    };

    const handleToggleStatus = async (agentId) => {
        try {
            await updateAgent(agentId);
            window.location.reload(); // Force state consistency
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = agentList.filter((a) => {
        const matchStatus = filter === "All" || a.status === filter;
        const matchSearch =
            !search ||
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.zone.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F1F5F9" }}>
                <DashboardNavbar />
                <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ padding: 24, textAlign: "center", background: "white", borderRadius: 12, border: "1px solid #E2E8F0" }}>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>⏳</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Loading Agents...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F1F5F9" }}>
                <DashboardNavbar />
                <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ padding: 24, background: "#FEF2F2", borderRadius: 12, border: "1px solid #FCA5A5", textAlign: "center", maxWidth: 400 }}>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>⚠️</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B" }}>Error Loading Data</div>
                        <div style={{ fontSize: 13, color: "#991B1B", marginTop: 6 }}>{error}</div>
                        <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: "8px 16px", background: "white", border: "1px solid #FCA5A5", borderRadius: 6, color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Retry</button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <>
            <title>Agents | CargoFlow</title>

            {/* Modals */}
            {modal === "addAgent" && (
                <AddAgentModal onClose={closeModal} onAdd={(s) => { addAgent(s); closeModal(); }} />
            )}
            {modal === "viewProfile" && (
                <AgentProfileModal agent={selectedAgent} onClose={closeModal} />
            )}
            {pendingOffDuty && (
                <ConfirmOffDutyModal
                    agent={pendingOffDuty}
                    onConfirm={async (id) => {
                        try {
                            await approveDuty(id.replace("AGT-", ""));
                            setPendingOffDuty(null);
                            window.location.reload();
                        } catch (err) {
                            console.error(err);
                        }
                    }}
                    onCancel={() => setPendingOffDuty(null)}
                />
            )}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    fontFamily: "'DM Sans','Segoe UI',sans-serif",
                    background: "#F1F5F9",
                    color: "#0F172A",
                }}
            >
                <DashboardNavbar />

                <main
                    style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "24px 100px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    fontSize: 22,
                                    fontWeight: 800,
                                    color: "#0F172A",
                                    margin: 0,
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                Manage Agents
                            </h1>
                            <p style={{ fontSize: 12, color: "#94A3B8", margin: "4px 0 0" }}>
                                {data.total_agents} delivery agents in your network
                            </p>
                        </div>

                        <button
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "9px 18px",
                                border: "none",
                                borderRadius: 8,
                                background: "#2563EB",
                                color: "white",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                            onClick={() => openModal("addAgent")}

                        >
                            <Icon d={icons.plus} size={13} stroke="white" /> Add Agent
                        </button>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4,1fr)",
                            gap: 12,
                        }}
                    >
                        {[
                            { label: "Total Agents", value: data.total_agents, color: "#2563EB" },
                            {
                                label: "Active Now",
                                value: data.active_now,
                                color: "#10B981",
                            },
                            {
                                label: "Block",
                                value: data.blocked,
                                color: "#FF0000",
                            },
                            {
                                label: "Off Duty",
                                value: Math.max(0, data.total_agents - data.active_now - data.blocked),
                                color: "#9CA3AF",
                            },
                        ].map((k) => (
                            <div
                                key={k.label}
                                style={{
                                    background: "white",
                                    borderRadius: 10,
                                    padding: "14px 18px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                    border: "1px solid #F1F5F9",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 800,
                                        color: k.color,
                                        letterSpacing: "-1px",
                                    }}
                                >
                                    {k.value}
                                </div>
                                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>
                                    {k.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ position: "relative", flex: 1, maxWidth: 280 }}>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search agents or zones..."
                                style={{
                                    width: "100%",
                                    border: "1px solid #E2E8F0",
                                    borderRadius: 8,
                                    padding: "7px 12px 7px 34px",
                                    fontSize: 12,
                                    color: "#334155",
                                    outline: "none",
                                    background: "white",
                                    boxSizing: "border-box",
                                }}
                            />
                            <span
                                style={{
                                    position: "absolute",
                                    left: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                }}
                            >
                                <Icon d={icons.search} size={13} stroke="#94A3B8" />
                            </span>
                        </div>
                        {["All", "Active", "Block", "Off"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: "7px 14px",
                                    borderRadius: 8,
                                    border: "1px solid",
                                    borderColor: filter === f ? "#2563EB" : "#E2E8F0",
                                    background: filter === f ? "#EFF6FF" : "white",
                                    color: filter === f ? "#2563EB" : "#64748B",
                                    fontSize: 12,
                                    fontWeight: filter === f ? 600 : 400,
                                    cursor: "pointer",
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3,1fr)",
                            gap: 14,
                        }}
                    >
                        {filtered.map((agent) => {
                            return (
                                <div
                                    key={agent.id}
                                    style={{
                                        background: "white",
                                        borderRadius: 12,
                                        padding: "20px",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                        border: "1px solid #F1F5F9",
                                        transition: "all 0.15s",
                                    }}
                                    onMouseEnter={(e) =>
                                    (e.currentTarget.style.boxShadow =
                                        "0 4px 16px rgba(0,0,0,0.09)")
                                    }
                                    onMouseLeave={(e) =>
                                    (e.currentTarget.style.boxShadow =
                                        "0 1px 3px rgba(0,0,0,0.06)")
                                    }
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            marginBottom: 14,
                                        }}
                                    >
                                        <div
                                            style={{ display: "flex", alignItems: "center", gap: 12 }}
                                        >
                                            <div
                                                style={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: "50%",
                                                    background: "#EFF6FF",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 18,
                                                    fontWeight: 700,
                                                    color: "#2563EB",
                                                }}
                                            >
                                                {agent.name[0]}
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 700,
                                                        color: "#0F172A",
                                                    }}
                                                >
                                                    {agent.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 11,
                                                        color: "#94A3B8",
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    {agent.id} · {agent.zone}
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 600,
                                                padding: "3px 9px",
                                                borderRadius: 20,
                                                background: agent.pending_duty_status && agent.status !== "Block"
                                                    ? "#FEF3C7"
                                                    : statusBg[agent.status],
                                                color: agent.pending_duty_status && agent.status !== "Block" ? "#92400E"
                                                    : statusTxt[agent.status],
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 5,
                                                cursor: agent.pending_duty_status ? "pointer" : "default"
                                            }}
                                            onClick={() => {
                                                if (agent.pending_duty_status) {
                                                    setPendingOffDuty(agent);
                                                }
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: "50%",
                                                    background: agent.duty_status === "OFF_DUTY"
                                                        ? "#F59E0B"
                                                        : statusColor[agent.status],
                                                    display: "inline-block"
                                                }}
                                            />
                                            {agent.pending_duty_status
                                                ? `Approve ${agent.pending_duty_status === "OFF_DUTY" ? "Off-Duty" : "On-Duty"}`
                                                : agent.status}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(3,1fr)",
                                            gap: 10,
                                            padding: "12px 0",
                                            borderTop: "1px solid #F1F5F9",
                                            borderBottom: "1px solid #F1F5F9",
                                            marginBottom: 14,
                                        }}
                                    >
                                        {[
                                            { label: "Today", value: agent.deliveries },
                                            { label: "Total", value: agent.completed },
                                            { label: "Rate", value: agent.rate },
                                        ].map((s) => (
                                            <div key={s.label} style={{ textAlign: "center" }}>
                                                <div
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 800,
                                                        color: "#0F172A",
                                                    }}
                                                >
                                                    {s.value}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 10,
                                                        color: "#94A3B8",
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    {s.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 5,
                                            marginBottom: 14,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 7,
                                                fontSize: 11,
                                                color: "#64748B",
                                            }}
                                        >
                                            <Icon d={icons.mail} size={12} stroke="#94A3B8" />{" "}
                                            {agent.email}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 7,
                                                fontSize: 11,
                                                color: "#64748B",
                                            }}
                                        >
                                            <Icon d={icons.phone} size={12} stroke="#94A3B8" />{" "}
                                            {agent.phone}
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button
                                            style={{
                                                flex: 1,
                                                padding: "7px",
                                                border: "1px solid #E2E8F0",
                                                borderRadius: 7,
                                                background: "white",
                                                color: "#334155",
                                                fontSize: 11,
                                                fontWeight: 500,
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                setSelectedAgent(agent);
                                                setModal("viewProfile");
                                            }}
                                        >
                                            View Profile
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleStatus(agent.id.replace("AGT-", ""));
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: "7px",
                                                border: "none",
                                                borderRadius: 7,
                                                background: agent.status === "Block" ? "#10B981" : "#EF4444",
                                                color: "white",
                                                fontSize: 11,
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                opacity: 1,
                                            }}
                                        >
                                            {agent.status === "Block" ? "Unblock" : "Block"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </>
    );
}