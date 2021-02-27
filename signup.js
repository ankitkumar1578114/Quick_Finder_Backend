const express = require('express');
const cors = require('cors');
const app  = express();
const router = express.Router();
const multer = require('multer');
const fs    = require('fs');
var path = require('path');
var  ObjectID = require('mongodb').ObjectID;

var bodyParse = require('body-parser');
app.use(cors());
app.use(bodyParse.urlencoded({
  extended:true
}));
app.use(bodyParse.json());
console.log("Hejllo")

const mongoClient = require('mongodb').MongoClient;
const mongodbclient = new mongoClient("mongodb+srv://ankit123:asdfghjkl@cluster0.isl01.mongodb.net/mydb?retryWrites=true&w=majority",
// const mongodbclient = new mongoClient("mongodb+srv://Avengers8:RipunJay8@cluster0.prtvt.mongodb.net/Quick_Finder?retryWrites=true&w=majority",
{ useNewUrlParser:true,
    useUnifiedTopology:true
  });

  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,'./Upload');
    },
    filename: (req, file, cb) => {
       time = Date.now();
      cb(null,time+path.extname(file.originalname));
    }
  });
  const filefilter = (req,file,cb)=>{
    if(file.mimetype=== 'image/jpeg' || file.mimetype==='image/jpg'|| file.mimetype==='image/png')
      {cb(null,true);
      }
    else{
      cb({message:'Unsupported file format'},false);
     }
  };
  
  var upload = multer({
    storage: storage,
    limit:{
      fileSize:1024*1024*5
    },
    fileFilter:filefilter
  });
  
  router.post('/getdata',upload.any('Upload'),(req,res1,next) =>{
  var str;
    console.log("hello");        
  console.log("Ya");
  var description = req.body.description;
  var instructor = req.body.instructor;
  console.log(req.files.length)
  async function run() {
    try {
      await mongodbclient.connect();
      console.log("connection is established !");
      var dbo = mongodbclient.db("mydb");
    // create a document to be inserted
    //   var Image_details = sellProduct({
    //     description  : description,
    //    });
      var pic_name;
         pic_name = time+path.extname(req.files[0].originalname);
    //    console.log(Image_details);
      // var result1 = await sellProductCollection.insertOne(sellproduct);
      // console.log(
      //   `${result1.insertedCount} documents were inserted with the _id: ${result1.insertedId}`,
      // );
      // res.send(req.body);
      var myobj = { pic_name: pic_name,description: description,instructor:instructor };
      dbo.collection("Image_details").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        res1.send("Uploaded")
        str ="Done"
        mongodbclient.close();
        
    });}
     finally {
    }
    }
   run().catch(console.dir);
   
  });

  app.post('/getDetails',function(req,res){
    console.log("Ya its running ");
    const request=req
    async function run() {
           await mongodbclient.connect();
           console.log("connection is established !");
            // console.log("Connected correctly to server");
            const db = mongodbclient.db("mydb");
            var array=[];
            db.collection("Image_details").find().toArray(function(err, result) {
            if (err) throw err;
            for(var i=0;i<result.length;i++){
              var obj={};
              obj.instructor=result[i].instructor;
              obj.description=result[i].description;
              obj.pic_name=result[i].pic_name;
              array.push(obj);  
            }
            res.json({mes:array});
    });
  }
     run().catch(console.dir);  
  });
  
  app.post('/getDetailsofimages',function(req,res){
    console.log("Ya its running ");
    var email = req.body.email;
    const request=req
    async function run() {
           await mongodbclient.connect();
           console.log("connection is established !");
            // console.log("Connected correctly to server");
            const db = mongodbclient.db("mydb");
            var array=[];
            db.collection("Image_details").find({instructor:email}).toArray(function(err, result) {
            if (err) throw err;
            for(var i=0;i<result.length;i++){
              var obj={};
              obj.description=result[i].description;
              obj.pic_name=result[i].pic_name;
              array.push(obj);  
            }
            res.json({mes:array});
    });
  }
     run().catch(console.dir);  
  });

  
  app.post('/rateimages',function(req,res){
    console.log("Ya its running ");
    var main_pic = req.body.main_pic;
    console.log(main_pic)
    const request=req
    async function run() {
           await mongodbclient.connect();
           console.log("connection is established !");
            // console.log("Connected correctly to server");
            const db = mongodbclient.db("mydb");
            var array=[];
            db.collection("Image_details_response").find({main_pic:main_pic}).toArray(function(err, result) {
            if (err) throw err;
            for(var i=0;i<result.length;i++){
              var obj={};
              obj.student=result[i].student;
              obj.pic_name=result[i].pic_name;
              array.push(obj);  
            }
            res.json({mes:array});
    });
  }
     run().catch(console.dir);  
  });


  router.post('/rate',(req,res1)=>{
    console.log("Ya its running ");
    var rate = req.body.rate;
    var pic_name = req.body.pic_name;
    console.log(pic_name)
    const request=req



    async function run() {
          try{ 
          await mongodbclient.connect();
           console.log("connection is established !");
            // console.log("Connected correctly to server");
            const dbo = mongodbclient.db("mydb");
            var myobj = {$set:{ pic_name: pic_name,rate:rate}};
            dbo.collection("Image_details_rate").updateMany({pic_name:pic_name},myobj,{upsert:true}, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              str ="Done"
              res1.json({"mes":"Rating_given"})
            
              
          });
        
    }
    finally{

    }
  }
      
     run().catch(console.dir);  
  });


  router.post('/iuploadstudent',upload.any('Upload'),(req,res,next) =>{
    var str="";
      console.log("hello");        
    console.log("Ya");
    var student = req.body.student;
    var main_pic = req.body.main_pic;
    console.log(req.files.length)
    async function run() {
      try {
        await mongodbclient.connect();
        console.log("connection is established !");
        var dbo = mongodbclient.db("mydb");
      // create a document to be inserted
      //   var Image_details = sellProduct({
      //     description  : description,
      //    });
        var pic_name;
           pic_name = time+path.extname(req.files[0].originalname);
           //    console.log(Image_details);
        // var result1 = await sellProductCollection.insertOne(sellproduct);
        // console.log(
        //   `${result1.insertedCount} documents were inserted with the _id: ${result1.insertedId}`,
        // );
        // res.send(req.body);
        var myobj = { pic_name: pic_name,student:student,main_pic:main_pic };
        dbo.collection("Image_details_response").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          str ="Done"
          
      });
      res.send("Done");
    }
       finally {
      }
      }
     run().catch(console.dir);
     
    });
  


    
  router.post('/signup',(req,res,next) =>{
      console.log(req.body);         
      var email=req.body.email;
      var password = req.body.password;
      async function run() {
        try {
          await mongodbclient.connect();
          console.log("connection is established !");
          var dbo = mongodbclient.db("mydb");

        //    console.log(Image_details);
          // var result1 = await sellProductCollection.insertOne(sellproduct);
          // console.log(
          //   `${result1.insertedCount} documents were inserted with the _id: ${result1.insertedId}`,
          // );
          // res.send(req.body);
          var myobj = { email: email,password: password};
          dbo.collection("Student_details").find({email:email}).toArray(function(err, result) {
            if(result.length==0)
            {
            dbo.collection("Instructor_details").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            str ="Done"
            mongodbclient.close();
            })
          }else{
           console.log("Already Registered"); 
          }
          });
        }
         finally {
        }
        }
       run().catch(console.dir);
      
    });

    router.post('/signupfs',(req,res,next) =>{
      console.log(req.body);         
      var email=req.body.email;
      var password = req.body.password;
      var level = req.body.level;
      async function run() {
        try {
          await mongodbclient.connect();
          console.log("connection is established !");
          var dbo = mongodbclient.db("mydb");

        //    console.log(Image_details);
          // var result1 = await sellProductCollection.insertOne(sellproduct);
          // console.log(
          //   `${result1.insertedCount} documents were inserted with the _id: ${result1.insertedId}`,
          // );
          // res.send(req.body);
          var myobj = { email: email,password: password,level:level};
          dbo.collection("Student_details").find({email:email}).toArray(function(err, result) {
            if(result.length==0)
            {
              dbo.collection("Student_details").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                str ="Done"
                mongodbclient.close();
     
            })
          }else{
            console.log("Already Exist")
          }
        });           
        ;}
         finally {
        }
        }
       run().catch(console.dir);
      
    });

    router.post('/login',(req,res,next) =>{
      console.log(req.body);         
      var email=req.body.email;
      var password = req.body.password;
      console.log(email)
      console.log(password)
      async function run() {
        try {
          await mongodbclient.connect();
          console.log("connection is established !");
          var dbo = mongodbclient.db("mydb");
          dbo.collection("Instructor_details").find({email:email}).toArray(function(err, result) {
            for(var i=0;i<result.length;i++){
            if(result[i].password===password)
           {
            res.json({"mes":"yea","email":email})
           console.log("Logged In ") 
           } else{
            console.log("No") 
           }}
          });
        //    console.log(Image_details);
          // var result1 = await sellProductCollection.insertOne(sellproduct);
          // console.log(
          //   `${result1.insertedCount} documents were inserted with the _id: ${result1.insertedId}`,
          // );
          // res.send(req.body);
        console.log("Hmm");  
        }
         finally {
        }
        }
       run().catch(console.dir);
      
    });


    router.post('/loginfs',(req,res,next) =>{
      console.log(req.body);         
      var email=req.body.email;
      var password = req.body.password;
      console.log(email)
      console.log(password)
      async function run() {
        try {
          await mongodbclient.connect();
          console.log("connection is established !");
          var dbo = mongodbclient.db("mydb");
          dbo.collection("Student_details").find({email:email}).toArray(function(err, result) {
            for(var i=0;i<result.length;i++){
            if(result[0].password===password)
           {
            res.json({"mes":"yea","email":email})
           console.log("Logged In ") 
           } else{
            console.log("No") 
           }}
          });
        //    console.log(Image_details);
          // var result1 = await sellProductCollection.insertOne(sellproduct);
          // console.log(
          //   `${result1.insertedCount} documents were inserted with the _id: ${result1.insertedId}`,
          // );
          // res.send(req.body);
        console.log("Hmm");  
        }
         finally {
        }
        }
       run().catch(console.dir);
      
    });


    console.log("Hejllo")
if(process.env.NODE_ENV==="production")
{
app.use(express.static('Client/build'))  
}

app.use('',router);
  app.listen(process.env.PORT||3005,()=>{
    console.log("server is running");
  }
  );
