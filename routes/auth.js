const express = require('express');
const router = express.Router();
const AuthPost = require('../controllers/auth/post');

router.post('/', AuthPost.Login);

module.exports = router;
