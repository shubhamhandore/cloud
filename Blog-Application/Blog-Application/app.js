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
  database: 'blog_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Create a new post
app.post('/posts', (req, res) => {
  const { title, body } = req.body;
  const query = 'INSERT INTO posts (title, body) VALUES (?, ?)';
  db.query(query, [title, body], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, title, body, timestamp: new Date() });
  });
});

// Get all posts
app.get('/posts', (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get a single post by ID
app.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

// Update a post
app.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  const query = 'UPDATE posts SET title = ?, body = ? WHERE id = ?';
  db.query(query, [title, body, id], (err, result) => {
    if (err) throw err;
    res.send('Post updated successfully');
  });
});

// Delete a post
app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.send('Post deleted successfully');
  });
});

// Start server
app.listen(3002, () => {
  console.log('Server started on port 3002');
});
