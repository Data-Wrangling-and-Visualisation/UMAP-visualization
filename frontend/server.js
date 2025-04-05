const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 8000;

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
    
    // Mock 3D points for visualization
    const points = Array.from({ length: 100 }, () => [
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
    ]);

    res.json({ message: 'File received and processing started', points });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
