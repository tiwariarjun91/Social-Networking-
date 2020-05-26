const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator/check');

const User = require('../../models/User');

// @route   POST /api/users
// @desc    Register user
// @access  public
router.post('/', [

check('name', 'Name is required').not().isEmpty(),
check('email','please enter a valid email').isEmail(),
check('password', 'Please enter a password of minimum length 6').isLength({min:6}),
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
    if(user){
        res.status(400).json({ errors: [{msg : "User already exists"}]});
    }

    // get users gravatar

    const avatar = gravatar.url(email , {
        s : '200',
        //r: pg ,
        //d: mm ,//it showd a server error on postman and on terminal showed pg, mm not defined but as i comment and remove comment it worked fine

    });

    user = new User({
        name,
        email,
        avatar,
        password


    });

    //Encrypt password 
    const salt = await bcrypt.genSalt(10);  

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return json web token


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