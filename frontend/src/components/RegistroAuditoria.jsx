import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Search, Filter, Calendar, Clock, User, 
  Database, Tag, Activity, FileJson, X, AlertTriangle 
} from 'lucide-react';

const RegistroAuditoria = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroAccion, setFiltroAccion] = useState('TODOS');
  const [filtroEntidad, setFiltroEntidad] = useState('TODOS');
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/auditoria');
      setLogs(response.data);
    } catch (error) {
      console.error("Error cargando auditoría:", error);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatearFecha = (isoString) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  const getActionColor = (accion) => {
    switch (accion) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'UPDATE': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'DELETE': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getEntidadIcon = (entidad) => {
    switch (entidad) {
      case 'ESTUDIO': return <Activity size={14} />;
      case 'AFECTACION': return <Database size={14} />;
      case 'PROCEDIMIENTO': return <ShieldCheck size={14} />;
      case 'ADJUDICACION': return <Tag size={14} />;
      case 'EXPEDIENTE': return <FileJson size={14} />;
      default: return <Database size={14} />;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.usuario || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.folioReferencia || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesAccion = filtroAccion === 'TODOS' || log.accion === filtroAccion;
    const matchesEntidad = filtroEntidad === 'TODOS' || log.entidad === filtroEntidad;

    return matchesSearch && matchesAccion && matchesEntidad;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-7xl mx-auto space-y-8"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-[#9D2449]" size={32} />
            Registro de Auditoría
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Historial inmutable de acciones y cambios en el sistema</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <div className="px-4 py-2 bg-slate-50 rounded-xl text-center">
            <p className="text-[10px] font-black uppercase text-slate-400">Total Eventos</p>
            <p className="text-xl font-bold text-slate-700">{logs.length}</p>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por usuario, folio o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9D2449]/20 focus:border-[#9D2449] transition-all font-medium"
          />
        </div>

        <select
          value={filtroAccion}
          onChange={(e) => setFiltroAccion(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#9D2449]/20 focus:border-[#9D2449] outline-none"
        >
          <option value="TODOS">Todas las Acciones</option>
          <option value="CREATE">Solo CREACIONES</option>
          <option value="UPDATE">Solo ACTUALIZACIONES</option>
          <option value="DELETE">Solo ELIMINACIONES</option>
        </select>

        <select
          value={filtroEntidad}
          onChange={(e) => setFiltroEntidad(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#9D2449]/20 focus:border-[#9D2449] outline-none"
        >
          <option value="TODOS">Todos los Módulos</option>
          <option value="ESTUDIO">Estudios de Mercado</option>
          <option value="AFECTACION">Afectaciones Pres.</option>
          <option value="PROCEDIMIENTO">Procedimientos</option>
          <option value="ADJUDICACION">Adjudicaciones</option>
          <option value="EXPEDIENTE">Expedientes</option>
        </select>
      </div>

      {/* TABLA DE AUDITORÍA */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">Fecha / Hora</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">Usuario</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">Acción</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">Módulo / Entidad</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">Registro</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">Detalles</th>
                <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">Cargando historial de auditoría...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">No se encontraron registros de auditoría.</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{formatearFecha(log.fechaHora)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <User size={12} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{log.usuario}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400">{log.rolUsuario}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getActionColor(log.accion)}`}>
                        {log.accion}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        {getEntidadIcon(log.entidad)}
                        {log.entidad}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-bold text-slate-700">{log.folioReferencia}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 font-medium line-clamp-1">{log.descripcion}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {(log.valorAnterior || log.valorNuevo) && (
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-2 rounded-xl text-slate-400 hover:text-[#9D2449] hover:bg-red-50 transition-colors mx-auto"
                        >
                          <FileJson size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE DETALLE JSON */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getActionColor(selectedLog.accion)}`}>
                    {selectedLog.accion}
                  </span>
                  <h3 className="text-lg font-black text-slate-800">
                    Detalle de Transacción — {selectedLog.folioReferencia}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-6">
                  {/* VALOR ANTERIOR */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <AlertTriangle size={14} className="text-amber-500" />
                      Valor Anterior
                    </h4>
                    <div className="bg-slate-900 rounded-2xl p-4 overflow-x-auto">
                      <pre className="text-xs text-emerald-400 font-mono whitespace-pre-wrap">
                        {selectedLog.valorAnterior ? JSON.stringify(JSON.parse(selectedLog.valorAnterior), null, 2) : 'No aplica (Creación)'}
                      </pre>
                    </div>
                  </div>

                  {/* VALOR NUEVO */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      Valor Nuevo
                    </h4>
                    <div className="bg-slate-900 rounded-2xl p-4 overflow-x-auto">
                      <pre className="text-xs text-sky-400 font-mono whitespace-pre-wrap">
                        {selectedLog.valorNuevo ? JSON.stringify(JSON.parse(selectedLog.valorNuevo), null, 2) : 'No aplica (Eliminación)'}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RegistroAuditoria;
