import { X, Scan, Loader2, CheckCircle, Keyboard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';

export default function ScannerModal({ onClose, onScan }) {
  const [phase,       setPhase]       = useState('scanning'); // scanning | scanned | manual
  const [scannedCode, setScannedCode] = useState('');
  const [manualCode,  setManualCode]  = useState('');
  const [manualErr,   setManualErr]   = useState('');
  const inputRef = useRef(null);

  // Simulate auto-scan
  useEffect(() => {
    if (phase !== 'scanning') return;
    const id = setTimeout(() => {
      const code = `SH-${Math.floor(Math.random() * 900000) + 100000}`;
      setScannedCode(code);
      setPhase('scanned');
      setTimeout(() => { onScan(code); onClose(); }, 2200);
    }, 2200);
    return () => clearTimeout(id);
  }, [phase, onScan, onClose]);

  // Focus manual input
  useEffect(() => {
    if (phase === 'manual' && inputRef.current) inputRef.current.focus();
  }, [phase]);

  const submitManual = () => {
    const val = manualCode.trim().toUpperCase();
    if (!val) { setManualErr('Please enter a shipment code.'); return; }
    if (!/^SH-\d{6}$/.test(val)) { setManualErr('Format must be SH-XXXXXX (e.g. SH-123456)'); return; }
    setManualErr('');
    setScannedCode(val);
    setPhase('scanned');
    setTimeout(() => { onScan(val); onClose(); }, 2200);
  };

  const rescan = () => { setPhase('scanning'); setScannedCode(''); setManualCode(''); setManualErr(''); };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Scan Package</h3>
                  <p className="text-sm text-blue-100">
                    {phase === 'manual' ? 'Enter code manually' : 'Position barcode in frame'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Scanner / success view */}
            {phase !== 'manual' && (
              <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                  {phase === 'scanning' && (
                    <div className="absolute inset-0">
                      <motion.div
                        animate={{ y: [0, 320, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-lg shadow-blue-400"
                      />
                    </div>
                  )}
                  {/* Corner markers */}
                  <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                  <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                  <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                  <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    {phase === 'scanning' && (
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-3" />
                        <p className="text-white font-medium">Scanning…</p>
                        <p className="text-sm text-gray-400 mt-1">Hold steady</p>
                      </div>
                    )}
                    {phase === 'scanned' && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/50">
                          <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-white font-bold text-lg">Scanned Successfully!</p>
                        <p className="text-sm text-gray-300 mt-2 font-mono bg-black/30 rounded-lg px-4 py-2 mt-3">
                          {scannedCode}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Manual entry */}
            {phase === 'manual' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-3">
                <label className="block text-sm font-medium text-gray-700">Shipment Code</label>
                <input
                  ref={inputRef}
                  value={manualCode}
                  onChange={e => { setManualCode(e.target.value.toUpperCase()); setManualErr(''); }}
                  onKeyDown={e => e.key === 'Enter' && submitManual()}
                  placeholder="e.g. SH-123456"
                  className={`w-full border rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 ${manualErr ? 'border-red-400' : 'border-gray-300'}`}
                />
                {manualErr && <p className="text-xs text-red-500">{manualErr}</p>}
                <button
                  onClick={submitManual}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium text-sm transition-all"
                >
                  Confirm Code
                </button>
                <button
                  onClick={rescan}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all"
                >
                  ← Back to Scanner
                </button>
              </motion.div>
            )}

            {/* Instructions */}
            {phase === 'scanning' && (
              <>
                <div className="space-y-2 mb-4">
                  {['Position the barcode within the frame', 'Ensure good lighting for best results', 'Hold device steady while scanning'].map(tip => (
                    <div key={tip} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setPhase('manual')}
                  className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Keyboard className="w-4 h-4" />Enter Code Manually
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
