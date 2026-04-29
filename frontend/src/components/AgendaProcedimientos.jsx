import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, CalendarDays, CalendarRange,
  Clock, Gavel, X, Filter
} from 'lucide-react';

// 7 tipos de evento del cronograma con colores únicos
const TIPOS_EVENTO = [
  { key: 'JuntaAclaracion', label: 'Junta de Aclaración', color: '#9D2449', bg: 'bg-[#9D2449]' },
  { key: 'PresentacionApertura', label: 'Presentación/Apertura', color: '#B38E5D', bg: 'bg-[#B38E5D]' },
  { key: 'SesionComite', label: 'Sesión Comité', color: '#6366f1', bg: 'bg-indigo-500' },
  { key: 'ContraOferta', label: 'Contra Oferta', color: '#8b5cf6', bg: 'bg-violet-500' },
  { key: 'Dictaminacion', label: 'Dictaminación', color: '#0ea5e9', bg: 'bg-sky-500' },
  { key: 'SesionSubcomite', label: 'Sesión Subcomité', color: '#f59e0b', bg: 'bg-amber-500' },
  { key: 'Fallo', label: 'Fallo', color: '#059669', bg: 'bg-emerald-600' },
];

const DIAS_SEMANA = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Parse "YYYY-MM-DD" or "DD/MM/YYYY" to Date
const parseDate = (str) => {
  if (!str) return null;
  // Try YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const d = new Date(str + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
  }
  // Try DD/MM/YYYY
  const parts = str.split('/');
  if (parts.length === 3) {
    const d = new Date(parts[2], parts[1] - 1, parts[0]);
    return isNaN(d.getTime()) ? null : d;
  }
  // Generic fallback
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const AgendaProcedimientos = () => {
  const [procedimientos, setProcedimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetchProcedimientos();
  }, []);

  const fetchProcedimientos = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/procedimientos/lista');
      setProcedimientos(res.data);
    } catch (e) {
      console.error('Error cargando procedimientos:', e);
      setProcedimientos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Extraer todos los eventos de todos los procedimientos
  const allEvents = useMemo(() => {
    const events = [];
    procedimientos.forEach(proc => {
      const fields = [
        { key: 'JuntaAclaracion', fecha: proc.fechaJuntaAclaracion, hora: proc.horaJuntaAclaracion },
        { key: 'PresentacionApertura', fecha: proc.fechaPresentacionApertura, hora: proc.horaPresentacionApertura },
        { key: 'SesionComite', fecha: proc.fechaSesionComite, hora: proc.horaSesionComite },
        { key: 'ContraOferta', fecha: proc.fechaContraOferta, hora: proc.horaContraOferta },
        { key: 'Dictaminacion', fecha: proc.fechaDictaminacion, hora: proc.horaDictaminacion },
        { key: 'SesionSubcomite', fecha: proc.fechaSesionSubcomite, hora: proc.horaSesionSubcomite },
        { key: 'Fallo', fecha: proc.fechaFallo, hora: proc.horaFallo },
      ];
      fields.forEach(f => {
        const d = parseDate(f.fecha);
        if (d) {
          const tipo = TIPOS_EVENTO.find(t => t.key === f.key);
          events.push({
            date: d,
            dateStr: dateKey(d),
            hora: f.hora || '',
            tipoKey: f.key,
            tipoLabel: tipo?.label || f.key,
            color: tipo?.color || '#64748b',
            bg: tipo?.bg || 'bg-slate-500',
            noProcedimiento: proc.noProcedimiento || 'S/N',
            modalidad: proc.modalidadProcedimiento || '',
            estatus: proc.estatus || '',
            expedienteFolio: proc.expediente?.folioExpediente || '',
          });
        }
      });
    });
    return events.sort((a, b) => a.date - b.date);
  }, [procedimientos]);

  // Eventos agrupados por dateKey
  const eventsByDate = useMemo(() => {
    const map = {};
    allEvents.forEach(ev => {
      if (!map[ev.dateStr]) map[ev.dateStr] = [];
      map[ev.dateStr].push(ev);
    });
    return map;
  }, [allEvents]);

  // ===== NAVEGACIÓN =====
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const goMonthPrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const goMonthNext = () => setCurrentDate(new Date(year, month + 1, 1));
  const goWeekPrev = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };
  const goWeekNext = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };
  const goToday = () => setCurrentDate(new Date());

  // ===== DATOS DEL MES =====
  const firstDayOfMonth = new Date(year, month, 1);
  let startDow = firstDayOfMonth.getDay(); // 0=Sun
  startDow = startDow === 0 ? 6 : startDow - 1; // Adjust to Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = useMemo(() => {
    const days = [];
    // Pad with previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({ date: d, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true });
    }
    // Pad with next month to fill 6 rows
    while (days.length < 42) {
      const d = new Date(year, month + 1, days.length - startDow - daysInMonth + 1);
      days.push({ date: d, isCurrentMonth: false });
    }
    return days;
  }, [year, month, startDow, daysInMonth]);

  // ===== DATOS DE LA SEMANA =====
  const weekDays = useMemo(() => {
    const d = new Date(currentDate);
    const dow = d.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(d);
    monday.setDate(d.getDate() + mondayOffset);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentDate]);

  const today = dateKey(new Date());

  // Procedimientos únicos que tienen eventos en la semana
  const weekProcs = useMemo(() => {
    const weekKeys = weekDays.map(d => dateKey(d));
    const procsMap = {};
    allEvents.forEach(ev => {
      if (weekKeys.includes(ev.dateStr)) {
        if (!procsMap[ev.noProcedimiento]) {
          procsMap[ev.noProcedimiento] = { noProcedimiento: ev.noProcedimiento, modalidad: ev.modalidad, events: [] };
        }
        procsMap[ev.noProcedimiento].events.push(ev);
      }
    });
    return Object.values(procsMap);
  }, [allEvents, weekDays]);

  const totalEventos = allEvents.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#9D2449] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#9D2449]/20">
              <CalendarDays size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider text-slate-800">Agenda de Procedimientos</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Programación de eventos y licitaciones en curso · {totalEventos} eventos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Vista */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'month' ? 'bg-[#9D2449] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}>
                <CalendarDays size={14} className="inline mr-1" /> Mes
              </button>
              <button onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'week' ? 'bg-[#9D2449] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}>
                <CalendarRange size={14} className="inline mr-1" /> Semana
              </button>
            </div>

            {/* Navegación */}
            <button onClick={goToday}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-[#9D2449] hover:text-white hover:border-[#9D2449] transition-all">
              Hoy
            </button>
            <div className="flex items-center gap-1">
              <button onClick={viewMode === 'month' ? goMonthPrev : goWeekPrev}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <ChevronLeft size={18} className="text-slate-400" />
              </button>
              <span className="text-sm font-black text-slate-700 min-w-[140px] text-center uppercase tracking-wide">
                {viewMode === 'month'
                  ? `${MESES[month]} ${year}`
                  : `${weekDays[0].getDate()} - ${weekDays[6].getDate()} ${MESES[weekDays[6].getMonth()]} ${weekDays[6].getFullYear()}`
                }
              </span>
              <button onClick={viewMode === 'month' ? goMonthNext : goWeekNext}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <ChevronRight size={18} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
          {TIPOS_EVENTO.map(tipo => (
            <div key={tipo.key} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tipo.color }} />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{tipo.label}</span>
            </div>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
          Cargando agenda...
        </div>
      ) : (
        <div className="flex gap-4">
          {/* Calendario principal */}
          <div className={`flex-1 bg-white rounded-[28px] shadow-lg border border-slate-100 overflow-hidden ${selectedDay ? '' : ''}`}>

            {/* ===== VISTA MENSUAL ===== */}
            {viewMode === 'month' && (
              <div>
                {/* Header días */}
                <div className="grid grid-cols-7 border-b border-slate-100">
                  {DIAS_SEMANA.map(dia => (
                    <div key={dia} className="px-2 py-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {dia}
                    </div>
                  ))}
                </div>
                {/* Grid días */}
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, i) => {
                    const dk = dateKey(day.date);
                    const isToday = dk === today;
                    const dayEvents = eventsByDate[dk] || [];
                    const hasEvents = dayEvents.length > 0;

                    return (
                      <button key={i}
                        onClick={() => hasEvents ? setSelectedDay(dk === selectedDay ? null : dk) : null}
                        className={`min-h-[90px] p-1.5 border-b border-r border-slate-50 text-left transition-all relative group ${
                          day.isCurrentMonth ? '' : 'opacity-30'
                        } ${isToday ? 'bg-[#9D2449]/5' : 'hover:bg-slate-50/80'} ${
                          selectedDay === dk ? 'bg-[#9D2449]/10 ring-2 ring-[#9D2449]/20 ring-inset' : ''
                        }`}>
                        <span className={`text-xs font-black block mb-1 ${
                          isToday ? 'bg-[#9D2449] text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-500'
                        }`}>
                          {day.date.getDate()}
                        </span>
                        {/* Event dots / tags */}
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 3).map((ev, j) => (
                            <div key={j}
                              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold text-white truncate"
                              style={{ backgroundColor: ev.color }}
                              title={`${ev.noProcedimiento} · ${ev.tipoLabel} ${ev.hora ? '@ ' + ev.hora : ''}`}>
                              <span className="truncate">{ev.noProcedimiento} · {ev.tipoLabel.split(' ')[0]}</span>
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-[8px] font-black text-slate-400 px-1">
                              +{dayEvents.length - 3} más
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===== VISTA SEMANAL ===== */}
            {viewMode === 'week' && (
              <div>
                {/* Header semana */}
                <div className="grid grid-cols-8 border-b border-slate-100">
                  <div className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-50">
                    Procedimiento
                  </div>
                  {weekDays.map((d, i) => {
                    const dk = dateKey(d);
                    const isToday = dk === today;
                    return (
                      <div key={i} className={`px-2 py-3 text-center border-r border-slate-50 last:border-0 ${isToday ? 'bg-[#9D2449]/5' : ''}`}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{DIAS_SEMANA[i]}</p>
                        <p className={`text-lg font-black mt-0.5 ${isToday ? 'text-[#9D2449]' : 'text-slate-700'}`}>
                          {d.getDate()}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Filas por procedimiento */}
                {weekProcs.length > 0 ? weekProcs.map((proc, pi) => (
                  <div key={pi} className="grid grid-cols-8 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <div className="px-4 py-3 border-r border-slate-50 flex flex-col justify-center">
                      <p className="text-[11px] font-black text-[#9D2449] font-mono">{proc.noProcedimiento}</p>
                      <p className="text-[9px] font-bold text-slate-400 truncate">{proc.modalidad}</p>
                    </div>
                    {weekDays.map((d, di) => {
                      const dk = dateKey(d);
                      const dayEvs = proc.events.filter(ev => ev.dateStr === dk);
                      return (
                        <div key={di} className="px-1 py-2 border-r border-slate-50 last:border-0 flex flex-col gap-1 justify-center">
                          {dayEvs.map((ev, ei) => (
                            <div key={ei}
                              className="px-2 py-1 rounded-lg text-[8px] font-black text-white text-center truncate"
                              style={{ backgroundColor: ev.color }}
                              title={`${ev.tipoLabel} ${ev.hora ? '@ ' + ev.hora : ''}`}>
                              {ev.tipoLabel.split(' ')[0]}
                              {ev.hora && <span className="block text-[7px] font-bold opacity-80">{ev.hora}</span>}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )) : (
                  <div className="p-10 text-center text-slate-300 font-bold uppercase text-xs tracking-widest italic col-span-8">
                    Sin eventos esta semana
                  </div>
                )}

                {/* Footer */}
                <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Agenda protegida · Sincronización tiempo real
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {weekProcs.length} procedimiento{weekProcs.length !== 1 ? 's' : ''} esta semana
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Panel lateral: detalle del día seleccionado */}
          <AnimatePresence>
            {selectedDay && eventsByDate[selectedDay] && (
              <motion.div
                initial={{ opacity: 0, x: 20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 320 }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                className="bg-white rounded-[28px] shadow-lg border border-slate-100 overflow-hidden shrink-0"
                style={{ width: 320 }}>
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Eventos del día</p>
                    <p className="text-sm font-black text-slate-800">
                      {(() => {
                        const d = new Date(selectedDay + 'T00:00:00');
                        return `${d.getDate()} de ${MESES[d.getMonth()]} ${d.getFullYear()}`;
                      })()}
                    </p>
                  </div>
                  <button onClick={() => setSelectedDay(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>
                <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                  {eventsByDate[selectedDay].map((ev, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: ev.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: ev.color }}>
                            {ev.tipoLabel}
                          </p>
                          <p className="font-black text-sm text-slate-800 font-mono mt-1">{ev.noProcedimiento}</p>
                          {ev.modalidad && <p className="text-[10px] font-bold text-slate-400 mt-0.5">{ev.modalidad}</p>}
                          {ev.expedienteFolio && (
                            <p className="text-[10px] font-bold text-slate-400">Exp: {ev.expedienteFolio}</p>
                          )}
                          {ev.hora && (
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-500">
                              <Clock size={10} /> {ev.hora} hrs
                            </div>
                          )}
                          <div className="mt-2">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${
                              ev.estatus === 'Adjudicado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              ev.estatus === 'Desierto' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                              'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                              {ev.estatus || 'En Proceso'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AgendaProcedimientos;
