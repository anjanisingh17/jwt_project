require("dotenv").config();
const mongoose = require('mongoose');


const username = process.env.ROOT;
const password = process.env.Password;
const cluster = process.env.Cluster;
const dbName = process.env.DbName; 

//Create Connection and new Db
exports.connect = () =>{

    mongoose.set('strictQuery', false);

    mongoose.connect(
        `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbName}`,
           {
              useNewUrlParser: true,
              useUnifiedTopology: true
           }).then(() => {
                console.log('Mongoose Connection successful')
           }).catch((err) => {
                console.log(`no connectoin error -> ${err}`)
        });
        
}
