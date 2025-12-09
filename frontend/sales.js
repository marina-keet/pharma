let cart = [];

function loadProducts() {
  fetch('http://localhost:3001/api/products')
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('productSelect');
      select.innerHTML = '';
      (data.products || []).forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (${product.stock}) - ${product.price} €`;
        select.appendChild(option);
      });
    });
}

function addToCart() {
  const select = document.getElementById('productSelect');
  const productId = select.value;
  const productName = select.options[select.selectedIndex].text.split(' (')[0];
  const price = parseFloat(select.options[select.selectedIndex].text.split('- ')[1]);
  const quantity = parseInt(document.getElementById('quantity').value);
  if (!productId || quantity < 1) return;
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, productName, price, quantity });
  }
  renderCart();
}

function renderCart() {
  const tbody = document.getElementById('cartTable');
  tbody.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class='py-2 px-4'>${item.productName}</td><td class='py-2 px-4'>${item.quantity}</td><td class='py-2 px-4'>${item.price} €</td><td class='py-2 px-4'>${itemTotal} €</td><td class='py-2 px-4'><button class='text-red-600' onclick='removeFromCart(${idx})'>Supprimer</button></td>`;
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
  fetch('http://localhost:3001/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart })
  }).then(() => {
    cart = [];
    renderCart();
    alert('Vente enregistrée !');
  });
}

window.onload = () => {
  loadProducts();
  renderCart();
};
