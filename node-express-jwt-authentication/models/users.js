const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt  = require("bcrypt")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Please enter atleast 6 characters"],
  }
});

//fire a functon before doc saved to db
// hashing the password
userSchema.pre('save' , async function (next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password , salt)
    next();
});

//static method to login user
userSchema.statics.login = async function(email,password){
  const User = await this.findOne({email: email});
  if(User){
    const auth = await bcrypt.compare(password,User.password)
    if(auth){
      return User;
    }
    throw Error('incorrect password')
  }
  throw Error('incorrect email')
}

const User = mongoose.model("User", userSchema);

module.exports = User;
