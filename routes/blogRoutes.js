const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const passport = require('passport')
const middleware = require('../middleware/cache')


router.get('/', middleware.isCached, postController.postsGET)

router.get('/:id', postController.singlePostGET)

router.post('/new', passport.authenticate('jwt', {session: false}, ), postController.createPostPOST)

router.post('/:id/comment/', postController.createCommentPOST);

router.delete('/:id/delete', passport.authenticate('jwt', {session: false}), postController.deletePostDELETE)


module.exports = router;


