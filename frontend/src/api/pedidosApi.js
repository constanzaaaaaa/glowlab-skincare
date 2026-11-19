import * as local from "../storage/pedidos";
import { api, MODO_API } from "./http";

export async function listarMisPedidos() {
  return MODO_API ? api("/boletas/mis") : local.listarMisPedidos();
}
export async function listarPedidosAdmin() {
  return MODO_API ? api("/boletas") : local.listarPedidosAdmin();
}
export async function obtenerInformeVentas({ desde } = {}) {
  if (!MODO_API) return local.obtenerInformeVentas({ desde });
  const todos = await listarPedidosAdmin();
  const pedidos = desde ? todos.filter((p) => new Date(p.fecha).getTime() >= new Date(desde + "T00:00:00").getTime()) : todos;
  const productos = new Map();
  const dias = new Map();
  let totalVentas = 0, unidadesVendidas = 0;
  for (const pedido of pedidos) {
    totalVentas += pedido.total;
    const dia = pedido.fecha.slice(0, 10);
    dias.set(dia, (dias.get(dia) || 0) + pedido.total);
    for (const item of pedido.items) {
      unidadesVendidas += item.cantidad;
      const actual = productos.get(item.codigo) || { codigo: item.codigo, nombre: item.nombre, unidades: 0, total: 0 };
      actual.unidades += item.cantidad;
      actual.total += item.subtotal;
      productos.set(item.codigo, actual);
    }
  }
  return {
    pedidos, cantidadPedidos: pedidos.length, totalVentas, unidadesVendidas,
    ticketPromedio: pedidos.length ? Math.round(totalVentas / pedidos.length) : 0,
    productosMasVendidos: [...productos.values()].sort((a, b) => b.unidades - a.unidades),
    ventasPorDia: [...dias.entries()].map(([fecha, total]) => ({ fecha, total })).sort((a, b) => a.fecha.localeCompare(b.fecha))
  };
}
