function showAddUser() {
  document.getElementById('addUserModal').classList.remove('hidden');
}
function hideAddUser() {
  document.getElementById('addUserModal').classList.add('hidden');
}

document.getElementById('addUserForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = this.username.value;
  const password = this.password.value;
  const role = this.role.value;
  const phone = this.phone.value;
  const address = this.address.value;
  const token = localStorage.getItem('token');
  await fetch('http://localhost:3001/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ username, password, role, phone, address })
  });
  hideAddUser();
  loadUsers();
});

function loadUsers() {
  const token = localStorage.getItem('token');
  fetch('http://localhost:3001/api/users', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('usersTable');
      tbody.innerHTML = '';
      (data.users || []).forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class='py-2 px-4'>${user.username}</td>
          <td class='py-2 px-4'>${user.role}</td>
          <td class='py-2 px-4'>${user.phone || ''}</td>
          <td class='py-2 px-4'>${user.address || ''}</td>
          <td class='py-2 px-4'>${user.created_at ? user.created_at.split('T')[0] : ''}</td>
          <td class='py-2 px-4'><button class='text-red-600' onclick='deleteUser(${user.id})'>Supprimer</button></td>
        `;
        tbody.appendChild(tr);
      });
    });
}

function deleteUser(id) {
  const token = localStorage.getItem('token');
  fetch(`http://localhost:3001/api/users/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(() => loadUsers());
}

window.onload = loadUsers;
