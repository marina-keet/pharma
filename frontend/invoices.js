function loadInvoices() {
  fetch('http://localhost:3001/api/invoices')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('invoicesTable');
      tbody.innerHTML = '';
      (data.invoices || []).forEach(invoice => {
        const tr = document.createElement('tr');
        const currency = 'FC';
        tr.innerHTML = `<td class='py-2 px-4'>${invoice.number}</td><td class='py-2 px-4'>${invoice.client}</td><td class='py-2 px-4'>${invoice.date}</td><td class='py-2 px-4'>${invoice.total} ${currency}</td>`;
        tbody.appendChild(tr);
      });
    });
}
window.onload = loadInvoices;
