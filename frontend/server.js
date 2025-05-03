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
                res.json({
                    points: result.embeddings,
                    colors: result.colors,
                    labels: result.labels
                });
            } catch (e) {
                res.status(500).json({ error: 'Invalid JSON from backend' });
            }
        });
    });
});

// Serve list of sample CSVs
app.get('/samples', (req, res) => {
    const galleryDir = path.join(__dirname, 'gallery');
    const files = fs.readdirSync(galleryDir).filter(f => f.endsWith('.csv'));
    res.json({ samples: files });
});

// Process a chosen sample without user upload
app.post('/process-sample', express.json(), (req, res) => {
    const { filename } = req.body;
    const filePath = path.join(__dirname, 'gallery', filename);
    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'Sample not found' });
    }
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), filename);
    form.submit('http://backend:8123/data2emb', (err, backendRes) => {
        if (err) return res.status(500).json({ error: err.message });
        let data = '';
        backendRes.on('data', chunk => { data += chunk });
        backendRes.on('end', () => {
            try {
                const result = JSON.parse(data);
                res.json({
                    points: result.embeddings,
                    colors: result.colors,
                    labels: result.labels
                });
            } catch {
                res.status(500).json({ error: 'Invalid JSON from backend' });
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
