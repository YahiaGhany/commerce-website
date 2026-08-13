const LOGO_DATA = "assets/images/logo_data.png";
  ['logoHeader','logoFooter'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.src = LOGO_DATA;
  });

  const products = [
    {id:0, name:"Orange NY", price:199, img:"orange_ny", desc:"Casquette 47 New York Yankees, couleur orange avec logo NY blanc brodé. Coupe ajustée, visière incurvée."},
    {id:1, name:"Bordeaux LA", price:199, img:"bordeaux_la", desc:"Casquette 47 LA (Los Angeles), couleur bordeaux avec logo LA blanc brodé. Coupe ajustée, visière incurvée."},
    {id:2, name:"Camel NY", price:199, img:"camel_ny", desc:"Casquette 47 New York Yankees, couleur camel avec logo NY ton sur ton. Coupe ajustée, visière incurvée."},
    {id:3, name:"Vert Pétant NY", price:199, img:"vertpetant_ny", desc:"Casquette 47 New York Yankees, couleur vert pétant avec logo NY noir brodé. Coupe ajustée, visière incurvée."},
    {id:4, name:"Rose NY", price:199, img:"rose_ny", desc:"Casquette 47 New York Yankees, couleur rose avec logo NY blanc brodé. Coupe ajustée, visière incurvée."},
    {id:5, name:"Violet NY", price:199, img:"violet_ny", desc:"Casquette 47 New York Yankees, couleur violet avec logo NY blanc brodé. Coupe ajustée, visière incurvée."},
    {id:6, name:"Bleu Marine NY", price:199, img:"bleumarine_ny", desc:"Casquette 47 New York Yankees, couleur bleu marine avec logo NY blanc brodé. Coupe ajustée, visière incurvée."},
    {id:7, name:"Bleu Ciel NY", price:199, img:"bleuciel_ny", desc:"Casquette 47 New York Yankees, couleur bleu ciel avec logo NY blanc brodé. Coupe ajustée, visière incurvée."},
    {id:8, name:"Vert Foncé NY (Logo Noir)", price:199, img:"vertfonce_ny", desc:"Casquette 47 New York Yankees, couleur vert foncé avec logo NY noir brodé. Coupe ajustée, visière incurvée."},
    {id:9, name:"Lavande NY", price:199, img:"lavande_ny", desc:"Casquette 47 New York Yankees, couleur lavande avec logo NY blanc brodé. Coupe ajustée, visière incurvée."},
    {id:10, name:"Noir NY (Logo Rouge)", price:199, img:"noir_ny", desc:"Casquette 47 New York Yankees, couleur noir avec logo NY rouge brodé. Coupe ajustée, visière incurvée."},
    {id:11, name:"Bleu Roi NY", price:199, img:"bleuroi_ny", desc:"Casquette 47 New York Yankees, couleur bleu roi avec logo NY blanc brodé. Coupe ajustée, visière incurvée."},
    {id:12, name:"Vert Foncé NY Script", price:199, img:"vertfonce_script_ny", desc:"Casquette 47 New York Yankees, couleur vert foncé avec écriture \"Yankees\" dorée brodée. Coupe ajustée, visière incurvée."},
    {id:13, name:"Crème LA", price:199, img:"creme_la", desc:"Casquette New Era LA (Los Angeles), couleur crème et vert foncé avec logo LA bleu et broderie rose. Coupe ajustée, visière incurvée."},
    {id:14, name:"Rouge NY", price:199, img:"rouge_ny", desc:"Casquette 47 New York Yankees, couleur rouge avec logo NY blanc brodé. Coupe ajustée, visière incurvée."},
    {id:15, name:"Vert Foncé NY (Logo Blanc)", price:199, img:"vertfonce_ny_blanc", desc:"Casquette 47 New York Yankees, couleur vert foncé avec logo NY blanc brodé. Coupe ajustée, visière incurvée."},
    {id:16, name:"Noir NY (Logo Blanc)", price:199, img:"noir_ny_blanc", desc:"Casquette 47 New York Yankees, couleur noir avec logo NY blanc brodé. Coupe ajustée, visière incurvée."},
    {id:17, name:"Jaune Stone Island", price:199, img:"jaune_stoneisland", desc:"Casquette 47 Stone Island, couleur jaune avec écusson compass brodé noir. Coupe ajustée, visière incurvée."},
  ];

  const CAP_IMAGES = {
    orange_ny: "assets/images/Orange.png",
    bordeaux_la: "assets/images/Bordeaux LA.png",
    camel_ny: "assets/images/Camel.png",
    vertpetant_ny: "assets/images/Vert Petant.png",
    rose_ny: "assets/images/Rose.png",
    violet_ny: "assets/images/Violet.png",
    bleumarine_ny: "assets/images/Bleu marine.png",
    bleuciel_ny: "assets/images/Bleu ciel.png",
    vertfonce_ny: "assets/images/Vert Foncé NY.png",
    lavande_ny: "assets/images/Lavande.png",
    noir_ny: "assets/images/Noir Logo Rouge.png",
    bleuroi_ny: "assets/images/Bleu Roi.png",
    vertfonce_script_ny: "assets/images/Vert Foncé.png",
    creme_la: "assets/images/CrémeLA.png",
    rouge_ny: "assets/images/Rouge.png",
    vertfonce_ny_blanc: "assets/images/Vert Logo blanc.png",
    noir_ny_blanc: "assets/images/Noir logo Blanc.png",
    jaune_stoneisland: "assets/images/Jaune Stone Island.png",
  };

  function dotHTML(p, sizeClass){
    return `<img class="cap-photo ${sizeClass||''}" src="${CAP_IMAGES[p.img]}" alt="${p.name}">`;
  }

  // ---- Render wall grid ----
  const grid = document.getElementById('wallGrid');
  products.forEach((p) => {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.addEventListener('click', () => openProduct(p.id));
    slot.innerHTML = `
      <div class="peg"></div>
      <div class="slot-frame">${dotHTML(p)}</div>
      <div class="slot-name">${p.name}</div>
      <div class="slot-footer"><span class="price-tag">${p.price} DH</span></div>
    `;
    grid.appendChild(slot);
  });

  // ---- View routing (store vs product) ----
  const storeView = document.getElementById('storeView');
  const productView = document.getElementById('productView');
  let currentProduct = null;
  let currentQty = 1;

  function openProduct(id){
    currentProduct = products.find(p => p.id === id);
    currentQty = 1;
    document.getElementById('pVisual').innerHTML = dotHTML(currentProduct);
    document.getElementById('pName').textContent = currentProduct.name;
    document.getElementById('pPrice').textContent = currentProduct.price + ' DH';
    document.getElementById('pDesc').textContent = currentProduct.desc;
    document.getElementById('qtyVal').textContent = currentQty;
    storeView.style.display = 'none';
    productView.style.display = 'block';
    window.scrollTo({top:0, behavior:'instant' in document.documentElement.style ? 'instant' : 'auto'});
  }
  function backToStore(){
    productView.style.display = 'none';
    storeView.style.display = 'block';
  }
  document.getElementById('backToStore').addEventListener('click', backToStore);

  document.getElementById('qtyMinus').addEventListener('click', ()=>{ currentQty = Math.max(1, currentQty-1); document.getElementById('qtyVal').textContent = currentQty; });
  document.getElementById('qtyPlus').addEventListener('click', ()=>{ currentQty = Math.min(10, currentQty+1); document.getElementById('qtyVal').textContent = currentQty; });

  // ---- Nav links: go to store view then scroll ----
  document.querySelectorAll('[data-nav]').forEach(el=>{
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      const target = el.getAttribute('data-nav');
      backToStore();
      if(target === 'top'){ window.scrollTo({top:0, behavior:'smooth'}); return; }
      requestAnimationFrame(()=>{
        const node = document.getElementById(target);
        if(node) node.scrollIntoView({behavior:'smooth'});
      });
    });
  });

  // ---- Cart state (in-memory only) ----
  let cart = {}; // {productId: qty}

  function cartTotalQty(){ return Object.values(cart).reduce((a,b)=>a+b,0); }
  function cartPromo(){
    const qty = cartTotalQty();
    const groups4 = Math.floor(qty/4);
    const remainder = qty % 4;
    const freeUnits = groups4;
    const discount = Math.floor(remainder/2) * 50;
    return {freeUnits, discount};
  }
  function cartTotalPrice(){
    const {freeUnits, discount} = cartPromo();
    return (cartTotalQty() - freeUnits) * 199 - discount;
  }

  function updateCartCount(){
    document.getElementById('cartCount').textContent = cartTotalQty();
  }

  function addToCart(id, qty){
    cart[id] = (cart[id]||0) + qty;
    updateCartCount();
    renderDrawer();
  }

  function dotHTMLsmall(p){
    return `<img class="dot-sm" src="${CAP_IMAGES[p.img]}" alt="${p.name}">`;
  }

  function renderDrawer(){
    const body = document.getElementById('drawerBody');
    const foot = document.getElementById('drawerFoot');
    const ids = Object.keys(cart).filter(id => cart[id] > 0);
    if(ids.length === 0){
      body.innerHTML = "<div class=\"cart-empty\">Ton panier est vide pour l'instant.<br>Choisis une couleur sur le mur des casquettes.</div>";
      foot.style.display = 'none';
      return;
    }
    foot.style.display = 'block';
    body.innerHTML = ids.map(id=>{
      const p = products.find(pp => pp.id == id);
      const qty = cart[id];
      return `
        <div class="cart-item">
          ${dotHTMLsmall(p)}
          <div class="cart-item-info">
            <b>${p.name}</b>
            <span class="mono">${p.price} DH</span>
          </div>
          <div class="cart-item-actions">
            <button data-act="minus" data-id="${id}">−</button>
            <span class="qv">${qty}</span>
            <button data-act="plus" data-id="${id}">+</button>
            <button class="remove-x" data-act="remove" data-id="${id}">retirer</button>
          </div>
        </div>`;
    }).join('');

    body.querySelectorAll('button[data-act]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-id');
        const act = btn.getAttribute('data-act');
        if(act === 'plus') cart[id] += 1;
        if(act === 'minus') cart[id] = Math.max(0, cart[id]-1);
        if(act === 'remove') cart[id] = 0;
        updateCartCount();
        renderDrawer();
      });
    });

    const totalQty = cartTotalQty();
    const {freeUnits, discount} = cartPromo();
    document.getElementById('sumQty').textContent = totalQty;
    document.getElementById('sumFreeRow').style.display = freeUnits > 0 ? 'flex' : 'none';
    document.getElementById('sumFree').textContent = '−' + freeUnits;
    document.getElementById('sumDiscountRow').style.display = discount > 0 ? 'flex' : 'none';
    document.getElementById('sumDiscount').textContent = '−' + discount + ' DH';
    document.getElementById('sumTotal').textContent = cartTotalPrice() + ' DH';
  };

  // ---- Drawer open/close ----
  const overlayBg = document.getElementById('overlayBg');
  const cartDrawer = document.getElementById('cartDrawer');
  function openDrawer(){ overlayBg.classList.add('open'); cartDrawer.classList.add('open'); renderDrawer(); }
  function closeDrawer(){ overlayBg.classList.remove('open'); cartDrawer.classList.remove('open'); }
  document.getElementById('cartOpenBtn').addEventListener('click', openDrawer);
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  overlayBg.addEventListener('click', ()=>{ closeDrawer(); closeModal(); });

  // ---- Product page actions ----
  document.getElementById('addCartBtn').addEventListener('click', ()=>{
    addToCart(currentProduct.id, currentQty);
    openDrawer();
  });
  document.getElementById('buyNowBtn').addEventListener('click', ()=>{
    addToCart(currentProduct.id, currentQty);
    openCheckout();
  });
  document.getElementById('goCheckoutBtn').addEventListener('click', openCheckout);

  // ---- Checkout modal ----
  const checkoutModal = document.getElementById('checkoutModal');
  function openCheckout(){
    if(cartTotalQty() === 0) return;
    document.getElementById('checkoutForm').style.display = 'block';
    document.getElementById('confirmView').style.display = 'none';
    const ids = Object.keys(cart).filter(id => cart[id] > 0);
    const lines = ids.map(id=>{
      const p = products.find(pp=>pp.id==id);
      return `${cart[id]}× ${p.name}`;
    }).join(' · ');
    const {freeUnits, discount} = cartPromo();
    document.getElementById('modalSummary').innerHTML =
      lines +
      (freeUnits>0 ? `<br>🎁 ${freeUnits} offerte(s) — promo 3+1` : '') +
      (discount>0 ? `<br>🎁 -${discount} DH — promo 2 achetées` : '') +
      `<br><b>Total : ${cartTotalPrice()} DH</b>`;
    checkoutModal.classList.add('open');
    overlayBg.classList.add('open');
  }
  function closeModal(){ checkoutModal.classList.remove('open'); overlayBg.classList.remove('open'); }
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('closeConfirmBtn').addEventListener('click', ()=>{ closeModal(); closeDrawer(); });

  document.getElementById('submitOrderBtn').addEventListener('click', ()=>{
    const name = document.getElementById('custName').value.trim();
    const city = document.getElementById('custCity').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    if(!name || !city || !phone || !address){
      alert('Merci de remplir ton nom, ta ville, ton téléphone et ton adresse.');
      return;
    }
    const ids = Object.keys(cart).filter(id => cart[id] > 0);
    const itemLines = ids.map(id=>{
      const p = products.find(pp=>pp.id==id);
      return `- ${cart[id]}x ${p.name} (${p.price} DH)`;
    }).join('%0A');
    const {freeUnits, discount} = cartPromo();
    const msg =
      `Nouvelle commande Casqueta Halawa%0A%0A` +
      `${itemLines}%0A` +
      (freeUnits>0 ? `Offerte(s) (promo 3+1): ${freeUnits}%0A` : '') +
      (discount>0 ? `Réduction (promo 2 achetées): -${discount} DH%0A` : '') +
      `Total: ${cartTotalPrice()} DH%0A%0A` +
      `Nom: ${encodeURIComponent(name)}%0A` +
      `Ville: ${encodeURIComponent(city)}%0A` +
      `Téléphone: ${encodeURIComponent(phone)}%0A` +
      `Adresse: ${encodeURIComponent(address)}%0A%0A` +
      `Paiement en espèces à la livraison.`;
    window.open(`https://wa.me/212668050505?text=${msg}`, '_blank');
    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('confirmView').style.display = 'block';
  });

  // ---- Reveal on scroll ----
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // ---- Placeholder social links — swap with real Instagram / WhatsApp number ----
  document.getElementById('igLink').href = "https://www.instagram.com/casqueta_halawa";
  document.getElementById('waLink').href = "https://wa.me/212668050505";