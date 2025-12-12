
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
  const { cart, client_id } = req.body;
  if (!cart || !Array.isArray(cart) || cart.length === 0) return res.status(400).json({ error: 'Panier vide' });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [saleResult] = await conn.query('INSERT INTO sales () VALUES ()');
    const saleId = saleResult.insertId;
    let total = 0;
    for (const item of cart) {
      await conn.query('INSERT INTO sales_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [saleId, item.productId, item.quantity, item.price]);
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.productId]);
      total += (item.price - (item.discount || 0)) * item.quantity;
    }
    // Générer un numéro de facture unique (ex: FACT-20251212-<saleId>)
    const today = new Date();
    const num = `FACT-${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}-${saleId}`;
    // Créer la facture (client_id peut être null)
    const [invResult] = await conn.query('INSERT INTO invoices (number, client_id, total) VALUES (?, ?, ?)', [num, client_id || null, total]);
    const invoiceId = invResult.insertId;
    await conn.commit();
    res.status(201).json({ saleId, invoiceId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    conn.release();
  }
});
module.exports = router;
