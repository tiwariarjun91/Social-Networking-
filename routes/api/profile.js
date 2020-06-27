const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator/check');


const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { findOne } = require('../../models/Profile');


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
      
      //Build Social Object
      profileFields.social = {};
      if(facebook) profileFields.social.facebook = facebook ;
      if(youtube) profileFields.social.youtube = youtube ;
      if(instagram) profileFields.social.instagram = instagram ;
      if(twitter) profileFields.social.twitter = twitter ;
      if(linkedin) profileFields.social.linkedin = linkedin ;



       try{
        let profile = await Profile.findOne({user : req.user.id});

        if(profile){
            //Update
            profile = await Profile.findOneAndUpdate({ user : req.user.id}, { $set : profileFields}, {new : true, upsert : true});

            // return res.json(profile);
            res.send("profile updated") 

        }

            //Create
            profile = new Profile(profileFields);
            
            await profile.save();

           // res.json(profile);
           res.send("profile created");


            // you got error because you used findbyidandupdate instead of findoneand update function 

           /*try {
            // Using upsert option (creates new doc if no match is found):
            let profile = await Profile.findOneAndUpdate(
              { user: req.user.id },
              { $set: profileFields },
              { new: true, upsert: true }
            );
            res.json(profile);*/

      } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
      }
      //console.log(profileFields.skills);
      //res.send("HEllo");


} 


);


module.exports = router;