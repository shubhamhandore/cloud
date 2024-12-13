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
  database: 'student_management'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Routes

// Add a student
app.post('/students', (req, res) => {
  const { name, roll_number, class: studentClass, grade } = req.body;
  const query = 'INSERT INTO students (name, roll_number, class, grade) VALUES (?, ?, ?, ?)';
  db.query(query, [name, roll_number, studentClass, grade], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send('Roll number already exists.');
      }
      throw err;
    }
    res.status(201).send('Student added successfully');
  });
});

// Update a student's grade
app.put('/students/:rollNumber', (req, res) => {
  const { rollNumber } = req.params;
  const { grade } = req.body;
  const query = 'UPDATE students SET grade = ? WHERE roll_number = ?';
  db.query(query, [grade, rollNumber], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send('Student grade updated successfully');
    } else {
      res.status(404).send('Student not found');
    }
  });
});

// Get all students and their grades
app.get('/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Start server
app.listen(3005, () => {
  console.log('Server started on port 3005');
});
