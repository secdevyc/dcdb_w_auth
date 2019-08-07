////////////////////////////////////////
///////        DEPENDENCIES      ///////
////////////////////////////////////////
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
require('dotenv').config()
const session = require('express-session')
////////////////////////////////////////
///////     CONFIGURATIONS       ///////
////////////////////////////////////////
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const Coupon = require('./models/coupon.js')
/////// CONNECT TO MONGODB /////////////
mongoose.connect(MONGODB_URI , { useNewUrlParser: true })
mongoose.connection.once('open', () => {
  console.log('connected to mongo');
})

// Fix Depreciation Warnings from Mongoose*
// May or may not need these depending on your Mongoose version
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
////////////////////////////////////////
///////     MIDDLEWARE           ///////
////////////////////////////////////////
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'));
app.use(express.static('public'))
app.use(express.json());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))
////////////////////////////////////////
///////     ROUTES              ///////
////////////////////////////////////////

///////// CONTROLLERS //////////////
const couponController = require('./controllers/router.js')
app.use('/dcdb', couponController);

const userController = require('./controllers/users.js')
app.use('/users', userController)

// const sessionsController = require('./controllers/sessions.js')
// app.use('/sessions', sessionsController)
/////// LISTENER /////////
app.listen(PORT, () => {
  console.log('=======LISTENING========');
})
