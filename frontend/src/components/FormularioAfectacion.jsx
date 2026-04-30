import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Calendar, Building2, DollarSign, FileText, CheckCircle2, 
  Layers, Tag, Briefcase, Receipt, ChevronDown, Save, 
  XCircle, Clock, Shield, KeyRound, Hash, Package, FolderOpen
} from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Opciones por defecto para dropdowns
const TIPOS_GASTO = [
  'Gasto Corriente',
  'Gasto de Inversión',
  'Gasto de Capital',
  'Otros'
];

const FUENTES_FINANCIAMIENTO = [
  'Recursos Estatales',
  'Recursos Federales',
  'Mixto',
  'Recursos Propios',
  'Otros'
];

const UNIDADES_MEDIDA = [
  'Pieza', 'Servicio', 'Lote', 'Paquete', 'Metro', 'Metro Cuadrado',
  'Metro Cúbico', 'Litro', 'Kilogramo', 'Tonelada', 'Hora', 'Día',
  'Mes', 'Año', 'Evento', 'Unidad', 'Otros'
];

const FormularioAfectacion = ({ onSuccess, recordToEdit }) => {
  const [fecha, setFecha] = useState(dayjs());
  const [contratoAbierto, setContratoAbierto] = useState(false);
  const [consolidado, setConsolidado] = useState(false);
  const [expedientes, setExpedientes] = useState([]);
  const [selectedExpedienteId, setSelectedExpedienteId] = useState('');
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const expSeleccionadoInfo = expedientes.find(e => e.id === parseInt(selectedExpedienteId));

  const [formData, setFormData] = useState({
    folioCa: '',
    testigoSocial: '',
    tipoGasto: '',
    fuenteFinanciamiento: '',
    importeSuficiencia: '',
    oficioSuficiencia: '',
    claveVerificacion: '',
    descripcionClave: '',
    unidadMedida: '',
    estatus: 'Pendiente de Validación',
  });

  // Cargar datos de edición si existen
  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        folioCa: recordToEdit.folioCa || '',
        testigoSocial: recordToEdit.testigoSocial || '',
        tipoGasto: recordToEdit.tipoGasto || '',
        fuenteFinanciamiento: recordToEdit.fuenteFinanciamiento || '',
        importeSuficiencia: recordToEdit.importeSuficiencia || '',
        oficioSuficiencia: recordToEdit.oficioSuficiencia || '',
        claveVerificacion: recordToEdit.claveVerificacion || '',
        descripcionClave: recordToEdit.descripcionClave || '',
        unidadMedida: recordToEdit.unidadMedida || '',
        estatus: recordToEdit.estatus || 'Pendiente de Validación',
      });
      if (recordToEdit.fechaLiberacionEm) {
        setFecha(dayjs(recordToEdit.fechaLiberacionEm));
      }
      setContratoAbierto(recordToEdit.contratoAbierto || false);
      setConsolidado(recordToEdit.consolidado || false);
      if (recordToEdit.expediente) {
        setSelectedExpedienteId(recordToEdit.expediente.id.toString());
      }
    }
  }, [recordToEdit]);

  // Cargar expedientes disponibles al iniciar
  useEffect(() => {
    const cargarExpedientes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/expedientes');
        setExpedientes(response.data);
      } catch (error) {
        console.log("No se pudieron cargar los expedientes desde el backend.");
      }
    };
    cargarExpedientes();
  }, []);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleGuardar = async () => {
    if (!selectedExpedienteId) {
      alert('⚠️ Debes seleccionar un Expediente para vincular esta afectación.');
      return;
    }
    if (!formData.folioCa) {
      alert('⚠️ Debes ingresar manualmente el Folio CA.');
      return;
    }

    try {
      const datosAEnviar = {
        expediente: { id: parseInt(selectedExpedienteId) },
        fechaLiberacionEm: fecha.format('YYYY-MM-DD'),
        ...formData,
        contratoAbierto: contratoAbierto,
        consolidado: consolidado,
      };
      
      if (recordToEdit && recordToEdit.id) {
        await axios.put(`http://localhost:8080/api/afectaciones/${recordToEdit.id}`, datosAEnviar);
        alert('✅ Registro actualizado exitosamente en la Base de Datos');
      } else {
        await axios.post('http://localhost:8080/api/afectaciones', datosAEnviar);
        alert('✅ Afectación Presupuestal guardada exitosamente en la Base de Datos');
      }
      
      // Limpiar formulario
      setFormData({
        folioCa: '', testigoSocial: '', tipoGasto: '', fuenteFinanciamiento: '',
        importeSuficiencia: '', oficioSuficiencia: '', claveVerificacion: '',
        descripcionClave: '', unidadMedida: '', estatus: 'Pendiente de Validación',
      });
      setFecha(dayjs());
      setContratoAbierto(false);
      setConsolidado(false);
      setSelectedExpedienteId('');

      if (onSuccess) onSuccess();

    } catch (error) { 
      alert('❌ Error al guardar. Revisa la consola.'); 
      console.error(error);
    }
  };

  // Clases de Tailwind reutilizables
  const inputClass = "w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none transition-all font-bold text-slate-700 focus:bg-white focus:border-[#9D2449]/30 shadow-sm";
  const labelClass = "text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-400 mb-2 ml-1";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 font-sans">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 relative"
        >
          
          {/* Barra Decorativa Superior */}
          <div className="h-4 w-full bg-gradient-to-r from-[#B38E5D] via-[#9D2449] to-[#B38E5D]" />

          {/* Header del Formulario */}
          <div className="p-12 md:p-16">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16 border-b border-slate-50 pb-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#B38E5D]/10">
                    <Receipt size={24} className="text-[#B38E5D]" />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900">
                    {recordToEdit ? 'Editar Afectación Presupuestal' : 'Afectación Presupuestal'}
                  </h1>
                </div>
                <p className="font-bold uppercase text-[10px] tracking-[0.3em] ml-12 text-slate-400">Módulo de Suficiencia y Control Presupuestal</p>
              </div>

              {/* Folio Flotante (Manual) */}
              <div className="border-2 p-4 rounded-[32px] shadow-lg min-w-[280px] group transition-all bg-white border-[#B38E5D] focus-within:border-[#9D2449] shadow-[#B38E5D]/10">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-center text-[#B38E5D]">Folio CA</p>
                <input
                  type="text"
                  value={formData.folioCa}
                  onChange={handleChange('folioCa')}
                  placeholder="Ej: CA-2026-0001"
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
                  onChange={(e) => {
                    setSelectedExpedienteId(e.target.value);
                    if (!e.target.value) setMostrarDetalles(false);
                  }}
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
                Este expediente fue creado automáticamente al registrar un Estudio de Mercado.
              </p>

              {/* === DETALLES DEL EXPEDIENTE (COLLAPSIBLE) === */}
              {mostrarDetalles && expSeleccionadoInfo && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Folio</p>
                      <p className="font-black text-[#9D2449]">{expSeleccionadoInfo.folioExpediente}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Dependencia</p>
                      <p className="font-bold text-slate-700 truncate" title={expSeleccionadoInfo.dependencia}>{expSeleccionadoInfo.dependencia || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Estatus</p>
                      <p className="font-bold text-slate-700">{expSeleccionadoInfo.estatusGeneral || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Fecha Creación</p>
                      <p className="font-bold text-slate-700">{expSeleccionadoInfo.fechaCreacion || 'N/A'}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              
              {/* ===== COLUMNA IZQUIERDA ===== */}
              <div className="space-y-10">
                
                {/* 1. Fecha Liberación EM */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Calendar size={16} className="text-[#B38E5D]" /> Fecha de Liberación (EM)
                  </label>
                  <DatePicker 
                    value={fecha} 
                    onChange={(n) => setFecha(n)} 
                    slotProps={{ textField: { fullWidth: true, className: inputClass } }} 
                  />
                </div>

                {/* 2. Testigo Social */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Shield size={16} className="text-[#B38E5D]" /> Testigo Social
                  </label>
                  <input
                    type="text"
                    value={formData.testigoSocial}
                    onChange={handleChange('testigoSocial')}
                    placeholder="Nombre del testigo social asignado"
                    className={inputClass}
                  />
                </div>

                {/* 3. Tipo de Gasto */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Tag size={16} className="text-[#B38E5D]" /> Tipo de Gasto
                  </label>
                  <div className="relative">
                    <select
                      value={formData.tipoGasto}
                      onChange={handleChange('tipoGasto')}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Seleccione Tipo de Gasto...</option>
                      {TIPOS_GASTO.map((tipo, i) => (
                        <option key={i} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* 4. Fuente de Financiamiento */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Layers size={16} className="text-[#B38E5D]" /> Fuente de Financiamiento
                  </label>
                  <div className="relative">
                    <select
                      value={formData.fuenteFinanciamiento}
                      onChange={handleChange('fuenteFinanciamiento')}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Seleccione Fuente...</option>
                      {FUENTES_FINANCIAMIENTO.map((fuente, i) => (
                        <option key={i} value={fuente}>{fuente}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* 5. Unidad de Medida */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Package size={16} className="text-[#B38E5D]" /> Unidad de Medida
                  </label>
                  <div className="relative">
                    <select
                      value={formData.unidadMedida}
                      onChange={handleChange('unidadMedida')}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Seleccione Unidad...</option>
                      {UNIDADES_MEDIDA.map((u, i) => (
                        <option key={i} value={u}>{u}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* Contrato Abierto (Toggle) */}
                <div className="p-6 border-2 rounded-[32px] flex items-center justify-between border-dashed bg-[#9D2449]/5 border-[#9D2449]/10 mt-4">
                  <div className="space-y-1">
                    <p className="font-black leading-tight text-slate-800">Contrato Abierto</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest italic text-slate-500">¿El contrato es de tipo abierto?</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContratoAbierto(!contratoAbierto)}
                    className={`w-16 h-8 rounded-full p-1 transition-all duration-300 relative ${contratoAbierto ? 'bg-[#9D2449] shadow-lg shadow-[#9D2449]/30' : 'bg-slate-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 transform ${contratoAbierto ? 'translate-x-8' : 'translate-x-0'}`} />
                  </button>
                </div>

              </div>

              {/* ===== COLUMNA DERECHA ===== */}
              <div className="space-y-10">
                
                {/* 1. Estatus */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <CheckCircle2 size={16} className="text-[#B38E5D]" /> Estatus de Afectación
                  </label>
                  <div className="relative">
                    <select
                      value={formData.estatus}
                      onChange={handleChange('estatus')}
                      className={`${inputClass} appearance-none cursor-pointer font-black text-sm shadow-sm bg-indigo-50 text-indigo-700 border-indigo-100`}
                    >
                      <option value="Pendiente de Validación">🕒 Pendiente de Validación</option>
                      <option value="En Revisión">🔍 En Revisión</option>
                      <option value="Suficiencia Aprobada">✅ Suficiencia Aprobada</option>
                      <option value="Rechazado">❌ Rechazado</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* 2. Importe de Suficiencia */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <DollarSign size={16} className="text-[#B38E5D]" /> Importe de Suficiencia ($MXN)
                  </label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-xl text-slate-900">$</span>
                    <input
                      type="number"
                      value={formData.importeSuficiencia}
                      onChange={handleChange('importeSuficiencia')}
                      placeholder="0.00"
                      className={`w-full pl-10 pr-6 py-4 border-2 rounded-[24px] transition-all outline-none font-black text-xl text-[#9D2449] bg-white border-slate-100 focus:border-[#9D2449]/30`}
                    />
                  </div>
                </div>

                {/* 3. Oficio de Suficiencia */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Hash size={16} className="text-[#B38E5D]" /> Oficio de Suficiencia
                  </label>
                  <input
                    type="text"
                    value={formData.oficioSuficiencia}
                    onChange={handleChange('oficioSuficiencia')}
                    placeholder="Ej: OFICIO-SP-2026-0001"
                    className={inputClass}
                  />
                </div>

                {/* 4. Clave de Verificación (Monospaced) */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <KeyRound size={16} className="text-[#9D2449]" /> Clave de Verificación
                  </label>
                  <input
                    type="text"
                    value={formData.claveVerificacion}
                    onChange={handleChange('claveVerificacion')}
                    placeholder="XXXX-XXXX-XXXX"
                    className={`${inputClass} font-mono text-lg tracking-[0.15em] text-[#9D2449] bg-[#9D2449]/5 border-[#9D2449]/10 focus:border-[#9D2449]/30`}
                  />
                </div>

                {/* Espacio vacío para alinear con la columna izquierda */}
                <div className="hidden md:block" />

                {/* Consolidado (Toggle) */}
                <div className="p-6 border-2 rounded-[32px] flex items-center justify-between border-dashed bg-[#B38E5D]/5 border-[#B38E5D]/10 mt-4">
                  <div className="space-y-1">
                    <p className="font-black leading-tight text-slate-800">Consolidado</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest italic text-slate-500">¿Es un procedimiento consolidado?</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConsolidado(!consolidado)}
                    className={`w-16 h-8 rounded-full p-1 transition-all duration-300 relative ${consolidado ? 'bg-[#B38E5D] shadow-lg shadow-[#B38E5D]/30' : 'bg-slate-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 transform ${consolidado ? 'translate-x-8' : 'translate-x-0'}`} />
                  </button>
                </div>

              </div>

              {/* ===== DESCRIPCIÓN DE CLAVE (FULL WIDTH) ===== */}
              <div className="md:col-span-2 space-y-2 pt-4">
                <label className={labelClass}>
                  <FileText size={16} className="text-[#B38E5D]" /> Descripción de Clave
                </label>
                <textarea
                  rows={5}
                  value={formData.descripcionClave}
                  onChange={handleChange('descripcionClave')}
                  placeholder="Describa detalladamente la clave presupuestal, su fundamento y alcance técnico..."
                  className={`${inputClass} resize-none`}
                />
              </div>

            </form>

            {/* Botones de Acción */}
            <div className="mt-16 flex flex-col sm:flex-row justify-end gap-6 pt-12 border-t border-slate-50">
              <button
                type="button"
                className="px-12 py-5 font-black uppercase text-xs tracking-widest text-slate-500 hover:text-[#9D2449] transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGuardar}
                className="px-20 py-5 font-black rounded-[24px] shadow-2xl transition-all transform hover:-translate-y-1 bg-[#9D2449] text-white shadow-[#9D2449]/30 hover:bg-[#7a1c39]"
              >
                {recordToEdit ? 'Actualizar Afectación' : 'Guardar Afectación'}
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </LocalizationProvider>
  );
};

export default FormularioAfectacion;
