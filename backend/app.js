const express = require('express');
const app = express();
var mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());

// schema of db
const EntrySchema = new mongoose.Schema({
    mood: {
        type: String,
        required: true,
    },
    journal: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Entry = mongoose.model('Entry', EntrySchema);

// Routes
app.get('/entries', async (req, res) => {
    const entries = await Entry.find();
    res.json(entries);
});

app.post('/entries', async (req, res) => {
    const { mood, journal } = req.body;
    const entry = new Entry({ mood, journal });
    await entry.save();
    res.json(entry);
});

app.delete('/entries/:id', async (req, res) => {
    await Entry.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


var db = mongoose.connection;
// handling connection

db.on('error', console.error.bind(console, 'conn-error'));

// handling succesfull cons
db.once('open', function () {
    console.log('connected to the database');
});

// handling dis connection events
db.on('disconnected', function () {
    console.log('disconnected');
});