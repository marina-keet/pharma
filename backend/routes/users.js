const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Lister tous les utilisateurs (admin uniquement)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, role, phone, address, created_at FROM users');
    res.json({ users: rows });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer un utilisateur (admin uniquement)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { username, password, role, phone, address } = req.body;
  if (!username || !password || !role || !phone || !address) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }
  if (!['gerant', 'caissier'].includes(role)) {
    return res.status(400).json({ error: 'Rôle non autorisé.' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password, role, phone, address) VALUES (?, ?, ?, ?, ?)', [username, hash, role, phone, address]);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un utilisateur (admin uniquement)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
