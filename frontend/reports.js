function loadReport(type) {
  fetch(`http://localhost:3001/api/reports?type=${type}`)
    .then(res => res.json())
    .then(data => {
      const content = document.getElementById('reportContent');
      if (type === 'sales') {
        content.innerHTML = `<h2 class='text-xl font-bold mb-2'>Rapport des ventes</h2><pre>${JSON.stringify(data, null, 2)}</pre>`;
      } else if (type === 'stock') {
        content.innerHTML = `<h2 class='text-xl font-bold mb-2'>Rapport du stock</h2><pre>${JSON.stringify(data, null, 2)}</pre>`;
      }
    });
}
