require('dotenv').config();
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mj0am.mongodb.net/socialWork?retryWrites=true&w=majority`;




const app = express();
app.use(cors())
app.use(bodyParser.json())
const port = process.env.PORT || 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
    const eventCollection = client.db("socialWork").collection("events");
    const volunteerCollection = client.db("socialWork").collection("volunteer");

    app.get('/events', (req, res) => {
        eventCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/register/:id', (req, res) => {
        const intId = parseInt(req.params.id)
        eventCollection.find({ id: intId })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addVolunteer', (req, res) => {
        const volunteer = req.body;
        volunteerCollection.insertOne(volunteer)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/existingUser', (req, res) => {
        volunteerCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        volunteerCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

    app.get('/allVolunteerData', (req, res) => {
        volunteerCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addNewEvent', (req, res) => {
        const newEvent = req.body;
        eventCollection.insertOne(newEvent)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


});



app.listen(port)