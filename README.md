# Jornada SOIVRE Zaragoza 2026 — Sitio web

Web oficial de la 1.ª Jornada Anual para la Mejora de la Competitividad del Servicio de Inspección SOIVRE (Zaragoza, 26–28 de mayo de 2026).

**URL pública:** `https://<tu-usuario>.github.io/jornada-soivre-zaragoza-2026/`

---

## Estructura del proyecto

```
/
├── index.html          ← Home con accesos rápidos y participantes
├── inauguracion.html   ← Acto inaugural y representantes institucionales
├── jornadas.html       ← Agenda completa de los tres días
├── actividades.html    ← Visita guiada, cena y visita ZLC/PLAZA
├── galeria.html        ← Galería fotográfica con filtros
├── css/style.css       ← Todo el CSS del sitio
├── js/app.js           ← Toda la lógica JavaScript
├── data/
│   ├── agenda.json         ← Programa de los tres días
│   ├── representantes.json ← Ponentes y autoridades de la inauguración
│   ├── asistentes.json     ← Lista de participantes
│   └── galeria.json        ← Índice de fotos
└── img/
    └── galeria/
        ├── inauguracion/   ← Fotos del acto inaugural
        ├── jornadas/       ← Fotos de las ponencias
        ├── visita-guiada/  ← Fotos de la visita al centro histórico
        ├── cena/           ← Fotos de la cena de grupo
        └── zlc-plaza/      ← Fotos de la visita a ZLC y PLAZA
```

---

## Cómo previsualizar en tu ordenador

Sin servidor no se pueden hacer `fetch()` de los JSON. Para previsualizar localmente:

```bash
cd ruta/al/proyecto
python3 -m http.server 8000
```

Abre el navegador en `http://localhost:8000`.

---

## Cómo añadir un participante

1. Ve a tu repositorio en [github.com](https://github.com).
2. Navega a `data/asistentes.json`.
3. Haz clic en el **icono del lápiz** (✏️) en la esquina superior derecha del archivo.
4. Añade un objeto nuevo al array. Copia este bloque y rellena los campos:

```json
{
  "nombre": "Nombre Apellido Apellido",
  "cargo": "Jefe/a de Inspección SOIVRE",
  "organismo": "DT de Comercio de Sevilla",
  "foto": ""
}
```

> ⚠️ Pon una coma al final del objeto anterior antes de añadir el nuevo.  
> El campo `"foto"` puede quedar vacío — se mostrará un avatar con las iniciales.  
> Si tienes foto, ponla en `img/` y escribe la ruta: `"foto": "img/asistentes/nombre.jpg"`.

5. Haz clic en **"Commit changes…"** → escribe un mensaje breve → **"Commit changes"**.
6. En 1–2 minutos el cambio estará publicado.

---

## Cómo añadir fotos a la galería

Paso 1 — **Sube la foto** a la carpeta correcta:

1. En el repo, navega a `img/galeria/<sección>/`  
   (inauguracion / jornadas / visita-guiada / cena / zlc-plaza)
2. Haz clic en **"Add file" → "Upload files"**.
3. Arrastra la foto (o haz clic para buscarla). El nombre del archivo no debe tener espacios ni tildes.  
   Ejemplo: `acto-apertura-01.jpg`
4. **"Commit changes"**.

Paso 2 — **Registra la foto** en el índice:

1. Navega a `data/galeria.json`.
2. Haz clic en el lápiz ✏️.
3. Añade un objeto al array:

```json
{
  "seccion": "inauguracion",
  "archivo": "img/galeria/inauguracion/acto-apertura-01.jpg",
  "pie": "Acto de apertura. Zaragoza, 26 de mayo de 2026.",
  "fecha": "2026-05-26"
}
```

> Los valores de `"seccion"` posibles son:  
> `inauguracion` · `jornadas` · `visita-guiada` · `cena` · `zlc-plaza`

4. **"Commit changes"**. Listo.

---

## Cómo añadir un representante institucional

1. Navega a `data/representantes.json`.
2. Lápiz ✏️ → añade un objeto:

```json
{
  "nombre": "Nombre Apellido",
  "cargo": "Cargo completo",
  "organismo": "Institución",
  "foto": ""
}
```

3. **"Commit changes"**.

---

## Cómo actualizar la agenda

1. Navega a `data/agenda.json`.
2. Lápiz ✏️ → localiza el ítem que quieres modificar.
3. Cambia `"pendiente": true` a `"pendiente": false` cuando se confirme.
4. Actualiza la `"hora"` si se ha ajustado.
5. **"Commit changes"**.

---

## Cómo está desplegado (GitHub Pages)

El sitio se publica automáticamente desde la rama `main` cuando haces un commit.

Para activarlo por primera vez (solo una vez):
1. Ve a **Settings** del repositorio.
2. Menú lateral: **Pages**.
3. En "Branch", selecciona `main` y carpeta `/ (root)`.
4. Guarda. En 2–3 minutos tendrás la URL `https://<usuario>.github.io/<nombre-repo>/`.

---

## Esquemas de los JSON

### `data/asistentes.json`
```json
[
  {
    "nombre": "string — nombre completo",
    "cargo": "string — cargo oficial",
    "organismo": "string — nombre de la delegación o unidad",
    "foto": "string — ruta relativa a la imagen, o vacío para usar iniciales"
  }
]
```

### `data/galeria.json`
```json
[
  {
    "seccion": "inauguracion | jornadas | visita-guiada | cena | zlc-plaza",
    "archivo": "img/galeria/<seccion>/<nombre-archivo>.jpg",
    "pie": "Texto descriptivo de la foto (opcional)",
    "fecha": "AAAA-MM-DD (opcional)"
  }
]
```

### `data/representantes.json`
```json
[
  {
    "nombre": "string",
    "cargo": "string",
    "organismo": "string",
    "foto": "string o vacío"
  }
]
```

### `data/agenda.json`
```json
[
  {
    "dia": "string — nombre completo del día",
    "dia_id": "martes | miercoles | jueves",
    "items": [
      {
        "hora": "HH:MM o vacío si está por confirmar",
        "tipo": "ponencia | acto | logistica | actividad",
        "titulo": "string",
        "ponente": "string o vacío",
        "cargo": "string o vacío",
        "organismo": "string o vacío",
        "pendiente": true | false,
        "nota": "string — texto adicional, aparece en cursiva debajo"
      }
    ]
  }
]
```

---

## Tecnología

- HTML + CSS + JavaScript vanilla. Sin frameworks, sin build, sin dependencias.
- Fuentes: Google Fonts (Cormorant Garamond, Libre Baskerville, Raleway).
- Alojamiento: GitHub Pages (gratuito).
- Los JSON se cargan con `fetch()` → solo funciona en servidor HTTP (GitHub Pages o `python3 -m http.server`).

---

*Dirección Territorial de Comercio e ICEX de Aragón · Mayo 2026*
