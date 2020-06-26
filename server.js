const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const hsts = require('hsts');
const path = require('path');
const xssFilter = require('x-xss-protection');
const nosniff = require('dont-sniff-mimetype');
const request = require('request');

const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);

app.get('/api/members', checkHeaders, (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

// TODO: Dropdown!
app.get('/api/teams', checkHeaders, (req, res) => {

});

// Submit Form!
app.post('/api/addMember', checkHeaders, (req, res) => {

});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});



function checkHeaders(req, res, next) {
  console.log('testing this: ', req.headers['x-username'])
  // I understand 418 is not the appropriate status, but it's funny :D
  if (!req.headers['x-username']) {
    res.status(418).send('You are not logged in.')
  } else {
    next()
  }
}
