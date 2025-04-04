const express = require('express');
const router = express.Router();

// Hiển thị trang kinh nghiệm hay
router.get('/', (req, res) => {
    res.render('chiase', { session: req.session });
});

module.exports = router;