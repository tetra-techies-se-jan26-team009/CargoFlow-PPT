export default function Toast({ message, type, show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border bg-white animate-in fade-in slide-in-from-right-4 duration-300 border-slate-100">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
        type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
      }`}>
        {type === "success" ? "✓" : "✕"}
      </div>
      
      <div className="flex flex-col min-w-[150px]">
        <span className="text-[12px] font-black text-slate-900 uppercase tracking-tight">
            {type === "success" ? "Action Successful" : "System Error"}
        </span>
        <span className="text-[11px] font-bold text-slate-400 leading-tight mt-0.5">{message}</span>
      </div>

      <button onClick={onClose} className="ml-2 text-slate-300 hover:text-slate-500 text-xl leading-none">&times;</button>
    </div>
  );
}