const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');

router.post('/get-total',withdrawalController.get_total);
router.post('/ajouter',withdrawalController.ajouter);
router.post('/get-withdrawals',withdrawalController.afficher);

module.exports = router;