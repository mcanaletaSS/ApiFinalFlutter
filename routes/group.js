const express = require('express');
const router = express.Router();
const GroupPost = require('../controllers/group/post');
const GroupPut = require('../controllers/group/put');
const GroupDelete = require('../controllers/group/delete');
var checkAuth = require('../middleware/check-auth');

router.post('/:uuid', checkAuth, GroupPost.CreateGroup);
router.delete('/:uuid', checkAuth, GroupDelete.DeleteGroup);
router.put('/:uuid/add', checkAuth, GroupPut.AddUser);
router.put('/:uuid/remove', checkAuth, GroupPut.RemoveUser);
router.put('/:uuid/title', checkAuth, GroupPut.PutGroupTitle);
router.put('/:uuid/description', checkAuth, GroupPut.PutGroupDescription);
router.put('/:uuid/photo', checkAuth, GroupPut.PutGroupPhoto);
module.exports = router;
