const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// using middleware
app.use(cors())
app.use(express.json())

// codes from mongodb atlas

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.rrgajyt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // collections here
        const categorizedToyCollection = client.db('carPalace').collection('categorizedToy')
        const addedToyCollection = client.db('carPalace').collection('newAddedToy')

        app.get('/categories', async (req, res) => {
            const cursor = categorizedToyCollection.find()
            const result = await cursor.toArray()
            res.send(result);
        })

        // adding a toy
        app.post('/newAddedToy', async(req, res) => {
            const newToy = req.body;
            console.log(newToy)
            const result = await addedToyCollection.insertOne(newToy)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("Server is running")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})