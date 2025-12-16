const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const path = require('path');
const app = express();
const db = require('./db');

// Serve static files (HTML, CSS, JS) from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Security and middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost', 'http://127.0.0.1'],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Validation middleware for marks input
const validateMarks = [
    body('math').isInt({ min: 0, max: 100 }).withMessage('Math must be 0-100'),
    body('english').isInt({ min: 0, max: 100 }).withMessage('English must be 0-100'),
    body('science').isInt({ min: 0, max: 100 }).withMessage('Science must be 0-100')
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: errors.array() 
        });
    }
    next();
};

app.post('/calculate', validateMarks, handleValidationErrors, (req, res) => {
    const math = parseInt(req.body.math);
    const english = parseInt(req.body.english);
    const science = parseInt(req.body.science);

    // Step 1: total
    const total = math + english + science;

    // Step 2: average
    const average = total / 3;

    // Step 3: grade
    let grade = '';
    if (average >= 90) grade = 'A';
    else if (average >= 80) grade = 'B';
    else if (average >= 70) grade = 'C';
    else if (average >= 60) grade = 'D';
    else grade = 'F';

    // Insert into MySQL
    const query = 'INSERT INTO results (math, english, science, total, average, grade) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [math, english, science, total, average, grade], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to save results' });
        }
        res.status(201).json({ 
            message: `Saved! Total: ${total}, Average: ${average.toFixed(2)}, Grade: ${grade}`,
            id: result.insertId,
            data: { math, english, science, total, average: parseFloat(average.toFixed(2)), grade }
        });
    });
});

app.get('/results', (req, res) => {
    db.query('SELECT id, math, english, science, total, average, grade FROM results ORDER BY id DESC', (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch results' });
        }
        res.json(rows || []);
    });
});

// DELETE a record by ID
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    // Validate ID is a positive integer
    if (!Number.isInteger(parseInt(id)) || parseInt(id) <= 0) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    const sql = "DELETE FROM results WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Delete failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Record not found" });
        }

        res.json({ message: "Record deleted successfully" });
    });
});

// UPDATE a record by ID
app.put('/update/:id', validateMarks, handleValidationErrors, (req, res) => {
    const id = req.params.id;
    const math = parseInt(req.body.math);
    const english = parseInt(req.body.english);
    const science = parseInt(req.body.science);

    // Validate ID
    if (!Number.isInteger(parseInt(id)) || parseInt(id) <= 0) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    // Calculate total, average, grade
    const total = math + english + science;
    const average = total / 3;

    let grade = '';
    if (average >= 90) grade = 'A';
    else if (average >= 80) grade = 'B';
    else if (average >= 70) grade = 'C';
    else if (average >= 60) grade = 'D';
    else grade = 'F';

    const sql = "UPDATE results SET math = ?, english = ?, science = ?, total = ?, average = ?, grade = ? WHERE id = ?";
    db.query(sql, [math, english, science, total, average, grade, id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Update failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Record not found" });
        }

        res.status(200).json({ 
            message: `Updated! Total: ${total}, Average: ${average.toFixed(2)}, Grade: ${grade}`,
            data: { id, math, english, science, total, average: parseFloat(average.toFixed(2)), grade }
        });
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
