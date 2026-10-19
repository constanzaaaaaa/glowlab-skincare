import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { cerrarSesionApi, iniciarSesion, obtenerSesionActual, registrarUsuario } from "../api/authApi";
import { CLAVES, EVENTO_DATOS } from "../storage/persistencia";

export const AuthContext = createContext(null);
export const ROLES = { ADMINISTRADOR: 1, VENDEDOR: 2, CLIENTE: 3 };

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    const sincronizar = () => obtenerSesionActual()
      .then((actual) => { if (activo) setUsuario(actual); })
      .catch(() => { if (activo) setUsuario(null); })
      .finally(() => { if (activo) setCargando(false); });

    const eventoDatos = (evento) => {
      if (evento.detail?.tipo === "usuarios" || evento.detail?.tipo === "sesion") sincronizar();
    };
    const eventoStorage = (evento) => {
      if (evento.key === CLAVES.usuarios || evento.key === CLAVES.sesion) sincronizar();
    };
    sincronizar();
    window.addEventListener(EVENTO_DATOS, eventoDatos);
    window.addEventListener("storage", eventoStorage);
    return () => {
      activo = false;
      window.removeEventListener(EVENTO_DATOS, eventoDatos);
      window.removeEventListener("storage", eventoStorage);
    };
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
