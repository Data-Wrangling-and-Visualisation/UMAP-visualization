const express = require('express');
const path = require('path');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

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

    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), req.file.originalname);

    form.submit('http://backend:8123/data2emb', (err, backendRes) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        let data = '';
        backendRes.on('data', chunk => {
            data += chunk;
        });
        backendRes.on('end', () => {
            try {
                const result = JSON.parse(data);
                res.json({ message: 'File received and processing started', points: result.embeddings, colors: result.colors });
            } catch (e) {
                res.status(500).json({ error: 'Invalid JSON from backend' });
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
