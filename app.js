const products=[
 {id:'polo-riviera',name:'Polo Riviera',cat:'polos',price:129,color:'#c9b99f',desc:'Polo tejido · beige'},
 {id:'camisa-capri',name:'Camisa Capri',cat:'camisas',price:149,color:'#e2ded4',desc:'Camisa ligera · marfil'},
 {id:'pantalon-porto',name:'Pantalón Porto',cat:'pantalones',price:169,color:'#9b8e7d',desc:'Pantalón recto · taupe'},
 {id:'loafer-milano',name:'Mocasín Milano',cat:'calzado',price:219,color:'#5e4b3e',desc:'Mocasín clásico · café'},
 {id:'polo-noir',name:'Polo Noir',cat:'polos',price:129,color:'#373533',desc:'Polo cuello abierto · negro'},
 {id:'camisa-oxford',name:'Camisa Oxford',cat:'camisas',price:159,color:'#bfc3c2',desc:'Camisa clásica · gris humo'},
 {id:'pantalon-siena',name:'Pantalón Siena',cat:'pantalones',price:179,color:'#d4c7b0',desc:'Pantalón pinzado · arena'},
 {id:'loafer-verona',name:'Mocasín Verona',cat:'calzado',price:229,color:'#2f2a27',desc:'Mocasín suede · espresso'}
];
let cart=[];
const grid=document.getElementById('productGrid');
const eventLog=[];

// UTM: se capturan una sola vez desde la URL de entrada y se guardan en localStorage.
const params=new URLSearchParams(location.search);
const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id'];
const incoming={}; keys.forEach(k=>{if(params.get(k))incoming[k]=params.get(k)});
if(Object.keys(incoming).length) localStorage.setItem('zaven_utm',JSON.stringify(incoming));
const utm=JSON.parse(localStorage.getItem('zaven_utm')||'{}');

// Punto único de envío de eventos para GTM/GA4 + puente condicional con Meta Pixel.
function track(event,detail={}){
  const payload={event,...detail,...utm,timestamp:new Date().toISOString()};
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push(payload);
  if(typeof fbq==='function'){
    const map={generate_lead:'Lead',add_to_cart:'AddToCart',begin_checkout:'InitiateCheckout',view_item:'ViewContent',search:'Search'};
    if(map[event]) fbq('track',map[event],detail);
  }
  eventLog.unshift(payload); if(eventLog.length>16)eventLog.pop(); renderDebug();
  console.log('[ZAVEN LAB EVENT]',payload);
}

function renderProducts(filter='all'){
  grid.innerHTML='';
  products.filter(p=>filter==='all'||p.cat===filter).forEach(p=>{
    const el=document.createElement('article');el.className='product-card';
    el.innerHTML=`<button class="product-visual view-item" data-id="${p.id}" aria-label="Ver ${p.name}"><span class="shape" style="--p:${p.color}"></span></button><div class="product-meta"><h3>${p.name}</h3><p>${p.desc}</p><div class="card-bottom"><strong>S/ ${p.price}.00</strong><button class="add-btn" data-id="${p.id}">Agregar</button></div></div>`;
    grid.appendChild(el);
  });
}
function applyFilter(filter,source='filter_bar'){
  document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===filter));
  renderProducts(filter);
  track('select_content',{content_type:'product_category',item_id:filter,source});
}
renderProducts();

document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>applyFilter(b.dataset.filter,'filter_bar')));
document.querySelectorAll('.category-link').forEach(a=>a.addEventListener('click',()=>applyFilter(a.dataset.category,'navigation')));

grid.addEventListener('click',e=>{
  const add=e.target.closest('.add-btn');const view=e.target.closest('.view-item');
  if(view){const p=products.find(x=>x.id===view.dataset.id);track('view_item',{item_id:p.id,item_name:p.name,value:p.price,currency:'PEN'});toast(`Explorando ${p.name}`)}
  if(add){const p=products.find(x=>x.id===add.dataset.id);cart.push(p);renderCart();track('add_to_cart',{item_id:p.id,item_name:p.name,value:p.price,currency:'PEN'});toast(`${p.name} agregado`)}
});

function renderCart(){document.getElementById('cartCount').textContent=cart.length;document.getElementById('cartItems').innerHTML=cart.length?cart.map(p=>`<div class="cart-row"><span>${p.name}</span><strong>S/ ${p.price}.00</strong></div>`).join(''):'<p>Tu bolsa está vacía.</p>';document.getElementById('cartTotal').textContent=`S/ ${cart.reduce((s,p)=>s+p.price,0).toFixed(2)}`}
const drawer=document.getElementById('cartDrawer'),searchDrawer=document.getElementById('searchDrawer'),backdrop=document.getElementById('backdrop');
function openDrawer(el){el.classList.add('open');backdrop.classList.add('show');el.setAttribute('aria-hidden','false')}
function closeDrawers(){[drawer,searchDrawer].forEach(x=>{x.classList.remove('open');x.setAttribute('aria-hidden','true')});backdrop.classList.remove('show')}
document.getElementById('cartBtn').onclick=()=>{openDrawer(drawer);track('view_cart')};
document.getElementById('cartClose').onclick=closeDrawers;
document.getElementById('searchBtn').onclick=()=>{openDrawer(searchDrawer);track('search_open')};
document.getElementById('searchClose').onclick=closeDrawers;backdrop.onclick=()=>{closeDrawers();closeMobile()};
document.getElementById('checkoutBtn').onclick = () => {
  if (!cart.length) {
    toast('Tu bolsa está vacía');
    return;
  }
  const total = cart.reduce((s, p) => s + p.price, 0);

  track('begin_checkout', {
    value: total,
    currency: 'PEN',
    items: cart.map(p => p.id)
  });
  const transactionId =
    'ZV-' +
    new Date().toISOString().replace(/\D/g, '').slice(0, 14) +
    '-' +
    Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const purchaseData = {
    transaction_id: transactionId,
    value: total,
    currency: 'PEN',
    items: cart.map(p => ({
      item_id: p.id,
      item_name: p.name,
      price: p.price,
      quantity: 1
    }))
  };

  sessionStorage.setItem(
    'zaven_purchase',
    JSON.stringify(purchaseData)
  );

  location.href = 'gracias-compra.html';
};
// Navegación y submenús.
document.querySelectorAll('.track-nav').forEach(a=>a.addEventListener('click',()=>track('nav_click',{nav_item:a.dataset.nav||a.textContent.trim()})));
document.querySelectorAll('.nav-trigger').forEach(b=>b.addEventListener('click',()=>track('menu_open',{menu_name:b.dataset.menu})));
const mobile=document.getElementById('mobileMenu');
function openMobile(){mobile.classList.add('open');mobile.setAttribute('aria-hidden','false');backdrop.classList.add('show');track('menu_open',{menu_name:'mobile'})}
function closeMobile(){mobile.classList.remove('open');mobile.setAttribute('aria-hidden','true')}
document.getElementById('mobileMenuBtn').onclick=openMobile;document.getElementById('mobileMenuClose').onclick=()=>{closeMobile();backdrop.classList.remove('show')};
mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{closeMobile();backdrop.classList.remove('show')}));

// CTAs generales.
document.querySelectorAll('.track-cta').forEach(a=>a.addEventListener('click',()=>track('cta_click',{cta_name:a.dataset.cta})));
document.getElementById('simulateBtn').onclick=()=>{track('custom_engagement',{action:'lookbook_inspiration'});toast('Explora la colección para completar este look')};

// Formularios / conversiones.
document.getElementById('leadForm').addEventListener('submit',e=>{
 e.preventDefault(); if(!e.currentTarget.reportValidity())return;
 const form=new FormData(e.currentTarget);
 track('generate_lead',{lead_type:'style_advice',interest:form.get('interest')});
 sessionStorage.setItem('zaven_lead_sent','1'); location.href='gracias.html';
});
document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;const form=new FormData(e.currentTarget);track('contact_submit',{reason:form.get('reason')});e.currentTarget.reset();toast('Gracias. Recibimos tu consulta')});
document.getElementById('newsletterForm').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;track('sign_up',{method:'newsletter'});e.currentTarget.reset();toast('¡Ya eres parte de ZAVEN Notes!')});

// Búsqueda interna.
document.getElementById('searchForm').addEventListener('submit',e=>{e.preventDefault();const q=document.getElementById('searchInput').value.trim().toLowerCase();if(!q)return;const hits=products.filter(p=>(p.name+' '+p.desc+' '+p.cat).toLowerCase().includes(q));track('search',{search_term:q,result_count:hits.length});document.getElementById('searchResults').innerHTML=hits.length?hits.map(p=>`<div class="search-hit"><strong>${p.name}</strong><br>${p.desc} · S/ ${p.price}.00</div>`).join(''):'<div class="search-hit">Sin resultados.</div>'});

// Microconversiones: talla, ubicación y FAQ.
document.querySelectorAll('.size-card').forEach(b=>b.addEventListener('click',()=>{track('size_guide_select',{size:b.dataset.size});toast(`Talla ${b.dataset.size} seleccionada`)}));
document.getElementById('locationBtn').onclick=()=>{track('store_locator_click',{city:'Lima'});toast('Atención online disponible en Lima y todo el Perú')};
document.querySelectorAll('.faq-list details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)track('faq_open',{faq_id:d.dataset.faq})}));

function renderDebug(){document.getElementById('utmDebug').textContent=Object.keys(utm).length?JSON.stringify(utm,null,2):'Sin UTM. Prueba ?utm_source=facebook&utm_medium=paid_social&utm_campaign=zaven_lab&utm_content=video_01';document.getElementById('eventLog').innerHTML=eventLog.map(x=>`<div class="event-item"><strong>${x.event}</strong><br>${new Date(x.timestamp).toLocaleTimeString()}</div>`).join('')||'Aún no hay eventos.'}
renderDebug();
const panel=document.getElementById('debugPanel');
function openDebug(){panel.classList.add('show');panel.setAttribute('aria-hidden','false')}
const debugBtn=document.getElementById('debugBtn');if(debugBtn)debugBtn.onclick=openDebug;
document.getElementById('debugClose').onclick=()=>panel.classList.remove('show');
document.getElementById('clearLab').onclick=()=>{localStorage.removeItem('zaven_utm');eventLog.length=0;renderDebug();toast('Panel reiniciado')};
// Acceso técnico sin exponer controles al cliente: añade ?debug=1 a la URL o presiona Ctrl+Shift+D.
if(new URLSearchParams(location.search).get('debug')==='1')openDebug();
document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='d')openDebug()});
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2200)}

track('landing_view',{page_type:'home'});
let scrolled=false;addEventListener('scroll',()=>{if(!scrolled&&(scrollY+innerHeight)/(document.documentElement.scrollHeight)>.75){scrolled=true;track('scroll_75')}});
