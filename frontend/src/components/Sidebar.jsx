import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  LayoutDashboard, 
  ClipboardCheck, 
  Landmark, 
  Search, 
  Briefcase, 
  CreditCard, 
  FileSearch, 
  Settings, 
  LogOut,
  Building2
} from 'lucide-react';

const Sidebar = ({ view, setView, currentUser, handleLogout, hasPermission }) => {
  // Función auxiliar para determinar si un botón está activo
  const isActive = (targetView) => view === targetView || (Array.isArray(targetView) && targetView.includes(view));

  return (
    <aside className={`w-72 border-r flex flex-col sticky top-0 h-screen z-50 transition-colors duration-500 bg-white border-slate-100 shadow-xl shadow-slate-200/20`}>
      
      {/* Logo y Branding */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#9D2449] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#9D2449]/20">
          <Building2 size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-black leading-none tracking-tight text-slate-900">Edoméx</span>
          <span className="text-[10px] font-black text-[#B38E5D] uppercase tracking-[0.2em] mt-1">Compras</span>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
        
        {/* Sección: Menú Principal */}
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest px-4 mb-4 text-slate-400">Menú Principal</p>
          
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
              isActive('dashboard')
                ? 'bg-[#9D2449] text-white shadow-xl shadow-[#9D2449]/20'
                : 'text-slate-500 hover:bg-slate-50 hover:text-[#9D2449]'
            }`}
          >
            <Home size={20} className={isActive('dashboard') ? 'text-white' : 'group-hover:text-[#9D2449]'} />
            <span className="font-bold text-sm">Inicio</span>
            {isActive('dashboard') && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-6 bg-white rounded-full" />}
          </button>

          {hasPermission('Reportes') && (
            <button
              onClick={() => setView('dashboard-reports')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                isActive('dashboard-reports')
                  ? 'bg-[#9D2449] text-white shadow-xl shadow-[#9D2449]/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#9D2449]'
              }`}
            >
              <LayoutDashboard size={20} className={isActive('dashboard-reports') ? 'text-white' : 'group-hover:text-[#9D2449]'} />
              <span className="font-bold text-sm">Panel de Control</span>
              {isActive('dashboard-reports') && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-6 bg-white rounded-full" />}
            </button>
          )}
        </div>

        {/* Sección: Estudio de Mercado */}
        {hasPermission('Estudio de mercado') && (
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest px-4 mb-4 text-slate-400">Estudio de Mercado</p>
            
            <button
              onClick={() => setView('register')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                isActive('register')
                  ? 'bg-[#9D2449] text-white shadow-xl shadow-[#9D2449]/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#9D2449]'
              }`}
            >
              <ClipboardCheck size={20} className={isActive('register') ? 'text-white' : 'group-hover:text-[#9D2449]'} />
              <span className="font-bold text-sm">Nuevo Registro</span>
              {isActive('register') && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-6 bg-white rounded-full" />}
            </button>

            <button
              onClick={() => setView('query')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                isActive(['query', 'detail'])
                  ? 'bg-[#9D2449] text-white shadow-xl shadow-[#9D2449]/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#9D2449]'
              }`}
            >
              <Search size={20} className={isActive(['query', 'detail']) ? 'text-white' : 'group-hover:text-[#9D2449]'} />
              <span className="font-bold text-sm">Consulta</span>
              <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                isActive(['query', 'detail'])
                  ? 'border-white/30 bg-white/20'
                  : 'border-slate-100 bg-slate-50 text-slate-400'
              }`}>
                2+
              </span>
              {isActive(['query', 'detail']) && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-6 bg-white rounded-full" />}
            </button>
          </div>
        )}

        {/* Sección: Afectación Presupuestal */}
        {hasPermission('Afectación P') && (
          <div className="space-y-1 pt-4 border-t border-slate-50">
            <p className="text-[10px] font-black uppercase tracking-widest px-4 mb-4 text-slate-400">Afectación Presupuestal</p>
            
            <button
              onClick={() => setView('budget-affectation')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                isActive('budget-affectation')
                  ? 'bg-[#9D2449] text-white shadow-xl shadow-[#9D2449]/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#9D2449]'
              }`}
            >
              <Landmark size={20} className={isActive('budget-affectation') ? 'text-white' : 'group-hover:text-[#9D2449]'} />
              <span className="font-bold text-sm">Suficiencia Pres.</span>
              {isActive('budget-affectation') && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-6 bg-white rounded-full" />}
            </button>

            <button
              onClick={() => setView('budget-query')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                isActive(['budget-query', 'budget-detail'])
                  ? 'bg-[#9D2449] text-white shadow-xl shadow-[#9D2449]/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#9D2449]'
              }`}
            >
              <Search size={20} className={isActive(['budget-query', 'budget-detail']) ? 'text-white' : 'group-hover:text-[#9D2449]'} />
              <span className="font-bold text-sm">Consulta Suficiencia</span>
              {isActive(['budget-query', 'budget-detail']) && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-6 bg-white rounded-full" />}
            </button>
          </div>
        )}

        {/* Sección: Adquisiciones */}
        {hasPermission('AdquisicionesC') && (
          <div className="space-y-1 pt-4 border-t border-slate-50">
            <p className="text-[10px] font-black uppercase tracking-widest px-4 mb-4 text-slate-400">Adquisiciones</p>
            
            <button
              onClick={() => setView('procurement-register')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                isActive('procurement-register')
                  ? 'bg-[#9D2449] text-white shadow-xl shadow-[#9D2449]/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#9D2449]'
              }`}
            >
              <Briefcase size={20} className={isActive('procurement-register') ? 'text-white' : 'group-hover:text-[#9D2449]'} />
              <span className="font-bold text-sm">Registro Procedimiento</span>
              {isActive('procurement-register') && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-6 bg-white rounded-full" />}
            </button>

            <button
              onClick={() => setView('procurement-query')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                isActive(['procurement-query', 'procurement-detail'])
                  ? 'bg-[#9D2449] text-white shadow-xl shadow-[#9D2449]/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#9D2449]'
              }`}
            >
              <Search size={20} className={isActive(['procurement-query', 'procurement-detail']) ? 'text-white' : 'group-hover:text-[#9D2449]'} />
              <span className="font-bold text-sm">Consulta Adquisiciones</span>
              {isActive(['procurement-query', 'procurement-detail']) && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-6 bg-white rounded-full" />}
            </button>
          </div>
        )}

        {/* Sección: Adjudicación */}
        {hasPermission('Adjudicación') && (
          <div className="space-y-1 pt-4 border-t border-slate-50">
            <p className="text-[10px] font-black uppercase tracking-widest px-4 mb-4 text-slate-400">Adjudicación</p>
            
            <button
              onClick={() => setView('adjudication-register')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                isActive('adjudication-register')
                  ? 'bg-[#9D2449] text-white shadow-xl shadow-[#9D2449]/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#9D2449]'
              }`}
            >
              <CreditCard size={20} className={isActive('adjudication-register') ? 'text-white' : 'group-hover:text-[#9D2449]'} />
              <span className="font-bold text-sm">Seguimiento</span>
              {isActive('adjudication-register') && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-6 bg-white rounded-full" />}
            </button>

            <button
              onClick={() => setView('adjudication-query')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                isActive(['adjudication-query', 'adjudication-detail'])
                  ? 'bg-[#9D2449] text-white shadow-xl shadow-[#9D2449]/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#9D2449]'
              }`}
            >
              <FileSearch size={20} className={isActive(['adjudication-query', 'adjudication-detail']) ? 'text-white' : 'group-hover:text-[#9D2449]'} />
              <span className="font-bold text-sm">Consulta Adjudicación</span>
              {isActive(['adjudication-query', 'adjudication-detail']) && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-6 bg-white rounded-full" />}
            </button>
          </div>
        )}

        {/* Sección: Configuración */}
        {hasPermission('Administración') && (
          <div className="space-y-1 pt-4 border-t border-slate-50">
            <button
              onClick={() => setView('settings')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                isActive('settings')
                  ? 'bg-[#9D2449] text-white shadow-xl shadow-[#9D2449]/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#9D2449]'
              }`}
            >
              <Settings size={20} className={isActive('settings') ? 'text-white' : 'group-hover:text-[#9D2449]'} />
              <span className="font-bold text-sm">Configuración</span>
              {isActive('settings') && <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-6 bg-white rounded-full" />}
            </button>
          </div>
        )}

      </nav>

      {/* Perfil de Usuario y Logout */}
      <div className="p-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
            <img src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-black truncate text-slate-900">{currentUser?.name}</span>
            <span className="text-[9px] font-black uppercase tracking-tighter text-[#B38E5D]">{currentUser?.role}</span>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Activo"></div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group text-rose-500 hover:bg-rose-50"
        >
          <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
          <span className="font-bold text-sm">Cerrar Sesión</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;