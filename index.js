const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 4000;
const MongoClient = require ('mongodb').MongoClient;
const ObjectId = require ('mongodb').ObjectId;

const cors = require('cors')


app.use(express.json());
app.use(cors());

const db_url = "mongodb+srv://admin1:gFJjXly9Cif7eXPA@cluster0-iurxe.mongodb.net/"
// const dbName = "ingredients"
// const db_urlTwo = "mongodb+srv://admin1:gFJjXly9Cif7eXPA@cluster0-iurxe.mongodb.net/"


const client = new MongoClient(db_url, { useNewUrlParser: true, useUnifiedTopology: true });
// const client_ = new MongoClient(db_urlTwo, { useNewUrlParser: true, useUnifiedTopology: true });
// referencing collection being used for crud


// data is shown sent to database, and the remaing object is sent back

app.get('/', function(req, res) {
    //if (err) throw err
    let body = req.body;
    res.send(body);
})

// getting users in database
app.get('/users', (req, res) => {    //doesn't seem to matter if client or client_??? just have to match
  client.connect (err => {                //what is the err placeholder?
    if (!err) {        //if everything is working do this =>
      const collection = client.db("food").collection("users");
      // perform actions on the collection object
      collection.find().toArray((err, docs) => { //i had a const results here, what would that have done? also there was {} in side the find() i got rid of it and it still works..why?
        res.send(docs);
      });
    } else {
      console.log(err);
    }
    client.close(); // what does close do? that is already done by either a ; or or res.send?
  });
});

//create users from form(home)

app.post("/users", (req, res) => { //is the 'post' endpoint magically sending data to db?
// console.log("theis is the req", req)
  const body = req.body;
   client.connect(async err => { // what is the placeholder param doing? took out the async function and it still works.
    if(!err) {
      const collection = client.db("food").collection("users"); //what is the collection? an object created
      // console.log("the collection is", collection)
      // perform actions on the collection object
      const results = await collection.insertOne(body); // why is the await there? still works without?
      console.log("the results are", results.insertedId)
      res.send(results.insertedId);  //why only the id?
    }else {
      console.log("this is a big problem", err)
    }
    
    client.close();
  });
});

// app.post('/users', function(req, res) {
//   const input = req.body;
//   console.log("coming in we have", input)
//   client.connect(function(err, client_Two) {  //connecting to mongo server, client_two is referencing my account 
//       // assert.equal(null, err);
//       const db = client_Two.db("food"); //db("mydatabase that i want")
//       insertOne(db, function(){
//           client.close();
//       });
//   });
//   const insertOne = function(db, callback){
//   const collection = db.collection('users'); 
//   collection.insertOne( input , function(err, result) {
//       callback(result);
//       res.send(result.ops)
//   });
// }
 
// })

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
  client.connect(async err => {
    if (!err) {
      const collection = client.db("food").collection("users");
      // perform actions on the collection object
      const results = await collection.updateOne(
        { _id: ObjectId(req.params._ID) }, //lower case id matches db id. 
        { $set: {name: body.name} } //the 'name' of the key in db that i'm changing with the 'body' coming in
      );
      
      res.send(results);
    } else {
      console.log(err);
    }
    client.close();
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
