import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Calendar, Clock, Gavel, Link2, Megaphone,
  FolderOpen, Hash, CheckCircle2, ExternalLink, Printer
} from 'lucide-react';

const CRONOGRAMA_LABELS = [
  { fechaKey: 'fechaJuntaAclaracion', horaKey: 'horaJuntaAclaracion', label: 'Junta de Aclaración' },
  { fechaKey: 'fechaPresentacionApertura', horaKey: 'horaPresentacionApertura', label: 'Presentación y Apertura de Proposiciones' },
  { fechaKey: 'fechaSesionComite', horaKey: 'horaSesionComite', label: 'Sesión del Comité de Adquisiciones' },
  { fechaKey: 'fechaContraOferta', horaKey: 'horaContraOferta', label: 'Contra Oferta' },
  { fechaKey: 'fechaDictaminacion', horaKey: 'horaDictaminacion', label: 'Dictaminación de Adjudicación' },
  { fechaKey: 'fechaSesionSubcomite', horaKey: 'horaSesionSubcomite', label: 'Sesión del Subcomité Revisor' },
  { fechaKey: 'fechaFallo', horaKey: 'horaFallo', label: 'Fallo' },
];

const DetalleProcedimiento = ({ procedimiento, onBack }) => {
  if (!procedimiento) return null;

  const estatusColor = (estatus) => {
    switch (estatus) {
      case 'Adjudicado': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'En Proceso': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Publicado': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'En Evaluación': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Desierto': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Cancelado': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-0 print:rounded-none"
      >
        {/* Barra Decorativa */}
        <div className="h-4 w-full bg-gradient-to-r from-[#9D2449] via-[#B38E5D] to-[#9D2449]" />

        <div className="p-12 md:p-16">
          {/* Acciones Superiores */}
          <div className="flex items-center justify-between mb-10 print:hidden">
            <button onClick={onBack}
              className="flex items-center gap-2 text-[#9D2449] font-black uppercase text-xs tracking-widest hover:gap-3 transition-all">
              <ArrowLeft size={16} /> Volver a Consulta
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-[#9D2449] hover:border-[#9D2449] transition-all shadow-sm font-bold text-sm">
              <Printer size={18} />
              Descargar PDF
            </button>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12 border-b border-slate-50 pb-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#9D2449]/10">
                  <Gavel size={24} className="text-[#9D2449]" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Detalle del Procedimiento</h1>
              </div>
              <p className="font-bold uppercase text-[10px] tracking-[0.3em] ml-12 text-slate-400">Información completa del procedimiento adquisitivo</p>
            </div>

            {/* No. Procedimiento */}
            <div className="border-2 p-5 rounded-[32px] shadow-lg min-w-[260px] bg-white border-[#9D2449] shadow-[#9D2449]/10">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-center text-[#9D2449]">No. Procedimiento</p>
              <p className="text-2xl font-black text-center font-mono text-[#9D2449]">
                {procedimiento.noProcedimiento || 'N/A'}
              </p>
            </div>
          </div>

          {/* Tarjetas de Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Expediente */}
            <div className="p-5 bg-gradient-to-br from-[#9D2449]/5 to-transparent rounded-2xl border border-[#9D2449]/10">
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen size={14} className="text-[#9D2449]" />
                <p className="text-[10px] font-black uppercase text-slate-400">Expediente</p>
              </div>
              <p className="font-black text-[#9D2449]">{procedimiento.expediente?.folioExpediente || 'N/A'}</p>
              <p className="text-xs font-bold text-slate-500 truncate mt-1">{procedimiento.expediente?.dependencia || 'Sin dependencia'}</p>
            </div>

            {/* Modalidad */}
            <div className="p-5 bg-gradient-to-br from-[#B38E5D]/5 to-transparent rounded-2xl border border-[#B38E5D]/10">
              <div className="flex items-center gap-2 mb-2">
                <Gavel size={14} className="text-[#B38E5D]" />
                <p className="text-[10px] font-black uppercase text-slate-400">Modalidad</p>
              </div>
              <p className="font-bold text-slate-700 text-sm">{procedimiento.modalidadProcedimiento || 'N/A'}</p>
            </div>

            {/* Medio de Publicación */}
            <div className="p-5 bg-gradient-to-br from-slate-50 to-transparent rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Megaphone size={14} className="text-[#B38E5D]" />
                <p className="text-[10px] font-black uppercase text-slate-400">Medio</p>
              </div>
              <p className="font-bold text-slate-700 text-sm">{procedimiento.medioPublicacion || 'N/A'}</p>
            </div>

            {/* Estatus */}
            <div className="p-5 bg-gradient-to-br from-slate-50 to-transparent rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={14} className="text-[#B38E5D]" />
                <p className="text-[10px] font-black uppercase text-slate-400">Estatus</p>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase border ${estatusColor(procedimiento.estatus)}`}>
                {procedimiento.estatus || 'Pendiente'}
              </span>
            </div>
          </div>

          {/* Convocatoria URL */}
          {procedimiento.convocatoriaUrl && (
            <div className="mb-12 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Link2 size={14} className="text-[#B38E5D]" />
                <p className="text-[10px] font-black uppercase text-slate-400">Convocatoria / Invitación</p>
              </div>
              <a href={procedimiento.convocatoriaUrl} target="_blank" rel="noopener noreferrer"
                className="text-[#9D2449] font-bold text-sm hover:underline flex items-center gap-2 break-all">
                {procedimiento.convocatoriaUrl} <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* ========================================= */}
          {/* CRONOGRAMA DEL PROCEDIMIENTO              */}
          {/* ========================================= */}
          <div className="bg-gradient-to-br from-slate-50 to-[#9D2449]/5 rounded-[32px] border border-slate-100 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-[#9D2449]/10">
                <Calendar size={20} className="text-[#9D2449]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Cronograma del Procedimiento</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Fechas y horarios registrados</p>
              </div>
            </div>

            <div className="space-y-3">
              {CRONOGRAMA_LABELS.map((evento, idx) => {
                const fecha = procedimiento[evento.fechaKey];
                const hora = procedimiento[evento.horaKey];
                const tieneInfo = fecha || hora;

                return (
                  <div key={idx}
                    className={`flex flex-col md:flex-row items-stretch md:items-center gap-4 p-4 rounded-2xl border transition-all ${
                      tieneInfo ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50/50 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        tieneInfo ? 'bg-[#9D2449] text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <p className={`font-bold text-sm leading-tight ${tieneInfo ? 'text-slate-700' : 'text-slate-400'}`}>
                        {evento.label}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#B38E5D]" />
                        <span className="font-bold text-sm text-slate-700 w-28">{fecha || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#B38E5D]" />
                        <span className="font-bold text-sm text-slate-700 w-16">{hora || '—'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fecha de Registro */}
          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              Fecha de registro: {procedimiento.fechaRegistro || 'N/A'}
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default DetalleProcedimiento;
