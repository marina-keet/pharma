// Détail d'une facture
router.get('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const id = req.params.id;
  try {
    // Facture + client
    const [[invoice]] = await pool.query('SELECT invoices.*, clients.name as client FROM invoices LEFT JOIN clients ON invoices.client_id = clients.id WHERE invoices.id = ?', [id]);
    if (!invoice) return res.status(404).json({ error: 'Facture introuvable' });
    // Produits de la vente
    const [[sale]] = await pool.query('SELECT id FROM sales WHERE id = ?', [id]);
    let items = [];
    if (sale) {
      [items] = await pool.query('SELECT sales_items.*, products.name as product FROM sales_items LEFT JOIN products ON sales_items.product_id = products.id WHERE sales_items.sale_id = ?', [sale.id]);
    }
    // Paramètres pharmacie (nom, devise)
    const [[settings]] = await pool.query('SELECT pharmacy_name, currency FROM settings LIMIT 1');
    res.json({ invoice, items, settings });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

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
