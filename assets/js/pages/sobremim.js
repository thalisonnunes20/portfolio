(function(){
  const canvas=document.getElementById('particles-canvas');
  const ctx=canvas.getContext('2d');
  const COLORS=[[56,189,248],[14,165,233],[99,102,241],[148,163,184],[186,230,253],[96,165,250]];
  const COUNT=90;
  let W,H,particles=[];
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  function rand(a,b){return Math.random()*(b-a)+a;}
  function randInt(a,b){return Math.floor(rand(a,b+0.999));}
  class Particle{
    constructor(init){this.spawn(init);}
    spawn(init){const c=COLORS[randInt(0,COLORS.length-1)];this.r=c[0];this.g=c[1];this.b=c[2];this.x=rand(0,W);this.y=init?rand(0,H):H+5;this.sz=rand(0.6,2.8);this.vx=rand(-0.3,0.3);this.vy=rand(-0.55,-0.08);this.phase=rand(0,Math.PI*2);this.phaseSpeed=rand(0.018,0.055);this.glow=Math.random()<0.28;this.glowR=this.sz*rand(5,9);}
    update(){this.x+=this.vx;this.y+=this.vy;this.phase+=this.phaseSpeed;if(this.y<-12||this.x<-12||this.x>W+12)this.spawn(false);}
    draw(){const a=0.3+0.65*Math.abs(Math.sin(this.phase));ctx.save();if(this.glow){const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.glowR);g.addColorStop(0,`rgba(${this.r},${this.g},${this.b},${(a*0.55).toFixed(2)})`);g.addColorStop(1,`rgba(${this.r},${this.g},${this.b},0)`);ctx.beginPath();ctx.arc(this.x,this.y,this.glowR,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();}ctx.beginPath();ctx.arc(this.x,this.y,this.sz,0,Math.PI*2);ctx.fillStyle=`rgba(${this.r},${this.g},${this.b},${a.toFixed(2)})`;ctx.fill();ctx.restore();}
  }
  function init(){particles=[];for(let i=0;i<COUNT;i++)particles.push(new Particle(true));}
  function loop(){ctx.clearRect(0,0,W,H);particles.forEach(p=>{p.update();p.draw();});requestAnimationFrame(loop);}
  function onResize(){resize();init();}
  resize();init();loop();
  window.addEventListener('resize',onResize);
  window.addEventListener('load',onResize);
})();

(function(){
  const fills = document.querySelectorAll('.skill-bar-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.style.width = e.target.dataset.width + '%';
        observer.unobserve(e.target);
      }
    });
  }, {threshold: 0.3});
  fills.forEach(f => observer.observe(f));
})();

(function(){
  const modal = document.getElementById('modal-lightbox');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const btnClose = document.getElementById('modal-close');
  const btnPrev = document.getElementById('modal-prev');
  const btnNext = document.getElementById('modal-next');
  let items = [];
  let idx = 0;

  function getItems(){
    return [...document.querySelectorAll('#cert-galeria .formacao-card[data-img]')].filter(el => el.dataset.img && el.dataset.img.length > 0);
  }

  function open(i){
    items = getItems();
    if(!items.length) return;
    idx = i;
    show();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function show(){
    const el = items[idx];
    modalImg.src = el.dataset.img;
    modalCaption.textContent = el.dataset.caption || '';
    btnPrev.style.display = items.length > 1 ? 'flex' : 'none';
    btnNext.style.display = items.length > 1 ? 'flex' : 'none';
  }

  function close(){
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  document.getElementById('cert-galeria').addEventListener('click', e => {
    const item = e.target.closest('.formacao-card[data-img]');
    if(!item || !item.dataset.img) return;
    items = getItems();
    open(items.indexOf(item));
  });

  btnClose.addEventListener('click', close);
  modal.addEventListener('click', e => { if(e.target === modal || e.target === document.querySelector('.modal-content-wrap')) close(); });
  btnPrev.addEventListener('click', () => { idx = (idx - 1 + items.length) % items.length; show(); });
  btnNext.addEventListener('click', () => { idx = (idx + 1) % items.length; show(); });
  document.addEventListener('keydown', e => {
    if(modal.style.display !== 'block') return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') { idx = (idx - 1 + items.length) % items.length; show(); }
    if(e.key === 'ArrowRight') { idx = (idx + 1) % items.length; show(); }
  });
})();

AOS.init({duration:900, once:true, offset:80});
const scrollBtn = document.getElementById('scroll-to-top');
window.addEventListener('scroll', () => scrollBtn.classList.toggle('visible', window.scrollY > 500));
scrollBtn.addEventListener('click', e => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); });

/* ===== TEAM DATA ===== */
(function(){
  const MEMBERS = [
    {
      name: "Felipe Gomes da Silva",
      role: "Desenvolvedor Back End",
      photo: "/assets/images/felipe.jpeg", // URL da foto — deixe vazio para placeholder
      location: "Itu, SP",
      github: "https://github.com/felipegomes12",   // preencha com o usuário real
      linkedin: "https://www.linkedin.com/in/felipe-gomes-da-silva-48255127a/", // preencha com o usuário real
      bio: "Sou apaixonado por tecnologia e desenvolvimento, com foco em criar soluções práticas e eficientes usando Python, Django, JavaScript e automações para servidores Linux. Tenho experiência com integração de APIs, otimização de sistemas e infraestrutura web, além de gostar de explorar novas tecnologias, games e emulação. Busco sempre aprender mais e transformar ideias em projetos funcionais e bem estruturados.",
      skills: ["Python", "Django", "JavaScript", "Linux / Ubuntu Server", "APIs REST", "MySQL"],
      exp: [
        {
          cargo: "Desenvolvedor Full Stack",
          empresa: "AutoEquip",
          periodo: "2023-2025",
          desc: "Atuação como desenvolvedor Full Stack e suporte técnico, realizando desenvolvimento e manutenção de sistemas web, integração de APIs, gerenciamento de banco de dados e infraestrutura Linux. Responsável também pelo suporte aos usuários, resolução de problemas técnicos, monitoramento de serviços e otimização de processos internos."
        },
        // {
        //   cargo: "Técnico de TI",
        //   empresa: "Outra Empresa",
        //   periodo: "2019 – 2022",
        //   desc: "Suporte técnico nível 1 e 2, configuração de estações de trabalho e auxílio na migração de ambientes para nuvem."
        // }
      ]
    },
    {
      name: "Maria Costa",
      role: "Desenvolvedora Full Stack",
      photo: "",
      location: "São Paulo, SP",
      github: "",
      linkedin: "",
      bio: "Desenvolvedora apaixonada por construir interfaces modernas e APIs robustas, sempre com foco na experiência do usuário. Tem forte senso estético e gosta de trabalhar em projetos que unem design e performance.",
      skills: ["React", "Node.js", "Python", "PostgreSQL", "TypeScript", "Tailwind CSS"],
      exp: [
        {
          cargo: "Desenvolvedora Full Stack",
          empresa: "Startup X",
          periodo: "2023 – Atual",
          desc: "Desenvolvimento de aplicações web completas utilizando React no front-end e Node.js no back-end, com banco de dados PostgreSQL e deploy em ambientes containerizados."
        },
        {
          cargo: "Desenvolvedora Front-end",
          empresa: "Agência Y",
          periodo: "2021 – 2023",
          desc: "Criação de landing pages e sistemas de gestão interna para clientes de diversos segmentos."
        }
      ]
    },
    {
      name: "Carlos Moreira",
      role: "Especialista em Redes",
      photo: "",
      location: "Rio Grande, RS",
      github: "",
      linkedin: "",
      bio: "Especialista em arquitetura de redes corporativas com foco em segurança e desempenho. Tem experiência em ambientes de médio e grande porte, com expertise em firewalls, VLANs e soluções de VPN site-to-site.",
      skills: ["pfSense", "Cisco", "VPN", "VLAN", "Switching", "WireGuard", "Zabbix"],
      exp: [
        {
          cargo: "Especialista em Redes",
          empresa: "Empresa Exemplo Ltda",
          periodo: "2021 – Atual",
          desc: "Projeto e manutenção de redes corporativas com switches gerenciáveis, implementação de VLANs, políticas de QoS e firewall pfSense para controle de acesso."
        },
        {
          cargo: "Técnico de Redes",
          empresa: "ISP Regional",
          periodo: "2018 – 2021",
          desc: "Configuração e troubleshooting de links de internet, roteamento BGP e suporte a clientes corporativos."
        }
      ]
    },
    {
      name: "Ana Ribeiro",
      role: "Analista de Segurança",
      photo: "",
      location: "Curitiba, PR",
      github: "",
      linkedin: "",
      bio: "Profissional de cybersecurity com foco em análise de vulnerabilidades, monitoramento de ameaças e implementação de políticas de segurança da informação. Acredita que a segurança deve ser parte do processo desde o início — não um complemento.",
      skills: ["Pentest", "SIEM", "ISO 27001", "OWASP", "Nmap", "Metasploit", "Python"],
      exp: [
        {
          cargo: "Analista de Segurança",
          empresa: "Empresa Exemplo Ltda",
          periodo: "2022 – Atual",
          desc: "Realização de testes de penetração internos, análise de logs com ferramentas SIEM e criação de relatórios de conformidade com ISO 27001."
        },
        {
          cargo: "Analista de SOC Jr.",
          empresa: "Consultoria Z",
          periodo: "2020 – 2022",
          desc: "Monitoramento de eventos de segurança, resposta a incidentes e triagem de alertas em ambiente 24/7."
        }
      ]
    }
  ];

  const modal      = document.getElementById('team-modal');
  const btnClose   = document.getElementById('team-modal-close');
  const tmPhoto    = document.getElementById('tm-photo');
  const tmPhotoImg = document.getElementById('tm-photo-img');
  const tmPhotoIcon= document.getElementById('tm-photo-icon');
  const tmPhotoHint= document.getElementById('tm-photo-hint');
  const tmName     = document.getElementById('tm-name');
  const tmRole     = document.getElementById('tm-role');
  const tmLocText  = document.getElementById('tm-location-text');
  const tmBody     = document.getElementById('tm-body');

  const tmSocials  = document.getElementById('tm-socials');

  function buildBody(m){
    let expHTML = m.exp.map(e => `
      <div class="team-modal-titem">
        <div class="team-modal-tcargo">${e.cargo}</div>
        <div class="team-modal-tempresa"><i class="fas fa-building"></i>${e.empresa}</div>
        <span class="team-modal-tperiodo">${e.periodo}</span>
        <div class="team-modal-tdesc">${e.desc}</div>
      </div>`).join('');

    let skillsHTML = m.skills.map(s => `<span class="team-modal-skill">${s}</span>`).join('');

    return `
      <div class="team-modal-sub"><i class="fas fa-user-circle"></i> Sobre</div>
      <div class="team-modal-bio">${m.bio}</div>

      <div class="team-modal-sub"><i class="fas fa-code"></i> Competências</div>
      <div class="team-modal-skills">${skillsHTML}</div>

      <div class="team-modal-sub"><i class="fas fa-briefcase"></i> Experiência</div>
      <div class="team-modal-timeline">${expHTML}</div>
    `;
  }

  let _scrollY = 0;

  function openModal(idx){
    const m = MEMBERS[idx];
    if(!m) return;

    tmName.textContent     = m.name;
    tmRole.textContent     = m.role;
    tmLocText.textContent  = m.location;
    tmBody.innerHTML       = buildBody(m);

    // Ícones sociais no modal
    let socialsHTML = '';
    if(m.github)  socialsHTML += `<a href="${m.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>`;
    if(m.linkedin) socialsHTML += `<a href="${m.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`;
    tmSocials.innerHTML = socialsHTML;

    // foto
    if(m.photo){
      tmPhotoImg.src          = m.photo;
      tmPhotoImg.style.display= 'block';
      tmPhotoIcon.style.display= 'none';
      tmPhotoHint.style.display= 'none';
    } else {
      tmPhotoImg.style.display = 'none';
      tmPhotoIcon.style.display= '';
      tmPhotoHint.style.display= '';
    }

    // trava o scroll sem mover a página
    _scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${_scrollY}px`;
    document.body.style.width    = '100%';

    modal.classList.add('open');
  }

  function closeModal(){
    modal.classList.remove('open');
    // restaura posição exata do scroll
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    window.scrollTo(0, _scrollY);
  }

  // Delegação de clique nos cards
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.member, 10);
      openModal(idx);
    });
  });

  btnClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if(e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();