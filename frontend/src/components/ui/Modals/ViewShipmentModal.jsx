export default function ViewShipmentModal({ shipment, onClose }) {
  if (!shipment) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Shipment Details</h2>
            <p className="text-[10px] text-blue-600 mt-1 font-black uppercase tracking-widest">{shipment.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-black text-2xl">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Status Banner */}
          <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Current Status</span>
              <span className="text-sm font-black text-slate-900">{shipment.status}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Estimated Arrival</span>
              <span className="text-sm font-black text-slate-900">{shipment.eta || "TBD"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Route Info */}
            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Logistics Path</h4>
                <div className="relative pl-6 border-l-2 border-dashed border-slate-200 py-1 space-y-8">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup Location</p>
                    <p className="text-sm font-bold text-slate-900">{shipment.origin}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Final Destination</p>
                    <p className="text-sm font-bold text-slate-900">{shipment.dest}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Entity Info */}
            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Assignment</h4>
                <div className="p-4 rounded-xl border border-slate-100 space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Client</p>
                    <p className="text-xs font-black text-slate-900">{shipment.client}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Agent</p>
                    <p className="text-xs font-black text-slate-900">{shipment.agent}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}