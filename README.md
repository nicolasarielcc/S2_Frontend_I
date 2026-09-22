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

La carga del JSON local con `fetch()` requiere servidor (no abrir `index.html` directamente por `file://`). Opciones:

1. **VS Code + Live Server**: clic derecho en `index.html` → *Open with Live Server*.
2. **Python**:
   ```bash
   python3 -m http.server 8000
   # abrir http://localhost:8000
   ```

## Cumplimiento de la pauta (columna 100%)

| # | Criterio | Implementación |
|---|---|---|
| 1 | Bootstrap 5 correcto y responsivo | CDN 5.3.3, grid (`container/row/col`), cards, `lang="es"`, viewport |
| 2 | Barra de navegación | `navbar-expand-md` + toggler + collapse, 4 categorías simuladas |
| 3 | DOM (carrito + resumen dinámico) | `mostrarResumen()` actualiza lista + total sin recargar |
| 4 | Eventos `click` y `submit` | `click` (agregar al carrito) y `submit` (formulario de búsqueda) |
| 5 | Fetch API + JSON local | `fetch("assets/js/productos.json")` |
| 6 | Validaciones / errores | `.catch` → mensaje amigable + ocultar indicador de carga |
| 7 | Código modular + comentarios | Funciones reutilizables (`cargarProductos`, `renderProductos`, etc.) |
| 8 | Publicación en GitHub | Ver sección siguiente |

## Publicación en GitHub (criterio 8)

1. Crear un **repositorio público**.
2. Subir esta misma estructura de archivos.
3. Habilitar **GitHub Pages**:
   - *Settings → Pages → Branch: `main` → carpeta `/ (root)`* **o** crear una rama `gh-pages`.
4. Compartir el enlace del repositorio y del despliegue en AVA.

## Entrega (AVA)

- Comprimir como `nombre_Alumno_PFY2201_Optimización_Semana6.zip`.
- Adjuntar capturas de pantalla de: estructura de la página, interacción (agregar al carrito / búsqueda) y carga de datos con Fetch.
# S2_Frontend_I
