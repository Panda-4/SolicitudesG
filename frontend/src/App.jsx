import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, LayoutDashboard, ClipboardCheck, Search, Settings, 
  LogOut, Building2, Eye, Layers, ChevronRight, Filter, Receipt, DollarSign, KeyRound, Gavel
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import FormularioEstudio from './components/FormularioEstudio';
import DetalleExpediente from './components/DetalleExpediente';
import FormularioAfectacion from './components/FormularioAfectacion';
import DetalleAfectacion from './components/DetalleAfectacion';
import FormularioAdquisicion from './components/FormularioAdquisicion';
import DetalleProcedimiento from './components/DetalleProcedimiento';

function App() {
  const [currentView, setCurrentView] = useState('register');
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // === ESTADO PARA AFECTACIONES PRESUPUESTALES ===
  const [afectaciones, setAfectaciones] = useState([]);
  const [isLoadingAfectaciones, setIsLoadingAfectaciones] = useState(false);
  const [searchTermAfectaciones, setSearchTermAfectaciones] = useState('');
  const [selectedAfectacion, setSelectedAfectacion] = useState(null);

  // === ESTADO PARA PROCEDIMIENTOS ADQUISITIVOS ===
  const [procedimientos, setProcedimientos] = useState([]);
  const [isLoadingProcedimientos, setIsLoadingProcedimientos] = useState(false);
  const [searchTermProcedimientos, setSearchTermProcedimientos] = useState('');
  const [selectedProcedimiento, setSelectedProcedimiento] = useState(null);

  // Usuario simulado
  const currentUser = {
    name: 'Administrador',
    role: 'Administrador',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alejandro'
  };

  const hasPermission = (permission) => true; 

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    setCurrentView('dashboard');
  };

  // Función para cargar los registros desde Java
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      // Llamada a tu Backend Java para obtener la lista
      const response = await axios.get('http://localhost:8080/api/estudios/lista');
      setRecords(response.data);
    } catch (error) {
      console.error("Error cargando registros:", error);
      setRecords([]); 
    } finally {
      setIsLoading(false);
    }
  };

  // === FUNCIONES PARA AFECTACIONES PRESUPUESTALES ===
  const fetchAfectaciones = async () => {
    setIsLoadingAfectaciones(true);
    try {
      const response = await axios.get('http://localhost:8080/api/afectaciones/lista');
      setAfectaciones(response.data);
    } catch (error) {
      console.error("Error cargando afectaciones:", error);
      setAfectaciones([]);
    } finally {
      setIsLoadingAfectaciones(false);
    }
  };

  // === FUNCIONES PARA PROCEDIMIENTOS ADQUISITIVOS ===
  const fetchProcedimientos = async () => {
    setIsLoadingProcedimientos(true);
    try {
      const response = await axios.get('http://localhost:8080/api/procedimientos/lista');
      setProcedimientos(response.data);
    } catch (error) {
      console.error("Error cargando procedimientos:", error);
      setProcedimientos([]);
    } finally {
      setIsLoadingProcedimientos(false);
    }
  };

  // Funciones para manejar la vista de detalle (Estudios)
  const handleVerDetalle = (record) => {
    setSelectedRecord(record);
    setCurrentView('detail');
  };

  const handleVolverConsulta = () => {
    setSelectedRecord(null);
    setCurrentView('query');
  };

  // Funciones para manejar detalle (Afectaciones)
  const handleVerDetalleAfectacion = (record) => {
    setSelectedAfectacion(record);
    setCurrentView('budget-detail');
  };

  const handleVolverConsultaAfectacion = () => {
    setSelectedAfectacion(null);
    setCurrentView('budget-query');
  };

  // Funciones para manejar detalle (Procedimientos)
  const handleVerDetalleProcedimiento = (record) => {
    setSelectedProcedimiento(record);
    setCurrentView('procurement-detail');
  };

  const handleVolverConsultaProcedimiento = () => {
    setSelectedProcedimiento(null);
    setCurrentView('procurement-query');
  };

  // Efecto para cargar datos automáticamente según la vista
  useEffect(() => {
    if (currentView === 'query') {
      fetchRecords();
    }
    if (currentView === 'budget-query') {
      fetchAfectaciones();
    }
    if (currentView === 'procurement-query') {
      fetchProcedimientos();
    }
  }, [currentView]);

  // Filtrar registros según el buscador (Estudios)
  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (record.dependencia || '').toLowerCase().includes(search) ||
           (record.folio || '').toLowerCase().includes(search) ||
           (record.giro || '').toLowerCase().includes(search);
  });

  // Filtrar registros según el buscador (Afectaciones)
  const filteredAfectaciones = afectaciones.filter(record => {
    if (!searchTermAfectaciones) return true;
    const search = searchTermAfectaciones.toLowerCase();
    return (record.folioCa || '').toLowerCase().includes(search) ||
           (record.expediente?.folioExpediente || '').toLowerCase().includes(search) ||
           (record.expediente?.dependencia || '').toLowerCase().includes(search) ||
           (record.oficioSuficiencia || '').toLowerCase().includes(search);
  });

  // Filtrar registros según el buscador (Procedimientos)
  const filteredProcedimientos = procedimientos.filter(record => {
    if (!searchTermProcedimientos) return true;
    const search = searchTermProcedimientos.toLowerCase();
    return (record.noProcedimiento || '').toLowerCase().includes(search) ||
           (record.expediente?.folioExpediente || '').toLowerCase().includes(search) ||
           (record.expediente?.dependencia || '').toLowerCase().includes(search) ||
           (record.modalidadProcedimiento || '').toLowerCase().includes(search);
  });

  return (
    <div className="flex min-h-screen font-sans bg-[#F8FAFC] text-slate-800">
      
      {/* Sidebar Lateral */}
      <Sidebar 
        view={currentView} 
        setView={setCurrentView} 
        currentUser={currentUser} 
        handleLogout={handleLogout} 
        hasPermission={hasPermission} 
      />

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header Superior Simple */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-lg font-bold text-slate-500 uppercase tracking-widest">
            {currentView === 'register' ? 'Nuevo Registro' : 
             currentView === 'query' ? 'Consulta de Expedientes' : 
             currentView === 'detail' ? 'Detalle del Expediente' :
             currentView === 'budget-affectation' ? 'Afectación Presupuestal' :
             currentView === 'budget-query' ? 'Consulta de Suficiencia' :
             currentView === 'budget-detail' ? 'Detalle de Afectación' :
             currentView === 'procurement-register' ? 'Registro de Procedimiento' :
             currentView === 'procurement-query' ? 'Consulta de Procedimientos' :
             currentView === 'procurement-detail' ? 'Detalle del Procedimiento' :
             'Panel de Control'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-400">{currentUser.name}</span>
            <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-[#9D2449]" />
          </div>
        </header>

        {/* Área de Vistas Dinámicas */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          <AnimatePresence mode="wait">
            
            {/* VISTA: FORMULARIO DE REGISTRO */}
            {currentView === 'register' && (
              <motion.div
                key="formulario"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Pasamos fetchRecords como onSuccess para refrescar la tabla y cambiar de vista al guardar */}
                <FormularioEstudio onSuccess={() => {
                  fetchRecords();
                  setCurrentView('query');
                }} />
              </motion.div>
            )}

            {/* VISTA: CONSULTA (TABLA) */}
            {currentView === 'query' && (
              <motion.div
                key="consulta"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Barra de Búsqueda y Filtros */}
                <div className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="relative w-full md:w-96 group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#9D2449] transition-colors">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscador inteligente (Folio, Dependencia, Giro)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none transition-all font-bold text-slate-700 focus:bg-white focus:border-[#9D2449]/30 placeholder:text-slate-300"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 text-slate-500 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-slate-100 transition-all">
                    <Filter size={16} /> Filtros Avanzados
                  </button>
                </div>

                {/* Tabla de Resultados */}
                <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
                  {isLoading ? (
                    <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                      Cargando expedientes desde la base de datos...
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[1000px]">
                        <thead>
                          <tr className="border-b border-slate-50 bg-slate-50/50 uppercase text-[10px] font-black tracking-widest text-slate-400">
                            <th className="px-10 py-6">Folio / ID</th>
                            <th className="px-6 py-6">Dependencia</th>
                            <th className="px-6 py-6">Giro</th>
                            <th className="px-6 py-6 text-right">Valor</th>
                            <th className="px-6 py-6">Estatus</th>
                            <th className="px-10 py-6 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredRecords.length > 0 ? (
                            filteredRecords.map((record, idx) => (
                              <tr key={idx} className="group hover:bg-slate-50/80 transition-colors">
                                <td className="px-10 py-6 font-mono font-black text-[#9D2449]">
                                  {record.folio || `EM-2026-${1000 + idx}`}
                                </td>
                                <td className="px-6 py-6 font-bold text-slate-700">
                                  {record.dependencia || 'Sin Asignar'}
                                </td>
                                <td className="px-6 py-6">
                                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#B38E5D]/10 text-[#B38E5D] border border-[#B38E5D]/20">
                                    {record.giro || 'General'}
                                  </span>
                                </td>
                                <td className="px-6 py-6 text-right font-black text-slate-900">
                                  ${record.valorEstudio ? record.valorEstudio.toLocaleString('es-MX') : '0.00'}
                                </td>
                                <td className="px-6 py-6">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                    record.estatus === 'APROBADO' || record.estatus === 'Completado'
                                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                      : record.estatus === 'PENDIENTE' || record.estatus === 'En Proceso'
                                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                                      : 'bg-slate-100 text-slate-500 border-slate-200'
                                  }`}>
                                    {record.estatus || 'Pendiente'}
                                  </span>
                                </td>
                                <td className="px-10 py-6 text-center">
                                  <div className="flex items-center justify-center gap-3">
                                    {/* Botón Detalle Actualizado */}
                                    <button 
                                      onClick={() => handleVerDetalle(record)} 
                                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-[#9D2449] rounded-xl text-[10px] font-black uppercase hover:bg-[#9D2449] hover:text-white hover:border-[#9D2449] transition-all shadow-sm"
                                    >
                                      <Eye size={14} /> Detalle
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#B38E5D] text-[#B38E5D] rounded-xl text-[10px] font-black uppercase hover:bg-[#B38E5D] hover:text-white transition-all shadow-sm">
                                      <Layers size={14} /> CA
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-10 py-10 text-center text-slate-400 font-bold uppercase text-xs tracking-widest italic">
                                No se encontraron registros coincidentes.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {/* Footer de la Tabla */}
                  <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center text-slate-400">
                    <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Building2 size={14} /> Mostrando {filteredRecords.length} expedientes activos
                    </p>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white rounded-lg transition-colors"><ChevronRight size={16} className="rotate-180" /></button>
                      <button className="p-2 hover:bg-white rounded-lg transition-colors"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VISTA: DETALLE DEL EXPEDIENTE */}
            {currentView === 'detail' && selectedRecord && (
              <motion.div
                key="detalle"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DetalleExpediente 
                  estudio={selectedRecord} 
                  onBack={handleVolverConsulta} 
                />
              </motion.div>
            )}

            {/* ============================================= */}
            {/* VISTAS: AFECTACIÓN PRESUPUESTAL              */}
            {/* ============================================= */}

            {/* VISTA: FORMULARIO AFECTACIÓN */}
            {currentView === 'budget-affectation' && (
              <motion.div
                key="formulario-afectacion"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FormularioAfectacion onSuccess={() => {
                  fetchAfectaciones();
                  setCurrentView('budget-query');
                }} />
              </motion.div>
            )}

            {/* VISTA: CONSULTA AFECTACIONES (TABLA) */}
            {currentView === 'budget-query' && (
              <motion.div
                key="consulta-afectaciones"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Barra de Búsqueda */}
                <div className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="relative w-full md:w-96 group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#B38E5D] transition-colors">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar (Folio CA, Expediente, Dependencia, Oficio)..."
                      value={searchTermAfectaciones}
                      onChange={(e) => setSearchTermAfectaciones(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none transition-all font-bold text-slate-700 focus:bg-white focus:border-[#B38E5D]/30 placeholder:text-slate-300"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 text-slate-500 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-slate-100 transition-all">
                    <Filter size={16} /> Filtros Avanzados
                  </button>
                </div>

                {/* Tabla de Resultados de Afectaciones */}
                <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
                  {isLoadingAfectaciones ? (
                    <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                      Cargando afectaciones presupuestales...
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[1100px]">
                        <thead>
                          <tr className="border-b border-slate-50 bg-slate-50/50 uppercase text-[10px] font-black tracking-widest text-slate-400">
                            <th className="px-8 py-6">Folio CA</th>
                            <th className="px-6 py-6">Expediente</th>
                            <th className="px-6 py-6">Dependencia</th>
                            <th className="px-6 py-6">Fuente</th>
                            <th className="px-6 py-6 text-right">Importe</th>
                            <th className="px-6 py-6">Estatus</th>
                            <th className="px-8 py-6 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredAfectaciones.length > 0 ? (
                            filteredAfectaciones.map((record, idx) => (
                              <tr key={idx} className="group hover:bg-slate-50/80 transition-colors">
                                <td className="px-8 py-6 font-mono font-black text-[#B38E5D]">
                                  {record.folioCa || `CA-2026-${1000 + idx}`}
                                </td>
                                <td className="px-6 py-6 font-mono text-xs font-bold text-slate-500">
                                  {record.expediente?.folioExpediente || 'Sin Expediente'}
                                </td>
                                <td className="px-6 py-6 font-bold text-slate-700">
                                  {record.expediente?.dependencia || 'Sin Asignar'}
                                </td>
                                <td className="px-6 py-6">
                                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#B38E5D]/10 text-[#B38E5D] border border-[#B38E5D]/20">
                                    {record.fuenteFinanciamiento || 'N/A'}
                                  </span>
                                </td>
                                <td className="px-6 py-6 text-right font-black text-slate-900">
                                  {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(record.importeSuficiencia || 0)}
                                </td>
                                <td className="px-6 py-6">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                    record.estatus === 'Suficiencia Aprobada'
                                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                      : record.estatus === 'En Revisión'
                                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                                      : record.estatus === 'Rechazado'
                                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                                      : 'bg-slate-100 text-slate-500 border-slate-200'
                                  }`}>
                                    {record.estatus || 'Pendiente'}
                                  </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                  <button 
                                    onClick={() => handleVerDetalleAfectacion(record)} 
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-[#9D2449] rounded-xl text-[10px] font-black uppercase hover:bg-[#9D2449] hover:text-white hover:border-[#9D2449] transition-all shadow-sm mx-auto"
                                  >
                                    <Eye size={14} /> Detalle
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="px-10 py-10 text-center text-slate-400 font-bold uppercase text-xs tracking-widest italic">
                                No se encontraron afectaciones presupuestales.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {/* Footer de la Tabla */}
                  <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center text-slate-400">
                    <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Receipt size={14} /> Mostrando {filteredAfectaciones.length} afectaciones registradas
                    </p>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white rounded-lg transition-colors"><ChevronRight size={16} className="rotate-180" /></button>
                      <button className="p-2 hover:bg-white rounded-lg transition-colors"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VISTA: DETALLE DE AFECTACIÓN */}
            {currentView === 'budget-detail' && selectedAfectacion && (
              <motion.div
                key="detalle-afectacion"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DetalleAfectacion 
                  afectacion={selectedAfectacion} 
                  onBack={handleVolverConsultaAfectacion} 
                />
              </motion.div>
            )}

            {/* ============================================= */}
            {/* VISTAS: ADQUISICIONES Y CONTRATACIÓN         */}
            {/* ============================================= */}

            {/* VISTA: FORMULARIO PROCEDIMIENTO */}
            {currentView === 'procurement-register' && (
              <motion.div
                key="formulario-procedimiento"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FormularioAdquisicion onSuccess={() => {
                  fetchProcedimientos();
                  setCurrentView('procurement-query');
                }} />
              </motion.div>
            )}

            {/* VISTA: CONSULTA PROCEDIMIENTOS (TABLA) */}
            {currentView === 'procurement-query' && (
              <motion.div
                key="consulta-procedimientos"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Barra de Búsqueda */}
                <div className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="relative w-full md:w-96 group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#9D2449] transition-colors">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar (No. Procedimiento, Expediente, Modalidad)..."
                      value={searchTermProcedimientos}
                      onChange={(e) => setSearchTermProcedimientos(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none transition-all font-bold text-slate-700 focus:bg-white focus:border-[#9D2449]/30 placeholder:text-slate-300"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 text-slate-500 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-slate-100 transition-all">
                    <Filter size={16} /> Filtros Avanzados
                  </button>
                </div>

                {/* Tabla de Resultados */}
                <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
                  {isLoadingProcedimientos ? (
                    <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                      Cargando procedimientos adquisitivos...
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[1100px]">
                        <thead>
                          <tr className="border-b border-slate-50 bg-slate-50/50 uppercase text-[10px] font-black tracking-widest text-slate-400">
                            <th className="px-8 py-6">No. Procedimiento</th>
                            <th className="px-6 py-6">Expediente</th>
                            <th className="px-6 py-6">Modalidad</th>
                            <th className="px-6 py-6">Medio</th>
                            <th className="px-6 py-6">Fecha Fallo</th>
                            <th className="px-6 py-6">Estatus</th>
                            <th className="px-8 py-6 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredProcedimientos.length > 0 ? (
                            filteredProcedimientos.map((record, idx) => (
                              <tr key={idx} className="group hover:bg-slate-50/80 transition-colors">
                                <td className="px-8 py-6 font-mono font-black text-[#9D2449]">
                                  {record.noProcedimiento || 'N/A'}
                                </td>
                                <td className="px-6 py-6 font-mono text-xs font-bold text-slate-500">
                                  {record.expediente?.folioExpediente || 'Sin Expediente'}
                                </td>
                                <td className="px-6 py-6">
                                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#9D2449]/10 text-[#9D2449] border border-[#9D2449]/20">
                                    {record.modalidadProcedimiento || 'N/A'}
                                  </span>
                                </td>
                                <td className="px-6 py-6 font-bold text-slate-600 text-sm">
                                  {record.medioPublicacion || 'N/A'}
                                </td>
                                <td className="px-6 py-6 font-bold text-slate-600 text-sm">
                                  {record.fechaFallo || '—'}
                                </td>
                                <td className="px-6 py-6">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                    record.estatus === 'Adjudicado'
                                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                      : record.estatus === 'En Proceso' || record.estatus === 'Publicado'
                                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                                      : record.estatus === 'Cancelado' || record.estatus === 'Desierto'
                                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                                      : 'bg-slate-100 text-slate-500 border-slate-200'
                                  }`}>
                                    {record.estatus || 'Pendiente'}
                                  </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                  <button
                                    onClick={() => handleVerDetalleProcedimiento(record)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-[#9D2449] rounded-xl text-[10px] font-black uppercase hover:bg-[#9D2449] hover:text-white hover:border-[#9D2449] transition-all shadow-sm mx-auto"
                                  >
                                    <Eye size={14} /> Detalle
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="px-10 py-10 text-center text-slate-400 font-bold uppercase text-xs tracking-widest italic">
                                No se encontraron procedimientos adquisitivos.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center text-slate-400">
                    <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Gavel size={14} /> Mostrando {filteredProcedimientos.length} procedimientos registrados
                    </p>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white rounded-lg transition-colors"><ChevronRight size={16} className="rotate-180" /></button>
                      <button className="p-2 hover:bg-white rounded-lg transition-colors"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VISTA: DETALLE DEL PROCEDIMIENTO */}
            {currentView === 'procurement-detail' && selectedProcedimiento && (
              <motion.div
                key="detalle-procedimiento"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DetalleProcedimiento
                  procedimiento={selectedProcedimiento}
                  onBack={handleVolverConsultaProcedimiento}
                />
              </motion.div>
            )}

            {/* VISTA: DASHBOARD (Placeholder) */}
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center h-full text-slate-400"
              >
                <div className="text-center space-y-4">
                  <LayoutDashboard size={64} className="mx-auto text-slate-200" />
                  <h1 className="text-4xl font-black uppercase tracking-widest">Panel de Control</h1>
                  <p className="font-bold">Próximamente: Gráficas y Estadísticas</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;