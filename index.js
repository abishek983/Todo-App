var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var ObjectId = require('mongodb').ObjectID;


/* //1st try
//connecting with the database
var dotenv = require("dotenv");
var mongoose = require("mongoose");
dotenv.config();
//connection to db
mongoose.set("useFindAndModify", false); // to avoid error we will have further

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
}); */


//2nd try to connect to mongoDB
var MongoCLient = require("mongodb").MongoClient;
var db,dbCollections;
const url = "mongodb+srv://admin:yesbank@chat-app-4n7zx.mongodb.net/test";
MongoCLient.connect(url,(err, client) => {
    if(err) console.log(err);
    db = client.db("development");
    dbCollections = db.collection("todoapp");
    app.listen(3000, () => 
    console.log("database connection succesfull app running on PORT:3000"));
});

//inserting inside the collection
function insertToDb(msgObj) {
    dbCollections.insertOne(msgObj);
};


//configuring view engine
app.set("view engine", "ejs");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/' ,async (req,res) => {
    const result = dbCollections.find().toArray(function(err,task){
        //console.log(task);
        res.render("todo.ejs" , {task : task});     
    });
        /* result.then(function(ans){
        ans.forEach((ele,ind) => {
            console.log(ele.item);
        });
    }); */
});


app.post('/', async (req, res) => {
    //console.log(req.body);
    insertToDb(req.body)
    res.redirect("/");
});


app.get('/remove/:id' , (req,res) => {
    const id= req.params.id;
    dbCollections.deleteOne({_id : ObjectId(id)} , (err,result) => {
        if(err)
            console.log(err);
        else
            res.redirect("/");
    });
})

app.route("/edit/:id")
.get((req,res) => {
    const result = dbCollections.find().toArray(function(err,task){
        const id = req.params.id;
        // console.log(id);
        res.render("edit.ejs" , {task : task , idTask : id});     
    });
})
.post((req,res)=> {
    const id = req.params.id;
    dbCollections.update({_id : ObjectId(id)} , {item : req.body.content} , err => {
        res.redirect("/");
    })
})
