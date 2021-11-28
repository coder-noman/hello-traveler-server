const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId

require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ckhjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('Travel_Package');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');
        // GET API
        app.get('/services', async (req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET Single Service
        app.get('/services/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: objectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })

        // Add orders API
        app.post('/orders', async (req, res) =>{
           const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result)
        });
    }
    finally{
        // await client.close();
    }
}


run().catch(console.dir);

app.get('/', (req,res) =>{
    res.send('Running Traveler server')
});

app.listen(port, () => {
    console.log('runnig server on port', port)
  })