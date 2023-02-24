const express = require('express');
require('./db/conn').connect();
const userRouters = require('./routers/user');
var bcrypt = require('bcryptjs');

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(userRouters);






app.listen(port,()=>{
    console.log(`your app is listening at port ${port}`);
})
