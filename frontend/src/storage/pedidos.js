// Informes e historial de compras simuladas (documento 040).
// Los pedidos pertenecen a una cuenta local del navegador; NO son pagos reales.
import { obtenerColeccion } from "./persistencia";
import { fallar, sesionInterna } from "./helpers";

function cuentaActual() {
  const usuario = sesionInterna();
  if (!usuario) fallar("Inicia sesión para consultar tus compras.");
  return usuario;
}

function exigirGestionVentas() {
  const usuario = cuentaActual();
  if (![1, 2].includes(usuario.rolId)) fallar("No tienes permisos para ver informes de ventas.");
}

function ordenados() {
  return [...obtenerColeccion("pedidos")].sort((a, b) => b.fecha.localeCompare(a.fecha));
}

// El cliente solo recibe las órdenes vinculadas a su RUN.
export async function listarMisPedidos() {
  const usuario = cuentaActual();
  return ordenados().filter((pedido) => pedido.clienteRun === usuario.run);
}

export async function listarPedidosAdmin() {
  exigirGestionVentas();
  return ordenados();
}

// Calcula indicadores desde pedidos reales de la demostración, sin cifras inventadas.
export async function obtenerInformeVentas() {
  const pedidos = await listarPedidosAdmin();
  const productos = new Map();
  const dias = new Map();
  let totalVentas = 0;
  let unidadesVendidas = 0;

  for (const pedido of pedidos) {
    totalVentas += pedido.total;
    const dia = pedido.fecha.slice(0, 10);
    dias.set(dia, (dias.get(dia) || 0) + pedido.total);
    for (const item of pedido.items) {
      unidadesVendidas += item.cantidad;
      const actual = productos.get(item.codigo) || {
        codigo: item.codigo, nombre: item.nombre, unidades: 0, total: 0
      };
      actual.unidades += item.cantidad;
      actual.total += item.subtotal;
      productos.set(item.codigo, actual);
    }
  }

  return {
    pedidos,
    cantidadPedidos: pedidos.length,
    totalVentas,
    unidadesVendidas,
    ticketPromedio: pedidos.length ? Math.round(totalVentas / pedidos.length) : 0,
    productosMasVendidos: [...productos.values()].sort((a, b) => b.unidades - a.unidades),
    ventasPorDia: [...dias.entries()]
      .map(([fecha, total]) => ({ fecha, total }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
  };
}
