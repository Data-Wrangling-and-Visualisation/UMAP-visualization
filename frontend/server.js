const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 8000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, '.')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/process-data', upload.single('csv'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`File uploaded: ${req.file.originalname}`);
    res.json({ message: 'File received and processing started' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
