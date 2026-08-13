// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDCmvE_z8N1TFGvLMDYtfIUIzAcqKyIfY0",
  authDomain: "halawa-6f539.firebaseapp.com",
  projectId: "halawa-6f539",
  storageBucket: "halawa-6f539.firebasestorage.app",
  messagingSenderId: "605940071834",
  appId: "1:605940071834:web:217fc554f43b3294ebce23",
  measurementId: "G-BY23NJ6JSX"
};

// Configuration Cloudinary
const cloudinaryName = "nfbn26k8";
const cloudinaryPreset = "halawa_preset";

// Init Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// DOM Elements
const promoText = document.getElementById('promoText');
const promo2 = document.getElementById('promo2');
const promo3 = document.getElementById('promo3');
const savePromoBtn = document.getElementById('savePromoBtn');

const productsTableBody = document.getElementById('productsTableBody');
const loadingOverlay = document.getElementById('loadingOverlay');

const productModal = document.getElementById('productModal');
const openAddModalBtn = document.getElementById('openAddModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const saveProductBtn = document.getElementById('saveProductBtn');
const modalTitle = document.getElementById('modalTitle');

// Form Inputs
const prodId = document.getElementById('prodId');
const prodName = document.getElementById('prodName');
const prodPrice = document.getElementById('prodPrice');
const prodDesc = document.getElementById('prodDesc');
const prodImage = document.getElementById('prodImage');
const prodImgUrl = document.getElementById('prodImgUrl');
const imgHelpText = document.getElementById('imgHelpText');

// State
let productsList = [];

// ==============================
// 1. Charger les Promotions
// ==============================
async function loadPromos() {
  try {
    const doc = await db.collection('settings').doc('promotions').get();
    if(doc.exists) {
      const data = doc.data();
      promoText.value = data.text_bandeau || "";
      promo2.value = data.promo_2 || "";
      promo3.value = data.promo_3_free ? "true" : "false";
    }
  } catch (err) {
    console.error("Erreur chargement promos:", err);
  }
}

savePromoBtn.addEventListener('click', async () => {
  loadingOverlay.classList.add('active');
  try {
    await db.collection('settings').doc('promotions').set({
      text_bandeau: promoText.value.trim(),
      promo_2: Number(promo2.value),
      promo_3_free: promo3.value === "true"
    });
    alert("Promotions enregistrées avec succès !");
  } catch (err) {
    alert("Erreur: " + err.message);
  }
  loadingOverlay.classList.remove('active');
});

// ==============================
// 2. Charger les Produits
// ==============================
function loadProducts() {
  // Real-time listener for products
  db.collection('products').orderBy('created_at', 'desc').onSnapshot(snap => {
    productsList = [];
    productsTableBody.innerHTML = "";
    snap.forEach(doc => {
      const p = doc.data();
      productsList.push(p);
      
      const tr = document.createElement('tr');
      const statusHtml = p.sold_out 
        ? `<span class="status-badge status-out">Épuisé</span>`
        : `<span class="status-badge status-ok">Disponible</span>`;
        
      tr.innerHTML = `
        <td><img src="${optimizeImg(p.img)}" class="prod-thumb"></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.price} DH</td>
        <td>${statusHtml}</td>
        <td class="actions">
          <button class="btn btn-small" onclick="editProduct('${p.id}')">Éditer</button>
          <button class="btn btn-small btn-red" onclick="deleteProduct('${p.id}')">Supprimer</button>
          <button class="btn btn-small" style="background:#555;" onclick="toggleStatus('${p.id}', ${p.sold_out})">Stock</button>
        </td>
      `;
      productsTableBody.appendChild(tr);
    });
  }, err => {
    console.error("Erreur chargement produits:", err);
  });
}

// Cloudinary Optimizer
function optimizeImg(url) {
  if(!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_100/');
}

// ==============================
// 3. Actions Produits (CRUD)
// ==============================

// Ouvrir Modal (Ajout)
openAddModalBtn.addEventListener('click', () => {
  modalTitle.textContent = "Ajouter un produit";
  prodId.value = "";
  prodName.value = "";
  prodPrice.value = "199";
  prodDesc.value = "";
  prodImage.value = "";
  prodImgUrl.value = "";
  imgHelpText.textContent = "L'image est obligatoire pour un nouveau produit.";
  productModal.classList.add('active');
});

// Fermer Modal
closeModalBtn.addEventListener('click', () => {
  productModal.classList.remove('active');
});

// Éditer Produit
window.editProduct = function(id) {
  const p = productsList.find(x => x.id.toString() === id.toString());
  if(!p) return;
  modalTitle.textContent = "Modifier " + p.name;
  prodId.value = p.id;
  prodName.value = p.name;
  prodPrice.value = p.price;
  prodDesc.value = p.desc;
  prodImgUrl.value = p.img;
  prodImage.value = ""; // reset file input
  imgHelpText.textContent = "Laissez vide si vous ne voulez pas modifier l'image actuelle.";
  productModal.classList.add('active');
};

// Basculer Statut Épuisé
window.toggleStatus = async function(id, currentStatus) {
  loadingOverlay.classList.add('active');
  try {
    await db.collection('products').doc(id.toString()).update({
      sold_out: !currentStatus
    });
  } catch (err) {
    alert("Erreur: " + err.message);
  }
  loadingOverlay.classList.remove('active');
};

// Supprimer Produit
window.deleteProduct = async function(id) {
  if(confirm("Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible.")) {
    loadingOverlay.classList.add('active');
    try {
      await db.collection('products').doc(id.toString()).delete();
    } catch (err) {
      alert("Erreur: " + err.message);
    }
    loadingOverlay.classList.remove('active');
  }
};

// Cloudinary Upload Logic
async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryPreset);
  
  const res = await fetch(url, { method: 'POST', body: formData });
  if(!res.ok) throw new Error("Erreur lors de l'upload Cloudinary");
  const data = await res.json();
  return data.secure_url;
}

// Sauvegarder Produit (Ajout ou Modif)
saveProductBtn.addEventListener('click', async () => {
  if(!prodName.value || !prodPrice.value || !prodDesc.value) {
    return alert("Veuillez remplir tous les champs obligatoires.");
  }
  
  const isNew = !prodId.value;
  const file = prodImage.files[0];

  if(isNew && !file) {
    return alert("Vous devez sélectionner une image pour un nouveau produit.");
  }

  loadingOverlay.classList.add('active');
  
  try {
    let finalImgUrl = prodImgUrl.value;
    
    // Upload nouvelle image si présente
    if(file) {
      finalImgUrl = await uploadToCloudinary(file);
    }

    const newId = isNew ? Date.now().toString() : prodId.value;

    const data = {
      id: isNew ? Number(newId) : Number(prodId.value),
      name: prodName.value.trim(),
      price: Number(prodPrice.value),
      desc: prodDesc.value.trim(),
      img: finalImgUrl,
    };

    if(isNew) {
      data.sold_out = false;
      data.created_at = firebase.firestore.FieldValue.serverTimestamp();
    }

    await db.collection('products').doc(newId).set(data, { merge: true });
    
    productModal.classList.remove('active');
    alert(isNew ? "Produit ajouté avec succès !" : "Modifications enregistrées !");
  } catch(err) {
    alert("Erreur: " + err.message);
  }
  
  loadingOverlay.classList.remove('active');
});

// Initialization
loadPromos();
loadProducts();
