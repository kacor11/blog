const express = require('express');
const router = express.Router();
const userControler = require('../controllers/userController');
const passport = require("passport");

router.post('/new', userControler.userCreatePOST)

router.post('/login',userControler.userLoginPOST)

module.exports = router;