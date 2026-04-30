import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Shield, Eye, EyeOff, Check, X, Edit3,
  ToggleLeft, ToggleRight, AlertCircle, Search, ChevronDown
} from 'lucide-react';

const ROLES = [
  { value: 'ADMINISTRADOR', label: 'Administrador', color: '#9D2449', desc: 'Acceso total al sistema' },
  { value: 'ESTUDIO_MERCADO', label: 'Estudio de Mercado', color: '#6366f1', desc: 'Solo módulo de Estudios' },
  { value: 'AFECTACION', label: 'Afectación Presupuestal', color: '#B38E5D', desc: 'Solo módulo de Afectaciones' },
  { value: 'ADQUISICIONES', label: 'Adquisiciones', color: '#0891b2', desc: 'Solo módulo de Adquisiciones' },
  { value: 'ADJUDICACION', label: 'Adjudicación', color: '#059669', desc: 'Solo módulo de Adjudicación' },
  { value: 'CONSULTOR', label: 'Consultor', color: '#64748b', desc: 'Solo lectura en todos los módulos' },
];

const getRolInfo = (rolValue) => ROLES.find(r => r.value === rolValue) || ROLES[5];

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Formulario
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombreCompleto: '',
    rol: 'CONSULTOR',
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/usuarios');
      setUsuarios(res.data);
    } catch (e) {
      console.error('Error cargando usuarios:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        // Actualizar
        const body = { ...formData };
        if (!body.password) delete body.password; // No enviar password vacío
        await axios.put(`http://localhost:8080/api/usuarios/${editingId}`, body);
        setSuccess('Usuario actualizado exitosamente');
      } else {
        // Crear
        if (!formData.password) {
          setError('La contraseña es requerida para nuevos usuarios');
          return;
        }
        await axios.post('http://localhost:8080/api/usuarios', formData);
        setSuccess('Usuario creado exitosamente');
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchUsuarios();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar usuario');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      password: '',
      nombreCompleto: user.nombreCompleto,
      rol: user.rol,
    });
    setEditingId(user.id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`http://localhost:8080/api/usuarios/${id}/toggle`);
      fetchUsuarios();
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const resetForm = () => {
    setFormData({ username: '', password: '', nombreCompleto: '', rol: 'CONSULTOR' });
  };

  const filtered = usuarios.filter(u => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return u.username.toLowerCase().includes(s) ||
           u.nombreCompleto.toLowerCase().includes(s) ||
           u.rol.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#9D2449] to-[#7a1c39] rounded-2xl shadow-lg shadow-[#9D2449]/20">
              <Users size={24} className="text-white" />
            </div>
            Gestión de Usuarios
          </h1>
          <p className="text-slate-500 font-bold mt-2">
            Administra los usuarios y permisos del sistema
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            resetForm();
            setError('');
            setSuccess('');
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9D2449] to-[#B38E5D] text-white font-black rounded-2xl shadow-lg shadow-[#9D2449]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <UserPlus size={20} />
          {showForm ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </div>

      {/* Mensajes */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl"
          >
            <AlertCircle size={18} className="text-rose-500" />
            <span className="font-bold text-rose-700 text-sm">{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl"
          >
            <Check size={18} className="text-emerald-500" />
            <span className="font-bold text-emerald-700 text-sm">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-[28px] border border-slate-200 shadow-xl p-8 space-y-6">
              <h2 className="text-lg font-black text-slate-800">
                {editingId ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    disabled={!!editingId}
                    placeholder="ej: maria.garcia"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#B38E5D] focus:ring-2 focus:ring-[#B38E5D]/20 transition-all disabled:opacity-50"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Contraseña {editingId && '(dejar vacío para no cambiar)'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingId}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#B38E5D] focus:ring-2 focus:ring-[#B38E5D]/20 transition-all"
                  />
                </div>

                {/* Nombre Completo */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.nombreCompleto}
                    onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                    required
                    placeholder="ej: María García López"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#B38E5D] focus:ring-2 focus:ring-[#B38E5D]/20 transition-all"
                  />
                </div>

                {/* Rol */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Rol / Permiso
                  </label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#B38E5D] focus:ring-2 focus:ring-[#B38E5D]/20 transition-all appearance-none"
                  >
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-[#9D2449] text-white font-black rounded-xl shadow-lg hover:bg-[#7a1c39] transition-all"
                >
                  <Check size={18} />
                  {editingId ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-all"
                >
                  <X size={18} />
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buscador */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, usuario o rol..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#B38E5D] focus:ring-2 focus:ring-[#B38E5D]/20 transition-all shadow-sm"
        />
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-[28px] border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Usuario</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Rol</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-bold">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-bold">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => {
                  const rolInfo = getRolInfo(user.rol);
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Avatar + Username */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-black text-sm text-slate-800">{user.username}</span>
                        </div>
                      </td>

                      {/* Nombre */}
                      <td className="px-6 py-4 text-sm font-bold text-slate-600">
                        {user.nombreCompleto}
                      </td>

                      {/* Rol */}
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white"
                          style={{ backgroundColor: rolInfo.color }}
                        >
                          <Shield size={12} />
                          {rolInfo.label}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          user.activo
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${user.activo ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                          {user.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="px-6 py-4 text-sm font-bold text-slate-400">
                        {user.fechaCreacion || '—'}
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 rounded-xl hover:bg-[#B38E5D]/10 text-[#B38E5D] transition-all"
                            title="Editar"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleToggle(user.id)}
                            className={`p-2 rounded-xl transition-all ${
                              user.activo
                                ? 'hover:bg-rose-50 text-rose-500'
                                : 'hover:bg-emerald-50 text-emerald-500'
                            }`}
                            title={user.activo ? 'Desactivar' : 'Activar'}
                          >
                            {user.activo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer con estadísticas */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {filtered.length} usuario{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            {ROLES.map(r => {
              const count = usuarios.filter(u => u.rol === r.value).length;
              if (count === 0) return null;
              return (
                <span
                  key={r.value}
                  className="text-[9px] font-black px-2 py-1 rounded-lg text-white"
                  style={{ backgroundColor: r.color }}
                >
                  {count} {r.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionUsuarios;
