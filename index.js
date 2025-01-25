//create a simple CRUD//
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

let items = [];

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// Serve the items HTML
app.get('/haha', (req, res) => {
    res.sendFile(path.join(__dirname, 'haha.html'));
});

// Create
app.post('/items', upload.single('image'), (req, res) => {
    const item = {
        id: req.body.id,
        name: req.body.name,
        address: req.body.address,
        age: req.body.age,
        gender: req.body.gender,
        image: req.file ? req.file.filename : null
    };
    items.push(item);
    res.status(201).send(item);
});

// Read
app.get('/items', (req, res) => {
    res.send(items);
});

app.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item not found');
    res.send(item);
});

// Update
app.put('/items/:id', upload.single('image'), (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item not found');

    const { name, address, age, gender } = req.body;
    if (name) item.name = name;
    if (address) item.address = address;
    if (age) item.age = age;
    if (gender) item.gender = gender;
    if (req.file) item.image = req.file.filename;

    res.send(item);
});

// Delete
app.delete('/items/:id', (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex === -1) return res.status(404).send('Item not found');

    const deletedItem = items.splice(itemIndex, 1);
    res.send(deletedItem);
});

// Endpoint to get all items
app.get('/api/items', (req, res) => {
    res.send(items);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});