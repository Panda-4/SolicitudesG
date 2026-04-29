import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, DollarSign, FileText, 
  CheckCircle2, Layers, Tag, Receipt, Shield, Hash, KeyRound,
  Package, ChevronRight, Printer, Download, FolderOpen
} from 'lucide-react';

const DetalleAfectacion = ({ afectacion, onBack }) => {
  if (!afectacion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header de la Vista */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-[#9D2449] font-bold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Volver a Consulta
        </button>
        
        <div className="flex gap-3">
          <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#9D2449] hover:border-[#9D2449] transition-all shadow-sm">
            <Printer size={20} />
          </button>
          <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#9D2449] hover:border-[#9D2449] transition-all shadow-sm">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Tarjeta Principal */}
      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Barra decorativa */}
        <div className="h-3 w-full bg-gradient-to-r from-[#B38E5D] via-[#9D2449] to-[#B38E5D]" />

        {/* Encabezado con Folio y Estatus */}
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/30">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Detalle de Afectación Presupuestal</h2>
            <p className="text-slate-500 font-medium">Información completa de la suficiencia presupuestal</p>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Expediente vinculado */}
            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-widest text-[#B38E5D] mb-1">Expediente</p>
              <p className="text-sm font-mono font-black text-slate-600">
                {afectacion.expediente?.folioExpediente || 'Sin Expediente'}
              </p>
            </div>
            {/* Folio CA */}
            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Folio CA</p>
              <p className="text-2xl font-mono font-black text-[#9D2449]">{afectacion.folioCa || 'Sin Folio'}</p>
            </div>
            {/* Estatus */}
            <div className={`px-6 py-3 rounded-full border ${
              afectacion.estatus === 'Suficiencia Aprobada'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : afectacion.estatus === 'En Revisión'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : afectacion.estatus === 'Rechazado'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              <span className="font-black uppercase text-xs tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} />
                {afectacion.estatus || 'Pendiente'}
              </span>
            </div>
          </div>
        </div>

        {/* Grid de Datos */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          
          {/* Columna 1: Datos Generales */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Datos Generales</h3>
            
            <DataField icon={<FolderOpen size={18} />} label="Expediente Vinculado" value={afectacion.expediente?.folioExpediente || 'No vinculado'} />
            <DataField icon={<Tag size={18} />} label="Dependencia (Expediente)" value={afectacion.expediente?.dependencia || 'No especificada'} />
            <DataField icon={<Calendar size={18} />} label="Fecha Liberación EM" value={afectacion.fechaLiberacionEm || 'No especificada'} />
            <DataField icon={<Shield size={18} />} label="Testigo Social" value={afectacion.testigoSocial || 'No asignado'} />
            <DataField icon={<Calendar size={18} />} label="Fecha de Registro" value={afectacion.fechaRegistro || 'No especificada'} />
          </div>

          {/* Columna 2: Clasificación Financiera */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Clasificación Financiera</h3>
            
            <DataField icon={<Tag size={18} />} label="Tipo de Gasto" value={afectacion.tipoGasto || 'No especificado'} />
            <DataField icon={<Layers size={18} />} label="Fuente de Financiamiento" value={afectacion.fuenteFinanciamiento || 'No especificada'} />
            <DataField icon={<Hash size={18} />} label="Oficio de Suficiencia" value={afectacion.oficioSuficiencia || 'No especificado'} />
            <DataField icon={<Package size={18} />} label="Unidad de Medida" value={afectacion.unidadMedida || 'No especificada'} />
            
            {/* Toggles */}
            <div className="space-y-3">
              <ToggleDisplay label="Contrato Abierto" active={afectacion.contratoAbierto} color="#9D2449" />
              <ToggleDisplay label="Consolidado" active={afectacion.consolidado} color="#B38E5D" />
            </div>
          </div>

          {/* Columna 3: Valores y Verificación */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Valores y Verificación</h3>
            
            {/* Importe */}
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block flex items-center gap-2">
                <DollarSign size={16} className="text-[#B38E5D]" /> Importe de Suficiencia
              </label>
              <div className="text-3xl font-black text-[#9D2449]">
                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(afectacion.importeSuficiencia || 0)}
              </div>
            </div>

            {/* Clave de Verificación */}
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block flex items-center gap-2">
                <KeyRound size={16} className="text-[#9D2449]" /> Clave de Verificación
              </label>
              <div className="p-4 bg-[#9D2449]/5 rounded-2xl border border-[#9D2449]/10">
                <p className="text-xl font-mono font-black text-[#9D2449] tracking-[0.2em] text-center">
                  {afectacion.claveVerificacion || 'SIN CLAVE'}
                </p>
              </div>
            </div>

            {/* Descripción de Clave */}
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block flex items-center gap-2">
                <FileText size={16} className="text-[#B38E5D]" /> Descripción de Clave
              </label>
              <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 min-h-[120px] text-slate-700 leading-relaxed font-medium">
                {afectacion.descripcionClave || 'No se ha proporcionado una descripción.'}
              </div>
            </div>
          </div>

        </div>

        {/* Footer de Acciones */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
          <button 
            onClick={onBack}
            className="px-8 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button className="px-8 py-3 bg-[#9D2449] text-white font-bold rounded-2xl shadow-lg shadow-[#9D2449]/20 hover:bg-[#7a1c39] transition-all flex items-center gap-2">
            Imprimir / Exportar PDF
          </button>
        </div>
      </div>
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

// Componente auxiliar para toggles en modo lectura
const ToggleDisplay = ({ label, active, color }) => (
  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
    <p className="font-bold text-slate-700 text-sm">{label}</p>
    <div className={`w-12 h-6 rounded-full p-1 relative ${active ? `bg-[${color}]` : 'bg-slate-300'}`}
         style={active ? { backgroundColor: color } : {}}>
      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  </div>
);

export default DetalleAfectacion;
