// Génération PDF de l'inventaire
function exportInventoryPDF() {
  const doc = new window.jspdf.jsPDF();
  doc.setFontSize(16);
  doc.text('Inventaire Pharmacie', 14, 18);
  const table = document.getElementById('inventoryTable');
  const rows = [];
  for (let i = 1; i < table.rows.length; i++) {
    const cells = Array.from(table.rows[i].cells).map(cell => cell.textContent);
    rows.push(cells);
  }
  doc.autoTable({
    head: [['Nom', 'Catégorie', 'Stock', 'Prix']],
    body: rows,
    startY: 28,
    theme: 'grid',
    styles: { fontSize: 10 }
  });
  doc.save('inventaire_pharmacie.pdf');
}
window.exportInventoryPDF = exportInventoryPDF;
