
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

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
  try {
    await pool.query('UPDATE products SET name = ?, categorie = ?, stock = ?, price = ? WHERE id = ?', [name, categorie, stock, price, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
module.exports = router;
