var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.json({message: 'Rota /avisos ativa (placeholder)'});
});

module.exports = router;
