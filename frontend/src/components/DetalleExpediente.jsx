import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Building2, DollarSign, FileText, 
  CheckCircle2, Layers, Tag, Briefcase, Receipt, Clock,
  ChevronRight, Printer, Download, Edit3, Trash2
} from 'lucide-react';
import { getUser } from '../services/authService';
import ConfirmModal from './ConfirmModal';

const DetalleExpediente = ({ estudio, onBack, onEdit, onDelete }) => {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const isAdmin = getUser()?.rol === 'ADMINISTRADOR';

  if (!estudio) return null;

  // Formateador de moneda
  const formatCurrency = (value) => {
    if (!value) return '$0.00';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header de la Vista */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-[#9D2449] font-bold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Volver a Consulta
        </button>
        
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#9D2449] hover:border-[#9D2449] transition-all shadow-sm">
            <Printer size={20} />
          </button>
          <button onClick={() => window.print()} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#9D2449] hover:border-[#9D2449] transition-all shadow-sm">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Tarjeta Principal de Información */}
      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden print:shadow-none print:border-0 print:rounded-none">
        
        {/* Encabezado con Folio y Estatus */}
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/30">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Detalle del Estudio</h2>
            <p className="text-slate-500 font-medium">Información completa del expediente registrado</p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Folio del Sistema</p>
                <p className="text-2xl font-mono font-black text-[#9D2449]">{estudio.folio || 'Sin Folio'}</p>
             </div>
             <div className={`px-6 py-3 rounded-full border ${
                estudio.estatus === 'APROBADO' || estudio.estatus === 'Completado'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : estudio.estatus === 'PENDIENTE' || estudio.estatus === 'En Proceso'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
               <span className="font-black uppercase text-xs tracking-wider flex items-center gap-2">
                 <CheckCircle2 size={16} />
                 {estudio.estatus || 'Pendiente'}
               </span>
             </div>
          </div>
        </div>

        {/* Grid de Datos */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          
          {/* Columna 1: Datos Generales */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Datos Generales</h3>
            
            <DataField icon={<Calendar size={18} />} label="Fecha Ingreso" value={estudio.fechaIngreso || 'No especificada'} />
            <DataField icon={<Building2 size={18} />} label="Dependencia" value={estudio.dependencia || 'No asignada'} />
            <DataField icon={<Layers size={18} />} label="Origen Recurso" value={estudio.origenRecurso || 'No especificado'} />
            <DataField icon={<Briefcase size={18} />} label="Centro de Costo" value={estudio.centroCosto || 'No especificado'} />
          </div>

          {/* Columna 2: Clasificación */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Clasificación Presupuestal</h3>
            
            <DataField icon={<Tag size={18} />} label="Giro Comercial" value={estudio.giro || 'No especificado'} />
            <DataField icon={<Receipt size={18} />} label="Capítulo" value={estudio.capitulo || 'No especificado'} />
            <DataField icon={<FileText size={18} />} label="Partida" value={estudio.partida || 'No especificada'} />
            
            <div className="p-4 rounded-2xl bg-[#9D2449]/5 border border-[#9D2449]/10 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#9D2449] text-sm">Contratación Plurianual</p>
                <p className="text-xs text-slate-500 mt-1">Aplica para múltiples ejercicios fiscales</p>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 relative ${estudio.contratacionPlurianual ? 'bg-[#9D2449]' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${estudio.contratacionPlurianual ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>

          {/* Columna 3: Valores y Descripción */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Valores y Descripción</h3>
            
            <div className="space-y-4">
              <ValueField label="Valor del Estudio" value={estudio.valorEstudio} />
              <ValueField label="Monto SABYS" value={estudio.montoSabys} color="text-[#B38E5D]" />
            </div>

            <div className="pt-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block flex items-center gap-2">
                <FileText size={16} className="text-[#B38E5D]" /> Descripción Técnica
              </label>
              <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 min-h-[120px] text-slate-700 leading-relaxed font-medium">
                {estudio.descripcionBien || 'No se ha proporcionado una descripción detallada.'}
              </div>
            </div>
          </div>

        </div>

        {/* Footer de Acciones */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4 print:hidden">
          {/* Lado izquierdo: Acciones de Admin */}
          <div className="flex gap-4">
            {isAdmin && (
              <>
                <button
                  onClick={() => onEdit && onEdit(estudio)}
                  className="px-6 py-3 bg-white border border-[#B38E5D] text-[#B38E5D] font-bold rounded-2xl hover:bg-[#B38E5D] hover:text-white transition-all shadow-sm flex items-center gap-2"
                >
                  <Edit3 size={18} /> Editar Registro
                </button>
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className="px-6 py-3 bg-white border border-[#9D2449] text-[#9D2449] font-bold rounded-2xl hover:bg-[#9D2449] hover:text-white transition-all shadow-sm flex items-center gap-2"
                >
                  <Trash2 size={18} /> Eliminar
                </button>
              </>
            )}
          </div>

          {/* Lado derecho: Acciones Generales */}
          <div className="flex gap-4">
            <button 
              onClick={onBack}
              className="px-8 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button onClick={() => window.print()} className="px-8 py-3 bg-[#9D2449] text-white font-bold rounded-2xl shadow-lg shadow-[#9D2449]/20 hover:bg-[#7a1c39] transition-all flex items-center gap-2">
              <Printer size={18} /> Imprimir / PDF
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => onDelete && onDelete(estudio.id)}
        title="Eliminar Estudio de Mercado"
        message={`¿Estás seguro de que deseas eliminar permanentemente el estudio con folio ${estudio.folio}? Esta acción no se puede deshacer y quedará registrada en auditoría.`}
      />
    </motion.div>
  );
};

// Componente auxiliar para campos de texto
const DataField = ({ icon, label, value }) => (
  <div className="group">
    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block flex items-center gap-2">
      <span className="text-[#B38E5D]">{icon}</span> {label}
    </label>
    <div className="text-slate-800 font-bold text-lg truncate group-hover:text-[#9D2449] transition-colors cursor-default">
      {value}
    </div>
  </div>
);

// Componente auxiliar para valores monetarios
const ValueField = ({ label, value, color = "text-[#9D2449]" }) => (
  <div>
    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block flex items-center gap-2">
      <DollarSign size={16} className="text-[#B38E5D]" /> {label}
    </label>
    <div className={`text-2xl font-black ${color}`}>
      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0)}
    </div>
  </div>
);

export default DetalleExpediente;