function showAddProduct() {
  document.getElementById('addProductModal').classList.remove('hidden');
}
function hideAddProduct() {
  document.getElementById('addProductModal').classList.add('hidden');
}

document.getElementById('addProductForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = this.name.value;
  const categorie = this.categorie.value;
  const stock = this.stock.value;
  const price = this.price.value;
  const token = localStorage.getItem('token');
  await fetch('http://localhost:3001/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ name, categorie, stock, price })
  });
  hideAddProduct();
  loadProducts();
});

function loadProducts() {
  const token = localStorage.getItem('token');
  fetch('http://localhost:3001/api/products', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('productsTable');
      tbody.innerHTML = '';
      let lowStock = [];
      (data.products || []).forEach(product => {
        const tr = document.createElement('tr');
        let stockClass = '';
        if (product.stock <= 5) {
          stockClass = 'bg-yellow-100 text-yellow-800 font-bold';
          lowStock.push(product.name);
        }
        tr.innerHTML = `<td class='py-2 px-4'>${product.name}</td><td class='py-2 px-4'>${product.categorie || ''}</td><td class='py-2 px-4 ${stockClass}'>${product.stock}</td><td class='py-2 px-4'>${product.price} €</td><td class='py-2 px-4'><button class='text-red-600' onclick='deleteProduct(${product.id})'>Supprimer</button></td>`;
        tbody.appendChild(tr);
      });
      // Affiche une alerte si au moins un produit est bientôt en rupture
      const alertDiv = document.getElementById('stockAlert');
      if (lowStock.length > 0) {
        alertDiv.textContent = 'Bientôt rupture de stock : ' + lowStock.join(', ');
        alertDiv.classList.remove('hidden');
      } else {
        alertDiv.classList.add('hidden');
      }
    });
}

function deleteProduct(id) {
  const token = localStorage.getItem('token');
  fetch(`http://localhost:3001/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(() => loadProducts());
}

window.onload = loadProducts;
