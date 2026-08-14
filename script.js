const LOGO_DATA = "assets/images/logo_data.png";
  ['logoHeader','logoFooter'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.src = LOGO_DATA;
  });

  // ==========================================
  // CONFIGURATION FIREBASE (À REMPLIR PAR LE CLIENT)
  // ==========================================
  const firebaseConfig = {
    apiKey: "AIzaSyDCmvE_z8N1TFGvLMDYtfIUIzAcqKyIfY0",
    authDomain: "halawa-6f539.firebaseapp.com",
    projectId: "halawa-6f539",
    storageBucket: "halawa-6f539.firebasestorage.app",
    messagingSenderId: "605940071834",
    appId: "1:605940071834:web:217fc554f43b3294ebce23",
    measurementId: "G-BY23NJ6JSX"
  };

  // Initialisation (S'exécute uniquement si la config est présente)
  let db;
  if(firebaseConfig.projectId) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
  } else {
    console.warn("⚠️ Firebase non configuré. Les produits ne s'afficheront pas.");
  }

  // État global
  let products = [];
  let promoRules = { promo_2: -50, promo_3_free: true };

  // Optimisation Cloudinary
  function optimizeImg(url) {
    if(!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_500/');
  }

  // Rendu de l'image avec badge si épuisé
  function dotHTML(p, sizeClass) {
    let html = `<img class="cap-photo ${sizeClass||''}" src="${optimizeImg(p.img)}" alt="${p.name}">`;
    if (p.sold_out) {
      html += `<div class="sold-out-overlay"></div><div class="sold-out-badge">ÉPUISÉ</div>`;
    }
    return html;
  }



  const grid = document.getElementById('wallGrid');
  
  function renderProducts() {
    grid.innerHTML = '';
    products.forEach((p) => {
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.tabIndex = 0; // Accessibilité : navigation au clavier
      
      const openProd = () => openProduct(p.id);
      slot.addEventListener('click', openProd);
      slot.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProd();
        }
      });
      
      slot.innerHTML = `
        <div class="peg"></div>
        <div class="slot-frame">${dotHTML(p)}</div>
        <div class="slot-name">${p.name}</div>
        <div class="slot-footer"><span class="price-tag">${p.price} DH</span></div>
      `;
      grid.appendChild(slot);
    });
  }

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
    
    // Dynamic promo note
    let promoNotes = [];
    if(promoRules.promo_2) promoNotes.push(`2 achetées = -${promoRules.promo_2} DH`);
    if(promoRules.promo_3_free) promoNotes.push(`3 achetées = 4ème offerte`);
    document.getElementById('pPromoNote').textContent = promoNotes.length ? `🎁 Promo : ${promoNotes.join(' | ')}` : '';
    
    // Check if sold out
    const addCartBtn = document.getElementById('addCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');
    
    if(currentProduct.sold_out) {
      addCartBtn.textContent = "ÉPUISÉ";
      addCartBtn.style.opacity = "0.5";
      addCartBtn.style.pointerEvents = "none";
      
      buyNowBtn.style.opacity = "0.5";
      buyNowBtn.style.pointerEvents = "none";
    } else {
      addCartBtn.textContent = "Ajouter";
      addCartBtn.style.opacity = "1";
      addCartBtn.style.pointerEvents = "auto";
      
      buyNowBtn.style.opacity = "1";
      buyNowBtn.style.pointerEvents = "auto";
    }

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
    let freeUnits = 0;
    let discount = 0;
    
    if (promoRules.promo_3_free) {
      freeUnits = Math.floor(qty / 4);
    }
    if (promoRules.promo_2) {
      const remainder = qty % 4;
      discount = Math.floor(remainder / 2) * Math.abs(promoRules.promo_2);
    }
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
    return `<img class="dot-sm" src="${optimizeImg(p.img)}" alt="${p.name}">`;
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
            <button class="cart-item-trash" data-act="remove" data-id="${id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
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
    
    // Update Promo Hint Bar
    const hintBar = document.getElementById('cartPromoHint');
    if (totalQty === 0) {
      hintBar.style.display = 'none';
    } else {
      hintBar.style.display = 'block';
      const remainder = totalQty % 4;
      if (promoRules.promo_3_free && remainder === 0 && totalQty > 0) {
        hintBar.textContent = "Félicitations, 1 casquette OFFERTE ! 🎁";
      } else if (promoRules.promo_3_free && remainder === 3) {
        hintBar.textContent = "Plus qu'1 casquette pour avoir la 4ème GRATUITE ! 🔥";
      } else if (promoRules.promo_2 && remainder === 2) {
        if (promoRules.promo_3_free) {
           hintBar.textContent = `Réduction appliquée ! Ajoute 1 casquette pour la 4ème offerte ! 🎁`;
        } else {
           hintBar.textContent = `Félicitations, réduction de -${promoRules.promo_2} DH appliquée ! 🎉`;
        }
      } else if (promoRules.promo_2 && remainder === 1) {
        hintBar.textContent = `Encore 1 casquette pour débloquer -${promoRules.promo_2} DH !`;
      } else {
        hintBar.style.display = 'none';
      }
    }

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

  // ---- Fetch from Firebase ----
  async function loadData() {
    if(!db) return; // Si la config manque, ne rien faire
    
    // Afficher les squelettes
    grid.innerHTML = Array(6).fill(`
      <div class="slot">
        <div class="slot-frame skeleton skeleton-box"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    `).join('');

    try {
      // Fetch Promotions
      const promoDoc = await db.collection('settings').doc('promotions').get();
      if(promoDoc.exists) {
        const pData = promoDoc.data();
        promoRules = pData;
        if(pData.text_bandeau) {
          document.querySelector('.promo-track').innerHTML = pData.text_bandeau + " &middot; " + pData.text_bandeau;
        }
      }

      // Fetch Products
      const snap = await db.collection('products').orderBy('created_at', 'desc').get();
      products = [];
      snap.forEach(doc => {
        products.push(doc.data());
      });
      renderProducts();

    } catch (err) {
      console.error("Erreur Firebase :", err);
      grid.innerHTML = "<p>Erreur de chargement des produits.</p>";
    }
  }

  loadData();