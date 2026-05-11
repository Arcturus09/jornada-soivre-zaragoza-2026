/* =============================================================
   JORNADA SOIVRE ZARAGOZA 2026 — app.js
   Lógica central: carga de JSON, renderizado, tabs, lightbox,
   navegación móvil, menú activo.
   ============================================================= */

'use strict';

/* ── UTILIDADES ─────────────────────────────────────────────── */

/**
 * Fetch de un JSON relativo al sitio.
 * Funciona en GitHub Pages (HTTP). Para previsualizar en local
 * usa: python3 -m http.server 8000
 */
async function fetchJSON(ruta) {
  const res = await fetch(ruta);
  if (!res.ok) throw new Error(`Error ${res.status} al cargar ${ruta}`);
  return res.json();
}

/** Genera las iniciales de un nombre para el avatar placeholder */
function iniciales(nombre) {
  return nombre
    .split(' ')
    .filter((_, i) => i < 2)
    .map(p => p[0])
    .join('')
    .toUpperCase();
}

/** Escapa HTML para evitar XSS al insertar datos de JSON */
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

/* ── RENDERIZADO: TARJETA DE PERSONA ────────────────────────── */
function renderPersona(p) {
  const avatar = p.foto
    ? `<img class="persona-avatar" src="${esc(p.foto)}" alt="${esc(p.nombre)}" loading="lazy">`
    : `<div class="persona-avatar-placeholder">${esc(iniciales(p.nombre))}</div>`;

  return `
    <div class="persona-card">
      ${avatar}
      <div class="persona-nombre">${esc(p.nombre)}</div>
      <div class="persona-cargo">${esc(p.cargo)}</div>
      <div class="persona-organismo">${esc(p.organismo)}</div>
    </div>`;
}

/* ── REPRESENTANTES (inauguracion.html) ─────────────────────── */
async function cargarRepresentantes() {
  const contenedor = document.getElementById('representantes-grid');
  if (!contenedor) return;

  contenedor.innerHTML = cargandoHTML();

  try {
    const datos = await fetchJSON('data/representantes.json');
    if (!datos.length) {
      contenedor.innerHTML = '<p class="vacio-panel">Próximamente se publicará la lista de representantes.</p>';
      return;
    }
    contenedor.innerHTML = datos.map(renderPersona).join('');
  } catch (e) {
    contenedor.innerHTML = '<p class="vacio-panel">No se pudieron cargar los datos.</p>';
    console.error(e);
  }
}

/* ── ASISTENTES (index.html y posible página propia) ────────── */
async function cargarAsistentes() {
  const grid = document.getElementById('asistentes-grid');
  const contador = document.getElementById('asistentes-contador');
  if (!grid) return;

  grid.innerHTML = cargandoHTML();

  try {
    const datos = await fetchJSON('data/asistentes.json');

    if (contador) contador.textContent = datos.length || '—';

    if (!datos.length) {
      grid.innerHTML = '<p class="vacio-panel">Los participantes se irán publicando conforme se confirmen.</p>';
      return;
    }
    grid.innerHTML = datos.map(renderPersona).join('');
  } catch (e) {
    grid.innerHTML = '<p class="vacio-panel">No se pudieron cargar los datos.</p>';
    console.error(e);
  }
}

/* ── AGENDA (jornadas.html) ─────────────────────────────────── */
function renderItem(item) {
  const tipoClase = item.tipo ? `tipo-${esc(item.tipo)}` : '';
  const pendienteBadge = item.pendiente
    ? `<span class="badge-pendiente">Por confirmar${item.nota ? ' · ' + esc(item.nota) : ''}</span>`
    : (item.nota ? `<span style="font-family:var(--fuente-ui);font-size:0.75rem;color:var(--texto-muy-suave);font-style:italic;display:block;margin-top:0.35rem;">↳ ${esc(item.nota)}</span>` : '');

  const ponenteHtml = item.ponente
    ? `<div class="agenda-ponente"><strong>${esc(item.ponente)}</strong>${item.cargo ? ' · ' + esc(item.cargo) : ''}</div>`
    : '';

  const tipoLabel = {
    ponencia:  'Ponencia',
    acto:      'Acto',
    logistica: 'Logística',
    actividad: 'Actividad externa',
  }[item.tipo] || '';

  return `
    <div class="agenda-item ${tipoClase}">
      <div class="agenda-hora">${esc(item.hora) || '—'}</div>
      <div class="agenda-contenido">
        ${tipoLabel ? `<div class="agenda-tipo">${tipoLabel}</div>` : ''}
        <div class="agenda-titulo">${esc(item.titulo)}</div>
        ${ponenteHtml}
        ${pendienteBadge}
      </div>
    </div>`;
}

async function cargarAgenda() {
  const paneles = document.getElementById('agenda-paneles');
  if (!paneles) return;

  paneles.innerHTML = cargandoHTML();

  try {
    const datos = await fetchJSON('data/agenda.json');
    paneles.innerHTML = '';

    datos.forEach((dia, idx) => {
      const panel = document.createElement('div');
      panel.className = `agenda-panel${idx === 0 ? ' activo' : ''}`;
      panel.id = `panel-${esc(dia.dia_id)}`;

      panel.innerHTML = `<div class="agenda-items">${dia.items.map(renderItem).join('')}</div>`;
      paneles.appendChild(panel);
    });

    // Generar tabs dinámicamente
    const tabsContenedor = document.getElementById('agenda-tabs');
    if (tabsContenedor) {
      tabsContenedor.innerHTML = datos.map((dia, idx) => `
        <button class="agenda-tab${idx === 0 ? ' activo' : ''}"
                data-panel="panel-${esc(dia.dia_id)}">
          ${esc(dia.dia)}
        </button>`).join('');

      tabsContenedor.addEventListener('click', (e) => {
        const btn = e.target.closest('.agenda-tab');
        if (!btn) return;
        document.querySelectorAll('.agenda-tab').forEach(b => b.classList.remove('activo'));
        document.querySelectorAll('.agenda-panel').forEach(p => p.classList.remove('activo'));
        btn.classList.add('activo');
        document.getElementById(btn.dataset.panel)?.classList.add('activo');
      });
    }
  } catch (e) {
    paneles.innerHTML = '<p class="vacio-panel">No se pudo cargar la agenda.</p>';
    console.error(e);
  }
}

/* ── GALERÍA (galeria.html) ─────────────────────────────────── */
const SECCIONES_GALERIA = [
  { id: 'todas',        etiqueta: 'Todas' },
  { id: 'inauguracion', etiqueta: 'Inauguración' },
  { id: 'jornadas',     etiqueta: 'Jornadas' },
  { id: 'visita-guiada',etiqueta: 'Visita guiada' },
  { id: 'cena',         etiqueta: 'Cena de grupo' },
  { id: 'zlc-plaza',    etiqueta: 'ZLC y PLAZA' },
];

let _galeriaItems = [];

async function cargarGaleria() {
  const filtrosEl = document.getElementById('galeria-filtros');
  const gridEl    = document.getElementById('galeria-grid');
  if (!gridEl) return;

  gridEl.innerHTML = cargandoHTML();

  try {
    _galeriaItems = await fetchJSON('data/galeria.json');

    // Filtros
    if (filtrosEl) {
      filtrosEl.innerHTML = SECCIONES_GALERIA.map(s =>
        `<button class="filtro-btn${s.id === 'todas' ? ' activo' : ''}" data-seccion="${s.id}">${s.etiqueta}</button>`
      ).join('');

      filtrosEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.filtro-btn');
        if (!btn) return;
        document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        renderGaleriaGrid(btn.dataset.seccion);
      });
    }

    renderGaleriaGrid('todas');
  } catch (e) {
    gridEl.innerHTML = '<p class="vacio-panel">No se pudo cargar la galería.</p>';
    console.error(e);
  }
}

function renderGaleriaGrid(seccion) {
  const gridEl = document.getElementById('galeria-grid');
  if (!gridEl) return;

  const items = seccion === 'todas'
    ? _galeriaItems
    : _galeriaItems.filter(i => i.seccion === seccion);

  if (!items.length) {
    gridEl.innerHTML = `
      <div class="galeria-vacia">
        <div class="galeria-vacia-icono">📷</div>
        <p class="galeria-vacia-txt">Las fotos se publicarán próximamente.</p>
      </div>`;
    return;
  }

  gridEl.innerHTML = items.map((item, idx) => `
    <div class="galeria-item" data-idx="${idx}" data-seccion="${esc(item.seccion)}">
      <img src="${esc(item.archivo)}" alt="${esc(item.pie || '')}" loading="lazy">
      <div class="galeria-overlay">
        <div class="galeria-pie">${esc(item.pie || '')}</div>
      </div>
    </div>`).join('');

  // Lightbox
  gridEl.querySelectorAll('.galeria-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.idx);
      const secActiva = document.querySelector('.filtro-btn.activo')?.dataset.seccion || 'todas';
      const filtrados = secActiva === 'todas' ? _galeriaItems : _galeriaItems.filter(i => i.seccion === secActiva);
      abrirLightbox(filtrados[idx]);
    });
  });
}

/* ── LIGHTBOX ───────────────────────────────────────────────── */
function abrirLightbox(item) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const img = lb.querySelector('.lightbox-img');
  const pie = lb.querySelector('.lightbox-pie');
  if (img) { img.src = item.archivo; img.alt = item.pie || ''; }
  if (pie) pie.textContent = item.pie || '';
  lb.classList.add('abierto');
  document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('abierto');
  document.body.style.overflow = '';
}

/* ── NAVEGACIÓN ─────────────────────────────────────────────── */
function initNav() {
  // Marcar enlace activo
  const ruta = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href === ruta || (ruta === '' && href === 'index.html')) {
      a.classList.add('activo');
    }
  });

  // Menú móvil
  const btn = document.getElementById('hamburguesa');
  const menu = document.getElementById('nav-mobile');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('abierto');
      btn.setAttribute('aria-expanded', menu.classList.contains('abierto'));
    });
    // Cerrar al hacer clic en un enlace
    menu.querySelectorAll('.nav-link').forEach(a => {
      a.addEventListener('click', () => menu.classList.remove('abierto'));
    });
  }
}

/* ── HTML DE CARGA ──────────────────────────────────────────── */
function cargandoHTML() {
  return '<div class="cargando"><span></span><span></span><span></span></div>';
}

/* ── INIT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();

  // Lightbox (cierre)
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.querySelector('.lightbox-cerrar')?.addEventListener('click', cerrarLightbox);
    lb.addEventListener('click', (e) => { if (e.target === lb) cerrarLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarLightbox(); });
  }

  // Página: index
  if (document.getElementById('asistentes-grid')) cargarAsistentes();

  // Página: inauguración
  if (document.getElementById('representantes-grid')) cargarRepresentantes();

  // Página: jornadas
  if (document.getElementById('agenda-paneles')) cargarAgenda();

  // Página: galería
  if (document.getElementById('galeria-grid')) cargarGaleria();
});
