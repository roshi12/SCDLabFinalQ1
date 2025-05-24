const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

router.get('/:userId', profileController.getProfile);
router.put('/', auth, profileController.updateProfile);

module.exports = router;
