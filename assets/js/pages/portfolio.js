AOS.init({duration:1000,once:true,offset:100});

// Funcionalidade das abas de documentação — sem travamento
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns     = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    let   iframeLoaded = false;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId     = btn.getAttribute('data-tab');
            const nextContent = document.getElementById('tab-' + tabId);
            if (!nextContent || btn.classList.contains('active')) return;

            // Bateia todas as mudanças de DOM em um único frame
            requestAnimationFrame(() => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                nextContent.classList.add('active');

                // Carrega o iframe SOMENTE na primeira vez que a aba Versões é aberta
                if (tabId === 'versoes' && !iframeLoaded) {
                    iframeLoaded = true;
                    const iframe = document.getElementById('versao-iframe');
                    if (iframe) {
                        // Mostra fallback enquanto carrega
                        const fallback = document.getElementById('versao-fallback');
                        if (fallback) fallback.style.display = 'flex';

                        iframe.onload = () => {
                            if (fallback) fallback.style.display = 'none';
                        };
                        iframe.onerror = () => {
                            if (fallback) fallback.style.display = 'flex';
                        };
                        // Injeta src somente agora (evita bloqueio no carregamento da página)
                        iframe.src = 'https://old.tsnunes.com.br/';
                    }
                }
            });
        });
    });
});

// === CONFIGURAÇÃO - EDITE APENAS ESTA PARTE ===
const SEU_USUARIO = "thalisonnunes20";      // ← SEU usuário do GitHub
const SEU_REPOSITORIO = "portfolio"; // ← SEU repositório
// === FIM DA CONFIGURAÇÃO ===

// Quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const card = document.getElementById('github-content');
    const link = document.getElementById('github-link');
    const btnText = document.getElementById('btn-text');
    
    // Se não configurado, mostrar mensagem
    if (!SEU_USUARIO || !SEU_REPOSITORIO) {
        card.innerHTML = `
            <div style="text-align: center;">
                <i class="fab fa-github" style="font-size: 3rem; color: #8b949e;"></i>
                <p style="color: #8b949e; margin-top: 15px;">
                    Configure seu usuário e repositório<br>
                    nas variáveis JavaScript
                </p>
            </div>
        `;
        
        link.href = "https://github.com";
        btnText.textContent = "Visitar GitHub";
        return;
    }
    
    // URL para a API do GitHub
    const apiUrl = `https://api.github.com/repos/${SEU_USUARIO}/${SEU_REPOSITORIO}`;
    
    // Busca informações do repositório
    fetch(apiUrl)
        .then(resposta => resposta.json())
        .then(dados => {
            // Atualiza o conteúdo do card
            card.innerHTML = `
                <div style="text-align: left;">
                    <h4 style="color: #f0f6fc; margin-bottom: 10px;">
                        ${dados.name || SEU_REPOSITORIO}
                    </h4>
                    <p style="color: #8b949e; margin-bottom: 15px;">
                        ${dados.description || 'Repositório do projeto Nginx Proxy Manager'}
                    </p>
                    
                    <div style="display: flex; gap: 20px; margin-top: 20px;">
                        <div style="text-align: center;">
                            <div style="color: #f0f6fc; font-size: 1.5rem; font-weight: bold;">
                                ${dados.stargazers_count || '0'}
                            </div>
                            <div style="color: #8b949e; font-size: 0.9rem;">
                                <i class="fas fa-star"></i> Stars
                            </div>
                        </div>
                        
                        <div style="text-align: center;">
                            <div style="color: #f0f6fc; font-size: 1.5rem; font-weight: bold;">
                                ${dados.forks_count || '0'}
                            </div>
                            <div style="color: #8b949e; font-size: 0.9rem;">
                                <i class="fas fa-code-branch"></i> Forks
                            </div>
                        </div>
                        
                        <div style="text-align: center;">
                            <div style="color: #f0f6fc; font-size: 1.5rem; font-weight: bold;">
                                ${dados.size ? (dados.size / 1024).toFixed(1) : '0'} MB
                            </div>
                            <div style="color: #8b949e; font-size: 0.9rem;">
                                <i class="fas fa-database"></i> Tamanho
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #30363d;">
                        <small style="color: #8b949e;">
                            <i class="far fa-clock"></i> 
                            Última atualização: ${new Date(dados.updated_at).toLocaleDateString('pt-BR')}
                        </small>
                    </div>
                </div>
            `;
            
            // Atualiza o link do botão
            link.href = dados.html_url || `https://github.com/${SEU_USUARIO}/${SEU_REPOSITORIO}`;
            btnText.textContent = `Ver ${dados.name || SEU_REPOSITORIO}`;
            
        })
        .catch(erro => {
            // Se der erro (repositório privado ou não existe)
            card.innerHTML = `
                <div style="text-align: center;">
                    <i class="fab fa-github" style="font-size: 3rem; color: #8b949e;"></i>
                    <p style="color: #8b949e; margin-top: 15px;">
                        <strong>${SEU_REPOSITORIO}</strong><br>
                        Repositório privado ou não encontrado
                    </p>
                </div>
            `;
            
            // Link padrão do GitHub
            link.href = `https://github.com/${SEU_USUARIO}`;
            btnText.textContent = "Ver perfil no GitHub";
            
            console.log("Erro ao carregar API:", erro);
        });
});

// ===================== CARREGAMENTO SOB DEMANDA DA GALERIA =====================
(function() {
    let galeriaCarregada = false;
    const abaGaleria = document.querySelector('.tab-btn[data-tab="galeria"]');
    const containerGaleria = document.getElementById('galeria-container');

    function carregarImagensGaleria() {
        if (galeriaCarregada || !containerGaleria) return;
        
        const itens = containerGaleria.querySelectorAll('.galeria-item[data-img-src]');
        itens.forEach(item => {
            const src = item.getAttribute('data-img-src');
            const alt = item.getAttribute('data-img-alt') || 'Imagem do projeto';
            const placeholder = item.querySelector('.galeria-placeholder');
            
            if (placeholder && src) {
                // Cria a tag img real com atributos otimizados
                const img = document.createElement('img');
                img.src = src;
                img.alt = alt;
                img.loading = 'lazy';
                img.decoding = 'async';
                img.style.width = '100%';
                img.style.height = '200px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '0';
                
                // Substitui o placeholder
                placeholder.parentNode.insertBefore(img, placeholder);
                placeholder.remove();
                
                // Remove o atributo data-img-src para não recarregar
                item.removeAttribute('data-img-src');
            }
        });
        galeriaCarregada = true;
    }

    // Quando clicar na aba "Galeria", carrega as imagens
    if (abaGaleria) {
        abaGaleria.addEventListener('click', function() {
            carregarImagensGaleria();
        });
    }

    // Se a galeria já estiver ativa por algum motivo (ex: página recarregada com a aba ativa)
    if (document.getElementById('tab-galeria') && document.getElementById('tab-galeria').classList.contains('active')) {
        carregarImagensGaleria();
    }
})();

// Funcionalidade da galeria (TELA CHEIA COM IMAGEM AJUSTADA)
document.addEventListener('DOMContentLoaded', function() {
    // Observa a galeria container para quando as imagens forem carregadas dinamicamente
    const containerGaleria = document.getElementById('galeria-container');
    const modal = document.getElementById('modal-galeria');
    const modalImg = document.getElementById('modal-imagem');
    const modalFechar = document.getElementById('modal-fechar');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    
    let imagensAtuais = []; // Array para armazenar as imagens carregadas
    let indiceAtual = 0;
    
    function atualizarGaleriaModal() {
        // Coleta todas as imagens que estão dentro da galeria (após carregamento)
        const galeriaItens = containerGaleria ? containerGaleria.querySelectorAll('.galeria-item img') : [];
        imagensAtuais = Array.from(galeriaItens);
        
        // Remove listeners antigos e adiciona novos
        imagensAtuais.forEach((img, index) => {
            // Remove eventos antigos para evitar duplicidade
            img.removeEventListener('click', img.clickHandler);
            // Adiciona novo evento
            img.clickHandler = () => {
                indiceAtual = index;
                modalImg.src = img.src;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                ajustarImagemNoModal();
            };
            img.addEventListener('click', img.clickHandler);
        });
    }
    
    function ajustarImagemNoModal() {
        const larguraTela = window.innerWidth;
        if (larguraTela < 480) {
            modalImg.style.maxWidth = '100%';
            modalImg.style.maxHeight = '80vh';
        } else if (larguraTela < 768) {
            modalImg.style.maxWidth = '95%';
            modalImg.style.maxHeight = '85vh';
        } else {
            modalImg.style.maxWidth = '90%';
            modalImg.style.maxHeight = '90vh';
        }
    }
    
    // Observa mudanças no container da galeria (quando imagens são inseridas)
    if (containerGaleria) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'subtree') {
                    atualizarGaleriaModal();
                }
            });
        });
        observer.observe(containerGaleria, { childList: true, subtree: true });
        // Executa uma vez para caso já tenha imagens
        atualizarGaleriaModal();
    }
    
    // Reajustar imagem quando redimensionar a janela
    window.addEventListener('resize', function() {
        if (modal.style.display === 'block') {
            ajustarImagemNoModal();
        }
    });
    
    // Fechar modal
    modalFechar.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    modalPrev.addEventListener('click', () => {
        if (imagensAtuais.length === 0) return;
        indiceAtual = (indiceAtual - 1 + imagensAtuais.length) % imagensAtuais.length;
        modalImg.src = imagensAtuais[indiceAtual].src;
        ajustarImagemNoModal();
    });
    
    modalNext.addEventListener('click', () => {
        if (imagensAtuais.length === 0) return;
        indiceAtual = (indiceAtual + 1) % imagensAtuais.length;
        modalImg.src = imagensAtuais[indiceAtual].src;
        ajustarImagemNoModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') modalPrev.click();
            else if (e.key === 'ArrowRight') modalNext.click();
        }
    });
});

// Botão Voltar ao Topo
document.addEventListener('DOMContentLoaded', function() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

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