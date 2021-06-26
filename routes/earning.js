const express = require('express');
const router = express.Router();
const earningController = require('../controllers/earningController');

router.post('/create', earningController.create);
router.get('/getAll', earningController.getAll);
router.post('/cencel', earningController.cencel);
router.post('/pendingearning',earningController.pendingEarning);
router.post('/paidout',earningController.paidOut);
router.post('/chartMy',earningController.chartData2);

module.exports = router;

