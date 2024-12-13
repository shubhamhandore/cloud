const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Routes

// List all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get details of a specific product
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Product not found');
    }
  });
});

// Add a new product
app.post('/products', (req, res) => {
  const { name, price, category, description, stock } = req.body;
  const query = 'INSERT INTO products (name, price, category, description, stock) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, price, category, description, stock], (err, result) => {
    if (err) throw err;
    res.status(201).send('Product added successfully');
  });
});

// Update a product’s stock or price
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { price, stock } = req.body;
  const query = 'UPDATE products SET price = ?, stock = ? WHERE id = ?';
  db.query(query, [price, stock, id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send('Product updated successfully');
    } else {
      res.status(404).send('Product not found');
    }
  });
});

// Delete a product
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send('Product deleted successfully');
    } else {
      res.status(404).send('Product not found');
    }
  });
});

// Start server
app.listen(3003, () => {
  console.log('Server started on port 3003');
});
