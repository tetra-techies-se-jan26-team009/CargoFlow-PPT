import { BTN_PRI } from "../modalStyle";
import Modal , {ModalHeader} from "../Modal"





export function AIInsightsModal({ onClose }) {
    const insights = [
        { icon: "📈", title: "Peak Performance Window", detail: "Tue–Thu 9AM–2PM shows 23% faster delivery completions. Schedule high-priority pickups in this window." },
        { icon: "🚨", title: "Risk: Arjun Das", detail: "83.5% on-time rate — 12 pts below team average. Consider reassigning his 3 pending shipments." },
        { icon: "🗺️", title: "Chennai → Mumbai Congestion", detail: "Average transit time up 40 mins due to port congestion. Reroute via NH-48 to save ~35 mins." },
        { icon: "💰", title: "Invoice Recovery Opportunity", detail: "₹4,200 overdue 7+ days. Automated reminders could recover 78% based on historical data." },
        { icon: "⭐", title: "Top Agent: Meena Shah", detail: "14 deliveries, 95.7% on-time this week. Recommend for bonus recognition." },
    ];
    return (
        <Modal onClose={onClose} width={520}>
            <ModalHeader title="AI Insights" subtitle="Powered by V1 Intelligence Engine" onClose={onClose} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {insights.map((ins, i) => (
                    <div key={i} style={{ padding: "13px 15px", background: "#F8FAFC", borderRadius: 11, border: "1px solid #F1F5F9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
                            <span style={{ fontSize: 18 }}>{ins.icon}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{ins.title}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 12, color: "#64748B", lineHeight: 1.65 }}>{ins.detail}</p>
                    </div>
                ))}
            </div>
            <button onClick={onClose} style={{ ...BTN_PRI, width: "100%", marginTop: 16, flex: "none", textAlign: "center" }}>Close</button>
        </Modal>
    );
}
