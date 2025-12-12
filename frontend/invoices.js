
function loadInvoices() {
  const token = localStorage.getItem('token');
  fetch('http://localhost:3001/api/invoices', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Erreur serveur ou accès refusé');
      return res.json();
    })
    .then(data => {
      const tbody = document.getElementById('invoicesTable');
      tbody.innerHTML = '';
      const currency = localStorage.getItem('currency') || 'FC';
      (data.invoices || []).forEach(invoice => {
        const tr = document.createElement('tr');
        tr.classList.add('cursor-pointer','hover:bg-blue-50','transition');
        tr.onclick = () => {
          window.location.href = `invoice-details.html?id=${invoice.id}`;
        };
        tr.innerHTML = `<td class='py-2 px-4 text-blue-700 underline'>${invoice.number}</td><td class='py-2 px-4'>${invoice.client || ''}</td><td class='py-2 px-4'>${invoice.date ? invoice.date.substring(0, 16).replace('T',' ') : ''}</td><td class='py-2 px-4'>${invoice.total} ${currency}</td>`;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      const tbody = document.getElementById('invoicesTable');
      tbody.innerHTML = `<tr><td colspan='4' class='text-red-600 py-4 px-4'>Erreur de chargement des factures</td></tr>`;
    });
}
window.onload = loadInvoices;
