const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
const { requireAuth ,checkUser} = require('./middleware/authMiddleware');
 
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://nodejs:nodeauth@clusterauth.2kxox.mongodb.net/Auth?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*' , checkUser);
app.get('/', (req, res) => {
  //console.log(res.locals.user);
  return res.render('home', {user: res.locals.user});
});
app.get('/indicators', requireAuth , (req, res) => res.render('indicators'));
app.use(authRoutes);

//cookies
// app.get('/set-cookies' , (req,res) => {
//   //res.setHeader('Set-Cookie' , 'newUser-true');
//   res.cookie('newUser',false);
//   res.cookie('isEmployee',true,{maxAge: 1000 * 60 * 60 *24  , secure: true});

//   res.send('here is the cookies');
// });

// app.get('/read-cookies', (req,res) => {
//   const cookies = req.cookies;
//   console.log(cookies)
//   console.log(cookies.newUser)
//   res.json(cookies)
// })

