import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, FolderOpen, ClipboardCheck, DollarSign, Gavel, Award,
  ChevronDown, ChevronRight, Search, TrendingUp, CheckCircle2,
  Clock, FileText, Receipt, ExternalLink, Calendar
} from 'lucide-react';

const ETAPAS = [
  { key: 'Estudio de Mercado', icon: ClipboardCheck, color: '#9D2449' },
  { key: 'Afectación Presupuestal', icon: DollarSign, color: '#B38E5D' },
  { key: 'Adquisiciones', icon: Gavel, color: '#6366f1' },
  { key: 'Adjudicación', icon: Award, color: '#059669' },
];

const PanelControl = () => {
  const [trazabilidad, setTrazabilidad] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
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

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

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

  const formatMXN = (val) => val ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val) : 'N/A';

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Expedientes', value: totalExpedientes, icon: FolderOpen, color: 'from-[#9D2449] to-[#7a1c39]', textColor: 'text-white' },
          { label: 'Estudios', value: totalEstudios, icon: ClipboardCheck, color: 'from-rose-50 to-rose-100', textColor: 'text-[#9D2449]', borderColor: 'border-rose-200' },
          { label: 'Afectaciones', value: totalAfectaciones, icon: DollarSign, color: 'from-amber-50 to-amber-100', textColor: 'text-[#B38E5D]', borderColor: 'border-amber-200' },
          { label: 'Procedimientos', value: totalProcedimientos, icon: Gavel, color: 'from-indigo-50 to-indigo-100', textColor: 'text-indigo-600', borderColor: 'border-indigo-200' },
          { label: 'Adjudicaciones', value: totalAdjudicaciones, icon: Award, color: 'from-emerald-50 to-emerald-100', textColor: 'text-emerald-600', borderColor: 'border-emerald-200' },
        ].map((kpi, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`p-5 rounded-[28px] bg-gradient-to-br ${kpi.color} ${kpi.borderColor ? 'border ' + kpi.borderColor : ''} shadow-lg`}>
            <kpi.icon size={20} className={`${kpi.textColor} mb-2 opacity-60`} />
            <p className={`text-3xl font-black ${kpi.textColor}`}>{kpi.value}</p>
            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${kpi.textColor} opacity-70`}>{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white p-5 rounded-[28px] shadow-lg border border-slate-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar expediente, dependencia o etapa..."
            className="w-full pl-14 pr-6 py-3 bg-slate-50 rounded-[20px] outline-none font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#9D2449]/20 transition-all border-2 border-transparent focus:border-[#9D2449]/20" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
          {filtered.length} expedientes
        </div>
      </div>

      {/* Leyenda del pipeline */}
      <div className="flex items-center gap-2 flex-wrap px-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Pipeline:</span>
        {ETAPAS.map((etapa, i) => (
          <React.Fragment key={etapa.key}>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: etapa.color }} />
              <span className="text-[10px] font-bold text-slate-500">{etapa.key}</span>
            </div>
            {i < ETAPAS.length - 1 && <ChevronRight size={12} className="text-slate-300" />}
          </React.Fragment>
        ))}
      </div>

      {/* Lista de Expedientes con Trazabilidad */}
      {isLoading ? (
        <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
          Cargando trazabilidad...
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item, idx) => {
            const exp = item.expediente;
            const isExpanded = expandedId === exp.id;
            return (
              <motion.div key={exp.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-[28px] shadow-lg border border-slate-100 overflow-hidden">

                {/* Fila principal */}
                <button onClick={() => toggleExpand(exp.id)}
                  className="w-full p-6 flex items-center gap-5 hover:bg-slate-50/50 transition-all text-left">
                  {/* Progreso Circular */}
                  <div className="relative w-14 h-14 shrink-0">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                      <circle cx="28" cy="28" r="24" fill="none" strokeWidth="4"
                        className={progresoColor(item.progreso).replace('bg-', 'stroke-')}
                        style={{
                          strokeDasharray: `${2 * Math.PI * 24}`,
                          strokeDashoffset: `${2 * Math.PI * 24 * (1 - item.progreso / 100)}`,
                          strokeLinecap: 'round',
                          transition: 'stroke-dashoffset 0.6s ease'
                        }} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-700">
                      {item.progreso}%
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-black text-[#9D2449] font-mono">{exp.folioExpediente}</p>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${etapaColor(item.etapaActual)}`}>
                        {item.etapaActual}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 truncate">{exp.dependencia || 'Sin dependencia'}</p>
                  </div>

                  {/* Badges contadores */}
                  <div className="hidden md:flex items-center gap-3">
                    {[
                      { count: item.totalEstudios, Icon: ClipboardCheck, color: '#9D2449' },
                      { count: item.totalAfectaciones, Icon: DollarSign, color: '#B38E5D' },
                      { count: item.totalProcedimientos, Icon: Gavel, color: '#6366f1' },
                      { count: item.totalAdjudicaciones, Icon: Award, color: '#059669' },
                    ].map((badge, i) => (
                      <div key={i} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black ${badge.count > 0 ? 'bg-slate-50' : 'bg-slate-50/50 opacity-30'}`}
                        style={{ color: badge.color }}>
                        <badge.Icon size={12} />
                        <span>{badge.count}</span>
                      </div>
                    ))}
                  </div>

                  {/* Barra de progreso horizontal */}
                  <div className="hidden lg:block w-32">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${item.progreso}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                        className={`h-full rounded-full ${progresoColor(item.progreso)}`} />
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold text-slate-400">{exp.fechaCreacion || '—'}</p>
                  </div>

                  <ChevronDown size={18} className={`text-slate-300 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Panel expandible: Detalle de Trazabilidad */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-slate-100">
                      <div className="p-6 bg-gradient-to-b from-slate-50/50 to-white space-y-6">

                        {/* Timeline visual */}
                        <div className="flex items-center gap-0 justify-center">
                          {ETAPAS.map((etapa, i) => {
                            const completed = (etapa.key === 'Estudio de Mercado' && item.totalEstudios > 0) ||
                                              (etapa.key === 'Afectación Presupuestal' && item.totalAfectaciones > 0) ||
                                              (etapa.key === 'Adquisiciones' && item.totalProcedimientos > 0) ||
                                              (etapa.key === 'Adjudicación' && item.totalAdjudicaciones > 0);
                            return (
                              <React.Fragment key={etapa.key}>
                                <div className="flex flex-col items-center gap-2">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${completed ? '' : 'opacity-25'}`}
                                    style={{ backgroundColor: completed ? etapa.color : '#e2e8f0' }}>
                                    <etapa.icon size={18} className="text-white" />
                                  </div>
                                  <span className={`text-[9px] font-black uppercase tracking-wider text-center max-w-[90px] leading-tight ${completed ? 'text-slate-700' : 'text-slate-300'}`}>
                                    {etapa.key}
                                  </span>
                                </div>
                                {i < ETAPAS.length - 1 && (
                                  <div className={`flex-1 h-1 rounded-full mx-1 mt-[-20px] ${
                                    (() => {
                                      const nextEtapa = ETAPAS[i + 1];
                                      const nextCompleted = (nextEtapa.key === 'Afectación Presupuestal' && item.totalAfectaciones > 0) ||
                                                            (nextEtapa.key === 'Adquisiciones' && item.totalProcedimientos > 0) ||
                                                            (nextEtapa.key === 'Adjudicación' && item.totalAdjudicaciones > 0);
                                      return completed && nextCompleted ? 'bg-emerald-400' : 'bg-slate-200';
                                    })()
                                  }`} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {/* Detalle por módulo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          {/* Estudios */}
                          <div className="p-4 rounded-2xl border border-[#9D2449]/10 bg-[#9D2449]/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#9D2449] mb-3 flex items-center gap-2">
                              <ClipboardCheck size={12} /> Estudios de Mercado ({item.totalEstudios})
                            </p>
                            {item.estudios?.length > 0 ? item.estudios.map((est, i) => (
                              <div key={i} className="p-3 bg-white rounded-xl border border-slate-100 mb-2 last:mb-0">
                                <p className="font-bold text-sm text-slate-700 truncate">{est.descripcionBien || 'Sin descripción'}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1">Registro: {est.fechaRegistro || '—'}</p>
                              </div>
                            )) : <p className="text-xs text-slate-400 italic font-bold">Sin registros</p>}
                          </div>

                          {/* Afectaciones */}
                          <div className="p-4 rounded-2xl border border-[#B38E5D]/10 bg-[#B38E5D]/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#B38E5D] mb-3 flex items-center gap-2">
                              <Receipt size={12} /> Afectaciones Presupuestales ({item.totalAfectaciones})
                            </p>
                            {item.afectaciones?.length > 0 ? item.afectaciones.map((af, i) => (
                              <div key={i} className="p-3 bg-white rounded-xl border border-slate-100 mb-2 last:mb-0 flex justify-between items-center">
                                <div>
                                  <p className="font-black text-[#B38E5D] font-mono text-sm">{af.folioCa || 'N/A'}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">{af.oficioSuficiencia || '—'}</p>
                                </div>
                                <p className="font-black text-slate-800 text-sm">{formatMXN(af.importeSuficiencia)}</p>
                              </div>
                            )) : <p className="text-xs text-slate-400 italic font-bold">Sin registros</p>}
                          </div>

                          {/* Procedimientos */}
                          <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3 flex items-center gap-2">
                              <Gavel size={12} /> Procedimientos ({item.totalProcedimientos})
                            </p>
                            {item.procedimientos?.length > 0 ? item.procedimientos.map((proc, i) => (
                              <div key={i} className="p-3 bg-white rounded-xl border border-slate-100 mb-2 last:mb-0 flex justify-between items-center">
                                <div>
                                  <p className="font-black text-indigo-600 font-mono text-sm">{proc.noProcedimiento || 'N/A'}</p>
                                  <p className="text-[10px] text-slate-400 font-bold truncate">{proc.modalidadProcedimiento || '—'}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                  proc.estatus === 'Adjudicado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>{proc.estatus || 'En Proceso'}</span>
                              </div>
                            )) : <p className="text-xs text-slate-400 italic font-bold">Sin registros</p>}
                          </div>

                          {/* Adjudicaciones */}
                          <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                              <Award size={12} /> Adjudicaciones ({item.totalAdjudicaciones})
                            </p>
                            {item.adjudicaciones?.length > 0 ? item.adjudicaciones.map((adj, i) => (
                              <div key={i} className="p-3 bg-white rounded-xl border border-slate-100 mb-2 last:mb-0">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-black text-emerald-600 font-mono text-sm">{adj.folioInterno || 'N/A'}</p>
                                    <p className="text-[10px] text-slate-500 font-bold mt-1">{adj.nombreRazonSocial || '—'}</p>
                                  </div>
                                  <p className="font-black text-emerald-700 text-sm">{formatMXN(adj.montoTotalConIva)}</p>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold mt-1">Contrato: {adj.numeroContrato || '—'}</p>
                              </div>
                            )) : <p className="text-xs text-slate-400 italic font-bold">Sin registros</p>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {filtered.length === 0 && !isLoading && (
            <div className="p-16 text-center text-slate-400">
              <FolderOpen size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="font-black uppercase tracking-widest text-sm">No se encontraron expedientes</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PanelControl;
