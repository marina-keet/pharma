const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Récupérer les paramètres
router.get('/', authenticateToken, authorizeRoles('admin', 'gerant'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings LIMIT 1');
    const settings = rows[0] || {};
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// Mettre à jour les paramètres
router.put('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { pharmacy_name, pharmacy_address, pharmacy_phone, pharmacy_logo, pharmacy_tax_number } = req.body;
  try {
    const [rows] = await pool.query('SELECT id FROM settings LIMIT 1');
    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO settings (pharmacy_name, pharmacy_address, pharmacy_phone, pharmacy_logo, pharmacy_tax_number) VALUES (?, ?, ?, ?, ?)',
        [pharmacy_name, pharmacy_address, pharmacy_phone, pharmacy_logo, pharmacy_tax_number]
      );
    } else {
      await pool.query(
        'UPDATE settings SET pharmacy_name = ?, pharmacy_address = ?, pharmacy_phone = ?, pharmacy_logo = ?, pharmacy_tax_number = ? WHERE id = ?',
        [pharmacy_name, pharmacy_address, pharmacy_phone, pharmacy_logo, pharmacy_tax_number, rows[0].id]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
