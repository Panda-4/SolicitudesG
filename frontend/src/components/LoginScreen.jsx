import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onLogin(username, password);
    } catch (err) {
      const msg = err.response?.data?.error || 'Error de conexión con el servidor';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#9D2449]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#B38E5D]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#9D2449]/5 rounded-full blur-3xl" />
      </div>

      {/* Tarjeta de Login */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl shadow-black/40 overflow-hidden">
          
          {/* Barra superior decorativa */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#9D2449] via-[#B38E5D] to-[#9D2449]" />
          
          <div className="p-10 md:p-12">
            {/* Logo / Título */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#9D2449] to-[#7a1c39] shadow-xl shadow-[#9D2449]/30 mb-6"
              >
                <Shield size={36} className="text-white" />
              </motion.div>
              
              <h1 className="text-2xl font-black text-white tracking-tight mb-2">
                Sistema DGRM
              </h1>
              <p className="text-sm font-bold text-white/40 uppercase tracking-widest">
                Gestión de Adquisiciones
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Campo: Usuario */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">
                  Usuario
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingresa tu usuario"
                    required
                    autoComplete="username"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-white/20 focus:outline-none focus:border-[#B38E5D] focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              {/* Campo: Contraseña */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-white/20 focus:outline-none focus:border-[#B38E5D] focus:bg-white/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl"
                  >
                    <AlertCircle size={18} className="text-rose-400 shrink-0" />
                    <p className="text-rose-300 font-bold text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botón Login */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#9D2449] to-[#B38E5D] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#9D2449]/30 hover:shadow-2xl hover:shadow-[#9D2449]/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Verificando...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-widest mt-8">
              Dirección General de Recursos Materiales
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
