const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');

router.post('/create', linkController.create);
router.post('/deleteOne', linkController.deleteOne);
router.get('/getAll', linkController.getAll);
router.post('/update', linkController.update);
module.exports = router;

