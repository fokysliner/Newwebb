import "./style.css";

const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

const header = document.getElementById("siteHeader");
let lastY = window.scrollY;
let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  window.requestAnimationFrame(() => {
    const y = window.scrollY;
    if (y > 10 && y > lastY) header.classList.add("-translate-y-full");
    else header.classList.remove("-translate-y-full");
    header.classList.toggle("shadow-lg", y > 2);
    lastY = y;
    ticking = false;
  });
  ticking = true;
}, { passive: true });

const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const backdrop = document.getElementById("mobileBackdrop");
const sheet = document.getElementById("mobileSheet");
const links = document.querySelectorAll(".menu-link");

function openMenu() {
  mobileNav.classList.remove("hidden");
  requestAnimationFrame(() => {
    document.body.classList.add("overflow-hidden");
    header.classList.add("menu-open");
    backdrop.classList.remove("opacity-0");
    sheet.classList.remove("opacity-0", "scale-95", "translate-y-4");
    links.forEach((a, i) => {
      a.style.transition = "transform .35s ease, opacity .35s ease";
      a.style.transitionDelay = `${i * 60}ms`;
      a.classList.add("opacity-100", "translate-y-0");
    });
  });
}
function closeMenu() {
  backdrop.classList.add("opacity-0");
  sheet.classList.add("opacity-0", "scale-95", "translate-y-4");
  links.forEach((a) => {
    a.style.transitionDelay = "0ms";
    a.classList.remove("opacity-100", "translate-y-0");
  });
  header.classList.remove("menu-open");
  document.body.classList.remove("overflow-hidden");
  setTimeout(() => mobileNav.classList.add("hidden"), 250);
}
menuBtn?.addEventListener("click", () => {
  if (mobileNav.classList.contains("hidden")) openMenu();
  else closeMenu();
});
backdrop?.addEventListener("click", closeMenu);
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
links.forEach((a) => a.addEventListener("click", () => setTimeout(closeMenu, 150)));

function attachRipple(el) {
  el.classList.add("relative", "overflow-hidden");
  el.addEventListener("pointerdown", (e) => {
    const r = document.createElement("span");
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;
    r.className = "ripple-span";
    r.style.width = `${size}px`;
    r.style.height = `${size}px`;
    r.style.left = `${e.clientX - rect.left}px`;
    r.style.top = `${e.clientY - rect.top}px`;
    el.appendChild(r);
    r.addEventListener("animationend", () => r.remove());
  });
}
document.querySelectorAll(".chip,.btn-nav").forEach(attachRipple);

const effects = ["reveal-up","reveal-right","reveal-left","reveal-scale","reveal-tilt"];
document.querySelectorAll('[data-reveal="auto"]').forEach((el) => {
  const effect = effects[Math.floor(Math.random() * effects.length)];
  el.classList.add("reveal", effect);
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("is-visible");
    else e.target.classList.remove("is-visible");
  });
}, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
function initSwipeCarousel(){
  const track = document.getElementById("benefitTrack");
  if(!track) return;
  const items = Array.from(track.querySelectorAll(".benefit-item"));
  const dotsWrap = document.getElementById("benefitDots");
  const prev = document.getElementById("benefitPrev");
  const next = document.getElementById("benefitNext");

  dotsWrap.innerHTML = "";
  const dots = items.map((_,i)=>{
    const d=document.createElement("span");
    d.className="dot-i";
    d.addEventListener("click",()=>items[i].scrollIntoView({behavior:"smooth",inline:"center"}));
    dotsWrap.appendChild(d);
    return d;
  });

  function activeByCenter(){
    const r = track.getBoundingClientRect();
    const center = r.left + r.width/2;
    let best = 0, bestDist = Infinity;
    items.forEach((el,i)=>{
      const cr = el.getBoundingClientRect();
      const c = cr.left + cr.width/2;
      const dist = Math.abs(center - c);
      if(dist < bestDist){bestDist = dist; best = i;}
    });
    items.forEach((el,i)=>el.classList.toggle("is-active", i===best));
    dots.forEach((d,i)=>d.classList.toggle("is-active", i===best));
    prev.disabled = best===0;
    next.disabled = best===items.length-1;
  }

  function scrollTo(delta){
    const r = track.getBoundingClientRect();
    const center = r.left + r.width/2;
    let best = 0, bestDist = Infinity;
    items.forEach((el,i)=>{
      const cr = el.getBoundingClientRect();
      const c = cr.left + cr.width/2;
      const dist = Math.abs(center - c);
      if(dist < bestDist){bestDist = dist; best = i;}
    });
    let target = Math.min(items.length-1, Math.max(0, best + delta));
    items[target].scrollIntoView({behavior:"smooth", inline:"center"});
  }

  track.addEventListener("scroll", ()=>{ window.requestAnimationFrame(activeByCenter); }, {passive:true});
  window.addEventListener("resize", activeByCenter);
  prev.addEventListener("click", ()=>scrollTo(-1));
  next.addEventListener("click", ()=>scrollTo(1));
  activeByCenter();

  items.forEach((el)=>{
    el.classList.add("benefit-tilt");
    el.addEventListener("pointermove",(e)=>{
      const r=el.getBoundingClientRect();
      const rx=((e.clientY-r.top)/r.height-.5)*6;
      const ry=((e.clientX-r.left)/r.width-.5)*-6;
      el.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener("pointerleave",()=>{el.style.transform="";});
    attachRipple(el);
  });
}
initSwipeCarousel();
function initProcess(){
  const list = document.getElementById("procList");
  const bar = document.getElementById("procBar");
  if(!list || !bar) return;
  const cards = Array.from(list.querySelectorAll(".proc-card"));

  function setBar(idx){
    const w = ((idx+1)/cards.length)*100;
    bar.style.width = `${w}%`;
  }

  cards.forEach((card,idx)=>{
    const head = card.querySelector(".proc-head");
    const body = card.querySelector(".proc-body");
    const inner = card.querySelector(".proc-body-inner");
    attachRipple(head);
    card.classList.add("benefit-tilt");
    head.addEventListener("pointermove",(e)=>{
      const r=card.getBoundingClientRect();
      const rx=((e.clientY-r.top)/r.height-.5)*6;
      const ry=((e.clientX-r.left)/r.width-.5)*-6;
      card.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    head.addEventListener("pointerleave",()=>{card.style.transform="";});
    head.addEventListener("click", ()=>{
      const isOpen = card.classList.toggle("open");
      if(isOpen){
        body.style.maxHeight = inner.scrollHeight + "px";
        setBar(idx);
      }else{
        body.style.maxHeight = "0px";
      }
    });
    const ioStep = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(!card.classList.contains("open")) return;
        if(e.isIntersecting) setBar(idx);
      });
    },{threshold:.6});
    ioStep.observe(card);
  });
}
initProcess();
document.querySelectorAll(".btn-ghost,.btn-solid,.service-card").forEach(attachRipple);
document.querySelectorAll(".cat-btn,.cat-card").forEach(attachRipple);
document.querySelectorAll(".lic-btn,.lic-card").forEach(attachRipple);
document.querySelectorAll(".tg-btn").forEach(attachRipple);
document.querySelectorAll(".tg-fab").forEach(attachRipple);
function fbLead(label){ if (window.fbq) fbq('track','Lead',{content_name: label}); }
document.querySelectorAll('a[data-fb-lead]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const label = a.getAttribute('data-fb-lead') || 'Lead';
    fbLead(label);
    if(a.target !== '_blank'){
      e.preventDefault();
      const url = a.href;
      setTimeout(()=>{ window.location.href = url; }, 180);
    }
  });
});
