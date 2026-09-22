# Bookstore — eCommerce (Actividad Sumativa, Semana 6)

Proyecto que combina **Bootstrap 5** y **JavaScript** para cumplir al 100% los 8 criterios de la pauta de evaluación.

## Estructura de archivos

```
proyecto-ecommerce-S6/
├── index.html
└── assets/
    ├── css/
    │   └── estilos.css
    ├── js/
    │   ├── app.js
    │   └── productos.json
    └── img/
        └── *.webp / logo.png
```

## Cómo ejecutar localmente

> **Importante:** la carga del JSON local con `fetch()` requiere un servidor. Si abres `index.html` con doble clic (protocolo `file://`), el navegador **bloquea** `fetch()` y no se mostrarán los productos (ni el modal, ni el carrito). La página te lo advertirá con un mensaje.

Opciones:

1. **VS Code + Live Server**: clic derecho en `index.html` → *Open with Live Server*.
2. **Python** (desde la carpeta del proyecto):
   ```bash
   cd proyecto-ecommerce-S6
   python3 -m http.server 8000
   # abrir http://localhost:8000
   ```
3. **Node**:
   ```bash
   npx http-server
   ```

## Características

- **Catálogo** de 24 libros cargados con `fetch()` desde `assets/js/productos.json`.
- **Carrito** con cantidades (se agrega una copia si el libro ya existe), resumen dinámico y **total**.
- Persistencia del carrito en `localStorage` (se guarda una **copia JSON** del carrito entre recargas).
- Mensajes **popup (toast)**: "Libro añadido al carrito", "El libro ya existía en el carrito, se agregó una copia" y "Su requerimiento fue enviado".
- **Búsqueda** (evento `submit`) y **formulario de contacto** con validación.
- **Modal** de detalle de producto, **carrusel**, eventos de mouse y carga desde la **Fake Store API**.
