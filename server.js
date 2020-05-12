const express = require('express'); //this is to run server and require method is used to load module    
const connectDB = require('./config/db');
const app = express(); // creating an app called app


//connect database, created config/db for database settings

connectDB();
app.get('/', (req , res) => res.send('API Running')) //express routing
const PORT = process.env.PORT || 5000;
//now = function(){

   // console.log(`Server new started at ${PORT}`)
//}
app.listen(PORT , ( )=> console.log(`Server started on port ${PORT}`));

//app.listen(PORT, now()); 
// ()=> acts as a function provider , the parameters to be passed in the listen function are the PORT number ,
//or any function you might wanna run when he listener is executed 
//first git config --global user.name "your name "
//the git config --global user.email "your email"
// git init
//paste the two commands present in the repo