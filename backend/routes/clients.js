
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Liste des clients
router.get('/', authenticateToken, authorizeRoles('admin', 'gerant'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients');
    res.json({ clients: rows, count: rows.length });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter un client
router.post('/', authenticateToken, authorizeRoles('admin', 'gerant'), async (req, res) => {
  const { name, phone } = req.body;
  if (!name) return res.status(400).json({ error: 'Nom requis' });
  try {
    const [result] = await pool.query('INSERT INTO clients (name, phone) VALUES (?, ?)', [name, phone]);
    res.status(201).json({ id: result.insertId, name, phone });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un client
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'gerant'), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clients WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier un client (optionnel)
router.put('/:id', authenticateToken, authorizeRoles('admin', 'gerant'), async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;
  try {
    await pool.query('UPDATE clients SET name = ?, phone = ? WHERE id = ?', [name, phone, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
module.exports = router;
