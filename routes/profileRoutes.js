// 📂 routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); // Ensure ObjectId is imported if needed
const User = require('../models/User'); // Adjust the path to your User model if necessary

// 📌 Hiển thị trang hồ sơ cá nhân
router.get("/", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }
    res.render("profile", { user: req.session.user });
});

// 📌 Hiển thị trang chỉnh sửa hồ sơ
router.get("/edit", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }
    res.render("editProfile", { user: req.session.user });
});

// 📌 Cập nhật thông tin hồ sơ
router.post('/edit', async (req, res) => {
    const { username, email, phone } = req.body;

    if (!req.session.user) {
        console.error("❌ Session user is not set");
        return res.redirect('/auth/login');
    }

    console.log("Session User:", req.session.user); // Debugging log

    const userId = req.session.user.id; // Use 'id' instead of '_id'

    // Validate userId
    if (!ObjectId.isValid(userId)) {
        console.error("❌ Invalid user ID:", userId);
        return res.status(400).send('Invalid user ID');
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, phone },
            { new: true }
        );

        if (!updatedUser) {
            console.error("❌ User not found with ID:", userId);
            return res.status(404).send('User not found');
        }

        // Update session with the new user data
        req.session.user = updatedUser.toObject();
        res.redirect('/profile');
    } catch (err) {
        console.error("❌ Lỗi khi cập nhật hồ sơ:", err);
        res.status(500).send('Lỗi máy chủ');
    }
});

// 📌 Xem hồ sơ cá nhân
router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    res.render('profile', { user: req.session.user });
});

// 📌 Cập nhật thông tin cơ bản (email, phone)
router.post('/update', async (req, res) => {
    const { email, phone } = req.body;

    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    try {
        const userId = req.session.user._id;

        const result = await User.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { email, phone } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).send('No changes were made');
        }

        // Update lại session
      
        res.redirect('/profile/view');
    } catch (err) {
        console.error("❌ Update failed:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;