const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator/check');


const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route   GET /api/profile/me
// @desc    Get current user profile
// @access  Private
// auth is added as a second parameter to all the routes we want to protect
router.get('/me',auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id}).populate('user', ['name','avatar']);

        if(!profile){

            return res.status(400).json({msg : 'There is no profile for this user'});
        }

        res.json(profile);
    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
}); 

// @route   Post /api/profile
// @desc    Create a new  or update user profile
// @access  Private

router.post('/', [ auth, [
    check('status' , 'Status is required').not().isEmpty(),
    check('skills' , 'Skills is required').not().isEmpty()
    ] 
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array() });
    }

    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
      } = req.body;



      // Build Profile Object  // empty object initially
      const profileFields = {};  
      profileFields.user = req.user.id;
      if(company) profileFields.company = company ;
      if(website) profileFields.website = website ;     
      if(location) profileFields.locaion = location ;     
      if(bio) profileFields.bio = bio ;   
      if(status) profileFields.status = status ;    
      if(githubusername) profileFields.githubusername = githubusername ;   
      if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
      }  
      
      console.log(profileFields.skills);
      res.send("HEllo");


} 


);


module.exports = router;