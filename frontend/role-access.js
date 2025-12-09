// Contrôle d'accès frontend selon le rôle
// À inclure sur toutes les pages protégées

const role = localStorage.getItem('role');
const nav = document.querySelector('nav .flex.flex-wrap, nav .space-x-2');

function hideLink(selector) {
  const el = document.querySelector(selector);
  if (el) el.style.display = 'none';
}

if (!role) {
  // Non connecté : redirige vers login sauf sur login.html
  if (!window.location.pathname.endsWith('login.html')) {
    window.location.href = 'login.html';
  }
} else {
  // ADMIN : accès à tout
  if (role === 'admin') {
    // rien à masquer
  }
  // GERANT : pas d'accès factures, fournisseurs, gestion utilisateurs
  else if (role === 'gerant') {
    hideLink('a[href="invoices.html"]');
    hideLink('a[href="suppliers.html"]');
    // Si page interdite, redirige
    if (window.location.pathname.endsWith('invoices.html') || window.location.pathname.endsWith('suppliers.html')) {
      window.location.href = 'dashboard.html';
    }
  }
  // CAISSIER : accès uniquement vente et rapport du jour
  else if (role === 'caissier') {
    hideLink('a[href="dashboard.html"]');
    hideLink('a[href="clients.html"]');
    hideLink('a[href="products.html"]');
    hideLink('a[href="invoices.html"]');
    hideLink('a[href="suppliers.html"]');
    hideLink('a[href="reports.html"]');
    // Ne laisse que vente et rapport
    if (!window.location.pathname.endsWith('sales.html') && !window.location.pathname.endsWith('reports.html')) {
      window.location.href = 'sales.html';
    }
  }
}
// Déconnexion
const logout = document.querySelector('a[href="login.html"]');
if (logout) {
  logout.addEventListener('click', function() {
    localStorage.clear();
  });
}
