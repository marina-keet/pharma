function showAddSupplier() {
  document.getElementById('addSupplierModal').classList.remove('hidden');
}
function hideAddSupplier() {
  document.getElementById('addSupplierModal').classList.add('hidden');
}

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

document.getElementById('addSupplierForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = this.name.value;
  const phone = this.phone.value;
  const token = localStorage.getItem('token');
  await fetch('http://localhost:3001/api/suppliers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ name, phone })
  });
  hideAddSupplier();
  loadSuppliers();
});

function loadSuppliers() {
  const token = localStorage.getItem('token');
  fetch('http://localhost:3001/api/suppliers', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(async res => {
      if (!res.ok) {
        let msg = 'Erreur serveur ou accès refusé';
        if (res.status === 401) msg = 'Accès non autorisé : veuillez vous reconnecter.';
        if (res.status === 403) msg = 'Accès interdit : rôle insuffisant.';
        showToast(msg, 'warning');
        throw new Error(msg);
      }
      return await res.json();
    })
    .then(data => {
      const tbody = document.getElementById('suppliersTable');
      if (!tbody) return;
      tbody.innerHTML = '';
      (data.suppliers || []).forEach(supplier => {
        const tr = document.createElement('tr');
        const currency = 'FC';
        tr.innerHTML = `<td class='py-2 px-4'>${supplier.name}</td><td class='py-2 px-4'>${supplier.phone}</td><td class='py-2 px-4'><button class='text-red-600' onclick='deleteSupplier(${supplier.id})'>Supprimer</button></td><td class='py-2 px-4'>${supplier.balance} ${currency}</td>`;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      const tbody = document.getElementById('suppliersTable');
      if (tbody) tbody.innerHTML = `<tr><td colspan='4' class='text-red-600'>${err.message}</td></tr>`;
    });
}

function deleteSupplier(id) {
  const token = localStorage.getItem('token');
  fetch(`http://localhost:3001/api/suppliers/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } })
    .then(() => loadSuppliers());
}

window.onload = loadSuppliers;
