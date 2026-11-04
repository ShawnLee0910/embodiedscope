/* RoboWeave's original scroll-directed 3D introduction. No remote assets. */
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {FXAAPass} from 'three/addons/postprocessing/FXAAPass.js';

const stage = document.querySelector('.intro-track');
const pin = stage?.querySelector('.intro-pin');
const canvas = document.querySelector('#intro-canvas');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (x) => Math.max(0, Math.min(1, x));
const smooth = (a, b, x) => { const t = clamp((x-a)/(b-a)); return t*t*(3-2*t); };
const mix = THREE.MathUtils.lerp;
let active = true;

function fallback() {
  stage?.classList.remove('story-live');
  stage?.classList.add('story-static');
  const title=stage?.querySelector('.title-sheet');
  if(title){title.removeAttribute('style');title.inert=false;}
  stage?.querySelectorAll('[data-title-word],[data-title-group]').forEach(el=>el.removeAttribute('style'));
}

if (stage && pin && canvas && !reduced.matches) {
  try { start(); } catch (error) { fallback(); console.warn('RoboWeave: showing the static introduction.', error.message); }
} else { fallback(); }

function start() {
  const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 70);
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(environment, .035);
  scene.environment = env.texture;
  scene.environmentIntensity = .38;
  environment.dispose(); pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xbacfff,0x16202e,.65));
  function light(color,power,x,y,z) { const l = new THREE.DirectionalLight(color,power);l.position.set(x,y,z);scene.add(l);return l; }
  light(0xf3f7ff,2.0,3,5,5);
  light(0x388fff,2.5,-4,1,-2);
  light(0xff974c,2.5,4,1,-1);
  light(0xc6d8ff,.5,0,-2,4);

  const shell = new THREE.MeshPhysicalMaterial({color:0xdce6f3,metalness:.14,roughness:.29,clearcoat:.7,clearcoatRoughness:.24});
  const white = new THREE.MeshPhysicalMaterial({color:0xf2f5fa,metalness:.10,roughness:.27,clearcoat:.75,clearcoatRoughness:.23});
  const navy = new THREE.MeshPhysicalMaterial({color:0x071728,metalness:.42,roughness:.30,clearcoat:.65});
  const visorMaterial = new THREE.MeshPhysicalMaterial({color:0x0b2238,metalness:.28,roughness:.20,clearcoat:.8,clearcoatRoughness:.16});
  const eyeMaterial = new THREE.MeshStandardMaterial({color:0xc8e8ff,emissive:0x80c6ff,emissiveIntensity:1.9,roughness:.35});
  const blue = new THREE.MeshPhysicalMaterial({color:0x126ee5,metalness:.30,roughness:.29,clearcoat:.9,clearcoatRoughness:.21});
  const orange = new THREE.MeshPhysicalMaterial({color:0xfb7d31,metalness:.22,roughness:.30,clearcoat:.9,clearcoatRoughness:.21});
  const robot = new THREE.Group();
  scene.add(robot);
  function rounded(parent,size,position,material,radius=.14) {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size,10,radius),material);
    mesh.position.set(...position); parent.add(mesh); return mesh;
  }
  function ellipsoid(parent,scale,position,material) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1,64,48),material);
    mesh.scale.set(...scale);mesh.position.set(...position);parent.add(mesh);return mesh;
  }
  function cylinder(parent,radius,length,position,material) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,length,80),material);
    mesh.position.set(...position);parent.add(mesh);return mesh;
  }
  const torso = rounded(robot,[1.16,1.04,.72],[0,.16,0],navy,.22);
  rounded(robot,[1.03,.78,.23],[0,.16,.30],shell,.20);
  cylinder(robot,.23,.42,[0,.83,0],navy);
  const head = new THREE.Group(); head.position.set(0,1.43,0);robot.add(head);
  rounded(head,[1.53,1.02,.91],[0,0,0],white,.30);
  rounded(head,[1.30,.74,.22],[0,-.01,.427],visorMaterial,.25);
  const eyes = [-1,1].map(side => rounded(head,[.125,.30,.13],[side*.32,.01,.564],eyeMaterial,.060));
  rounded(head,[.26,.035,.025],[0,-.205,.554],eyeMaterial,.015);
  rounded(head,[1.14,.12,.69],[0,.51,-.02],shell,.055);
  [-1,1].forEach(side => {
    const ear = cylinder(head,.245,.15,[side*.82,0,-.015],shell);ear.rotation.z=Math.PI/2;
    const seam = cylinder(head,.25,.055,[side*.745,0,-.015],navy);seam.rotation.z=Math.PI/2;
    ellipsoid(robot,[.33,.34,.34],[side*.80,.45,0],shell);
    const upper = rounded(robot,[.29,.58,.36],[side*.97,.16,.08],white,.14);upper.rotation.z=side*.23;
    ellipsoid(robot,[.20,.20,.23],[side*1.03,-.12,.12],navy);
    const forearm = rounded(robot,[.36,.55,.40],[side*.98,-.30,.25],shell,.17);forearm.rotation.z=-side*.35;
    const palm = rounded(robot,[.34,.24,.30],[side*.87,-.53,.40],white,.11);palm.rotation.z=-side*.38;
    rounded(robot,[.105,.22,.14],[side*.73,-.47,.54],shell,.045);
  });
  cylinder(robot,.28,.12,[0,-.46,0],navy);

  // A beveled ribbon is a solid mesh, rather than a line laid on top of the scene.
  const segments = 220, cross = 16;
  function makeRibbon(index,material,width) {
    const bodyVertices=(segments+1)*cross;
    const positions = new Float32Array((bodyVertices+cross*2)*3);
    const indices = [];
    for(let i=0;i<segments;i++)for(let j=0;j<cross;j++){
      const a=i*cross+j,b=i*cross+(j+1)%cross,c=(i+1)*cross+j,d=(i+1)*cross+(j+1)%cross;
      indices.push(a,b,c,b,d,c);
    }
    const surfaceCount=indices.length;
    // Duplicate the two end rings so the free ends have clean, flat caps.
    for(let cap=0;cap<2;cap++)for(let j=1;j<cross-1;j++){
      const base=bodyVertices+cap*cross;
      if(cap===0)indices.push(base,base+j+1,base+j);
      else indices.push(base,base+j,base+j+1);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    geometry.setIndex(indices);
    const mesh = new THREE.Mesh(geometry,material);mesh.frustumCulled=false;
    robot.add(mesh);
    return {index,mesh,geometry,positions,width,bodyVertices,surfaceCount};
  }
  const ribbons = [makeRibbon(0,blue,.29),makeRibbon(1,orange,.29)];
  const p0 = new THREE.Vector3(), p1 = new THREE.Vector3(), tangent = new THREE.Vector3(), normal = new THREE.Vector3(), binormal = new THREE.Vector3();
  function path(t,index,closed,out) {
    const sign=index===0?-1:1;
    const x=1.36*Math.cos(t), y=.02+.55*Math.sin(t)+sign*.48*Math.cos(t), z=sign*.58*Math.sin(t)+.18;
    const u=t/(Math.PI*2);
    const openX=-4.4+8.8*u;
    const openY=.2+sign*.65+Math.sin(u*Math.PI*2+index)*.95;
    const openZ=1.1+Math.cos(u*Math.PI*2+index)*.65;
    out.set(mix(openX,x,closed),mix(openY,y,closed),mix(openZ,z,closed));
    return out;
  }
  let lastClosure=-1;
  function updateRibbons(closure) {
    if(Math.abs(lastClosure-closure)<.00015)return;
    lastClosure=closure;
    for(const ribbon of ribbons){
      const {index,positions,geometry,width,bodyVertices,surfaceCount}=ribbon;
      for(let i=0;i<=segments;i++){
        const t=i/segments*Math.PI*2;
        path(t,index,closure,p0);path(t+.001,index,closure,p1);
        tangent.subVectors(p1,p0).normalize();
        normal.set(Math.cos(t),Math.sin(t),.12*Math.cos(t*2));
        normal.addScaledVector(tangent,-normal.dot(tangent)).normalize();
        binormal.crossVectors(tangent,normal).normalize();
        for(let j=0;j<cross;j++){
          const theta=j/cross*Math.PI*2;
          const n=Math.sign(Math.cos(theta))*Math.pow(Math.abs(Math.cos(theta)),.34)*width/2;
          const b=Math.sign(Math.sin(theta))*Math.pow(Math.abs(Math.sin(theta)),.34)*.028;
          const k=(i*cross+j)*3;
          positions[k]=p0.x+normal.x*n+binormal.x*b;
          positions[k+1]=p0.y+normal.y*n+binormal.y*b;
          positions[k+2]=p0.z+normal.z*n+binormal.z*b;
        }
      }
      positions.set(positions.subarray(0,cross*3),bodyVertices*3);
      positions.set(positions.subarray(segments*cross*3,(segments+1)*cross*3),(bodyVertices+cross)*3);
      geometry.setDrawRange(0,closure>.9995?surfaceCount:geometry.index.count);
      geometry.attributes.position.needsUpdate=true;
      geometry.computeVertexNormals();
      if(closure>.9995){
        const normals=geometry.attributes.normal;
        for(let j=0;j<cross;j++){
          const last=segments*cross+j;
          normal.set(normals.getX(j)+normals.getX(last),normals.getY(j)+normals.getY(last),normals.getZ(j)+normals.getZ(last)).normalize();
          normals.setXYZ(j,normal.x,normal.y,normal.z);normals.setXYZ(last,normal.x,normal.y,normal.z);
        }
        normals.needsUpdate=true;
      }
    }
  }

  // Four light paths gather around the same agent as the scroll advances.
  const threadColors=[0x69b9ff,0xb7a0ff,0xffa15e,0x8ae4ce];
  const threads=[];
  for(let j=0;j<4;j++){
    const pts=[];
    for(let i=0;i<=160;i++){
      const u=i/160, angle=u*Math.PI*2.1+j*Math.PI/2;
      const radius=2.5-u*.8;
      pts.push(new THREE.Vector3(Math.cos(angle)*radius,(u-.5)*1.85+.15,Math.sin(angle)*radius));
    }
    const geometry=new THREE.BufferGeometry().setFromPoints(pts);
    const material=new THREE.LineBasicMaterial({color:threadColors[j],transparent:true,opacity:0});
    const line=new THREE.Line(geometry,material);robot.add(line);
    const dotMaterial=new THREE.MeshBasicMaterial({color:threadColors[j]});dotMaterial.color.multiplyScalar(1.45);
    const dot=new THREE.Mesh(new THREE.SphereGeometry(.026,16,10),dotMaterial);robot.add(dot);
    threads.push({line,dot,pts});
  }

  const starPositions = new Float32Array(260*3);
  let seed=19;
  const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  for(let i=0;i<260;i++){starPositions[i*3]=(random()-.5)*32;starPositions[i*3+1]=(random()-.5)*19;starPositions[i*3+2]=-5-random()*14;}
  const starGeometry = new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.BufferAttribute(starPositions,3));
  const stars=new THREE.Points(starGeometry,new THREE.PointsMaterial({color:0x8fb8df,size:.014,transparent:true,opacity:.50,sizeAttenuation:true}));scene.add(stars);

  // Canvas antialiasing does not cover the offscreen buffers used by bloom.
  const gl = renderer.getContext();
  const colorSamples = gl.getInternalformatParameter(gl.RENDERBUFFER, gl.RGBA16F, gl.SAMPLES) ?? [];
  const depthSamples = gl.getInternalformatParameter(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, gl.SAMPLES) ?? [];
  const supportedSamples = Array.from(colorSamples).filter(samples => samples <= 4 && depthSamples.includes(samples));
  const samples = Math.max(0, ...supportedSamples);
  const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    samples,
    resolveDepthBuffer: false,
  });
  const composer = new EffectComposer(renderer, renderTarget);
  composer.addPass(new RenderPass(scene,camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1,1),.14,.38,2.1);composer.addPass(bloom);
  composer.addPass(new OutputPass());
  if (samples < 2) composer.addPass(new FXAAPass());
  stage.classList.remove('story-static');stage.classList.add('story-live');
  const captions=[...stage.querySelectorAll('[data-story-chapter]')];
  const chapterButtons=[...stage.querySelectorAll('[data-story-to]')];
  const title=stage.querySelector('.title-sheet');
  const hint=stage.querySelector('.story-scroll');
  const progressBar=stage.querySelector('.story-progress-fill');
  const wordItems=[...stage.querySelectorAll('[data-title-word]')];
  const titleGroups=[...stage.querySelectorAll('[data-title-group]')];
  const offsetTop=()=>document.querySelector('.topbar')?.offsetHeight||56;
  let target=0, current=0, raf=0, visible=true, lastTime=0;
  let mobile=innerWidth<700;
  const beatCenters=[.025,.19,.365,.54,.695];
  // A continuous camera path avoids braking at every capability chapter.
  const cameraCurve=new THREE.CatmullRomCurve3([
    new THREE.Vector3(.55,1.55,3.15),new THREE.Vector3(2.10,1.75,5.05),
    new THREE.Vector3(-1.75,2.05,6.10),new THREE.Vector3(-.5,1.35,7.0),new THREE.Vector3(0,1.20,7.8)
  ],false,'centripetal');
  const lookCurve=new THREE.CatmullRomCurve3([
    new THREE.Vector3(.2,1.12,0),new THREE.Vector3(.1,.8,0),
    new THREE.Vector3(0,.7,0),new THREE.Vector3(0,.65,0),new THREE.Vector3(0,.65,0)
  ],false,'centripetal');
  const look=new THREE.Vector3();
  function draw(p) {
    const closure=smooth(.04,.62,p);
    const titleReveal=smooth(.70,.825,p);
    const activeChapter=p>.76?5:beatCenters.reduce((best,v,i)=>Math.abs(v-p)<Math.abs(beatCenters[best]-p)?i:best,0);
    updateRibbons(closure);
    robot.rotation.y=mix(-.10,.06,smooth(0,.66,p));
    robot.rotation.z=.015*Math.sin(p*Math.PI*3)*(1-titleReveal);
    const shortPhone=mobile&&pin.clientHeight<650;
    const mobileOpening=1-smooth(0,.22,p);
    const endScale=mobile?(shortPhone?.22:.28):.25;
    const scale=mix(mobile?.8-.07*mobileOpening:1,endScale,titleReveal);robot.scale.setScalar(scale);
    robot.position.set(mix(mobile?0:.8,0,titleReveal),mix(mobile?.94:0,mobile?(shortPhone?3.55:3.35):2.13,titleReveal),0);
    head.rotation.y=.12*Math.sin(p*9)*(1-titleReveal);
    head.rotation.x=-.035+.05*Math.sin(p*8);
    eyes.forEach((eye,i)=>eye.scale.y=1-.08*Math.sin(p*8+i*.3));
    const cameraProgress=smooth(0,.74,p);
    cameraCurve.getPoint(cameraProgress,camera.position);lookCurve.getPoint(cameraProgress,look);
    if(mobile){camera.position.z*=1.4+.08*mobileOpening;camera.position.x*=.64;look.x=0;camera.fov=40;}else camera.fov=35;
    camera.lookAt(look);camera.updateProjectionMatrix();
    for(let j=0;j<threads.length;j++){
      const thread=threads[j];const arrival=smooth(.08+j*.12,.28+j*.12,p)*(1-titleReveal);
      thread.line.material.opacity=arrival*(activeChapter===j+1?.32:.12);
      const travel=clamp((p-.04-j*.1)/.52);
      const index=Math.floor(travel*160);
      thread.line.geometry.setDrawRange(0,Math.max(2,index+1));
      thread.dot.position.copy(thread.pts[index]);thread.dot.visible=arrival>.03&&p<.83;
    }
    stars.rotation.y=p*.08;
    captions.forEach((caption,i)=>{
      const center=beatCenters[i];
      let opacity=smooth(center-.075,center-.035,p)*(1-smooth(center+.045,center+.08,p));
      if(i===0)opacity=1-smooth(.055,.12,p);
      if(i===4)opacity*=1-smooth(.71,.745,p);
      caption.style.opacity=String(opacity);
      caption.style.transform=`translateY(${(1-opacity)*18}px)`;
      caption.setAttribute('aria-hidden',opacity<.4?'true':'false');
    });
    const titleIn=smooth(.755,.81,p);
    title.style.opacity=String(titleIn);
    title.style.pointerEvents=p>.87?'auto':'none';
    title.inert=p<.87;
    wordItems.forEach((item,i)=>{
      const start=i<2?.765+i*.01:.805+(i-2)*.0035;
      const reveal=smooth(start,start+.06,p);
      item.style.opacity=String(reveal);
      item.style.transform=`translateY(${(1-reveal)*26}px)`;
      item.style.filter=`blur(${(1-reveal)*4}px)`;
    });
    titleGroups.forEach((item,i)=>{
      const start=.875+i*.016;
      const reveal=smooth(start,start+.045,p);
      item.style.opacity=String(reveal);
      item.style.transform=`translateY(${(1-reveal)*22}px)`;
    });
    chapterButtons.forEach(button=>{const on=Number(button.dataset.storyTo)===activeChapter;button.classList.toggle('is-active',on);if(on)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
    progressBar.style.transform=`scaleX(${p})`;
    hint.style.opacity=String(1-smooth(.025,.1,p));
    stage.dataset.storyProgress=p.toFixed(3);
    stage.dataset.storyChapter=String(activeChapter);
    canvas.style.opacity=String(1-titleReveal*.08);
    composer.render();
  }
  function tick(time) {
    raf=0;
    if(!active||!visible||document.hidden)return;
    const dt=lastTime?Math.min(80,time-lastTime):16;lastTime=time;
    current+=(target-current)*(1-Math.pow(.001,dt/1000));
    if(Math.abs(target-current)<.00008)current=target;
    draw(current);
    if(current!==target)raf=requestAnimationFrame(tick);
  }
  function requestDraw(){if(!raf&&active&&visible&&!document.hidden)raf=requestAnimationFrame(tick);}
  function update(){const rect=stage.getBoundingClientRect();const track=rect.height-pin.offsetHeight;target=track>0?clamp((offsetTop()-rect.top)/track):1;requestDraw();}
  function resize(){
    mobile = innerWidth < 700;
    const width = pin.clientWidth;
    const height = pin.clientHeight;
    if (!width || !height) return;
    // Retain native CSS resolution, with denser sampling on high-DPI screens.
    const pixelBudget = mobile ? 1800000 : 4000000;
    const budgetRatio = Math.max(1, Math.sqrt(pixelBudget / (width * height)));
    const pixelRatio = Math.min(Math.max(1, devicePixelRatio || 1), 2, budgetRatio);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    // Keep MSAA, bloom, and the fallback filter at the same resolution.
    composer.setSize(width, height);
    composer.setPixelRatio(pixelRatio);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    update();
    draw(current);
  }
  function scrollToProgress(p){const rect=stage.getBoundingClientRect();scrollTo({top:scrollY+rect.top-offsetTop()+(rect.height-pin.offsetHeight)*p,behavior:reduced.matches?'auto':'smooth'});}
  const jumpPositions=[0,.19,.365,.54,.695,.985];
  chapterButtons.forEach(button=>button.addEventListener('click',()=>scrollToProgress(jumpPositions[Number(button.dataset.storyTo)])));
  stage.querySelector('#story-replay')?.addEventListener('click',()=>scrollToProgress(0));
  document.querySelectorAll('a[href="#home"]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();scrollToProgress(.985);history.replaceState(null,'','#home');}));
  document.querySelectorAll('a[href^="#"]:not([href="#home"])').forEach(link=>link.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const destination=document.getElementById(link.hash.slice(1));
    if(!destination)return;
    event.preventDefault();
    scrollTo({top:scrollY+destination.getBoundingClientRect().top-offsetTop()-20,behavior:reduced.matches?'auto':'smooth'});
    history.pushState(null,'',link.hash);
  }));
  addEventListener('scroll',update,{passive:true});addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{lastTime=0;requestDraw();});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){lastTime=0;update();}else if(raf){cancelAnimationFrame(raf);raf=0;}},{rootMargin:'100px'});observer.observe(stage);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();active=false;if(raf)cancelAnimationFrame(raf);fallback();});
  reduced.addEventListener('change',()=>{if(reduced.matches){active=false;if(raf)cancelAnimationFrame(raf);fallback();title.inert=false;}});
  resize();current=target;draw(current);
  if(location.hash==='#home')scrollToProgress(.985);
}
