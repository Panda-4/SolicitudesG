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
  { nombre: '2111 – Materiales y útiles de oficina' },
{ nombre: '2112 – Enseres de oficina' },
{ nombre: '2121 – Material y útiles de imprenta y reproducción' },
{ nombre: '2122 – Material de foto, cine y grabación' },
{ nombre: '2131 – Material estadístico y geográfico' },
{ nombre: '2141 – Materiales y útiles para procesamiento informático' },
{ nombre: '2151 – Material de información' },
{ nombre: '2161 – Material y enseres de limpieza' },
{ nombre: '2171 – Material didáctico' },
{ nombre: '2181 – Material para identificación y registro' },
{ nombre: '2211 – Productos alimenticios para personas' },
{ nombre: '2221 – Equipamiento y enseres para animales' },
{ nombre: '2222 – Productos alimenticios para animales' },
{ nombre: '2231 – Utensilios para el servicio de alimentación' },
{ nombre: '2311 – Materias primas y materiales de producción' },
{ nombre: '2321 – Materias primas textiles' },
{ nombre: '2331 – Productos de papel, cartón e impresos' },
{ nombre: '2341 – Combustibles, lubricantes, aditivos, carbón y derivados' },
{ nombre: '2351 – Productos químicos, farmacéuticos y de laboratorio' },
{ nombre: '2361 – Productos metálicos y minerales no metálicos' },
{ nombre: '2371 – Productos de cuero, piel, plástico y hule' },
{ nombre: '2381 – Mercancías para su comercialización en tiendas del sector público' },
{ nombre: '2391 – Otros productos adquiridos como materia prima' },
{ nombre: '2411 – Productos minerales no metálicos' },
{ nombre: '2421 – Cemento y productos de concreto' },
{ nombre: '2431 – Cal, yeso y productos de yeso' },
{ nombre: '2441 – Madera y productos de madera' },
{ nombre: '2451 – Vidrio y productos de vidrio' },
{ nombre: '2461 – Material eléctrico y electrónico' },
{ nombre: '2471 – Artículos metálicos para la construcción' },
{ nombre: '2481 – Materiales complementarios' },
{ nombre: '2482 – Material de señalización' },
{ nombre: '2483 – Árboles y plantas de ornato' },
{ nombre: '2491 – Materiales de construcción' },
{ nombre: '2492 – Estructuras y manufacturas para construcción' },
{ nombre: '2511 – Sustancias químicas' },
{ nombre: '2521 – Plaguicidas, abonos y fertilizantes' },
{ nombre: '2531 – Medicinas y productos farmacéuticos' },
{ nombre: '2541 – Materiales, accesorios y suministros médicos' },
{ nombre: '2551 – Materiales, accesorios y suministros de laboratorio' },
{ nombre: '2561 – Fibras sintéticas, hules, plásticos y derivados' },
{ nombre: '2591 – Otros productos químicos' },
{ nombre: '2711 – Vestuario y uniformes' },
{ nombre: '2721 – Prendas de seguridad y protección personal' },
{ nombre: '2731 – Artículos deportivos' },
{ nombre: '2741 – Productos textiles' },
{ nombre: '2751 – Blancos y otros productos textiles' },
{ nombre: '2811 – Sustancias y materiales explosivos' },
{ nombre: '2821 – Material de seguridad pública' },
{ nombre: '2831 – Prendas de protección' },
{ nombre: '2911 – Refacciones, accesorios y herramientas' },
{ nombre: '2921 – Refacciones y accesorios menores de edificios' },
{ nombre: '2931 – Refacciones y accesorios menores de mobiliario y equipo' },
{ nombre: '2941 – Refacciones y accesorios para equipo de cómputo' },
{ nombre: '2951 – Refacciones y accesorios menores de equipo médico y de laboratorio' },
{ nombre: '2961 – Refacciones y accesorios menores para equipo de transporte' },
{ nombre: '2971 – Artículos para la extinción de incendios' },
{ nombre: '2972 – Refacciones y accesorios menores para equipos de defensa' },
{ nombre: '2981 – Refacciones y accesorios menores de maquinaria y otros equipos' },
{ nombre: '2991 – Medidores de agua' },
{ nombre: '2992 – Otros enseres' },
{ nombre: '3111 – Servicio de energía eléctrica' },
{ nombre: '3112 – Servicio de energía eléctrica para alumbrado público' },
{ nombre: '3121 – Gas' },
{ nombre: '3131 – Servicio de agua' },
{ nombre: '3132 – Servicio de cloración de agua' },
{ nombre: '3141 – Servicio de telefonía convencional' },
{ nombre: '3151 – Servicio de telefonía celular' },
{ nombre: '3161 – Servicios de radiolocalización y telecomunicación' },
{ nombre: '3162 – Servicios de conducción de señales analógicas y digitales' },
{ nombre: '3171 – Servicios de acceso a Internet' },
{ nombre: '3181 – Servicio postal y telegráfico' },
{ nombre: '3191 – Servicios de telecomunicación especializados' },
{ nombre: '3192 – Servicios de información, mediante telecomunicaciones especializadas' },
{ nombre: '3211 – Arrendamiento de terrenos' },
{ nombre: '3221 – Arrendamiento de edificios y locales' },
{ nombre: '3231 – Arrendamiento de equipo y bienes informáticos' },
{ nombre: '3241 – Arrendamiento de equipo e instrumental médico y de laboratorio' },
{ nombre: '3251 – Arrendamiento de vehículos' },
{ nombre: '3261 – Arrendamiento de maquinaria y equipo' },
{ nombre: '3271 – Arrendamiento de activos intangibles' },
{ nombre: '3281 – Arrendamiento financiero' },
{ nombre: '3311 – Asesorías asociadas a convenios o acuerdos' },
{ nombre: '3321 – Servicios estadísticos y geográficos' },
{ nombre: '3331 – Servicios informáticos' },
{ nombre: '3341 – Capacitación' },
{ nombre: '3351 – Servicios de investigación científica y desarrollo' },
{ nombre: '3361 – Servicios de apoyo administrativo y fotocopiado' },
{ nombre: '3362 – Impresiones de documentos oficiales' },
{ nombre: '3363 – Servicios de impresión de documentos oficiales' },
{ nombre: '3371 – Servicios de protección y seguridad' },
{ nombre: '3381 – Servicios de vigilancia' },
{ nombre: '3391 – Servicios profesionales' },
{ nombre: '3411 – Servicios bancarios y financieros' },
{ nombre: '3421 – Servicios de cobranza, investigación crediticia y similar' },
{ nombre: '3431 – Gastos inherentes a la recaudación' },
{ nombre: '3441 – Seguros de responsabilidad patrimonial y fianzas' },
{ nombre: '3451 – Seguros y fianzas' },
{ nombre: '3461 – Almacenaje, embalaje y envase' },
{ nombre: '3471 – Fletes y maniobras' },
{ nombre: '3481 – Comisiones por ventas' },
{ nombre: '3491 – Servicios financieros, bancarios y comerciales integrales' },
{ nombre: '3511 – Reparación y mantenimiento de inmuebles' },
{ nombre: '3512 – Adaptación de locales, almacenes, bodegas y edificios' },
{ nombre: '3521 – Reparación, mantenimiento e instalación de mobiliario y equipo de oficina' },
{ nombre: '3531 – Reparación, instalación y mantenimiento de bienes informáticos, microfilmación y tecnologías de la información' },
{ nombre: '3532 – Reparación y mantenimiento para equipo y redes de tele y radio transmisión' },
{ nombre: '3541 – Reparación, instalación y mantenimiento de equipo médico y de laboratorio' },
{ nombre: '3551 – Reparación y mantenimiento de vehículos terrestres, aéreos y lacustres' },
{ nombre: '3561 – Reparación y mantenimiento de equipos de seguridad y defensa' },
{ nombre: '3571 – Reparación, instalación y mantenimiento de maquinaria, equipo industrial y diverso' },
{ nombre: '3581 – Servicios de lavandería, limpieza e higiene' },
{ nombre: '3591 – Servicios de fumigación' },
{ nombre: '3611 – Gastos de publicidad y propaganda' },
{ nombre: '3612 – Publicaciones oficiales' },
{ nombre: '3613 – Costos de estudios, producción y post-producción' },
{ nombre: '3621 – Gastos de publicidad en materia comercial' },
{ nombre: '3631 – Servicios de creatividad, preproducción y producción de publicidad, excepto Internet' },
{ nombre: '3641 – Servicios de fotografía' },
{ nombre: '3651 – Servicios de cine y grabación' },
{ nombre: '3661 – Servicios de creación y difusión de contenido a través de Internet' },
{ nombre: '3691 – Otros servicios de información' },
{ nombre: '3711 – Transportación aérea' },
{ nombre: '3721 – Gastos de traslado por vía terrestre' },
{ nombre: '3731 – Pasajes marítimos, lacustres y fluviales' },
{ nombre: '3741 – Autotransporte' },
{ nombre: '3751 – Gastos de alimentación en territorio nacional' },
{ nombre: '3752 – Gastos de hospedaje en territorio nacional' },
{ nombre: '3753 – Gastos por arrendamiento de vehículos en territorio nacional' },
{ nombre: '3761 – Gastos de alimentación en el extranjero' },
{ nombre: '3762 – Gastos de hospedaje en el extranjero' },
{ nombre: '3763 – Gastos por arrendamiento de vehículos en el extranjero' },
{ nombre: '3771 – Gastos de instalación y traslado de menaje' },
{ nombre: '3781 – Servicios integrales de traslado y viáticos' },
{ nombre: '3791 – Otros servicios de traslado y hospedaje' },
{ nombre: '3811 – Gastos de ceremonial' },
{ nombre: '3821 – Gastos de ceremonias oficiales y de orden social' },
{ nombre: '3822 – Espectáculos cívicos y culturales' },
{ nombre: '3831 – Congresos y convenciones' },
{ nombre: '3841 – Exposiciones y ferias' },
{ nombre: '3851 – Gastos de representación' },
{ nombre: '3911 – Servicios funerarios y de cementerios' },
{ nombre: '3921 – Impuestos y derechos de exportación' },
{ nombre: '3922 – Otros impuestos y derechos' },
{ nombre: '3931 – Impuestos y derechos de importación' },
{ nombre: '3941 – Sentencias y resoluciones judiciales' },
{ nombre: '3942 – Gastos derivados del resguardo de personas vinculadas a procesos judiciales' },
{ nombre: '3951 – Penas, multas, accesorios y actualizaciones' },
{ nombre: '3961 – Otros gastos por responsabilidades' },
{ nombre: '3971 – Utilidades' },
{ nombre: '3981 – Impuestos sobre nóminas' },
{ nombre: '4111 – Asignaciones presupuestarias al Poder Ejecutivo' },
{ nombre: '4121 – Liberación de recursos al Poder Legislativo' },
{ nombre: '4131 – Liberación de recursos al Poder Judicial' },
{ nombre: '4141 – Liberación de recursos a entes autónomos' },
{ nombre: '4151 – Transferencias internas otorgadas a entidades paraestatales no empresariales y no financieras' },
{ nombre: '4161 – Transferencias internas otorgadas a entidades paraestatales empresariales y no financieras' },
{ nombre: '4171 – Transferencias internas otorgadas a fideicomisos públicos empresariales y no financieros' },
{ nombre: '4181 – Transferencias internas otorgadas a instituciones paraestatales públicas financieras' },
{ nombre: '4191 – Transferencias internas otorgadas a fideicomisos públicos financieros' },
{ nombre: '4211 – Transferencias otorgadas a organismos o entidades paraestatales no empresariales y no financieras' },
{ nombre: '4221 – Transferencias otorgadas para entidades paraestatales empresariales y no financieras' },
{ nombre: '4231 – Transferencias otorgadas para instituciones paraestatales públicas financieras' },
{ nombre: '4241 – Municipios, comunidades y poblaciones' },
{ nombre: '4242 – Donativos a municipios' },
{ nombre: '4251 – Transferencias a fideicomisos de entidades federativas y municipios' },
{ nombre: '4311 – Subsidios a la producción' },
{ nombre: '4321 – Subsidios a la distribución' },
{ nombre: '4331 – Subsidios a la inversión' },
{ nombre: '4341 – Subsidios a la prestación de servicios públicos' },
{ nombre: '4351 – Subsidios para cubrir diferenciales de tasas de interés' },
{ nombre: '4361 – Subsidios a la vivienda' },
{ nombre: '4371 – Subvenciones al consumo' },
{ nombre: '4381 – Subsidios a entidades federativas y municipios' },
{ nombre: '4382 – Subsidios fideicomisos privados y estatales' },
{ nombre: '4383 – Subsidios y apoyos' },
{ nombre: '4391 – Subsidios por carga fiscal' },
{ nombre: '4392 – Devolución de ingresos indebidos' },
{ nombre: '4393 – Subsidios para capacitación y becas' },
{ nombre: '4394 – Otros subsidios' },
{ nombre: '4411 – Cooperaciones y ayudas' },
{ nombre: '4412 – Despensas' },
{ nombre: '4413 – Gastos relacionados con actividades culturales, deportivas y de ayuda extraordinaria' },
{ nombre: '4414 – Gastos por servicios de traslado de personas' },
{ nombre: '4415 – Apoyo a la infraestructura agropecuaria y forestal' },
{ nombre: '4416 – Apoyo a voluntarios que participen en diversos programas federales y estatales' },
{ nombre: '4421 – Becas' },
{ nombre: '4422 – Capacitación' },
{ nombre: '4423 – Premios, estímulos, recompensas, becas y seguros a deportistas' },
{ nombre: '4431 – Instituciones educativas' },
{ nombre: '4432 – Premios, recompensas y pensión recreativa estudiantil' },
{ nombre: '4441 – Ayudas sociales a actividades científicas o académicas' },
{ nombre: '4451 – Instituciones de beneficencia' },
{ nombre: '4452 – Instituciones sociales no lucrativas' },
{ nombre: '4461 – Ayudas sociales a cooperativas' },
{ nombre: '4471 – Ayudas sociales a entidades de interés público' },
{ nombre: '4481 – Reparación de daños a terceros' },
{ nombre: '4482 – Mercancías y alimentos para su distribución a la población en caso de desastres naturales' },
{ nombre: '4511 – Pago de pensiones' },
{ nombre: '4521 – Jubilaciones' },
{ nombre: '4591 – Prestaciones económicas distintas de pensiones' },
{ nombre: '4592 – Otras pensiones y jubilaciones' },
{ nombre: '4611 – Transferencias a fideicomisos del Poder Ejecutivo' },
{ nombre: '4621 – Transferencias a fideicomisos del Poder Legislativo' },
{ nombre: '4631 – Transferencias a fideicomisos del Poder Judicial' },
{ nombre: '4641 – Transferencias a organismos auxiliares' },
{ nombre: '4651 – Transferencias a fideicomisos públicos de entidades paraestatales empresariales y no financieras' },
{ nombre: '4661 – Transferencias a fideicomisos de instituciones públicas financieras' },
{ nombre: '4691 – Otras transferencias a fideicomisos' },
{ nombre: '4711 – Transferencias por obligación de ley' },
{ nombre: '4811 – Donativos a instituciones sin fines de lucro' },
{ nombre: '4821 – Donativos a entidades federativas' },
{ nombre: '4822 – Donativos a municipios' },
{ nombre: '4831 – Donativos a fideicomisos privados' },
{ nombre: '4841 – Donativos a fideicomisos públicos' },
{ nombre: '4851 – Donativos internacionales' },
{ nombre: '4911 – Transferencias para gobiernos extranjeros' },
{ nombre: '4921 – Transferencias para organismos internacionales' },
{ nombre: '4931 – Transferencias para el sector privado externo' },
{ nombre: '5111 – Muebles y enseres' },
{ nombre: '5112 – Adjudicaciones e indemnizaciones de bienes muebles' },
{ nombre: '5121 – Muebles, excepto de oficina y estantería' },
{ nombre: '5131 – Instrumental de música' },
{ nombre: '5132 – Artículos de biblioteca' },
{ nombre: '5133 – Objetos, obras de arte, históricas y culturales' },
{ nombre: '5141 – Objetos de valor' },
{ nombre: '5151 – Bienes informáticos' },
{ nombre: '5191 – Otros bienes muebles' },
{ nombre: '5192 – Otros equipos eléctricos y electrónicos de oficina' },
{ nombre: '5211 – Equipos y aparatos audiovisuales' },
{ nombre: '5221 – Equipo deportivo' },
{ nombre: '5231 – Equipo de foto, cine y grabación' },
{ nombre: '5291 – Otro equipo educacional y recreativo' },
{ nombre: '5311 – Equipo médico y de laboratorio' },
{ nombre: '5321 – Instrumental médico y de laboratorio' },
{ nombre: '5411 – Vehículos y equipo de transporte terrestre' },
{ nombre: '5412 – Vehículos y equipo auxiliar de transporte' },
{ nombre: '5421 – Carrocerías y remolques' },
{ nombre: '5431 – Equipo de transportación aérea' },
{ nombre: '5441 – Equipo ferroviario' },
{ nombre: '5451 – Equipo acuático y lacustre' },
{ nombre: '5491 – Otros equipos de transporte' },
{ nombre: '5511 – Maquinaria y equipo de seguridad pública' },
{ nombre: '5611 – Maquinaria y equipo agropecuario' },
{ nombre: '5621 – Maquinaria y equipo industrial' },
{ nombre: '5622 – Maquinaria y equipo de producción' },
{ nombre: '5631 – Maquinaria y equipo de construcción' },
{ nombre: '5641 – Sistemas de aire acondicionado, calefacción y de refrigeración industrial y comercial' },
{ nombre: '5651 – Equipo y aparatos para comunicación, telecomunicación y radio transmisión' },
{ nombre: '5661 – Equipos de generación eléctrica, aparatos y accesorios eléctricos' },
{ nombre: '5671 – Herramientas, máquina herramienta y equipo' },
{ nombre: '5691 – Instrumentos y aparatos especializados y de precisión' },
{ nombre: '5692 – Maquinaria y equipo diverso' },
{ nombre: '5693 – Maquinaria y equipo para alumbrado público' },
{ nombre: '5711 – Bovinos' },
{ nombre: '5721 – Porcinos' },
{ nombre: '5731 – Aves' },
{ nombre: '5741 – Ovinos y caprinos' },
{ nombre: '5751 – Peces y acuicultura' },
{ nombre: '5761 – Equinos' },
{ nombre: '5771 – Especies menores y de zoológico' },
{ nombre: '5781 – Árboles y plantas' },
{ nombre: '5791 – Otros activos' },
{ nombre: '5811 – Terrenos' },
{ nombre: '5821 – Viviendas' },
{ nombre: '5831 – Edificios y locales' },
{ nombre: '5891 – Otros bienes inmuebles' },
{ nombre: '5892 – Adjudicaciones, expropiaciones e indemnizaciones de bienes inmuebles' },
{ nombre: '5893 – Bienes inmuebles en la modalidad de proyectos de infraestructura productiva a largo plazo' },
{ nombre: '5911 – Software' },
{ nombre: '5921 – Patentes' },
{ nombre: '5931 – Marcas' },
{ nombre: '5941 – Derechos' },
{ nombre: '5951 – Concesiones' },
{ nombre: '5961 – Franquicias' },
{ nombre: '5971 – Licencias informáticas e intelectuales' },
{ nombre: '5981 – Licencias industriales, comerciales y otras' },
{ nombre: '5991 – Otros activos intangibles' }
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

// El componente recibe 'onSuccess' y 'recordToEdit' como prop desde App.jsx
const FormularioEstudio = ({ onSuccess, recordToEdit }) => {
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

  // Cargar datos de edición si existen
  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        dependencia: recordToEdit.dependencia || '',
        centroCosto: recordToEdit.centroCosto || '',
        origenRecurso: recordToEdit.origenRecurso || '',
        capitulo: recordToEdit.capitulo || '',
        partida: recordToEdit.partida || '',
        giro: recordToEdit.giro || '',
        valor: recordToEdit.valorEstudio || '',
        estatus: recordToEdit.estatus || 'Pendiente de Validación',
        montoSabys: recordToEdit.montoSabys || '',
        descripcionBien: recordToEdit.descripcionBien || ''
      });
      if (recordToEdit.fechaIngreso) {
        setFecha(dayjs(recordToEdit.fechaIngreso));
      }
      setPlurianual(recordToEdit.contratacionPlurianual || false);
    }
  }, [recordToEdit]);

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
      if (recordToEdit && recordToEdit.id) {
        await axios.put(`http://localhost:8080/api/estudios/${recordToEdit.id}`, datosAEnviar);
        alert('✅ Registro actualizado exitosamente en la Base de Datos');
      } else {
        await axios.post('http://localhost:8080/api/estudios', datosAEnviar);
        alert('✅ Solicitud guardada exitosamente en la Base de Datos');
      }
      
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
                  <h1 className="text-4xl font-black tracking-tight text-slate-900">
                    {recordToEdit ? 'Editar Estudio de Mercado' : 'Estudio de Mercado'}
                  </h1>
                </div>
                <p className="font-bold uppercase text-[10px] tracking-[0.3em] ml-12 text-slate-400">Módulo de Registro y Planeación Técnica</p>
              </div>

              {/* Folio Flotante */}
              <div className="border-2 p-5 rounded-[32px] shadow-lg min-w-[280px] group transition-all bg-white border-[#B38E5D] focus-within:border-[#9D2449] shadow-[#B38E5D]/10">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-center text-[#B38E5D]">Folio del Sistema</p>
                <p className="w-full text-2xl font-black text-center font-mono bg-transparent outline-none text-[#9D2449]">
                  {recordToEdit ? recordToEdit.folio : `EM-2026-${Math.floor(Math.random() * 9000) + 1000}`}
                </p>
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
                {recordToEdit ? 'Actualizar Solicitud' : 'Guardar Solicitud'}
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </LocalizationProvider>
  );
};

export default FormularioEstudio;