const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const { remove } = require('../../models/User');
const User = require('../../models/User');


// @route   POST /api/posts
// @desc    create a post
// @access  private
router.post('/',[auth, [
    check('text', 'Text is required').not().isEmpty()
    ]], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array() });

        }

        try {

            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({

                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id //got error of cannot read property id of undefined because of user.req.id


            });

            const post = await newPost.save();
            res.json(post);
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

}); 


// @route   GET /api/posts
// @desc    Get all posts
// @access  private

router.get('/', auth, async (req,res) => {

try {
    const post = await Post.find().sort({date: -1});
    res.json(post);


    
} catch (err) {
    console.error(err.message);
            res.status(500).send('Server Error');
        }

    });


// @route   GET /api/posts/:id
// @desc    Get post by id
// @access  private

router.get('/:id', auth, async (req,res) => {

    try {
        const postbyid = await Post.findById(req.params.id);//you did not get any post because u did not pass any id in the findbyid function

        if(!postbyid){
            return res.status(404).json({msg: 'post not found'})
        }


        res.json(postbyid);
    
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'post not found'})
        }
                res.status(500).send('Server Error');
            }
    
        });
  
// @route   DELETE /api/posts/:id
// @desc    Delete a post by id
// @access  private

router.delete('/:id', auth, async (req,res) => {

    try {
         const deletepostbyid = await Post.findById(req.params.id);

        if(deletepostbyid.user.toString() != req.user.id){
           return  res.status(401).json({msg: 'not authorised'});

        }

        await deletepostbyid.remove();
        res.json({msg : 'post removed'});
        
    
    
        
    } catch (err) {
        console.error(err.message);
                res.status(500).send('Server Error');
            }
    
        });
    

// @route   PUT /api/likes/:id
// @desc    like a post
// @access  private

router.put('/likes/:id', auth, async (req,res) => {

    const postlike = await Post.findById(req.params.id);

    // to check if the post is already liked by the user
    if(postlike.likes.filter(like => like.user.toString() == req.user.id).length > 0) {
        return res.json(400).json({msg : 'Message already liked'});

    };

    postlike.likes.unshift({user : req.user.id});

    await postlike.save();

    res.json(postlike.likes);



});

// @route   Post /api/comment/:postid
// @desc    add a comment on the post
// @access  private
    
router.post('/comment/:id', [auth, [check('text', 'text is required').not().isEmpty()]], 
async (req,res) => {
    try {

        const error = validationResult(req);
        if(!error.isEmpty){

            return res.status(400).json({error : error.array()});
        }

    const user = await User.findById(req.user.id).select('-password');
    const postcomment = await Post.findById(req.params.id);
    
    const comment = {

        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    };

    postcomment.comments.unshift(comment);

    await postcomment.save();

    res.json(postcomment.comments);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
        
    }





}) ;   
  


module.exports = router;
