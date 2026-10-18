import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { cerrarSesionApi, iniciarSesion, obtenerSesionActual, registrarUsuario } from "../api/authApi";

export const AuthContext = createContext(null);
export const ROLES = { ADMINISTRADOR: 1, VENDEDOR: 2, CLIENTE: 3 };

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerSesionActual().then(setUsuario).catch(() => setUsuario(null)).finally(() => setCargando(false));
  }, []);

  const login = useCallback(async (correo, password) => {
    const usuarioLogueado = await iniciarSesion(correo, password);
    setUsuario(usuarioLogueado);
    return usuarioLogueado;
  }, []);

  const logout = useCallback(async () => {
    await cerrarSesionApi();
    setUsuario(null);
  }, []);

  const registro = useCallback(async (datos) => registrarUsuario(datos), []);

  const valor = useMemo(() => ({
    usuario, cargando, login, logout, registro,
    estaAutenticado: Boolean(usuario),
    esAdmin: usuario?.rolId === ROLES.ADMINISTRADOR,
    esVendedor: usuario?.rolId === ROLES.VENDEDOR,
    esCliente: usuario?.rolId === ROLES.CLIENTE
  }), [usuario, cargando, login, logout, registro]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
