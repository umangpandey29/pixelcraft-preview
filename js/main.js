(function(){
"use strict";
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var REDUCED=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
requestAnimationFrame(function(){setTimeout(function(){document.body.classList.add("loaded")},60)});
if(window.matchMedia("(pointer:coarse)").matches){document.body.classList.add("touch")}
// ---------- CURSOR ----------
var cur=$("#cursor"),ring=$("#cursorRing"),cx=innerWidth/2,cy=innerHeight/2,rx=cx,ry=cy;
if(cur&&!document.body.classList.contains("touch")){
 document.addEventListener("mousemove",function(e){cx=e.clientX;cy=e.clientY;
  cur.style.transform="translate("+(cx-4)+"px,"+(cy-4)+"px)";
  var t=e.target.closest("a,button,input,select,textarea,.rcard,.bcell");
  document.body.classList.toggle("c-hover",!!t);
 });
(function loop(){rx+=(cx-rx)*.16;ry+=(cy-ry)*.16;ring.style.transform="translate("+(rx-20)+"px,"+(ry-20)+"px)";requestAnimationFrame(loop)})();
}
// ---------- MAGNETIC BUTTONS ----------
if(!REDUCED&&!document.body.classList.contains("touch")){
 $$(".mag").forEach(function(m){
  m.addEventListener("mousemove",function(e){
   var r=m.getBoundingClientRect();
   var x=(e.clientX-r.left-r.width/2)*.22,y=(e.clientY-r.top-r.height/2)*.32;
   m.style.transform="translate("+x+"px,"+y+"px)";
  });
  m.addEventListener("mouseleave",function(){m.style.transform=""});
 });
 // ---------- TILT CARDS ----------
 $$(".tilt").forEach(function(c){
  c.addEventListener("mousemove",function(e){
   var r=c.getBoundingClientRect();
   var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   c.style.transform="perspective(900px) rotateX("+(-y*4)+"deg) rotateY("+(x*5)+"deg) translateY(-3px)";
  });
  c.addEventListener("mouseleave",function(){c.style.transform=""});
 });
}
// ---------- COUNTERS ----------
var cObs=new IntersectionObserver(function(es){
 es.forEach(function(en){
  if(!en.isIntersecting)return;cObs.unobserve(en.target);
  var el=en.target,end=parseInt(el.dataset.count,10),t0=null;
  if(REDUCED){el.textContent=end;return}
  function tick(ts){
   if(!t0)t0=ts;var p=Math.min((ts-t0)/1400,1);p=1-Math.pow(1-p,3);
   el.textContent=Math.round(end*p);
   if(p<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
 });
},{threshold:.4});
$$(".cnt").forEach(function(el){cObs.observe(el)});
// ---------- PROGRESS BARS ----------
var pObs=new IntersectionObserver(function(es){
 es.forEach(function(en){if(en.isIntersecting){en.target.classList.add("go");pObs.unobserve(en.target)}});
},{threshold:.5});
$$(".pbar").forEach(function(el){el.style.setProperty("--w",el.dataset.w);pObs.observe(el)});
// ---------- REVEALS ----------
var rObs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("visible");rObs.unobserve(e.target)}})},{threshold:.15});
$$(".js-reveal").forEach(function(el){rObs.observe(el)});
// ---------- DRAWER ----------
var dB=$("#drawerBtn");
if(dB)dB.addEventListener("click",function(){document.body.classList.toggle("drawer-open")});
var dBack=$("#drawerBack");
if(dBack)dBack.addEventListener("click",function(){document.body.classList.remove("drawer-open")});
$$(".snav a").forEach(function(a){a.addEventListener("click",function(){document.body.classList.remove("drawer-open")})});
// ---------- FORM ----------
var form=$("#contactForm");
if(form)form.addEventListener("submit",function(ev){
 ev.preventDefault();var ok=true;
 function check(id,v){var i=$("#"+id),f=i.closest(".field");v?f.classList.remove("invalid"):(f.classList.add("invalid"),ok=false)}
 check("fName",$("#fName").value.trim().length>1);
 check("fEmail",/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($("#fEmail").value.trim()));
 check("fType",$("#fType").value!=="");
 check("fMsg",$("#fMsg").value.trim().length>=10);
 var n=$(".form-note");
 if(ok){n.className="form-note success";n.textContent="Thanks — enquiry noted. We reply from hello@pixelcraftstudio.in, usually same day.";form.reset()}
 else{n.className="form-note error";n.textContent="Please fix the highlighted fields."}
});
// ---------- PROJECT DETAIL ----------
var wrap=$("#pdWrap");
if(wrap&&window.PXCASES){
 var id=new URLSearchParams(location.search).get("id")||"px-001";
 var c=window.PXCASES.filter(function(x){return x.id===id})[0]||window.PXCASES[0];
 document.title=c.client+" — "+c.title+" | PixelCraft Studio";
 wrap.innerHTML='<div class="pd-poster" style="--g:'+c.grad+'"><span class="pd-code">PX·'+String(window.PXCASES.indexOf(c)+1).padStart(3,"0")+'</span></div>'+
 '<div class="pd-body js-reveal"><p class="pd-tags">'+c.tag+' / '+c.year+'</p><h1 class="pd-name">'+c.title+'</h1><p class="pd-client">'+c.client+'</p><p class="pd-blurb">'+c.blurb+'</p>'+
 '<h3>The challenge</h3><p>'+c.ch+'</p><h3>The approach</h3><p>'+c.ap+'</p><h3>The outcome</h3><p>'+c.out+'</p>'+
 '<div class="pd-stats">'+c.stats.map(function(s){return '<div><span class="st">'+s[0]+'</span><span class="sl">'+s[1]+'</span></div>'}).join("")+'</div>'+
 '<div class="pbar-row"><span class="mono dim">IMPACT SCORE</span><div class="pbar" data-w="'+c.impact+'"><span></span></div><b class="mono amber">'+c.impact+'%</b></div>'+
 '<a class="pill-cta mag" href="contact.html">Start a project like this <i>→</i></a></div>';
 var pb=wrap.querySelector(".pbar");pb.style.setProperty("--w",c.impact);pObs.observe(pb);
 var others=window.PXCASES.filter(function(x){return x.id!==c.id});
 $("#pdNext").innerHTML='<a href="project.html?id='+others[0].id+'"><span class="nx">'+others[0].client+'<i>Next case — '+others[0].title+'</i></span><span style="color:var(--amber);font-size:1.6rem">→</span></a><a href="work.html"><span class="nx">The archive<i>Back to the shelf</i></span><span style="color:var(--amber);font-size:1.6rem">→</span></a>';
 $$(".js-reveal",wrap).forEach(function(el){rObs.observe(el)});
}
})();
