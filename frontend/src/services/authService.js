import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

// === LOGIN ===
export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  const data = response.data;

  // Guardar en localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({
    id: data.id,
    username: data.username,
    nombreCompleto: data.nombreCompleto,
    rol: data.rol,
  }));

  return data;
};

// === LOGOUT ===
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// === GETTERS ===
export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      logout();
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

// === PERMISOS POR MÓDULO ===
// Retorna true si el usuario tiene acceso al módulo indicado
export const hasPermission = (modulo) => {
  const user = getUser();
  if (!user) return false;

  const rol = user.rol;

  // ADMINISTRADOR ve todo
  if (rol === 'ADMINISTRADOR') return true;

  // CONSULTOR puede ver consultas y panel de control (solo lectura)
  if (rol === 'CONSULTOR') {
    const modulosConsultor = [
      'Panel de Control',
      'Consulta Estudios',
      'Consulta Afectaciones',
      'Consulta Adquisiciones',
      'Consulta Adjudicaciones',
    ];
    return modulosConsultor.includes(modulo);
  }

  // Roles por módulo: solo ven su módulo
  const permisosPorRol = {
    'ESTUDIO_MERCADO': ['Estudio de mercado'],
    'AFECTACION': ['Afectación P'],
    'ADQUISICIONES': ['AdquisicionesC'],
    'ADJUDICACION': ['Adjudicación'],
  };

  return permisosPorRol[rol]?.includes(modulo) || false;
};

// === ¿PUEDE REGISTRAR? (Excluye CONSULTOR de formularios) ===
export const canRegister = () => {
  const user = getUser();
  if (!user) return false;
  return user.rol !== 'CONSULTOR';
};

// === ¿PUEDE EDITAR REGISTRO? ===
// Retorna true si es ADMIN o si tiene el rol del módulo Y es el creador
export const canEditRecord = (moduloReq, recordCreadorUsername) => {
  const user = getUser();
  if (!user) return false;

  const rol = user.rol;

  // ADMINISTRADOR edita todo
  if (rol === 'ADMINISTRADOR') return true;

  // CONSULTOR no edita nada
  if (rol === 'CONSULTOR') return false;

  // Roles por módulo: solo pueden editar si son los dueños
  // moduloReq debe ser exactamente el nombre del ROL (Ej: 'AFECTACION', 'ADQUISICIONES', 'ADJUDICACION')
  if (rol === moduloReq && recordCreadorUsername === user.username) {
    return true;
  }

  return false;
};

// === CONFIGURAR AXIOS ===
export const setupAxiosInterceptors = (onUnauthorized) => {
  // Inyectar token en cada petición
  axios.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Si el backend responde 401, cerrar sesión
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        logout();
        if (onUnauthorized) onUnauthorized();
      }
      return Promise.reject(error);
    }
  );
};
