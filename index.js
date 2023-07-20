const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
// const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jjaqgwq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbConnect = async () => {
    try {
        await client.db("admin").command({ ping: 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log(error.message)
    }
}
dbConnect()

const allPapersCollection = client.db('MathPhysicsNexus').collection('AllPapers')
const allUsersCollection = client.db('MathPhysicsNexus').collection('Users')

// papers api

app.post('/all-papers', async (req, res) => {
    const paper = req.body;
    const result = await allPapersCollection.insertOne(paper)
    res.send(result)
})

app.get('/all-papers', async (req, res) => {
    const subject = req.query.subject;
    const email = req.query.email;
    if (email) {
        const query = { email: email }
        const result = await allPapersCollection.find(query).sort({ date: -1 }).toArray();
        res.send(result);
    } else if (subject === 'physics') {
        const query = { examName: subject }
        const result = await allPapersCollection.find(query).sort({ date: -1 }).toArray();
        res.send(result);
    } else if (subject === 'math') {
        const query = { examName: subject }
        const result = await allPapersCollection.find(query).sort({ date: -1 }).toArray();
        res.send(result);
    } else {
        const result = await allPapersCollection.find().sort({ date: -1 }).toArray();
        res.send(result);
    }
});

app.get('/all-papers/:email', async (req, res) => {
    const email = req.params.email;
    // console.log(email);
    const query = { email: email }
    const result = await allPapersCollection.find(query).toArray();
    res.send(result);
})

// user api

app.post('/all-users', async (req, res) => {
    const user = req.body;
    const query = { email: user?.email }
    const existingUser = await allUsersCollection.findOne(query);
    if (existingUser) {
        return res.send({})
    }
    const result = await allUsersCollection.insertOne(user)
    res.send(result)
})
app.get('/current-user/:email', async (req, res) => {
    const userEmail = req.params.email;
    const query = { email: userEmail }
    const currentUser = await allUsersCollection.findOne(query)
    res.send(currentUser)
})
app.get('/all-users', async (req, res) => {
    const result = await allUsersCollection.find().toArray()
    res.send(result);
})

app.get('/', (req, res) => {
    res.send('Math Physics Nexus')
})

app.listen(port, (req, res) => {

})