const express = require('express');
const router = express.Router();

const loginFunction = (req, res) => {
    res.render('login');
}
router.get('/', loginFunction);

module.exports = router;