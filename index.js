const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");
const cors = require('cors');
const objectId = require('mongodb').ObjectId;
require('dotenv').config();

//Middle were ------------------------------------------
app.use(cors());
app.use(express.json());

//Port---------------------------------------------------
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ne473.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    const database = client.db("express_food_delivery");
    const foodCollection = database.collection("foods");
    const purchesFoodCollection = database.collection("purchesFood");

    // post api for foods-------------------------- 
    app.post('/foods', async (req, res) => {
      const foodData = req.body;
      const result = await foodCollection.insertOne(foodData);
      res.send(result);
    });

    // get api all foods---------------------------
    app.get('/foods', async (req, res) => {
      const allFoods = foodCollection.find({});
      const arrayOfFood = await allFoods.toArray();
      res.send(arrayOfFood);
    });

    // get single food api ----------------------------
    app.get('/foods/:id' , async (req , res) => {
      const singleProductId = req.params.id;
      const query = {_id: objectId(singleProductId)};
      const singleProduct =await foodCollection.findOne(query);
      res.send(singleProduct);
    })
    
    // single food  ---------------------------------
    app.post('/purches' , async (req , res) => {
      const purchesData = req.body;
      const result = await purchesFoodCollection.insertOne(purchesData)
      res.send(result)
      console.log(result);
    })

    // purched all foods ------------------------------
    app.get ('/purches' , async (req , res) => {
      const purchesAllFoodData = purchesFoodCollection.find({});
      const result = await purchesAllFoodData.toArray();
      res.send(result);
    })

    // delete single food -----------------------------
    app.delete('/foods/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await foodCollection.deleteOne(query);
      res.send(result);
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




//test get -----------------------------------------------
app.get('/', (req, res) => {
  res.send('connected');
})
// listening port -----------------------------------------
app.listen(port, () => {
  console.log('listening port', port);
});