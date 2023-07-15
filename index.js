require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
const bodyParser = require('body-parser');
const url = require('url').URL;
const app = express();
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
  original_url:String,
  short_url:{type:Number,require:true,unique:true}
});

const UrlModel = new mongoose.model("UrlModel",urlSchema);


app.post('/api/shorturl', function(req, res, next) {
  let body_url = new URL(req.body.url);
  dns.lookup(body_url.hostname, { "family": 4 }, function(err, address, family) {
    if (err) {
      res.json({ "error": "invalid url" });
      return next(err);
    } else {
      req.original_url = body_url;
      next();
    }
  });
}, function(req, res) {
  UrlModel.countDocuments()
    .then((count) => {
      let u = new UrlModel({
        original_url:req.original_url,
        short_url:count + 1
      });
      u.save()
        .then((doc) => {res.json({"original_url":doc.original_url,"short_url":doc.short_url});})
        .catch((err) => {console.log(err)});
    });
});

app.get('/api/shorturl/:shortUrlId', function(req, res) {
  UrlModel.findOne({"short_url":req.params.shortUrlId}).then((doc) => {
    console.log(doc);
    res.redirect(doc.original_url);
  }).catch((err) => {console.log(err)});
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
