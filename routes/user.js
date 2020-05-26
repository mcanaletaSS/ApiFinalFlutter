const express = require('express');
const router = express.Router();
const UserPost = require('../controllers/user/post');
const UserGet = require('../controllers/user/get');
const UserPut = require('../controllers/user/put');
const UserDelete = require('../controllers/user/delete');
var checkAuth = require('../middleware/check-auth');

router.post('/:phoneNumber', UserPost.CreateUser);
router.post('/verify/list',checkAuth, UserPost.VerifyNumbers);
router.get('/:phoneNumber',checkAuth, UserGet.GetUser);
router.put('/phoneNumber',checkAuth, UserPut.PutAllUser);
router.put('/username',checkAuth, UserPut.PutUserUsername);
router.put('/photo',checkAuth, UserPut.PutUserPhoto);
router.put('/state',checkAuth, UserPut.PutUserState);
router.delete('/',checkAuth, UserDelete.DeleteUser);

module.exports = router;
