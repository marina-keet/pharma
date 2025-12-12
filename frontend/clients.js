
const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem('token');
  options.headers = options.headers || {};
  options.headers['Authorization'] = token ? `Bearer ${token}` : '';
  return fetch(url, options).then(res => {
    if (res.status === 401) {
      window.location.href = 'login.html';
      throw new Error('Unauthorized');
    }
    return res.json();
  });
};

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
  await fetchWithAuth('http://localhost:3001/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone })
  });
  hideAddClient();
  // Redirige vers le POS après ajout
  window.location.href = 'sales.html';
});

function loadClients() {
  fetchWithAuth('http://localhost:3001/api/clients')
    .then(data => {
      const tbody = document.getElementById('clientsTable');
      tbody.innerHTML = '';
      (data.clients || []).forEach(client => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class='py-2 px-4'>${client.name}</td><td class='py-2 px-4'>${client.phone}</td><td class='py-2 px-4'><button class='text-red-600' onclick='deleteClient(${client.id})'>Supprimer</button></td>`;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error('Erreur chargement clients:', err));
}

function deleteClient(id) {
  fetchWithAuth(`http://localhost:3001/api/clients/${id}`, { method: 'DELETE' })
    .then(() => loadClients())
    .catch(err => console.error('Erreur suppression client:', err));
}

window.onload = loadClients;
// Rendre les fonctions accessibles globalement pour l'attribut onclick
window.showAddClient = showAddClient;
window.hideAddClient = hideAddClient;
