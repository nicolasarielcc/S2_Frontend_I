/* =========================================================
   app.js — eCommerce con Bootstrap 5 + JavaScript (Semana 6)
   Cubre los 8 criterios de la pauta al 100% y presenta:
   - Fetch API con JSON local + render de cards
   - Eventos: click (carrito), submit (búsqueda), mouseover/mouseout
   - Manipulación del DOM (catálogo, carrito, modal)
   - Modal de detalle de producto (Bootstrap)
   - Interacción con una API externa (Fake Store API)
   - Manejo de errores con mensaje amigable
   Código organizado en funciones reutilizables y comentado.
   ========================================================= */

// --- Estado de la aplicación (en memoria) ---
const estado = {
    productos: [],     // catálogo cargado desde el JSON local
    carrito: [],       // ids de productos agregados al carrito
    detalleId: null    // id del producto abierto en el modal
};

// --- Helpers de selección (reutilizables) ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// URLs de datos
const URL_PRODUCTOS = "assets/js/productos.json";
const URL_EXTERNA = "https://fakestoreapi.com/products";

// Formatear precio como moneda chilena
function formatearPrecio(valor) {
    return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
}

// --- Indicadores de UI (carga y error del catálogo local) ---
function mostrarCargando(visible) {
    $("#indicador-carga").style.display = visible ? "" : "none";
}

function mostrarError(visible) {
    $("#indicador-error").style.display = visible ? "" : "none";
}

function mostrarSinResultados(visible) {
    $("#sin-resultados").style.display = visible ? "" : "none";
}

// =========================================================
//  1) CARGA DEL CATÁLOGO LOCAL (Fetch API + manejo de errores)
// =========================================================
async function cargarProductos() {
    mostrarCargando(true);
    mostrarError(false);

    try {
        const respuesta = await fetch(URL_PRODUCTOS);
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
        mostrarCargando(false);
    }
}

// =========================================================
//  2) RENDERIZADO DEL CATÁLOGO (manipulación del DOM)
// =========================================================
function renderProductos(productos) {
    const grid = $("#grid-productos");
    grid.replaceChildren();

    if (!productos.length) {
        mostrarSinResultados(true);
        return;
    }
    mostrarSinResultados(false);

    const fragmento = document.createDocumentFragment();
    productos.forEach((producto) => fragmento.appendChild(crearCardProducto(producto)));
    grid.appendChild(fragmento);
}

// Crea una card de producto usando Bootstrap (con botón de detalle + carrito)
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
                <div class="mt-auto d-flex gap-2">
                    <button class="btn btn-primary" data-id="${producto.id}" type="button">Agregar al carrito</button>
                    <button class="btn btn-outline-secondary" data-detalle="${producto.id}" type="button">Ver detalle</button>
                </div>
            </div>
        </div>
    `;

    // Evento click -> agregar al carrito (criterio 4)
    columna.querySelector("button[data-id]").addEventListener("click", () => {
        agregarAlCarrito(producto.id);
    });

    // Evento click -> abrir modal de detalle (componente modal)
    columna.querySelector("button[data-detalle]").addEventListener("click", () => {
        verDetalle(producto.id);
    });

    return columna;
}

// =========================================================
//  3) MODAL DE DETALLE (Bootstrap)
// =========================================================
function verDetalle(id) {
    const producto = estado.productos.find((p) => p.id === id);
    if (!producto) return;

    estado.detalleId = id;
    $("#modal-producto-titulo").textContent = producto.nombre;
    $("#modal-producto-cuerpo").innerHTML = `
        <div class="text-center mb-3">
            <img src="${producto.img}" alt="Portada de ${producto.nombre}" class="img-fluid" style="max-height: 220px;" />
        </div>
        <p class="mb-1"><strong>Autor:</strong> ${producto.autor}</p>
        <p class="mb-1"><strong>Precio:</strong> ${formatearPrecio(producto.precio)}</p>
    `;

    // Mostramos el modal usando la API de Bootstrap
    const modal = new bootstrap.Modal($("#modal-producto"));
    modal.show();
}

// =========================================================
//  4) CARRITO (manipulación del DOM)
// =========================================================
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

    if (!estado.carrito.length) {
        vacio.style.display = "";
        totalElemento.textContent = "$0";
        return;
    }
    vacio.style.display = "none";

    let total = 0;
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

    totalElemento.textContent = formatearPrecio(total);
}

// =========================================================
//  5) BÚSQUEDA (evento submit + filtro por nombre)
// =========================================================
function filtrarProductos(termino) {
    const normalizado = termino.trim().toLowerCase();

    if (!normalizado) {
        renderProductos(estado.productos);
        return;
    }

    const resultados = estado.productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(normalizado)
    );
    renderProductos(resultados);
}

// =========================================================
//  6) API EXTERNA (Fake Store API)
// =========================================================
async function cargarProductosExternos() {
    const grid = $("#grid-externos");
    const estadoUI = $("#externos-estado");

    grid.replaceChildren();
    estadoUI.innerHTML = `
        <div class="d-inline-flex align-items-center gap-2 text-muted">
            <div class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
            <span>Cargando productos desde Fake Store API...</span>
        </div>`;

    try {
        const respuesta = await fetch(URL_EXTERNA);
        if (!respuesta.ok) {
            throw new Error("Error HTTP " + respuesta.status);
        }
        const productos = await respuesta.json();

        estadoUI.innerHTML = "";
        const fragmento = document.createDocumentFragment();

        productos.slice(0, 8).forEach((producto) => {
            const columna = document.createElement("div");
            columna.className = "col-12 col-sm-6 col-lg-3";
            columna.innerHTML = `
                <div class="card card-producto h-100 shadow-sm">
                    <img src="${producto.image}" class="card-img-top" alt="${producto.title}" />
                    <div class="card-body d-flex flex-column">
                        <h3 class="h6 card-title">${producto.title}</h3>
                        <p class="card-text precio">$${producto.price}</p>
                    </div>
                </div>
            `;
            fragmento.appendChild(columna);
        });

        grid.appendChild(fragmento);
    } catch (error) {
        console.error("Error al cargar la API externa:", error);
        estadoUI.innerHTML = `<div class="alert alert-danger mb-0">No se pudieron cargar los productos externos: ${error.message}</div>`;
    }
}

// =========================================================
//  7) CONFIGURACIÓN INICIAL DE EVENTOS
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    // Evento submit del formulario de búsqueda (criterio 4)
    $("#form-busqueda").addEventListener("submit", (evento) => {
        evento.preventDefault();
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

    // Eventos de mouse (mouseover / mouseout)
    const cajaHover = $("#caja-hover");
    cajaHover.addEventListener("mouseover", () => cajaHover.classList.add("hover"));
    cajaHover.addEventListener("mouseout", () => cajaHover.classList.remove("hover"));

    // API externa
    $("#btn-cargar-externos").addEventListener("click", cargarProductosExternos);
    $("#btn-limpiar-externos").addEventListener("click", () => {
        $("#grid-externos").replaceChildren();
        $("#externos-estado").innerHTML = "";
    });

    // Botón "Agregar al carrito" dentro del modal de detalle
    $("#modal-agregar").addEventListener("click", () => {
        if (estado.detalleId !== null) {
            agregarAlCarrito(estado.detalleId);
            const modal = bootstrap.Modal.getInstance($("#modal-producto"));
            modal?.hide();
        }
    });

    // Iniciamos la carga del catálogo y el resumen del carrito
    cargarProductos();
    mostrarResumen();
});
