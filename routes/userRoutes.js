const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);        // register route
router.post('/login', userController.login);             // login route   


module.exports = router;

