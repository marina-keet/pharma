
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Liste des factures
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT invoices.*, clients.name as client FROM invoices LEFT JOIN clients ON invoices.client_id = clients.id');
    res.json({ invoices: rows });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter une facture
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { number, client_id, total } = req.body;
  if (!number || !client_id || !total) return res.status(400).json({ error: 'Champs requis' });
  try {
    const [result] = await pool.query('INSERT INTO invoices (number, client_id, total) VALUES (?, ?, ?)', [number, client_id, total]);
    res.status(201).json({ id: result.insertId, number, client_id, total });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
module.exports = router;
