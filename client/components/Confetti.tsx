import { useEffect, useRef } from "react";

export default function Confetti({ trigger } : { trigger: number }){
  const cvsRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(()=>{
    if(!cvsRef.current) return;
    const c = cvsRef.current; const ctx = c.getContext('2d'); if(!ctx) return;
    let w = c.width = innerWidth; let h = c.height = innerHeight;
    let particles: any[] = [];
    function rand(a:number,b:number){return a+Math.random()*(b-a)}
    function spawn(){ for(let i=0;i<150;i++){ particles.push({x:rand(0,w),y:rand(-h,0),vx:rand(-3,3),vy:rand(2,8),rot:rand(0,360),size:rand(4,10),color:`hsl(${Math.floor(rand(260,320))} 90% ${rand(45,65)}%)`}) } }
    spawn();
    let raf=0;
    function frame(){ ctx.clearRect(0,0,w,h); for(const p of particles){ p.x+=p.vx; p.y+=p.vy; p.vy+=0.05; ctx.fillStyle=p.color; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180); ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size); ctx.restore(); } particles = particles.filter(p=>p.y < h+50); if(particles.length===0){ cancelAnimationFrame(raf); c.remove(); return; } raf=requestAnimationFrame(frame); }
    frame();
    const onResize=()=>{ w=c.width=innerWidth; h=c.height=innerHeight; }
    addEventListener('resize', onResize);
    return ()=>{ removeEventListener('resize', onResize); cancelAnimationFrame(raf); }
  },[trigger]);
  return <canvas className="confetti-canvas" ref={cvsRef} />;
}
