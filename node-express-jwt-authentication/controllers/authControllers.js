const User = require("../models/users");
const jwt = require('jsonwebtoken')

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
    //return errors;
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
    //return errors;
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

// Token

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({id}, 'secret-key' ,{
    expiresIn: maxAge
  });
}

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { name,email, password } = req.body;
  //console.log(req.body);

  try {
    const user = new User({ name,email, password });
    await user.save();
    const token = createToken(user._id);
    res.cookie('jwt-cookie' , token , {httpOnly: true ,maxAge: maxAge * 1000});
    return res.status(201).json(user._id);
  }
  catch(err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  // console.log("Body ", req.body);
  try{
    const user = await User.login(email,password);
    //console.log("user " , user)
    const token = createToken(user._id);
    res.cookie('jwt-cookie' , token , {httpOnly: true ,maxAge: maxAge * 1000});
    res.status(200).json({user: user._id});
  }
  catch(err){
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
}

module.exports.logout_get = (req,res) => {
  res.cookie('jwt-cookie' , '' ,{maxAge : 1 });
  res.redirect('/');
}
