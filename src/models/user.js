const mongoose = require('mongoose');
const validator = require('validator')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({

        firstname:{
            type: String,
            required: true,
            min:3
        },
        lastname:{
            type: String,
            required: true
        },
        city:{
            type:String,
            required:true,
            // enum:{
            //     values:["Indore","Bhopal"],
            //     message: "Please Select Indore or Bhopal as your city"
            // }
        },
        phone:{
            type:Number,
            required:true,
            min:10,
            unique:[true,"This phone number is already exists"],
            validate(value){
                if(value<0){
                    throw new Error()
                }
            }
        },
        email:{
            type:String,
            required: true,
            unique:[true,"This email is already exists"],
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Invalid Email')
                }
            }
        },
        password:{
            type:String,
            required:true
        },
        tokens:[{
                token:{
                        type:String,
                        required:true
                      }
               }]

})

// Generate jwt tokens for authentication
userSchema.methods.generateAuthToken = async function(){
    try {
       const token = jwt.sign({_id:this._id.toString()},process.env.Secret_key);
       
       this.tokens = this.tokens.concat({token:token})
       console.log(`jwt token  : ${token}`)

       //To save this token in the db 
       await this.save();
       
       return token;    
    } catch (error) {
        console.log(`jwt error`)
    }   
}


//password hashing middleware
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
            this.password = await bcrypt.hash(this.password,10)
    }
    next()
})

const UserModel = new mongoose.model('userCollection',userSchema);

module.exports = UserModel;