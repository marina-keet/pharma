// Script d'initialisation d'un admin par défaut
const pool = require('./db');
const bcrypt = require('bcrypt');

async function createAdmin() {
  const username = 'marina';
  const password = 'marina12';
  const role = 'admin';
  const hash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      'INSERT IGNORE INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hash, role]
    );
    console.log('Admin créé ou déjà existant.');
  } catch (err) {
    console.error('Erreur création admin:', err);
  } finally {
    process.exit();
  }
}

createAdmin();
