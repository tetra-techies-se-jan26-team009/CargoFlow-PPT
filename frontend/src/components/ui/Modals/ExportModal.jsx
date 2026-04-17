import { useState } from "react";
import { BTN_PRI, BTN_SEC } from "../modalStyle";
import Modal, { ModalHeader } from "../Modal";

export function ExportModal({ onClose, shipments, showToast }) {
    const [fmt, setFmt] = useState("csv");
    const [isExporting, setIsExporting] = useState(false);

    const doExport = () => {
        setIsExporting(true);

        try {
            let blob;
            let filename = `CargoFlow_Report_${new Date().toISOString().split('T')[0]}`;

            if (fmt === "csv") {
                const headers = ["Tracking ID", "Client", "Agent", "Origin", "Destination", "Status", "Weight", "Price", "Risk"];
                const rows = shipments.map(s => [
                    s.id, s.client, s.agent, s.origin, s.dest, s.status, s.weight, s.price, s.risk
                ]);
                const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");
                blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                filename += ".csv";
            } else {
                // JSON Export
                const jsonContent = JSON.stringify(shipments, null, 2);
                blob = new Blob([jsonContent], { type: "application/json" });
                filename += ".json";
            }

            // Download Trigger
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);

            // UI Feedback
            if (showToast) showToast(`Report exported as ${fmt.toUpperCase()}`);
            
            // Artificial delay for smooth transition
            setTimeout(() => {
                setIsExporting(false);
                onClose();
            }, 800);

        } catch (error) {
            console.error(error);
            if (showToast) showToast("Export failed", "error");
            setIsExporting(false);
        }
    };

    return (
        <Modal onClose={onClose} width={400}>
            <div className="p-1">
                <ModalHeader title="Export Report" onClose={onClose} />
                
                <div className="p-6">
                    {/* Format Selector */}
                    <div className="mb-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                            Select File Format
                        </label>
                        <div className="flex gap-3">
                            {["csv", "json"].map(f => (
                                <button 
                                    key={f} 
                                    onClick={() => setFmt(f)}
                                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                                        fmt === f 
                                        ? "border-blue-600 bg-blue-50/50 text-blue-700" 
                                        : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                                    }`}
                                >
                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${fmt === f ? "text-blue-600" : "text-slate-300"}`}>
                                        {f === 'csv' ? 'Spreadsheet' : 'Data Object'}
                                    </span>
                                    <span className="text-sm font-black uppercase">.{f}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Meta Info Box */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm shadow-sm">
                                📦
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Records Found</p>
                                <p className="text-sm font-black text-slate-900">{shipments.length} Shipments</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">System Status</p>
                            <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Ready</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose} 
                            style={{ ...BTN_SEC, flex: 1, borderRadius: '10px', height: '44px', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={doExport} 
                            disabled={isExporting}
                            style={{ ...BTN_PRI, flex: 1, borderRadius: '10px', height: '44px', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}
                        >
                            {isExporting ? "Processing..." : "Generate Report"}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}