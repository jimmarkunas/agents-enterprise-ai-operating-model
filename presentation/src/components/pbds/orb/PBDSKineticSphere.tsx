"use client";

import React, { useEffect, useMemo, useRef } from "react";

import { advanceOrbClock } from "./orbTiming";
import type { PBDSKineticSphereProps } from "./orbTypes";

type RGB = { r: number; g: number; b: number };
type LimbShape = { outer: number; mid: number; core: number; coreWidth: number };
type SurfaceStops = { bp: number[]; cols: RGB[]; hot: RGB; hotStart: number };
type LimbColors = { outer: { hex: string; rgb: string; raw: RGB }; mid: { hex: string; rgb: string; raw: RGB }; core: { hex: string; rgb: string; raw: RGB } };
type StippleDot = { bx:number; by:number; bz:number; x:number; y:number; z:number; vx:number; vy:number; vz:number; baseSize:number; phase:number };
type Plasma = { angle:number; distFactor:number; size:number; alpha:number; speed:number; radialVelocity:number; life:number; maxLife:number };
type OrbitalParticle = { angle:number; thickness:number; size:number; phase:number };
type OrbitalState = { ring:OrbitalParticle[]; bodies:OrbitalParticle[]; phase:number };
type VisibleDot = { sx:number; sy:number; z:number; size:number; color:string; alpha:number };

type OrbCenterInput = {
  width: number;
  height: number;
  radius: number;
  cropPosition: PBDSKineticSphereProps["cropPosition"];
  offsetX: number;
  offsetY: number;
};

/** Resolve the sphere against its measured host plane. Crop values intentionally preserve Phase 1 outputs. */
export function resolveOrbCenter({ width, height, radius, cropPosition, offsetX, offsetY }: OrbCenterInput) {
  let cx = width / 2;
  let cy = height / 2;
  if (cropPosition === "orb-right") cx = width + radius * 0.32;
  else if (cropPosition === "orb-left") cx = -radius * 0.32;
  else if (cropPosition === "orb-horizon") cy = height + radius * 0.45;
  return { cx: cx + offsetX, cy: cy + offsetY };
}

function hexToRgb(hex:string, fallback:RGB):RGB {
  let c=hex.replace("#","").trim();
  if(c.length===3)c=c.split("").map(x=>x+x).join("");
  const n=parseInt(c,16); if(Number.isNaN(n)) return fallback;
  return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
}
function lerpRgb(a:RGB,b:RGB,t:number):RGB { const q=Math.max(0,Math.min(1,t)); return {r:Math.round(a.r+(b.r-a.r)*q),g:Math.round(a.g+(b.g-a.g)*q),b:Math.round(a.b+(b.b-a.b)*q)}; }

function drawAtmosphericLimb(ctx:CanvasRenderingContext2D,cx:number,cy:number,radius:number,lightAngle:number,strokeMode:"crescent"|"tapered"|"full"|"none",intensity:number,glowSpread:number,coreHotness:number,strokeWidth:number,innerWash:number,shadowOpacity:number,glowHex:string,glowRgb:string,rawRgb:RGB,limb?:LimbColors,shape?:LimbShape){
  if(intensity<=0||strokeMode==="none")return;
  ctx.save(); ctx.globalAlpha=1;
  const outerHex=limb?.outer.hex??glowHex,outerRgb=limb?.outer.rgb??glowRgb,midHex=limb?.mid.hex??glowHex,midRgb=limb?.mid.rgb??glowRgb,coreHex=limb?.core.hex??glowHex,coreRgb=limb?.core.rgb??glowRgb;
  const hot=lerpRgb(limb?.core.raw??rawRgb,{r:255,g:255,b:255},coreHotness);
  const draw=(a0:number,a1:number,eff:number)=>{
    ctx.save();
    ctx.shadowColor=outerHex; ctx.shadowBlur=glowSpread*1.1; ctx.strokeStyle=`rgba(${outerRgb}, ${eff*.30})`; ctx.lineWidth=glowSpread*.65; ctx.beginPath(); ctx.arc(cx,cy,radius+glowSpread*.28,a0,a1); ctx.stroke();
    ctx.shadowColor=midHex; ctx.shadowBlur=glowSpread*.55; ctx.strokeStyle=`rgba(${midRgb}, ${eff*.52})`; ctx.lineWidth=glowSpread*.32; ctx.beginPath(); ctx.arc(cx,cy,radius+glowSpread*.1,a0,a1); ctx.stroke();
    ctx.shadowColor=coreHex; ctx.shadowBlur=10*intensity; ctx.strokeStyle=`rgba(${coreRgb}, ${eff*.78})`; ctx.lineWidth=Math.max(1.8,strokeWidth*2.2); ctx.beginPath(); ctx.arc(cx,cy,radius,a0,a1); ctx.stroke();
    ctx.shadowBlur=3*intensity; ctx.strokeStyle=`rgba(${hot.r}, ${hot.g}, ${hot.b}, ${eff*.98})`; ctx.lineWidth=strokeWidth; ctx.beginPath(); ctx.arc(cx,cy,radius,a0,a1); ctx.stroke();
    if(innerWash>0){ctx.shadowBlur=6*intensity;ctx.strokeStyle=`rgba(${glowRgb}, ${eff*.24*innerWash})`;ctx.lineWidth=glowSpread*.22;ctx.beginPath();ctx.arc(cx,cy,radius-glowSpread*.1,a0,a1);ctx.stroke();}
    ctx.restore();
  };
  if(strokeMode==="full"){draw(0,Math.PI*2,Math.min(1,intensity));}
  else if(shape){
    // Directional shaping: each pass follows its own crescent falloff cos^(1.35·focus), rescaled so its total energy
    // over the lit limb matches the default falloff (focus concentrates light at the lit peak rather than dimming it).
    // Each pass is one continuous arc whose alpha follows a conic gradient (no segment seams). Outer/mid/wash render
    // as shadow-only glows (stroke drawn off-canvas) so they read as atmosphere, not bands; the hot core is a filled
    // crescent whose thickness tapers with its own falloff.
    const N=180,cs:number[]=[];for(let i=0;i<=N;i++)cs.push(Math.cos((i/N)*Math.PI*2-lightAngle));
    const energy=(k:number)=>cs.reduce((t,c)=>c>0?t+Math.pow(c,k):t,0),base=energy(1.35);
    const gainOf=(focus:number)=>base/energy(1.35*focus),gO=gainOf(shape.outer),gM=gainOf(shape.mid),gC=gainOf(shape.core);
    const lv=(c:number,focus:number,g:number)=>c>0?Math.min(1,Math.pow(c,1.35*focus)*g*intensity):0;
    const conic=(rgb:string,focus:number,g:number,scale:number)=>{const gr=ctx.createConicGradient(0,cx,cy);cs.forEach((c,i)=>gr.addColorStop(i/N,`rgba(${rgb}, ${lv(c,focus,g)*scale})`));return gr;};
    // Shadow-only glows lose the stroke's own contribution; GLOW_COMP restores comparable atmospheric weight.
    const GLOW_COMP=2.2,glow=(hex:string,rgb:string,focus:number,g:number,scale:number,blur:number,width:number,r:number)=>{const off=4096;scale*=GLOW_COMP;ctx.save();ctx.translate(-off,0);ctx.shadowOffsetX=off;ctx.shadowColor=hex;ctx.shadowBlur=blur;ctx.strokeStyle=conic(rgb,focus,g,scale);ctx.lineWidth=width;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();ctx.restore();};
    const crescent=(rgb:string,hex:string,blur:number,width:number,scale:number)=>{ctx.save();ctx.shadowColor=hex;ctx.shadowBlur=blur;ctx.fillStyle=conic(rgb,shape.core,gC,scale);ctx.beginPath();
      const M=120,from=lightAngle-Math.PI/2,span=Math.PI,pts:number[][]=[];for(let i=0;i<=M;i++){const a=from+(i/M)*span,fc=Math.pow(Math.max(0,Math.cos(a-lightAngle)),1.35*shape.core),w=width*(1+(shape.coreWidth-1)*fc)*.5;pts.push([a,w]);}
      pts.forEach(([a,w],i)=>{const x=cx+Math.cos(a)*(radius+w),y=cy+Math.sin(a)*(radius+w);if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});
      for(let i=pts.length-1;i>=0;i--){const [a,w]=pts[i];ctx.lineTo(cx+Math.cos(a)*(radius-w),cy+Math.sin(a)*(radius-w));}
      ctx.closePath();ctx.fill();ctx.restore();};
    glow(outerHex,outerRgb,shape.outer,gO,.30,glowSpread*1.1,glowSpread*.65,radius+glowSpread*.28);
    glow(midHex,midRgb,shape.mid,gM,.52,glowSpread*.55,glowSpread*.32,radius+glowSpread*.1);
    crescent(coreRgb,coreHex,10*intensity,Math.max(1.8,strokeWidth*2.2),.78);
    crescent(`${hot.r}, ${hot.g}, ${hot.b}`,coreHex,3*intensity,strokeWidth,.98);
    if(innerWash>0)glow(outerHex,glowRgb,shape.outer,gO,.24*innerWash,6*intensity,glowSpread*.22,radius-glowSpread*.1);
  }
  else { const segments=80,d=(Math.PI*2)/segments; for(let i=0;i<segments;i++){const a0=i*d,a1=a0+d+.015,mid=a0+d*.5,c=Math.cos(mid-lightAngle);let alpha=c>0?Math.pow(c,1.35):(strokeMode==="tapered"?Math.max(.04,shadowOpacity):shadowOpacity);if(alpha<=.005)continue;draw(a0,a1,Math.min(1,alpha*intensity));} }
  ctx.restore();
}

type FieldCanvas = HTMLCanvasElement | OffscreenCanvas;
/**
 * Atmospheric limb field (experimental "field" mode): a smooth heat field around the sphere boundary instead of stroked
 * arcs. heat = radial edge profile × directional light term × intensity, mapped through a continuous
 * transparent → outer → mid → pale → hot color ramp. Static for a given orb geometry/light, so it is rendered once into a
 * tightly bounded offscreen canvas at full resolution and composited each frame.
 */
function buildAtmosphereField(width:number,height:number,cx:number,cy:number,radius:number,lightAngle:number,atmosphereWidth:number,focus:number,intensity:number,outer:RGB,mid:RGB,hot:RGB,innerWidth:number,innerIntensity:number,innerFocus:number,innerColor:RGB):{canvas:FieldCanvas;x:number;y:number}|null{
  const reach=Math.max(atmosphereWidth*3,innerWidth),x0=Math.max(0,Math.floor(cx-radius-reach)),x1=Math.min(width,Math.ceil(cx+radius+reach)),y0=Math.max(0,Math.floor(cy-radius-reach)),y1=Math.min(height,Math.ceil(cy+radius+reach)),w=x1-x0,h=y1-y0;
  if(w<=0||h<=0)return null;
  const canvas:FieldCanvas=typeof OffscreenCanvas!=="undefined"?new OffscreenCanvas(w,h):Object.assign(document.createElement("canvas"),{width:w,height:h});
  const fctx=canvas.getContext("2d") as CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D|null;if(!fctx)return null;
  const img=fctx.createImageData(w,h),data=img.data,lx=Math.cos(lightAngle),ly=Math.sin(lightAngle),aw=atmosphereWidth,core=aw*.2,pale=lerpRgb(mid,hot,.6);
  // Continuous heat→color ramp (heat, r, g, b, alpha), flattened so the per-pixel loop allocates nothing.
  const R=[0,outer.r,outer.g,outer.b,0, .2,outer.r,outer.g,outer.b,.35, .5,mid.r,mid.g,mid.b,.7, .8,pale.r,pale.g,pale.b,.9, 1,hot.r,hot.g,hot.b,1];
  const lightPow=focus/3.5,invOut=1/aw,invOutCore=1/core,invIn=1/(aw*.5),invInCore=1/(core*.5);
  const smooth=(t:number)=>{const q=Math.max(0,Math.min(1,t));return q*q*(3-2*q);};
  for(let j=0;j<h;j++){const dy=y0+j+.5-cy;for(let i=0;i<w;i++){
    const dx=x0+i+.5-cx,dist=Math.sqrt(dx*dx+dy*dy)||1,L=(dx*lx+dy*ly)/dist;if(L<=.4)continue;
    const d=dist-radius;
    if(d<0&&innerIntensity>0){
      const inside=radius-dist,edge=Math.pow(Math.max(0,1-inside/Math.max(1,innerWidth)),innerFocus),light=smooth((L-.4)/.54),heat=Math.min(1,edge*Math.pow(light,innerFocus)*innerIntensity);
      if(heat<.004)continue;
      const o=(j*w+i)*4;data[o]=innerColor.r;data[o+1]=innerColor.g;data[o+2]=innerColor.b;data[o+3]=heat*255;continue;
    }
    if(d<-aw*1.2||d>aw*3)continue; // outside these bands the field contributes < ~0.2%
    const u=d*(d>=0?invOut:invIn),v=d*(d>=0?invOutCore:invInCore),e=.55*Math.exp(-u*u)+.45*Math.exp(-v*v);
    let t=(L-.4)/.54;t=t>=1?1:t*t*(3-2*t);if(lightPow!==1)t=Math.pow(t,lightPow);
    const heat=Math.min(1,e*t*intensity);if(heat<.004)continue;
    let k=5;while(k<20&&heat>R[k])k+=5;const q=(heat-R[k-5])/(R[k]-R[k-5]),o=(j*w+i)*4;
    data[o]=R[k-4]+(R[k+1]-R[k-4])*q;data[o+1]=R[k-3]+(R[k+2]-R[k-3])*q;data[o+2]=R[k-2]+(R[k+3]-R[k-2])*q;data[o+3]=(R[k-1]+(R[k+4]-R[k-1])*q)*255;
  }}
  fctx.putImageData(img,0,0);return {canvas,x:x0,y:y0};
}

export const PBDSKineticSphere:React.FC<PBDSKineticSphereProps>=({
  initialMotion="settled",surfaceDensityScale=1,surfaceClipToSilhouette=false,
  radius=290,centerOffsetX=0,centerOffsetY=0,interactionMode="repel",interactionStrength=1,autoRotateSpeed=.0012,cropPosition="orb-right",skinStyle="canonical-magenta",accentColor,primaryDotColor="#FFFFFF",shadowDotColor,className="",interactive=true,plasmaNoiseIntensity=1,plasmaSpeed=1,stippleDensity=8000,ambientLuminance=.38,glowingStrokeIntensity=1.4,glowSpread=28,coreHotness=.85,innerWashIntensity=.35,dotHarmonization="unified",strokeMode="crescent",strokeShadowOpacity=0,strokeWidth=1,bodyOpacity=0,outerGlowColor,midGlowColor,hotCoreColor,solarFlareIntensity=1,outerGlowFocus=1,midGlowFocus=1,hotCoreFocus=1,hotCoreWidthMultiplier=1,atmosphereMode="stroke",atmosphereWidth=24,atmosphereFocus=3.5,atmosphereIntensity=1,innerGlowWidth=14,innerGlowIntensity=0,innerGlowColor="#FF78CB",innerGlowFocus=3.5,surfaceColorMode="legacy",surfaceShadowColor,surfaceDarkColor,surfaceMidColor,surfaceLightColor,surfaceHotColor,surfaceHotThreshold=.9,orbitalSystem,
})=>{
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const redrawOnInputRef=useRef<()=>void>(()=>{});
  const fieldRef=useRef<{key:string;field:ReturnType<typeof buildAtmosphereField>}|null>(null);
  const palette=useMemo(()=>{
    let active:string,fallback:RGB,shadow:string,bodyStart:string,bodyEnd:string;
    if(skinStyle==="obsidian-ice"){active=accentColor||"#38BDF8";fallback={r:56,g:189,b:248};shadow="#64748B";bodyStart="rgba(5, 9, 20, ";bodyEnd="rgba(12, 35, 60, ";}
    else if(skinStyle==="canonical-white"){active=accentColor||"#FFFFFF";fallback={r:230,g:240,b:255};shadow="#94A3B8";bodyStart="rgba(10, 13, 18, ";bodyEnd="rgba(51, 65, 85, ";}
    else if(skinStyle==="custom"){active=accentColor||"#38BDF8";fallback={r:56,g:189,b:248};shadow="#475569";bodyStart="rgba(8, 8, 12, ";bodyEnd=`rgba(${fallback.r}, ${fallback.g}, ${fallback.b}, `;}
    else {active=accentColor||"#FF2FAE";fallback={r:255,g:47,b:174};shadow="#C21882";bodyStart="rgba(10, 2, 8, ";bodyEnd="rgba(74, 6, 54, ";}
    const raw=hexToRgb(active,fallback),rgb=`${raw.r}, ${raw.g}, ${raw.b}`;
    const tone=(hex:string|undefined,fallbackRgb:RGB)=>{const c=hexToRgb(hex??"",fallbackRgb);return {hex:hex??active,rgb:`${c.r}, ${c.g}, ${c.b}`,raw:c};};
    const limb:LimbColors|undefined=outerGlowColor||midGlowColor||hotCoreColor?{outer:tone(outerGlowColor,raw),mid:tone(midGlowColor,raw),core:tone(hotCoreColor,raw)}:undefined;
    const surface:SurfaceStops|undefined=surfaceColorMode==="lit-gradient"?(()=>{
      const hotStart=Math.min(.98,Math.max(.3,surfaceHotThreshold));
      // shadow/dark/mid/light span the full non-hot range up to hotStart (no flat plateau before the hot
      // blend begins), so the transition into the rare hot highlight is continuous rather than a filled patch.
      return {bp:[0,hotStart*.35,hotStart*.68,hotStart],cols:[hexToRgb(surfaceShadowColor??"",raw),hexToRgb(surfaceDarkColor??"",raw),hexToRgb(surfaceMidColor??"",raw),hexToRgb(surfaceLightColor??"",raw)],hot:hexToRgb(surfaceHotColor??"",raw),hotStart};
    })():undefined;
    return {limb,surface,glowHex:active,glowRgb:rgb,rawRgb:raw,highlightDot:primaryDotColor&&primaryDotColor!=="#FFFFFF"?primaryDotColor:active,midDot:active,shadowDot:shadowDotColor||shadow,plasmaRgb:rgb,bodyGradStart:bodyStart,bodyGradEnd:bodyEnd};
  },[skinStyle,accentColor,primaryDotColor,shadowDotColor,outerGlowColor,midGlowColor,hotCoreColor,surfaceColorMode,surfaceShadowColor,surfaceDarkColor,surfaceMidColor,surfaceLightColor,surfaceHotColor,surfaceHotThreshold]);

  const mouseRef=useRef({x:-9999,y:-9999,prevX:-9999,prevY:-9999,isHovered:false,isDragging:false,pointerId:null as number|null});
  const rotationRef=useRef({rotX:.08,rotY:skinStyle==="canonical-magenta"?-.85:.85,velX:0,velY:initialMotion==="spring-in"?autoRotateSpeed:0});
  const dotsRef=useRef<StippleDot[]>([]),plasmaRef=useRef<Plasma[]>([]);
  const orbitalRef=useRef<OrbitalState>({ring:[],bodies:[],phase:0});

  useEffect(()=>{
    const dots:StippleDot[]=[],gold=Math.PI*(3-Math.sqrt(5));
    // Start every dot on its rotated target (same transform as the render loop) so no spring-settling is visible.
    const {rotX,rotY}=rotationRef.current,sinX=Math.sin(rotX),cosX=Math.cos(rotX),sinY=Math.sin(rotY),cosY=Math.cos(rotY);
    for(let i=0;i<stippleDensity;i++){const y=1-(i/(stippleDensity-1))*2,ry=Math.sqrt(Math.max(0,1-y*y)),theta=gold*i,x=Math.cos(theta)*ry,z=Math.sin(theta)*ry,x1=x*cosY+z*sinY,z1=-x*sinY+z*cosY;dots.push({bx:x,by:y,bz:z,x:(initialMotion==="spring-in"?x:x1)*radius,y:(initialMotion==="spring-in"?y:y*cosX-z1*sinX)*radius,z:(initialMotion==="spring-in"?z:y*sinX+z1*cosX)*radius,vx:0,vy:0,vz:0,baseSize:.65+Math.random()*.45,phase:Math.random()*Math.PI*2});}
    dotsRef.current=dots;
    const plasma:Plasma[]=[];for(let i=0;i<380;i++)plasma.push({angle:Math.random()*Math.PI*2,distFactor:1+Math.random()*.1,size:.5+Math.random()*1.1,alpha:.25+Math.random()*.75,speed:(Math.random()-.5)*.003,radialVelocity:.0005+Math.random()*.0016,life:Math.random()*100,maxLife:60+Math.random()*80});plasmaRef.current=plasma;
  },[radius,stippleDensity,surfaceDensityScale,initialMotion]);

  useEffect(()=>{
    if(!orbitalSystem?.enabled){orbitalRef.current={ring:[],bodies:[],phase:0};return;}
    const count=Math.max(1,Math.floor(orbitalSystem.ringStyle==="solid"?384:(orbitalSystem.ringParticleCount??150))),bodyCount=Math.max(0,Math.floor(orbitalSystem.bodyCount??4));
    const ring:OrbitalParticle[]=[],bodies:OrbitalParticle[]=[];
    for(let i=0;i<count;i++){const t=i/count;ring.push({angle:t*Math.PI*2,thickness:orbitalSystem.ringStyle==="solid"?0:(((i*37)%101)/100-.5)*(orbitalSystem.ringThickness??.035),size:(orbitalSystem.ringParticleSize??.8)*(.72+((i*17)%29)/100),phase:0});}
    for(let i=0;i<bodyCount;i++)bodies.push({angle:(i/bodyCount)*Math.PI*2,thickness:0,size:orbitalSystem.bodySize??2.5,phase:0});
    orbitalRef.current={ring,bodies,phase:0};
  },[orbitalSystem,radius]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext("2d",{alpha:true});if(!ctx)return;
    let animId=0,width=0,height=0,time=0;
    const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
    let redraw=()=>{};
    const host=canvas.parentElement;
    if(!host)return;
    const resize=()=>{const nextWidth=host.clientWidth||600,nextHeight=host.clientHeight||600;if(nextWidth===width&&nextHeight===height)return;width=canvas.width=nextWidth;height=canvas.height=nextHeight;redraw();};
    resize();
    const observer=new ResizeObserver(resize);observer.observe(host);
    // Surface color gradient (experimental): maps each visible dot's existing lit-ness (illum, 0..1) onto
    // shadow -> dark -> mid -> light continuously, then -> hot only above surfaceHotThreshold (rare highlights).
    // Existing brightness/alpha/size/visibility stay authoritative; this only replaces the fill color.
    const surfaceColor=palette.surface?(illum:number):RGB=>{
      const st=palette.surface!,bp=st.bp,cols=st.cols;
      for(let i=1;i<bp.length;i++)if(illum<=bp[i])return lerpRgb(cols[i-1],cols[i],(illum-bp[i-1])/(bp[i]-bp[i-1]));
      if(illum<=st.hotStart)return cols[cols.length-1];
      return lerpRgb(cols[cols.length-1],st.hot,Math.min(1,(illum-st.hotStart)/(1-st.hotStart)));
    }:null;
    const orbital=orbitalSystem?.enabled?orbitalSystem:null;
    const visibleRecords:Array<VisibleDot|undefined>=[];
    const visible:VisibleDot[]=[];
    // Preserve the back orbital phase from before the final simulated step.
    let backOrbitalPhase=orbitalRef.current.phase;
    const simulate=(advance=true)=>{
      if(advance)time+=.025;
      const {cx,cy}=resolveOrbCenter({width,height,radius,cropPosition,offsetX:centerOffsetX,offsetY:centerOffsetY});
      const rot=rotationRef.current,mouse=mouseRef.current;
      if(advance&&!mouse.isDragging){rot.rotY+=autoRotateSpeed+rot.velY;rot.rotX+=rot.velX;rot.velX*=.92;rot.velY*=.92;}
      const sinX=Math.sin(rot.rotX),cosX=Math.cos(rot.rotX),sinY=Math.sin(rot.rotY),cosY=Math.cos(rot.rotY);
      backOrbitalPhase=orbitalRef.current.phase;
      if(orbital&&advance)orbitalRef.current.phase+=(orbital.orbitSpeed??.00022);
      if(advance)for(const p of plasmaRef.current){p.life++;if(p.life>p.maxLife){p.life=0;p.distFactor=1.002+Math.random()*.02;}else p.distFactor+=p.radialVelocity*plasmaNoiseIntensity;p.angle+=p.speed*plasmaSpeed;}
      let lightX=-.92,lightY=-.15,lightZ=.35;if(cropPosition==="orb-left")lightX=.92;const ll=Math.sqrt(lightX*lightX+lightY*lightY+lightZ*lightZ);lightX/=ll;lightY/=ll;lightZ/=ll;
      const mouseRelX=mouse.x-cx,mouseRelY=mouse.y-cy,mouseDist=Math.sqrt(mouseRelX*mouseRelX+mouseRelY*mouseRelY),interactionRadius=radius*1.35;
      for(const p of dotsRef.current){const x1=p.bx*cosY+p.bz*sinY,z1=-p.bx*sinY+p.bz*cosY,y1=p.by*cosX-z1*sinX,nz=p.by*sinX+z1*cosX,nx=x1,ny=y1,nDotL=nx*lightX+ny*lightY+nz*lightZ,effective=Math.max(0,nDotL)+ambientLuminance*.45,tx=nx*radius,ty=ny*radius,tz=nz*radius;
        if(nz<-.05||effective<.1){if(initialMotion==="spring-in")continue;p.x=tx;p.y=ty;p.z=tz;p.vx=p.vy=p.vz=0;continue;}
        if(interactive&&(!reducedMotion.matches||mouse.isDragging)&&mouse.isHovered&&mouseDist<interactionRadius){const dx=p.x-mouseRelX,dy=p.y-mouseRelY,d=Math.sqrt(dx*dx+dy*dy)||1,influence=Math.max(0,1-d/(radius*.9))*interactionStrength;if(interactionMode==="repel"){const f=influence*18;p.vx+=(dx/d)*f;p.vy+=(dy/d)*f;}else if(interactionMode==="attract"){const f=influence*14;p.vx-=(dx/d)*f;p.vy-=(dy/d)*f;}else{const a=Math.atan2(dy,dx),f=influence*18;p.vx+=Math.cos(a+Math.PI/2)*f;p.vy+=Math.sin(a+Math.PI/2)*f;}}
        const k=.09,damp=.82;p.vx=(p.vx+(tx-p.x)*k)*damp;p.vy=(p.vy+(ty-p.y)*k)*damp;p.vz=(p.vz+(tz-p.z)*k)*damp;p.x+=p.vx;p.y+=p.vy;p.z+=p.vz;
      }
    };
    const paint=()=>{
      ctx.clearRect(0,0,width,height);
      const {cx,cy}=resolveOrbCenter({width,height,radius,cropPosition,offsetX:centerOffsetX,offsetY:centerOffsetY});
      const rot=rotationRef.current,mouse=mouseRef.current;
      const sinX=Math.sin(rot.rotX),cosX=Math.cos(rot.rotX),sinY=Math.sin(rot.rotY),cosY=Math.cos(rot.rotY),glowRgb=palette.glowRgb,glowHex=palette.glowHex;
      const drawOrbitals=(front:boolean)=>{
        if(!orbital)return;
        const state=orbitalRef.current,tilt=(orbital.ringTilt??64)*Math.PI/180,roll=(orbital.ringRoll??-16)*Math.PI/180,ct=Math.cos(tilt),st=Math.sin(tilt),cr=Math.cos(roll),sr=Math.sin(roll),orbitRadius=radius*(orbital.ringRadius??1.32),fov=850;
        const project=(p:OrbitalParticle,angle:number)=>{const x=orbitRadius*Math.cos(angle),z=orbitRadius*Math.sin(angle),y=radius*p.thickness,z1=y*st+z*ct,y1=y*ct-z*st,x2=x*cr-y1*sr,y2=x*sr+y1*cr,scale=fov/(fov+z1),sx=cx+x2*scale,sy=cy+y2*scale,inside=x2*x2+y2*y2<radius*radius,frontSurface=Math.sqrt(Math.max(0,radius*radius-x2*x2-y2*y2));return {sx,sy,z:z1,scale,occluded:inside&&z1<frontSurface};};
        const drawPoint=(p:OrbitalParticle,angle:number,body:boolean)=>{const q=project(p,angle);if(q.occluded||(front!== (q.z>=0)))return;const alpha=(orbital.ringOpacity??.5)*(.55+.45*Math.min(1,Math.abs(q.z)/orbitRadius));ctx.save();ctx.globalAlpha=body?Math.min(1,alpha*1.8):alpha;const color=body?(orbital.bodyColor??"#FFF0FA"):(orbital.ringColor??"#FF65C7");if(body){ctx.shadowColor=orbital.bodyGlowColor??"#FF2FAE";ctx.shadowBlur=(orbital.bodyGlowSize??10)*q.scale;}else ctx.shadowBlur=1.5*q.scale;ctx.fillStyle=color;ctx.beginPath();ctx.arc(q.sx,q.sy,p.size*q.scale,0,Math.PI*2);ctx.fill();ctx.restore();};
        const drawSolidRing=()=>{const points=state.ring.map((p)=>project(p,p.angle)),widthPx=orbital.ringWidth??1.5,opacity=orbital.ringOpacity??.82,ringColor=orbital.ringColor??"#FF65C7",glowColor=orbital.ringGlowColor??"#FF2FAE";const drawSegments=(glow:boolean)=>{ctx.save();ctx.globalAlpha=opacity*(glow?.34:1);ctx.strokeStyle=glow?glowColor:ringColor;ctx.lineWidth=glow?Math.max(widthPx*2.2,3):widthPx;ctx.shadowColor=glowColor;ctx.shadowBlur=glow?(orbital.ringGlowSize??7):1.5;let open=false;for(let i=0;i<=points.length;i++){const q=points[i%points.length],visiblePoint=!q.occluded&&(front===(q.z>=0));if(visiblePoint){if(!open){ctx.beginPath();ctx.moveTo(q.sx,q.sy);open=true;}else ctx.lineTo(q.sx,q.sy);}else if(open){ctx.stroke();open=false;}}if(open)ctx.stroke();ctx.restore();};drawSegments(true);drawSegments(false);};
        const phase=front?state.phase:backOrbitalPhase;
        if(orbital.ringStyle==="solid")drawSolidRing();else for(const p of state.ring)drawPoint(p,p.angle+phase,false);
        for(const p of state.bodies)drawPoint(p,p.angle+phase,true);
      };
      drawOrbitals(false);
      if(bodyOpacity>0){ctx.save();ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);const g=ctx.createRadialGradient(cx,cy,0,cx,cy,radius);g.addColorStop(0,`${palette.bodyGradStart}${bodyOpacity})`);g.addColorStop(.85,`${palette.bodyGradStart}${Math.min(1,bodyOpacity*1.5)})`);g.addColorStop(1,`${palette.bodyGradEnd}${Math.min(1,bodyOpacity*2.2)})`);ctx.fillStyle=g;ctx.fill();ctx.restore();}
      const limbShape=outerGlowFocus!==1||midGlowFocus!==1||hotCoreFocus!==1||hotCoreWidthMultiplier!==1?{outer:outerGlowFocus,mid:midGlowFocus,core:hotCoreFocus,coreWidth:hotCoreWidthMultiplier}:undefined;
      const flare=solarFlareIntensity-1,flareAlpha=1+flare*.85,flareSize=1+flare*.25,flareReach=flare*.45;
      ctx.save();for(const p of plasmaRef.current){const noise=Math.sin(p.angle*12+time*3)*.015+Math.cos(p.angle*24-time*2)*.01,base=p.distFactor+noise*plasmaNoiseIntensity,dist=radius*base+radius*(base-1)*flareReach,px=cx+Math.cos(p.angle)*dist,py=cy+Math.sin(p.angle)*dist,fade=Math.sin((p.life/p.maxLife)*Math.PI)*p.alpha;let bias=1;if(cropPosition==="orb-right")bias=Math.max(.12,-Math.cos(p.angle));else if(cropPosition==="orb-left")bias=Math.max(.12,Math.cos(p.angle));ctx.fillStyle=`rgba(${palette.plasmaRgb}, ${fade*bias*.85*flareAlpha})`;ctx.beginPath();ctx.arc(px,py,p.size*flareSize,0,Math.PI*2);ctx.fill();}ctx.restore();
      let lightX=-.92,lightY=-.15,lightZ=.35;if(cropPosition==="orb-left")lightX=.92;const ll=Math.sqrt(lightX*lightX+lightY*lightY+lightZ*lightZ);lightX/=ll;lightY/=ll;lightZ/=ll;
      visible.length=0;
      for(let i=0;i<dotsRef.current.length;i++){const p=dotsRef.current[i],x1=p.bx*cosY+p.bz*sinY,z1=-p.bx*sinY+p.bz*cosY,y1=p.by*cosX-z1*sinX,nz=p.by*sinX+z1*cosX,nx=x1,ny=y1,nDotL=nx*lightX+ny*lightY+nz*lightZ,effective=Math.max(0,nDotL)+ambientLuminance*.45;
        if(nz<-.05||effective<.1)continue;
        const fov=850,scale=fov/(fov+p.z),sx=cx+p.x*scale,sy=cy+p.y*scale,rad=Math.sqrt(p.x*p.x+p.y*p.y)/radius,illum=Math.pow(Math.min(1,effective),1.6),limb=Math.pow(Math.min(1,rad),2.2),brightness=Math.min(1,illum*.45+limb*.55+ambientLuminance*.25);if(brightness<.08)continue;let color:string,alpha:number,size=p.baseSize*scale*(.75+brightness*.5);
        if(surfaceColor){const c=surfaceColor(Math.pow(Math.max(0,nDotL),1.9));color=`rgb(${c.r}, ${c.g}, ${c.b})`;alpha=Math.min(1,(.35+.65*illum)*Math.pow(brightness,1.25));}
        else if(dotHarmonization==="unified"){color=palette.glowHex;alpha=Math.min(1,(.35+.65*illum)*Math.pow(brightness,1.25));}else if(dotHarmonization==="subtle-specular"){const sf=Math.pow(Math.max(0,(rad-.78)/.22),2)*Math.max(0,nDotL),blend=lerpRgb(palette.rawRgb,{r:255,g:255,b:255},sf*.65);color=`rgb(${blend.r}, ${blend.g}, ${blend.b})`;alpha=Math.min(1,(.35+.65*illum)*Math.pow(brightness,1.2));}else if(rad>.88&&nDotL>.4){color=palette.highlightDot;alpha=.95;size*=1.15;}else if(rad>.55||nDotL>.1){color=palette.midDot;alpha=.45+brightness*.45;}else{color=palette.shadowDot;alpha=.25+brightness*.35;}
        const d=visibleRecords[i]??(visibleRecords[i]={sx,sy,z:p.z,size,color,alpha:0});d.sx=sx;d.sy=sy;d.z=p.z;d.size=size;d.color=color;d.alpha=Math.min(1,alpha*brightness);visible.push(d);
      }
      visible.sort((a,b)=>a.z-b.z);for(const d of visible){ctx.globalAlpha=d.alpha;ctx.fillStyle=d.color;ctx.beginPath();ctx.arc(d.sx,d.sy,d.size,0,Math.PI*2);ctx.fill();}
      if(atmosphereMode==="field"){const la=Math.atan2(lightY,lightX),key=`${width}x${height}|${cx}|${cy}|${radius}|${la}|${atmosphereWidth}|${atmosphereFocus}|${atmosphereIntensity}|${outerGlowColor}|${midGlowColor}|${hotCoreColor}|${palette.glowHex}|${innerGlowWidth}|${innerGlowIntensity}|${innerGlowColor}|${innerGlowFocus}`;
        if(fieldRef.current?.key!==key){const l=palette.limb;fieldRef.current={key,field:buildAtmosphereField(width,height,cx,cy,radius,la,atmosphereWidth,atmosphereFocus,atmosphereIntensity,l?.outer.raw??palette.rawRgb,l?.mid.raw??palette.rawRgb,l?.core.raw??palette.rawRgb,innerGlowWidth,innerGlowIntensity,innerGlowFocus,hexToRgb(innerGlowColor??"",palette.rawRgb))};}
        const f=fieldRef.current.field;if(f){ctx.save();ctx.globalAlpha=1;ctx.globalCompositeOperation="screen";ctx.drawImage(f.canvas,f.x,f.y);ctx.restore();}}
      else if(glowingStrokeIntensity>0&&strokeMode!=="none")drawAtmosphericLimb(ctx,cx,cy,radius,Math.atan2(lightY,lightX),strokeMode,glowingStrokeIntensity,glowSpread,coreHotness,strokeWidth,innerWashIntensity,strokeShadowOpacity,glowHex,glowRgb,palette.rawRgb,palette.limb,limbShape);
      drawOrbitals(true);
      ctx.globalAlpha=1;
    };
    // Preserve the accepted 60 Hz simulation speed on 30/60/120/144 Hz displays.
    // Keep spring physics unchanged; bound catch-up work after a stalled frame.
    const clock={lastFrame:0,accumulator:0};
    const tick=(timestamp:number)=>{
      if(document.hidden||reducedMotion.matches){animId=0;return;}
      const steps=advanceOrbClock(clock,timestamp);
      for(let i=0;i<steps;i++)simulate();
      if(steps>0)paint();
      animId=requestAnimationFrame(tick);
    };
    const syncMotion=()=>{
      cancelAnimationFrame(animId);animId=0;clock.accumulator=0;
      if(!document.hidden&&!reducedMotion.matches){clock.lastFrame=performance.now();animId=requestAnimationFrame(tick);}
    };
    redraw=()=>{if(reducedMotion.matches){simulate(false);paint();}};
    redrawOnInputRef.current=redraw;
    simulate();paint();syncMotion();
    reducedMotion.addEventListener("change",syncMotion);
    document.addEventListener("visibilitychange",syncMotion);
    return()=>{redrawOnInputRef.current=()=>{};observer.disconnect();cancelAnimationFrame(animId);reducedMotion.removeEventListener("change",syncMotion);document.removeEventListener("visibilitychange",syncMotion);};
  },[initialMotion,radius,centerOffsetX,centerOffsetY,interactionMode,interactionStrength,autoRotateSpeed,cropPosition,skinStyle,palette,accentColor,primaryDotColor,shadowDotColor,interactive,plasmaNoiseIntensity,plasmaSpeed,stippleDensity,ambientLuminance,glowingStrokeIntensity,glowSpread,coreHotness,innerWashIntensity,dotHarmonization,strokeMode,strokeShadowOpacity,strokeWidth,bodyOpacity,solarFlareIntensity,outerGlowFocus,midGlowFocus,hotCoreFocus,hotCoreWidthMultiplier,atmosphereMode,atmosphereWidth,atmosphereFocus,atmosphereIntensity,innerGlowWidth,innerGlowIntensity,innerGlowColor,innerGlowFocus,surfaceColorMode,surfaceShadowColor,surfaceDarkColor,surfaceMidColor,surfaceLightColor,surfaceHotThreshold,orbitalSystem]);

  // Map input through the existing uniform presentation transform.
  const toCanvas=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    const canvas=canvasRef.current,rect=canvas?.getBoundingClientRect();
    if(!canvas||!rect||!rect.width||!rect.height)return null;
    return {x:(e.clientX-rect.left)*(canvas.width/rect.width),y:(e.clientY-rect.top)*(canvas.height/rect.height)};
  };
  const clearHover=()=>{const mouse=mouseRef.current;mouse.isHovered=false;mouse.x=-9999;mouse.y=-9999;};
  const handlePointerMove=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    if(!interactive)return;
    const point=toCanvas(e);if(!point)return;
    const mouse=mouseRef.current;
    if(mouse.isDragging&&mouse.pointerId!==e.pointerId)return;
    if(mouse.isDragging){
      const dx=point.x-mouse.prevX,dy=point.y-mouse.prevY;
      rotationRef.current.rotY+=dx*.008;rotationRef.current.rotX-=dy*.008;
      rotationRef.current.velY=dx*.0012;rotationRef.current.velX=-dy*.0012;
    }
    mouse.prevX=point.x;mouse.prevY=point.y;mouse.x=point.x;mouse.y=point.y;mouse.isHovered=true;
    // Reduced motion stops autonomous animation, not deliberate rotation.
    if(mouse.isDragging)redrawOnInputRef.current();
  };
  const handlePointerDown=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    if(!interactive||e.button!==0||mouseRef.current.isDragging)return;
    const point=toCanvas(e);if(!point)return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const mouse=mouseRef.current;
    mouse.isDragging=true;mouse.pointerId=e.pointerId;mouse.isHovered=true;
    mouse.prevX=point.x;mouse.prevY=point.y;mouse.x=point.x;mouse.y=point.y;
  };
  const finishDrag=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    const mouse=mouseRef.current;
    if(mouse.pointerId!==e.pointerId)return;
    mouse.isDragging=false;mouse.pointerId=null;
    if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
    if(document.elementFromPoint(e.clientX,e.clientY)!==e.currentTarget)clearHover();
  };
  return <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
    <canvas ref={canvasRef} onPointerMove={handlePointerMove} onPointerDown={handlePointerDown}
      onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}
      onPointerLeave={()=>{if(!mouseRef.current.isDragging)clearHover();}}
      className="w-full h-full block cursor-grab active:cursor-grabbing touch-none" />
  </div>;
};
