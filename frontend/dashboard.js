// Dashboard stats fetch with JWT and 401 handling
const token = localStorage.getItem('token');
const fetchWithAuth = (url) => {
  return fetch(url, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  })
    .then(res => {
      if (res.status === 401) {
        // Token invalide ou expiré, redirige vers la connexion
        window.location.href = 'login.html';
        throw new Error('Unauthorized');
      }
      return res.json();
    });
};

fetchWithAuth('http://localhost:3001/api/clients')
  .then(data => {
    document.getElementById('clientsCount').textContent = data.count || 0;
  })
  .catch(err => console.error('Erreur clients:', err));

fetchWithAuth('http://localhost:3001/api/products')
  .then(data => {
    document.getElementById('productsCount').textContent = data.count || 0;
  })
  .catch(err => console.error('Erreur produits:', err));

fetchWithAuth('http://localhost:3001/api/sales')
  .then(data => {
    document.getElementById('salesToday').textContent = data.today || 0;
  })
  .catch(err => console.error('Erreur ventes:', err));
