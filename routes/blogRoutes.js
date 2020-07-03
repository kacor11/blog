const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const passport = require('passport')


router.get('/', postController.postsGET)

router.get('/:id', postController.singlePostGET)

router.post('/new', passport.authenticate('jwt', {session: false}, ), postController.createPostPOST)



module.exports = router;