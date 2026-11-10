(() => {
  "use strict";
  const cfg = window.TIENDITA_SUPABASE_CONFIG || {};
  if (!cfg.url || !cfg.anonKey || !window.supabase?.createClient) {
    console.info("Tiendita Digital: Supabase todavía no está configurado; se muestra el catálogo de respaldo.");
    return;
  }

  const client = window.supabase.createClient(cfg.url, cfg.anonKey);
  window.TIENDITA_DB = client;
  const $ = (selector) => document.querySelector(selector);
  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));
  const whatsapp = (message) => {
    const number = String(window.OCARINA_CONFIG?.whatsapp || "").replace(/\D/g, "");
    return number ? "https://wa.me/" + number + "?text=" + encodeURIComponent(message || "Hola, quiero consultar.") : "";
  };

  function renderProducts(rows) {
    const grid = $("#product-grid");
    if (!grid) return;
    if (!rows.length) {
      grid.innerHTML = '<p class="center">Estamos preparando los primeros productos. Volvé pronto.</p>';
      return;
    }
    grid.innerHTML = rows.map((p) => {
      const image = p.image_url
        ? '<img src="' + safe(p.image_url) + '" alt="' + safe(p.name) + '" loading="lazy">'
        : '<div class="mock"><small>' + safe(p.category) + '</small><b>' + safe(p.name) + '</b><small>TIENDITA DIGITAL</small></div>';
      const message = p.detail_message || ("Hola, quiero información sobre " + p.name + ".");
      const link = p.purchase_url || whatsapp(message);
      return '<article class="product"><div class="product-art">' + image + '</div><div class="info"><label>' +
        safe(p.category) + '</label><h3>' + safe(p.name) + '</h3><p>' + safe(p.description) +
        '</p><div class="bottom"><strong>' + safe(p.price_label || (p.price != null ? "$ " + p.price : "Consultar")) +
        '</strong><a href="' + safe(link || "#contacto") + '" ' + (link ? 'target="_blank" rel="noopener"' : '') +
        '>Consultar ↗</a></div></div></article>';
    }).join("");
  }

  function renderAds(rows) {
    const now = Date.now();
    const active = rows.filter((a) =>
      (!a.starts_at || new Date(a.starts_at).getTime() <= now) &&
      (!a.ends_at || new Date(a.ends_at).getTime() >= now)
    );
    const main = active.find((a) => a.slot === "principal");
    const secondary = active.filter((a) => a.slot === "secundario").slice(0, 2);
    const contact = whatsapp(window.OCARINA_CONFIG?.adMessage);
    const mainBox = $("#ad-main");
    const strip = $("#ad-strip");
    const ad = main || {
      headline:"Tu negocio puede estar acá",
      description:"Publicidad mensual para comercios y emprendimientos.",
      label:"ESPACIO PUBLICITARIO"
    };
    if (mainBox) mainBox.innerHTML = '<div class="adbox"><div><small>' + safe(ad.label) +
      '</small><br><strong>' + safe(ad.headline) + '</strong><p>' + safe(ad.description) +
      '</p></div><a href="' + safe(ad.link_url || contact || "#contacto") +
      '" target="_blank" rel="noopener">' + (main ? "Conocer anunciante ↗" : "Anunciá acá ↗") + '</a></div>';
    if (strip) strip.innerHTML = secondary.map((a) =>
      '<article class="adcard"><div><small>' + safe(a.label) + '</small><br><strong>' +
      safe(a.headline) + '</strong><p>' + safe(a.description) + '</p></div><a href="' +
      safe(a.link_url || contact || "#contacto") + '" target="_blank" rel="noopener">Ver ↗</a></article>'
    ).join("");
  }

  async function load() {
    try {
      const [productsResult, adsResult] = await Promise.all([
        client.from("products").select("*").eq("is_published", true).order("sort_order"),
        client.from("ads").select("*").eq("is_active", true).order("sort_order")
      ]);
      if (productsResult.error) throw productsResult.error;
      if (adsResult.error) throw adsResult.error;
      renderProducts(productsResult.data || []);
      renderAds(adsResult.data || []);
      document.documentElement.dataset.supabase = "connected";
      console.info("Tiendita Digital: catálogo y publicidad cargados desde Supabase.");
    } catch (error) {
      console.error("No se pudo cargar el contenido desde Supabase:", error.message || error);
      document.documentElement.dataset.supabase = "error";
    }
  }

  load();
})();
