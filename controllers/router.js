const express = require('express')
const router = express.Router();
const Coupon = require('../models/coupon.js')
const dcdbSeed = require('../models/dcdbSeed.js')
const User = require('../models/users.js');
router.use(express.static('public'))
///////// SEED FILE /////////////
router.get('/seed', (req, res) => {
  Coupon.create(dcdbSeed, (err, seedDb) => {
    res.send(dcdbSeed)
  })
})
///////// INDEX PAGE ///////////
router.get('/', (req, res) => {
  Coupon.find({}, (err, coupons) => {
    res.render('index2.ejs')
  })
})
/////// LOGIN PAGE ///////////////
router.get('/login', (req, res) => {
  res.render('login.ejs', {currentUser: req.session.currentUser})
})

router.get('/loggedin', (req, res) => {
  if (req.session.currentUser) {
    Coupon.find({}, (err, coupons) => {
      res.render('index.ejs', {
        coupons: coupons,
        currentUser: req.session.currentUser
      })
    })
  } else {
    res.redirect('/dcdb')
  }
})
//////// NEW COUPON PAGE //////////
router.get('/loggedin/newcoupon', (req, res) => {
  res.render('new.ejs')
})

router.get('/loggedin/list', (req, res) => {
  Coupon.find({}).collation({locale: "en" }).sort({itemName: 'asc'}).exec(function(err, coupons) {
    res.render('indexlist.ejs', {coupons: coupons})
    // res.send(coupons)
  })
})
router.get('/loggedin/list/company', (req, res) => {
  Coupon.find({}).collation({locale: "en" }).sort({makerName: 'asc'}).exec(function(err, coupons) {
    res.render('listcompany.ejs', {coupons: coupons})
    // console.log(coupons);
    // res.send(coupons)
  })
})
router.get('/loggedin/list/date', (req, res) => {
  Coupon.find({}).sort({expirationDate: 'asc'}).exec(function(err, coupons) {
    console.log(coupons);
    console.log(err);
    res.render('listdate.ejs', {coupons: coupons})
    // res.send(coupons)
  })
})
/////// DELETE ROUTE //////////////////
router.delete('/:id', (req, res) => {
  Coupon.findByIdAndRemove(req.params.id, (err, deletedCoupon) => {
    res.redirect('/dcdb/loggedin')
  })
})
/////// LOGOUT //////////////
router.delete('/', (req, res)=>{
    req.session.destroy(() => {
        res.redirect('/dcdb')
    })
})
////////// EDIT PAGE //////////////
router.get('/loggedin/:id/edit', (req, res) => {
  Coupon.findById(req.params.id, (err, foundCoupon) => {
    res.render('edit.ejs', {coupon: foundCoupon})
  })
})
////////////// DETAILS PAGE ////////////////
router.get('/loggedin/:id', (req, res) => {
  Coupon.findById(req.params.id, (err, foundCoupon) => {
    console.log(foundCoupon);
    res.render('show.ejs',
                {
                  coupon: foundCoupon,
                }
              )
  })
})
////////// POST LOGIN ///////////////
router.post('/loggedin', (req, res)=>{
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        if(req.body.password == foundUser.password){
          req.session.currentUser = foundUser
            res.redirect('/dcdb/loggedin')
        } else {
          res.send('<a href="/">wrong password</a>')
        }
    });
});
///////////// // PUT ROUTE //  POSTING EDIT  //////////
router.put('/:id', (req, res) => {
  if (req.body.storeCoupon === "on") {
    req.body.storeCoupon = true;
  } else {
    req.body.storeCoupon = false;
  }
  Coupon.findByIdAndUpdate(req.params.id, req.body, (err, updatedCoupon) => {
    console.log(updatedCoupon);
    console.log(err);
    console.log(req.body);
    res.redirect('/dcdb/loggedin')
    // res.send(req.body)
  })
})
///////// POSTING NEW COUPON //////////////////
router.post('/newcoupon', (req, res) => {
  if (req.body.month == undefined) {
    req.body.month = 1
  }
  if (req.body.day == undefined) {
    req.body.day = 1
  }
  if (req.body.year == undefined) {
    req.body.year = 2020
  }
  req.body.expirationDate = req.body.month + '/' + req.body.day + '/' + req.body.year
  if(!req.body.link){
    req.body.link = 'NO LINK'
  } else {
    req.body.link = req.body.link
  }
  if (req.body.storeCoupon === 'on') {
    req.body.storeCoupon = true
  } else {
    req.body.storeCoupon = false;
  }
  Coupon.create(req.body, (err, newCoupon) => {
    console.log(req.body);
    res.redirect('/dcdb/loggedin')
  })
})

///////////////// DOCUMENT COUNTER /////////////////
Coupon.countDocuments((err, data) => {
  console.log('there are currently ' + data + ' coupons');
})
module.exports = router;
