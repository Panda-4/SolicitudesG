import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen, ClipboardCheck, DollarSign, Gavel, Award,
  Search, CheckCircle2, Eye, ChevronRight, MoreHorizontal
} from 'lucide-react';

const PanelControl = ({ onVerDetalle }) => {
  const [trazabilidad, setTrazabilidad] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchTrazabilidad();
  }, []);

  const fetchTrazabilidad = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/expedientes/trazabilidad');
      setTrazabilidad(res.data);
    } catch (e) {
      console.error('Error cargando trazabilidad:', e);
      setTrazabilidad([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = trazabilidad.filter(item => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (item.expediente?.folioExpediente || '').toLowerCase().includes(s) ||
           (item.expediente?.dependencia || '').toLowerCase().includes(s) ||
           (item.etapaActual || '').toLowerCase().includes(s);
  });

  // Estadísticas globales
  const totalExpedientes = trazabilidad.length;
  const totalEstudios = trazabilidad.reduce((sum, i) => sum + (i.totalEstudios || 0), 0);
  const totalAfectaciones = trazabilidad.reduce((sum, i) => sum + (i.totalAfectaciones || 0), 0);
  const totalProcedimientos = trazabilidad.reduce((sum, i) => sum + (i.totalProcedimientos || 0), 0);
  const totalAdjudicaciones = trazabilidad.reduce((sum, i) => sum + (i.totalAdjudicaciones || 0), 0);

  // Cálculos para Widgets Centrales
  const eficiencia = totalExpedientes > 0 ? Math.round((trazabilidad.filter(t => t.progreso === 100).length / totalExpedientes) * 100) : 0;
  
  const presupuestoAfectado = trazabilidad.reduce((sum, item) => 
    sum + (item.afectaciones?.reduce((s, a) => s + (a.importeSuficiencia || 0), 0) || 0), 0);
    
  const presupuestoAdjudicado = trazabilidad.reduce((sum, item) => 
    sum + (item.adjudicaciones?.reduce((s, a) => s + (a.montoTotalConIva || 0), 0) || 0), 0);
    
  const ratioPresupuesto = presupuestoAfectado > 0 ? Math.round((presupuestoAdjudicado / presupuestoAfectado) * 100) : 0;

  const progresoColor = (progreso) => {
    if (progreso >= 100) return 'bg-emerald-500';
    if (progreso >= 75) return 'bg-indigo-500';
    if (progreso >= 50) return 'bg-[#B38E5D]';
    return 'bg-[#9D2449]';
  };

  const etapaColor = (etapa) => {
    switch (etapa) {
      case 'Adjudicación': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Adquisiciones': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Afectación Presupuestal': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-[#9D2449]/10 text-[#9D2449] border-[#9D2449]/20';
    }
  };

  const formatMXN = (val) => val ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val) : '$0.00';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-slate-400 font-black uppercase tracking-widest text-sm">Cargando métricas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. TOP ROW: KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Expedientes', value: totalExpedientes, icon: FolderOpen, iconBg: 'bg-[#9D2449]/10', iconColor: 'text-[#9D2449]', mockGrow: '+12%' },
          { label: 'Estudios', value: totalEstudios, icon: ClipboardCheck, iconBg: 'bg-rose-50', iconColor: 'text-rose-500', mockGrow: '+5%' },
          { label: 'Afectaciones', value: totalAfectaciones, icon: DollarSign, iconBg: 'bg-amber-50', iconColor: 'text-amber-500', mockGrow: '+8%' },
          { label: 'Procedimientos', value: totalProcedimientos, icon: Gavel, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', mockGrow: '+2%' },
          { label: 'Adjudicaciones', value: totalAdjudicaciones, icon: Award, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', mockGrow: '+15%' },
        ].map((kpi, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[24px] p-5 flex items-center justify-between shadow-lg shadow-slate-200/40 border border-slate-50">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{kpi.label}</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-slate-800">{kpi.value}</p>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">{kpi.mockGrow}</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 ${kpi.iconBg}`}>
              <kpi.icon size={22} className={kpi.iconColor} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. MIDDLE ROW: WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Welcome Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#9D2449] via-[#8B1C3D] to-[#5a1024] rounded-[28px] p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-xl shadow-[#9D2449]/20 min-h-[240px]">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#B38E5D]/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Bienvenido de nuevo,</p>
            <h2 className="text-3xl font-black mb-4">{user?.nombreCompleto || 'Usuario'}</h2>
            <p className="text-sm font-medium text-white/80 max-w-[85%] leading-relaxed">
              Aquí puedes monitorear el progreso y la trazabilidad de todos los expedientes en tiempo real.
            </p>
          </div>
          <button className="relative z-10 w-fit text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 mt-8 hover:opacity-80 transition-opacity bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
            Ver reportes <ChevronRight size={14} />
          </button>
        </motion.div>

        {/* Satisfaction Rate -> Eficiencia */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-[28px] p-8 shadow-lg shadow-slate-200/40 border border-slate-50 flex flex-col items-center justify-center">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 w-full text-left mb-6">Eficiencia del Pipeline</p>
          
          <div className="relative w-48 h-24 overflow-hidden mb-4">
            <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-md">
              {/* Background Arc */}
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="12" strokeLinecap="round" />
              {/* Foreground Arc */}
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#9D2449" strokeWidth="12" strokeLinecap="round" 
                    strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - (eficiencia/100))} 
                    className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4">
               <div className="w-10 h-10 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={20} className="text-[#9D2449]" />
               </div>
            </div>
          </div>
          
          <div className="text-center mt-2">
            <p className="text-4xl font-black text-slate-800 tracking-tight">{eficiencia}%</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Expedientes Finalizados</p>
          </div>
          
          <div className="w-full flex justify-between px-6 mt-4 text-[10px] font-black text-slate-300">
            <span>0%</span>
            <span>100%</span>
          </div>
        </motion.div>

        {/* Referral Tracking -> Presupuesto */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-[28px] p-8 shadow-lg shadow-slate-200/40 border border-slate-50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Presupuesto Ejecutado</p>
            <button className="p-1.5 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal size={16} /></button>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-4 flex-1">
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Afectado (Global)</p>
                  <p className="text-sm font-black text-slate-700 truncate">{formatMXN(presupuestoAfectado)}</p>
               </div>
               <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#B38E5D] mb-1">Adjudicado</p>
                  <p className="text-sm font-black text-[#8a6b42] truncate">{formatMXN(presupuestoAdjudicado)}</p>
               </div>
            </div>
            
            <div className="relative w-28 h-28 shrink-0">
               <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 drop-shadow-sm">
                  <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-[#B38E5D] transition-all duration-1000 ease-out" 
                        strokeDasharray={`${ratioPresupuesto}, 100`} 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-black text-slate-800 tracking-tighter">{ratioPresupuesto}%</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Score</p>
               </div>
            </div>
          </div>
        </motion.div>
        
      </div>

      {/* 3. BOTTOM ROW: PROJECTS TABLE */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-[28px] p-6 shadow-lg shadow-slate-200/40 border border-slate-50 mt-8 overflow-hidden flex flex-col">
        
        {/* Table Header / Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-2">
           <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Expedientes en Proceso</h3>
              <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
                <CheckCircle2 size={12}/> {trazabilidad.filter(t => t.progreso===100).length} finalizados este mes
              </p>
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
               <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Buscar folio o dependencia..."
                 className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl outline-none text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#9D2449]/20 transition-all border border-slate-100" />
             </div>
             <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal size={18} /></button>
           </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
                <tr className="border-b border-slate-100">
                   <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Expediente / Dependencia</th>
                   <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Etapa Actual</th>
                   <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Presupuesto</th>
                   <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/4">Progreso</th>
                   <th className="pb-4 px-4"></th>
                </tr>
             </thead>
             <tbody className="text-sm">
                {filtered.length > 0 ? filtered.map((item, idx) => {
                  const monto = item.adjudicaciones?.reduce((s,a)=>s+(a.montoTotalConIva||0), 0) || 
                                item.afectaciones?.reduce((s,a)=>s+(a.importeSuficiencia||0), 0) || 0;
                                
                  return (
                    <motion.tr 
                       initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (idx * 0.05) }}
                       key={item.expediente.id} 
                       className="border-b border-slate-50/50 hover:bg-slate-50/50 transition-colors group">
                       
                       <td className="py-4 px-4">
                          <p className="font-black text-slate-800 text-sm">{item.expediente.folioExpediente}</p>
                          <p className="text-xs font-bold text-slate-400 truncate max-w-[250px] mt-0.5">{item.expediente.dependencia}</p>
                       </td>
                       
                       <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase border tracking-wider ${etapaColor(item.etapaActual)}`}>
                            {item.etapaActual}
                          </span>
                       </td>
                       
                       <td className="py-4 px-4">
                          <p className="font-black text-slate-700">{formatMXN(monto)}</p>
                          <p className="text-[9px] font-bold uppercase text-slate-400 mt-0.5">{monto > 0 ? (item.etapaActual === 'Adjudicación' ? 'Adjudicado' : 'Afectado') : 'No definido'}</p>
                       </td>
                       
                       <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                             <p className="text-xs font-black text-slate-700 w-8">{item.progreso}%</p>
                             <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                   initial={{ width: 0 }} animate={{ width: `${item.progreso}%` }} transition={{ duration: 1, delay: 0.2 }}
                                   className={`h-full rounded-full ${progresoColor(item.progreso)}`} />
                             </div>
                          </div>
                       </td>
                       
                       <td className="py-4 px-4 text-right">
                          <button 
                             onClick={() => onVerDetalle && onVerDetalle(item)} 
                             className="p-2 text-slate-300 hover:text-[#9D2449] hover:bg-[#9D2449]/10 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                             <Eye size={18} />
                          </button>
                       </td>
                    </motion.tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                         <FolderOpen size={32} className="mb-3 opacity-50" />
                         <p className="font-black uppercase tracking-widest text-xs">No se encontraron expedientes</p>
                      </div>
                    </td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

export default PanelControl;
