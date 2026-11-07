var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.json({message: 'Rota /aquarios ativa (placeholder)'});
});

module.exports = router;
