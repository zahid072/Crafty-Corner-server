const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running....");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pvtbyiu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const artCollection = client.db("DBpainting&drawing").collection("allArts");
    const categoryCollection = client.db("DBpainting&drawing").collection("subCategory");

    // All api
    //  get data
    app.get("/allArts", async(req, res)=>{
      const cursor = artCollection.find()
      const arts = await cursor.toArray()
      res.send(arts);
    })
    // get category collections
    app.get("/subCategory", async(req, res)=>{
      const cursor = categoryCollection.find()
      const arts = await cursor.toArray()
      res.send(arts);
    })
   
    // get single data 
    app.get("/allArts/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }; 
        const art = await artCollection.findOne(filter);
        res.send(art);
    });
    // add data
    app.post("/allArts", async (req, res) => {
      const arts = req.body;
      const result = await artCollection.insertOne(arts);
      res.send(result); 
    });
    
    // update data
    app.put("/allArts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;
      const craft = {
        $set: {
          image : updatedCraft.image,
          item_name : updatedCraft.item_name,
          subcategory_Name : updatedCraft.subcategory_Name,
          rating : updatedCraft.rating,
          price : updatedCraft.price,
          processing_time : updatedCraft.processing_time,
          customization : updatedCraft.customization,
          short_description : updatedCraft.short_description,
          stockStatus : updatedCraft.stockStatus,
          user_name : updatedCraft.user_name,
          email : updatedCraft.email,
        },
      };
      const result = await artCollection.updateOne(filter, craft, options);
      res.send(result);
    });
    // delete data 
    app.delete("/allArts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artCollection.deleteOne(query);
      res.send(result); 
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log(`server is running on port: ${port}`);
});
