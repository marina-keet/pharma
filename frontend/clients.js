function showAddClient() {
  document.getElementById('addClientModal').classList.remove('hidden');
}
function hideAddClient() {
  document.getElementById('addClientModal').classList.add('hidden');
}

document.getElementById('addClientForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = this.name.value;
  const phone = this.phone.value;
  await fetch('http://localhost:3001/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone })
  });
  hideAddClient();
  loadClients();
});

function loadClients() {
  fetch('http://localhost:3001/api/clients')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('clientsTable');
      tbody.innerHTML = '';
      (data.clients || []).forEach(client => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class='py-2 px-4'>${client.name}</td><td class='py-2 px-4'>${client.phone}</td><td class='py-2 px-4'><button class='text-red-600' onclick='deleteClient(${client.id})'>Supprimer</button></td>`;
        tbody.appendChild(tr);
      });
    });
}

function deleteClient(id) {
  fetch(`http://localhost:3001/api/clients/${id}`, { method: 'DELETE' })
    .then(() => loadClients());
}

window.onload = loadClients;
