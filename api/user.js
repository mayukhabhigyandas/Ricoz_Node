const express=require('express');
const router = express.Router();
const User = require('../models/User');
const {body, validationResult} = require('express-validator');

//Create a User: POST
router.post('/',[
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password').isLength({min: 8})
] ,  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
    try {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      res.json(user);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
})

//get all users
router.get('/getallusers', async (req, res) => {
    const users=await User.find();
    res.json(users);
});

//get the user by id
router.get('/getuser/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

//update the user by id
router.put("/updateuser/:id", async (req, res) => {
    const { name, email, password } = req.body;  // Extract data from the request body

    try {
        // Find the user by ID and update it
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,  // Find user by ID
            { name, email, password },  // Fields to update
            { new: true, runValidators: true }  // Options: return updated user, and validate the data
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);  // Return the updated user data
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
  });

  //delete a user by id
  router.delete('/deleteuser/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports=router;