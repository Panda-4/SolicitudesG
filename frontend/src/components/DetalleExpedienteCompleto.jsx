import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, FolderOpen, ClipboardCheck, DollarSign, Gavel, Award,
  ChevronDown, ExternalLink, Calendar, Hash, FileText, Building2,
  CheckCircle2, XCircle, Receipt, Shield, User, Clock, Printer
} from 'lucide-react';

const ETAPAS = [
  { key: 'Estudio de Mercado', icon: ClipboardCheck, color: '#9D2449' },
  { key: 'Afectación Presupuestal', icon: DollarSign, color: '#B38E5D' },
  { key: 'Adquisiciones', icon: Gavel, color: '#6366f1' },
  { key: 'Adjudicación', icon: Award, color: '#059669' },
];

// Helper components
const Campo = ({ label, value, icon: Icon, isMoney, isLink, isBool, isLong, mono }) => {
  const formatMXN = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? val : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);
  };

  let displayValue = value;
  if (isMoney && value) displayValue = formatMXN(value);
  if (isBool !== undefined) displayValue = null; // handled separately

  return (
    <div className={`${isLong ? 'col-span-2' : ''}`}>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon size={10} />}
        {label}
      </p>
      {isBool !== undefined ? (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
          value ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        }`}>
          {value ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
          {value ? 'Sí' : 'No'}
        </span>
      ) : isLink && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#9D2449] hover:text-[#B38E5D] transition-colors underline underline-offset-2 break-all">
          <ExternalLink size={12} /> {value.length > 60 ? value.substring(0, 60) + '...' : value}
        </a>
      ) : (
        <p className={`text-sm font-bold ${isMoney ? 'text-emerald-700 text-base' : 'text-slate-700'} ${mono ? 'font-mono' : ''} ${!value ? 'text-slate-300 italic' : ''}`}>
          {displayValue || '—'}
        </p>
      )}
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, count, color, expanded, onToggle }) => (
  <button onClick={onToggle}
    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50/50 transition-all">
    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}>
      <Icon size={20} />
    </div>
    <div className="flex-1 text-left">
      <p className="font-black text-slate-800 text-sm uppercase tracking-wide">{title}</p>
      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{count} registro{count !== 1 ? 's' : ''} vinculado{count !== 1 ? 's' : ''}</p>
    </div>
    <ChevronDown size={18} className={`text-slate-300 transition-transform ${expanded ? 'rotate-180' : ''}`} />
  </button>
);

const BadgeEstatus = ({ estatus }) => {
  const colors = {
    'Activo': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Aprobado': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Adjudicado': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Formalizado': 'bg-blue-50 text-blue-600 border-blue-200',
    'En Proceso': 'bg-amber-50 text-amber-600 border-amber-200',
    'En Revisión': 'bg-amber-50 text-amber-600 border-amber-200',
    'Pendiente': 'bg-amber-50 text-amber-600 border-amber-200',
    'Rechazado': 'bg-rose-50 text-rose-600 border-rose-200',
    'Cancelado': 'bg-rose-50 text-rose-600 border-rose-200',
    'Desierto': 'bg-slate-50 text-slate-500 border-slate-200',
  };
  const cls = colors[estatus] || 'bg-slate-50 text-slate-500 border-slate-200';
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border ${cls}`}>
      {estatus || 'Sin estatus'}
    </span>
  );
};

const DetalleExpedienteCompleto = ({ item, onBack }) => {
  const exp = item.expediente;
  const [sections, setSections] = useState({
    estudio: true,
    afectacion: true,
    procedimiento: true,
    adjudicacion: true,
  });

  const toggle = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

  const handlePrint = () => {
    // Expandir todas las secciones antes de imprimir
    setSections({
      estudio: true,
      afectacion: true,
      procedimiento: true,
      adjudicacion: true,
    });
    // Dar un pequeño timeout para que las animaciones terminen de abrir los contenedores
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const progresoColor = (p) => {
    if (p >= 100) return '#059669';
    if (p >= 75) return '#6366f1';
    if (p >= 50) return '#B38E5D';
    return '#9D2449';
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Acciones Superiores (Ocultas al Imprimir) */}
      <div className="flex items-center justify-between print:hidden">
        <motion.button
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-[#9D2449] transition-colors font-black text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Volver al Panel de Control
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:text-[#9D2449] hover:border-[#9D2449] hover:bg-[#9D2449]/5 transition-all shadow-sm">
          <Printer size={18} />
          Imprimir / Exportar PDF
        </motion.button>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ENCABEZADO DEL EXPEDIENTE                          */}
      {/* ═══════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden print:shadow-none print:border-b-2 print:border-slate-800 print:rounded-none print:mb-8">
        
        {/* Barra de progreso en top */}
        <div className="h-2 bg-slate-100">
          <motion.div initial={{ width: 0 }} animate={{ width: `${item.progreso}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-r-full" style={{ backgroundColor: progresoColor(item.progreso) }} />
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Icono + Folio */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#9D2449] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#9D2449]/20">
                <FolderOpen size={28} />
              </div>
              <div>
                <p className="text-2xl font-black text-[#9D2449] font-mono tracking-tight">{exp.folioExpediente}</p>
                <p className="text-sm font-bold text-slate-400 mt-0.5">{exp.dependencia || 'Sin dependencia'}</p>
              </div>
            </div>

            {/* Datos rápidos */}
            <div className="flex-1 flex flex-wrap gap-4 md:justify-end">
              <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Estatus</p>
                <BadgeEstatus estatus={exp.estatusGeneral} />
              </div>
              <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Creación</p>
                <p className="font-bold text-slate-700 text-sm">{exp.fechaCreacion || '—'}</p>
              </div>
              <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Etapa Actual</p>
                <p className="font-black text-sm" style={{ color: progresoColor(item.progreso) }}>{item.etapaActual}</p>
              </div>
              <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Progreso</p>
                <p className="font-black text-lg" style={{ color: progresoColor(item.progreso) }}>{item.progreso}%</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {exp.descripcionBreve && (
            <p className="mt-4 text-sm text-slate-500 font-bold bg-slate-50 p-4 rounded-xl border border-slate-100">
              {exp.descripcionBreve}
            </p>
          )}

          {/* Timeline mini */}
          <div className="mt-6 flex items-center gap-0 justify-center">
            {ETAPAS.map((etapa, i) => {
              const completed = (etapa.key === 'Estudio de Mercado' && item.totalEstudios > 0) ||
                                (etapa.key === 'Afectación Presupuestal' && item.totalAfectaciones > 0) ||
                                (etapa.key === 'Adquisiciones' && item.totalProcedimientos > 0) ||
                                (etapa.key === 'Adjudicación' && item.totalAdjudicaciones > 0);
              return (
                <React.Fragment key={etapa.key}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${completed ? 'shadow-lg' : 'opacity-20'}`}
                      style={{ backgroundColor: completed ? etapa.color : '#cbd5e1' }}>
                      <etapa.icon size={16} className="text-white" />
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-wider text-center max-w-[80px] leading-tight ${completed ? 'text-slate-600' : 'text-slate-300'}`}>
                      {etapa.key}
                    </span>
                  </div>
                  {i < ETAPAS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 mt-[-16px] rounded-full ${
                      (() => {
                        const next = ETAPAS[i + 1];
                        const nc = (next.key === 'Afectación Presupuestal' && item.totalAfectaciones > 0) ||
                                   (next.key === 'Adquisiciones' && item.totalProcedimientos > 0) ||
                                   (next.key === 'Adjudicación' && item.totalAdjudicaciones > 0);
                        return completed && nc ? 'bg-emerald-400' : 'bg-slate-200';
                      })()
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECCIÓN 1: ESTUDIO DE MERCADO                      */}
      {/* ═══════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-[28px] shadow-lg border border-slate-100 overflow-hidden print:shadow-none print:border-0 print:border-t-2 print:border-slate-800 print:rounded-none print:break-inside-avoid">
        <SectionHeader icon={ClipboardCheck} title="Estudio de Mercado" count={item.totalEstudios}
          color="#9D2449" expanded={sections.estudio} onToggle={() => toggle('estudio')} />
        <AnimatePresence>
          {sections.estudio && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
              className="overflow-hidden border-t border-slate-100">
              {item.estudios?.length > 0 ? item.estudios.map((est, i) => (
                <div key={i} className="p-6 border-b border-slate-50 last:border-0">
                  {item.estudios.length > 1 && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#9D2449] mb-4">Registro {i + 1}</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5">
                    <Campo label="Folio" value={est.folio} icon={Hash} mono />
                    <Campo label="Fecha de Ingreso" value={est.fechaIngreso} icon={Calendar} />
                    <Campo label="Dependencia" value={est.dependencia} icon={Building2} />
                    <Campo label="Centro de Costo" value={est.centroCosto} />
                    <Campo label="Origen del Recurso" value={est.origenRecurso} />
                    <Campo label="Capítulo" value={est.capitulo} />
                    <Campo label="Partida" value={est.partida} />
                    <Campo label="Giro" value={est.giro} />
                    <Campo label="Valor del Estudio" value={est.valorEstudio} isMoney icon={DollarSign} />
                    <Campo label="Monto SABYS" value={est.montoSabys} isMoney icon={DollarSign} />
                    <Campo label="Estatus" value={est.estatus} />
                    <Campo label="Contratación Plurianual" value={est.contratacionPlurianual} isBool />
                    <Campo label="Descripción del Bien" value={est.descripcionBien} isLong icon={FileText} />
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-300 font-bold uppercase text-xs tracking-widest italic">
                  Sin estudios de mercado registrados para este expediente
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECCIÓN 2: AFECTACIÓN PRESUPUESTAL                 */}
      {/* ═══════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-[28px] shadow-lg border border-slate-100 overflow-hidden print:shadow-none print:border-0 print:border-t-2 print:border-slate-800 print:rounded-none print:break-inside-avoid print:mt-8">
        <SectionHeader icon={Receipt} title="Afectación Presupuestal" count={item.totalAfectaciones}
          color="#B38E5D" expanded={sections.afectacion} onToggle={() => toggle('afectacion')} />
        <AnimatePresence>
          {sections.afectacion && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
              className="overflow-hidden border-t border-slate-100">
              {item.afectaciones?.length > 0 ? item.afectaciones.map((af, i) => (
                <div key={i} className="p-6 border-b border-slate-50 last:border-0">
                  {item.afectaciones.length > 1 && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#B38E5D] mb-4">Registro {i + 1}</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5">
                    <Campo label="Folio CA" value={af.folioCa} icon={Hash} mono />
                    <Campo label="Fecha Liberación EM" value={af.fechaLiberacionEm} icon={Calendar} />
                    <Campo label="Testigo Social" value={af.testigoSocial} />
                    <Campo label="Tipo de Gasto" value={af.tipoGasto} />
                    <Campo label="Fuente de Financiamiento" value={af.fuenteFinanciamiento} />
                    <Campo label="Importe Suficiencia" value={af.importeSuficiencia} isMoney icon={DollarSign} />
                    <Campo label="Oficio Suficiencia" value={af.oficioSuficiencia} />
                    <Campo label="Clave de Verificación" value={af.claveVerificacion} icon={Shield} mono />
                    <Campo label="Unidad de Medida" value={af.unidadMedida} />
                    <Campo label="Contrato Abierto" value={af.contratoAbierto} isBool />
                    <Campo label="Consolidado" value={af.consolidado} isBool />
                    <Campo label="Estatus" value={af.estatus} />
                    <Campo label="Fecha de Registro" value={af.fechaRegistro} icon={Calendar} />
                    <Campo label="Descripción Clave" value={af.descripcionClave} isLong icon={FileText} />
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-300 font-bold uppercase text-xs tracking-widest italic">
                  Sin afectaciones presupuestales registradas para este expediente
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECCIÓN 3: PROCEDIMIENTO ADQUISITIVO               */}
      {/* ═══════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-[28px] shadow-lg border border-slate-100 overflow-hidden print:shadow-none print:border-0 print:border-t-2 print:border-slate-800 print:rounded-none print:break-inside-avoid print:mt-8">
        <SectionHeader icon={Gavel} title="Procedimiento Adquisitivo" count={item.totalProcedimientos}
          color="#6366f1" expanded={sections.procedimiento} onToggle={() => toggle('procedimiento')} />
        <AnimatePresence>
          {sections.procedimiento && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
              className="overflow-hidden border-t border-slate-100">
              {item.procedimientos?.length > 0 ? item.procedimientos.map((proc, i) => (
                <div key={i} className="p-6 border-b border-slate-50 last:border-0">
                  {item.procedimientos.length > 1 && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">Registro {i + 1}</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5">
                    <Campo label="No. Procedimiento" value={proc.noProcedimiento} icon={Hash} mono />
                    <Campo label="Modalidad" value={proc.modalidadProcedimiento} />
                    <Campo label="Medio de Publicación" value={proc.medioPublicacion} />
                    <Campo label="Estatus" value={proc.estatus} />
                    <Campo label="URL Convocatoria" value={proc.convocatoriaUrl} isLink />
                    <Campo label="Fecha de Registro" value={proc.fechaRegistro} icon={Calendar} />
                  </div>

                  {/* Cronograma del Procedimiento */}
                  <div className="mt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-1.5">
                      <Clock size={10} /> Cronograma del Procedimiento
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {[
                        { label: 'Junta de Aclaración', fecha: proc.fechaJuntaAclaracion, hora: proc.horaJuntaAclaracion },
                        { label: 'Presentación/Apertura', fecha: proc.fechaPresentacionApertura, hora: proc.horaPresentacionApertura },
                        { label: 'Sesión Comité', fecha: proc.fechaSesionComite, hora: proc.horaSesionComite },
                        { label: 'Contra Oferta', fecha: proc.fechaContraOferta, hora: proc.horaContraOferta },
                        { label: 'Dictaminación', fecha: proc.fechaDictaminacion, hora: proc.horaDictaminacion },
                        { label: 'Sesión Subcomité', fecha: proc.fechaSesionSubcomite, hora: proc.horaSesionSubcomite },
                        { label: 'Fallo', fecha: proc.fechaFallo, hora: proc.horaFallo },
                      ].map((evento, j) => (
                        <div key={j} className={`p-3 rounded-xl border ${evento.fecha ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                          <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">{evento.label}</p>
                          <p className="font-bold text-sm text-slate-700 mt-1">
                            {evento.fecha || '—'}
                            {evento.hora && <span className="text-indigo-500 ml-2">{evento.hora}</span>}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-300 font-bold uppercase text-xs tracking-widest italic">
                  Sin procedimientos adquisitivos registrados para este expediente
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECCIÓN 4: ADJUDICACIÓN                            */}
      {/* ═══════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-[28px] shadow-lg border border-slate-100 overflow-hidden print:shadow-none print:border-0 print:border-t-2 print:border-slate-800 print:rounded-none print:break-inside-avoid print:mt-8">
        <SectionHeader icon={Award} title="Adjudicación y Seguimiento" count={item.totalAdjudicaciones}
          color="#059669" expanded={sections.adjudicacion} onToggle={() => toggle('adjudicacion')} />
        <AnimatePresence>
          {sections.adjudicacion && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
              className="overflow-hidden border-t border-slate-100">
              {item.adjudicaciones?.length > 0 ? item.adjudicaciones.map((adj, i) => (
                <div key={i} className="p-6 border-b border-slate-50 last:border-0">
                  {item.adjudicaciones.length > 1 && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4">Registro {i + 1}</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5">
                    <Campo label="Folio Interno" value={adj.folioInterno} icon={Hash} mono />
                    <Campo label="Nombre / Razón Social" value={adj.nombreRazonSocial} icon={Building2} />
                    <Campo label="RFC" value={adj.rfc} mono />
                    <Campo label="Monto Total con IVA" value={adj.montoTotalConIva} isMoney icon={DollarSign} />
                    <Campo label="Número de Contrato" value={adj.numeroContrato} mono />
                    <Campo label="Inicio de Vigencia" value={adj.inicioVigencia} icon={Calendar} />
                    <Campo label="Término de Vigencia" value={adj.terminoVigencia} icon={Calendar} />
                    <Campo label="Remanente Suficiencia" value={adj.remanenteSuficiencia} isMoney />
                    <Campo label="Nombre del Responsable" value={adj.nombreResponsable} icon={User} />
                    <Campo label="Estatus" value={adj.estatus} />
                    <Campo label="Reprogramación" value={adj.reprogramacion} isBool />
                    <Campo label="Fecha de Registro" value={adj.fechaRegistro} icon={Calendar} />
                    <Campo label="URL Testigo Social" value={adj.publicacionTestigoUrl} isLink />
                    <Campo label="Comentarios / Observaciones" value={adj.comentarios} isLong icon={FileText} />
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-300 font-bold uppercase text-xs tracking-widest italic">
                  Sin adjudicaciones registradas para este expediente
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DetalleExpedienteCompleto;
