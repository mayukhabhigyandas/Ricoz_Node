const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const { body, validationResult } = require('express-validator');

// Define routes using the user controller
router.post('/', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password').isLength({ min: 8 })
], userController.createUser);

router.get('/getallusers', userController.getAllUsers);
router.get('/getuser/:id', userController.getUserById);
router.put('/updateuser/:id', userController.updateUserById);
router.delete('/deleteuser/:id', userController.deleteUserById);

module.exports = router;
