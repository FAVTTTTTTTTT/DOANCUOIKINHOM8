const express = require('express');
const router = express.Router();

// 📌 Hiển thị trang giới thiệu
router.get('/', (req, res) => {
    res.render('about', { session: req.session });
});

module.exports = router;
