var path = require('path');
var express = require('express');
var router = express.Router();

// Serve the main index.html (static files are already served by express.static in app.js)
router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = router;
