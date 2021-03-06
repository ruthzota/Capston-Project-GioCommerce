require("dotenv").config();
  const express = require('express');
  const app = express();

  app.use(express.static("client"));


  let globalID = 2;

  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
  const users = [ {
    id: 1,
    name: "Ruth",
    email: "ruth@gmail.com",
    password: "Ruthfee"
  }]
  
  
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  
  app.get('/js', (req, res) => {
    res.sendFile(path.join(__dirname, './client/gioCommerce.js'))
  });

  app.use('/js', express.static(path.join(__dirname, 'client/gioCommerce.js')))

  app.get('/', checkAuthenticated, (req, res) => {
    res.render('client/searchPage.html', { name: req.user.name })
  })
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('client/login.html')
  })
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/', 
    failureFlash: true
  }))
  
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('client/register.html')
  })
  
 app.post('/register', checkNotAuthenticated, async (req, res) => {
    try { const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: globalID,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })
      globalID++;
      res.redirect('/')
    } catch {
      res.redirect('/register')
    }
  })

  
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

  

  const PORT = process.env.PORT || 5050;
  
  app.listen(PORT, () => console.log(`Your server is running ${PORT}`)); 

  
