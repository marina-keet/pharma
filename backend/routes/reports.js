
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
router.get('/', authenticateToken, async (req, res) => {
  const { type } = req.query;
  try {
    if (req.user.role === 'admin' || req.user.role === 'gerant') {
      if (type === 'sales') {
        const [rows] = await pool.query('SELECT s.id, s.date, SUM(si.quantity * si.price) as total FROM sales s LEFT JOIN sales_items si ON s.id = si.sale_id GROUP BY s.id, s.date ORDER BY s.date DESC');
        return res.json({ sales: rows });
      } else if (type === 'stock') {
        const [rows] = await pool.query('SELECT * FROM products');
        return res.json({ stock: rows });
      } else {
        return res.status(400).json({ error: 'Type de rapport inconnu' });
      }
    } else if (req.user.role === 'caissier') {
      if (type === 'sales') {
        // Rapport du jour uniquement pour caissier
        const [rows] = await pool.query("SELECT s.id, s.date, SUM(si.quantity * si.price) as total FROM sales s LEFT JOIN sales_items si ON s.id = si.sale_id WHERE DATE(s.date) = CURDATE() GROUP BY s.id, s.date ORDER BY s.date DESC");
        return res.json({ sales: rows });
      } else {
        return res.status(403).json({ error: 'Accès refusé.' });
      }
    } else {
      return res.status(403).json({ error: 'Accès refusé.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
module.exports = router;
