const express = require('express');
const router = express.Router();
const baseController = require('../controllers/baseController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here

router.get('/', catchErrors(baseController.getAllInfo));

// router.get('/reverse/:name', (req,res) => {
//   const reverse = [...req.params.name].reverse().join('');
//   res.json(reverse);
// });
module.exports = router;