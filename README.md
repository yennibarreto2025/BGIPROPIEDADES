# BGI Propiedades — Sitio One-Page

Sitio web estático de una página para BGI Propiedades (gestión inmobiliaria de alto valor).

Contenido:
- `index.html` — Estructura y secciones (hero, nosotros, portafolio, clientes, contacto, footer).
- `style.css` — Estilos y diseño responsivo.
- `script.js` — Interacciones: menú móvil, scroll suave, formulario EmailJS, carrusel.

Cómo usar

1. Abrir `index.html` en tu navegador.
2. Para envío real de formulario, configura EmailJS en `script.js` (valores de `EMAILJS_*`).

Inicializar repositorio Git (local)

```bash
cd "c:\Users\Nitro 5\Desktop\BGI CODIGO"
# Inicializar git
git init
git add .
git commit -m "Initial commit — one page site for BGI Propiedades"
```

Subir a GitHub (opciones)

- Usando GitHub CLI (`gh`):

```bash
gh repo create bgi-propiedades --public --source=. --remote=origin --push
```

- Manual (crear repo en github.com y conectar remote):

```bash
git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
git branch -M main
git push -u origin main
```

Licencia

Este repositorio incluye un archivo `LICENSE` (MIT) por defecto. Cámbialo si prefieres otra licencia.

Créditos

Plantilla y recursos: imágenes de Unsplash y iconos FontAwesome.
