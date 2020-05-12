const express = require('express');
const router = express.Router();

// @route   GET /api/users
// @desc    tets route
// @access  public
router.get('/', (req, res) => res.send('user routes'));


module.exports = router;