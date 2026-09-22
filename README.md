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
