/* 초월 v2 — 공통 스크립트: 부드러운 스크롤 · 등장 · 패럴랙스 · 헤더 · 메뉴 */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var useLenis=document.documentElement.dataset.lenis!=='off';
  var lenis=null;
  if(window.Lenis&&!reduce&&useLenis){
    lenis=new Lenis({duration:1.25,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t))},smoothWheel:true});
    (function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(0);
    window.__lenis=lenis;
    // 같은 페이지 앵커는 부드럽게
    document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href');if(id.length>1&&document.querySelector(id)){e.preventDefault();lenis.scrollTo(id,{offset:-80})}})});
  }
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rv,.mask').forEach(function(el){io.observe(el)});
  var pxs=[].slice.call(document.querySelectorAll('.px'));
  function para(){
    if(reduce)return;var vh=innerHeight;
    pxs.forEach(function(el){var r=el.parentNode.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;
      el.style.transform='translate3d(0,'+((r.top+r.height/2-vh/2)*parseFloat(el.dataset.speed||0)).toFixed(1)+'px,0)'});
  }
  var head=document.getElementById('vh'),menu=document.getElementById('vMenu'),btn=document.getElementById('vBurger'),last=0;
  function onScroll(){var y=window.scrollY;head.classList.toggle('solid',y>40);head.classList.toggle('hide',y>last&&y>400&&menu.hidden);last=y;para()}
  if(lenis)lenis.on('scroll',onScroll);else addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',para);onScroll();
  btn.addEventListener('click',function(){var o=menu.hidden;menu.hidden=!o;btn.setAttribute('aria-expanded',String(o));btn.setAttribute('aria-label',o?'메뉴 닫기':'메뉴 열기');if(lenis){o?lenis.stop():lenis.start()}});
  // 커서 따라오는 사진 (있을 때만)
  var peek=document.getElementById('peek');
  if(peek&&matchMedia('(hover:hover)').matches&&!reduce){
    var pims=peek.querySelectorAll('img'),px=0,py=0,cx=0,cy=0;
    document.querySelectorAll('[data-peek]').forEach(function(li){
      li.addEventListener('mouseenter',function(){peek.classList.add('on');pims.forEach(function(im,i){im.classList.toggle('on',i==li.dataset.peek)})});
      li.addEventListener('mouseleave',function(){peek.classList.remove('on')});
    });
    addEventListener('mousemove',function(e){px=e.clientX;py=e.clientY});
    (function loop(){cx+=(px-cx)*.14;cy+=(py-cy)*.14;peek.style.left=cx+'px';peek.style.top=cy+'px';requestAnimationFrame(loop)})();
  }
})();
