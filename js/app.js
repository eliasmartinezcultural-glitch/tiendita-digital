(() => {
  "use strict";
  const c=window.OCARINA_CONFIG||{},$=s=>document.querySelector(s);
  const safe=v=>String(v??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
  const wa=m=>{const n=String(c.whatsapp||"").replace(/\D/g,"");return n?"https://wa.me/"+n+"?text="+encodeURIComponent(m):""};
  const contact=m=>wa(m||c.contactMessage||"Hola, quiero consultar.");
  const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)};
  ["#ad-contact","#advertise-cta","#product-contact"].forEach((s,i)=>{const e=$(s),u=contact(i===1?c.adMessage:i===2?c.contactMessage:c.adMessage);if(u){e.href=u;e.target="_blank";e.rel="noopener"}else e.addEventListener("click",ev=>{ev.preventDefault();toast("Falta configurar el WhatsApp en js/config.js.")})});
  const products=(c.products||[]).slice(0,3);
  $("#product-grid").innerHTML=products.map(p=>'<article class="product"><div class="product-art '+safe(p.art)+'"><div class="mock"><small>'+safe(p.artTop)+'</small><b>'+safe(p.artTitle)+'</b><small>'+safe(p.artBottom)+'</small></div></div><div class="info"><label>'+safe(p.category)+'</label><h3>'+safe(p.name)+'</h3><p>'+safe(p.description)+'</p><div class="bottom"><strong>'+safe(p.priceLabel)+'</strong><a href="#" data-id="'+safe(p.id)+'">Consultar ↗</a></div></div></article>').join("");
  document.querySelectorAll("[data-id]").forEach(a=>a.addEventListener("click",ev=>{ev.preventDefault();const p=products.find(x=>x.id===a.dataset.id),u=p?.purchaseUrl||contact(p?.detailMessage);if(u)window.open(u,"_blank","noopener");else toast("Producto en preparación. Configurá WhatsApp para recibir consultas.")}));
  const ads=c.ads||[],main=ads.find(a=>a.slot==="principal"&&a.active),secondary=ads.filter(a=>a.slot==="secundario"&&a.active).slice(0,2),adUrl=a=>a.link||contact(c.adMessage)||"#contacto";
  const m=main||{headline:"Tu negocio puede estar acá",description:"Publicidad mensual para comercios y emprendimientos de San Patricio del Chañar.",label:"ESPACIO PUBLICITARIO"};
  $("#ad-main").innerHTML='<div class="adbox"><div><small>'+safe(m.label)+'</small><br><strong>'+safe(m.headline)+'</strong><p>'+safe(m.description)+'</p></div><a href="'+safe(adUrl(m))+'"> '+(main?"Conocer anunciante ↗":"Anunciá acá ↗")+'</a></div>';
  $("#ad-strip").innerHTML=secondary.map(a=>'<article class="adcard"><div><small>'+safe(a.label)+'</small><br><strong>'+safe(a.headline)+'</strong><p>'+safe(a.description)+'</p></div><a href="'+safe(adUrl(a))+'">Ver ↗</a></article>').join("");
  $("#year").textContent=new Date().getFullYear();
})();