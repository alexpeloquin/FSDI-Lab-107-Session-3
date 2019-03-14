var http = require("http");
var express = require('express');
var app = express(); // Biggest impact of express is how we manage the requests

//Configuration Sections

/*body parse to receive JSON*/
//teach to read JOSNs
var bparse = require("body-parser");
app.use(bparse.json());


/* enable CORS for testing - only for TESTING*/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }); 

//Object constructor for the mongo schema
var Item;


app.get("/",function(req,res){
    res.send("<h1>Hello Mate'</h1>");
});

app.get("/about",function(req,res){
    res.send("A project from Alexander Peloquin")
});

app.get("/error",function(req,res){
    res.status(401);
    res.send("A super hard error occured");
})


/****API/test for mongo*****/

// app.get("/API/test", function(req, res){
//     // test endpoint to create and store an object on mongo
//     var testItem = new Item({
//         brand : "superDuper",
//         desc : "This is just a test",
//         price : 42,
//         image: "",
//         cat: "testing Items",
//         user:"Alex",
//     });
//     // save the object as a document on the collection
//     //                 as an entry on the table(SQL term)
//     testItem.save(function(err,resultObj){
//         if(err){
//             console.log("Error saving obj");
//             res.status(500);
//             res.send("error, could not save the object onto DB");
//         }
//         //obj saved
//         res.send("Object Saved")
//     });
// });

/****API/points*****/

var count = 1;

app.get("/API/points",function(req,res){
    //read data from DB
    //ITEM.find is the mongoose model we established
    //find is a built in funciton
    Item.find({}, function(err,data){
        if(err){
            console.log("Error getting data");
            console.log(err);
            res.status(500);
            res.json(err);
        }
        //sends data back to client
        res.json(data);
        });
});

app.post("/API/points", function(req,res){
    console.log("Post received!" + req.body);
    var itemFromClient = req.body; //catch object from client

    //create mongo object
    var itemMongo = new Item(itemFromClient);
    itemMongo.save(function(error,itemSaved){
        if(error){
            console.log("error saving the item");
            console.log(error);
            res.status(500);
            res.json(error);
        }
        itemSaved.id=itemSaved._id; //fix because the client expects an id attribute
        res.status(201); //created
        res.json(itemSaved)
    });

});

/**Mongo Configuration */

var mongoose = require("mongoose");
mongoose.connect("mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",{
    userMongoClient: true
});

var db = mongoose.connection;

db.on("error",function(error){
    console.log("Error connection to the DB not established");
})

db.on("open", function(){
    console.log("DB connection open");    

    //create the schema for the collection(S)
    var itemSchema = mongoose.Schema({
        user:String,
        brand:String,
        des:String,
        price:Number,
        image:String,
        cat:String,
    });

    Item = mongoose.model("Items107",itemSchema);
});

//ENDS MONGO CONFIG

app.listen(8081,function(){
    console.log("Server started on localhost:8081");
});