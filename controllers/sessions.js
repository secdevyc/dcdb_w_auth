const express = require('express')
const sessions = express.Router()

sessions.get('/login', (req, res) => {
  res.render('login.ejs')
})

sessions.post('/', (req, res)=>{
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        if(req.body.password == foundUser.password){
          req.session.currentUser = foundUser
            res.redirect('/dcdb/welcome')
        } else {
          res.send('<a href="/">wrong password</a>')
        }
    });
});
module.exports = sessions
