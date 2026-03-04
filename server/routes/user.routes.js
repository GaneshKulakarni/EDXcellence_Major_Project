const express = require('express');
const router = express.Router();
const { getUserProfile, getInstructors } = require('../controllers/user.controller');

router.get('/instructors', getInstructors);
router.get('/:id', getUserProfile);

module.exports = router;
