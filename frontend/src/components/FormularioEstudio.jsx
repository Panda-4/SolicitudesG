import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Calendar, Building2, DollarSign, FileText, CheckCircle2, 
  Layers, Tag, Briefcase, Receipt, ChevronDown, Save, XCircle, Clock
} from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Lista de Dependencias del Gobierno del Estado de México (Fallback)
const DEFAULT_DEPENDENCIAS = [
  'Poder Legislativo',
  'Unidad de Información',
  'Gubernatura',
  'Coordinación General de Comunicación Social',
  'Secretaría General de Gobierno',
  'Secretaría de Seguridad',
  'Secretaría de Finanzas',
  'Secretaría de Salud',
  'Secretaría del Trabajo',
  'Secretaría de Desarrollo Económico',
  'Secretaría de la Contraloría',
  'Secretaría de Movilidad',
  'Secretaría del Campo',
  'Secretaría de Cultura y Turismo',
  'Secretaría de las Mujeres',
  'Secretaría de Educación, Ciencia, Tecnología e Innovación',
  'Secretaría de Bienestar',
  'Secretaría de Desarrollo Urbano e Infraestructura',
  'Secretaría del Medio Ambiente y Desarrollo Sostenible',
  'Secretaría del Agua',
  'Consejería Jurídica',
  'Oficialía Mayor',
  'Jefatura de Gabinete y Proyectos Especiales',
  'Vocería de la Gubernatura',
  'Coordinación Técnica',
  'Agencia Digital del Estado de México',
  'Poder Judicial',
  'Instituto Electoral del Estado de México',
  'Comisión de Derechos Humanos del Estado de México',
  'Tribunal de Justicia Administrativa',
  'Junta Local de Conciliación y Arbitraje Valle de Toluca',
  'Tribunal Estatal de Conciliación y Arbitraje',
  'Universidad Autónoma del Estado de México',
  'Junta Local de Conciliación y Arbitraje del Valle Cuautitlán-Texcoco',
  'Tribunal Electoral del Estado de México',
  'Instituto de Transparencia, Acceso a la Información Pública y Protección de Datos Personales',
  'Fiscalía General de Justicia',
  'Secretaría Ejecutiva del Sistema Estatal Anticorrupción',
  'Otros'
];

// Lista de Giros Comerciales (Fallback)
const DEFAULT_GIROS = [
  { nombre: 'Servicios Profesionales' },
  { nombre: 'Suministros y Materiales' },
  { nombre: 'Obra Pública' },
  { nombre: 'Arrendamiento de Bienes' },
  { nombre: 'Servicios Generales' },
  { nombre: 'Tecnología y Comunicaciones' },
  { nombre: 'Equipo Médico' },
  { nombre: 'Mobiliario y Equipo de Oficina' },
  { nombre: 'Mantenimiento y Conservación' },
  { nombre: 'Consultoría Especializada' },
  { nombre: 'Otros' }
];

// Lista de Partidas Presupuestales (Fallback)
const DEFAULT_PARTIDAS = [
  { clave: '1100', nombre: 'Remuneraciones al Personal de Carácter Permanente' },
  { clave: '1200', nombre: 'Remuneraciones al Personal de Carácter Transitorio' },
  { clave: '1300', nombre: 'Remuneraciones Adicionales y Especiales' },
  { clave: '1400', nombre: 'Seguridad Social' },
  { clave: '1500', nombre: 'Otras Prestaciones Sociales y Económicas' },
  { clave: '1600', nombre: 'Previsiones' },
  { clave: '1700', nombre: 'Pago de Estímulos a Servidores Públicos' },
  { clave: '2100', nombre: 'Materiales de Administración, Emisión de Documentos y Artículos Oficiales' },
  { clave: '2200', nombre: 'Alimentos y Utensilios' },
  { clave: '2300', nombre: 'Materias Primas y Materiales de Producción y Comercialización' },
  { clave: '2400', nombre: 'Materiales y Artículos de Construcción y de Reparación' },
  { clave: '2500', nombre: 'Productos Químicos, Farmacéuticos y de Laboratorio' },
  { clave: '2700', nombre: 'Vestuario, Blancos, Prendas de Protección y Artículos Deportivos' },
  { clave: '2800', nombre: 'Materiales y Suministros para Seguridad' },
  { clave: '2900', nombre: 'Herramientas, Refacciones y Accesorios Menores' },
  { clave: '3100', nombre: 'Servicios Básicos' },
  { clave: '3200', nombre: 'Servicios de Arrendamiento' },
  { clave: '3300', nombre: 'Servicios Profesionales, Científicos, Técnicos y Otros Servicios' },
  { clave: '3400', nombre: 'Servicios Financieros, Bancarios y Comerciales' },
  { clave: '3500', nombre: 'Servicios de Instalación, Reparación, Mantenimiento y Conservación' },
  { clave: '3600', nombre: 'Servicios de Comunicación Social y Publicidad' },
  { clave: '3700', nombre: 'Servicios de Traslado y Viáticos' },
  { clave: '3800', nombre: 'Servicios Oficiales' },
  { clave: '3900', nombre: 'Otros Servicios Generales' },
  { clave: '4100', nombre: 'Transferencias Internas y Asignaciones al Sector Público' },
  { clave: '4200', nombre: 'Transferencias al Resto del Sector Público' },
  { clave: '4300', nombre: 'Subsidios y Subvenciones' },
  { clave: '4400', nombre: 'Ayudas Sociales' },
  { clave: '4500', nombre: 'Pensiones y Jubilaciones' },
  { clave: '4600', nombre: 'Transferencias a Fideicomisos, Mandatos y Otros Análogos' },
  { clave: '4700', nombre: 'Transferencias a la Seguridad Social' },
  { clave: '4800', nombre: 'Donativos' },
  { clave: '4900', nombre: 'Transferencias al Exterior' },
  { clave: '5100', nombre: 'Mobiliario y Equipo de Administración' },
  { clave: '5200', nombre: 'Mobiliario y Equipo Educacional y Recreativo' },
  { clave: '5300', nombre: 'Equipo e Instrumental Médico y de Laboratorio' },
  { clave: '5400', nombre: 'Vehículos y Equipo de Transporte' },
  { clave: '5500', nombre: 'Equipo de Defensa y Seguridad' },
  { clave: '5600', nombre: 'Maquinaria, Otros Equipos y Herramientas' },
  { clave: '5700', nombre: 'Activos Biológicos' }
];

// El componente recibe 'onSuccess' como prop desde App.jsx
const FormularioEstudio = ({ onSuccess }) => {
  // Inicializamos estados con listas locales por si Java falla
  const [partidas, setPartidas] = useState(DEFAULT_PARTIDAS.map((p, i) => ({ id: i + 1, ...p })));
  const [fecha, setFecha] = useState(dayjs());
  const [plurianual, setPlurianual] = useState(false);
  
  const [dependencias, setDependencias] = useState(DEFAULT_DEPENDENCIAS.map((d, i) => ({ id: i + 1, nombre: d })));
  const [giros, setGiros] = useState(DEFAULT_GIROS.map((g, i) => ({ id: i + 1, nombre: g.nombre })));
  const [capitulos, setCapitulos] = useState([]); 

  const [formData, setFormData] = useState({
    dependencia: '', centroCosto: '', origenRecurso: '', capitulo: '', 
    partida: '', giro: '', valor: '', estatus: 'Pendiente de Validación', 
    montoSabys: '', descripcionBien: ''
  });

  // Cargar catálogos desde Java al iniciar
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [resDep, resGiro, resCap, resPar] = await Promise.all([
          axios.get('http://localhost:8080/api/catalogos/dependencias'),
          axios.get('http://localhost:8080/api/catalogos/giros'),
          axios.get('http://localhost:8080/api/catalogos/capitulos'),
          axios.get('http://localhost:8080/api/catalogos/partidas')
        ]);
        
        if (resDep.data && resDep.data.length > 0) setDependencias(resDep.data);
        if (resGiro.data && resGiro.data.length > 0) setGiros(resGiro.data);
        if (resCap.data && resCap.data.length > 0) setCapitulos(resCap.data);
        if (resPar.data && resPar.data.length > 0) setPartidas(resPar.data);
        
      } catch (error) { 
        console.log("Usando listas locales de catálogos (Java no respondió o no está configurado aún).");
      }
    };
    cargarCatalogos();
  }, []);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleGuardar = async () => {
    try {
      const datosAEnviar = {
        fechaIngreso: fecha.format('YYYY-MM-DD'),
        ...formData,
        valorEstudio: formData.valor,
        contratacionPlurianual: plurianual
      };
      
      // Enviar a tu Backend Java
      await axios.post('http://localhost:8080/api/estudios', datosAEnviar);
      alert('✅ Solicitud guardada exitosamente en la Base de Datos');
      
      // Limpiar formulario
      setFormData({
        dependencia: '', centroCosto: '', origenRecurso: '', capitulo: '', 
        partida: '', giro: '', valor: '', estatus: 'Pendiente de Validación', 
        montoSabys: '', descripcionBien: ''
      });
      setFecha(dayjs());
      setPlurianual(false);

      // LLAMAR A LA FUNCIÓN PARA REFRESCAR LA TABLA EN APP.JSX
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) { 
      alert('❌ Error al guardar. Revisa la consola.'); 
      console.error(error);
    }
  };

  // Clases de Tailwind
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
          <div className="h-4 w-full bg-gradient-to-r from-[#9D2449] via-[#B38E5D] to-[#9D2449]" />

          {/* Header del Formulario */}
          <div className="p-12 md:p-16">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16 border-b border-slate-50 pb-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#9D2449]/5">
                    <Building2 size={24} className="text-[#9D2449]" />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900">Estudio de Mercado</h1>
                </div>
                <p className="font-bold uppercase text-[10px] tracking-[0.3em] ml-12 text-slate-400">Módulo de Registro y Planeación Técnica</p>
              </div>

              {/* Folio Flotante */}
              <div className="border-2 p-5 rounded-[32px] shadow-lg min-w-[280px] group transition-all bg-white border-[#B38E5D] focus-within:border-[#9D2449] shadow-[#B38E5D]/10">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-center text-[#B38E5D]">Folio del Sistema</p>
                <p className="w-full text-2xl font-black text-center font-mono bg-transparent outline-none text-[#9D2449]">EM-2026-{Math.floor(Math.random() * 9000) + 1000}</p>
              </div>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              
              {/* Columna Izquierda - ORDEN AJUSTADO */}
              <div className="space-y-10">
                
                {/* 1. Fecha Ingreso */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Calendar size={16} className="text-[#B38E5D]" /> Fecha Ingreso de Solicitud
                  </label>
                  <DatePicker 
                    value={fecha} 
                    onChange={(n) => setFecha(n)} 
                    slotProps={{ textField: { fullWidth: true, className: inputClass } }} 
                  />
                </div>

                {/* 2. Origen de Recurso (SUBIDO) */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Layers size={16} className="text-[#B38E5D]" /> Origen de Recurso
                  </label>
                  <div className="relative">
                    <select
                      value={formData.origenRecurso}
                      onChange={handleChange('origenRecurso')}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Seleccione Origen...</option>
                      <option value="ESTATAL">Recursos Estatales</option>
                      <option value="FEDERAL">Recursos Federales</option>
                      <option value="MIXTO">Mixto</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* 3. Dependencia (BAJADO) */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Building2 size={16} className="text-[#B38E5D]" /> Dependencia
                  </label>
                  <div className="relative">
                    <select
                      value={formData.dependencia}
                      onChange={handleChange('dependencia')}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Seleccione Dependencia...</option>
                      {dependencias.map((dep, index) => (
                        <option key={dep.id || index} value={dep.nombre}>
                          {dep.nombre}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* 4. Centro de Costo */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Briefcase size={16} className="text-[#B38E5D]" /> Centro de Costo
                  </label>
                  <input
                    type="text"
                    value={formData.centroCosto}
                    onChange={handleChange('centroCosto')}
                    placeholder="Clave de C.C."
                    className={inputClass}
                  />
                </div>

                {/* 5. Giro Comercial (DINÁMICO DESDE JAVA) */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Tag size={16} className="text-[#B38E5D]" /> Giro Comercial
                  </label>
                  <div className="relative">
                    <select
                      value={formData.giro}
                      onChange={handleChange('giro')}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Seleccione Giro...</option>
                      {giros.map((g) => (
                        // Manejamos tanto si viene con clave como si no
                        <option key={g.id} value={g.clave ? `${g.clave} - ${g.nombre}` : g.nombre}>
                          {g.clave ? `${g.clave} - ${g.nombre}` : g.nombre}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* Contratación Plurianual (Al final de la columna izquierda) */}
                <div className="p-6 border-2 rounded-[32px] flex items-center justify-between border-dashed bg-[#9D2449]/5 border-[#9D2449]/10 mt-4">
                  <div className="space-y-1">
                    <p className="font-black leading-tight text-slate-800">Contratación Plurianual</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest italic text-slate-500">Aplica para múltiples ejercicios</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlurianual(!plurianual)}
                    className={`w-16 h-8 rounded-full p-1 transition-all duration-300 relative ${plurianual ? 'bg-[#9D2449] shadow-lg shadow-[#9D2449]/30' : 'bg-slate-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 transform ${plurianual ? 'translate-x-8' : 'translate-x-0'}`} />
                  </button>
                </div>

              </div>

              {/* Columna Derecha */}
              <div className="space-y-10">
                
                {/* 1. Estatus */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <CheckCircle2 size={16} className="text-[#B38E5D]" /> Estatus de Adquisición
                  </label>
                  <div className="relative">
                    <select
                      value={formData.estatus}
                      onChange={handleChange('estatus')}
                      className={`${inputClass} appearance-none cursor-pointer font-black text-sm shadow-sm bg-indigo-50 text-indigo-700 border-indigo-100`}
                    >
                      <option value="Pendiente de Validación">🕒 Pendiente de Validación</option>
                      <option value="En Análisis">🔍 En Análisis Técnico</option>
                      <option value="Aprobado">✅ Aprobado</option>
                      <option value="Rechazado">❌ Rechazado</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* 2. Capítulo Presupuestal (DINÁMICO DESDE JAVA) */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <Receipt size={16} className="text-[#B38E5D]" /> Capítulo Presupuestal
                  </label>
                  <div className="relative">
                    <select
                      value={formData.capitulo}
                      onChange={handleChange('capitulo')}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Seleccione Capítulo...</option>
                      {capitulos.length > 0 ? (
                        capitulos.map((cap) => (
                          <option key={cap.id} value={`${cap.clave} - ${cap.nombre}`}>
                            {cap.clave} - {cap.nombre}
                          </option>
                        ))
                      ) : (
                        // Fallback local si Java no responde
                        <>
                         <option value="1000">1000 - Servicios Personales</option>
                          <option value="2000">2000 - Materiales y Suministros</option>
                          <option value="3000">3000 - Servicios Generales</option>
                          <option value="4000">4000 - Transferencias, Asignaciones, Subsidios y Otras Ayudas</option>
                          <option value="5000">5000 - Bienes Muebles, Inmuebles e Intangibles</option>
                          <option value="6000">6000 - Inversión Pública</option>
                          <option value="7000">7000 - Inversiones Financieras y Otras Provisiones</option>
                          <option value="8000">8000 - Participaciones y Aportaciones</option>
                          <option value="9000">9000 - Deuda Pública</option>
                        </>
                      )}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* 3. Partida */}
                <div className="space-y-2">
                  <label className={labelClass}>Partida Presupuestal</label>
                  <div className="relative">
                    <select
                      value={formData.partida}
                      onChange={handleChange('partida')}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Seleccione Partida...</option>
                      {partidas.map((par) => (
                        <option key={par.id} value={`${par.clave} - ${par.nombre}`}>
                          {par.clave} - {par.nombre}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* 4. Valor */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <DollarSign size={16} className="text-[#B38E5D]" /> Valor del Estudio ($)
                  </label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-xl text-slate-900">$</span>
                    <input
                      type="number"
                      value={formData.valor}
                      onChange={handleChange('valor')}
                      placeholder="0.00"
                      className={`w-full pl-10 pr-6 py-4 border-2 rounded-[24px] transition-all outline-none font-black text-xl text-[#9D2449] bg-white border-slate-100 focus:border-[#9D2449]/30`}
                    />
                  </div>
                </div>

                {/* 5. Monto SABYS */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <DollarSign size={16} className="text-[#B38E5D]" /> Monto SABYS ($)
                  </label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-xl text-slate-900">$</span>
                    <input
                      type="number"
                      value={formData.montoSabys}
                      onChange={handleChange('montoSabys')}
                      placeholder="0.00"
                      className={`w-full pl-10 pr-6 py-4 border-2 rounded-[24px] transition-all outline-none font-black text-xl text-[#B38E5D] bg-white border-slate-100 focus:border-[#9D2449]/30`}
                    />
                  </div>
                </div>

                {/* 6. Descripción */}
                <div className="space-y-2">
                  <label className={labelClass}>
                    <FileText size={16} className="text-[#B38E5D]" /> Descripción del Bien
                  </label>
                  <textarea
                    rows={4}
                    value={formData.descripcionBien}
                    onChange={handleChange('descripcionBien')}
                    placeholder="Describa técnica y detalladamente..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

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
                Guardar Solicitud
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </LocalizationProvider>
  );
};

export default FormularioEstudio;