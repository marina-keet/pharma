
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
// Statistiques de ventes (nombre du jour)
router.get('/', authenticateToken, authorizeRoles('admin', 'caissier'), async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as today FROM sales WHERE DATE(date) = CURDATE()");
    res.json({ today: rows[0].today });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Enregistrer une vente
router.post('/', authenticateToken, authorizeRoles('admin', 'caissier'), async (req, res) => {
  const { cart } = req.body;
  if (!cart || !Array.isArray(cart) || cart.length === 0) return res.status(400).json({ error: 'Panier vide' });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [saleResult] = await conn.query('INSERT INTO sales () VALUES ()');
    const saleId = saleResult.insertId;
    for (const item of cart) {
      await conn.query('INSERT INTO sales_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [saleId, item.productId, item.quantity, item.price]);
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.productId]);
    }
    await conn.commit();
    res.status(201).json({ saleId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    conn.release();
  }
});
module.exports = router;
