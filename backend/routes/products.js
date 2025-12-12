const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Historique des mouvements de stock pour un produit
router.get('/:id/movements', authenticateToken, authorizeRoles('admin', 'gerant'), async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT sm.*, u.username FROM stock_movements sm LEFT JOIN users u ON sm.user_id = u.id WHERE sm.product_id = ? ORDER BY sm.date DESC',
      [id]
    );
    res.json({ movements: rows });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Liste des produits
router.get('/', authenticateToken, authorizeRoles('admin', 'gerant'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json({ products: rows, count: rows.length });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter un produit
router.post('/', authenticateToken, authorizeRoles('admin', 'gerant'), async (req, res) => {
  const { name, categorie, stock, price } = req.body;
  if (!name) return res.status(400).json({ error: 'Nom requis' });
  try {
    const [result] = await pool.query('INSERT INTO products (name, categorie, stock, price) VALUES (?, ?, ?, ?)', [name, categorie || '', stock || 0, price || 0]);
    res.status(201).json({ id: result.insertId, name, categorie, stock, price });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un produit
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'gerant'), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier un produit
router.put('/:id', authenticateToken, authorizeRoles('admin', 'gerant'), async (req, res) => {
  const { id } = req.params;
  const { name, categorie, stock, price } = req.body;
  // Validation des champs
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Nom requis' });
  }
  if (typeof categorie !== 'string') {
    return res.status(400).json({ error: 'Catégorie invalide' });
  }
  if (isNaN(Number(stock)) || stock === undefined) {
    return res.status(400).json({ error: 'Stock invalide' });
  }
  if (isNaN(Number(price)) || price === undefined) {
    return res.status(400).json({ error: 'Prix invalide' });
  }
  try {
    const [result] = await pool.query('UPDATE products SET name = ?, categorie = ?, stock = ?, price = ? WHERE id = ?', [name, categorie, stock, price, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Erreur PUT /products/:id:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// Obtenir un produit par ID
router.get('/:id', authenticateToken, authorizeRoles('admin', 'gerant'), async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
