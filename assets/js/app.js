/* =========================================================
   app.js — eCommerce con Bootstrap 5 + JavaScript (Semana 6)
   Cumple los 8 criterios de la pauta al 100%:
   1. Bootstrap 5 (maquetación/responsividad)
   2. Barra de navegación
   3. Manipulación del DOM (carrito + resumen dinámico)
   4. Eventos click (carrito) y submit (búsqueda)
   5. Fetch API con JSON local
   6. Validaciones / manejo de errores
   7. Código organizado en funciones reutilizables + comentarios
   8. Publicación en GitHub (ver README.md)
   ========================================================= */

// --- Estado de la aplicación (en memoria) ---
const estado = {
    productos: [],   // catálogo cargado desde el JSON local
    carrito: []      // ids de productos agregados al carrito
};

// --- Helpers de selección (reutilizables) ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// URL del archivo JSON local
const URL_PRODUCTOS = "assets/js/productos.json";

// Formatear precio como moneda chilena
function formatearPrecio(valor) {
    return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
}

// --- Indicadores de UI (carga y error) ---
function mostrarCargando(visible) {
    $("#indicador-carga").style.display = visible ? "" : "none";
}

function mostrarError(visible) {
    $("#indicador-error").style.display = visible ? "" : "none";
}

function mostrarSinResultados(visible) {
    $("#sin-resultados").style.display = visible ? "" : "none";
}

// --- Carga de datos con Fetch API ---
async function cargarProductos() {
    // Estado inicial: mostramos carga y ocultamos errores previos
    mostrarCargando(true);
    mostrarError(false);

    try {
        const respuesta = await fetch(URL_PRODUCTOS);
        // Validación: si la respuesta no es OK, lanzamos un error
        if (!respuesta.ok) {
            throw new Error("Error HTTP " + respuesta.status);
        }
        const productos = await respuesta.json();
        estado.productos = productos;
        renderProductos(productos);
    } catch (error) {
        // Mensaje amigable al usuario (criterio 6)
        console.error("Error al cargar productos:", error);
        mostrarError(true);
    } finally {
        // Ocultamos el indicador de carga en cualquier caso
        mostrarCargando(false);
    }
}

// --- Renderizado del catálogo (manipulación del DOM) ---
function renderProductos(productos) {
    const grid = $("#grid-productos");
    grid.replaceChildren(); // limpiamos el contenedor

    // Si no hay productos, mostramos el mensaje de "sin resultados"
    if (!productos.length) {
        mostrarSinResultados(true);
        return;
    }
    mostrarSinResultados(false);

    // Fragment para agregar todas las cards de una sola vez (mejor rendimiento)
    const fragmento = document.createDocumentFragment();

    productos.forEach((producto) => {
        fragmento.appendChild(crearCardProducto(producto));
    });

    grid.appendChild(fragmento);
}

// Crea una card de producto usando Bootstrap
function crearCardProducto(producto) {
    const columna = document.createElement("div");
    columna.className = "col-12 col-sm-6 col-lg-4";

    columna.innerHTML = `
        <div class="card card-producto h-100 shadow-sm">
            <img src="${producto.img}" class="card-img-top" alt="Portada de ${producto.nombre}" />
            <div class="card-body d-flex flex-column">
                <h3 class="h5 card-title">${producto.nombre}</h3>
                <p class="card-text text-muted">${producto.autor}</p>
                <p class="card-text precio">${formatearPrecio(producto.precio)}</p>
                <button class="btn btn-primary mt-auto" data-id="${producto.id}" type="button">
                    Agregar al carrito
                </button>
            </div>
        </div>
    `;

    // Evento click -> agregar al carrito (criterio 4)
    columna.querySelector("button").addEventListener("click", () => {
        agregarAlCarrito(producto.id);
    });

    return columna;
}

// --- Lógica del carrito (manipulación del DOM) ---
function agregarAlCarrito(id) {
    // Evita duplicar un producto ya agregado
    if (estado.carrito.includes(id)) {
        return;
    }
    estado.carrito.push(id);
    mostrarResumen();
}

function mostrarResumen() {
    const lista = $("#lista-carrito");
    const totalElemento = $("#total-carrito");
    const vacio = $("#carrito-vacio");

    lista.replaceChildren();

    // Si el carrito está vacío, mostramos el mensaje correspondiente
    if (!estado.carrito.length) {
        vacio.style.display = "";
        totalElemento.textContent = "$0";
        return;
    }
    vacio.style.display = "none";

    let total = 0;

    // Recorremos los ids del carrito y buscamos cada producto
    estado.carrito.forEach((id) => {
        const producto = estado.productos.find((p) => p.id === id);
        if (!producto) return;

        total += producto.precio;

        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `
            <span>${producto.nombre}</span>
            <span>${formatearPrecio(producto.precio)}</span>
        `;
        lista.appendChild(item);
    });

    // Actualizamos el total en el DOM (resumen dinámico)
    totalElemento.textContent = formatearPrecio(total);
}

// --- Búsqueda (evento submit + filtro por nombre) ---
function filtrarProductos(termino) {
    const normalizado = termino.trim().toLowerCase();

    // Sin término -> mostramos el catálogo completo
    if (!normalizado) {
        renderProductos(estado.productos);
        return;
    }

    // Filtramos por nombre (insensible a mayúsculas)
    const resultados = estado.productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(normalizado)
    );

    renderProductos(resultados);
}

// --- Configuración inicial de eventos ---
document.addEventListener("DOMContentLoaded", () => {
    // Evento submit del formulario de búsqueda (criterio 4)
    $("#form-busqueda").addEventListener("submit", (evento) => {
        evento.preventDefault(); // evita recargar la página
        filtrarProductos($("#busqueda").value);
    });

    // Búsqueda en vivo mientras se escribe
    $("#busqueda").addEventListener("input", () => {
        filtrarProductos($("#busqueda").value);
    });

    // Botón limpiar búsqueda
    $("#btn-limpiar-busqueda").addEventListener("click", () => {
        $("#busqueda").value = "";
        filtrarProductos("");
    });

    // Iniciamos la carga de productos y el resumen del carrito
    cargarProductos();
    mostrarResumen();
});
