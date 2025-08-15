const express = require('express');
const errhandler = require('./middleware/errorhandler');
const app = express();
const dotenv = require('dotenv').config();
const connectdb = require('./config/dbConnection');
connectdb();
const port = process.env.PORT || 3000;

app.use(express.json());
//app.use(express.urlencoded({ extended: trues }));
app.use('/',console.log("API is running..."));
app.use('/api/contacts',require('./routes/contactroutes'));
app.use('/api/users',require('./routes/userroutes'));
app.use(errhandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
