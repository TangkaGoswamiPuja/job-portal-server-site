const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config()
const app = express ();
const port = process.env.PORT|| 5000;


// middleware
app.use(
  cors({
    origin: [
      "https://job-portal-11.web.app",
      "https://job-portal-11.web.app",
      "https://job-portal-11.firebaseapp.com",
     "http://localhost:5173"
    ],
    credentials: true,
  })
);
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mdaaiuq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

const jobCollection = client.db ("job_hunter").collection('allJobs')
const applyCollection = client.db ("job_hunter").collection('apply')

app.post('/allJobs', async (req, res) => {
    const adding = req.body;
    console.log( adding);
     const result = await jobCollection.insertOne(adding);
     res.send(result);
  })

app.get("/allJobs",async(req,res)=>{
    console.log(req.query.email)
    let query = {};
    if(req.query?.email){
        query={email : req.query.email}
    }
 const result = await
    jobCollection.find(query).toArray();
    res.send(result);
})

app.get('/alljobs/:id' ,async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
const result= await jobCollection.findOne(query);
res.send(result);
})
app.put('/allJobs/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
const options = {upsert : true};
const updateJob = req.body;
const upJob = {
    $set:{
        image    :updateJob. image ,
    jobTitle     :updateJob.jobTitle ,
    jobCategory  :updateJob. jobCategory ,
    description  :updateJob. description,
    salaryRange  :updateJob.salaryRange  ,
 applicantsNumber:updateJob.applicantsNumber,
 postingDate     :updateJob.postingDate,
        deadline :updateJob. deadline,
        email    :updateJob. email ,
    user_name:updateJob. user_name
    }
}
const result=await jobCollection.updateOne(filter,upJob,options);
res.send(result);
})

app.delete('/allJobs/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
const result=await jobCollection.deleteOne(query);
res.send(result);
})


//  apply 

app.get("/apply",async(req,res)=>{
  console.log(req.query.email)
  let query = {};
  if(req.query?.email){
      query={email : req.query.email}
  }
const result = await
  applyCollection.find(query).toArray();
  res.send(result);
})

app.post("/apply", async(req,res)=>{
  const apply = req.body;
  console.log("apply now",apply);
  const result = await applyCollection.insertOne(apply);
     res.send(result);
})

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
res.send('jobPortal is running')
})

app.listen(port,()=>{
    console.log(`job portal is running on port${port}`)
})



