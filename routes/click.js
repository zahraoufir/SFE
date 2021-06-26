const express = require('express');
const router = express.Router();
const clickController = require('../controllers/clickController');

router.post('/count',clickController.countClick);
router.get('/create/:userid/:tagname',clickController.create);
router.post('/chartdata',clickController.chartData);
router.post('/getAll', clickController.getAll);

module.exports = router;