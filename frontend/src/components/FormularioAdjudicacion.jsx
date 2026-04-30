import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  ChevronDown, FolderOpen, RotateCcw, Award, User, FileText,
  DollarSign, Calendar, Link2, MessageSquare, Receipt, Gavel, Hash
} from 'lucide-react';
import { getUser } from '../services/authService';

const FormularioAdjudicacion = ({ onSuccess, recordToEdit }) => {
  const isAdmin = getUser()?.rol === 'ADMINISTRADOR';
  const isPartialEdit = recordToEdit && !isAdmin;

  const [expedientes, setExpedientes] = useState([]);
  const [afectaciones, setAfectaciones] = useState([]);
  const [procedimientos, setProcedimientos] = useState([]);
  const [selectedExpedienteId, setSelectedExpedienteId] = useState('');
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [reprogramacion, setReprogramacion] = useState(false);

  const expInfo = expedientes.find(e => e.id === parseInt(selectedExpedienteId));
  const afectacionesDelExp = afectaciones.filter(a => a.expediente?.id === parseInt(selectedExpedienteId));
  const procedimientosDelExp = procedimientos.filter(p => p.expediente?.id === parseInt(selectedExpedienteId));

  const [formData, setFormData] = useState({
    folioInterno: '',
    nombreRazonSocial: '',
    rfc: '',
    montoTotalConIva: '',
    numeroContrato: '',
    inicioVigencia: '',
    terminoVigencia: '',
    publicacionTestigoUrl: '',
    remanenteSuficiencia: '',
    nombreResponsable: '',
    comentarios: '',
    estatus: 'Adjudicado',
  });

  // Cargar datos de edición si existen
  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        folioInterno: recordToEdit.folioInterno || '',
        nombreRazonSocial: recordToEdit.nombreRazonSocial || '',
        rfc: recordToEdit.rfc || '',
        montoTotalConIva: recordToEdit.montoTotalConIva || '',
        numeroContrato: recordToEdit.numeroContrato || '',
        inicioVigencia: recordToEdit.inicioVigencia || '',
        terminoVigencia: recordToEdit.terminoVigencia || '',
        publicacionTestigoUrl: recordToEdit.publicacionTestigoUrl || '',
        remanenteSuficiencia: recordToEdit.remanenteSuficiencia || '',
        nombreResponsable: recordToEdit.nombreResponsable || '',
        comentarios: recordToEdit.comentarios || '',
        estatus: recordToEdit.estatus || 'Adjudicado',
      });
      if (recordToEdit.expediente) {
        setSelectedExpedienteId(recordToEdit.expediente.id.toString());
      }
      setReprogramacion(recordToEdit.reprogramacion || false);
    }
  }, [recordToEdit]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resExp, resAfec, resProc] = await Promise.all([
          axios.get('http://localhost:8080/api/expedientes'),
          axios.get('http://localhost:8080/api/afectaciones/lista'),
          axios.get('http://localhost:8080/api/procedimientos/lista'),
        ]);
        setExpedientes(resExp.data);
        setAfectaciones(resAfec.data);
        setProcedimientos(resProc.data);
      } catch (e) { console.log("Error cargando datos."); }
    };
    cargar();
  }, []);

  const handleChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleLimpiar = () => {
    setFormData({
      folioInterno: '', nombreRazonSocial: '', rfc: '', montoTotalConIva: '',
      numeroContrato: '', inicioVigencia: '', terminoVigencia: '',
      publicacionTestigoUrl: '', remanenteSuficiencia: '', nombreResponsable: '',
      comentarios: '', estatus: 'Adjudicado',
    });
    setSelectedExpedienteId('');
    setMostrarDetalles(false);
    setReprogramacion(false);
  };

  const handleGuardar = async () => {
    if (!selectedExpedienteId) { alert('⚠️ Selecciona un Expediente.'); return; }
    if (!formData.folioInterno) { alert('⚠️ Ingresa el Folio Interno.'); return; }

    try {
      const datos = {
        expediente: { id: parseInt(selectedExpedienteId) },
        ...formData,
        reprogramacion,
      };
      if (recordToEdit && recordToEdit.id) {
        await axios.put(`http://localhost:8080/api/adjudicaciones/${recordToEdit.id}`, datos);
        alert('✅ Registro actualizado exitosamente en la Base de Datos');
      } else {
        await axios.post('http://localhost:8080/api/adjudicaciones', datos);
        alert('✅ Adjudicación guardada exitosamente');
      }
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
        <div className="h-4 w-full bg-gradient-to-r from-[#9D2449] via-[#B38E5D] to-[#9D2449]" />

        <div className="p-12 md:p-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16 border-b border-slate-50 pb-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#9D2449]/10">
                  <Award size={24} className="text-[#9D2449]" />
                </div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900">
                  {recordToEdit ? 'Editar Adjudicación' : 'Adjudicación'}
                </h1>
              </div>
              <p className="font-bold uppercase text-[10px] tracking-[0.3em] ml-12 text-slate-400">Módulo de Formalización y Seguimiento</p>
            </div>

            {/* Folio Interno (Manual) */}
            <div className="border-2 p-4 rounded-[32px] shadow-lg min-w-[280px] group transition-all bg-white border-[#B38E5D] focus-within:border-[#9D2449] shadow-[#B38E5D]/10">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-center text-[#B38E5D]">Folio Interno</p>
              <input
                type="text"
                value={formData.folioInterno}
                onChange={handleChange('folioInterno')}
                disabled={isPartialEdit}
                placeholder="Ej: ADJ-001-2026"
                className={`w-full text-2xl font-black text-center font-mono bg-transparent outline-none text-[#9D2449] placeholder:text-[#9D2449]/30 ${isPartialEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                <button type="button" onClick={() => setMostrarDetalles(!mostrarDetalles)}
                  className="text-[10px] font-black uppercase tracking-widest text-[#B38E5D] hover:text-[#9D2449] flex items-center gap-1 transition-all">
                  {mostrarDetalles ? 'Ocultar Detalles' : 'Consultar Información'}
                </button>
              )}
            </div>
            <div className="relative">
              <select value={selectedExpedienteId}
                onChange={(e) => { setSelectedExpedienteId(e.target.value); if (!e.target.value) setMostrarDetalles(false); }}
                disabled={isPartialEdit}
                className={`${inputClass} appearance-none cursor-pointer bg-white border-[#9D2449]/20 focus:border-[#9D2449]/50 ${isPartialEdit ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`}>
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
              Vincula esta adjudicación al expediente maestro.
            </p>

            {/* Detalles: Expediente + CA + Procedimientos */}
            {mostrarDetalles && expInfo && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-4">

                {/* Expediente */}
                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                    <FolderOpen size={12} /> Datos del Expediente
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><p className="text-[10px] font-bold uppercase text-slate-400">Folio</p><p className="font-black text-[#9D2449]">{expInfo.folioExpediente}</p></div>
                    <div><p className="text-[10px] font-bold uppercase text-slate-400">Dependencia</p><p className="font-bold text-slate-700 truncate">{expInfo.dependencia || 'N/A'}</p></div>
                    <div><p className="text-[10px] font-bold uppercase text-slate-400">Estatus</p><p className="font-bold text-slate-700">{expInfo.estatusGeneral || 'N/A'}</p></div>
                    <div><p className="text-[10px] font-bold uppercase text-slate-400">Fecha Creación</p><p className="font-bold text-slate-700">{expInfo.fechaCreacion || 'N/A'}</p></div>
                  </div>
                </div>

                {/* Afectaciones CA */}
                <div className="p-5 bg-gradient-to-r from-[#B38E5D]/5 to-white rounded-2xl border border-[#B38E5D]/15 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#B38E5D] mb-3 flex items-center gap-2">
                    <Receipt size={12} /> Afectaciones Presupuestales (CA)
                  </p>
                  {afectacionesDelExp.length > 0 ? (
                    <div className="space-y-3">
                      {afectacionesDelExp.map((ca) => (
                        <div key={ca.id} className="p-4 bg-white rounded-xl border border-slate-100">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div><p className="text-[9px] font-bold uppercase text-slate-400">Folio CA</p><p className="font-black text-[#B38E5D] font-mono text-sm">{ca.folioCa || 'N/A'}</p></div>
                            <div><p className="text-[9px] font-bold uppercase text-slate-400">Importe</p><p className="font-black text-slate-800 text-sm">{ca.importeSuficiencia ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(ca.importeSuficiencia) : 'N/A'}</p></div>
                            <div><p className="text-[9px] font-bold uppercase text-slate-400">Oficio</p><p className="font-bold text-slate-600 text-sm truncate">{ca.oficioSuficiencia || 'N/A'}</p></div>
                            <div><p className="text-[9px] font-bold uppercase text-slate-400">Estatus</p><span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${ca.estatus === 'Suficiencia Aprobada' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{ca.estatus || 'Pendiente'}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (<p className="text-xs font-bold text-slate-400 italic">Sin afectaciones registradas.</p>)}
                </div>

                {/* Procedimientos Adquisitivos */}
                <div className="p-5 bg-gradient-to-r from-[#9D2449]/5 to-white rounded-2xl border border-[#9D2449]/15 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#9D2449] mb-3 flex items-center gap-2">
                    <Gavel size={12} /> Procedimientos Adquisitivos
                  </p>
                  {procedimientosDelExp.length > 0 ? (
                    <div className="space-y-3">
                      {procedimientosDelExp.map((proc) => (
                        <div key={proc.id} className="p-4 bg-white rounded-xl border border-slate-100">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div><p className="text-[9px] font-bold uppercase text-slate-400">No. Procedimiento</p><p className="font-black text-[#9D2449] font-mono text-sm">{proc.noProcedimiento || 'N/A'}</p></div>
                            <div><p className="text-[9px] font-bold uppercase text-slate-400">Modalidad</p><p className="font-bold text-slate-600 text-sm truncate">{proc.modalidadProcedimiento || 'N/A'}</p></div>
                            <div><p className="text-[9px] font-bold uppercase text-slate-400">Fecha Fallo</p><p className="font-bold text-slate-600 text-sm">{proc.fechaFallo || '—'}</p></div>
                            <div><p className="text-[9px] font-bold uppercase text-slate-400">Estatus</p><span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${proc.estatus === 'Adjudicado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{proc.estatus || 'En Proceso'}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (<p className="text-xs font-bold text-slate-400 italic">Sin procedimientos registrados.</p>)}
                </div>

              </motion.div>
            )}
          </div>

          {/* === FORMULARIO EN DOS COLUMNAS === */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 mb-12">

            {/* Col Izquierda */}
            <div className="space-y-10">
              <div className="space-y-2">
                <label className={labelClass}><User size={16} className="text-[#B38E5D]" /> Nombre o Razón Social</label>
                <input type="text" value={formData.nombreRazonSocial} onChange={handleChange('nombreRazonSocial')} disabled={isPartialEdit} placeholder="Razón Social del proveedor" className={`${inputClass} ${isPartialEdit ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}><Hash size={16} className="text-[#B38E5D]" /> RFC</label>
                <input type="text" value={formData.rfc} onChange={handleChange('rfc')} disabled={isPartialEdit} placeholder="Ej: XAXX010101000" maxLength={13} className={`${inputClass} uppercase font-mono ${isPartialEdit ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}><DollarSign size={16} className="text-[#B38E5D]" /> Monto Total Adjudicación con IVA</label>
                <input type="number" value={formData.montoTotalConIva} onChange={handleChange('montoTotalConIva')} disabled={isPartialEdit} placeholder="$0.00" step="0.01" className={`${inputClass} ${isPartialEdit ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}><FileText size={16} className="text-[#B38E5D]" /> Número de Contrato</label>
                <input type="text" value={formData.numeroContrato} onChange={handleChange('numeroContrato')} placeholder="Ej: CONT-2026-001" className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}><Calendar size={16} className="text-[#B38E5D]" /> Inicio de Vigencia</label>
                <input type="date" value={formData.inicioVigencia} onChange={handleChange('inicioVigencia')} disabled={isPartialEdit} className={`${inputClass} ${isPartialEdit ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}><Calendar size={16} className="text-[#B38E5D]" /> Término de Vigencia</label>
                <input type="date" value={formData.terminoVigencia} onChange={handleChange('terminoVigencia')} disabled={isPartialEdit} className={`${inputClass} ${isPartialEdit ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`} />
              </div>
            </div>

            {/* Col Derecha */}
            <div className="space-y-10">
              <div className="space-y-2">
                <label className={labelClass}><Link2 size={16} className="text-[#B38E5D]" /> Publicación Testimonio Testigo Social (URL)</label>
                <input type="url" value={formData.publicacionTestigoUrl} onChange={handleChange('publicacionTestigoUrl')} placeholder="https://..." className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}><DollarSign size={16} className="text-[#B38E5D]" /> Remanente (Suficiencia Presupuestal)</label>
                <input type="number" value={formData.remanenteSuficiencia} onChange={handleChange('remanenteSuficiencia')} disabled={isPartialEdit} placeholder="$0.00" step="0.01" className={`${inputClass} ${isPartialEdit ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}><User size={16} className="text-[#B38E5D]" /> Nombre del Responsable</label>
                <input type="text" value={formData.nombreResponsable} onChange={handleChange('nombreResponsable')} disabled={isPartialEdit} placeholder="Nombre completo del responsable" className={`${inputClass} ${isPartialEdit ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}><Award size={16} className="text-[#B38E5D]" /> Estatus</label>
                <div className="relative">
                  <select value={formData.estatus} onChange={handleChange('estatus')}
                    className={`${inputClass} appearance-none cursor-pointer font-black text-sm bg-indigo-50 text-indigo-700 border-indigo-100`}>
                    <option value="Adjudicado">✅ Adjudicado</option>
                    <option value="Formalizado">📝 Formalizado</option>
                    <option value="En Revisión">🔍 En Revisión</option>
                    <option value="Pendiente de Firma">⏳ Pendiente de Firma</option>
                    <option value="Cancelado">❌ Cancelado</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Toggle Reprogramación */}
              <div className="space-y-2">
                <label className={labelClass}><RotateCcw size={16} className="text-[#B38E5D]" /> Reprogramación</label>
                <div className="flex items-center gap-4 py-2">
                  <button type="button" onClick={() => !isPartialEdit && setReprogramacion(!reprogramacion)}
                    disabled={isPartialEdit}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 ${reprogramacion ? 'bg-[#9D2449]' : 'bg-slate-200'} ${isPartialEdit ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${reprogramacion ? 'left-7' : 'left-0.5'}`} />
                  </button>
                  <span className="font-bold text-sm text-slate-600">{reprogramacion ? 'Sí — Reprogramado' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Comentarios (Full Width) */}
            <div className="md:col-span-2 space-y-2">
              <label className={labelClass}><MessageSquare size={16} className="text-[#B38E5D]" /> Comentarios / Observaciones</label>
              <textarea value={formData.comentarios} onChange={handleChange('comentarios')} rows={4}
                disabled={isPartialEdit}
                placeholder="Observaciones detalladas sobre la adjudicación..."
                className={`${inputClass} resize-none ${isPartialEdit ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`} />
            </div>
          </form>

          {/* Botones */}
          <div className="mt-16 flex flex-col sm:flex-row justify-end gap-6 pt-12 border-t border-slate-50">
            <button type="button" className="px-12 py-5 font-black uppercase text-xs tracking-widest text-slate-500 hover:text-[#9D2449] transition-all">Cancelar</button>
            <button type="button" onClick={handleLimpiar}
              className="flex items-center justify-center gap-2 px-12 py-5 font-black uppercase text-xs tracking-widest text-[#B38E5D] border-2 border-[#B38E5D]/30 rounded-[24px] hover:bg-[#B38E5D]/10 transition-all">
              <RotateCcw size={16} /> Limpiar Formulario
            </button>
            <button type="button" onClick={handleGuardar}
              className="px-20 py-5 font-black rounded-[24px] shadow-2xl transition-all transform hover:-translate-y-1 bg-[#9D2449] text-white shadow-[#9D2449]/30 hover:bg-[#7a1c39]">
              {recordToEdit ? 'Actualizar Adjudicación' : 'Guardar Adjudicación'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FormularioAdjudicacion;
