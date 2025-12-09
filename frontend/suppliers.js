function showAddSupplier() {
  document.getElementById('addSupplierModal').classList.remove('hidden');
}
function hideAddSupplier() {
  document.getElementById('addSupplierModal').classList.add('hidden');
}

document.getElementById('addSupplierForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = this.name.value;
  const phone = this.phone.value;
  await fetch('http://localhost:3001/api/suppliers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone })
  });
  hideAddSupplier();
  loadSuppliers();
});

function loadSuppliers() {
  fetch('http://localhost:3001/api/suppliers')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('suppliersTable');
      tbody.innerHTML = '';
      (data.suppliers || []).forEach(supplier => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class='py-2 px-4'>${supplier.name}</td><td class='py-2 px-4'>${supplier.phone}</td><td class='py-2 px-4'><button class='text-red-600' onclick='deleteSupplier(${supplier.id})'>Supprimer</button></td>`;
        tbody.appendChild(tr);
      });
    });
}

function deleteSupplier(id) {
  fetch(`http://localhost:3001/api/suppliers/${id}`, { method: 'DELETE' })
    .then(() => loadSuppliers());
}

window.onload = loadSuppliers;
