const express = require('express');  
const connectDB = require('./config/db');
const app = express(); 




connectDB();


app.use(express.json({extended : false}));

app.get('/', (req , res) => res.send('API Running')); 



// Define routes 
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));



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

