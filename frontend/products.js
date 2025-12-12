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

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `mb-2 px-4 py-2 rounded shadow font-bold text-sm animate-fade-in ${type === 'warning' ? 'bg-yellow-200 text-yellow-900 border border-yellow-400' : 'bg-blue-200 text-blue-900 border border-blue-400'}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

function loadProducts() {
  const token = localStorage.getItem('token');
  fetch('http://localhost:3001/api/products', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(async res => {
      if (!res.ok) {
        let msg = 'Erreur serveur ou accès refusé';
        if (res.status === 403) msg = 'Accès interdit : veuillez vous reconnecter ou vérifier votre rôle.';
        if (res.status === 404) msg = 'Ressource non trouvée.';
        showToast(msg, 'warning');
        throw new Error(msg);
      }
      return await res.json();
    })
    .then(data => {
      const tbody = document.getElementById('productsTable');
      if (!tbody) return;
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
          if (!modal) return;
          modal.classList.remove('hidden');
          const form = document.getElementById('editProductForm');
          if (!form) return;
          form.id.value = product.id;
          form.name.value = product.name;
          form.categorie.value = product.categorie;
          form.stock.value = product.stock;
          form.price.value = product.price;
        }
        function hideEditProduct() {
          const modal = document.getElementById('editProductModal');
          if (!modal) return;
          modal.classList.add('hidden');
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
        showToast('⚠️ Stock faible pour : ' + lowStock.join(', '), 'warning');
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





