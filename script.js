/* ==========================================================
   Studio Denise Vieira — configuração e interações
   ========================================================== */

// ⚠️ CONFIGURAÇÃO — preencha com os dados reais da cliente
const CONFIG = {
  // WhatsApp com DDI + DDD, só números (ex.: 5561999998888).
  // Enquanto estiver vazio, os botões abrem o Direct do Instagram.
  whatsapp: '5561999795209',
  instagram: 'https://www.instagram.com/studio_denisevieira/',
  // Endereço (opcional). Vazio = "Endereço enviado no agendamento".
  endereco: '',
};

// Fotos da galeria: pasta img/cilios e img/unhas.
// Para adicionar: coloque a foto na pasta e acrescente o número aqui.
const GALERIA = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(n => ({ cat: 'cilios', src: `img/cilios/${String(n).padStart(2, '0')}.jpg` })),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(n => ({ cat: 'unhas', src: `img/unhas/${String(n).padStart(2, '0')}.jpg` })),
];

/* ---------- WhatsApp ---------- */
function linkWhats(msg) {
  if (!CONFIG.whatsapp) return CONFIG.instagram;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg || 'Olá Denise!')}`;
}
document.querySelectorAll('.js-whats').forEach(a => {
  a.href = linkWhats(a.dataset.msg);
  a.target = '_blank';
  a.rel = 'noopener';
});
if (CONFIG.whatsapp) {
  const n = CONFIG.whatsapp.replace(/^55/, '');
  const fmt = n.length === 11 ? `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}` : n;
  document.querySelectorAll('.js-fone').forEach(a => (a.textContent = fmt));
}
if (CONFIG.endereco) document.querySelectorAll('.js-endereco').forEach(el => (el.textContent = CONFIG.endereco));

/* ---------- Cabeçalho e menu ---------- */
const topo = document.getElementById('topo');
const onScroll = () => topo.classList.toggle('is-scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
function toggleMenu(abrir) {
  const aberto = abrir ?? !menu.classList.contains('is-aberto');
  menu.classList.toggle('is-aberto', aberto);
  burger.classList.toggle('is-aberto', aberto);
  burger.setAttribute('aria-expanded', aberto);
  document.body.style.overflow = aberto ? 'hidden' : '';
}
burger.addEventListener('click', () => toggleMenu());
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

/* ---------- Tabs de serviços ---------- */
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', t === tab); });
  document.querySelectorAll('[data-painel]').forEach(p => {
    p.hidden = p.dataset.painel !== tab.dataset.tab;
    if (!p.hidden) p.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visivel'));
  });
}));

/* ---------- Galeria ---------- */
const grid = document.getElementById('galeria-grid');
// intercala cílios e unhas para a grelha ficar equilibrada
const cil = GALERIA.filter(f => f.cat === 'cilios'), unh = GALERIA.filter(f => f.cat === 'unhas');
const ordem = [];
for (let i = 0; i < Math.max(cil.length, unh.length); i++) { if (cil[i]) ordem.push(cil[i]); if (unh[i]) ordem.push(unh[i]); }

const INICIAIS = 12; // fotos visíveis antes de "Ver mais"
grid.innerHTML = ordem.map((f, i) => `
  <button class="galeria__item${i >= INICIAIS ? ' is-extra' : ''}" data-cat="${f.cat}" data-i="${i}" data-rotulo="${f.cat === 'cilios' ? 'Cílios' : 'Unhas'}">
    <img src="${f.src}" alt="Trabalho de ${f.cat === 'cilios' ? 'extensão de cílios' : 'unhas'} do Studio Denise Vieira" loading="lazy" />
  </button>`).join('');

const verMais = document.getElementById('ver-mais');
verMais.addEventListener('click', () => {
  const exp = grid.classList.toggle('is-expandida');
  verMais.textContent = exp ? 'Ver menos' : 'Ver mais fotos';
  if (!exp) document.getElementById('galeria').scrollIntoView();
});

document.querySelectorAll('.filtro').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.filtro').forEach(b => b.classList.toggle('is-active', b === btn));
  const f = btn.dataset.filtro;
  grid.querySelectorAll('.galeria__item').forEach(el => el.classList.toggle('is-oculto', f !== 'todos' && el.dataset.cat !== f));
}));

/* ---------- Lightbox ---------- */
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
let atual = 0;
const visiveis = () => [...grid.querySelectorAll('.galeria__item:not(.is-oculto)')].filter(el => el.offsetParent !== null);
function abrir(el) {
  const lista = visiveis();
  atual = lista.indexOf(el);
  mostrar(lista);
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  lb.querySelector('.lightbox__fechar').focus();
}
function mostrar(lista = visiveis()) {
  const img = lista[atual].querySelector('img');
  lbImg.src = img.src; lbImg.alt = img.alt;
}
function passo(d) { const l = visiveis(); atual = (atual + d + l.length) % l.length; mostrar(l); }
function fechar() { lb.hidden = true; document.body.style.overflow = ''; }

grid.addEventListener('click', e => { const it = e.target.closest('.galeria__item'); if (it) abrir(it); });
lb.querySelector('.lightbox__fechar').addEventListener('click', fechar);
lb.querySelector('.lightbox__nav--ant').addEventListener('click', () => passo(-1));
lb.querySelector('.lightbox__nav--prox').addEventListener('click', () => passo(1));
lb.addEventListener('click', e => { if (e.target === lb) fechar(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') fechar();
  if (e.key === 'ArrowLeft') passo(-1);
  if (e.key === 'ArrowRight') passo(1);
});
// swipe no telemóvel
let x0 = null;
lb.addEventListener('touchstart', e => (x0 = e.touches[0].clientX), { passive: true });
lb.addEventListener('touchend', e => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 50) passo(dx < 0 ? 1 : -1);
  x0 = null;
});

/* ---------- Animações ao rolar ---------- */
const io = new IntersectionObserver(entradas => {
  entradas.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visivel'); io.unobserve(en.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.getElementById('ano').textContent = new Date().getFullYear();
