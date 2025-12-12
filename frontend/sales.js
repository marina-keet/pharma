// Chargement des clients pour la vente
function loadClientsForSale() {
  const token = localStorage.getItem('token');
  fetch('http://localhost:3001/api/clients', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('clientSelect');
      if (!select) return;
      // Supprime les anciennes options sauf la première et "nouveau"
      select.innerHTML = '<option value="">-- Sélectionner un client --</option><option value="__new__">+ Nouveau client</option>';
      (data.clients || []).forEach(client => {
        const opt = document.createElement('option');
        opt.value = client.id;
        opt.textContent = client.name + (client.phone ? ' (' + client.phone + ')' : '');
        select.appendChild(opt);
      });
    });
}

window.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadClientsForSale();
});

// Afficher le champ de nouveau client si besoin
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('clientSelect');
  if (select) {
    select.addEventListener('change', () => {
      if (select.value === '__new__') {
        // Redirige vers la page clients et ouvre le formulaire d'ajout
        window.location.href = 'clients.html?addClient=1';
      }
    });
  }
});
// Calcul du montant à rendre
function updateChangeDue() {
  const total = parseFloat(document.getElementById('cartTotal').textContent) || 0;
  const received = parseFloat(document.getElementById('receivedAmount').value) || 0;
  const change = received - total;
  document.getElementById('changeDue').textContent = change >= 0 ? change : 0;
}

// Mettre à jour le rendu à chaque modification du panier
const origRenderCart = renderCart;
renderCart = function() {
  origRenderCart.apply(this, arguments);
  updateChangeDue();
}

let cart = [];
let currentInput = '';
let inputMode = 'quantity'; // 'quantity', 'price', 'discount'
let allProducts = [];

function loadProducts() {
  const token = localStorage.getItem('token');
  fetch('http://localhost:3001/api/products', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(res => res.json())
    .then(data => {
      allProducts = data.products || [];
      renderProducts(allProducts);
    });
}

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow p-2 flex flex-col items-center border hover:scale-105 transition-transform';
    card.innerHTML = `
      <div class='w-12 h-12 mb-1 flex items-center justify-center bg-blue-50 rounded-full'>
        <img src='${product.image || 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png'}' alt='${product.name}' class='w-10 h-10 object-contain'>
      </div>
      <div class='font-bold text-base text-green-800 mb-1 text-center'>${product.name}</div>
      <div class='text-xs text-gray-500 mb-1'>Stock: <span class='font-bold'>${product.stock}</span></div>
      <div class='text-sm text-blue-700 font-bold mb-1'>${product.price} FC</div>
      <button class='bg-green-600 text-white px-2 py-1 rounded shadow hover:bg-green-700 transition font-bold text-xs flex items-center gap-1' onclick='selectProductForInput(${product.id}, \"${product.name}\", ${product.price}, ${product.stock})'>➕ Sélectionner</button>
    `;
    grid.appendChild(card);
  });
}

function filterProducts() {
  const search = document.getElementById('searchProductInput').value.toLowerCase();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(search));
  renderProducts(filtered);
}

let selectedProduct = null;
let selectionMode = null; // null, 'quantity', 'price', 'discount'

function selectProductForInput(id, name, price, stock) {
  if (selectionMode) {
    // Mode manuel : préparer la saisie personnalisée
    selectedProduct = { id, name, price, stock };
    inputMode = selectionMode;
    currentInput = '';
    updateInputDisplay();
    // Réinitialiser le mode après sélection
    selectionMode = null;
    return;
  }
  // Sinon, ajout direct au panier
  const existing = cart.find(item => item.productId == id);
  if (existing) {
    if (existing.quantity + 1 > stock) return;
    existing.quantity += 1;
  } else {
    cart.push({ productId: id, productName: name, price, quantity: 1, discount: 0 });
  }
  renderCart();
}

function handlePadInput(val) {
  const quickDiscountInput = document.getElementById('quickDiscount');
  if (document.activeElement === quickDiscountInput) {
    // Saisie dans la zone de réduction
    if (val === 'C') { quickDiscountInput.value = ''; return; }
    if (val === '.') { if (!quickDiscountInput.value.includes('.')) quickDiscountInput.value += '.'; return; }
    if (val === 'delete') { quickDiscountInput.value = quickDiscountInput.value.slice(0, -1); return; }
    if (!isNaN(val)) { quickDiscountInput.value += val; return; }
    return;
  }
  // Saisie normale
  if (val === 'C') { currentInput = ''; updateInputDisplay(); return; }
  if (val === '.') { if (!currentInput.includes('.')) currentInput += '.'; updateInputDisplay(); return; }
  if (val === 'delete') { currentInput = currentInput.slice(0, -1); updateInputDisplay(); return; }
  if (!isNaN(val)) { currentInput += val; updateInputDisplay(); return; }
}

function updateInputDisplay() {
  document.getElementById('inputValue').textContent = currentInput || '0';
}

function setInputMode(mode) {
  selectionMode = mode;
  // Affiche une info à l'utilisateur si besoin
}

function addSelectedToCart() {
  if (!selectedProduct) return;
  let quantity = 1, price = selectedProduct.price, discount = 0;
  if (inputMode === 'quantity') quantity = parseFloat(currentInput) || 1;
  if (inputMode === 'price') price = parseFloat(currentInput) || selectedProduct.price;
  if (inputMode === 'discount') discount = parseFloat(currentInput) || 0;
  if (quantity < 1 || quantity > selectedProduct.stock) return;
  const existing = cart.find(item => item.productId == selectedProduct.id);
  if (existing) {
    if (existing.quantity + quantity > selectedProduct.stock) return;
    existing.quantity += quantity;
    existing.price = price;
    existing.discount = discount;
  } else {
    cart.push({ productId: selectedProduct.id, productName: selectedProduct.name, price, quantity, discount });
  }
  renderCart();
  selectedProduct = null;
  currentInput = '';
}

function renderCart() {
  const tbody = document.getElementById('cartTable');
  tbody.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    const itemTotal = (item.price - (item.discount || 0)) * item.quantity;
    total += itemTotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.productName}</td><td>${item.discount || 0}</td><td>${item.quantity}</td><td>${itemTotal} FC</td><td><button class='text-red-600' onclick='removeFromCart(${idx})'>Supprimer</button></td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('cartTotal').textContent = total;
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  renderCart();
}


function checkout() {
  if (cart.length === 0) return;
  const token = localStorage.getItem('token');
  let clientId = null;
  const select = document.getElementById('clientSelect');
  if (select && select.value && select.value !== '__new__') {
    clientId = select.value;
  }
  fetch('http://localhost:3001/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ cart, client_id: clientId })
  }).then(res => res.json())
    .then(data => {
      cart = [];
      renderCart();
      if (data && data.invoiceId) {
        window.open(`invoice.html?id=${data.invoiceId}`, '_blank');
      }
    });
}


window.addEventListener('DOMContentLoaded', loadProducts);

// Appliquer une réduction rapide au dernier produit ajouté
function applyQuickDiscount() {
  const val = parseFloat(document.getElementById('quickDiscount').value);
  if (isNaN(val) || val < 0) return;
  if (cart.length === 0) return;
  cart[cart.length - 1].discount = val;
  renderCart();
  document.getElementById('quickDiscount').value = '';
}
