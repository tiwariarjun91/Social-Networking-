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


// @route   GET /api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async(req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name','avatar']);
    res.json(profiles);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    
  }
}
);


// @route   GET /api/profile/user/:user_id
// @desc    Get profile by id
// @access  Public
router.get('/user/:user_id', async(req, res) => {
  try {
    const profile = await Profile.findOne({user : req.params.user_id}).populate('user', ['name','avatar']);
    if(!profile) return res.status(400).json({msg : 'Profile not found'});
    res.json(profile);

    
  } catch (err) {
    console.error(err.message);
    if(err.kind == 'ObjectId'){
      return res.status(400).json({msg : 'Profile not found'});


    }
    res.status(500).send('Server Error');
    
  }
}
);


// @route   Delete /api/profile
// @desc    Get profile, user, posts
// @access  Private

router.delete('/', auth,async (req, res) => {

  try {

    // Remove Profile
    await Profile.findOneAndRemove({user : req.user.id});
    // Remove User 
    await User.findOneAndRemove({ _id : req.user.id});
    //to-do delete posts
    res.json({msg : 'User deleted'});


  } catch (error) {
    
  }




});

// @route   Put /api/profile/experiance
// @desc    Create a profile experiance
// @access  Private
router.put('/experience',[auth, [

  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),



]], async(req,res)=>{

  const errors = validationResult(req);
  if(!errors.isEmpty){
    return res.status(400).json({errors : errors.array});
 }

const {
  title,
  company,
  locaion,
  from,
  to,
  current,
  description,
} = req.body;

const newExp = {
  title,
  company,
  locaion,
  from,
  to,
  current,
  description,
};

try {
  const profile = await Profile.findOne({user : req.user.id});

  profile.experience.unshift(newExp);

  await profile.save();
  res.json(profile);
  
} catch (err) {
  console.error(err.message);
  res.status(500).send('Server Error');
  
}



});

// @route   DELETE /api/profile/experiance/ :exp_id
// @desc    DElete experiance from profile
// @access  Private

router.delete('/experience/:exp_id', auth , async (req, res) => {

  try {
  const profile = await Profile.findOne({user : req.user.id});

  //get remove index
  const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

  profile.experience.splice(removeIndex, 1);

  profile.save();

  res.json(profile);

} catch (err ){
  console.error(err.message);
  res.status(500).send('Server Message');


  
}





});


module.exports = router;