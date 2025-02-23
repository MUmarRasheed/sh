const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DATA_FILE = './eventsData.json';
const path = require('path');

// Middleware
app.use(bodyParser.json());



// Serve static files from the root directory
app.use(express.static(__dirname));

// Routes to serve HTML files
app.get('/guestview.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'guestview.html'));
});

app.get('/newadmin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'newadmin.html'));
});

// Helper functions
const readData = () => (fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : {});
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));

// Routes
app.get('/events', (req, res) => res.json(readData()));

app.post('/events', (req, res) => {
    const { eventName, eventData } = req.body;
    if (!eventName || !eventData) return res.status(400).send('Invalid data');

    const data = readData();
    data[eventName] = eventData;
    writeData(data);
    res.send('Event saved successfully');
});

app.delete('/events/:eventName', (req, res) => {
    const data = readData();
    if (data[req.params.eventName]) {
        delete data[req.params.eventName];
        writeData(data);
        res.send('Event deleted successfully');
    } else {
        res.status(404).send('Event not found');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
