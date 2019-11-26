const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 4001;
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");

app.use(express.json());
app.use(cors());

// const db_url = "mongodb+srv://admin1:gFJjXly9Cif7eXPA@cluster0-iurxe.mongodb.net/"
// // const dbName = "ingredients"
// // const db_urlTwo = "mongodb+srv://admin1:gFJjXly9Cif7eXPA@cluster0-iurxe.mongodb.net/"

const db_url =
  "mongodb+srv://admin1:gFJjXly9Cif7eXPA@cluster0-iurxe.mongodb.net/ingredients?retryWrites=true&w=majority";
const dbName = "ingredients";
const db_urlTwo =
  "mongodb+srv://admin1:gFJjXly9Cif7eXPA@cluster0-iurxe.mongodb.net/users?retryWrites=true&w=majority";

const client = new MongoClient(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const client_ = new MongoClient(db_urlTwo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// referencing collection being used for crud

// root path is for recipes
app.get("/", function(req, res) {
  //if (err) throw err
  let body = req.body;
  res.send(body);
});

// getting users in database
app.get("/users", (req, res) => {
  //doesn't seem to matter if client or client_??? just have to match
  client.connect(err => {
    //what is the err placeholder?
    if (!err) {
      //if everything is working do this =>
      const collection = client.db("food").collection("users");
      console.log("wahat is the collection", collection);
      // perform actions on the collection object
      collection.find().toArray((err, docs) => {
        //i had a const results here, what would that have done? also there was {} in side the find() i got rid of it and it still works..why?
        console.log("what are docs", docs);
        res.send(docs);
      });
    } else {
      console.log(err);
    }
    client.close(); // what does close do? close the connection from line 33
  });
});

//create users from form(home)

app.post("/users", (req, res) => {
  const body = req.body;
  client.connect(async err => {
    if (!err) {
      const collection = client.db("food").collection("users");
      // perform actions on the collection object
      await collection.insertOne(body); //putting payload into the db
      console.log("this is the flag", body)
      res.send(body); //difference between responding with 'body' or 'results.insertedId'?
    } else {
      console.log("this is a big problem", err);
    }

    client.close();
  });
});

//Delete a user

// app.delete("/leads/:ID", (req, res) => { //not matching with path name in ui display?
//   const body = req.body;
//   client.connect(async err => {
//     if (!err) {
//       const collection = client.db("food").collection("users");
//       // perform actions on the collection object
//       console.log("the first iteration", req.params)
//       const results = await collection.deleteOne({  //if you swap _id: blah blah with 'body' that wasn't created line 88, mimicking the post it works just the same?

//       _id: ObjectId(req.params.ID)

//         });
//         console.log("the second pass by", req.params)
//       res.send(results.ObjectId);
//     } else {
//       console.log(err);
//     }
//     client.close();
//   });
// });

//update user
app.put("/update/:_ID", (req, res) => {
  console.log("i am ready", req);
  const body = req.body; //for fun get rid of and "req." before body.name on line 105
  console.log("body is", body);
  client.connect(async err => {
    //how is this promise working?
    if (!err) {
      const collection = client.db("food").collection("users");
      const results = await collection.updateOne(
        { _id: ObjectId(req.params._ID) }, //object. what parameter am i going to search by//lower case id matches db id. This looks like it should be the req? (body)?
        { $set: { name: body.name } } //$set is key term to access the keys being replaced. //the 'name' of the key in db that i'm changing with the 'body' coming in
      ); //the second parameter is overriding the first parameter

      res.send(results);
    } else {
      console.log(err);
    }
    client.close();
  });
});

// delete recipe from array

app.delete("/delete/:_ID", (req, res) => {
  client.connect(async err => {
    if (!err) {
      const collection = client.db("food").collection("users");
      // perform actions on the collection object
      const results = await collection.deleteOne({
        _id: ObjectId(req.params._ID)
      });
      console.log(
        "a big hairy scary object..happy halloween",
        results.deletedCount
      );
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
  console.log("the pantry now has", body);
  client.connect(async err => {
    const collection = client.db("food").collection("pantry");
    // perform actions on the collection object
    const results = await collection.insertOne(body);
    res.send(results.insertedId);

    client.close();
  });
});

// sorting data from data from db and inputted data

// app.post("/", async function(req, res) {
//   const body = req.body;
//   // console.log(body)
//   let data = [];
//   client.connect(async err => {
//     const collection = client.db("food").collection("ingredients");
//     console.log("what we have is", collection);
//     // perform actions on the collection object
//     const results = await collection.find().toArray(function(err, docs) {
//       console.log("what is data", data);
//       data = docs;

//       console.log("data", data);
//       const newData = data[0].Ingredients;

//       console.log("newData", newData);

//       let newArr = [];
//       newArr = Object.values(body);
//       console.log("newArr", newArr);

//       const returnValue = newData.filter(item => !newArr.includes(item));
//       console.log("returnValue", returnValue);
//       res.send(returnValue);
//     });
//     client.close();
//   });
// });
app.post("/recipe", (req, res) => {
  const body = req.body;
  console.log("what do you have", body)
  res.send(body)
})


app.post("/ingredients", (req, res) => {
  const body = req.body;
  // console.log("the body is", body)
  //doesn't seem to matter if client or client_??? just have to match
  client.connect(err => {
    //what is the err placeholder?
    if (!err) {
      //if everything is working do this =>
      const collection = client.db("food").collection("ingredients");
      // console.log("wahat is the collection", collection);
      // perform actions on the collection object
      collection.find().toArray((err, docs) => {
        //i had a const results here, what would that have done? also there was {} in side the find() i got rid of it and it still works..why?
        // console.log("what are docs", docs);
        const newDocs = docs[3].Ingredients //the selected recipe
        // let newArr = [];
      newArr = Object.values(body);
      // console.log("newArr", newArr);
      const recipe = docs[0].Recipe
      console.log("what is the", recipe)
      const returnValue = newDocs.filter(item => !newArr.includes(item));
      // console.log("returnValue", returnValue);
      // console.log("new docs are", newDocs)

        res.send(returnValue);
      });
    } else {
      console.log(err);
    }
    client.close(); // what does close do? close the connection from line 33
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
