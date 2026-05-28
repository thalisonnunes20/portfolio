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
})();