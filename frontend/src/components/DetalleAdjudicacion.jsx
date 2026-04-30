import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Award, User, FileText, DollarSign, Calendar,
  Link2, ExternalLink, FolderOpen, Hash, CheckCircle2, MessageSquare, RotateCcw, Printer, Edit3, Trash2
} from 'lucide-react';
import { getUser, canEditRecord } from '../services/authService';
import ConfirmModal from './ConfirmModal';

const DetalleAdjudicacion = ({ adjudicacion, onBack, onEdit, onDelete }) => {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const isAdmin = getUser()?.rol === 'ADMINISTRADOR';
  const canEdit = canEditRecord('ADJUDICACION', adjudicacion?.creadorUsername);

  if (!adjudicacion) return null;

  const estatusColor = (estatus) => {
    switch (estatus) {
      case 'Adjudicado': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Formalizado': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'En Revisión': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pendiente de Firma': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Cancelado': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const formatMXN = (val) => val ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val) : 'N/A';

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-0 print:rounded-none">
        <div className="h-4 w-full bg-gradient-to-r from-[#9D2449] via-[#B38E5D] to-[#9D2449]" />

        <div className="p-12 md:p-16">
          {/* Acciones Superiores */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 print:hidden">
            <button onClick={onBack}
              className="flex items-center gap-2 text-[#9D2449] font-black uppercase text-xs tracking-widest hover:gap-3 transition-all">
              <ArrowLeft size={16} /> Volver a Consulta
            </button>
            <div className="flex gap-3">
              {canEdit && (
                <button
                  onClick={() => onEdit && onEdit(adjudicacion)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#B38E5D] text-[#B38E5D] rounded-xl hover:bg-[#B38E5D] hover:text-white transition-all shadow-sm font-bold text-sm"
                >
                  <Edit3 size={18} /> Editar
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#9D2449] text-[#9D2449] rounded-xl hover:bg-[#9D2449] hover:text-white transition-all shadow-sm font-bold text-sm"
                >
                  <Trash2 size={18} /> Eliminar
                </button>
              )}
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-[#9D2449] hover:border-[#9D2449] transition-all shadow-sm font-bold text-sm">
                <Printer size={18} />
                Descargar PDF
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12 border-b border-slate-50 pb-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#9D2449]/10"><Award size={24} className="text-[#9D2449]" /></div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Detalle de Adjudicación</h1>
              </div>
              <p className="font-bold uppercase text-[10px] tracking-[0.3em] ml-12 text-slate-400">Información completa del registro</p>
            </div>
            <div className="border-2 p-5 rounded-[32px] shadow-lg min-w-[260px] bg-white border-[#B38E5D] shadow-[#B38E5D]/10">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-center text-[#B38E5D]">Folio Interno</p>
              <p className="text-2xl font-black text-center font-mono text-[#9D2449]">{adjudicacion.folioInterno || 'N/A'}</p>
            </div>
          </div>

          {/* Info Cards Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="p-5 bg-gradient-to-br from-[#9D2449]/5 to-transparent rounded-2xl border border-[#9D2449]/10">
              <div className="flex items-center gap-2 mb-2"><FolderOpen size={14} className="text-[#9D2449]" /><p className="text-[10px] font-black uppercase text-slate-400">Expediente</p></div>
              <p className="font-black text-[#9D2449]">{adjudicacion.expediente?.folioExpediente || 'N/A'}</p>
              <p className="text-xs font-bold text-slate-500 truncate mt-1">{adjudicacion.expediente?.dependencia || 'Sin dependencia'}</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-[#B38E5D]/5 to-transparent rounded-2xl border border-[#B38E5D]/10">
              <div className="flex items-center gap-2 mb-2"><User size={14} className="text-[#B38E5D]" /><p className="text-[10px] font-black uppercase text-slate-400">Proveedor</p></div>
              <p className="font-bold text-slate-700">{adjudicacion.nombreRazonSocial || 'N/A'}</p>
              <p className="text-xs font-mono font-bold text-slate-400 mt-1">{adjudicacion.rfc || 'Sin RFC'}</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-transparent rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-2"><DollarSign size={14} className="text-emerald-600" /><p className="text-[10px] font-black uppercase text-slate-400">Monto con IVA</p></div>
              <p className="font-black text-emerald-700 text-xl">{formatMXN(adjudicacion.montoTotalConIva)}</p>
            </div>
          </div>

          {/* Datos Detallados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2"><FileText size={14} className="text-[#B38E5D]" /><p className="text-[10px] font-black uppercase text-slate-400">No. Contrato</p></div>
              <p className="font-bold text-slate-700">{adjudicacion.numeroContrato || 'N/A'}</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2"><DollarSign size={14} className="text-[#B38E5D]" /><p className="text-[10px] font-black uppercase text-slate-400">Remanente</p></div>
              <p className="font-bold text-slate-700">{formatMXN(adjudicacion.remanenteSuficiencia)}</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2"><Calendar size={14} className="text-[#B38E5D]" /><p className="text-[10px] font-black uppercase text-slate-400">Vigencia</p></div>
              <p className="font-bold text-slate-700">{adjudicacion.inicioVigencia || '—'} → {adjudicacion.terminoVigencia || '—'}</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2"><User size={14} className="text-[#B38E5D]" /><p className="text-[10px] font-black uppercase text-slate-400">Responsable</p></div>
              <p className="font-bold text-slate-700">{adjudicacion.nombreResponsable || 'N/A'}</p>
            </div>
          </div>

          {/* Estatus + Reprogramación + URL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2"><CheckCircle2 size={14} className="text-[#B38E5D]" /><p className="text-[10px] font-black uppercase text-slate-400">Estatus</p></div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase border ${estatusColor(adjudicacion.estatus)}`}>
                {adjudicacion.estatus || 'Pendiente'}
              </span>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2"><RotateCcw size={14} className="text-[#B38E5D]" /><p className="text-[10px] font-black uppercase text-slate-400">Reprogramación</p></div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase border ${adjudicacion.reprogramacion ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {adjudicacion.reprogramacion ? 'Sí — Reprogramado' : 'No'}
              </span>
            </div>
            {adjudicacion.publicacionTestigoUrl && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2"><Link2 size={14} className="text-[#B38E5D]" /><p className="text-[10px] font-black uppercase text-slate-400">Testimonio Testigo Social</p></div>
                <a href={adjudicacion.publicacionTestigoUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[#9D2449] font-bold text-sm hover:underline flex items-center gap-2 break-all">
                  Ver publicación <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Comentarios */}
          {adjudicacion.comentarios && (
            <div className="p-6 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-100 mb-8">
              <div className="flex items-center gap-2 mb-3"><MessageSquare size={14} className="text-[#B38E5D]" /><p className="text-[10px] font-black uppercase text-slate-400">Comentarios</p></div>
              <p className="font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">{adjudicacion.comentarios}</p>
            </div>
          )}

          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Fecha de registro: {adjudicacion.fechaRegistro || 'N/A'}</p>
          </div>
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => onDelete && onDelete(adjudicacion.id)}
        title="Eliminar Adjudicación"
        message={`¿Estás seguro de que deseas eliminar permanentemente la adjudicación con folio interno ${adjudicacion.folioInterno}? Esta acción no se puede deshacer y quedará registrada en auditoría.`}
      />
    </div>
  );
};

export default DetalleAdjudicacion;
