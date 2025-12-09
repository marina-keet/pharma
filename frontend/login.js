document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = this.username.value;
  const password = this.password.value;
  const res = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok) {
    // Stocker le token et le rôle dans le localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('username', data.username);
    // Rediriger vers le tableau de bord
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('loginError').textContent = data.error || data.message || 'Erreur de connexion';
    document.getElementById('loginError').classList.remove('hidden');
  }
});
