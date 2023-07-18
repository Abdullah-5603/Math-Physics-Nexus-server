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

const dbConnect = async () =>{
    try {
       await client.db("admin").command({ ping: 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log(error.message)
    }
}
dbConnect()

const allPapersCollection = client.db('MathPhysicsNexus').collection('AllPapers')

app.get('/all-papers', async (req, res) => {
    const result = await allPapersCollection.find().toArray()
    res.send(result);
})

app.get('/', (req, res) =>{
    res.send('Math Physics Nexus')
})

app.listen(port,(req, res)=>{

})