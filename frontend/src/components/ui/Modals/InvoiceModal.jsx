export default function InvoiceModal({ shipment, onClose }) {
  if (!shipment) return null;

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[110] p-4 print:p-0 print:bg-white">
      <div className="bg-white w-[650px] rounded-sm shadow-2xl flex flex-col max-h-[95vh] overflow-hidden p-12 font-serif print:shadow-none print:w-full print:max-h-full print:p-8">
        
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 font-sans">CARGOFLOW</h1>
            <p className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-[0.2em]">Logistics Intelligence Platform</p>
          </div>
          <div className="text-right font-sans">
            <h2 className="text-xl font-black text-slate-900">INVOICE</h2>
            <p className="text-xs text-slate-500 mt-1">Ref: #INV-{shipment.id.split('-')[1]}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Client & Shipment Info */}
        <div className="grid grid-cols-2 gap-12 mb-12 font-sans">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Billed To</h3>
            <p className="text-sm font-black text-slate-900">{shipment.client}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Authorized Business Client<br/>CargoFlow Verified Network</p>
          </div>
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Shipment Details</h3>
            <p className="text-sm font-black text-slate-900">ID: {shipment.id}</p>
            <p className="text-xs text-slate-500 mt-1">{shipment.origin} &rarr; {shipment.dest}</p>
          </div>
        </div>

        {/* Line Items */}
        <table className="w-full font-sans mb-12">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">Service Description</th>
              <th className="py-3 text-[10px] font-black uppercase text-slate-400 text-right tracking-widest">Weight</th>
              <th className="py-3 text-[10px] font-black uppercase text-slate-400 text-right tracking-widest">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-50">
              <td className="py-5">
                <p className="text-xs font-bold text-slate-900">Freight Transportation Services</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium italic">Inter-state transit and handling fees</p>
              </td>
              <td className="py-5 text-xs text-slate-600 text-right font-bold">{shipment.weight} Kg</td>
              <td className="py-5 text-xs font-black text-slate-900 text-right">₹{shipment.price.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Footer with QR & Download Action */}
        <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-end">
          <div className="flex gap-6 items-center">
            <div className="p-2 border border-slate-100 rounded-lg">
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${shipment.id}`} 
                    alt="Tracking QR"
                    className="w-20 h-20 grayscale"
                />
            </div>
            <div className="font-sans">
                <p className="text-[9px] font-black text-slate-900 uppercase">Secure Tracking</p>
                <p className="text-[9px] text-slate-400 max-w-[120px] mt-1 leading-tight">Scan to verify shipment status on the CargoFlow portal.</p>
            </div>
          </div>

          <div className="text-right font-sans">
            <div className="mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Payable</p>
                <p className="text-4xl font-black text-blue-600 tracking-tighter">₹{shipment.price.toLocaleString()}</p>
            </div>
            
            {/* Modal Actions - Hidden during Print */}
            <div className="flex gap-3 justify-end print:hidden">
                <button 
                    onClick={onClose} 
                    className="px-6 py-2.5 border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-all"
                >
                    Close
                </button>
                <button 
                    onClick={handleDownload} 
                    className="px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                >
                    <span>&darr;</span> Download PDF
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}