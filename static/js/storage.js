/* GLOWLAB Skincare - storage.js
   Maneja las colecciones de localStorage (base de datos simulada),
   la sesion del usuario y la barra de navegacion comun a todas las paginas. */

const GLOW_KEYS = {
    usuarios: "glow_usuarios",
    productos: "glow_productos",
    categorias: "glow_categorias",
    regiones: "glow_regiones",
    comunas: "glow_comunas",
    roles: "glow_roles",
    carrito: "glow_carrito",
    contactos: "glow_contactos",
    blog: "glow_blog",
    sesion: "glow_sesion"
};


function obtenerColeccion(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}


function guardarColeccion(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}


/* ---------- Datos iniciales de prueba ---------- */

function inicializarDatos() {

    if (!localStorage.getItem(GLOW_KEYS.roles)) {
        guardarColeccion(GLOW_KEYS.roles, [
            { id: 1, nombre: "Administrador" },
            { id: 2, nombre: "Vendedor" },
            { id: 3, nombre: "Cliente" }
        ]);
    }


    if (!localStorage.getItem(GLOW_KEYS.categorias)) {
        guardarColeccion(GLOW_KEYS.categorias, [
            { id: 1, nombre: "Limpiadores" },
            { id: 2, nombre: "Sueros" },
            { id: 3, nombre: "Hidratantes" },
            { id: 4, nombre: "Protector Solar" },
            { id: 5, nombre: "Exfoliantes" },
            { id: 6, nombre: "Mascarillas" },
            { id: 7, nombre: "Contorno de Ojos" }
        ]);
    }


    if (!localStorage.getItem(GLOW_KEYS.regiones)) {
        guardarColeccion(GLOW_KEYS.regiones, [
            { id: 1, nombre: "Region Metropolitana" },
            { id: 2, nombre: "Valparaiso" },
            { id: 3, nombre: "Biobio" }
        ]);
    }


    if (!localStorage.getItem(GLOW_KEYS.comunas)) {
        guardarColeccion(GLOW_KEYS.comunas, [
            { id: 1, regionId: 1, nombre: "Santiago" },
            { id: 2, regionId: 1, nombre: "Providencia" },
            { id: 3, regionId: 1, nombre: "Maipu" },
            { id: 4, regionId: 2, nombre: "Valparaiso" },
            { id: 5, regionId: 2, nombre: "Vina del Mar" },
            { id: 6, regionId: 3, nombre: "Concepcion" },
            { id: 7, regionId: 3, nombre: "Talcahuano" }
        ]);
    }


    if (!localStorage.getItem(GLOW_KEYS.usuarios)) {
        guardarColeccion(GLOW_KEYS.usuarios, [
            {
                run: "123456785", nombre: "Admin", apellidos: "Glowlab",
                correo: "admin@gmail.com", password: "admin123",
                fechaNacimiento: "1990-01-01", rolId: 1,
                regionId: 1, comunaId: 1, direccion: "Av. Principal 123",
                estado: "Activo"
            },
            {
                run: "987654325", nombre: "Vendedor", apellidos: "Glowlab",
                correo: "vendedor@gmail.com", password: "vend1234",
                fechaNacimiento: "1992-05-14", rolId: 2,
                regionId: 1, comunaId: 2, direccion: "Calle Venta 456",
                estado: "Activo"
            },
            {
                run: "112223339", nombre: "Camila", apellidos: "Soto Perez",
                correo: "camila@gmail.com", password: "cliente1",
                fechaNacimiento: "1998-03-22", rolId: 3,
                regionId: 2, comunaId: 4, direccion: "Los Aromos 789",
                estado: "Activo"
            },
            {
                run: "201113334", nombre: "Diego", apellidos: "Fernandez Rojas",
                correo: "diego@duoc.cl", password: "diego123",
                fechaNacimiento: "2001-11-09", rolId: 3,
                regionId: 3, comunaId: 6, direccion: "Las Rosas 321",
                estado: "Activo"
            }
        ]);
    }


    if (!localStorage.getItem(GLOW_KEYS.productos)) {
        guardarColeccion(GLOW_KEYS.productos, [
            { codigo: "GL-001", nombre: "Hydra Glow Serum", descripcion: "Serum concentrado en acido hialuronico que hidrata en profundidad y aporta luminosidad inmediata a la piel.", precio: 15990, stock: 18, stockCritico: 4, categoriaId: 2, imagen: "productos/hidratante1.webp", estado: "Activo" },

            { codigo: "GL-002", nombre: "Pure Clay Cleanser", descripcion: "Limpiador facial en gel con arcilla blanca que remueve impurezas sin resecar la piel.", precio: 9990, stock: 25, stockCritico: 5, categoriaId: 1, imagen: "productos/limpiador1.jpg", estado: "Activo" },

            { codigo: "GL-003", nombre: "Velvet Repair Cream", descripcion: "Crema reparadora de textura aterciopelada, ideal para restaurar la barrera cutanea durante la noche.", precio: 18990, stock: 14, stockCritico: 3, categoriaId: 3, imagen: "productos/crema.webp", estado: "Activo" },

            { codigo: "GL-004", nombre: "Sun Shield SPF50", descripcion: "Protector solar facial de amplio espectro, textura ligera y acabado natural, resistente al agua.", precio: 13990, stock: 20, stockCritico: 5, categoriaId: 4, imagen: "productos/bloqueador1.jpg", estado: "Activo" },

            { codigo: "GL-005", nombre: "Gentle Glow Scrub", descripcion: "Exfoliante suave con microparticulas naturales que renueva la piel sin causar irritacion.", precio: 11990, stock: 16, stockCritico: 4, categoriaId: 5, imagen: "productos/exfoliante1.jpg", estado: "Activo" },

            { codigo: "GL-006", nombre: "Rose Clay Mask", descripcion: "Mascarilla purificante de arcilla rosada que equilibra la produccion de sebo y afina los poros.", precio: 12990, stock: 12, stockCritico: 3, categoriaId: 6, imagen: "productos/mascarilla.jfif", estado: "Activo" },

            { codigo: "GL-007", nombre: "Bright Eye Contour", descripcion: "Contorno de ojos iluminador que reduce ojeras y lineas de expresion con cafeina y vitamina E.", precio: 14990, stock: 3, stockCritico: 4, categoriaId: 7, imagen: "productos/contorno1.webp", estado: "Activo" },

            { codigo: "GL-008", nombre: "Vitamin C Radiance Serum", descripcion: "Serum antioxidante con vitamina C estabilizada que unifica el tono e ilumina la piel opaca.", precio: 16990, stock: 9, stockCritico: 3, categoriaId: 2, imagen: "productos/suero1.webp", estado: "Activo" }
        ]);
    }


    if (!localStorage.getItem(GLOW_KEYS.blog)) {
        guardarColeccion(GLOW_KEYS.blog, [
            { id: 1, titulo: "GLOWLAB abre sus puertas", resumen: "Nace una nueva tienda online de skincare pensada por y para quienes aman cuidar su piel.", imagen: "blog/apertura.jpeg", fecha: "2026-08-01", slug: "detalle-1" },

            { id: 2, titulo: "Las tendencias skincare mas esperadas del ano", resumen: "Repasamos los ingredientes y rutinas que marcaran tendencia en los proximos meses.", imagen: "blog/tendencia.jpeg", fecha: "2026-08-10", slug: "detalle-2" },

            { id: 3, titulo: "5 curiosidades sobre el cuidado de la piel", resumen: "Datos curiosos que quizas no conocias sobre la ciencia detras del skincare.", imagen: "blog/curiosidades.jpeg", fecha: "2026-08-20", slug: "detalle-3" }
        ]);
    }


    if (!localStorage.getItem(GLOW_KEYS.carrito)) {
        guardarColeccion(GLOW_KEYS.carrito, []);
    }


    if (!localStorage.getItem(GLOW_KEYS.contactos)) {
        guardarColeccion(GLOW_KEYS.contactos, []);
    }
}


/* ---------- Sesion ---------- */

function obtenerSesion() {
    return JSON.parse(localStorage.getItem(GLOW_KEYS.sesion)) || null;
}


function guardarSesion(usuario) {
    localStorage.setItem(GLOW_KEYS.sesion, JSON.stringify(usuario));
}


function cerrarSesion() {
    localStorage.removeItem(GLOW_KEYS.sesion);
    window.location.href = "/login";
}


function obtenerNombreRol(rolId) {
    const rol = obtenerColeccion(GLOW_KEYS.roles).find(function (r) {
        return r.id === rolId;
    });

    return rol ? rol.nombre : "";
}


/* Protege paginas administrativas segun el rol permitido. */

function protegerPaginaAdmin(rolesPermitidos) {
    const sesion = obtenerSesion();

    if (!sesion || rolesPermitidos.indexOf(sesion.rolId) === -1) {
        Swal.fire({
            title: "Acceso restringido",
            text: "Debes iniciar sesion con una cuenta autorizada para ver esta pagina.",
            icon: "warning",
            confirmButtonText: "Ir a Iniciar sesion"
        }).then(function () {
            window.location.href = "/login";
        });

        return false;
    }

    return true;
}


/* ---------- Navbar dinamica ---------- */

function actualizarNavbar() {
    const sesion = obtenerSesion();
    const navInvitado = document.getElementById("navInvitado");
    const navUsuario = document.getElementById("navUsuario");
    const navUsuarioNombre = document.getElementById("navUsuarioNombre");
    const navAdminItem = document.getElementById("navAdminItem");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    if (!navInvitado || !navUsuario) return;

    if (sesion) {
        navInvitado.style.display = "none";
        navUsuario.style.display = "block";

        if (navUsuarioNombre) {
            navUsuarioNombre.textContent = sesion.nombre;
        }

        if (navAdminItem && (sesion.rolId === 1 || sesion.rolId === 2)) {
            navAdminItem.style.display = "block";
        }

    } else {
        navInvitado.style.display = "flex";
        navUsuario.style.display = "none";

        if (navAdminItem) {
            navAdminItem.style.display = "none";
        }
    }


    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", function (evento) {
            evento.preventDefault();
            cerrarSesion();
        });
    }
}


/* ---------- Badge del carrito ---------- */

function actualizarBadgeCarrito() {
    const carrito = obtenerColeccion(GLOW_KEYS.carrito);
    let totalItems = 0;

    for (let i = 0; i < carrito.length; i++) {
        totalItems += carrito[i].cantidad;
    }

    const badge = document.getElementById("carritoBadge");

    if (!badge) return;

    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.style.display = "block";

    } else {
        badge.style.display = "none";
    }
}


/* Oculta la seccion de Usuarios en el menu administrativo para el rol Vendedor. */

function ocultarUsuariosSiVendedor() {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rolId !== 2) return;

    const enlaceSidebar = document.getElementById("sidebarUsuariosLink");
    const enlaceOffcanvas = document.getElementById("offcanvasUsuariosLink");

    if (enlaceSidebar) enlaceSidebar.style.display = "none";
    if (enlaceOffcanvas) enlaceOffcanvas.style.display = "none";
}


/* Marca como activo el enlace del navbar/sidebar que corresponde a la pagina actual. */

function marcarEnlaceActivo() {
    const rutaActual = window.location.pathname;

    document.querySelectorAll(".nav-link").forEach(function (enlace) {
        const href = enlace.getAttribute("href");

        if (href && href !== "#" && href === rutaActual) {
            enlace.classList.add("active");
        }
    });
}


function formatearPrecio(valor) {
    return "$" + Number(valor).toLocaleString("es-CL");
}


document.addEventListener("DOMContentLoaded", function () {
    inicializarDatos();
    actualizarNavbar();
    actualizarBadgeCarrito();
    marcarEnlaceActivo();
});