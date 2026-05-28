// ===================== AOS INIT =====================
AOS.init({duration:1000,once:true,offset:100});

// ===================== TABS DE DOCUMENTAÇÃO =====================
// Funcionalidade das abas de documentação (sem ajuste de altura)
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            const tabContent = document.getElementById(`tab-${tabId}`);
            if (tabContent) tabContent.classList.add('active');
        });
    });
});

// ===================== GITHUB CARD =====================
// Usa as variáveis SEU_USUARIO e SEU_REPOSITORIO definidas inline no HTML de cada página
// === CONFIGURAÇÃO GITHUB ===

document.addEventListener('DOMContentLoaded', function() {
    const card    = document.getElementById('github-content');
    const link    = document.getElementById('github-link');
    const btnText = document.getElementById('btn-text');

    if (!SEU_USUARIO || !SEU_REPOSITORIO) {
        card.innerHTML = `<div style="text-align:center;"><i class="fab fa-github" style="font-size:3rem;color:#8b949e;"></i><p style="color:#8b949e;margin-top:15px;">Configure seu usuário e repositório nas variáveis JavaScript</p></div>`;
        link.href = "https://github.com"; btnText.textContent = "Visitar GitHub"; return;
    }

    fetch(`https://api.github.com/repos/${SEU_USUARIO}/${SEU_REPOSITORIO}`)
        .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        })
        .then(dados => {
            if (dados.message) throw new Error(dados.message);
            card.innerHTML = `
                <div style="text-align:left;">
                    <h4 style="color:#f0f6fc;margin-bottom:10px;">${dados.name || SEU_REPOSITORIO}</h4>
                    <p style="color:#8b949e;margin-bottom:15px;">${dados.description || 'Sem descrição disponível'}</p>
                    <div style="display:flex;gap:20px;margin-top:20px;">
                        <div style="text-align:center;">
                            <div style="color:#f0f6fc;font-size:1.5rem;font-weight:bold;">${dados.stargazers_count || '0'}</div>
                            <div style="color:#8b949e;font-size:0.9rem;"><i class="fas fa-star"></i> Stars</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="color:#f0f6fc;font-size:1.5rem;font-weight:bold;">${dados.forks_count || '0'}</div>
                            <div style="color:#8b949e;font-size:0.9rem;"><i class="fas fa-code-branch"></i> Forks</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="color:#f0f6fc;font-size:1.5rem;font-weight:bold;">${dados.size ? (dados.size/1024).toFixed(1) : '0'} MB</div>
                            <div style="color:#8b949e;font-size:0.9rem;"><i class="fas fa-database"></i> Tamanho</div>
                        </div>
                    </div>
                    <div style="margin-top:20px;padding-top:15px;border-top:1px solid #30363d;">
                        <small style="color:#8b949e;"><i class="far fa-clock"></i> Última atualização: ${new Date(dados.updated_at).toLocaleDateString('pt-BR')}</small>
                    </div>
                </div>`;
            link.href = dados.html_url || `https://github.com/${SEU_USUARIO}/${SEU_REPOSITORIO}`;
            btnText.textContent = `Ver ${dados.name || SEU_REPOSITORIO}`;
        })
        .catch(err => {
            const isRateLimit = err.message && err.message.toLowerCase().includes('rate limit');
            const msg = isRateLimit
                ? 'Limite de requisições da API GitHub atingido. Tente novamente em alguns minutos.'
                : `Repositório <strong>${SEU_REPOSITORIO}</strong> privado ou não encontrado.`;
            card.innerHTML = `<div style="text-align:center;"><i class="fab fa-github" style="font-size:3rem;color:#8b949e;"></i><p style="color:#8b949e;margin-top:15px;">${msg}</p></div>`;
            link.href = `https://github.com/${SEU_USUARIO}`;
            btnText.textContent = "Ver perfil no GitHub";
        });
});

// ===================== GALERIA MODAL (LIGHTBOX) =====================
// Galeria modal
document.addEventListener('DOMContentLoaded', function() {
    const galeriaItens = document.querySelectorAll('.galeria-item img');
    const modal        = document.getElementById('modal-galeria');
    const modalImg     = document.getElementById('modal-imagem');
    const modalFechar  = document.getElementById('modal-fechar');
    const modalPrev    = document.getElementById('modal-prev');
    const modalNext    = document.getElementById('modal-next');
    let indiceAtual = 0;

    function ajustar() {
        const w = window.innerWidth;
        modalImg.style.maxWidth  = w < 480 ? '100%' : w < 768 ? '95%' : '90%';
        modalImg.style.maxHeight = w < 480 ? '80vh' : w < 768 ? '85vh' : '90vh';
    }

    galeriaItens.forEach((img, index) => {
        img.addEventListener('click', () => {
            indiceAtual = index;
            modalImg.src = img.src;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            modalImg.onload = ajustar;
            if (modalImg.complete) ajustar();
        });
    });

    window.addEventListener('resize', () => { if (modal.style.display === 'block') ajustar(); });
    modalFechar.addEventListener('click', () => { modal.style.display = 'none'; document.body.style.overflow = 'auto'; });
    modal.addEventListener('click', e => { if (e.target === modal) { modal.style.display = 'none'; document.body.style.overflow = 'auto'; } });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.style.display === 'block') { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') { indiceAtual = (indiceAtual - 1 + galeriaItens.length) % galeriaItens.length; modalImg.src = galeriaItens[indiceAtual].src; ajustar(); }
            if (e.key === 'ArrowRight') { indiceAtual = (indiceAtual + 1) % galeriaItens.length; modalImg.src = galeriaItens[indiceAtual].src; ajustar(); }
        }
    });
    modalPrev.addEventListener('click', () => { indiceAtual = (indiceAtual - 1 + galeriaItens.length) % galeriaItens.length; modalImg.src = galeriaItens[indiceAtual].src; ajustar(); });
    modalNext.addEventListener('click', () => { indiceAtual = (indiceAtual + 1) % galeriaItens.length; modalImg.src = galeriaItens[indiceAtual].src; ajustar(); });
});

// ===================== BOTÃO VOLTAR AO TOPO =====================
// Botão Voltar ao Topo
document.addEventListener('DOMContentLoaded', function() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    window.addEventListener('scroll', () => scrollBtn.classList.toggle('visible', window.scrollY > 500));
    scrollBtn.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
});

// ===================== PARTÍCULAS GLOBAIS =====================
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  const COLORS = [
    [56,189,248],[14,165,233],[99,102,241],[148,163,184],[186,230,253],[96,165,250]
  ];
  const COUNT = 160;
  let W, H, particles = [];
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function rand(a,b){ return Math.random()*(b-a)+a; }
  function randInt(a,b){ return Math.floor(rand(a,b+0.999)); }
  class Particle {
    constructor(initial){ this.spawn(initial); }
    spawn(initial){
      const c = COLORS[randInt(0,COLORS.length-1)];
      this.r=c[0];this.g=c[1];this.b=c[2];
      this.x=rand(0,W); this.y=initial?rand(0,H):H+5;
      this.sz=rand(0.6,2.8); this.vx=rand(-0.3,0.3); this.vy=rand(-0.55,-0.08);
      this.phase=rand(0,Math.PI*2); this.phaseSpeed=rand(0.018,0.055);
      this.glow=Math.random()<0.28; this.glowR=this.sz*rand(5,9);
    }
    update(){
      this.x+=this.vx; this.y+=this.vy; this.phase+=this.phaseSpeed;
      if(this.y<-12||this.x<-12||this.x>W+12){ this.spawn(false); }
    }
    draw(){
      const a=0.3+0.65*Math.abs(Math.sin(this.phase));
      ctx.save();
      if(this.glow){
        const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.glowR);
        g.addColorStop(0,`rgba(${this.r},${this.g},${this.b},${(a*0.55).toFixed(2)})`);
        g.addColorStop(1,`rgba(${this.r},${this.g},${this.b},0)`);
        ctx.beginPath(); ctx.arc(this.x,this.y,this.glowR,0,Math.PI*2);
        ctx.fillStyle=g; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(this.x,this.y,this.sz,0,Math.PI*2);
      ctx.fillStyle=`rgba(${this.r},${this.g},${this.b},${a.toFixed(2)})`; ctx.fill();
      ctx.restore();
    }
  }
  function init(){ particles=[]; for(let i=0;i<COUNT;i++) particles.push(new Particle(true)); }
  function loop(){ ctx.clearRect(0,0,W,H); particles.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(loop); }
  function onResize(){ resize(); init(); }
  resize(); init(); loop();
  window.addEventListener('resize',onResize);
  window.addEventListener('load',onResize);
})();