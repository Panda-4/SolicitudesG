import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Calendar, CheckCircle2, ChevronDown, Clock, FolderOpen,
  Gavel, Link2, Megaphone, RotateCcw, Hash, DollarSign, Receipt
} from 'lucide-react';

const MODALIDADES = [
  'Licitación Pública Nacional',
  'Licitación Pública Internacional',
  'Invitación a cuando menos tres personas',
  'Adjudicación Directa',
];

const MEDIOS_PUBLICACION = [
  'CompraNet',
  'Diario Oficial de la Federación',
  'Gaceta del Gobierno del Estado de México',
  'Portal Institucional',
  'Periódico de Circulación Nacional',
  'Otros',
];

const CRONOGRAMA_EVENTOS = [
  { key: 'juntaAclaracion', label: 'Junta de Aclaración' },
  { key: 'presentacionApertura', label: 'Presentación y Apertura de Proposiciones' },
  { key: 'sesionComite', label: 'Sesión del Comité de Adquisiciones (Análisis Cualitativo)' },
  { key: 'contraOferta', label: 'Contra Oferta' },
  { key: 'dictaminacion', label: 'Dictaminación de Adjudicación del Comité' },
  { key: 'sesionSubcomite', label: 'Sesión del Subcomité Revisor de Convocatorias' },
  { key: 'fallo', label: 'Fallo' },
];

const initCronograma = () =>
  CRONOGRAMA_EVENTOS.reduce((acc, ev) => {
    acc[ev.key] = { fecha: '', hora: '' };
    return acc;
  }, {});

const FormularioAdquisicion = ({ onSuccess }) => {
  const [expedientes, setExpedientes] = useState([]);
  const [afectaciones, setAfectaciones] = useState([]);
  const [selectedExpedienteId, setSelectedExpedienteId] = useState('');
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const expInfo = expedientes.find(e => e.id === parseInt(selectedExpedienteId));
  const afectacionesDelExp = afectaciones.filter(a => a.expediente?.id === parseInt(selectedExpedienteId));

  const [formData, setFormData] = useState({
    noProcedimiento: '',
    modalidadProcedimiento: '',
    convocatoriaUrl: '',
    medioPublicacion: '',
    estatus: 'En Proceso',
  });

  const [cronograma, setCronograma] = useState(initCronograma());

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resExp, resAfec] = await Promise.all([
          axios.get('http://localhost:8080/api/expedientes'),
          axios.get('http://localhost:8080/api/afectaciones/lista'),
        ]);
        setExpedientes(resExp.data);
        setAfectaciones(resAfec.data);
      } catch (e) { console.log("Error cargando datos."); }
    };
    cargar();
  }, []);

  const handleChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleCrono = (key, field) => (e) =>
    setCronograma({ ...cronograma, [key]: { ...cronograma[key], [field]: e.target.value } });

  const handleLimpiar = () => {
    setFormData({ noProcedimiento: '', modalidadProcedimiento: '', convocatoriaUrl: '', medioPublicacion: '', estatus: 'En Proceso' });
    setCronograma(initCronograma());
    setSelectedExpedienteId('');
    setMostrarDetalles(false);
  };

  const handleGuardar = async () => {
    if (!selectedExpedienteId) { alert('⚠️ Selecciona un Expediente.'); return; }
    if (!formData.noProcedimiento) { alert('⚠️ Ingresa el No. de Procedimiento.'); return; }

    try {
      const datos = {
        expediente: { id: parseInt(selectedExpedienteId) },
        ...formData,
        fechaJuntaAclaracion: cronograma.juntaAclaracion.fecha,
        horaJuntaAclaracion: cronograma.juntaAclaracion.hora,
        fechaPresentacionApertura: cronograma.presentacionApertura.fecha,
        horaPresentacionApertura: cronograma.presentacionApertura.hora,
        fechaSesionComite: cronograma.sesionComite.fecha,
        horaSesionComite: cronograma.sesionComite.hora,
        fechaContraOferta: cronograma.contraOferta.fecha,
        horaContraOferta: cronograma.contraOferta.hora,
        fechaDictaminacion: cronograma.dictaminacion.fecha,
        horaDictaminacion: cronograma.dictaminacion.hora,
        fechaSesionSubcomite: cronograma.sesionSubcomite.fecha,
        horaSesionSubcomite: cronograma.sesionSubcomite.hora,
        fechaFallo: cronograma.fallo.fecha,
        horaFallo: cronograma.fallo.hora,
      };
      await axios.post('http://localhost:8080/api/procedimientos', datos);
      alert('✅ Procedimiento guardado exitosamente');
      handleLimpiar();
      if (onSuccess) onSuccess();
    } catch (error) {
      alert('❌ Error al guardar. Revisa la consola.');
      console.error(error);
    }
  };

  const inputClass = "w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none transition-all font-bold text-slate-700 focus:bg-white focus:border-[#9D2449]/30 shadow-sm";
  const labelClass = "text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-400 mb-2 ml-1";

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 relative"
      >
        {/* Barra Decorativa Superior */}
        <div className="h-4 w-full bg-gradient-to-r from-[#9D2449] via-[#B38E5D] to-[#9D2449]" />

        <div className="p-12 md:p-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16 border-b border-slate-50 pb-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#9D2449]/10">
                  <Gavel size={24} className="text-[#9D2449]" />
                </div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900">Adquisiciones y Contratación</h1>
              </div>
              <p className="font-bold uppercase text-[10px] tracking-[0.3em] ml-12 text-slate-400">Módulo de Procedimientos Adquisitivos</p>
            </div>

            {/* No. Procedimiento (Manual) */}
            <div className="border-2 p-4 rounded-[32px] shadow-lg min-w-[280px] group transition-all bg-white border-[#9D2449] focus-within:border-[#B38E5D] shadow-[#9D2449]/10">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-center text-[#9D2449]">No. Procedimiento</p>
              <input
                type="text"
                value={formData.noProcedimiento}
                onChange={handleChange('noProcedimiento')}
                placeholder="Ej: LP-001-2026"
                className="w-full text-2xl font-black text-center font-mono bg-transparent outline-none text-[#9D2449] placeholder:text-[#9D2449]/30"
              />
            </div>
          </div>

          {/* === SELECTOR DE EXPEDIENTE === */}
          <div className="mb-12 p-6 bg-gradient-to-r from-[#9D2449]/5 to-[#B38E5D]/5 rounded-[32px] border-2 border-dashed border-[#9D2449]/15">
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>
                <FolderOpen size={16} className="text-[#9D2449]" /> Expediente Vinculado (Obligatorio)
              </label>
              {selectedExpedienteId && (
                <button
                  type="button"
                  onClick={() => setMostrarDetalles(!mostrarDetalles)}
                  className="text-[10px] font-black uppercase tracking-widest text-[#B38E5D] hover:text-[#9D2449] flex items-center gap-1 transition-all"
                >
                  {mostrarDetalles ? 'Ocultar Detalles' : 'Consultar Información'}
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={selectedExpedienteId}
                onChange={(e) => { setSelectedExpedienteId(e.target.value); if (!e.target.value) setMostrarDetalles(false); }}
                className={`${inputClass} appearance-none cursor-pointer bg-white border-[#9D2449]/20 focus:border-[#9D2449]/50`}
              >
                <option value="">Seleccione un Expediente...</option>
                {expedientes.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.folioExpediente} — {exp.dependencia || 'Sin dependencia'} — {exp.estatusGeneral}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#9D2449]/40 pointer-events-none" size={20} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-2 ml-2 italic">
              Vincula este procedimiento al expediente maestro de adquisiciones.
            </p>

            {/* Detalles del Expediente + Afectaciones (Collapsible) */}
            {mostrarDetalles && expInfo && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 space-y-4">
                
                {/* Info del Expediente */}
                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                    <FolderOpen size={12} /> Datos del Expediente
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Folio</p>
                      <p className="font-black text-[#9D2449]">{expInfo.folioExpediente}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Dependencia</p>
                      <p className="font-bold text-slate-700 truncate" title={expInfo.dependencia}>{expInfo.dependencia || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Estatus</p>
                      <p className="font-bold text-slate-700">{expInfo.estatusGeneral || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Fecha Creación</p>
                      <p className="font-bold text-slate-700">{expInfo.fechaCreacion || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Afectaciones Presupuestales vinculadas */}
                <div className="p-5 bg-gradient-to-r from-[#B38E5D]/5 to-white rounded-2xl border border-[#B38E5D]/15 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#B38E5D] mb-3 flex items-center gap-2">
                    <Receipt size={12} /> Afectaciones Presupuestales (CA) vinculadas
                  </p>
                  {afectacionesDelExp.length > 0 ? (
                    <div className="space-y-3">
                      {afectacionesDelExp.map((ca) => (
                        <div key={ca.id} className="flex flex-col md:flex-row md:items-center gap-3 p-4 bg-white rounded-xl border border-slate-100">
                          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <p className="text-[9px] font-bold uppercase text-slate-400">Folio CA</p>
                              <p className="font-black text-[#B38E5D] font-mono text-sm">{ca.folioCa || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold uppercase text-slate-400">Importe</p>
                              <p className="font-black text-slate-800 text-sm">
                                {ca.importeSuficiencia ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(ca.importeSuficiencia) : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold uppercase text-slate-400">Oficio</p>
                              <p className="font-bold text-slate-600 text-sm truncate">{ca.oficioSuficiencia || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold uppercase text-slate-400">Estatus</p>
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                ca.estatus === 'Suficiencia Aprobada' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                ca.estatus === 'Rechazado' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>{ca.estatus || 'Pendiente'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-slate-400 italic">No hay afectaciones presupuestales registradas para este expediente.</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* === FORMULARIO EN DOS COLUMNAS === */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 mb-12">

            {/* Columna Izquierda */}
            <div className="space-y-10">
              {/* Modalidad */}
              <div className="space-y-2">
                <label className={labelClass}>
                  <Gavel size={16} className="text-[#B38E5D]" /> Modalidad del Procedimiento
                </label>
                <div className="relative">
                  <select value={formData.modalidadProcedimiento} onChange={handleChange('modalidadProcedimiento')}
                    className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Seleccione Modalidad...</option>
                    {MODALIDADES.map((m, i) => (<option key={i} value={m}>{m}</option>))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Convocatoria URL */}
              <div className="space-y-2">
                <label className={labelClass}>
                  <Link2 size={16} className="text-[#B38E5D]" /> Convocatoria / Invitación (URL)
                </label>
                <input
                  type="url"
                  value={formData.convocatoriaUrl}
                  onChange={handleChange('convocatoriaUrl')}
                  placeholder="https://ejemplo.com/convocatoria"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-10">
              {/* Medio de Publicación */}
              <div className="space-y-2">
                <label className={labelClass}>
                  <Megaphone size={16} className="text-[#B38E5D]" /> Medio de Publicación
                </label>
                <div className="relative">
                  <select value={formData.medioPublicacion} onChange={handleChange('medioPublicacion')}
                    className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Seleccione Medio...</option>
                    {MEDIOS_PUBLICACION.map((m, i) => (<option key={i} value={m}>{m}</option>))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Estatus */}
              <div className="space-y-2">
                <label className={labelClass}>
                  <CheckCircle2 size={16} className="text-[#B38E5D]" /> Estatus del Procedimiento
                </label>
                <div className="relative">
                  <select value={formData.estatus} onChange={handleChange('estatus')}
                    className={`${inputClass} appearance-none cursor-pointer font-black text-sm shadow-sm bg-indigo-50 text-indigo-700 border-indigo-100`}>
                    <option value="En Proceso">🔄 En Proceso</option>
                    <option value="Publicado">📢 Publicado</option>
                    <option value="En Evaluación">🔍 En Evaluación</option>
                    <option value="Adjudicado">✅ Adjudicado</option>
                    <option value="Desierto">⚪ Desierto</option>
                    <option value="Cancelado">❌ Cancelado</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" size={20} />
                </div>
              </div>
            </div>
          </form>

          {/* ========================================= */}
          {/* CRONOGRAMA DEL PROCEDIMIENTO (FULL WIDTH) */}
          {/* ========================================= */}
          <div className="bg-gradient-to-br from-slate-50 to-[#9D2449]/5 rounded-[32px] border border-slate-100 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-[#9D2449]/10">
                <Calendar size={20} className="text-[#9D2449]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Cronograma del Procedimiento</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Fechas y horarios de cada etapa</p>
              </div>
            </div>

            <div className="space-y-4">
              {CRONOGRAMA_EVENTOS.map((evento, idx) => (
                <div key={evento.key}
                  className="flex flex-col md:flex-row items-stretch md:items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Número + Nombre del Evento */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#9D2449] text-white flex items-center justify-center text-xs font-black shrink-0">
                      {idx + 1}
                    </div>
                    <p className="font-bold text-sm text-slate-700 leading-tight">{evento.label}</p>
                  </div>

                  {/* Fecha */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Calendar size={14} className="text-[#B38E5D]" />
                    <input
                      type="date"
                      value={cronograma[evento.key].fecha}
                      onChange={handleCrono(evento.key, 'fecha')}
                      className="px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl outline-none font-bold text-slate-700 focus:bg-white focus:border-[#9D2449]/30 transition-all w-44"
                    />
                  </div>

                  {/* Hora */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Clock size={14} className="text-[#B38E5D]" />
                    <input
                      type="time"
                      value={cronograma[evento.key].hora}
                      onChange={handleCrono(evento.key, 'hora')}
                      className="px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl outline-none font-bold text-slate-700 focus:bg-white focus:border-[#9D2449]/30 transition-all w-36"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="mt-16 flex flex-col sm:flex-row justify-end gap-6 pt-12 border-t border-slate-50">
            <button type="button"
              className="px-12 py-5 font-black uppercase text-xs tracking-widest text-slate-500 hover:text-[#9D2449] transition-all">
              Cancelar
            </button>
            <button type="button" onClick={handleLimpiar}
              className="flex items-center justify-center gap-2 px-12 py-5 font-black uppercase text-xs tracking-widest text-[#B38E5D] border-2 border-[#B38E5D]/30 rounded-[24px] hover:bg-[#B38E5D]/10 transition-all">
              <RotateCcw size={16} /> Limpiar Formulario
            </button>
            <button type="button" onClick={handleGuardar}
              className="px-20 py-5 font-black rounded-[24px] shadow-2xl transition-all transform hover:-translate-y-1 bg-[#9D2449] text-white shadow-[#9D2449]/30 hover:bg-[#7a1c39]">
              Guardar Procedimiento
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default FormularioAdquisicion;
