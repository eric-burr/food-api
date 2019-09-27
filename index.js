const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 4000;
const MongoClient = require ('mongodb').MongoClient;
const ObjectId = require ('mongodb').ObjectId;

const cors = require('cors')


app.use(express.json());
app.use(cors());

const db_url = "mongodb+srv://admin1:gFJjXly9Cif7eXPA@cluster0-iurxe.mongodb.net/ingredients?retryWrites=true&w=majority"
const dbName = "ingredients"
const db_urlTwo = "mongodb+srv://admin1:gFJjXly9Cif7eXPA@cluster0-iurxe.mongodb.net/users?retryWrites=true&w=majority"


const client = new MongoClient(db_url, { useNewUrlParser: true, useUnifiedTopology: true });
const client_ = new MongoClient(db_urlTwo, { useNewUrlParser: true, useUnifiedTopology: true });


// data is shown sent to database, and the remaing object is sent back

app.get('/', function(req, res) {
    //if (err) throw err
    let body = req.body;
    res.send(body);
})

// getting users in database
app.get('/users', (req, res) => {
  client.connect (err => {
    if (!err) {
      const collection = client.db("food").collection("users");
      // perform actions on the collection object
      const results = collection.find({}).toArray((err, docs) => {
        console.log(docs);
        res.send(docs);
      });
    } else {
      console.log(err);
    }
    client.close();
  });
});

//create users from form(home)

app.post('/users', function(req, res) {
  input = req.body
  console.log("coming in we have", input)
  client.connect(function(err, client_Two) {  //connecting to mongo server, client_two is referencing my account 
      // assert.equal(null, err);
      const db = client_Two.db("food"); //db("mydatabase that i want")
      insertOne(db, function(){
          client_.close();
      });
  });
  const insertOne = function(db, callback){
  const collection = db.collection('users'); 
  collection.insertOne( input , function(err, result) {
      callback(result);
      res.send(result.ops)
  });
}
 
})

//Delete a user

app.delete("/leads/:ID", (req, res) => {
  client.connect(async err => {
    if (!err) {
      const collection = client.db("food").collection("users");
      // perform actions on the collection object
      const results = await collection.deleteOne({
        _id: ObjectId(req.params.ID)
      });
      res.send(results);
    } else {
      console.log(err);
    }
    client.close();
  });
});

//update user
app.put('/update/:_ID', (req, res) =>{
 
const body = req.body;
  client_.connect(async err => {
    if (!err) {
      const collection = client_.db("food").collection("users");
      // perform actions on the collection object
      const results = await collection.updateOne(
        { _id: ObjectId(req.params._ID) }, //lower case id matches db id. 
        { $set: {name: body.name} } //the 'name' of the key in db that i'm changing with the 'body' coming in
      );
      
      res.send(results);
    } else {
      console.log(err);
    }
    client_.close();
  });
})  

// delete recipe from array

app.delete("/delete/:_ID", (req, res) => {
  client.connect(async err => {
    if (!err) {
      const collection = client.db("food").collection("users");
      // perform actions on the collection object
      const results = await collection.deleteOne({
        _id: ObjectId(req.params._ID)
      });
      res.send(results);
    } else {
      console.log(err);
    }
    client.close();
  });
});


//send ingredients to pantry collection

  app.post("/pantry", (req, res) => {
    const body = req.body;
    console.log("the pantry now has", body)
    client.connect(async err => {
      const collection = client.db("food").collection("pantry");
      // perform actions on the collection object
      const results = await collection.insertOne(body)
      res.send(results.insertedId);
      
      client.close();
    });
});



// sorting data from data from db and inputted data

app.post('/', async function(req, res) {
    const body = req.body
    // console.log(body)
    let data = []
     client.connect(async err => {
        const collection = client.db("food").collection("ingredients");
        // perform actions on the collection object
        const results = await collection.find().toArray(function(err, docs) {
            console.log("body", body)
            data = docs 

            console.log("data", data)
            const newData = data[1].Ingredients;
            

            console.log("newData", newData)

            let newArr = [];
            newArr = Object.values(body);
            console.log("newArr", newArr)

            const returnValue = newData.filter((item) => !newArr.includes(item))
            console.log("returnValue", returnValue)
                    res.send(returnValue);

            } 
          ); 
        
        client.close();
      });
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
