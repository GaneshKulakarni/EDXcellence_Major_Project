const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    addToCart,
    getCart,
    removeFromCart,
    clearCart
} = require('../controllers/cart.controller');

// All routes are protected
router.use(protect);

router.post('/add', addToCart);
router.get('/', getCart);
router.delete('/remove/:courseId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;
