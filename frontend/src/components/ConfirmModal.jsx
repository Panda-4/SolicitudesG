import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDestructive = true }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop con blur (glassmorphism) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Contenido del Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* Header decoration */}
          <div className={`h-2 w-full ${isDestructive ? 'bg-[#9D2449]' : 'bg-[#B38E5D]'}`} />
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-8 pt-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${
              isDestructive 
                ? 'bg-[#9D2449]/10 text-[#9D2449] shadow-[#9D2449]/10' 
                : 'bg-[#B38E5D]/10 text-[#B38E5D] shadow-[#B38E5D]/10'
            }`}>
              <AlertTriangle size={32} />
            </div>

            <h3 className="text-xl font-black text-slate-800 mb-3">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{message}</p>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-50 text-slate-600 font-bold uppercase tracking-wide text-xs rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-6 py-3 text-white font-bold uppercase tracking-wide text-xs rounded-xl shadow-lg transition-all ${
                  isDestructive 
                    ? 'bg-[#9D2449] hover:bg-[#801b3a] shadow-[#9D2449]/20' 
                    : 'bg-[#B38E5D] hover:bg-[#96754b] shadow-[#B38E5D]/20'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
