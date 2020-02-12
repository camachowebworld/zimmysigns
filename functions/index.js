const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const firebaseApp = firebase.initializeApp(
  functions.config().firebase
);

const app = express();

// Handlebars - Initialize
app.engine('hbs', engines.handlebars);
app.set('views', './views/pages');
app.set('view engine', 'hbs');

// Handlebars - Registered Partials
require('./helpers/handlebarsPartials.js');

// Handlebars - Registered Helpers - Versions
require('./helpers/handlebarsHelpersVersions.js');

// Home
app.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.render('home');
});

app.get('/privacy-policy', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.render('privacy_policy');
});

app.get('/terms-of-service', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.render('terms_of_service');
});

app.get('/books/:book?', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  var bookName = req.params.book;
  console.log(bookName);
  if(req.params.book){
    if(fs.existsSync(path.join(__dirname, './views/pages/'+bookName+'.hbs'))){
      res.render(bookName);
    } else {
      res.status(404).render('404');
    }
  } else {
    res.render('books');
  }
});

app.get('/games/:game?', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  var gameName = req.params.game;
  console.log(gameName);
  if(req.params.game){
    if(fs.existsSync(path.join(__dirname, './views/pages/'+gameName+'.hbs'))){
      res.render(gameName, {
        imgMode: req.query.mode
      });
    } else {
      res.status(404).render('404');
    }
  } else {
    res.render('games');
  }
});

app.get('/printables/:printable?', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  var printableName = req.params.printable;
  console.log(printableName);
  if(req.params.printable){
    if(fs.existsSync(path.join(__dirname, './views/pages/'+printableName+'.hbs'))){
      switch (printableName) {
        case 'calendar': {
          let months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
          let date = new Date();
          let month = date.getMonth();
          var year = date.getFullYear();
          res.render(printableName, {
            months: months,
            month: months[month],
            year: year
          });
          break;
        }
        default: {
          res.render(printableName);
        }
      }
    } else {
      res.status(404).render('404');
    }
  } else {
    res.render('printables');
  }
});

exports.app = functions.https.onRequest(app);
