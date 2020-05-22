const express = require('express');
const router = express.Router();
const MessagePost = require('../controllers/message/post');
var checkAuth = require('../middleware/check-auth');

router.post('/user/:id', checkAuth, MessagePost.SendUserMessage);
router.post('/group/:uuid', checkAuth, MessagePost.SendGroupMessage);
module.exports = router;