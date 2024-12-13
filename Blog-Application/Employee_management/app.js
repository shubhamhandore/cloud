const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Change this to your MySQL password
  database: 'employee_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Routes
app.post('/employees', (req, res) => {
  const { name, designation, salary, department } = req.body;
  const query = 'INSERT INTO employees (name, designation, salary, department) VALUES (?, ?, ?, ?)';
  db.query(query, [name, designation, salary, department], (err, result) => {
    if (err) throw err;
    res.send('Employee added successfully');
  });
});

app.get('/employees', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, designation, salary, department } = req.body;
  const query = 'UPDATE employees SET name = ?, designation = ?, salary = ?, department = ? WHERE id = ?';
  db.query(query, [name, designation, salary, department, id], (err, result) => {
    if (err) throw err;
    res.send('Employee updated successfully');
  });
});

app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM employees WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.send('Employee deleted successfully');
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
