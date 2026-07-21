(function(){
  'use strict';
  var body=document.body;
  if(!body) return;

  // Accessibility: skip link
  if(!document.querySelector('.skip-link')){
    var skip=document.createElement('a');
    skip.className='skip-link';
    skip.href='#main-content';
    skip.textContent='본문 바로가기';
    body.insertBefore(skip, body.firstChild);
  }
  var main=document.querySelector('main');
  if(main && !main.id) main.id='main-content';

  // Current navigation state
  var path=(location.pathname.replace(/index\.html$/,'') || '/');
  document.querySelectorAll('.primary-nav a').forEach(function(a){
    var href=(a.getAttribute('href')||'').replace(/index\.html$/,'');
    if(href==='/' ? path==='/' : path.indexOf(href)===0){
      a.setAttribute('aria-current','page');
    }
  });

  // Mobile navigation control
  var nav=document.querySelector('.primary-nav');
  var headerMain=document.querySelector('.header-main .header-inner');
  if(nav && headerMain && !document.querySelector('.nav-toggle')){
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='nav-toggle';
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-controls','primary-navigation');
    btn.innerHTML='<span></span><span></span><span></span><b>메뉴</b>';
    nav.id='primary-navigation';
    headerMain.appendChild(btn);
    btn.addEventListener('click',function(){
      var open=body.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
  }

  // Performance and security defaults
  document.querySelectorAll('img').forEach(function(img,idx){
    if(!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
    if(idx>0 && !img.hasAttribute('loading')) img.setAttribute('loading','lazy');
  });
  document.querySelectorAll('a[target="_blank"]').forEach(function(a){
    var rel=(a.getAttribute('rel')||'').split(/\s+/).filter(Boolean);
    ['noopener','noreferrer'].forEach(function(v){if(rel.indexOf(v)<0) rel.push(v);});
    a.setAttribute('rel',rel.join(' '));
  });
})();
