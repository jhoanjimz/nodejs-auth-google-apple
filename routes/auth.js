const { Router } = require('express');
const { googleAuth, callbackApple, signInWithApple } = require('../controllers/auth');

const router = Router();


router.post('/google', googleAuth);

router.post("/callbacks/sign_in_with_apple", callbackApple);

router.post("/sign_in_with_apple", signInWithApple);

module.exports = router;