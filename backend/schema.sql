CREATE TABLE IF NOT EXISTS stock_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  type ENUM('entree', 'sortie') NOT NULL,
  quantity INT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id INT,
  note VARCHAR(255),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
-- Table des utilisateurs avec gestion des rôles
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'gerant', 'caissier') NOT NULL DEFAULT 'caissier',
  phone VARCHAR(30),
  address VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE DATABASE IF NOT EXISTS pharmacie;
USE pharmacie;

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  categorie VARCHAR(100),
  stock INT DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (sale_id) REFERENCES sales(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);


CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  currency VARCHAR(10) DEFAULT 'FC',
  exchange_rate DECIMAL(10,2) DEFAULT 1.00,
  tva_percent DECIMAL(5,2) DEFAULT 0.00,
  discount_policy VARCHAR(255) DEFAULT '',
  language VARCHAR(20) DEFAULT 'fr',
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  timezone VARCHAR(50) DEFAULT 'Africa/Kinshasa',
  theme_mode VARCHAR(10) DEFAULT 'clair',
  pharmacy_name VARCHAR(100) DEFAULT '',
  pharmacy_address VARCHAR(255) DEFAULT '',
  pharmacy_phone VARCHAR(30) DEFAULT '',
  invoice_note TEXT DEFAULT '',
  pharmacy_logo VARCHAR(255) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number VARCHAR(50),
  client_id INT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
