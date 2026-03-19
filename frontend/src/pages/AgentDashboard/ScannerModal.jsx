import { X, Scan, Camera, Loader2, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';

export default function ScannerModal({ onClose, onScan }) {
  const [scanning, setScanning] = useState(true);
  const [scanned, setScanned] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  useEffect(() => {
    // Simulate scanning process
    if (scanning) {
      const timer = setTimeout(() => {
        const mockCode = `SH-${Math.floor(Math.random() * 900000) + 100000}`;
        setScannedCode(mockCode);
        setScanning(false);
        setScanned(true);
        
        // Auto close and callback after 2 seconds
        setTimeout(() => {
          onScan(mockCode);
          onClose();
        }, 2000);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [scanning, onScan, onClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
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
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Scan Package</h3>
                  <p className="text-sm text-blue-100">Position barcode in frame</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scanner View */}
          <div className="p-6">
            <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
              {/* Camera simulation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                {/* Scanning animation */}
                {scanning && (
                  <div className="absolute inset-0">
                    <motion.div
                      animate={{ y: [0, 320, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-lg shadow-blue-400"
                    />
                  </div>
                )}

                {/* Frame corners */}
                <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>

                {/* Status */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {scanning && (
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-3" />
                      <p className="text-white font-medium">Scanning...</p>
                      <p className="text-sm text-gray-400 mt-1">Hold steady</p>
                    </div>
                  )}

                  {scanned && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
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

            {/* Instructions */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span>Position the barcode within the frame</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span>Ensure good lighting for best results</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span>Hold device steady while scanning</span>
              </div>
            </div>

            {/* Manual Entry Option */}
            <div className="mt-6">
              <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium text-sm">
                Enter Code Manually
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
