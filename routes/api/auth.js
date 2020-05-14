const express = require('express');
const router = express.Router();

// @route   GET /api/auth
// @desc    tets route
// @access  public
router.get('/', (req, res) => res.send('auth routes'));


module.exports = router;

