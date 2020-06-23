const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const {check, validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');


// @route   GET /api/auth
// @desc    tets route
// @access  public
router.get('/', auth,async (req, res) => {

    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');

 }
});

// @route   POST /api/users
// @desc    Register user
// @access  public
router.post('/', [

    check('email','please enter a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    ],
    
    async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()){
    
    return res.status(400).json({errors: errors.array()});
    
    }
    
    const {name, email, password} = req.body;
    
    try {
    
    
        // to see if user exists
    
        let user = await User.findOne({email});
        if(!user){
            res.status(400).json({ errors: [{msg : "Invalid Credentials"}]});
            //u got an error (server error) because u didtn have ! in the if condition
        }
    
    
       
        const isMatch = await bcrypt.compare(password, user.password);
       
        // Return json web token
        if(!isMatch){
            res.status(400).json({ errors: [{msg : "Invalid Credentials"}]});
        }
    
    
        const payload = {
            user : {
                id : user.id //mongodb uses _id
            }
        }
    
       
    
        jwt.sign(payload, 
            config.get('jwtSecret'),
            {expiresIn : 36000},
            (err, token) => {
                if(err) throw err;
                res.json({token});
            }
        );
    
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    
    }
    }
    
    );


module.exports = router;

