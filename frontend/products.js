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
        const currency = 'FC';
        tr.innerHTML = `<td class='py-2 px-4'>${product.name}</td><td class='py-2 px-4'>${product.categorie || ''}</td><td class='py-2 px-4 ${stockClass}'>${product.stock}</td><td class='py-2 px-4'>${product.price} ${currency}</td><td class='py-2 px-4'><button class='text-blue-600 mr-2 edit-btn'>Modifier</button><button class='text-red-600' onclick='deleteProduct(${product.id})'>Supprimer</button></td>`;
        tr.querySelector('.edit-btn').addEventListener('click', function() {
          showEditProduct(product);
        });
        function showEditProduct(product) {
          const modal = document.getElementById('editProductModal');
          modal.classList.remove('hidden');
          const form = document.getElementById('editProductForm');
          form.id.value = product.id;
          form.name.value = product.name;
          form.categorie.value = product.categorie;
          form.stock.value = product.stock;
          form.price.value = product.price;
        }

        function hideEditProduct() {
          document.getElementById('editProductModal').classList.add('hidden');
        }

        document.getElementById('editProductForm').onsubmit = async function(e) {
          e.preventDefault();
          const id = this.id.value;
          const name = this.name.value;
          const categorie = this.categorie.value;
          const stock = this.stock.value;
          const price = this.price.value;
          const token = localStorage.getItem('token');
          await fetch(`http://localhost:3001/api/products/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ name, categorie, stock, price })
          });
          hideEditProduct();
          loadProducts();
        };
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
