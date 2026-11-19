package cl.glowlab.control3.service;

import cl.glowlab.control3.model.*;
import java.util.*;

public final class Vistas {
    private Vistas() {}
    public static Map<String,Object> usuario(Usuario u) {
        Map<String,Object> v = new LinkedHashMap<>();
        v.put("run",u.run); v.put("nombre",u.nombre); v.put("apellidos",u.apellidos);
        v.put("correo",u.correo); v.put("rolId",switch(u.rol){case ADMINISTRADOR->1;case VENDEDOR->2;case CLIENTE->3;});
        v.put("estado",u.estado); v.put("regionId",u.regionId); v.put("comunaId",u.comunaId);
        v.put("direccion",u.direccion); v.put("fechaNacimiento",u.fechaNacimiento);
        return v;
    }
    public static Map<String,Object> categoria(Categoria c) {
        return Map.of("id",c.id,"nombre",c.nombre);
    }
    public static Map<String,Object> producto(Producto p) {
        Map<String,Object> v = new LinkedHashMap<>();
        v.put("codigo",p.codigo); v.put("nombre",p.nombre); v.put("descripcion",p.descripcion);
        v.put("precio",p.precio); v.put("stock",p.stock); v.put("stockCritico",p.stockCritico);
        v.put("categoriaId",p.categoria.id); v.put("imagen",p.imagen);
        v.put("estado",p.estado); v.put("ofertaTipo",p.ofertaTipo);
        v.put("descuentoPorcentaje",p.descuentoPorcentaje);
        return v;
    }
    public static Map<String,Object> boleta(Boleta b) {
        Map<String,Object> entrega = new LinkedHashMap<>();
        entrega.put("nombre",b.recibeNombre); entrega.put("apellidos",b.recibeApellidos);
        entrega.put("correo",b.recibeCorreo); entrega.put("telefono",b.recibeTelefono);
        entrega.put("direccion",b.recibeDireccion); entrega.put("departamento",b.departamento);
        entrega.put("region",b.region); entrega.put("regionId",b.regionId);
        entrega.put("comuna",b.comuna); entrega.put("comunaId",b.comunaId);
        entrega.put("referencia",b.referencia);
        List<Map<String,Object>> items = b.detalles.stream().map(d -> {
            Map<String,Object> v = new LinkedHashMap<>();
            v.put("codigo",d.codigo); v.put("nombre",d.nombre); v.put("cantidad",d.cantidad);
            v.put("precioUnitario",d.precioUnitario); v.put("subtotal",d.subtotal);
            v.put("descuento",d.descuento); v.put("oferta",d.oferta);
            return v;
        }).toList();
        Map<String,Object> v = new LinkedHashMap<>();
        v.put("id","PED-"+String.format("%05d",b.id));
        v.put("fecha",b.fecha.toString()); v.put("clienteRun",b.usuario.run);
        v.put("clienteNombre",b.usuario.nombre+" "+b.usuario.apellidos);
        v.put("estado",b.estado); v.put("total",b.total);
        v.put("items",items); v.put("entrega",entrega);
        v.put("unidades",b.detalles.stream().mapToInt(d->d.cantidad).sum());
        return v;
    }
}
