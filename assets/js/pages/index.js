// ===================== PARTÍCULAS GLOBAIS =====================
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');

  const COLORS = [
    [56,  189, 248],  // sky-400
    [14,  165, 233],  // sky-500
    [99,  102, 241],  // indigo-500
    [148, 163, 184],  // slate-400
    [186, 230, 253],  // sky-200
    [96,  165, 250],  // blue-400
  ];

  const COUNT = 160;
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(a, b) { return Math.random() * (b - a) + a; }
  function randInt(a, b) { return Math.floor(rand(a, b + 0.999)); }

  class Particle {
    constructor(initial) {
      this.spawn(initial);
    }

    spawn(initial) {
      const c = COLORS[randInt(0, COLORS.length - 1)];
      this.r = c[0]; this.g = c[1]; this.b = c[2];
      this.x  = rand(0, W);
      this.y  = initial ? rand(0, H) : H + 5;
      this.sz = rand(0.6, 2.8);
      this.vx = rand(-0.3, 0.3);
      this.vy = rand(-0.55, -0.08);
      this.phase      = rand(0, Math.PI * 2);
      this.phaseSpeed = rand(0.018, 0.055);
      this.glow       = Math.random() < 0.28;
      this.glowR      = this.sz * rand(5, 9);
    }

    update() {
      this.x     += this.vx;
      this.y     += this.vy;
      this.phase += this.phaseSpeed;
      if (this.y < -12 || this.x < -12 || this.x > W + 12) {
        this.spawn(false);
      }
    }

    draw() {
      const a = 0.3 + 0.65 * Math.abs(Math.sin(this.phase));
      ctx.save();
      if (this.glow) {
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glowR);
        g.addColorStop(0, `rgba(${this.r},${this.g},${this.b},${(a * 0.55).toFixed(2)})`);
        g.addColorStop(1, `rgba(${this.r},${this.g},${this.b},0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowR, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${a.toFixed(2)})`;
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(new Particle(true));
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  function onResize() { resize(); init(); }

  resize();
  init();
  loop();

  window.addEventListener('resize', onResize);
  window.addEventListener('load',   onResize);
})();

// ===================== UI: AOS, SCROLL-TO-TOP, NAV =====================
AOS.init({ duration: 1000, once: false, offset: 100 });
  window.addEventListener('scroll', function() { AOS.refresh(); });

  const scrollBtn = document.querySelector('.scroll-to-top');
  window.addEventListener('scroll', function() {
    scrollBtn.classList.toggle('visible', window.scrollY > 500);
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const id = this.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    });
  });

  const nav = document.querySelector('.nav-menu');
  window.addEventListener('scroll', function() {
    nav.style.boxShadow = window.scrollY > 100 ? '0 5px 20px rgba(0,0,0,0.5)' : 'none';
  });

// ===================== SISTEMA DE PESQUISA =====================
(function () {
  const PROJECTS_JSON = 'projects.json';
  const grid       = document.getElementById('projectsGrid');
  const input      = document.getElementById('searchInput');
  const clearBtn   = document.getElementById('searchClear');
  const meta       = document.getElementById('searchMeta');
  const emptyState = document.getElementById('emptyState');
  const emptyReset = document.getElementById('emptyReset');

  let allProjects  = [];
  let debounceTimer;

  // ── Escapa HTML para segurança ───────────────────────────────
  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Cria um card (começa invisível) ─────────────────────────
  function buildCard(p) {
    const tags = p.tags.map(t => '<span class="tech-tag">' + esc(t) + '</span>').join('');
    const div  = document.createElement('div');
    div.className = 'card card-appear';
    div.innerHTML =
      '<a href="' + esc(p.url) + '" class="card-link">' +
        '<img src="' + esc(p.imagem) + '" alt="' + esc(p.alt || p.nome) + '" loading="lazy">' +
        '<div class="content">' +
          '<h3>' + esc(p.nome) + '</h3>' +
          '<p>' + esc(p.descricao) + '</p>' +
          '<div class="tech-tags">' + tags + '</div>' +
          '<div class="btn-saber-mais">Saber mais <i class="fas fa-arrow-right"></i></div>' +
        '</div>' +
      '</a>';
    return div;
  }

  // ── Renderiza: insere todos os cards e anima ao entrar na viewport
  var cardObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  function renderCards(projects) {
    grid.innerHTML = '';

    if (projects.length === 0) {
      emptyState.classList.add('visible');
      return;
    }
    emptyState.classList.remove('visible');

    projects.forEach(function(p) {
      var card = buildCard(p);
      grid.appendChild(card);
      cardObserver.observe(card);
    });
  }

  // ── Contador de resultados ───────────────────────────────────
  function updateMeta(found, total) {
    if (!input.value.trim()) {
      meta.innerHTML = '<span>' + total + '</span> projetos no portfólio';
    } else if (found === 0) {
      meta.innerHTML = 'Nenhum resultado para "<span>' + esc(input.value.trim()) + '</span>"';
    } else {
      meta.innerHTML = '<span>' + found + '</span> de ' + total + ' projetos encontrados';
    }
  }

  // ── Filtro com normalização de acentos ───────────────────────
  function normalize(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function filterProjects(term) {
    if (!term) return allProjects;
    const q = normalize(term);
    return allProjects.filter(p =>
      normalize(p.nome + ' ' + p.descricao + ' ' + p.tags.join(' ')).includes(q)
    );
  }

  // ── Carrega o JSON ───────────────────────────────────────────
  fetch(PROJECTS_JSON)
    .then(r => {
      if (!r.ok) throw new Error('Erro ' + r.status);
      return r.json();
    })
    .then(data => {
      allProjects = data;
      renderCards(allProjects);
      updateMeta(allProjects.length, allProjects.length);
    })
    .catch(err => {
      grid.innerHTML =
        '<p style="text-align:center;color:#ef4444;grid-column:1/-1;padding:40px 0">' +
        'Erro ao carregar projetos: ' + esc(err.message) + '</p>';
    });

  // ── Input com debounce ───────────────────────────────────────
  input.addEventListener('input', function () {
    const term = this.value.trim();
    clearBtn.classList.toggle('visible', term.length > 0);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      const results = filterProjects(term);
      renderCards(results);
      updateMeta(results.length, allProjects.length);
    }, 180);
  });

  // ── Limpar pesquisa ──────────────────────────────────────────
  function clearSearch() {
    input.value = '';
    input.focus();
    clearBtn.classList.remove('visible');
    renderCards(allProjects);
    updateMeta(allProjects.length, allProjects.length);
  }
  clearBtn.addEventListener('click', clearSearch);
  emptyReset.addEventListener('click', clearSearch);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') clearSearch();
  });
})();

// ===================== POPUP =====================
(function () {
  const overlay  = document.getElementById('testPopup');
  const closeBtn = document.getElementById('popupClose');

  function hidePopup() {
    overlay.classList.add('hiding');
    overlay.addEventListener('animationend', function () {
      overlay.style.display = 'none';
    }, { once: true });
  }

  closeBtn.addEventListener('click', hidePopup);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) hidePopup();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hidePopup();
  });
})();