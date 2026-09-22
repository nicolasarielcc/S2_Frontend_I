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
