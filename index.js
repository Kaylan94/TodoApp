const express = require ( 'express' );
const path = require('path');
const app = express();
const jwt = require ('jsonwebtoken');
const mongoose = require('mongoose');
const port = 8000;
const bodyParserJ = require('body-parser').json();
const bodyParserU = require('body-parser').urlencoded({ extended: false });
require('dotenv').config();
const db_uri = process.env.DB_URI;
const bcrypt = require('bcrypt');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParserJ);
app.use(bodyParserU);

//route to register a new user
app.post('/api/register', async (req, res) => {
    //get the model for a new user
    const Blog = require('./models/blog.model.js');
    //get user info from body prop
    const { username, password, first_name, last_name, email} = req.body;

    try {
        //using bcrypt, encrypt user password
        const hashedPwd = await bcrypt.hash(password, 10);
        //create new user object
        const newUser = new Blog ({
            username: username,
            password: hashedPwd,
            first_name: first_name,
            last_name: last_name,
            email: email,
            admin: false
        });
        //save new user object to database
        newUser.save(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send({ message: "Some error occurred while creating the blog." });
            } else {
                console.log(data);
                res.send({message: 'New user has been added'});
            }
        });
    }catch {
        res.status(500).send();
    }

});

//auth endpoint
//user login
app.post( '/api/users/login' , async (req, res) => {
    const usr = req.body.username;
    const pwd = req.body.password;
    const Blog = require('./models/blog.model.js');
    
    try{
        //find user in database by username
        const user = await Blog.findOne({username: usr});

        //if user does not exist, send relative response
        if(!user) {
            res.status(500).send({message: 'User not found'});
        }
        //compare the password provide at login with the hashed password before sending token
        if(await bcrypt.compare(pwd, user.password)) {
            //if the comparison is successful create payload object with username and the set admin prop
            payload = {
                'name' : usr,
                'admin' : false
            }
            //create a token variable
            //use the sign function to synchronously sign the given payload into a JSON web token string
            //sign function to take parameters: payload, secretkey, ecryption (signature algorithm)
            const token = jwt.sign(JSON.stringify(payload), 'jwt-secret', {algorithm: 'HS256' });
    
            res.send({ token : token, message : 'Welcome back!!'});
        //if password and username do not match send error message
        } else{
            res.status( 403 ).send({ 'err' : 'Incorrect login!' });
        }
    }catch {
        res.status(500).send();
    }    
});

//resource endpoint
app.get( '/api/user/resource' , (req, res) => {
    const auth = req.headers['authorization'];
    const token = auth.split(' ')[1];
    const Task = require('./models/task.model.js');

    try {
        const decoded = jwt.verify(token, 'jwt-secret' );
        Task.find({owner: decoded.name},function(err, docs) {
            if(err){
                console.log("No user records found for this user.");
                res.send("ERROR: No records found. ");
            }else {
                res.send(docs);
            }
        });
    } catch (err) {
        res.status( 401 ).send({ 'err' : 'Bad JWT!' })
    }
});


//add user specific task to database
app.post('/api/resource/add', (req, res) => {
    const auth = req.headers['authorization'];
    const token = auth.split(' ')[1];
    const Blog = require('./models/task.model.js');

    try {
        const decoded = jwt.verify(token, 'jwt-secret' );
        //create new task object with the owner property as the value of name derived from the payload
        let blogModel = new Blog({
            owner: decoded.name, 
            task: req.body.task, 
            isCompleted: req.body.isCompleted
        });
        //save to database
        blogModel.save(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send({ message: "Some error occurred while creating the blog." });
            } else {
                console.log(data);
                res.send({message: 'New task has been added'});
            }
        });
    } catch (err) {
        res.status( 401 ).send({ message : 'Bad JWT! Operation failed' })
    }
});

//delete tasks specified document from database
app.delete('/api/task/delete', (req, res) => {
    const auth = req.headers['authorization'];
    const token = auth.split(' ')[1];
    const Blog = require('./models/task.model.js');

    try {
        //create a query object using the value of the task submitted in the request
        const query = { task: req.body.task }

        Blog.findOneAndRemove(query, function(err) {
            if (err) {
                console.log("ERROR: Blogs NOT removed. " + err);
                res.send({message: 'Blogs NOT removed.' + err});
            }else {
                res.send("Task removed");
            }
        }); 
    }catch {
        res.status( 401 ).send({ message : 'Bad JWT! operation failed.' })
    }
       
});


//update a task record in the database
app.put('/api/task/update', (req, res) => {
    const auth = req.headers['authorization'];
    const token = auth.split(' ')[1];
    const Blog = require('./models/task.model.js');
    
    try{
        const decoded = jwt.verify(token, 'jwt-secret');
        //create a task object witht the updated 'isCmplete' prop and owner value derived from the payload
        let updatedDoc = {
            owner: decoded.name,
            task: req.body.task,
            isCompleted: req.body.isCompleted,
        }

        let query = { task: req.body.task }

        //find the object to update using the value of the task itself as the identifier, and
        //return the updated object
        Blog.findOneAndUpdate(query, updatedDoc, { new: true }, function(err, doc) {
            if (err) {
                console.log("Something wrong when updating data!");
                res.send({message : "Not Updated."});
            }else {
                res.send({ message : 'Task update successful!' });
                console.log(doc);
            }
        });
    }catch {
        res.status( 401 ).send({ message : 'Bad JWT! operation failed.' });
    }
});

app.listen(port, () => console .log(
    `Now listening at http://localhost:${port}` )
    );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.send(err.message);
  });


  mongoose.Promise = global.Promise;
  
  mongoose.connect(db_uri, {
    useNewUrlParser: true
    });
  
  mongoose.connection.on('error', function() {
    console .log( 'Connection to Mongo established.' );
    console .log( 'Could not connect to the database. Exiting now...' );
    process.exit();
  });
  
  mongoose.connection.once('open', function() {
      console.log("Successfully connected to the database");
  })
  
  
  module.exports = app;
