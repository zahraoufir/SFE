const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');

router.post('/create', withdrawalController.ajouter);
router.get('/get-withdrawals', withdrawalController.afficher);
router.post('/get-total', withdrawalController.get_total);
router.post('/get-total-current', withdrawalController.get_total_current);
router.post('/get-total-withdraw', withdrawalController.get_total_withdraw);
router.get('/earning', withdrawalController.earning);
router.post('/paypal', withdrawalController.testPaypal);
router.post('/save-paypal', withdrawalController.savePaypal);




module.exports = router;
 
