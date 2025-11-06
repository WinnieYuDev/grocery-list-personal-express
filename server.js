require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.static('public'));

// Use environment variables
const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const cluster = process.env.MONGO_CLUSTER;
const dbName = process.env.MONGO_DB;

// Construct the MongoDB connection URL
const url = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority`;
// Mongoose connect

const mongoose = require('mongoose');
const mongoURI = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority`;

const connectToMongo = async () => {
try {
    mongoose.set('strictQuery', false)
    mongoose.connect(mongoURI) 
    console.log('Mongo connected')
}
catch(error) {
    console.log(error)
    process.exit()
}
}
module.exports = connectToMongo;

let db;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
    app.listen(3000, () => console.log("Server running on port 3000"));
});


// Home page
app.get('/', (req, res) => {
    db.collection('messages').find().toArray((err, messages) => {
        if (err) return console.log(err);

        const left = messages.filter(item => !item.completed).length;
        res.render('index.ejs', { messages, left });
    });
});

// Add a new item
app.post('/messages', (req, res) => {
    db.collection('messages').insertOne({ item: req.body.item, completed: false }, (err, result) => {
        if (err) return console.log(err);
        res.redirect('/');
    });
});

// Toggle completed (cross-out)
app.put('/messages/complete', (req, res) => {
    db.collection('messages').findOneAndUpdate(
        { _id: ObjectId(req.body.id) },
        { $set: { completed: req.body.completed } },
        { returnDocument: 'after' },
        (err, result) => {
            if (err) return res.send(err);
            res.send(result.value);
        }
    );
});

// Delete an item
app.delete('/messages', (req, res) => {
    db.collection('messages').deleteOne({ _id: ObjectId(req.body.id) }, (err, result) => {
        if (err) return res.send(err);
        res.send({ message: 'Item deleted' });
    });
});


//Citations:
//Modified code from youtube tutorial: https://www.youtube.com/watch?v=jZ-kmmgi_d0&list=PLBf-QcbaigsJysJ-KFZvLGJvvW-3sfk1S&index=42
//Reference code from https://www.mongodb.com/resources/languages/express-mongodb-rest-api-tutorial#setting-up-the-project
//Use of dotenv package to hide sensitive info: https://www.npmjs.com/package/dotenv
//Use of Learning Mode on AI tools to help with code structure,syntax and debugging