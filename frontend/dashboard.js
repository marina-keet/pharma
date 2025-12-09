// Dashboard stats fetch example
fetch('http://localhost:3001/api/clients')
  .then(res => res.json())
  .then(data => {
    document.getElementById('clientsCount').textContent = data.count || 0;
  });
fetch('http://localhost:3001/api/products')
  .then(res => res.json())
  .then(data => {
    document.getElementById('productsCount').textContent = data.count || 0;
  });
fetch('http://localhost:3001/api/sales')
  .then(res => res.json())
  .then(data => {
    document.getElementById('salesToday').textContent = data.today || 0;
  });
