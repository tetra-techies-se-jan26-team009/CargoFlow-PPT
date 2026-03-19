import { X, CheckCircle, Camera, Star, DollarSign, User, Upload, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';

export default function DeliveryConfirmationModal({ delivery, onClose, onConfirm }) {
  const [step,             setStep]            = useState(1);
  const [deliveryStatus,   setDeliveryStatus]  = useState('delivered');
  const [failReason,       setFailReason]      = useState('');
  const [customerName,     setCustomerName]    = useState('');
  const [nameErr,          setNameErr]         = useState('');
  const [codCollected,     setCodCollected]    = useState(false);
  const [photo,            setPhoto]           = useState(null);
  const [rating,           setRating]          = useState(0);
  const [hoveredStar,      setHoveredStar]     = useState(0);
  const [notes,            setNotes]           = useState('');
  const [submitting,       setSubmitting]      = useState(false);

  const totalSteps = 3;

  const stepTitles = ['Delivery Details', 'Proof of Delivery', 'Rate Experience'];

  // ── Validation ─────────────────────────────────────────────────────────────
  const validateStep1 = () => {
    if (!customerName.trim()) { setNameErr('Recipient name is required'); return false; }
    if (deliveryStatus === 'failed' && !failReason.trim()) { setNameErr('Please select a failure reason'); return false; }
    setNameErr('');
    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step < totalSteps) setStep(s => s + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const data = {
      deliveryId: delivery.id,
      status: deliveryStatus,
      failReason: deliveryStatus === 'failed' ? failReason : null,
      customerName,
      codCollected: delivery.cod ? codCollected : null,
      photo,
      rating,
      notes,
      timestamp: new Date().toISOString(),
    };
    setTimeout(() => {
      setSubmitting(false);
      setStep(4);
      setTimeout(() => onConfirm(data), 2000);
    }, 1000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const ratingLabels = { 1: '😞 Not Great', 2: '😐 Okay', 3: '👍 Good', 4: '😊 Great!', 5: '⭐ Excellent!' };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Complete Delivery</h3>
                  <p className="text-sm text-green-100">{delivery.id} · {delivery.customer}</p>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Step Progress */}
            {step <= totalSteps && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-green-200 mb-1.5">
                  <span>Step {step} of {totalSteps}</span>
                  <span>{stepTitles[step - 1]}</span>
                </div>
                <div className="flex gap-1.5">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < step ? 'bg-white' : 'bg-white/30'}`} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* ── STEP 1: Delivery Details ─────────────────────────────── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h4 className="font-bold text-gray-900">Delivery Details</h4>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Status</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setDeliveryStatus('delivered')}
                      className={`p-3 rounded-xl border-2 transition-all ${deliveryStatus === 'delivered' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300'}`}>
                      <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-semibold">Delivered</div>
                    </button>
                    <button onClick={() => setDeliveryStatus('failed')}
                      className={`p-3 rounded-xl border-2 transition-all ${deliveryStatus === 'failed' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-gray-300'}`}>
                      <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-semibold">Failed</div>
                    </button>
                  </div>
                </div>

                {/* Fail reason */}
                {deliveryStatus === 'failed' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Failure Reason</label>
                    <select value={failReason} onChange={e => setFailReason(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select reason…</option>
                      <option value="customer_absent">Customer not present</option>
                      <option value="wrong_address">Wrong address</option>
                      <option value="refused">Customer refused delivery</option>
                      <option value="access_denied">Access denied</option>
                      <option value="other">Other</option>
                    </select>
                  </motion.div>
                )}

                {/* Received by */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {deliveryStatus === 'delivered' ? 'Received By *' : 'Contact Person'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={customerName} onChange={e => { setCustomerName(e.target.value); setNameErr(''); }}
                      placeholder="Enter recipient name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm ${nameErr ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                  </div>
                  {nameErr && <p className="text-xs text-red-500 mt-1">{nameErr}</p>}
                </div>

                {/* COD */}
                {delivery.cod && deliveryStatus === 'delivered' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-amber-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Cash on Delivery</div>
                          <div className="text-sm text-gray-600">Amount: {delivery.codAmount}</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={codCollected} onChange={e => setCodCollected(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" />
                      </label>
                    </div>
                    {delivery.cod && !codCollected && (
                      <p className="text-xs text-amber-600 mt-2">⚠ Remember to collect cash before confirming</p>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Add any special notes or observations…" rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm" />
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Proof of Delivery ────────────────────────────── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h4 className="font-bold text-gray-900">Proof of Delivery</h4>
                <p className="text-sm text-gray-600">Take a photo of the delivered package or customer signature</p>

                {!photo ? (
                  <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 cursor-pointer bg-gray-50 hover:bg-blue-50 transition-all group">
                    <Camera className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mb-3 transition-colors" />
                    <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Tap to take photo</p>
                    <p className="text-xs text-gray-500 mt-1">or upload from gallery</p>
                    <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={photo} alt="Delivery proof" className="w-full h-56 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <button onClick={() => setPhoto(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />Photo Added
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">
                  {photo ? '✓ Proof photo captured. You can replace it by uploading another.' : 'A photo is recommended but not required to proceed.'}
                </p>
              </motion.div>
            )}

            {/* ── STEP 3: Rate Experience ──────────────────────────────── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h4 className="font-bold text-gray-900">Rate Your Experience</h4>
                <p className="text-sm text-gray-600">How was your delivery experience with {delivery.customer}?</p>
                <div className="flex justify-center gap-2 py-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-transform hover:scale-110 active:scale-95">
                      <Star className={`w-12 h-12 transition-colors ${
                        star <= (hoveredStar || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300 hover:text-amber-200'
                      }`} />
                    </button>
                  ))}
                </div>
                {(rating > 0 || hoveredStar > 0) && (
                  <p className="text-center text-sm font-semibold text-gray-700">
                    {ratingLabels[hoveredStar || rating]}
                  </p>
                )}
                <p className="text-center text-xs text-gray-400">Rating is optional — tap a star or skip</p>
              </motion.div>
            )}

            {/* ── STEP 4: Success ─────────────────────────────────────── */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Delivery Complete!</h4>
                <p className="text-gray-600">Delivery <span className="font-semibold text-gray-900">{delivery.id}</span> has been recorded.</p>
                {delivery.cod && codCollected && (
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                    <DollarSign className="w-4 h-4" />{delivery.codAmount} collected ✓
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          {step < 4 && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex-shrink-0">
              <div className="flex gap-3">
                {step > 1 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm">
                    ← Back
                  </button>
                )}
                <button
                  onClick={goNext}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing…</>
                  ) : step === totalSteps ? 'Complete Delivery ✓' : 'Continue →'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}