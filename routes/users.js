const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot', userController.forgotpassword);
router.post('/verefication',userController.activateAccount);
router.post('/profile', userController.profileUser);
router.post('/update-profile', userController.updateProfile);
router.post('/update-password', userController.updatePassword);
router.post('/login', userController.login);
router.post('/forgot', userController.forgotpassword);
router.post('/reset/:token', userController.resetpassword);
router.post('/verefication-profile', userController.activateNewEmail);
router.post('/getId', userController.getID);
router.post('/get-paypal', userController.getPaypal);
//router.post('/get-paypal', userController.getPaypal);
module.exports = router;
 
